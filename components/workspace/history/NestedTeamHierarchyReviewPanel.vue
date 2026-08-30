<template>
  <aside
    v-if="review.active.value"
    class="fixed bottom-4 right-4 z-[70] rounded-xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur"
    :style="reviewPanelStyle"
    aria-label="Prototype review controls"
    data-test="nested-hierarchy-review-panel"
  >
    <details open>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500">
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-slate-800">Prototype review · Workspace history</span>
          <span class="block truncate text-xs text-slate-500">Review controls only — not proposed product UI</span>
        </span>
        <span class="rounded-full bg-indigo-50 px-2 py-1 text-[0.6875rem] font-semibold text-indigo-700">DEC-001–003</span>
      </summary>

      <div class="grid gap-x-4 gap-y-3 border-t border-slate-100 px-4 py-3 lg:grid-cols-[1.15fr_1fr_1fr]">
        <fieldset>
          <legend class="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">DEC-001 · Ancestry</legend>
          <div class="flex rounded-md bg-slate-100 p-0.5" data-test="review-treatment-options">
            <ReviewChoice label="Rails" :active="review.treatment.value === 'rails'" @click="review.update({ hierarchy: 'rails' })" />
            <ReviewChoice label="Surfaces" :active="review.treatment.value === 'surfaces'" @click="review.update({ hierarchy: 'surfaces' })" />
            <ReviewChoice label="Hybrid" :active="review.treatment.value === 'hybrid'" @click="review.update({ hierarchy: 'hybrid' })" />
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">DEC-002 · Metadata</legend>
          <div class="flex rounded-md bg-slate-100 p-0.5" data-test="review-metadata-options">
            <ReviewChoice label="Full" :active="review.metadata.value === 'full'" @click="review.update({ metadata: 'full' })" />
            <ReviewChoice label="Responsive" :active="review.metadata.value === 'responsive'" @click="review.update({ metadata: 'responsive' })" />
            <ReviewChoice label="On focus" :active="review.metadata.value === 'on-demand'" @click="review.update({ metadata: 'on-demand' })" />
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">DEC-003 · Team identity</legend>
          <div class="flex rounded-md bg-slate-100 p-0.5" data-test="review-identity-options">
            <ReviewChoice label="Icon" :active="review.teamIdentity.value === 'icon'" @click="review.update({ teamIdentity: 'icon' })" />
            <ReviewChoice label="Header" :active="review.teamIdentity.value === 'header'" @click="review.update({ teamIdentity: 'header' })" />
            <ReviewChoice label="Band" :active="review.teamIdentity.value === 'band'" @click="review.update({ teamIdentity: 'band' })" />
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">Tree state</legend>
          <select
            :value="review.reviewState.value"
            class="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            data-test="review-tree-state"
            @change="onStateChange"
          >
            <option value="collapsed">Subteams collapsed</option>
            <option value="one">One subteam expanded</option>
            <option value="several">Sibling subteams expanded</option>
            <option value="deep">Deeper team expanded</option>
            <option value="selected">Selected deep leaf</option>
          </select>
        </fieldset>

        <fieldset>
          <legend class="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">Actual panel width</legend>
          <div class="flex rounded-md bg-slate-100 p-0.5" data-test="review-width-options">
            <ReviewChoice label="260" :active="review.width.value === 260" @click="review.update({ panelWidth: 260 })" />
            <ReviewChoice label="320" :active="review.width.value === 320" @click="review.update({ panelWidth: 320 })" />
            <ReviewChoice label="520" :active="review.width.value === 520" @click="review.update({ panelWidth: 520 })" />
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">Actual app font</legend>
          <div class="flex rounded-md bg-slate-100 p-0.5" data-test="review-font-options">
            <ReviewChoice label="Default" :active="review.fontSize.value === 'default'" @click="review.update({ fontSize: 'default' })" />
            <ReviewChoice label="Extra Large" :active="review.fontSize.value === 'extra-large'" @click="review.update({ fontSize: 'extra-large' })" />
          </div>
        </fieldset>
      </div>
    </details>
  </aside>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, watch } from 'vue';
import { useAppFontSizeStore } from '~/stores/appFontSizeStore';
import { useLeftPanel } from '~/composables/useLeftPanel';
import { useNestedTeamHierarchyPrototypeReview } from '~/composables/useNestedTeamHierarchyPrototypeReview';

const ReviewChoice = defineComponent({
  props: {
    label: { type: String, required: true },
    active: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('button', {
      type: 'button',
      class: [
        'min-w-0 flex-1 rounded px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        props.active ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900',
      ],
      'aria-pressed': props.active,
      onClick: () => emit('click'),
    }, props.label);
  },
});

const review = useNestedTeamHierarchyPrototypeReview();
const appFontSizeStore = useAppFontSizeStore();
const { setLeftPanelWidth, setLeftPanelVisible } = useLeftPanel();
const reviewPanelStyle = computed(() => ({
  width: `min(900px, calc(100vw - ${review.width.value + 32}px))`,
}));

const applyActualProductSettings = (): void => {
  if (!review.active.value) return;
  setLeftPanelVisible(true);
  setLeftPanelWidth(review.width.value);
  appFontSizeStore.setPreset(review.fontSize.value);
};

const applyFixture = (): void => {
  if (!review.active.value || !window.__AUTOBYTEUS_PROTOTYPE__) return;
  if (window.__AUTOBYTEUS_PROTOTYPE__.scenario !== 'workspace_team_hierarchy_review') {
    window.__AUTOBYTEUS_PROTOTYPE__.setScenario('workspace_team_hierarchy_review', 'desktop');
    return;
  }
  window.__AUTOBYTEUS_PROTOTYPE__.applyExperienceScenario({
    scenario: 'workspace_team_hierarchy_review',
    context: 'desktop',
  });
};

const onStateChange = (event: Event): void => {
  const value = (event.target as HTMLSelectElement).value;
  void review.update({ treeState: value });
};

watch([review.active, review.width, review.fontSize], applyActualProductSettings, { immediate: true });
onMounted(() => {
  applyActualProductSettings();
  window.setTimeout(applyFixture, 0);
});
</script>
