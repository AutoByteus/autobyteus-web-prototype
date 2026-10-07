import { computed } from 'vue'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { AgentStatus } from '~/types/agent/AgentStatus'
import {
  SUBJECTS, TEAM_NAME, definitionIdOf, reconnectNotices, reconnectState, reconnectedTo, runtimeLabel, subjectFor, type ReconnectSubject,
} from '~/prototype/agent-reconnect/agentReconnectFixture'
import { reconnectAgentRunOnServer, type ReconnectResult } from '~/prototype/agent-reconnect/reconnectSimulation'

/**
 * agent-definition-reconnect-ui (design): which runs point at an agent that no longer exists, and
 * Reconnect. A run's agent is missing when the agent id in its record is not in the agent catalog.
 * In the UI reference the run records are the example fixtures; the server call is scripted.
 */
export type MissingAgent = {
  agentRunId: string
  /** The id of the agent folder that is gone, e.g. `tutorial-video-producer`. */
  missingDefinitionId: string
  /** How the run is named where it is shown: the stored agent name or the member's row name. */
  name: string
  memberKind: ReconnectSubject['memberKind']
  rootKind: ReconnectSubject['rootKind']
  rootRunId: string
  address: string | null
  /** The team the member belongs to; null for a standalone run. */
  teamName: string | null
}

/** Shown once after a successful reconnect, until the run's next message or a dismiss. */
export type ReconnectedNotice = {
  agentRunId: string
  agentName: string
  /** Antigravity / Grok: the new instructions apply from a new session (DEC-010). */
  instructionsFromNewSession: boolean
  runtime: string
}

const notices = reconnectNotices as Record<string, ReconnectedNotice>

const lowerWords = (name: string) => name.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')
const rowName = (subject: ReconnectSubject) => subject.address
  ? (subject.memberKind === 'collaborator' ? lowerWords(subject.address.slice(1)) : subject.address.slice(1))
  : 'Tutorial Video Producer'

export const useAgentReconnect = () => {
  const definitions = useAgentDefinitionStore()
  const contexts = useAgentContextsStore()
  const teams = useAgentTeamContextsStore()
  const history = useRunHistoryStore()

  const catalogLoaded = computed(() => (definitions.agentDefinitions?.length ?? 0) > 0)
  const exists = (definitionId: string) => Boolean(definitions.getAgentDefinitionById(definitionId))

  const missingForRun = (agentRunId: string | null | undefined): MissingAgent | null => {
    void reconnectState.revision
    const subject = subjectFor(agentRunId)
    if (!subject || !catalogLoaded.value) return null
    if (exists(definitionIdOf(subject))) return null
    return {
      agentRunId: subject.agentRunId,
      missingDefinitionId: subject.missingDefinitionId,
      name: rowName(subject),
      memberKind: subject.memberKind,
      rootKind: subject.rootKind,
      rootRunId: subject.rootRunId,
      address: subject.address,
      teamName: subject.rootKind === 'AGENT_TEAM' ? TEAM_NAME : null,
    }
  }

  /** Every agent run of a root (standalone run or team run) whose agent is missing. */
  const missingInRoot = (rootRunId: string | null | undefined): MissingAgent[] =>
    SUBJECTS.filter((subject) => subject.rootRunId === rootRunId)
      .map((subject) => missingForRun(subject.agentRunId))
      .filter((entry): entry is MissingAgent => entry !== null)

  /** Whether an agent id from a run record (e.g. a Workspaces group) is missing from the catalog. */
  const isDefinitionMissing = (definitionId: string | null | undefined): boolean =>
    Boolean(definitionId) && catalogLoaded.value && !exists(definitionId!)

  const openContextsOf = (agentRunId: string): any[] => {
    const found: any[] = []
    const standalone = contexts.getRun?.(agentRunId)
    if (standalone) found.push(standalone)
    const teamMap: Map<string, any> | undefined = (teams as any).teams
    teamMap?.forEach((team) => {
      const member = team?.view?.getAgentContext?.(agentRunId)
      if (member) found.push(member)
    })
    return found
  }

  /** Reconnect: only the run record's agent reference changes; the open views follow it. */
  const reconnect = async (missing: MissingAgent, definition: { id: string; name: string }): Promise<ReconnectResult> => {
    const result = await reconnectAgentRunOnServer(missing.agentRunId, definition)
    if (!result.success) return result
    const subject = subjectFor(missing.agentRunId)!
    for (const context of openContextsOf(missing.agentRunId)) {
      context.config.agentDefinitionId = definition.id
      // Standalone runs show the agent's name; a collaborator row uses the row rule (DEC-012);
      // configured members keep their address name (DEC-011).
      if (subject.memberKind === 'standalone') context.config.agentDefinitionName = definition.name
      else if (subject.memberKind === 'collaborator') context.config.agentDefinitionName = lowerWords(definition.name)
      if (context.state.currentStatus === AgentStatus.Error) context.state.currentStatus = AgentStatus.Offline
    }
    const affected = result.affectedRuns.find((run) => run.agentRunId === missing.agentRunId)
    notices[missing.agentRunId] = {
      agentRunId: missing.agentRunId,
      agentName: definition.name,
      instructionsFromNewSession: affected?.instructionsTakeEffect === 'NEW_SESSION',
      runtime: runtimeLabel(affected?.runtimeKind ?? ''),
    }
    void history.refreshTreeQuietly?.()
    return result
  }

  const noticeFor = (agentRunId: string | null | undefined): ReconnectedNotice | null =>
    (agentRunId && notices[agentRunId]) || null
  const dismissNotice = (agentRunId: string) => { delete notices[agentRunId] }

  /** The agent a run was reconnected to (for a resolved error card). */
  const reconnectedAgent = (agentRunId: string | null | undefined) => {
    void reconnectState.revision
    return agentRunId ? reconnectedTo(agentRunId) : null
  }

  /** DEC-012: a reconnected collaborator's row reads like the other rows, from its agent's name. */
  const collaboratorRowName = (agentRunId: string | null | undefined): string | null => {
    const subject = subjectFor(agentRunId)
    const to = agentRunId ? reconnectedAgent(agentRunId) : null
    if (!subject || subject.memberKind !== 'collaborator' || !to) return null
    const name = lowerWords(to.name)
    return name === lowerWords(subject.address!.slice(1)) ? null : name
  }

  return { missingForRun, missingInRoot, isDefinitionMissing, reconnect, noticeFor, dismissNotice, reconnectedAgent, collaboratorRowName }
}
