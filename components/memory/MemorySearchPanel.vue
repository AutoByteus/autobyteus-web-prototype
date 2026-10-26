<template>
  <section class="rounded-xl border border-gray-200 bg-white shadow-sm" data-test="memory-search-panel">
    <div class="p-4">
      <form class="flex gap-2" role="search" @submit.prevent="submit">
        <div class="relative flex-1">
          <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            v-model="queryInput"
            type="text"
            :disabled="!store.searchReady"
            :placeholder="store.searchReady ? $t('memory.search.placeholder') : $t('memory.search.placeholder_not_ready')"
            :aria-label="$t('memory.search.label')"
            class="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            data-test="memory-search-input"
          />
        </div>
        <button
          type="submit"
          :disabled="!store.searchReady || !queryInput.trim()"
          class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >{{ $t('memory.search.button') }}</button>
      </form>
      <p class="mt-2 text-xs text-gray-500">{{ $t('memory.search.hint') }}</p>
    </div>

    <div v-if="index" class="border-t border-gray-100" data-test="memory-index">
      <div class="flex items-center gap-2 px-4 py-2.5">
        <button
          type="button"
          class="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :aria-expanded="expanded"
          aria-controls="memory-index-steps"
          data-test="memory-index-toggle"
          @click="expanded = !expanded"
        >
          <Icon v-if="status.spinner" icon="svg-spinners:ring-resize" class="h-4 w-4 flex-shrink-0 text-blue-600" aria-hidden="true" />
          <span v-else class="h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="status.dot" aria-hidden="true" />
          <span class="flex-shrink-0 text-sm font-semibold text-gray-900">{{ $t('memory.index.title') }}</span>
          <span class="min-w-0 text-sm" :class="status.text" data-test="memory-index-status">{{ status.label }}</span>
          <span v-if="status.detail" class="hidden min-w-0 truncate text-xs text-gray-500 md:inline">· {{ status.detail }}</span>
          <Icon icon="heroicons:chevron-down-20-solid" class="ml-auto h-4 w-4 flex-shrink-0 text-gray-400 transition-transform" :class="expanded ? 'rotate-180' : ''" aria-hidden="true" />
        </button>
        <button
          v-if="primaryAction"
          type="button"
          class="flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold"
          :class="primaryAction.kind === 'primary' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
          :data-test="primaryAction.test"
          @click="primaryAction.run"
        >{{ primaryAction.label }}</button>
      </div>

      <div v-show="expanded" id="memory-index-steps" class="border-t border-gray-100 px-4 pb-4 pt-1">
        <p v-if="index.phase === 'needs_index'" class="py-3 text-sm text-gray-600" data-test="memory-index-first-time">{{ $t('memory.index.first_time') }}</p>
        <p v-else-if="store.modelChanged" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" data-test="memory-index-model-changed">
          {{ $t('memory.index.model_changed', { old: index.builtWithModel ?? '', current: index.activeModel }) }}
        </p>

        <ol class="mt-1" aria-label="Memory index steps">
          <li v-for="(step, i) in index.steps" :key="step.id" class="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 border-t border-gray-100 py-3 first:border-t-0 md:grid-cols-[1.25rem_16rem_minmax(0,1fr)_14rem]" :data-step="step.id" :data-state="step.state">
            <span class="flex h-5 w-5 items-center justify-center">
              <Icon v-if="step.state === 'done'" icon="heroicons:check-circle-20-solid" class="h-5 w-5 text-emerald-500" aria-label="Done" />
              <Icon v-else-if="step.state === 'running'" icon="svg-spinners:ring-resize" class="h-4 w-4 text-blue-600" aria-label="Running" />
              <Icon v-else-if="step.state === 'failed'" icon="heroicons:exclamation-circle-20-solid" class="h-5 w-5 text-red-500" aria-label="Failed" />
              <span v-else class="h-3.5 w-3.5 rounded-full border-2 border-gray-300" aria-label="Waiting" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-900"><span class="mr-1.5 font-normal text-gray-400">{{ i + 1 }}</span>{{ $t(`memory.index.step.${step.id}.name`) }}</p>
              <p class="text-xs text-gray-500">{{ $t(`memory.index.step.${step.id}.description`) }}</p>
            </div>
            <div class="col-start-2 h-1.5 overflow-hidden rounded-full bg-gray-100 md:col-start-auto" role="progressbar" :aria-label="$t(`memory.index.step.${step.id}.name`)" :aria-valuenow="percent(step)" aria-valuemin="0" aria-valuemax="100">
              <div class="h-full rounded-full transition-[width] duration-300" :class="step.state === 'failed' ? 'bg-red-400' : step.state === 'done' ? 'bg-emerald-400' : 'bg-blue-600'" :style="{ width: `${percent(step)}%` }" />
            </div>
            <p class="col-start-2 text-xs md:col-start-auto md:text-right" :class="step.state === 'waiting' ? 'text-gray-400' : 'text-gray-600'">{{ stepCount(step) }}</p>
            <p v-if="step.state === 'failed' && step.message" class="col-start-2 text-xs text-red-600 md:col-start-2 md:col-span-3" data-test="memory-index-step-error">{{ step.message }}</p>
          </li>
        </ol>

        <div class="mt-1 flex flex-col gap-2 border-t border-gray-100 pt-3 md:flex-row md:items-center md:justify-between">
          <p class="text-xs text-gray-500">
            {{ $t('memory.index.model_note', { model: index.activeModel }) }}
            <NuxtLink to="/settings?section=server-settings&mode=embedding" class="font-semibold text-blue-600 hover:underline">{{ $t('memory.index.model_link') }}</NuxtLink>
          </p>
          <div v-if="canRebuild" class="flex-shrink-0">
            <div v-if="confirming" class="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2" role="alertdialog" aria-label="Rebuild the memory index" data-test="memory-index-rebuild-confirm">
              <span class="text-xs text-gray-700">{{ $t('memory.index.rebuild_confirm') }}</span>
              <button type="button" class="rounded-md bg-gray-900 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-800" data-test="memory-index-rebuild-yes" @click="confirmRebuild">{{ $t('memory.index.rebuild') }}</button>
              <button type="button" class="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50" @click="confirming = false">{{ $t('memory.index.cancel') }}</button>
            </div>
            <button v-else type="button" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50" data-test="memory-index-rebuild" @click="confirming = true">{{ $t('memory.index.rebuild') }}</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useLocalization } from '~/composables/useLocalization';
import { useMemorySearchStore } from '~/stores/memorySearchStore';
import type { IndexStep } from '~/prototype/memory-search/memoryDesignFixture';

const emit = defineEmits<{ search: [query: string] }>();

const { t } = useLocalization();
const store = useMemorySearchStore();
store.loadIndexStatus();

const index = computed(() => store.index);
const queryInput = ref(store.query);
watch(() => store.query, (value) => { queryInput.value = value; });

const submit = () => {
  const query = queryInput.value.trim();
  if (query && store.searchReady) emit('search', query);
};

const expanded = ref(!!index.value && (index.value.phase !== 'ready' || store.modelChanged));
watch(() => index.value?.phase, (phase, before) => { if (phase === 'building' && before !== 'building') expanded.value = true; });

const confirming = ref(false);
const canRebuild = computed(() => index.value?.phase === 'ready' || index.value?.phase === 'failed');

const fmt = (value: number) => value.toLocaleString();
const percent = (step: IndexStep) => (step.total ? Math.floor((step.done / step.total) * 100) : 0);
const unit = (step: IndexStep) => t(step.id === 'text' || step.id === 'meaning' ? 'memory.index.unit.files' : 'memory.index.unit.runs');

const stepCount = (step: IndexStep): string => {
  if (step.state === 'waiting') return t('memory.index.state.waiting');
  if (step.state === 'done') return `${fmt(step.total)} ${unit(step)}`;
  return t('memory.index.count', { done: fmt(step.done), total: fmt(step.total), unit: unit(step), percent: percent(step) });
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const status = computed(() => {
  const value = index.value;
  const none = { spinner: false, dot: 'bg-gray-300', text: 'text-gray-600', label: '', detail: '' };
  if (!value) return none;
  const stepName = (id: string) => t(`memory.index.step.${id}.name`);
  if (value.phase === 'needs_index') return { ...none, dot: 'bg-amber-400', text: 'text-gray-700', label: t('memory.index.status.needs_index') };
  if (value.phase === 'failed') {
    const failed = value.steps.find(s => s.state === 'failed');
    return { ...none, dot: 'bg-red-500', text: 'text-red-700', label: t('memory.index.status.failed', { step: failed ? stepName(failed.id) : '' }) };
  }
  if (value.phase === 'building') {
    const current = value.steps.find(s => s.state === 'running') ?? value.steps.find(s => s.state === 'waiting');
    if (current?.id === 'meaning') {
      return { ...none, spinner: true, text: 'text-gray-700', label: t('memory.index.status.meaning_running', { percent: percent(current) }), detail: t('memory.index.status.words_ready') };
    }
    return { ...none, spinner: true, text: 'text-gray-700', label: t('memory.index.status.building', { number: value.steps.findIndex(s => s.id === current?.id) + 1, step: current ? stepName(current.id) : '', percent: current ? percent(current) : 0 }) };
  }
  if (store.modelChanged) return { ...none, dot: 'bg-amber-400', text: 'text-amber-800', label: t('memory.index.status.model_changed') };
  return { ...none, dot: 'bg-emerald-500', text: 'text-gray-700', label: t('memory.index.status.ready'), detail: t('memory.index.status.ready_detail', { runs: fmt(value.steps[0].total), timestamp: formatTimestamp(value.updatedAt) }) };
});

const confirmRebuild = () => { confirming.value = false; store.rebuild(); };

const primaryAction = computed(() => {
  const value = index.value;
  if (!value) return null;
  if (value.phase === 'needs_index') return { label: t('memory.index.index_now'), kind: 'primary' as const, test: 'memory-index-now', run: () => store.startIndex() };
  if (value.phase === 'failed') return { label: t('memory.index.try_again'), kind: 'primary' as const, test: 'memory-index-retry', run: () => store.startIndex() };
  if (store.modelChanged) return { label: t('memory.index.rebuild'), kind: 'secondary' as const, test: 'memory-index-rebuild-banner', run: () => { expanded.value = true; confirming.value = true; } };
  return null;
});
</script>
