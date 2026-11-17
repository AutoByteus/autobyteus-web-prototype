/**
 * The run list's row keys: the format the phone's route and its screens name a run by. (The product also projects the node's
 * run history into rows here; the UI reference's rows come from `stores/mobileRunTreeStore.ts`.)
 */

/** The run list row key of an agent run, `agent:<runId>`: the one writer of that format (the list, and the phone's Create run). */
export const agentRunRowKey = (runId: string): string => `agent:${runId}`;
/** The agent run a top-level row key names (`agent:<runId>`); null for a child row's key or a Team's or Org's key. */
export const agentRunIdOfRowKey = (rowKey: string | null): string | null =>
  rowKey?.startsWith('agent:') && !rowKey.includes('/') ? rowKey.slice('agent:'.length) || null : null;
