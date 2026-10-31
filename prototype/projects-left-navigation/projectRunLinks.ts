/**
 * projects-left-navigation (design-only): which runs belong to which Project in the left panel's Projects mode.
 *
 * Everything here is invented and illustrative. It stands in for the two sources the product will read
 * (REQ-003): the record "this run was started under Project P" and the Task records that say "this run
 * hosts an assignment of P's Task". Run IDs are the example runs of the other design layers
 * (`delegatedCopyTasksFixture`, `source-observation/fixtures.mjs`); the Projects are the example Projects.
 *
 * - AutoByteus: the Project Task Manager run (started under it; it also dispatched a Prototype Launch Task, so it
 *   is listed there too, as the same run), and a Product Review Team run.
 * - Prototype Launch: a Research Assistant run, a Tutorial Video Producer run, a Video Team run, the Product Launch
 *   Org run (it only hosts Task work), and the Project Task Manager run (it dispatched one of its Tasks).
 * - Customer Onboarding Experience Redesign: no runs.
 */
export type ProjectRunKind = 'agent' | 'team' | 'org'
export type ProjectRunLink = Readonly<{ kind: ProjectRunKind; runId: string; startedUnder: boolean }>

export const AUTOBYTEUS_PROJECT_ID = 'project-desktop-app'
export const PROTOTYPE_LAUNCH_PROJECT_ID = 'project-prototype-launch'

export const PROJECT_RUN_LINKS: Readonly<Record<string, readonly ProjectRunLink[]>> = {
  [AUTOBYTEUS_PROJECT_ID]: [
    { kind: 'agent', runId: 'run-ptm-0001', startedUnder: true },
    { kind: 'team', runId: 'team-run-001', startedUnder: true },
  ],
  [PROTOTYPE_LAUNCH_PROJECT_ID]: [
    { kind: 'agent', runId: 'run-ptm-0001', startedUnder: false },
    { kind: 'agent', runId: 'run-research-001', startedUnder: true },
    { kind: 'agent', runId: 'run-tvp-0001', startedUnder: true },
    { kind: 'team', runId: 'team-run-video-0001', startedUnder: true },
    { kind: 'org', runId: 'org-run-001', startedUnder: false },
  ],
}
