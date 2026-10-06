import { defineNuxtPlugin } from '#app'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentRunStore } from '~/stores/agentRunStore'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import { buildConversationFromProjection } from '~/services/runHydration/runProjectionConversation'
import { AgentStatus } from '~/types/agent/AgentStatus'
import {
  MANAGER_RUN_ID, managerClosesOnReport, managerCollaborationView, managerConversation, managerTurn, recordUserMessage,
  type ManagerTurn,
} from '~/prototype/task-run-cleanup/taskManagerRunFixture'

/**
 * task-run-resources-workspace-cleanup (design): the Project Task Manager is a live run.
 *
 * Everything here sits beneath the product UI:
 * - its streams are answered like the server would: the agent stream reports Idle, and the
 *   collaboration stream sends the run's tree snapshot;
 * - a message typed in the Manager's own message box gets a scripted turn (standing in for the
 *   model and its `update_project_task` / `delegate_task` calls): Running, then its tool call and
 *   reply, then Idle. A Task marked DONE closes its runs, so they leave the tree. "Close it when
 *   the team reports back" makes the Manager close the Task by itself a few seconds later (a
 *   scripted timeline), for example while the user is reading a worker's conversation.
 *
 * Every other run is unchanged.
 */
export default defineNuxtPlugin(() => {
  const Base = window.WebSocket as any
  class ManagerAwareSocket extends Base {
    constructor(url: string | URL) {
      super(url)
      const href = String(url)
      const runId = decodeURIComponent(href.split('?')[0]!.split('/').filter(Boolean).pop() || '')
      if (runId !== MANAGER_RUN_ID) return
      setTimeout(() => {
        if (href.includes('/ws/agent-collaboration/')) {
          this.deliver({ type: 'CONNECTED', payload: { root_subject_kind: 'agent', root_run_id: MANAGER_RUN_ID, session_id: 'prototype-ptm-collaboration' } })
          this.deliver({ type: 'ROOT_EXECUTION_VIEW_SNAPSHOT', payload: managerCollaborationView(true) })
        } else if (href.includes('/ws/agent/')) {
          this.deliver({ type: 'CONNECTED', payload: { agent_id: MANAGER_RUN_ID, session_id: 'prototype-ptm-agent' } })
          this.deliver({ type: 'AGENT_STATUS', payload: { status: 'idle', trigger: null, tool_name: null, error_message: null, error_details: null, recoverableBlock: null } })
        }
      }, 30)
    }

    deliver(frame: unknown): void {
      const socket = this as unknown as WebSocket
      if (socket.readyState !== 1) return
      const event = new MessageEvent('message', { data: JSON.stringify(frame) })
      socket.onmessage?.(event)
      socket.dispatchEvent(event)
    }
  }
  window.WebSocket = ManagerAwareSocket as unknown as typeof WebSocket

  const agentRun = useAgentRunStore()
  const contexts = useAgentContextsStore()
  const collaboration = useAgentRunCollaborationStore()
  const original = agentRun.sendUserInputAndSubscribe.bind(agentRun)

  const render = () => {
    const context = contexts.getRun(MANAGER_RUN_ID)
    if (!context) return
    context.state.conversation = buildConversationFromProjection(MANAGER_RUN_ID, managerConversation() as any, {
      agentDefinitionId: context.config.agentDefinitionId,
      agentName: context.config.agentDefinitionName || 'Project Task Manager',
      llmModelIdentifier: context.config.llmModelIdentifier,
    })
  }

  agentRun.sendUserInputAndSubscribe = async () => {
    const context = contexts.activeRun
    if (context?.state.runId !== MANAGER_RUN_ID) return original()
    const text = context.requirement.trim()
    if (!text) return
    context.requirement = ''
    context.contextFilePaths = []
    recordUserMessage(text)
    render()
    context.state.currentStatus = AgentStatus.Running
    await new Promise((resolve) => setTimeout(resolve, 900))
    const turn = managerTurn(text)
    render()
    context.state.currentStatus = AgentStatus.Idle
    applyTurn(turn)
    if (turn.closeLater) {
      const taskId = turn.closeLater
      // The worker reports back a few seconds later; the Manager closes the Task by itself.
      setTimeout(() => {
        const manager = contexts.getRun(MANAGER_RUN_ID)
        if (manager) manager.state.currentStatus = AgentStatus.Running
        setTimeout(() => {
          const later = managerClosesOnReport(taskId)
          render()
          if (manager) manager.state.currentStatus = AgentStatus.Idle
          applyTurn(later)
        }, 900)
      }, 6000)
    }
  }

  const applyTurn = (turn: ManagerTurn) => {
    // DONE stops the Task's runs.
    const root = collaboration.contextFor(MANAGER_RUN_ID)
    for (const runId of turn.closedRunIds) {
      const child = root?.getAgentContext(runId)
      if (child) child.state.currentStatus = AgentStatus.Offline
    }
    // A Task delegated again starts new runs: the live stream resends the run's tree (reconnect).
    if (turn.reopened) {
      collaboration.syncHost(MANAGER_RUN_ID, false)
      collaboration.syncHost(MANAGER_RUN_ID, true)
    }
  }
})
