export type ProjectWorkspaceAvailability = 'AVAILABLE' | 'UNREGISTERED'

/** A workspace linked to a Project, with availability resolved by the server at read time. */
export interface ProjectWorkspace {
  workspaceId: string
  workspaceRootPath: string
  displayName: string
  description: string
  addedAt: string
  availability: ProjectWorkspaceAvailability
}

export interface Project {
  projectId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  workspaces: ProjectWorkspace[]
  /** Number of this Project's Tasks whose status is not DONE. */
  taskCount: number
  openTaskCount: number
}

export type ProjectTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export const PROJECT_TASK_STATUSES: readonly ProjectTaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

/** A Project Task. It has no title: the description is its content, and its first line is its summary. */
export interface ProjectTaskContextFile { storedFilename: string; displayName: string; mimeType: string; sizeBytes: number; locator?: string }
export interface ProjectTaskContextDraft { draftId: string; storedFilenames: string[] }
export interface ProjectTaskContextChanges { draftId?: string; addStoredFilenames?: string[]; removeStoredFilenames?: string[] }
export interface ProjectWorkspaceInput { workspaceId: string; description: string }
/**
 * project-manager-ux (design): the root a Task was handed to, the one agent or team the Project
 * Task Manager delegated it to (from the Task's run resources). Runs a worker started by itself
 * are not listed. `openRunId` is the run the user opens (a team opens its coordinator);
 * `hostRunId` is the Manager conversation that started it. A DONE Task's root is `stopped`; a
 * root that could not start is `failed` with its `error`.
 */
export interface ProjectTaskWorker {
  kind: 'agent' | 'team'
  name: string
  hostRunId: string
  agentRunId: string | null
  teamRunId: string | null
  openRunId: string | null
  status: 'running' | 'idle' | 'failed' | 'stopped'
  error: string | null
}
export interface ProjectTask {
  /** project-manager-ux (design): the Task's root (at most one: the latest delegation), read with the Task. */
  workers?: ProjectTaskWorker[]
  contextFiles: ProjectTaskContextFile[]
  taskId: string
  projectId: string
  description: string
  status: ProjectTaskStatus
  createdAt: string
  updatedAt: string
}

export type ProjectErrorCode =
  | 'PROJECT_NAME_REQUIRED'
  | 'PROJECT_NAME_TAKEN'
  | 'PROJECT_NOT_FOUND'
  | 'WORKSPACE_NOT_REGISTERED'
  | 'WORKSPACE_ALREADY_LINKED'
  | 'WORKSPACE_LINK_NOT_FOUND'
  | 'TASK_DESCRIPTION_REQUIRED'
  | 'TASK_NOT_FOUND'
