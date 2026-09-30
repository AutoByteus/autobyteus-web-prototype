/**
 * Which live run the composer belongs to, for `@` mentions (cross-scope-agent-mentions):
 * a standalone Team run, an Org run, or a standalone Agent run.
 */
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore'
import { useAgentOrgContextsStore } from '~/stores/agentOrgContextsStore'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { collectConfiguredAgents, collectConfiguredTeams } from '~/services/teamExecution/teamExecutionTreeSelectors'
import { DRAFT_RUN_ID_PREFIX } from '~/utils/runTreeProjectionConstants'
import { addedCollaborators, agentRunScope } from './runMentionState'

export type RunMentionScopeKind = 'team' | 'org' | 'agent'
export interface RunMentionScope {
  kind: RunMentionScopeKind
  rootRunId: string
  /** The AgentRun the user is talking to; it receives the message. */
  focusedRunId: string
  focusedName: string
  /** Definition keys already reachable in this run. */
  inRunKeys: ReadonlySet<string>
}

const nameAt = (address: string): string => address.split('/').filter(Boolean).at(-1)?.replace(/[_-]+/g, ' ') ?? address

/** The standalone Agent run (not a launch draft) whose conversation is open, if any. */
export const selectedStandaloneAgentRun = () => {
  const root = useAgentContextsStore().activeRun
  return root && !root.state.runId.startsWith(DRAFT_RUN_ID_PREFIX) ? root : null
}

export const resolveRunMentionScope = (): RunMentionScope | null => {
  const target = useActiveContextStore().activeWorkspaceTarget
  if (!target || target.access !== 'live') return null
  const keys = new Set<string>()
  const withAdded = (rootRunId: string) => {
    addedCollaborators(rootRunId).forEach((entry) => keys.add(entry.definitionKey))
    return keys
  }
  if (target.kind === 'standalone_team_member') {
    const view = useAgentTeamContextsStore().activeTeamContext?.view
    if (!view) return null
    const tree = view.getExecutionTree()
    keys.add(`team:${tree.root_team.team_definition_id}`)
    collectConfiguredAgents(tree).forEach((agent) => keys.add(`agent:${agent.agent_definition_id}`))
    collectConfiguredTeams(tree).forEach((team) => keys.add(`team:${team.team_definition_id}`))
    const rootRunId = view.getRootTeamRunId()
    return { kind: 'team', rootRunId, focusedRunId: target.context.state.runId,
      focusedName: nameAt(view.getFocusedMemberAddress()), inRunKeys: withAdded(rootRunId) }
  }
  if ('root' in target) {
    const rootRunId = target.root.orgRunId
    const org = useAgentOrgContextsStore().contextFor(rootRunId)
    if (!org) return null
    for (const member of org.executionTree.rootOrg.members) {
      if ('agentRunId' in member) keys.add(`agent:${member.agentDefinitionId}`)
      else {
        keys.add(`team:${member.teamDefinitionId}`)
        member.members.forEach((agent) => keys.add(`agent:${agent.agentDefinitionId}`))
      }
    }
    return { kind: 'org', rootRunId, focusedRunId: target.context.state.runId,
      focusedName: nameAt(target.address), inRunKeys: withAdded(rootRunId) }
  }
  if (target.kind === 'standalone_agent') {
    const root = selectedStandaloneAgentRun()
    if (!root) return null
    const rootRunId = root.state.runId
    keys.add(`agent:${root.config.agentDefinitionId}`)
    const scope = agentRunScope(rootRunId)
    const child = scope?.focusedRunId ? scope.children.get(scope.focusedRunId) : null
    return { kind: 'agent', rootRunId, focusedRunId: target.context.state.runId,
      focusedName: child ? nameAt(child.address) : (root.config.agentDefinitionName || 'This agent'),
      inRunKeys: withAdded(rootRunId) }
  }
  return null
}
