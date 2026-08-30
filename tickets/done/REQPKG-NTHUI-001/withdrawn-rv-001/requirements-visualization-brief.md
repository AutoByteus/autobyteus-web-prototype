# Requirements Visualization Brief

- Package / ticket ID: `nested-team-hierarchy-ui` / `REQPKG-NTHUI-001`
- Revision: `RV-001 — design hypothesis`
- Mode: Requirements Visualization
- Requirements / behavior / acceptance-criteria IDs: `BEH-001`–`BEH-005`; `REQ-001`–`REQ-012`; `AC-001`–`AC-008`; `DEC-001`–`DEC-003`
- Decision question: Which compact, non-color hierarchy grammar makes a root Agent Team and nested subteams easiest to trace while keeping role, name, status, recency, disclosure, and selection usable in the supported sidebar widths?
- User or stakeholder who must understand or decide: The user; Requirements Engineering owns recording the resulting decisions.
- Critical journey or interaction to visualize: Inspect the same expanded Workspace-history run, switch one decision lens and treatment at a time, stress it at narrow width/large type, expand/collapse structural teams, and select a concrete leaf.
- States that must be shown: Definition group; multiple runs; one expanded run; root coordinator/direct agent; three sibling configured subteams; one deeper nested subteam; transient task team; collapsed, one-expanded, several-expanded, deeper-expanded, and selected-leaf presets; active/idle/error/offline; long/truncated names; hover/focus/disclosure; 260/320/520px; Default/Extra Large.
- Alternatives or comparisons: `DEC-001` connector rails vs group surfaces vs compact hybrid; `DEC-002` always-visible metadata vs responsive priority vs on-demand child recency; `DEC-003` team icon/label vs header typography vs compact team band.
- Constraints: Identical fixture and interaction semantics across treatments; at least two non-color ancestry cues including a continuing cue; controls usable at 260px Extra Large; full role/name recoverable on pointer and keyboard; exact vs aggregate status semantics retained; transient identity retained.
- Non-goals: Final design choice, final prototype, production implementation, backend/data changes, definition editor, right panel, mobile/global navigation, full org chart, drag/drop, or global typography.
- Existing frontend / prototype repository context: Selected frontend at `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements/autobyteus-web` (`5cb39c6…` observed); accepted prototype base `550e8bd…`; isolated ticket visualizer under the Product worktree.
- Success signal: A reviewer can name a preferred treatment for each of `DEC-001`–`DEC-003`, explain why each visible leaf belongs to its immediate parent, and operate disclosure/selection/identity recovery at 260px Extra Large without mistaking status or age for the primary structure.
- Known unknowns: Whether rails, grouping, or hybrid feels clearest; what recency visibility is acceptable; which team-node emphasis is compact but unmistakable.

## Visualization Scope

- What the user should be able to see: One product-grounded Workspace-history panel, a concise decision-lens selector, treatment choices, a stable review-choice summary, and optional stress-test controls.
- What the user should be able to interact with: Switch treatments without changing fixture content; choose state/width/font; toggle teams independently; keyboard-navigate tree items; select concrete agents only; inspect full identity; open a simulated run-action menu; reset the fixture.
- What is mocked: History records, hierarchy, statuses, ages, action outcomes, quiet refresh, and selection/focus state are deterministic browser-only fixtures.
- What must not be implied as production behavior: No preferred treatment, approved requirement, persistence, backend contract, performance result, topology mutation, or completed action lifecycle.

## Review Questions

1. `DEC-001`: Which ancestry treatment stays easiest to trace with several sibling and deeper teams expanded: rails, group surfaces, or the hybrid?
2. `DEC-002`: At 260px Extra Large, should child age remain always visible, move to responsive/on-demand disclosure, or be available only on hover/focus while status remains visible?
3. `DEC-003`: Which non-color team treatment separates team, run, and agent roles without consuming too much vertical or horizontal space?
