<template>
  <div class="h-full overflow-auto bg-slate-50" data-test="agent-org-runtime-experience">
    <div class="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-7 lg:px-9">
      <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex min-w-0 items-start gap-4">
            <span class="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl" :class="isOrg ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'">
              <Icon :icon="isOrg ? 'heroicons:building-office-2-20-solid' : 'heroicons:user-group-20-solid'" class="h-6 w-6" />
            </span>
            <div class="min-w-0">
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="isOrg ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'">{{ isOrg ? 'Agent Org run' : 'Standalone Agent Team run' }}</span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Running</span>
              </div>
              <h1 class="truncate text-2xl font-bold tracking-tight text-slate-950">{{ isOrg ? org.name : team.name }}</h1>
              <p class="mt-1 text-sm text-slate-500">Run #{{ isOrg ? 'AORG-027' : 'TEAM-043' }} · Started 31 minutes ago</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2"><button type="button" class="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View definition</button><button type="button" class="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Stop run</button></div>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-3">
          <div class="rounded-xl border p-4" :class="isOrg ? 'border-violet-200 bg-violet-50/70' : 'border-blue-200 bg-blue-50/70'">
            <p class="text-xs font-semibold uppercase tracking-wide" :class="isOrg ? 'text-violet-700' : 'text-blue-700'">{{ isOrg ? 'Selected entry' : 'Team coordinator' }}</p>
            <div class="mt-2 flex items-center gap-2"><Icon :icon="entryKind === 'team' || !isOrg ? 'heroicons:user-group-20-solid' : 'heroicons:user-20-solid'" class="h-4 w-4" /><p class="truncate text-sm font-bold text-slate-900">{{ entryLabel }}</p></div>
            <p class="mt-1 truncate text-xs text-slate-500">{{ entryDetail }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Root scope</p><p class="mt-2 text-sm font-bold text-slate-900">{{ isOrg ? '1 Org · 3 direct placements' : `1 Team · ${team.agents.length} direct Agents` }}</p><p class="mt-1 text-xs text-slate-500">{{ isOrg ? 'No Org coordinator' : 'Coordinator-led lifecycle' }}</p></div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Task execution</p><p class="mt-2 text-sm font-bold text-slate-900">1 active task Team</p><p class="mt-1 text-xs text-slate-500">Tracked as runtime lineage, not membership</p></div>
        </div>
      </header>

      <div class="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <div class="space-y-5">
          <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4"><div><h2 class="font-bold text-slate-950">{{ isOrg ? 'Configured organization scope' : 'Configured Team members' }}</h2><p class="mt-1 text-sm text-slate-500">{{ isOrg ? 'Direct placements only; Teams retain their own coordinators.' : 'This standalone root contains direct Agents only.' }}</p></div><span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Definition snapshot</span></div>
            <div v-if="isOrg" class="divide-y divide-slate-100">
              <div class="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(10rem,0.65fr)] items-center gap-3 px-5 py-4"><span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">RE</span><div class="min-w-0"><div class="flex items-center gap-2"><p class="truncate text-sm font-semibold text-slate-900">requirements_engineer</p><span class="rounded bg-slate-100 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase text-slate-500">Agent</span></div><p class="mt-1 font-mono text-xs text-slate-500">/requirements_engineer</p></div><p class="text-right text-xs font-medium text-slate-500">Direct Org entry</p></div>
              <div v-for="memberTeam in orgTeams" :key="memberTeam.id" class="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(10rem,0.65fr)] items-center gap-3 px-5 py-4"><span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5" /></span><div class="min-w-0"><div class="flex items-center gap-2"><p class="truncate text-sm font-semibold text-slate-900">{{ memberTeam.name }}</p><span class="rounded bg-blue-50 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase text-blue-600">Team</span></div><p class="mt-1 truncate text-xs text-slate-500">Coordinator · {{ agentById(memberTeam.coordinatorId).name }} · /{{ memberTeam.id }}</p></div><p class="text-right text-xs font-medium text-blue-700">Reusable definition</p></div>
            </div>
            <div v-else class="divide-y divide-slate-100"><div v-for="agentId in team.agents" :key="agentId" class="flex items-center gap-3 px-5 py-4"><span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agentById(agentId).initials }}</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ agentById(agentId).name }}</p><p class="mt-1 font-mono text-xs text-slate-500">/{{ agentById(agentId).name }}</p></div><span v-if="agentId === team.coordinatorId" class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><Icon icon="heroicons:key-20-solid" class="h-3.5 w-3.5" /> Coordinator</span><span v-else class="text-xs font-medium text-slate-500">Agent</span></div></div>
          </section>

          <section class="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div class="flex items-start justify-between gap-4 border-b border-amber-100 bg-amber-50/70 px-5 py-4"><div class="flex items-start gap-3"><span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-dashed border-amber-300 bg-white text-amber-700"><Icon icon="heroicons:bolt-20-solid" class="h-5 w-5" /></span><div><div class="flex items-center gap-2"><h2 class="font-bold text-slate-950">Task work</h2><span class="rounded bg-amber-100 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-amber-800">Runtime lineage</span></div><p class="mt-1 text-sm text-slate-600">Task Teams are executions created for a task, not configured children of the Org or Team definition.</p></div></div></div>
            <div class="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_12rem] md:items-center"><div><p class="text-sm font-bold text-slate-900">Accessibility evidence review</p><p class="mt-1 text-xs text-slate-500">Created by <strong>product_prototyper</strong> · anchored to Product Design scope</p><p class="mt-2 font-mono text-xs text-slate-500">task/task-accessibility-review</p></div><div class="text-left md:text-right"><span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Running</span><p class="mt-2 text-xs text-slate-500">Owned by {{ isOrg ? 'Org' : 'Team' }} run</p></div></div>
          </section>
        </div>

        <aside class="space-y-5">
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><div><h2 class="font-bold text-slate-950">Run activity</h2><p class="mt-1 text-sm text-slate-500">Recent collaboration events</p></div><span class="text-xs font-medium text-slate-400">Live</span></div><ol class="mt-5 space-y-5"><li class="relative flex gap-3 before:absolute before:left-[0.4375rem] before:top-5 before:h-[calc(100%+0.25rem)] before:w-px before:bg-slate-200"><span class="mt-1 h-3.5 w-3.5 flex-none rounded-full border-2 border-white bg-blue-500 ring-1 ring-blue-200"></span><div><p class="text-sm font-semibold text-slate-900">Entry accepted</p><p class="mt-1 text-xs leading-5 text-slate-500">{{ entryLabel }} received the initial request.</p><p class="mt-1 text-[0.6875rem] text-slate-400">31m ago</p></div></li><li class="relative flex gap-3 before:absolute before:left-[0.4375rem] before:top-5 before:h-[calc(100%+0.25rem)] before:w-px before:bg-slate-200"><span class="mt-1 h-3.5 w-3.5 flex-none rounded-full border-2 border-white bg-violet-500 ring-1 ring-violet-200"></span><div><p class="text-sm font-semibold text-slate-900">Handoff routed</p><p class="mt-1 text-xs leading-5 text-slate-500">Product Design sent approved evidence to Software Engineering.</p><p class="mt-1 text-[0.6875rem] text-slate-400">18m ago</p></div></li><li class="flex gap-3"><span class="mt-1 h-3.5 w-3.5 flex-none rounded-full border-2 border-white bg-amber-500 ring-1 ring-amber-200"></span><div><p class="text-sm font-semibold text-slate-900">Task Team created</p><p class="mt-1 text-xs leading-5 text-slate-500">Accessibility review started within this root run.</p><p class="mt-1 text-[0.6875rem] text-slate-400">7m ago</p></div></li></ol></section>
          <section class="rounded-2xl border p-5" :class="isOrg ? 'border-violet-200 bg-violet-50' : 'border-blue-200 bg-blue-50'"><div class="flex items-center gap-2" :class="isOrg ? 'text-violet-900' : 'text-blue-900'"><Icon :icon="isOrg ? 'heroicons:building-office-2-20-solid' : 'heroicons:user-group-20-solid'" class="h-5 w-5" /><h2 class="font-bold">Root identity stays explicit</h2></div><p class="mt-2 text-sm leading-6" :class="isOrg ? 'text-violet-900/80' : 'text-blue-900/80'">{{ isOrg ? 'This run is owned by an Agent Org. Direct Teams are configured placements; task Teams appear separately as runtime lineage.' : 'This is a standalone Team root. Reuse by an Org does not merge or rewrite this Team’s independent history.' }}</p></section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { agentById, orgById, teamById } from '~/prototype/aorg-flat-team-fixtures';

const route = useRoute();
const isOrg = computed(() => route.query.root !== 'team');
const org = computed(() => orgById(String(route.query.org || 'software-development-department')));
const team = computed(() => teamById(String(route.query.team || 'release-readiness-team')));
const entryParts = computed(() => String(route.query.entry || 'team:product-design-prototyping-team').split(':'));
const entryKind = computed(() => entryParts.value[0]);
const entryLabel = computed(() => {
  if (!isOrg.value) return agentById(team.value.coordinatorId).name;
  return entryKind.value === 'agent' ? agentById(entryParts.value[1]).name : teamById(entryParts.value[1]).name;
});
const entryDetail = computed(() => {
  if (!isOrg.value) return 'Direct Agent coordinator';
  return entryKind.value === 'agent' ? 'Direct Agent entry' : `Through coordinator ${agentById(teamById(entryParts.value[1]).coordinatorId).name}`;
});
const orgTeams = computed(() => org.value.members.filter((member) => member.kind === 'team').map((member) => teamById(member.ref)));
</script>
