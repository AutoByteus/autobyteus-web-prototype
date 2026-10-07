/**
 * project-manager-ux round 2 (design): Tasks with no Project ("Tasks without a project").
 *
 * Hand-written and illustrative. An agent creates such a Task when it delegates with a plain
 * description (`delegate_task` without `task_id`, including every `@` request). The Task belongs to
 * the conversation that delegated it, and its root is the agent or team it was handed to.
 * Agents set DONE, and since v1.4.96-beta.1 the assigning agent can reopen a Done Task and message
 * the same worker again. Here the Prototype Launch Manager reopens "Take screenshots of the old
 * docs pages." when told "take the screenshots again" (plugins/96.project-manager.client.ts).
 */
import { reactive } from 'vue'
import { exposedFixtures } from '~/prototype/source-observation/fixtures.mjs'
import { closure, MANAGER_RUN_ID, registerClosedRuns, registerExtraExecutions } from '~/prototype/task-run-cleanup/taskManagerRunFixture'
import type { ProjectTaskWorker } from '~/types/project'

const { run: researchRun, model, workspace } = exposedFixtures as Record<string, any>

/** The list id of Tasks with no Project (route `/projects/no-project`). */
export const NO_PROJECT_ID = 'no-project'
const STORAGE_KEY = 'autobyteus.design.adHocTasks.state.v1'
const SHOTS_TASK_ID = 'adhoc-old-screenshots'
const SHOTS_RUN_ID = 'run-ptm-shots'

type State = { shots: 'DONE' | 'TODO'; reopenedAt?: string }
const load = (): State => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved?.shots === 'DONE' || saved?.shots === 'TODO') return saved as State
  } catch { /* ignore */ }
  return { shots: 'DONE' }
}
export const adHoc = reactive<State & { revision: number }>({ ...load(), revision: 0 })
const changed = () => { adHoc.revision += 1; localStorage.setItem(STORAGE_KEY, JSON.stringify({ shots: adHoc.shots, reopenedAt: adHoc.reopenedAt })) }
export const resetAdHocTasks = () => localStorage.removeItem(STORAGE_KEY)

// --- Roots ---------------------------------------------------------------------------------

const agent = (hostRunId: string, name: string, agentRunId: string, status: ProjectTaskWorker['status'], error: string | null = null): ProjectTaskWorker =>
  ({ kind: 'agent', name, hostRunId, agentRunId, teamRunId: null, openRunId: agentRunId, status, error })
const stopped = (name: string, host = researchRun.runId) => agent(host, name, `run-adhoc-${name.replace(/\s+/g, '-')}`, 'stopped')

const notesClosed = () => closure.tasks['task-release-notes'].status === 'DONE'

// --- The Tasks -----------------------------------------------------------------------------

type AdHocTask = {
  taskId: string; description: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE'; updatedAt: string
  referenceFiles: string[]; workers: () => ProjectTaskWorker[]
}
const at = (day: number, hour: number) => `2026-10-0${day}T${String(hour).padStart(2, '0')}:00:00.000Z`
const root = workspace.workspaceRootPath

const TASKS: AdHocTask[] = [
  { taskId: 'adhoc-changelog-links', description: 'Collect the changelog links for v2.', status: 'TODO', updatedAt: at(5, 8),
    referenceFiles: [`${root}/docs/changelog.md`], workers: () => [agent(MANAGER_RUN_ID, 'researcher', 'run-ptm-researcher', 'running')] },
  { taskId: 'adhoc-verify-dates', description: 'Verify the version numbers and dates in the release notes.', status: 'TODO', updatedAt: at(5, 8),
    referenceFiles: [`${root}/docs/release-notes-v2.md`], workers: () => [agent(MANAGER_RUN_ID, 'fact checker', 'run-ptm-notes-1-checker', notesClosed() ? 'stopped' : 'idle')] },
  { taskId: 'adhoc-translate', description: 'Translate the release notes into German.', status: 'TODO', updatedAt: at(5, 9),
    referenceFiles: [], workers: () => [agent(MANAGER_RUN_ID, 'translator', 'run-ptm-translator', 'failed', 'No model is set for translator.')] },
  { taskId: SHOTS_TASK_ID, description: 'Take screenshots of the old docs pages.\nEvery page under /docs, desktop width, before the v2 changes land.', status: 'DONE', updatedAt: at(5, 7),
    referenceFiles: [`${root}/docs/`], workers: () => [agent(MANAGER_RUN_ID, 'screenshot helper', SHOTS_RUN_ID, adHoc.shots === 'DONE' ? 'stopped' : 'running')] },
  { taskId: 'adhoc-broken-links', description: 'Check the docs site for broken links.', status: 'DONE', updatedAt: at(5, 6), referenceFiles: [], workers: () => [stopped('link checker', MANAGER_RUN_ID)] },
  { taskId: 'adhoc-pricing', description: 'Summarize the three competitor pricing pages.', status: 'DONE', updatedAt: at(4, 16), referenceFiles: [], workers: () => [stopped('pricing analyst')] },
  { taskId: 'adhoc-nav-states', description: 'List the navigation states that changed since v1.', status: 'DONE', updatedAt: at(4, 14), referenceFiles: [], workers: () => [stopped('ui auditor')] },
  { taskId: 'adhoc-proofread', description: 'Proofread the v2 announcement draft.', status: 'DONE', updatedAt: at(4, 11), referenceFiles: [`${root}/docs/announcement-v2.md`], workers: () => [stopped('proofreader', MANAGER_RUN_ID)] },
  { taskId: 'adhoc-analytics', description: 'Export the docs analytics for September.', status: 'DONE', updatedAt: at(3, 15), referenceFiles: [], workers: () => [stopped('data analyst')] },
  { taskId: 'adhoc-logo', description: 'Find the original logo files.', status: 'DONE', updatedAt: at(3, 10), referenceFiles: [], workers: () => [stopped('asset finder', MANAGER_RUN_ID)] },
  { taskId: 'adhoc-alt-text', description: 'Write alt text for the new screenshots.', status: 'DONE', updatedAt: at(2, 17), referenceFiles: [], workers: () => [stopped('accessibility writer', MANAGER_RUN_ID)] },
  { taskId: 'adhoc-pricing-table', description: 'Check the numbers in the pricing table.', status: 'DONE', updatedAt: at(2, 13), referenceFiles: [], workers: () => [stopped('fact checker')] },
  { taskId: 'adhoc-rename-images', description: 'Rename the image files to the new scheme.', status: 'DONE', updatedAt: at(2, 9), referenceFiles: [], workers: () => [stopped('file organizer', MANAGER_RUN_ID)] },
  { taskId: 'adhoc-headlines', description: 'Draft three headline options for the launch post.', status: 'DONE', updatedAt: at(1, 16), referenceFiles: [], workers: () => [stopped('copywriter')] },
  { taskId: 'adhoc-quotes', description: 'Collect customer quotes from the support inbox.', status: 'DONE', updatedAt: at(1, 11), referenceFiles: [], workers: () => [stopped('support analyst')] },
]

/** The Tasks with no Project, as a Task read would carry them (with root and origin). */
export const adHocTasks = () => {
  void adHoc.revision
  void closure.revision
  return TASKS.map((task) => {
    const reopened = task.taskId === SHOTS_TASK_ID
    const status = reopened ? adHoc.shots : task.status
    return {
      __typename: 'ProjectTask', taskId: task.taskId, projectId: NO_PROJECT_ID, description: task.description,
      status, createdAt: task.updatedAt, updatedAt: reopened && adHoc.reopenedAt ? adHoc.reopenedAt : task.updatedAt,
      contextFiles: [], referenceFiles: task.referenceFiles, workers: task.workers(),
    }
  })
}

// --- The screenshot helper's run under the Manager -----------------------------------------

registerExtraExecutions(() => [{
  address: '/screenshot_helper', agentRunId: SHOTS_RUN_ID, platformAgentRunId: null, delegatorAgentRunId: MANAGER_RUN_ID, startedAt: at(5, 6),
  source: { kind: 'agent', agentDefinitionId: 'agent-screenshot-helper', launchConfiguration: { runtimeKind: 'autobyteus', llmModelIdentifier: model.modelIdentifier, llmConfig: null, autoExecuteTools: true, workspaceRootPath: root } },
}])
// A Done Task's runs leave the tree; reopening brings the same run back with its conversation.
registerClosedRuns((hostRunId, runId) => {
  void adHoc.revision
  return hostRunId === MANAGER_RUN_ID && runId === SHOTS_RUN_ID && adHoc.shots === 'DONE'
})

// --- The Manager reopens or closes the screenshots Task ------------------------------------

type Entry = Record<string, unknown>
let seq = 0
const call = (toolName: string, toolArgs: Record<string, unknown>, toolResult: unknown): Entry =>
  ({ kind: 'tool_call', invocationId: `adhoc-call-${Date.now()}-${++seq}`, toolName, toolArgs, toolResult, ts: Date.now() / 1000 })
const say = (content: string): Entry => ({ kind: 'message', role: 'assistant', content, ts: Date.now() / 1000 })

/** Whether the user's message to the Prototype Launch Manager is about the screenshots Task. */
export const isScreenshotsMessage = (text: string) => /screenshot/i.test(text)

/** The Manager's scripted answer: reopen (and message the same worker), or mark DONE again. */
export const screenshotsTurn = (text: string): Entry[] => {
  const closing = /\b(done|finished|close|complete)\b/i.test(text)
  if (adHoc.shots === 'DONE' && !closing) {
    adHoc.shots = 'TODO'
    adHoc.reopenedAt = new Date().toISOString()
    changed()
    closure.revision += 1
    return [
      call('create_or_update_task', { task_id: SHOTS_TASK_ID, status: 'TODO' }, { status: 'TODO' }),
      call('send_message_to', { target_agent_run_id: SHOTS_RUN_ID, content: 'Please take the screenshots of the old docs pages again; the first set missed the API pages.' }, { status: 'delivered' }),
      say('I reopened **Take screenshots of the old docs pages.** and asked the screenshot helper to take them again.'),
    ]
  }
  if (adHoc.shots === 'TODO' && closing) {
    adHoc.shots = 'DONE'
    changed()
    closure.revision += 1
    return [
      call('create_or_update_task', { task_id: SHOTS_TASK_ID, status: 'DONE' }, { status: 'DONE' }),
      say('**Take screenshots of the old docs pages.** is done again. The screenshot helper is stopped.'),
    ]
  }
  return [say(adHoc.shots === 'DONE' ? 'The screenshots Task is already done.' : 'The screenshot helper is already working on it.')]
}
