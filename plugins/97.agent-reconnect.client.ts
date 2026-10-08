import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { CATALOG_AGENTS, TEAM_DEFINITION_ID, catalogDefinition, reconnectState, subjectFor, teamDefinition } from '~/prototype/agent-reconnect/agentReconnectFixture'
import { installReconnectSimulation, renderExampleRun } from '~/prototype/agent-reconnect/reconnectSimulation'
import { designOnlyLayersEnabled } from '~/prototype/shared/design-only-layers'

/**
 * agent-definition-reconnect-ui (design): everything beneath the UI for runs whose agent folder was
 * renamed or removed.
 *
 * - The agent catalog holds about forty agents and not the two missing ids; the Video Team is in the
 *   team catalog.
 * - A message to a run whose agent is missing fails the way the server fails it: the run cannot
 *   restore, the conversation gets the AGENT_DEFINITION_MISSING error and the run shows Error.
 * - Reconnect changes only the run record's agent reference (reconnectSimulation.ts); the next
 *   message continues the same conversation with a scripted reply.
 */
export default defineNuxtPlugin(() => {
  // Comparison runs against the pinned source turn the design-only data off (design-only-layers.ts).
  if (!designOnlyLayersEnabled()) return
  const definitions = useAgentDefinitionStore()
  watch(() => definitions.agentDefinitions, (list) => {
    if (!list?.length || list.some((item: any) => item.id === CATALOG_AGENTS[0]!.id)) return
    const template = JSON.parse(JSON.stringify(list[0]))
    definitions.agentDefinitions = [...list, ...CATALOG_AGENTS.map((entry) => catalogDefinition(template, entry))] as any
  }, { immediate: true })

  const teams = useAgentTeamDefinitionStore()
  watch(() => teams.agentTeamDefinitions, (list) => {
    if (!list?.length || list.some((item: any) => item.id === TEAM_DEFINITION_ID)) return
    teams.agentTeamDefinitions = [...list, teamDefinition(JSON.parse(JSON.stringify(list[0])))] as any
  }, { immediate: true })

  installReconnectSimulation()

  // An opened example run shows its stored errors too (the projection carries messages only).
  const active = useActiveContextStore()
  watch(() => {
    const context = active.activeWorkspaceTarget?.context
    return context ? [context.state.runId, context.state.conversation] : null
  }, () => {
    const context: any = active.activeWorkspaceTarget?.context
    const runId = context?.state.runId
    if (!context || !subjectFor(runId)) return
    const hasErrors = (reconnectState.added[runId] ?? []).some((entry) => entry.kind === 'error')
    const shown = context.state.conversation?.messages?.some((message: any) => message.segments?.some((segment: any) => segment.code === 'AGENT_DEFINITION_MISSING'))
    if (hasErrors && !shown) renderExampleRun(runId, context)
  })
})
