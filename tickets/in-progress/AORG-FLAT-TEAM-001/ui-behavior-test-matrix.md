# UI Behavior Test Matrix

| Transition / Scenario ID | Related IDs | Flow | Trigger | Expected visible outcome | RV-006 result |
| --- | --- | --- | --- | --- | --- |
| `TR-AORG-001` | REQ-001, AC-001 | Team authoring | Open create | Agent-only controls; one checked coordinator; no Add Team | Pass |
| `TR-AORG-002` | REQ-018, AC-013 | Team reuse | Open Team/Org detail | Referenced Team states same definition and preserved history | Pass |
| `TR-AORG-003` | REQ-002, AC-001 | Org authoring | Open create | Separate Agent and Team controls; no coordinator inputs | Pass |
| `TR-AORG-004` | REQ-004, AC-002 | Org launch | Open modal | Start disabled with no entry; concise exact-entry instruction | Pass |
| `TR-AORG-005` | REQ-004, AC-002 | Team entry | Select Team radio | Team coordinator named; Start enabled | Pass |
| `TR-AORG-006` | REQ-011, AC-007 | Standalone Team | Select Team root | Standalone Team run and coordinator-led lifecycle | Pass |
| `TR-AORG-007` | REQ-016, AC-011 | Root history | Select Org root | Org badge, exact entry, configured Team placements | Pass |
| `TR-AORG-008` | REQ-016, AC-011 | Task Agent lineage | Inspect owning Team | Temporary Task Agent is nested beneath its logical Agent | Pass |
| `TR-AORG-009` | REQ-016, AC-011 | Task Team lineage | Expand Task Team | Child AgentRun appears without becoming definition membership | Pass |
| `TR-AORG-010` | REQ-016, AC-011 | Task child focus | Select child | URL focus and selected-execution panel identify temporary AgentRun | Pass |
| `TR-AORG-011` | REQ-001, REQ-019 | Preserved Team-member inspection | Choose member `View ↗`, then Back to team | Accepted Agent detail opens with the selected member; Instructions remain visible; Back restores the same future-state Team detail context | Pass |
| `SC-AORG-011` | REQ-019, AC-014 | Narrow Org detail | 390×844 | No document-level horizontal overflow | Pass |
| `SC-AORG-012` | REQ-019, AC-014 | Runtime safety | Complete scripted journey | Zero page or console errors | Pass |
| `SC-AORG-013` | REQ-001, REQ-019 | Baseline-native Team catalog | Compare accepted baseline; use search and Reload | Baseline toolbar/group/card language preserved; redundant type/reuse/title copy absent; Reload gives immediate feedback; search filters | Pass |
| `SC-AORG-014` | REQ-001, REQ-018, AC-001, AC-013 | Baseline-native Team authoring/detail | Open create and detail | Baseline Basics/library/canvas/member-details, Description, Instructions, member Agent-detail actions, and neutral detail cards preserved; library exposes Agents only; Team detail contains no Org promotion | Pass |
| `SC-AORG-015` | REQ-001, REQ-019 | Narrow Team detail | 390×844 | No document-level horizontal overflow; Instructions and both member-detail actions remain available | Pass |
| `SC-AORG-016` | REQ-002–REQ-004, REQ-019, AC-001, AC-002, AC-014 | Baseline-native AgentOrg experience | Open catalog, search, Reload, create, detail, and launch | Baseline toolbar/card language and blue actions; direct Agent/Team identity; no repeated page/type/composition/coordinator chrome; exact selection remains required | Pass |
| `SC-AORG-017` | REQ-019, AC-014 | Narrow AgentOrg catalog | 390×844 | Both cards and Create Agent Org remain available with no document-level horizontal overflow | Pass |

## Evidence

- Machine result: `browser-validation-rv-006.json`
- Capture manifest: `review-evidence/rv-006/capture-manifest.json`
- Result: `30/30` checks pass; `11` captures; `0` runtime errors.

## Unresolved Behavior

| ID | Pending decision | Prototype boundary |
| --- | --- | --- |
| `REQ-019` / `AC-014` | Explicit user approval of the proposed visual/interaction model | Review images remain non-normative until approval |
