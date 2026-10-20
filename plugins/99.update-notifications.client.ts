import { defineNuxtPlugin } from '#app'
import { useAppUpdateStore } from '~/stores/appUpdateStore'
import { useUpdateNotificationsStore, type SourceUpdateNotification } from '~/stores/updateNotificationsStore'
import { designOnlyLayersEnabled } from '~/prototype/shared/design-only-layers'

/**
 * settings-update-notifications (design-only): synthetic update notifications and scripted outcomes.
 *
 * Everything here is invented; nothing is checked or downloaded:
 * - the desktop app is 1.5.6 with 1.5.7 available on the stable channel. Download shows progress, then
 *   "Install & restart" restarts nothing in the UI reference. Settings → Updates shows the same state.
 * - Notifications for imported GitHub agent packages and skill sources: new and read ones, one long name,
 *   one whose Update fails once, and one already updated.
 *
 * The review state is chosen with the local-storage key `autobyteus.prototype.notifications` (no visible
 * control):
 * - `default`;
 * - `empty` (nothing waiting);
 * - `off` (background checks off, nothing waiting);
 * - `browser` (a browser window of a server node: no app notification);
 * - `many` (a long list).
 */
export const NOTIFICATIONS_SCENARIO_KEY = 'autobyteus.prototype.notifications'

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString()
const sha = (seed: string) => (seed.repeat(8) + '0000000000000000000000000000000000000000').slice(0, 40)

const source = (fields: Partial<SourceUpdateNotification> & Pick<SourceUpdateNotification, 'id' | 'kind' | 'name' | 'repository'>): SourceUpdateNotification => ({
  branch: 'main', installedRevision: sha('a1b2c3d4'), latestRevision: sha('9f8e7d6c'), foundAt: hoursAgo(3),
  unread: true, state: 'waiting', error: null, ...fields,
})

const RELEASE_NOTES = [
  'Task keys and "depends on" between Tasks.',
  'Delegated copies can switch models after a stop.',
  'Token Meter shows tokens per second for each call.',
  'Fixes for long Workspaces trees.',
].map((line) => `• ${line}`).join('\n')

const defaultSources = (): SourceUpdateNotification[] => [
  source({ id: 'pkg-autobyteus-agents', kind: 'agent_package', name: 'AutoByteus Agents', repository: 'AutoByteus/autobyteus-agents', foundAt: hoursAgo(3) }),
  source({ id: 'skills-autobyteus', kind: 'skill_source', name: 'AutoByteus Skills', repository: 'AutoByteus/autobyteus-skills', installedRevision: sha('5e6f7a8b'), latestRevision: sha('c4d5e6f7'), foundAt: hoursAgo(26) }),
  source({ id: 'pkg-research', kind: 'agent_package', name: 'Research Assistant Agents for Long Literature Reviews', repository: 'acme-labs/research-assistant-agents-for-long-literature-reviews', installedRevision: sha('0a1b2c3d'), latestRevision: sha('e8f9a0b1'), foundAt: hoursAgo(50), unread: false }),
  source({ id: 'skills-design', kind: 'skill_source', name: 'design-skills', repository: 'pixel-works/design-skills', installedRevision: sha('77aa88bb'), latestRevision: sha('77aa88bb'), foundAt: hoursAgo(75), unread: false, state: 'handled' }),
]

const manySources = (): SourceUpdateNotification[] => [
  ...defaultSources(),
  ...['data-wrangling-agents', 'video-production-team', 'customer-support-pack', 'ops-runbooks', 'writing-skills', 'browser-automation-skills']
    .map((name, index) => source({
      id: `many-${index}`, kind: index % 2 ? 'skill_source' : 'agent_package', name, repository: `community/${name}`,
      installedRevision: sha(`${index}1${index}2${index}3${index}4`), latestRevision: sha(`${index}9${index}8${index}7${index}6`),
      foundAt: hoursAgo(5 + index * 7), unread: index < 3,
    })),
]

export default defineNuxtPlugin(() => {
  if (!designOnlyLayersEnabled()) return
  let scenario = 'default'
  try { scenario = localStorage.getItem(NOTIFICATIONS_SCENARIO_KEY) || 'default' } catch { /* default */ }
  const notifications = useUpdateNotificationsStore()
  const app = useAppUpdateStore()

  const desktop = scenario !== 'browser'
  notifications.showsAppNotification = desktop
  notifications.backgroundChecks = scenario !== 'off'
  notifications.sources = scenario === 'empty' || scenario === 'off' ? [] : scenario === 'many' ? manySources() : defaultSources()
  notifications.scriptedOutcomes = { 'pkg-research': 'fail-once' }
  notifications.appFoundAt = hoursAgo(2)

  // The app: 1.5.6 installed, 1.5.7 available (desktop only). Settings → Updates reads the same state. The UI
  // reference re-applies captured page snapshots to the app-update store on navigation, so this layer owns the
  // design state and puts it back whenever a snapshot replaces it.
  const offersApp = desktop && scenario !== 'empty' && scenario !== 'off'
  const designApp: Record<string, any> = {
    initialized: true, isElectron: desktop, visible: false, status: offersApp ? 'available' : 'no-update',
    currentVersion: '1.5.6', currentVersionIsPrerelease: false, updateChannel: 'stable', updateStaged: false,
    availableVersion: offersApp ? '1.5.7' : null, releaseNotes: offersApp ? RELEASE_NOTES : null,
    downloadPercent: null, message: '', checkedAt: hoursAgo(2),
  }
  const apply = (changes: Record<string, any> = {}) => { Object.assign(designApp, changes); app.$patch({ ...designApp } as any) }
  apply()
  app.$subscribe(() => {
    if (Object.keys(designApp).some((key) => (app as any)[key] !== designApp[key])) apply()
  })

  // Scripted Download → progress → ready to install, and Install & restart → restarting (nothing restarts).
  const appActions = app as any
  appActions.initialize = async () => undefined
  appActions.checkForUpdates = async () => undefined
  appActions.downloadUpdate = async () => {
    if (designApp.status !== 'available' && designApp.status !== 'error') return
    apply({ status: 'downloading', downloadPercent: 0 })
    for (let percent = 8; percent <= 100; percent += 8) {
      await new Promise((resolve) => setTimeout(resolve, 260))
      apply({ downloadPercent: Math.min(percent, 100) })
    }
    apply({ status: 'downloaded', downloadPercent: 100, updateStaged: true })
  }
  appActions.installUpdateAndRestart = async () => {
    if (designApp.status !== 'downloaded') return
    apply({ status: 'installing' })
  }
})
