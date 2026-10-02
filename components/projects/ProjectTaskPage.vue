<template>
  <div class="h-full flex-1 overflow-auto bg-slate-50" data-testid="project-task-page">
    <div class="mx-auto w-full max-w-[880px] px-4 py-6 sm:px-8 sm:py-8">
      <NuxtLink :to="boardTarget" class="inline-flex min-h-9 items-center gap-1.5 rounded text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="task-back-to-board">
        <Icon icon="heroicons:arrow-left" class="h-4 w-4" aria-hidden="true" />Back to tasks
      </NuxtLink>

      <div v-if="!project || (mode !== 'create' && !task)" class="mt-5 rounded-xl border border-slate-200 bg-white p-6" role="status" data-testid="task-page-not-found">
        <h1 ref="heading" tabindex="-1" class="text-lg font-semibold text-slate-900 outline-none">{{ !project ? 'Project not found' : 'Task not found' }}</h1>
        <p class="mt-2 text-sm text-slate-600">{{ !project ? 'This project is no longer available.' : 'The task is no longer available in this project.' }}</p>
        <NuxtLink :to="project ? boardTarget : '/projects'" class="mt-4 inline-block text-sm font-medium text-blue-700">{{ project ? 'Back to tasks' : 'Back to projects' }}</NuxtLink>
      </div>

      <template v-else>
        <header class="mb-6 mt-4">
          <p class="mb-2 break-words text-sm font-medium text-slate-500" data-testid="task-project-context">{{ project.name }}</p>
          <h1 ref="heading" tabindex="-1" class="break-words text-3xl font-semibold tracking-tight text-slate-900 outline-none" data-testid="task-page-heading">{{ title }}</h1>
          <p v-if="mode === 'create'" class="mt-2 text-sm leading-6 text-slate-600">Describe the work to be done. You can add more detail as the task develops.</p>
          <p v-else-if="mode === 'edit'" class="mt-2 text-sm leading-6 text-slate-600">Update the description without changing this task's identity or status.</p>
          <div v-else class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <span class="inline-flex items-center gap-2"><span>Status</span><span class="rounded-full px-2.5 py-1 font-medium ring-1 ring-inset" :class="task!.status === 'DONE' ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : task!.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-800 ring-blue-200' : 'bg-slate-100 text-slate-700 ring-slate-200'" data-testid="task-page-status">{{ t(TASK_STATUS_LABEL_KEYS[task!.status]) }}</span></span>
            <span>{{ t('projects.components.projects.ProjectTaskDialog.updated', { time: formatDateTime(task!.updatedAt) }) }}</span>
          </div>
        </header>

        <p v-if="successNotice" class="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status" data-testid="task-page-save-notice">{{ successNotice }}</p>

        <form v-if="mode !== 'view'" novalidate @submit.prevent="save">
          <section class="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="task-details-heading">
            <h2 id="task-details-heading" class="text-base font-semibold text-slate-900">Task details</h2>
            <div class="mt-5">
              <label for="task-page-description" class="block text-sm font-medium text-slate-700">{{ t('projects.components.projects.ProjectTaskDialog.descriptionLabel') }} <span class="font-normal text-slate-400">(required)</span></label>
              <p id="task-page-help" class="mt-2 text-sm leading-5 text-slate-500">The first line is the task's summary on the board. Use the remaining lines for context and expected outcomes.</p>
              <textarea id="task-page-description" v-model="draft" rows="8" :disabled="busy" :placeholder="t('projects.components.projects.ProjectTaskDialog.descriptionPlaceholder')" :aria-invalid="fieldError ? 'true' : 'false'" :aria-describedby="fieldError ? 'task-page-help task-page-error' : 'task-page-help'" class="mt-3 block w-full resize-y rounded-md border bg-white px-3 py-3 text-base leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 sm:text-sm" :class="fieldError ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'" data-testid="task-page-description-input" @keydown.enter.ctrl.exact.prevent="save" @keydown.enter.meta.exact.prevent="save" />
              <p v-if="fieldError" id="task-page-error" class="mt-2 text-sm text-red-600" role="alert" data-testid="task-page-description-error">{{ fieldError }}</p>
              <p class="mt-3 text-xs leading-5 text-slate-500">Press Ctrl+Enter or ⌘+Enter to save.</p>
            </div>
          </section>
          <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5 pb-2">
            <NuxtLink :to="mode === 'create' ? boardTarget : detailTarget" :class="secondaryButton" class="flex-1 sm:flex-none" data-testid="task-page-cancel">{{ t('projects.common.cancel') }}</NuxtLink>
            <button type="submit" :disabled="busy" :class="primaryButton" class="flex-1 sm:flex-none" data-testid="task-page-save">{{ busy ? t('projects.common.saving') : mode === 'create' ? t('projects.components.projects.ProjectTaskDialog.create') : 'Save changes' }}</button>
          </div>
        </form>

        <template v-else>
          <section class="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="task-description-heading">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h2 id="task-description-heading" class="text-base font-semibold text-slate-900">{{ t('projects.components.projects.ProjectTaskDialog.descriptionLabel') }}</h2>
              <NuxtLink :to="`${detailTarget}/edit`" :class="secondaryButton" data-testid="task-page-edit">Edit description</NuxtLink>
            </div>
            <p class="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-800" data-testid="task-page-description">{{ task!.description }}</p>
          </section>
          <dl class="mt-5 flex flex-wrap gap-x-8 gap-y-3 px-1 text-xs leading-5 text-slate-500">
            <div class="min-w-0"><dt>Task ID</dt><dd class="break-all font-mono text-slate-600" data-testid="task-page-id">{{ task!.taskId }}</dd></div>
            <div><dt>Created</dt><dd class="text-slate-600">{{ formatDateTime(task!.createdAt) }}</dd></div>
          </dl>

          <section v-if="confirmingDelete" class="mt-6 rounded-xl border border-red-200 bg-red-50 p-5" aria-labelledby="task-delete-heading" data-testid="task-page-delete-confirmation" @keydown.esc.prevent="cancelDelete">
            <h2 id="task-delete-heading" class="font-semibold text-red-900">{{ t('projects.components.projects.ProjectTaskDialog.deleteTitle') }}</h2>
            <p class="mt-2 break-words text-sm leading-6 text-red-800">{{ t('projects.components.projects.ProjectTaskDialog.deleteMessage', { summary: taskSummary(task!.description) }) }}</p>
            <div class="mt-4 flex flex-wrap justify-end gap-3">
              <button ref="deleteCancel" type="button" :disabled="busy" :class="secondaryButton" data-testid="task-page-delete-cancel" @click="cancelDelete">{{ t('projects.common.cancel') }}</button>
              <button type="button" :disabled="busy" class="inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60" data-testid="task-page-delete-confirm" @click="remove">{{ busy ? t('projects.components.projects.ProjectTaskDialog.deleting') : t('projects.components.projects.ProjectTaskDialog.confirmDelete') }}</button>
            </div>
          </section>
          <div v-else class="mt-6 border-t border-slate-200 pt-5">
            <button ref="deleteButton" type="button" class="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" data-testid="task-page-delete" @click="requestDelete"><Icon icon="heroicons:trash" class="h-4 w-4" aria-hidden="true" />Delete task</button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalization } from '~/composables/useLocalization'
import { useProjectDesignStore } from '~/prototype/project-review/useProjectDesignStore'
import { useTaskDesignStore } from '~/prototype/project-review/useTaskDesignStore'
import { TASK_STATUS_LABEL_KEYS } from '~/utils/projects/taskStatusLabelKey'
import { taskSummary } from '~/utils/projects/taskSummary'

const props = defineProps<{ projectId: string; taskId?: string; mode: 'create' | 'view' | 'edit' }>()
const route = useRoute()
const router = useRouter()
const { t } = useLocalization()
const projects = useProjectDesignStore()
const tasks = useTaskDesignStore()
const project = computed(() => projects.projectById(props.projectId))
const task = computed(() => props.taskId ? tasks.taskById(props.projectId, props.taskId) : null)
const draft = ref(task.value?.description || '')
const fieldError = ref('')
const busy = ref(false)
const confirmingDelete = ref(false)
const heading = ref<HTMLElement | null>(null)
const deleteCancel = ref<HTMLButtonElement | null>(null)
const deleteButton = ref<HTMLButtonElement | null>(null)
const boardTarget = computed(() => `/projects/${props.projectId}`)
const detailTarget = computed(() => `${boardTarget.value}/tasks/${props.taskId}`)
const title = computed(() => props.mode === 'create' ? t('projects.components.projects.ProjectTaskDialog.createTitle') : props.mode === 'edit' ? t('projects.components.projects.ProjectTaskDialog.editTitle') : taskSummary(task.value?.description || ''))
const successNotice = computed(() => props.mode !== 'view' ? '' : route.query.notice === 'created' ? 'Task created.' : route.query.notice === 'saved' ? 'Changes saved.' : '')
const secondaryButton = 'inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60'
const primaryButton = 'inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60'
const formatDateTime = (iso: string) => new Date(iso).toLocaleString()

let noticeTimer: ReturnType<typeof setTimeout> | undefined
watch(successNotice, notice => {
  if (noticeTimer !== undefined) clearTimeout(noticeTimer)
  if (!notice) return
  noticeTimer = setTimeout(() => {
    const { notice: _expired, ...query } = route.query
    void router.replace({ query })
  }, 3000)
}, { immediate: true })
onBeforeUnmount(() => { if (noticeTimer !== undefined) clearTimeout(noticeTimer) })
onMounted(() => heading.value?.focus())

const save = async () => {
  if (busy.value || !project.value) return
  fieldError.value = ''
  if (!draft.value.trim()) {
    fieldError.value = t('projects.errors.taskDescriptionRequired')
    await nextTick()
    document.getElementById('task-page-description')?.focus()
    return
  }
  busy.value = true
  await new Promise(resolve => window.setTimeout(resolve, 250))
  const saved = props.mode === 'create' ? tasks.create(props.projectId, draft.value.trim()) : tasks.update(props.projectId, props.taskId!, draft.value.trim())
  if (saved) await router.push({ path: `${boardTarget.value}/tasks/${saved.taskId}`, query: { notice: props.mode === 'create' ? 'created' : 'saved' } })
  busy.value = false
}
const requestDelete = async () => {
  confirmingDelete.value = true
  await nextTick()
  deleteCancel.value?.focus()
}
const cancelDelete = async () => {
  confirmingDelete.value = false
  await nextTick()
  deleteButton.value?.focus()
}
const remove = async () => {
  if (busy.value || !task.value) return
  busy.value = true
  await new Promise(resolve => window.setTimeout(resolve, 250))
  tasks.remove(props.projectId, props.taskId!)
  await router.push({ path: boardTarget.value, query: { notice: 'task-deleted' } })
}
</script>
