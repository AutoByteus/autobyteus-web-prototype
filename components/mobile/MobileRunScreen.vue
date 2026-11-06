<template>
  <section class="fixed inset-0 flex h-[100dvh] flex-col bg-white text-slate-900" data-testid="mobile-run-screen">
    <header class="relative flex h-14 flex-shrink-0 items-center border-b border-slate-200 bg-white pl-1 pr-1">
      <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Back to runs" data-testid="mobile-run-back" @click="$emit('back')">
        <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-xl px-2 text-left active:bg-slate-100"
        :aria-label="`${node.name}. Show the runs around this one`"
        data-testid="mobile-run-title"
        @click="treeOpen = path.length > 1 || Boolean(node.children?.length)"
      >
        <span class="h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="dotClass" aria-hidden="true" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-base font-semibold leading-5">{{ node.name }}</span>
          <span class="flex items-center gap-1.5">
            <RemoteNodeChip v-if="node.node" :node-name="node.node" />
            <span class="min-w-0 truncate text-xs leading-4 text-slate-500" data-testid="mobile-run-subtitle">{{ subtitle }}</span>
          </span>
        </span>
        <Icon v-if="path.length > 1 || node.children?.length" icon="heroicons:chevron-down-20-solid" class="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100"
        aria-label="More"
        aria-haspopup="menu"
        :aria-expanded="menuOpen"
        data-testid="mobile-run-menu-button"
        @click="menuOpen = !menuOpen"
      >
        <svg viewBox="0 0 20 20" class="h-6 w-6" fill="currentColor" aria-hidden="true"><circle cx="10" cy="4" r="1.6" /><circle cx="10" cy="10" r="1.6" /><circle cx="10" cy="16" r="1.6" /></svg>
      </button>
      <template v-if="menuOpen">
        <button type="button" class="fixed inset-0 z-20 cursor-default" aria-label="Close menu" @click="menuOpen = false" />
        <div class="absolute right-2 top-12 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg" role="menu" data-testid="mobile-run-menu">
          <button type="button" role="menuitem" class="flex h-12 w-full items-center gap-3 px-4 text-left text-[0.9375rem] text-slate-800 active:bg-slate-100" data-testid="mobile-run-menu-results" @click="menuOpen = false; $emit('open-results')">
            <svg viewBox="0 0 20 20" class="h-5 w-5 text-slate-500" fill="currentColor" aria-hidden="true"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h3.19a1.5 1.5 0 0 1 1.06.44l.81.81c.28.28.66.44 1.06.44H15.5A1.5 1.5 0 0 1 17 5.19V15.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11Z" /></svg>
            Results
          </button>
          <button v-if="delegator" type="button" role="menuitem" class="flex h-12 w-full items-center gap-3 px-4 text-left text-[0.9375rem] text-slate-800 active:bg-slate-100" data-testid="mobile-run-menu-up" @click="menuOpen = false; $emit('open', delegator)">
            <Icon icon="heroicons:arrow-up-20-solid" class="h-5 w-5 text-slate-500" aria-hidden="true" />
            <span class="min-w-0 truncate">Back to {{ delegator.name }}</span>
          </button>
        </div>
      </template>
    </header>


    <div v-if="unreachable" class="min-h-0 flex-1 overflow-y-auto" data-testid="mobile-run-unreachable">
      <RemoteRunNotice :node-name="node.node ?? ''" @retry="$emit('retry-node')" />
    </div>
    <MobileChat v-else :context="context" class="min-h-0 flex-1" />

    <Teleport to="body">
      <MobileRunTreeSheet v-if="treeOpen" :node="node" @close="treeOpen = false" @open="onTreeOpen" />
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import MobileChat from '~/components/mobile/MobileChat.vue'
import MobileRunTreeSheet from '~/components/mobile/MobileRunTreeSheet.vue'
import RemoteNodeChip from '~/components/workspace/remote/RemoteNodeChip.vue'
import RemoteRunNotice from '~/components/workspace/remote/RemoteRunNotice.vue'
import type { MobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'
import type { MobileWorkContext } from '~/types/mobileWork'
import { agentStatusDotClass } from '~/utils/workspaceStatusDotPresentation'

const props = defineProps<{ node: MobileRunNode; context: MobileWorkContext | null }>()
const emit = defineEmits<{
  (event: 'back'): void
  (event: 'open', node: MobileRunNode): void
  (event: 'open-results'): void
  (event: 'retry-node'): void
}>()

const store = useMobileRunTreeStore()
const treeOpen = ref(false)
const menuOpen = ref(false)
const unreachable = computed(() => !store.isNodeReachable(props.node.node))
const dotClass = computed(() => agentStatusDotClass(unreachable.value ? 'error' : props.node.status))
const path = computed(() => store.pathTo(props.node.id))
/** The nearest run above that is an agent: the one that delegated this work (a team or Org is skipped). */
const delegator = computed(() => [...path.value].slice(0, -1).reverse().find((item) => item.kind === 'agent') ?? null)
const STATUS_LABEL: Record<string, string> = { running: 'Running', idle: 'Idle', initializing: 'Starting', error: 'Error', offline: 'Stopped' }
const subtitle = computed(() => {
  if (unreachable.value) return 'Not reachable'
  const above = path.value.slice(0, -1)
  if (!above.length) return STATUS_LABEL[props.node.status] ?? ''
  return `${STATUS_LABEL[props.node.status] ?? ''} · in ${above[above.length - 1].name}`
})

function onTreeOpen(next: MobileRunNode): void {
  treeOpen.value = false
  emit('open', next)
}
</script>
