<template>
  <!-- Design review only (not product UI): stands in for the Manager's Task updates. -->
  <section
    class="fixed bottom-4 right-16 z-[200] w-[19rem] overflow-hidden rounded-lg border border-slate-300 bg-white text-xs text-slate-700 shadow-xl"
    data-test="task-run-cleanup-review-panel"
    aria-label="Design review controls"
  >
    <header class="flex items-center justify-between bg-slate-800 px-3 py-2 text-white">
      <span class="font-semibold">Design review · simulation</span>
      <button type="button" class="rounded px-1 text-slate-300 hover:text-white" :aria-label="open ? 'Hide' : 'Show'" @click="open = !open">
        {{ open ? '–' : '+' }}
      </button>
    </header>
    <div v-if="open" class="space-y-3 p-3">
      <div>
        <p class="mb-1.5 font-semibold text-slate-900">Project Task Manager's Tasks</p>
        <ul class="space-y-1.5">
          <li v-for="task in TASKS" :key="task.id" class="flex items-center gap-2">
            <span class="min-w-0 flex-1">
              <span class="block truncate font-medium text-slate-900">{{ task.title }}</span>
              <span class="block truncate text-slate-500">{{ task.assignee }}<template v-if="roundCount(task.id) > 1"> · delegated {{ roundCount(task.id) }}×</template></span>
            </span>
            <span
              class="rounded-full px-1.5 py-0.5 text-[0.6875rem] font-medium"
              :class="taskStatus(task.id) === 'done' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'"
            >{{ taskStatus(task.id) === 'done' ? 'Done' : 'In progress' }}</span>
            <button
              v-if="taskStatus(task.id) === 'open'"
              type="button"
              class="rounded border border-slate-300 px-1.5 py-0.5 font-medium hover:bg-slate-50"
              :data-test="`mark-done-${task.id}`"
              @click="done(task.id)"
            >Mark DONE</button>
            <button
              v-else
              type="button"
              class="rounded border border-slate-300 px-1.5 py-0.5 font-medium hover:bg-slate-50"
              :data-test="`reopen-${task.id}`"
              title="Reopen the Task and delegate it again"
              @click="reopen(task.id)"
            >Reopen</button>
          </li>
        </ul>
      </div>
      <fieldset>
        <legend class="mb-1 font-semibold text-slate-900">How rows leave (DEC-001)</legend>
        <div class="grid grid-cols-2 gap-1">
          <label v-for="option in removalOptions" :key="option.value" class="flex cursor-pointer items-center gap-1 rounded border px-1.5 py-1" :class="reviewOptions.removal === option.value ? 'border-blue-400 bg-blue-50' : 'border-slate-200'">
            <input v-model="reviewOptions.removal" type="radio" name="removal" :value="option.value" class="h-3 w-3">
            {{ option.label }}
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend class="mb-1 font-semibold text-slate-900">Worker conversation open at DONE (DEC-005)</legend>
        <div class="grid grid-cols-2 gap-1">
          <label v-for="option in conversationOptions" :key="option.value" class="flex cursor-pointer items-center gap-1 rounded border px-1.5 py-1" :class="reviewOptions.openConversation === option.value ? 'border-blue-400 bg-blue-50' : 'border-slate-200'">
            <input v-model="reviewOptions.openConversation" type="radio" name="open-conversation" :value="option.value" class="h-3 w-3">
            {{ option.label }}
          </label>
        </div>
      </fieldset>
      <div class="flex items-center justify-between border-t border-slate-100 pt-2 text-slate-500">
        <span>Reload keeps the Task states.</span>
        <button type="button" class="font-medium text-slate-700 underline" data-test="reset-task-run-cleanup" @click="reset">Reset</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TASKS, closure, markTaskDone, reopenAndDelegate, resetClosure, roundCount, taskStatus, managerConversation, MANAGER_RUN_ID } from './taskManagerRunFixture'
import { reviewOptions } from './reviewOptions'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import { buildConversationFromProjection } from '~/services/runHydration/runProjectionConversation'
import { AgentStatus } from '~/types/agent/AgentStatus'

const open = ref(true)
const removalOptions = [
  { value: 'fade', label: 'Fade out (proposed)' },
  { value: 'instant', label: 'Instant' },
] as const
const conversationOptions = [
  { value: 'manager', label: 'Back to Manager (proposed)' },
  { value: 'notice', label: 'Stay, read-only' },
] as const

const contexts = useAgentContextsStore()
const collaboration = useAgentRunCollaborationStore()

/** The Manager's own conversation shows what it did, as its stream would. */
const refreshManagerConversation = () => {
  const context = contexts.getRun(MANAGER_RUN_ID)
  if (!context) return
  context.state.conversation = buildConversationFromProjection(MANAGER_RUN_ID, managerConversation() as any, {
    agentDefinitionId: context.config.agentDefinitionId,
    agentName: context.config.agentDefinitionName || 'Project Task Manager',
    llmModelIdentifier: context.config.llmModelIdentifier,
  })
}

/** A reopened Task's new runs arrive like any new Task run (the tree reads the view again). */
const reloadTree = () => { if (collaboration.contextFor(MANAGER_RUN_ID)) void collaboration.inspect(MANAGER_RUN_ID) }

/** DONE stops the Task's runs: their status reads Offline wherever they are still shown. */
const markStopped = () => {
  const root = collaboration.contextFor(MANAGER_RUN_ID)
  for (const runId of closure.lastClosed?.runIds ?? []) {
    const context = root?.getAgentContext(runId)
    if (context) context.state.currentStatus = AgentStatus.Offline
  }
}

const done = (taskId: (typeof TASKS)[number]['id']) => { markTaskDone(taskId); markStopped(); refreshManagerConversation() }
const reopen = (taskId: (typeof TASKS)[number]['id']) => { reopenAndDelegate(taskId); reloadTree() }
const reset = () => { resetClosure(); refreshManagerConversation(); reloadTree() }
</script>
