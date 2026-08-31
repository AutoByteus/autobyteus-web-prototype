<template>
  <div class="bg-white" :data-test="`org-placement-${placementKey}`">
    <button
      type="button"
      class="flex w-full min-w-0 items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
      :aria-expanded="expanded"
      @click="emit('toggle')"
    >
      <span
        class="inline-flex h-8 w-8 flex-none items-center justify-center"
        :class="kind === 'team' ? 'rounded-md bg-blue-50 text-blue-700' : 'rounded-full bg-slate-100 text-slate-600'"
      >
        <Icon :icon="kind === 'team' ? 'heroicons:user-group-20-solid' : 'heroicons:user-20-solid'" class="h-4 w-4" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span class="truncate text-sm font-semibold text-slate-800">{{ name }}</span>
          <span v-if="kind === 'team'" class="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-blue-700">Team</span>
          <span v-if="hasOverride" class="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Custom</span>
        </span>
        <span class="mt-0.5 block truncate font-mono text-xs text-slate-500" :title="address">{{ address }}</span>
        <span v-if="detail" class="mt-0.5 block truncate text-xs text-slate-500">{{ detail }}</span>
      </span>
      <Icon icon="heroicons:chevron-down-20-solid" class="h-4 w-4 flex-none text-slate-400 transition-transform" :class="expanded ? '' : '-rotate-90'" />
    </button>

    <div v-if="expanded" class="border-t border-slate-100 bg-slate-50 p-3">
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <MemberOverrideItem
          :member-name="name"
          :member-address="address"
          :member-breadcrumb="address.split('/').filter(Boolean).join(' / ')"
          :override="override"
          :global-runtime-kind="globalRuntimeKind"
          :global-llm-model="globalLlmModel"
          :global-llm-config="globalLlmConfig"
          :disabled="false"
          @update:override="(_, value) => emit('update:override', value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import MemberOverrideItem from '~/components/workspace/config/MemberOverrideItem.vue';
import type { MemberConfigOverride } from '~/types/agent/TeamRunConfig';
import { hasMeaningfulMemberOverride } from '~/utils/teamRunConfigUtils';

const props = defineProps<{
  placementKey: string
  kind: 'agent' | 'team'
  name: string
  address: string
  detail?: string
  expanded: boolean
  override?: MemberConfigOverride
  globalRuntimeKind: string
  globalLlmModel: string
  globalLlmConfig?: Record<string, unknown> | null
}>();

const emit = defineEmits<{
  (event: 'toggle'): void
  (event: 'update:override', value: MemberConfigOverride | null): void
}>();

const hasOverride = computed(() => hasMeaningfulMemberOverride(props.override));
</script>
