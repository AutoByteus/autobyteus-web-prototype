// ios-demo-mode-279: scripted outcomes of the demo's actions that change shared state (kept apart from the pure
// `iosDemo.ts` so the stores it uses are not imported by the plugins that load before Pinia).
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'

/** Stop in a demo conversation: the agent is Idle on its screen and in the run list. */
export function demoAgentStopped(runId: string): void {
  const contexts = useAgentContextsStore()
  const context = runId ? contexts.getRun(runId) : contexts.activeRun
  if (context) (context.state as { currentStatus: string }).currentStatus = 'idle'
  useMobileRunTreeStore().setStatus(runId || String(context?.state.runId ?? ''), 'idle')
}
