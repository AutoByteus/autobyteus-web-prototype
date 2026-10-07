import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useAgentContextsStore } from '~/stores/agentContextsStore'
import { useAgentRunStore } from '~/stores/agentRunStore'
import { useAgentRunCollaborationStore } from '~/stores/agentRunCollaborationStore'
import { useProjectStore } from '~/stores/projectStore'
import { useProjectTaskStore } from '~/stores/projectTaskStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { buildConversationFromProjection } from '~/services/runHydration/runProjectionConversation'
import { AgentStatus } from '~/types/agent/AgentStatus'
import { closure, MANAGER_RUN_ID, managerConversation, recordUserMessage } from '~/prototype/task-run-cleanup/taskManagerRunFixture'
import { adHoc, adHocTasks, isScreenshotsMessage, NO_PROJECT_ID, screenshotsTurn } from '~/prototype/project-manager/adHocTasksFixture'
import {
  LAUNCH_PROJECT_ID, MANAGER_DEFINITION_ID, REFRESH_PROJECT_ID, REFRESH_RUN_ID,
  applyStep, liveTasksOf, recordRefreshUserMessage, refresh, refreshProject,
  refreshCollaborationView, refreshConversation, refreshTurn, startRefreshConversation,
} from '~/prototype/project-manager/projectManagerFixture'

/**
 * project-manager-ux (design): everything beneath the UI for a Project and its Manager.
 *
 * - Live Projects pages: whenever an agent creates or changes a Project or a Task (the scripted
 *   Manager turns here, and the Prototype Launch Manager from task-run-resources-workspace-cleanup),
 *   the Project and its Tasks are pushed to the Projects pages, as a server push would.
 * - The first message of a New chat with the Project Task Manager (any workspace) starts the
 *   scripted Manager conversation `run-ptm-0002` (once; later New chats are ordinary runs). Its
 *   streams are answered like the server would, and each message gets a scripted turn: Running,
 *   then the Manager's steps one by one (the Project, a Task, a dispatch, a status), then Idle.
 */
export default defineNuxtPlugin(() => {
  const Base = window.WebSocket as any
  class RefreshManagerSocket extends Base {
    constructor(url: string | URL) {
      super(url)
      const href = String(url)
      const runId = decodeURIComponent(href.split('?')[0]!.split('/').filter(Boolean).pop() || '')
      if (runId !== REFRESH_RUN_ID) return
      setTimeout(() => {
        if (href.includes('/ws/agent-collaboration/')) {
          this.deliver({ type: 'CONNECTED', payload: { root_subject_kind: 'agent', root_run_id: REFRESH_RUN_ID, session_id: 'prototype-ptm2-collaboration' } })
          this.deliver({ type: 'ROOT_EXECUTION_VIEW_SNAPSHOT', payload: refreshCollaborationView(true) })
        } else if (href.includes('/ws/agent/')) {
          this.deliver({ type: 'CONNECTED', payload: { agent_id: REFRESH_RUN_ID, session_id: 'prototype-ptm2-agent' } })
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
  window.WebSocket = RefreshManagerSocket as unknown as typeof WebSocket

  const agentRun = useAgentRunStore()
  const contexts = useAgentContextsStore()
  const collaboration = useAgentRunCollaborationStore()
  const tasks = useProjectTaskStore()
  const history = useRunHistoryStore()
  const projects = useProjectStore()

  // The Project Task Manager comes from the agent repository: when it is installed, it is in the
  // agent catalog like any agent (Agents page, New chat, "Talk to manager").
  const definitions = useAgentDefinitionStore()
  watch(() => definitions.agentDefinitions, (list) => {
    if (!list?.length || list.some((item: any) => item.id === MANAGER_DEFINITION_ID)) return
    definitions.agentDefinitions = [...list, {
      ...JSON.parse(JSON.stringify(list[0])), id: MANAGER_DEFINITION_ID, name: 'Project Task Manager',
      description: 'Plans a Project into Tasks, hands each one to an agent or team when you approve, and tracks them to Done.',
      avatarUrl: null,
    }] as any
  }, { immediate: true })

  // Live push: the Projects list, the board and the Task page follow every agent change.
  watch(() => [refresh.revision, closure.revision, adHoc.revision], () => {
    // project-manager-ux round 2: Tasks with no Project follow live too.
    if (tasks.getList(NO_PROJECT_ID)?.hasLoaded) tasks.receiveLiveTasks(NO_PROJECT_ID, adHocTasks() as any)
    if (refresh.projectCreated) {
      const open = refresh.tasks.filter((task) => task.status !== 'DONE').length
      projects.receiveLiveProject({ ...structuredClone(refreshProject), taskCount: refresh.tasks.length, openTaskCount: open } as any)
    }
    for (const projectId of [LAUNCH_PROJECT_ID, REFRESH_PROJECT_ID]) {
      if (tasks.getList(projectId)?.hasLoaded) tasks.receiveLiveTasks(projectId, liveTasksOf(projectId) as any)
    }
  })

  const render = () => {
    const context = contexts.getRun(REFRESH_RUN_ID)
    if (!context) return
    context.state.conversation = buildConversationFromProjection(REFRESH_RUN_ID, refreshConversation() as any, {
      agentDefinitionId: MANAGER_DEFINITION_ID,
      agentName: context.config.agentDefinitionName || 'Project Task Manager',
      llmModelIdentifier: context.config.llmModelIdentifier,
    })
  }
  const renderManager = () => {
    const context = contexts.getRun(MANAGER_RUN_ID)
    if (!context) return
    context.state.conversation = buildConversationFromProjection(MANAGER_RUN_ID, managerConversation() as any, {
      agentDefinitionId: context.config.agentDefinitionId,
      agentName: context.config.agentDefinitionName || 'Project Task Manager',
      llmModelIdentifier: context.config.llmModelIdentifier,
    })
  }
  const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const playTurn = async (text: string) => {
    const context = contexts.getRun(REFRESH_RUN_ID)
    if (context) context.state.currentStatus = AgentStatus.Running
    await pause(900)
    for (const step of refreshTurn(text)) {
      applyStep(step)
      render()
      if (step.delegated) {
        // A started worker joins the conversation's tree: the live stream resends its snapshot.
        await history.fetchTree().catch(() => undefined)
        collaboration.syncHost(REFRESH_RUN_ID, false)
        collaboration.syncHost(REFRESH_RUN_ID, true)
      }
      if (step.closedRunIds?.length) {
        const root = collaboration.contextFor(REFRESH_RUN_ID)
        for (const runId of step.closedRunIds) {
          const child = root?.getAgentContext(runId)
          if (child) child.state.currentStatus = AgentStatus.Offline
        }
      }
      if (!step.quiet) await pause(750)
    }
    const after = contexts.getRun(REFRESH_RUN_ID)
    if (after) after.state.currentStatus = AgentStatus.Idle
  }

  const previous = agentRun.sendUserInputAndSubscribe.bind(agentRun)
  agentRun.sendUserInputAndSubscribe = async () => {
    const context = contexts.activeRun
    const runId = context?.state.runId ?? ''

    // The first message of a new Project Task Manager chat starts the scripted conversation.
    if (context && runId.startsWith('temp-') && context.config.agentDefinitionId === MANAGER_DEFINITION_ID && !refresh.started) {
      const text = context.requirement.trim()
      if (!text) return
      context.requirement = ''
      context.contextFilePaths = []
      contexts.promoteTemporaryId(runId, REFRESH_RUN_ID)
      contexts.lockConfig(REFRESH_RUN_ID)
      startRefreshConversation()
      recordRefreshUserMessage(text)
      render()
      await history.fetchTree().catch(() => undefined)
      void playTurn(text)
      return
    }

    // project-manager-ux round 2: the Prototype Launch Manager reopens (or closes) a Task with no
    // Project and messages the same worker; its run comes back in the tree.
    if (context && runId === MANAGER_RUN_ID && isScreenshotsMessage(context.requirement)) {
      const text = context.requirement.trim()
      context.requirement = ''
      context.contextFilePaths = []
      recordUserMessage(text)
      renderManager()
      context.state.currentStatus = AgentStatus.Running
      await pause(900)
      closure.transcript.push(...screenshotsTurn(text))
      renderManager()
      context.state.currentStatus = AgentStatus.Idle
      collaboration.syncHost(MANAGER_RUN_ID, false)
      collaboration.syncHost(MANAGER_RUN_ID, true)
      return
    }

    // Later messages to that conversation.
    if (context && runId === REFRESH_RUN_ID) {
      const text = context.requirement.trim()
      if (!text) return
      context.requirement = ''
      context.contextFilePaths = []
      recordRefreshUserMessage(text)
      render()
      await playTurn(text)
      return
    }
    return previous()
  }
})
