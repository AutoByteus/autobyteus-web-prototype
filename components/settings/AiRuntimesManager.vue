<template>
  <div class="flex w-full flex-col gap-5" data-testid="settings-ai-runtimes-panel">
    <section
      class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
      data-testid="ai-runtimes-card"
      aria-labelledby="ai-runtimes-heading"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div class="min-w-0 max-w-3xl">
          <h3 id="ai-runtimes-heading" class="text-2xl font-semibold leading-tight text-gray-900">{{ t('settings.aiRuntimes.title') }}</h3>
          <p class="mt-1 text-sm text-gray-500" data-testid="ai-runtimes-description">{{ t('settings.aiRuntimes.description') }}</p>
          <p v-if="state.loadStatus === 'ready' || state.loadStatus === 'loading'" class="mt-3 text-sm text-gray-500" data-testid="ai-runtimes-node">
            <span class="font-medium text-gray-700">{{ state.nodeName }}</span>
            <span class="mx-1.5 text-gray-300" aria-hidden="true">·</span>{{ state.isOwnNode ? t('settings.aiRuntimes.node.own') : t('settings.aiRuntimes.node.remote') }}
          </p>
        </div>
        <div v-if="state.loadStatus === 'ready'" class="flex flex-shrink-0 items-center gap-3 sm:pt-1">
          <p v-if="!isChecking && minutesSinceCheck !== null" class="text-sm text-gray-500" data-testid="ai-runtimes-checked">
            {{ minutesSinceCheck < 1 ? t('settings.aiRuntimes.checked.justNow') : t('settings.aiRuntimes.checked.minutes', { minutes: minutesSinceCheck }) }}
          </p>
          <button
            type="button"
            :class="secondaryButton"
            :disabled="isChecking"
            data-testid="ai-runtimes-check-again"
            @click="onCheckAgain"
          >
            <span v-if="isChecking" class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></span>
            {{ isChecking ? t('settings.aiRuntimes.checking') : t('settings.aiRuntimes.checkAgain') }}
          </button>
        </div>
      </div>

      <p
        v-if="state.loadStatus === 'ready' && !state.isOwnNode"
        class="mt-4 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
        data-testid="ai-runtimes-remote-note"
      >{{ t('settings.aiRuntimes.node.remoteNote') }}</p>

      <!-- loading -->
      <div v-if="state.loadStatus === 'loading'" class="mt-5 space-y-3" data-testid="ai-runtimes-loading" aria-busy="true">
        <div v-for="n in 4" :key="n" class="h-[68px] animate-pulse rounded-lg border border-gray-100 bg-gray-50"></div>
      </div>

      <!-- the node could not be read -->
      <div
        v-else-if="state.loadStatus === 'error'"
        class="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
        data-testid="ai-runtimes-load-error"
      >
        <span>{{ t('settings.aiRuntimes.loadError') }}</span>
        <button type="button" class="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" data-testid="ai-runtimes-load-retry" @click="retryLoad">{{ t('settings.aiRuntimes.retry') }}</button>
      </div>

      <!-- the four engines -->
      <div v-else class="mt-5 overflow-hidden rounded-xl border border-slate-200" data-testid="ai-runtimes-list">
        <div :class="[gridColumns, 'hidden border-b border-slate-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 sm:grid']" aria-hidden="true">
          <span>{{ t('settings.aiRuntimes.columns.engine') }}</span>
          <span>{{ t('settings.aiRuntimes.columns.installed') }}</span>
          <span>{{ t('settings.aiRuntimes.columns.updates') }}</span>
          <span>{{ t('settings.aiRuntimes.columns.account') }}</span>
          <span></span>
        </div>
        <ul class="divide-y divide-slate-100" :aria-label="t('settings.aiRuntimes.listLabel')">
          <li
            v-for="e in engines"
            :key="e.id"
            class="px-4 py-3"
            :data-testid="`runtime-${e.id}`"
            :data-state="rowState(e)"
          >
            <div :class="[gridColumns, 'flex flex-col gap-y-2 sm:grid sm:items-start']">
              <!-- engine -->
              <h4 class="text-base font-semibold text-gray-900 sm:flex sm:min-h-9 sm:items-center" :data-testid="`runtime-${e.id}-name`">{{ e.name }}</h4>

              <!-- installed -->
              <p class="flex gap-2 text-sm sm:block" :data-testid="`runtime-${e.id}-installed`">
                <span :class="mobileLabel">{{ t('settings.aiRuntimes.columns.installed') }}</span>
                <span v-if="e.installed" class="text-gray-900 sm:flex sm:min-h-9 sm:items-center"><span class="sr-only">{{ t('settings.aiRuntimes.version') }} </span>{{ e.version }}</span>
                <span v-else class="text-gray-500 sm:flex sm:min-h-9 sm:items-center" :data-testid="`runtime-${e.id}-not-installed`">{{ t('settings.aiRuntimes.notInstalled') }}</span>
              </p>

              <!-- updates -->
              <div class="flex gap-2 text-sm sm:block" :data-testid="`runtime-${e.id}-updates`">
                <span :class="mobileLabel">{{ t('settings.aiRuntimes.columns.updates') }}</span>
                <div class="min-w-0">
                  <template v-if="!e.installed">
                    <a
                      :href="e.installUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex sm:min-h-9 w-fit items-center gap-1 text-blue-700 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                      :data-testid="`runtime-${e.id}-install-link`"
                    >{{ t('settings.aiRuntimes.installInstructions') }}<Icon icon="heroicons:arrow-top-right-on-square-20-solid" class="h-4 w-4 flex-shrink-0" aria-hidden="true" /><span class="sr-only"> {{ t('settings.aiRuntimes.opensInBrowser') }}</span></a>
                  </template>
                  <p v-else-if="e.check === 'checking'" class="flex sm:min-h-9 items-center gap-2 text-gray-500" :data-testid="`runtime-${e.id}-status`" role="status">
                    <span class="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></span>{{ t('settings.aiRuntimes.status.checking') }}
                  </p>
                  <p v-else-if="e.check === 'up_to_date'" class="flex sm:min-h-9 items-center gap-1.5 text-green-700" :data-testid="`runtime-${e.id}-status`">
                    <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>{{ t('settings.aiRuntimes.status.upToDate') }}
                  </p>
                  <p v-else-if="e.check === 'update_available'" class="flex sm:min-h-9 items-center gap-1.5 text-amber-700" :data-testid="`runtime-${e.id}-status`">
                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>{{ t('settings.aiRuntimes.status.updateAvailable', { version: e.availableVersion ?? '' }) }}
                  </p>
                  <template v-else-if="e.check === 'failed'">
                    <p class="flex sm:min-h-9 items-center gap-1.5 text-red-700" :data-testid="`runtime-${e.id}-status`">
                      <span class="h-1.5 w-1.5 rounded-full bg-red-600"></span>{{ t('settings.aiRuntimes.status.checkFailed') }}
                    </p>
                    <p class="-mt-1 text-gray-500" :data-testid="`runtime-${e.id}-check-failed-note`">{{ t('settings.aiRuntimes.status.checkFailedNote', { name: e.name }) }}</p>
                  </template>
                  <p v-if="blockedByAgents(e)" class="-mt-1 text-gray-500" :id="`runtime-${e.id}-blocked`" :data-testid="`runtime-${e.id}-blocked`">
                    {{ t(e.agentsRunning === 1 ? 'settings.aiRuntimes.update.blocked.one' : 'settings.aiRuntimes.update.blocked.other', { count: e.agentsRunning }) }}
                  </p>
                </div>
              </div>

              <!-- account -->
              <div class="flex gap-2 text-sm sm:block" :data-testid="`runtime-${e.id}-account`">
                <span :class="mobileLabel">{{ t('settings.aiRuntimes.columns.account') }}</span>
                <div class="min-w-0">
                  <span v-if="!e.installed" class="flex sm:min-h-9 items-center text-gray-400" :data-testid="`runtime-${e.id}-signin`"><span aria-hidden="true">–</span><span class="sr-only">{{ t('settings.aiRuntimes.signIn.notApplicable') }}</span></span>
                  <span v-else-if="e.signIn === 'signed_in'" class="flex sm:min-h-9 items-center gap-1.5 text-gray-700" :data-testid="`runtime-${e.id}-signin`"><span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>{{ t('settings.aiRuntimes.signIn.signedIn') }}</span>
                  <template v-else-if="e.signIn === 'not_signed_in'">
                    <span class="flex sm:min-h-9 items-center gap-1.5 text-amber-700" :data-testid="`runtime-${e.id}-signin`"><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>{{ t('settings.aiRuntimes.signIn.notSignedIn') }}</span>
                    <p v-if="e.signInMode === 'command_line' || !state.isOwnNode" class="-mt-1 text-gray-500" :data-testid="`runtime-${e.id}-signin-hint`">{{ t('settings.aiRuntimes.signIn.hint') }}</p>
                  </template>
                  <span v-else class="flex sm:min-h-9 items-center text-gray-500" :data-testid="`runtime-${e.id}-signin`">{{ t('settings.aiRuntimes.signIn.unknown') }}</span>
                </div>
              </div>

              <!-- action: only on this computer's own node -->
              <div class="flex flex-col gap-2 sm:items-end sm:justify-self-end" :data-testid="`runtime-${e.id}-actions`">
                <template v-if="state.isOwnNode && e.installed">
                  <button
                    v-if="e.signIn === 'not_signed_in' && e.signInMode !== 'command_line'"
                    type="button"
                    :class="[secondaryButton, isSigningIn(e) ? 'cursor-wait' : '']"
                    :disabled="isSigningIn(e)"
                    :aria-label="`${isSigningIn(e) ? t('settings.aiRuntimes.signIn.signingIn') : e.signing.phase === 'failed' ? t('settings.aiRuntimes.update.retry') : t('settings.aiRuntimes.signIn.action')} ${e.name}`"
                    :data-testid="`runtime-${e.id}-signin-button`"
                    @click="onSignIn(e.id)"
                  >
                    <span v-if="isSigningIn(e)" class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></span>
                    {{ isSigningIn(e) ? t('settings.aiRuntimes.signIn.signingIn') : e.signing.phase === 'failed' ? t('settings.aiRuntimes.update.retry') : t('settings.aiRuntimes.signIn.action') }}
                  </button>
                  <button
                    v-if="e.update.phase === 'running'"
                    type="button"
                    :class="[primaryButton, 'cursor-wait opacity-70']"
                    disabled
                    :data-testid="`runtime-${e.id}-updating`"
                  >
                    <span class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>{{ t('settings.aiRuntimes.update.updating') }}
                  </button>
                  <button
                    v-else-if="e.check === 'update_available' || e.update.phase === 'failed'"
                    type="button"
                    :class="[primaryButton, blockedByAgents(e) ? 'cursor-not-allowed opacity-50 hover:bg-gray-900' : '']"
                    :aria-disabled="blockedByAgents(e) ? 'true' : undefined"
                    :aria-describedby="blockedByAgents(e) ? `runtime-${e.id}-blocked` : undefined"
                    :aria-label="`${e.update.phase === 'failed' ? t('settings.aiRuntimes.update.retry') : t('settings.aiRuntimes.update.action')} ${e.name}`"
                    :data-testid="`runtime-${e.id}-update`"
                    @click="onUpdate(e.id)"
                  >{{ e.update.phase === 'failed' ? t('settings.aiRuntimes.update.retry') : t('settings.aiRuntimes.update.action') }}</button>
                </template>
              </div>

              <!-- the vendor's own sign-in, finished in the browser -->
              <div v-if="e.signing.phase !== 'idle' && e.signIn === 'not_signed_in'" class="sm:col-span-3 sm:col-start-3" :data-testid="`runtime-${e.id}-signin-outcome`">
                <div v-if="e.signing.phase === 'waiting'" class="flex flex-wrap items-center gap-x-3 text-sm text-gray-600" role="status">
                  <span :data-testid="`runtime-${e.id}-signin-waiting`">{{ t('settings.aiRuntimes.signIn.waiting', { name: e.name }) }}</span>
                  <button type="button" class="rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`runtime-${e.id}-signin-cancel`" @click="cancelSignIn(e.id)">{{ t('settings.aiRuntimes.signIn.cancel') }}</button>
                </div>
                <div
                  v-else-if="e.signing.phase === 'terminal'"
                  class="mt-2 max-w-2xl overflow-hidden rounded-xl border border-slate-200 shadow-sm"
                  :data-testid="`runtime-${e.id}-signin-terminal-area`"
                >
                  <div class="flex items-center justify-between bg-gray-800 px-4 py-1.5">
                    <span class="text-xs font-medium text-gray-300">{{ t('settings.aiRuntimes.signIn.terminalTitle') }}</span>
                    <button type="button" class="rounded px-2 py-0.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" :data-testid="`runtime-${e.id}-signin-cancel`" @click="cancelSignIn(e.id)">{{ t('settings.aiRuntimes.signIn.close') }}</button>
                  </div>
                  <div
                    :ref="(el) => focusTerminal(el as HTMLElement | null)"
                    tabindex="0"
                    role="textbox"
                    aria-readonly="true"
                    :aria-label="t('settings.aiRuntimes.signIn.terminalLabel', { name: e.name })"
                    class="bg-gray-900 px-4 py-3 font-mono text-sm leading-6 text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
                    :data-testid="`runtime-${e.id}-signin-terminal`"
                    @keydown.enter.prevent="terminalEnter(e.id)"
                  >
                    <p><span class="select-none text-green-400">$</span> {{ commandOfSignIn(e) }}</p>
                    <p>{{ t('settings.aiRuntimes.signIn.terminal.prompt') }}<span v-if="e.signing.terminalStep === 0" class="ml-1 animate-pulse text-gray-400">▍</span></p>
                    <p v-if="e.signing.terminalStep >= 1" class="text-gray-400">{{ t('settings.aiRuntimes.signIn.terminal.opening') }}</p>
                    <p v-if="e.signing.terminalStep >= 2" class="text-green-400">{{ t('settings.aiRuntimes.signIn.terminal.done') }}</p>
                  </div>
                  <ol class="flex flex-col gap-1.5 border-t border-slate-200 bg-gray-50 px-4 py-3 text-sm sm:flex-row sm:gap-6" :data-testid="`runtime-${e.id}-signin-steps`">
                    <li v-for="n in 2" :key="n" class="flex items-center gap-2" :class="e.signing.terminalStep >= n ? 'text-gray-500' : e.signing.terminalStep === n - 1 ? 'font-medium text-gray-900' : 'text-gray-400'" :aria-current="e.signing.terminalStep === n - 1 ? 'step' : undefined">
                      <Icon v-if="e.signing.terminalStep >= n" icon="heroicons:check-circle-20-solid" class="h-5 w-5 flex-shrink-0 text-green-600" aria-hidden="true" />
                      <span v-else-if="e.signing.terminalStep === n - 1 && n === 2" class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" aria-hidden="true"></span>
                      <span v-else class="flex h-5 w-5 items-center justify-center rounded-full border text-xs" :class="e.signing.terminalStep === n - 1 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'" aria-hidden="true">{{ n }}</span>
                      <span>{{ t(`settings.aiRuntimes.signIn.terminal.step${n}`, { name: e.name }) }}</span>
                    </li>
                  </ol>
                </div>
                <p v-else class="text-sm text-red-700" role="alert" :data-testid="`runtime-${e.id}-signin-failed`">{{ t('settings.aiRuntimes.signIn.failed') }}</p>
              </div>

              <!-- progress and outcome of the vendor's updater -->
              <div v-if="e.update.phase !== 'idle'" class="sm:col-span-3 sm:col-start-3" :data-testid="`runtime-${e.id}-outcome`">
                <template v-if="e.update.phase === 'running'">
                  <div class="h-1.5 max-w-md overflow-hidden rounded-full bg-gray-100" role="progressbar" :aria-label="`${e.name}: ${t('settings.aiRuntimes.update.updating')}`">
                    <div class="h-full w-1/3 animate-pulse rounded-full bg-blue-500"></div>
                  </div>
                  <p class="mt-1.5 text-xs text-gray-500" :data-testid="`runtime-${e.id}-progress`"><span class="font-mono text-gray-700">{{ commandOf(e) }}</span> · {{ t(`settings.aiRuntimes.update.steps.${e.update.step}`, { version: e.update.toVersion ?? '' }) }}</p>
                </template>
                <p v-else-if="e.update.phase === 'succeeded'" class="text-sm text-green-700" :data-testid="`runtime-${e.id}-updated`">
                  {{ t('settings.aiRuntimes.update.succeeded', { from: e.update.fromVersion ?? '', to: e.update.toVersion ?? '' }) }}
                </p>
                <div v-else role="alert" :data-testid="`runtime-${e.id}-update-failed`">
                  <p class="text-sm text-red-700">{{ t('settings.aiRuntimes.update.failed', { version: e.version ?? '' }) }}</p>
                  <p class="mt-1.5 break-words rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600">{{ e.update.failureOutput }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <p class="sr-only" role="status" aria-live="polite" data-testid="ai-runtimes-announce">{{ announcement }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useNodeStore } from '~/stores/nodeStore'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import {
  cancelSignIn, checkAgain, terminalEnter, dismissOutcome, initAiRuntimes, reopenAiRuntimes, retryLoad, startSignIn, startUpdate, useAiRuntimesState, useRelativeClock,
  type EngineId, type EngineRuntime,
} from '~/prototype/ai-runtimes/aiRuntimesFixture'

const { t } = useLocalization()
const nodeStore = useNodeStore()
const windowNodeContextStore = useWindowNodeContextStore()
const { state, engines, isChecking, minutesSinceCheck } = useAiRuntimesState()

const gridColumns = 'sm:grid-cols-[8rem_9rem_minmax(0,1fr)_15rem_8rem] sm:gap-x-6'
const mobileLabel = 'w-20 flex-shrink-0 text-xs text-gray-400 sm:hidden'
const secondaryButton = 'inline-flex whitespace-nowrap min-h-9 items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
const primaryButton = 'inline-flex whitespace-nowrap min-h-9 items-center justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'

const COMMAND: Record<EngineId, string> = { codex: 'codex update', claude: 'claude update', antigravity: 'agy update', grok: 'grok update' }
const commandOf = (e: EngineRuntime) => COMMAND[e.id]
const commandOfSignIn = (e: EngineRuntime) => (e.id === 'antigravity' ? 'agy' : e.id)
const isSigningIn = (e: EngineRuntime) => e.signing.phase === 'waiting' || e.signing.phase === 'terminal'
// The terminal takes keyboard focus when it opens, so Enter goes straight to it.
const focusTerminal = (el: HTMLElement | null) => { if (el && document.activeElement !== el && !el.dataset.focused) { el.dataset.focused = '1'; setTimeout(() => el.focus(), 0) } }

const blockedByAgents = (e: EngineRuntime) => e.installed && e.check === 'update_available' && e.agentsRunning > 0 && e.update.phase !== 'running'
const rowState = (e: EngineRuntime) => (!e.installed ? 'not_installed' : e.update.phase !== 'idle' ? `update_${e.update.phase}` : e.check)

const announcement = computed(() => {
  const [name, kind, extra] = state.announce.split('|')
  if (!kind) return ''
  return t(`settings.aiRuntimes.announce.${kind}`, { name: name ?? '', version: extra ?? '' })
})

const currentNode = computed(() => nodeStore.getNodeById(windowNodeContextStore.nodeId))
const isOwnNode = computed(() => windowNodeContextStore.isEmbeddedWindow)

// Opening the page checks every installed engine (each on its own); the first open also seeds the page.
onMounted(() => {
  useRelativeClock()
  initAiRuntimes(isOwnNode.value, currentNode.value?.name || t('settings.components.settings.NodeManager.currentNodeUnknown'))
  reopenAiRuntimes()
})

const onCheckAgain = () => {
  for (const e of engines.value) dismissOutcome(e.id)
  checkAgain()
}
const onSignIn = (id: EngineId) => startSignIn(id)
const onUpdate = (id: EngineId) => {
  const e = engines.value.find((row) => row.id === id)
  if (!e || blockedByAgents(e)) return
  dismissOutcome(id)
  startUpdate(id)
}
</script>
