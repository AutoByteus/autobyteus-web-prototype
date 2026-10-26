<template>
  <!-- delegated-runtime-model-routing: the Model Router's conversation says what it is and links back to its page. -->
  <div class="flex flex-col gap-1 border-b border-gray-100 bg-slate-50/70 px-3 py-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4" data-testid="model-router-strip">
    <p class="min-w-0">{{ t('modelRouter.strip.text') }}</p>
    <nav class="flex flex-shrink-0 items-center gap-3" :aria-label="t('modelRouter.strip.label')">
      <button v-for="tab in LINKS" :key="tab" type="button" class="whitespace-nowrap font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :data-testid="`model-router-strip-${tab}`" @click="open(tab)">{{ t(`modelRouter.strip.${tab}`) }}</button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLocalization } from '~/composables/useLocalization'

const LINKS = ['decisions', 'knowledge', 'setup'] as const
const { t } = useLocalization()
const router = useRouter()
const open = (tab: typeof LINKS[number]): void => { void router.push({ path: '/settings', query: { section: 'model-routing', tab } }) }
</script>
