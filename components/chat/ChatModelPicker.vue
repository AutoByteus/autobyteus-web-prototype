<template>
  <div ref="rootRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      data-test="chat-model-trigger"
      class="inline-flex max-w-[22rem] items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[0.8125rem] leading-5 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      :class="popover.open.value ? 'bg-gray-50 ring-2 ring-blue-500/30' : ''"
      :aria-expanded="popover.open.value ? 'true' : 'false'"
      aria-haspopup="dialog"
      :aria-label="triggerAriaLabel"
      :title="triggerAriaLabel"
      @click="onToggle"
    >
      <ChatRuntimeBadge :runtime-id="runtime" size="sm" />
      <span class="truncate text-gray-500 max-sm:hidden">{{ runtimeDef.shortLabel }} /</span>
      <span class="truncate font-medium text-gray-900">{{ modelName }}</span>
      <span v-if="thinking" class="flex-shrink-0 text-gray-500">· {{ thinking }}</span>
      <ChatGlyph name="chevron-down" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
    </button>

    <div v-if="popover.open.value" class="fixed inset-0 z-40 bg-black/20 sm:hidden" aria-hidden="true"></div>
    <div
      v-if="popover.open.value"
      role="dialog"
      aria-label="Choose runtime and model"
      data-test="chat-model-picker"
      class="absolute right-0 z-50 flex w-[36rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-xl max-sm:fixed max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-auto max-sm:m-0 max-sm:w-auto max-sm:max-w-none max-sm:!max-h-[80vh]"
      :class="popover.placement.value === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'"
      :style="{ maxHeight: `${popover.maxHeight.value}px` }"
    >
      <!-- Search -->
      <div class="flex items-center gap-2 border-b border-gray-100 px-3 py-2.5">
        <ChatGlyph name="search" class="h-4 w-4 text-gray-400" />
        <input
          ref="searchRef"
          v-model="query"
          data-test="chat-model-search"
          type="text"
          class="w-full border-0 bg-transparent p-0 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
          :placeholder="lockedRuntime ? `Search ${runtimeDef.label} models…` : 'Search models across all runtimes…'"
          @keydown.down.prevent="focusFirstOption"
        >
        <button v-if="query" type="button" class="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Clear search" @click="query = ''">
          <ChatGlyph name="x" class="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        v-if="lockedRuntime"
        data-test="chat-runtime-locked-note"
        class="flex items-start gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-600"
      >
        <ChatGlyph name="lock" class="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
        <span>This chat runs on <strong class="font-medium text-gray-800">{{ runtimeDef.label }}</strong>. You can switch its model; the change applies from your next message. Start a new chat to use another runtime.</span>
      </div>

      <div ref="bodyRef" class="flex min-h-0 flex-1 flex-col" :class="query.trim() ? 'overflow-y-auto' : 'overflow-hidden'" @keydown="onListKeydown">
        <!-- Search results -->
        <template v-if="query.trim()">
          <div v-if="!searchGroups.length && !searchLoading.length" class="px-4 py-8 text-center text-sm text-gray-500" data-test="chat-model-search-empty">
            No models match “{{ query.trim() }}”.
          </div>
          <section v-for="group in searchGroups" :key="group.key" class="py-1">
            <h4 class="flex items-center gap-2 px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">
              <ChatRuntimeBadge :runtime-id="group.runtime" size="sm" />
              {{ group.label }}
            </h4>
            <ModelRow v-for="model in group.models" :key="model.id" :model="model" />
          </section>
          <p v-for="runtimeId in searchLoading" :key="runtimeId" class="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
            <span class="h-3 w-3 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500"></span>
            Searching {{ findRuntimeLabel(runtimeId) }} models…
          </p>
          <p v-if="!lockedRuntime && unavailableRuntimes.length" class="px-3 pb-3 pt-1 text-xs text-gray-400">
            Not searched: {{ unavailableRuntimes.map((item) => item.label).join(', ') }} (unavailable).
          </p>
        </template>

        <!-- Browse -->
        <template v-else>
          <section v-if="quickPicks.pinned.length || quickPicks.recent.length" class="flex-shrink-0 border-b border-gray-100 py-1" data-test="chat-model-quick-picks">
            <h4 class="px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Quick picks</h4>
            <button
              v-for="item in quickList"
              :key="comboKey(item.combo)"
              type="button"
              data-option
              class="group flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              :data-test="`chat-quick-pick-${comboKey(item.combo)}`"
              @click="choose(item.combo.runtime, item.combo.modelId, item.combo.thinking)"
            >
              <ChatRuntimeBadge :runtime-id="item.combo.runtime" size="sm" />
              <span class="min-w-0 flex-1 truncate">
                <span class="font-medium text-gray-900">{{ modelLabel(item.combo.modelId) }}</span>
                <span v-if="item.combo.thinking" class="text-gray-500"> · {{ item.combo.thinking }}</span>
                <span class="ml-2 text-xs text-gray-400">{{ findRuntimeLabel(item.combo.runtime) }}</span>
              </span>
              <ChatGlyph v-if="item.pinned" name="star-solid" class="h-3.5 w-3.5 flex-shrink-0 text-amber-500" aria-label="Pinned" />
              <span v-else class="flex-shrink-0 text-[0.6875rem] text-gray-400">Recent</span>
              <ChatGlyph v-if="isCurrent(item.combo.runtime, item.combo.modelId)" name="check" class="h-4 w-4 flex-shrink-0 text-blue-600" />
              <span v-else class="h-4 w-4 flex-shrink-0"></span>
            </button>
          </section>

          <div class="flex min-h-0 flex-1 flex-col sm:flex-row">
            <!-- Runtime rail -->
            <nav aria-label="Runtimes" class="flex flex-shrink-0 gap-0.5 overflow-x-auto border-b border-gray-100 p-2 sm:w-52 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:border-b-0 sm:border-r" data-test="chat-runtime-rail">
              <button
                v-for="item in runtimeRows"
                :key="item.id"
                type="button"
                data-option
                class="flex min-w-[10rem] flex-shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:min-w-0"
                :class="browseRuntime === item.id ? 'bg-gray-100' : 'hover:bg-gray-50'"
                :aria-current="browseRuntime === item.id ? 'true' : undefined"
                :title="item.hint"
                :data-test="`chat-runtime-${item.id}`"
                @click="browse(item.id)"
              >
                <ChatRuntimeBadge :runtime-id="item.id" size="sm" :class="item.selectable ? '' : 'opacity-50'" />
                <span class="min-w-0 flex-1 truncate text-[0.8125rem] font-medium" :class="item.selectable ? 'text-gray-900' : 'text-gray-400'">{{ item.label }}</span>
                <span v-if="item.id === runtime" class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" title="Current selection"></span>
                <span v-if="item.state === 'loading'" class="h-3 w-3 flex-shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" aria-label="Loading"></span>
                <ChatGlyph v-else-if="item.state === 'error'" name="warning" class="h-3.5 w-3.5 flex-shrink-0 text-red-600" />
                <span v-else class="flex-shrink-0 text-[0.6875rem] text-gray-400">{{ item.status }}</span>
              </button>
            </nav>

            <!-- Models for the browsed runtime -->
            <div class="min-h-0 min-w-0 flex-1 overflow-y-auto py-1" :data-test="`chat-model-list-${browseRuntime}`">
              <div v-if="browseRow && !browseRow.selectable" class="flex flex-col items-start gap-1.5 px-4 py-6" data-test="chat-runtime-unavailable">
                <p class="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <ChatGlyph :name="browseRow.lockedOut ? 'lock' : 'warning'" class="h-4 w-4 text-gray-400" />
                  {{ browseRow.lockedOut ? `${browseRow.label} is for new chats` : `${browseRow.label} is unavailable` }}
                </p>
                <p class="text-xs leading-5 text-gray-500">{{ browseRow.hint }}</p>
                <NuxtLink v-if="!browseRow.lockedOut" to="/settings?section=server-settings&mode=quick" class="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline">
                  Runtime settings <ChatGlyph name="arrow-right" class="h-3 w-3" />
                </NuxtLink>
              </div>
              <div v-else-if="browseStatus === 'loading'" class="space-y-1 px-3 py-2" data-test="chat-model-loading">
                <p class="flex items-center gap-2 pb-1 text-xs text-gray-500">
                  <span class="h-3 w-3 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500"></span>
                  Loading {{ findRuntimeLabel(browseRuntime) }} models…
                </p>
                <div v-for="n in 4" :key="n" class="h-9 animate-pulse rounded-md bg-gray-100"></div>
              </div>
              <div v-else-if="browseStatus === 'error'" class="flex flex-col items-start gap-2 px-4 py-6" data-test="chat-model-error">
                <p class="flex items-center gap-2 text-sm font-medium text-red-700">
                  <ChatGlyph name="warning" class="h-4 w-4" />
                  Couldn’t load models from {{ findRuntimeLabel(browseRuntime) }}.
                </p>
                <p class="text-xs text-gray-500">The runtime did not respond. Other runtimes are still available.</p>
                <button type="button" class="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50" data-test="chat-model-retry" @click="chat.retryCatalog(browseRuntime)">
                  <ChatGlyph name="retry" class="h-3.5 w-3.5" /> Retry
                </button>
              </div>
              <template v-else>
                <section v-for="group in browseGroups" :key="group.provider">
                  <h4 class="px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">{{ group.provider }}</h4>
                  <ModelRow v-for="model in group.models" :key="model.id" :model="model" />
                </section>
              </template>
            </div>
          </div>
        </template>
      </div>

      <!-- Model settings -->
      <footer v-if="selectedModel?.thinkingLevels?.length" class="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-gray-100 bg-gray-50/70 px-3 py-2.5" data-test="chat-thinking-control">
        <span class="text-xs font-medium text-gray-600">Reasoning effort</span>
        <div role="radiogroup" aria-label="Reasoning effort" class="inline-flex rounded-md border border-gray-200 bg-white p-0.5">
          <button
            v-for="level in selectedModel.thinkingLevels"
            :key="level"
            type="button"
            role="radio"
            :aria-checked="thinking === level ? 'true' : 'false'"
            class="rounded px-2 py-0.5 text-xs transition-colors"
            :class="thinking === level ? 'bg-blue-600 font-medium text-white' : 'text-gray-600 hover:bg-gray-100'"
            @click="emit('select', { runtime, modelId, thinking: level })"
          >{{ level }}</button>
        </div>
        <span class="ml-auto truncate text-[0.6875rem] text-gray-400">for {{ selectedModel.name }}</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, ref, watch } from 'vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import ChatRuntimeBadge from '~/components/chat/ChatRuntimeBadge.vue'
import { CHAT_MODELS, CHAT_RUNTIMES, type ChatCombo, type ChatModel, type ChatRuntimeId } from '~/prototype/chat/chat-fixtures'
import { findModel, findRuntime, modelsForRuntime, usePrototypeChat, type CatalogStatus } from '~/composables/chat/usePrototypeChat'
import { useChatPopover } from '~/composables/chat/useChatPopover'

const props = defineProps<{
  runtime: ChatRuntimeId
  modelId: string
  thinking?: string
  lockedRuntime?: boolean
}>()
const emit = defineEmits<{ (e: 'select', value: ChatCombo): void }>()

const chat = usePrototypeChat()
const { comboKey } = chat
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const popover = useChatPopover(rootRef, triggerRef, 480)
const query = ref('')
const browseRuntime = ref<ChatRuntimeId>(props.runtime)

const runtimeDef = computed(() => findRuntime(props.runtime))
const selectedModel = computed(() => findModel(props.modelId))
const modelName = computed(() => selectedModel.value?.name ?? props.modelId)
const triggerAriaLabel = computed(() => `Model: ${modelName.value} on ${runtimeDef.value.label}${props.thinking ? `, reasoning effort ${props.thinking}` : ''}. Change runtime or model`)

const findRuntimeLabel = (id: ChatRuntimeId) => findRuntime(id).label
const modelLabel = (id: string) => findModel(id)?.name ?? id
const isCurrent = (runtime: ChatRuntimeId, modelId: string) => runtime === props.runtime && modelId === props.modelId

const onToggle = async () => {
  if (!popover.open.value) {
    query.value = ''
    browseRuntime.value = props.runtime
    chat.ensureCatalog(props.runtime)
  }
  await popover.toggle()
  if (popover.open.value) {
    await nextTick()
    searchRef.value?.focus()
  }
}

const browse = (id: ChatRuntimeId) => {
  browseRuntime.value = id
  if (!props.lockedRuntime || id === props.runtime) chat.ensureCatalog(id)
}

const choose = (runtime: ChatRuntimeId, modelId: string, thinking?: string) => {
  const model = findModel(modelId)
  emit('select', { runtime, modelId, thinking: thinking ?? model?.defaultThinking })
  popover.close(true)
}

const quickPicks = computed(() => {
  const allowed = (runtime: ChatRuntimeId) => findRuntime(runtime).enabled && (!props.lockedRuntime || runtime === props.runtime)
  const pinned: ChatCombo[] = chat.state.favorites
    .map((key) => {
      const [runtime, modelId] = key.split('|') as [ChatRuntimeId, string]
      return { runtime, modelId, thinking: findModel(modelId)?.defaultThinking }
    })
    .filter((combo) => allowed(combo.runtime) && findModel(combo.modelId))
  const pinnedKeys = new Set(pinned.map(comboKey))
  const recent = chat.state.recents.filter((combo) => allowed(combo.runtime) && !pinnedKeys.has(comboKey(combo))).slice(0, 3)
  return { pinned, recent }
})
const quickList = computed(() => [
  ...quickPicks.value.pinned.map((combo) => ({ combo, pinned: true })),
  ...quickPicks.value.recent.map((combo) => ({ combo, pinned: false })),
].slice(0, 4))

const runtimeRows = computed(() => CHAT_RUNTIMES.map((item) => {
  const lockedOut = Boolean(props.lockedRuntime && item.id !== props.runtime)
  const catalog = chat.state.catalog[item.id]
  let status = ''
  let hint = ''
  let state: CatalogStatus | 'off' = catalog
  if (!item.enabled) {
    status = 'Off'
    state = 'off'
    hint = `${item.unavailableReason ?? 'This runtime is not available.'} Install or enable it to use it for chats.`
  } else if (lockedOut) {
    state = 'off'
    hint = `This chat already runs on ${findRuntime(props.runtime).label}. Start a new chat to use ${item.label}.`
  } else if (catalog === 'ready') {
    status = String(modelsForRuntime(item.id).length)
    hint = `${status} models`
  } else if (catalog === 'error') {
    hint = 'Couldn’t load models'
  } else if (catalog === 'loading') {
    hint = 'Loading models…'
  }
  return { id: item.id, label: item.label, status, hint, state, lockedOut, selectable: item.enabled && !lockedOut }
}))
const browseRow = computed(() => runtimeRows.value.find((row) => row.id === browseRuntime.value))

const browseStatus = computed(() => chat.state.catalog[browseRuntime.value])
const groupByProvider = (models: ChatModel[]) => {
  const groups = new Map<string, ChatModel[]>()
  for (const model of models) groups.set(model.provider, [...(groups.get(model.provider) ?? []), model])
  return [...groups.entries()].map(([provider, items]) => ({ provider, models: items }))
}
const browseGroups = computed(() => groupByProvider(modelsForRuntime(browseRuntime.value)))

const searchableRuntimes = computed(() => CHAT_RUNTIMES.filter((item) => item.enabled && (!props.lockedRuntime || item.id === props.runtime)))
const unavailableRuntimes = computed(() => CHAT_RUNTIMES.filter((item) => !item.enabled))
watch(query, (value) => {
  if (value.trim()) searchableRuntimes.value.forEach((item) => chat.ensureCatalog(item.id))
})
const searchLoading = computed(() => searchableRuntimes.value.filter((item) => chat.state.catalog[item.id] === 'loading').map((item) => item.id))
const searchGroups = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return []
  const terms = needle.split(/\s+/)
  const groups: { key: string; runtime: ChatRuntimeId; label: string; models: ChatModel[] }[] = []
  for (const item of searchableRuntimes.value) {
    if (chat.state.catalog[item.id] !== 'ready') continue
    const matches = CHAT_MODELS.filter((model) => model.runtime === item.id && terms.every((term) =>
      `${model.name} ${model.provider} ${model.description ?? ''} ${item.label}`.toLowerCase().includes(term)))
    for (const group of groupByProvider(matches)) {
      groups.push({ key: `${item.id}-${group.provider}`, runtime: item.id, label: `${item.label} · ${group.provider}`, models: group.models })
    }
  }
  return groups
})

const focusFirstOption = () => {
  bodyRef.value?.querySelector<HTMLElement>('[data-option]:not([aria-disabled="true"])')?.focus()
}
const onListKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const options = Array.from(bodyRef.value?.querySelectorAll<HTMLElement>('[data-option]:not([aria-disabled="true"])') ?? [])
  const index = options.indexOf(document.activeElement as HTMLElement)
  if (index === -1) return
  event.preventDefault()
  const next = event.key === 'ArrowDown' ? Math.min(options.length - 1, index + 1) : index - 1
  if (next < 0) searchRef.value?.focus()
  else options[next]?.focus()
}

const ModelRow = defineComponent({
  props: { model: { type: Object as () => ChatModel, required: true } },
  setup(rowProps) {
    return () => {
      const model = rowProps.model
      const current = isCurrent(model.runtime, model.id)
      const pinned = chat.isFavorite({ runtime: model.runtime, modelId: model.id })
      return h('div', { class: 'group flex items-center gap-1 pr-2 hover:bg-gray-50 focus-within:bg-gray-50' }, [
        h('button', {
          type: 'button',
          'data-option': '',
          'data-test': `chat-model-option-${model.id}`,
          class: 'flex min-w-0 flex-1 items-center gap-2 py-1.5 pl-3 text-left focus:outline-none',
          'aria-pressed': current ? 'true' : 'false',
          onClick: () => choose(model.runtime, model.id),
        }, [
          h('span', { class: 'min-w-0 flex-1' }, [
            h('span', { class: ['block truncate text-sm', current ? 'font-semibold text-blue-700' : 'font-medium text-gray-900'] }, model.name),
            model.description ? h('span', { class: 'block truncate text-xs text-gray-500' }, model.description) : null,
          ]),
          current ? h(ChatGlyph, { name: 'check', class: 'h-4 w-4 flex-shrink-0 text-blue-600' }) : null,
        ]),
        h('button', {
          type: 'button',
          class: ['rounded p-1 transition-opacity focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40', pinned ? 'text-amber-500 opacity-100' : 'text-gray-300 opacity-0 hover:text-gray-500 group-hover:opacity-100'],
          'aria-label': pinned ? `Unpin ${model.name}` : `Pin ${model.name}`,
          'aria-pressed': pinned ? 'true' : 'false',
          title: pinned ? 'Unpin' : 'Pin to top',
          'data-test': `chat-model-pin-${model.id}`,
          onClick: () => chat.toggleFavorite({ runtime: model.runtime, modelId: model.id }),
        }, [h(ChatGlyph, { name: pinned ? 'star-solid' : 'star', class: 'h-4 w-4' })]),
      ])
    }
  },
})
</script>
