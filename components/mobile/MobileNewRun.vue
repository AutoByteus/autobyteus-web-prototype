<template>
  <section class="fixed inset-0 z-30 flex h-[100dvh] flex-col bg-white text-slate-900" data-testid="mobile-new-run">
    <header class="flex h-14 flex-shrink-0 items-center border-b border-slate-200 pl-1 pr-3">
      <button type="button" class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-slate-600 active:bg-slate-100" aria-label="Close" data-testid="mobile-new-run-close" @click="$emit('close')">
        <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
      </button>
      <h1 class="px-2 text-base font-semibold">New run</h1>
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
      <MobileRunSetup
        plain
        :context="context"
        :setup-intent="setupIntent"
        @cancel="$emit('close')"
        @launched="$emit('launched', $event)"
        @setup-intent-consumed="$emit('setup-intent-consumed', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import MobileRunSetup from '~/components/mobile/MobileRunSetup.vue'
import type { MobileRunSetupIntent, MobileWorkContext } from '~/types/mobileWork'

defineProps<{ context: MobileWorkContext | null; setupIntent?: MobileRunSetupIntent | null }>()
defineEmits<{
  (event: 'close'): void
  (event: 'launched', context: MobileWorkContext): void
  (event: 'setup-intent-consumed', revision: number): void
}>()
</script>
