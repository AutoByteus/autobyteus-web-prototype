<template>
  <div class="mt-5 border-t border-gray-100 pt-5" data-testid="voice-microphone-panel">
    <h4 class="text-sm font-semibold text-gray-900">{{ t('extensions.voice.micTitle') }}</h4>
    <p class="mt-1 max-w-2xl text-xs leading-5 text-gray-500">{{ t('extensions.voice.micLead') }}</p>

    <div class="mt-3 max-w-md space-y-1.5">
      <div class="flex items-center justify-between gap-3">
        <label for="voice-microphone" class="text-sm font-medium text-gray-700">{{ t('extensions.voice.microphone') }}</label>
        <button
          type="button"
          class="rounded text-xs font-medium text-blue-700 transition-colors hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="phase !== 'idle'"
          data-testid="voice-microphone-refresh"
          @click="refreshDevices"
        >{{ t('extensions.voice.refresh') }}</button>
      </div>
      <select
        id="voice-microphone"
        class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
        :value="store.microphoneDeviceId ?? ''"
        :disabled="phase !== 'idle'"
        data-testid="voice-microphone-select"
        @change="store.setMicrophone(($event.target as HTMLSelectElement).value || null)"
      >
        <option value="">{{ t('extensions.voice.systemDefault', { name: DEVICES[0]!.label }) }}</option>
        <option v-for="device in DEVICES" :key="device.id" :value="device.id">{{ device.label }}</option>
      </select>
      <p class="text-xs text-gray-500">{{ t('extensions.voice.deviceCount', { count: DEVICES.length }) }}</p>
    </div>

    <div class="mt-4 max-w-2xl space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4" data-testid="voice-test-panel">
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-medium text-gray-900">{{ t('extensions.voice.testTitle') }}</p>
          <p class="text-xs text-gray-600">{{ t('extensions.voice.testLead') }}</p>
        </div>
        <button
          type="button"
          class="min-w-[7.5rem] self-start rounded-md px-3 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          :class="phase === 'recording' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
          :disabled="!usable || phase === 'starting' || phase === 'transcribing'"
          :aria-busy="phase === 'starting' ? 'true' : undefined"
          data-testid="voice-test-button"
          @click="toggleTest"
        >{{ phase === 'recording' ? t('extensions.voice.stopTest') : phase === 'starting' ? t('extensions.voice.starting') : t('extensions.voice.startTest') }}</button>
      </div>

      <p v-if="!usable" class="text-xs text-amber-700" data-testid="voice-test-off">{{ t('extensions.voice.turnOnToTest') }}</p>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-medium text-gray-600">
          <span>{{ t('extensions.voice.inputLevel') }}</span>
          <span class="tabular-nums">{{ Math.round(level * 100) }}%</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-gray-200">
          <div class="h-full rounded-full bg-blue-500 transition-all duration-150 motion-reduce:transition-none" :style="{ width: `${Math.round(level * 100)}%` }" />
        </div>
      </div>

      <div v-if="phase === 'recording' || phase === 'transcribing'" class="rounded-lg border px-3 py-2 text-sm" :class="phase === 'recording' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-800'" role="status">
        <template v-if="phase === 'recording'">{{ t('extensions.voice.recording') }}</template>
        <template v-else>
          <span class="inline-flex items-center gap-2">
            <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700 motion-reduce:animate-none" aria-hidden="true" />
            {{ t('extensions.voice.transcribing') }}
          </span>
          <span v-if="slow" class="mt-1 block text-xs text-blue-700" data-testid="voice-test-slow-note">{{ t('extensions.voice.firstNote') }}</span>
        </template>
      </div>

      <div v-if="result" class="space-y-2 rounded-lg border border-gray-200 bg-white px-3 py-3" data-testid="voice-test-result">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-gray-900">{{ t('extensions.voice.lastResult') }}</p>
          <span class="rounded-full bg-green-50 px-2 py-0.5 text-[0.6875rem] font-medium text-green-700">{{ t('extensions.voice.transcriptReady') }}</span>
        </div>
        <p class="text-sm text-gray-800">{{ result.text }}</p>
        <div class="flex gap-6 text-xs text-gray-600">
          <span>{{ t('extensions.voice.duration', { value: result.duration }) }}</span>
          <span>{{ t('extensions.voice.detected', { value: result.language }) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { useLocalization } from '~/composables/useLocalization';
import { useExtensionsStore } from '~/stores/extensionsStore';

/**
 * Voice Input's microphone connection point, drawn by AutoByteus under the extension's page (extension-contract.md:
 * "the microphone stays with AutoByteus"): this computer's microphone choice and the Test recording. Design: the
 * microphones are invented and the capture and transcription are scripted (no microphone is opened).
 */
const props = defineProps<{ usable: boolean }>();
const { t } = useLocalization();
const store = useExtensionsStore();

const DEVICES = [
  { id: 'mic-built-in', label: 'Built-in Microphone' },
  { id: 'mic-usb', label: 'USB Studio Microphone' },
  { id: 'mic-headset', label: 'Wireless Headset' },
];

type Phase = 'idle' | 'starting' | 'recording' | 'transcribing';
const phase = ref<Phase>('idle');
const level = ref(0);
const result = ref<{ text: string; duration: string; language: string } | null>(null);
/**
 * When the voice program is not running yet (first use after the app starts, after turning on, install or update), the
 * transcription waits while it starts; its length varies (up to ~30 s measured). The note appears once a transcription has
 * waited longer than about 2 s, not by prediction. Scripted here: the first test after Voice Input starts waits 5 s.
 */
const firstAfterStart = ref(true);
const slow = ref(false);
let slowTimer: ReturnType<typeof setTimeout> | null = null;
let levelTimer: ReturnType<typeof setInterval> | null = null;
let startedAt = 0;

watch(() => props.usable, (usable, before) => { if (usable && !before) firstAfterStart.value = true; });

function refreshDevices(): void { /* the list is invented */ }

async function toggleTest(): Promise<void> {
  if (phase.value === 'recording') return stopTest();
  result.value = null;
  phase.value = 'starting';
  await new Promise((done) => setTimeout(done, 600));
  phase.value = 'recording';
  startedAt = Date.now();
  levelTimer = setInterval(() => { level.value = 0.15 + Math.random() * 0.55; }, 120);
}

async function stopTest(): Promise<void> {
  if (levelTimer) clearInterval(levelTimer);
  levelTimer = null;
  level.value = 0;
  const seconds = Math.max(1, (Date.now() - startedAt) / 1000);
  phase.value = 'transcribing';
  slow.value = false;
  slowTimer = setTimeout(() => { slow.value = true; }, 2000);
  await new Promise((done) => setTimeout(done, firstAfterStart.value ? 5000 : 1200));
  if (slowTimer) clearTimeout(slowTimer);
  slow.value = false;
  firstAfterStart.value = false;
  phase.value = 'idle';
  result.value = { text: 'Testing the microphone before I dictate my next task.', duration: t('extensions.voice.seconds', { value: seconds.toFixed(1) }), language: t('extensions.voice.english') };
}

onBeforeUnmount(() => { if (levelTimer) clearInterval(levelTimer); if (slowTimer) clearTimeout(slowTimer); });
</script>
