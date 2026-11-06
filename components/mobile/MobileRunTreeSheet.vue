<template>
  <div class="fixed inset-0 z-40 flex flex-col justify-end" data-testid="mobile-run-tree-sheet">
    <button type="button" class="absolute inset-0 bg-slate-900/40" aria-label="Close" @click="$emit('close')" />
    <section class="relative flex max-h-[80dvh] flex-col rounded-t-2xl bg-white shadow-xl" role="dialog" aria-modal="true" :aria-label="`Runs in ${root?.name ?? ''}`">
      <div class="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
      <header class="flex h-14 flex-shrink-0 items-center justify-between pl-4 pr-2">
        <h2 class="truncate text-base font-semibold">{{ root?.name }}</h2>
        <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full text-slate-500 active:bg-slate-100" aria-label="Close" @click="$emit('close')">
          <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
        </button>
      </header>
      <ul v-if="root" role="tree" class="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-slate-100 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <MobileRunRow :node="root" :depth="0" :selected-id="node.id" @open="$emit('open', $event)" />
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import MobileRunRow from '~/components/mobile/MobileRunRow.vue'
import type { MobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'

const props = defineProps<{ node: MobileRunNode }>()
defineEmits<{ (event: 'close'): void; (event: 'open', node: MobileRunNode): void }>()
const store = useMobileRunTreeStore()
const root = computed(() => store.rootOf(props.node.id))
</script>
