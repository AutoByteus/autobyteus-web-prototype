<template>
  <main class="fixed inset-0 flex h-[100dvh] flex-col bg-white text-slate-900" data-testid="android-app">
    <!-- Scanner: the camera view -->
    <section v-if="view === 'scan'" class="absolute inset-0 z-30 flex flex-col bg-slate-900 text-white" data-testid="android-scanner">
      <header class="flex h-14 flex-shrink-0 items-center pl-2 pr-4">
        <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full active:bg-white/10" aria-label="Close scanner" data-testid="android-scan-close" @click="closeScanner">
          <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
        </button>
        <h1 class="ml-1 text-lg font-semibold">Scan</h1>
      </header>
      <div class="relative flex min-h-0 flex-1 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
        <div class="relative h-60 w-60" aria-hidden="true">
          <span v-for="corner in corners" :key="corner" class="absolute h-10 w-10 border-4 transition-colors" :class="[corner, scanFound ? 'border-green-400' : 'border-white']" />
        </div>
      </div>
      <p class="flex-shrink-0 px-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 text-center text-[0.9375rem] text-slate-200" role="status" data-testid="android-scan-hint">
        {{ scanFound ? 'Code found' : 'Point the camera at the QR code on your computer.' }}
      </p>
    </section>

    <!-- Connecting -->
    <section v-else-if="view === 'connecting'" class="flex flex-1 flex-col items-center justify-center px-8 text-center" role="status" data-testid="android-connecting">
      <span class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" aria-hidden="true" />
      <h1 class="mt-6 text-lg font-semibold">Connecting to {{ target?.name }}</h1>
      <button type="button" class="mt-6 h-12 rounded-xl px-6 text-[0.9375rem] font-semibold text-blue-700 active:bg-blue-50" data-testid="android-connecting-cancel" @click="cancelConnecting">Cancel</button>
    </section>

    <!-- Connected -->
    <section v-else-if="view === 'connected'" class="flex flex-1 flex-col items-center justify-center px-8 text-center" role="status" data-testid="android-connected">
      <span class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"><Icon icon="heroicons:check-20-solid" class="h-9 w-9" aria-hidden="true" /></span>
      <h1 class="mt-6 text-lg font-semibold">Connected to {{ target?.name }}</h1>
      <p class="mt-1 text-sm text-slate-500">Opening your runs…</p>
    </section>

    <!-- Can't reach -->
    <template v-else-if="view === 'cant-reach'">
      <header class="flex h-14 flex-shrink-0 items-center pl-2 pr-4">
        <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 active:bg-slate-100" aria-label="Back to nodes" data-testid="android-cant-reach-back" @click="view = 'list'">
          <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
        </button>
      </header>
      <section class="flex min-h-0 flex-1 flex-col items-center justify-center px-8 pb-10 text-center" data-testid="android-cant-reach">
        <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><Icon icon="heroicons:exclamation-triangle-20-solid" class="h-7 w-7" aria-hidden="true" /></span>
        <h1 class="mt-5 text-xl font-semibold">Can’t reach {{ target?.name }}</h1>
        <p class="mt-2 max-w-xs text-[0.9375rem] leading-6 text-slate-600" data-testid="android-cant-reach-reason">{{ failureText }}</p>
        <button v-if="failure === 'no_network'" type="button" class="mt-4 inline-flex h-12 items-center gap-1.5 rounded-xl px-4 text-[0.9375rem] font-semibold text-blue-700 active:bg-blue-50" data-testid="android-open-tailscale">
          Open Tailscale
          <Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
      <footer class="flex flex-shrink-0 flex-col gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button v-if="canRetry" type="button" class="h-14 rounded-2xl bg-blue-600 text-[1.0625rem] font-semibold text-white active:bg-blue-700" data-testid="android-retry" @click="retry">Retry</button>
        <button type="button" class="h-14 rounded-2xl border border-slate-300 text-[1.0625rem] font-semibold text-slate-700 active:bg-slate-100" data-testid="android-scan-again" @click="startScan">Scan again</button>
      </footer>
    </template>

    <!-- Start screen / Switch node (one list) -->
    <template v-else>
      <header class="flex h-14 flex-shrink-0 items-center border-b border-slate-100 pl-2 pr-4" data-testid="android-header">
        <template v-if="switchMode">
          <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 active:bg-slate-100" aria-label="Back" data-testid="android-switch-back" @click="backToPage">
            <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
          </button>
          <h1 class="ml-1 text-lg font-semibold" data-testid="android-title">Switch node</h1>
        </template>
        <template v-else>
          <img src="/autobyteus-icon.svg" alt="" class="ml-2 h-7 w-7" aria-hidden="true" />
          <h1 class="ml-2.5 text-lg font-semibold" data-testid="android-title">AutoByteus</h1>
        </template>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-testid="android-scroll">
        <!-- First launch -->
        <section v-if="nodes.length === 0" class="flex flex-col items-center px-8 pt-20 text-center" data-testid="android-first-launch">
          <span class="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon icon="heroicons:qr-code-20-solid" class="h-9 w-9" aria-hidden="true" /></span>
          <h2 class="mt-6 text-[1.375rem] font-semibold leading-7">Scan the QR code on your computer</h2>
          <p class="mt-2 max-w-xs text-[0.9375rem] leading-6 text-slate-500">On your computer, open Nodes › Phone Setup and choose Connect a phone.</p>
        </section>

        <!-- Nodes -->
        <section v-else aria-label="Your nodes" data-testid="android-nodes">
          <h2 v-if="!switchMode" class="px-4 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Your nodes</h2>
          <ul :class="switchMode ? 'pt-1' : ''">
            <li v-for="node in nodes" :key="node.id" class="flex min-h-[4rem] items-center border-b border-slate-100 pl-4 pr-1" :class="isCurrent(node) ? 'bg-blue-50' : ''" data-testid="android-node-row" :data-node-name="node.name">
              <button type="button" class="flex min-h-[4rem] min-w-0 flex-1 items-center gap-3 py-2 text-left" :aria-label="`${node.name}, ${stateLabel(node)}${isCurrent(node) ? ', current node' : ''}`" data-testid="android-node-open" @click="openNode(node)">
                <span class="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" :class="isCurrent(node) ? 'bg-white' : 'bg-slate-100'">
                  <Icon icon="heroicons:computer-desktop-20-solid" class="h-5 w-5 text-slate-600" aria-hidden="true" />
                  <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2" :class="[dotClass(node), isCurrent(node) ? 'ring-blue-50' : 'ring-white']" data-testid="android-node-dot" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-base font-semibold leading-5">{{ node.name }}</span>
                  <span class="block truncate text-[0.8125rem] leading-5" :class="stateTextClass(node)" data-testid="android-node-state">{{ stateLabel(node) }}</span>
                </span>
                <Icon v-if="isCurrent(node)" icon="heroicons:check-20-solid" class="h-6 w-6 flex-shrink-0 text-blue-600" aria-hidden="true" />
              </button>
              <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100" :aria-label="`More for ${node.name}`" aria-haspopup="dialog" data-testid="android-node-more" @click="menuNode = node; removeStep = 'menu'">
                <Icon icon="heroicons:ellipsis-vertical-20-solid" class="h-6 w-6" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </section>

        <!-- Other ways to connect -->
        <section class="pb-4" data-testid="android-other-ways" :class="nodes.length === 0 ? 'mt-16' : ''">
          <button type="button" class="flex h-14 w-full items-center justify-between px-4 text-left text-[0.9375rem] font-medium text-slate-600 active:bg-slate-50" :aria-expanded="otherOpen" aria-controls="android-other-ways-list" data-testid="android-other-toggle" @click="otherOpen = !otherOpen">
            Other ways to connect
            <Icon icon="heroicons:chevron-down-20-solid" class="h-5 w-5 text-slate-400 transition-transform" :class="otherOpen ? 'rotate-180' : ''" aria-hidden="true" />
          </button>
          <ul v-if="otherOpen" id="android-other-ways-list" class="border-t border-slate-100">
            <li>
              <button type="button" class="flex min-h-[3.5rem] w-full items-center gap-3 px-4 text-left active:bg-slate-50" data-testid="android-type-address" @click="addressOpen = true">
                <Icon icon="heroicons:link-20-solid" class="h-5 w-5 text-slate-500" aria-hidden="true" />
                <span class="text-[0.9375rem] font-medium">Type an address</span>
              </button>
            </li>
            <li class="border-t border-slate-100">
              <button type="button" class="flex min-h-[3.5rem] w-full items-center gap-3 px-4 text-left active:bg-slate-50" data-testid="android-paste-link" @click="pasteLink">
                <Icon icon="heroicons:clipboard-document-20-solid" class="h-5 w-5 text-slate-500" aria-hidden="true" />
                <span class="text-[0.9375rem] font-medium">Paste a link</span>
              </button>
            </li>
          </ul>
        </section>
      </div>

      <footer class="flex-shrink-0 border-t border-slate-100 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button type="button" class="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-[1.0625rem] font-semibold text-white active:bg-blue-700" data-testid="android-scan" @click="startScan">
          <Icon icon="heroicons:qr-code-20-solid" class="h-6 w-6" aria-hidden="true" />
          Scan
        </button>
      </footer>
    </template>

    <!-- Node menu / remove -->
    <div v-if="menuNode" class="fixed inset-0 z-40 flex flex-col justify-end" data-testid="android-node-sheet">
      <button type="button" class="absolute inset-0 bg-slate-900/40" aria-label="Close" @click="menuNode = null" />
      <section class="relative flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-xl" role="dialog" aria-modal="true" :aria-label="menuNode.name">
        <div class="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
        <header class="flex h-14 flex-shrink-0 items-center justify-between pl-4 pr-2">
          <h2 class="truncate text-lg font-semibold">{{ menuNode.name }}</h2>
          <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-500 active:bg-slate-100" aria-label="Close" @click="menuNode = null">
            <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
          </button>
        </header>
        <div class="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button v-if="removeStep === 'menu'" type="button" class="h-14 w-full rounded-xl text-left text-[0.9375rem] font-semibold text-red-700 active:bg-red-50" data-testid="android-remove" @click="removeStep = 'confirm'">Remove from this phone</button>
          <template v-else>
            <p class="text-[0.9375rem] leading-6 text-slate-600" data-testid="android-remove-text">Remove {{ menuNode.name }} from this phone? Scan its QR code again to add it back.</p>
            <div class="mt-4 flex gap-3">
              <button type="button" class="h-12 flex-1 rounded-xl border border-slate-300 text-[0.9375rem] font-semibold text-slate-700 active:bg-slate-100" @click="menuNode = null">Cancel</button>
              <button type="button" class="h-12 flex-1 rounded-xl bg-red-600 text-[0.9375rem] font-semibold text-white active:bg-red-700" data-testid="android-remove-confirm" @click="removeNode">Remove</button>
            </div>
          </template>
        </div>
      </section>
    </div>

    <!-- Type an address -->
    <div v-if="addressOpen" class="fixed inset-0 z-40 flex flex-col justify-end" data-testid="android-address-sheet">
      <button type="button" class="absolute inset-0 bg-slate-900/40" aria-label="Close" @click="addressOpen = false" />
      <section class="relative flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-xl" role="dialog" aria-modal="true" aria-label="Type an address">
        <div class="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
        <header class="flex h-14 flex-shrink-0 items-center justify-between pl-4 pr-2">
          <h2 class="text-lg font-semibold">Type an address</h2>
          <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-500 active:bg-slate-100" aria-label="Close" @click="addressOpen = false">
            <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
          </button>
        </header>
        <div class="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <input v-model="address" type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://node.example.com" aria-label="Node address" class="h-12 w-full rounded-xl border border-slate-300 px-3 text-base placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" data-testid="android-address-input" />
          <label v-if="addressIsHttp" class="mt-3 flex min-h-[3rem] items-center gap-3 text-[0.9375rem] leading-5 text-slate-700" data-testid="android-http-ack">
            <input v-model="httpAck" type="checkbox" class="h-6 w-6 flex-shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-200" />
            This address isn’t encrypted. Only use it on a network you trust.
          </label>
          <button type="button" class="mt-4 h-12 w-full rounded-xl bg-blue-600 text-[0.9375rem] font-semibold text-white active:bg-blue-700 disabled:opacity-50" :disabled="!address.trim() || (addressIsHttp && !httpAck)" data-testid="android-address-connect" @click="connectAddress">Connect</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ANDROID_ACTIVE_KEY,
  IN_APP_KEY,
  SCAN_QUEUE,
  loadAndroidNodes,
  readPhoneState,
  reasonText,
  registerPhonePairingIcons,
  saveAndroidNodes,
  type AndroidNode,
} from '~/prototype/phone-pairing/phonePairingFixture'

registerPhonePairingIcons()

type View = 'list' | 'scan' | 'connecting' | 'connected' | 'cant-reach'
type Failure = 'no_network' | 'asleep' | 'expired' | 'used' | 'not_autobyteus'
interface Target { name: string; nodeId?: string; fromScan: boolean }

const route = useRoute()
const scenario = readPhoneState()
const switchMode = computed(() => route.query.from === 'node')
const corners = ['left-0 top-0 rounded-tl-xl border-b-0 border-r-0', 'right-0 top-0 rounded-tr-xl border-b-0 border-l-0', 'bottom-0 left-0 rounded-bl-xl border-r-0 border-t-0', 'bottom-0 right-0 rounded-br-xl border-l-0 border-t-0']

const nodes = ref<AndroidNode[]>([])
const view = ref<View>('list')
const checking = ref(true)
const target = ref<Target | null>(null)
const failure = ref<Failure>('no_network')
const scanFound = ref(false)
const otherOpen = ref(false)
const menuNode = ref<AndroidNode | null>(null)
const removeStep = ref<'menu' | 'confirm'>('menu')
const addressOpen = ref(false)
const address = ref('')
const httpAck = ref(false)
const currentId = ref<string | null>(null)
const timers: ReturnType<typeof setTimeout>[] = []
let checkTimer: ReturnType<typeof setTimeout> | null = null

const addressIsHttp = computed(() => /^http:\/\//i.test(address.value.trim()))
const failureText = computed(() => reasonText({ name: target.value?.name ?? 'this node' }, failure.value))
const canRetry = computed(() => Boolean(target.value && (failure.value === 'no_network' || failure.value === 'asleep')))

const isCurrent = (node: AndroidNode): boolean => switchMode.value && node.id === currentId.value
const stateLabel = (node: AndroidNode): string => (checking.value ? 'Checking…' : node.reachable ? 'Online' : 'Not reachable')
const dotClass = (node: AndroidNode): string => (checking.value ? 'bg-slate-300' : node.reachable ? 'bg-green-500' : 'bg-amber-500')
const stateTextClass = (node: AndroidNode): string => (!checking.value && !node.reachable ? 'font-medium text-amber-700' : 'text-slate-500')

function later(ms: number, fn: () => void): void {
  timers.push(setTimeout(fn, ms))
}
function clearTimers(): void {
  while (timers.length) clearTimeout(timers.pop())
}

function nextScanName(): string {
  return SCAN_QUEUE.find((name) => !nodes.value.some((node) => node.name === name)) ?? SCAN_QUEUE[0]
}

/** The page opens inside the app after "connected": the app now hosts that node's page. */
function openPage(node: AndroidNode): void {
  localStorage.setItem(ANDROID_ACTIVE_KEY, node.id)
  sessionStorage.setItem(IN_APP_KEY, '1')
  window.location.assign('/mobile')
}

function connectTo(next: Target): void {
  clearTimers()
  target.value = next
  view.value = 'connecting'
  later(1500, () => {
    const known = next.nodeId ? nodes.value.find((node) => node.id === next.nodeId) : undefined
    const scanFails = next.fromScan && scenario === 'android_scan_cant_reach'
    if (scanFails || (known && !known.reachable)) {
      failure.value = known?.reason ?? 'no_network'
      view.value = 'cant-reach'
      return
    }
    let node = known
    if (!node) {
      node = { id: `n-${next.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, name: next.name, reachable: true }
      nodes.value = [...nodes.value.filter((existing) => existing.id !== node!.id), node]
      saveAndroidNodes(nodes.value)
    }
    view.value = 'connected'
    later(1000, () => openPage(node!))
  })
}

function openNode(node: AndroidNode): void {
  if (isCurrent(node)) {
    backToPage()
    return
  }
  connectTo({ name: node.name, nodeId: node.id, fromScan: false })
}

function startScan(): void {
  clearTimers()
  scanFound.value = false
  view.value = 'scan'
  // The camera finds a code on its own after a moment (a scripted timeline stands in for the lens).
  later(2200, () => {
    scanFound.value = true
    later(500, () => connectTo({ name: nextScanName(), fromScan: true }))
  })
}

function closeScanner(): void {
  clearTimers()
  if (route.query.scan === '1') backToPage()
  else view.value = 'list'
}

function cancelConnecting(): void {
  clearTimers()
  view.value = 'list'
}

function retry(): void {
  if (target.value) connectTo(target.value)
}

function pasteLink(): void {
  otherOpen.value = false
  connectTo({ name: nextScanName(), fromScan: true })
}

function connectAddress(): void {
  addressOpen.value = false
  connectTo({ name: nextScanName(), fromScan: true })
}

function removeNode(): void {
  if (!menuNode.value) return
  const removed = menuNode.value
  nodes.value = nodes.value.filter((node) => node.id !== removed.id)
  saveAndroidNodes(nodes.value)
  menuNode.value = null
}

function backToPage(): void {
  window.location.assign('/mobile')
}

onMounted(() => {
  nodes.value = loadAndroidNodes()
  currentId.value = localStorage.getItem(ANDROID_ACTIVE_KEY)
  // The app looks at each node as the list opens.
  if (route.query.scan === '1') startScan()
  checkTimer = setTimeout(() => (checking.value = false), 900)
})

onBeforeUnmount(() => {
  clearTimers()
  if (checkTimer) clearTimeout(checkTimer)
})
</script>
