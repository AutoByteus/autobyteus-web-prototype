# UI Behavior Test Matrix

| Transition / Scenario ID | Related Requirement / AC IDs | Screen / Flow | Trigger | From State | To State | Expected Visible Feedback | Service Scenario | Result / Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TR-NTH-001 | REQ-001–004; AC-001, AC-002 | Workspace history | Select Rails/Surfaces/Hybrid | Deep tree, same fixture | Alternate ancestry treatment | Only rails/surfaces change; rows and product shell remain identical | `workspace_team_hierarchy_review` | Pass: `NTH-RV2-006-*`, `007` |
| TR-NTH-002 | REQ-006, REQ-008; AC-004, AC-005 | Review metadata | Select Full/Responsive/On focus | Same tree | Density treatment changes | Status/age become continuous, responsive, or focus-revealed | Local query state | Pass: `NTH-RV2-015`, `016` |
| TR-NTH-003 | REQ-003, REQ-009, REQ-011; AC-006, AC-007 | Team identity | Select Icon/Header/Band | Same tree | Identity treatment changes | Team shape/typography/role placement changes; agent circle remains | Local query state | Pass: accessible labels and captures |
| TR-NTH-004 | REQ-002, REQ-010; AC-003 | Structural team disclosure | Click structural team row | Expanded | Collapsed | Only intended subtree hides; selection and sibling state remain | Component-local expansion | Pass: `NTH-RV2-010` |
| TR-NTH-005 | REQ-010, REQ-011; AC-003, AC-007 | Structural team disclosure | Focus row; Enter | Collapsed | Expanded | Same subtree reappears; `aria-expanded` changes | Component-local expansion | Pass: `NTH-RV2-011` |
| TR-NTH-006 | REQ-002, REQ-005, REQ-010; AC-002 | Selected ancestor reveal | Select `Selected deep leaf` | Deep tree | Accessibility leaf selected | Product Design and Design Systems ancestors reveal; selected styling remains distinct | Synthetic team focus | Pass: `NTH-RV2-008` |
| TR-NTH-007 | REQ-006, REQ-007, REQ-012; AC-004 | Long identity recovery | Hover/focus long row at 260px XL | Truncated | Tooltip/accessible label available | Full role, name, level, status, and address recoverable | None | Pass: `NTH-RV2-012`, `015` |
| TR-NTH-008 | REQ-010; AC-008 | Quiet refresh | Wait >5 seconds | Several subtrees expanded | Same expansion | No disclosure reset | Scripted no-op refresh | Pass: `NTH-RV2-014` |

## Scenario Catalog

| Scenario ID | Purpose | Inputs / Setup | Mocked Boundary Behavior | Expected Product Outcome | Selection Method |
| --- | --- | --- | --- | --- | --- |
| PS-NTH-001 | Complete decision fixture | 1 Workspace; 1 definition group; 2 runs; 17 visible deep rows; 3 sibling teams; deeper team; transient task team; mixed states; long names | All data is synthetic and in-memory | Identical content across alternatives | Review URL applies `workspace_team_hierarchy_review` |
| PS-NTH-002 | Subteams collapsed | `treeState=collapsed` | Local expansion only | 5 root-level rows remain | Tree-state selector |
| PS-NTH-003 | One team expanded | `treeState=one` | Local expansion only | Product Design descendants appear | Tree-state selector |
| PS-NTH-004 | Siblings expanded | `treeState=several` | Local expansion only | Three sibling subtrees remain distinct | Tree-state selector |
| PS-NTH-005 | Deeper and transient expanded | `treeState=deep` | Local expansion only | 17 execution rows visible | Tree-state selector |
| PS-NTH-006 | Deep selected leaf | `treeState=selected` | Synthetic team focus patch | Deep accessibility member is selected and revealed | Tree-state selector |

## Unresolved Behavior

| Requirement / Decision ID | Missing Or Ambiguous Behavior | Prototype Limitation | Required Product Decision |
| --- | --- | --- | --- |
| DEC-001 | No ancestry grammar is approved | Three alternatives intentionally remain selectable | Choose Rails, Surfaces, or Hybrid |
| DEC-002 | Continuous narrow-width metadata amount is not approved | All three density options are simulated client-side | Choose Full, Responsive, or On focus and specify any exceptions |
| DEC-003 | Team emphasis level is not approved | Three identity options share one synthetic fixture | Choose Icon, Header, or Band and note desired refinements |
