<template>
  <div
    class="flex h-full min-w-0 flex-1 flex-col overflow-y-auto bg-white"
    :class="[membersPanelOpen ? 'lg:pr-[var(--members-panel-width)]' : '', membersPanelResizing ? '' : 'transition-[padding] duration-200 ease-out motion-reduce:transition-none']"
    :style="{ '--members-panel-width': `${membersPanelWidth}px` }"
    data-test="org-launch-page"
    :data-state="stateKey"
  >
    <!-- SR-003: an Agent Org has no recipient, so it starts here instead of from chat: the same heading,
         a settings card where the message box would be, the same members line, and "Run Agent Org". -->
    <div class="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-[14vh] sm:px-6">
      <div class="relative -top-6 flex max-w-full items-center justify-center gap-3 sm:-top-10" data-test="org-launch-target">
        <img v-if="org?.avatarUrl" :src="org.avatarUrl" alt="" class="h-10 w-10 flex-shrink-0 rounded-full object-cover">
        <h1 class="min-w-0 break-words text-center text-[1.5rem] font-semibold leading-tight tracking-tight text-gray-900 sm:text-[1.75rem]" data-test="org-launch-name">
          {{ org?.name ?? '' }}
        </h1>
      </div>

      <!-- Unavailable: nothing to configure. -->
      <div v-if="unavailable" class="mt-8 flex max-w-md flex-col items-center gap-3 text-center" data-test="org-launch-unavailable">
        <p class="text-sm text-gray-600">{{ $t('runSettings.orgLaunch.unavailable') }}</p>
        <button
          type="button"
          class="rounded-md px-2 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          data-test="org-launch-back"
          @click="router.push('/agent-orgs')"
        >
          {{ $t('runSettings.orgLaunch.back') }}
        </button>
      </div>

      <div v-else-if="draft" class="mt-8 w-full max-w-3xl">
        <!-- The settings card: the message box's four controls, labelled, with the run action in its footer. -->
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm" data-test="org-launch-card">
          <div class="px-4 py-2">
            <RunSettingsCard
              :values="values"
              :locked="locked"
              test-suffix="org-launch"
              @update:workspace="store.update({ workspace: $event })"
              @update:model="selectModel"
              @update:thinking="store.update({ llmConfig: $event })"
              @update:approval="store.update({ autoExecuteTools: $event })"
            />
          </div>
          <div class="flex items-center gap-3 border-t border-gray-100 px-4 py-2.5">
            <p
              class="flex min-w-0 flex-1 items-center gap-1.5 text-xs"
              :class="draft.error ? 'text-red-600' : blockedReason ? 'text-amber-700' : 'text-gray-500'"
              :role="draft.error ? 'alert' : 'status'"
              aria-live="polite"
              data-test="org-launch-status"
            >
              <span v-if="draft.phase !== 'ready'" class="h-3 w-3 flex-shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500 motion-reduce:animate-none" aria-hidden="true"></span>
              <span class="truncate">{{ statusText }}</span>
            </p>
            <button
              type="button"
              class="inline-flex flex-shrink-0 items-center rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canRun"
              :title="blockedReason || undefined"
              data-test="org-launch-run"
              @click="run"
            >
              {{ $t('runSettings.orgLaunch.run') }}
            </button>
          </div>
        </div>

        <ChatTargetMembers
          v-if="memberSource && draft.phase !== 'launching'"
          :key="memberSource.key"
          class="mt-2.5"
          :source="memberSource"
          @update:open="membersPanelOpen = $event"
          @update:width="membersPanelWidth = $event"
          @update:resizing="membersPanelResizing = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useOrgLaunchDraftStore } from '~/stores/orgLaunchDraftStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { useLocalization } from '~/composables/useLocalization'
import { runtimeKindToLabel } from '~/types/agent/AgentRunConfig'
import ChatTargetMembers from './ChatTargetMembers.vue'
import RunSettingsCard from './RunSettingsCard.vue'
import type { MemberSettingsSource } from './memberSettingsSource'
import type { RunModelChoice, RunSettingFlags, RunSettingsValues } from './runSettings'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

/**
 * run-settings-ui-unification (SR-003): the Org launch page, at the product's Org launch route
 * (`/workspace?rootSubjectKind=agent_org&definitionId=…&mode=configuration[&sourceOrgRunId=…]`).
 */
const route = useRoute()
const router = useRouter()
const { t } = useLocalization()
const orgStore = useAgentOrgDefinitionStore()
const workspaceStore = useWorkspaceStore()
const store = useOrgLaunchDraftStore()
const { draft } = storeToRefs(store)
const presentation = useRunSettingsPresentation()

const definitionId = computed(() => String(route.query.definitionId || ''))
const sourceOrgRunId = computed(() => String(route.query.sourceOrgRunId || '') || null)
const org = computed(() => orgStore.byId(definitionId.value) ?? null)
const definitionsLoaded = ref(false)

// A new route intent (Run, or "+" from a run) starts a fresh draft.
watch([definitionId, sourceOrgRunId, org], ([id, source, value]) => {
  if (!id || !value) return
  const current = draft.value
  if (current && current.orgDefinitionId === id && current.sourceOrgRunId === source) return
  store.start(id, source)
}, { immediate: true })

onMounted(async () => {
  if (!workspaceStore.workspacesFetched) void workspaceStore.fetchAllWorkspaces().catch(() => undefined)
  await orgStore.fetchAll().catch(() => undefined)
  definitionsLoaded.value = true
})

const unavailable = computed(() => (definitionsLoaded.value && !org.value) || Boolean(draft.value && !store.isOrgAvailable(draft.value)))

const values = computed<RunSettingsValues>(() => ({
  workspace: draft.value?.workspace ?? null,
  runtimeKind: draft.value?.runtimeKind ?? 'autobyteus',
  llmModelIdentifier: draft.value?.llmModelIdentifier ?? '',
  llmConfig: draft.value?.llmConfig ?? null,
  autoExecuteTools: draft.value?.autoExecuteTools ?? true,
}))
/** While the Org starts, its settings are held as they are. */
const locked = computed<RunSettingFlags>(() => {
  const busy = draft.value?.phase !== 'ready'
  return { workspace: busy, model: busy, thinking: busy, approval: busy }
})
const selectModel = (choice: RunModelChoice) => store.update({
  runtimeKind: choice.runtimeKind,
  llmModelIdentifier: choice.llmModelIdentifier,
  // Choosing a model applies its default thinking, as in Chat. Antigravity's auto-approve lock is
  // shown by the card and applied at launch.
  llmConfig: presentation.defaultConfigFor(choice),
})

const blockedReason = computed(() => {
  const current = draft.value
  if (!current || current.phase !== 'ready') return ''
  const readiness = store.readiness(current)
  return readiness.ready ? '' : readiness.reason
})
const canRun = computed(() => Boolean(draft.value && draft.value.phase === 'ready' && !blockedReason.value))
const statusText = computed(() => {
  const current = draft.value
  if (!current) return ''
  if (current.phase === 'preparing') return t('runSettings.orgLaunch.preparing')
  if (current.phase === 'launching') return t('chat.new.starting', { name: org.value?.name ?? '', runtime: runtimeKindToLabel(current.runtimeKind) })
  return current.error || blockedReason.value
})
const stateKey = computed(() => {
  if (unavailable.value) return 'unavailable'
  const current = draft.value
  if (!current) return 'loading'
  if (current.phase !== 'ready') return current.phase
  if (current.error) return 'failed'
  if (blockedReason.value) return 'blocked'
  return Object.keys(current.memberSettings).length ? 'customized' : 'default'
})

const run = () => { void store.launch((target) => router.push(target)) }

// The members line and drawer: the same ones Team New chat uses, with this card as the defaults.
const membersPanelOpen = ref(false)
const membersPanelWidth = ref(480)
const membersPanelResizing = ref(false)
const memberSource = computed<MemberSettingsSource | null>(() => {
  const current = draft.value
  if (!current) return null
  return {
    key: current.key,
    target: { kind: 'org', orgDefinitionId: current.orgDefinitionId },
    defaults: values.value,
    memberSettings: current.memberSettings,
    setMemberSettings: store.setMemberSettings,
    resetAllMemberSettings: store.resetAllMemberSettings,
  }
})
</script>
