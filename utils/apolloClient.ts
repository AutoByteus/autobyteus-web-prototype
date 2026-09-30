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
import { operationFixture, baseState } from '~/prototype/source-observation/fixtures.mjs'

type OperationRequest = { query?: any, mutation?: any, variables?: Record<string, unknown> }

const queryOperationNameOf = (document: any): string | null => {
  const definition = document?.definitions?.find((entry: any) => entry.kind === 'OperationDefinition')
  return definition?.operation === 'query' ? definition?.name?.value ?? null : null
}

// Mirrors the observation node: once a TeamRun is created in this browser
// context, later history reads list it as active.
let launchedTeamRun = false

const localScenario = (): string => {
  try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated' } catch { return 'populated' }
}

const resolveLocally = async (request: OperationRequest = {}) => {
  const name = queryOperationNameOf(request.query)
  if (!name) return { data: {} }
  // Mirror the observation node's deterministic failure/latency scenarios.
  const scenario = localScenario()
  if (scenario === 'loading') await new Promise(done => setTimeout(done, 1500))
  if (scenario === 'error') return { data: null, errors: [{ message: 'Synthetic recoverable GraphQL failure.' }] }
  if (scenario === 'permission_denied') return { data: null, errors: [{ message: 'Synthetic permission denied.' }] }
  const state = { ...baseState(), scenario: localScenario(), launchedTeamRun }
  const data = operationFixture(name, request.variables || {}, state)
  return { data: data ? structuredClone(data) : {} }
}

const emptyResult = async () => ({ data: {} })

// Launch mutations that the retained source launch flow awaits before
// hydrating the created run. They return a deterministic synthetic run ID;
// nothing is started. PrepareAgentRun backs the Chat first send (57df63f).
const LOCAL_LAUNCH_MUTATIONS = new Set(['CreateAgentTeamRun', 'PrepareAgentRun'])

const resolveMutationLocally = async (request: OperationRequest = {}) => {
  const definition = request.mutation?.definitions?.find((entry: any) => entry.kind === 'OperationDefinition')
  const name = definition?.name?.value
  if (!name || !LOCAL_LAUNCH_MUTATIONS.has(name)) return { data: {} }
  if (name === 'CreateAgentTeamRun') launchedTeamRun = true
  const data = operationFixture(name, request.variables || {}, { ...baseState(), scenario: localScenario() })
  return { data: data ? structuredClone(data) : {} }
}

export const getApolloClient = (_clientId = 'default') => ({
  query: resolveLocally,
  mutate: resolveMutationLocally,
  subscribe: () => ({ subscribe: () => ({ unsubscribe: () => undefined }) }),
  clearStore: async () => undefined,
  resetStore: async () => undefined,
})
