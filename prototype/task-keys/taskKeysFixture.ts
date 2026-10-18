/**
 * task-keys-and-dependencies (design-only): readable Task keys and "depends on" for the example Projects.
 *
 * Invented and illustrative:
 * - every Project Task gets a key `<project name in lower case>-<number>`, numbered per Project in creation
 *   order; a Task created in the UI reference gets the Project's next number; keys never change;
 * - the AutoByteus Project (delegated-copy-task-locator's example Project) gets Tasks with dependencies:
 *   - the agent-loop refactor waits for compaction cache reuse;
 *   - a build Task waits for its design Task;
 *   - a follow-up whose dependency is already Done;
 *   - a Task whose only dependency was cancelled;
 * - "Customer Onboarding Experience Redesign" shows long keys.
 * Keys, "depends on" and saving them follow the base fixtures (WEB-BASELINE-REFRESH-010, the source's shape).
 * Turned off with the other design-only layers (`autobyteus.prototype.designOnlyLayers=off`).
 */
import { ensureTaskKeys, projectData, taskKeyPrefix } from '~/prototype/source-observation/fixtures.mjs'

const AUTOBYTEUS = 'project-desktop-app'
const ONBOARDING = 'project-onboarding-redesign'
const createdAt = '2026-10-09T07:30:00.000Z'
const at = (minutes: number) => new Date(Date.parse('2026-10-11T07:00:00.000Z') + minutes * 60_000).toISOString()

// WEB-BASELINE-REFRESH-010: the key rule now lives with the base fixtures (the source ships Task keys).
export { taskKeyPrefix }

const task = (taskId: string, projectId: string, description: string, status: string, minutes: number, dependsOnTaskIds: string[] = []) => ({
  __typename: 'ProjectTask', taskId, projectId, description, status, createdAt, updatedAt: at(minutes), contextFiles: [], root: null, dependsOnTaskIds,
})

const onboardingProject = {
  __typename: 'Project', projectId: ONBOARDING, name: 'Customer Onboarding Experience Redesign',
  description: 'Synthetic project with a long name, to show long Task keys.', createdAt, updatedAt: at(5),
  workspaces: [],
}

/** Explicit numbers for the example Tasks, so keys look like a Project in use (earlier numbers were deleted). */
const NUMBERS: Record<string, number> = {
  'dct-base-tests': 28, 'dct-token-meter': 29, 'dct-member-reach': 30, 'dct-cancelled-tooltip': 31, 'dct-image-context': 32,
  'dct-work-journal': 33, 'dct-release-notes': 34, 'tk-compaction': 35, 'tk-agent-loop': 36, 'tk-locator-design': 37,
  'tk-locator-build': 38, 'tk-keys-design': 39, 'tk-keys-build': 40,
  'ob-journey': 12, 'ob-checklist': 13,
}
/** Dependencies of the existing example Tasks. */
const DEPENDS_ON: Record<string, string[]> = {
  'dct-image-context': ['dct-base-tests'],
  'dct-release-notes': ['dct-cancelled-tooltip'],
}

const newTasks = () => [
  task('tk-compaction', AUTOBYTEUS, 'Compaction cache reuse: keep the provider cache across compaction\nToday every compaction drops the cached prefix.', 'IN_PROGRESS', 52),
  task('tk-agent-loop', AUTOBYTEUS, 'Agent loop refactor: one turn pipeline for every runtime\nStart after compaction cache reuse lands.', 'TODO', 53, ['tk-compaction']),
  task('tk-locator-design', AUTOBYTEUS, 'Design: navigate from a delegated copy to its Task', 'DONE', 54),
  task('tk-locator-build', AUTOBYTEUS, 'Build: navigate from a delegated copy to its Task\nImplement the approved Task summary on copy rows.', 'TODO', 55, ['tk-locator-design']),
  task('tk-keys-design', AUTOBYTEUS, 'Design: readable Task keys and "depends on"', 'IN_PROGRESS', 56),
  task('tk-keys-build', AUTOBYTEUS, 'Build: readable Task keys and "depends on"', 'TODO', 57, ['tk-keys-design', 'tk-locator-build']),
  task('ob-journey', ONBOARDING, 'Map the first-run journey for new customers', 'IN_PROGRESS', 4),
  task('ob-checklist', ONBOARDING, 'Draft the welcome checklist copy', 'TODO', 5, ['ob-journey']),
]

/** Seeds the example Projects, Tasks, numbers and dependencies once per scenario, then keys the rest. */
export const seedTaskKeys = (state: Record<string, any>, scenario: string): void => {
  if (scenario !== 'populated') return
  const data = projectData(state)
  if (!data.taskKeysSeeded) {
    data.taskKeysSeeded = true
    if (data.projects.some((item: any) => item.projectId === AUTOBYTEUS)) {
      data.projects.push(structuredClone(onboardingProject))
      data.tasks.push(...newTasks())
      for (const item of data.tasks) {
        const project = data.projects.find((entry: any) => entry.projectId === item.projectId)
        if (NUMBERS[item.taskId] && project) item.taskKey = `${taskKeyPrefix(project.name)}-${NUMBERS[item.taskId]}`
        if (DEPENDS_ON[item.taskId]) item.dependsOnTaskIds = [...DEPENDS_ON[item.taskId]!]
      }
    }
  }
  ensureTaskKeys(data)
}
