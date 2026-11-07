<template>
  <section class="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="phone-connect-panel">
    <!-- Connect a phone -->
    <div class="px-6 pb-6 pt-6" data-testid="phone-connect-section">
      <h3 class="text-lg font-semibold leading-7 text-slate-900" data-testid="phone-connect-title">Phones for {{ nodeName }}</h3>
      <p class="mt-0.5 text-sm leading-6 text-slate-500">Show a code, then scan it with the AutoByteus app on your phone.</p>

      <!-- Idle / blocked / asking -->
      <div v-if="phase === 'idle' || phase === 'blocked' || phase === 'asking'" class="mt-5">
        <div v-if="phase === 'asking'" class="max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-4" role="group" aria-labelledby="wifi-question-title" data-testid="phone-wifi-question">
          <h4 id="wifi-question-title" class="text-sm font-semibold text-amber-950">Use this Wi-Fi?</h4>
          <p class="mt-1 text-sm leading-6 text-amber-900">Your phone will connect over this Wi-Fi without encryption. Only on a network you trust.</p>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-testid="phone-wifi-allow" @click="allowWifi">Use this Wi-Fi</button>
            <button type="button" class="rounded-lg px-3 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" data-testid="phone-wifi-not-now" @click="declineWifi">Not now</button>
          </div>
          <p class="mt-3 text-xs leading-5 text-amber-800">We ask this once on this computer. You can change it under Other options.</p>
        </div>

        <template v-else>
          <div v-if="phase === 'blocked'" class="flex max-w-xl items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4" role="status" data-testid="phone-connect-blocked">
            <Icon icon="heroicons:exclamation-triangle-20-solid" class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" aria-hidden="true" />
            <p class="text-sm leading-6 text-slate-700">{{ blockedMessage }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2" :class="phase === 'blocked' ? 'mt-4' : ''">
            <button type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-testid="phone-connect-button" @click="connect">
              <Icon :icon="phase === 'blocked' ? 'heroicons:arrow-path-20-solid' : 'heroicons:qr-code-20-solid'" class="h-5 w-5" aria-hidden="true" />
              {{ phase === 'blocked' ? 'Try again' : 'Connect a phone' }}
            </button>
            <p v-if="phase === 'idle' && declinedWifi" class="max-w-md text-sm leading-6 text-slate-600" data-testid="phone-wifi-declined-hint">Phones can’t connect until you use this Wi-Fi. Or install <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer" class="font-medium text-blue-700 underline-offset-2 hover:underline" data-testid="phone-tailscale-link">Tailscale</a> on this computer and your phone.</p>
            <p v-else-if="phase === 'idle' && !accessOn" class="text-sm text-slate-500" data-testid="phone-access-off-note">Phone access is off. Connecting a phone turns it on.</p>
          </div>
          <p v-if="phase === 'idle' && !declinedWifi && network.kind !== 'tailscale'" class="mt-4 flex max-w-xl items-start gap-2 text-sm leading-6 text-slate-600" data-testid="phone-tailscale-info">
            <Icon icon="heroicons:information-circle-20-solid" class="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
            <span>Phones connect over your home Wi-Fi. To connect from anywhere, install <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer" class="font-medium text-blue-700 underline-offset-2 hover:underline" data-testid="phone-tailscale-link">Tailscale</a> on this computer and your phone.</span>
          </p>
        </template>
      </div>

      <!-- Code shown / expired -->
      <div v-else class="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start" data-testid="phone-connect-code">
        <div class="relative h-[208px] w-[208px] flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2.5">
          <img v-if="qrDataUrl" :src="qrDataUrl" alt="Pairing QR code" class="h-full w-full transition-opacity" :class="phase === 'expired' ? 'opacity-10' : ''" data-testid="phone-qr-image" />
          <div v-if="phase === 'expired'" class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center" data-testid="phone-qr-expired">
            <Icon icon="heroicons:clock-20-solid" class="h-6 w-6 text-slate-400" aria-hidden="true" />
            <p class="text-sm font-semibold text-slate-700">This code has expired</p>
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-2 text-base font-semibold leading-6 text-slate-900" data-testid="phone-connect-line">
            <span class="h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="lineDot" aria-hidden="true" />
            {{ connectLine }}
          </p>
          <p class="mt-1 text-sm leading-6 text-slate-600">Open the AutoByteus app on your phone and scan this code.</p>

          <p v-if="phase === 'qr'" class="mt-3 inline-flex items-center gap-1.5 text-sm tabular-nums" :class="secondsLeft <= 60 ? 'font-semibold text-amber-700' : 'text-slate-600'" role="timer" data-testid="phone-qr-timer">
            <Icon icon="heroicons:clock-20-solid" class="h-4 w-4" aria-hidden="true" />
            Valid for {{ timeLeft }}
          </p>

          <p v-if="hint && phase === 'qr'" class="mt-4 max-w-md rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700" data-testid="phone-connect-hint">To connect away from home, install <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer" class="font-medium text-blue-700 underline-offset-2 hover:underline" data-testid="phone-tailscale-link">Tailscale</a> on this computer and your phone.</p>

          <div class="mt-5 flex flex-wrap items-center gap-2">
            <button v-if="phase === 'expired'" type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-testid="phone-new-code" @click="showCode">
              <Icon icon="heroicons:arrow-path-20-solid" class="h-5 w-5" aria-hidden="true" />
              New code
            </button>
            <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="phone-code-close" @click="closeCode">Close</button>
          </div>
          <p class="mt-4 text-xs leading-5 text-slate-500">No app yet? Scan with the phone’s camera to connect in the browser.</p>
        </div>
      </div>
    </div>

    <!-- Other options -->
    <div class="border-t border-slate-100 px-6 py-3" data-testid="phone-other-options">
      <button type="button" class="-ml-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-expanded="optionsOpen" aria-controls="phone-other-options-body" data-testid="phone-other-options-toggle" @click="optionsOpen = !optionsOpen">
        <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4 text-slate-400 transition-transform" :class="optionsOpen ? 'rotate-90' : ''" aria-hidden="true" />
        Other options
      </button>

      <div v-if="optionsOpen" id="phone-other-options-body" class="mt-2 space-y-5 pb-3 pl-1">
        <div class="flex items-start justify-between gap-6" data-testid="phone-option-wifi">
          <div class="min-w-0">
            <p id="wifi-switch-label" class="text-sm font-medium text-slate-900">Home Wi-Fi allowed</p>
            <p class="mt-0.5 text-sm leading-5 text-slate-500">Phones connect over this Wi-Fi without encryption, for every node on this computer. Only on a network you trust.</p>
          </div>
          <button type="button" role="switch" class="relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" :class="wifiAllowed ? 'bg-emerald-500' : 'bg-slate-300'" :aria-checked="wifiAllowed" aria-labelledby="wifi-switch-label" data-testid="phone-wifi-switch" @click="toggleWifi">
            <span aria-hidden="true" class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform" :class="wifiAllowed ? 'translate-x-5' : 'translate-x-0.5'" />
          </button>
        </div>

        <div v-if="network.tailscaleRunning" data-testid="phone-option-secure-address">
          <p class="text-sm font-medium text-slate-900">Secure web address</p>
          <template v-if="!httpsReady">
            <p class="mt-0.5 text-sm leading-5 text-slate-500">Optional. Run this once in a terminal on this computer to give {{ nodeName }} an https:// address on your Tailscale network.</p>
            <div class="mt-2 flex items-center gap-2">
              <code class="min-w-0 flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800" data-testid="phone-serve-command">{{ serveCommand }}</code>
              <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="phone-serve-copy" @click="copyCommand">
                <Icon :icon="copied ? 'heroicons:check-20-solid' : 'heroicons:clipboard-document-20-solid'" class="h-4 w-4" aria-hidden="true" />
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
              <button type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60" :disabled="checkingHttps" data-testid="phone-serve-check" @click="checkAgain">
                {{ checkingHttps ? 'Checking…' : 'Check again' }}
              </button>
            </div>
          </template>
          <p v-else class="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500" data-testid="phone-serve-ready">
            <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Set up. Phones can use the https:// address.
          </p>
        </div>

        <div data-testid="phone-option-address">
          <label for="phone-manual-address" class="text-sm font-medium text-slate-900">Enter an address by hand</label>
          <div class="mt-1.5 flex items-center gap-2">
            <input id="phone-manual-address" v-model="manualAddress" type="text" inputmode="url" autocomplete="off" placeholder="https://node.example.com" class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" data-testid="phone-manual-address" @keydown.enter="useManualAddress" />
            <button type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50" :disabled="!manualAddress.trim()" data-testid="phone-manual-use" @click="useManualAddress">Use this address</button>
          </div>
        </div>

        <div v-if="accessOn" data-testid="phone-option-turn-off">
          <button type="button" class="rounded-md py-1 text-sm font-medium text-red-700 transition-colors hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400" @click="turnOff">Turn off phone access</button>
        </div>
      </div>
    </div>

    <!-- Paired phones -->
    <div class="border-t border-slate-100 px-6 py-5" data-testid="phone-paired-section">
      <div class="flex items-center justify-between gap-3">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Paired phones</h4>
        <button v-if="activePhones.length > 0 && !confirmingRevokeAll" type="button" class="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400" data-testid="phone-revoke-all" @click="confirmingRevokeAll = true">Revoke all</button>
      </div>

      <div v-if="confirmingRevokeAll" class="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3" role="alertdialog" aria-label="Revoke all phones" data-testid="phone-revoke-all-confirm">
        <p class="text-sm text-red-900">Revoke all {{ activePhones.length }} phones? Each one must connect again.</p>
        <div class="flex items-center gap-2">
          <button type="button" class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1" data-testid="phone-revoke-all-yes" @click="revokeAll">Revoke all</button>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-red-900 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400" @click="confirmingRevokeAll = false">Cancel</button>
        </div>
      </div>

      <p v-if="activePhones.length === 0 && !confirmingRevokeAll" class="mt-2 text-sm text-slate-500" data-testid="phone-paired-empty">No phones are connected yet.</p>
      <ul v-else-if="activePhones.length > 0" class="mt-2 divide-y divide-slate-100" data-testid="phone-paired-list">
        <li v-for="phone in activePhones" :key="phone.id" class="flex items-center gap-3 py-3" data-testid="phone-paired-row">
          <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Icon icon="heroicons:device-phone-mobile-20-solid" class="h-5 w-5" aria-hidden="true" /></span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-slate-900">{{ phone.name }}</span>
            <span class="block truncate text-xs text-slate-500">Connects through {{ phone.via }} · Last seen {{ phone.lastSeen }}</span>
          </span>
          <button type="button" class="flex-shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400" :aria-label="`Revoke ${phone.name}`" data-testid="phone-revoke" @click="revokeOne(phone)">Revoke</button>
        </li>
      </ul>

      <div v-if="revokedPhones.length > 0" class="mt-2 border-t border-slate-100 pt-2" data-testid="phone-history">
        <button type="button" class="-ml-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-expanded="historyOpen" aria-controls="phone-history-list" data-testid="phone-history-toggle" @click="historyOpen = !historyOpen">
          <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4 text-slate-400 transition-transform" :class="historyOpen ? 'rotate-90' : ''" aria-hidden="true" />
          History ({{ revokedPhones.length }})
        </button>
        <ul v-if="historyOpen" id="phone-history-list" class="mt-1 max-h-72 divide-y divide-slate-100 overflow-y-auto" data-testid="phone-history-list">
          <li v-for="phone in revokedPhones" :key="phone.id" class="flex items-center gap-3 py-2.5 pl-1" data-testid="phone-history-row">
            <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400"><Icon icon="heroicons:device-phone-mobile-20-solid" class="h-4 w-4" aria-hidden="true" /></span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm text-slate-700">{{ phone.name }}</span>
              <span class="block truncate text-xs text-slate-500">Revoked {{ phone.revokedOn }} · Connected through {{ phone.via }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { toQrCodeDataUrl } from '~/services/qr/qrCodeDataUrlService'
import {
  WIFI_ALLOWED_KEY,
  networkFor,
  readPhoneState,
  registerPhonePairingIcons,
  sampleQrPayload,
  seedActivePhones,
  seedRevokedPhones,
  type PairedPhone,
} from '~/prototype/phone-pairing/phonePairingFixture'

const props = defineProps<{ nodeName: string; localPort?: number }>()

registerPhonePairingIcons()

type Phase = 'idle' | 'asking' | 'blocked' | 'qr' | 'expired'

const scenario = readPhoneState()
const network = networkFor(scenario)

const phase = ref<Phase>('idle')
const accessOn = ref(true)
const wifiAllowed = ref(
  scenario === 'wifi_allowed' || (scenario !== 'wifi_ask' && localStorage.getItem(WIFI_ALLOWED_KEY) === '1'),
)
const declinedWifi = ref(false)
const optionsOpen = ref(false)
const historyOpen = ref(false)
const confirmingRevokeAll = ref(false)
const manualAddress = ref('')
const manualUsed = ref('')
const httpsReady = ref(network.tailscaleHttps)
const checkingHttps = ref(false)
const copied = ref(false)
const qrDataUrl = ref<string | null>(null)
const secondsLeft = ref(300)
const activePhones = ref<PairedPhone[]>(seedActivePhones(scenario))
const revokedPhones = ref<PairedPhone[]>(seedRevokedPhones(scenario))
let ticker: ReturnType<typeof setInterval> | null = null

const serveCommand = computed(() => `tailscale serve --bg --https=8443 ${props.localPort ?? 29695}`)
const timeLeft = computed(() => `${Math.floor(secondsLeft.value / 60)}:${String(secondsLeft.value % 60).padStart(2, '0')}`)

const blockedMessage = computed(() =>
  network.kind === 'docker_unpublished'
    ? `${props.nodeName} isn’t reachable from other devices. Publish its port on this computer’s network, then try again.`
    : 'This computer isn’t on a Wi-Fi or Tailscale network. Connect it to your Wi-Fi, then try again.',
)

// How the phone will connect, in one plain line. The node worked this out; the user chose nothing.
const connectLine = computed(() => {
  if (manualUsed.value) return 'Connects at the address you entered'
  return network.kind === 'tailscale' ? 'Works anywhere through Tailscale' : 'Works on this Wi-Fi only'
})
const lineDot = computed(() => (manualUsed.value || network.kind === 'tailscale' ? 'bg-emerald-500' : 'bg-amber-500'))
const hint = computed(() =>
  network.kind === 'wifi' && !manualUsed.value ? 'To connect away from home, install Tailscale on this computer and your phone.' : '',
)

function stopTicker(): void {
  if (ticker) clearInterval(ticker)
  ticker = null
}

async function showCode(): Promise<void> {
  stopTicker()
  qrDataUrl.value = await toQrCodeDataUrl(sampleQrPayload(props.nodeName))
  secondsLeft.value = 300
  phase.value = 'qr'
  ticker = setInterval(() => {
    secondsLeft.value = Math.max(0, secondsLeft.value - 1)
    if (secondsLeft.value === 0) {
      stopTicker()
      phase.value = 'expired'
    }
  }, 1000)
}

function connect(): void {
  accessOn.value = true // the click is the consent (DEC-009)
  declinedWifi.value = false
  if (network.kind === 'nothing' || network.kind === 'docker_unpublished') {
    phase.value = 'blocked'
    return
  }
  if (network.kind === 'wifi' && !wifiAllowed.value) {
    phase.value = 'asking'
    return
  }
  void showCode()
}

function allowWifi(): void {
  wifiAllowed.value = true
  localStorage.setItem(WIFI_ALLOWED_KEY, '1')
  void showCode()
}

function declineWifi(): void {
  declinedWifi.value = true
  phase.value = 'idle'
}

function toggleWifi(): void {
  wifiAllowed.value = !wifiAllowed.value
  if (wifiAllowed.value) localStorage.setItem(WIFI_ALLOWED_KEY, '1')
  else localStorage.removeItem(WIFI_ALLOWED_KEY)
}

function closeCode(): void {
  stopTicker()
  qrDataUrl.value = null
  manualUsed.value = ''
  phase.value = 'idle'
}

async function copyCommand(): Promise<void> {
  try {
    await navigator.clipboard.writeText(serveCommand.value)
  } catch {
    /* the reference only shows the feedback */
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}

function checkAgain(): void {
  checkingHttps.value = true
  setTimeout(() => {
    checkingHttps.value = false
    httpsReady.value = true
  }, 900)
}

function useManualAddress(): void {
  if (!manualAddress.value.trim()) return
  manualUsed.value = manualAddress.value.trim()
  accessOn.value = true
  void showCode()
}

function turnOff(): void {
  accessOn.value = false
  closeCode()
  optionsOpen.value = false
}

function revokeOne(phone: PairedPhone): void {
  activePhones.value = activePhones.value.filter((candidate) => candidate.id !== phone.id)
  revokedPhones.value = [{ ...phone, revokedOn: 'Today' }, ...revokedPhones.value]
}

function revokeAll(): void {
  revokedPhones.value = [...activePhones.value.map((phone) => ({ ...phone, revokedOn: 'Today' })), ...revokedPhones.value]
  activePhones.value = []
  confirmingRevokeAll.value = false
}

onMounted(async () => {
  if (scenario === 'expired') {
    qrDataUrl.value = await toQrCodeDataUrl(sampleQrPayload(props.nodeName))
    secondsLeft.value = 0
    phase.value = 'expired'
  }
})

// Closing the panel discards the shown code (REQ-015).
onBeforeUnmount(stopTicker)
</script>
