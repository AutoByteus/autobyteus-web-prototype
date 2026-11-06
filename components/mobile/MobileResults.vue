<template>
  <section class="fixed inset-0 z-30 flex h-[100dvh] flex-col bg-white text-slate-900" :data-testid="`mobile-${kind}-screen`">
    <header class="flex h-14 flex-shrink-0 items-center border-b border-slate-200 pl-1 pr-3">
      <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Back to the conversation" data-testid="mobile-results-back" @click="$emit('back')">
        <Icon icon="heroicons:arrow-left-20-solid" class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="min-w-0 flex-1 px-2">
        <h1 class="truncate text-base font-semibold leading-5">{{ title }}</h1>
        <p class="truncate text-xs leading-4 text-slate-500">{{ node.name }}</p>
      </div>
    </header>

    <p v-if="remoteNote && kind !== 'activity'" class="m-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600" data-testid="mobile-results-remote-note">{{ remoteNote }}</p>
    <div v-else class="min-h-0 flex-1 overflow-hidden">
      <MobileArtifacts v-if="kind === 'artifacts'" :context="context" embedded />
      <MobileFiles v-else-if="kind === 'files'" :context="context" embedded />
      <MobileActivity v-else :context="context" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import MobileActivity from '~/components/mobile/MobileActivity.vue'
import MobileArtifacts from '~/components/mobile/MobileArtifacts.vue'
import MobileFiles from '~/components/mobile/MobileFiles.vue'
import { useLocalization } from '~/composables/useLocalization'
import type { MobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture'
import type { MobileWorkContext } from '~/types/mobileWork'

export type MobileRunView = 'artifacts' | 'files' | 'activity'
const props = defineProps<{ node: MobileRunNode; context: MobileWorkContext | null; kind: MobileRunView }>()
defineEmits<{ (event: 'back'): void }>()
const { t } = useLocalization()

const TITLES: Record<MobileRunView, string> = { artifacts: 'Artifacts', files: 'Files', activity: 'Activity' }
const title = computed(() => TITLES[props.kind])
/** A run on another node keeps its files there (autobyteus-278): the phone says so, as the desktop does. */
const remoteNote = computed(() => {
  if (!props.node.node) return ''
  return t(props.kind === 'files' ? 'remote.panel.files' : 'remote.panel.artifacts', { node: props.node.node })
})
</script>
