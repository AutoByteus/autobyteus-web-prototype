import { defineStore } from 'pinia'
import { EXAMPLE_FOLDERS, workspaceInfoOf } from '~/prototype/workspace-folders/workspaceFoldersFixture'

/**
 * workspace-tree-vs-chooser (design): the folders the user removed from the chat's folder chooser.
 *
 * "Remove" (the chooser's) unregisters a folder from every list; it deletes no file, memory or run history, and the server
 * refuses it while a run is running in the folder (today's guard). The UI reference keeps the answer in this store and in
 * `localStorage`, so a reload keeps it; remove the key to reset.
 */
const STORE_KEY = 'autobyteus.prototype.removedFolders'
export const REMOVE_REFUSED_MESSAGE = 'Stop active runs before removing this workspace.'

const read = (): string[] => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]') as string[] } catch { return [] }
}

export const useWorkspaceFoldersStore = defineStore('workspaceFolders', {
  state: () => ({ removed: read() as string[] }),
  actions: {
    remove(workspaceId: string, hasActiveRun: boolean): { success: boolean, message: string } {
      if (hasActiveRun) return { success: false, message: REMOVE_REFUSED_MESSAGE }
      if (!this.removed.includes(workspaceId)) this.removed = [...this.removed, workspaceId]
      try { localStorage.setItem(STORE_KEY, JSON.stringify(this.removed)) } catch { /* in-memory only */ }
      return { success: true, message: 'Files, memories, and run history were not deleted.' }
    },
    /** The example folders this node registers now. */
    registeredExampleFolders() {
      return EXAMPLE_FOLDERS.filter((folder) => !this.removed.includes(folder.workspaceId)).map(workspaceInfoOf)
    },
  },
})
