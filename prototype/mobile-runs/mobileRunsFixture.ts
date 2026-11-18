/**
 * The phone's synthetic world as the UI reference reads it: the data lives in
 * `prototype/source-observation/mobile-world.mjs` (shared with the disposable observation node that serves the pinned
 * source for comparison); this module adds the types and the links to the fixture agents.
 *
 * Everything is invented and illustrative; nothing is read from a real node. What is simulated sits under the phone's
 * screens (which are the source's own components): the node's run list and delegation trees (`stores/mobileRunTreeStore.ts`
 * and its stand-ins of the product's run list, run tree and run status stores), the answer of an opened run
 * (`withMobileRuns`, answered like every other stored run), and the peers the paired node knows.
 */
import { exposedFixtures } from '~/prototype/source-observation/fixtures.mjs'
import {
  MOBILE_RUNS, PEERS, UNREACHABLE_NODES, RICH_RUN_ID, flattenRuns, worldNode, isWorldRunId,
  projectionEntriesFor, richConversation, teamResumeConfigFor, teamOfMember, activitiesFor, backgroundTasksFor, backgroundTasksRunningOf, participantMessagesFor, referenceText, searchFilePaths, fileChangesFor, WORKSPACE_FILES,
} from '~/prototype/source-observation/mobile-world.mjs'

export type MobileRunStatus = 'running' | 'idle' | 'initializing' | 'error' | 'offline'
export type MobileRunKind = 'agent' | 'team' | 'org' | 'member'
export type MobileRunNode = {
  id: string
  kind: MobileRunKind
  name: string
  summary: string
  status: MobileRunStatus
  minutes: number
  node?: string
  children?: MobileRunNode[]
}
export type MobilePeer = { name: string; reachable: boolean; agents: number; teams: number }

export { MOBILE_RUNS, PEERS, UNREACHABLE_NODES, RICH_RUN_ID, WORKSPACE_FILES, referenceText }
export const flattenRunIds = flattenRuns as (nodes: MobileRunNode[]) => MobileRunNode[]
export const isMobileRunId = isWorldRunId as (id: unknown) => boolean
export const mobileRunNode = worldNode as (id: unknown) => MobileRunNode | null

/** The fixture agent a run's name stands for (the definition the run was started from). */
export const agentDefinitionIdFor = (name: string): string => {
  const fixtures = exposedFixtures as Record<string, any>
  if (name === 'Project Task Manager') return 'project-task-manager'
  if (name === 'Daily Assistant') return String(fixtures.dailyAssistant?.id ?? 'agent-researcher')
  return 'agent-researcher'
}

/** Answers an opened run like a stored run; other operations pass through unchanged. */
export const withMobileRuns = (name: string, variables: Record<string, any>, data: any): any => {
  if (name === 'SearchFiles') return { ...(data ?? {}), searchFiles: searchFilePaths(variables.query) }
  const node = worldNode(variables.runId ?? variables.agentRunId ?? variables.teamRunId)
  if (!node) return data
  data = data ?? {}
  const at = Date.now() - node.minutes * 60_000
  if (name === 'GetRunProjection' && data.getRunProjection) {
    data.getRunProjection = { ...data.getRunProjection, runId: node.id, summary: node.summary, lastActivityAt: new Date(at).toISOString(), conversation: projectionEntriesFor(node, at), activities: activitiesFor(node, at) }
  }
  if (name === 'GetAgentRunResumeConfig' && data.getAgentRunResumeConfig) {
    data.getAgentRunResumeConfig = {
      ...data.getAgentRunResumeConfig, runId: node.id, isActive: false,
      metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: agentDefinitionIdFor(node.name) },
    }
  }
  if (name === 'GetRunFileChanges' && fileChangesFor(node, 0).length) data.getRunFileChanges = fileChangesFor(node, at)
  if (name === 'GetTeamRunResumeConfig' && (node.kind === 'team' || node.kind === 'org')) {
    const config = teamResumeConfigFor(node, at)
    // The baseline's retained contracts still carry a Team's task executions (the pinned source's no longer do).
    config.executionTree.root_team.task_executions = []
    data.getTeamRunResumeConfig = config
  }
  if (name === 'GetTeamMemberRunProjection' && node.kind === 'member') {
    data.getTeamMemberRunProjection = { ...(data.getTeamMemberRunProjection ?? {}), agentRunId: node.id, summary: node.name, lastActivityAt: new Date(at).toISOString(), conversation: projectionEntriesFor(node, at), activities: activitiesFor(node, at), hasEarlierActiveTraceEvents: false }
  }
  if (name === 'AgentBackgroundTaskView') {
    data.agentBackgroundTaskView = { __typename: 'AgentBackgroundTaskEventStream', agentRunId: node.id, currentTasks: backgroundTasksFor(node, at) }
  }
  return data
}

export { teamOfMember }
/** An agent's running background tasks, as its status carries them (autobyteus-448); 0 for a stopped run. */
export const backgroundTasksRunningOfRun = backgroundTasksRunningOf as (node: MobileRunNode | null) => number

export const conversationOf = (runId: string): any | null => {
  const node = worldNode(runId)
  if (!node || node.id !== RICH_RUN_ID) return null
  return richConversation(node.id, Date.now() - node.minutes * 60_000)
}
export const activitiesOf = (runId: string): Array<Record<string, any>> => {
  const node = worldNode(runId)
  return node ? activitiesFor(node, Date.now() - node.minutes * 60_000) : []
}
/** The stored messages of one participant (the node's `collaborationParticipantMessages` answer). */
export const participantMessagesOf = (runId: string): { messages: Array<Record<string, any>>; pastParticipants: Array<Record<string, any>> } => {
  const node = worldNode(runId)
  return node ? participantMessagesFor(node, Date.now() - node.minutes * 60_000) : { messages: [], pastParticipants: [] }
}
