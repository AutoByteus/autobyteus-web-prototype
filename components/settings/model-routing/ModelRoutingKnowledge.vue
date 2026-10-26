<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm" data-testid="model-routing-knowledge" aria-labelledby="model-routing-knowledge-heading">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div class="min-w-0 max-w-3xl">
        <h3 id="model-routing-knowledge-heading" class="text-xl font-semibold leading-tight text-gray-900">{{ t('settings.modelRouting.knowledge.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('settings.modelRouting.knowledge.description') }}</p>
      </div>
      <div v-if="!editing" class="flex flex-shrink-0 flex-wrap items-center gap-2">
        <button v-if="canUndo" type="button" class="inline-flex min-h-9 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-knowledge-undo" @click="undo">{{ t('settings.modelRouting.knowledge.undo') }}</button>
        <button v-else-if="routing.redo" type="button" class="inline-flex min-h-9 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-knowledge-redo" @click="redo">{{ t('settings.modelRouting.knowledge.redo') }}</button>
        <button type="button" class="inline-flex min-h-9 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-knowledge-edit" @click="startEdit">{{ note ? t('settings.modelRouting.knowledge.edit') : t('settings.modelRouting.knowledge.write') }}</button>
      </div>
    </div>

    <!-- Teach it -->
    <div class="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4" data-testid="model-routing-knowledge-teach">
      <p class="min-w-0 text-sm text-gray-600">
        <span class="font-semibold text-gray-900">{{ t('settings.modelRouting.knowledge.teachTitle') }}</span>
        {{ t('settings.modelRouting.knowledge.teachText') }}
      </p>
      <button type="button" class="inline-flex min-h-9 flex-shrink-0 items-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-knowledge-open-conversation" :disabled="!routing.enabled && !routing.knowledge" :title="!routing.enabled && !routing.knowledge ? t('settings.modelRouting.setup.router.noConversation') : undefined" @click="emit('open-conversation')">{{ t('settings.modelRouting.setup.router.openConversation') }}</button>
    </div>

    <!-- Edit -->
    <div v-if="editing" class="mt-4" data-testid="model-routing-knowledge-editor">
      <label class="sr-only" for="model-routing-knowledge-text">{{ t('settings.modelRouting.knowledge.title') }}</label>
      <textarea id="model-routing-knowledge-text" v-model="draft" rows="16" class="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-[0.8125rem] leading-6 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30" data-testid="model-routing-knowledge-textarea"></textarea>
      <div class="mt-3 flex items-center justify-between gap-3">
        <p class="text-xs text-gray-500">{{ t('settings.modelRouting.knowledge.editNote') }}</p>
        <div class="flex items-center gap-2">
          <button type="button" class="inline-flex min-h-9 items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1" data-testid="model-routing-knowledge-cancel" @click="editing = false">{{ t('settings.modelRouting.setup.kinds.cancel') }}</button>
          <button type="button" class="inline-flex min-h-9 items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-60" :disabled="!draft.trim()" data-testid="model-routing-knowledge-save" @click="save">{{ t('settings.modelRouting.setup.kinds.save') }}</button>
        </div>
      </div>
    </div>

    <!-- View -->
    <template v-else-if="note">
      <p class="mt-4 text-xs text-gray-500" data-testid="model-routing-knowledge-meta">{{ t(note.by === 'router' ? 'settings.modelRouting.knowledge.updatedByRouter' : 'settings.modelRouting.knowledge.updatedByYou', { time: decisionTime(note.at, locale, t) }) }}</p>
      <pre class="mt-2 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 font-mono text-[0.8125rem] leading-6 text-gray-800" data-testid="model-routing-knowledge-text">{{ note.text }}</pre>
    </template>

    <!-- Empty -->
    <div v-else class="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center" data-testid="model-routing-knowledge-empty">
      <p class="text-sm font-medium text-gray-700">{{ t('settings.modelRouting.knowledge.empty') }}</p>
      <p class="mx-auto mt-1 max-w-xl text-sm text-gray-500">{{ t('settings.modelRouting.knowledge.emptyHint') }}</p>
    </div>

    <p v-if="message" class="mt-3 text-sm text-emerald-700" role="status" data-testid="model-routing-knowledge-message">{{ message }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { routing, saveKnowledge, undoKnowledge, redoKnowledge } from '~/prototype/model-routing/modelRoutingState'
import { decisionTime } from './modelRoutingPresentation'

const emit = defineEmits<{ (event: 'open-conversation'): void }>()
const { t, resolvedLocale } = useLocalization()
const locale = computed(() => String(resolvedLocale.value || 'en'))

const note = computed(() => routing.knowledge?.current ?? null)
const canUndo = computed(() => Boolean(routing.knowledge?.previous))
const editing = ref(false)
const draft = ref('')
const message = ref('')

const startEdit = (): void => { draft.value = note.value?.text ?? ''; message.value = ''; editing.value = true }
const save = (): void => { saveKnowledge(draft.value.trim() + '\n'); editing.value = false; message.value = t('settings.modelRouting.knowledge.saved') }
const undo = (): void => { undoKnowledge(); message.value = t('settings.modelRouting.knowledge.undone') }
const redo = (): void => { redoKnowledge(); message.value = t('settings.modelRouting.knowledge.redone') }
</script>
