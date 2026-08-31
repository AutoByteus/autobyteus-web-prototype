<template>
  <div class="h-full overflow-auto bg-slate-50" data-test="agent-org-experience">
    <div class="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <template v-if="view === 'org-list'">
        <header class="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <h1 class="sr-only">Agent Orgs</h1>
          <label class="relative min-w-0 flex-1 rounded-lg border border-slate-200 bg-white shadow-sm">
            <span class="sr-only">Search Agent Orgs</span>
            <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="search" class="block w-full rounded-lg border-transparent bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Search organizations by name">
          </label>
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              :class="reloading ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'"
              :disabled="reloading"
              @click="reloadOrgs"
            >
              <Icon icon="heroicons:arrow-path-20-solid" class="mr-2 h-4 w-4" :class="{ 'animate-spin': reloading }" />
              {{ reloading ? 'Reloading…' : 'Reload' }}
            </button>
            <button type="button" class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-test="create-org" @click="go('org-create')">
              Create Agent Org
            </button>
          </div>
        </header>

        <div v-if="catalogSections.length > 0" class="space-y-8">
          <section v-for="section in catalogSections" :key="section.id">
            <h2 v-if="section.title" class="mb-3 text-xl font-semibold text-slate-900">{{ section.title }}</h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article v-for="org in section.orgs" :key="org.id" class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md" :data-test="`org-card-${org.id}`">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-700">
                    <span class="text-2xl font-semibold tracking-wide">{{ orgInitials(org.name) }}</span>
                  </div>
                  <div class="min-w-0">
                    <h3 class="truncate text-xl font-semibold text-slate-900">{{ org.name }}</h3>
                    <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ org.description }}</p>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{{ org.category }}</span>
                    </div>
                  </div>
                  <div class="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
                    <button type="button" class="inline-flex min-w-[104px] justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="openLaunch(org.id)">Run</button>
                    <button type="button" class="inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" @click="go('org-detail', org.id)">View Details <span class="ml-1" aria-hidden="true">→</span></button>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span v-for="member in org.members" :key="`${member.kind}-${member.ref}`" :data-test="`org-member-${member.kind}-${member.ref}`" class="inline-flex max-w-[14rem] items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium" :class="member.kind === 'team' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700'" :aria-label="`${member.kind === 'team' ? 'Team' : 'Agent'} ${member.kind === 'team' ? teamById(member.ref).name : agentById(member.ref).name}`">
                    <Icon :icon="member.kind === 'team' ? 'heroicons:user-group-20-solid' : 'heroicons:user-20-solid'" class="h-4 w-4 flex-none" />
                    <span class="truncate">{{ member.kind === 'team' ? teamById(member.ref).name : agentById(member.ref).name }}</span>
                  </span>
                </div>

                <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 text-xs text-slate-600 sm:grid-cols-4">
                  <div><dt class="font-medium text-slate-500">Agents</dt><dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ memberCounts(org).agents }}</dd></div>
                  <div><dt class="font-medium text-slate-500">Teams</dt><dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ memberCounts(org).teams }}</dd></div>
                  <div><dt class="font-medium text-slate-500">Handoffs</dt><dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ org.handoffs }}</dd></div>
                  <div><dt class="font-medium text-slate-500">Runs</dt><dd class="mt-0.5 text-sm font-semibold text-slate-800">{{ org.runs }}</dd></div>
                </dl>
              </article>
            </div>
          </section>
        </div>
        <div v-else class="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm">
          <p class="text-lg font-medium text-slate-500">No organizations found</p>
          <p class="mt-2 text-sm text-slate-400">No organizations matched “{{ search.trim() }}”</p>
        </div>
      </template>

      <template v-else-if="view === 'org-detail'">
        <button type="button" class="mb-5 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-list')"><Icon icon="heroicons:arrow-left-20-solid" class="mr-2 h-4 w-4" /> Back to Agent Orgs</button>
        <header class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex min-w-0 items-start gap-4">
              <span class="inline-flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-slate-100 text-2xl font-semibold tracking-wide text-slate-700">{{ orgInitials(selectedOrg.name) }}</span>
              <div class="min-w-0">
                <h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ selectedOrg.name }}</h1>
                <span class="mt-1 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{{ selectedOrg.category }}</span>
                <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{{ selectedOrg.description }}</p>
                <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span class="rounded-full bg-slate-100 px-2.5 py-1">Agents: {{ directAgents.length }}</span>
                  <span class="rounded-full bg-slate-100 px-2.5 py-1">Teams: {{ referencedTeams.length }}</span>
                  <span class="rounded-full bg-slate-100 px-2.5 py-1">Runs: {{ selectedOrg.runs }}</span>
                </div>
              </div>
            </div>
            <div class="flex shrink-0 gap-2">
              <button type="button" class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-test="run-organization" @click="openLaunch(selectedOrg.id)">Run</button>
              <button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-edit', selectedOrg.id)">Edit</button>
            </div>
          </div>
        </header>

        <div class="mt-4 space-y-4">
          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900">Description</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ selectedOrg.description }}</p>
            <dl class="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Agents</dt><dd class="mt-1 text-sm text-slate-800">{{ directAgents.length }}</dd></div>
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Teams</dt><dd class="mt-1 text-sm text-slate-800">{{ referencedTeams.length }}</dd></div>
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Handoffs</dt><dd class="mt-1 text-sm text-slate-800">{{ selectedOrg.handoffs }}</dd></div>
              <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Last run</dt><dd class="mt-1 text-sm text-slate-800">{{ selectedOrg.lastRun }}</dd></div>
            </dl>
          </section>

          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 px-5 py-4"><h2 class="text-xl font-semibold text-slate-900">Members</h2></div>
            <div class="grid divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <div class="p-5">
                <div class="mb-4 flex items-center gap-2"><Icon icon="heroicons:user-20-solid" class="h-5 w-5 text-slate-500" /><h3 class="font-semibold text-slate-900">Agents ({{ directAgents.length }})</h3></div>
                <ul class="space-y-3"><li v-for="agent in directAgents" :key="agent.id" class="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agent.initials }}</span><div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">{{ agent.name }}</p><p class="text-xs text-slate-500">/{{ agent.name }}</p></div></li></ul>
              </div>
              <div class="p-5">
                <div class="mb-4 flex items-center gap-2"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5 text-blue-600" /><h3 class="font-semibold text-slate-900">Teams ({{ referencedTeams.length }})</h3></div>
                <ul class="space-y-3"><li v-for="team in referencedTeams" :key="team.id" class="rounded-lg border border-blue-200 bg-blue-50/50 p-3"><div class="flex items-center gap-3"><span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5" /></span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ team.name }}</p><p class="truncate text-xs text-slate-500">Coordinator: {{ agentById(team.coordinatorId).name }}</p></div><button type="button" class="text-xs font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="openTeam(team.id)">View ↗</button></div><p class="mt-2 text-xs text-blue-800">Same Team definition · standalone history preserved</p></li></ul>
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-start justify-between gap-4"><div><h2 class="text-xl font-semibold text-slate-900">Handoffs</h2><p class="mt-1 text-sm text-slate-500">Routing rules between this organization's members.</p></div><span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ selectedOrg.handoffs }} rules</span></div>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div class="rounded-lg border border-slate-200 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Requirements ready</p><p class="mt-2 text-sm font-semibold text-slate-900">requirements_engineer → Product Design Team</p><p class="mt-1 font-mono text-xs text-slate-500">/product_design_prototyping_team</p></div>
              <div class="rounded-lg border border-slate-200 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Prototype approved</p><p class="mt-2 text-sm font-semibold text-slate-900">product_prototyper → Software Engineering Team</p><p class="mt-1 font-mono text-xs text-slate-500">/software_engineering_team</p></div>
            </div>
          </section>
        </div>
      </template>

      <template v-else>
        <button type="button" class="mb-5 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-list')"><Icon icon="heroicons:arrow-left-20-solid" class="mr-2 h-4 w-4" /> Back to Agent Orgs</button>
        <header class="mb-6"><h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ view === 'org-create' ? 'Create Agent Org' : 'Edit ' + selectedOrg.name }}</h1><p class="mt-2 max-w-3xl text-base text-slate-600">Add Agents and Teams, then configure handoffs.</p></header>
        <form class="space-y-4" @submit.prevent="saveOrg">
          <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 class="font-semibold text-slate-900">Basics</h2><div class="mt-4 grid gap-4 md:grid-cols-2"><label><span class="text-sm font-medium text-slate-700">Name</span><input v-model="formName" required class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"></label><label><span class="text-sm font-medium text-slate-700">Category</span><select v-model="formCategory" class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"><option>Department</option><option>Program</option><option>Organization</option></select></label><label class="md:col-span-2"><span class="text-sm font-medium text-slate-700">Description</span><textarea v-model="formDescription" rows="3" class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"></textarea></label></div></section>

          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 px-5 py-4"><h2 class="text-xl font-semibold text-slate-900">Members</h2></div>
            <div class="grid lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
              <div class="p-5"><div class="flex items-center justify-between gap-4"><h3 class="font-semibold text-slate-900">Agents</h3><button type="button" class="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Icon icon="heroicons:plus-20-solid" class="h-4 w-4" /> Add Agent</button></div><ul class="mt-4 space-y-2"><li v-for="agentId in formAgentIds" :key="agentId" class="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agentById(agentId).initials }}</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ agentById(agentId).name }}</p><p class="text-xs text-slate-500">/{{ agentById(agentId).name }}</p></div><button type="button" class="rounded text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="`Remove ${agentById(agentId).name}`"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button></li></ul></div>
              <div class="p-5"><div class="flex items-center justify-between gap-4"><h3 class="font-semibold text-slate-900">Teams</h3><button type="button" class="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Icon icon="heroicons:plus-20-solid" class="h-4 w-4" /> Add Team</button></div><ul class="mt-4 space-y-2"><li v-for="teamId in formTeamIds" :key="teamId" class="rounded-lg border border-blue-200 bg-blue-50/50 p-3"><div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-4 w-4" /></span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ teamById(teamId).name }}</p><p class="truncate text-xs text-slate-500">Coordinator: {{ agentById(teamById(teamId).coordinatorId).name }}</p></div><button type="button" class="rounded text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="`Remove ${teamById(teamId).name}`"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button></div><p class="mt-2 text-[0.6875rem] font-semibold text-blue-700">Same definition · prior history retained</p></li></ul></div>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex items-center justify-between gap-4"><div><h2 class="text-xl font-semibold text-slate-900">Handoffs</h2><p class="mt-1 text-sm text-slate-500">Routing rules between this organization's members.</p></div><button type="button" class="text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Add rule</button></div><div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">8 rules</div></section>
          <section v-if="saved" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800" role="status">Saved locally for this prototype.</section>
          <div class="flex justify-end gap-3"><button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="go('org-list')">Cancel</button><button type="submit" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{{ view === 'org-create' ? 'Create Org' : 'Save changes' }}</button></div>
        </form>
      </template>
    </div>

    <div v-if="launchOpen" class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4" data-test="org-launch-modal" @click.self="closeLaunch">
      <section role="dialog" aria-modal="true" aria-labelledby="launch-title" class="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5"><div><h2 id="launch-title" class="text-2xl font-bold text-slate-950">Choose an entry</h2><p class="mt-2 text-sm leading-6 text-slate-600">Select the Agent or Team that should receive the first message.</p></div><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label="Close" @click="closeLaunch"><Icon icon="heroicons:x-mark-20-solid" class="h-5 w-5" /></button></header>
        <div class="space-y-5 px-6 py-5">
          <fieldset><legend class="mb-3 text-sm font-bold text-slate-900">Agents</legend><div class="grid gap-3 sm:grid-cols-2"><label v-for="agent in launchAgents" :key="agent.id" class="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition" :class="entry === `agent:${agent.id}` ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/15' : 'border-slate-200 hover:border-slate-300'"><input v-model="entry" type="radio" :value="`agent:${agent.id}`" class="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"><span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agent.initials }}</span><span class="min-w-0"><span class="block truncate text-sm font-semibold text-slate-900">{{ agent.name }}</span><span class="block text-xs text-slate-500">Agent</span></span></label></div></fieldset>
          <fieldset><legend class="mb-3 text-sm font-bold text-slate-900">Teams</legend><div class="grid gap-3 sm:grid-cols-2"><label v-for="team in launchTeams" :key="team.id" class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition" :class="entry === `team:${team.id}` ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/15' : 'border-slate-200 hover:border-slate-300'"><input v-model="entry" type="radio" :value="`team:${team.id}`" class="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"><span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5" /></span><span class="min-w-0"><span class="block truncate text-sm font-semibold text-slate-900">{{ team.name }}</span><span class="mt-1 block text-xs leading-5 text-slate-500">Starts through <strong class="text-slate-700">{{ agentById(team.coordinatorId).name }}</strong></span></span></label></div></fieldset>
          <div v-if="entry" class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status"><Icon icon="heroicons:check-circle-20-solid" class="mt-0.5 h-5 w-5 flex-none text-emerald-600" /><p><strong>Selected:</strong> {{ selectedEntrySummary }}</p></div>
        </div>
        <footer class="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4"><button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="closeLaunch">Cancel</button><button type="button" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300" :disabled="!entry" data-test="start-org-run" @click="startRun">Start run</button></footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { agentOrgs, agentById, teamById, orgById, type AgentOrgFixture } from '~/prototype/aorg-flat-team-fixtures';
import { AGENT_ORG_PROTOTYPE_REVIEW_KEY } from '~/composables/useAgentOrgPrototypeReview';

type OrgView = 'org-list' | 'org-detail' | 'org-create' | 'org-edit';
const route = useRoute();
const router = useRouter();
const search = ref('');
const reloading = ref(false);
const entry = ref('');
const saved = ref(false);
const view = computed<OrgView>(() => {
  const candidate = String(route.query.view || 'org-list') as OrgView;
  return ['org-list', 'org-detail', 'org-create', 'org-edit'].includes(candidate) ? candidate : 'org-list';
});
const selectedOrg = computed(() => orgById(String(route.query.id || agentOrgs[0].id)));
const filteredOrgs = computed(() => {
  const query = search.value.trim().toLowerCase();
  return query ? agentOrgs.filter((org) => `${org.name} ${org.description}`.toLowerCase().includes(query)) : agentOrgs;
});
const catalogSections = computed(() => {
  if (search.value.trim()) {
    return filteredOrgs.value.length > 0 ? [{ id: 'search', title: '', orgs: filteredOrgs.value }] : [];
  }
  return [
    { id: 'featured', title: 'Featured organizations', orgs: agentOrgs },
  ].filter((section) => section.orgs.length > 0);
});
const orgInitials = (name: string): string => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'AO';
const reloadOrgs = (): void => {
  reloading.value = true;
  window.setTimeout(() => { reloading.value = false; }, 450);
};
const directAgents = computed(() => selectedOrg.value.members.filter((member) => member.kind === 'agent').map((member) => agentById(member.ref)));
const referencedTeams = computed(() => selectedOrg.value.members.filter((member) => member.kind === 'team').map((member) => teamById(member.ref)));
const launchOpen = computed(() => route.query.launch === '1');
const launchOrg = computed(() => orgById(String(route.query.id || selectedOrg.value.id)));
const launchAgents = computed(() => launchOrg.value.members.filter((member) => member.kind === 'agent').map((member) => agentById(member.ref)));
const launchTeams = computed(() => launchOrg.value.members.filter((member) => member.kind === 'team').map((member) => teamById(member.ref)));
const selectedEntrySummary = computed(() => {
  const [kind, id] = entry.value.split(':');
  if (kind === 'agent') return `${agentById(id).name} as a direct Agent`;
  if (kind === 'team') return `${teamById(id).name} through ${agentById(teamById(id).coordinatorId).name}`;
  return '';
});

const formName = ref(selectedOrg.value.name);
const formCategory = ref(selectedOrg.value.category);
const formDescription = ref(selectedOrg.value.description);
const formAgentIds = ref(['requirements-engineer']);
const formTeamIds = ref(['product-design-prototyping-team', 'software-engineering-team']);
watch([view, selectedOrg], () => {
  const org = selectedOrg.value;
  formName.value = view.value === 'org-create' ? 'Customer Experience Organization' : org.name;
  formCategory.value = view.value === 'org-create' ? 'Program' : org.category;
  formDescription.value = view.value === 'org-create' ? 'A focused collaboration scope combining reusable Teams with an independent requirements Agent.' : org.description;
  formAgentIds.value = org.members.filter((member) => member.kind === 'agent').map((member) => member.ref);
  formTeamIds.value = org.members.filter((member) => member.kind === 'team').map((member) => member.ref);
  saved.value = false;
}, { immediate: true });

const memberCounts = (org: AgentOrgFixture) => ({ agents: org.members.filter((member) => member.kind === 'agent').length, teams: org.members.filter((member) => member.kind === 'team').length });
const go = async (nextView: OrgView, id?: string): Promise<void> => router.push({ path: '/agent-orgs', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: nextView, ...(id ? { id } : {}) } });
const openTeam = async (id: string): Promise<void> => router.push({ path: '/agent-teams', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: 'team-detail', id } });
const openLaunch = async (id: string): Promise<void> => {
  entry.value = '';
  await router.push({ path: '/agent-orgs', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: 'org-detail', id, launch: '1' } });
};
const closeLaunch = async (): Promise<void> => router.push({ path: '/agent-orgs', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, view: 'org-detail', id: launchOrg.value.id } });
const startRun = async (): Promise<void> => {
  if (!entry.value) return;
  await router.push({ path: '/workspace', query: { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY, root: 'org', org: launchOrg.value.id, entry: entry.value } });
};
const saveOrg = (): void => {
  saved.value = true;
  window.setTimeout(() => void go('org-detail', selectedOrg.value.id), 450);
};
</script>
