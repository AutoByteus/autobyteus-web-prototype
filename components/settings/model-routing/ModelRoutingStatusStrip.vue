<template>
  <div
    class="flex flex-col gap-1 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    :class="tone.box"
    role="status"
    data-testid="model-routing-status"
    :data-status="status.kind"
  >
    <div class="flex min-w-0 items-start gap-2.5">
      <span class="mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full" :class="tone.dot" aria-hidden="true"></span>
      <p class="min-w-0 text-sm text-gray-700">
        <span class="font-semibold text-gray-900">{{ headline }}</span>
        <span class="text-gray-600"> · {{ detail }}</span>
      </p>
    </div>
    <div class="flex flex-shrink-0 items-center gap-3 pl-[1.125rem] sm:pl-0">
      <p v-if="!ownNode" class="text-sm text-gray-500" data-testid="model-routing-node">
        <span class="font-medium text-gray-700">{{ nodeName }}</span><span class="mx-1.5 text-gray-300" aria-hidden="true">·</span>{{ t('settings.modelRouting.node.remote') }}
      </p>
      <button
        v-if="setupLink && status.kind !== 'active'"
        type="button"
        class="whitespace-nowrap text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        data-testid="model-routing-status-setup"
        @click="emit('show-setup')"
      >{{ t('settings.modelRouting.status.goToSetup') }}</button>
    </div>
  </div>
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
const tone = computed(() => props.status.kind === 'active'
  ? { box: 'border-emerald-100 bg-emerald-50/50', dot: 'bg-emerald-500' }
  : props.status.kind === 'off'
    ? { box: 'border-slate-200 bg-slate-50/60', dot: 'bg-slate-400' }
    : { box: 'border-amber-200 bg-amber-50/60', dot: 'bg-amber-500' })
</script>
