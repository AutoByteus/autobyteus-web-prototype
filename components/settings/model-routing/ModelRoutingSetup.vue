<template>
  <section class="max-w-3xl" data-testid="model-routing-setup" :aria-label="t('settings.modelRouting.setup.title')">
    <h3 class="text-base font-semibold text-gray-900">{{ t('settings.modelRouting.setup.router.label') }}</h3>

    <div class="mt-3 grid gap-3 sm:grid-cols-2" data-testid="model-routing-router-row">
      <label class="block">
        <span class="mb-1 block text-xs font-medium text-gray-500">{{ t('settings.modelRouting.setup.router.runtime') }}</span>
        <select :value="routing.router?.runtime ?? ''" :disabled="!report || !routing.enabled" class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-50" data-testid="model-routing-router-runtime" @change="chooseRuntime(($event.target as HTMLSelectElement).value)">
          <option value="">{{ t('settings.modelRouting.setup.router.chooseRuntime') }}</option>
          <option v-if="!report && routing.router" :value="routing.router.runtime">{{ RUNTIME_NAMES[routing.router.runtime] ?? routing.router.runtime }}</option>
          <option v-for="entry in report?.agentRuntimes ?? []" :key="entry.runtime" :value="entry.runtime">{{ entry.name }}</option>
        </select>
      </label>
      <label class="block">
        <span class="mb-1 block text-xs font-medium text-gray-500">{{ t('settings.modelRouting.setup.router.model') }}</span>
        <select :value="routing.router?.model ?? ''" :disabled="!report || !routing.enabled || !routing.router?.runtime || !Array.isArray(modelOptions)" class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-50" data-testid="model-routing-router-model" @change="chooseModel(($event.target as HTMLSelectElement).value)">
          <option value="">{{ t('settings.modelRouting.setup.router.chooseModel') }}</option>
          <option v-if="!report && routing.router?.model" :value="routing.router.model">{{ routing.router.model }}</option>
          <option v-for="model in Array.isArray(modelOptions) ? modelOptions : []" :key="model.id" :value="model.id">{{ model.name }}{{ model.blocked ? ` · ${blockedText(model)}` : '' }}</option>
        </select>
      </label>
    </div>

    <div class="mt-6">
      <button
        type="button"
        class="inline-flex min-h-9 items-center whitespace-nowrap rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        :disabled="!routing.enabled || !routing.router?.model"
        :title="routing.router?.model ? undefined : t('settings.modelRouting.setup.router.noConversation')"
        data-testid="model-routing-open-conversation"
        @click="emit('open-conversation')"
      >{{ t('settings.modelRouting.setup.router.openConversation') }}</button>
      <p class="mt-2 text-sm text-gray-500">{{ t('settings.modelRouting.setup.router.teachHint') }}</p>
    </div>

    <!-- The existing server setting "Show internal agents" (autobyteus-308): the router is an internal agent. -->
    <div class="mt-8 flex items-start justify-between gap-4 border-t border-slate-100 pt-6" data-testid="model-routing-visibility-row">
      <span class="min-w-0">
        <span class="block text-sm font-semibold text-gray-900">{{ t('settings.modelRouting.setup.visibility.label') }}</span>
        <span class="mt-1 block text-sm text-gray-500">{{ t('settings.modelRouting.setup.visibility.explanation') }}</span>
        <span v-if="visibilityError" class="mt-1 block text-sm text-red-600" role="alert" data-testid="model-routing-visibility-error">{{ visibilityError }}</span>
      </span>
      <button
        type="button"
        role="switch"
        class="relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        :class="visible ? 'bg-blue-600' : 'bg-slate-300'"
        :aria-checked="visible"
        :aria-label="t('settings.modelRouting.setup.visibility.label')"
        :disabled="savingVisibility"
        data-testid="model-routing-visibility-switch"
        @click="toggleVisibility"
      >
        <span aria-hidden="true" class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform" :class="visible ? 'translate-x-5' : 'translate-x-0.5'" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useServerSettingsStore } from '~/stores/serverSettings'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import type { AvailableAgentRuntimesReport, AvailableModel } from '~/types/availableAgentRuntimes'
import { routing, setRouter, modelsOf, type RouterStatus } from '~/prototype/model-routing/modelRoutingState'
import { RUNTIME_NAMES } from '~/prototype/model-routing/modelRoutingData'
import { shortDate } from './modelRoutingPresentation'

const props = defineProps<{ report: AvailableAgentRuntimesReport | null; status: RouterStatus; ownNode: boolean }>()
const emit = defineEmits<{ (event: 'open-conversation'): void }>()
const { t, resolvedLocale } = useLocalization()
const locale = computed(() => String(resolvedLocale.value || 'en'))

const modelOptions = computed(() => {
  const entry = props.report?.agentRuntimes.find((item) => item.runtime === routing.router?.runtime)
  return entry ? modelsOf(entry) : []
})
const blockedText = (model: AvailableModel): string => model.blocked?.until
  ? t('settings.modelRouting.setup.router.blockedUntil', { time: shortDate(Date.parse(model.blocked.until), locale.value) })
  : t('settings.modelRouting.setup.router.blocked')

// "Show internal agents" is the server setting autobyteus-308 added (ShowInternalAgentsCard.vue in Server Settings → Basics); this row reads and writes the same setting.
const SHOW_INTERNAL_AGENTS_KEY = 'AUTOBYTEUS_SHOW_INTERNAL_AGENTS'
const serverSettings = useServerSettingsStore()
const isOn = (value: unknown): boolean => typeof value === 'string' && value.trim().toLowerCase() === 'true'
const visible = ref(isOn(serverSettings.getSettingByKey(SHOW_INTERNAL_AGENTS_KEY)?.value))
const savingVisibility = ref(false)
const visibilityError = ref('')
watch(() => serverSettings.settings, () => { if (!savingVisibility.value) visible.value = isOn(serverSettings.getSettingByKey(SHOW_INTERNAL_AGENTS_KEY)?.value) }, { deep: true })
void serverSettings.fetchServerSettings?.().catch(() => undefined)
const toggleVisibility = async (): Promise<void> => {
  if (savingVisibility.value) return
  const previous = visible.value
  visible.value = !previous
  savingVisibility.value = true
  visibilityError.value = ''
  try {
    await serverSettings.updateServerSetting(SHOW_INTERNAL_AGENTS_KEY, visible.value ? 'true' : 'false')
    await Promise.allSettled([useAgentDefinitionStore().reloadAllAgentDefinitions(), useRunHistoryStore().refreshTreeQuietly()])
  } catch (error: any) {
    visible.value = previous
    visibilityError.value = error?.message || t('settings.modelRouting.setup.visibility.saveFailed')
  } finally {
    savingVisibility.value = false
  }
}

const chooseRuntime = (runtime: string): void => setRouter(runtime, '')
const chooseModel = (model: string): void => { if (routing.router) routing.router = { runtime: routing.router.runtime, model } }
</script>
