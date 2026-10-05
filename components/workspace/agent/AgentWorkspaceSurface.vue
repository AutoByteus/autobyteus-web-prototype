<template>
  <div class="flex h-full flex-col bg-white" data-testid="agent-workspace-surface">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-2 sm:px-4">
      <div class="flex min-w-0 flex-1 items-center space-x-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
          <img
            v-if="showAvatar"
            :src="avatarUrl"
            :alt="`${agentName} avatar`"
            class="h-full w-full object-cover"
            @error="avatarFailed = true"
          />
          <span v-else class="text-[0.625rem] font-semibold tracking-wide text-slate-600">{{ initials }}</span>
        </div>
        <h4 class="truncate text-base font-medium text-gray-800" :title="headerFullTitle" data-test="agent-workspace-title">{{ headerTitle }}</h4>
        <AgentStatusDisplay :status="target.context.state.currentStatus" />
      </div>
      <WorkspaceHeaderActions
        v-if="showHeaderActions"
        @new-agent="$emit('new-agent')"
        @edit-config="$emit('edit-config')"
      />
    </div>
    <WorkspaceRecoveryNotice
      v-if="recoveryNotice"
      :message="recoveryNotice"
    />
    <!-- task-run-resources-workspace-cleanup (DEC-005 alternative): this Task is DONE while its run is open. -->
    <div
      v-if="closedNotice"
      role="status"
      class="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700 sm:mx-4"
      data-test="task-closed-notice"
    >
      <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden="true" />
      <span class="min-w-0 flex-1">{{ closedNotice.message }}</span>
      <button
        type="button"
        class="flex-shrink-0 rounded-md px-2 py-1 font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        @click="$emit('closed-action')"
      >{{ closedNotice.action }}</button>
    </div>
    <div class="min-h-0 flex-1">
      <AgentEventMonitor
        :read-only="target.access === 'read_only' && !('root' in target && (target.context.submissionPending || target.kind === 'agent_org_direct_agent'))"
        :conversation="target.context.state.conversation"
        :run-id="target.context.state.runId"
        :agent-name="agentName"
        :agent-avatar-url="avatarUrl || null"
        :inter-agent-sender-name-by-id="senderNameByAgentRunId"
        :presentation-revision="target.context.state.eventMonitorPresentationRevision"
        :has-earlier-active-trace-events="target.context.state.hasEarlierActiveTraceEvents"
        :browse-subject="target.browse"
        :skill-tagging="skillTagging"
        :composer-placeholder="composerPlaceholder"
        class="h-full"
      >
        <template v-if="skillTarget" #composerContext>
          <SkillImprovementComposerCta :target="skillTarget" />
        </template>
      </AgentEventMonitor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { ActiveAgentWorkspaceTarget } from '~/types/workspace/activeAgentWorkspaceTarget'
import AgentEventMonitor from '~/components/workspace/agent/AgentEventMonitor.vue'
import AgentStatusDisplay from '~/components/workspace/agent/AgentStatusDisplay.vue'
import WorkspaceHeaderActions from '~/components/workspace/common/WorkspaceHeaderActions.vue'
import WorkspaceRecoveryNotice from '~/components/workspace/common/WorkspaceRecoveryNotice.vue'
import SkillImprovementComposerCta from '~/components/workspace/skill-improvement/SkillImprovementComposerCta.vue'
import type { SkillImprovementComposerCtaTarget } from '~/components/workspace/skill-improvement/skillImprovementComposerCtaTarget'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useStandaloneRunTitle } from '~/composables/chat/useStandaloneRunTitle'
import type { SkillTaggingCapability } from '~/composables/agentInput/useSkillTagMenu'

const props = withDefaults(defineProps<{
  target: ActiveAgentWorkspaceTarget
  showHeaderActions?: boolean
  recoveryNotice?: string | null
  /** `/` skill tags in the box; supplied only for standalone agent runs. */
  skillTagging?: SkillTaggingCapability | null
  /** Composer placeholder for a target without skill tags. */
  composerPlaceholder?: string | null
  /** task-run-resources-workspace-cleanup (DEC-005 alternative): the open run's Task is DONE. */
  closedNotice?: { message: string; action: string } | null
}>(), { showHeaderActions: false, recoveryNotice: null, skillTagging: null, composerPlaceholder: null, closedNotice: null })
defineEmits<{ (event: 'new-agent'): void; (event: 'edit-config'): void; (event: 'closed-action'): void }>()

const definitions = useAgentDefinitionStore()
const avatarFailed = ref(false)
const agentName = computed(() => props.target.context.config.agentDefinitionName || 'Agent')
const avatarUrl = computed(() => props.target.context.config.agentAvatarUrl?.trim()
  || definitions.getAgentDefinitionById(props.target.context.config.agentDefinitionId)?.avatarUrl?.trim()
  || '')
const showAvatar = computed(() => Boolean(avatarUrl.value) && !avatarFailed.value)
const initials = computed(() => agentName.value.split(/\s+/).filter(Boolean).slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '').join('') || 'AI')
// A standalone run is titled by its run summary (the first message), like its Workspaces tree row.
const standaloneRunTitle = useStandaloneRunTitle(computed(() =>
  props.target.kind === 'standalone_agent' ? props.target.context : null))
const fallbackTitle = computed(() => {
  if (props.target.context.state.runId.startsWith('temp-')) return `New - ${agentName.value}`
  const suffix = props.target.context.state.runId.slice(-4).toUpperCase()
  return `${agentName.value} - ${suffix}`
})
// A task child of a standalone run is titled by its name.
const isRunChild = computed(() => props.target.kind === 'agent_run_task_agent' || props.target.kind === 'agent_run_task_team_member')
const headerTitle = computed(() => isRunChild.value ? agentName.value : standaloneRunTitle.title.value ?? fallbackTitle.value)
const headerFullTitle = computed(() => isRunChild.value ? agentName.value : standaloneRunTitle.fullTitle.value ?? fallbackTitle.value)
const senderNameByAgentRunId = computed(() => 'collaborationMessages' in props.target
  ? Object.freeze(Object.fromEntries(Object.entries(
      props.target.collaborationMessages.memberIdentityByAgentRunId(),
    ).map(([agentRunId, identity]) => [agentRunId, identity.label])))
  : Object.freeze({}))
const skillTarget = computed<SkillImprovementComposerCtaTarget | null>(() =>
  props.target.kind === 'standalone_agent'
    ? {
        kind: 'agent',
        runId: props.target.context.state.runId,
        isHelperRun:
          props.target.context.config.agentDefinitionId === 'autobyteus-retrospective-skill-improver'
          || props.target.context.config.agentDefinitionName === 'Retrospective Skill Improver',
      }
    : null)

watch(avatarUrl, () => { avatarFailed.value = false })
</script>
