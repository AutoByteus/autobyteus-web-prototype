<template>
  <div data-testid="node-code-panel">
    <button
      v-if="!made"
      type="button"
      class="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
      :disabled="busy"
      data-testid="node-code-make"
      @click="make"
    >
      <span v-if="busy" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />
      {{ busy ? t(k('making')) : t(k('make')) }}
    </button>

    <div v-else class="rounded-xl border border-slate-200 bg-slate-50 p-4" :class="expired ? 'opacity-90' : ''" data-testid="node-code">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
        <img :src="made.qr" :alt="t(k('qrAlt'))" class="h-[132px] w-[132px] flex-none rounded-md border border-slate-200 bg-white p-1" :class="expired || used ? 'opacity-30' : ''">
        <div class="min-w-0">
          <h4 class="text-sm font-semibold text-slate-900">{{ t(k('title'), { node: nodeName }) }}</h4>
          <p class="mt-1 text-[13px] leading-[18px] text-slate-600">{{ t(k('where')) }}</p>
          <p class="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] leading-[18px] text-amber-900">
            <NodeNoticeIcon class="mt-0.5" tone="warn" />{{ t(k('secret')) }}
          </p>
          <p class="mt-2 text-xs tabular-nums" :class="used ? 'text-emerald-700' : 'text-slate-600'" aria-live="polite" data-testid="node-code-state">
            {{ used ? t(k('used')) : expired ? t(k('expired')) : t(k('expires'), { time: left }) }}
          </p>
        </div>
      </div>
      <textarea
        readonly
        rows="4"
        class="mt-3 w-full resize-none break-all rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs leading-[18px] text-slate-700"
        :class="expired || used ? 'opacity-40' : ''"
        :aria-label="t(k('label'))"
        :value="made.text"
        data-testid="node-code-text"
        @focus="($event.target as HTMLTextAreaElement).select()"
      />
      <div class="mt-3 flex flex-wrap gap-2">
        <button v-if="expired || used" type="button" class="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="make">{{ t(k('again')) }}</button>
        <button v-else type="button" class="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-testid="node-code-copy" @click="copy">{{ copied ? t(k('copied')) : t(k('copy')) }}</button>
        <button v-if="closable" type="button" class="h-9 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="close">{{ t(k('done')) }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import NodeNoticeIcon from '~/components/settings/nodes/NodeNoticeIcon.vue'
import { useLocalization } from '~/composables/useLocalization'
import { isNodeCodeUsed, makeNodeCode } from '~/prototype/nodes/nodeCode'
import { toQrCodeDataUrl } from '~/services/qr/qrCodeDataUrlService'

/**
 * extensions-ui-516 (design, pairing-contract §6a): the node code, made on the node itself, shown with its QR, Copy, the
 * expiry and the password warning. It notices when a desktop used it (in this design: another tab of the same browser).
 */
const props = withDefaults(defineProps<{ nodeId: string; address: string; nodeName: string; closable?: boolean }>(), { closable: true })
const emit = defineEmits<{ used: [] }>()
const { t } = useLocalization()
const k = (key: string) => `nodes.nodeCode.${key}`

const made = ref<{ text: string; qr: string; setupCode: string; expiresAt: number } | null>(null)
const busy = ref(false)
const copied = ref(false)
const now = ref(Date.now())
const used = ref(false)
let ticker: ReturnType<typeof setInterval> | null = null

const expired = computed(() => Boolean(made.value) && now.value >= made.value!.expiresAt)
const left = computed(() => {
  const ms = Math.max(0, (made.value?.expiresAt ?? 0) - now.value)
  return `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`
})

async function make(): Promise<void> {
  busy.value = true
  used.value = false
  await new Promise((done) => setTimeout(done, 500))
  const { text, code } = makeNodeCode(props.nodeId, props.address.includes(':') ? props.address : `${props.address}:29695`)
  made.value = { text, qr: await toQrCodeDataUrl(text), setupCode: code.setupCode, expiresAt: Date.parse(code.expiresAt) }
  busy.value = false
  if (ticker) clearInterval(ticker)
  ticker = setInterval(() => {
    now.value = Date.now()
    if (made.value && !used.value && isNodeCodeUsed(made.value.setupCode)) { used.value = true; emit('used') }
  }, 1000)
}
async function copy(): Promise<void> {
  try { await navigator.clipboard.writeText(made.value?.text ?? '') } catch { /* select-and-copy stays possible */ }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
function close(): void { made.value = null; if (ticker) clearInterval(ticker); ticker = null }
onBeforeUnmount(() => { if (ticker) clearInterval(ticker) })
</script>
