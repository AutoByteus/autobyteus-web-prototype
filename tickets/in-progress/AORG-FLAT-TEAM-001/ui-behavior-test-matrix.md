# UI Behavior Test Matrix

| Transition / Scenario ID | Related IDs | Flow | Trigger | Expected visible outcome | RV-003 result |
| --- | --- | --- | --- | --- | --- |
| `TR-AORG-001` | REQ-001, AC-001 | Team authoring | Open create | Agent-only controls; one checked coordinator; no Add Team | Pass |
| `TR-AORG-002` | REQ-018, AC-013 | Team reuse | Open Team/Org detail | Referenced Team states same definition and preserved history | Pass |
| `TR-AORG-003` | REQ-002, AC-001 | Org authoring | Open create | Separate Agent and Team controls; no coordinator inputs | Pass |
| `TR-AORG-004` | REQ-004, AC-002 | Org launch | Open modal | Start disabled with no entry; no default recipient copy | Pass |
| `TR-AORG-005` | REQ-004, AC-002 | Team entry | Select Team radio | Team coordinator named; Start enabled | Pass |
| `TR-AORG-006` | REQ-011, AC-007 | Standalone Team | Select Team root | Standalone Team run and coordinator-led lifecycle | Pass |
| `TR-AORG-007` | REQ-016, AC-011 | Root history | Select Org root | Org badge, exact entry, configured Team placements | Pass |
| `TR-AORG-008` | REQ-016, AC-011 | Task Agent lineage | Inspect owning Team | Temporary Task Agent is nested beneath its logical Agent | Pass |
| `TR-AORG-009` | REQ-016, AC-011 | Task Team lineage | Expand Task Team | Child AgentRun appears without becoming definition membership | Pass |
| `TR-AORG-010` | REQ-016, AC-011 | Task child focus | Select child | URL focus and selected-execution panel identify temporary AgentRun | Pass |
| `SC-AORG-011` | REQ-019, AC-014 | Narrow Org detail | 390×844 | No document-level horizontal overflow | Pass |
| `SC-AORG-012` | REQ-019, AC-014 | Runtime safety | Complete scripted journey | Zero page or console errors | Pass |
| `SC-AORG-013` | REQ-001, REQ-019 | Baseline-native Team catalog | Compare accepted baseline; use search and Reload | Baseline toolbar/group/card language preserved; redundant type/reuse/title copy absent; Reload gives immediate feedback; search filters | Pass |

## Evidence

- Machine result: `browser-validation-rv-003.json`
- Capture manifest: `review-evidence/rv-003/capture-manifest.json`
- Result: `22/22` checks pass; `8` captures; `0` runtime errors.

## Unresolved Behavior

| ID | Pending decision | Prototype boundary |
| --- | --- | --- |
| `REQ-019` / `AC-014` | Explicit user approval of the proposed visual/interaction model | Review images remain non-normative until approval |
