<template>
  <div class="flex w-full flex-col gap-5" data-testid="settings-model-routing-panel">
    <header class="px-1">
      <h2 class="text-2xl font-semibold leading-tight text-gray-900">{{ t('settings.modelRouting.title') }}</h2>
      <ModelRoutingStatusStrip :status="status" :node-name="nodeName" :own-node="ownNode" :setup-link="activeTab !== 'setup'" @show-setup="select('setup')" />
    </header>

    <div class="border-b border-slate-100" role="tablist" :aria-label="t('settings.modelRouting.tabs.label')">
      <div class="flex gap-7 overflow-x-auto px-1">
        <button
          v-for="tab in TABS"
          :id="`model-routing-tab-${tab}`"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab"
          :aria-controls="`model-routing-panel-${tab}`"
          :tabindex="activeTab === tab ? 0 : -1"
          class="whitespace-nowrap border-b-2 bg-transparent px-0.5 pb-[11px] pt-[3px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          :class="activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-600 hover:text-slate-900'"
          :data-testid="`model-routing-tab-${tab}`"
          @click="select(tab)"
          @keydown.right.prevent="move(1)"
          @keydown.left.prevent="move(-1)"
        >
          {{ t(`settings.modelRouting.tabs.${tab}`) }}
        </button>
      </div>
    </div>

    <div :id="`model-routing-panel-${activeTab}`" role="tabpanel" :aria-labelledby="`model-routing-tab-${activeTab}`" class="flex flex-col gap-5">
      <ModelRoutingSetup v-if="activeTab === 'setup'" :report="report" :status="status" :own-node="ownNode" @open-conversation="openConversation" />
      <ModelRoutingDecisions v-else-if="activeTab === 'decisions'" :status="status" :focus-id="focusDecision" @show-setup="select('setup')" />
      <ModelRoutingOverview v-else-if="activeTab === 'overview'" :status="status" @show-setup="select('setup')" />
      <AgentRuntimesNowSection v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApolloClient } from '~/utils/apolloClient'
import { isOwnNodeWindow } from '~/utils/ownNodeWindow'
import { useNodeStore } from '~/stores/nodeStore'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import { AvailableAgentRuntimes } from '~/graphql/queries/availableAgentRuntimesQueries'
import type { AvailableAgentRuntimesReport } from '~/types/availableAgentRuntimes'
import { buildAgentRunChatRoute } from '~/services/workspace/workspaceNavigationService'
import { routing, routerStatusOf } from '~/prototype/model-routing/modelRoutingState'
import { ROUTER_RUN_ID } from '~/prototype/model-routing/modelRoutingFixture'
import AgentRuntimesNowSection from './AgentRuntimesNowSection.vue'
import ModelRoutingStatusStrip from './ModelRoutingStatusStrip.vue'
import ModelRoutingSetup from './ModelRoutingSetup.vue'
import ModelRoutingDecisions from './ModelRoutingDecisions.vue'
import ModelRoutingOverview from './ModelRoutingOverview.vue'

const TABS = ['setup', 'decisions', 'overview', 'runtimes'] as const
type Tab = typeof TABS[number]

const { t } = useLocalization()
const route = useRoute()
const router = useRouter()
const node = useWindowNodeContextStore()
const nodeStore = useNodeStore()

const ownNode = computed(() => isOwnNodeWindow(node))
const nodeName = computed(() => nodeStore.getEntryById(node.entryId)?.name || t('settings.components.settings.NodeManager.currentNodeUnknown'))

// The page reads the node's runtimes once for the router's status; "Agent runtimes now" reads them itself.
const report = shallowRef<AvailableAgentRuntimesReport | null>(null)
const readReport = async (): Promise<void> => {
  try {
    if (!await node.waitForBoundBackendReady()) return
    const { data } = await getApolloClient().query({ query: AvailableAgentRuntimes, fetchPolicy: 'network-only', context: { queryDeduplication: false } })
    report.value = data.availableAgentRuntimes as AvailableAgentRuntimesReport
  } catch { /* the status then shows the router as chosen, without the live check */ }
}
onMounted(() => { void readReport() })
watch(() => node.bindingRevision, () => { report.value = null; void readReport() })

const status = computed(() => routerStatusOf(report.value))

const queryTab = (): Tab | null => {
  const value = String(route.query.tab ?? '').replace('knowledge', 'setup')
  return (TABS as readonly string[]).includes(value) ? value as Tab : null
}
const activeTab = ref<Tab>(queryTab() ?? (routing.enabled && routing.router ? 'decisions' : 'setup'))
const focusDecision = computed(() => (typeof route.query.decision === 'string' ? route.query.decision : null))
watch(() => route.query.tab, () => { const next = queryTab(); if (next) activeTab.value = next })

const select = (tab: Tab): void => {
  activeTab.value = tab
  void router.replace({ query: { ...route.query, section: 'model-routing', tab, decision: undefined } })
}
const move = (delta: number): void => {
  const next = TABS[(TABS.indexOf(activeTab.value) + delta + TABS.length) % TABS.length]
  select(next)
  void Promise.resolve().then(() => document.getElementById(`model-routing-tab-${next}`)?.focus())
}

/** "Open conversation" works while internal agents are hidden: it opens the router's run by its ID. */
const openConversation = (): void => { void router.push(buildAgentRunChatRoute(ROUTER_RUN_ID)) }
</script>
