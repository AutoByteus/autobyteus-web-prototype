<template>
  <AgentWorkspaceSurface
    v-if="target"
    :target="target"
    :show-header-actions="true"
    :skill-tagging="skillTagging"
    :composer-placeholder="childPlaceholder"
    :closed-notice="closedNotice"
    @closed-action="backToHost"
    @new-agent="startNewChatForRun"
    @edit-config="openSelectedRunConfig"
  />
  <div v-else class="p-4 text-center text-gray-500">
    {{ $t('workspace.components.workspace.agent.AgentWorkspaceView.select_an_agent_or_start_a') }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AgentWorkspaceSurface from '~/components/workspace/agent/AgentWorkspaceSurface.vue'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useChatDraftStore } from '~/stores/chatDraftStore'
import { useWorkspaceCenterViewStore } from '~/stores/workspaceCenterViewStore'
import { useChatComposerOptions } from '~/composables/chat/useChatComposerOptions'
import { useAgentRunCollaborationSync } from '~/composables/agentCollaboration/useAgentRunCollaborationSync'
import type { SkillTaggingCapability } from '~/composables/agentInput/useSkillTagMenu'
import { DEFAULT_CHAT_AGENT_DEFINITION_ID } from '~/utils/chat/chatDefaults'
import { useLocalization } from '~/composables/useLocalization'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import { useAgentContextsStore } from '~/stores/agentContextsStore'

/**
 * The standalone agent run view (the chat run view, D-17): the product run header with ⚙ and ＋,
 * the conversation, and the product box with `/` skill tags. A collaborator of the run (F-04)
 * has the same header controls and a box that names it.
 */
const { t } = useLocalization()
const router = useRouter()
const active = useActiveContextStore()
const definitions = useAgentDefinitionStore()
const chatDraftStore = useChatDraftStore()
const center = useWorkspaceCenterViewStore()
// The run's own agent, or a task child brought into the run with `@`.
const target = computed(() => {
  const current = active.activeWorkspaceTarget
  return current && (current.kind === 'standalone_agent' || current.kind === 'agent_run_task_agent'
    || current.kind === 'agent_run_task_team_member') ? current : null
})
const isHost = computed(() => target.value?.kind === 'standalone_agent')
useAgentRunCollaborationSync()

const composerOptions = useChatComposerOptions(computed(() => target.value?.context.config.agentDefinitionId ?? null))
const skillTagging = computed<SkillTaggingCapability | null>(() => {
  const config = target.value?.context.config
  if (!config || !isHost.value) return null
  return {
    skills: composerOptions.skillOptions.value,
    allInstalled: composerOptions.skillsAllInstalled.value,
    placeholder: config.agentDefinitionId === DEFAULT_CHAT_AGENT_DEFINITION_ID
      ? t('chat.run.placeholderDefault')
      : t('chat.run.placeholderAgent', { agent: config.agentDefinitionName || '' }),
  }
})

/** F-04: a collaborator view names its agent in the box, like the Org's delegated-Agent view. */
const childPlaceholder = computed(() => {
  const config = target.value?.context.config
  return config && !isHost.value ? t('chat.run.placeholderAgent', { agent: config.agentDefinitionName || '' }) : null
})

// task-run-resources-workspace-cleanup (DEC-005 alternative): the open run's Task became DONE.
const collaboration = useAgentRunCollaborationStore()
const agentContexts = useAgentContextsStore()
const hostRunId = computed(() => target.value && 'host' in target.value ? target.value.host.hostRunId : null)
const closedNotice = computed(() => {
  if (!hostRunId.value || !collaboration.isSelectedChildClosed(hostRunId.value)) return null
  const hostName = agentContexts.getRun(hostRunId.value)?.config.agentDefinitionName || 'the run'
  return {
    message: t('workspace.history.task_closed.notice'),
    action: t('workspace.history.task_closed.back', { name: hostName }),
  }
})
const backToHost = () => { if (hostRunId.value) collaboration.selectChild(hostRunId.value, null) }

/** ＋ starts a New chat preset to this run's agent, workspace and settings (UIS-013 R3; run-settings-ui-unification). */
const startNewChatForRun = async () => {
  const config = target.value?.context.config
  if (!config) return
  chatDraftStore.startNewChat({
    agentDefinitionId: config.agentDefinitionId,
    workspaceRootPath: config.workspaceMetadata?.workspaceRootPath || undefined,
  })
  // run-settings-ui-unification: "+" copies the run's settings, as it does for Team and Org runs.
  if (config.llmModelIdentifier) {
    chatDraftStore.setModel({ runtimeKind: config.runtimeKind, llmModelIdentifier: config.llmModelIdentifier })
    chatDraftStore.setThinkingConfig(config.llmConfig ?? null)
  }
  chatDraftStore.setAutoExecuteTools(config.autoExecuteTools)
  await router.push('/chat')
}
const openSelectedRunConfig = () => { if (target.value) center.showConfig() }

onMounted(async () => {
  if (!definitions.agentDefinitions.length) await definitions.fetchAllAgentDefinitions().catch(() => undefined)
})
</script>
