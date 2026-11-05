import type { TranslationCatalog } from '../../runtime/types';

// workspace-tree-vs-chooser: the run section's view menu, and "Remove" in the chat's folder chooser.
// The English strings are normative UI copy (tickets/in-progress/workspace-tree-vs-chooser/ui-ux-spec.md).
const workspaceFolderMessages = {
  'workspaceFolders.menuTitle': 'View and add',
  'workspaceFolders.viewLabel': 'View',
  'workspaceFolders.viewRuns': 'Runs',
  'workspaceFolders.chooserRemove': 'Remove {{name}}',
  'workspaceFolders.removeTitle': 'Remove folder',
  'workspaceFolders.removeQuestion': 'Remove {{name}}?',
  'workspaceFolders.removeBody': 'It will no longer be offered when you choose a folder, and its runs will not appear under Workspaces. Files, memories, artifacts, and run history are not deleted. Add the folder again to use it.',
  'workspaceFolders.removeConfirm': 'Remove',
  'workspaceFolders.removedToast': '{{name}} removed. Files, memories, and run history were not deleted.',
} satisfies TranslationCatalog;

export default workspaceFolderMessages;
