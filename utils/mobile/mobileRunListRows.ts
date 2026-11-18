/**
 * One row of the phone's run list: a listed run (depth 0), or a row of its tree. The shape the screens read; the product
 * builds the rows from the node's run history and the server's run trees, the UI reference from its invented world
 * (`stores/mobileRunTreeStore.ts`).
 */
export type MobileRunTreeRow = Readonly<{
  key: string;
  depth: number;
  /** The avatar: an agent's initials, the Team icon or the Org icon. */
  avatar: 'agent' | 'team' | 'org';
  name: string;
  /** The run's title, or a delegated row's Task summary or peer title; empty when the row has none. */
  title: string;
  /** The shared status (`AgentStatus`, a Team's own status). */
  status: string;
  /** Background tasks running (autobyteus-448): an agent's own, a Team's sum; shown with `status` by `agentActivityPresentation`. */
  backgroundTasksRunning: number;
  /** A run another node runs: its node, and whether the node answers. */
  remote: Readonly<{ nodeName: string; reachable: boolean }> | null;
  hasChildren: boolean;
  expanded: boolean;
  fold: unknown | null;
  /** Null for a row that opens nothing. */
  open: unknown | null;
  /** Listed runs: the server's last activity, for the age. */
  lastActivityAt: string | null;
}>;
