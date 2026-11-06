/**
 * mobile-experience-redesign (design-only): the phone's run list with its delegation tree.
 *
 * Everything here is invented and illustrative; nothing is read from a real node and no title is anyone's real
 * conversation. Times are offsets from the moment the page loads, so the ages ("2m", "6h", "3d") are the same on every
 * run. The product's own phone screens (the run list, the run screen, Results, New run) are the real components; what is
 * simulated sits under them:
 * - the delegating node's run history and delegation tree (this module; in the product the phone reads the same
 *   `runListStore` and collaboration store as the desktop Runs view);
 * - the answer of an opened run: a short invented conversation (`withMobileRuns`, answered like every other stored run);
 * - the peers the paired node knows, with reachability and what each offers (`PEERS`).
 *
 * Nodes (invented): `docker` is reachable, `office-mac` is not. Turned off with the other design-only layers
 * (`autobyteus.prototype.designOnlyLayers=off`).
 */

export type MobileRunStatus = 'running' | 'idle' | 'initializing' | 'error' | 'offline'
export type MobileRunKind = 'agent' | 'team' | 'org' | 'member'

export type MobileRunNode = {
  id: string
  kind: MobileRunKind
  /** An agent's or team's name, or a member's name. */
  name: string
  /** The run's title, or a delegated run's Task line. */
  summary: string
  status: MobileRunStatus
  /** Minutes since the last activity (top-level runs and delegated runs). */
  minutes: number
  /** The node a run on another node runs on; absent for runs on the paired node. */
  node?: string
  /** OPTIONAL element OPT-001 ("needs you"): a run waiting for an answer or an approval. */
  needsYou?: string
  children?: MobileRunNode[]
}

const member = (id: string, name: string, status: MobileRunStatus, summary: string, extra: Partial<MobileRunNode> = {}): MobileRunNode =>
  ({ id, kind: 'member', name, status, summary, minutes: 3, ...extra })

const SET_MEMBERS = (n: string, designerStatus: MobileRunStatus, engineerStatus: MobileRunStatus, reviewerStatus: MobileRunStatus, extra: Record<string, Partial<MobileRunNode>> = {}): MobileRunNode[] => [
  member(`mx-set-${n}-solution_designer`, 'solution_designer', designerStatus, 'Writes the requirements and the design', extra.solution_designer),
  member(`mx-set-${n}-implementation_engineer`, 'implementation_engineer', engineerStatus, 'Builds the change', extra.implementation_engineer),
  member(`mx-set-${n}-code_reviewer`, 'code_reviewer', reviewerStatus, 'Reviews the change', extra.code_reviewer),
]

/** Top-level runs, newest first (the order the product's Runs view settles: last activity). */
export const MOBILE_RUNS: MobileRunNode[] = [
  {
    id: 'mx-ptm-0001', kind: 'agent', name: 'Project Task Manager', summary: 'Dispatch the approved desktop app Tasks', status: 'running', minutes: 2,
    children: [
      {
        id: 'mx-set-0001', kind: 'team', name: 'Software Engineering Team', summary: 'Image context files don’t reach the model on the first turn', status: 'running', minutes: 4,
        children: SET_MEMBERS('0001', 'idle', 'running', 'idle', {
          implementation_engineer: {
            summary: 'Fixes the first-turn context upload',
            children: [{ id: 'mx-set-0001-code-searcher', kind: 'agent', name: 'Code Searcher', summary: 'Finds where context files are attached', status: 'running', minutes: 1 }],
          },
        }),
      },
      { id: 'mx-apc-0001', kind: 'agent', name: 'Agent Package Creator', summary: 'Package the release-notes agent for the agent store', status: 'idle', minutes: 9, needsYou: 'Asks which sample prompt to include' },
      {
        id: 'mx-set-0002', kind: 'team', name: 'Software Engineering Team', summary: 'Members of a delegated team can’t reach the package creator', status: 'idle', minutes: 18,
        children: SET_MEMBERS('0002', 'idle', 'idle', 'idle'),
      },
      {
        id: 'mx-mkt-0001', kind: 'team', name: 'Marketing Team', summary: 'Plan the 1.6 launch campaign across email, social and the website', status: 'running', minutes: 6, node: 'docker',
        children: [
          member('mx-mkt-0001-campaign_lead', 'campaign_lead', 'running', 'Plans the campaign', { node: 'docker' }),
          member('mx-mkt-0001-copywriter', 'copywriter', 'idle', 'Writes the copy', { node: 'docker' }),
          member('mx-mkt-0001-designer', 'designer', 'idle', 'Makes the visuals', { node: 'docker' }),
        ],
      },
      { id: 'mx-mkr-0001', kind: 'agent', name: 'Market Researcher', summary: 'Compare competitor pricing pages for the desktop app', status: 'idle', minutes: 31, node: 'docker' },
      {
        id: 'mx-sup-0001', kind: 'team', name: 'Support Team', summary: 'Triage the open desktop support threads', status: 'offline', minutes: 45, node: 'office-mac',
        children: [
          member('mx-sup-0001-triage_lead', 'triage_lead', 'offline', 'Sorts the threads', { node: 'office-mac' }),
          member('mx-sup-0001-answer_writer', 'answer_writer', 'offline', 'Drafts the answers', { node: 'office-mac' }),
        ],
      },
    ],
  },
  { id: 'mx-da-0001', kind: 'agent', name: 'Daily Assistant', summary: 'Draft the reply to the pilot customers about the new date', status: 'idle', minutes: 6, needsYou: 'Waiting for your answer' },
  {
    id: 'mx-org-0001', kind: 'org', name: 'Product Launch Org', summary: 'Prepare the 1.6 launch', status: 'running', minutes: 24,
    children: [
      member('mx-org-0001-launch_lead', 'launch_lead', 'running', 'Coordinates the launch', { minutes: 24 }),
      member('mx-org-0001-content_writer', 'content_writer', 'idle', 'Writes the announcement', { minutes: 40 }),
      member('mx-org-0001-release_manager', 'release_manager', 'idle', 'Checks the release checklist', { minutes: 52 }),
    ],
  },
  {
    id: 'mx-set-0003', kind: 'team', name: 'Software Engineering Team', summary: 'Review the invoice export migration', status: 'idle', minutes: 26 * 60,
    children: SET_MEMBERS('0003', 'offline', 'offline', 'offline'),
  },
  { id: 'mx-cdx-0001', kind: 'agent', name: 'Codex', summary: 'Fix the failing probe test on the base branch', status: 'offline', minutes: 5 * 60 },
  { id: 'mx-da-0002', kind: 'agent', name: 'Daily Assistant', summary: 'Plan the week: school pickups, dentist, budget review', status: 'offline', minutes: 55 },
  { id: 'mx-da-0003', kind: 'agent', name: 'Daily Assistant', summary: 'hello', status: 'offline', minutes: 9 * 60 },
  { id: 'mx-ptm-0002', kind: 'agent', name: 'Project Task Manager', summary: 'Which Tasks are blocked this week?', status: 'offline', minutes: 2 * 24 * 60 },
  { id: 'mx-apc-0002', kind: 'agent', name: 'Agent Package Creator', summary: 'Make a Product Video Producer package for the marketing team', status: 'offline', minutes: 3 * 24 * 60 },
  { id: 'mx-da-0004', kind: 'agent', name: 'Daily Assistant', summary: 'Compare two flights to Berlin for the March trip', status: 'offline', minutes: 4 * 24 * 60 },
  { id: 'mx-cdx-0002', kind: 'agent', name: 'Codex', summary: 'Rename the export helpers and update the imports', status: 'offline', minutes: 5 * 24 * 60 },
  { id: 'mx-set-0004', kind: 'team', name: 'Software Engineering Team', summary: 'Simplify the NFS Guide and remove redundant steps', status: 'offline', minutes: 6 * 24 * 60, children: SET_MEMBERS('0004', 'offline', 'offline', 'offline') },
  { id: 'mx-da-0005', kind: 'agent', name: 'Daily Assistant', summary: 'Summarize the lease renewal and list what to ask the landlord', status: 'offline', minutes: 8 * 24 * 60 },
].sort((a, b) => a.minutes - b.minutes)

export type MobilePeer = { name: string; reachable: boolean; agents: number; teams: number }
/** The peer nodes the paired node knows (read-only list, DEC-003 option A). Invented. */
export const PEERS: MobilePeer[] = [
  { name: 'docker', reachable: true, agents: 6, teams: 3 },
  { name: 'office-mac', reachable: false, agents: 4, teams: 2 },
]
export const UNREACHABLE_NODES: ReadonlySet<string> = new Set(['office-mac'])

export const flattenRunIds = (nodes: MobileRunNode[]): MobileRunNode[] => nodes.flatMap((node) => [node, ...flattenRunIds(node.children ?? [])])

import { exposedFixtures } from '~/prototype/source-observation/fixtures.mjs'
const AGENT_DEFINITION_BY_NAME: Record<string, string> = { 'Project Task Manager': 'project-task-manager', 'Daily Assistant': String((exposedFixtures as Record<string, any>).dailyAssistant?.id ?? 'agent-researcher') }

/** The invented conversation a run opens with. */
const conversationFor = (node: MobileRunNode, at: number): Array<Record<string, unknown>> => {
  const stamp = (offset: number) => new Date(at + offset).toISOString()
  if (node.id === 'mx-ptm-0001') {
    return [
      { kind: 'message', role: 'user', content: 'Dispatch the approved desktop app Tasks.', ts: stamp(0) },
      { kind: 'message', role: 'assistant', content: 'Delegated six Tasks: two to copies of the Software Engineering Team, one to the Agent Package Creator, two to the Marketing Team and the Market Researcher on docker, and one to the Support Team on office-mac. I will report when they finish.', ts: stamp(40_000) },
    ]
  }
  if (node.needsYou) {
    return [
      { kind: 'message', role: 'user', content: node.summary, ts: stamp(0) },
      { kind: 'message', role: 'assistant', content: node.id === 'mx-da-0001'
        ? 'Here is a draft for the 12 pilot customers: “Thank you for your patience. The new date is the 24th, and we will confirm the schedule on the 10th.” Should I send it to all 12, or only to the five who asked?'
        : 'I packaged the release-notes agent. Which sample prompt should I include: the short one or the one with a worked example?', ts: stamp(40_000) },
    ]
  }
  if (node.kind === 'member') {
    return [
      { kind: 'inter_agent_message', role: 'user', content: 'You received a message from sender name: project task manager, sender address: /project_task_manager, sender id: mx-ptm-0001\nmessage:\nPlease work on the Task you were assigned.', ts: stamp(0) },
      { kind: 'message', role: 'assistant', content: `${node.summary}. I will post the result here when it is ready.`, ts: stamp(40_000) },
    ]
  }
  return [
    { kind: 'message', role: 'user', content: node.summary, ts: stamp(0) },
    { kind: 'message', role: 'assistant', content: 'Here is a first pass. Tell me what to change and I will keep this conversation as the one place we work on it.', ts: stamp(40_000) },
  ]
}

const NODE_BY_ID = new Map(flattenRunIds(MOBILE_RUNS).map((node) => [node.id, node]))
export const isMobileRunId = (id: unknown): boolean => typeof id === 'string' && NODE_BY_ID.has(id)

/** Answers an opened run like a stored run; other operations pass through unchanged. */
export const withMobileRuns = (name: string, variables: Record<string, any>, data: any): any => {
  if (!data) return data
  const node = NODE_BY_ID.get(String(variables.runId ?? ''))
  if (!node) return data
  const at = Date.now() - node.minutes * 60_000
  if (name === 'GetRunProjection' && data.getRunProjection) {
    data.getRunProjection = { ...data.getRunProjection, runId: node.id, summary: node.summary, lastActivityAt: new Date(at).toISOString(), conversation: conversationFor(node, at), activities: [] }
  }
  if (name === 'GetAgentRunResumeConfig' && data.getAgentRunResumeConfig) {
    const definitionId = AGENT_DEFINITION_BY_NAME[node.name]
    data.getAgentRunResumeConfig = {
      ...data.getAgentRunResumeConfig, runId: node.id, isActive: false,
      ...(definitionId ? { metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: definitionId } } : {}),
    }
  }
  return data
}
