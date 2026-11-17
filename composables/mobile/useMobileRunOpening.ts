import { useMobileNavigation } from '~/composables/mobile/useMobileNavigation'
import { conversationOf, teamOfMember } from '~/prototype/mobile-runs/mobileRunsFixture'
import { hasBeenStopped } from '~/prototype/mobile-runs/runSettingsFixture'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useMobileRunOpeningStore } from '~/stores/mobileRunOpeningStore'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import type { MobileRunTreeRow } from '~/utils/mobile/mobileRunListRows'

/**
 * Stand-in for the phone's open sequence (the product's shared open actions read the node's stored run): a tap on a row
 * marks the open pending, pushes the run screen (it shows "Opening…"), opens the run's conversation (answered locally like
 * every stored run), then commits or fails the pending open. A run another node runs that does not answer opens nothing.
 */
export function useMobileRunOpening(_disclosure?: unknown) {
  const opening = useMobileRunOpeningStore()
  const navigation = useMobileNavigation()
  const world = useMobileRunTreeStore()
  const runHistory = useRunHistoryStore()
  const contexts = useAgentContextsStore()

  const idOf = (row: MobileRunTreeRow): string => (row.open as unknown as { id: string }).id

  const settle = async (key: string, row: MobileRunTreeRow): Promise<void> => {
    try {
      const target = world.targetOf(world.byId(idOf(row))!)
      if (!world.isNodeReachable(target.node)) { opening.fail(key); return }
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      // A member of a Team opens in its Team's context; any other agent run as itself.
      const team = teamOfMember(target.id)
      const result = team
        ? await runHistory.openTeamMemberRun(team.id, target.id, { selectionMode: 'mobile' })
        : await runHistory.openRun(target.id, { selectionMode: 'mobile' })
      if (result.disposition !== 'committed') { opening.fail(key); return }
      // The run's own answer: the rich run's conversation holds every message and segment type (invented).
      const conversation = conversationOf(target.id)
      const context = contexts.getRun(target.id)
      if (conversation && context) context.state.conversation = conversation
      // autobyteus-458 (design): a run the list shows as running is running on its screen too, so "Stop run first" can be seen.
      if (context && target.status === 'running' && !hasBeenStopped(target.id)) (context.state as { currentStatus: string }).currentStatus = 'running'
      opening.commit(key)
    } catch (error) {
      console.warn('[mobile] Failed to open run:', error)
      opening.fail(key)
    }
  }

  const open = async (row: MobileRunTreeRow): Promise<void> => {
    if (!row.open) return
    opening.begin(row.key)
    await navigation.openRun({ rowKey: row.key })
    await settle(row.key, row)
  }
  const reopen = async (row: MobileRunTreeRow): Promise<void> => settle(row.key, row)
  return { open, reopen }
}
