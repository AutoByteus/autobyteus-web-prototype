<template>
  <section class="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-testid="phone-connect-panel">
    <!-- Connect a phone: one tab per way to connect -->
    <div class="px-6 pb-6 pt-6" data-testid="phone-connect-section">
      <h3 class="text-lg font-semibold leading-7 text-slate-900" data-testid="phone-connect-title">Phones</h3>
      <p class="mt-0.5 text-sm leading-6 text-slate-500" data-testid="phone-connect-subtitle">Show a code, then scan it with the AutoByteus app to connect a phone to <span class="font-medium text-slate-700">{{ nodeName }}</span>.</p>

      <p v-if="ways.blocked" class="mt-4 flex max-w-2xl items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-700" role="status" data-testid="phone-connect-blocked">
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" aria-hidden="true" />
        {{ blockedMessage }}
      </p>

      <div class="mt-5 overflow-x-auto" data-testid="phone-way-tabs">
        <div class="inline-flex w-fit gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 md:rounded-full" role="tablist" aria-label="Ways to connect a phone">
          <button v-for="way in tabs" :id="`phone-tab-${way.id}`" :key="way.id" type="button" role="tab" :aria-selected="tab === way.id" :aria-controls="`phone-panel-${way.id}`" :tabindex="tab === way.id ? 0 : -1" class="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :class="tab === way.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'" :data-testid="`phone-tab-${way.id}`" @click="selectTab(way.id)" @keydown="tabKeys($event, way.id)">
            <span class="h-2 w-2 flex-shrink-0 rounded-full" :class="isReady(way.id) ? 'bg-emerald-500' : 'bg-slate-300'" aria-hidden="true" />
            {{ way.label }}
            <span v-if="recommended === way.id" class="rounded-full bg-blue-50 px-2 py-0.5 text-[0.6875rem] font-semibold leading-4 text-blue-700" data-testid="phone-recommended">Recommended</span>
          </button>
        </div>
      </div>

      <!-- The open tab -->
      <div :id="`phone-panel-${tab}`" role="tabpanel" :aria-labelledby="`phone-tab-${tab}`" class="mt-4 max-w-3xl rounded-xl border border-slate-200 p-5" :data-testid="`phone-panel-${tab}`">
        <div class="flex flex-wrap items-center gap-2">
          <h4 class="text-sm font-semibold text-slate-900">{{ current.title }}</h4>
          <span class="text-xs text-slate-500">{{ current.tag }}</span>
        </div>
        <p class="mt-2 flex items-start gap-2 text-sm font-medium leading-6" :class="isReady(tab) ? 'text-emerald-700' : 'text-slate-700'" data-testid="phone-way-status">
          <span class="mt-2 h-2 w-2 flex-shrink-0 rounded-full" :class="isReady(tab) ? 'bg-emerald-500' : 'bg-slate-300'" aria-hidden="true" />
          {{ statusLine }}
        </p>
        <p v-if="checkNote[tab]" class="mt-0.5 pl-4 text-sm leading-6 text-slate-500" data-testid="phone-check-note">{{ checkNote[tab] }}</p>

        <dl class="mt-3 space-y-1.5 text-sm leading-6 text-slate-600">
          <div class="grid grid-cols-[5.5rem_1fr] gap-x-3" data-testid="phone-how-it-works"><dt class="font-medium text-slate-800">How it works</dt><dd>{{ current.how }}</dd></div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-x-3"><dt class="font-medium text-slate-800">When</dt><dd>{{ current.when }}</dd></div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-x-3">
            <dt class="font-medium text-slate-800">Setup</dt>
            <dd>
              <template v-if="tab === 'tailscale' && !isReady('tailscale')">
                <ol class="list-decimal space-y-1 pl-5 marker:text-slate-400">
                  <li>Install Tailscale (free) on this computer and on your phone. <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer" class="font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="phone-tailscale-link">Get Tailscale</a>.</li>
                  <li>Sign in to the same account on both, and keep it on.</li>
                </ol>
              </template>
              <template v-else-if="tab === 'tailscale'">Install Tailscale (free) on this computer and on your phone, sign in to the same account on both, and keep it on. AutoByteus finds it by itself.</template>
              <template v-else>{{ current.setup }}</template>
            </dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-x-3"><dt class="font-medium text-slate-800">Safety</dt><dd>{{ current.safety }}</dd></div>
        </dl>

        <!-- Same Wi-Fi: the first time on a network the button asks; afterwards a switch keeps the answer -->
        <div v-if="tab === 'wifi' && isReady('wifi') && !wifiAllowed" class="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3" data-testid="phone-wifi-question">
          <p class="text-sm font-semibold text-slate-900">Allow phones on this network?</p>
          <p class="mt-0.5 text-sm leading-5 text-slate-600">Fine for home and office networks. On public Wi-Fi, use Tailscale instead.</p>
          <p class="mt-1.5 text-xs leading-5 text-slate-500">This network: {{ ways.wifi.networkName }}. We ask once for each network.</p>
        </div>
        <div v-if="tab === 'wifi' && isReady('wifi') && wifiAllowed" class="mt-4 flex items-start justify-between gap-6 border-t border-slate-100 pt-4" data-testid="phone-option-wifi">
          <div class="min-w-0">
            <p id="wifi-switch-label" class="text-sm font-medium text-slate-900">Wi-Fi/LAN allowed on this network</p>
            <p class="mt-0.5 text-sm leading-5 text-slate-700" data-testid="phone-network-state">Allowed on this network, {{ ways.wifi.networkName }}. We ask again on a new network.</p>
            <p class="mt-0.5 text-sm leading-5 text-slate-500">For home and office networks. Applies to every node on this computer.</p>
            <p class="mt-1 text-xs leading-5 text-slate-500" data-testid="phone-network-public-note">On public Wi-Fi (café, hotel, airport), use Tailscale instead: there, others on the network could see the connection.</p>
          </div>
          <button type="button" role="switch" class="relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" aria-checked="true" aria-labelledby="wifi-switch-label" data-testid="phone-wifi-switch" @click="toggleWifi">
            <span aria-hidden="true" class="inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow-sm transition-transform" />
          </button>
        </div>

        <!-- Company address: shown when set up, otherwise the field -->
        <div v-if="tab === 'company'" class="mt-4" data-testid="phone-company-address">
          <p v-if="ways.company.ready" class="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800" data-testid="phone-company-address-value">{{ ways.company.address }}</p>
          <form v-else @submit.prevent="useCompanyAddress">
            <label for="phone-manual-address" class="text-sm font-medium text-slate-900">Enter the address your IT gave you</label>
            <div class="mt-1.5 flex max-w-xl items-center gap-2">
              <input id="phone-manual-address" v-model="manualAddress" type="text" inputmode="url" autocomplete="off" placeholder="https://node.example.com" class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" data-testid="phone-manual-address" />
              <button type="submit" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60" :disabled="!manualAddress.trim()" data-testid="phone-manual-use">Use this address</button>
            </div>
          </form>
        </div>

        <!-- Actions -->
        <div class="mt-5 flex flex-wrap items-center gap-3">
          <button v-if="!(tab === 'company' && !ways.company.ready)" type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none" :disabled="!isReady(tab)" data-testid="phone-show-qr" @click="showQr">
            <Icon icon="heroicons:qr-code-20-solid" class="h-5 w-5" aria-hidden="true" />
            {{ qrButtonLabel }}
          </button>
          <button v-if="(tab === 'tailscale' || tab === 'vpn') && !isReady(tab)" type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60" :disabled="checking === tab" data-testid="phone-check-again" @click="checkWay(tab)">
            {{ checking === tab ? 'Checking…' : 'Check again' }}
          </button>
          <p v-if="!accessOn" class="text-sm text-slate-500" data-testid="phone-access-off-note">Phone access is off. Showing a QR code turns it on.</p>
        </div>

        <!-- Tailscale: the optional secure web address, under Advanced -->
        <div v-if="tab === 'tailscale' && isReady('tailscale')" class="mt-4 border-t border-slate-100 pt-3" data-testid="phone-option-secure-address">
          <button type="button" class="-ml-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-expanded="advancedOpen" aria-controls="phone-advanced-body" data-testid="phone-advanced-toggle" @click="advancedOpen = !advancedOpen">
            <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4 text-slate-400 transition-transform" :class="advancedOpen ? 'rotate-90' : ''" aria-hidden="true" />
            Advanced
          </button>
          <div v-if="advancedOpen" id="phone-advanced-body" class="mt-2 pl-1">
            <p class="text-sm font-medium text-slate-900">Secure web address</p>
            <template v-if="!httpsReady">
              <p class="mt-0.5 text-sm leading-5 text-slate-500">Optional. Run this once in a terminal on this computer to give {{ nodeName }} an https:// address on your Tailscale network. AutoByteus shows it and does not run it.</p>
              <div class="mt-2 flex items-center gap-2">
                <code class="min-w-0 flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800" data-testid="phone-serve-command">{{ serveCommand }}</code>
                <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 !px-3 !py-2" data-testid="phone-serve-copy" @click="copyCommand">
                  <Icon :icon="copied ? 'heroicons:check-20-solid' : 'heroicons:clipboard-document-20-solid'" class="h-4 w-4" aria-hidden="true" />
                  {{ copied ? 'Copied' : 'Copy' }}
                </button>
                <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 !px-3 !py-2" :disabled="checkingHttps" data-testid="phone-serve-check" @click="checkAgain">{{ checkingHttps ? 'Checking…' : 'Check again' }}</button>
              </div>
            </template>
            <p v-else class="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500" data-testid="phone-serve-ready">
              <Icon icon="heroicons:check-circle-20-solid" class="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Set up. Phones can use the https:// address.
            </p>
          </div>
        </div>
      </div>

      <!-- Code shown / expired -->
      <div v-if="phase === 'qr' || phase === 'expired'" class="mt-5 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-start" data-testid="phone-connect-code">
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

          <div class="mt-5 flex flex-wrap items-center gap-2">
            <button v-if="phase === 'expired'" type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none" data-testid="phone-new-code" @click="showCode(activeWay)">
              <Icon icon="heroicons:arrow-path-20-solid" class="h-5 w-5" aria-hidden="true" />
              New code
            </button>
            <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60" data-testid="phone-code-close" @click="closeCode">Close</button>
          </div>
          <p class="mt-4 text-xs leading-5 text-slate-500" data-testid="phone-code-footnote">The QR code works once and only for 5 minutes. It holds a one-time code, not a password. After scanning, the phone stays connected. Lost a phone? Revoke it below. AutoByteus never opens this computer to the public internet. No app yet? Scan with the phone’s camera to connect in the browser.</p>
        </div>
      </div>
    </div>

    <!-- Other options -->
    <div class="border-t border-slate-100 px-6 py-3" data-testid="phone-other-options">
      <button type="button" class="-ml-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-expanded="optionsOpen" aria-controls="phone-other-options-body" data-testid="phone-other-options-toggle" @click="optionsOpen = !optionsOpen">
        <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4 text-slate-400 transition-transform" :class="optionsOpen ? 'rotate-90' : ''" aria-hidden="true" />
        Other options
      </button>
      <div v-if="optionsOpen" id="phone-other-options-body" class="mt-2 pb-2 pl-1">
        <button v-if="accessOn" type="button" class="rounded-md py-1 text-sm font-medium text-red-700 transition-colors hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400" data-testid="phone-option-turn-off" @click="turnOff">Turn off phone access</button>
        <p v-else class="text-sm text-slate-500">Phone access is off.</p>
      </div>
    </div>

    <!-- Paired phones -->
    <div class="border-t border-slate-100 px-6 py-5" data-testid="phone-paired-section">
      <div class="flex items-center justify-between gap-3">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Connected phones</h4>
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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { toQrCodeDataUrl } from '~/services/qr/qrCodeDataUrlService'
import {
  WIFI_ALLOWED_KEY,
  readPhoneState,
  registerPhonePairingIcons,
  sampleQrPayload,
  seedActivePhones,
  seedRevokedPhones,
  waysFor,
  type PairedPhone,
} from '~/prototype/phone-pairing/phonePairingFixture'

const props = defineProps<{ nodeName: string; localPort?: number }>()

registerPhonePairingIcons()

type WayId = 'company' | 'tailscale' | 'vpn' | 'wifi'
type Phase = 'idle' | 'qr' | 'expired'

const scenario = readPhoneState()
const ways = reactive(waysFor(scenario))
const phase = ref<Phase>('idle')
const accessOn = ref(true)

// The best ready way is selected when the panel opens (company address, Tailscale, your VPN, same Wi-Fi) and marked Recommended.
const ORDER: WayId[] = ['company', 'tailscale', 'vpn', 'wifi']
const isReady = (id: WayId): boolean => ways[id].ready
const recommended = computed<WayId | null>(() => ORDER.find((id) => isReady(id)) ?? null)
const tab = ref<WayId>(recommended.value ?? 'tailscale')
const tabs: { id: WayId; label: string }[] = [
  { id: 'wifi', label: 'Same Wi-Fi or LAN' },
  { id: 'tailscale', label: 'Tailscale' },
  { id: 'vpn', label: 'Your VPN' },
  { id: 'company', label: 'Company address' },
]

const COPY: Record<WayId, { title: string; tag: string; how: string; when: string; setup: string; safety: string }> = {
  wifi: {
    title: 'Same Wi-Fi or LAN',
    tag: 'home or office',
    how: 'Your phone talks to this computer directly over your local network, like two devices at home.',
    when: 'Your phone and this computer are on the same Wi-Fi or LAN, such as a home or office network.',
    setup: 'Nothing to install. The first time on a network, AutoByteus asks for your OK.',
    safety: 'The connection has no extra protection, so others on the same network could see it. Fine at home and in your office. On public Wi-Fi (café, hotel, airport) use Tailscale instead. Works only while the phone is on this network.',
  },
  tailscale: {
    title: 'Tailscale',
    tag: 'works anywhere, recommended',
    how: 'Tailscale builds a private, encrypted connection between your phone and this computer, wherever they are.',
    when: 'You want to use your phone away from home, on mobile data or any Wi-Fi.',
    setup: '',
    safety: 'The connection is encrypted between your phone and this computer, and only devices signed in to your Tailscale account can reach it.',
  },
  vpn: {
    title: 'Your VPN',
    tag: 'for example WireGuard',
    how: 'Your VPN puts your phone and this computer in the same private network.',
    when: 'You already use your own VPN that connects your phone and this computer.',
    setup: 'Connect both to the VPN. AutoByteus finds it by itself.',
    safety: 'As protected as your VPN: the connection is encrypted between your devices.',
  },
  company: {
    title: 'An address set up for this node',
    tag: 'for example by your company',
    how: 'Your phone reaches the node at the address your company set up, through the company network or its VPN.',
    when: 'The node runs on a company server and your IT gave it an address, such as autobyteus.company.com.',
    setup: 'Your IT sets the address once on the node. On your phone, turn on the company VPN if your company uses one.',
    safety: 'Protected by your company’s network: usually a secure (https) address reachable only inside the company or through its VPN.',
  },
}
const current = computed(() => COPY[tab.value])

// The Wi-Fi answer is remembered per local network (home, office); a new network asks again.
if (scenario === 'wifi_allowed') localStorage.setItem(WIFI_ALLOWED_KEY, ways.wifi.networkName)
if (scenario === 'wifi_new_network') localStorage.setItem(WIFI_ALLOWED_KEY, 'Home-5G')
if (scenario === 'wifi_ask' || scenario === '' || scenario === 'tailscale') localStorage.removeItem(WIFI_ALLOWED_KEY)
const wifiAllowed = ref(localStorage.getItem(WIFI_ALLOWED_KEY) === ways.wifi.networkName && ways.wifi.ready)

const optionsOpen = ref(false)
const advancedOpen = ref(false)
const historyOpen = ref(false)
const confirmingRevokeAll = ref(false)
const manualAddress = ref('')
const activeWay = ref<WayId | 'manual'>('tailscale')
const httpsReady = ref(ways.tailscale.https)
const checkingHttps = ref(false)
const checking = ref<WayId | null>(null)
const checkNote = reactive<Record<string, string>>({})
const copied = ref(false)
const qrDataUrl = ref<string | null>(null)
const secondsLeft = ref(300)
const activePhones = ref<PairedPhone[]>(seedActivePhones(scenario))
const revokedPhones = ref<PairedPhone[]>(seedRevokedPhones(scenario))
let ticker: ReturnType<typeof setInterval> | null = null

const serveCommand = computed(() => `tailscale serve --bg --https=8443 ${props.localPort ?? 29695}`)
const timeLeft = computed(() => `${Math.floor(secondsLeft.value / 60)}:${String(secondsLeft.value % 60).padStart(2, '0')}`)

const blockedMessage = computed(() =>
  ways.blocked === 'docker_unpublished'
    ? `${props.nodeName} isn’t reachable from other devices. Publish its port on this computer’s network, then try again.`
    : 'This computer isn’t on a network a phone could use. Connect it to your Wi-Fi or VPN, then try again.',
)

// Detection, in one plain line per tab.
const statusLine = computed(() => {
  switch (tab.value) {
    case 'wifi':
      return isReady('wifi') ? `This computer is on a Wi-Fi or LAN network (${ways.wifi.networkName}).` : 'This computer isn’t on a Wi-Fi or LAN network.'
    case 'tailscale':
      return isReady('tailscale') ? 'Ready: Tailscale is on, on this computer.' : 'Not set up yet.'
    case 'vpn':
      return isReady('vpn') ? 'Ready: a VPN is connected on this computer.' : 'No VPN found on this computer. Connect it, then Check again.'
    default:
      return isReady('company') ? 'Ready: an address is set up for this node.' : 'Not set up yet.'
  }
})

const qrButtonLabel = computed(() => (tab.value === 'wifi' && isReady('wifi') && !wifiAllowed.value ? 'Allow and show QR code' : 'Show QR code'))

// How the phone will connect, in one plain line naming the way the code uses.
const connectLine = computed(() => {
  switch (activeWay.value) {
    case 'tailscale':
      return 'Works anywhere through Tailscale'
    case 'vpn':
      return 'Works through your VPN'
    case 'company':
      return `Works through the address set up for this node (${ways.company.address})`
    case 'manual':
      return `Works through the address you entered (${manualAddress.value.trim()})`
    default:
      return 'Works on this network'
  }
})
const lineDot = computed(() => (activeWay.value === 'wifi' ? 'bg-amber-500' : 'bg-emerald-500'))

function selectTab(id: WayId): void {
  if (id === tab.value) return
  closeCode() // a code holds only its own tab's address
  tab.value = id
}

function tabKeys(event: KeyboardEvent, id: WayId): void {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (!keys.includes(event.key)) return
  event.preventDefault()
  const index = tabs.findIndex((candidate) => candidate.id === id)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
  selectTab(tabs[next].id)
  void nextTick(() => document.getElementById(`phone-tab-${tabs[next].id}`)?.focus())
}

function stopTicker(): void {
  if (ticker) clearInterval(ticker)
  ticker = null
}

async function showCode(way: WayId | 'manual'): Promise<void> {
  stopTicker()
  activeWay.value = way
  accessOn.value = true // showing a code is the consent (DEC-009)
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

/** "Allow and show QR code" is the explicit Wi-Fi decision, once for each network. */
function showQr(): void {
  if (!isReady(tab.value)) return
  if (tab.value === 'wifi' && !wifiAllowed.value) {
    wifiAllowed.value = true
    localStorage.setItem(WIFI_ALLOWED_KEY, ways.wifi.networkName)
  }
  void showCode(tab.value)
}

function toggleWifi(): void {
  wifiAllowed.value = false
  localStorage.removeItem(WIFI_ALLOWED_KEY)
  closeCode()
}

function useCompanyAddress(): void {
  if (!manualAddress.value.trim()) return
  void showCode('manual')
}

function closeCode(): void {
  stopTicker()
  qrDataUrl.value = null
  phase.value = 'idle'
}

function checkWay(id: WayId): void {
  checking.value = id
  checkNote[id] = ''
  setTimeout(() => {
    checking.value = null
    checkNote[id] = id === 'tailscale' ? 'Still not found. Tailscale isn’t on, on this computer.' : 'Still no VPN found.'
  }, 900)
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
    activeWay.value = 'tailscale'
    secondsLeft.value = 0
    phase.value = 'expired'
  }
})

// Closing the panel discards the shown code (REQ-015).
onBeforeUnmount(stopTicker)
</script>
