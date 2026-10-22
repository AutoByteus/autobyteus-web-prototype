<template>
  <form class="border-b border-slate-200 bg-slate-50/70 px-5 py-4" data-testid="add-node-panel" @submit.prevent="submit">
    <h4 class="text-sm font-semibold text-slate-900">{{ t(k('add.title')) }}</h4>
    <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-700">{{ t(k('add.address')) }}</span>
        <input
          ref="addressInput"
          v-model="draft.address"
          type="text"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :class="errors.address ? 'border-red-300' : ''"
          :placeholder="t(k('add.addressPlaceholder'))"
          :aria-invalid="Boolean(errors.address)"
          data-testid="add-node-address"
        >
        <span v-if="errors.address" class="mt-1 block text-sm text-red-600" role="alert" data-testid="add-node-address-error">{{ errors.address }}</span>
      </label>
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-700">{{ t(k('add.name')) }}</span>
        <input
          v-model="draft.name"
          type="text"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :class="errors.name ? 'border-red-300' : ''"
          :placeholder="t(k('add.namePlaceholder'))"
          :aria-invalid="Boolean(errors.name)"
          data-testid="add-node-name"
        >
        <span v-if="errors.name" class="mt-1 block text-sm text-red-600" role="alert" data-testid="add-node-name-error">{{ errors.name }}</span>
      </label>
    </div>

    <label class="mt-3 flex items-start gap-2.5">
      <input v-model="draft.collaborate" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" data-testid="add-node-collaborate">
      <span>
        <span class="block text-sm font-medium text-slate-800">{{ t(k('add.collaborate')) }}</span>
        <span class="block text-xs text-slate-500">{{ t(k('add.collaborateHint')) }}</span>
      </span>
    </label>

    <p v-if="duplicate" class="mt-3 text-sm text-blue-700" role="status" data-testid="add-node-duplicate">ⓘ {{ t(k('add.duplicate'), { name: duplicate }) }}</p>

    <div class="mt-4 flex items-center justify-end gap-2">
      <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="add-node-cancel" @click="emit('close')">{{ t(k('add.cancel')) }}</button>
      <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50" :disabled="busy" data-testid="add-node-submit">
        {{ busy ? t(k('add.checking')) : t(k('add.submit')) }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useNodeText } from '~/composables/useNodeText'
import { useNodeListStore } from '~/stores/nodeListStore'

const emit = defineEmits<{ close: [] }>()
const { t, k } = useNodeText()
const store = useNodeListStore()

const draft = reactive({ address: '', name: '', collaborate: false })
const errors = reactive({ address: '', name: '' })
const duplicate = ref('')
const busy = ref(false)
const addressInput = ref<HTMLInputElement | null>(null)

onMounted(async () => { await nextTick(); addressInput.value?.focus() })

const submit = async (): Promise<void> => {
  if (busy.value) return
  errors.address = ''
  errors.name = ''
  duplicate.value = ''
  busy.value = true
  const result = await store.addNode({ address: draft.address, name: draft.name, collaborate: draft.collaborate })
  busy.value = false
  if (result.ok) return emit('close')
  if (result.error === 'address') errors.address = t(k('add.errorAddress'))
  else if (result.error === 'name') errors.name = t(k('add.errorName'))
  else duplicate.value = result.existing ?? ''
}
</script>
