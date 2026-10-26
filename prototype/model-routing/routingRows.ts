/**
 * delegated-runtime-model-routing (design-only): lays the Model Router's decisions over a run's delegated-copy rows, and adds the
 * rows of copies another node runs. The product records the router as an origin of its own on each copy and returns the
 * peer node's launches; the UI reference reads them from its decision records.
 */
import { memberNode, type RunMemberNode, type RunMemberLaunchSource, type RunMemberTreeDeps } from '~/utils/runSettings/runMemberTree'
import { MEMBER_RUN_SETTING_FIELDS } from '~/types/runSettings/RunSettings'
import { routing } from './modelRoutingState'
import type { RoutingChoice, RoutingDelegation } from './modelRoutingData'

const SOURCE_OF: Record<RoutingChoice['source'], RunMemberLaunchSource> = {
  router: 'model_router', agent_default: 'agent_default', team_default: 'team_default', inherited: 'inherited',
}
const LOCKED = { runtime: true, model: true, thinking: true, approval: true, workspace: true } as const

const agentRunIdOf = (key: string): string => key.slice(key.indexOf('@') + 1)

const decisionByAgentRunId = (): Map<string, { delegation: RoutingDelegation; choice: RoutingChoice }> => {
  const map = new Map<string, { delegation: RoutingDelegation; choice: RoutingChoice }>()
  for (const delegation of routing.delegations) for (const choice of delegation.choices) if (choice.agentRunId) map.set(choice.agentRunId, { delegation, choice })
  return map
}

const overlay = (node: RunMemberNode, decisions: ReturnType<typeof decisionByAgentRunId>): RunMemberNode => {
  const found = node.kind === 'agent' ? decisions.get(agentRunIdOf(node.key)) : undefined
  const children = node.children.map((child) => overlay(child, decisions))
  if (!found) return children.some((child, index) => child !== node.children[index]) ? Object.freeze({ ...node, children: Object.freeze(children) }) : node
  const { delegation, choice } = found
  return Object.freeze({
    ...node,
    sourceKey: SOURCE_OF[choice.source],
    ...(choice.source === 'router' ? { routing: { decisionId: delegation.id, taskKind: choice.kind, reason: choice.reason } } : {}),
    children: Object.freeze(children),
  })
}

const RUNTIME_KIND: Record<string, string> = { codex_app_server: 'codex_app_server', claude_agent_sdk: 'claude_agent_sdk', antigravity_cli: 'antigravity_cli', autobyteus: 'autobyteus' }

/** The rows of the copies another node runs: the node's own router chose their launches; this node shows them. */
const remoteRows = (hostRunId: string, template: RunMemberNode | undefined, deps: RunMemberTreeDeps): RunMemberNode[] => {
  if (!template) return []
  const rows: RunMemberNode[] = []
  for (const delegation of routing.delegations) {
    if (!delegation.node || delegation.delegatorRunId !== hostRunId) continue
    const agentRows = delegation.choices.map((choice) => {
      const values = { ...template.values, runtimeKind: RUNTIME_KIND[choice.runtime] ?? choice.runtime, llmModelIdentifier: choice.model, llmConfig: null, autoExecuteTools: true }
      const node = memberNode({
        key: `${delegation.targetAddress}/${choice.agent}@remote-${delegation.id}-${choice.agent}`, kind: 'agent', name: choice.agent.replace(/_/g, ' '),
        values, parentValues: values, fields: MEMBER_RUN_SETTING_FIELDS, locked: LOCKED,
        launch: { badge: 'delegated_copy', sourceKey: SOURCE_OF[choice.source], notes: [] },
      }, deps)
      return Object.freeze({
        ...node, remoteNode: delegation.node!,
        ...(choice.source === 'router' ? { routing: { decisionId: delegation.id, taskKind: choice.kind, reason: choice.reason } } : {}),
      }) as RunMemberNode
    })
    if (delegation.choices.length === 1) { rows.push(agentRows[0]); continue }
    const values = { ...template.values, autoExecuteTools: true }
    const team = memberNode({
      key: `${delegation.targetAddress}@remote-${delegation.id}`, kind: 'team', name: delegation.targetName,
      values, parentValues: values, fields: MEMBER_RUN_SETTING_FIELDS, locked: LOCKED, children: agentRows,
      launch: { badge: 'delegated_copy', notes: [] },
    }, deps)
    rows.push(Object.freeze({ ...team, remoteNode: delegation.node! }) as RunMemberNode)
  }
  return rows
}

export const withRoutingRows = (hostRunId: string | null, rows: readonly RunMemberNode[], deps: RunMemberTreeDeps): readonly RunMemberNode[] => {
  if (!rows.length && !hostRunId) return rows
  const decisions = decisionByAgentRunId()
  const overlaid = rows.map((row) => overlay(row, decisions))
  const firstAgent = (nodes: readonly RunMemberNode[]): RunMemberNode | undefined => {
    for (const node of nodes) { if (node.kind === 'agent') return node; const inner = firstAgent(node.children); if (inner) return inner }
    return undefined
  }
  return hostRunId ? [...overlaid, ...remoteRows(hostRunId, firstAgent(rows), deps)] : overlaid
}
