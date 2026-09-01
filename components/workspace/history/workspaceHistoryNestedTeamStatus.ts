import { AgentStatus } from '~/types/agent/AgentStatus';
import type { RunHistoryTeamExecutionRow } from '~/stores/runHistoryTypes';
import { aggregateAgentStatuses, normalizeAgentStatus } from '~/utils/aggregateAgentStatuses';

const rowAgentStatus = (row: RunHistoryTeamExecutionRow): AgentStatus => {
  if (row.memberKind !== 'agent') return AgentStatus.Offline;
  return normalizeAgentStatus(row.kind === 'stable_member' ? row.row.currentStatus : row.currentStatus);
};

export const aggregateNestedTeamAgentStatus = (
  rows: readonly RunHistoryTeamExecutionRow[],
  teamRow: RunHistoryTeamExecutionRow,
): AgentStatus => {
  if (teamRow.kind !== 'stable_member' || teamRow.memberKind !== 'agent_team') return AgentStatus.Offline;
  const teamIndex = rows.findIndex((row) => row === teamRow || row.rowKey === teamRow.rowKey);
  if (teamIndex < 0) return AgentStatus.Offline;

  const statuses: AgentStatus[] = [];
  for (let index = teamIndex + 1; index < rows.length; index += 1) {
    const row = rows[index];
    if (!row || row.depth <= teamRow.depth) break;
    statuses.push(rowAgentStatus(row));
  }
  return aggregateAgentStatuses(statuses);
};
