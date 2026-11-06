<template>
  <section class="fixed inset-0 flex h-[100dvh] flex-col bg-white text-slate-900" data-testid="mobile-runs-screen">
    <header class="flex h-14 flex-shrink-0 items-center border-b border-slate-200 bg-white pl-2 pr-3">
      <button
        type="button"
        class="flex h-12 min-w-0 items-center gap-2.5 rounded-xl pl-2 pr-3 text-left active:bg-slate-100"
        aria-haspopup="dialog"
        :aria-label="`${nodeName}, ${connectionLabel}. Connection`"
        data-testid="mobile-node-button"
        @click="$emit('open-connection')"
      >
        <span class="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <Icon icon="heroicons:computer-desktop-20-solid" class="h-5 w-5" aria-hidden="true" />
          <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white" :class="connected ? 'bg-green-500' : 'bg-amber-500'" data-testid="mobile-connection-dot" />
        </span>
        <span class="min-w-0">
          <span class="block truncate text-base font-semibold leading-5">{{ nodeName }}</span>
          <span class="block truncate text-xs leading-4" :class="connected ? 'text-slate-500' : 'font-medium text-amber-700'">{{ connectionLabel }}</span>
        </span>
        <Icon icon="heroicons:chevron-down-20-solid" class="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
      </button>
    </header>

    <div v-if="!connected" class="flex flex-shrink-0 items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert" data-testid="mobile-node-offline-banner">
      <Icon icon="heroicons:exclamation-triangle-20-solid" class="h-5 w-5 flex-shrink-0 text-amber-500" aria-hidden="true" />
      <p class="min-w-0 flex-1">Can’t reach {{ nodeName }}.</p>
      <button type="button" class="h-11 flex-shrink-0 rounded-lg px-3 text-sm font-semibold text-amber-900 underline active:bg-amber-100" @click="$emit('open-connection')">Check</button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-28" data-testid="mobile-runs-scroll">
      <MobileUnsupportedFeatureNotice v-if="notice" class="m-3" :message="notice" />
      <p v-if="store.listState === 'error'" class="sr-only">Couldn’t load your runs.</p>

      <div v-if="store.listState === 'loading'" class="animate-pulse" role="status" aria-label="Loading your runs" data-testid="mobile-runs-loading">
        <div v-for="n in 6" :key="n" class="flex items-center gap-3 px-4 py-3.5">
          <span class="h-9 w-9 rounded-full bg-slate-100" />
          <span class="flex-1 space-y-2"><span class="block h-3.5 w-2/5 rounded bg-slate-100" /><span class="block h-3 w-4/5 rounded bg-slate-100" /></span>
        </div>
      </div>

      <div v-else-if="store.listState === 'error'" class="flex flex-col items-center px-8 pt-24 text-center" data-testid="mobile-runs-error">
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="h-8 w-8 text-slate-400" aria-hidden="true" />
        <p class="mt-3 text-base font-semibold">Couldn’t load your runs.</p>
        <button type="button" class="mt-4 h-12 rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-700 active:bg-slate-100" data-testid="mobile-runs-retry" @click="store.retry()">Retry</button>
      </div>

      <div v-else-if="store.listState === 'empty'" class="flex flex-col items-center px-8 pt-24 text-center" data-testid="mobile-runs-empty">
        <p class="text-base font-semibold">No runs yet</p>
        <p class="mt-1 text-sm text-slate-500">Start with New run. Work an agent delegates appears under its run and leaves when it is done.</p>
      </div>

      <template v-else>
        <ul role="tree" aria-label="Your runs" data-testid="mobile-runs-list">
          <MobileRunRow
            v-for="run in store.visibleRuns"
            :key="run.id"
            :node="run"
            :depth="0"
            :selected-id="store.selectedId"
            @open="$emit('open-run', $event)"
          />
        </ul>
        <div v-if="store.olderCount > 0" class="flex justify-center py-2" data-testid="mobile-runs-fold">
          <button type="button" class="h-12 rounded-xl px-5 text-sm font-semibold text-blue-700 active:bg-blue-50" data-testid="mobile-runs-show-older" @click="store.showOlder = !store.showOlder">
            {{ store.showOlder ? 'Show fewer' : `Show older (${store.olderCount})` }}
          </button>
        </div>
      </template>
    </div>

    <button
      type="button"
      class="fixed right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/25 active:bg-blue-700"
      style="bottom: max(1rem, env(safe-area-inset-bottom))"
      aria-label="New run"
      title="New run"
      data-testid="mobile-start-run"
      @click="$emit('new-run')"
    >
      <Icon icon="heroicons:plus-20-solid" class="h-7 w-7" aria-hidden="true" />
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import MobileUnsupportedFeatureNotice from '~/components/mobile/MobileUnsupportedFeatureNotice.vue'
import MobileRunRow from '~/components/mobile/MobileRunRow.vue'
import type { MobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'

const props = defineProps<{ nodeName: string; connected: boolean; notice?: string | null }>()
defineEmits<{
  (event: 'open-run', node: MobileRunNode): void
  (event: 'new-run'): void
  (event: 'open-connection'): void
}>()
const store = useMobileRunTreeStore()
const connectionLabel = computed(() => (props.connected ? 'Connected' : 'Not reachable'))
</script>
