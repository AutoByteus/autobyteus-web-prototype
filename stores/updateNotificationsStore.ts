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

export const shortRevision = (revision: string) => revision.slice(0, 7)
export const compareUrlOf = (item: SourceUpdateNotification) =>
  `https://github.com/${item.repository}/compare/${item.installedRevision}...${item.latestRevision}`

export const useUpdateNotificationsStore = defineStore('updateNotifications', () => {
  const sources = ref<SourceUpdateNotification[]>([])
  /** The app notification's own read / skipped state (the shell persists it in production). */
  const appUnread = ref(true)
  const appFoundAt = ref<string | null>(null)
  const appSkippedVersion = ref<string | null>(null)
  /** Per-node setting: check imported GitHub packages and skill sources in the background. */
  const backgroundChecks = ref(true)
  /** Whether this window shows the app notification (desktop: yes; a browser window of a server node: no). */
  const showsAppNotification = ref(true)
  /** Items that were unread when the user opened the area in this visit: they keep a "New" mark until the
   * user leaves Settings, although they are already counted as read. */
  const newThisVisit = ref<string[]>([])
  /** Scripted outcomes (design only): how an Update ends. */
  const scriptedOutcomes = ref<Record<string, 'fail-once' | 'ok'>>({})

  const app = useAppUpdateStore()
  const appVisible = computed(() => {
    if (!showsAppNotification.value || !app.isElectron || !app.availableVersion) return false
    if (!['available', 'downloading', 'downloaded', 'installing', 'error'].includes(app.status)) return false
    return app.availableVersion !== appSkippedVersion.value
  })

  const visibleSources = computed(() => sources.value)
  const unreadCount = computed(() => sources.value.filter((item) => item.unread && item.state !== 'handled').length
    + (appVisible.value && appUnread.value ? 1 : 0))
  const waitingCount = computed(() => sources.value.filter((item) => item.state !== 'handled').length + (appVisible.value ? 1 : 0))
  const isEmpty = computed(() => !appVisible.value && sources.value.length === 0)

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

  /** Skip this version: the notification goes away for this revision; a newer one notifies again. */
  const skipSource = (id: string) => {
    sources.value = sources.value.filter((item) => item.id !== id)
    newThisVisit.value = newThisVisit.value.filter((entry) => entry !== id)
  }
  const skipApp = () => { appSkippedVersion.value = app.availableVersion }

  return {
    sources, visibleSources, appUnread, appFoundAt, appSkippedVersion, backgroundChecks, showsAppNotification,
    newThisVisit, scriptedOutcomes, appVisible, unreadCount, waitingCount, isEmpty,
    markSeen, endVisit, isNew, updateSource, skipSource, skipApp,
  }
})
