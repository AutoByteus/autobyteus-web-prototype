import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAppUpdateStore } from '~/stores/appUpdateStore'

/**
 * settings-update-notifications (design): the quiet notification area in Settings.
 *
 * One notification per source (an imported GitHub agent package or skill source) and one for the app.
 * Kinds form an open set: a new kind needs a producer and its strings, not a new layout.
 *
 * In the UI reference the items are synthetic and their outcomes are scripted
 * (prototype/update-notifications/). Production fills them from the node (packages, skill sources) and the
 * desktop shell (the app). Only the visible behaviour is specified.
 */
export type UpdateNotificationKind = 'app' | 'agent_package' | 'skill_source'
/** waiting: an update is available; updating: the user pressed Update; failed: the update failed and nothing
 * changed; handled: the source reached (or passed) the notified revision by any path. */
export type UpdateNotificationState = 'waiting' | 'updating' | 'failed' | 'handled'

export interface SourceUpdateNotification {
  id: string
  kind: Exclude<UpdateNotificationKind, 'app'>
  name: string
  /** `owner/repo` */
  repository: string
  branch: string
  installedRevision: string
  latestRevision: string
  /** ISO time the update was found. */
  foundAt: string
  unread: boolean
  state: UpdateNotificationState
  error: string | null
}

/**
 * Round 2 (user, 2026-10-20): every notification belongs to a category with its own icon and label, shown in the
 * sidebar entry and as the group heading in the area. Today there is one category, `updates` (the app, agent
 * packages, skill sources). A later category adds an entry here and its strings.
 */
export type NotificationCategory = 'updates'
export const KIND_CATEGORY: Record<UpdateNotificationKind, NotificationCategory> = {
  app: 'updates', agent_package: 'updates', skill_source: 'updates',
}
/** Outline icons, in the style of the sidebar's icons (round 4). */
export const CATEGORY_ICONS: Record<NotificationCategory, string> = { updates: 'heroicons:arrow-down-circle' }

export const shortRevision = (revision: string) => revision.slice(0, 7)
export const compareUrlOf = (item: SourceUpdateNotification) =>
  `https://github.com/${item.repository}/compare/${item.installedRevision}...${item.latestRevision}`

export const useUpdateNotificationsStore = defineStore('updateNotifications', () => {
  const sources = ref<SourceUpdateNotification[]>([])
  /** The app notification's own read state (the shell persists it in production). */
  const appUnread = ref(true)
  const appFoundAt = ref<string | null>(null)
  /** Per-node setting: check imported GitHub packages and skill sources in the background. */
  const backgroundChecks = ref(true)
  /** Whether this window shows the app notification (desktop: yes; a browser window of a server node: no). */
  const showsAppNotification = ref(true)
  /** Items that were unread when the user opened the area in this visit: they keep a "New" mark until the
   * user leaves Settings, although they are already counted as read. */
  const newThisVisit = ref<string[]>([])
  /** Round 6 (user, 2026-10-20, "how does Mac … show notification"): the Notification Center panel, opened from the
   * sidebar entry where the user is; `anchor` is the entry's position (the panel opens next to it). */
  const centerOpen = ref(false)
  const centerAnchor = ref<{ left: number; bottom: number; side: 'above' | 'right' } | null>(null)
  /** Scripted outcomes (design only): how an Update ends. */
  const scriptedOutcomes = ref<Record<string, 'fail-once' | 'ok'>>({})

  const app = useAppUpdateStore()
  const appVisible = computed(() => {
    if (!showsAppNotification.value || !app.isElectron || !app.availableVersion) return false
    return ['available', 'downloading', 'downloaded', 'installing', 'error'].includes(app.status)
  })

  const visibleSources = computed(() => sources.value)
  const unreadCount = computed(() => sources.value.filter((item) => item.unread && item.state !== 'handled').length
    + (appVisible.value && appUnread.value ? 1 : 0))
  const waitingCount = computed(() => sources.value.filter((item) => item.state !== 'handled').length + (appVisible.value ? 1 : 0))
  const isEmpty = computed(() => !appVisible.value && sources.value.length === 0)
  /** Unread notifications per kind, in display order, for the sidebar entry's description ("1 software update, …"). */
  const unreadByKind = computed(() => {
    const kinds: UpdateNotificationKind[] = ['app', 'agent_package', 'skill_source']
    const count = (kind: UpdateNotificationKind) => kind === 'app'
      ? (appVisible.value && appUnread.value ? 1 : 0)
      : sources.value.filter((item) => item.kind === kind && item.unread && item.state !== 'handled').length
    return kinds.map((kind) => [kind, count(kind)] as const).filter(([, n]) => n > 0)
  })
  /** Waiting (not yet updated) notifications per kind and per category: the sidebar entry shows them while any wait
   * (round 6: blue while some are new, grey once all are read), so they can always be reopened. */
  const waitingByKind = computed(() => {
    const kinds: UpdateNotificationKind[] = ['app', 'agent_package', 'skill_source']
    const count = (kind: UpdateNotificationKind) => kind === 'app'
      ? (appVisible.value ? 1 : 0)
      : sources.value.filter((item) => item.kind === kind && item.state !== 'handled').length
    return kinds.map((kind) => [kind, count(kind)] as const).filter(([, n]) => n > 0)
  })
  const waitingByCategory = computed(() => {
    const counts: Partial<Record<NotificationCategory, number>> = {}
    for (const [kind, n] of waitingByKind.value) counts[KIND_CATEGORY[kind]] = (counts[KIND_CATEGORY[kind]] ?? 0) + n
    return (Object.entries(counts) as [NotificationCategory, number][]).filter(([, n]) => n > 0)
  })
  /** Unread notifications per category, for the sidebar entries (categories with none are not shown). */
  const unreadByCategory = computed(() => {
    const counts: Partial<Record<NotificationCategory, number>> = {}
    for (const item of sources.value) if (item.unread && item.state !== 'handled') counts[KIND_CATEGORY[item.kind]] = (counts[KIND_CATEGORY[item.kind]] ?? 0) + 1
    if (appVisible.value && appUnread.value) counts.updates = (counts.updates ?? 0) + 1
    return (Object.entries(counts) as [NotificationCategory, number][]).filter(([, count]) => count > 0)
  })

  /** Opening the area marks everything read; the "New" mark stays for this visit. */
  const markSeen = () => {
    const fresh = sources.value.filter((item) => item.unread).map((item) => item.id)
    if (appVisible.value && appUnread.value) fresh.push('app')
    if (!fresh.length) return
    newThisVisit.value = [...new Set([...newThisVisit.value, ...fresh])]
    sources.value = sources.value.map((item) => ({ ...item, unread: false }))
    appUnread.value = false
  }
  const endVisit = () => { newThisVisit.value = [] }
  const isNew = (id: string) => newThisVisit.value.includes(id)

  const patch = (id: string, changes: Partial<SourceUpdateNotification>) => {
    sources.value = sources.value.map((item) => item.id === id ? { ...item, ...changes } : item)
  }

  /** Runs the existing explicit update of the source's kind (scripted here). */
  const updateSource = (id: string) => {
    const item = sources.value.find((entry) => entry.id === id)
    if (!item || item.state === 'updating' || item.state === 'handled') return
    patch(id, { state: 'updating', error: null })
    const outcome = scriptedOutcomes.value[id] ?? 'ok'
    setTimeout(() => {
      if (outcome === 'fail-once') {
        scriptedOutcomes.value = { ...scriptedOutcomes.value, [id]: 'ok' }
        patch(id, { state: 'failed', error: 'GitHub returned 502 while downloading the archive.' })
        return
      }
      patch(id, { state: 'handled', installedRevision: item.latestRevision, error: null })
    }, 1600)
  }

  /** Round 10 (user, 2026-10-20): no "Skip this version". A notification goes away when its update is done and
   * the user clears it; a newer version replaces the waiting one (one per source). */
  const clearSource = (id: string) => {
    sources.value = sources.value.filter((item) => item.id !== id)
    newThisVisit.value = newThisVisit.value.filter((entry) => entry !== id)
  }

  const openCenter = (anchor: { left: number; bottom: number; side: 'above' | 'right' }) => {
    centerAnchor.value = anchor
    centerOpen.value = true
    markSeen()
  }
  const closeCenter = () => {
    if (!centerOpen.value) return
    centerOpen.value = false
    endVisit()
  }

  return {
    centerOpen, centerAnchor, openCenter, closeCenter,
    sources, visibleSources, appUnread, appFoundAt, backgroundChecks, showsAppNotification,
    newThisVisit, scriptedOutcomes, appVisible, unreadCount, unreadByCategory, unreadByKind, waitingByKind, waitingByCategory, waitingCount, isEmpty,
    markSeen, endVisit, isNew, updateSource, clearSource,
  }
})
