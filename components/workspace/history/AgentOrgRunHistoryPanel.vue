<template>
  <div class="flex h-full flex-col bg-white" data-test="agent-org-run-history">
    <div class="flex items-center justify-between border-t border-gray-200 px-3 py-2">
      <h3 class="text-sm font-semibold text-gray-700">Workspaces</h3>
      <button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-indigo-50 hover:text-indigo-600" aria-label="Add workspace"><Icon icon="heroicons:plus-20-solid" class="h-4 w-4" /></button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-1 pb-4">
      <section>
        <div class="flex items-center rounded-md px-2 py-1.5 text-sm text-gray-700">
          <Icon icon="heroicons:chevron-down-20-solid" class="mr-1.5 h-4 w-4 text-gray-400" />
          <Icon icon="heroicons:folder-20-solid" class="mr-1.5 h-4 w-4 text-gray-500" />
          <span class="truncate">AutoByteus Workspace</span>
        </div>

        <div class="ml-3 mt-1">
          <div class="mb-1 flex items-center justify-between px-2 py-1">
            <span class="text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Active</span>
            <span class="inline-flex items-center gap-1 text-[0.6875rem] font-medium text-emerald-700"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>2 roots</span>
          </div>

          <button
            type="button"
            class="group w-full rounded-md px-2 py-2 text-left transition"
            :class="isOrgSelected ? 'bg-indigo-50 text-indigo-950 shadow-[inset_2px_0_0_#6366f1]' : 'text-gray-700 hover:bg-gray-50'"
            data-test="history-org-root"
            @click="selectRoot('org')"
          >
            <span class="flex items-start gap-2">
              <Icon icon="heroicons:chevron-down-20-solid" class="mt-0.5 h-3.5 w-3.5 flex-none text-gray-400" />
              <span class="inline-flex h-5 w-5 flex-none items-center justify-center rounded-md bg-violet-100 text-violet-700"><Icon icon="heroicons:building-office-2-20-solid" class="h-3.5 w-3.5" /></span>
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-1.5"><span class="truncate text-sm font-semibold">Software Development Department</span><span class="rounded bg-violet-100 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-violet-700">Org</span></span>
                <span class="mt-0.5 block truncate text-[0.6875rem] text-gray-500">Entry · Product Design → product_prototyper</span>
              </span>
              <span class="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-500" aria-label="Running"></span>
            </span>
          </button>

          <div class="relative ml-[1.3rem] border-l border-slate-300 pl-3">
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-700">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span class="inline-flex h-4 w-4 items-center justify-center rounded bg-slate-100 text-slate-500"><Icon icon="heroicons:user-20-solid" class="h-3 w-3" /></span>
              <span class="truncate">requirements_engineer</span>
              <span class="ml-auto text-[0.625rem] font-semibold text-slate-400">AGENT</span>
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-700">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              <Icon icon="heroicons:user-group-20-solid" class="h-4 w-4 text-blue-600" />
              <span class="truncate font-semibold">Product Design & Prototyping</span>
              <span class="ml-auto text-[0.625rem] font-semibold text-blue-600">TEAM</span>
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-700">
              <span class="h-2 w-2 rounded-full bg-amber-400"></span>
              <Icon icon="heroicons:user-group-20-solid" class="h-4 w-4 text-blue-600" />
              <span class="truncate font-semibold">Software Engineering</span>
              <span class="ml-auto text-[0.625rem] font-semibold text-blue-600">TEAM</span>
            </div>
          </div>

          <button
            type="button"
            class="mt-1 w-full rounded-md px-2 py-2 text-left transition"
            :class="!isOrgSelected ? 'bg-indigo-50 text-indigo-950 shadow-[inset_2px_0_0_#6366f1]' : 'text-gray-700 hover:bg-gray-50'"
            data-test="history-team-root"
            @click="selectRoot('team')"
          >
            <span class="flex items-start gap-2">
              <Icon icon="heroicons:chevron-right-20-solid" class="mt-0.5 h-3.5 w-3.5 flex-none text-gray-400" />
              <Icon icon="heroicons:user-group-20-solid" class="mt-0.5 h-5 w-5 flex-none text-blue-600" />
              <span class="min-w-0 flex-1"><span class="flex items-center gap-1.5"><span class="truncate text-sm font-semibold">Release Readiness</span><span class="rounded bg-blue-50 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-blue-700">Team</span></span><span class="mt-0.5 block truncate text-[0.6875rem] text-gray-500">Coordinator · delivery_engineer</span></span>
              <span class="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-500"></span>
            </span>
          </button>

          <div class="mt-3 border-t border-gray-100 pt-2">
            <div class="mb-1 flex items-center justify-between px-2 py-1"><span class="text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Task work</span><span class="rounded bg-amber-50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-amber-700">Execution lineage</span></div>
            <div class="mx-1 rounded-md border border-dashed border-amber-200 bg-amber-50/60 px-2 py-2">
              <div class="flex items-center gap-2"><span class="inline-flex h-5 w-5 items-center justify-center rounded border border-dashed border-amber-300 bg-white text-amber-700"><Icon icon="heroicons:bolt-20-solid" class="h-3.5 w-3.5" /></span><span class="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">Accessibility evidence review</span><span class="text-[0.5625rem] font-bold uppercase text-amber-700">Task Team</span></div>
              <p class="mt-1 pl-7 text-[0.625rem] text-slate-500">Created by Product Design · belongs to Org run</p>
            </div>
          </div>

          <div class="mt-3 border-t border-gray-100 pt-2">
            <div class="mb-1 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">History</div>
            <div class="space-y-0.5">
              <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"><Icon icon="heroicons:building-office-2-20-solid" class="h-4 w-4 text-violet-500" /><span class="min-w-0 flex-1 truncate">Northstar Operating Company</span><span class="rounded bg-violet-50 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase text-violet-600">Org</span><span class="text-[0.625rem] text-gray-400">3d</span></div>
              <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"><Icon icon="heroicons:user-group-20-solid" class="h-4 w-4 text-blue-500" /><span class="min-w-0 flex-1 truncate">Incident Response</span><span class="rounded bg-blue-50 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase text-blue-600">Team</span><span class="text-[0.625rem] text-gray-400">6d</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { AGENT_ORG_PROTOTYPE_REVIEW_KEY } from '~/composables/useAgentOrgPrototypeReview';

defineEmits(['run-selected', 'run-created']);
const route = useRoute();
const router = useRouter();
const isOrgSelected = computed(() => route.query.root !== 'team');
const selectRoot = async (root: 'org' | 'team'): Promise<void> => {
  await router.push({
    path: '/workspace',
    query: root === 'org'
      ? { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, root: 'org', org: 'software-development-department', entry: 'team:product-design-prototyping-team' }
      : { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, root: 'team', team: 'release-readiness-team' },
  });
};
</script>
