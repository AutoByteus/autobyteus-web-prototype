import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { HANDMADE_AGENT_ID, handmadeAgent, settleDefinition } from '~/prototype/source-observation/personal-settings-fixtures.mjs'
import { currentFixtureState } from '~/utils/apolloClient'

/**
 * package-clone-auto-update-457 (origin/personal@f78b60dddd): the personal settings of package and built-in definitions, beneath the UI.
 *
 * The Agents, Teams and Orgs lists reach the stores from the captured route snapshots, which carry no personal settings. This fills the two
 * fields of every definition the way the node reports them (prototype/source-observation/personal-settings-fixtures.mjs): a package
 * agent, team and org, and the built-in Daily Assistant have a base and some personal settings; any other definition is made by hand and has
 * none. Reset runs the source's own store actions against the fixture's Reset answers. A reload restores the fixture.
 */
export default defineNuxtPlugin(() => {
  const settle = <T extends { id: string }>(kind: 'agent' | 'team' | 'org', list: T[] | undefined): T[] | null => {
    if (!list?.length) return null
    const state = currentFixtureState()
    const next = list.map(entry => settleDefinition(kind, entry, state) as T)
    return next.some((entry, index) => entry !== list[index]) ? next : null
  }

  const agents = useAgentDefinitionStore()
  watch(() => agents.agentDefinitions, (list) => {
    const next = settle('agent', list as any[])
    const base = next ?? (list as any[])
    const needsHandmade = currentFixtureState().scenario === 'personal_settings' && base?.length && !base.some(entry => entry.id === HANDMADE_AGENT_ID)
    if (needsHandmade) agents.agentDefinitions = [...base, handmadeAgent(base[0])] as any
    else if (next) agents.agentDefinitions = next as any
  }, { immediate: true })

  const teams = useAgentTeamDefinitionStore()
  watch(() => teams.agentTeamDefinitions, (list) => {
    const next = settle('team', list as any[])
    if (next) teams.agentTeamDefinitions = next as any
  }, { immediate: true })

  const orgs = useAgentOrgDefinitionStore()
  watch(() => orgs.definitions, (list) => {
    const next = settle('org', list as any[])
    if (next) orgs.definitions = next as any
  }, { immediate: true })
})
