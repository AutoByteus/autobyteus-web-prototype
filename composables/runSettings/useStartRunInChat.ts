import { useRouter } from 'vue-router'
import { useChatDraftStore } from '~/stores/chatDraftStore'

/**
 * run-settings-ui-unification (round 2): every Run button opens New chat addressed to its
 * agent, team or org. The composer's settings are the run's settings; members are customized
 * from the line under the composer.
 */
export function useStartRunInChat() {
  const router = useRouter()
  const chatDraftStore = useChatDraftStore()

  const open = async () => { await router.push('/chat') }

  return {
    runAgent: async (agentDefinitionId: string) => {
      chatDraftStore.startNewChat({ agentDefinitionId })
      await open()
    },
    runTeam: async (teamDefinitionId: string) => {
      chatDraftStore.startNewChat()
      chatDraftStore.setTarget({ kind: 'team', teamDefinitionId })
      await open()
    },
    runOrg: async (orgDefinitionId: string) => {
      chatDraftStore.startNewChat()
      chatDraftStore.setTarget({ kind: 'org', orgDefinitionId })
      await open()
    },
  }
}
