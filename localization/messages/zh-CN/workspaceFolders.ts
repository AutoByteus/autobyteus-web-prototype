import type { TranslationCatalog } from '../../runtime/types';

// workspace-tree-vs-chooser: 运行区的视图菜单，以及聊天文件夹选择器中的“移除”。
const workspaceFolderMessages = {
  'workspaceFolders.menuTitle': '视图与添加',
  'workspaceFolders.viewLabel': '视图',
  'workspaceFolders.viewRuns': '运行',
  'workspaceFolders.chooserRemove': '移除 {{name}}',
  'workspaceFolders.removeTitle': '移除文件夹',
  'workspaceFolders.removeQuestion': '移除 {{name}}？',
  'workspaceFolders.removeBody': '选择文件夹时将不再提供它，它的运行也不会显示在“工作区”下。文件、记忆、产物和运行历史不会被删除。重新添加该文件夹即可再次使用。',
  'workspaceFolders.removeConfirm': '移除',
  'workspaceFolders.removedToast': '{{name}} 已移除。文件、记忆和运行历史未被删除。',
} satisfies TranslationCatalog;

export default workspaceFolderMessages;
