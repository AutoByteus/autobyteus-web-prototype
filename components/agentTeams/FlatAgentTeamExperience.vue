<template>
  <div class="h-full overflow-auto bg-slate-50" data-test="flat-agent-team-experience">
    <div class="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <template v-if="view === 'team-list'">
        <header class="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <h1 class="sr-only">Agent Teams</h1>
          <label class="relative min-w-0 flex-1 rounded-lg border border-slate-200 bg-white shadow-sm">
            <span class="sr-only">Search Agent Teams</span>
            <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="search"
              class="block w-full rounded-lg border-transparent bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Search teams by name"
            >
          </label>
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              :class="reloading ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'"
              :disabled="reloading"
              @click="reloadTeams"
            >
              <Icon icon="heroicons:arrow-path-20-solid" class="mr-2 h-4 w-4" :class="{ 'animate-spin': reloading }" />
              {{ reloading ? 'Reloading…' : 'Reload' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              data-test="create-team"
              @click="go('team-create')"
            >
              Create Team
            </button>
          </div>
        </header>

        <div v-if="catalogSections.length > 0" class="space-y-8">
          <section v-for="section in catalogSections" :key="section.id">
            <div v-if="section.title" class="mb-3">
              <h2 class="text-xl font-semibold text-slate-900">{{ section.title }}</h2>
              <p v-if="section.description" class="mt-1 text-sm text-slate-500">{{ section.description }}</p>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article
                v-for="team in section.teams"
                :key="team.id"
                class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                :data-test="`team-card-${team.id}`"
              >
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-700">
                    <span class="text-2xl font-semibold tracking-wide">{{ teamInitials(team.name) }}</span>
                  </div>
                  <div class="min-w-0">
                    <h3 class="truncate text-xl font-semibold text-slate-900">{{ team.name }}</h3>
                    <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ team.description }}</p>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{{ team.category }}</span>
                    </div>
                  </div>
                  <div class="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
                    <button type="button" class="inline-flex min-w-[104px] justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="openTeamRun(team.id)">Run</button>
                    <button type="button" class="inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="go('team-detail', team.id)">View Details <span class="ml-1" aria-hidden="true">→</span></button>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    v-for="agentId in team.agents"
                    :key="agentId"
                    class="inline-flex max-w-[14rem] items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                  >
                    <span class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/80 text-[0.625rem] font-semibold">{{ agentById(agentId).initials.slice(0, 1) }}</span>
                    <span class="truncate">{{ agentById(agentId).name }}</span>
                  </span>
                </div>

                <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 text-xs text-slate-600 sm:grid-cols-3">
                  <div>
                    <dt class="font-medium text-slate-500">Coordinator</dt>
                    <dd class="mt-0.5 truncate text-sm text-slate-800">{{ agentById(team.coordinatorId).name }}</dd>
                  </div>
                  <div>
                    <dt class="font-medium text-slate-500">Members</dt>
                    <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ team.agents.length }}</dd>
                  </div>
                  <div>
                    <dt class="font-medium text-slate-500">Runs</dt>
                    <dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ team.runs }}</dd>
                  </div>
                </dl>
              </article>
            </div>
          </section>
        </div>
        <div v-else class="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm">
          <p class="text-lg font-medium text-slate-500">No teams found</p>
          <p class="mt-2 text-sm text-slate-400">No teams matched “{{ search.trim() }}”</p>
        </div>
      </template>

      <template v-else-if="view === 'team-detail'">
        <button type="button" class="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950" @click="go('team-list')">
          <Icon icon="heroicons:arrow-left-20-solid" class="h-4 w-4" /> Back to Agent Teams
        </button>

        <header class="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex min-w-0 items-start gap-4">
            <span class="inline-flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Icon icon="heroicons:user-group-20-solid" class="h-7 w-7" />
            </span>
            <div class="min-w-0">
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Agent Team</span>
                <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Standalone & reusable</span>
              </div>
              <h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ selectedTeam.name }}</h1>
              <p class="mt-2 max-w-3xl text-base leading-6 text-slate-600">{{ selectedTeam.description }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="go('team-edit', selectedTeam.id)">Edit Team</button>
            <button type="button" class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" @click="openTeamRun(selectedTeam.id)">Run Team</button>
          </div>
        </header>

        <div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div class="space-y-6">
            <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 class="font-bold text-slate-950">Agents</h2>
                  <p class="mt-0.5 text-sm text-slate-500">Direct members of this Team</p>
                </div>
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ selectedTeam.agents.length }} Agents</span>
              </div>
              <ul class="divide-y divide-slate-100">
                <li v-for="agentId in selectedTeam.agents" :key="agentId" class="flex items-center gap-3 px-5 py-4">
                  <span class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">{{ agentById(agentId).initials }}</span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-semibold text-slate-900">{{ agentById(agentId).name }}</p>
                    <p class="truncate text-sm text-slate-500">{{ agentById(agentId).description }}</p>
                  </div>
                  <span v-if="agentId === selectedTeam.coordinatorId" class="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    <Icon icon="heroicons:key-20-solid" class="h-3.5 w-3.5" /> Coordinator
                  </span>
                  <span v-else class="text-xs font-medium text-slate-500">Agent</span>
                </li>
              </ul>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h2 class="font-bold text-slate-950">Team-local handoffs</h2>
                  <p class="mt-1 text-sm text-slate-500">These rules stay with this reusable Team wherever it runs.</p>
                </div>
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ selectedTeam.handoffs }} rules</span>
              </div>
              <div class="mt-4 grid gap-3 md:grid-cols-2">
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">When review is ready</p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">Agent → coordinator</p>
                  <p class="mt-1 font-mono text-xs text-slate-500">/product_prototyper</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">When baseline is needed</p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">Coordinator → Agent</p>
                  <p class="mt-1 font-mono text-xs text-slate-500">/prototype_bootstrapper</p>
                </div>
              </div>
            </section>
          </div>

          <aside class="space-y-4">
            <section class="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <div class="flex items-center gap-2 text-blue-800">
                <Icon icon="heroicons:arrow-path-rounded-square-20-solid" class="h-5 w-5" />
                <h2 class="font-bold">Reusable by reference</h2>
              </div>
              <p class="mt-2 text-sm leading-6 text-blue-800/80">Agent Orgs reference this exact Team. Its Agents, coordinator, handoffs, standalone launch, and prior history stay unchanged.</p>
              <button type="button" class="mt-4 text-sm font-semibold text-blue-800 hover:underline" @click="openOrgCatalog">View Agent Orgs using this Team</button>
            </section>
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="font-bold text-slate-950">Team facts</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between gap-4"><dt class="text-slate-500">Category</dt><dd class="font-semibold text-slate-900">{{ selectedTeam.category }}</dd></div>
                <div class="flex justify-between gap-4"><dt class="text-slate-500">Prior runs</dt><dd class="font-semibold text-slate-900">{{ selectedTeam.runs }}</dd></div>
                <div class="flex justify-between gap-4"><dt class="text-slate-500">Last run</dt><dd class="font-semibold text-slate-900">{{ selectedTeam.lastRun }}</dd></div>
                <div class="flex justify-between gap-4"><dt class="text-slate-500">Nested Teams</dt><dd class="font-semibold text-emerald-700">Not supported</dd></div>
              </dl>
            </section>
          </aside>
        </div>
      </template>

      <template v-else>
        <button type="button" class="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950" @click="go('team-list')">
          <Icon icon="heroicons:arrow-left-20-solid" class="h-4 w-4" /> Back to Agent Teams
        </button>
        <header class="mb-6">
          <p class="text-sm font-semibold text-blue-700">{{ view === 'team-create' ? 'New reusable Team' : 'Edit Agent Team' }}</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-950">{{ view === 'team-create' ? 'Create Agent Team' : selectedTeam.name }}</h1>
          <p class="mt-2 max-w-3xl text-base text-slate-600">Choose direct Agents and exactly one coordinator. Teams and Orgs cannot be added as Team members.</p>
        </header>

        <form class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]" @submit.prevent="saveTeam">
          <div class="space-y-6">
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="font-bold text-slate-950">Team details</h2>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <label class="block md:col-span-1">
                  <span class="text-sm font-semibold text-slate-700">Name</span>
                  <input v-model="formName" required class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                </label>
                <label class="block md:col-span-1">
                  <span class="text-sm font-semibold text-slate-700">Category</span>
                  <select v-model="formCategory" class="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <option>Product</option><option>Engineering</option><option>Operations</option>
                  </select>
                </label>
                <label class="block md:col-span-2">
                  <span class="text-sm font-semibold text-slate-700">Description</span>
                  <textarea v-model="formDescription" rows="3" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"></textarea>
                </label>
              </div>
            </section>

            <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 class="font-bold text-slate-950">Agents and coordinator</h2>
                  <p class="mt-1 text-sm text-slate-500">Select one direct Agent as the Team's single entry coordinator.</p>
                </div>
                <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="showAgentPicker = !showAgentPicker">
                  <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" /> Add Agent
                </button>
              </div>

              <div v-if="showAgentPicker" class="border-b border-blue-100 bg-blue-50 px-5 py-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">Available Agents</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button v-for="agent in availableAgents" :key="agent.id" type="button" class="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100" @click="addAgent(agent.id)">+ {{ agent.name }}</button>
                  <span v-if="availableAgents.length === 0" class="text-sm text-blue-800">All available Agents are already members.</span>
                </div>
              </div>

              <div class="grid grid-cols-[minmax(0,1fr)_8rem_2.5rem] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Agent</span><span class="text-center">Coordinator</span><span></span>
              </div>
              <ul class="divide-y divide-slate-100">
                <li v-for="agentId in formAgents" :key="agentId" class="grid grid-cols-[minmax(0,1fr)_8rem_2.5rem] items-center gap-3 px-5 py-3.5">
                  <div class="flex min-w-0 items-center gap-3">
                    <span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agentById(agentId).initials }}</span>
                    <div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">{{ agentById(agentId).name }}</p><p class="truncate text-xs text-slate-500">Agent definition</p></div>
                  </div>
                  <label class="flex justify-center"><input v-model="formCoordinator" type="radio" :value="agentId" class="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" :aria-label="`Make ${agentById(agentId).name} coordinator`"></label>
                  <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600" :disabled="formAgents.length <= 1" @click="removeAgent(agentId)"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button>
                </li>
              </ul>
              <div class="flex items-start gap-2 border-t border-emerald-100 bg-emerald-50 px-5 py-3 text-sm text-emerald-800">
                <Icon icon="heroicons:check-circle-20-solid" class="mt-0.5 h-4 w-4 flex-none" />
                <p><strong>Flat by design.</strong> Only Agent definitions appear in this picker; Team-in-Team and Org-in-Team membership are not available.</p>
              </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between gap-4"><div><h2 class="font-bold text-slate-950">Team-local handoffs</h2><p class="mt-1 text-sm text-slate-500">Rules remain part of this Team when an Org references it.</p></div><button type="button" class="text-sm font-semibold text-blue-700">Add rule</button></div>
              <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">2 existing Agent-to-Agent rules will be preserved.</div>
            </section>

            <div class="flex justify-end gap-3">
              <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700" @click="go('team-list')">Cancel</button>
              <button type="submit" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">{{ view === 'team-create' ? 'Create Team' : 'Save changes' }}</button>
            </div>
          </div>

          <aside class="space-y-4">
            <section class="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <Icon icon="heroicons:user-group-20-solid" class="h-6 w-6 text-blue-700" />
              <h2 class="mt-3 font-bold text-blue-950">What makes this a Team?</h2>
              <ul class="mt-3 space-y-2 text-sm leading-5 text-blue-900/80">
                <li>• Direct Agent members only</li>
                <li>• Exactly one direct Agent coordinator</li>
                <li>• Independently launchable</li>
                <li>• Reusable by reference in Agent Orgs</li>
              </ul>
            </section>
            <section v-if="saved" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-800" role="status">Saved locally for this prototype.</section>
          </aside>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { agents, flatTeams, agentById, teamById } from '~/prototype/aorg-flat-team-fixtures';
import { AGENT_ORG_PROTOTYPE_REVIEW_KEY } from '~/composables/useAgentOrgPrototypeReview';

type TeamView = 'team-list' | 'team-detail' | 'team-create' | 'team-edit';
const route = useRoute();
const router = useRouter();
const search = ref('');
const reloading = ref(false);
const saved = ref(false);
const showAgentPicker = ref(false);

const view = computed<TeamView>(() => {
  const candidate = String(route.query.view || 'team-list') as TeamView;
  return ['team-list', 'team-detail', 'team-create', 'team-edit'].includes(candidate) ? candidate : 'team-list';
});
const selectedTeam = computed(() => teamById(String(route.query.id || flatTeams[0].id)));
const filteredTeams = computed(() => {
  const query = search.value.trim().toLowerCase();
  return query ? flatTeams.filter((team) => `${team.name} ${team.description}`.toLowerCase().includes(query)) : flatTeams;
});
const catalogSections = computed(() => {
  if (search.value.trim()) {
    return filteredTeams.value.length > 0 ? [{ id: 'search', title: '', description: '', teams: filteredTeams.value }] : [];
  }
  return [
    { id: 'featured', title: 'Featured teams', description: 'Recommended team workflows.', teams: flatTeams.slice(0, 2) },
    { id: 'all', title: 'All teams', description: '', teams: flatTeams.slice(2) },
  ].filter((section) => section.teams.length > 0);
});
const teamInitials = (name: string): string => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'AT';
const reloadTeams = (): void => {
  reloading.value = true;
  window.setTimeout(() => { reloading.value = false; }, 450);
};

const formName = ref(selectedTeam.value.name);
const formCategory = ref(selectedTeam.value.category);
const formDescription = ref(selectedTeam.value.description);
const formAgents = ref([...selectedTeam.value.agents]);
const formCoordinator = ref(selectedTeam.value.coordinatorId);
const availableAgents = computed(() => agents.filter((agent) => !formAgents.value.includes(agent.id)));

watch([view, selectedTeam], () => {
  if (view.value === 'team-create') {
    formName.value = 'Customer Insight Team';
    formCategory.value = 'Product';
    formDescription.value = 'A reusable Team for synthesizing customer evidence into actionable product findings.';
    formAgents.value = ['product-prototyper', 'requirements-engineer'];
    formCoordinator.value = 'product-prototyper';
  } else {
    formName.value = selectedTeam.value.name;
    formCategory.value = selectedTeam.value.category;
    formDescription.value = selectedTeam.value.description;
    formAgents.value = [...selectedTeam.value.agents];
    formCoordinator.value = selectedTeam.value.coordinatorId;
  }
  saved.value = false;
  showAgentPicker.value = false;
}, { immediate: true });

const go = async (nextView: TeamView, id?: string): Promise<void> => {
  await router.push({ path: '/agent-teams', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: nextView, ...(id ? { id } : {}) } });
};
const openOrgCatalog = async (): Promise<void> => {
  await router.push({ path: '/agent-orgs', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: 'org-list' } });
};
const openTeamRun = async (id: string): Promise<void> => {
  await router.push({ path: '/workspace', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, root: 'team', team: id } });
};
const addAgent = (id: string): void => {
  if (!formAgents.value.includes(id)) formAgents.value.push(id);
};
const removeAgent = (id: string): void => {
  formAgents.value = formAgents.value.filter((candidate) => candidate !== id);
  if (formCoordinator.value === id) formCoordinator.value = formAgents.value[0] || '';
};
const saveTeam = (): void => {
  saved.value = true;
  window.setTimeout(() => void go('team-detail', view.value === 'team-create' ? flatTeams[0].id : selectedTeam.value.id), 450);
};
</script>
