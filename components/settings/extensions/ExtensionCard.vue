<template>
  <section
    class="rounded-xl border border-gray-200 bg-white shadow-sm"
    :aria-labelledby="`extension-title-${entry.id}`"
    :data-testid="`extension-card-${entry.id}`"
  >
    <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 :id="`extension-title-${entry.id}`" class="text-lg font-semibold leading-7 text-gray-900">{{ entry.name }}</h3>
          <span class="text-sm tabular-nums text-gray-500" :data-testid="`extension-version-${entry.id}`">{{ shownVersion }}</span>
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5" :class="pill.class" :data-testid="`extension-state-${entry.id}`">
            <span v-if="pill.dot" class="h-1.5 w-1.5 rounded-full" :class="pill.dot" aria-hidden="true" />
            {{ pill.label }}
          </span>
          <span
            v-if="state.kind === 'installed' && state.updateAvailable"
            class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium leading-5 text-blue-700"
            :data-testid="`extension-update-badge-${entry.id}`"
          >{{ t('extensions.card.updateAvailable', { version: store.updateVersion }) }}</span>
        </div>
        <p class="mt-1.5 max-w-2xl text-sm leading-6 text-gray-600" lang="en">{{ entry.description }}</p>

        <!-- what the extension says now -->
        <p v-if="state.kind === 'notAvailableHere'" class="mt-3 text-sm text-gray-500" :data-testid="`extension-not-available-${entry.id}`">
          {{ t('extensions.card.notAvailable', { platform: platformLabel(store.platform), platforms: entry.platforms.map(platformLabel).join(', ') }) }}
        </p>
        <div v-else-if="state.kind === 'installing'" class="mt-3 max-w-xl" :data-testid="`extension-progress-${entry.id}`" role="status" aria-live="polite">
          <div class="flex items-center justify-between gap-3 text-sm">
            <span class="min-w-0 truncate text-gray-700" lang="en">{{ state.message }}</span>
            <span v-if="state.percent !== null" class="flex-shrink-0 tabular-nums text-gray-500">{{ state.percent }}%</span>
          </div>
          <div
            class="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            :aria-label="state.message"
            :aria-valuenow="state.percent ?? undefined"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div v-if="state.percent !== null" class="h-full rounded-full bg-blue-600 transition-[width] duration-300 motion-reduce:transition-none" :style="{ width: `${state.percent}%` }" />
            <div v-else class="ext-indeterminate h-full w-1/3 rounded-full bg-blue-600" />
          </div>
        </div>
        <div
          v-else-if="state.kind === 'failed'"
          class="mt-3 flex max-w-2xl items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-800"
          role="alert"
          :data-testid="`extension-failed-${entry.id}`"
        >
          <svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="M10 6.5v4M10 13.5v.01" stroke-linecap="round" /></svg>
          <span lang="en">{{ state.message }}</span>
        </div>
        <p
          v-else-if="state.kind === 'installed' && !['Ready.', 'Turned off.'].includes(state.message)"
          class="mt-3 flex items-center gap-2 text-sm"
          :class="state.enabled && !state.ready ? 'text-amber-800' : 'text-gray-500'"
          :data-testid="`extension-message-${entry.id}`"
          aria-live="polite"
        >
          <span v-if="state.enabled && !state.ready && starting" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600 motion-reduce:animate-none" aria-hidden="true" />
          <span lang="en">{{ state.message }}</span>
        </p>
      </div>

      <!-- the one action of this state -->
      <div class="flex flex-shrink-0 flex-wrap items-center gap-3 sm:justify-end">
        <button
          v-if="state.kind === 'notInstalled'"
          type="button"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!canManage"
          :data-testid="`extension-install-${entry.id}`"
          @click="store.install(entry.id)"
        >{{ t('extensions.card.install') }}</button>
        <button
          v-else-if="state.kind === 'failed'"
          type="button"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
          :disabled="!canManage"
          :data-testid="`extension-reinstall-${entry.id}`"
          @click="store.install(entry.id)"
        >{{ t('extensions.card.installAgain') }}</button>
        <template v-else-if="state.kind === 'installed'">
          <button
            v-if="state.updateAvailable"
            type="button"
            class="rounded-md border border-blue-200 bg-white px-3.5 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
            :disabled="!canManage"
            :data-testid="`extension-update-${entry.id}`"
            @click="store.install(entry.id, true)"
          >{{ t('extensions.card.update', { version: store.updateVersion }) }}</button>
          <div class="inline-flex items-center">
            <button
              type="button"
              role="switch"
              class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              :class="state.enabled ? 'bg-blue-600' : 'bg-slate-300'"
              :aria-checked="state.enabled"
              :aria-label="t('extensions.card.switchLabel', { name: entry.name })"
              :disabled="!canManage"
              :data-testid="`extension-switch-${entry.id}`"
              @click="toggle"
            >
              <span aria-hidden="true" class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none" :class="state.enabled ? 'translate-x-5' : 'translate-x-0.5'" />
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- the extension's page, its log and Remove -->
    <div v-if="state.kind === 'installed' || state.kind === 'failed'" class="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-3 py-2">
      <button
        v-if="state.kind === 'installed'"
        type="button"
        class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-expanded="open"
        :aria-controls="`extension-body-${entry.id}`"
        :data-testid="`extension-toggle-page-${entry.id}`"
        @click="store.togglePage(entry.id)"
      >
        <svg class="h-4 w-4 text-gray-400 transition-transform motion-reduce:transition-none" :class="open ? 'rotate-90' : ''" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        {{ open ? t('extensions.card.hideSettings') : t('extensions.card.showSettings') }}
      </button>
      <span v-else />
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :data-testid="`extension-log-${entry.id}`"
          @click="store.logFor = entry.id"
        >{{ t('extensions.card.viewLog') }}</button>
        <button
          type="button"
          class="rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60"
          :disabled="!canManage"
          :data-testid="`extension-remove-${entry.id}`"
          @click="store.removeFor = entry.id"
        >{{ t('extensions.card.remove') }}</button>
      </div>
    </div>

    <div v-if="open && state.kind === 'installed'" :id="`extension-body-${entry.id}`" class="border-t border-gray-100 px-5 py-5">
      <ExtensionPageFrame :extension-id="entry.id" :title="t('extensions.page.title', { name: entry.name })" />
      <slot name="after-page" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ExtensionPageFrame from '~/components/settings/extensions/ExtensionPageFrame.vue';
import { useLocalization } from '~/composables/useLocalization';
import { useExtensionsStore, type CatalogEntry, type ExtensionState } from '~/stores/extensionsStore';

/** The common card frame AutoByteus draws for every extension (DEC-014): name, version, state, the action of the state, log, Remove, the page. */
const props = defineProps<{ entry: CatalogEntry; state: ExtensionState; canManage: boolean }>();
const { t } = useLocalization();
const store = useExtensionsStore();

const open = computed(() => store.isPageOpen(props.entry.id));
const starting = computed(() => props.state.kind === 'installed' && /^Starting/.test(props.state.message));
const shownVersion = computed(() => (props.state.kind === 'installed' ? props.state.version : props.entry.version));

const PLATFORM_KEYS: Record<string, string> = {
  'darwin-arm64': 'macAppleSilicon', 'darwin-x64': 'macIntel', 'linux-x64': 'linuxX64', 'linux-arm64': 'linuxArm', 'win32-x64': 'windowsX64',
};
const platformLabel = (platform: string) => (PLATFORM_KEYS[platform] ? t(`extensions.platform.${PLATFORM_KEYS[platform]}`) : platform);

const pill = computed<{ label: string; class: string; dot?: string }>(() => {
  const s = props.state;
  switch (s.kind) {
    case 'notAvailableHere': return { label: t('extensions.state.notAvailable'), class: 'bg-gray-100 text-gray-600' };
    case 'notInstalled': return { label: t('extensions.state.notInstalled'), class: 'bg-gray-100 text-gray-700' };
    case 'installing': return { label: s.removing ? t('extensions.state.removing') : s.isUpdate ? t('extensions.state.updating') : t('extensions.state.installing'), class: 'bg-blue-50 text-blue-700' };
    case 'failed': return { label: t('extensions.state.failed'), class: 'bg-red-50 text-red-700', dot: 'bg-red-500' };
    case 'installed':
      if (!s.enabled) return { label: t('extensions.state.off'), class: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
      if (!s.ready) return { label: t('extensions.state.notReady'), class: 'bg-amber-50 text-amber-800', dot: 'bg-amber-500' };
      return { label: t('extensions.state.on'), class: 'bg-green-50 text-green-700', dot: 'bg-green-500' };
  }
  return { label: '', class: '' };
});

function toggle(): void {
  if (props.state.kind !== 'installed') return;
  if (props.state.enabled) void store.turnOff(props.entry.id);
  else void store.turnOn(props.entry.id);
}
</script>

<style scoped>
.ext-indeterminate { animation: ext-slide 1.4s ease-in-out infinite; }
@keyframes ext-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
@media (prefers-reduced-motion: reduce) { .ext-indeterminate { animation: none; width: 100%; opacity: 0.35; } }
</style>
