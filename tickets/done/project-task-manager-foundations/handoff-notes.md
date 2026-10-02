# Product-to-Solution refinement notes

## Authority
PROJ-TASK-MANAGER-20261002-001 / last received requirements SR-002 Draft. UF-017 on 2026-10-02: “the ui is good now. now i confirm the ui is good. continue”. This releases the user-imposed Product-first handoff gate (UF-004). UI approval is for the represented Projects/Tasks authoring/board/detail slice, **not** full requirements or implementation authorization.

Exact UI: 84ed47bac6877e2cdc6350cca789b0c30ffb55a3; source parity authority e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71, not investigation pin e04cfef23550c3b78286a53befc6bd5d71fb1061. Accepted base df2f5cdaf9b168298dcae79ac47c11f31dd82d7c. Canonical prototype /Users/normy/autobyteus_org/autobyteus-web-prototype; final repository receipt in prototype-ticket.md.

## Clarified UI decisions to reconcile into canonical requirements
| Finding | Direction confirmed by final UI approval | Canonical context |
|---|---|---|
| PFI-001 | Dedicated New/Edit Project pages; preserve shell, normal routes/back/cancel | REQ-007/009, AC-013, SCN-002/006, DEC-006 |
| PFI-002 | Optional multiple workspaces during creation, individual optional descriptions; same direct form later, Existing/New choices, no counts/extra edit stage | REQ-007/009, SCN-002/006 |
| PFI-003 | Brief inline non-actionable creation/save success clears after 3 seconds; errors do not | REQ-007, authoring ACs |
| PFI-004 | Dedicated New/Edit/Detail Task pages; Create returns to same Project all-Tasks board and clears prior search | REQ-007/009, AC-012 UI portion, DEC-006 |
| PFI-005 | Board only, 3 statuses, each a continuous lane with adjacent divided task rows; no List toggle or extra filters/widgets | REQ-007/009, DEC-006 presentation only |
| PFI-006 | Detail description once, read-only status, Edit/Delete adjacent; no Task ID/date/info disclosure; explicit inline deletion safeguard | REQ-007/009, DEC-006/009 |
| PFI-007 | Task input follows agent pattern: editable voice-to-text + context attachments/list/inline image preview | REQ-007, potential supplemental authoring/file requirements |

Do not duplicate the UI specification into a competing requirements doc. Link its exact accepted revision and normative screenshots as external Product-owned supplement. Earlier List/Board/metadata/Workspace-summary screenshots are rejected alternatives, not optional features. Simplicity is explicit user direction, not license to add manager dashboards/badges.

## Still unresolved; request explicit decisions, then full requirements approval
- DEC-001 off policy for new tools; user installation remains default-off untouched.
- DEC-002/005 status ownership/transitions and Done acceptance/evidence. Board is read-only; do not infer worker report or idle means Done.
- DEC-003 dependencies and representation/enforcement; DEC-008 safe parallel shared-repository work. No scheduler/isolation design selected here.
- DEC-004 exact Task-to-execution/attempt linkage, failed/uncertain dispatch/retry. Existing discovery/fresh delegation semantics preserved; no new tool implemented.
- DEC-006 waiting/blocked/failed/review/result interpretation remains open despite approved basic 3-column/authoring layout.
- DEC-007 Manager entry/conversation, explicit Project/workspace context, reuse/restart/execution navigation remain open. Original Manager-tab vs chat alternatives were never implemented/approved.
- DEC-009 active-work edit/delete/cancel/retention policy remains open. Existing Project confirmation's open-task count is not total once Done exists; AC-009 needs truthful all-Task deletion copy. Prototype retains legacy count behavior; do not treat it as accepted final policy.
- DEC-010 public Manager/optional Team delivery and REQ-010 native/MCP parity remain unapproved.
- Voice implementation/consent/privacy/permission/availability, real attachment storage/security/limits/access/retention and raw recorded audio require requirements. Audio was represented as editable transcription; raw recording retention/file-only Task creation were not approved.
- New folder UI source choice is approved; whether path means existing folder registration vs creation and corresponding validation/permissions still needs domain clarification. No filesystem action in prototype.
- Narrow view is inspected, not a phone release promise. No global overlay ban.

## Evidence and outcome boundaries
ui-ux-spec.md + VIS-001–020 are the approved UI contract. final-browser-validation.json/matrix describe observed local outcomes. New Project/Task mock modules total 6,038 bytes, handwritten, session-only; no persistence/agent writes/mic/upload. DATA-001 assessment found representative controlled synthetic snapshot provenance, not production records; internal source-store coupling concern remains held, not a failed visual parity verdict.

Next action: reconcile canonical requirements/AC/scenarios and external UI supplement, distinguish resolved presentation from remaining Manager/orchestration decisions, obtain explicit approval of the complete refined requirements package before architecture/implementation. Product does not authorize production engineering. Prototype repository completion receipt and final paths follow in prototype-ticket.md.
