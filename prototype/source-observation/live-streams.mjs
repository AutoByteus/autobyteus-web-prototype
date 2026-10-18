// WEB-BASELINE-REFRESH-010: the `live_runs` scenario's stream frames, played by the observation
// node (mock-node.mjs) and by the baseline's local WebSocket (plugins/00) alike, so a live stored
// run shows the same agent statuses on both sides. Synthetic; nothing runs.
import { operationFixture, LIVE_TEAM_STATUSES } from './fixtures.mjs'

export const liveStreamFrames = (state, pathname) => {
  if (state.scenario !== 'live_runs') return null
  const id = decodeURIComponent(String(pathname).split('?')[0].split('/').filter(Boolean).pop() || '')
  if (pathname.includes('/ws/agent-collaboration/') && id === 'run-research-001') {
    const view = operationFixture('GetAgentRunCollaboration', { runId: id }, state)?.agentRunCollaboration
    if (!view) return null
    return [
      { type: 'CONNECTED', payload: { root_subject_kind: 'agent', root_run_id: id, session_id: 'prototype-live-agent-session' } },
      { type: 'ROOT_EXECUTION_VIEW_SNAPSHOT', payload: view },
    ]
  }
  if (pathname.includes('/ws/agent-team/') && id === 'team-run-001') {
    const tree = operationFixture('GetTeamRunResumeConfig', { teamRunId: id }, state)?.getTeamRunResumeConfig?.executionTree
    if (!tree) return null
    return [
      { type: 'CONNECTED', payload: { session_id: 'prototype-live-team-session', root_team_run_id: id } },
      { type: 'TEAM_EXECUTION_VIEW_SNAPSHOT', payload: {
        root_team_run_id: id, base_change_sequence: 1, execution_tree: tree, closed_task_executions: [], messages: [],
        agent_statuses: structuredClone(LIVE_TEAM_STATUSES), agent_input_states: [],
      } },
    ]
  }
  return null
}
