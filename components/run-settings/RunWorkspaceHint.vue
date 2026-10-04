<template>
  <p
    v-if="path"
    class="mt-2 flex items-center gap-1.5 px-1 text-xs text-gray-400"
    :title="path"
    data-test="run-workspace-hint"
  >
    <Icon icon="heroicons:folder" class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
    <span class="truncate">{{ presentation.isTempWorkspace(workspace) ? $t('runSettings.workspace.tempPath', { path }) : $t('runSettings.workspace.path', { path }) }}</span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

/** The Chat composer's workspace footnote, under the run settings card. */
const props = defineProps<{ workspace: ChatDraftWorkspace | null }>()
const presentation = useRunSettingsPresentation()
const path = computed(() => presentation.workspacePath(props.workspace))
</script>
