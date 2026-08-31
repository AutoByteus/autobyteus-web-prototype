# UI Behavior Test Matrix

| ID | Related IDs | Flow | Expected visible outcome | RV-011 |
| --- | --- | --- | --- | --- |
| `TR-AORG-001` | `REQ-001`, `AC-001` | Team create/edit | Agent-only controls; one checked direct Agent coordinator; no Team selector | Pass |
| `TR-AORG-002` | `REQ-002`, `REQ-003` | Org create/edit | Direct Agent and referenced Team members; no coordinator input or badge | Pass |
| `TR-AORG-003` | `REQ-004`, `REQ-019`, `AC-002` | Org detail → Run | Direct navigation to one Org configuration; no exact-entry modal or `entry` query | Pass |
| `TR-AORG-004` | `REQ-024`, `AC-019` | Org configuration | Root runtime/model/workspace/auto-approve controls plus Team/exact-Agent placement overrides | Pass |
| `TR-AORG-005` | `REQ-004`, `REQ-024`, `SCN-009` | Valid Org Run | Complete mounted scope activates with no initially focused Agent/Team | Pass |
| `TR-AORG-006` | `REQ-004`, `AC-002` | Direct Agent sidebar focus | Exact mounted Agent conversation becomes active | Pass |
| `TR-AORG-007` | `REQ-004`, `AC-002` | Direct Team sidebar focus | Team workspace becomes active through the Team's exact coordinator | Pass |
| `TR-AORG-008` | `REQ-006`, `REQ-019`–`REQ-023` | Org Handoff detail | Each card shows From, To, exact addresses, and ordered When only | Pass |
| `TR-AORG-009` | `REQ-020`, `REQ-021`, `AC-015`–`AC-017` | Add/edit Handoff | Eligible selectors, ordered When editor, Apply/Cancel, inline validation | Pass |
| `TR-AORG-010` | `REQ-020`, `REQ-021` | Delete/reorder | Handoffs and When guidance move/delete immediately in the definition draft | Pass |
| `TR-AORG-011` | `REQ-022`, `AC-017` | Invalid pair | Self-resolving and duplicate effective pairs are rejected | Pass |
| `TR-AORG-012` | `REQ-023`, `AC-018` | Remove referenced member | Affected Handoff becomes unavailable; atomic Save is blocked; no silent delete/retarget | Pass |
| `TR-AORG-013` | `REQ-019`, `AC-014` | Team-local Handoff edit | From and To offer direct Team Agents only | Pass |
| `TR-AORG-014` | `REQ-011`, `AC-007` | Standalone Team history | Standalone Team definition/history remains distinct from the active AgentOrg | Pass |
| `TR-AORG-015` | `REQ-016`, `AC-011` | Runtime root/task lineage | Org and standalone-Team roots are distinct; Task Agent/Task Team remain task-scoped execution rows | Pass |
| `TR-AORG-016` | `REQ-001`, `REQ-019` | Team member inspection | `View ↗` opens accepted Agent detail; Back restores the same Team | Pass |
| `SC-AORG-017` | Product feedback | AgentOrg density | No same-definition, no-coordinator, type/reuse, count, condition-count, or coordinator-delivery chrome | Pass |
| `SC-AORG-018` | Product feedback | AgentOrg data truthfulness | No AgentOrg Runs/Last run/aggregate summary display | Pass |
| `SC-AORG-019` | `REQ-019`, `REQ-024` | Narrow responsive | In-flow member chooser and Org configuration work at `390×844` without overlay/overflow | Pass |
| `SC-AORG-020` | All in-scope | Runtime safety | Full scripted journey has zero page or console errors | Pass |
| `SC-AORG-021` | `REQ-001`, accepted baseline | Team builder drag/drop | Agent rows are real drag sources; Canvas is a real drop target; drop adds/selects a member | Pass |
| `SC-AORG-022` | `REQ-001`, accepted baseline | Team builder click fallback | Click-to-add works for pointer/touch/keyboard-equivalent use without a Team library | Pass |
| `SC-AORG-023` | `REQ-001`, `REQ-023` | Selected Member Details | Member Name, Type, Source, Scope, and Coordinator are real fields; rename updates placement/handoff eligibility | Pass |
| `SC-AORG-024` | `REQ-001`, accepted baseline | Narrow Team builder | Three panels stack; click fallback/member editing remain usable; no document overflow | Pass |
| `SC-AORG-025` | User production-source fidelity feedback | Active Workspace hierarchy | Org, Team, Agent, Task Agent, and Task Team rows use continuous ancestor rails, L-shaped sibling branches, depth-aligned disclosures, and the accepted selected-row marker | Pass |

## Evidence

- Machine result: `browser-validation-rv-011.json`
- Capture manifest: `review-evidence/rv-011/capture-manifest.json`
- Static validation: `validation-rv-011/static-validation.txt`
- Result: `57/57` checks pass; `20` captures; `0` runtime errors; typecheck, lint, `12/12` tests, `13/13` boundaries, and build pass.

## Pending

Explicit user approval of RV-011. Review images remain non-normative until then.
