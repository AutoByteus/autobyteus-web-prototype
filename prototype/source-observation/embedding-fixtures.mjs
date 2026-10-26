// WEB-BASELINE-REFRESH-011 (8469d4b, 54e26d7, 70bb036): the node's embedding models, its Projects' indexes and
// meaning search. One in-memory "server" state per caller (`state.embedding`), reset with the scenario. Work moves
// one step per status or search read, so the observation node and the baseline advance alike; nothing runs.
// The three catalog models and their sizes are the design's invented catalog (search-model-settings).
const MB = 1e6
export const EMBEDDING_CATALOG = Object.freeze([
  { id: 'granite-embedding-small-english-r2', displayName: 'IBM Granite Embedding Small English R2', languages: ['en'], downloadBytes: 55 * MB },
  { id: 'mdbr-leaf-ir', displayName: 'MongoDB LEAF-IR', languages: ['en'], downloadBytes: 24 * MB },
  { id: 'embeddinggemma-2', displayName: 'Google EmbeddingGemma 2', languages: ['multilingual'], downloadBytes: 346 * MB },
])
export const EMBEDDING_MUTATIONS = new Set(['DownloadEmbeddingModel', 'CancelEmbeddingModelDownload', 'RemoveEmbeddingModel', 'UseEmbeddingModel', 'IndexProjectTasks', 'RebuildProjectTaskIndex', 'IndexAllProjectTasks', 'RetryEmbeddingModel'])
// Extra synthetic Projects in the busy scenario, so every index state shows (invented names and counts).
export const EMBEDDING_BUSY_PROJECTS = Object.freeze([
  { projectId: 'project-marketing-site', name: 'Marketing Site', tasks: 41, index: { state: 'NOT_INDEXED' } },
  { projectId: 'project-support-portal', name: 'Support Portal', tasks: 24, index: { state: 'INDEXING', done: 12 } },
  { projectId: 'project-release-notes', name: 'Release Notes', tasks: 9, index: { state: 'WAITING' } },
])
// Extra synthetic Projects in the many-Projects scenario, so the list offers Find (more than 8 Projects; invented).
export const EMBEDDING_MANY_PROJECTS = Object.freeze([
  ['agent-runtime', 'Agent Runtime', 63, { state: 'READY' }], ['billing-cleanup', 'Billing Cleanup', 17, { state: 'NEEDS_UPDATE', changed: 4 }],
  ['docs-portal', 'Docs Portal', 28, { state: 'READY' }], ['field-survey', 'Field Survey', 6, { state: 'NOT_INDEXED' }],
  ['help-center', 'Help Center', 35, { state: 'READY' }], ['marketing-site', 'Marketing Site', 41, { state: 'NOT_INDEXED' }],
  ['mobile-shell', 'Mobile Shell', 22, { state: 'READY' }], ['partner-api', 'Partner API', 14, { state: 'READY' }],
  ['release-notes', 'Release Notes', 9, { state: 'READY' }], ['usage-reports', 'Usage Reports', 11, { state: 'READY' }],
].map(([slug, name, tasks, index]) => ({ projectId: `project-${slug}`, name, tasks, index })))
export const embeddingExtraProjects = (scenario) => scenario === 'embedding_busy' ? EMBEDDING_BUSY_PROJECTS : scenario === 'embedding_many' ? EMBEDDING_MANY_PROJECTS : []
const file = (kind, total = null) => ({ state: kind, done: kind === 'DOWNLOADING' ? 0 : null, total: kind === 'DOWNLOADING' ? total : null, reason: null })
export const embeddingState = (state, projectsOf) => {
  if (state.embedding) return state.embedding
  const scenario = state.scenario
  const e = {
    activeModelId: EMBEDDING_CATALOG[0].id,
    files: { [EMBEDDING_CATALOG[0].id]: file('DOWNLOADED'), [EMBEDDING_CATALOG[1].id]: file('DOWNLOADED'), [EMBEDDING_CATALOG[2].id]: file('NOT_DOWNLOADED') },
    preparing: null, // { phase: 'DOWNLOADING' | 'LOADING', done, total }
    unavailable: scenario === 'embedding_unavailable' ? 'The model files did not pass the integrity check.' : null,
    failDownloads: scenario === 'embedding_offline',
    statusReads: 0,
    indexes: {},
  }
  for (const project of projectsOf()) {
    e.indexes[project.projectId] = { state: 'READY', done: null, changed: null }
  }
  if (scenario === 'embedding_busy') {
    e.files[EMBEDDING_CATALOG[2].id] = { state: 'DOWNLOADING', done: 104 * MB, total: EMBEDDING_CATALOG[2].downloadBytes, reason: null }
    e.indexes['project-prototype-launch'] = { state: 'NEEDS_UPDATE', done: null, changed: 2 }
  }
  for (const extra of embeddingExtraProjects(scenario)) e.indexes[extra.projectId] = { state: extra.index.state, done: extra.index.done ?? null, changed: extra.index.changed ?? null }
  state.embedding = e
  return e
}
const DOWNLOAD_STEPS = 6
const INDEX_STEPS = 4
/** One step of the running work (downloads, the active model's preparation, one indexing Project at a time). */
export const advanceEmbedding = (e, projectTotals) => {
  for (const model of EMBEDDING_CATALOG) {
    const f = e.files[model.id]
    if (f.state !== 'DOWNLOADING') continue
    // embedding_offline: each model's first download fails; the network is back for a Retry, which then succeeds.
    if (e.failDownloads && !e.failedOnce?.[model.id]) { (e.failedOnce ??= {})[model.id] = true; e.files[model.id] = { state: 'FAILED', done: null, total: null, reason: 'The download could not finish: the network is unreachable.' }; continue }
    f.done = Math.min(f.total, f.done + Math.ceil(f.total / DOWNLOAD_STEPS))
    if (f.done >= f.total) e.files[model.id] = file('DOWNLOADED')
  }
  if (e.preparing) {
    const active = EMBEDDING_CATALOG.find(model => model.id === e.activeModelId)
    if (e.preparing.phase === 'DOWNLOADING') {
      if (e.failDownloads) { e.preparing = null; e.unavailable = 'The model could not be downloaded: the network is unreachable.'; e.files[active.id] = file('NOT_DOWNLOADED') }
      else {
        e.preparing.done = Math.min(e.preparing.total, e.preparing.done + Math.ceil(e.preparing.total / DOWNLOAD_STEPS))
        if (e.preparing.done >= e.preparing.total) { e.files[active.id] = file('DOWNLOADED'); e.preparing = { phase: 'LOADING', done: null, total: null } }
      }
    } else e.preparing = null
  }
  if (e.preparing || e.unavailable) return
  const indexing = Object.entries(e.indexes).find(([, index]) => index.state === 'INDEXING')
  if (indexing) {
    const [id, index] = indexing
    const total = projectTotals(id)
    index.done = Math.min(total, (index.done ?? 0) + Math.max(1, Math.ceil(total / INDEX_STEPS)))
    if (index.done >= total) Object.assign(index, { state: 'READY', done: null, changed: null })
    return
  }
  const waiting = Object.entries(e.indexes).find(([, index]) => index.state === 'WAITING')
  if (waiting) Object.assign(waiting[1], { state: 'INDEXING', done: 0, changed: null })
}
const activeDisplayOf = (e, modelId) => {
  if (modelId !== e.activeModelId) return null
  if (e.unavailable) return { state: 'UNAVAILABLE', phase: null, done: null, total: null, reason: e.unavailable }
  if (e.preparing) return { state: 'PREPARING', phase: e.preparing.phase, done: e.preparing.done ?? null, total: e.preparing.total ?? null, reason: null }
  if (e.files[modelId].state !== 'DOWNLOADED') return { state: 'NOT_DOWNLOADED', phase: null, done: null, total: null, reason: null }
  return { state: 'READY', phase: null, done: null, total: null, reason: null }
}
export const embeddingStatusOf = (e, projects) => ({
  embeddingModelsStatus: {
    activeModelId: e.activeModelId,
    defaultModelId: EMBEDDING_CATALOG[0].id,
    onDiskBytes: EMBEDDING_CATALOG.filter(model => e.files[model.id].state === 'DOWNLOADED').reduce((sum, model) => sum + model.downloadBytes, 0),
    models: EMBEDDING_CATALOG.map(model => ({ ...model, file: { ...e.files[model.id] }, activeDisplay: activeDisplayOf(e, model.id) })),
  },
  projectTaskIndexes: [...projects].sort((a, b) => a.name.localeCompare(b.name)).map(project => {
    const index = e.indexes[project.projectId] ?? { state: 'NOT_INDEXED', done: null, changed: null }
    const unavailable = Boolean(e.unavailable)
    return { projectId: project.projectId, name: project.name, state: unavailable ? 'UNAVAILABLE' : index.state, done: !unavailable && index.state === 'INDEXING' ? index.done : null, total: project.tasks, changed: !unavailable && index.state === 'NEEDS_UPDATE' ? index.changed : null }
  }),
})
export const meaningSearchOf = (e) => e.unavailable ? { state: 'UNAVAILABLE', phase: null, done: null, total: null, reason: e.unavailable }
  : e.preparing ? { state: 'PREPARING', phase: e.preparing.phase, done: e.preparing.done ?? null, total: e.preparing.total ?? null, reason: null }
    : { state: 'READY', phase: null, done: null, total: null, reason: null }
export const embeddingMutation = (e, operationName, variables, projects) => {
  const id = variables.modelId
  const model = EMBEDDING_CATALOG.find(entry => entry.id === id)
  switch (operationName) {
    case 'DownloadEmbeddingModel':
      if (!model) return { __projectError: { message: 'Unknown embedding model.', extensions: { code: 'EMBEDDING_MODEL_NOT_FOUND' } } }
      if (id === e.activeModelId) { e.preparing = { phase: 'DOWNLOADING', done: 0, total: model.downloadBytes }; e.unavailable = null }
      else e.files[id] = file('DOWNLOADING', model.downloadBytes)
      return { downloadEmbeddingModel: true }
    case 'CancelEmbeddingModelDownload':
      if (model && id !== e.activeModelId) e.files[id] = file('NOT_DOWNLOADED')
      return { cancelEmbeddingModelDownload: true }
    case 'RemoveEmbeddingModel':
      if (model && id !== e.activeModelId) e.files[id] = file('NOT_DOWNLOADED')
      return { removeEmbeddingModel: true }
    case 'UseEmbeddingModel':
      if (!model) return { __projectError: { message: 'Unknown embedding model.', extensions: { code: 'EMBEDDING_MODEL_NOT_FOUND' } } }
      e.activeModelId = id
      e.unavailable = null
      e.preparing = e.files[id].state === 'DOWNLOADED' ? { phase: 'LOADING', done: null, total: null } : { phase: 'DOWNLOADING', done: e.files[id].state === 'DOWNLOADING' ? e.files[id].done : 0, total: model.downloadBytes }
      if (e.files[id].state !== 'DOWNLOADED') e.files[id] = file('NOT_DOWNLOADED')
      for (const project of projects) e.indexes[project.projectId] = { state: 'NOT_INDEXED', done: null, changed: null }
      return { useEmbeddingModel: true }
    case 'IndexProjectTasks': {
      const index = e.indexes[variables.projectId] ??= { state: 'NOT_INDEXED', done: null, changed: null }
      Object.assign(index, { state: 'WAITING', done: null })
      return { indexProjectTasks: true }
    }
    case 'RebuildProjectTaskIndex': {
      const index = e.indexes[variables.projectId] ??= { state: 'NOT_INDEXED', done: null, changed: null }
      Object.assign(index, { state: 'WAITING', done: null, changed: null })
      return { rebuildProjectTaskIndex: true }
    }
    case 'IndexAllProjectTasks': {
      let count = 0
      for (const project of projects) {
        const index = e.indexes[project.projectId] ??= { state: 'NOT_INDEXED', done: null, changed: null }
        if (index.state === 'NOT_INDEXED' || index.state === 'NEEDS_UPDATE') { Object.assign(index, { state: 'WAITING', done: null }); count++ }
      }
      return { indexAllProjectTasks: count }
    }
    case 'RetryEmbeddingModel': {
      // The active model prepares again: it downloads first when its files are not on disk.
      const active = EMBEDDING_CATALOG.find(model => model.id === e.activeModelId)
      e.unavailable = null
      e.failDownloads = false
      e.preparing = e.files[active.id].state === 'DOWNLOADED' ? { phase: 'LOADING', done: null, total: null } : { phase: 'DOWNLOADING', done: 0, total: active.downloadBytes }
      return { retryEmbeddingModel: true }
    }
    default:
      return null
  }
}
/** Exact text matches first (description contains the query), then "meaning" matches (a shared word of 4+ letters). */
export const searchTasks = (tasks, query) => {
  const q = String(query || '').trim().toLocaleLowerCase()
  const words = new Set(q.split(/[^a-z0-9]+/).filter(word => word.length >= 4))
  const textOf = task => `${task.title ?? ''} ${task.description}`.toLocaleLowerCase()
  const exact = tasks.filter(task => textOf(task).includes(q))
  const meaning = tasks.filter(task => !exact.includes(task) && textOf(task).split(/[^a-z0-9]+/).some(word => word.length >= 4 && [...words].some(other => word.slice(0, 4) === other.slice(0, 4))))
  return [...exact.map(task => ({ __typename: 'ProjectTaskSearchMatch', taskId: task.taskId, match: 'EXACT' })), ...meaning.map(task => ({ __typename: 'ProjectTaskSearchMatch', taskId: task.taskId, match: 'MEANING' }))]
}
