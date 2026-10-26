<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm" data-testid="model-routing-setup" aria-labelledby="model-routing-setup-heading">
    <div class="min-w-0 max-w-3xl">
      <h3 id="model-routing-setup-heading" class="text-xl font-semibold leading-tight text-gray-900">{{ t('settings.modelRouting.setup.title') }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ t('settings.modelRouting.setup.description') }}</p>
    </div>

    <!-- 1. The switch -->
    <div class="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4" data-testid="model-routing-switch-row">
      <span class="min-w-0">
        <span class="block text-sm font-semibold text-gray-900">{{ t('settings.modelRouting.setup.switch.label') }}</span>
        <span class="mt-1 block text-sm text-gray-600">{{ t('settings.modelRouting.setup.switch.explanation') }}</span>
        <span v-if="!ownNode" class="mt-1 block text-sm text-gray-600" data-testid="model-routing-peer-note">{{ t('settings.modelRouting.setup.switch.peerNote') }}</span>
      </span>
      <button
        type="button"
        role="switch"
        class="relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        :class="routing.enabled ? 'bg-blue-600' : 'bg-slate-300'"
        :aria-checked="routing.enabled"
        :aria-label="t('settings.modelRouting.setup.switch.label')"
        data-testid="model-routing-switch"
        @click="setEnabled(!routing.enabled)"
      >
        <span aria-hidden="true" class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform" :class="routing.enabled ? 'translate-x-5' : 'translate-x-0.5'" />
      </button>
    </div>

    <!-- Off: how it works -->
    <ol v-if="!routing.enabled" class="mt-4 space-y-2 px-1 text-sm text-gray-600" data-testid="model-routing-how">
      <li v-for="step in HOW" :key="step" class="flex gap-2.5">
        <span class="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[0.6875rem] font-semibold text-slate-600" aria-hidden="true">{{ HOW.indexOf(step) + 1 }}</span>
        <span>{{ t(`settings.modelRouting.setup.how.${step}`) }}</span>
      </li>
    </ol>

    <!-- 2. The router -->
    <div class="mt-4 rounded-2xl border border-slate-200 p-4" :class="routing.enabled ? '' : 'opacity-60'" data-testid="model-routing-router-row">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ t('settings.modelRouting.setup.router.label') }}</p>
          <p class="mt-1 text-sm text-gray-600">{{ t('settings.modelRouting.setup.router.explanation') }}</p>
        </div>
        <button
          type="button"
          class="inline-flex min-h-9 flex-shrink-0 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          :disabled="!conversationExists"
          :title="conversationExists ? undefined : t('settings.modelRouting.setup.router.noConversation')"
          data-testid="model-routing-open-conversation"
          @click="emit('open-conversation')"
        >{{ t('settings.modelRouting.setup.router.openConversation') }}</button>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-gray-500">{{ t('settings.modelRouting.setup.router.runtime') }}</span>
          <select :value="routing.router?.runtime ?? ''" :disabled="!routing.enabled || !report" class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-50" data-testid="model-routing-router-runtime" @change="chooseRuntime(($event.target as HTMLSelectElement).value)">
            <option value="">{{ t('settings.modelRouting.setup.router.chooseRuntime') }}</option>
            <option v-for="entry in report?.agentRuntimes ?? []" :key="entry.runtime" :value="entry.runtime">{{ entry.name }}</option>
          </select>
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-gray-500">{{ t('settings.modelRouting.setup.router.model') }}</span>
          <select :value="routing.router?.model ?? ''" :disabled="!routing.enabled || !routing.router?.runtime || !Array.isArray(modelOptions)" class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-50" data-testid="model-routing-router-model" @change="chooseModel(($event.target as HTMLSelectElement).value)">
            <option value="">{{ t('settings.modelRouting.setup.router.chooseModel') }}</option>
            <option v-for="model in Array.isArray(modelOptions) ? modelOptions : []" :key="model.id" :value="model.id">{{ model.name }}{{ model.blocked ? ` · ${blockedText(model)}` : '' }}</option>
          </select>
        </label>
      </div>

      <p class="mt-3 flex items-start gap-2 text-sm" :class="routing.enabled && status.kind !== 'active' && status.kind !== 'off' ? 'text-amber-800' : 'text-gray-600'" data-testid="model-routing-router-status" role="status">
        <span class="mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full" :class="dot" aria-hidden="true"></span>
        <span>{{ statusLine }}</span>
      </p>
      <p class="mt-2 pl-4 text-xs text-gray-500" data-testid="model-routing-internal-note">
        {{ t('settings.modelRouting.setup.router.internalNote') }}
        <NuxtLink to="/settings?section=server-settings&mode=quick" class="font-medium text-blue-700 hover:text-blue-800">{{ t('settings.modelRouting.setup.router.internalLink') }}</NuxtLink>
      </p>
    </div>

    <!-- 3. Task kinds -->
    <div class="mt-4 rounded-2xl border border-slate-200 p-4" :class="routing.enabled ? '' : 'opacity-60'" data-testid="model-routing-kinds-row">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ t('settings.modelRouting.setup.kinds.label') }}</p>
          <p class="mt-1 text-sm text-gray-600">{{ t('settings.modelRouting.setup.kinds.explanation') }}</p>
        </div>
        <button
          v-if="!editingKinds"
          type="button"
          class="inline-flex min-h-9 flex-shrink-0 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          :disabled="!routing.enabled"
          data-testid="model-routing-kinds-edit"
          @click="startEditKinds"
        >{{ t('settings.modelRouting.setup.kinds.edit') }}</button>
      </div>

      <ul v-if="!editingKinds" class="mt-3 flex flex-wrap gap-2" :aria-label="t('settings.modelRouting.setup.kinds.label')" data-testid="model-routing-kinds-list">
        <li v-for="kind in routing.taskKinds" :key="kind" class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{{ kindLabel(kind, t) }}</li>
      </ul>

      <div v-else class="mt-3" data-testid="model-routing-kinds-editor">
        <ul class="flex flex-wrap gap-2" :aria-label="t('settings.modelRouting.setup.kinds.label')">
          <li v-for="kind in draftKinds" :key="kind" class="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-2.5 pr-1 text-xs font-medium text-slate-700">
            {{ kindLabel(kind, t) }}
            <button type="button" class="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="t('settings.modelRouting.setup.kinds.remove', { kind: kindLabel(kind, t) })" :disabled="draftKinds.length <= 1" @click="removeKind(kind)">
              <Icon icon="heroicons:x-mark" class="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        </ul>
        <form class="mt-3 flex items-start gap-2" @submit.prevent="addKind">
          <div class="min-w-0 flex-1 sm:max-w-xs">
            <input v-model="newKind" type="text" maxlength="24" class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30" :placeholder="t('settings.modelRouting.setup.kinds.addPlaceholder')" :aria-label="t('settings.modelRouting.setup.kinds.addPlaceholder')" data-testid="model-routing-kinds-input" />
            <p v-if="kindError" class="mt-1 text-xs text-red-600" role="alert" data-testid="model-routing-kinds-error">{{ kindError }}</p>
          </div>
          <button type="submit" class="inline-flex min-h-9 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-kinds-add">{{ t('settings.modelRouting.setup.kinds.add') }}</button>
        </form>
        <p class="mt-2 text-xs text-gray-500">{{ t('settings.modelRouting.setup.kinds.keepNote') }}</p>
        <div class="mt-3 flex items-center justify-between gap-3">
          <button type="button" class="text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="model-routing-kinds-restore" @click="draftKinds = resetTaskKinds()">{{ t('settings.modelRouting.setup.kinds.restore') }}</button>
          <div class="flex items-center gap-2">
            <button type="button" class="inline-flex min-h-9 items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-kinds-cancel" @click="editingKinds = false">{{ t('settings.modelRouting.setup.kinds.cancel') }}</button>
            <button type="button" class="inline-flex min-h-9 items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-kinds-save" @click="saveKinds">{{ t('settings.modelRouting.setup.kinds.save') }}</button>
          </div>
        </div>
      </div>
      <p v-if="kindsSaved" class="mt-3 text-sm text-emerald-700" role="status" data-testid="model-routing-kinds-saved">{{ t('settings.modelRouting.setup.kinds.saved') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { AvailableAgentRuntimesReport, AvailableModel } from '~/types/availableAgentRuntimes'
import { routing, setEnabled, setRouter, saveTaskKinds, resetTaskKinds, modelsOf, type RouterStatus } from '~/prototype/model-routing/modelRoutingState'
import { kindLabel, routerProblem, shortDate } from './modelRoutingPresentation'

const props = defineProps<{ report: AvailableAgentRuntimesReport | null; status: RouterStatus; ownNode: boolean }>()
const emit = defineEmits<{ (event: 'open-conversation'): void }>()
const { t, resolvedLocale } = useLocalization()
const locale = computed(() => String(resolvedLocale.value || 'en'))

/** The router's conversation exists once it has been used: while on, or from an earlier use. */
const conversationExists = computed(() => routing.enabled || routing.delegations.length > 0 || Boolean(routing.knowledge))
const HOW = ['defaults', 'router', 'fallback'] as const

const modelOptions = computed(() => {
  const entry = props.report?.agentRuntimes.find((item) => item.runtime === routing.router?.runtime)
  return entry ? modelsOf(entry) : []
})
const blockedText = (model: AvailableModel): string => model.blocked?.until
  ? t('settings.modelRouting.setup.router.blockedUntil', { time: shortDate(Date.parse(model.blocked.until), locale.value) })
  : t('settings.modelRouting.setup.router.blocked')

const chooseRuntime = (runtime: string): void => { setRouter(runtime, '') ; if (!runtime) routing.router = null }
const chooseModel = (model: string): void => { if (routing.router) routing.router = { runtime: routing.router.runtime, model } }

const statusLine = computed(() => {
  const status = props.status
  if (status.kind === 'off') return t('settings.modelRouting.setup.router.statusOff')
  if (status.kind === 'active') return t('settings.modelRouting.setup.router.statusActive', { runtime: status.runtimeName, model: status.model })
  if (routing.enabled && routing.router && !routing.router.model) return t('settings.modelRouting.setup.router.statusChooseModel')
  return t('settings.modelRouting.setup.router.statusNotActive', { reason: routerProblem(status, t, locale.value) })
})
const dot = computed(() => (props.status.kind === 'active' ? 'bg-emerald-500' : props.status.kind === 'off' ? 'bg-slate-400' : 'bg-amber-500'))

// Task kinds
const editingKinds = ref(false)
const draftKinds = ref<string[]>([])
const newKind = ref('')
const kindError = ref('')
const kindsSaved = ref(false)
const startEditKinds = (): void => { draftKinds.value = [...routing.taskKinds]; newKind.value = ''; kindError.value = ''; kindsSaved.value = false; editingKinds.value = true }
const addKind = (): void => {
  const value = newKind.value.trim().toLowerCase()
  kindError.value = ''
  if (!value) { kindError.value = t('settings.modelRouting.setup.kinds.errorEmpty'); return }
  if (draftKinds.value.some((kind) => kind.toLowerCase() === value)) { kindError.value = t('settings.modelRouting.setup.kinds.errorDuplicate', { kind: value }); return }
  if (draftKinds.value.length >= 16) { kindError.value = t('settings.modelRouting.setup.kinds.errorMax'); return }
  draftKinds.value = [...draftKinds.value, value]
  newKind.value = ''
}
const removeKind = (kind: string): void => { if (draftKinds.value.length > 1) draftKinds.value = draftKinds.value.filter((item) => item !== kind) }
const saveKinds = (): void => { saveTaskKinds(draftKinds.value); editingKinds.value = false; kindsSaved.value = true }
</script>
