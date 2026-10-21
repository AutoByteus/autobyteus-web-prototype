/**
 * Prototype-only compatibility adapter.
 *
 * Presentation-facing stores are hydrated and most integration actions are
 * replaced by plugins/00.prototype-state.client.ts. Retained source services
 * and composables that read directly through this helper (opening a stored
 * run, model descriptors, Agent Org references, and similar) receive their
 * GraphQL query results locally from the same deterministic synthetic fixtures
 * used for source observation, so the visible result matches the pinned
 * source without an Apollo client, schema, or network boundary. Mutations and
 * subscriptions stay inert.
 */
import { NODE_SETTINGS_MUTATIONS } from '~/prototype/source-observation/node-settings-fixtures.mjs'
import { EMBEDDING_MUTATIONS } from '~/prototype/source-observation/embedding-fixtures.mjs'
import { operationFixture, baseState, DELEGATED_MUTATIONS, PROJECT_MUTATIONS, SKILL_SOURCE_MUTATIONS } from '~/prototype/source-observation/fixtures.mjs'
import { recordTeamLaunch, withLaunchedTeam } from '~/prototype/run-settings/launchedTeamFixture'
import { recordOrgLaunch, recordOrgTermination, withLaunchedOrg } from '~/prototype/run-settings/launchedOrgFixture'
import { withAgentReconnect } from '~/prototype/agent-reconnect/agentReconnectFixture'
import { designOnlyLayersEnabled } from '~/prototype/shared/design-only-layers'
import { seedDelegatedCopyTasks, withDelegatedCopyTasks } from '~/prototype/delegated-copy-tasks/delegatedCopyTasksFixture'
import { seedTaskKeys } from '~/prototype/task-keys/taskKeysFixture'
import { seedTaskParts } from '~/prototype/task-part-of/taskPartOfFixture'
import { designSkillSourceData, designRegistryError, designSkillSourceMutation } from '~/prototype/skill-sources/skillSourcesDesignFixture'

type OperationRequest = { query?: any, mutation?: any, variables?: Record<string, unknown> }

const queryOperationNameOf = (document: any): string | null => {
  const definition = document?.definitions?.find((entry: any) => entry.kind === 'OperationDefinition')
  return definition?.operation === 'query' ? definition?.name?.value ?? null : null
}

const localScenario = (): string => {
  try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated' } catch { return 'populated' }
}

// One browser context's fixture state, mirroring the observation node's
// in-memory state: a created TeamRun is listed as active in later history
// reads, and Project/Task saves update a small in-memory copy (0a32261).
// A page reload resets it.
export const localFixtureState: Record<string, any> = { ...baseState(), launchedTeamRun: false }
let localStateScenario = ''
const fixtureState = (): Record<string, any> => {
  const scenario = localScenario()
  if (scenario !== localStateScenario) {
    localStateScenario = scenario
    localFixtureState.projectData = null
    localFixtureState.skillSourceData = null
    localFixtureState.taskContextFiles = {}
    localFixtureState.archivedAgentGroup = false
    localFixtureState.delegatedSelections = null
    localFixtureState.embedding = null
    localFixtureState.nodeSettings = null
    // skill-sources-dialog-redesign (design-only): representative skill sources for the redesigned dialog.
    if (designOnlyLayersEnabled()) localFixtureState.skillSourceData = designSkillSourceData(scenario)
  }
  localFixtureState.scenario = scenario
  // delegated-copy-task-locator (design-only): the Project Task Manager run's Tasks.
  if (designOnlyLayersEnabled()) seedDelegatedCopyTasks(localFixtureState, scenario)
  // task-keys-and-dependencies (design-only): Task keys and "depends on" for the example Projects.
  if (designOnlyLayersEnabled()) { seedTaskKeys(localFixtureState, scenario); seedTaskParts(localFixtureState, scenario) }
  return localFixtureState
}

// WEB-BASELINE-REFRESH-009: a local answer arrives on a later task, as a network response does, so the
// source's busy states (a disabled Reload button, a disabled add input) render before the answer and
// focus moves exactly as in the source (3fb98d2, f7fcf90).
const nextTask = () => new Promise<void>(done => setTimeout(done, 0))

const resolveLocally = async (request: OperationRequest = {}) => {
  const name = queryOperationNameOf(request.query)
  if (!name) return { data: {} }
  await nextTask()
  // Mirror the observation node's deterministic failure/latency scenarios.
  const scenario = localScenario()
  if (scenario === 'loading') await new Promise(done => setTimeout(done, 1500))
  if (scenario === 'error') return { data: null, errors: [{ message: 'Synthetic recoverable GraphQL failure.' }] }
  if (scenario === 'permission_denied') return { data: null, errors: [{ message: 'Synthetic permission denied.' }] }
  const state = fixtureState()
  let data = operationFixture(name, request.variables || {}, state)
  // run-settings-ui-unification: a Team launched from New chat opens its own run, whichever Team it is.
  if (state.launchedTeamRun) {
    const catalog = (operation: string, key: string) =>
      (operationFixture(operation, {}, state)?.[key] ?? []) as any[]
    data = withLaunchedTeam(name, request.variables || {}, data, {
      teams: catalog('GetAgentTeamDefinitions', 'agentTeamDefinitions'),
      agents: catalog('GetAgentDefinitions', 'agentDefinitions'),
    })
  }
  // run-settings-ui-unification (SR-003): "Run Agent Org" opens the launched Org run, whichever Org it is.
  data = withLaunchedOrg(name, request.variables || {}, data, () => {
    const catalog = (operation: string, key: string) =>
      (operationFixture(operation, {}, state)?.[key] ?? []) as any[]
    return { orgs: catalog('GetAgentOrgDefinitions', 'agentOrgDefinitions'), teams: catalog('GetAgentTeamDefinitions', 'agentTeamDefinitions') }
  })
  // agent-definition-reconnect-ui (design-only): runs whose agent folder was renamed, and the Video Team run.
  if (designOnlyLayersEnabled()) data = data ? withAgentReconnect(name, request.variables || {}, structuredClone(data), scenario) : data
  // delegated-copy-task-locator (design-only): a Project Task Manager run with look-alike delegated copies.
  if (designOnlyLayersEnabled()) data = data ? withDelegatedCopyTasks(name, request.variables || {}, structuredClone(data), scenario) : data
  // skill-sources-dialog-redesign (design-only): the registry-error scenario.
  if (designOnlyLayersEnabled() && name === 'GetSkillSources' && data) data = { ...data, skillSourceRegistryError: designRegistryError(scenario) ?? data.skillSourceRegistryError }
  // WEB-BASELINE-REFRESH-011: a scripted read failure (for example the Embedding status) answers as GraphQL errors.
  if (data?.__projectError) return { data: null, errors: [data.__projectError] }
  return { data: data ? structuredClone(data) : {} }
}

// Mutations whose results the retained source flows await. They return
// deterministic synthetic results; nothing is started or persisted.
// PrepareAgentRun backs the Chat first send (57df63f); CreateWorkspace and the
// Project/Task mutations back the Projects pages (0a32261); the skill-source
// mutations back the Skill Sources dialog (4dee901); ReloadAgentPackageDefinitions backs the
// Agents, Teams and Orgs Reload buttons (f7fcf90).
const LOCAL_MUTATIONS = new Set([...EMBEDDING_MUTATIONS, ...NODE_SETTINGS_MUTATIONS, ...DELEGATED_MUTATIONS, 'ReloadAgentPackageDefinitions', 'ArchiveStoredAgentRunGroup', 'CreateAgentTeamRun', 'CreateAgentOrgRun', 'TerminateAgentOrgRun', 'PrepareAgentRun', 'CreateWorkspace', 'ImportMcpServerConfigs', ...PROJECT_MUTATIONS, ...SKILL_SOURCE_MUTATIONS])

const resolveMutationLocally = async (request: OperationRequest = {}) => {
  const definition = request.mutation?.definitions?.find((entry: any) => entry.kind === 'OperationDefinition')
  const name = definition?.name?.value
  if (!name || !LOCAL_MUTATIONS.has(name)) return { data: {} }
  // WEB-BASELINE-REFRESH-010: a mutation answers after a network-like delay (longer than a rendering frame),
  // like the replaced store actions, so a control disabled while it waits loses focus as in the source.
  await new Promise<void>(done => setTimeout(done, 40))
  const state = fixtureState()
  if (name === 'CreateAgentOrgRun') return { data: recordOrgLaunch(request.variables || {}) }
  if (name === 'TerminateAgentOrgRun') return { data: recordOrgTermination(request.variables || {}) }
  // skill-sources-dialog-redesign (design-only): timed, scripted skill-source outcomes.
  if (designOnlyLayersEnabled()) {
    const scripted = await designSkillSourceMutation(name, request.variables || {}, state)
    if (scripted) return scripted
  }
  let data = operationFixture(name, request.variables || {}, state)
  // run-settings-ui-unification: each Team launch is its own run (launchedTeamFixture.ts).
  if (name === 'CreateAgentTeamRun') { state.launchedTeamRun = true; data = recordTeamLaunch(request.variables || {}, data) }
  if (data?.__projectError) return { data: null, errors: [data.__projectError] }
  return { data: data ? structuredClone(data) : {} }
}

export const getApolloClient = (_clientId = 'default') => ({
  query: resolveLocally,
  mutate: resolveMutationLocally,
  subscribe: () => ({ subscribe: () => ({ unsubscribe: () => undefined }) }),
  clearStore: async () => undefined,
  resetStore: async () => undefined,
})
