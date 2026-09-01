# Default Baseline Promotion Audit

## Audit Result

| Completed package | Approved candidate entry | Default-entry state at accepted base `79093e9` | Promotion action |
| --- | --- | --- | --- |
| `AORG-FLAT-TEAM-001` | Agent Team, Agent Org, and shared Workspace routes carrying `prototypeReview=agent-org-flat` | **Not promoted.** Agent Org rendered at a clean initial URL, but internal navigation reintroduced the review flag; Agent Team selected the approved experience only in review mode; clean Org runtime state also depended on the flag. | Promote the accepted components and runtime transitions to normal clean routes. |
| `REQPKG-NTHUI-001` | `/workspace?prototypeReview=nested-team-hierarchy&…` | **Not promoted.** The approved rails, responsive metadata, team identity, tree semantics, and collapsed defaults were activated only by the review query. | Make the approved treatment the normal Workspace behavior while keeping review controls fixture-only. |
| `REQPKG-TSUI-001` | `/settings?section=token-usage` | **Already promoted.** The approved entry is already the normal clean product route. | Regression validation only. |
| `initial-prototype-baseline` | Normal application routes | Not applicable: accepted current-experience base, not a future-state preview candidate. | No change. |

## Defect Boundary

The accepted visual and interaction designs are unchanged. The defect is candidate activation and navigation: merge/integration occurred, but approved candidates were not made reachable through the normal/default entry points without preview-only state.
