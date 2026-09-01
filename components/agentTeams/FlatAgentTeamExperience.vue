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

          <HandoffManager :model-value="detailTeamHandoffs" :from-options="detailTeamHandoffOptions.from" :to-options="detailTeamHandoffOptions.to" mode="view" scope="team" />

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

        </div>
      </template>

      <template v-else>
        <header class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 class="text-4xl font-semibold text-slate-900">{{ view === 'team-create' ? 'Create Agent Team' : 'Edit Agent Team' }}</h1>
            <p class="mt-1 text-lg text-slate-600">{{ view === 'team-create' ? 'Drag from library to canvas, then assign a coordinator.' : `Update details for ${selectedTeam.name}.` }}</p>
          </div>
          <button v-if="view === 'team-create'" type="button" class="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" @click="applyTeamTemplate">Use Template</button>
        </header>

        <form class="rounded-xl border border-slate-200 bg-white shadow-sm" data-test="flat-team-definition-form" @submit.prevent="saveTeam">
          <div class="space-y-6 p-6">
            <section class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h2 class="text-base font-semibold text-slate-900">Basics</h2>
              <div class="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-[16rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
                <div>
                  <div class="flex items-start gap-3">
                    <span class="inline-flex h-24 w-24 flex-none items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xl font-semibold text-slate-600">{{ teamInitials(formName || 'Agent Team') }}</span>
                    <div class="space-y-2">
                      <button type="button" class="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">Upload Avatar</button>
                      <p class="text-xs text-slate-500">PNG/JPG, square recommended</p>
                    </div>
                  </div>
                </div>
                <label class="block">
                  <span class="text-sm font-medium text-slate-700">Team Name</span>
                  <input v-model="formName" required class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g., Content Production Unit">
                  <span class="mt-1 block text-xs text-slate-500">Member names auto-fill from dragged Agent names.</span>
                </label>
                <label class="block">
                  <span class="text-sm font-medium text-slate-700">Team Description</span>
                  <textarea v-model="formDescription" required rows="2" class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Describe the Team's purpose and goals…" />
                </label>
              </div>
              <label class="mt-3 block">
                <span class="text-sm font-medium text-slate-700">Category</span>
                <input v-model="formCategory" class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g., software-engineering">
              </label>
              <label class="mt-3 block">
                <span class="text-sm font-medium text-slate-700">Instructions</span>
                <textarea v-model="formInstructions" required rows="8" class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Enter the Team coordinator's instructions…" />
              </label>
            </section>

            <section class="grid grid-cols-1 gap-4 xl:grid-cols-[18rem_minmax(0,1fr)_16rem]" data-test="flat-team-builder">
              <aside class="rounded-lg border border-slate-200 bg-white p-3" data-test="agent-library">
                <h2 class="text-sm font-semibold text-slate-900">Agent Library</h2>
                <label class="relative mt-2 block">
                  <span class="sr-only">Search Agents</span>
                  <Icon icon="heroicons:magnifying-glass-20-solid" class="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <input v-model="agentSearch" type="text" class="block w-full rounded-md border border-slate-300 bg-white py-2 pl-8 pr-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Search agents…">
                </label>
                <div class="mt-3 max-h-[26rem] overflow-y-auto pr-1">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">My Agents</p>
                  <div class="mt-2 space-y-2">
                    <div
                      v-for="agent in libraryAgents"
                      :key="agent.id"
                      draggable="true"
                      class="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2 py-2 text-sm text-slate-800"
                      :data-test="`team-library-agent-${agent.id}`"
                      @dragstart="handleLibraryDragStart($event, agent.id)"
                      @dragend="draggedAgentId = ''"
                    >
                      <button type="button" class="flex min-w-0 items-center gap-2 text-left" :aria-label="`Add ${agent.name}`" @click="addAgent(agent.id)">
                        <span class="text-slate-400" aria-hidden="true">⋮⋮</span>
                        <span class="truncate font-medium">{{ agent.name }}</span>
                      </button>
                      <span class="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">AGENT</span>
                    </div>
                    <p v-if="libraryAgents.length === 0" class="text-xs text-slate-400">No Agents found.</p>
                  </div>
                </div>
                <p class="mt-3 text-xs text-slate-500">Drag Agents from this library into Team Canvas.</p>
              </aside>

              <section
                class="rounded-lg border border-slate-200 bg-white p-3"
                data-test="team-canvas"
                @drop.prevent="handleCanvasDrop"
                @dragover.prevent="isCanvasDragOver = true"
                @dragleave="isCanvasDragOver = false"
              >
                <div class="flex items-center justify-between gap-2">
                  <h2 class="text-sm font-semibold text-slate-900">Team Canvas</h2>
                  <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
                    <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-200 text-[10px] font-semibold text-slate-700">{{ teamInitials(formName || 'Agent Team') }}</span>
                    <span class="max-w-[10rem] truncate">{{ formName || 'Untitled Team' }}</span>
                  </div>
                </div>
                <p class="mt-2 text-xs text-slate-500">Dragged from Library → Canvas</p>

                <div class="mt-3 space-y-2">
                  <article
                    v-for="member in formMembers"
                    :key="member.placementId"
                    class="cursor-pointer rounded-md border p-3 shadow-sm"
                    :class="selectedPlacementId === member.placementId ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 bg-white'"
                    :data-test="`team-canvas-member-${member.placementId}`"
                    :aria-selected="selectedPlacementId === member.placementId"
                    @click="selectMember(member.placementId)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-slate-900">{{ member.memberName }}</p>
                        <p class="truncate text-xs text-slate-500">Source: {{ agentById(member.agentId).name }}</p>
                      </div>
                      <div class="flex shrink-0 items-center gap-2">
                        <span class="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">AGENT</span>
                        <div class="inline-flex items-center gap-2 text-xs text-slate-600" @click.stop>
                          <span>Coordinator</span>
                          <button
                            type="button"
                            role="switch"
                            :aria-checked="formCoordinatorPlacementId === member.placementId"
                            :aria-label="`Toggle coordinator for ${member.memberName}`"
                            class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                            :class="formCoordinatorPlacementId === member.placementId ? 'bg-blue-600' : 'bg-slate-300'"
                            @click.stop="toggleCoordinator(member.placementId)"
                          >
                            <span aria-hidden="true" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="formCoordinatorPlacementId === member.placementId ? 'translate-x-4' : 'translate-x-0.5'" />
                          </button>
                        </div>
                        <button type="button" class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" :aria-label="`Remove ${member.memberName}`" @click.stop="removeAgent(member.placementId)">✕</button>
                      </div>
                    </div>
                  </article>
                </div>

                <div
                  class="mt-3 rounded-md border border-dashed p-6 text-center text-sm"
                  :class="isCanvasDragOver ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-300 bg-slate-50 text-slate-500'"
                  data-test="team-canvas-drop-target"
                >Drop Agents here to build your Team</div>
                <p v-if="memberError" class="mt-2 text-xs font-medium text-red-600" role="alert">{{ memberError }}</p>
              </section>

              <aside class="rounded-lg border border-slate-200 bg-white p-3" data-test="member-details">
                <h2 class="text-sm font-semibold text-slate-900">Member Details</h2>
                <template v-if="selectedMember">
                  <div class="mt-3 space-y-3">
                    <p class="text-xs text-slate-500">Member names auto-fill from the dragged Agent name.</p>
                    <label class="block">
                      <span class="text-xs font-medium text-slate-600">Member Name</span>
                      <input :value="selectedMember.memberName" type="text" class="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" data-test="member-name-input" @input="updateSelectedMemberName(($event.target as HTMLInputElement).value)">
                    </label>
                    <div><p class="text-xs font-medium text-slate-600">Type</p><p class="mt-1 text-sm text-slate-900">Agent</p></div>
                    <div><p class="text-xs font-medium text-slate-600">Source</p><p class="mt-1 break-words text-sm text-slate-900">{{ agentById(selectedMember.agentId).name }}</p></div>
                    <div><p class="text-xs font-medium text-slate-600">Scope</p><p class="mt-1 text-sm text-slate-900">Shared</p></div>
                    <div>
                      <p class="text-xs font-medium text-slate-600">Coordinator</p>
                      <div class="mt-1 inline-flex items-center gap-2 text-sm text-slate-800">
                        <span>{{ formCoordinatorPlacementId === selectedMember.placementId ? 'Enabled' : 'Disabled' }}</span>
                        <button
                          type="button"
                          role="switch"
                          :aria-checked="formCoordinatorPlacementId === selectedMember.placementId"
                          :aria-label="`Toggle coordinator for selected member ${selectedMember.memberName}`"
                          class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                          :class="formCoordinatorPlacementId === selectedMember.placementId ? 'bg-blue-600' : 'bg-slate-300'"
                          @click="toggleCoordinator(selectedMember.placementId)"
                        >
                          <span aria-hidden="true" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" :class="formCoordinatorPlacementId === selectedMember.placementId ? 'translate-x-4' : 'translate-x-0.5'" />
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
                <p v-else class="mt-3 text-sm text-slate-500">Select a member in Team Canvas to edit details.</p>
              </aside>
            </section>

            <section class="rounded-xl border border-slate-200 bg-white p-5">
              <h2 class="text-lg font-semibold text-slate-900">LLM config</h2>
              <p class="mt-1 text-sm text-slate-500">Optional runtime, model, and LLM settings.</p>
              <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <label><span class="text-sm font-medium text-slate-700">Runtime</span><select class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"><option>Choose when launching</option><option>AutoByteus</option></select></label>
                <label><span class="text-sm font-medium text-slate-700">Model</span><select class="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"><option>Select a model</option></select></label>
              </div>
            </section>

            <HandoffManager ref="teamHandoffManager" v-model="formTeamHandoffs" :from-options="formTeamHandoffOptions.from" :to-options="formTeamHandoffOptions.to" mode="edit" scope="team" />
            <p v-if="saveError" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700" role="alert">{{ saveError }}</p>
          </div>

          <footer class="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex flex-wrap items-center gap-3 text-xs font-medium">
                <span :class="formName.trim() ? 'text-emerald-700' : 'text-slate-500'">{{ formName.trim() ? '✓' : '○' }} Team Name {{ formName.trim() ? 'set' : 'required' }}</span>
                <span :class="formMembers.length ? 'text-emerald-700' : 'text-slate-500'">{{ formMembers.length ? '✓' : '○' }} At least 1 member {{ formMembers.length ? 'added' : 'required' }}</span>
                <span :class="formCoordinatorPlacementId ? 'text-emerald-700' : 'text-slate-500'">{{ formCoordinatorPlacementId ? '✓' : '○' }} Coordinator {{ formCoordinatorPlacementId ? 'assigned' : 'required' }}</span>
              </div>
              <div class="flex items-center justify-end gap-2">
                <button type="button" class="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" @click="go(view === 'team-create' ? 'team-list' : 'team-detail', view === 'team-edit' ? selectedTeam.id : undefined)">Cancel</button>
                <button type="submit" class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{{ view === 'team-create' ? 'Create Team' : 'Save Changes' }}</button>
              </div>
            </div>
          </footer>
        </form>

        <div v-if="saved" class="fixed bottom-5 right-5 z-50 rounded-lg bg-green-500 p-4 text-white shadow-lg" role="status">Saved locally for this prototype.</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import HandoffManager from '~/components/handoffs/HandoffManager.vue';
import { agents, flatTeams, agentById, teamById } from '~/prototype/aorg-flat-team-fixtures';
import {
  buildTeamHandoffOptions,
  buildTeamHandoffOptionsFromPlacements,
  cloneHandoffs,
  teamHandoffsFor,
  type PrototypeHandoff,
  type TeamAgentPlacement,
} from '~/prototype/aorg-handoff-model';
import { useAgentOrgPrototypeReview } from '~/composables/useAgentOrgPrototypeReview';

type TeamView = 'team-list' | 'team-detail' | 'team-create' | 'team-edit';
type HandoffManagerExpose = { validateAll: () => boolean; clearStatus: () => void };
const route = useRoute();
const { push: pushExperienceRoute } = useAgentOrgPrototypeReview();
const search = ref('');
const reloading = ref(false);
const saved = ref(false);
const saveError = ref('');
const memberError = ref('');
const agentSearch = ref('');
const isCanvasDragOver = ref(false);
const draggedAgentId = ref('');
let placementSequence = 0;
const teamHandoffManager = ref<HandoffManagerExpose | null>(null);
const savedTeamHandoffs = ref<Record<string, PrototypeHandoff[]>>({});

const view = computed<TeamView>(() => {
  const candidate = String(route.query.view || 'team-list') as TeamView;
  return ['team-list', 'team-detail', 'team-create', 'team-edit'].includes(candidate) ? candidate : 'team-list';
});
const selectedTeam = computed(() => teamById(String(route.query.id || flatTeams[0].id)));
const detailTeamHandoffOptions = computed(() => buildTeamHandoffOptions(selectedTeam.value.agents));
const detailTeamHandoffs = computed(() => savedTeamHandoffs.value[selectedTeam.value.id] ?? teamHandoffsFor(selectedTeam.value.id));
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
const formMembers = ref<TeamAgentPlacement[]>([]);
const formCoordinatorPlacementId = ref('');
const selectedPlacementId = ref<string | null>(null);
const formTeamHandoffs = ref<PrototypeHandoff[]>([]);
const formTeamHandoffOptions = computed(() => buildTeamHandoffOptionsFromPlacements(formMembers.value));
const selectedMember = computed(() => formMembers.value.find((member) => member.placementId === selectedPlacementId.value) ?? null);
const libraryAgents = computed(() => {
  const query = agentSearch.value.trim().toLowerCase();
  return query ? agents.filter((agent) => `${agent.name} ${agent.description}`.toLowerCase().includes(query)) : agents;
});

const buildUniqueMemberName = (agentId: string): string => {
  const base = agentById(agentId).name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '').toLowerCase() || 'member';
  const used = new Set(formMembers.value.map((member) => member.memberName));
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}_${suffix}`)) suffix += 1;
  return `${base}_${suffix}`;
};

const newPlacement = (agentId: string, memberName?: string): TeamAgentPlacement => ({
  placementId: `placement-${++placementSequence}`,
  agentId,
  memberName: memberName ?? buildUniqueMemberName(agentId),
});

const loadFixtureMembers = (): void => {
  formMembers.value = selectedTeam.value.agents.map((agentId) => newPlacement(agentId, agentById(agentId).name));
  formCoordinatorPlacementId.value = formMembers.value.find((member) => member.agentId === selectedTeam.value.coordinatorId)?.placementId ?? '';
  selectedPlacementId.value = formMembers.value[0]?.placementId ?? null;
};

watch([view, selectedTeam], () => {
  if (view.value === 'team-create') {
    formName.value = '';
    formCategory.value = '';
    formDescription.value = '';
    formInstructions.value = '';
    formMembers.value = [];
    formCoordinatorPlacementId.value = '';
    selectedPlacementId.value = null;
    formTeamHandoffs.value = [];
  } else {
    formName.value = selectedTeam.value.name;
    formCategory.value = selectedTeam.value.category;
    formDescription.value = selectedTeam.value.description;
    formInstructions.value = 'Coordinate work through the selected Agent coordinator while preserving its handoff rules.';
    loadFixtureMembers();
    formTeamHandoffs.value = cloneHandoffs(savedTeamHandoffs.value[selectedTeam.value.id] ?? teamHandoffsFor(selectedTeam.value.id));
  }
  saved.value = false;
  saveError.value = '';
  memberError.value = '';
  agentSearch.value = '';
  isCanvasDragOver.value = false;
  draggedAgentId.value = '';
}, { immediate: true });

const applyTeamTemplate = (): void => {
  formName.value = 'Customer Insight Team';
  formCategory.value = 'Product';
  formDescription.value = 'Synthesizes customer evidence into actionable product findings.';
  formInstructions.value = 'Coordinate research and synthesis through the selected Agent coordinator.';
  formMembers.value = [];
  const coordinator = newPlacement('product-prototyper');
  formMembers.value.push(coordinator, newPlacement('requirements-engineer'));
  formCoordinatorPlacementId.value = coordinator.placementId;
  selectedPlacementId.value = coordinator.placementId;
  formTeamHandoffs.value = [];
  memberError.value = '';
};

const go = async (nextView: TeamView, id?: string): Promise<void> => {
  await pushExperienceRoute('/agent-teams', { view: nextView, id });
};
const openTeamRun = async (id: string): Promise<void> => {
  await pushExperienceRoute('/workspace', { root: 'team', team: id, phase: 'config' });
};
const openAgentDetails = async (id: string): Promise<void> => {
  await pushExperienceRoute('/agents', {
    view: 'detail',
    id,
    returnToTeam: selectedTeam.value.id,
  });
};
const addAgent = (id: string): void => {
  if (!agents.some((agent) => agent.id === id)) return;
  const placement = newPlacement(id);
  formMembers.value.push(placement);
  selectedPlacementId.value = placement.placementId;
  if (!formCoordinatorPlacementId.value) formCoordinatorPlacementId.value = placement.placementId;
  memberError.value = '';
  saved.value = false;
};
const handleLibraryDragStart = (event: DragEvent, agentId: string): void => {
  draggedAgentId.value = agentId;
  if (!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('application/x-autobyteus-agent-id', agentId);
};
const handleCanvasDrop = (event: DragEvent): void => {
  isCanvasDragOver.value = false;
  const agentId = event.dataTransfer?.getData('application/x-autobyteus-agent-id') || draggedAgentId.value;
  draggedAgentId.value = '';
  if (agentId) addAgent(agentId);
};
const selectMember = (placementId: string): void => {
  selectedPlacementId.value = placementId;
};
const removeAgent = (placementId: string): void => {
  const index = formMembers.value.findIndex((member) => member.placementId === placementId);
  if (index < 0) return;
  formMembers.value.splice(index, 1);
  if (formCoordinatorPlacementId.value === placementId) formCoordinatorPlacementId.value = '';
  if (selectedPlacementId.value === placementId) selectedPlacementId.value = formMembers.value[Math.max(0, index - 1)]?.placementId ?? null;
  saved.value = false;
};
const toggleCoordinator = (placementId: string): void => {
  formCoordinatorPlacementId.value = formCoordinatorPlacementId.value === placementId ? '' : placementId;
  memberError.value = '';
  saved.value = false;
};
const updateSelectedMemberName = (value: string): void => {
  if (!selectedMember.value) return;
  selectedMember.value.memberName = value;
  memberError.value = '';
  saved.value = false;
};
const saveTeam = (): void => {
  const normalizedNames = formMembers.value.map((member) => member.memberName.trim());
  if (formMembers.value.length === 0) {
    memberError.value = 'Add at least one Agent to the Team Canvas.';
  } else if (normalizedNames.some((name) => !name)) {
    memberError.value = 'Every member needs a name.';
  } else if (new Set(normalizedNames).size !== normalizedNames.length) {
    memberError.value = 'Member names must be unique.';
  } else if (!formMembers.value.some((member) => member.placementId === formCoordinatorPlacementId.value)) {
    memberError.value = 'Assign one Agent coordinator.';
  } else {
    memberError.value = '';
  }
  if (memberError.value) {
    saved.value = false;
    saveError.value = memberError.value;
    return;
  }
  formMembers.value.forEach((member, index) => {
    member.memberName = normalizedNames[index] ?? member.memberName;
  });
  if (!teamHandoffManager.value?.validateAll()) {
    saved.value = false;
    saveError.value = 'Resolve the highlighted handoffs before saving this Team.';
    return;
  }
  const saveId = view.value === 'team-create' ? 'customer-insight-team' : selectedTeam.value.id;
  savedTeamHandoffs.value[saveId] = cloneHandoffs(formTeamHandoffs.value);
  teamHandoffManager.value.clearStatus();
  saveError.value = '';
  saved.value = true;
};
</script>
