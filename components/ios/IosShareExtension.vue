<template>
  <!-- ios-demo-mode-279 (D6): the iOS share extension's own screen, as iOS shows it over the app the user shares from
       (another app's share sheet › AutoByteus). It keeps the shared text for the app and says what opening the app does. -->
  <main class="fixed inset-0 flex flex-col justify-end bg-slate-900/40" data-testid="ios-share-extension">
    <section class="mx-auto w-full rounded-t-2xl bg-white pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl md:mb-6 md:max-w-lg md:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="ios-share-title">
      <div class="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" aria-hidden="true" />
      <header class="flex h-14 items-center gap-2.5 px-4">
        <img src="/autobyteus-icon.svg" alt="" class="h-7 w-7" aria-hidden="true" />
        <h1 id="ios-share-title" class="text-lg font-semibold text-slate-900">AutoByteus</h1>
      </header>
      <div class="px-4">
        <p v-if="kind !== 'empty'" class="truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-[0.8125rem] text-slate-700" data-testid="ios-share-preview">{{ shared }}</p>
        <p class="mt-3 text-[0.9375rem] leading-6 text-slate-600" role="status" data-testid="ios-share-message">{{ message }}</p>
        <button type="button" class="mt-5 h-12 w-full rounded-xl bg-blue-600 text-[0.9375rem] font-semibold text-white active:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-testid="ios-share-done" @click="done">Done</button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { keepSharedText, sharedKindOf } from '~/prototype/ios-demo/iosDemo'

const route = useRoute()
/** What the other app shared (text or a link). The design route stands in for that other app's share sheet. */
const shared = computed(() => String(route.query.text ?? '').trim())
const kind = computed(() => sharedKindOf(shared.value))
const MESSAGES = {
  pairing: 'Saved. Open AutoByteus to connect.',
  demo: 'Saved. Open AutoByteus to see the demo.',
  text: 'Saved. Open AutoByteus to use it as an address.',
  empty: 'AutoByteus couldn’t read text or a link from this share.',
} as const
const message = computed(() => MESSAGES[kind.value])

onMounted(() => { if (kind.value !== 'empty') keepSharedText(shared.value) })
/** Done closes the extension; the user is back in the app they shared from (here: the iOS app's first screen). */
function done(): void { window.location.assign('/ios') }
</script>
