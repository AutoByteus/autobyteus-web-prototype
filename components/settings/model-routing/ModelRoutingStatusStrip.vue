<template>
  <!-- One quiet line under the title: whether Model Routing is on, and the router's state. -->
  <p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm" role="status" data-testid="model-routing-status" :data-status="status.kind">
    <span class="inline-block h-2 w-2 flex-shrink-0 rounded-full" :class="dot" aria-hidden="true"></span>
    <span class="font-medium" :class="status.kind === 'active' || status.kind === 'off' ? 'text-gray-800' : 'text-amber-800'">{{ headline }}</span>
    <span :class="status.kind === 'active' || status.kind === 'off' ? 'text-gray-500' : 'text-amber-800'">{{ detail }}</span>
    <button
      v-if="setupLink && status.kind !== 'active'"
      type="button"
      class="font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      data-testid="model-routing-status-setup"
      @click="emit('show-setup')"
    >{{ t('settings.modelRouting.status.goToSetup') }}</button>
    <span v-if="!ownNode" class="ml-auto text-gray-500" data-testid="model-routing-node">
      <span class="font-medium text-gray-700">{{ nodeName }}</span><span class="mx-1.5 text-gray-300" aria-hidden="true">·</span>{{ t('settings.modelRouting.node.remote') }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouterStatus } from '~/prototype/model-routing/modelRoutingState'
import { routerProblem } from './modelRoutingPresentation'

const props = defineProps<{ status: RouterStatus; nodeName: string; ownNode: boolean; setupLink: boolean }>()
const emit = defineEmits<{ (event: 'show-setup'): void }>()
const { t, resolvedLocale } = useLocalization()
const locale = computed(() => String(resolvedLocale.value || 'en'))

const headline = computed(() => {
  switch (props.status.kind) {
    case 'off': return t('settings.modelRouting.status.off')
    case 'active': return t('settings.modelRouting.status.active')
    default: return t('settings.modelRouting.status.notActive')
  }
})
const detail = computed(() => {
  const status = props.status
  if (status.kind === 'off') return t('settings.modelRouting.status.offDetail')
  if (status.kind === 'active') return t('settings.modelRouting.status.activeDetail', { runtime: status.runtimeName, model: status.model })
  return routerProblem(status, t, locale.value)
})
const dot = computed(() => (props.status.kind === 'active' ? 'bg-emerald-500' : props.status.kind === 'off' ? 'bg-slate-400' : 'bg-amber-500'))
</script>
