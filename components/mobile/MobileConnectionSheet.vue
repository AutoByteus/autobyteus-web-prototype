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
        <div class="flex min-h-[3.5rem] items-center justify-between gap-3">
          <span class="inline-flex items-center gap-2 text-sm font-semibold" :class="connected ? 'text-green-700' : 'text-amber-700'" data-testid="mobile-connection-status">
            <span class="h-2.5 w-2.5 rounded-full" :class="connected ? 'bg-green-500' : 'bg-amber-500'" aria-hidden="true" />
            {{ statusLabel }}
          </span>
          <!-- one-step-phone-pairing: a refresh icon when all is well; the word "Retry" when it is not -->
          <button v-if="connected" type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-500 active:bg-slate-100 disabled:opacity-60" :disabled="isChecking" aria-label="Check connection" data-testid="mobile-check-connection" @click="$emit('check')">
            <Icon icon="heroicons:arrow-path-20-solid" class="h-6 w-6" :class="isChecking ? 'animate-spin' : ''" aria-hidden="true" />
          </button>
          <button v-else type="button" class="h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 active:bg-slate-100 disabled:opacity-50" :disabled="isChecking" data-testid="mobile-check-connection" @click="$emit('check')">
            {{ isChecking ? 'Checking…' : 'Retry' }}
          </button>
        </div>

        <div v-if="diagnostic" class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" data-testid="mobile-connection-diagnostic">
          <p class="font-semibold">{{ diagnostic.title }}</p>
          <p class="mt-1">{{ diagnostic.message }}</p>
          <p class="mt-1 text-xs">{{ diagnostic.recoveryAction }}</p>
        </div>

        <!-- one-step-phone-pairing (UIS-010): only in the Android app. A plain browser tab has no node list to switch in. Peer nodes and Add a node are gone (the app's node list has the Scan button). -->
        <ul v-if="inApp" class="mt-2 border-y border-slate-100" data-testid="mobile-node-actions">
          <li>
            <button type="button" class="flex min-h-[3.5rem] w-full items-center gap-3 text-left active:bg-slate-50" data-testid="mobile-switch-node" @click="$emit('switch-node')">
              <Icon icon="heroicons:arrows-right-left-20-solid" class="h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
              <span class="min-w-0 flex-1">
                <span class="block text-base font-medium leading-5">Switch node</span>
                <span class="block text-[0.8125rem] leading-5 text-slate-500">{{ nodeCount }} {{ nodeCount === 1 ? 'node' : 'nodes' }} on this phone</span>
              </span>
              <Icon icon="heroicons:chevron-right-20-solid" class="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
            </button>
          </li>
        </ul>


        <button type="button" class="mt-3 h-12 w-full rounded-xl text-left text-[0.9375rem] font-semibold text-red-700 active:bg-red-50" data-testid="mobile-unpair" @click="$emit('unpair')">
          Unpair this phone
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { registerPhonePairingIcons } from '~/prototype/phone-pairing/phonePairingFixture'
import type { MobileConnectionDiagnostic } from '~/types/remoteAccess'

registerPhonePairingIcons()

defineProps<{
  nodeName: string
  serverBaseUrl: string
  connected: boolean
  statusLabel: string
  isChecking: boolean
  diagnostic: MobileConnectionDiagnostic | null
  /** The page runs inside the Android app (the app can show its node list). */
  inApp?: boolean
  nodeCount?: number
}>()
defineEmits<{ (event: 'close'): void; (event: 'check'): void; (event: 'unpair'): void; (event: 'switch-node'): void }>()
</script>
