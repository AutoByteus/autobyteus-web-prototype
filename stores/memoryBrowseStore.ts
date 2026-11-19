import { defineStore } from 'pinia';
import { getApolloClient } from '~/utils/apolloClient';
import {
  LIST_AGENT_ORG_RUNS_WITH_MEMORY,
  LIST_AGENT_ORGS_WITH_MEMORY,
  LIST_AGENT_RUNS_WITH_MEMORY,
  LIST_AGENT_TEAM_RUNS_WITH_MEMORY,
  LIST_AGENT_TEAMS_WITH_MEMORY,
  LIST_AGENTS_WITH_MEMORY,
} from '~/graphql/queries/memoryExplorerQueries';
import { ORG_OWNERS, SHARED_AGENTS_WITHOUT_RUNS, TEAM_OWNERS, placesOf } from '~/prototype/memory-semantic/memoryOwnersFixture';
import { useSemanticMemoryStore } from '~/stores/semanticMemoryStore';
import type { AgentOrgWithMemorySummary, AgentTeamWithMemorySummary, AgentWithMemorySummary, MemoryExplorerSourceInput } from '~/types/memory';

/**
 * semantic-memory-view-554 (design, round 3): Browse as a tree of memory owners.
 * Agents (standalone, then "Unattributed runs"), Agent Teams (each with its member agents), Agent Orgs (each with its
 * teams and agents). Global (the node) is not shown until autobyteus-555 ships. An agent's page has its episodic memory
 * (its runs from every place it works, newest first) and its semantic memory (its folder). In the product the tree's
 * membership comes from the definitions; here from prototype/memory-semantic/memoryOwnersFixture.ts.
 */

export type OwnerNodeKind = 'group' | 'agent' | 'team' | 'org' | 'unattributed';

export interface OwnerNode {
  /** The node's place in the tree, e.g. `teams/team:software-engineering-team/agent:<id>`. */
  key: string;
  kind: OwnerNodeKind;
  label: string;
  /** Agent, team or org definition ID; the group's tab for a group. */
  id: string;
  /** Runs (agents, teams and orgs) shown at the right of the row. */
  count?: number | null;
  /** A team-local agent belongs here; a shared agent opens the same page from every place. */
  local?: boolean;
  internal?: boolean;
  children?: OwnerNode[];
}

/** One episode of an agent: one of its runs, standalone or as a member of a team or org run. */
export interface AgentEpisode {
  key: string;
  place: 'agent' | 'team' | 'org';
  placeId: string | null;
  placeName: string | null;
  /** The agent's own run ID (the member run inside a team or org run). */
  agentRunId: string;
  /** The team or org run it belongs to. */
  groupRunId: string | null;
  memberName: string | null;
  summary: string;
  workspaceRootPath: string | null;
  lastUpdatedAt: string | null;
}

const PAGE = { page: 1, pageSize: 200 };

export const useMemoryBrowseStore = defineStore('memoryBrowse', {
  state: () => ({
    agents: [] as AgentWithMemorySummary[],
    teams: [] as AgentTeamWithMemorySummary[],
    orgs: [] as AgentOrgWithMemorySummary[],
    loading: false,
    loaded: false,
    error: null as string | null,
    filter: '',
    episodes: { agentKey: null as string | null, items: [] as AgentEpisode[], loading: false, error: null as string | null },
    requestId: 0,
  }),

  getters: {
    /** The whole tree, before the filter. */
    tree(state): OwnerNode[] {
      const semantic = useSemanticMemoryStore();
      const agentNode = (prefix: string, id: string, label: string, extra: Partial<OwnerNode> = {}): OwnerNode =>
        ({ key: `${prefix}agent:${id}`, kind: 'agent', id, label, ...extra });

      // Agents: standalone definitions with runs, shared agents without runs yet, and standalone semantic folders
      // (an internal agent's only while "Show internal agents" is on: the node lists it only then).
      const standalone = new Map<string, OwnerNode>();
      for (const agent of state.agents) {
        if (agent.attribution === 'DEFINITION' && agent.agentDefinitionId) standalone.set(agent.agentDefinitionId, agentNode('agents/', agent.agentDefinitionId, agent.displayName, { count: agent.runCount }));
      }
      for (const shared of SHARED_AGENTS_WITHOUT_RUNS) if (!standalone.has(shared.agentDefinitionId)) standalone.set(shared.agentDefinitionId, agentNode('agents/', shared.agentDefinitionId, shared.name, { count: 0 }));
      for (const folder of semantic.folders.entries) {
        if (folder.agentDefinitionId.startsWith('team-local-agent:') || standalone.has(folder.agentDefinitionId)) continue;
        standalone.set(folder.agentDefinitionId, agentNode('agents/', folder.agentDefinitionId, folder.agentName, { count: 0, internal: folder.agentDefinitionId.startsWith('autobyteus-') }));
      }
      const agents = [...standalone.values()];
      const unattributed = state.agents.find(agent => agent.attribution === 'UNATTRIBUTED');
      if (unattributed) agents.push({ key: 'agents/unattributed', kind: 'unattributed', id: 'unattributed', label: unattributed.displayName, count: unattributed.runCount });

      const teamNode = (prefix: string, teamId: string): OwnerNode => {
        const listed = state.teams.find(team => team.teamDefinitionId === teamId);
        const owner = TEAM_OWNERS.find(team => team.id === teamId);
        const key = `${prefix}team:${teamId}`;
        return {
          key, kind: 'team', id: teamId, label: listed?.teamDefinitionName ?? owner?.name ?? teamId, count: listed?.teamRunCount ?? null,
          children: (owner?.members ?? []).map(member => agentNode(`${key}/`, member.agentDefinitionId, member.name, { local: member.local })),
        };
      };
      const teams = state.teams.map(team => teamNode('teams/', team.teamDefinitionId));
      const orgs = state.orgs.map((org) => {
        const owner = ORG_OWNERS.find(candidate => candidate.id === org.orgDefinitionId);
        const key = `orgs/org:${org.orgDefinitionId}`;
        return {
          key, kind: 'org' as const, id: org.orgDefinitionId, label: org.orgDefinitionName, count: org.orgRunCount,
          children: [
            ...(owner?.teams ?? []).map(teamId => teamNode(`${key}/`, teamId)),
            ...(owner?.members ?? []).map(member => agentNode(`${key}/`, member.agentDefinitionId, member.name, { local: member.local })),
          ],
        };
      });
      return [
        { key: 'agents', kind: 'group', id: 'agents', label: 'agents', children: agents },
        { key: 'teams', kind: 'group', id: 'teams', label: 'teams', children: teams },
        { key: 'orgs', kind: 'group', id: 'orgs', label: 'orgs', children: orgs },
      ];
    },

    /** The tree with only the nodes whose name matches the filter, and their parents. */
    visibleTree(): OwnerNode[] {
      const cue = this.filter.trim().toLowerCase();
      if (!cue) return this.tree;
      const keep = (node: OwnerNode): OwnerNode | null => {
        const children = (node.children ?? []).map(keep).filter(Boolean) as OwnerNode[];
        if (node.kind !== 'group' && (node.label.toLowerCase().includes(cue) || node.id.toLowerCase().includes(cue))) return { ...node, children: node.children };
        return children.length ? { ...node, children } : null;
      };
      return this.tree.map(group => keep(group) ?? { ...group, children: [] });
    },
  },

  actions: {
    async loadOwners(source: MemoryExplorerSourceInput | null) {
      this.loading = true;
      this.error = null;
      try {
        const client = getApolloClient();
        const variables = { source, search: null, ...PAGE };
        const [agents, teams, orgs] = await Promise.all([
          client.query<any>({ query: LIST_AGENTS_WITH_MEMORY, variables, fetchPolicy: 'network-only' }),
          client.query<any>({ query: LIST_AGENT_TEAMS_WITH_MEMORY, variables, fetchPolicy: 'network-only' }),
          client.query<any>({ query: LIST_AGENT_ORGS_WITH_MEMORY, variables, fetchPolicy: 'network-only' }),
        ]);
        const failed = [agents, teams, orgs].flatMap(answer => answer.errors ?? []);
        if (failed.length) throw new Error(failed.map((e: { message: string }) => e.message).join(', '));
        this.agents = agents.data?.listAgentsWithMemory?.items ?? agents.data?.listAgentsWithMemory?.entries ?? [];
        this.teams = teams.data?.listAgentTeamsWithMemory?.items ?? teams.data?.listAgentTeamsWithMemory?.entries ?? [];
        this.orgs = orgs.data?.listAgentOrgsWithMemory?.items ?? orgs.data?.listAgentOrgsWithMemory?.entries ?? [];
        // Semantic folders add standalone agents that have no runs (this node only; an imported source has none).
        const semantic = useSemanticMemoryStore();
        if (source?.type === 'IMPORTED') semantic.folders.entries = [];
        else await semantic.fetchFolders();
        this.loaded = true;
      } catch (error: any) {
        this.error = error?.message || 'Failed to load memory.';
      } finally {
        this.loading = false;
      }
    },

    setFilter(filter: string) {
      this.filter = filter;
    },

    /**
     * An agent's episodes from every place it works: its standalone runs, then each team or org run it was a member
     * of, newest first. (Designed; the product's query for this list is still to be added, see the UI/UX spec.)
     */
    async loadEpisodes(agentDefinitionId: string | null, source: MemoryExplorerSourceInput | null) {
      const requestId = ++this.requestId;
      const key = agentDefinitionId ?? 'unattributed';
      if (this.episodes.agentKey !== key) this.episodes.items = [];
      this.episodes = { ...this.episodes, agentKey: key, loading: true, error: null };
      try {
        const client = getApolloClient();
        const items: AgentEpisode[] = [];
        const standalone = !agentDefinitionId || this.agents.some(agent => agent.agentDefinitionId === agentDefinitionId);
        if (standalone) {
          const selector = agentDefinitionId ? { attribution: 'DEFINITION', agentDefinitionId } : { attribution: 'UNATTRIBUTED' };
          const answer = await client.query<any>({ query: LIST_AGENT_RUNS_WITH_MEMORY, variables: { selector, source, search: null, ...PAGE }, fetchPolicy: 'network-only' });
          const page = answer.data?.listAgentRunsWithMemory;
          for (const run of page?.items ?? page?.entries ?? []) {
            items.push({ key: `agent:${run.runId}`, place: 'agent', placeId: null, placeName: null, agentRunId: run.runId, groupRunId: null, memberName: null, summary: run.summary || run.runId, workspaceRootPath: run.workspaceRootPath ?? null, lastUpdatedAt: run.lastUpdatedAt ?? null });
          }
        }
        for (const place of agentDefinitionId ? placesOf(agentDefinitionId) : []) {
          const query = place.kind === 'team' ? LIST_AGENT_TEAM_RUNS_WITH_MEMORY : LIST_AGENT_ORG_RUNS_WITH_MEMORY;
          const variables = place.kind === 'team' ? { teamDefinitionId: place.id } : { orgDefinitionId: place.id };
          const answer = await client.query<any>({ query, variables: { ...variables, source, search: null, ...PAGE }, fetchPolicy: 'network-only' });
          const page = place.kind === 'team' ? answer.data?.listAgentTeamRunsWithMemory : answer.data?.listAgentOrgRunsWithMemory;
          for (const run of page?.items ?? page?.entries ?? []) {
            const groupRunId = place.kind === 'team' ? run.teamRunId : run.orgRunId;
            for (const member of (run.memberTargets ?? []).filter((target: any) => target.displayName === place.member)) {
              items.push({ key: `${place.kind}:${groupRunId}:${member.agentRunId}`, place: place.kind, placeId: place.id, placeName: place.name, agentRunId: member.agentRunId, groupRunId, memberName: member.displayName, summary: run.summary || groupRunId, workspaceRootPath: run.workspaceRootPath ?? null, lastUpdatedAt: member.lastUpdatedAt ?? run.lastUpdatedAt ?? null });
            }
          }
        }
        if (requestId !== this.requestId) return;
        this.episodes.items = items.sort((a, b) => (b.lastUpdatedAt ?? '').localeCompare(a.lastUpdatedAt ?? ''));
      } catch (error: any) {
        if (requestId === this.requestId) this.episodes.error = error?.message || 'Failed to load the runs.';
      } finally {
        if (requestId === this.requestId) this.episodes.loading = false;
      }
    },
  },
});
