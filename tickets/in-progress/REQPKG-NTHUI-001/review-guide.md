# RV-005 Clean File-Tree Candidate Review Guide

## What To Review First

RV-005 shows only the directly updated accepted AutoByteus `/workspace` experience. The hierarchy now follows the printed file-tree grammar requested in user feedback: thin continuous ancestor rails and one-direction `├─`/`└─` elbows. There is no floating review card, recommendation copy, comparison control, or helper overlay.

## Review URL

`http://127.0.0.1:4193/workspace?prototypeReview=nested-team-hierarchy&reviewView=proposal&hierarchy=rails&metadata=responsive&teamIdentity=icon&panelWidth=320&fontSize=default&treeState=collapsed`

Everything visible on this route belongs to the product experience being evaluated. The synthetic data is a prototype fixture, but no review-only UI is displayed.

## Product Recommendation

- **DEC-001 · File-tree rails:** continuous ancestor rails and terminating elbows express the hierarchy without row cards. Horizontal branches begin at the vertical rail and extend only toward the node; they never cross it.
- **DEC-002 · Responsive metadata:** status remains available while member age is revealed on hover/keyboard focus at 260/320px and remains continuous at 520px.
- **DEC-003 · Structural team icon:** square organization icons and stronger team-row weight distinguish teams from circular agent avatars without repeated uppercase role headers.
- **Default state:** nested teams collapsed. A selected deep leaf reveals only its ancestor path.
- **Selection:** orthogonal pale-blue row with a straight 2px indigo left accent; no rounded card border or heavy stripe.

## Superseded Alternative Evidence

1. **DEC-001 · Ancestry**
   - **Rails:** most compact; continuous connector lines carry ancestry; team nodes get structure icons and weight but minimal containment.
   - **Surfaces:** strongest containment; nested teams read as compact group headers with descendant surface continuity; fewer connector lines.
   - **Hybrid:** connector continuity plus restrained team header surfaces; highest cue redundancy and moderate density.
2. **DEC-002 · Metadata**
   - **Full:** status and age continuously visible on every row.
   - **Responsive:** age reduces first at 260px/Extra Large; deepest status can reveal on focus at 260px.
   - **On focus:** row status/age leave the continuous scan and reveal on hover/focus; accessible labels remain complete.
3. **DEC-003 · Team identity**
   - **Icon:** square organization icon versus circular agent avatar; most compact.
   - **Header:** icon plus an explicit two-line `Agent team` role/name hierarchy.
   - **Band:** icon plus inline role and stronger band edge; most visually emphatic.

## Optional Product Checks

- Use all five `Tree state` values.
- Use `260` + `Extra Large` + `Selected deep leaf`; Tab/focus the truncated row.
- Toggle Product Design, Software Engineering, the deeper Design Systems team, and the dashed temporary task team by pointer and keyboard.
- Confirm the task/team run action remains at the right edge of its existing row.

## Requested Response

- Approve the clean final-candidate UI; or
- Reject it with one focused refinement; or
- Ask Product Design to reopen a specific alternative outside this clean route.
- Optional: one focused refinement within the existing Workspace-history scope

No direction is treated as approved until the user states it explicitly.
