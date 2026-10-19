// search-model-settings (design-only): local synthetic state for Settings -> Search.
// Everything here is invented and in memory; a reload resets it. The "server" is a module-level
// timeline: downloads, model preparation and indexing advance on a 1 s tick whether or not the
// Search section is mounted, so leaving the page and returning shows the current state (REQ-007).
// Nothing starts at mount (REQ-005): only the work that a scenario seeds as already running ticks.
import { computed, reactive } from 'vue'

export type ModelId = 'granite-small-english-r2' | 'leaf-ir' | 'embeddinggemma-2'
export type ModelFileState = 'not_downloaded' | 'downloaded' | 'downloading'
export type ProjectIndexState = 'not_indexed' | 'waiting' | 'indexing' | 'ready' | 'needs_update'

export interface CatalogModel {
  id: ModelId
  name: string
  sizeMb: number
  secondsPerTask: number | null
  hasMemoryNote: boolean
}

// The catalog facts of the request (illustrative here: the product's catalog stays the authority).
export const CATALOG: CatalogModel[] = [
  { id: 'granite-small-english-r2', name: 'IBM Granite Embedding Small English R2', sizeMb: 55, secondsPerTask: 0.5, hasMemoryNote: false },
  { id: 'leaf-ir', name: 'MongoDB LEAF-IR', sizeMb: 23, secondsPerTask: null, hasMemoryNote: false },
  { id: 'embeddinggemma-2', name: 'Google EmbeddingGemma 2', sizeMb: 346, secondsPerTask: 4, hasMemoryNote: true },
]

export interface ModelRuntime {
  file: ModelFileState
  downloadedMb: number
  failureKey: string | null // last download failure (reason), cleared by the next action
  noticeKey: string | null // short outcome of the last action on this row
  noticeParams?: Record<string, string | number>
  confirmingRemove: boolean
}

export type Readiness =
  | { kind: 'ready' }
  | { kind: 'preparing'; phase: 'download' | 'load'; loadTicks: number }
  | { kind: 'unavailable'; reasonKey: string }

export interface ProjectRuntime {
  id: string
  name: string
  state: ProjectIndexState
  tasks: number // Tasks counted for the Project
  done: number // indexed so far while indexing
  total: number // Tasks this run will index (changed Tasks, or every Task)
  changed: number // changed Tasks since the last index (needs_update)
  rebuild: boolean // the running work is a rebuild
  confirmingRebuild: boolean
}

export type LoadStatus = 'loading' | 'ready' | 'error'

const SCENARIO_KEY = 'autobyteus.prototype.scenario'

const state = reactive({
  loadStatus: 'loading' as LoadStatus,
  activeId: 'granite-small-english-r2' as ModelId,
  readiness: { kind: 'ready' } as Readiness,
  models: {} as Record<ModelId, ModelRuntime>,
  projects: [] as ProjectRuntime[],
  failNextDownload: false,
  loadAttempts: 0,
  scenario: 'populated',
})

const freshModel = (file: ModelFileState): ModelRuntime => ({
  file, downloadedMb: 0, failureKey: null, noticeKey: null, confirmingRemove: false,
})

const project = (id: string, name: string, s: ProjectIndexState, tasks: number, extra: Partial<ProjectRuntime> = {}): ProjectRuntime => ({
  id, name, state: s, tasks, done: 0, total: tasks, changed: 0, rebuild: false, confirmingRebuild: false, ...extra,
})

const baseProjects = (): ProjectRuntime[] => [
  project('desktop-app', 'Desktop App', 'ready', 170),
  project('onboarding-redesign', 'Onboarding Redesign', 'indexing', 24, { done: 12, total: 24 }),
  project('marketing-site', 'Marketing Site', 'not_indexed', 41),
  project('prototype-launch', 'Prototype Launch', 'needs_update', 58, { changed: 3 }),
  project('agent-runtime', 'Agent Runtime', 'ready', 96),
  project('billing-cleanup', 'Billing Cleanup', 'ready', 12),
  project('release-notes', 'Release Notes', 'not_indexed', 9),
]

const manyProjects = (): ProjectRuntime[] => {
  const names = ['Desktop App', 'Onboarding Redesign', 'Marketing Site', 'Prototype Launch', 'Agent Runtime', 'Billing Cleanup', 'Release Notes',
    'Docs Portal', 'Mobile Pairing', 'Skill Library', 'Node Sync', 'Voice Input', 'Token Meter', 'Team Launch', 'Run History', 'Search Quality',
    'Workspace Folders', 'Package Catalog', 'Server Settings', 'Accessibility Pass', 'Localization', 'Docker Guide', 'NFS Guide', 'Update Channel']
  const plan: Array<[ProjectIndexState, number, Partial<ProjectRuntime>]> = [
    ['ready', 170, {}], ['indexing', 24, { done: 12 }], ['not_indexed', 41, {}], ['needs_update', 58, { changed: 3 }], ['ready', 96, {}],
    ['ready', 12, {}], ['not_indexed', 9, {}], ['ready', 33, {}], ['ready', 71, {}], ['needs_update', 120, { changed: 14 }], ['ready', 8, {}], ['not_indexed', 27, {}],
    ['ready', 64, {}], ['ready', 45, {}], ['ready', 203, {}], ['needs_update', 19, { changed: 1 }], ['ready', 52, {}], ['not_indexed', 15, {}], ['ready', 88, {}],
    ['ready', 6, {}], ['ready', 37, {}], ['ready', 29, {}], ['ready', 14, {}], ['not_indexed', 22, {}],
  ]
  return names.map((n, i) => project(n.toLowerCase().replace(/ /g, '-'), n, plan[i][0], plan[i][1], plan[i][2]))
}

const seed = (scenario: string) => {
  state.scenario = scenario
  state.activeId = 'granite-small-english-r2'
  state.readiness = { kind: 'ready' }
  state.models = {
    'granite-small-english-r2': freshModel('downloaded'),
    'leaf-ir': freshModel('downloaded'),
    'embeddinggemma-2': freshModel('not_downloaded'),
  }
  state.projects = baseProjects()
  state.failNextDownload = false
  state.loadStatus = 'loading'
  if (scenario === 'search_unavailable') {
    state.readiness = { kind: 'unavailable', reasonKey: 'settings.search.reasons.checksum' }
  }
  if (scenario === 'search_offline') state.failNextDownload = true
  if (scenario === 'search_empty') state.projects = []
  if (scenario === 'search_many_projects') state.projects = manyProjects()
}

let timer: ReturnType<typeof setInterval> | null = null

const downloadStep = (model: CatalogModel) => Math.max(2, Math.ceil(model.sizeMb / 18))
const indexStep = (p: ProjectRuntime) => Math.max(1, Math.ceil(p.total / 12))
const catalogModel = (id: ModelId) => CATALOG.find((m) => m.id === id)!

const hasWork = () =>
  state.readiness.kind === 'preparing'
  || CATALOG.some((m) => state.models[m.id].file === 'downloading')
  || state.projects.some((p) => p.state === 'indexing' || p.state === 'waiting')

const tick = () => {
  // Downloads (ahead of time, or the active model preparing).
  for (const model of CATALOG) {
    const runtime = state.models[model.id]
    if (runtime.file !== 'downloading') continue
    const next = Math.min(model.sizeMb, runtime.downloadedMb + downloadStep(model))
    if (state.failNextDownload && next >= model.sizeMb * 0.35) {
      state.failNextDownload = false
      runtime.file = 'not_downloaded'
      runtime.downloadedMb = 0
      runtime.failureKey = 'settings.search.reasons.offline'
      if (state.activeId === model.id) state.readiness = { kind: 'unavailable', reasonKey: 'settings.search.reasons.offline' }
      continue
    }
    runtime.downloadedMb = next
    if (next >= model.sizeMb) {
      runtime.file = 'downloaded'
      runtime.noticeKey = state.activeId === model.id ? null : 'settings.search.notice.downloaded'
      runtime.noticeParams = { size: model.sizeMb }
      if (state.activeId === model.id) state.readiness = { kind: 'preparing', phase: 'load', loadTicks: 0 }
    }
  }
  // Loading the active model after it is on disk.
  if (state.readiness.kind === 'preparing' && state.readiness.phase === 'load') {
    state.readiness.loadTicks += 1
    if (state.readiness.loadTicks >= 3) state.readiness = { kind: 'ready' }
  }
  // Indexing: one Project at a time, in list order, once the model is ready.
  if (state.readiness.kind === 'ready') {
    const running = state.projects.find((p) => p.state === 'indexing') ?? state.projects.find((p) => p.state === 'waiting')
    if (running) {
      running.state = 'indexing'
      running.done = Math.min(running.total, running.done + indexStep(running))
      if (running.done >= running.total) {
        running.state = 'ready'
        running.changed = 0
        running.rebuild = false
      }
    }
  }
  if (!hasWork() && timer) { clearInterval(timer); timer = null }
}

const ensureTimer = () => {
  if (!timer && typeof window !== 'undefined') timer = setInterval(tick, 1000)
}

let initialized = false
const finishLoad = () => {
  state.loadAttempts += 1
  if (state.scenario === 'search_load_failed' && state.loadAttempts === 1) { state.loadStatus = 'error'; return }
  state.loadStatus = 'ready'
  if (hasWork()) ensureTimer()
}

export const initSearchSettings = () => {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  seed(window.localStorage.getItem(SCENARIO_KEY) || 'populated')
  setTimeout(finishLoad, 700)
}

export const retryLoad = () => {
  state.loadStatus = 'loading'
  setTimeout(finishLoad, 500)
}

// ---- actions (each is a scripted outcome of the real control that triggers it) ----

const clearNotices = (runtime: ModelRuntime) => {
  runtime.failureKey = null
  runtime.noticeKey = null
  runtime.confirmingRemove = false
}

export const startDownload = (id: ModelId) => {
  const runtime = state.models[id]
  clearNotices(runtime)
  runtime.file = 'downloading'
  runtime.downloadedMb = 0
  ensureTimer()
}

export const cancelDownload = (id: ModelId) => {
  const runtime = state.models[id]
  runtime.file = 'not_downloaded'
  runtime.downloadedMb = 0
  runtime.noticeKey = 'settings.search.notice.cancelled'
}

export const askRemove = (id: ModelId, on: boolean) => { state.models[id].confirmingRemove = on }

export const removeModel = (id: ModelId) => {
  const runtime = state.models[id]
  runtime.file = 'not_downloaded'
  runtime.confirmingRemove = false
  runtime.noticeKey = 'settings.search.notice.removed'
  runtime.noticeParams = { size: catalogModel(id).sizeMb }
}

export const useModel = (id: ModelId) => {
  const previous = state.activeId
  clearNotices(state.models[id])
  state.activeId = id
  // The index of the other model is deleted once the new one is ready; the new model starts empty.
  state.projects.forEach((p) => {
    p.state = 'not_indexed'; p.done = 0; p.total = p.tasks; p.changed = 0; p.rebuild = false; p.confirmingRebuild = false
  })
  if (state.models[id].file === 'downloaded') {
    state.readiness = { kind: 'preparing', phase: 'load', loadTicks: 0 }
  } else if (state.models[id].file === 'downloading') {
    state.readiness = { kind: 'preparing', phase: 'download', loadTicks: 0 }
  } else {
    state.models[id].file = 'downloading'
    state.models[id].downloadedMb = 0
    state.readiness = { kind: 'preparing', phase: 'download', loadTicks: 0 }
  }
  state.models[previous].noticeKey = null
  ensureTimer()
}

export const retryModel = () => {
  const id = state.activeId
  if (state.models[id].file === 'downloaded') {
    state.readiness = { kind: 'preparing', phase: 'load', loadTicks: 0 }
  } else {
    state.models[id].file = 'downloading'
    state.models[id].downloadedMb = 0
    state.models[id].failureKey = null
    state.readiness = { kind: 'preparing', phase: 'download', loadTicks: 0 }
  }
  ensureTimer()
}

export const indexNow = (projectId: string) => {
  const p = state.projects.find((item) => item.id === projectId)
  if (!p || p.state === 'indexing' || p.state === 'waiting') return
  p.total = p.state === 'needs_update' ? p.changed : p.tasks
  p.state = 'waiting'
  p.done = 0
  p.rebuild = false
  ensureTimer()
}

export const askRebuild = (projectId: string, on: boolean) => {
  const p = state.projects.find((item) => item.id === projectId)
  if (p) p.confirmingRebuild = on
}

export const rebuild = (projectId: string) => {
  const p = state.projects.find((item) => item.id === projectId)
  if (!p) return
  p.confirmingRebuild = false
  p.state = 'waiting'
  p.total = p.tasks
  p.done = 0
  p.changed = 0
  p.rebuild = true
  ensureTimer()
}

export const indexAll = () => {
  state.projects.forEach((p) => {
    if (p.state === 'not_indexed' || p.state === 'needs_update') indexNow(p.id)
  })
}

export const useSearchSettingsState = () => {
  const activeModel = computed(() => catalogModel(state.activeId))
  const unavailable = computed(() => state.readiness.kind === 'unavailable')
  const diskMb = computed(() =>
    CATALOG.reduce((sum, m) => sum + (state.models[m.id].file === 'downloaded' ? m.sizeMb : state.models[m.id].file === 'downloading' ? state.models[m.id].downloadedMb : 0), 0))
  const canIndexAll = computed(() =>
    !unavailable.value && state.projects.some((p) => p.state === 'not_indexed' || p.state === 'needs_update'))
  return { state, activeModel, unavailable, diskMb, canIndexAll }
}

export const catalogById = catalogModel
