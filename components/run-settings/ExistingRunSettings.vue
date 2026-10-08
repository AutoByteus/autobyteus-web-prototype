<template>
  <div class="flex min-h-0 flex-1 flex-col" data-test="existing-run-settings" :data-state="stateKey">
    <div class="flex-1 overflow-y-auto px-4 py-5">
      <div class="mx-auto max-w-2xl">
        <RunSubjectHeader :kind="kind" :name="name" :status="isActive ? 'active' : 'stopped'">
          <!-- REQ-014: a running run has a small red stop icon right after its status. -->
          <button
            v-if="isActive"
            type="button"
            class="-ml-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-default disabled:opacity-60"
            :disabled="stop.pending"
            :title="stop.label"
            :aria-label="stop.label"
            data-test="existing-run-stop"
            @click="emit('stop')"
          >
            <Icon icon="heroicons:stop-20-solid" class="h-4 w-4" :class="stop.pending ? 'animate-pulse motion-reduce:animate-none' : ''" aria-hidden="true" />
          </button>
        </RunSubjectHeader>

        <!-- agent-definition-reconnect-ui: one line per agent of this run that no longer exists, in the
             same note style as "needs a refresh"; after a reconnect, the outcome for that agent. -->
        <!-- Round 4: the same one-line amber / green bars as above the message box (14px, coloured). -->
        <div v-if="missingAgents.length || reconnectedNotes.length" class="-mt-1 mb-4 space-y-2" data-test="existing-run-reconnect-notes">
          <p
            v-for="agent in missingAgents"
            :key="agent.agentRunId"
            class="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 py-1.5 pl-3 pr-1.5 text-[0.8125rem] text-amber-900"
            role="alert"
            :data-test="`existing-run-agent-missing-${agent.agentRunId}`"
          >
            <Icon icon="heroicons:exclamation-triangle-20-solid" class="h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden="true" />
            <span class="min-w-0 flex-1 break-words" :title="$t('reconnect.tree.missing', { id: agent.missingDefinitionId })">
              {{ agent.address
                ? $t('reconnect.settings.missingMember', { name: agent.name, id: agent.missingDefinitionId })
                : $t('reconnect.settings.missingRun', { id: agent.missingDefinitionId }) }}
            </span>
            <button
              type="button"
              class="flex-shrink-0 rounded-md px-2 py-1 font-medium text-amber-900 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :aria-label="$t('reconnect.actionAria', { name: agent.name })"
              :data-test="`existing-run-reconnect-${agent.agentRunId}`"
              @click="reconnectTarget = agent"
            >
              {{ $t('reconnect.action') }}
            </button>
          </p>
          <p
            v-for="note in reconnectedNotes"
            :key="note.agentRunId"
            class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[0.8125rem] text-emerald-900"
            role="status"
            :data-test="`existing-run-reconnected-${note.agentRunId}`"
          >
            <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" />
            <span class="min-w-0">
              {{ note.address
                ? $t('reconnect.settings.reconnectedMember', { name: note.name, agent: note.agentName })
                : $t('reconnect.settings.reconnectedRun', { agent: note.agentName }) }}
              <span v-if="note.runCount > 1" class="text-emerald-700"> · {{ $t('reconnect.done.runs', { count: note.runCount }) }}</span>
              <span v-if="note.instructionsFromNewSession" class="text-emerald-700">{{ $t('reconnect.settings.instructions', { runtime: note.runtime }) }}</span>
            </span>
          </p>
        </div>
        <ReconnectAgentDialog :open="reconnectTarget !== null" :missing="reconnectTarget" @close="onReconnectClosed" />

        <!-- Only what the settings cannot show themselves: a needed refresh, a run whose settings
             cannot change, a failed stop or save. -->
        <p
          v-if="note"
          class="-mt-2 mb-4 flex items-center gap-1.5 text-xs"
          :class="note.tone === 'warning' ? 'text-amber-700' : note.tone === 'error' ? 'text-red-600' : 'text-gray-500'"
          :role="note.tone === 'info' ? 'status' : 'alert'"
          data-test="existing-run-note"
        >
          <Icon :icon="note.tone === 'info' ? 'heroicons:lock-closed' : 'heroicons:exclamation-triangle'" class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{{ note.text }}</span>
          <button
            v-if="note.refresh"
            type="button"
            class="rounded px-1 font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            data-test="existing-run-refresh"
            @click="emit('refresh')"
          >
            {{ $t('runSettings.existing.refresh') }}
          </button>
        </p>

        <div class="rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm" data-test="existing-run-root-card">
          <RunSettingsCard
            :values="root"
            :locked="rootLocked"
            runtime-locked
            :locked-models="rootLockedModels"
            :model-unavailable="rootModelUnavailable"
            test-suffix="root"
            @change="emit('change-root', $event)"
          />
        </div>

        <RunMembersSection
          v-if="members.length"
          :title="$t('runSettings.members.title')"
          :nodes="members"
          :locked="memberLocked"
          runtime-locked
          :locked-models-for="lockedModelsFor"
          read-only
          @change="(key, change) => emit('change-member', key, change)"
        />
      </div>
    </div>

    <!-- The Save bar appears only after a change (REQ-015). -->
    <div v-if="dirty || saving || saved" class="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3" data-test="existing-run-save-bar">
      <p class="min-w-0 flex-1 truncate text-xs" :class="saved && !dirty ? 'text-emerald-700' : 'text-gray-600'" role="status" aria-live="polite">
        {{ saved && !dirty && !saving ? $t('runSettings.save.saved') : $t('runSettings.save.unsavedResumes') }}
      </p>
      <template v-if="dirty || saving">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          :disabled="saving"
          data-test="existing-run-cancel"
          @click="emit('cancel')"
        >
          {{ $t('runSettings.save.cancel') }}
        </button>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          :disabled="saving || !canSave"
          data-test="save-existing-model-config"
          @click="emit('save')"
        >
          {{ saving ? $t('runSettings.save.saving') : $t('runSettings.save.save') }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import type { ChatModelOption } from '~/composables/chat/useChatModelCatalog'
import type { RunMemberSettingChange, RunSettingFlags, RunSettingsValues } from '~/types/runSettings/RunSettings'
import type { RunMemberNode } from '~/utils/runSettings/runMemberTree'
import RunMembersSection from './RunMembersSection.vue'
import RunSettingsCard from './RunSettingsCard.vue'
import RunSubjectHeader from './RunSubjectHeader.vue'
import ReconnectAgentDialog from '~/components/workspace/reconnect/ReconnectAgentDialog.vue'
import { MISSING_MEMBER_ADDRESSES, useAgentReconnect, type MissingAgent } from '~/composables/agentReconnect/useAgentReconnect'
import { subjectFor } from '~/prototype/agent-reconnect/agentReconnectFixture'

/**
 * UIS-003: a saved run's settings. Runtime, workspace and tool approval are fixed (a lock); model,
 * thinking and other model settings change only while the run is stopped; a placed team's
 * workspace changes when stopped. The container maps `existingRunConfigStore` into these props.
 */
const props = withDefaults(defineProps<{
  kind: 'agent' | 'team' | 'org'
  name: string
  isActive: boolean
  /** Model and thinking can change now (stopped, editable, nothing in flight). */
  canEdit: boolean
  state: 'editable' | 'read_only' | 'refresh_required'
  stop: Readonly<{ label: string; pending: boolean; error: string | null }>
  root: RunSettingsValues
  rootLockedModels?: readonly ChatModelOption[] | null
  rootModelUnavailable?: boolean
  members?: readonly RunMemberNode[]
  lockedModelsFor?: ((key: string) => readonly ChatModelOption[] | null) | null
  dirty: boolean
  canSave: boolean
  saving: boolean
  saved: boolean
  /** A failed save, surfaced as is. */
  saveError?: string | null
  /** agent-definition-reconnect-ui: the standalone run or team run these settings belong to. */
  rootRunId?: string | null
}>(), { rootLockedModels: null, rootModelUnavailable: false, members: () => [], lockedModelsFor: null, saveError: null, rootRunId: null })

const emit = defineEmits<{
  (event: 'stop'): void
  (event: 'refresh'): void
  (event: 'change-root', change: RunMemberSettingChange): void
  (event: 'change-member', key: string, change: RunMemberSettingChange): void
  (event: 'cancel'): void
  (event: 'save'): void
}>()

const { t } = useLocalization()

// agent-definition-reconnect-ui: agents of this run that no longer exist, and reconnect outcomes.
const reconnect = useAgentReconnect()
const missingAgents = computed(() => reconnect.missingInRoot(props.rootRunId))
const reconnectTarget = ref<MissingAgent | null>(null)
const reconnectedIds = ref<string[]>([])
const reconnectedNotes = computed(() => reconnectedIds.value
  .map((agentRunId) => {
    const notice = reconnect.noticeFor(agentRunId)
    const to = reconnect.reconnectedAgent(agentRunId)
    const subject = subjectFor(agentRunId)
    if (!to || !subject) return null
    return {
      agentRunId,
      address: subject.address,
      name: subject.memberKind === 'collaborator' ? subject.address!.slice(1).replace(/_/g, ' ') : subject.address?.slice(1) ?? '',
      agentName: to.name,
      instructionsFromNewSession: notice?.instructionsFromNewSession ?? false,
      runCount: notice?.runCount ?? 1,
      runtime: notice?.runtime ?? '',
    }
  })
  .filter((note): note is NonNullable<typeof note> => note !== null))
const onReconnectClosed = () => {
  const target = reconnectTarget.value
  reconnectTarget.value = null
  if (target && reconnect.reconnectedAgent(target.agentRunId) && !reconnectedIds.value.includes(target.agentRunId)) {
    reconnectedIds.value = [...reconnectedIds.value, target.agentRunId]
  }
}
/** Member rows of agents that no longer exist say so (RunMemberRow). */
provide(MISSING_MEMBER_ADDRESSES, computed(() => new Set(missingAgents.value.map((agent) => agent.address).filter(Boolean) as string[])))

const rootLocked = computed<RunSettingFlags>(() => ({ workspace: true, approval: true, model: !props.canEdit, thinking: !props.canEdit }))
const memberLocked = computed<RunSettingFlags>(() => ({
  workspace: !(props.kind === 'org' && props.canEdit),
  approval: true,
  model: !props.canEdit,
  thinking: !props.canEdit,
}))

const note = computed(() => {
  if (props.state === 'refresh_required') return { tone: 'warning', text: t('runSettings.existing.refreshNote'), refresh: true }
  if (props.stop.error) return { tone: 'error', text: props.stop.error, refresh: false }
  if (props.saveError) return { tone: 'error', text: props.saveError, refresh: false }
  if (props.state === 'read_only' && !props.isActive) return { tone: 'info', text: t('runSettings.existing.readOnlyNote'), refresh: false }
  return null
})

const stateKey = computed(() => {
  if (props.state === 'refresh_required') return 'refresh-required'
  if (props.isActive) return props.stop.pending ? 'stopping' : 'active'
  return props.state === 'read_only' ? 'read-only' : 'stopped'
})
</script>
