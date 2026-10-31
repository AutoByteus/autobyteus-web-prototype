<template>
  <section
    class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
    :data-testid="`integration-card-${item.id}`"
    :aria-labelledby="`integration-${item.id}-title`"
  >
    <header class="flex flex-wrap items-start gap-4">
      <div
        class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50"
        :data-testid="`integration-icon-${item.id}`"
      >
        <img v-if="item.icon" :src="`/integrations-icons-${item.icon}.svg`" alt="" class="h-7 w-7" aria-hidden="true">
        <span v-else class="text-lg font-semibold text-slate-500" aria-hidden="true">{{ item.name.charAt(0).toUpperCase() }}</span>
      </div>
      <div class="min-w-0 flex-1 basis-60">
        <h3 :id="`integration-${item.id}-title`" class="text-2xl font-semibold leading-tight text-gray-900">{{ item.name }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
        :class="chip.class"
        :data-testid="`integration-status-${item.id}`"
      >
        <Icon v-if="chip.icon" :icon="chip.icon" class="h-4 w-4" aria-hidden="true" />
        <span v-else class="h-2 w-2 rounded-full" :class="chip.dot" aria-hidden="true" />
        {{ chip.text }}
      </span>
    </header>

    <!-- Needs a newer AutoByteus (DEC-001): nothing to do on the card but update the app. -->
    <div
      v-if="item.phase === 'needs_newer'"
      class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
      :data-testid="`integration-newer-${item.id}`"
    >
      <p class="min-w-0 flex-1 basis-72 text-sm text-gray-600">{{ t('integrations.newer.text') }}</p>
      <NuxtLink
        to="/settings?section=updates"
        class="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {{ t('integrations.newer.action') }}
      </NuxtLink>
    </div>

    <template v-else>
      <ol class="mt-5">
        <!-- 1. Install -->
        <li class="flex gap-4" :data-testid="`integration-step-install-${item.id}`">
          <div class="flex flex-col items-center">
            <StepMarker :number="1" :state="installed ? 'done' : 'active'" />
            <span class="mt-1 w-px flex-1 bg-slate-200" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1 pb-5">
            <h4 class="text-sm font-semibold leading-7 text-gray-900">{{ installed ? t('integrations.install.titleDone') : t('integrations.install.title') }}</h4>
            <p class="text-sm text-gray-600">
              <template v-for="(part, index) in withSkillName(installed
                ? t('integrations.install.textDone', { skill: item.skillName })
                : t('integrations.install.text', { skill: item.skillName }))" :key="index">
                <code v-if="part.skill" class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.8125rem] text-slate-800">{{ part.text }}</code>
                <template v-else>{{ part.text }}</template>
              </template>
            </p>
            <button
              v-if="!installed"
              type="button"
              class="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
              :disabled="busy !== undefined"
              :data-testid="`integration-install-${item.id}`"
              @click="runInstall"
            >
              <span v-if="busy === 'install'" class="inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white" aria-hidden="true" />
              {{ busy === 'install' ? t('integrations.install.installing') : t('integrations.install.button') }}
            </button>
            <p
              v-if="message && message.step === 'install'"
              class="mt-3 text-sm"
              :class="message.kind === 'error' ? 'text-red-600' : 'text-green-700'"
              role="status"
              :data-testid="`integration-message-${item.id}`"
            >
              {{ message.text }}
            </p>
          </div>
        </li>

        <!-- 2. Connect -->
        <li class="flex gap-4" :data-testid="`integration-step-connect-${item.id}`">
          <div class="flex flex-col items-center">
            <StepMarker :number="2" :state="connected ? 'done' : installed ? 'active' : 'upcoming'" />
            <span class="mt-1 w-px flex-1 bg-slate-200" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1 pb-5">
            <h4 class="text-sm font-semibold leading-7" :class="installed ? 'text-gray-900' : 'text-gray-500'">
              {{ connected
                ? t('integrations.connect.titleConnected', { name: item.name })
                : t('integrations.connect.title', { name: item.name }) }}
            </h4>

            <p v-if="!installed" class="text-sm text-gray-500">{{ t('integrations.connect.textUpcoming', { name: item.name }) }}</p>

            <template v-else>
              <p v-if="connected" class="text-sm text-gray-600">
                {{ t('integrations.connect.connectedText') }}
                <span v-if="connectedSince" :data-testid="`integration-connected-at-${item.id}`">{{ t('integrations.connect.connectedSince', { date: connectedSince }) }}</span>
              </p>
              <p v-else class="text-sm text-gray-600" :data-testid="`integration-help-${item.id}`">
                <template v-for="(part, index) in helpParts" :key="index">
                  <a
                    v-if="part.href"
                    :href="part.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >{{ part.text }}</a>
                  <template v-else>{{ part.text }}</template>
                </template>
              </p>

              <div v-if="showTokenField" class="mt-3 space-y-2">
                <label class="block text-sm font-medium text-gray-900" :for="`integration-token-${item.id}`">
                  {{ connected ? t('integrations.connect.replaceTokenLabel', { name: item.name }) : t('integrations.connect.tokenLabel', { name: item.name }) }}
                </label>
                <div class="flex gap-2">
                  <input
                    :id="`integration-token-${item.id}`"
                    v-model="tokenDraft"
                    type="password"
                    autocomplete="off"
                    spellcheck="false"
                    class="h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    :placeholder="t('integrations.connect.tokenPlaceholder', { name: item.name })"
                    :disabled="busy !== undefined"
                    :data-testid="`integration-token-input-${item.id}`"
                    @keydown.enter.prevent="runConnect"
                  >
                  <button
                    type="button"
                    class="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                    :disabled="!tokenDraft.trim() || busy !== undefined"
                    :data-testid="`integration-connect-${item.id}`"
                    @click="runConnect"
                  >
                    <span v-if="busy === 'connect'" class="inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white" aria-hidden="true" />
                    {{ busy === 'connect' ? t('integrations.connect.checking') : t('integrations.connect.connect') }}
                  </button>
                  <button
                    v-if="connected"
                    type="button"
                    class="inline-flex h-11 shrink-0 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="busy !== undefined"
                    @click="cancelReplace"
                  >
                    {{ t('integrations.connect.cancel') }}
                  </button>
                </div>
                <p class="text-xs text-gray-500">{{ t('integrations.connect.hint', { name: item.name }) }}</p>
              </div>

              <div v-if="connected && !showTokenField" class="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="busy !== undefined"
                  :data-testid="`integration-test-${item.id}`"
                  @click="runTest"
                >
                  {{ busy === 'test' ? t('integrations.connect.testing') : t('integrations.connect.test') }}
                </button>
                <button
                  type="button"
                  class="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="busy !== undefined"
                  :data-testid="`integration-replace-${item.id}`"
                  @click="replacing = true"
                >
                  {{ t('integrations.connect.replace') }}
                </button>
                <button
                  type="button"
                  class="inline-flex h-9 items-center rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="busy !== undefined"
                  :data-testid="`integration-remove-${item.id}`"
                  @click="runRemove"
                >
                  {{ busy === 'remove' ? t('integrations.connect.removing') : t('integrations.connect.remove') }}
                </button>
              </div>
            </template>
            <p
              v-if="message && message.step === 'connect'"
              class="mt-3 text-sm"
              :class="message.kind === 'error' ? 'text-red-600' : 'text-green-700'"
              role="status"
              :data-testid="`integration-message-${item.id}`"
            >
              {{ message.text }}
            </p>
          </div>
        </li>

        <!-- 3. Give agents access -->
        <li class="flex gap-4" :data-testid="`integration-step-access-${item.id}`">
          <div class="flex flex-col items-center">
            <StepMarker :number="3" :state="connected ? 'active' : 'upcoming'" />
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-semibold leading-7" :class="connected ? 'text-gray-900' : 'text-gray-500'">{{ t('integrations.access.title') }}</h4>
            <p class="text-sm" :class="connected ? 'text-gray-600' : 'text-gray-500'">
              <template v-for="(part, index) in withSkillName(t('integrations.access.text', { skill: item.skillName }))" :key="index">
                <code v-if="part.skill" class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.8125rem] text-slate-800">{{ part.text }}</code>
                <template v-else>{{ part.text }}</template>
              </template>
            </p>
            <p class="mt-1 text-xs text-gray-500" :data-testid="`integration-all-installed-note-${item.id}`">{{ t('integrations.access.allInstalledNote') }}</p>
            <NuxtLink
              v-if="connected"
              :to="{ path: '/agents', query: { view: 'list' } }"
              class="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :data-testid="`integration-open-agents-${item.id}`"
            >
              {{ t('integrations.access.openAgents') }}
              <Icon icon="heroicons:arrow-right" class="h-4 w-4" aria-hidden="true" />
            </NuxtLink>
          </div>
        </li>
      </ol>

      <div class="mt-5 border-t border-slate-100 pt-4" :data-testid="`integration-tools-${item.id}`">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h4 class="text-sm font-semibold text-gray-900">{{ t('integrations.tools.title') }}</h4>
          <ul class="flex flex-wrap items-center gap-2" role="list">
            <li
              v-for="tool in item.tools"
              :key="tool.name"
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              :class="tool.found ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'"
              :data-testid="`integration-tool-${item.id}-${tool.name}`"
            >
              <Icon
                :icon="tool.found ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'"
                class="h-4 w-4"
                :class="tool.found ? 'text-green-600' : 'text-amber-600'"
                aria-hidden="true"
              />
              <span class="font-mono">{{ tool.name }}</span>
              <span class="font-normal" :class="tool.found ? 'text-slate-500' : 'text-amber-700'">{{ tool.found ? t('integrations.tools.found') : t('integrations.tools.missing') }}</span>
            </li>
          </ul>
        </div>
        <p v-if="missingTools.length === 0" class="mt-2 text-xs text-gray-500">{{ t('integrations.tools.caption') }}</p>
        <div v-else class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p class="text-xs text-amber-800" :data-testid="`integration-tools-missing-${item.id}`">
            {{ missingTools.length === 1
              ? t('integrations.tools.missingText', { tools: missingTools.join(', ') })
              : t('integrations.tools.missingTextMany', { tools: missingTools.join(', ') }) }}
          </p>
          <button
            type="button"
            class="text-xs font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
            :disabled="busy !== undefined"
            :data-testid="`integration-tools-recheck-${item.id}`"
            @click="runRecheck"
          >
            {{ busy === 'tools' ? t('integrations.tools.checking') : t('integrations.tools.checkAgain') }}
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { IntegrationError, useIntegrationsStore, type IntegrationView } from '~/stores/integrationsStore'
import StepMarker from '~/components/integrations/IntegrationStepMarker.vue'

const props = defineProps<{ item: IntegrationView }>()

const store = useIntegrationsStore()
const { t } = useLocalization()

const tokenDraft = ref('')
const replacing = ref(false)

const installed = computed(() => props.item.phase === 'needs_token' || props.item.phase === 'connected')
const connected = computed(() => props.item.phase === 'connected')
const busy = computed(() => store.busy[props.item.id])
const message = computed(() => store.messages[props.item.id])
const showTokenField = computed(() => installed.value && (!connected.value || replacing.value))
const missingTools = computed(() => props.item.tools.filter(tool => !tool.found).map(tool => tool.name))
const connectedSince = computed(() => (props.item.connectedAt ? new Date(props.item.connectedAt).toLocaleDateString() : ''))

const chip = computed(() => {
  switch (props.item.phase) {
    case 'connected':
      return { text: t('integrations.status.connectedAs', { login: props.item.login ?? '' }), class: 'bg-green-50 text-green-700 ring-1 ring-green-200', dot: 'bg-green-500', icon: null }
    case 'needs_token':
      return { text: t('integrations.status.needsToken'), class: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', dot: 'bg-amber-500', icon: null }
    case 'needs_newer':
      return { text: t('integrations.status.needsNewer'), class: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', dot: '', icon: 'heroicons:arrow-up-circle' }
    default:
      return { text: t('integrations.status.notInstalled'), class: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', icon: null }
  }
})

/** The integration's own help text; a web address in it becomes a link, nothing else is interpreted. */
const helpParts = computed(() => props.item.tokenHelp
  .split(/(https?:\/\/[^\s)]+[^\s).,;])/g)
  .filter(Boolean)
  .map(text => (/^https?:\/\//.test(text) ? { text, href: text } : { text, href: '' })))

/** The integration's skill name stands out wherever a sentence names it. */
const withSkillName = (text: string) => text
  .split(props.item.skillName)
  .flatMap((piece, index, all) => (index < all.length - 1
    ? [{ text: piece, skill: false }, { text: props.item.skillName, skill: true }]
    : [{ text: piece, skill: false }]))
  .filter(part => part.text !== '')

const say = (step: 'install' | 'connect', kind: 'success' | 'error', text: string) => store.setMessage(props.item.id, { kind, text, step })

const errorText = (cause: unknown, fallbackKey: string): string => {
  const code = cause instanceof IntegrationError ? cause.code : ''
  const key = code === 'TOKEN_REJECTED' ? 'integrations.connect.errorTokenRejected'
    : code === 'TOKEN_CHECK_FAILED' ? 'integrations.connect.errorTokenCheckFailed'
      : fallbackKey
  return t(key, { name: props.item.name, skill: props.item.skillName })
}

const runInstall = async () => {
  try {
    await store.install(props.item.id)
  } catch (cause) {
    const clash = cause instanceof IntegrationError && cause.code === 'SKILL_NAME_CLASH'
    say('install', 'error', t(clash ? 'integrations.install.errorClash' : 'integrations.install.errorFailed', { name: props.item.name, skill: props.item.skillName }))
  }
}

const runConnect = async () => {
  const token = tokenDraft.value.trim()
  if (!token) return
  try {
    if (await store.connect(props.item.id, token) !== null) {
      tokenDraft.value = ''
      replacing.value = false
    }
  } catch (cause) {
    say('connect', 'error', errorText(cause, 'integrations.connect.saveFailed'))
  }
}

const runTest = async () => {
  try {
    const login = await store.test(props.item.id)
    if (login !== null) say('connect', 'success', t('integrations.connect.testPassed', { login }))
  } catch (cause) {
    const rejected = cause instanceof IntegrationError && cause.code === 'TOKEN_REJECTED'
    say('connect', 'error', rejected
      ? t('integrations.connect.errorStoredTokenRejected', { name: props.item.name })
      : errorText(cause, 'integrations.connect.testFailed'))
  }
}

const runRemove = async () => {
  try {
    await store.remove(props.item.id)
    replacing.value = false
    say('connect', 'success', t('integrations.connect.removed', { name: props.item.name }))
  } catch (cause) {
    say('connect', 'error', errorText(cause, 'integrations.connect.removeFailed'))
  }
}

const runRecheck = async () => {
  try { await store.checkTools(props.item.id) } catch { /* the tool list keeps its last answer */ }
}

const cancelReplace = () => {
  replacing.value = false
  tokenDraft.value = ''
}
</script>
