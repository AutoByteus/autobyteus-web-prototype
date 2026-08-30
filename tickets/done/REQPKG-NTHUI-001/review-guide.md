# Approved Workspace Nested-Team Hierarchy

## Approved Product Route

`http://127.0.0.1:4193/workspace?prototypeReview=nested-team-hierarchy&reviewView=proposal&hierarchy=rails&metadata=responsive&teamIdentity=icon&panelWidth=320&fontSize=default&treeState=collapsed`

The route shows only the proposed product experience. It contains no comparison panel, recommendation copy, help overlay, or review controls.

## Approved Decisions

- **DEC-001 — Printed file-tree rails:** continuous ancestor rails, right-only branch elbows, correct last-sibling termination, and no nested-team cards.
- **DEC-002 — Responsive metadata:** age yields at 260/320px and reveals on hover/focus; remains continuous at 520px; hierarchy/name stay primary.
- **DEC-003 — Filled User group symbol:** unboxed 16px filled symbol plus semibold configured-team name; circular agent avatars and separate transient bolt/dashed identity remain.
- **Default:** nested teams collapsed.
- **Selection:** `#eef2ff` orthogonal row with straight 2px `#6366f1` inset left accent.

## Final States

- Default: `treeState=collapsed`
- One team expanded: `treeState=one`
- Several siblings: `treeState=several`
- Deeper configured/transient teams: `treeState=deep`
- Selected deep leaf and ancestor reveal: `treeState=selected`
- Width/font evidence: 260px + Extra Large, 320px + Default, 520px + Default

## Approval Record

On 2026-08-30 the user stated they were satisfied with and approved the current hierarchy UI, font, color, and symbol. The user explicitly preferred the filled User group symbol over the outline trial.

## Authoritative Package

- UI/UX specification: `ui-ux-spec.md`
- User decision record: `user-decision-record.md`
- Final visual references: `visual-references/`
- Browser validation: `browser-validation-rv-006.json` (24/24)
- Approved UI implementation: `801b571093a3388eb21efea17515529ff9b89f51`

Historical comparison and rejected icon evidence remains under `review-evidence/` but is not normative.
