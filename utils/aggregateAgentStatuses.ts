import { AgentStatus } from '../types/agent/AgentStatus';

const statusRank: Record<AgentStatus, number> = {
  [AgentStatus.Offline]: 0,
  [AgentStatus.Idle]: 1,
  [AgentStatus.Error]: 2,
  [AgentStatus.Initializing]: 3,
  [AgentStatus.Running]: 4,
};

export const normalizeAgentStatus = (
  status: AgentStatus | string | null | undefined,
): AgentStatus => {
  switch (typeof status === 'string' ? status.trim().toLowerCase() : '') {
    case AgentStatus.Running: return AgentStatus.Running;
    case AgentStatus.Initializing: return AgentStatus.Initializing;
    case AgentStatus.Error: return AgentStatus.Error;
    case AgentStatus.Idle: return AgentStatus.Idle;
    default: return AgentStatus.Offline;
  }
};

export const aggregateAgentStatuses = (
  statuses: readonly (AgentStatus | string | null | undefined)[],
): AgentStatus => {
  let aggregate = AgentStatus.Offline;
  for (const value of statuses) {
    const status = normalizeAgentStatus(value);
    if (statusRank[status] > statusRank[aggregate]) aggregate = status;
    if (aggregate === AgentStatus.Running) break;
  }
  return aggregate;
};
