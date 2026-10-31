<template>
  <!-- projects-left-navigation (REQ-004): the Project a New chat starts under. Shown when the node has Projects; changeable until the
       first message is sent (the draft is then a run and the chip is no longer here). -->
  <div ref="rootRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      data-test="chat-project-trigger"
      class="inline-flex max-w-[16rem] items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] leading-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      :class="[
        selected ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100/70' : 'text-gray-600 hover:bg-gray-100',
        popover.open.value && !selected ? 'bg-gray-100' : '',
      ]"
      :aria-expanded="popover.open.value ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-label="t('projectsTree.chipAria', { name: label })"
      :title="selected ? t('projectsTree.chipTitle', { name: selected.name }) : undefined"
      @click="toggle"
    >
      <Icon icon="heroicons:briefcase" class="h-4 w-4 flex-shrink-0" :class="selected ? 'text-indigo-500' : 'text-gray-500'" aria-hidden="true" />
      <span class="truncate">{{ label }}</span>
      <Icon icon="heroicons:chevron-down" class="h-3.5 w-3.5 flex-shrink-0" :class="selected ? 'text-indigo-400' : 'text-gray-400'" aria-hidden="true" />
    </button>

    <div v-if="popover.open.value && popover.narrow.value" class="fixed inset-0 z-40 bg-black/20" aria-hidden="true"></div>
    <div
      v-if="popover.open.value"
      ref="menuRef"
      data-test="chat-project-menu"
      class="z-50 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-lg"
      :class="popover.narrow.value
        ? 'fixed inset-x-2 bottom-2 max-h-[80vh]'
        : ['absolute left-0 w-80 max-w-[calc(100vw-1.5rem)]', popover.placement.value === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5']"
      :style="popover.narrow.value ? undefined : { maxHeight: `${popover.maxHeight.value}px`, ...inBoundary.style.value }"
    >
      <div ref="listRef" role="listbox" :aria-label="t('projectsTree.menuAria')" class="min-h-0 flex-1 overflow-y-auto py-1" @keydown="onKeydown">
        <button
          type="button"
          role="option"
          data-option
          data-test="chat-project-option-none"
          :aria-selected="!selected ? 'true' : 'false'"
          class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          @click="choose(null)"
        >
          <span class="min-w-0 flex-1 truncate text-sm" :class="!selected ? 'font-medium text-blue-700' : 'text-gray-700'">{{ t('projectsTree.noProject') }}</span>
          <Icon v-if="!selected" icon="heroicons:check" class="h-4 w-4 flex-shrink-0 text-blue-600" aria-hidden="true" />
        </button>
        <button
          v-for="project in projects"
          :key="project.projectId"
          type="button"
          role="option"
          data-option
          :data-test="`chat-project-option-${project.projectId}`"
          :aria-selected="selected?.projectId === project.projectId ? 'true' : 'false'"
          class="flex w-full items-start gap-2.5 px-3 py-1.5 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          @click="choose(project.projectId)"
        >
          <Icon icon="heroicons:briefcase" class="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium" :class="selected?.projectId === project.projectId ? 'text-blue-700' : 'text-gray-900'">{{ project.name }}</span>
            <span class="block truncate text-xs text-gray-500">{{ folderOf(project) }}</span>
          </span>
          <Icon v-if="selected?.projectId === project.projectId" icon="heroicons:check" class="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAnchoredPopover } from '~/composables/popover/useAnchoredPopover'
import { useMenuInBoundary } from '~/composables/popover/useMenuInBoundary'
import { useLocalization } from '~/composables/useLocalization'
import { firstFolderOf } from '~/stores/projectsTreeStore'
import type { Project } from '~/types/project'

const props = defineProps<{ projects: Project[]; projectId: string | null }>()
const emit = defineEmits<{ (event: 'select', projectId: string | null): void }>()

const { t } = useLocalization()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const popover = useAnchoredPopover(rootRef, triggerRef, 280, { placement: 'above' })
const inBoundary = useMenuInBoundary(menuRef, computed(() => popover.open.value), computed(() => !popover.narrow.value))

const selected = computed(() => props.projects.find((project) => project.projectId === props.projectId) ?? null)
const label = computed(() => selected.value?.name ?? t('projectsTree.noProject'))
/** What choosing the Project preselects (REQ-005): its first linked folder, else the temp workspace. */
const folderOf = (project: Project): string => {
  const folder = firstFolderOf(project)
  return folder ? folder.replace(/[/\\]+$/, '').split(/[/\\]/).pop() || folder : t('chat.workspace.temp')
}

const options = () => Array.from(listRef.value?.querySelectorAll<HTMLElement>('[data-option]') ?? [])
const toggle = async () => {
  await popover.toggle()
  if (popover.open.value) {
    await nextTick()
    const items = options()
    ;(items.find((item) => item.getAttribute('aria-selected') === 'true') ?? items[0])?.focus()
  }
}
const choose = (projectId: string | null) => {
  emit('select', projectId)
  popover.close(true)
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const items = options()
  const index = items.indexOf(document.activeElement as HTMLElement)
  event.preventDefault()
  items[event.key === 'ArrowDown' ? Math.min(items.length - 1, index + 1) : Math.max(0, index - 1)]?.focus()
}
</script>
