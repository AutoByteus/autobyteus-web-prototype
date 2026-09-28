import { computed, reactive } from 'vue'
import {
  CHAT_AGENTS,
  CHAT_MODELS,
  CHAT_RUNTIMES,
  CHAT_WORKSPACES,
  INITIAL_CHATS,
  INITIAL_FAVORITES,
  INITIAL_RECENTS,
  TEMP_WORKSPACE_ID,
  type ChatCombo,
  type ChatMessage,
  type ChatModel,
  type ChatRecord,
  type ChatRuntimeId,
  type ChatWorkspace,
} from '~/prototype/chat/chat-fixtures'

// Prototype-native chat state. Browser-local, resettable, synthetic only.
// It does not reproduce production run, catalog, or streaming protocols.

export type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error'

const SCENARIO_KEY = 'autobyteus.prototype.scenario'

const readScenario = (): string => {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(SCENARIO_KEY) || ''
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const comboKey = (combo: { runtime: string; modelId: string }) => `${combo.runtime}|${combo.modelId}`

interface DraftState {
  agentId: string
  runtime: ChatRuntimeId
  modelId: string
  thinking?: string
  workspaceId: string
  text: string
}

interface ChatState {
  initialized: boolean
  scenario: string
  chats: ChatRecord[]
  recents: ChatCombo[]
  favorites: string[]
  extraWorkspaces: ChatWorkspace[]
  lastAgentId: string
  catalog: Record<ChatRuntimeId, CatalogStatus>
  catalogFailuresRemaining: Partial<Record<ChatRuntimeId, number>>
  draft: DraftState
  starting: boolean
  workspacePanelOpen: boolean
  toast: string | null
  loadedAt: number
  lastActivity: Record<string, number>
}

const state = reactive<ChatState>({
  initialized: false,
  scenario: '',
  chats: [],
  recents: [],
  favorites: [],
  extraWorkspaces: [],
  lastAgentId: 'daily-assistant',
  catalog: {
    autobyteus: 'idle',
    codex_app_server: 'idle',
    claude_agent_sdk: 'idle',
    antigravity_cli: 'idle',
    grok_build: 'idle',
  },
  catalogFailuresRemaining: {},
  draft: { agentId: 'daily-assistant', runtime: 'autobyteus', modelId: 'gpt-5.5', workspaceId: TEMP_WORKSPACE_ID, text: '' },
  starting: false,
  workspacePanelOpen: false,
  toast: null,
  loadedAt: Date.now(),
  lastActivity: {},
})

let toastTimer: ReturnType<typeof setTimeout> | null = null
let idCounter = 0
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`

export const findRuntime = (id: ChatRuntimeId) => CHAT_RUNTIMES.find((runtime) => runtime.id === id)!
export const findModel = (modelId: string) => CHAT_MODELS.find((model) => model.id === modelId)
export const findAgent = (agentId: string) => CHAT_AGENTS.find((agent) => agent.id === agentId) ?? CHAT_AGENTS[0]
export const modelsForRuntime = (runtime: ChatRuntimeId) => CHAT_MODELS.filter((model) => model.runtime === runtime)

const defaultComboFor = (agentId: string): ChatCombo => {
  const agent = findAgent(agentId)
  if (agent.defaultLaunch) return { ...agent.defaultLaunch }
  if (state.recents.length) return { ...state.recents[0] }
  const model = modelsForRuntime('autobyteus')[0]
  return { runtime: 'autobyteus', modelId: model.id, thinking: model.defaultThinking }
}

const resetDraft = () => {
  const combo = defaultComboFor(state.lastAgentId)
  state.draft = {
    agentId: state.lastAgentId,
    runtime: combo.runtime,
    modelId: combo.modelId,
    thinking: combo.thinking,
    workspaceId: TEMP_WORKSPACE_ID,
    text: '',
  }
}

const initialize = () => {
  const scenario = readScenario()
  if (state.initialized && state.scenario === scenario) return
  state.scenario = scenario
  const firstRun = scenario === 'chat_first_run'
  // Scenario-only: show a runtime that is not installed on this machine.
  findRuntime('grok_build').enabled = scenario !== 'chat_runtime_unavailable'
  state.chats = firstRun ? [] : clone(INITIAL_CHATS)
  state.recents = firstRun ? [] : clone(INITIAL_RECENTS)
  state.favorites = firstRun ? [] : [...INITIAL_FAVORITES]
  state.extraWorkspaces = []
  state.lastAgentId = 'daily-assistant'
  state.catalog = {
    autobyteus: 'ready',
    codex_app_server: firstRun ? 'idle' : 'ready',
    claude_agent_sdk: firstRun ? 'idle' : 'ready',
    antigravity_cli: 'idle',
    grok_build: 'idle',
  }
  state.catalogFailuresRemaining = scenario === 'chat_catalog_error' ? { antigravity_cli: 1 } : {}
  state.workspacePanelOpen = false
  state.loadedAt = Date.now()
  state.lastActivity = {}
  state.initialized = true
  resetDraft()
}

const showToast = (message: string) => {
  state.toast = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { state.toast = null }, 2600)
}

const ensureCatalog = (runtime: ChatRuntimeId) => {
  const definition = findRuntime(runtime)
  if (!definition.enabled) return
  if (state.catalog[runtime] === 'ready' || state.catalog[runtime] === 'loading') return
  state.catalog[runtime] = 'loading'
  setTimeout(() => {
    const failures = state.catalogFailuresRemaining[runtime] ?? 0
    if (failures > 0) {
      state.catalogFailuresRemaining[runtime] = failures - 1
      state.catalog[runtime] = 'error'
      return
    }
    state.catalog[runtime] = 'ready'
  }, Math.max(definition.catalogLatencyMs, 350))
}

const retryCatalog = (runtime: ChatRuntimeId) => {
  state.catalog[runtime] = 'idle'
  ensureCatalog(runtime)
}

const rememberCombo = (combo: ChatCombo) => {
  const key = comboKey(combo)
  state.recents = [combo, ...state.recents.filter((item) => comboKey(item) !== key)].slice(0, 4)
}

const toggleFavorite = (combo: { runtime: ChatRuntimeId; modelId: string }) => {
  const key = comboKey(combo)
  state.favorites = state.favorites.includes(key)
    ? state.favorites.filter((item) => item !== key)
    : [...state.favorites, key]
}

const isFavorite = (combo: { runtime: ChatRuntimeId; modelId: string }) => state.favorites.includes(comboKey(combo))

const setDraftAgent = (agentId: string) => {
  state.draft.agentId = agentId
  const agent = findAgent(agentId)
  if (agent.defaultLaunch) {
    state.draft.runtime = agent.defaultLaunch.runtime
    state.draft.modelId = agent.defaultLaunch.modelId
    state.draft.thinking = agent.defaultLaunch.thinking
  }
}

const setDraftContext = (agentId: string, workspaceId: string) => {
  setDraftAgent(agentId)
  state.draft.workspaceId = workspaceId
}

const chatActivityAt = (chat: ChatRecord) => new Date(state.lastActivity[chat.id] ?? state.loadedAt - chat.ageMinutes * 60_000).toISOString()

const setDraftCombo = (combo: ChatCombo) => {
  state.draft.runtime = combo.runtime
  state.draft.modelId = combo.modelId
  state.draft.thinking = combo.thinking ?? findModel(combo.modelId)?.defaultThinking
}

const allWorkspaces = computed<ChatWorkspace[]>(() => [...CHAT_WORKSPACES, ...state.extraWorkspaces])
const findWorkspace = (id: string) => allWorkspaces.value.find((workspace) => workspace.id === id) ?? CHAT_WORKSPACES[0]

const addWorkspace = (path: string): ChatWorkspace => {
  const trimmed = path.trim().replace(/\/+$/, '')
  const name = trimmed.split('/').filter(Boolean).pop() || trimmed
  const workspace = { id: nextId('ws'), name, path: trimmed }
  state.extraWorkspaces.push(workspace)
  return workspace
}

const titleFrom = (text: string) => {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > 42 ? `${clean.slice(0, 40).trimEnd()}…` : clean
}

const scriptedReply = (chat: ChatRecord, text: string): string => {
  const agent = findAgent(chat.agentId)
  const model = findModel(chat.modelId)
  const workspace = findWorkspace(chat.workspaceId)
  if (/skill/i.test(text)) {
    return `Sure. I can see ${agent.skills.length} skill${agent.skills.length === 1 ? '' : 's'} attached to ${agent.name} (${agent.skills.join(', ')}). Tell me which workflow you want to capture and I will draft a SKILL.md in ${workspace.name}.`
  }
  return `Got it — working on that now in ${workspace.name}. (Synthetic reply from ${agent.name} on ${model?.name ?? chat.modelId} · ${findRuntime(chat.runtime).label}.)`
}

// Always mutate through the reactive store so the UI observes streaming.
const liveChat = (chatId: string) => state.chats.find((item) => item.id === chatId)

const streamReply = (chatId: string, text: string) => {
  const chat = liveChat(chatId)
  if (!chat) return
  const full = scriptedReply(chat, text)
  const messageId = nextId('m')
  chat.messages.push({ id: messageId, role: 'assistant', text: '', streaming: true })
  chat.status = 'running'
  const words = full.split(/(\s+)/)
  let index = 0
  const tick = () => {
    const current = liveChat(chatId)
    const live = current?.messages.find((item) => item.id === messageId) as Extract<ChatMessage, { role: 'assistant' }> | undefined
    if (!current || !live || !live.streaming) return
    live.text += words.slice(index, index + 3).join('')
    index += 3
    if (index < words.length) {
      setTimeout(tick, 45)
    } else {
      live.streaming = false
      current.status = 'idle'
    }
  }
  setTimeout(tick, 350)
}

const startChat = async (): Promise<ChatRecord | null> => {
  const text = state.draft.text.trim()
  if (!text || state.starting) return null
  const runtime = findRuntime(state.draft.runtime)
  if (!runtime.enabled || !findModel(state.draft.modelId)) return null
  state.starting = true
  await new Promise((resolve) => setTimeout(resolve, 500))
  const chat: ChatRecord = {
    id: nextId('chat'),
    title: titleFrom(text),
    agentId: state.draft.agentId,
    runtime: state.draft.runtime,
    modelId: state.draft.modelId,
    thinking: state.draft.thinking,
    workspaceId: state.draft.workspaceId,
    group: 'Today',
    age: 'now',
    ageMinutes: 0,
    status: 'running',
    messages: [{ id: nextId('m'), role: 'user', text }],
  }
  state.chats.unshift(chat)
  state.lastActivity[chat.id] = Date.now()
  rememberCombo({ runtime: chat.runtime, modelId: chat.modelId, thinking: chat.thinking })
  state.lastAgentId = chat.agentId
  state.starting = false
  streamReply(chat.id, text)
  resetDraft()
  return liveChat(chat.id) ?? chat
}

const sendInChat = (chatId: string, text: string) => {
  const chat = state.chats.find((item) => item.id === chatId)
  if (!chat || !text.trim() || chat.status === 'running') return
  chat.messages.push({ id: nextId('m'), role: 'user', text: text.trim() })
  state.lastActivity[chat.id] = Date.now()
  streamReply(chat.id, text)
}

const stopChat = (chatId: string) => {
  const chat = state.chats.find((item) => item.id === chatId)
  if (!chat) return
  chat.messages.forEach((message) => { if (message.role === 'assistant') message.streaming = false })
  chat.status = 'idle'
}

const switchChatModel = (chatId: string, combo: ChatCombo) => {
  const chat = state.chats.find((item) => item.id === chatId)
  if (!chat || combo.runtime !== chat.runtime) return
  const changedModel = chat.modelId !== combo.modelId
  const changedThinking = chat.thinking !== combo.thinking
  if (!changedModel && !changedThinking) return
  chat.modelId = combo.modelId
  chat.thinking = combo.thinking
  const model = findModel(combo.modelId)
  const label = [model?.name ?? combo.modelId, combo.thinking].filter(Boolean).join(' · ')
  chat.messages.push({ id: nextId('m'), role: 'event', text: `Model switched to ${label}. It applies from the next message.` })
  rememberCombo(combo)
}

const deleteChat = (chatId: string) => {
  state.chats = state.chats.filter((chat) => chat.id !== chatId)
}

export function usePrototypeChat() {
  initialize()
  return {
    state,
    allWorkspaces,
    findWorkspace,
    addWorkspace,
    ensureCatalog,
    retryCatalog,
    toggleFavorite,
    isFavorite,
    setDraftAgent,
    setDraftContext,
    chatActivityAt,
    setDraftCombo,
    startChat,
    sendInChat,
    stopChat,
    switchChatModel,
    deleteChat,
    showToast,
    resetDraft,
    comboKey,
  }
}
