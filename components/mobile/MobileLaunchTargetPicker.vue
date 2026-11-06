<template>
  <section class="border-b border-slate-100 bg-white" :data-testid="testId" :aria-label="label">
    <button
      type="button"
      class="flex h-14 w-full items-center gap-3 text-left active:bg-slate-50 disabled:opacity-50"
      :disabled="disabled"
      :data-testid="`${testId}-toggle`"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      @click="open"
    >
      <span class="w-24 flex-shrink-0 text-[0.9375rem] text-slate-500">{{ label }}</span>
      <span class="min-w-0 flex-1 truncate text-right text-base" :class="selectedItem || selectedLabel ? 'font-medium text-slate-900' : 'text-blue-700'">{{ selectedItem ? selectedItem.label : (selectedLabel || placeholder) }}</span>
      <Icon icon="heroicons:chevron-right-20-solid" class="h-5 w-5 flex-shrink-0 text-slate-300" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col justify-end" :data-testid="`${testId}-sheet`">
        <button type="button" class="absolute inset-0 bg-slate-900/40" aria-label="Close" @click="close" />
        <div class="relative flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-xl" role="dialog" aria-modal="true" :aria-label="label">
          <div class="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
          <header class="flex h-14 flex-shrink-0 items-center justify-between pl-4 pr-2">
            <h2 class="text-lg font-semibold">{{ label }}</h2>
            <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full text-slate-500 active:bg-slate-100" aria-label="Close" @click="close">
              <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" aria-hidden="true" />
            </button>
          </header>
          <div v-if="items.length > 6" class="flex-shrink-0 px-4 pb-2">
            <input
              v-model="query"
              type="search"
              class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base"
              :placeholder="`Search ${searchNoun}`"
              :data-testid="`${testId}-search`"
            />
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
            <template v-if="groupedItems.length">
              <section v-for="group in groupedItems" :key="group.label">
                <p v-if="groupedItems.length > 1 || group.label !== 'All'" class="sticky top-0 bg-white px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{{ group.label }}</p>
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  type="button"
                  class="flex min-h-[3.75rem] w-full items-center gap-3 px-4 py-2 text-left active:bg-slate-100"
                  :class="item.id === modelValue ? 'bg-blue-50' : ''"
                  :aria-current="item.id === modelValue ? 'true' : undefined"
                  :data-testid="`${testId}-option`"
                  @click="selectItem(item.id)"
                >
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-base font-medium text-slate-900">{{ item.label }}</span>
                    <span v-if="item.detail" class="block truncate text-[0.8125rem] text-slate-500">{{ item.detail }}</span>
                  </span>
                  <Icon v-if="item.id === modelValue" icon="heroicons:check-circle-20-solid" class="h-6 w-6 flex-shrink-0 text-blue-600" aria-hidden="true" />
                </button>
              </section>
            </template>
            <p v-else class="px-4 py-6 text-sm text-slate-500">Nothing matches.</p>
          </div>
          <div v-if="$slots.footer" class="flex-shrink-0 border-t border-slate-200 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import type { MobileLaunchPickerItem } from '~/types/mobileLaunch';

const props = withDefaults(defineProps<{
  label: string;
  placeholder: string;
  items: MobileLaunchPickerItem[];
  modelValue: string;
  testId: string;
  showLabel?: boolean;
  itemNoun?: string;
  disabled?: boolean;
  /** Shown as the value when it is not one of the items (a seeded model). */
  selectedLabel?: string;
}>(), {
  showLabel: true,
  itemNoun: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);
const query = ref('');

const searchNoun = computed(() => props.itemNoun || props.label.toLowerCase());
const selectedItem = computed(() => props.items.find((item) => item.id === props.modelValue) ?? null);
const filteredItems = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  if (!normalizedQuery) return props.items;
  return props.items.filter((item) => `${item.label} ${item.detail ?? ''} ${item.group ?? ''}`.toLowerCase().includes(normalizedQuery));
});
const groupedItems = computed(() => {
  const groups = new Map<string, MobileLaunchPickerItem[]>();
  for (const item of filteredItems.value) {
    const group = item.group || 'All';
    groups.set(group, [...(groups.get(group) ?? []), item]);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
});

// A choice made from outside the list (a folder loaded by path in the footer) closes it too.
watch(() => props.modelValue, () => { if (isOpen.value) close(); });

function open(): void {
  isOpen.value = true;
  void nextTick(() => document.querySelector(`[data-testid="${props.testId}-sheet"] [aria-current=true]`)?.scrollIntoView({ block: 'center' }));
}
function close(): void {
  isOpen.value = false;
  query.value = '';
}
function selectItem(value: string): void {
  emit('update:modelValue', value);
  close();
}
</script>
