# Requirement Impact — UF-001: Non-overlay Projects workflows

Package: `PROJ-TASK-MANAGER-20261002-001` / Solution `SR-001`; Product ticket `project-task-manager-foundations`. Outcome: **Requirement Impact**, not Prototype Completed. Date: 2026-10-02.

## Evidence and decision boundary
The user inspected the running existing prototype and supplied screenshots of Edit project and New project modals. They explicitly asked “Then do not use overlay?” and asked for better alternatives, motivated by possible future phone use. Full verbatim feedback, alternative tradeoffs and scope limits are recorded as UF-001 in `ui-brainstorm-record.md`.

Record the explicit avoidance direction for primary Projects forms in the canonical draft. The user has not approved a final page layout, routes, mobile support scope, or an application-wide ban on every modal. Product recommends dedicated content pages for create/edit and task detail, with inline editing as a small-field alternative; these proposals still need user review. Do not mistake this evidence for final requirements or UI/UX approval.

## Affected intent
- REQ-007: primary Projects authoring/detail presentation should be non-overlay; manager entry remains open DEC-007.
- REQ-009: preserve manual authoring and data behavior, while recording the user's intentional presentation change away from current create/edit dialogs.
- SCN-002,005,006; DEC-006,007; all other decisions remain unresolved.
- DEC-009 deletion/active-run policy is not settled. Non-overlay UI must preserve explicit confirmation safeguards rather than silently remove them.
- Potential future phone experience motivates the direction, but a shipped phone support requirement is not authorized by this question.

## Source and Product ownership
- Canonical prototype root: `/Users/normy/autobyteus_org/autobyteus-web-prototype`.
- Active Product worktree: `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations`.
- Branch: `prototype/project-task-manager-foundations`.
- Accepted cumulative prototype base: `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`.
- Prototype source pin: `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`; handoff source pin: `e04cfef23550c3b78286a53befc6bd5d71fb1061`. No new Projects parity acceptance at the newer pin.
- UI source remains unchanged from cumulative accepted base. No production, architecture, installation setting or user data writes.
- Existing prototype review URL: `http://127.0.0.1:3286/projects/project-prototype-launch`; ticket-owned Nuxt PID 51024 remains live for requested inspection.
- Integration/promotion Pending, no approved candidate. Worktree/runtime retained; no cleanup or remote push. Ticket is unfinished.

## Absolute artifacts
- `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/prototype-ticket.md`
- `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/ui-brainstorm-record.md`
- `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/requirement-impact.md`
- `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/review-evidence/user-edit-project-overlay.png`
- `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/review-evidence/user-new-project-overlay.png`

Canonical Solution inputs remain read-only at `/Users/normy/autobyteus_org/autobyteus-worktrees/project-task-manager-foundations/tickets/in-progress/project-task-manager-foundations/`.

## Next action
Solution Designer incorporates this constrained preference into the draft intent and returns revised requirements context for continued Product review. No implementation handoff; no prototype completion claim. Product should continue discussing alternatives directly with the user rather than infer final approval.
