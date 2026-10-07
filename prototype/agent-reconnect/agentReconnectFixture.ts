/**
 * agent-definition-reconnect-ui (design): runs whose agent definition folder was renamed or removed.
 *
 * Hand-written and illustrative. Nothing runs and nothing is read from disk:
 * - a stopped standalone run of `tutorial-video-producer` (Claude) in prototype-workspace;
 * - a stopped "Video Team" run whose configured member `/editor` used `video-editor` (Antigravity)
 *   and whose collaborator `/tutorial_video_producer` (added with `@`) used `tutorial-video-producer`
 *   (Claude);
 * - an agent catalog of about forty agents (shared and team-local), without the two missing ids.
 *
 * Reconnect is scripted beneath the UI: the run record's agent reference changes, nothing else.
 * State lives in browser memory: reloading the page restores the start of the example.
 */
import { reactive } from 'vue'
import { exposedFixtures } from '~/prototype/source-observation/fixtures.mjs'

const { workspace } = exposedFixtures as Record<string, any>

export const STANDALONE_RUN_ID = 'run-tvp-0001'
export const TEAM_RUN_ID = 'team-run-video-0001'
export const TEAM_DEFINITION_ID = 'team-video'
export const TEAM_NAME = 'Video Team'
export const LEAD_RUN_ID = 'team-video-lead-0001'
export const EDITOR_RUN_ID = 'team-video-editor-0001'
export const COLLAB_RUN_ID = 'team-video-tvp-0001'
/** A delegated copy of the collaborator (delegate_task to its address); no own source, so it
 * inherits the collaborator's agent and is reconnected with it (L3). */
export const COPY_RUN_ID = 'team-video-tvp-copy-0001'

const createdAt = '2026-10-05T09:12:00.000Z'
const updatedAt = '2026-10-05T09:40:00.000Z'

export type RuntimeKind = 'claude_agent_sdk' | 'antigravity_cli' | 'codex_app_server' | 'autobyteus'
/** Runtimes that keep a resumed session's original instructions (DEC-010). */
export const KEEPS_SESSION_INSTRUCTIONS: ReadonlySet<string> = new Set(['antigravity_cli', 'grok_cli'])
export const runtimeLabel = (kind: string): string => ({
  claude_agent_sdk: 'Claude', antigravity_cli: 'Antigravity', codex_app_server: 'Codex', autobyteus: 'AutoByteus', grok_cli: 'Grok',
} as Record<string, string>)[kind] ?? kind

/** One agent run whose definition can be missing. */
export type ReconnectSubject = {
  agentRunId: string
  /** The run's root: the standalone run itself, or the team run. */
  rootKind: 'AGENT' | 'AGENT_TEAM'
  rootRunId: string
  /** Team member / collaborator address; null for a standalone run. */
  address: string | null
  memberKind: 'standalone' | 'configured_member' | 'collaborator' | 'inherited_copy'
  /** A sourceless delegated copy follows this run's agent (it has no record of its own). */
  inheritsFrom?: string
  /** The stored reference (the id of the folder that is gone). */
  missingDefinitionId: string
  runtimeKind: RuntimeKind
  model: string
}

export const SUBJECTS: readonly ReconnectSubject[] = [
  { agentRunId: STANDALONE_RUN_ID, rootKind: 'AGENT', rootRunId: STANDALONE_RUN_ID, address: null, memberKind: 'standalone', missingDefinitionId: 'tutorial-video-producer', runtimeKind: 'claude_agent_sdk', model: 'claude-sonnet-4.5' },
  { agentRunId: EDITOR_RUN_ID, rootKind: 'AGENT_TEAM', rootRunId: TEAM_RUN_ID, address: '/editor', memberKind: 'configured_member', missingDefinitionId: 'video-editor', runtimeKind: 'antigravity_cli', model: 'gemini-3-pro' },
  { agentRunId: COLLAB_RUN_ID, rootKind: 'AGENT_TEAM', rootRunId: TEAM_RUN_ID, address: '/tutorial_video_producer', memberKind: 'collaborator', missingDefinitionId: 'tutorial-video-producer', runtimeKind: 'claude_agent_sdk', model: 'claude-sonnet-4.5' },
  { agentRunId: COPY_RUN_ID, rootKind: 'AGENT_TEAM', rootRunId: TEAM_RUN_ID, address: '/tutorial_video_producer', memberKind: 'inherited_copy', inheritsFrom: COLLAB_RUN_ID, missingDefinitionId: 'tutorial-video-producer', runtimeKind: 'claude_agent_sdk', model: 'claude-sonnet-4.5' },
]
export const subjectFor = (agentRunId: string | null | undefined): ReconnectSubject | null =>
  SUBJECTS.find((subject) => subject.agentRunId === agentRunId) ?? null

// --- Agent catalog -------------------------------------------------------------------------

type CatalogAgent = { id: string; name: string; role: string; ownershipScope?: 'SHARED' | 'TEAM_LOCAL'; ownerTeamName?: string; ownerTeamId?: string }

/** Illustrative agents added to the baseline catalog (15 agents) to show the picker at scale. */
export const CATALOG_AGENTS: readonly CatalogAgent[] = [
  { id: 'product-video-producer', name: 'Product Video Producer', role: 'Plans, records and edits short product videos.' },
  { id: 'video-clip-editor', name: 'Video Clip Editor', role: 'Cuts recorded footage into short clips.' },
  { id: 'video-lead', name: 'Video Lead', role: 'Coordinates the video team.' },
  { id: 'storyboard-artist', name: 'Storyboard Artist', role: 'Turns a script into shot-by-shot frames.' },
  { id: 'voiceover-writer', name: 'Voiceover Writer', role: 'Writes narration that fits a cut.' },
  { id: 'video-subtitler', name: 'Video Subtitler', role: 'Adds timed subtitles in several languages.' },
  { id: 'podcast-editor', name: 'Podcast Editor', role: 'Edits audio episodes and show notes.' },
  { id: 'thumbnail-designer', name: 'Thumbnail Designer', role: 'Designs video thumbnails and covers.' },
  { id: 'release-notes-writer', name: 'Release Notes Writer', role: 'Writes user-facing release notes.' },
  { id: 'fact-checker', name: 'Fact Checker', role: 'Verifies names, numbers and dates.' },
  { id: 'social-media-scheduler', name: 'Social Media Scheduler', role: 'Schedules posts across accounts.' },
  { id: 'bilingual-article-writer', name: 'Bilingual Article Writer', role: 'Writes articles in English and Chinese.' },
  { id: 'agent-package-creator', name: 'Agent Package Creator', role: 'Creates and updates agent packages.' },
  { id: 'browser-operator', name: 'Browser Operator', role: 'Operates a browser for web tasks.' },
  { id: 'data-story-writer', name: 'Data Story Writer', role: 'Turns datasets into short stories.' },
  { id: 'email-assistant', name: 'Email Assistant', role: 'Drafts and sorts email.' },
  { id: 'meeting-summarizer', name: 'Meeting Summarizer', role: 'Summarizes meeting transcripts.' },
  { id: 'screenshot-annotator', name: 'Screenshot Annotator', role: 'Marks up screenshots for docs.' },
  { id: 'seo-analyst', name: 'SEO Analyst', role: 'Reviews pages for search ranking.' },
  { id: 'slide-deck-designer', name: 'Slide Deck Designer', role: 'Builds presentation decks.' },
  { id: 'support-triage', name: 'Support Triage', role: 'Sorts and answers support requests.' },
  { id: 'test-planner', name: 'Test Planner', role: 'Plans test cases for a change.' },
  { id: 'translator', name: 'Translator', role: 'Translates documents and UI text.' },
  { id: 'tutorial-recorder', name: 'Tutorial Recorder', role: 'Records step-by-step screen tutorials.' },
  { id: 'team-local-agent:team-video:color-grader', name: 'Color Grader', role: 'Grades footage for the Video Team.', ownershipScope: 'TEAM_LOCAL', ownerTeamName: TEAM_NAME, ownerTeamId: TEAM_DEFINITION_ID },
]

/**
 * L1: agents that exist but are not listed in the agent catalog by design (Org-owned and
 * Application-owned). The exact `agentDefinition(id)` lookup finds them, so they are not "missing".
 */
export const OWNED_OUTSIDE_CATALOG: ReadonlySet<string> = new Set(['application-owned-agent:launch-studio:clip-renderer'])

export const catalogDefinition = (template: Record<string, any>, entry: CatalogAgent) => ({
  ...template,
  id: entry.id,
  name: entry.name,
  role: entry.role,
  description: entry.role,
  avatarUrl: null,
  ownershipScope: entry.ownershipScope ?? 'SHARED',
  ownerTeamId: entry.ownerTeamId ?? null,
  ownerTeamName: entry.ownerTeamName ?? null,
  ownerApplicationId: null,
  ownerApplicationName: null,
})

export const teamDefinition = (template: Record<string, any>) => ({
  ...template,
  id: TEAM_DEFINITION_ID,
  name: TEAM_NAME,
  description: 'Plans, records and edits product videos.',
  coordinatorMemberName: 'video_lead',
  nodes: [
    { __typename: 'TeamMember', memberName: 'video_lead', ref: 'video-lead', refScope: 'SHARED' },
    { __typename: 'TeamMember', memberName: 'editor', ref: 'video-editor', refScope: 'SHARED' },
  ],
})

// --- Reconnect state (the run records) ----------------------------------------------------

export type ReconnectedTo = { id: string; name: string; at: number }
type State = {
  /** agentRunId → the agent it now uses. */
  reconnected: Record<string, ReconnectedTo>
  /** agentRunId → transcript entries added in this example (user messages, errors, replies). */
  added: Record<string, Array<Record<string, unknown>>>
}

/** Browser memory only: a page reload starts the example again (the review can be replayed). */
export const reconnectState = reactive<State & { revision: number }>({ reconnected: {}, added: {}, revision: 0 })
export const changed = () => { reconnectState.revision += 1 }

export const reconnectedTo = (agentRunId: string): ReconnectedTo | null => {
  const subject = subjectFor(agentRunId)
  return reconnectState.reconnected[subject ? ownerOf(subject).agentRunId : agentRunId] ?? null
}
/** The record that owns the run's agent reference: the run itself, or the placement a copy inherits from. */
export const ownerOf = (subject: ReconnectSubject): ReconnectSubject => (subject.inheritsFrom ? subjectFor(subject.inheritsFrom) : null) ?? subject
export const definitionIdOf = (subject: ReconnectSubject): string => reconnectedTo(ownerOf(subject).agentRunId)?.id ?? subject.missingDefinitionId

export const recordReconnect = (agentRunId: string, to: { id: string; name: string }) => {
  reconnectState.reconnected[agentRunId] = { ...to, at: Date.now() }
  changed()
}
export const addEntries = (agentRunId: string, entries: Array<Record<string, unknown>>) => {
  reconnectState.added[agentRunId] = [...(reconnectState.added[agentRunId] ?? []), ...entries]
  // The run's next message ends its one-time "Reconnected" notice.
  delete reconnectNotices[agentRunId]
  changed()
}

/** UI feedback shown once after a reconnect (browser memory only). */
export const reconnectNotices = reactive<Record<string, {
  agentRunId: string; agentName: string; instructionsFromNewSession: boolean; runtime: string; runCount: number
}>>({})

// --- Conversations ------------------------------------------------------------------------

const seconds = (iso: string) => Date.parse(iso) / 1000
const storedTranscripts: Record<string, Array<Record<string, unknown>>> = {
  [STANDALONE_RUN_ID]: [
    { kind: 'message', role: 'user', content: 'Turn the v2 launch notes into a 60-second product video.', ts: seconds('2026-10-05T09:12:00.000Z') },
    { kind: 'message', role: 'assistant', content: 'Here is the plan for the 60-second video:\n\n1. **Hook** (0–5 s): the new Projects board.\n2. **Problem** (5–15 s): tasks spread across chats.\n3. **Demo** (15–45 s): create a Project, delegate two Tasks, watch them finish.\n4. **Close** (45–60 s): "Plan it once. Let your agents finish it."\n\nI will record the screens next. Tell me when you want the first cut.', ts: seconds('2026-10-05T09:14:00.000Z') },
  ],
  [LEAD_RUN_ID]: [
    { kind: 'message', role: 'user', content: 'Produce the v2 launch video. Ask @tutorial_video_producer for the storyboard.', ts: seconds('2026-10-05T09:20:00.000Z') },
    { kind: 'message', role: 'assistant', content: 'The tutorial video producer is drafting the storyboard. The editor will cut the 60-second version once it is ready.', ts: seconds('2026-10-05T09:22:00.000Z') },
  ],
  [EDITOR_RUN_ID]: [
    { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: video lead, sender address: /video_lead, sender id: ${LEAD_RUN_ID}\nmessage:\nCut the 60-second version from the recorded screens.`, senderAgentRunId: LEAD_RUN_ID, senderAddress: '/video_lead', ts: seconds('2026-10-05T09:30:00.000Z') },
    { kind: 'message', role: 'assistant', content: 'First cut is at 64 seconds. I will trim the demo section.', ts: seconds('2026-10-05T09:36:00.000Z') },
  ],
  [COPY_RUN_ID]: [
    { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: video lead, sender address: /video_lead, sender id: ${LEAD_RUN_ID}\nmessage:\nWrite the on-screen captions for shots 1–3.`, senderAgentRunId: LEAD_RUN_ID, senderAddress: '/video_lead', ts: seconds('2026-10-05T09:26:00.000Z') },
    { kind: 'message', role: 'assistant', content: 'Captions for shots 1–3 are drafted.', ts: seconds('2026-10-05T09:27:00.000Z') },
  ],
  [COLLAB_RUN_ID]: [
    { kind: 'inter_agent_message', role: 'user', content: `You received a message from sender name: video lead, sender address: /video_lead, sender id: ${LEAD_RUN_ID}\nmessage:\nDraft the storyboard for the v2 launch video.`, senderAgentRunId: LEAD_RUN_ID, senderAddress: '/video_lead', ts: seconds('2026-10-05T09:24:00.000Z') },
    { kind: 'message', role: 'assistant', content: 'Storyboard drafted: six shots, 60 seconds. Sent to the video lead.', ts: seconds('2026-10-05T09:28:00.000Z') },
  ],
}

export const transcriptOf = (agentRunId: string): Array<Record<string, unknown>> =>
  JSON.parse(JSON.stringify([...(storedTranscripts[agentRunId] ?? []), ...(reconnectState.added[agentRunId] ?? [])]))

/** The projection the server returns; error entries are shown by the open view (reconnectSimulation). */
const storedProjection = (agentRunId: string) => transcriptOf(agentRunId).filter((entry) => entry.kind !== 'error')

/** What the agent says after a reconnect: the same session, with the earlier context. */
export const continuedReply = (agentRunId: string, text: string): string => {
  if (agentRunId === STANDALONE_RUN_ID) {
    return `Continuing the v2 launch video. I still have the four-part plan (hook, problem, demo, close).\n\nFirst cut is ready: 58 seconds, with the Projects board as the hook. ${/voice|narrat/i.test(text) ? 'I added a draft voiceover.' : 'Want me to add a voiceover next?'}`
  }
  if (agentRunId === EDITOR_RUN_ID) return 'Picking up the 64-second cut. I trimmed the demo section: the cut is now 60 seconds.'
  if (agentRunId === COLLAB_RUN_ID) return 'Continuing from the six-shot storyboard. I tightened shot 4 so the demo fits in 30 seconds.'
  if (agentRunId === COPY_RUN_ID) return 'Continuing the captions: shots 4–6 are drafted too.'
  return 'Done.'
}

// --- GraphQL reads ------------------------------------------------------------------------

const launch = (subject: Pick<ReconnectSubject, 'runtimeKind' | 'model'>) => ({
  runtime_kind: subject.runtimeKind, llm_model_identifier: subject.model, llm_config: null,
  auto_execute_tools: true, workspace_root_path: workspace.workspaceRootPath,
})
const leadLaunch = { runtimeKind: 'claude_agent_sdk' as RuntimeKind, model: 'claude-sonnet-4.5' }

const editor = SUBJECTS[1]!
const collaborator = SUBJECTS[2]!
const standalone = SUBJECTS[0]!

/** The stored team tree; `agent_definition_id` follows the record. */
export const teamRootExecution = () => ({
  address: '/',
  team_definition_id: TEAM_DEFINITION_ID,
  team_definition_name: TEAM_NAME,
  team_run_id: TEAM_RUN_ID,
  coordinator_address: '/video_lead',
  default_launch_configuration: launch(leadLaunch),
  members: [
    { kind: 'configured_agent', address: '/video_lead', agent_definition_id: 'video-lead', role: null, description: null, agent_run_id: LEAD_RUN_ID, platform_agent_run_id: null, launch_configuration: launch(leadLaunch) },
    { kind: 'configured_agent', address: '/editor', agent_definition_id: definitionIdOf(editor), role: null, description: null, agent_run_id: EDITOR_RUN_ID, platform_agent_run_id: null, launch_configuration: launch(editor) },
  ],
  collaborators: [
    { kind: 'agent', address: '/tutorial_video_producer', agent_definition_id: definitionIdOf(collaborator), agent_run_id: COLLAB_RUN_ID, platform_agent_run_id: null, launch_configuration: launch(collaborator), added_at: '2026-10-05T09:20:00.000Z', added_via_agent_run_id: LEAD_RUN_ID },
  ],
  task_executions: [
    // The video lead delegated a task to the collaborator: a sourceless copy that inherits its agent.
    { kind: 'task_agent', address: '/tutorial_video_producer', agent_run_id: COPY_RUN_ID, platform_agent_run_id: null, delegator_agent_run_id: LEAD_RUN_ID, started_at: '2026-10-05T09:26:00.000Z' },
  ],
})

const teamExecutionTree = () => ({ created_at: createdAt, archived_at: null, application_binding: null, handoffs: [], root_team: teamRootExecution() })

const agentNameOf = (id: string, fallback: string) => CATALOG_AGENTS.find((entry) => entry.id === id)?.name ?? fallback

const standaloneHistoryRun = (base: Record<string, any>) => ({
  ...base,
  runId: STANDALONE_RUN_ID,
  agentRunId: STANDALONE_RUN_ID,
  agentDefinitionId: definitionIdOf(standalone),
  agentName: reconnectedTo(STANDALONE_RUN_ID)?.name ?? 'Tutorial Video Producer',
  summary: 'Turn the v2 launch notes into a 60-second product video',
  createdAt, lastUpdatedAt: updatedAt,
  status: 'IDLE', isActive: false, shouldConnectStream: false, statusSource: 'stored',
  hasCollaboration: false,
})

const teamHistoryRun = (base: Record<string, any>) => ({
  ...base,
  teamRunId: TEAM_RUN_ID,
  teamDefinitionId: TEAM_DEFINITION_ID,
  teamDefinitionName: TEAM_NAME,
  summary: 'Produce the v2 launch video',
  createdAt, lastUpdatedAt: updatedAt,
  status: 'IDLE', isActive: false, shouldConnectStream: false,
  coordinatorAddress: '/video_lead',
  rootTeam: teamRootExecution(),
  workspaceRootPath: workspace.workspaceRootPath,
  members: [
    { memberName: 'video_lead', displayName: 'Video Lead', memberAddress: '/video_lead', agentRunId: LEAD_RUN_ID, agentDefinitionId: 'video-lead', agentName: 'Video Lead', status: 'IDLE', runtimeKind: leadLaunch.runtimeKind, workspaceRootPath: workspace.workspaceRootPath },
    { memberName: 'editor', displayName: agentNameOf(definitionIdOf(editor), 'editor'), memberAddress: '/editor', agentRunId: EDITOR_RUN_ID, agentDefinitionId: definitionIdOf(editor), agentName: agentNameOf(definitionIdOf(editor), 'editor'), status: 'IDLE', runtimeKind: editor.runtimeKind, workspaceRootPath: workspace.workspaceRootPath },
  ],
})

/** Adds the two example runs and their reads to the populated fixtures. */
export const withAgentReconnect = (name: string, variables: Record<string, any>, data: any, scenario: string): any => {
  if (scenario !== 'populated' || !data) return data
  switch (name) {
    case 'ListWorkspaceRunHistory': {
      const entry = data.listWorkspaceRunHistory?.find((item: any) => item.workspaceRootPath === workspace.workspaceRootPath)
      if (!entry) return data
      const template = entry.agentDefinitions?.[0]?.runs?.[0] ?? {}
      const run = standaloneHistoryRun(template)
      // A standalone run is listed once, under the agent its record names (DEC-005).
      const group = entry.agentDefinitions.find((item: any) => item.agentDefinitionId === run.agentDefinitionId)
      if (group) group.runs = [run, ...group.runs.filter((item: any) => item.runId !== STANDALONE_RUN_ID)]
      else entry.agentDefinitions = [...entry.agentDefinitions, { agentDefinitionId: run.agentDefinitionId, agentName: run.agentName, runs: [run] }]
      const teamTemplate = entry.teamDefinitions?.[0]?.runs?.[0] ?? {}
      if (!entry.teamDefinitions.some((item: any) => item.teamDefinitionId === TEAM_DEFINITION_ID)) {
        entry.teamDefinitions = [...entry.teamDefinitions, { teamDefinitionId: TEAM_DEFINITION_ID, teamDefinitionName: TEAM_NAME, runs: [teamHistoryRun(teamTemplate)] }]
      }
      return data
    }
    case 'GetWorkspaceRunHistory': {
      const entry = data.workspaceRunHistory
      if (!entry || entry.workspaceRootPath !== workspace.workspaceRootPath || !entry.agentDefinitions?.length) return data
      const run = standaloneHistoryRun(entry.agentDefinitions[0].runs[0])
      entry.agentDefinitions = [...entry.agentDefinitions, { agentDefinitionId: run.agentDefinitionId, agentName: run.agentName, runs: [run] }]
      entry.teamDefinitions = [...entry.teamDefinitions, { teamDefinitionId: TEAM_DEFINITION_ID, teamDefinitionName: TEAM_NAME, runs: [teamHistoryRun(entry.teamDefinitions[0]?.runs?.[0] ?? {})] }]
      return data
    }
    case 'GetRunProjection':
      return variables.runId === STANDALONE_RUN_ID
        ? { getRunProjection: { runId: STANDALONE_RUN_ID, summary: standaloneHistoryRun({}).summary, lastActivityAt: updatedAt, conversation: storedProjection(STANDALONE_RUN_ID), activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunResumeConfig':
      return variables.runId === STANDALONE_RUN_ID
        ? { getAgentRunResumeConfig: { ...data.getAgentRunResumeConfig, runId: STANDALONE_RUN_ID, isActive: false,
            metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: definitionIdOf(standalone), runtimeKind: standalone.runtimeKind, llmModelIdentifier: standalone.model, llmConfig: null, autoExecuteTools: true },
            // A stopped run: its model settings can change, as for any stopped run.
            modelConfigEditability: { editable: true, reason: null },
          } }
        : data
    case 'GetAgentRunCollaboration':
      return variables.runId === STANDALONE_RUN_ID ? { agentRunCollaboration: null } : data
    case 'GetTeamRunResumeConfig':
      return variables.teamRunId === TEAM_RUN_ID
        ? { getTeamRunResumeConfig: { teamRunId: TEAM_RUN_ID, isActive: false, executionTree: teamExecutionTree(), modelConfigEditability: { editable: true, reason: null } } }
        : data
    case 'GetTeamRunExecutionCheckpoint':
      return variables.teamRunId === TEAM_RUN_ID || variables.rootTeamRunId === TEAM_RUN_ID
        ? { getTeamRunExecutionCheckpoint: { rootTeamRunId: TEAM_RUN_ID, changeSequence: 1, hasOpenExecutionWork: false } }
        : data
    case 'GetTeamMemberRunProjection':
      return [LEAD_RUN_ID, EDITOR_RUN_ID, COLLAB_RUN_ID, COPY_RUN_ID].includes(variables.agentRunId)
        ? { getTeamMemberRunProjection: { agentRunId: variables.agentRunId, summary: 'Produce the v2 launch video', lastActivityAt: updatedAt, conversation: storedProjection(variables.agentRunId), activities: [], hasEarlierActiveTraceEvents: false } }
        : data
    default:
      return data
  }
}
