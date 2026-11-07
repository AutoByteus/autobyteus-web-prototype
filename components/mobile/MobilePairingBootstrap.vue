<template>
  <div class="min-h-screen bg-slate-100">
  <div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-8" data-testid="mobile-pairing-bootstrap">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div class="flex items-center gap-2.5">
        <img src="/autobyteus-icon.svg" alt="" class="h-7 w-7" aria-hidden="true" />
        <span class="text-base font-semibold text-slate-900">AutoByteus</span>
      </div>

      <div v-if="$slots.notice" class="mt-4">
        <slot name="notice" />
      </div>

      <!-- A pairing link was opened (the camera scanned the QR): one button -->
      <template v-if="hasLink">
        <span class="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><Icon icon="heroicons:computer-desktop-20-solid" class="h-7 w-7" aria-hidden="true" /></span>
        <h1 class="mt-4 text-[1.375rem] font-semibold leading-7 text-slate-950" data-testid="mobile-pairing-node-name">{{ nodeName }}</h1>
        <p class="mt-1 text-[0.9375rem] leading-6 text-slate-600">Connect this phone to use its runs.</p>

        <p v-if="localError" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900" role="alert" data-testid="mobile-pairing-error">{{ localError }}</p>

        <button type="button" class="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-[1.0625rem] font-semibold text-white active:bg-blue-700 disabled:opacity-70" :disabled="connecting" data-testid="mobile-pair-button" @click="connect">
          <span v-if="connecting" class="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          {{ connecting ? 'Connecting…' : `Connect to ${nodeName}` }}
        </button>
      </template>

      <!-- No link: the browser has nothing to connect to yet -->
      <template v-else>
        <span class="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon icon="heroicons:qr-code-20-solid" class="h-7 w-7" aria-hidden="true" /></span>
        <h1 class="mt-4 text-[1.375rem] font-semibold leading-7 text-slate-950">Connect this phone</h1>
        <p class="mt-1 text-[0.9375rem] leading-6 text-slate-600" data-testid="mobile-pairing-instructions">Scan the QR code on your computer with this phone’s camera.</p>
        <p v-if="localError" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900" role="alert" data-testid="mobile-pairing-error">{{ localError }}</p>
      </template>

      <a href="#get-the-android-app" class="mt-5 inline-flex min-h-[3rem] items-center gap-1.5 text-[0.9375rem] font-semibold text-blue-700" data-testid="mobile-get-app" @click.prevent>
        Get the Android app
        <Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-4 w-4" aria-hidden="true" />
      </a>

      <details v-if="!hasLink" class="group mt-2 border-t border-slate-100 pt-3" data-testid="mobile-other-ways">
        <summary class="flex min-h-[3rem] cursor-pointer list-none items-center justify-between text-[0.9375rem] font-medium text-slate-600 [&::-webkit-details-marker]:hidden">
          Other ways to connect
          <Icon icon="heroicons:chevron-down-20-solid" class="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <label for="pairing-link" class="mt-2 block text-sm font-medium text-slate-700">Paste a pairing link</label>
        <textarea id="pairing-link" v-model="pairingText" class="mt-1.5 h-24 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Paste the link from your computer" data-testid="mobile-pairing-text" />
        <button type="button" class="mt-3 h-12 w-full rounded-xl border border-slate-300 text-[0.9375rem] font-semibold text-slate-700 active:bg-slate-100 disabled:opacity-50" :disabled="!pairingText.trim() || connecting" data-testid="mobile-paste-connect" @click="connect">Connect</button>
      </details>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { nodeNameFromPairing, registerPhonePairingIcons } from '~/prototype/phone-pairing/phonePairingFixture'
import { useMobileNodeSessionStore } from '~/stores/mobileNodeSessionStore'

registerPhonePairingIcons()

const emit = defineEmits<{
  paired: []
  'pairing-failed': []
  'pairing-started': []
}>()
const sessionStore = useMobileNodeSessionStore()
const pairingText = ref('')
const connecting = ref(false)
const localError = ref<string | null>(null)
const linkFromAddress = ref(false)

const hasLink = computed(() => linkFromAddress.value && Boolean(pairingText.value.trim()))
const nodeName = computed(() => nodeNameFromPairing(pairingText.value))

async function connect(): Promise<void> {
  localError.value = null
  connecting.value = true
  emit('pairing-started')
  // Design-only: the node would answer the one-time code; the reference pairs after a moment with an inert fixture session.
  await new Promise((resolve) => setTimeout(resolve, 1200))
  const now = '2026-11-07T08:00:00.000Z'
  localStorage.setItem(
    'autobyteus.remote_access.mobile_session.v1',
    JSON.stringify({
      version: 1,
      nodeId: 'mobile-paired-node',
      serverBaseUrl: window.location.origin,
      credential: 'prototype_mobile_session',
      device: { deviceId: 'prototype-phone', displayName: 'Phone', clientFacingBaseUrl: window.location.origin, createdAt: now, lastSeenAt: now, revokedAt: null },
      pairedAt: now,
    }),
  )
  sessionStore.initializeFromStorage()
  connecting.value = false
  emit('paired')
}

onMounted(() => {
  const fromAddress = new URL(window.location.href).searchParams.get('pairing') || ''
  linkFromAddress.value = Boolean(fromAddress)
  pairingText.value = fromAddress
})
</script>
