import { createApp } from 'vue'
import { defineNuxtPlugin } from '#app'
import TaskDoneReviewPanel from '~/prototype/task-run-cleanup/TaskDoneReviewPanel.vue'

/**
 * task-run-resources-workspace-cleanup (design review only): mounts the review panel that stands
 * in for the Project Task Manager's Task updates. Opened with `?prototypeReview=task-run-cleanup`;
 * it stays for the browser session. Not product UI.
 */
const SESSION_KEY = 'autobyteus.design.taskRunCleanup.review'

export default defineNuxtPlugin((nuxtApp) => {
  const requested = new URLSearchParams(window.location.search).get('prototypeReview') === 'task-run-cleanup'
  if (requested) sessionStorage.setItem(SESSION_KEY, '1')
  if (sessionStorage.getItem(SESSION_KEY) !== '1') return
  nuxtApp.hook('app:mounted', () => {
    const host = document.createElement('div')
    host.id = 'task-run-cleanup-review'
    document.body.appendChild(host)
    const app = createApp(TaskDoneReviewPanel)
    app.use(nuxtApp.$pinia as any)
    app.mount(host)
  })
})
