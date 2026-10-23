/** Node notification kinds, as the server names them (GraphQL `UpdateNotificationKind`). */
/** `AGENT_RUNTIME` (update-checks-and-auto-updates): the desktop's own node only; `sourceId` is the runtime kind. */
export type NodeUpdateNotificationKind = 'AGENT_PACKAGE' | 'SKILL_SOURCE' | 'AGENT_RUNTIME'

/**
 * What an automatic update did, when the setting of that kind was on (REQ-008, REQ-022). `AUTO_UPDATED` is a handled
 * record that stays unread until seen; `AUTO_FAILED` and `AUTO_WAITING` (a runtime whose agents run) are waiting records
 * that say why nothing changed. Local changes never skip an update (SR-003, DEC-019).
 */
export type UpdateNotificationOutcome = 'AUTO_UPDATED' | 'AUTO_FAILED' | 'AUTO_WAITING'

/** One node update notification (GraphQL `UpdateNotification`). */
export interface NodeUpdateNotification {
  kind: NodeUpdateNotificationKind
  sourceId: string
  name: string
  repositoryUrl: string
  defaultBranch: string | null
  installedRevision: string
  latestRevision: string
  foundAt: string
  read: boolean
  state: 'WAITING' | 'HANDLED'
  handledRevision: string | null
  handledAt: string | null
  outcome: UpdateNotificationOutcome | null
  /** The reason of `AUTO_FAILED` (the node's or the vendor's message). */
  outcomeReason: string | null
  /** Runtimes only: agents of that runtime running now (Update is unavailable while any run). */
  runningAgentCount: number
}

/** The kinds the Notification Center shows; a section, its icon and its strings per kind. */
export type UpdateNotificationKind = 'app' | 'agent_package' | 'skill_source' | 'agent_runtime'

/** `/ws/update-notifications` frames (server → client); every frame means "re-read". */
export type UpdateNotificationChangeMessage =
  | { type: 'connected' }
  | { type: 'update_notifications_changed' }

/** The node's check intervals and automatic-update switches ("Update checks" card; the same switches in the Notification Center). */
export interface UpdateAutomationSettings {
  packageIntervalMinutes: number
  skillIntervalMinutes: number
  /** Runtime fields apply on the desktop's own node only. */
  runtimeIntervalMinutes: number
  autoUpdatePackages: boolean
  autoUpdateSkills: boolean
  autoUpdateRuntimes: boolean
  /** ISO time until which GitHub asked this node to wait; null when it did not. */
  waitUntil: string | null
}
export type UpdateAutomationSwitch = 'autoUpdatePackages' | 'autoUpdateSkills' | 'autoUpdateRuntimes'
export type UpdateIntervalField = 'packageIntervalMinutes' | 'skillIntervalMinutes' | 'runtimeIntervalMinutes'
export const MIN_UPDATE_INTERVAL_MINUTES = 15
export const MAX_UPDATE_INTERVAL_MINUTES = 24 * 60
