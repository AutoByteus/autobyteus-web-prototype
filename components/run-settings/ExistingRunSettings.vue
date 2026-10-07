<template>
  <div class="flex min-h-0 flex-1 flex-col" data-test="existing-run-settings" :data-state="stateKey">
    <div class="flex-1 overflow-y-auto px-4 py-5">
      <div class="mx-auto max-w-2xl">
        <!-- Round 23/24/26: a running run has just a small red stop icon right after its status (no box);
             the lock icons on the settings already show what cannot change while it runs. -->
        <RunSubjectHeader :kind="kind" :name="name" :status="isActive ? 'active' : 'stopped'">
          <button
            v-if="isActive"
            type="button"
            class="-ml-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-default disabled:opacity-60"
            :disabled="stopping"
            :title="stopLabel"
            :aria-label="stopLabel"
            data-test="existing-run-stop"
            @click="emit('stop')"
          >
            <Icon icon="heroicons:stop-20-solid" class="h-4 w-4" :class="stopping ? 'animate-pulse' : ''" aria-hidden="true" />
          </button>
        </RunSubjectHeader>

        <!-- agent-definition-reconnect-ui: one line per agent of this run that no longer exists, in the
             same note style as "needs a refresh"; after a reconnect, the outcome for that agent. -->
        <div v-if="missingAgents.length || reconnectedNotes.length" class="-mt-2 mb-4 space-y-1" data-test="existing-run-reconnect-notes">
          <p
            v-for="agent in missingAgents"
            :key="agent.agentRunId"
            class="flex items-center gap-1.5 text-xs text-amber-700"
            role="alert"
            :data-test="`existing-run-agent-missing-${agent.agentRunId}`"
          >
            <Icon icon="heroicons:exclamation-triangle" class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span class="min-w-0" :title="$t('reconnect.tree.missing', { id: agent.missingDefinitionId })">
              {{ agent.address
                ? $t('reconnect.settings.missingMember', { name: agent.name, id: agent.missingDefinitionId })
                : $t('reconnect.settings.missingRun', { id: agent.missingDefinitionId }) }}
            </span>
            <button
              type="button"
              class="flex-shrink-0 rounded px-1 font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
            class="flex items-start gap-1.5 text-xs text-emerald-700"
            role="status"
            :data-test="`existing-run-reconnected-${note.agentRunId}`"
          >
            <Icon icon="heroicons:check-circle" class="mt-px h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span class="min-w-0">
              {{ note.address
                ? $t('reconnect.settings.reconnectedMember', { name: note.name, agent: note.agentName })
                : $t('reconnect.settings.reconnectedRun', { agent: note.agentName }) }}
              <span v-if="note.instructionsFromNewSession" class="text-gray-500">{{ $t('reconnect.settings.instructions', { runtime: note.runtime }) }}</span>
            </span>
          </p>
        </div>
        <ReconnectAgentDialog :open="reconnectTarget !== null" :missing="reconnectTarget" @close="onReconnectClosed" />

        <!-- Only what the settings themselves cannot show: a needed refresh, a run whose settings
             cannot change, or a failed stop. -->
        <p
          v-if="refreshRequired || stopError || (lockedForModel && !isActive)"
          class="-mt-2 mb-4 flex items-center gap-1.5 text-xs"
          :class="refreshRequired ? 'text-amber-700' : stopError ? 'text-red-600' : 'text-gray-500'"
          :role="refreshRequired || stopError ? 'alert' : 'status'"
          data-test="existing-run-note"
        >
          <Icon :icon="refreshRequired || stopError ? 'heroicons:exclamation-triangle' : 'heroicons:lock-closed'" class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{{ refreshRequired ? $t('runSettings.existing.refreshNote') : stopError ? stopError : $t('runSettings.existing.readOnlyNote') }}</span>
          <button
            v-if="refreshRequired"
            type="button"
            class="rounded px-1 font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            data-test="existing-run-refresh"
            @click="emit('refresh')"
          >
            {{ $t('runSettings.existing.refresh') }}
          </button>
        </p>

        <!-- Round 20: no "Team defaults" title and no "Files are saved in …" line; the card is the
             run's settings and the locked workspace shows its path on hover. -->
        <!-- Round 20: the same white card as an opened member, without row dividers. -->
        <div class="rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm" data-test="existing-run-root-card">
          <RunSettingsCard
            :values="rootValues"
            :locked="rootLocked"
            runtime-locked
            :model-unavailable="modelUnavailable"
            test-suffix="root"
            @update:model="edit(rootAddress, { runtimeKind: $event.runtimeKind, llmModelIdentifier: $event.llmModelIdentifier, llmConfig: presentation.defaultConfigFor($event) })"
            @update:thinking="edit(rootAddress, { llmConfig: $event })"
          />
        </div>

        <!-- Round 20: the same member rows as the member panel in New chat. -->
        <RunMembersSection
          v-if="memberNodes.length"
          :title="$t('runSettings.members.title')"
          :nodes="memberNodes"
          :locked="memberLocked"
          runtime-locked
          read-only
          @update="updateMember"
        />
      </div>
    </div>

    <!-- Save appears only when something changed. -->
    <div v-if="dirty || feedback" class="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3" data-test="existing-run-save-bar">
      <p class="min-w-0 flex-1 truncate text-xs" :class="feedback ? 'text-emerald-700' : 'text-gray-600'" role="status" aria-live="polite">
        {{ feedback || $t('runSettings.save.unsavedResumes') }}
      </p>
      <template v-if="dirty">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          :disabled="saving"
          data-test="existing-run-discard"
          @click="discard"
        >
          {{ $t('runSettings.save.cancel') }}
        </button>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          :disabled="saving"
          data-test="save-existing-model-config"
          @click="save"
        >
          {{ saving ? $t('runSettings.save.saving') : $t('runSettings.save.save') }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { ExistingTeamFormMemberNode } from '~/types/agent/ExistingTeamRunFormModel'
import { useLocalization } from '~/composables/useLocalization'
import RunSubjectHeader from './RunSubjectHeader.vue'
import RunSettingsCard from './RunSettingsCard.vue'
import RunMembersSection from './RunMembersSection.vue'
import { buildExistingMemberNodes } from './memberNodes'
import type { RunModelChoice, RunSettingField, RunSettingFlags, RunSettingsValues } from './runSettings'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'
import ReconnectAgentDialog from '~/components/workspace/reconnect/ReconnectAgentDialog.vue'
import { useAgentReconnect, type MissingAgent } from '~/composables/agentReconnect/useAgentReconnect'
import { subjectFor } from '~/prototype/agent-reconnect/agentReconnectFixture'
import { MISSING_MEMBER_ADDRESSES } from './runSettings'

/**
 * Saved-run settings (SCN-004). Runtime, workspace and tool approval are fixed for the run and
 * read as plain values with a lock; model and thinking change only while the run is stopped.
 * Save is scripted in the UI reference: it keeps the change locally and confirms it.
 */
const props = withDefaults(defineProps<{
  kind: 'agent' | 'team' | 'org'
  name: string
  isActive: boolean
  editable: boolean
  refreshRequired?: boolean
  modelUnavailable?: boolean
  baseValues: RunSettingsValues
  rootAddress?: string
  members?: readonly ExistingTeamFormMemberNode[]
  /** A stop request for this run is in flight. */
  stopping?: boolean
  stopError?: string | null
  /** agent-definition-reconnect-ui: the standalone run or team run these settings belong to. */
  rootRunId?: string | null
}>(), { refreshRequired: false, modelUnavailable: false, rootAddress: '/', members: () => [], stopping: false, stopError: null, rootRunId: null })
const emit = defineEmits<{ (event: 'refresh'): void; (event: 'stop'): void }>()

const { t } = useLocalization()
// SR-003: the same verbs as the workspace tree's stop buttons (Agent / Team: Terminate; Org: Stop).
const stopLabel = computed(() => {
  if (props.kind === 'org') return props.stopping ? t('runSettings.existing.stopping') : t('workspace.agentOrg.history.stopLabel')
  if (props.stopping) return t('runSettings.existing.terminating')
  return props.kind === 'team'
    ? t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_team')
    : t('workspace.components.workspace.history.WorkspaceHistoryWorkspaceSection.terminate_run')
})
const presentation = useRunSettingsPresentation()

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

const saved = ref<Record<string, Partial<RunSettingsValues>>>({})
const edits = ref<Record<string, Partial<RunSettingsValues>>>({})
const saving = ref(false)
const feedback = ref('')
let feedbackTimer: ReturnType<typeof setTimeout> | null = null
onBeforeUnmount(() => { if (feedbackTimer) clearTimeout(feedbackTimer) })

const overlay = computed(() => {
  const merged: Record<string, Partial<RunSettingsValues>> = {}
  for (const source of [saved.value, edits.value]) {
    for (const [key, value] of Object.entries(source)) merged[key] = { ...merged[key], ...value }
  }
  return merged
})
const rootValues = computed<RunSettingsValues>(() => ({ ...props.baseValues, ...overlay.value[props.rootAddress] }))
const memberNodes = computed(() => buildExistingMemberNodes(props.members, overlay.value, rootValues.value, props.baseValues))
const dirty = computed(() => Object.keys(edits.value).length > 0)
const canEdit = computed(() => props.editable && !props.isActive && !props.refreshRequired && !saving.value)
/** As today: a run whose model settings cannot change asks to be stopped first. */
const lockedForModel = computed(() => !props.editable || props.isActive)

const rootLocked = computed<RunSettingFlags>(() => ({ workspace: true, approval: true, model: !canEdit.value, thinking: !canEdit.value }))
const memberLocked = computed<RunSettingFlags>(() => ({
  workspace: !(props.kind === 'org' && canEdit.value),
  approval: true,
  model: !canEdit.value,
  thinking: !canEdit.value,
}))

const stateKey = computed(() => props.refreshRequired ? 'refresh-required' : props.isActive ? 'active' : 'stopped')

const edit = (key: string, patch: Partial<RunSettingsValues>) => {
  feedback.value = ''
  edits.value = { ...edits.value, [key]: { ...edits.value[key], ...patch } }
}

const updateMember = (key: string, field: RunSettingField, value: unknown) => {
  if (field === 'model') {
    const choice = value as RunModelChoice
    edit(key, { runtimeKind: choice.runtimeKind, llmModelIdentifier: choice.llmModelIdentifier, llmConfig: presentation.defaultConfigFor(choice) })
  } else if (field === 'thinking') edit(key, { llmConfig: value as Record<string, unknown> | null })
  else if (field === 'workspace') edit(key, { workspace: value as RunSettingsValues['workspace'] })
}


const discard = () => { edits.value = {} }
const save = () => {
  saving.value = true
  setTimeout(() => {
    const merged = { ...saved.value }
    for (const [key, value] of Object.entries(edits.value)) merged[key] = { ...merged[key], ...value }
    saved.value = merged
    edits.value = {}
    saving.value = false
    feedback.value = t('runSettings.save.saved')
    if (feedbackTimer) clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => { feedback.value = '' }, 3000)
  }, 600)
}
</script>
