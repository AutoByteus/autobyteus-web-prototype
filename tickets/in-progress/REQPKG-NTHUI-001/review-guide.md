# RV-002 Review Guide

## Why This Revision Exists

RV-001 was rejected because it recreated the hierarchy inside a standalone demo. RV-002 removes that app and places the comparison directly in the accepted AutoByteus `/workspace` experience. The surrounding shell, product panels, history grouping, run actions, and interaction language remain visible and usable.

## Review URL

`http://127.0.0.1:4193/workspace?prototypeReview=nested-team-hierarchy&hierarchy=hybrid&metadata=responsive&teamIdentity=header&panelWidth=320&fontSize=default&treeState=deep`

The floating control panel is clearly labeled review-only and stays outside the left history panel. Its initial selections are not recommendations.

## Decisions To Make

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

## Stress Checks

- Use all five `Tree state` values.
- Use `260` + `Extra Large` + `Selected deep leaf`; Tab/focus the truncated row.
- Toggle Product Design, Software Engineering, the deeper Design Systems team, and the dashed temporary task team by pointer and keyboard.
- Confirm the task/team run action remains at the right edge of its existing row.

## Requested Response

- `DEC-001`: Rails / Surfaces / Hybrid
- `DEC-002`: Full / Responsive / On focus, plus any exceptions
- `DEC-003`: Icon / Header / Band
- Optional: one focused refinement within the existing Workspace-history scope

No direction is treated as approved until the user states it explicitly.
