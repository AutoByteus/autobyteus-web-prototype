import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceFoldersStore } from '~/stores/workspaceFoldersStore'
import { designOnlyLayersEnabled } from '~/prototype/shared/design-only-layers'

/**
 * workspace-tree-vs-chooser (design): the example node registers a few more folders (prototype/workspace-folders), minus the
 * ones the user removed from the chat's folder chooser. Beneath the UI: the store snapshots of the UI reference would otherwise
 * bring a removed folder back on the next route change.
 */
export default defineNuxtPlugin(() => {
  if (!designOnlyLayersEnabled()) return
  const workspaces = useWorkspaceStore()
  const folders = useWorkspaceFoldersStore()
  const reconcile = (): void => {
    const next: Record<string, any> = { ...workspaces.workspaces }
    let changed = false
    for (const info of folders.registeredExampleFolders()) if (!next[info.workspaceId]) { next[info.workspaceId] = info; changed = true }
    for (const id of folders.removed) if (next[id]) { delete next[id]; changed = true }
    if (changed) workspaces.workspaces = next
  }
  watch(() => [Object.keys(workspaces.workspaces).join('|'), folders.removed.join('|')], reconcile, { immediate: true })
})
