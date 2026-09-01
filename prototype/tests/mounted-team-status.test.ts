import { describe, expect, it } from 'vitest';
import { AgentStatus } from '../../types/agent/AgentStatus';
import { aggregateAgentStatuses } from '../../utils/aggregateAgentStatuses';

describe('mounted AgentOrg Team aggregate status', () => {
  it('uses the approved five-state precedence', () => {
    expect(aggregateAgentStatuses([AgentStatus.Offline, AgentStatus.Idle])).toBe(AgentStatus.Idle);
    expect(aggregateAgentStatuses([AgentStatus.Error, AgentStatus.Initializing])).toBe(AgentStatus.Initializing);
    expect(aggregateAgentStatuses([AgentStatus.Initializing, AgentStatus.Running])).toBe(AgentStatus.Running);
  });

  it('normalizes missing and unknown input to offline', () => {
    expect(aggregateAgentStatuses([])).toBe(AgentStatus.Offline);
    expect(aggregateAgentStatuses([null, undefined, '', 'unknown'])).toBe(AgentStatus.Offline);
  });

  it('aggregates only the supplied branch-local Agent projections', () => {
    const productTeamBranch = [AgentStatus.Idle, AgentStatus.Offline, AgentStatus.Running];
    const siblingTeamBranch = [AgentStatus.Error];
    const directOrgAgent = AgentStatus.Initializing;

    expect(aggregateAgentStatuses(productTeamBranch)).toBe(AgentStatus.Running);
    expect(aggregateAgentStatuses(siblingTeamBranch)).toBe(AgentStatus.Error);
    expect(aggregateAgentStatuses([directOrgAgent])).toBe(AgentStatus.Initializing);
  });
});
