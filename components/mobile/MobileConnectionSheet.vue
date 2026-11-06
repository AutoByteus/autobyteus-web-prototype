<template>
  <div class="fixed inset-0 z-40 flex flex-col justify-end" data-testid="mobile-connection-sheet">
    <button type="button" class="absolute inset-0 bg-slate-900/40" aria-label="Close" @click="$emit('close')" />
    <section class="relative flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-xl" role="dialog" aria-modal="true" :aria-label="`${nodeName} connection`">
      <div class="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
      <header class="flex flex-shrink-0 items-start justify-between gap-3 pl-4 pr-2 pt-2">
        <div class="min-w-0 py-1">
          <h2 class="truncate text-lg font-semibold">{{ nodeName }}</h2>
          <p class="mt-0.5 break-all font-mono text-xs text-slate-500">{{ serverBaseUrl }}</p>
        </div>
        <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-500 active:bg-slate-100" aria-label="Close" @click="$emit('close')">
          <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
        </button>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div class="flex items-center justify-between gap-3 py-3">
          <span class="inline-flex items-center gap-2 text-sm font-semibold" :class="connected ? 'text-green-700' : 'text-amber-700'" data-testid="mobile-connection-status">
            <span class="h-2.5 w-2.5 rounded-full" :class="connected ? 'bg-green-500' : 'bg-amber-500'" aria-hidden="true" />
            {{ statusLabel }}
          </span>
          <button type="button" class="h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 active:bg-slate-100 disabled:opacity-50" :disabled="isChecking" data-testid="mobile-check-connection" @click="$emit('check')">
            {{ isChecking ? 'Checking…' : 'Check connection' }}
          </button>
        </div>

        <div v-if="diagnostic" class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" data-testid="mobile-connection-diagnostic">
          <p class="font-semibold">{{ diagnostic.title }}</p>
          <p class="mt-1">{{ diagnostic.message }}</p>
          <p class="mt-1 text-xs">{{ diagnostic.recoveryAction }}</p>
        </div>

        <section v-if="peers.length" class="mt-4" aria-labelledby="mobile-peers-title" data-testid="mobile-peers">
          <h3 id="mobile-peers-title" class="text-sm font-semibold text-slate-500">Peer nodes</h3>
          <ul class="mt-1 divide-y divide-slate-100">
            <li v-for="peer in peers" :key="peer.name" class="flex min-h-[3.5rem] items-center gap-3 py-2" data-testid="mobile-peer">
              <span class="h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="peer.reachable ? 'bg-green-500' : 'bg-red-500'" aria-hidden="true" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-[0.9375rem] font-medium">{{ peer.name }}</span>
                <span class="block truncate text-[0.8125rem] text-slate-500">{{ peer.reachable ? `${peer.agents} agents · ${peer.teams} teams` : 'Not reachable' }}</span>
              </span>
            </li>
          </ul>
        </section>

        <button type="button" class="mt-4 h-12 w-full rounded-xl text-left text-[0.9375rem] font-semibold text-red-700 active:bg-red-50" data-testid="mobile-unpair" @click="$emit('unpair')">
          Unpair this phone
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { MobilePeer } from '~/prototype/mobile-runs/mobileRunsFixture'
import type { MobileConnectionDiagnostic } from '~/types/remoteAccess'

defineProps<{
  nodeName: string
  serverBaseUrl: string
  connected: boolean
  statusLabel: string
  isChecking: boolean
  diagnostic: MobileConnectionDiagnostic | null
  peers: MobilePeer[]
}>()
defineEmits<{ (event: 'close'): void; (event: 'check'): void; (event: 'unpair'): void }>()
</script>
