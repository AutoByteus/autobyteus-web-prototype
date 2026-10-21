<template>
  <div :data-testid="testId">
    <div v-if="showSearch" class="mb-3 flex items-center gap-3">
      <div class="relative w-full max-w-xs">
        <svg class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <circle cx="9" cy="9" r="5.5" /><path d="m13.5 13.5 3.5 3.5" stroke-linecap="round" />
        </svg>
        <input
          v-model="query"
          type="search"
          class="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :placeholder="t('settings.components.settings.RemoteCollaboration.offer.search')"
          :aria-label="t('settings.components.settings.RemoteCollaboration.offer.search')"
          :data-testid="`${testId}-search`"
        >
      </div>
    </div>

    <p v-if="query.trim() && matchCount === 0" class="text-sm text-slate-500" role="status" :data-testid="`${testId}-no-match`">
      {{ t('settings.components.settings.RemoteCollaboration.offer.noMatch', { query: query.trim() }) }}
      <button type="button" class="font-medium text-blue-700 hover:underline" @click="query = ''">
        {{ t('settings.components.settings.RemoteCollaboration.offer.clearSearch') }}
      </button>
    </p>

    <div v-else :class="columns ? 'grid gap-x-8 gap-y-5 lg:grid-cols-2' : 'space-y-5'">
      <section v-for="group in groups" :key="group.kind" :data-testid="`${testId}-${group.testKey}`">
        <h4 class="flex items-baseline gap-2 border-b border-slate-100 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {{ group.title }}
          <span class="font-medium normal-case tracking-normal text-slate-400" :data-testid="`${testId}-${group.testKey}-count`">
            {{ group.countLabel }}
          </span>
        </h4>

        <p v-if="group.items.length === 0" class="py-2.5 text-sm text-slate-400">
          {{ group.emptyLabel }}
        </p>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="entry in group.visible" :key="entry.key" class="py-2.5" :data-testid="`${testId}-entry`">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-900 break-words">{{ entry.name }}</p>
                <p v-if="entry.description" class="mt-0.5 line-clamp-2 text-xs text-slate-500" :title="entry.description">{{ entry.description }}</p>
              </div>
              <template v-if="entry.readiness">
                <span
                  v-if="entry.readiness.state === 'ready'"
                  class="inline-flex flex-shrink-0 items-center gap-1 text-xs font-medium text-emerald-700"
                  data-testid="remote-collaboration-readiness-ready"
                >
                  <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  {{ t('settings.components.settings.RemoteCollaboration.availability.ready') }}
                </span>
                <span
                  v-else
                  class="inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="entry.readiness.state === 'no_default' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'"
                  :data-testid="`remote-collaboration-readiness-${entry.readiness.state}`"
                >
                  {{ readinessLabel(entry.readiness.state) }}
                </span>
              </template>
            </div>
            <p v-if="entry.readiness && entry.readiness.state !== 'ready'" class="mt-1.5 text-xs text-slate-600" :data-testid="`remote-collaboration-readiness-reason`">
              {{ readinessReason(entry.readiness) }}
              <NuxtLink
                :to="settingsPath(entry)"
                class="ml-1 whitespace-nowrap font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                :data-testid="`remote-collaboration-settings-link`"
              >
                {{ entry.kind === 'AGENT' ? t('settings.components.settings.RemoteCollaboration.availability.link.agent') : t('settings.components.settings.RemoteCollaboration.availability.link.team') }} →
              </NuxtLink>
            </p>
          </li>
        </ul>

        <button
          v-if="group.hidden > 0 || group.expanded"
          type="button"
          class="mt-1.5 text-xs font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :aria-expanded="group.expanded"
          :data-testid="`${testId}-${group.testKey}-toggle`"
          @click="expanded[group.kind] = !expanded[group.kind]"
        >
          {{ group.expanded
            ? t('settings.components.settings.RemoteCollaboration.offer.showFewer')
            : t('settings.components.settings.RemoteCollaboration.offer.showAll', { count: group.items.length }) }}
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useLocalization } from '~/composables/useLocalization'
import type { OfferEntry, Readiness, SharedEntry } from '~/prototype/remote-collaboration/offersScript'

type Row = OfferEntry & { readiness?: Readiness; definitionId?: string }

/** A list starts with this many entries per kind; "Show all" reveals the rest. */
const SHORT_VIEW = 5

const props = withDefaults(defineProps<{
  entries: Row[]
  testId: string
  /** Peers' lists put Agents and Agent Teams side by side; this node's wider rows stack them. */
  columns?: boolean
}>(), { columns: false })

const { t } = useLocalization()
const query = ref('')
const expanded = reactive<Record<string, boolean>>({ AGENT: false, AGENT_TEAM: false })

const attentionRank = (entry: Row): number => (entry.readiness && entry.readiness.state !== 'ready' ? 0 : 1)
const ordered = (list: Row[]): Row[] => [...list].sort((a, b) => attentionRank(a) - attentionRank(b) || a.name.localeCompare(b.name))

const kindCount = (kind: string): number => props.entries.filter((entry) => entry.kind === kind).length
const showSearch = computed(() => kindCount('AGENT') > SHORT_VIEW || kindCount('AGENT_TEAM') > SHORT_VIEW)

const needle = computed(() => query.value.trim().toLowerCase())
const matches = (entry: Row): boolean => !needle.value || entry.name.toLowerCase().includes(needle.value)
const matchCount = computed(() => props.entries.filter(matches).length)

const groups = computed(() => (['AGENT', 'AGENT_TEAM'] as const).map((kind) => {
  const all = props.entries.filter((entry) => entry.kind === kind)
  const items = ordered(all.filter(matches))
  const open = Boolean(needle.value) || expanded[kind]
  const visible = open ? items : items.slice(0, SHORT_VIEW)
  const isAgent = kind === 'AGENT'
  return {
    kind,
    testKey: isAgent ? 'agents' : 'teams',
    title: t(`settings.components.settings.RemoteCollaboration.offer.${isAgent ? 'agents' : 'teams'}`),
    countLabel: needle.value && items.length !== all.length
      ? t('settings.components.settings.RemoteCollaboration.offer.countFiltered', { shown: items.length, count: all.length })
      : t('settings.components.settings.RemoteCollaboration.offer.count', { count: all.length }),
    emptyLabel: all.length === 0
      ? t(`settings.components.settings.RemoteCollaboration.offer.${isAgent ? 'noneAgents' : 'noneTeams'}`)
      : t('settings.components.settings.RemoteCollaboration.offer.noMatchInKind'),
    items,
    visible,
    hidden: items.length - visible.length,
    // "Show fewer" only applies when the short view was lifted by the button, not by a search.
    expanded: !needle.value && expanded[kind] && items.length > SHORT_VIEW,
  }
}))

const readinessLabel = (state: Readiness['state']): string => t(
  state === 'no_default'
    ? 'settings.components.settings.RemoteCollaboration.availability.noDefault'
    : 'settings.components.settings.RemoteCollaboration.availability.cannotRun',
)

const readinessReason = (readiness: Readiness): string => {
  if (readiness.state === 'cannot_run') return t('settings.components.settings.RemoteCollaboration.availability.reason.cannotRun', { reason: readiness.reason })
  if (readiness.state === 'no_default' && readiness.member) return t('settings.components.settings.RemoteCollaboration.availability.reason.noDefaultMember', { member: readiness.member })
  return t('settings.components.settings.RemoteCollaboration.availability.reason.noDefaultAgent')
}

const settingsPath = (entry: Row): string => entry.kind === 'AGENT'
  ? `/agents?view=edit&id=${encodeURIComponent((entry as SharedEntry).definitionId)}`
  : `/agent-teams?view=team-edit&id=${encodeURIComponent((entry as SharedEntry).definitionId)}`
</script>
