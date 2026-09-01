# Focused Review Guide — Mounted Team Status

## Review Scope

Review only the aggregate status dot added to each direct configured Team row inside the AgentOrg execution hierarchy. All other RV-012 behavior and presentation remain approved and unchanged.

## Required States

1. Active and expanded: every Team row has one aggregate dot and every Agent retains its exact dot.
2. Active and collapsed: Team dots remain visible after descendants are hidden.
3. Stopped/historical: Team dots reflect terminal descendant projections without stale live activity.

## Review Questions

- Is the Team dot in the correct original status position without adding clutter?
- Is the Team signal understandable through its tooltip/accessibility label as well as color?
- Do collapsed and historical states remain truthful without implying Team-level lifecycle ownership?

## Runnable Review URLs

- Active / expanded: `http://127.0.0.1:4197/workspace?root=org&org=software-development-department&phase=active&prototypeReview=aorg-team-status&statusState=active`
- Active / collapsed: `http://127.0.0.1:4197/workspace?root=org&org=software-development-department&phase=active&prototypeReview=aorg-team-status&statusState=collapsed`
- Stopped / historical: `http://127.0.0.1:4197/workspace?root=org&org=software-development-department&phase=active&prototypeReview=aorg-team-status&statusState=historical`

The ticket-owned review server on port `4197` was stopped after approval and final validation. The promoted clean/default experience was post-integration validated on the separate canonical baseline server at `http://127.0.0.1:4194/workspace?root=org&org=software-development-department&phase=active`.

## Review Evidence

- Browser result: `review-evidence/rv-001/browser-validation.json` (`8/8`, zero browser errors)
- Active / expanded capture: `review-evidence/rv-001/RV-001-mounted-team-status-active-expanded-1440x900.png`
- Active / collapsed capture: `review-evidence/rv-001/RV-002-mounted-team-status-active-collapsed-1440x900.png`
- Stopped / historical capture: `review-evidence/rv-001/RV-003-mounted-team-status-stopped-historical-1440x900.png`
- Static validation: `validation/static-validation.txt`

These `RV-*` images are pre-approval review evidence, not normative final references. Normative `VIS-*` images are created only after explicit approval.
