<template>
  <li role="none" :data-testid="`mobile-run-item-${node.id}`">
    <div
      class="flex items-stretch"
      :class="isSelected ? 'bg-blue-50' : ''"
      role="treeitem"
      :aria-level="depth + 1"
      :aria-expanded="hasChildren ? expanded : undefined"
      :aria-current="isSelected ? 'true' : undefined"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-start gap-3 text-left active:bg-slate-100"
        :class="[depth === 0 ? 'min-h-[4rem] py-3 pl-4' : 'min-h-[3.5rem] py-2.5 pl-2', hasChildren ? 'pr-0' : 'pr-4']"
        :aria-label="accessibleLabel"
        data-testid="mobile-run-open"
        @click="$emit('open', node)"
      >
        <span class="relative mt-0.5 flex-shrink-0" aria-hidden="true">
          <span
            class="flex items-center justify-center font-semibold text-slate-600"
            :class="[
              depth === 0 ? 'h-9 w-9 text-xs' : 'h-7 w-7 text-[0.6875rem]',
              node.kind === 'org' ? 'rounded-lg bg-slate-100' : 'rounded-full bg-slate-200',
              node.kind === 'team' || node.kind === 'org' ? '!bg-slate-100 text-slate-500' : '',
            ]"
          >
            <Icon v-if="node.kind === 'team'" icon="heroicons:user-group-20-solid" :class="depth === 0 ? 'h-5 w-5' : 'h-4 w-4'" />
            <Icon v-else-if="node.kind === 'org'" icon="heroicons:building-office-2-20-solid" :class="depth === 0 ? 'h-5 w-5' : 'h-4 w-4'" />
            <template v-else>{{ initials }}</template>
          </span>
          <span
            class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2"
            :class="[dotClass, isSelected ? 'ring-blue-50' : 'ring-white']"
            data-testid="mobile-run-status-dot"
          />
        </span>
        <span class="min-w-0 flex-1">
          <span class="flex items-center gap-1.5">
            <span class="truncate text-[0.9375rem] leading-5" :class="node.kind === 'agent' || node.kind === 'member' ? 'font-medium text-slate-900' : 'font-semibold text-slate-900'">{{ node.name }}</span>
          </span>
          <span class="block truncate text-[0.8125rem] leading-[1.125rem] text-slate-500">{{ node.summary }}</span>
          <span v-if="node.node" class="mt-1 flex items-center gap-2" data-testid="mobile-run-remote-line">
            <RemoteNodeChip :node-name="node.node" />
            <span
              v-if="unreachable"
              class="min-w-0 truncate text-xs font-medium text-red-700"
              role="alert"
              data-testid="mobile-run-unreachable"
            >Not reachable</span>
          </span>
          <span
            v-if="node.needsYou && !unreachable"
            class="mt-0.5 flex items-center gap-1 text-xs font-semibold text-amber-700"
            data-testid="mobile-run-needs-you"
          ><span class="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />{{ node.needsYou }}</span>
        </span>
        <span v-if="depth === 0" class="mt-0.5 flex-shrink-0 text-xs text-slate-400" data-testid="mobile-run-age">{{ age }}</span>
      </button>
      <button
        v-if="hasChildren"
        type="button"
        class="relative flex h-12 w-12 flex-shrink-0 items-center justify-center gap-0.5 self-center text-slate-400 active:bg-slate-100"
        :class="depth === 0 ? '' : 'mr-1'"
        :aria-expanded="expanded"
        :aria-label="`${expanded ? 'Hide' : 'Show'} ${disclosureNoun} of ${node.name}`"
        data-testid="mobile-run-toggle"
        @click="store.toggle(node)"
      >
        <span v-if="!expanded" class="text-xs font-semibold text-slate-500">{{ node.children?.length }}</span>
        <span v-if="!expanded && hiddenNeedsYou" class="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" aria-hidden="true" />
        <Icon icon="heroicons:chevron-down-20-solid" class="h-5 w-5 transition-transform" :class="expanded ? 'rotate-0' : '-rotate-90'" aria-hidden="true" />
      </button>
    </div>
    <ul
      v-if="hasChildren && expanded"
      role="group"
      class="border-l border-slate-200"
      :class="depth === 0 ? 'ml-[2.125rem]' : 'ml-5'"
    >
      <MobileRunRow
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        @open="$emit('open', $event)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import RemoteNodeChip from '~/components/workspace/remote/RemoteNodeChip.vue'
import type { MobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'
import { agentStatusDotClass } from '~/utils/workspaceStatusDotPresentation'

defineOptions({ name: 'MobileRunRow' })
const props = defineProps<{ node: MobileRunNode; depth: number; selectedId?: string | null }>()
defineEmits<{ (event: 'open', node: MobileRunNode): void }>()

const store = useMobileRunTreeStore()
const hasChildren = computed(() => Boolean(props.node.children?.length))
const expanded = computed(() => store.isExpanded(props.node))
const isSelected = computed(() => props.selectedId === props.node.id)
const unreachable = computed(() => !store.isNodeReachable(props.node.node))
const hiddenNeedsYou = computed(() => store.needsYouBelow(props.node) > 0)
const disclosureNoun = computed(() => (props.node.kind === 'team' || props.node.kind === 'org' ? 'members' : 'delegated work'))
const dotClass = computed(() => agentStatusDotClass(unreachable.value ? 'error' : props.node.status))
const initials = computed(() => props.node.name.replace(/_/g, ' ').split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase()).join(''))
const age = computed(() => {
  const minutes = props.node.minutes
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h`
  if (minutes < 7 * 24 * 60) return `${Math.floor(minutes / (24 * 60))}d`
  return `${Math.floor(minutes / (7 * 24 * 60))}w`
})
const accessibleLabel = computed(() => [props.node.name, props.node.summary, props.node.node ? `on ${props.node.node}` : '', props.node.needsYou ?? '', props.node.status].filter(Boolean).join(', '))
</script>
