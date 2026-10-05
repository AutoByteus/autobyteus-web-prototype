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
import { operationFixture, baseState, PROJECT_MUTATIONS, SKILL_SOURCE_MUTATIONS } from '~/prototype/source-observation/fixtures.mjs'
import { withAutobyteusOrgOperation } from '~/prototype/run-settings/autobyteusOrgFixture'

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
  }
  localFixtureState.scenario = scenario
  return localFixtureState
}

const resolveLocally = async (request: OperationRequest = {}) => {
  const name = queryOperationNameOf(request.query)
  if (!name) return { data: {} }
  // Mirror the observation node's deterministic failure/latency scenarios.
  const scenario = localScenario()
  if (scenario === 'loading') await new Promise(done => setTimeout(done, 1500))
  if (scenario === 'error') return { data: null, errors: [{ message: 'Synthetic recoverable GraphQL failure.' }] }
  if (scenario === 'permission_denied') return { data: null, errors: [{ message: 'Synthetic permission denied.' }] }
  const fixture = operationFixture(name, request.variables || {}, fixtureState())
  // run-settings-ui-unification: the real AutoByteus Org shape joins the populated catalog.
  const data = scenario === 'populated' ? withAutobyteusOrgOperation(name, request.variables || {}, fixture) : fixture
  return { data: data ? structuredClone(data) : {} }
}

// Mutations whose results the retained source flows await. They return
// deterministic synthetic results; nothing is started or persisted.
// PrepareAgentRun backs the Chat first send (57df63f); CreateWorkspace and the
// Project/Task mutations back the Projects pages (0a32261); the skill-source
// mutations back the Skill Sources dialog (4dee901).
const LOCAL_MUTATIONS = new Set(['CreateAgentTeamRun', 'PrepareAgentRun', 'CreateWorkspace', ...PROJECT_MUTATIONS, ...SKILL_SOURCE_MUTATIONS])

const resolveMutationLocally = async (request: OperationRequest = {}) => {
  const definition = request.mutation?.definitions?.find((entry: any) => entry.kind === 'OperationDefinition')
  const name = definition?.name?.value
  if (!name || !LOCAL_MUTATIONS.has(name)) return { data: {} }
  const state = fixtureState()
  if (name === 'CreateAgentTeamRun') state.launchedTeamRun = true
  const data = operationFixture(name, request.variables || {}, state)
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
