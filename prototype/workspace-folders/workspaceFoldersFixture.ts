/**
 * workspace-tree-vs-chooser (design): the example folders of the Workspaces tree and the chat's folder chooser.
 *
 * Hand-written and illustrative; nothing is read from disk. Beside `prototype-workspace` and the Temp workspace the example
 * node registers three more folders: `client-portal` (it has the example runs of the Runs view), and two that have no runs
 * (`docs-site`, `design-notes`), so the chooser and the tree show a folder that is only ever chosen for a new run.
 */
export type ExampleFolder = { workspaceId: string, name: string, rootPath: string }

export const EXAMPLE_FOLDERS: ExampleFolder[] = [
  { workspaceId: 'workspace-client-portal', name: 'client-portal', rootPath: '/synthetic/client-portal' },
  { workspaceId: 'workspace-docs-site', name: 'docs-site', rootPath: '/synthetic/docs-site' },
  { workspaceId: 'workspace-design-notes', name: 'design-notes', rootPath: '/synthetic/design-notes' },
]

export const workspaceInfoOf = (folder: ExampleFolder) => ({
  workspaceId: folder.workspaceId,
  name: folder.name,
  displayName: folder.name,
  workspaceConfig: { root_path: folder.rootPath },
  absolutePath: folder.rootPath,
  workspaceRootPath: folder.rootPath,
  kind: 'filesystem',
  isTemp: false,
})
