/**
 * task-part-of (design-only): "part of" between the example Projects' Tasks.
 *
 * Invented and illustrative (Project and Task names, texts, numbers, statuses):
 * - AutoByteus: a bigger Task "Cross-node collaboration" (`autobyteus-25`, To Do) with 2 Done, 1 In Progress,
 *   1 To Do and 1 Cancelled part, so its progress reads "2 of 4 done" with a Cancelled part listed but not
 *   counted (one part also depends on another: both badges on one card);
 * - a parent whose three parts are all Done (still In Progress: closing it is deliberate);
 * - a parent with no part done yet;
 * - a Done parent and a Cancelled parent, to show a part of a closed parent;
 * - a parent that is only cancelled parts;
 * - Customer Onboarding Experience Redesign: long keys and a long summary, as a parent and its parts;
 * - every other Task has no parent and no parts (its Parts card says "No parts yet.").
 * The app does not change status; the example Tasks are seeded with the statuses a Project Task Manager's closes
 * would leave (a Cancelled parent's parts are Cancelled or already Done).
 * Turned off with the other design-only layers (`autobyteus.prototype.designOnlyLayers=off`).
 */
import { projectData } from '~/prototype/source-observation/fixtures.mjs'
import { taskKeyPrefix } from '~/prototype/task-keys/taskKeysFixture'

const AUTOBYTEUS = 'project-desktop-app'
const ONBOARDING = 'project-onboarding-redesign'
const createdAt = '2026-10-09T07:30:00.000Z'
const at = (minutes: number) => new Date(Date.parse('2026-10-11T07:00:00.000Z') + minutes * 60_000).toISOString()

type Seed = { id: string; project: string; number: number; text: string; status: string; minutes: number; partOf?: string; dependsOn?: string[] }
const SEEDS: Seed[] = [
  // Cross-node collaboration: 2 of 4 done, 1 cancelled.
  { id: 'po-cross-node', project: AUTOBYTEUS, number: 25, status: 'TODO', minutes: 61, text: 'Cross-node collaboration: agents on different nodes work on one Project\nSplit into parts; the Project Task Manager closes this Task when the work is finished.' },
  { id: 'po-cn-address', project: AUTOBYTEUS, number: 19, status: 'DONE', minutes: 58, partOf: 'po-cross-node', text: 'Design: how nodes address each other' },
  { id: 'po-cn-envelope', project: AUTOBYTEUS, number: 20, status: 'DONE', minutes: 59, partOf: 'po-cross-node', text: 'Build: node-to-node message envelope' },
  { id: 'po-cn-route', project: AUTOBYTEUS, number: 21, status: 'IN_PROGRESS', minutes: 62, partOf: 'po-cross-node', text: 'Build: route an agent\'s message to a team on another node' },
  { id: 'po-cn-team-view', project: AUTOBYTEUS, number: 22, status: 'TODO', minutes: 63, partOf: 'po-cross-node', dependsOn: ['po-cn-route'], text: 'Show a remote team member in the Team view' },
  { id: 'po-cn-folder', project: AUTOBYTEUS, number: 23, status: 'CANCELLED', minutes: 57, partOf: 'po-cross-node', text: 'Share one workspace folder across nodes\nDropped: the NFS guide covers it.' },
  // All parts done, the parent still open.
  { id: 'po-history', project: AUTOBYTEUS, number: 14, status: 'IN_PROGRESS', minutes: 64, text: 'Run history: browse and reopen past runs' },
  { id: 'po-history-list', project: AUTOBYTEUS, number: 15, status: 'DONE', minutes: 41, partOf: 'po-history', text: 'Design: the run history list' },
  { id: 'po-history-open', project: AUTOBYTEUS, number: 16, status: 'DONE', minutes: 42, partOf: 'po-history', text: 'Build: reopen a past run from the list' },
  { id: 'po-history-search', project: AUTOBYTEUS, number: 17, status: 'DONE', minutes: 43, partOf: 'po-history', text: 'Build: search past runs by text' },
  // No part done yet.
  { id: 'po-sources', project: AUTOBYTEUS, number: 10, status: 'TODO', minutes: 65, text: 'Skill sources: one place to add skills from a folder or GitHub' },
  { id: 'po-sources-folder', project: AUTOBYTEUS, number: 11, status: 'TODO', minutes: 66, partOf: 'po-sources', text: 'Add skills from a local folder' },
  { id: 'po-sources-github', project: AUTOBYTEUS, number: 12, status: 'TODO', minutes: 67, partOf: 'po-sources', text: 'Add skills from a public GitHub repository' },
  // A Done parent (an open part would have been closed with it).
  { id: 'po-hardening', project: AUTOBYTEUS, number: 6, status: 'DONE', minutes: 30, text: 'Release 1.4 hardening' },
  { id: 'po-hardening-a', project: AUTOBYTEUS, number: 7, status: 'DONE', minutes: 31, partOf: 'po-hardening', text: 'Fix the reconnect loop after sleep' },
  { id: 'po-hardening-b', project: AUTOBYTEUS, number: 8, status: 'DONE', minutes: 32, partOf: 'po-hardening', text: 'Keep the Task board scroll position on refresh' },
  { id: 'po-hardening-c', project: AUTOBYTEUS, number: 9, status: 'CANCELLED', minutes: 33, partOf: 'po-hardening', text: 'Retire the legacy banner' },
  // A Cancelled parent: its open parts were cancelled with it; a finished one stays Done.
  { id: 'po-voice', project: AUTOBYTEUS, number: 3, status: 'CANCELLED', minutes: 20, text: 'Voice notes in Tasks (dropped)' },
  { id: 'po-voice-record', project: AUTOBYTEUS, number: 4, status: 'DONE', minutes: 21, partOf: 'po-voice', text: 'Record a voice note into a Task description' },
  { id: 'po-voice-play', project: AUTOBYTEUS, number: 5, status: 'CANCELLED', minutes: 22, partOf: 'po-voice', text: 'Play a voice note on the Task page' },
  // A parent whose parts were all cancelled.
  { id: 'po-themes', project: AUTOBYTEUS, number: 1, status: 'IN_PROGRESS', minutes: 24, text: 'Dark theme for the Projects pages' },
  { id: 'po-themes-a', project: AUTOBYTEUS, number: 2, status: 'CANCELLED', minutes: 25, partOf: 'po-themes', text: 'Dark status pills' },
  // Long keys and a long summary.
  { id: 'po-ob-program', project: ONBOARDING, number: 11, status: 'IN_PROGRESS', minutes: 8, text: 'Launch the redesigned onboarding for pilot customers across web, mobile and email, with every step measured and the first-week support questions answered\nThe whole program; its parts are the slices below.' },
  { id: 'po-ob-emails', project: ONBOARDING, number: 14, status: 'DONE', minutes: 9, partOf: 'po-ob-program', text: 'Write the three welcome emails and the reminder sequence for customers who have not signed in during their first week' },
  { id: 'ob-journey', project: ONBOARDING, number: 12, status: 'IN_PROGRESS', minutes: 4, partOf: 'po-ob-program', text: '' },
  { id: 'ob-checklist', project: ONBOARDING, number: 13, status: 'TODO', minutes: 5, partOf: 'po-ob-program', text: '' },
]

/** Seeds the example parents and parts once per scenario (after the key and dependency examples). */
export const seedTaskParts = (state: Record<string, any>, scenario: string): void => {
  if (scenario !== 'populated') return
  const data = projectData(state)
  if (data.taskPartsSeeded || !data.projects.some((item: any) => item.projectId === AUTOBYTEUS)) return
  data.taskPartsSeeded = true
  for (const seed of SEEDS) {
    const existing = data.tasks.find((item: any) => item.taskId === seed.id)
    if (existing) { if (seed.partOf) existing.partOfTaskId = seed.partOf; continue }
    const project = data.projects.find((entry: any) => entry.projectId === seed.project)
    if (!project) continue
    data.tasks.push({
      __typename: 'ProjectTask', taskId: seed.id, projectId: seed.project, description: seed.text, status: seed.status, createdAt, updatedAt: at(seed.minutes),
      contextFiles: [], root: null, taskKey: `${taskKeyPrefix(project.name)}-${seed.number}`, dependsOnTaskIds: seed.dependsOn ?? [], partOfTaskId: seed.partOf ?? null,
    })
  }
  for (const item of data.tasks) item.partOfTaskId ??= null
}
