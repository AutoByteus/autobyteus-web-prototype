import { defineStore } from 'pinia';
import { getApolloClient } from '~/utils/apolloClient';
import { GET_SEMANTIC_MEMORY_FILES, GET_SEMANTIC_MEMORY_FOLDERS } from '~/graphql/queries/semanticMemoryQueries';
import { determineFilePreviewType, type FileDataType } from '~/utils/fileExplorer/fileTypePolicy';
import { loadSemanticFile } from '~/prototype/memory-semantic/semanticMemoryFixture';
import type { SemanticMemoryFile, SemanticMemoryFileList, SemanticMemoryFolder } from '~/types/semanticMemory';

/**
 * semantic-memory-view-554 (design): the Memory page's read-only semantic memory view.
 * - `folders`: Browse → Semantic Memory (one card per agent folder on this node), filtered on the page as you type.
 * - `folder`: one agent's folder (its files, newest first).
 * - `open`: the file shown on the right. Only a regular file is loaded; a link row is never opened.
 * In the product the content comes from the node-file loader the Files panel uses; here a local stand-in answers.
 */

interface FolderListState {
  entries: SemanticMemoryFolder[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  search: string;
  page: number;
  totalPages: number;
}

interface OpenFileState {
  relativePath: string | null;
  type: FileDataType | null;
  content: string | null;
  url: string | null;
  loading: boolean;
  /** A node-file refusal message key (the Files panel's words), or null. */
  errorKey: string | null;
}

const REFUSAL_KEYS = {
  'not-found': 'workspace.components.mobile.views.MobileFiles.node_file_not_found',
  failed: 'workspace.components.conversation.segments.renderer.MarkdownRenderer.file_preview_failed',
} as const;

const scenario = () => {
  try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated'; } catch { return 'populated'; }
};

const emptyOpen = (): OpenFileState => ({ relativePath: null, type: null, content: null, url: null, loading: false, errorKey: null });

export const useSemanticMemoryStore = defineStore('semanticMemory', {
  state: () => ({
    folders: { entries: [], loading: false, loaded: false, error: null, search: '', page: 1, totalPages: 1 } as FolderListState,
    agentDefinitionId: null as string | null,
    folder: null as SemanticMemoryFileList | null,
    folderLoading: false,
    folderError: null as string | null,
    open: emptyOpen(),
    requestId: 0,
    openRequestId: 0,
  }),

  getters: {
    /** The cards the Browse tab shows: the folders whose agent name or ID contains the filter. */
    visibleFolders(state): SemanticMemoryFolder[] {
      const search = state.folders.search.trim().toLowerCase();
      if (!search) return state.folders.entries;
      return state.folders.entries.filter(folder => folder.agentName.toLowerCase().includes(search) || folder.agentDefinitionId.toLowerCase().includes(search));
    },
    openFile(state): SemanticMemoryFile | null {
      return state.folder?.files.find(file => file.relativePath === state.open.relativePath) ?? null;
    },
  },

  actions: {
    async fetchFolders() {
      this.folders.loading = true;
      this.folders.error = null;
      try {
        const { data, errors } = await getApolloClient().query<{ semanticMemoryFolders: SemanticMemoryFolder[] }>({ query: GET_SEMANTIC_MEMORY_FOLDERS, fetchPolicy: 'network-only' });
        if (errors?.length) throw new Error(errors.map(e => e.message).join(', '));
        this.folders.entries = data?.semanticMemoryFolders ?? [];
        this.folders.loaded = true;
      } catch (error: any) {
        this.folders.error = error?.message || 'Failed to list the semantic memory folders.';
      } finally {
        this.folders.loading = false;
      }
    },

    setSearch(search: string) {
      this.folders.search = search;
    },

    /** Reads whether the agent's folder exists and what it holds (the view shows its explorer only for a folder with files). */
    async openFolder(agentDefinitionId: string) {
      const requestId = ++this.requestId;
      if (this.agentDefinitionId !== agentDefinitionId) {
        this.folder = null;
        this.open = emptyOpen();
      }
      this.agentDefinitionId = agentDefinitionId;
      this.folderLoading = true;
      this.folderError = null;
      try {
        const { data, errors } = await getApolloClient().query<{ semanticMemoryFiles: SemanticMemoryFileList }>({
          query: GET_SEMANTIC_MEMORY_FILES,
          variables: { agentDefinitionId },
          fetchPolicy: 'network-only',
        });
        if (errors?.length) throw new Error(errors.map(e => e.message).join(', '));
        if (requestId !== this.requestId) return;
        this.folder = data?.semanticMemoryFiles ?? null;
      } catch (error: any) {
        if (requestId === this.requestId) this.folderError = error?.message || 'Failed to list the folder.';
        return;
      } finally {
        if (requestId === this.requestId) this.folderLoading = false;
      }
    },

    /** Opens a regular file. A link is never opened: the caller does not offer it, and this refuses it too. */
    async openEntry(file: SemanticMemoryFile) {
      if (file.kind !== 'file') return;
      const requestId = ++this.openRequestId;
      const type = determineFilePreviewType(file.relativePath);
      this.open = { relativePath: file.relativePath, type, content: null, url: null, loading: true, errorKey: null };
      const loaded = await loadSemanticFile(file.absolutePath, scenario());
      if (requestId !== this.openRequestId) return;
      if (loaded.kind === 'refused') this.open = { ...this.open, loading: false, errorKey: REFUSAL_KEYS[loaded.refusal] };
      else if (loaded.kind === 'text') this.open = { ...this.open, loading: false, content: loaded.content };
      else this.open = { ...this.open, loading: false, url: loaded.url };
    },

    clearFolder() {
      this.agentDefinitionId = null;
      this.folder = null;
      this.folderError = null;
      this.open = emptyOpen();
    },
  },
});
