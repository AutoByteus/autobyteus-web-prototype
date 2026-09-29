<template>
  <div ref="rootRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      data-test="chat-model-trigger"
      class="inline-flex max-w-[20rem] items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] leading-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      :class="['hover:bg-gray-100', popover.open.value ? 'bg-gray-100' : '']"
      :aria-expanded="popover.open.value ? 'true' : 'false'"
      aria-haspopup="menu"
      :aria-label="`Model: ${modelName} on ${runtimeDef.label}. Change model`"
      :title="`${modelName} · ${runtimeDef.label}`"
      @click="onToggle"
    >
      <span class="truncate font-medium text-gray-800">{{ modelName }}</span>
      <span class="truncate text-gray-400 max-sm:hidden">{{ runtimeDef.shortLabel }}</span>
      <ChatGlyph name="chevron-down" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
    </button>

    <div v-if="popover.open.value" class="fixed inset-0 z-40 bg-black/20 sm:hidden" aria-hidden="true"></div>

    <div
      v-if="popover.open.value"
      ref="menuRef"
      role="menu"
      aria-label="Choose model"
      data-test="chat-model-picker"
      class="absolute right-0 z-50 flex w-[19rem] flex-col rounded-lg border border-gray-200 bg-white text-left shadow-lg max-sm:fixed max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-auto max-sm:m-0 max-sm:w-auto"
      :class="popover.placement.value === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
      @keydown="onMenuKeydown"
    >
      <!-- Narrow drill-in header -->
      <button
        v-if="drilled"
        type="button"
        class="flex items-center gap-1.5 rounded-t-lg border-b border-gray-100 px-3 py-2 text-left text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-50"
        @click="closeSubmenu(true)"
      >
        <ChatGlyph name="chevron-down" class="h-3.5 w-3.5 rotate-90 text-gray-400" /> {{ findRuntime(submenuRuntime!).label }}
      </button>

      <div v-else class="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
        <ChatGlyph name="search" class="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
        <input
          ref="searchRef"
          v-model="query"
          data-test="chat-model-search"
          type="text"
          class="w-full border-0 bg-transparent p-0 text-[0.8125rem] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
          placeholder="Search models"
          aria-label="Search models"
          @keydown.down.prevent="focusRow(0)"
        >
      </div>

      <div class="p-1" :class="query.trim() || drilled ? 'max-h-[22rem] overflow-y-auto' : ''">
        <!-- Narrow drill-in: one runtime's models -->
        <ModelList v-if="drilled" :runtime-id="submenuRuntime!" />

        <!-- Search -->
        <template v-else-if="query.trim()">
          <p v-if="!searchResults.length && !searchLoading" class="px-2 py-3 text-center text-[0.8125rem] text-gray-500" data-test="chat-model-search-empty">No models match “{{ query.trim() }}”</p>
          <button
            v-for="model in searchResults"
            :key="model.id"
            type="button"
            role="menuitemradio"
            :aria-checked="isCurrent(model) ? 'true' : 'false'"
            data-row
            :data-test="`chat-model-option-${model.id}`"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.8125rem] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            @click="choose(model)"
          >
            <span class="min-w-0 flex-1 truncate text-gray-900">{{ model.name }}</span>
            <span class="flex-shrink-0 text-xs text-gray-400">{{ findRuntime(model.runtime).shortLabel }}</span>
            <CheckSlot :on="isCurrent(model)" />
          </button>
          <p v-if="searchLoading" class="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-400">
            <span class="h-3 w-3 animate-spin rounded-full border-2 border-gray-200 border-t-gray-400"></span> Searching all runtimes…
          </p>
        </template>

        <!-- Browse -->
        <template v-else>
          <p class="px-2 pb-0.5 pt-1.5 text-[0.6875rem] font-medium text-gray-400">Runtimes</p>
          <div
            v-for="item in CHAT_RUNTIMES"
            :key="item.id"
            class="relative"
            @mouseenter="!narrow && (item.enabled ? openSubmenu(item.id, false) : closeSubmenu(false))"
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              :aria-expanded="submenuRuntime === item.id ? 'true' : 'false'"
              :aria-disabled="item.enabled ? undefined : 'true'"
              data-row
              :data-runtime="item.id"
              :data-test="`chat-runtime-${item.id}`"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.8125rem] focus:outline-none"
              :class="[
                item.enabled ? 'text-gray-900 hover:bg-gray-100 focus:bg-gray-100' : 'cursor-default text-gray-400',
                submenuRuntime === item.id ? 'bg-gray-100' : '',
              ]"
              :title="item.enabled ? undefined : item.unavailableReason"
              @click="item.enabled && openSubmenu(item.id, true)"
            >
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
              <span v-if="item.id === runtime" class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" aria-label="Current runtime"></span>
              <template v-if="item.enabled">
                <span v-if="chat.state.catalog[item.id] === 'ready'" class="flex-shrink-0 text-xs tabular-nums text-gray-400">{{ modelsForRuntime(item.id).length }}</span>
                <ChatGlyph name="chevron-down" class="h-3.5 w-3.5 flex-shrink-0 -rotate-90 text-gray-400" />
              </template>
              <span v-else class="flex-shrink-0 text-xs text-gray-400" data-test="chat-runtime-unavailable">Not installed</span>
            </button>

            <!-- Desktop submenu -->
            <div
              v-if="submenuRuntime === item.id && !narrow"
              role="menu"
              :aria-label="`${item.label} models`"
              class="absolute z-50 w-[17rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
              :class="flyoutSide === 'left' ? 'right-full mr-1.5' : 'left-full ml-1.5'"
              :style="{ top: `${flyoutOffset}px` }"
              data-test="chat-model-submenu"
              @keydown.left.stop.prevent="closeSubmenu(true)"
            >
              <div class="max-h-[20rem] overflow-y-auto">
                <ModelList :runtime-id="item.id" />
              </div>
            </div>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ChatGlyph from '~/components/chat/ChatGlyph.vue'
import { CHAT_MODELS, CHAT_RUNTIMES, type ChatCombo, type ChatModel, type ChatRuntimeId } from '~/prototype/chat/chat-fixtures'
import { findModel, findRuntime, modelsForRuntime, usePrototypeChat } from '~/composables/chat/usePrototypeChat'
import { useChatPopover } from '~/composables/chat/useChatPopover'

const props = defineProps<{
  runtime: ChatRuntimeId
  modelId: string
  thinking?: string
}>()
const emit = defineEmits<{ (e: 'select', value: ChatCombo): void }>()

const chat = usePrototypeChat()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const popover = useChatPopover(rootRef, triggerRef, 360)
const query = ref('')
const submenuRuntime = ref<ChatRuntimeId | null>(null)
const flyoutSide = ref<'left' | 'right'>('right')
const flyoutOffset = ref(-5)
const narrow = ref(false)
const drilled = computed(() => narrow.value && submenuRuntime.value !== null)

const updateNarrow = () => { narrow.value = window.innerWidth < 640 }
onMounted(() => { updateNarrow(); window.addEventListener('resize', updateNarrow) })
onBeforeUnmount(() => window.removeEventListener('resize', updateNarrow))

const runtimeDef = computed(() => findRuntime(props.runtime))
const modelName = computed(() => findModel(props.modelId)?.name ?? props.modelId)
const modelLabel = (id: string) => findModel(id)?.name ?? id
const isCurrent = (model: ChatModel) => model.runtime === props.runtime && model.id === props.modelId


const onToggle = async () => {
  if (!popover.open.value) {
    query.value = ''
    submenuRuntime.value = null
    chat.ensureCatalog(props.runtime)
  }
  await popover.toggle()
  if (popover.open.value) {
    await nextTick()
    searchRef.value?.focus()
  }
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null
const openSubmenu = (id: ChatRuntimeId, immediate: boolean) => {
  if (hoverTimer) clearTimeout(hoverTimer)
  const apply = async () => {
    const menu = menuRef.value
    if (menu) {
      const rect = menu.getBoundingClientRect()
      flyoutSide.value = rect.right + 290 > window.innerWidth ? 'left' : 'right'
      const row = menu.querySelector<HTMLElement>(`[data-runtime="${id}"]`)
      const rowTop = row?.getBoundingClientRect().top ?? rect.top
      const providers = new Set(modelsForRuntime(id).map((model) => model.provider)).size
      const estimated = Math.min(330, 10 + modelsForRuntime(id).length * 32 + (providers > 1 ? providers * 24 : 0))
      const overflow = rowTop - 5 + estimated - (window.innerHeight - 12)
      flyoutOffset.value = overflow > 0 ? -5 - overflow : -5
    }
    submenuRuntime.value = id
    chat.ensureCatalog(id)
    if (immediate) {
      await nextTick()
      focusFirstInSubmenu()
    }
  }
  if (immediate || submenuRuntime.value === null) void apply()
  else hoverTimer = setTimeout(apply, 90)
}
const closeSubmenu = (refocus: boolean) => {
  if (hoverTimer) clearTimeout(hoverTimer)
  const previous = submenuRuntime.value
  submenuRuntime.value = null
  if (refocus && previous) nextTick(() => menuRef.value?.querySelector<HTMLElement>(`[data-runtime="${previous}"]`)?.focus())
}

const choose = (model: ChatModel) => {
  const keepThinking = model.runtime === props.runtime && model.id === props.modelId ? props.thinking : undefined
  emit('select', { runtime: model.runtime, modelId: model.id, thinking: keepThinking ?? model.defaultThinking })
  popover.close(true)
}

// Search across enabled runtimes (or the fixed runtime in an existing chat).
const searchableRuntimes = computed(() => CHAT_RUNTIMES.filter((item) => item.enabled))
watch(query, (value) => { if (value.trim()) searchableRuntimes.value.forEach((item) => chat.ensureCatalog(item.id)) })
const searchLoading = computed(() => searchableRuntimes.value.some((item) => chat.state.catalog[item.id] === 'loading'))
const searchResults = computed(() => {
  const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return CHAT_MODELS.filter((model) => searchableRuntimes.value.some((item) => item.id === model.runtime)
    && chat.state.catalog[model.runtime] === 'ready'
    && terms.every((term) => `${model.name} ${model.provider} ${findRuntime(model.runtime).label}`.toLowerCase().includes(term)))
})

// Keyboard: arrows move within the current level; Right opens a runtime; Left returns.
const SUBMENU = '[data-test="chat-model-submenu"]'
const rows = () => Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[data-row]:not([aria-disabled="true"])') ?? [])
  .filter((el) => !el.closest(SUBMENU))
const focusRow = (index: number) => rows()[index]?.focus()
const focusFirstInSubmenu = () => {
  const scope = menuRef.value?.querySelector<HTMLElement>(SUBMENU) ?? menuRef.value
  scope?.querySelector<HTMLElement>('[data-test^="chat-model-list-"] [data-row]')?.focus()
}
const onMenuKeydown = (event: KeyboardEvent) => {
  const active = document.activeElement as HTMLElement | null
  if (event.key === 'ArrowRight' && active?.dataset.runtime) {
    event.preventDefault()
    openSubmenu(active.dataset.runtime as ChatRuntimeId, true)
    return
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const sub = active?.closest<HTMLElement>(SUBMENU)
  const scope = sub ? Array.from(sub.querySelectorAll<HTMLElement>('[data-row]')) : rows()
  const index = scope.indexOf(active as HTMLElement)
  if (index === -1) return
  event.preventDefault()
  const next = event.key === 'ArrowDown' ? Math.min(scope.length - 1, index + 1) : index - 1
  if (next < 0 && !sub) searchRef.value?.focus()
  else scope[Math.max(0, next)]?.focus()
}

const CheckSlot = defineComponent({
  props: { on: Boolean },
  setup: (p) => () => h('span', { class: 'flex h-4 w-4 flex-shrink-0 items-center justify-center' }, p.on ? [h(ChatGlyph, { name: 'check', class: 'h-4 w-4 text-blue-600' })] : []),
})

const ModelList = defineComponent({
  props: { runtimeId: { type: String as () => ChatRuntimeId, required: true } },
  setup(listProps) {
    return () => {
      const id = listProps.runtimeId
      const status = chat.state.catalog[id]
      if (status === 'loading' || status === 'idle') {
        return h('p', { class: 'flex items-center gap-2 px-2 py-2 text-xs text-gray-400', 'data-test': 'chat-model-loading' }, [
          h('span', { class: 'h-3 w-3 animate-spin rounded-full border-2 border-gray-200 border-t-gray-400' }), 'Loading models…',
        ])
      }
      if (status === 'error') {
        return h('div', { class: 'flex items-center justify-between gap-2 px-2 py-1.5 text-xs', 'data-test': 'chat-model-error' }, [
          h('span', { class: 'text-red-600' }, 'Couldn’t load models'),
          h('button', { type: 'button', 'data-row': '', class: 'rounded px-1.5 py-0.5 font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none', 'data-test': 'chat-model-retry', onClick: () => chat.retryCatalog(id) }, 'Retry'),
        ])
      }
      const models = modelsForRuntime(id)
      const providers = [...new Set(models.map((model) => model.provider))]
      const children: any[] = []
      for (const provider of providers) {
        if (providers.length > 1) children.push(h('p', { class: 'px-2 pb-0.5 pt-1.5 text-[0.6875rem] font-medium text-gray-400' }, provider))
        for (const model of models.filter((item) => item.provider === provider)) {
          const current = isCurrent(model)
          children.push(h('button', {
            type: 'button',
            role: 'menuitemradio',
            'aria-checked': current ? 'true' : 'false',
            'data-row': '',
            'data-test': `chat-model-option-${model.id}`,
            title: model.description,
            class: 'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.8125rem] text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
            onClick: () => choose(model),
          }, [
            h('span', { class: 'min-w-0 flex-1 truncate' }, model.name),
            h(CheckSlot, { on: current }),
          ]))
        }
      }
      return h('div', { 'data-test': `chat-model-list-${id}` }, children)
    }
  },
})
</script>
