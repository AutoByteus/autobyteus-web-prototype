<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10 sm:py-16" data-testid="first-run-page">
    <main class="mx-auto w-full max-w-xl">
      <div class="flex items-center gap-2.5">
        <img src="/autobyteus-icon.svg" alt="" class="h-8 w-8" />
        <span class="text-base font-semibold text-slate-900">AutoByteus</span>
      </div>

      <!-- A node that has an owner, or a request from another computer: the page offers nothing. -->
      <section v-if="start !== 'ready'" class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" data-testid="first-run-closed">
        <h1 class="text-xl font-semibold text-slate-900">{{ start === 'owned' ? t(k('owned.title'), { node: nodeName }) : t(k('remote.title')) }}</h1>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ start === 'owned' ? t(k('owned.text')) : t(k('remote.text'), { node: nodeName }) }}</p>
      </section>

      <section v-else-if="!connected" class="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="px-6 pb-5 pt-6">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t(k('eyebrow')) }}</p>
          <h1 class="mt-1 text-xl font-semibold text-slate-900">{{ t(k('title'), { node: nodeName }) }}</h1>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ t(k('lead')) }}</p>
        </div>

        <!-- 1. Join the private network, here on the node's own computer -->
        <div class="border-t border-slate-100 px-6 py-5" data-testid="first-run-join">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span class="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs" :class="joined ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white'">{{ joined ? '✓' : '1' }}</span>
            {{ t(k('join.title')) }}
          </h2>
          <template v-if="joined">
            <p class="mt-2 text-sm text-slate-700" data-testid="first-run-joined">{{ joinedText }}</p>
            <button type="button" class="mt-1 rounded text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="resetJoin">{{ t(k('join.change')) }}</button>
          </template>
          <template v-else>
            <div class="mt-3 space-y-2" role="radiogroup" :aria-label="t(k('join.title'))">
              <label v-for="option in OPTIONS" :key="option" class="flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors" :class="way === option ? 'border-blue-500 bg-blue-50/60 ring-1 ring-inset ring-blue-500' : 'border-slate-200 hover:border-slate-300'">
                <input v-model="way" type="radio" name="way" :value="option" class="mt-1 accent-blue-600" :data-testid="`first-run-way-${option}`">
                <span>
                  <span class="block text-sm font-semibold text-slate-900">{{ t(k(`join.${option}.title`)) }}</span>
                  <span class="block text-[13px] leading-[18px] text-slate-500">{{ t(k(`join.${option}.text`)) }}</span>
                </span>
              </label>
            </div>
            <div class="mt-4">
              <template v-if="way === 'tailscale'">
                <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60" :disabled="busy" data-testid="first-run-signin" @click="signIn">
                  <span v-if="busy" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />
                  {{ busy ? t(k('join.tailscale.waiting')) : t(k('join.tailscale.action')) }}
                </button>
                <p class="mt-1.5 text-xs text-slate-500">{{ t(k('join.tailscale.hint')) }}</p>
              </template>
              <form v-else-if="way === 'headscale'" @submit.prevent="useInvite">
                <label for="first-run-invite" class="text-sm font-medium text-slate-900">{{ t(k('join.headscale.label')) }}</label>
                <textarea id="first-run-invite" v-model="invite" rows="2" spellcheck="false" autocomplete="off" class="mt-1.5 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs leading-5 text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="abhi_…" data-testid="first-run-invite" />
                <p class="mt-1 text-xs text-slate-500">{{ t(k('join.headscale.hint')) }}</p>
                <button type="submit" class="mt-3 inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60" :disabled="busy || !invite.trim()" data-testid="first-run-join-invite">
                  <span v-if="busy" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />
                  {{ busy ? t(k('join.joining')) : t(k('join.headscale.action')) }}
                </button>
              </form>
              <button v-else type="button" class="inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="first-run-local" @click="useLocal">{{ t(k('join.local.action')) }}</button>
              <p v-if="error" class="mt-2 flex items-start gap-2 text-sm text-red-700" role="alert" data-testid="first-run-error">
                <svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="M10 6.5v4M10 13.5v.01" stroke-linecap="round" /></svg>
                {{ error }}
              </p>
            </div>
          </template>
        </div>

        <!-- 2. Make the node code; it is pasted on the desktop that should control this node -->
        <div class="border-t border-slate-100 px-6 py-5" :class="joined ? '' : 'opacity-50'" data-testid="first-run-code-step">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span class="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs" :class="joined ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'">2</span>
            {{ t(k('code.title')) }}
          </h2>
          <p class="mt-1.5 text-sm leading-6 text-slate-600">{{ t(k('code.lead')) }}</p>
          <div v-if="joined" class="mt-3">
            <NodeCodePanel :node-id="NODE_ID" :address="address" :node-name="nodeName" :closable="false" @used="connected = true" />
          </div>
        </div>

        <p class="border-t border-slate-100 px-6 py-4 text-xs leading-5 text-slate-500">{{ t(k('note')) }}</p>
      </section>

      <section v-else class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" data-testid="first-run-done" role="status">
        <div class="flex items-start gap-3">
          <span class="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 10.5 3.2 3.2L15 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <div>
            <h1 class="text-xl font-semibold text-slate-900">{{ t(k('done.title'), { node: nodeName }) }}</h1>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ t(k('done.text'), { node: nodeName }) }}</p>
          </div>
        </div>
        <dl class="mt-5 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <dt class="text-slate-500">{{ t(k('done.network')) }}</dt><dd class="text-slate-900">{{ networkText }}</dd>
          <dt class="text-slate-500">{{ t(k('done.address')) }}</dt><dd class="font-mono text-slate-900">{{ address }}</dd>
          <dt class="text-slate-500">{{ t(k('done.owner')) }}</dt><dd class="text-slate-900">{{ t(k('done.yourDesktop')) }}</dd>
        </dl>
        <p class="mt-4 text-sm text-slate-500">{{ t(k('done.close')) }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NodeCodePanel from '~/components/settings/nodes/NodeCodePanel.vue';
import { useLocalization } from '~/composables/useLocalization';

/**
 * extensions-ui-516 (design route, Part B; pairing-contract §6a): the first-run page of a brand-new node, opened in a
 * browser on that machine itself while the node has no owner. The node joins the private network here, then makes a node
 * code; the owner pastes it on the desktop that should control the node (Nodes → Add node → Paste a node code). The page
 * shows "connected" when that desktop used the code (simulated: another tab of this browser). Every value is invented.
 * Starting state: `localStorage['autobyteus.prototype.firstRun']` = `owned` or `remote`; none = a node without an owner.
 */
definePageMeta({ layout: false });
useHead({ title: 'Set up this AutoByteus node' });

const { t } = useLocalization();
const k = (key: string) => `firstRun.${key}`;
const nodeName = 'build-server';
const NODE_ID = 'srv_bu1ldS3rv3rN0deC0deQx7Rf2Lm9PdZt4Wn';
const OPTIONS = ['tailscale', 'headscale', 'local'] as const;
const seed = typeof window === 'undefined' ? '' : localStorage.getItem('autobyteus.prototype.firstRun');
const start = seed === 'owned' ? 'owned' : seed === 'remote' ? 'remote' : 'ready';

const way = ref<(typeof OPTIONS)[number]>('tailscale');
const joinedWay = ref<(typeof OPTIONS)[number] | null>(null);
const joined = computed(() => joinedWay.value !== null);
const busy = ref(false);
const error = ref('');
const invite = ref('');
const connected = ref(false);
const address = computed(() => (joinedWay.value === 'local' ? '192.168.2.80' : '100.88.80.80'));
const networkText = computed(() => (joinedWay.value === 'tailscale' ? 'Tailscale · alex@example.com' : joinedWay.value === 'headscale' ? 'Headscale · net.example.com' : t(k('done.noNetwork'))));
const joinedText = computed(() => (joinedWay.value === 'local'
  ? t(k('join.local.done'), { address: address.value })
  : t(k('join.done'), { network: joinedWay.value === 'tailscale' ? 'Tailscale' : 'Headscale', node: nodeName, address: address.value })));

const later = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));
async function signIn(): Promise<void> {
  busy.value = true; error.value = '';
  await later(2500);
  busy.value = false; joinedWay.value = 'tailscale';
}
async function useInvite(): Promise<void> {
  busy.value = true; error.value = '';
  await later(1200);
  busy.value = false;
  let ok = false;
  try {
    const body = invite.value.trim().replace(/^abhi_/, '').replace(/-/g, '+').replace(/_/g, '/');
    const parsed = invite.value.trim().startsWith('abhi_') ? JSON.parse(atob(body + '==='.slice((body.length + 3) % 4))) : null;
    if (parsed?.expiresAt && Date.parse(parsed.expiresAt) < Date.now()) { error.value = t(k('error.inviteExpired')); return; }
    ok = Boolean(parsed?.server && parsed?.key);
  } catch { ok = false; }
  if (!ok) { error.value = t(k('error.notInvite')); return; }
  joinedWay.value = 'headscale';
}
function useLocal(): void { error.value = ''; joinedWay.value = 'local'; }
function resetJoin(): void { joinedWay.value = null; }
</script>
