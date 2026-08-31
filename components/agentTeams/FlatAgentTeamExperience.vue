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
        <button type="button" class="mb-5 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('team-list')">
          <Icon icon="heroicons:arrow-left-20-solid" class="mr-2 h-4 w-4" /> Back to Agent Teams
        </button>

        <header class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex min-w-0 items-start gap-4">
              <span class="inline-flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-slate-100 text-2xl font-semibold tracking-wide text-slate-700">{{ teamInitials(selectedTeam.name) }}</span>
              <div class="min-w-0">
                <h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ selectedTeam.name }}</h1>
                <span class="mt-1 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{{ selectedTeam.category }}</span>
                <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{{ selectedTeam.description }}</p>
                <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span class="rounded-full bg-slate-100 px-2.5 py-1">Members ({{ selectedTeam.agents.length }})</span>
                  <span class="rounded-full bg-slate-100 px-2.5 py-1">Coordinator: {{ agentById(selectedTeam.coordinatorId).name }}</span>
                  <span class="rounded-full bg-slate-100 px-2.5 py-1">Runs: {{ selectedTeam.runs }}</span>
                </div>
              </div>
            </div>
            <div class="flex shrink-0 gap-2">
              <button type="button" class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="openTeamRun(selectedTeam.id)">Run</button>
              <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('team-edit', selectedTeam.id)">Edit</button>
            </div>
          </div>
        </header>

        <div class="mt-4 space-y-4">
          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900">Description</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ selectedTeam.description }}</p>
            <dl class="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Coordinator</dt><dd class="mt-1 text-sm text-slate-800">{{ agentById(selectedTeam.coordinatorId).name }}</dd></div>
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Composition summary</dt><dd class="mt-1 text-sm text-slate-800">{{ selectedTeam.agents.length }} Agents</dd></div>
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Prior runs</dt><dd class="mt-1 text-sm text-slate-800">{{ selectedTeam.runs }}</dd></div>
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Last run</dt><dd class="mt-1 text-sm text-slate-800">{{ selectedTeam.lastRun }}</dd></div>
            </dl>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900">Instructions</h2>
            <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ selectedTeam.instructions }}</p>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-xl font-semibold text-slate-900">Handoffs</h2>
                <p class="mt-1 text-sm text-slate-500">Routing rules that remain with this Team wherever it runs.</p>
              </div>
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ selectedTeam.handoffs }} rules</span>
            </div>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div class="rounded-lg border border-slate-200 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">When review is ready</p>
                <p class="mt-2 text-sm font-semibold text-slate-900">Agent → coordinator</p>
                <p class="mt-1 font-mono text-xs text-slate-500">/product_prototyper</p>
              </div>
              <div class="rounded-lg border border-slate-200 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">When baseline is needed</p>
                <p class="mt-2 text-sm font-semibold text-slate-900">Coordinator → Agent</p>
                <p class="mt-1 font-mono text-xs text-slate-500">/prototype_bootstrapper</p>
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900">Members ({{ selectedTeam.agents.length }})</h2>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <article v-for="agentId in selectedTeam.agents" :key="agentId" class="rounded-lg border border-slate-200 bg-white p-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex min-w-0 items-start gap-3">
                    <span class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">{{ agentById(agentId).initials }}</span>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="truncate text-base font-semibold text-slate-900">{{ agentById(agentId).name }}</h3>
                        <span v-if="agentId === selectedTeam.coordinatorId" class="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-emerald-700">Coordinator</span>
                      </div>
                      <p class="mt-0.5 truncate text-sm text-slate-500">{{ agentById(agentId).description }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1"
                    :aria-label="`Open agent details for ${agentById(agentId).name}`"
                    :data-test="`team-member-view-${agentId}`"
                    @click="openAgentDetails(agentId)"
                  >
                    View ↗
                  </button>
                </div>
              </article>
            </div>
          </section>

          <section class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="font-semibold text-slate-900">Used by Agent Orgs</h2>
              <p class="mt-1 text-sm text-slate-500">Organizations reference this same Team definition; its coordinator, members, handoffs, and standalone history stay unchanged.</p>
            </div>
            <button type="button" class="shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-800" @click="openOrgCatalog">View Agent Orgs →</button>
          </section>
        </div>
      </template>

      <template v-else>
        <header class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ view === 'team-create' ? 'Create Agent Team' : 'Edit ' + selectedTeam.name }}</h1>
            <p class="mt-2 text-base text-slate-600">Add Agents from the library to the canvas, then assign one coordinator.</p>
          </div>
          <button type="button" class="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" @click="applyTeamTemplate">Use Template</button>
        </header>

        <form class="space-y-4" @submit.prevent="saveTeam">
          <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 class="font-semibold text-slate-900">Basics</h2>
              <div class="mt-4 grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)_minmax(0,1fr)]">
                <div class="flex items-start gap-3">
                  <span class="inline-flex h-24 w-24 flex-none items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xl font-semibold text-slate-600">{{ teamInitials(formName || 'Agent Team') }}</span>
                  <div class="pt-1">
                    <button type="button" class="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">Upload Avatar</button>
                    <p class="mt-2 text-xs text-slate-500">PNG/JPG, square recommended</p>
                  </div>
                </div>
                <label class="block">
                  <span class="text-sm font-medium text-slate-700">Team Name</span>
                  <input v-model="formName" required class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <span class="mt-1 block text-xs text-slate-500">Member names use their Agent definition names.</span>
                </label>
                <label class="block">
                  <span class="text-sm font-medium text-slate-700">Team Description</span>
                  <textarea v-model="formDescription" rows="3" class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"></textarea>
                </label>
                <label class="block lg:col-span-3">
                  <span class="text-sm font-medium text-slate-700">Category</span>
                  <select v-model="formCategory" class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <option>Product</option><option>Engineering</option><option>Operations</option>
                  </select>
                </label>
                <label class="block lg:col-span-3">
                  <span class="text-sm font-medium text-slate-700">Instructions</span>
                  <textarea v-model="formInstructions" rows="4" class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"></textarea>
                </label>
              </div>
            </div>

            <div class="mt-6 grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
              <section class="rounded-xl border border-slate-200 bg-white p-3">
                <h2 class="font-semibold text-slate-900">Agent Library</h2>
                <label class="relative mt-3 block">
                  <span class="sr-only">Search Agents</span>
                  <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input v-model="agentSearch" class="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Search agents">
                </label>
                <p class="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">My Agents</p>
                <div class="mt-2 space-y-2">
                  <button
                    v-for="agent in libraryAgents"
                    :key="agent.id"
                    type="button"
                    class="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50 disabled:cursor-default disabled:bg-slate-50"
                    :disabled="formAgents.includes(agent.id)"
                    :aria-label="formAgents.includes(agent.id) ? agent.name + ' added' : 'Add ' + agent.name"
                    @click="addAgent(agent.id)"
                  >
                    <span class="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">{{ agent.initials }}</span>
                    <span class="min-w-0 flex-1 truncate text-sm text-slate-700">{{ agent.name }}</span>
                    <span class="text-[0.625rem] font-bold uppercase text-blue-700">{{ formAgents.includes(agent.id) ? 'Added' : 'Add' }}</span>
                  </button>
                </div>
                <p class="mt-4 text-xs leading-5 text-slate-500">Only Agent definitions are available. Teams and Orgs cannot be added as members.</p>
              </section>

              <section class="rounded-xl border border-slate-200 bg-white p-3">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h2 class="font-semibold text-slate-900">Team Canvas</h2>
                    <p class="mt-1 text-xs text-slate-500">Added from Agent Library → Canvas</p>
                  </div>
                  <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white font-semibold">{{ teamInitials(formName || 'Agent Team') }}</span>
                    {{ formName || 'Untitled Team' }}
                  </span>
                </div>
                <div class="mt-4 grid grid-cols-[minmax(0,1fr)_7rem_2.5rem] gap-3 border-b border-slate-200 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>Agent</span><span class="text-center">Coordinator</span><span></span>
                </div>
                <ul v-if="formAgents.length" class="divide-y divide-slate-100">
                  <li v-for="agentId in formAgents" :key="agentId" class="grid grid-cols-[minmax(0,1fr)_7rem_2.5rem] items-center gap-3 py-3">
                    <div class="flex min-w-0 items-center gap-3">
                      <span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">{{ agentById(agentId).initials }}</span>
                      <div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">{{ agentById(agentId).name }}</p><p class="truncate text-xs text-slate-500">Agent definition</p></div>
                    </div>
                    <label class="flex justify-center"><input v-model="formCoordinator" type="radio" :value="agentId" class="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" :aria-label="'Make ' + agentById(agentId).name + ' coordinator'"></label>
                    <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40" :disabled="formAgents.length <= 1" :aria-label="'Remove ' + agentById(agentId).name" @click="removeAgent(agentId)"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button>
                  </li>
                </ul>
                <div v-else class="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">Add Agents from the library to build your Team.</div>
              </section>

              <section class="rounded-xl border border-slate-200 bg-white p-3">
                <h2 class="font-semibold text-slate-900">Member Details</h2>
                <div class="mt-4 rounded-lg border border-slate-200 p-4">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">{{ agentById(formCoordinator).initials }}</span>
                    <div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">{{ agentById(formCoordinator).name }}</p><p class="text-xs text-slate-500">Selected coordinator</p></div>
                  </div>
                  <dl class="mt-4 space-y-3 text-sm">
                    <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Type</dt><dd class="mt-1 text-slate-800">Agent</dd></div>
                    <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt><dd class="mt-1 text-slate-800">Coordinator</dd></div>
                    <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt><dd class="mt-1 font-medium text-emerald-700">Enabled</dd></div>
                  </dl>
                </div>
              </section>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="font-semibold text-slate-900">LLM config</h2>
            <p class="mt-1 text-sm text-slate-500">Optional runtime, model, and LLM settings.</p>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <label><span class="text-sm font-medium text-slate-700">Runtime</span><select class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"><option>Choose when launching</option><option>AutoByteus</option></select></label>
              <label><span class="text-sm font-medium text-slate-700">Model</span><select class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"><option>Select a model</option></select></label>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div><h2 class="font-semibold text-slate-900">Handoffs</h2><p class="mt-1 text-sm text-slate-500">Routing rules remain unchanged when an Organization references this Team.</p></div>
            <div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{{ selectedTeam.handoffs }} existing Agent-to-Agent rules will be preserved.</div>
          </section>

          <footer class="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span :class="formName.trim() ? 'text-emerald-700' : 'text-slate-500'">{{ formName.trim() ? '●' : '○' }} Team Name</span>
              <span :class="formAgents.length ? 'text-emerald-700' : 'text-slate-500'">{{ formAgents.length ? '●' : '○' }} At least 1 member</span>
              <span :class="formCoordinator ? 'text-emerald-700' : 'text-slate-500'">{{ formCoordinator ? '●' : '○' }} Coordinator</span>
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="go('team-list')">Cancel</button>
              <button type="submit" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">{{ view === 'team-create' ? 'Create Team' : 'Save Changes' }}</button>
            </div>
          </footer>
          <p v-if="saved" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800" role="status">Saved locally for this prototype.</p>
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
const agentSearch = ref('');

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
const formInstructions = ref('Coordinate work through the selected Agent coordinator.');
const formAgents = ref([...selectedTeam.value.agents]);
const formCoordinator = ref(selectedTeam.value.coordinatorId);
const libraryAgents = computed(() => {
  const query = agentSearch.value.trim().toLowerCase();
  return query ? agents.filter((agent) => `${agent.name} ${agent.description}`.toLowerCase().includes(query)) : agents;
});

watch([view, selectedTeam], () => {
  if (view.value === 'team-create') {
    formName.value = 'Customer Insight Team';
    formCategory.value = 'Product';
    formDescription.value = 'Synthesizes customer evidence into actionable product findings.';
    formInstructions.value = 'Coordinate research and prototype work through the selected Agent coordinator.';
    formAgents.value = ['product-prototyper', 'requirements-engineer'];
    formCoordinator.value = 'product-prototyper';
  } else {
    formName.value = selectedTeam.value.name;
    formCategory.value = selectedTeam.value.category;
    formDescription.value = selectedTeam.value.description;
    formInstructions.value = 'Coordinate work through the selected Agent coordinator while preserving its handoff rules.';
    formAgents.value = [...selectedTeam.value.agents];
    formCoordinator.value = selectedTeam.value.coordinatorId;
  }
  saved.value = false;
  agentSearch.value = '';
}, { immediate: true });

const applyTeamTemplate = (): void => {
  formName.value = 'Customer Insight Team';
  formCategory.value = 'Product';
  formDescription.value = 'Synthesizes customer evidence into actionable product findings.';
  formInstructions.value = 'Coordinate research and synthesis through the selected Agent coordinator.';
  formAgents.value = ['product-prototyper', 'requirements-engineer'];
  formCoordinator.value = 'product-prototyper';
};

const go = async (nextView: TeamView, id?: string): Promise<void> => {
  await router.push({ path: '/agent-teams', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: nextView, ...(id ? { id } : {}) } });
};
const openOrgCatalog = async (): Promise<void> => {
  await router.push({ path: '/agent-orgs', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: 'org-list' } });
};
const openTeamRun = async (id: string): Promise<void> => {
  await router.push({ path: '/workspace', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, root: 'team', team: id } });
};
const openAgentDetails = async (id: string): Promise<void> => {
  await router.push({
    path: '/agents',
    query: {
      prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY,
      view: 'detail',
      id,
      returnToTeam: selectedTeam.value.id,
    },
  });
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
