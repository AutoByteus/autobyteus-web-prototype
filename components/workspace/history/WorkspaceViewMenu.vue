<template>
  <!-- workspace-tree-vs-chooser: the run section's one header button. It chooses how the runs are shown (by workspace, by Project, or just
       your runs) and holds the view's own add action (a folder, a Project). -->
  <div ref="rootRef" class="relative flex-shrink-0">
    <button
      ref="triggerRef"
      type="button"
      class="inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      :class="open ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'"
      data-test="run-section-view-menu"
      aria-haspopup="menu"
      :aria-expanded="open ? 'true' : 'false'"
      :title="$t('workspaceFolders.menuTitle')"
      :aria-label="$t('workspaceFolders.menuTitle')"
      @click="toggle"
      @keydown.down.prevent="openAndFocus"
    >
      <Icon icon="heroicons:ellipsis-horizontal-20-solid" class="h-4 w-4" aria-hidden="true" />
    </button>
    <div
      v-if="open"
      ref="menuRef"
      role="menu"
      class="absolute right-0 top-full z-30 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg"
      data-test="run-section-view-menu-list"
      @keydown="onKeydown"
    >
      <div class="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400" role="presentation">{{ $t('workspaceFolders.viewLabel') }}</div>
      <button
        v-for="option in views"
        :key="option.mode"
        type="button"
        role="menuitemradio"
        :aria-checked="mode === option.mode ? 'true' : 'false'"
        :data-test="`run-section-view-${option.mode}`"
        class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        :class="mode === option.mode ? 'font-medium text-gray-900' : 'text-gray-700'"
        @click="chooseView(option.mode)"
      >
        <Icon :icon="option.icon" class="h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
        <Icon v-if="mode === option.mode" icon="heroicons:check-20-solid" class="h-4 w-4 flex-shrink-0 text-indigo-600" aria-hidden="true" />
      </button>
      <template v-if="mode !== 'runs'">
        <div class="my-1 border-t border-gray-100" role="separator"></div>
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          :data-test="mode === 'projects' ? 'run-section-new-project' : 'run-section-add-workspace'"
          @click="chooseAdd"
        >
          <Icon icon="heroicons:plus-20-solid" class="h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
          {{ mode === 'projects' ? $t('projectsTree.newProject') : $t('workspace.components.workspace.history.WorkspaceAgentRunsTreePanel.add_workspace') }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useLocalization } from '~/composables/useLocalization';
import type { RunSectionMode } from '~/stores/projectsTreeStore';

const props = defineProps<{ mode: RunSectionMode }>();
const emit = defineEmits<{ (event: 'select-view', mode: RunSectionMode): void; (event: 'add'): void }>();
const { t } = useLocalization();

const views = computed<{ mode: RunSectionMode; label: string; icon: string }[]>(() => [
  { mode: 'runs', label: t('workspaceFolders.viewRuns'), icon: 'heroicons:queue-list' },
  { mode: 'workspaces', label: t('shell.navigation.workspaces'), icon: 'heroicons:folder' },
  { mode: 'projects', label: t('shell.navigation.projects'), icon: 'heroicons:briefcase' },
]);

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const items = (): HTMLElement[] => Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[role^=menuitem]') ?? []);
const close = (returnFocus = false): void => {
  open.value = false;
  if (returnFocus) triggerRef.value?.focus();
};
const openAndFocus = async (): Promise<void> => {
  open.value = true;
  await nextTick();
  (menuRef.value?.querySelector<HTMLElement>('[aria-checked=true]') ?? items()[0])?.focus();
};
const toggle = (): void => {
  if (open.value) close();
  else void openAndFocus();
};
const chooseView = (next: RunSectionMode): void => {
  close(true);
  if (next !== props.mode) emit('select-view', next);
};
const chooseAdd = (): void => {
  close();
  emit('add');
};
const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
  if (event.key === 'Tab') { close(); return; }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  const list = items();
  const index = list.indexOf(document.activeElement as HTMLElement);
  list[event.key === 'ArrowDown' ? Math.min(list.length - 1, index + 1) : Math.max(0, index - 1)]?.focus();
};
const onPointerDown = (event: MouseEvent): void => {
  if (open.value && rootRef.value && !rootRef.value.contains(event.target as Node)) close();
};
onMounted(() => document.addEventListener('mousedown', onPointerDown));
onBeforeUnmount(() => document.removeEventListener('mousedown', onPointerDown));
</script>
