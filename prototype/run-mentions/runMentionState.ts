/**
 * Prototype-native state for the `cross-scope-agent-mentions` ticket.
 *
 * A live run can grow: an `@`-mentioned shared Agent or Team is brought into the
 * current run as a collaborator. This module holds the browser-local record of
 * which collaborators were added to which run, the mentions chosen in each
 * composer, and the visible notices. It is a plain reactive module (not a Pinia
 * store) so the prototype action interceptor never replaces it. Nothing here is
 * a production contract.
 */
import { reactive } from 'vue'
import type { AgentLaunchConfigurationDto } from '@autobyteus/team-stream-contracts'

export type RunMentionKind = 'agent' | 'team'

export interface RunMentionDefinition {
  /** `${kind}:${id}` */
  key: string
  kind: RunMentionKind
  id: string
  name: string
  description: string
  /** Team members (teams only); the first one is the coordinator. */
  members: readonly { name: string; agentDefinitionId: string }[]
  /** Synthetic reason this definition cannot run with a host run's settings (SC-006). */
  unrunnableReason: string | null
}

export interface AddedCollaborator {
  definitionKey: string
  kind: RunMentionKind
  name: string
  /** Rooted address inside the host run, e.g. `/product team`. */
  address: string
  teamRunId: string | null
  agentRunIds: readonly string[]
  /** The AgentRun that receives messages for this collaborator. */
  entryAgentRunId: string
  /** Display name of the run member that brought it in, or null when the user added it directly. */
  addedByName: string | null
  addedAt: string
}

export interface RunMentionAgentSource {
  address: string
  agentDefinitionId: string
  launchConfiguration: AgentLaunchConfigurationDto
}

export interface RunMentionNotice {
  id: string
  rootRunId: string
  /** The conversation (AgentRun) the notice belongs to. */
  agentRunId: string
  kind: 'failed'
  definitionKey: string
  definitionName: string
  detail: string
}

export const runMentionState = reactive({
  addedByRoot: {} as Record<string, AddedCollaborator[]>,
  agentSourceByRunId: {} as Record<string, RunMentionAgentSource>,
  /** Definition keys chosen from the `@` menu, per composer context (AgentRun ID). */
  draftKeysByRunId: {} as Record<string, string[]>,
  noticesByRoot: {} as Record<string, RunMentionNotice[]>,
})

export const addedCollaborators = (rootRunId: string | null | undefined): readonly AddedCollaborator[] =>
  (rootRunId && runMentionState.addedByRoot[rootRunId]) || []

/** The added collaborator that owns a tree row, by its team or agent run. */
export const findAddedCollaborator = (input: {
  rootRunId: string | null | undefined
  teamRunId?: string | null
  agentRunId?: string | null
}): AddedCollaborator | null => addedCollaborators(input.rootRunId).find((entry) =>
  (input.teamRunId && entry.teamRunId === input.teamRunId)
  || (input.agentRunId && entry.agentRunIds.includes(input.agentRunId))) ?? null

/** Launch source for an AgentRun that is not a configured member of its run. */
export const runMentionAgentSource = (agentRunId: string): RunMentionAgentSource | null =>
  runMentionState.agentSourceByRunId[agentRunId] ?? null

export const draftMentionKeys = (runId: string | null | undefined): readonly string[] =>
  (runId && runMentionState.draftKeysByRunId[runId]) || []

export const addDraftMention = (runId: string, key: string): void => {
  const current = runMentionState.draftKeysByRunId[runId] ?? []
  if (!current.includes(key)) runMentionState.draftKeysByRunId[runId] = [...current, key]
}

export const removeDraftMention = (runId: string, key: string): void => {
  runMentionState.draftKeysByRunId[runId] = (runMentionState.draftKeysByRunId[runId] ?? []).filter((entry) => entry !== key)
}

export const clearDraftMentions = (runId: string): void => {
  runMentionState.draftKeysByRunId[runId] = []
}

export const runMentionNotices = (rootRunId: string | null | undefined, agentRunId: string | null | undefined): readonly RunMentionNotice[] =>
  ((rootRunId && runMentionState.noticesByRoot[rootRunId]) || []).filter((notice) => notice.agentRunId === agentRunId)

export const pushRunMentionNotice = (notice: RunMentionNotice): void => {
  runMentionState.noticesByRoot[notice.rootRunId] = [
    ...(runMentionState.noticesByRoot[notice.rootRunId] ?? []).filter((entry) => entry.definitionKey !== notice.definitionKey),
    notice,
  ]
}

export const dismissRunMentionNotice = (rootRunId: string, id: string): void => {
  runMentionState.noticesByRoot[rootRunId] = (runMentionState.noticesByRoot[rootRunId] ?? []).filter((entry) => entry.id !== id)
}

/**
 * Review-only comparison for decision Q1: `relay` (recommended) sends the
 * message to the focused agent, which brings the collaborator in; `direct`
 * sends it straight to the collaborator. Select with `#mentionRoute=direct`
 * (kept for the browser session; `#mentionRoute=relay` switches back).
 */
export type RunMentionRoute = 'relay' | 'direct'
const ROUTE_KEY = 'autobyteus.prototype.mentionRoute'
export const runMentionRoute = (): RunMentionRoute => {
  if (typeof window === 'undefined') return 'relay'
  // The hash keeps the route path unchanged, so the prototype resolves the same page state.
  const fromUrl = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('mentionRoute')
  if (fromUrl === 'direct' || fromUrl === 'relay') sessionStorage.setItem(ROUTE_KEY, fromUrl)
  return sessionStorage.getItem(ROUTE_KEY) === 'direct' ? 'direct' : 'relay'
}

/**
 * Team runs this browser context has resumed by sending a message. The local
 * history adapter reports them as active, as the server would after a restore,
 * so a periodic history refresh does not reset their member statuses.
 */
export const resumedTeamRunIds = new Set<string>()

/**
 * Review-only choice of the task Agent marker in the run tree, selected with
 * `#taskIcon=avatar|bolt|ring` and kept for the browser session.
 * `avatar` is the proposal; `ring` is the current product marker, centered.
 */
export type TaskAgentIconVariant = 'avatar' | 'bolt' | 'ring'
const TASK_ICON_KEY = 'autobyteus.prototype.taskIcon'
export const taskAgentIconVariant = (): TaskAgentIconVariant => {
  if (typeof window === 'undefined') return 'avatar'
  const fromUrl = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('taskIcon')
  if (fromUrl === 'avatar' || fromUrl === 'bolt' || fromUrl === 'ring') sessionStorage.setItem(TASK_ICON_KEY, fromUrl)
  const stored = sessionStorage.getItem(TASK_ICON_KEY)
  return stored === 'bolt' || stored === 'ring' ? stored : 'avatar'
}
