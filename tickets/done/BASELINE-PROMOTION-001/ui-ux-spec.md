# UI/UX Specification Supplement — Default Baseline Promotion

## Status And Authority

- Status: `Completed and promoted to the default prototype baseline`.
- Stable package: `BASELINE-PROMOTION-001`.
- User direction: promote the already approved completed-ticket candidates into the default prototype baseline.
- This supplement does not replace or revise the approved visual specifications in `AORG-FLAT-TEAM-001` or `REQPKG-NTHUI-001`; it specifies their default-entry activation.

## Experience Contract

1. **Agent Teams:** normal navigation to `/agent-teams?view=team-list` renders the approved flat Agent Team catalog and its create/detail/edit journeys. Navigation between those states does not add a review parameter.
2. **Agent Orgs:** `Agent Orgs` is a normal primary-navigation item. `/agent-orgs?view=org-list` renders the approved catalog. Its create/detail/edit and Team-reference navigation remain on clean product routes.
3. **Agent Team launch:** selecting Run opens `/workspace?root=team&team=<id>&phase=config`, using the accepted configuration-first surface. A successful synthetic launch changes only `phase=active` and never introduces review state.
4. **Agent Org launch:** selecting Run opens `/workspace?root=org&org=<id>&phase=config`. A successful synthetic launch changes only `phase=active`; focus continues to occur in the left Workspace hierarchy as previously approved.
5. **Workspace hierarchy:** normal `/workspace` rendering uses the approved `REQPKG-NTHUI-001` hierarchy treatment: printed rails, responsive metadata, structural filled Team identity, accessible tree semantics, and collapsed Team branches by default. Actual left-panel width determines the responsive metadata bucket.
6. **Historical evidence:** explicit historical review URLs may still select deterministic comparison controls or fixtures, but normal product navigation does not create or depend on them.
7. **Token Statistics:** `/settings?section=token-usage` remains unchanged and clean.

## Visible Design

No new visible styling, content, control, hierarchy, or interaction decision is introduced. The visible result must match the existing approved normative references:

- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/AORG-FLAT-TEAM-001/visual-references`
- `/home/autobyteus/workspace/autobyteus-web-prototype/tickets/done/REQPKG-NTHUI-001/visual-references`

Promotion evidence captured by this ticket demonstrates clean default entry; it does not supersede those approved references.

## Final Promotion References

| ID | Clean product state | Viewport | Stable file |
| --- | --- | --- | --- |
| `VIS-PROMOTE-001` | Selected Agent Team configuration reached from the normal Agent Team catalog | `1440 × 900` | `visual-references/VIS-PROMOTE-001-agent-team-config-clean-route-desktop-1440x900.png` |
| `VIS-PROMOTE-002` | Active Agent Org workspace with no initial focus | `1440 × 900` | `visual-references/VIS-PROMOTE-002-agent-org-active-clean-route-desktop-1440x900.png` |
| `VIS-PROMOTE-003` | Approved Workspace hierarchy on the normal Workspace route | `1440 × 900` | `visual-references/VIS-PROMOTE-003-workspace-hierarchy-clean-route-desktop-1440x900.png` |
| `VIS-PROMOTE-004` | Active standalone Agent Team with the standard Team history root | `1440 × 900` | `visual-references/VIS-PROMOTE-004-agent-team-active-clean-route-desktop-1440x900.png` |

The visible content in these screenshots remains governed by the approved `AORG-FLAT-TEAM-001` and `REQPKG-NTHUI-001` specifications. Their synthetic names, files, conversations, counts, and status values are illustrative fixtures; the clean-route activation and hierarchy treatment are normative.

## Validation Contract

- Start with a fresh browser context and use normal navigation.
- Assert the URL has no `prototypeReview` after every affected transition.
- Assert the approved Agent Team, Agent Org, configuration, runtime, and Workspace hierarchy landmarks are visible.
- Assert review-only controls do not appear on normal routes.
- Revalidate typecheck, lint, unit tests, boundary checks, build, and the already-promoted Token Statistics entry.

## Final Validation Evidence

- Default-entry browser validation: `11/11` checks passed with zero browser errors, including exact selected-Team identity and membership; `validation/default-entry/default-baseline-promotion-results.json`.
- Canonical post-integration browser validation: `11/11` checks passed with zero browser errors on `personal` revision `bdf071b8cc6819206f0c8768198edd50929b9011`; `validation/post-integration/default-baseline-promotion-results.json`.
- Static validation: `git diff --check`, typecheck, lint, `12/12` tests, `13/13` prototype-boundary checks, and build passed; `validation/static-validation.txt`.
- User confirmation: on `2026-09-01`, the user explicitly directed Product Prototyper to promote the affected completed tickets after the preview-only baseline defect was identified.

## Mock Boundaries

All definitions, workspaces, configurations, runs, hierarchy state, conversations, and persistence remain deterministic prototype-local simulations. No production service, credential, live data, production write, or production architecture is added.
