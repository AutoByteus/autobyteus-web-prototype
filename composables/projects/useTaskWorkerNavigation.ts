import { watch } from 'vue'
import { navigateTo } from '#app'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import { buildAgentRunChatRoute } from '~/services/workspace/workspaceNavigationService'
import type { ProjectTaskWorker } from '~/types/project'

/**
 * project-manager-ux (design): opening a Task's worker opens the Manager conversation that started
 * it with that worker selected, exactly as choosing its row in the Workspaces tree does. A team
 * opens its coordinator. From the Projects pages this navigates to the conversation first.
 */
export const openTaskWorker = async (worker: ProjectTaskWorker): Promise<void> => {
  const collaboration = useAgentRunCollaborationStore()
  const host = worker.hostRunId
  const child = worker.openRunId
  if (!child) return
  const select = () => {
    if (!collaboration.contextFor(host)?.getChild(child)) return false
    collaboration.selectChild(host, child)
    return true
  }
  const route = buildAgentRunChatRoute(host) as { path: string; query: { id: string } }
  const here = typeof window !== 'undefined' && window.location.pathname === route.path
    && new URLSearchParams(window.location.search).get('id') === host
  if (!here) await navigateTo(route)
  if (select()) return
  if (!collaboration.contextFor(host)) void collaboration.inspect(host)
  // The conversation's view arrives with its stream or the stored read; select once it is there.
  await new Promise<void>((resolve) => {
    const stop = watch(() => collaboration.contextFor(host)?.getChild(child), () => { if (select()) { stop(); resolve() } })
    setTimeout(() => { stop(); resolve() }, 4000)
  })
}

