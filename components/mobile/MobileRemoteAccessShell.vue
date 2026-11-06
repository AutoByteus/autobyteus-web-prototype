<template>
  <main :class="shellClass" data-testid="mobile-remote-access-shell">
    <MobilePairingBootstrap
      v-if="!sessionStore.isPaired || hasRoutePairingParam"
      @paired="onPaired"
      @pairing-failed="cancelPostPairRefresh"
      @pairing-started="beginPostPairRefresh"
    >
      <template v-if="unsupportedMessage" #notice>
        <MobileUnsupportedFeatureNotice :message="unsupportedMessage" />
      </template>
    </MobilePairingBootstrap>

    <template v-else>
      <section
        v-if="isPostPairChecking"
        class="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-8 text-center"
        data-testid="mobile-post-pair-checking"
      >
        <div class="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Pairing complete</p>
          <h1 class="mt-3 text-2xl font-bold text-slate-950">Checking your desktop</h1>
          <p class="mt-3 text-sm text-slate-600">
            Refreshing Phone Access status and mobile work choices before your runs open.
          </p>
          <p class="mt-4 text-sm font-semibold text-blue-700">Checking status…</p>
        </div>
      </section>

      <MobileRunsScreen
        v-else
        :node-name="nodeName"
        :connected="connected"
        :notice="unsupportedMessage"
        @open-run="openNode"
        @new-run="openNewRun"
        @open-connection="showConnection = true"
      />

      <MobileRunScreen
        v-if="screen === 'run' && currentNode"
        :node="currentNode"
        :context="mobileWorkStore.currentContext"
        @back="goBack"
        @open="switchNode"
        @open-results="openResults"
        @retry-node="retryNode"
      />

      <MobileNewRun
        v-if="screen === 'new-run'"
        :context="mobileWorkStore.currentContext"
        :setup-intent="mobileWorkStore.runSetupIntent"
        @close="goBack"
        @launched="onLaunched"
        @setup-intent-consumed="mobileWorkStore.consumeRunSetupIntent"
      />

      <MobileResults
        v-if="resultsOpen && currentNode"
        :node="currentNode"
        :context="mobileWorkStore.currentContext"
        @back="goBack"
      />

      <MobileConnectionSheet
        v-if="showConnection"
        :node-name="nodeName"
        :server-base-url="sessionStore.serverBaseUrl"
        :connected="connected"
        :status-label="connectionStatusLabel"
        :is-checking="sessionStore.isCheckingStatus"
        :diagnostic="sessionStore.lastDiagnostic"
        :peers="runTreeStore.peers"
        @close="showConnection = false"
        @check="checkStatus"
        @unpair="showConnection = false; showUnpairConfirm = true"
      />

      <MobileUnpairConfirm
        v-if="showUnpairConfirm"
        @cancel="showUnpairConfirm = false"
        @confirm="unpairPhone"
      />
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import MobileConnectionSheet from '~/components/mobile/MobileConnectionSheet.vue';
import MobileNewRun from '~/components/mobile/MobileNewRun.vue';
import MobilePairingBootstrap from '~/components/mobile/MobilePairingBootstrap.vue';
import MobileResults from '~/components/mobile/MobileResults.vue';
import MobileRunScreen from '~/components/mobile/MobileRunScreen.vue';
import MobileRunsScreen from '~/components/mobile/MobileRunsScreen.vue';
import MobileUnpairConfirm from '~/components/mobile/MobileUnpairConfirm.vue';
import MobileUnsupportedFeatureNotice from '~/components/mobile/MobileUnsupportedFeatureNotice.vue';
import type { MobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture';
import { useAgentContextsStore } from '~/stores/agentContextsStore';
import { useMobileNodeSessionStore } from '~/stores/mobileNodeSessionStore';
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore';
import { useMobileWorkStore } from '~/stores/mobileWorkStore';
import { useRunHistoryStore } from '~/stores/runHistoryStore';
import { useAgentSelectionStore } from '~/stores/agentSelectionStore';
import type { MobileFeatureId } from '~/utils/mobileFeatureGates';
import type { MobileWorkContext } from '~/types/mobileWork';
import { clearMobileRunSelection, selectMobileRun } from '~/utils/mobile/mobileSelectionAdapter';

// Keep the component name in the compiled chunk stable for existing page tests.
defineOptions({ name: 'MobileRemoteAccessShell' });

const sessionStore = useMobileNodeSessionStore();
const mobileWorkStore = useMobileWorkStore();
const runTreeStore = useMobileRunTreeStore();
const runHistoryStore = useRunHistoryStore();
const agentContextsStore = useAgentContextsStore();
const route = useRoute();
const selectionStore = useAgentSelectionStore();

type MobileScreen = 'runs' | 'run' | 'new-run';

// One list, one run screen, one New run page. The system Back key walks them in order (history entries).
const screen = ref<MobileScreen>('runs');
const resultsOpen = ref(false);
const showConnection = ref(false);
const showUnpairConfirm = ref(false);
const isPostPairChecking = ref(false);
const pendingPostPairRefresh = ref(false);
const postPairRefreshPromise = ref<Promise<void> | null>(null);
const routePairingConsumed = ref(false);
const launchedNode = ref<MobileRunNode | null>(null);

const unsupportedFeatureMessages: Partial<Record<MobileFeatureId, string>> = {
  desktopWorkspace: 'The desktop workspace isn’t on the phone. Your runs are here.',
  desktopSettings: 'Desktop settings are managed from the desktop app. Phone Access exposes only phone connection controls.',
  desktopUpdates: 'Desktop update controls are not available from the phone client.',
  localFolderPicker: 'Local folder picking is not available from the phone client.',
  applicationIframe: 'Application iframe surfaces are not part of the mobile shell yet.',
  browser: 'The Browser tab is Electron-only today and is not available from the phone client.',
};

const unsupportedMessage = computed(() => {
  const feature = String(route.query.unsupported ?? '') as MobileFeatureId;
  return unsupportedFeatureMessages[feature] ?? null;
});
const routePairingParam = computed(() => {
  if (Array.isArray(route.query.pairing)) {
    return String(route.query.pairing[0] ?? '').trim();
  }
  return String(route.query.pairing ?? '').trim();
});
const hasRoutePairingParam = computed(() => Boolean(routePairingParam.value) && !routePairingConsumed.value);
const shellClass = computed(() => [
  'bg-white text-slate-900',
  sessionStore.isPaired && !hasRoutePairingParam.value ? 'fixed inset-0 h-[100dvh] overflow-hidden overscroll-none' : 'min-h-screen bg-slate-100',
]);

const nodeName = computed(() => sessionStore.lastStatus?.serverName || new URL(sessionStore.serverBaseUrl || 'http://localhost', 'http://localhost').host);
const connected = computed(() => runTreeStore.listState !== 'node-offline' && !sessionStore.lastDiagnostic);
const connectionStatusLabel = computed(() => {
  if (sessionStore.isCheckingStatus) return 'Checking…';
  if (!connected.value) return 'Not reachable';
  return sessionStore.lastStatus && !sessionStore.lastStatus.phoneAccessEnabled ? 'Phone Access disabled' : 'Connected';
});
const currentNode = computed<MobileRunNode | null>(() => runTreeStore.byId(runTreeStore.selectedId) ?? (launchedNode.value?.id === runTreeStore.selectedId ? launchedNode.value : null));

async function checkStatus(): Promise<void> {
  try {
    const status = await sessionStore.fetchStatus();
    sessionStore.recordAuthorizedApiReachability(Boolean(status));
  } catch {
    sessionStore.recordAuthorizedApiReachability(false);
  }
}

function contextFor(node: MobileRunNode): MobileWorkContext {
  return {
    kind: 'agent-run',
    runId: node.id,
    agentDefinitionId: 'agent-researcher',
    title: node.name,
    summary: node.summary,
    workspaceRootPath: '/synthetic/prototype-workspace',
    isActive: node.status === 'running',
    lastActivityAt: new Date().toISOString(),
    statusLabel: node.status,
  };
}

async function openConversation(node: MobileRunNode): Promise<void> {
  if (!runTreeStore.isNodeReachable(node.node)) {
    clearMobileRunSelection();
    return;
  }
  if (agentContextsStore.getRun(node.id)) {
    selectMobileRun(node.id, 'agent');
  } else {
    await runHistoryStore.openRun(node.id, { selectionMode: 'mobile' });
  }
}

/** Any row opens that agent's conversation: a team opens its coordinator, a member or a delegated child its own. */
async function openNode(row: MobileRunNode, replace = false): Promise<void> {
  const node = runTreeStore.targetOf(row);
  try {
    await openConversation(node);
  } catch (error) {
    console.warn('[MobileRemoteAccessShell] Failed to open the run.', error);
    return;
  }
  runTreeStore.select(node.id);
  mobileWorkStore.selectContext(contextFor(node), 'chat');
  navigate('run', { replace: replace || screen.value === 'run' });
}

function switchNode(row: MobileRunNode): void {
  resultsOpen.value = false;
  void openNode(row, true);
}

function retryNode(): void {
  // The reference's remote node stays down: the row keeps its state, as it does on the desktop.
}

function openNewRun(): void {
  navigate('new-run');
}

function onLaunched(context: MobileWorkContext): void {
  if (context.kind !== 'agent-run' && context.kind !== 'team-run') return;
  const id = context.kind === 'agent-run' ? context.runId : context.teamRunId;
  const node: MobileRunNode = { id, kind: 'agent', name: context.title, summary: context.summary || 'New run', status: 'idle', minutes: 0 };
  launchedNode.value = node;
  runTreeStore.addLaunched(node);
  runTreeStore.select(id);
  mobileWorkStore.selectContext(context, 'chat');
  navigate('run', { replace: true });
}

function openResults(): void {
  history.pushState({ mx: 'run', results: true }, '');
  resultsOpen.value = true;
}

function navigate(next: MobileScreen, options: { replace?: boolean } = {}): void {
  const state = { mx: next, results: false };
  if (options.replace) history.replaceState(state, '');
  else history.pushState(state, '');
  screen.value = next;
  resultsOpen.value = false;
}

// A new run is sent its first message from the run screen; that gives it its permanent id and the run must stay open.
watch(() => selectionStore.selectedRunId, (nextId) => {
  const context = mobileWorkStore.currentContext;
  if (context?.kind !== 'agent-run' || selectionStore.selectedType !== 'agent' || !nextId || nextId === context.runId) return;
  if (launchedNode.value?.id !== context.runId) return;
  runTreeStore.renameLaunched(context.runId, nextId);
  launchedNode.value = { ...launchedNode.value, id: nextId };
  mobileWorkStore.selectContext({ ...context, runId: nextId }, 'chat');
});

function goBack(): void {
  history.back();
}

function onPopState(event: PopStateEvent): void {
  const state = event.state as { mx?: MobileScreen; results?: boolean } | null;
  screen.value = state?.mx ?? 'runs';
  resultsOpen.value = Boolean(state?.results);
  showConnection.value = false;
}

function unpairPhone(): void {
  showUnpairConfirm.value = false;
  mobileWorkStore.clearContext();
  clearMobileRunSelection();
  sessionStore.deleteLocalSession();
  screen.value = 'runs';
  resultsOpen.value = false;
  pendingPostPairRefresh.value = false;
  isPostPairChecking.value = false;
  postPairRefreshPromise.value = null;
}

function beginPostPairRefresh(): void {
  screen.value = 'runs';
  pendingPostPairRefresh.value = true;
  isPostPairChecking.value = true;
}

function cancelPostPairRefresh(): void {
  pendingPostPairRefresh.value = false;
  isPostPairChecking.value = false;
  postPairRefreshPromise.value = null;
}

async function completePostPairRefresh(): Promise<void> {
  if (!sessionStore.isPaired) {
    return;
  }
  beginPostPairRefresh();
  if (postPairRefreshPromise.value) {
    return postPairRefreshPromise.value;
  }

  const refreshPromise = (async () => {
    try {
      await checkStatus();
    } finally {
      pendingPostPairRefresh.value = false;
      isPostPairChecking.value = false;
      postPairRefreshPromise.value = null;
    }
  })();
  postPairRefreshPromise.value = refreshPromise;
  return refreshPromise;
}

async function onPaired(): Promise<void> {
  clearRoutePairingParam();
  await completePostPairRefresh();
}

function clearRoutePairingParam(): void {
  if (!hasRoutePairingParam.value || typeof window === 'undefined') {
    return;
  }
  routePairingConsumed.value = true;
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete('pairing');
  window.history.replaceState(window.history.state, '', nextUrl.toString());
}

watch(() => sessionStore.isPaired, (isPaired, wasPaired) => {
  if (isPaired && pendingPostPairRefresh.value) {
    void completePostPairRefresh();
    return;
  }
  if (!isPaired && wasPaired) {
    cancelPostPairRefresh();
  }
});

onMounted(async () => {
  window.addEventListener('popstate', onPopState);
  history.replaceState({ mx: 'runs', results: false }, '');
  sessionStore.initializeFromStorage();
  if (!sessionStore.isPaired) {
    return;
  }
  await checkStatus();
});

onBeforeUnmount(() => window.removeEventListener('popstate', onPopState));
</script>
