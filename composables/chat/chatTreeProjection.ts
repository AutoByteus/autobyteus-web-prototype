import { AgentStatus } from '~/types/agent/AgentStatus'
import type { WorkspaceHistoryWorkspaceNode } from '~/stores/runHistoryTypes'
import type { RunTreeRow } from '~/utils/runTreeProjection'
import type { ChatRecord, ChatWorkspace } from '~/prototype/chat/chat-fixtures'
import { findAgent } from '~/composables/chat/usePrototypeChat'

// chat-interface-entry prototype: a chat is an ordinary agent run, so it is
// projected into the existing Workspaces tree with the product's normal rules:
// workspaces by name, agents by name, runs newest first. No special ordering.
export const CHAT_WORKSPACE_KEY_PREFIX = 'workspace:'

export function mergeChatRunsIntoTree(
  nodes: WorkspaceHistoryWorkspaceNode[],
  chats: ChatRecord[],
  findWorkspace: (id: string) => ChatWorkspace,
  activityAt: (chat: ChatRecord) => string,
): WorkspaceHistoryWorkspaceNode[] {
  const merged: WorkspaceHistoryWorkspaceNode[] = nodes.map((node) => ({ ...node, agents: node.agents.map((agent) => ({ ...agent, runs: [...agent.runs] })) }))
  const ordered = [...chats].sort((a, b) => activityAt(b).localeCompare(activityAt(a)))
  for (const chat of ordered) {
    const workspace = findWorkspace(chat.workspaceId)
    let node = merged.find((item) => item.workspaceRootPath === workspace.path)
    if (!node) {
      node = {
        stableKey: `${CHAT_WORKSPACE_KEY_PREFIX}${workspace.path}`,
        workspaceId: `chat-workspace:${workspace.id}`,
        workspaceRootPath: workspace.path,
        workspaceName: workspace.name,
        workspaceKind: workspace.isTemp ? 'temp' : 'filesystem',
        canRemoveFromWorkspaces: false,
        agents: [],
        agentOrgDefinitions: [],
      }
      merged.push(node)
    }
    const agent = findAgent(chat.agentId)
    let agentNode = node.agents.find((item) => item.agentDefinitionId === agent.id)
    if (!agentNode) {
      agentNode = { agentDefinitionId: agent.id, agentName: agent.name, agentAvatarUrl: null, runs: [] }
      node.agents.push(agentNode)
    }
    const running = chat.status === 'running'
    const row: RunTreeRow = {
      runId: chat.id,
      summary: chat.title,
      lastActivityAt: activityAt(chat),
      currentStatus: running ? AgentStatus.Running : AgentStatus.Idle,
      lastKnownStatus: running ? 'ACTIVE' : 'IDLE',
      isActive: running,
      source: 'history',
      isDraft: false,
    }
    agentNode.runs.push(row)
  }
  for (const node of merged) {
    node.agents.sort((a, b) => a.agentName.localeCompare(b.agentName) || a.agentDefinitionId.localeCompare(b.agentDefinitionId))
    for (const agent of node.agents) agent.runs.sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt))
  }
  return merged.sort((a, b) => a.workspaceName.localeCompare(b.workspaceName) || a.workspaceRootPath.localeCompare(b.workspaceRootPath))
}

export const isChatRunId = (chats: ChatRecord[], runId: string) => chats.some((chat) => chat.id === runId)
