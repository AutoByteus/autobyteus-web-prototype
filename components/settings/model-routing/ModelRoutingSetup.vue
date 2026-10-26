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
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const chooseRuntime = (runtime: string): void => setRouter(runtime, '')
const chooseModel = (model: string): void => { if (routing.router) routing.router = { runtime: routing.router.runtime, model } }
</script>
