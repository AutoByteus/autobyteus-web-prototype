// ios-demo-mode-279: scripted outcomes of the demo's actions that change shared state (kept apart from the pure
// `iosDemo.ts` so the stores it uses are not imported by the plugins that load before Pinia).
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'
import type { MobileRunStatus } from '~/prototype/mobile-runs/mobileRunsFixture'

/** A demo run's status, the same on its screen and in the run list (a reply starts and ends, Stop). */
export function demoRunStatus(runId: string, status: MobileRunStatus): void {
  const contexts = useAgentContextsStore()
  const open = useActiveContextStore().activeWorkspaceTarget?.context
  const context = (runId ? contexts.getRun(runId) : null) ?? (open && (!runId || open.state.runId === runId) ? open : null)
  if (context) (context.state as { currentStatus: string }).currentStatus = status
  const id = runId || String(context?.state.runId ?? '')
  if (id) useMobileRunTreeStore().setStatus(id, status)
}

/** Stop in a demo conversation: the agent is Idle on its screen and in the run list. */
export const demoAgentStopped = (runId: string): void => demoRunStatus(runId, 'idle')

const MEMBER_KINDS = new Set(['standalone_team_member', 'agent_org_direct_agent', 'agent_org_team_member', 'agent_org_task_team_member', 'agent_run_task_team_member'])

/** The open target is a Team or Org member (its messages go through its Team, which the demo answers here). */
export function isDemoMemberTarget(): boolean {
  const target = useActiveContextStore().activeWorkspaceTarget as { kind?: string } | null
  return Boolean(target && MEMBER_KINDS.has(String(target.kind)))
}

/**
 * A message to a Team or Org member in the demo: it shows in the member's conversation, the member works (a tool call
 * on its folder) and answers with a sample reply; Running, then Idle, on its screen and in the list.
 */
export function demoMemberReply(text: string): void {
  const active = useActiveContextStore()
  const context = active.activeWorkspaceTarget?.context as any
  if (!context || !text.trim()) return
  const runId = String(context.state.runId ?? '')
  const conversation = context.state.conversation
  conversation.messages.push({ type: 'user', timestamp: new Date(), text, contextFilePaths: [] })
  active.updateRequirement('')
  demoRunStatus(runId, 'running')
  const asked = text.trim().replace(/\s+/g, ' ')
  const short = asked.length > 80 ? `${asked.slice(0, 77)}…` : asked
  window.setTimeout(() => {
    conversation.messages.push({
      type: 'ai', timestamp: new Date(), text: '', isComplete: true,
      segments: [
        { type: 'tool_call', invocationId: `demo-member-${Date.now()}`, toolName: 'list_directory', arguments: { path: 'launch' }, status: 'success', result: 'announcement.md, checklist.md, pilot-email.md', logs: [], error: null },
        { type: 'text', content: `Here is where I am on “${short}”: my part is in the folder, and I am waiting on the others in my team for the rest. I will post the result here.\n\nThis is the demo, so this answer is a sample. With your own computer, the agent answers here the same way.` },
      ],
    })
    demoRunStatus(runId, 'idle')
  }, 1800)
}
