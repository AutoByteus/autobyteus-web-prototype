<template>
  <section class="max-w-3xl px-1" data-testid="model-routing-setup" :aria-label="t('settings.modelRouting.setup.title')">
    <!-- 1. The switch -->
    <div class="flex items-start justify-between gap-4" data-testid="model-routing-switch-row">
      <span class="min-w-0">
        <span class="block text-base font-semibold text-gray-900">{{ t('settings.modelRouting.setup.switch.label') }}</span>
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

    <template v-if="routing.enabled">
      <!-- 2. The router -->
      <div class="mt-8" data-testid="model-routing-router-row">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <p class="text-base font-semibold text-gray-900">{{ t('settings.modelRouting.setup.router.label') }}</p>
          </div>
          <div class="flex flex-shrink-0 items-center gap-4">
            <NuxtLink to="/settings?section=server-settings&mode=quick" class="text-xs text-gray-400 hover:text-blue-700" data-testid="model-routing-internal-note" :title="t('settings.modelRouting.setup.router.internalNote')">{{ t('settings.modelRouting.setup.router.internalLink') }}</NuxtLink>
            <button
              type="button"
              class="inline-flex min-h-9 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
              data-testid="model-routing-open-conversation"
              @click="emit('open-conversation')"
            >{{ t('settings.modelRouting.setup.router.openConversation') }}</button>
          </div>
        </div>

        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-gray-500">{{ t('settings.modelRouting.setup.router.runtime') }}</span>
            <select :value="routing.router?.runtime ?? ''" :disabled="!report" class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-50" data-testid="model-routing-router-runtime" @change="chooseRuntime(($event.target as HTMLSelectElement).value)">
              <option value="">{{ t('settings.modelRouting.setup.router.chooseRuntime') }}</option>
              <option v-for="entry in report?.agentRuntimes ?? []" :key="entry.runtime" :value="entry.runtime">{{ entry.name }}</option>
            </select>
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-gray-500">{{ t('settings.modelRouting.setup.router.model') }}</span>
            <select :value="routing.router?.model ?? ''" :disabled="!routing.router?.runtime || !Array.isArray(modelOptions)" class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-50" data-testid="model-routing-router-model" @change="chooseModel(($event.target as HTMLSelectElement).value)">
              <option value="">{{ t('settings.modelRouting.setup.router.chooseModel') }}</option>
              <option v-for="model in Array.isArray(modelOptions) ? modelOptions : []" :key="model.id" :value="model.id">{{ model.name }}{{ model.blocked ? ` · ${blockedText(model)}` : '' }}</option>
            </select>
          </label>
        </div>

        <p v-if="status.kind !== 'active'" class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-amber-800" data-testid="model-routing-router-status" role="status">
          <span class="mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
          <span>{{ statusLine }}</span>
        </p>
      </div>

      <!-- 3. What the router should know: one text box -->
      <div class="mt-8" data-testid="model-routing-knowledge">
        <label for="model-routing-knowledge-text" class="text-base font-semibold text-gray-900">{{ t('settings.modelRouting.knowledge.label') }}</label>
        <p class="mt-1 text-sm text-gray-600">{{ t('settings.modelRouting.knowledge.explanation') }}</p>
        <textarea
          id="model-routing-knowledge-text"
          v-model="draft"
          rows="6"
          class="mt-3 w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          :placeholder="t('settings.modelRouting.knowledge.placeholder')"
          data-testid="model-routing-knowledge-textarea"
        ></textarea>
        <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-gray-500" data-testid="model-routing-knowledge-meta">
            <template v-if="note">{{ t(note.by === 'router' ? 'settings.modelRouting.knowledge.updatedByRouter' : 'settings.modelRouting.knowledge.updatedByYou', { time: decisionTime(note.at, locale, t) }) }}</template>
            <span v-if="message" class="ml-2 text-emerald-700" role="status" data-testid="model-routing-knowledge-message">{{ message }}</span>
          </p>
          <div class="flex items-center gap-3">
            <button v-if="canUndo" type="button" class="text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="model-routing-knowledge-undo" @click="undo">{{ t('settings.modelRouting.knowledge.undo') }}</button>
            <button v-else-if="routing.redo" type="button" class="text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="model-routing-knowledge-redo" @click="redo">{{ t('settings.modelRouting.knowledge.redo') }}</button>
            <button type="button" class="inline-flex min-h-9 items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!dirty" data-testid="model-routing-knowledge-save" @click="save">{{ t('settings.modelRouting.knowledge.save') }}</button>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AvailableAgentRuntimesReport, AvailableModel } from '~/types/availableAgentRuntimes'
import { routing, setEnabled, setRouter, saveKnowledge, undoKnowledge, redoKnowledge, modelsOf, type RouterStatus } from '~/prototype/model-routing/modelRoutingState'
import { decisionTime, routerProblem, shortDate } from './modelRoutingPresentation'

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

const statusLine = computed(() => {
  const status = props.status
  if (status.kind === 'active') return t('settings.modelRouting.setup.router.statusActive', { runtime: status.runtimeName, model: status.model })
  if (routing.router && !routing.router.model) return t('settings.modelRouting.setup.router.statusChooseModel')
  return t('settings.modelRouting.setup.router.statusNotActive', { reason: routerProblem(status, t, locale.value) })
})

// The note: the user types; the router also rewrites it (the box then shows its newest version).
const note = computed(() => routing.knowledge?.current ?? null)
const canUndo = computed(() => Boolean(routing.knowledge?.previous))
const draft = ref(note.value?.text ?? '')
const message = ref('')
const dirty = computed(() => draft.value.trim() !== (note.value?.text ?? '').trim())
watch(note, (next) => { draft.value = next?.text ?? '' })
const save = (): void => { saveKnowledge(draft.value.trim() + '\n'); message.value = t('settings.modelRouting.knowledge.saved') }
const undo = (): void => { undoKnowledge(); message.value = t('settings.modelRouting.knowledge.undone') }
const redo = (): void => { redoKnowledge(); message.value = t('settings.modelRouting.knowledge.redone') }
</script>
