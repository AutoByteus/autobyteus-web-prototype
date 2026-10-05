<template>
  <div
    class="flex h-full min-w-0 flex-1 flex-col overflow-y-auto bg-white"
    :class="[membersPanelOpen ? 'lg:pr-[var(--members-panel-width)]' : '', membersPanelResizing ? '' : 'transition-[padding] duration-200 ease-out motion-reduce:transition-none']"
    :style="{ '--members-panel-width': `${membersPanelWidth}px` }"
    data-test="org-launch-page"
    :data-state="stateKey"
  >
    <!-- SR-003: an Agent Org has no recipient, so it starts here instead of from chat: the same heading,
         a settings card where the message box would be, the same members line, and Run (round 38: a round play-icon button in the card, as Send in chat). -->
    <div class="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-[14vh] sm:px-6">
      <!-- Round 34: the same "what to run" switcher as New chat; choosing an Agent or Team goes to New chat. -->
      <div class="relative -top-6 flex max-w-full items-center justify-center sm:-top-10" data-test="org-launch-target">
        <ChatTargetSwitcher
          :name="org?.name ?? ''"
          :avatar-url="org?.avatarUrl ?? null"
          :options="runTargets.options.value"
          :current-key="`org:${definitionId}`"
          :disabled="draft?.phase === 'launching'"
          @choose="chooseTarget"
        />
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
        <!-- Round 38: like the chat message box: the settings, with Run as a round icon button in the
             lower-right corner where Send sits; the members line centered under the card, as on New chat. -->
        <div class="flex items-end gap-3 rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-3 shadow-sm" data-test="org-launch-card">
          <RunSettingsCard
            class="min-w-0 flex-1"
            :values="values"
            :locked="locked"
            test-suffix="org-launch"
            @update:workspace="store.update({ workspace: $event })"
            @update:model="selectModel"
            @update:thinking="store.update({ llmConfig: $event })"
            @update:approval="store.update({ autoExecuteTools: $event })"
          />
          <button
            type="button"
            class="mb-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!canRun"
            :title="blockedReason || $t('runSettings.orgLaunch.run')"
            :aria-label="blockedReason || $t('runSettings.orgLaunch.run')"
            :aria-busy="draft.phase === 'launching' ? 'true' : undefined"
            data-test="org-launch-run"
            @click="run"
          >
            <Icon v-if="draft.phase === 'launching'" icon="heroicons:arrow-path-solid" class="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <!-- The play glyph sits a hair right of center to look centered. -->
            <Icon v-else icon="heroicons:play-solid" class="ml-0.5 h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p
          v-if="statusText"
          class="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs"
          :class="draft.error ? 'text-red-600' : blockedReason ? 'text-amber-700' : 'text-gray-500'"
          :role="draft.error ? 'alert' : 'status'"
          aria-live="polite"
          data-test="org-launch-status"
        >
          <span v-if="draft.phase === 'preparing'" class="h-3 w-3 flex-shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500 motion-reduce:animate-none" aria-hidden="true"></span>
          <!-- Wraps rather than truncates: a reason or error is read in full. -->
          <span class="min-w-0 leading-snug">{{ statusText }}</span>
        </p>

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
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useOrgLaunchDraftStore } from '~/stores/orgLaunchDraftStore'
import { useWorkspaceStore } from '~/stores/workspace'
import { useLocalization } from '~/composables/useLocalization'
import { runtimeKindToLabel } from '~/types/agent/AgentRunConfig'
import ChatTargetMembers from './ChatTargetMembers.vue'
import ChatTargetSwitcher from '~/components/chat/ChatTargetSwitcher.vue'
import { useRunTargetSwitcher, type RunTargetOption } from '~/composables/runSettings/useRunTargetSwitcher'
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

const runTargets = useRunTargetSwitcher()
const chooseTarget = (option: RunTargetOption) => {
  const carried = { ...values.value }
  if (option.kind === 'org') void runTargets.openOrg(option.id, carried)
  else void runTargets.openChat(option, carried)
}

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
