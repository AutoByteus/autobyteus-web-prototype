<template>
  <!-- agent-definition-reconnect-ui: the product dialog frame (ProjectDialogFrame) with the agent
       switcher's search and rows (ChatTargetSwitcher). Nothing is chosen for the user. -->
  <Teleport to="body">
    <div
      v-if="open && missing"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      data-test="reconnect-dialog-backdrop"
      @mousedown.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contextId"
        :aria-busy="saving ? 'true' : 'false'"
        class="flex max-h-[min(40rem,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl focus:outline-none"
        data-test="reconnect-dialog"
        @keydown="onKeydown"
      >
        <header class="border-b border-slate-100 px-6 pb-4 pt-5">
          <h2 :id="titleId" class="text-lg font-semibold text-slate-900">{{ $t('reconnect.dialog.title') }}</h2>
          <p :id="contextId" class="mt-1 text-sm leading-5 text-slate-600" data-test="reconnect-dialog-context">
            <template v-if="missing.memberKind === 'standalone'">
              {{ $t('reconnect.dialog.contextRun') }} <span class="font-medium text-slate-800">“{{ missing.missingDefinitionId }}”</span>{{ $t('reconnect.dialog.contextGone') }}
            </template>
            <template v-else>
              <span class="font-medium text-slate-800">{{ missing.name }}</span> {{ $t('reconnect.dialog.contextIn', { team: missing.teamName ?? '' }) }}
              <span class="font-medium text-slate-800">“{{ missing.missingDefinitionId }}”</span>{{ $t('reconnect.dialog.contextGone') }}
            </template>
          </p>
          <p class="mt-1.5 flex items-start gap-1.5 text-xs leading-4 text-slate-500">
            <Icon icon="heroicons:shield-check" class="mt-px h-3.5 w-3.5 flex-shrink-0 text-slate-400" aria-hidden="true" />
            <span>{{ $t('reconnect.dialog.keeps') }}</span>
          </p>
        </header>

        <div class="flex items-center gap-2 border-b border-slate-100 px-6 py-2.5">
          <Icon icon="heroicons:magnifying-glass" class="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <input
            ref="searchRef"
            v-model="query"
            type="text"
            class="w-full border-0 bg-transparent p-0 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            :placeholder="$t('reconnect.dialog.search')"
            :aria-label="$t('reconnect.dialog.search')"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="'true'"
            :aria-controls="listId"
            :aria-activedescendant="selectedIndex >= 0 ? `${listId}-option-${selectedIndex}` : undefined"
            :disabled="saving"
            data-test="reconnect-dialog-search"
          >
        </div>

        <ul
          :id="listId"
          role="listbox"
          :aria-label="$t('reconnect.dialog.listAria')"
          class="min-h-[12rem] flex-1 overflow-y-auto px-3 py-2"
          data-test="reconnect-dialog-list"
        >
          <li v-if="!rows.length" class="px-2 py-8 text-center text-sm text-gray-500" data-test="reconnect-dialog-empty">
            {{ $t('reconnect.dialog.noMatch', { query: query.trim() }) }}
          </li>
          <template v-for="(row, index) in rows" :key="row.id">
            <li
              v-if="index === 0 || rows[index - 1]!.section !== row.section"
              role="presentation"
              class="px-2 pb-1 text-[0.6875rem] font-medium text-gray-400"
              :class="index === 0 ? 'pt-1' : 'pt-3'"
              :data-test="`reconnect-dialog-section-${row.section}`"
            >
              {{ row.section === 'similar' ? $t('reconnect.dialog.similar') : $t('reconnect.dialog.all', { count: allCount }) }}
            </li>
            <li :id="`${listId}-option-${index}`" role="option" :aria-selected="row.id === selectedId ? 'true' : 'false'">
              <button
                :ref="(el) => setRowRef(row.id, el)"
                type="button"
                tabindex="-1"
                class="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left focus:outline-none"
                :class="row.id === selectedId ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : 'hover:bg-gray-50'"
                :disabled="saving"
                :data-test="`reconnect-option-${row.id}`"
                @mousedown.prevent
                @click="selectedId = row.id"
                @dblclick="confirm"
              >
                <span
                  class="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[0.625rem] font-semibold text-slate-600"
                  aria-hidden="true"
                >{{ initialsFor(row.name) }}</span>
                <span class="min-w-0 flex-1">
                  <span class="flex min-w-0 items-center gap-1.5">
                    <span class="truncate text-[0.8125rem] font-medium text-gray-900">{{ row.name }}</span>
                    <span
                      v-if="row.teamName"
                      class="flex-shrink-0 rounded-full bg-violet-50 px-1.5 py-px text-[0.625rem] font-semibold text-violet-700"
                      :title="$t('reconnect.dialog.teamLocal', { team: row.teamName })"
                    >{{ row.teamName }}</span>
                  </span>
                  <span class="block truncate text-xs text-gray-500">{{ row.folder }}</span>
                </span>
                <span class="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  <Icon v-if="row.id === selectedId" icon="heroicons:check" class="h-4 w-4 text-blue-600" aria-hidden="true" />
                </span>
              </button>
            </li>
          </template>
        </ul>

        <footer class="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <p
            v-if="failure"
            class="flex min-w-0 flex-1 items-start gap-1.5 text-xs leading-4 text-red-600"
            role="alert"
            data-test="reconnect-dialog-error"
          >
            <Icon icon="heroicons:exclamation-triangle" class="mt-px h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{{ failure }}</span>
          </p>
          <span v-else class="flex-1" />
          <button
            type="button"
            class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
            :disabled="saving"
            data-test="reconnect-dialog-cancel"
            @click="close"
          >
            {{ $t('reconnect.dialog.cancel') }}
          </button>
          <button
            type="button"
            class="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
            :disabled="!selectedId || saving"
            data-test="reconnect-dialog-confirm"
            @click="confirm"
          >
            {{ saving ? $t('reconnect.dialog.reconnecting') : $t('reconnect.dialog.confirm') }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { initialsFor } from '~/components/chat/chatComposerMenus'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useLocalization } from '~/composables/useLocalization'
import { useAgentReconnect, type MissingAgent } from '~/composables/agentReconnect/useAgentReconnect'

const props = defineProps<{ open: boolean; missing: MissingAgent | null }>()
const emit = defineEmits<{ (event: 'close'): void; (event: 'reconnected', agent: { id: string; name: string }): void }>()

const { t } = useLocalization()
const definitions = useAgentDefinitionStore()
const reconnectApi = useAgentReconnect()
const uid = Math.random().toString(36).slice(2, 8)
const titleId = `reconnect-title-${uid}`
const contextId = `reconnect-context-${uid}`
const listId = `reconnect-list-${uid}`
const searchRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const selectedId = ref<string | null>(null)
const saving = ref(false)
const failure = ref<string | null>(null)
const rowRefs = new Map<string, HTMLElement>()
const setRowRef = (id: string, el: unknown) => { if (el instanceof HTMLElement) rowRefs.set(id, el); else rowRefs.delete(id) }

type Row = { id: string; name: string; folder: string; teamName: string | null; section: 'similar' | 'all' }

const words = (value: string) => value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

/** Every agent in the catalog, by name. */
const agents = computed(() => [...(definitions.agentDefinitions ?? [])]
  .map((definition: any) => ({
    id: String(definition.id),
    name: String(definition.name),
    teamName: definition.ownershipScope === 'TEAM_LOCAL' ? (definition.ownerTeamName ?? null) : null,
    // A team-local agent is shown by its folder name inside the team.
    folder: definition.ownershipScope === 'TEAM_LOCAL' ? String(definition.id).split(':').at(-1)! : String(definition.id),
  }))
  .sort((left, right) => left.name.localeCompare(right.name)))
const allCount = computed(() => agents.value.length)

/**
 * "Similar names": agents whose id shares at least half of the missing id's words (at most three,
 * most shared first). Shown first; never chosen for the user.
 */
const similarIds = computed(() => {
  const missingWords = new Set(words(props.missing?.missingDefinitionId ?? ''))
  if (!missingWords.size) return [] as string[]
  const needed = Math.ceil(missingWords.size / 2)
  return agents.value
    .map((agent) => ({ id: agent.id, shared: new Set(words(`${agent.folder} ${agent.name}`).filter((word) => missingWords.has(word))).size }))
    .filter((entry) => entry.shared >= needed)
    .sort((left, right) => right.shared - left.shared)
    .slice(0, 3)
    .map((entry) => entry.id)
})

const rows = computed<Row[]>(() => {
  const q = query.value.trim().toLowerCase()
  const matches = (agent: { id: string; name: string }) => !q || agent.name.toLowerCase().includes(q) || agent.id.toLowerCase().includes(q)
  const similar = similarIds.value
    .map((id) => agents.value.find((agent) => agent.id === id)!)
    .filter(matches)
    .map((agent) => ({ ...agent, section: 'similar' as const }))
  const rest = agents.value
    .filter((agent) => !similarIds.value.includes(agent.id) && matches(agent))
    .map((agent) => ({ ...agent, section: 'all' as const }))
  return [...similar, ...rest]
})
const selectedIndex = computed(() => rows.value.findIndex((row) => row.id === selectedId.value))

watch(() => props.open, (open) => {
  if (!open) return
  query.value = ''
  selectedId.value = null
  failure.value = null
  saving.value = false
  void nextTick(() => searchRef.value?.focus())
}, { immediate: true })
watch(query, () => { failure.value = null })

const close = () => { if (!saving.value) emit('close') }

const move = (step: number) => {
  if (!rows.value.length) return
  const next = selectedIndex.value < 0 ? (step > 0 ? 0 : rows.value.length - 1) : (selectedIndex.value + step + rows.value.length) % rows.value.length
  selectedId.value = rows.value[next]!.id
  void nextTick(() => rowRefs.get(selectedId.value!)?.scrollIntoView({ block: 'nearest' }))
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close() }
  else if (event.key === 'ArrowDown') { event.preventDefault(); move(1) }
  else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1) }
  else if (event.key === 'Enter' && selectedId.value) { event.preventDefault(); void confirm() }
}

const confirm = async () => {
  const missing = props.missing
  const agent = agents.value.find((entry) => entry.id === selectedId.value)
  if (!missing || !agent || saving.value) return
  saving.value = true
  failure.value = null
  const result = await reconnectApi.reconnect(missing, { id: agent.id, name: agent.name })
  saving.value = false
  if (result.success) {
    emit('reconnected', { id: agent.id, name: agent.name })
    emit('close')
    return
  }
  failure.value = result.reason === 'busy'
    ? t('reconnect.dialog.busy', { name: missing.name })
    : t('reconnect.dialog.failed', { reason: result.message })
}
</script>
