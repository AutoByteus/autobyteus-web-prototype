import type { KeyboardEvent } from "react";
import {
  nodeById,
  statusLabels,
  type IdentityMode,
  type MetadataMode,
  type PanelWidth,
  type Status,
  type TeamNode,
} from "./model";

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`chevron${open ? " is-open" : ""}`} viewBox="0 0 20 20" aria-hidden="true">
      <path d="m7 5 5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function TeamGlyph({ transient = false }: { transient?: boolean }) {
  if (transient) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.8 20.5 12 12 21.2 3.5 12 12 2.8Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.5" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.8 17.8c.4-3 2-4.6 4.4-4.6s4 1.6 4.4 4.6M13 14.3c.8-1.4 2-2.1 3.6-2.1 2 0 3.3 1.3 3.7 3.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export function MoreGlyph() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="4" cy="10" r="1.35" fill="currentColor" />
      <circle cx="10" cy="10" r="1.35" fill="currentColor" />
      <circle cx="16" cy="10" r="1.35" fill="currentColor" />
    </svg>
  );
}

function StatusDot({ status, aggregate = false }: { status: Status; aggregate?: boolean }) {
  return (
    <span
      className={`status-dot status-${status}${aggregate ? " is-aggregate" : ""}`}
      role="img"
      aria-label={`${aggregate ? "Aggregate descendant status" : "Exact agent status"}: ${statusLabels[status]}`}
      title={`${aggregate ? "Aggregate descendant status" : "Exact agent status"}: ${statusLabels[status]}`}
    />
  );
}

interface TreeNodeProps {
  node: TeamNode;
  level: number;
  index: number;
  setSize: number;
  expanded: Set<string>;
  selectedId: string | null;
  selectedAncestors: Set<string>;
  focusedId: string;
  identity: IdentityMode;
  metadata: MetadataMode;
  panelWidth: PanelWidth;
  onActivate: (node: TeamNode) => void;
  onFocus: (id: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, node: TeamNode) => void;
}

export function TreeNode({
  node,
  level,
  index,
  setSize,
  expanded,
  selectedId,
  selectedAncestors,
  focusedId,
  identity,
  metadata,
  panelWidth,
  onActivate,
  onFocus,
  onKeyDown,
}: TreeNodeProps) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expanded.has(node.id);
  const isTeam = node.kind === "team" || node.kind === "transient-team";
  const isTransient = node.kind === "transient-team" || node.kind === "transient-agent";
  const isSelected = selectedId === node.id;
  const isAncestor = selectedAncestors.has(node.id);
  const showAge = metadata === "always"
    || (metadata === "responsive" && panelWidth >= 320)
    || (metadata === "on-demand" && isTeam);
  const tooltipId = `identity-${node.id}`;
  const roleWord = node.kind === "team" ? "Team" : node.kind === "transient-team" ? "Task team" : "Agent";

  return (
    <div className={`node-wrap${isTeam ? " is-team-wrap" : ""}${isTransient ? " is-transient-wrap" : ""}`} data-node-wrap={node.id}>
      <div
        className={`tree-row kind-${node.kind}${isSelected ? " is-selected" : ""}${isAncestor ? " is-selected-ancestor" : ""}`}
        data-treeitem={node.id}
        data-parent={nodeById.get(node.id)?.parentId ?? ""}
        data-kind={node.kind}
        role="treeitem"
        aria-level={level}
        aria-posinset={index + 1}
        aria-setsize={setSize}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-describedby={tooltipId}
        tabIndex={focusedId === node.id ? 0 : -1}
        onClick={() => onActivate(node)}
        onFocus={() => onFocus(node.id)}
        onKeyDown={(event) => onKeyDown(event, node)}
      >
        <span className="branch-elbow" aria-hidden="true" />
        <span className={`disclosure-slot${hasChildren ? " has-children" : ""}`} aria-hidden="true">
          {hasChildren ? <Chevron open={isExpanded} /> : <span className="leaf-tick" />}
        </span>
        <StatusDot status={node.status} aggregate={isTeam} />
        {isTeam ? (
          <span className={`node-glyph team-glyph${isTransient ? " is-transient" : ""}`} aria-hidden="true"><TeamGlyph transient={isTransient} /></span>
        ) : (
          <span className={`node-glyph agent-glyph${isTransient ? " is-transient" : ""}`} aria-hidden="true">{node.name.slice(0, 1).toUpperCase()}</span>
        )}
        <span className="node-copy">
          {isTeam && identity !== "icon-label" ? <span className="role-kicker">{roleWord}</span> : null}
          <span className="name-line">
            {isTeam && identity === "icon-label" ? <span className="role-word">{roleWord}</span> : null}
            <span className="node-name">{node.name}</span>
          </span>
        </span>
        {isTransient ? <span className="temporary-mark" title="Temporary execution">Temp</span> : null}
        {showAge ? <span className="node-age" aria-label={`Last activity ${node.age} ago`}>{node.age}</span> : null}
        <span className="row-affordance" aria-hidden="true">{hasChildren ? (isExpanded ? "Collapse" : "Expand") : "Open"}</span>
        <span className="identity-tooltip" id={tooltipId} role="tooltip">
          <strong>{node.name}</strong>
          <span>{node.role}</span>
          <span>{statusLabels[node.status]} · last activity {node.age} ago</span>
          {hasChildren
            ? <span>{isExpanded ? "Expanded" : "Collapsed"} · Enter, Space, ← or → to toggle</span>
            : <span>Enter or Space to select</span>}
        </span>
      </div>
      {hasChildren && isExpanded ? (
        <div className="tree-children" role="group" aria-label={`Members of ${node.name}`}>
          {node.children!.map((child, childIndex) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              index={childIndex}
              setSize={node.children!.length}
              expanded={expanded}
              selectedId={selectedId}
              selectedAncestors={selectedAncestors}
              focusedId={focusedId}
              identity={identity}
              metadata={metadata}
              panelWidth={panelWidth}
              onActivate={onActivate}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
