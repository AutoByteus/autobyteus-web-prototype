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

      <section v-else-if="phase !== 'done'" class="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="px-6 pb-5 pt-6">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t(k('eyebrow')) }}</p>
          <h1 class="mt-1 text-xl font-semibold text-slate-900">{{ t(k('title'), { node: nodeName }) }}</h1>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ t(k('lead')) }}</p>
        </div>

        <form class="border-t border-slate-100 px-6 py-5" @submit.prevent="connect">
          <label for="first-run-code" class="text-sm font-medium text-slate-900">{{ t(k('codeLabel')) }}</label>
          <p class="mt-0.5 text-sm text-slate-500">{{ t(k('codeHelp')) }}</p>
          <textarea
            id="first-run-code"
            v-model="code"
            rows="4"
            spellcheck="false"
            autocomplete="off"
            class="mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs leading-5 text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
            :placeholder="'abpn_…'"
            :disabled="phase === 'running'"
            :aria-invalid="Boolean(error)"
            :aria-describedby="error ? 'first-run-error' : undefined"
            data-testid="first-run-code"
          />
          <p v-if="error" id="first-run-error" class="mt-2 flex items-start gap-2 text-sm text-red-700" role="alert" data-testid="first-run-error">
            <svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="M10 6.5v4M10 13.5v.01" stroke-linecap="round" /></svg>
            {{ error }}
          </p>

          <ol v-if="phase === 'running'" class="mt-4 space-y-2" data-testid="first-run-steps" aria-live="polite">
            <li v-for="step in steps" :key="step.id" class="flex items-start gap-2.5 text-sm">
              <span class="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center text-xs" :class="step.status === 'done' ? 'text-emerald-600' : step.status === 'failed' ? 'text-red-600' : 'text-slate-400'">
                <span v-if="step.status === 'running'" class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />
                <template v-else>{{ step.status === 'done' ? '✓' : step.status === 'failed' ? '✕' : '○' }}</template>
              </span>
              <span :class="step.status === 'pending' ? 'text-slate-500' : 'text-slate-800'">{{ step.text }}</span>
            </li>
          </ol>

          <div class="mt-5 flex items-center justify-end">
            <button
              type="submit"
              class="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="phase === 'running' || !code.trim()"
              data-testid="first-run-connect"
            >
              <span v-if="phase === 'running'" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />
              {{ phase === 'running' ? t(k('connecting')) : t(k('connect')) }}
            </button>
          </div>
        </form>

        <p class="border-t border-slate-100 px-6 py-4 text-xs leading-5 text-slate-500">{{ t(k('note')) }}</p>
      </section>

      <section v-else class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" data-testid="first-run-done" role="status">
        <div class="flex items-start gap-3">
          <span class="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 10.5 3.2 3.2L15 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <div>
            <h1 class="text-xl font-semibold text-slate-900">{{ t(k('done.title'), { node: nodeName }) }}</h1>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ t(k('done.text'), { node: nodeName, owner: ownerName }) }}</p>
          </div>
        </div>
        <dl class="mt-5 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <dt class="text-slate-500">{{ t(k('done.network')) }}</dt><dd class="text-slate-900">Tailscale · alex@example.com</dd>
          <dt class="text-slate-500">{{ t(k('done.address')) }}</dt><dd class="font-mono text-slate-900">100.88.80.80</dd>
          <dt class="text-slate-500">{{ t(k('done.owner')) }}</dt><dd class="text-slate-900">{{ ownerName }}</dd>
        </dl>
        <p class="mt-4 text-sm text-slate-500">{{ t(k('done.close')) }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLocalization } from '~/composables/useLocalization';

/**
 * extensions-ui-516 (design route, Part B): the first-run page of a brand-new node, opened in a browser on that machine
 * itself while the node has no owner (pairing-contract.md §6). In the product the node serves it at its own address and
 * accepts a code only from loopback. Here every step is scripted: nothing joins and nothing pairs.
 * Starting state: `localStorage['autobyteus.prototype.firstRun']` = `owned` (the node has an owner) or `remote` (opened from
 * another computer); none = a node without an owner, on its own computer.
 */
definePageMeta({ layout: false });
useHead({ title: 'Set up this AutoByteus node' });

const { t } = useLocalization();
const k = (key: string) => `firstRun.${key}`;
const nodeName = 'linux-box';
const start = (typeof window === 'undefined' ? 'ready' : localStorage.getItem('autobyteus.prototype.firstRun')) === 'owned' ? 'owned'
  : (typeof window === 'undefined' ? '' : localStorage.getItem('autobyteus.prototype.firstRun')) === 'remote' ? 'remote' : 'ready';

type Status = 'pending' | 'running' | 'done' | 'failed';
const code = ref('');
const error = ref('');
const phase = ref<'idle' | 'running' | 'done'>('idle');
const ownerName = ref('home-mac');
const ownerAddress = ref('');
const statuses = ref<Status[]>(['pending', 'pending', 'pending', 'pending']);
const steps = computed(() => [
  { id: 'check', text: t(k('step.check')) },
  { id: 'join', text: t(k('step.join')) },
  { id: 'pair', text: t(k('step.pair'), { address: ownerAddress.value || '…' }) },
  { id: 'own', text: t(k('step.own')) },
].map((step, index) => ({ ...step, status: statuses.value[index]! })));

const later = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));
function decode(text: string): { owner?: string; expiresAt?: string } | null {
  try {
    const body = text.trim().replace(/^abpn_/, '').replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(body + '==='.slice((body.length + 3) % 4)));
  } catch { return null; }
}

async function connect(): Promise<void> {
  error.value = '';
  statuses.value = ['running', 'pending', 'pending', 'pending'];
  phase.value = 'running';
  await later(700);
  const text = code.value.trim();
  const payload = text.startsWith('abpn_') ? decode(text) : null;
  if (!payload?.owner) { fail(0, t(k('error.notCode'))); return; }
  ownerAddress.value = payload.owner.replace(/:\d+$/, '');
  // The expiry is checked before joining (pairing-contract.md §6, probe finding).
  if (payload.expiresAt && Date.parse(payload.expiresAt) < Date.now()) { fail(0, t(k('error.expired'))); return; }
  statuses.value = ['done', 'running', 'pending', 'pending'];
  await later(1800);
  statuses.value = ['done', 'done', 'running', 'pending'];
  await later(2200);
  statuses.value = ['done', 'done', 'done', 'running'];
  await later(900);
  statuses.value = ['done', 'done', 'done', 'done'];
  await later(400);
  phase.value = 'done';
}
function fail(index: number, message: string): void {
  const next = [...statuses.value];
  next[index] = 'failed';
  statuses.value = next;
  error.value = message;
  phase.value = 'idle';
}
</script>
