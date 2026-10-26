/**
 * delegated-runtime-model-routing (design-only): the Model Routing page's state, in the browser's memory.
 * In the product the node holds this (server settings, the decision records, the knowledge note); here a
 * reload resets it to the scenario. Nothing is persisted and nothing is sent anywhere.
 */
import { reactive, computed } from 'vue'
import type { AvailableAgentRuntimesReport, AvailableAgentRuntimeEntry, ExternalAgentRuntimeEntry, AvailableModel } from '~/types/availableAgentRuntimes'
import {
  ANCHOR_MS, RUNTIME_NAMES, scenarioFor, incomingDelegations,
  type KnowledgeVersion, type RoutingChoice, type RoutingDelegation, type RoutingSource,
} from './modelRoutingData'

export const routingScenarioName = (): string => {
  try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated' } catch { return 'populated' }
}

const peerWindow = (): boolean => { try { return localStorage.getItem('autobyteus.prototype.context') === 'electron_external' } catch { return false } }
// A peer node's window shows that node's own page: what other nodes delegated to it (its router chose).
const seed = peerWindow() ? { ...scenarioFor('routing_on_empty'), delegations: incomingDelegations(), knowledge: scenarioFor('populated').knowledge } : scenarioFor(routingScenarioName())

export const routing = reactive({
  enabled: seed.enabled,
  router: seed.router ? { ...seed.router } : null as { runtime: string; model: string } | null,
  /** This node's decisions: copies its own router chose for. */
  delegations: seed.delegations.filter((item) => !item.node) as RoutingDelegation[],
  /** Copies this node's runs delegated to other nodes: the other node's router chose; only the run's Settings rows show them. */
  remoteCopies: seed.delegations.filter((item) => item.node) as RoutingDelegation[],
  knowledge: seed.knowledge ? { current: { ...seed.knowledge.current }, previous: seed.knowledge.previous ? { ...seed.knowledge.previous } : null } : null as { current: KnowledgeVersion; previous: KnowledgeVersion | null } | null,
  /** A decision the user came to from a run (highlighted in the list). */
  focusDecisionId: null as string | null,
})

export const setEnabled = (value: boolean): void => { routing.enabled = value }
export const setRouter = (runtime: string, model: string): void => { routing.router = runtime ? { runtime, model } : null }

export const saveKnowledge = (text: string): void => {
  const previous = routing.knowledge?.current ?? null
  routing.knowledge = { current: { text, at: ANCHOR_MS + 5 * 60_000, by: 'user' }, previous }
}
/** Undo swaps the current and the previous note: a second Undo brings the newer one back. */
export const undoKnowledge = (): void => {
  const state = routing.knowledge
  if (!state?.previous) return
  routing.knowledge = { current: state.previous, previous: state.current }
}

// --- the router's status, from the node's runtime report -------------------------------------------------------

export type RouterStatus =
  | { kind: 'off' }
  | { kind: 'not_set' }
  | { kind: 'active'; runtimeName: string; model: string }
  | { kind: 'blocked'; runtimeName: string; model: string; until: string | null; by: string }
  | { kind: 'model_missing'; runtimeName: string; model: string }
  | { kind: 'runtime_missing'; runtimeName: string }
  | { kind: 'unknown'; runtimeName: string; reason: string }

export const modelsOf = (entry: AvailableAgentRuntimeEntry | undefined): AvailableModel[] | string => {
  if (!entry) return []
  if (entry.runtime === 'autobyteus') return entry.providers.flatMap((provider) => Array.isArray(provider.models) ? provider.models : [])
  return (entry as ExternalAgentRuntimeEntry).models
}

export const routerStatusOf = (report: AvailableAgentRuntimesReport | null, state = routing): RouterStatus => {
  if (!state.enabled) return { kind: 'off' }
  if (!state.router) return { kind: 'not_set' }
  const runtimeName = RUNTIME_NAMES[state.router.runtime] ?? state.router.runtime
  if (!report) return { kind: 'active', runtimeName, model: state.router.model }
  const entry = report.agentRuntimes.find((item) => item.runtime === state.router!.runtime)
  if (!entry) return { kind: 'runtime_missing', runtimeName }
  const models = modelsOf(entry)
  if (typeof models === 'string') return { kind: 'unknown', runtimeName, reason: models.replace(/^unknown: /, '') }
  const model = models.find((item) => item.id === state.router!.model)
  if (!model) return { kind: 'model_missing', runtimeName, model: state.router.model }
  if (model.blocked) return { kind: 'blocked', runtimeName, model: model.id, until: model.blocked.until, by: model.blocked.by }
  return { kind: 'active', runtimeName, model: model.id }
}

// --- decisions and statistics ----------------------------------------------------------------------------------

export type Period = '7d' | '30d' | 'all'
const PERIOD_MS: Record<Period, number> = { '7d': 7 * 86_400_000, '30d': 30 * 86_400_000, all: Number.POSITIVE_INFINITY }

export const delegationsIn = (period: Period): RoutingDelegation[] =>
  routing.delegations.filter((item) => ANCHOR_MS - item.at <= PERIOD_MS[period])

export type KindStat = Readonly<{
  kind: string
  total: number
  /** Runtime → count, biggest first. */
  runtimes: ReadonlyArray<Readonly<{ runtime: string; name: string; count: number; models: ReadonlyArray<Readonly<{ model: string; count: number }>> }>>
  routed: number
}>

export type Overview = Readonly<{
  total: number
  bySource: Readonly<Record<RoutingSource, number>>
  failures: number
  kinds: readonly KindStat[]
}>

/** Per task kind: which runtimes/models were used and how often. Agents with no kind (defaults without a router decision) count under "No task kind". */
export const NO_KIND = ''
export const overviewFor = (period: Period): Overview => {
  const bySource: Record<RoutingSource, number> = { router: 0, agent_default: 0, team_default: 0, inherited: 0 }
  const kinds = new Map<string, { total: number; routed: number; runtimes: Map<string, { count: number; models: Map<string, number> }> }>()
  let total = 0
  let failures = 0
  for (const delegation of delegationsIn(period)) {
    if (delegation.failure) failures += 1
    for (const choice of delegation.choices) {
      total += 1
      bySource[choice.source] += 1
      const key = choice.kind ?? NO_KIND
      const kind = kinds.get(key) ?? { total: 0, routed: 0, runtimes: new Map() }
      kind.total += 1
      if (choice.source === 'router') kind.routed += 1
      const runtime = kind.runtimes.get(choice.runtime) ?? { count: 0, models: new Map() }
      runtime.count += 1
      runtime.models.set(choice.model, (runtime.models.get(choice.model) ?? 0) + 1)
      kind.runtimes.set(choice.runtime, runtime)
      kinds.set(key, kind)
    }
  }
  const list: KindStat[] = [...kinds.entries()]
    .sort((a, b) => (a[0] === NO_KIND ? 1 : b[0] === NO_KIND ? -1 : b[1].total - a[1].total))
    .map(([kind, value]) => ({
      kind, total: value.total, routed: value.routed,
      runtimes: [...value.runtimes.entries()].sort((a, b) => b[1].count - a[1].count)
        .map(([runtime, item]) => ({ runtime, name: RUNTIME_NAMES[runtime] ?? runtime, count: item.count,
          models: [...item.models.entries()].sort((a, b) => b[1] - a[1]).map(([model, count]) => ({ model, count })) })),
    }))
  return { total, bySource, failures, kinds: list }
}

export const decisionOfRun = (agentRunId: string): { delegation: RoutingDelegation; choice: RoutingChoice } | null => {
  for (const delegation of routing.delegations) {
    const choice = delegation.choices.find((item) => item.agentRunId === agentRunId)
    if (choice) return { delegation, choice }
  }
  return null
}

export const anchorNow = (): number => ANCHOR_MS
export const hasHistory = computed(() => routing.delegations.length > 0)
