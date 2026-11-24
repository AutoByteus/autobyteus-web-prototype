<template>
  <div class="relative" :data-testid="`extension-page-${extensionId}`">
    <iframe
      ref="frame"
      :title="title"
      :srcdoc="html"
      sandbox="allow-scripts"
      allow="clipboard-write"
      referrerpolicy="no-referrer"
      class="block w-full border-0 bg-transparent"
      :style="{ height: `${height}px` }"
    />
    <p v-if="!loaded" class="absolute inset-x-0 top-0 flex items-center gap-2 text-sm text-gray-500">
      <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500 motion-reduce:animate-none" aria-hidden="true" />
      {{ t('extensions.page.loading') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLocalization } from '~/composables/useLocalization';
import { EXTENSION_PAGES } from '~/prototype/extensions/extensionPages';
import { useExtensionsStore, type ExtensionId } from '~/stores/extensionsStore';

/**
 * An extension's own page (extension-contract.md §5), in a sandboxed frame without network access: an opaque origin
 * (`sandbox="allow-scripts"`, no `allow-same-origin`), so it can reach neither the node nor the AutoByteus page. AutoByteus
 * accepts messages only from this frame (`event.source`) and answers each `{ id, call, input }` with `{ id, ok, output | error }`
 * from the extension's own actions. The page's height arrives as `{ resize: { height } }` (contract §5).
 */
const props = defineProps<{ extensionId: ExtensionId; title: string }>();
const { t } = useLocalization();
const store = useExtensionsStore();
const frame = ref<HTMLIFrameElement | null>(null);
const height = ref(120);
const loaded = ref(false);
const html = computed(() => EXTENSION_PAGES[props.extensionId] ?? '');

async function onMessage(event: MessageEvent): Promise<void> {
  const own = frame.value?.contentWindow;
  if (!own || event.source !== own) return;
  const message = event.data as { id?: string; call?: string; input?: unknown; resize?: { height?: number } } | null;
  if (!message) return;
  // The page's height (contract §5): `{ resize: { height } }`, no id and no reply; AutoByteus clamps it.
  if (message.resize && typeof message.id !== 'string') {
    const next = Number(message.resize.height);
    if (Number.isFinite(next) && next > 0) { height.value = Math.min(Math.max(next, 48), 2000); loaded.value = true; }
    return;
  }
  if (typeof message.id !== 'string' || typeof message.call !== 'string') return;
  try {
    const output = await store.callAction(props.extensionId, message.call, message.input);
    own.postMessage({ id: message.id, ok: true, output: JSON.parse(JSON.stringify(output ?? null)) }, '*');
  } catch (cause) {
    own.postMessage({ id: message.id, ok: false, error: cause instanceof Error ? cause.message : String(cause) }, '*');
  }
}

onMounted(() => window.addEventListener('message', onMessage));
onBeforeUnmount(() => window.removeEventListener('message', onMessage));
</script>
