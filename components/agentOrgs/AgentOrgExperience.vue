<template>
  <div class="h-full overflow-auto bg-slate-50" data-test="agent-org-experience">
    <div class="mx-auto w-full max-w-[1400px] px-5 py-7 sm:px-7 lg:px-10">
      <template v-if="view === 'org-list'">
        <header class="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div class="max-w-3xl">
            <div class="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-700">
              <Icon icon="heroicons:building-office-2-20-solid" class="h-5 w-5" />
              Fixed-depth collaboration roots
            </div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-950">Agent Orgs</h1>
            <p class="mt-2 text-base leading-6 text-slate-600">
              Compose independent Agents and reusable Agent Teams into one collaboration scope. An Org has no coordinator; each launch starts through an exact selected entry.
            </p>
          </div>
          <button type="button" class="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2" data-test="create-org" @click="go('org-create')">
            <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" /> Create Agent Org
          </button>
        </header>

        <section class="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
          <label class="relative min-w-0 flex-1">
            <span class="sr-only">Search Agent Orgs</span>
            <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="search" class="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" placeholder="Search organizations by name or purpose">
          </label>
          <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span class="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">{{ filteredOrgs.length }} organizations</span>
            <span>No Org coordinator</span>
          </div>
        </section>

        <div class="grid gap-5 xl:grid-cols-2">
          <article v-for="org in filteredOrgs" :key="org.id" class="flex min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md" :data-test="`org-card-${org.id}`">
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-3">
                <span class="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon icon="heroicons:building-office-2-20-solid" class="h-6 w-6" /></span>
                <div class="min-w-0"><p class="text-xs font-semibold uppercase tracking-wide text-violet-700">Agent Org</p><h2 class="truncate text-lg font-bold text-slate-950">{{ org.name }}</h2></div>
              </div>
              <span class="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-slate-600">No coordinator</span>
            </div>
            <p class="mt-4 text-sm leading-6 text-slate-600">{{ org.description }}</p>

            <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div class="mb-3 flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Direct composition</p><span class="text-xs font-medium text-slate-500">1 level</span></div>
              <div class="flex flex-wrap gap-2">
                <span v-for="member in org.members" :key="`${member.kind}-${member.ref}`" class="inline-flex min-w-0 items-center gap-1.5 rounded-full border bg-white py-1 pl-1 pr-2 text-xs font-semibold" :class="member.kind === 'team' ? 'border-blue-200 text-blue-800' : 'border-slate-200 text-slate-700'">
                  <span class="inline-flex h-5 w-5 items-center justify-center rounded-full" :class="member.kind === 'team' ? 'bg-blue-50' : 'bg-slate-100'">
                    <Icon :icon="member.kind === 'team' ? 'heroicons:user-group-20-solid' : 'heroicons:user-20-solid'" class="h-3.5 w-3.5" />
                  </span>
                  <span class="max-w-48 truncate">{{ member.kind === 'team' ? teamById(member.ref).name : agentById(member.ref).name }}</span>
                  <span class="text-[0.625rem] uppercase tracking-wide text-slate-400">{{ member.kind }}</span>
                </span>
              </div>
            </div>

            <dl class="mt-auto grid grid-cols-4 gap-3 border-t border-slate-100 pt-4 text-sm">
              <div><dt class="text-xs font-medium text-slate-500">Agents</dt><dd class="mt-1 font-bold text-slate-900">{{ memberCounts(org).agents }}</dd></div>
              <div><dt class="text-xs font-medium text-slate-500">Teams</dt><dd class="mt-1 font-bold text-slate-900">{{ memberCounts(org).teams }}</dd></div>
              <div><dt class="text-xs font-medium text-slate-500">Org handoffs</dt><dd class="mt-1 font-bold text-slate-900">{{ org.handoffs }}</dd></div>
              <div><dt class="text-xs font-medium text-slate-500">Runs</dt><dd class="mt-1 font-bold text-slate-900">{{ org.runs }}</dd></div>
            </dl>
            <div class="mt-4 flex items-center justify-between gap-3">
              <button type="button" class="text-sm font-semibold text-slate-600 hover:text-slate-950" @click="go('org-detail', org.id)">View details</button>
              <button type="button" class="rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-violet-700" @click="openLaunch(org.id)">Run Organization</button>
            </div>
          </article>
        </div>
      </template>

      <template v-else-if="view === 'org-detail'">
        <button type="button" class="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950" @click="go('org-list')"><Icon icon="heroicons:arrow-left-20-solid" class="h-4 w-4" /> Back to Agent Orgs</button>
        <header class="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex min-w-0 items-start gap-4">
            <span class="inline-flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Icon icon="heroicons:building-office-2-20-solid" class="h-7 w-7" /></span>
            <div class="min-w-0">
              <div class="mb-2 flex flex-wrap items-center gap-2"><span class="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">Agent Org</span><span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">No coordinator</span></div>
              <h1 class="text-3xl font-bold tracking-tight text-slate-950">{{ selectedOrg.name }}</h1>
              <p class="mt-2 max-w-3xl text-base leading-6 text-slate-600">{{ selectedOrg.description }}</p>
            </div>
          </div>
          <div class="flex gap-2"><button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="go('org-edit', selectedOrg.id)">Edit Org</button><button type="button" class="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700" data-test="run-organization" @click="openLaunch(selectedOrg.id)">Run Organization</button></div>
        </header>

        <div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
          <div class="space-y-6">
            <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="border-b border-slate-100 px-5 py-4"><h2 class="font-bold text-slate-950">Direct members</h2><p class="mt-1 text-sm text-slate-500">Independent Agents and references to reusable Teams share one Org scope.</p></div>
              <div class="grid divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                <div class="p-5">
                  <div class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2"><Icon icon="heroicons:user-20-solid" class="h-5 w-5 text-slate-500" /><h3 class="font-semibold text-slate-900">Independent Agents</h3></div><span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{{ directAgents.length }}</span></div>
                  <ul class="space-y-3"><li v-for="agent in directAgents" :key="agent.id" class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600 shadow-sm">{{ agent.initials }}</span><div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">{{ agent.name }}</p><p class="text-xs text-slate-500">Address /{{ agent.name }}</p></div></li></ul>
                </div>
                <div class="p-5">
                  <div class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5 text-blue-600" /><h3 class="font-semibold text-slate-900">Referenced Teams</h3></div><span class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">{{ referencedTeams.length }}</span></div>
                  <ul class="space-y-3"><li v-for="team in referencedTeams" :key="team.id" class="rounded-xl border border-blue-200 bg-blue-50/50 p-3"><div class="flex items-center gap-3"><span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5" /></span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ team.name }}</p><p class="truncate text-xs text-slate-500">Coordinator · {{ agentById(team.coordinatorId).name }}</p></div><button type="button" class="text-xs font-semibold text-blue-700" @click="openTeam(team.id)">Open</button></div><p class="mt-2 text-xs text-blue-800">Same Team definition · standalone history preserved</p></li></ul>
                </div>
              </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-start justify-between gap-4"><div><h2 class="font-bold text-slate-950">Organization-scoped handoffs</h2><p class="mt-1 text-sm text-slate-500">Connect direct Agents and referenced Teams without nesting their definitions.</p></div><span class="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">{{ selectedOrg.handoffs }} rules</span></div>
              <div class="mt-4 grid gap-3 md:grid-cols-2">
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Requirements ready</p><p class="mt-2 text-sm font-semibold text-slate-900">requirements_engineer → Product Design Team</p><p class="mt-1 font-mono text-xs text-slate-500">/product_design_prototyping_team</p></div>
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Prototype approved</p><p class="mt-2 text-sm font-semibold text-slate-900">product_prototyper → Software Engineering Team</p><p class="mt-1 font-mono text-xs text-slate-500">/software_engineering_team</p></div>
              </div>
            </section>
          </div>

          <aside class="space-y-4">
            <section class="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div class="flex items-center gap-2 text-amber-900"><Icon icon="heroicons:cursor-arrow-rays-20-solid" class="h-5 w-5" /><h2 class="font-bold">Entry is chosen at launch</h2></div>
              <p class="mt-2 text-sm leading-6 text-amber-900/80">This Org has no default recipient. The caller selects one exact Agent or Team; a selected Team enters through its own coordinator.</p>
              <button type="button" class="mt-4 w-full rounded-lg bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800" @click="openLaunch(selectedOrg.id)">Choose entry & run</button>
            </section>
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 class="font-bold text-slate-950">Organization facts</h2><dl class="mt-4 space-y-3 text-sm"><div class="flex justify-between"><dt class="text-slate-500">Direct Teams</dt><dd class="font-semibold text-slate-900">{{ referencedTeams.length }}</dd></div><div class="flex justify-between"><dt class="text-slate-500">Direct Agents</dt><dd class="font-semibold text-slate-900">{{ directAgents.length }}</dd></div><div class="flex justify-between"><dt class="text-slate-500">Org coordinator</dt><dd class="font-semibold text-emerald-700">None</dd></div><div class="flex justify-between"><dt class="text-slate-500">Nested Orgs</dt><dd class="font-semibold text-emerald-700">Not supported</dd></div></dl></section>
          </aside>
        </div>
      </template>

      <template v-else>
        <button type="button" class="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950" @click="go('org-list')"><Icon icon="heroicons:arrow-left-20-solid" class="h-4 w-4" /> Back to Agent Orgs</button>
        <header class="mb-6"><p class="text-sm font-semibold text-violet-700">{{ view === 'org-create' ? 'New collaboration scope' : 'Edit Agent Org' }}</p><h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-950">{{ view === 'org-create' ? 'Create Agent Org' : selectedOrg.name }}</h1><p class="mt-2 max-w-3xl text-base text-slate-600">Add independent Agents and reusable Teams directly. The Org itself has no coordinator.</p></header>
        <form class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]" @submit.prevent="saveOrg">
          <div class="space-y-6">
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 class="font-bold text-slate-950">Organization details</h2><div class="mt-4 grid gap-4 md:grid-cols-2"><label><span class="text-sm font-semibold text-slate-700">Name</span><input v-model="formName" required class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"></label><label><span class="text-sm font-semibold text-slate-700">Category</span><select v-model="formCategory" class="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"><option>Department</option><option>Program</option><option>Organization</option></select></label><label class="md:col-span-2"><span class="text-sm font-semibold text-slate-700">Description</span><textarea v-model="formDescription" rows="3" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"></textarea></label></div></section>

            <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="border-b border-slate-100 px-5 py-4"><h2 class="font-bold text-slate-950">Direct members</h2><p class="mt-1 text-sm text-slate-500">One fixed composition level: independent Agents and referenced Agent Teams.</p></div>
              <div class="grid lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
                <div class="p-5"><div class="flex items-center justify-between"><div><h3 class="font-semibold text-slate-900">Independent Agents</h3><p class="mt-0.5 text-xs text-slate-500">Mounted directly in the Org</p></div><button type="button" class="inline-flex items-center gap-1 text-sm font-semibold text-violet-700"><Icon icon="heroicons:plus-20-solid" class="h-4 w-4" /> Add Agent</button></div><ul class="mt-4 space-y-2"><li v-for="agentId in formAgentIds" :key="agentId" class="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agentById(agentId).initials }}</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ agentById(agentId).name }}</p><p class="text-xs text-slate-500">/{{ agentById(agentId).name }}</p></div><button type="button" class="text-slate-400"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button></li></ul></div>
                <div class="p-5"><div class="flex items-center justify-between"><div><h3 class="font-semibold text-slate-900">Reusable Agent Teams</h3><p class="mt-0.5 text-xs text-slate-500">Referenced, never copied</p></div><button type="button" class="inline-flex items-center gap-1 text-sm font-semibold text-blue-700"><Icon icon="heroicons:plus-20-solid" class="h-4 w-4" /> Add Team</button></div><ul class="mt-4 space-y-2"><li v-for="teamId in formTeamIds" :key="teamId" class="rounded-xl border border-blue-200 bg-blue-50/50 p-3"><div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-4 w-4" /></span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">{{ teamById(teamId).name }}</p><p class="truncate text-xs text-slate-500">Coordinator · {{ agentById(teamById(teamId).coordinatorId).name }}</p></div><button type="button" class="text-slate-400"><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" /></button></div><p class="mt-2 text-[0.6875rem] font-semibold text-blue-700">Same definition · prior history retained</p></li></ul></div>
              </div>
              <div class="flex items-start gap-2 border-t border-violet-100 bg-violet-50 px-5 py-3 text-sm text-violet-800"><Icon icon="heroicons:information-circle-20-solid" class="mt-0.5 h-4 w-4 flex-none" /><p><strong>No Org coordinator.</strong> An exact entry Agent or Team is selected each time this organization is launched.</p></div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><div><h2 class="font-bold text-slate-950">Organization-scoped handoffs</h2><p class="mt-1 text-sm text-slate-500">Connect mounted Agents and Teams while keeping Team definitions unchanged.</p></div><button type="button" class="text-sm font-semibold text-violet-700">Add rule</button></div><div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">8 cross-member rules connect this Org's direct placements.</div></section>
            <div class="flex justify-end gap-3"><button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700" @click="go('org-list')">Cancel</button><button type="submit" class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700">{{ view === 'org-create' ? 'Create Org' : 'Save changes' }}</button></div>
          </div>
          <aside class="space-y-4"><section class="rounded-2xl border border-violet-200 bg-violet-50 p-5"><Icon icon="heroicons:building-office-2-20-solid" class="h-6 w-6 text-violet-700" /><h2 class="mt-3 font-bold text-violet-950">What makes this an Org?</h2><ul class="mt-3 space-y-2 text-sm leading-5 text-violet-900/80"><li>• Direct Agents and reusable Teams</li><li>• No Organization coordinator</li><li>• Exact entry selected at launch</li><li>• Org-scoped handoffs connect peers</li><li>• No Org-in-Org composition</li></ul></section><section v-if="saved" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-800" role="status">Saved locally for this prototype.</section></aside>
        </form>
      </template>
    </div>

    <div v-if="launchOpen" class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4" data-test="org-launch-modal" @click.self="closeLaunch">
      <section role="dialog" aria-modal="true" aria-labelledby="launch-title" class="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5"><div><div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-700"><Icon icon="heroicons:building-office-2-20-solid" class="h-4 w-4" /> Agent Org launch</div><h2 id="launch-title" class="text-2xl font-bold text-slate-950">Choose the exact entry</h2><p class="mt-2 text-sm leading-6 text-slate-600">{{ launchOrg.name }} has no coordinator or default recipient. Select the Agent or Team that should receive the first message.</p></div><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close" @click="closeLaunch"><Icon icon="heroicons:x-mark-20-solid" class="h-5 w-5" /></button></header>
        <div class="space-y-5 px-6 py-5">
          <fieldset><legend class="mb-3 text-sm font-bold text-slate-900">Independent Agents</legend><div class="grid gap-3 sm:grid-cols-2"><label v-for="agent in launchAgents" :key="agent.id" class="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition" :class="entry === `agent:${agent.id}` ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/15' : 'border-slate-200 hover:border-slate-300'"><input v-model="entry" type="radio" :value="`agent:${agent.id}`" class="h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"><span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{{ agent.initials }}</span><span class="min-w-0"><span class="block truncate text-sm font-semibold text-slate-900">{{ agent.name }}</span><span class="block text-xs text-slate-500">Direct Agent entry</span></span></label></div></fieldset>
          <fieldset><legend class="mb-3 text-sm font-bold text-slate-900">Reusable Agent Teams</legend><div class="grid gap-3 sm:grid-cols-2"><label v-for="team in launchTeams" :key="team.id" class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition" :class="entry === `team:${team.id}` ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/15' : 'border-slate-200 hover:border-slate-300'"><input v-model="entry" type="radio" :value="`team:${team.id}`" class="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"><span class="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon icon="heroicons:user-group-20-solid" class="h-5 w-5" /></span><span class="min-w-0"><span class="block truncate text-sm font-semibold text-slate-900">{{ team.name }}</span><span class="mt-1 block text-xs leading-5 text-slate-500">Enters through Team coordinator <strong class="text-slate-700">{{ agentById(team.coordinatorId).name }}</strong></span></span></label></div></fieldset>
          <div v-if="entry" class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status"><Icon icon="heroicons:check-circle-20-solid" class="mt-0.5 h-5 w-5 flex-none text-emerald-600" /><p><strong>Exact entry selected:</strong> {{ selectedEntrySummary }}. No first-member, name-based, Org-coordinator, or synthetic fallback will be used.</p></div>
        </div>
        <footer class="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 px-6 py-4"><p class="text-xs text-slate-500">The selected entry is recorded with this run.</p><div class="flex gap-2"><button type="button" class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700" @click="closeLaunch">Cancel</button><button type="button" class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300" :disabled="!entry" data-test="start-org-run" @click="startRun">Start organization run</button></div></footer>
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
