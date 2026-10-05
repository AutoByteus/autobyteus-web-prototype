import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useAgentOrgDefinitionStore } from '~/stores/agentOrgDefinitionStore'
import { useChatDraftStore, type ChatDraftWorkspace } from '~/stores/chatDraftStore'
import { useOrgLaunchDraftStore } from '~/stores/orgLaunchDraftStore'
import { initialsFor } from '~/components/chat/chatComposerMenus'
import { DEFAULT_CHAT_AGENT_DEFINITION_ID } from '~/utils/chat/chatDefaults'
import { useLocalization } from '~/composables/useLocalization'

/** One entry in the heading switcher: an Agent, an Agent Team or an Agent Org. */
export type RunTargetOption = {
  key: string
  kind: 'agent' | 'team' | 'org'
  id: string
  name: string
  initials: string
  description: string
}

/** What a switch keeps: the four run settings the user already chose. */
export type CarriedRunSettings = {
  workspace: ChatDraftWorkspace | null
  runtimeKind: string
  llmModelIdentifier: string
  llmConfig: Record<string, unknown> | null
  autoExecuteTools: boolean
}

export const orgLaunchRoute = (orgDefinitionId: string, sourceOrgRunId?: string | null) => ({
  path: '/workspace',
  query: {
    rootSubjectKind: 'agent_org',
    definitionId: orgDefinitionId,
    ...(sourceOrgRunId ? { sourceOrgRunId } : {}),
    mode: 'configuration',
  },
})

/**
 * run-settings-ui-unification (round 34): the heading of New chat and of the Org launch page is one
 * "what to run" switcher. Agents and Agent Teams start in New chat (first message); an Agent Org has
 * no recipient, so choosing one shows the Org launch page (Run Agent Org). `@` is unaffected: it
 * brings Agents and Agent Teams in as collaborators only.
 */
export function useRunTargetSwitcher() {
  const router = useRouter()
  const { t } = useLocalization()
  const agentStore = useAgentDefinitionStore()
  const teamStore = useAgentTeamDefinitionStore()
  const orgStore = useAgentOrgDefinitionStore()
  const chatDraftStore = useChatDraftStore()
  const orgLaunchStore = useOrgLaunchDraftStore()

  const options = computed<RunTargetOption[]>(() => {
    const general = agentStore.getAgentDefinitionById(DEFAULT_CHAT_AGENT_DEFINITION_ID)
    const agents = [
      ...(general ? [general] : []),
      ...agentStore.sharedAgentDefinitions.filter((definition) => definition.id !== DEFAULT_CHAT_AGENT_DEFINITION_ID),
    ]
    return [
      ...agents.map((definition) => ({
        key: `agent:${definition.id}`, kind: 'agent' as const, id: definition.id, name: definition.name,
        initials: initialsFor(definition.name), description: definition.description ?? '',
      })),
      ...teamStore.sharedAgentTeamDefinitions.map((team) => ({
        key: `team:${team.id}`, kind: 'team' as const, id: team.id, name: team.name, initials: initialsFor(team.name),
        description: t('chat.targets.teamDescription', { count: team.nodes.length, coordinator: team.coordinatorMemberName }),
      })),
      ...orgStore.definitions.map((org) => ({
        key: `org:${org.id}`, kind: 'org' as const, id: org.id, name: org.name, initials: initialsFor(org.name),
        description: org.description ?? '',
      })),
    ]
  })

  /** From the Org launch page to New chat for an Agent or Team, keeping the chosen settings. */
  const openChat = async (option: RunTargetOption, carried: CarriedRunSettings) => {
    if (option.kind === 'agent') chatDraftStore.startNewChat({ agentDefinitionId: option.id })
    else {
      chatDraftStore.startNewChat()
      chatDraftStore.setTarget({ kind: 'team', teamDefinitionId: option.id })
    }
    if (carried.workspace) chatDraftStore.setWorkspace(carried.workspace)
    if (carried.llmModelIdentifier) {
      chatDraftStore.setModel({ runtimeKind: carried.runtimeKind, llmModelIdentifier: carried.llmModelIdentifier })
      chatDraftStore.setThinkingConfig(carried.llmConfig)
    }
    chatDraftStore.setAutoExecuteTools(carried.autoExecuteTools)
    await router.push('/chat')
  }

  /** To the Org launch page for an Org, keeping the chosen settings. */
  const openOrg = async (orgDefinitionId: string, carried: CarriedRunSettings | null) => {
    orgLaunchStore.start(orgDefinitionId, null, carried)
    await router.push(orgLaunchRoute(orgDefinitionId))
  }

  return { options, openChat, openOrg }
}
