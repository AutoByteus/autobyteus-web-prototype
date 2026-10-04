<template>
  <div class="mb-5 flex items-center gap-3" data-test="run-subject-header">
    <span
      class="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600"
      aria-hidden="true"
    >
      <Icon v-if="kind === 'org'" icon="heroicons:building-office-2" class="h-[1.125rem] w-[1.125rem]" />
      <Icon v-else-if="kind === 'team'" icon="heroicons:user-group" class="h-[1.125rem] w-[1.125rem]" />
      <template v-else>{{ initialsFor(name) }}</template>
    </span>
    <div class="min-w-0">
      <h2 class="truncate text-[0.9375rem] font-semibold leading-5 text-gray-900" data-test="run-subject-name">{{ name }}</h2>
      <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs leading-4 text-gray-500" data-test="run-subject-kind">
        <template v-if="status">
          <span class="h-1.5 w-1.5 flex-shrink-0 rounded-full" :class="status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'" aria-hidden="true"></span>
          <span>{{ status === 'active' ? $t('runSettings.status.active') : $t('runSettings.status.stopped') }}</span>
          <span aria-hidden="true">·</span>
        </template>
        <span class="truncate">{{ subtitle }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { initialsFor } from '~/components/chat/chatComposerMenus'

defineProps<{
  kind: 'agent' | 'team' | 'org'
  name: string
  subtitle: string
  /** Saved runs only. */
  status?: 'active' | 'stopped' | null
}>()
</script>
