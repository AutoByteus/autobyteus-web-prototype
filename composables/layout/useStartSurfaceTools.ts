import { computed, ref, watch, type ComputedRef, type InjectionKey } from 'vue'
import { useRightPanel } from '~/composables/useRightPanel'
import { useWorkspaceStore } from '~/stores/workspace'
import { workspaceMetadataFromWorkspaceInfo } from '~/utils/workspaceMetadata'
import type { ChatDraftWorkspace } from '~/stores/chatDraftStore'
import type { WorkspaceMetadata } from '~/types/workspace/WorkspaceMetadata'

/**
 * run-settings-ui-unification: the start surfaces (New chat, the Org launch page) keep the right
 * tools (Files, Terminal, …) out of the way, behind one small icon. Closed until the user opens
 * them; the choice is remembered. Opening also opens the run view's panel, so a run started from
 * here keeps it.
 */
const STORAGE_KEY = 'autobyteus.chat.startToolsOpen'
const readStored = (): boolean => {
  try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
}
const startToolsOpen = ref(readStored())
const writeStored = (open: boolean) => {
  startToolsOpen.value = open
  try { localStorage.setItem(STORAGE_KEY, open ? '1' : '0') } catch { /* private mode */ }
}

export function useStartSurfaceTools() {
  const { isRightPanelVisible, setRightPanelVisible } = useRightPanel()
  const toolsOpen = computed(() => startToolsOpen.value && isRightPanelVisible.value)
  // The panel's own close button hides the shared panel; the start surface remembers it closed.
  watch(isRightPanelVisible, (visible) => { if (!visible && startToolsOpen.value) writeStored(false) })
  const openTools = () => {
    writeStored(true)
    setRightPanelVisible(true)
  }
  return { toolsOpen, openTools }
}

/** The workspace Files and Terminal use on a start surface: the one chosen in its settings. */
export type StartSurfaceWorkspace = { workspaceId: string | null; workspaceMetadata: WorkspaceMetadata | null }
export const START_SURFACE_WORKSPACE: InjectionKey<ComputedRef<StartSurfaceWorkspace | null>> = Symbol('startSurfaceWorkspace')

/** A typed folder that is not a known workspace yet has no files to show. */
export const startSurfaceWorkspaceOf = (workspace: ChatDraftWorkspace | null | undefined): StartSurfaceWorkspace => {
  const store = useWorkspaceStore()
  const known = (id: string): StartSurfaceWorkspace => {
    const info = store.workspaces[id]
    return { workspaceId: id, workspaceMetadata: store.workspaceMetadataById[id] ?? (info ? workspaceMetadataFromWorkspaceInfo(info) : null) }
  }
  if (!workspace) return { workspaceId: null, workspaceMetadata: null }
  if (workspace.kind === 'existing') return known(workspace.workspaceId)
  const match = Object.entries(store.workspaces).find(([, info]) => (info as { absolutePath?: string }).absolutePath === workspace.rootPath)
  return match ? known(match[0]) : { workspaceId: null, workspaceMetadata: null }
}
