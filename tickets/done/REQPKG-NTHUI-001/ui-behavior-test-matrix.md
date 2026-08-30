# UI Behavior Test Matrix — Approved Hierarchy

| Transition / Scenario ID | Related IDs | Trigger | From → To | Expected Visible Outcome | Result / Evidence |
| --- | --- | --- | --- | --- | --- |
| `TR-NTH-001` | `REQ-001`–`REQ-004`; `AC-001`, `AC-002` | Render approved route | Active run → compact execution tree | Printed rails connect five default root rows; configured teams use filled group icon; no cards/review UI | Pass: `NTH-RV6-017`, `018`, `020`; `VIS-001` |
| `TR-NTH-002` | `REQ-006`, `REQ-008`; `AC-004`, `AC-005` | Render 260/320/520 and Default/Extra Large | Width/font presets | No horizontal overflow; age yields at 260/320 and remains visible at 520 | Pass: `NTH-RV6-015`, `016`; `VIS-004`, `VIS-005` |
| `TR-NTH-003` | `REQ-003`, `REQ-009`; `AC-006` | Render configured and transient nodes | Same tree | Filled group icon/semibold name vs circular agent avatar vs transient dashed bolt marker | Pass: `NTH-RV6-020`; `VIS-003`, `VIS-005` |
| `TR-NTH-004` | `REQ-002`, `REQ-010`; `AC-003` | Click structural team row | Expanded → collapsed | Only intended subtree hides; sibling and selection state remain valid | Pass: `NTH-RV6-010` |
| `TR-NTH-005` | `REQ-010`, `REQ-011`; `AC-003`, `AC-007` | Focus row; press Enter/Space | Collapsed → expanded | Same subtree reappears; `aria-expanded` changes | Pass: `NTH-RV6-011`, `013` |
| `TR-NTH-006` | `REQ-002`, `REQ-005`, `REQ-010`; `AC-002` | Select deep leaf | Ancestors hidden → revealed | Exactly one leaf selected; ancestor path reveals; orthogonal 2px treatment appears | Pass: `NTH-RV6-008`, `019`; `VIS-003` |
| `TR-NTH-007` | `REQ-006`, `REQ-007`, `REQ-011`, `REQ-012`; `AC-004`, `AC-007` | Hover/focus long row at 260px Extra Large | Truncated → identity revealed | Complete role/name/address/status available; focus tooltip stacks above later rows | Pass: `NTH-RV6-012`, `015`, `016`, `022`; `VIS-004` |
| `TR-NTH-008` | `REQ-010`; `AC-008` | Wait >5 seconds | Subtrees expanded → unchanged | Quiet refresh does not reset local expansion | Pass: `NTH-RV6-014` |

## Scenario Catalog

| Scenario ID | Purpose | Setup | Expected Product Outcome | Final Reference |
| --- | --- | --- | --- | --- |
| `PS-NTH-001` | Default scan | Active run; subteams collapsed | Five root rows; hierarchy/team identity immediate | `VIS-001` |
| `PS-NTH-002` | One expanded team | `treeState=one` | Product Design descendants attached to team | `VIS-002` |
| `PS-NTH-003` | Several siblings | `treeState=several` | Sibling memberships remain distinct | Browser evidence |
| `PS-NTH-004` | Deep configured/transient tree | `treeState=deep` | Seventeen rows with correct rail termination and node identity | `VIS-005` |
| `PS-NTH-005` | Selected deep leaf | `treeState=selected` | Selected leaf and ancestor path visible | `VIS-003` |
| `PS-NTH-006` | Narrow focus recovery | 260px + Extra Large + selected tree; focus long row | Controls usable; complete identity recoverable | `VIS-004` |

## Decision Resolution

| Decision ID | Approved Outcome | Authority |
| --- | --- | --- |
| `DEC-001` | Printed file-tree rails with non-crossing junctions and last-sibling termination | User approval, 2026-08-30 |
| `DEC-002` | Responsive metadata with narrow hover/focus recovery and continuous wide age | User approval, 2026-08-30 |
| `DEC-003` | Unboxed filled User group symbol for configured teams | User approval, 2026-08-30 |
