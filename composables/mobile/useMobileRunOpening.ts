import { useMobileNavigation } from '~/composables/mobile/useMobileNavigation'
import { backgroundTasksRunningOfRun, conversationOf, teamOfMember } from '~/prototype/mobile-runs/mobileRunsFixture'
import { hasBeenStopped } from '~/prototype/mobile-runs/runSettingsFixture'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentTeamContextsStore } from '~/stores/agentTeamContextsStore'
import { useAgentTeamRunStore } from '~/stores/agentTeamRunStore'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { isIosDemo } from '~/prototype/ios-demo/iosDemo'
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
      // A Team that is already open focuses the member, as the product's shared open does (selectTreeRunFromHistory);
      // only a Team that is not open yet is opened (ios-demo-mode-279 A-01: mounting it twice failed).
      const mounted = team ? useAgentTeamContextsStore().getTeamContextById(team.id) : null
      const result = team
        ? (mounted && !useAgentTeamRunStore().isTeamStreamReopenRequired(team.id)
            ? await runHistory.inspectTeamMember(team.id, target.id, { selectionMode: 'mobile' })
            : await runHistory.openTeamMemberRun(team.id, target.id, { selectionMode: 'mobile' }))
        : await runHistory.openRun(target.id, { selectionMode: 'mobile' })
      if (result.disposition !== 'committed') { opening.fail(key); return }
      // The run's own answer: the rich run's conversation holds every message and segment type (invented).
      const conversation = conversationOf(target.id)
      const context = contexts.getRun(target.id)
      if (conversation && context) context.state.conversation = conversation
      // A run the node holds (the list shows it running or idle) is live on its screen too: its stream's status
      // (simulated). A run stopped from the phone's Settings stays stopped.
      if (context && target.status !== 'offline' && !hasBeenStopped(target.id)) (context.state as { currentStatus: string }).currentStatus = target.status
      // autobyteus-448: a live run's status carries its running background tasks (the agent's stream; simulated here).
      if (context) context.state.backgroundTasksRunning = hasBeenStopped(target.id) ? 0 : backgroundTasksRunningOfRun(target)
      // ios-demo-mode-279 (DC-006): in the demo a run's screen shows the status its row shows (one status per run).
      if (isIosDemo()) {
        const shown = useActiveContextStore().activeWorkspaceTarget?.context
        if (shown) (shown.state as { currentStatus: string }).currentStatus = world.byId(target.id)?.status ?? target.status
        // A-05: the run's title is its row's agent (the sample world names each agent; the fixture has few definitions).
        if (shown && target.kind === 'agent') (shown.config as { agentDefinitionName?: string }).agentDefinitionName = target.name
      }
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
