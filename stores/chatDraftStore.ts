import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AgentContext } from '~/types/agent/AgentContext'
import { AgentRunState } from '~/types/agent/AgentRunState'
import { DEFAULT_AGENT_RUNTIME_KIND, type AgentRunConfig } from '~/types/agent/AgentRunConfig'
import type { Conversation } from '~/types/conversation'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { useRuntimeAvailabilityStore } from '~/stores/runtimeAvailabilityStore'
import { useLLMProviderConfigStore } from '~/stores/llmProviderConfig'
import { normalizeDefaultLaunchConfig } from '~/types/launch/defaultLaunchConfig'
import { readChatLastModel } from '~/utils/chat/chatLastModelPreference'
import { DEFAULT_CHAT_AGENT_DEFINITION_ID, TEMP_WORKSPACE_ID } from '~/utils/chat/chatDefaults'
import { applyModelConfigSchemaDefaults, type UiModelConfigSchema } from '~/utils/llmConfigSchema'
import { getDefaultThinkingConfig, getThinkingParamKeys } from '~/utils/llmThinkingConfigAdapter'

/** Who a New chat is addressed to. */
export type ChatTarget =
  | Readonly<{ kind: 'agent'; agentDefinitionId: string }>
  | Readonly<{ kind: 'team'; teamDefinitionId: string }>

/**
 * run-settings-ui-unification (round 2): what one Team member (or, on the Org launch page, an Org member or placed team) sets itself
 * instead of the composer's settings. Absent fields follow the defaults.
 */
export type ChatMemberSettings = Readonly<{
  runtimeKind?: string
  llmModelIdentifier?: string
  llmConfig?: Record<string, unknown> | null
  autoExecuteTools?: boolean
  workspace?: ChatDraftWorkspace
}>

/** Where a New chat's files live, chosen before the first message. */
export type ChatDraftWorkspace =
  | Readonly<{ kind: 'existing'; workspaceId: string }>
  | Readonly<{ kind: 'folder'; rootPath: string }>

export interface ChatDraft {
  /** chat-new-draft-kept-on-navigation: stable draft identity (the context's temp run id can change on send). */
  id: string
  /** When the New chat was started; Draft rows are listed newest first by this time. */
  createdAt: number
  /** The unregistered `temp-*` context: text, tags, attachments, runtime, model and thinking. */
  context: AgentContext
  target: ChatTarget
  workspace: ChatDraftWorkspace
  autoExecuteTools: boolean
  /** Per-member exceptions by member address (`/writer`, `/review-team/writer`). */
  memberSettings: Record<string, ChatMemberSettings>
  /** Set while the first send is in flight; the New chat page renders the starting state from it. */
  starting: boolean
}

export interface ChatModelSelection {
  runtimeKind: string
  llmModelIdentifier: string
}

/**
 * The model config a New chat records for a model (D-18, IC-3): the launch form's non-thinking
 * schema defaults plus the model's default thinking parameters, written explicitly, over any
 * preset config (a definition's default launch config keeps its own values). A model without a
 * config schema records `null`.
 */
export const explicitChatModelConfig = (
  schema: UiModelConfigSchema | null,
  preset: Record<string, unknown> | null = null,
): Record<string, unknown> | null => {
  if (!schema || Object.keys(schema).length === 0) return preset
  const next: Record<string, unknown> = { ...(applyModelConfigSchemaDefaults(schema, preset) ?? {}) }
  // A preset that already chose thinking keeps its choice; otherwise record the default thinking.
  if (!getThinkingParamKeys(schema).some((key) => next[key] !== undefined)) {
    Object.assign(next, getDefaultThinkingConfig(schema))
  }
  return Object.keys(next).length > 0 ? next : preset
}

/**
 * chat-new-draft-kept-on-navigation (REQ-001, round 3): a New chat is a Draft once it has typed text.
 * Attachments, `/` skills, target, model and workspace alone do not make a draft; such a New chat is
 * not kept when another one starts.
 */
export const chatDraftHasContent = (draft: ChatDraft): boolean => {
  const text = draft.context.requirement.trim()
  // A lone `/command` being typed opens the skill menu; it is not yet the user's text.
  return text.length > 0 && !/^\/\S*$/.test(text)
}

let chatDraftSequence = 0
const nextDraftRunId = (): string => `temp-chat-${Date.now()}-${++chatDraftSequence}`

const buildDraftContext = (agent: { id: string; name: string; avatarUrl?: string | null }): AgentContext => {
  const runId = nextDraftRunId()
  const now = new Date().toISOString()
  const conversation: Conversation = {
    id: runId,
    messages: [],
    createdAt: now,
    updatedAt: now,
    agentDefinitionId: agent.id,
  }
  const config: AgentRunConfig = {
    agentDefinitionId: agent.id,
    agentDefinitionName: agent.name,
    agentAvatarUrl: agent.avatarUrl ?? null,
    llmModelIdentifier: '',
    runtimeKind: DEFAULT_AGENT_RUNTIME_KIND,
    workspaceId: null,
    workspaceMetadata: null,
    autoExecuteTools: true,
    isLocked: false,
    llmConfig: null,
  }
  return new AgentContext(config, new AgentRunState(runId, conversation))
}

/**
 * @store chatDraft
 * @description Owns the New chat draft: an unregistered agent context plus target,
 * workspace and approval. It never sends or routes; `chatLaunchService` does.
 */
export const useChatDraftStore = defineStore('chatDraft', () => {
  // chat-new-draft-kept-on-navigation: every New chat is kept until it is sent or discarded.
  // Deeply reactive: the composer edits the open draft's text, tags and attachments in place.
  const drafts = ref<ChatDraft[]>([])
  const activeDraftId = ref<string | null>(null)
  const draft = computed<ChatDraft | null>(() => drafts.value.find((entry) => entry.id === activeDraftId.value) ?? null)
  // Bumped whenever the model is chosen explicitly, so a late default resolution never overrides it.
  let modelChoiceGeneration = 0

  const agentDefinitions = () => useAgentDefinitionStore()

  const agentIdentity = (agentDefinitionId: string) => {
    const definition = agentDefinitions().getAgentDefinitionById(agentDefinitionId)
    return {
      id: agentDefinitionId,
      name: definition?.name ?? '',
      avatarUrl: definition?.avatarUrl ?? null,
    }
  }

  const resolveInitialWorkspace = (workspaceRootPath?: string): ChatDraftWorkspace => {
    if (workspaceRootPath) {
      const existing = useWorkspaceStore().findWorkspaceInfoByRootPath(workspaceRootPath)
      return existing
        ? { kind: 'existing', workspaceId: existing.workspaceId }
        : { kind: 'folder', rootPath: workspaceRootPath }
    }
    return { kind: 'existing', workspaceId: useWorkspaceStore().tempWorkspaceId ?? TEMP_WORKSPACE_ID }
  }

  /** Leaving a draft: one without content is not kept (REQ-001, REQ-008). */
  const leaveActiveDraft = () => {
    const current = draft.value
    if (current && !current.starting && !chatDraftHasContent(current)) {
      drafts.value = drafts.value.filter((entry) => entry.id !== current.id)
    }
    activeDraftId.value = null
  }

  /**
   * Open a fresh New chat with defaults (Daily Assistant, temp workspace, Auto-approve, last-used model),
   * or with a preset agent and workspace (tree `+`). An earlier draft with content is kept as a
   * Draft row (REQ-004, REQ-005); nothing is ever discarded by starting a new chat.
   */
  const startNewChat = (preset: { agentDefinitionId?: string; workspaceRootPath?: string } = {}): ChatDraft => {
    leaveActiveDraft()
    const agentDefinitionId = preset.agentDefinitionId ?? DEFAULT_CHAT_AGENT_DEFINITION_ID
    const context = buildDraftContext(agentIdentity(agentDefinitionId))
    const lastModel = readChatLastModel()
    if (lastModel) {
      context.config.runtimeKind = lastModel.runtimeKind
      context.config.llmModelIdentifier = lastModel.llmModelIdentifier
    }
    const next: ChatDraft = {
      id: context.state.runId,
      createdAt: Date.now(),
      context,
      target: { kind: 'agent', agentDefinitionId },
      workspace: resolveInitialWorkspace(preset.workspaceRootPath),
      autoExecuteTools: true,
      memberSettings: {},
      starting: false,
    }
    drafts.value = [...drafts.value, next]
    activeDraftId.value = next.id
    modelChoiceGeneration += 1
    const reactiveDraft = draft.value!
    void resolveDefaultModel(reactiveDraft, modelChoiceGeneration)
    return reactiveDraft
  }

  /** Re-enter a kept draft exactly as it was left (REQ-003). */
  const openDraft = (id: string): ChatDraft | null => {
    if (activeDraftId.value === id) return draft.value
    if (!drafts.value.some((entry) => entry.id === id)) return null
    leaveActiveDraft()
    activeDraftId.value = id
    return draft.value
  }

  /** Delete a draft (REQ-007). Discarding the open draft leaves a fresh New chat behind it. */
  const discardDraft = (id: string) => {
    const wasActive = activeDraftId.value === id
    drafts.value = drafts.value.filter((entry) => entry.id !== id)
    if (wasActive) {
      activeDraftId.value = null
      startNewChat()
    }
  }

  /** A sent draft belongs to its run now (REQ-006): its row goes, and New chat starts fresh. */
  const finishSentDraft = (sent: ChatDraft) => {
    drafts.value = drafts.value.filter((entry) => entry.id !== sent.id)
    if (activeDraftId.value === sent.id) activeDraftId.value = null
    startNewChat()
  }

  /** Kept drafts with content, newest first (REQ-002). */
  const keptDrafts = computed(() => drafts.value
    .filter((entry) => chatDraftHasContent(entry))
    .sort((a, b) => b.createdAt - a.createdAt))

  const ensureDraft = (): ChatDraft => draft.value ?? startNewChat()

  /**
   * Preselection order (REQ-019): the last-used runtime + model when its runtime is enabled and
   * the model exists; otherwise Daily Assistant's default launch config; otherwise the runtime default.
   */
  const resolveDefaultModel = async (target: ChatDraft, generation: number): Promise<void> => {
    const availability = useRuntimeAvailabilityStore()
    const catalogs = useLLMProviderConfigStore()
    const isCurrent = () => draft.value === target && generation === modelChoiceGeneration
    const modelExists = async (selection: ChatModelSelection): Promise<boolean> => {
      if (!availability.isRuntimeEnabled(selection.runtimeKind)) return false
      await catalogs.fetchProvidersWithModels(selection.runtimeKind).catch(() => undefined)
      return catalogs.models(selection.runtimeKind).includes(selection.llmModelIdentifier)
    }
    try {
      await availability.fetchRuntimeAvailabilities().catch(() => undefined)
      const lastModel = readChatLastModel()
      if (lastModel && await modelExists(lastModel)) {
        if (isCurrent()) applyModel(lastModel)
        return
      }
      if (!agentDefinitions().agentDefinitions.length) {
        await agentDefinitions().fetchAllAgentDefinitions().catch(() => undefined)
      }
      if (!isCurrent()) return
      // Late-loaded definitions: fill in the draft agent's display identity.
      refreshAgentIdentity(target)
      const assistantDefaults = normalizeDefaultLaunchConfig(
        agentDefinitions().getAgentDefinitionById(DEFAULT_CHAT_AGENT_DEFINITION_ID)?.defaultLaunchConfig,
      )
      if (assistantDefaults?.runtimeKind && assistantDefaults.llmModelIdentifier) {
        const selection = {
          runtimeKind: assistantDefaults.runtimeKind,
          llmModelIdentifier: assistantDefaults.llmModelIdentifier,
        }
        if (await modelExists(selection)) {
          if (isCurrent()) applyModel(selection, assistantDefaults.llmConfig ?? null)
          return
        }
      }
      const runtimeKind = DEFAULT_AGENT_RUNTIME_KIND
      await catalogs.fetchProvidersWithModels(runtimeKind).catch(() => undefined)
      const firstModel = catalogs.models(runtimeKind)[0]
      if (isCurrent()) applyModel({ runtimeKind, llmModelIdentifier: firstModel ?? '' })
    } catch (error) {
      console.warn('Failed to resolve the New chat default model:', error)
    }
  }

  const refreshAgentIdentity = (target: ChatDraft) => {
    if (target.target.kind !== 'agent') return
    const identity = agentIdentity(target.target.agentDefinitionId)
    if (!identity.name) return
    target.context.config.agentDefinitionName = identity.name
    target.context.config.agentAvatarUrl = identity.avatarUrl
  }

  const applyModel = (selection: ChatModelSelection, llmConfig: Record<string, unknown> | null = null) => {
    const current = draft.value
    if (!current) return
    current.context.config.runtimeKind = selection.runtimeKind
    current.context.config.llmModelIdentifier = selection.llmModelIdentifier
    // Choosing a model applies that model's defaults, recorded explicitly so the run's settings
    // show them (not "Not recorded").
    const schema = useLLMProviderConfigStore().modelConfigSchemaByIdentifier(selection.runtimeKind, selection.llmModelIdentifier)
    current.context.config.llmConfig = explicitChatModelConfig(schema, llmConfig)
  }

  /** An explicit model choice from the model menu. */
  const setModel = (selection: ChatModelSelection) => {
    modelChoiceGeneration += 1
    applyModel(selection)
  }

  const setThinkingConfig = (llmConfig: Record<string, unknown> | null) => {
    const current = draft.value
    if (!current) return
    current.context.config.llmConfig = llmConfig
  }

  /**
   * Address the draft to another agent (`@`, `×`) or to a team. The typed text, attachments
   * (same draft id, so the upload owner is unchanged), workspace, approval and model are kept;
   * requested skills are cleared because the skill pool follows the target.
   */
  const setTarget = (target: ChatTarget) => {
    const current = draft.value
    if (!current) return
    if (target.kind === 'agent') {
      const identity = agentIdentity(target.agentDefinitionId)
      current.context.config = {
        ...current.context.config,
        agentDefinitionId: identity.id,
        agentDefinitionName: identity.name,
        agentAvatarUrl: identity.avatarUrl,
      }
      // PrepareAgentRun reads the conversation's definition id.
      current.context.state.conversation.agentDefinitionId = identity.id
    }
    current.context.requestedSkillNames = []
    const sameTarget = JSON.stringify(current.target) === JSON.stringify(target)
    current.target = target
    if (!sameTarget) current.memberSettings = {}
  }

  /** Replace one member's own settings; an empty object returns it to the defaults. */
  const setMemberSettings = (address: string, settings: ChatMemberSettings | null) => {
    const current = draft.value
    if (!current) return
    const next = { ...current.memberSettings }
    if (settings && Object.keys(settings).length) next[address] = settings
    else delete next[address]
    current.memberSettings = next
  }

  const resetAllMemberSettings = () => {
    if (draft.value) draft.value.memberSettings = {}
  }

  const setWorkspace = (workspace: ChatDraftWorkspace) => {
    if (!draft.value) return
    draft.value.workspace = workspace
  }

  const setAutoExecuteTools = (autoExecuteTools: boolean) => {
    if (!draft.value) return
    draft.value.autoExecuteTools = autoExecuteTools
  }

  const markStarting = (target: ChatDraft) => {
    target.starting = true
  }

  const clearStarting = (target: ChatDraft) => {
    target.starting = false
  }

  return {
    draft,
    drafts: computed(() => drafts.value),
    keptDrafts,
    activeDraftId: computed(() => activeDraftId.value),
    startNewChat,
    ensureDraft,
    openDraft,
    discardDraft,
    finishSentDraft,
    setTarget,
    setMemberSettings,
    resetAllMemberSettings,
    setWorkspace,
    setAutoExecuteTools,
    setModel,
    setThinkingConfig,
    markStarting,
    clearStarting,
  }
})
