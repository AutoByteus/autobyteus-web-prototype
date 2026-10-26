/**
 * delegated-runtime-model-routing (design-only): the Model Router's conversation, answered through the existing mock
 * GraphQL layer like any stored run, and the delegation results the Project Task Manager run shows.
 * Everything is invented and illustrative; nothing is read from a real node.
 */
import { exposedFixtures } from '~/prototype/source-observation/fixtures.mjs'
import { ANCHOR_MS, RUNTIME_NAMES, allDelegations, scenarioFor, type RoutingChoice, type RoutingDelegation } from './modelRoutingData'

const { workspace } = exposedFixtures as Record<string, any>

export const ROUTER_RUN_ID = 'run-model-router'
export const ROUTER_DEFINITION_ID = 'autobyteus-model-router'
/** The sender of a routing request in the router conversation (the platform, not a person or an agent). */
export const ROUTING_REQUEST_SENDER = 'system.model_router'

const at = (minutesFromAnchor: number): number => Math.floor((ANCHOR_MS + minutesFromAnchor * 60_000) / 1000)
const clock = (ms: number): string => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(ms))

const choiceText = (choice: RoutingChoice): string => `${choice.runtimeName} / ${choice.model}`

/** The `delegate_task` result of one delegation: a line per agent, then a note per skipped layer or router failure. */
export const delegationResult = (delegation: RoutingDelegation): string => {
  const lines = [`Started ${delegation.targetName}${delegation.node ? ` on node ${delegation.node}` : ''}.`]
  for (const choice of delegation.choices) {
    const how = choice.source === 'router' ? `chosen by the Model Router${choice.kind ? ` (${choice.kind})` : ''}: ${choice.reason}`
      : choice.source === 'agent_default' ? 'its agent default.' : choice.source === 'team_default' ? 'its team default.'
        : `inherited from the run (${delegation.failure ? 'the Model Router could not choose' : 'no default'}).`
    lines.push(`- ${choice.agent}: runs on ${choiceText(choice)}, ${how}`)
    if (choice.skipped) lines.push(`  ${choice.skipped.layer === 'agent_default' ? 'Agent default' : 'Team default'} ${RUNTIME_NAMES[choice.skipped.runtime]} / ${choice.skipped.model} was not used: ${choice.skipped.detail}`)
  }
  if (delegation.failure) lines.push(`Model Router could not choose: ${delegation.failure} The agents above run on this run's launch.`)
  return lines.join('\n')
}

/** The Activity tab's entries for a conversation's tool calls (the conversation card opens its entry). */
export const toolActivities = (conversation: ReadonlyArray<Record<string, any>>) => conversation
  .filter((entry) => entry.kind === 'tool_call')
  .map((entry) => ({
    kind: 'tool', invocationId: entry.invocationId, toolName: entry.toolName, arguments: entry.toolArgs ?? {},
    result: entry.toolResult ?? null, error: entry.toolError ?? null, status: entry.toolError ? 'error' : 'success', ts: typeof entry.ts === 'number' ? entry.ts : null,
  }))

const delegations = () => allDelegations()
const byId = (id: string) => delegations().find((item) => item.id === id)!

const requestFor = (delegation: RoutingDelegation, covered: RoutingChoice[], asked: RoutingChoice[]): string => [
  `**Task:** ${delegation.taskTitle}`,
  `**Delegated by:** ${delegation.delegatorName} (Claude / prototype-sonnet) · **to:** ${delegation.targetName}`,
  '',
  '**Choose a runtime and model for these agents**',
  ...asked.map((choice) => `- **${choice.agent}**${choice.skipped ? ` — its ${choice.skipped.layer === 'agent_default' ? 'agent' : 'team'} default ${RUNTIME_NAMES[choice.skipped.runtime]} / ${choice.skipped.model} cannot run now: ${choice.skipped.detail}` : ' — no usable default'}`),
  ...(covered.length ? ['', '**Already covered**', ...covered.map((choice) => `- ${choice.agent}: ${choiceText(choice)} (${choice.source === 'agent_default' ? 'agent default' : 'team default'})`)] : []),
  '',
  'Answer with `submit_launch_choices`: a runtime, a model, a task kind and a one-sentence reason for every agent above.',
].join('\n')

const entries = () => {
  const d3 = byId('dec-003')
  const d1 = byId('dec-001')
  const d8 = byId('dec-008')
  const split = (d: RoutingDelegation) => ({
    asked: d.choices.filter((choice) => choice.source === 'router'),
    covered: d.choices.filter((choice) => choice.source !== 'router'),
  })
  const answer = (d: RoutingDelegation) => ({ choices: d.choices.filter((choice) => choice.source === 'router').map((choice) => ({ agent: choice.agent, runtime: choice.runtimeName, model: choice.model, task_kind: choice.kind, reason: choice.reason })) })
  const rejected = { choices: [{ agent: 'implementation_engineer', runtime: 'Codex', model: 'gpt-prototype-codex-mini', task_kind: 'implementation', reason: 'Small server fix; the mini model is quick.' }, { agent: 'code_reviewer', runtime: 'Claude', model: 'prototype-sonnet', task_kind: 'code review', reason: 'Review wants a long context; Claude Sonnet has 1M tokens and its limit is not used up.' }] }
  const s3 = split(d3)
  const s1 = split(d1)
  return [
    { kind: 'message', role: 'user', content: 'From now on, writing Tasks go to Antigravity. Keep design on Claude Sonnet, and use Opus only when the Task asks for it.', ts: at(-1800) },
    { kind: 'tool_call', invocationId: 'mr-t1', toolName: 'read_routing_knowledge', toolArgs: {}, toolResult: 'Codex: the weekly limit is the tight one (41% left on Oct 26, resets Oct 30).\nClaude: Opus is used up until Oct 28, 09:00.', ts: at(-1799) },
    { kind: 'tool_call', invocationId: 'mr-t2', toolName: 'update_routing_knowledge', toolArgs: { note: 'Writing goes to Antigravity. Design stays on Claude Sonnet; use Opus only when a Task asks for it. …' }, toolResult: 'Saved. The previous version is kept.', ts: at(-1798) },
    { kind: 'message', role: 'assistant', content: 'Saved. Writing Tasks now go to Antigravity, design stays on Claude Sonnet, and Opus only when a Task asks for it.', ts: at(-1797) },
    { kind: 'system_task_notification', senderId: ROUTING_REQUEST_SENDER, content: requestFor(d3, s3.covered, s3.asked), ts: at(-340) },
    { kind: 'tool_call', invocationId: 'mr-t3', toolName: 'list_available_agent_runtimes', toolArgs: {}, toolResult: 'Codex: 5 hours 88% left, weekly 41% left. gpt-prototype-codex ok; gpt-prototype-codex-mini blocked until 03:00.\nClaude: weekly 12% left; Opus blocked until Oct 28. Sonnet and Haiku ok.\nAntigravity: signed in, limits not reported.', ts: at(-339) },
    { kind: 'tool_call', invocationId: 'mr-t4', toolName: 'submit_launch_choices', toolArgs: rejected, toolError: 'Not accepted: Codex / gpt-prototype-codex-mini is blocked until 03:00 (5 hours). Choose a model that is not blocked, then submit again.', ts: at(-338) },
    { kind: 'tool_call', invocationId: 'mr-t5', toolName: 'submit_launch_choices', toolArgs: answer(d3), toolResult: `Accepted: ${s3.asked.length} agents.`, ts: at(-337) },
    { kind: 'message', role: 'assistant', content: 'Chose Codex / gpt-prototype-codex for implementation_engineer and Claude Sonnet for code_reviewer. The first answer used a blocked model; I corrected it.', ts: at(-336) },
    { kind: 'system_task_notification', senderId: ROUTING_REQUEST_SENDER, content: requestFor(d1, s1.covered, s1.asked), ts: at(-28) },
    { kind: 'tool_call', invocationId: 'mr-t6', toolName: 'submit_launch_choices', toolArgs: answer(d1), toolResult: `Accepted: ${s1.asked.length} agents.`, ts: at(-27) },
    { kind: 'message', role: 'assistant', content: 'Chose Codex / gpt-prototype-codex for implementation_engineer (its Opus default is blocked until Oct 28) and Claude Sonnet for code_reviewer.', ts: at(-26) },
    { kind: 'system_task_notification', senderId: ROUTING_REQUEST_SENDER, content: `**Task:** ${d8.taskTitle}\n**Delegated by:** ${d8.delegatorName} (Claude / prototype-sonnet) · **to:** ${d8.targetName}\n\n**Choose a runtime and model for these agents**\n- **triage_lead** — no usable default\n- **answer_writer** — no usable default\n\nAnswer with \`submit_launch_choices\`.`, ts: at(-5100) },
    { kind: 'system_task_notification', senderId: 'system', content: 'No valid answer within 40 seconds. The agents started on the delegating run\'s runtime and model, with a note.', ts: at(-5099) },
  ].sort((a, b) => a.ts - b.ts)
}

const historyRun = (template: Record<string, any>) => ({
  ...template,
  runId: ROUTER_RUN_ID, agentRunId: ROUTER_RUN_ID, agentDefinitionId: ROUTER_DEFINITION_ID, agentName: 'Model Router',
  summary: 'Model Router', createdAt: new Date(ANCHOR_MS - 6 * 86_400_000).toISOString(), lastUpdatedAt: new Date(ANCHOR_MS - 26 * 60_000).toISOString(),
  lastActivityAt: new Date(ANCHOR_MS - 26 * 60_000).toISOString(), archivedAt: null, terminatedAt: null, status: 'IDLE', isActive: false, shouldConnectStream: false,
  workspaceRootPath: workspace.workspaceRootPath, hasCollaboration: false,
})

/** The router's conversation, answered like any stored run (it is never listed in the Workspaces tree: it is an internal agent). */
export const withModelRouting = (name: string, variables: Record<string, any>, data: any): any => {
  if (!data) return data
  switch (name) {
    case 'GetRunProjection':
      return variables.runId === ROUTER_RUN_ID
        ? { getRunProjection: { runId: ROUTER_RUN_ID, summary: 'Model Router', lastActivityAt: new Date(ANCHOR_MS - 26 * 60_000).toISOString(), conversation: entries(), activities: toolActivities(entries()), hasEarlierActiveTraceEvents: false } }
        : data
    case 'GetAgentRunResumeConfig':
      return variables.runId === ROUTER_RUN_ID
        ? { getAgentRunResumeConfig: { ...data.getAgentRunResumeConfig, runId: ROUTER_RUN_ID, isActive: false,
            metadataConfig: { ...data.getAgentRunResumeConfig.metadataConfig, agentDefinitionId: ROUTER_DEFINITION_ID, runtimeKind: 'claude_agent_sdk', llmModelIdentifier: 'prototype-sonnet', autoExecuteTools: true } } }
        : data
    default:
      return data
  }
}

export const routerScenarioHasHistory = (scenario: string): boolean => scenarioFor(scenario).delegations.length > 0
export { clock as routerClock }
