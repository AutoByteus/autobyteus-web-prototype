# UI Behavior Test Matrix

| ID | Related IDs | Flow | Expected visible outcome | RV-007 |
| --- | --- | --- | --- | --- |
| `TR-AORG-001` | `REQ-001`, `AC-001` | Team create/edit | Agent-only controls; one checked coordinator; no Team selector | Pass |
| `TR-AORG-002` | `REQ-002`, `REQ-003` | Org create/edit | Separate Agent and Team controls; no coordinator input or explanatory badge | Pass |
| `TR-AORG-003` | `REQ-004`, `AC-002` | Org launch | Start disabled until an exact Agent/Team entry; Team selection names coordinator | Pass |
| `TR-AORG-004` | `REQ-006`, `REQ-019`–`REQ-023` | Org Handoff detail | Each card shows From, To, exact addresses, and ordered When only | Pass |
| `TR-AORG-005` | `REQ-020`, `REQ-021`, `AC-015`–`AC-017` | Add/edit Handoff | Eligible selectors, ordered When editor, Apply/Cancel, inline validation | Pass |
| `TR-AORG-006` | `REQ-020`, `REQ-021` | Delete/reorder | Handoffs and When guidance move/delete immediately in the definition draft | Pass |
| `TR-AORG-007` | `REQ-022`, `AC-017` | Invalid pair | Self-resolving pair is rejected; duplicate pairs are handled on existing Handoff | Pass |
| `TR-AORG-008` | `REQ-023`, `AC-018` | Remove referenced member | Affected Handoff becomes unavailable; atomic Save is blocked; no silent delete/retarget | Pass |
| `TR-AORG-009` | `REQ-019`, `AC-014` | Team-local Handoff edit | From and To offer direct Team Agents only | Pass |
| `TR-AORG-010` | `REQ-011`, `AC-007` | Standalone Team history | Standalone Team run and coordinator lifecycle remain distinct | Pass |
| `TR-AORG-011` | `REQ-016`, `AC-011` | Runtime root/task lineage | Org/Team roots are typed; Task Agent/Task Team remain temporary execution rows | Pass |
| `TR-AORG-012` | `REQ-001`, `REQ-019` | Team member inspection | `View ↗` opens accepted Agent detail; Back restores the same future Team | Pass |
| `SC-AORG-013` | Product feedback | AgentOrg density | No same-definition, no-coordinator, type/reuse, count, condition-count, or coordinator-delivery chrome | Pass |
| `SC-AORG-014` | Product feedback | AgentOrg data truthfulness | No AgentOrg Runs/Last run/aggregate summary display | Pass |
| `SC-AORG-015` | `REQ-019`, `AC-014` | Desktop/narrow | 1440×900 and 390×844 remain usable without document overflow | Pass |
| `SC-AORG-016` | All in-scope | Runtime safety | Full scripted journey has zero page or console errors | Pass |

## Evidence

- Machine result: `browser-validation-rv-007.json`
- Capture manifest: `review-evidence/rv-007/capture-manifest.json`
- Result: `44/44` checks pass; `15` captures; `0` runtime errors.

## Pending

Explicit user approval of RV-007. Review images remain non-normative until then.
