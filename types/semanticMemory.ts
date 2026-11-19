/**
 * semantic-memory-view-554: an agent's semantic memory as the node lists it (the design's shapes, after the designed
 * GraphQL `semanticMemoryFolders` / `semanticMemoryFiles(agentDefinitionId)`; they do not prescribe the server's types).
 */

/** One folder under `<memory>/semantic/`: one agent. */
export interface SemanticMemoryFolder {
  agentDefinitionId: string;
  /** The agent's name from its definition; else the decoded definition ID. */
  agentName: string;
  fileCount: number;
  /** The newest modification inside the folder; null for an empty folder. */
  latestChangeAt: string | null;
}

export type SemanticMemoryEntryKind = 'file' | 'link';

/** One entry of a folder: a regular file, or a symbolic link (listed, never entered or opened). */
export interface SemanticMemoryFile {
  relativePath: string;
  absolutePath: string;
  kind: SemanticMemoryEntryKind;
  sizeBytes: number;
  modifiedAt: string;
}

export interface SemanticMemoryFileList {
  agentDefinitionId: string;
  /** False when the folder has not been created yet (the agent has not run since semantic memory is on for it). */
  exists: boolean;
  folderPath: string;
  /** Newest first. */
  files: SemanticMemoryFile[];
  /** The node lists at most 5,000 entries. */
  truncated: boolean;
}
