# UI/UX Specification — Native Workspace Folder Selection

## Status And User Confirmation
- **Approved UI/UX**, 2026-10-07; package `restore-native-workspace-folder-picker`.
- Approval **UCONF-001**, [verbatim confirmation and context](user-confirmation.md): “Hey, I think this UI is good. The, yeah, the, I just got that confirmed.”
- Approved after clarification that **Browse** opens the computer's native **folder-selection dialog in the local Electron desktop app**, not a remote/browser filesystem. Choosing fills the field; **Use folder** applies.
- Related canonical requirements: R2 Draft / SR-004, REQ-001..004, BEH-001..004, SCN-001..005, UC-001..003, AC-001..007, DEC-001. This approved UI supplement does not independently approve canonical requirements or production architecture.
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design`; normal review entry `/chat` (reviewed at http://127.0.0.1:4581/chat).
- Final validation: 2026-10-07, [results and limits](final-validation.md).

## Repository And Baseline Provenance
- Selected frontend: `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web`, **read-only source pin `88fad73cbd20201642acdcfe75e69b1897ec135c`**.
- Separate canonical design repository `/Users/normy/autobyteus_org/autobyteus-web-design`; remote `https://github.com/AutoByteus/autobyteus-web-prototype.git`; default `personal`.
- Approved UI code revision **`a677e01558b2b9d48253950bc2b8db821358625a`**. No post-approval UI source delta. Accepted design base `8cd41f886459630909e827d7df1b67910618aaac`.
- Ticket branch `design/restore-native-workspace-folder-picker`; authoring worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker`; durable completed ticket `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/restore-native-workspace-folder-picker`.
- Applicable baseline report `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` plus subsequent accepted changes in the base. [Scoped re-evaluation](baseline-reevaluation.md) establishes reuse, not a new whole-app parity certification.
- Integration/package revision and cleanup: [product handoff](product-handoff.md), [integration record](integration-record.md). Historical worktree paths in review artifacts are provenance, not the durable final location.

## Problem And Design Rationale
The shared workspace menu lost native directory browsing while retaining manual path entry. Restore browsing **inside the existing new-folder form**, with a labelled button beside the field. Both typing and browsing supply the same value and share one explicit apply action. Cancel remains non-destructive.

A direct Browse menu item would save a click but split discovery from manual entry. Auto-apply after native choice would change the commit boundary. Neither alternative is required: the user approved the conservative, localized input-aid flow described here. The earlier draft suggestion alone was not treated as approval.

## Scope And Experience Goal
User: someone selecting a workspace for a new Agent/Team Chat, Org setup, or a currently editable placed-Team setting. Success: the intended setting receives the chosen directory only on **Use folder**, without starting/sending/saving merely from browsing.

In scope: `ChatWorkspaceMenu` and bindings through `ChatNewSurface`, `RunSettingsCard`, `OrgLaunchPage`, `RunMemberRow` / existing settings. Source callers establish these paths. Non-goals: restore retired configuration forms, unlock saved roots, add remote/browser/mobile browsing, change workspace registration/save/launch/persistence, or implement native/backend capabilities in the UI reference.

## Related Requirements And Acceptance Criteria
| IDs | UI/UX obligation | Journey |
| --- | --- | --- |
| REQ-001 / BEH-001 / AC-001..003 | Labelled Browse beside path; choose fills; Use folder applies; same shared UI across editable surfaces | UXJ-001,002 |
| REQ-002 / BEH-002 / AC-004 | Local embedded Electron only, non-mobile; manual server-side entry elsewhere | UXJ-003 |
| REQ-003 / BEH-003 / AC-005 | Preserve input/current workspace on cancel, empty or failed invocation; retry/manual fallback | UXJ-004 |
| REQ-004 / BEH-004 / AC-006,007 | Existing/temp/search, absolute validation, known reuse, pending lifecycle, positioning and locks unchanged | UXJ-001..005 |

## Visual Language
Unchanged product shell, compact gray/white workspace popover and blue selection/apply treatment. No standalone screen, reviewer toolbar, or custom production folder modal.

- Desktop menu: existing 384px width, max width viewport minus24px, radius8px, white, 1px gray-200 border (`#ccc`), existing large shadow, z50. Menu opens above Chat composer with6px gap; auto placement used by settings; existing panel/window containment and list scrolling retained.
- Form: top divider gray-100 (`#e6e6e6`), padding12px horizontal/10px vertical, vertical spacing8px. Label12px/16px medium gray-600 (`#666`). Field and Browse share a flex row with8px gap; field consumes remaining width, Browse does not shrink.
- Field: system sans stack,14px/20px normal, padding6px12px, radius6px, white, text gray-900 (`#1a1a1a`), border gray-200. Measured desktop field height34px/width263.5625px in VIS-002; width is flexible, not fixed. Computed values saved in `visual-references/field-computed-style.json`.
- Browse:14px/20px medium gray-700 (`#4d4d4d`), white,1px gray-300 (`#b3b3b3`) border, radius6px, padding6px12px. Hover gray-50 (`#f2f2f2`); focus-visible2px blue-500 at40% opacity; disabled60% opacity with waiting cursor. Label width follows locale.
- Hint/error:12px/16px, normal wrapping. Hint gray-500 (`#808080`); invocation error red-600 (`#dc2626`); invalid path border red-300. No toast or modal for picker failure.
- Existing form actions: right aligned,8px gap;12px medium, padding4px12px, radius6px. Cancel gray-700/gray-300 border; Use folder blue-700 (`#1d4ed8`)/blue-200 border, white, hover blue-50; disabled50% opacity while picker pending.
- Existing search, folder/plus/check icons, option structure, selected blue-700/check blue-600 and list text remain unchanged. No new app icon/assets.
- Surrounding layout, fonts, tokens and motion: unchanged — follows baseline. These values are from the actual accepted reference/Tailwind config, not generic gray defaults.

### New Or Changed Components
| Component | Purpose / states | UI reference traceability only |
| --- | --- | --- |
| Shared folder form | Idle, typing, picker-opening, returned-path, invalid-path, invocation-error, ineligible-context | `components/chat/ChatWorkspaceMenu.vue` |
| Localization | Browse, pending label, locality help and failure | `localization/messages/en/chat.ts`, `zh-CN/chat.ts` |
| Simulated host/dialog | Local/remote/browser/mobile eligibility, choose/cancel/empty/error | `prototype/folder-selection/hostFixture.ts`, `FolderDialogReference.vue`; **not production architecture or native chrome** |

## Journey Inventory And Details
| ID | Start / actions / completion | Related IDs | Visuals |
| --- | --- | --- | --- |
| UXJ-001 | New Chat; select Agent or Team through existing target chooser; Workspace → Open another folder → type or Browse → native choose → inspect/edit returned path → Use folder; intended draft selection updates, menu closes | SCN-001,005; REQ-001,004; AC-001,003,006,007 | VIS-001..005 |
| UXJ-002 | Org via existing target chooser/library Run. Root Workspace uses same flow. Customize members → placed Team → Workspace uses same flow and changes only that Team override; Org default unchanged. Existing apply/save ownership follows baseline | SCN-002; REQ-001,004; AC-002 | VIS-006,007 |
| UXJ-003 | Existing editable workspace field outside eligible local desktop → Open another folder → type connected-node absolute path → Use folder. No Browse appears and no local picker is called | SCN-003; REQ-002; AC-004 | VIS-010,011 |
| UXJ-004 | With input and selection present, Browse → cancel/Escape/empty: unchanged data and no error. Failure: inline message, unchanged data, retry or type. Successful retry fills field and clears feedback; still requires Use folder | SCN-004; REQ-003; AC-005 | VIS-002,005,009 |
| UXJ-005 | Saved run → Edit Config: fixed root remains non-editable, no Browse. A placed-Team field already editable under existing policy retains the menu; no eligibility/permission policy is widened | SCN-002,005; REQ-004; AC-002,007 | VIS-008; shared editable form VIS-007 |

## Screen And Surface Specification
| ID | Surface / entry | Layout / primary action | Visuals |
| --- | --- | --- | --- |
| UIS-001 | Chat Agent/Team `/chat` workspace popover | Existing search/list above new-folder form; Use folder applies | VIS-001..005,009,012 |
| UIS-002 | Org root via normal configuration route | Same menu attached to root Workspace chip; no Run triggered by browsing | VIS-006 |
| UIS-003 | Placed-Team row in member settings | Same menu confined to panel/window; Use folder applies override only | VIS-007 |
| UIS-004 | Saved configuration | Fixed workspace text replaces editable chip as before | VIS-008 |
| UIS-005 | Ineligible host / narrow context | Manual field and connected-node hint; existing bottom sheet under640px | VIS-010,011 |

## Interaction And State Transitions
| ID | From / event | Immediate feedback / result | Side effect / next actions |
| --- | --- | --- | --- |
| TR-001 | Menu → Open another folder | Form replaces footer; field starts empty and receives focus | Existing selection untouched; type, Browse, Cancel |
| TR-002 | Eligible form → Browse / keyboard activation | Clear prior picker error; **Opening…**, Browse and Use folder disabled; native chooser opens | No select/registration/save/start/send; one chooser request at a time |
| TR-003 | Native chooser returns path | Replace input, clear validation/picker error, focus field | Current selection unchanged; edit, Browse again, Use folder, Cancel |
| TR-004 | Native cancel/Escape or empty result | Form stays; input and current selection unchanged; focus Browse; no cancellation error | Retry or manual entry |
| TR-005 | Picker invocation fails | Form stays; exact inline error; focus Browse; both controls usable again | No data changes; retry or type |
| TR-006 | Input editing | Update text; clear stale path/picker feedback | Does not apply setting |
| TR-007 | Use folder / form Enter, invalid | Existing absolute-path message; form stays and current selection unchanged | Correct path, Browse, or Cancel |
| TR-008 | Use folder / form Enter, valid | Trim whitespace; reuse known workspace if matching, otherwise pending folder; close menu and focus chip | Existing owning-setting apply/draft/save lifecycle only; no new browsing-specific lifecycle |
| TR-009 | Form Cancel | Hide form, return focus to workspace trigger within existing open menu | Discard unapplied input; selection unchanged; opening form anew starts empty |
| TR-010 | Menu Escape / outside click | Existing dismissal/focus behavior | No implicit apply |

## State Behavior
| State | Required presentation / exit | Final visual |
| --- | --- | --- |
| Default / populated | Existing list/search/temp and Open another folder; selected check | VIS-001 |
| Empty form | Label, field, eligible Browse, locality hint, Cancel/Use folder | VIS-005; narrow VIS-012 |
| Opening / chooser active | TR-002 disables Browse/Use folder, pending label. Native system window owns focus. No custom app modal is specified | VIS-005 supplies form geometry; TR-002 defines exact transient delta; no native-chrome requirement |
| Returned path / cancel | Filled path not yet applied; chooser cancel returns to otherwise unchanged form | VIS-002 |
| Applied new folder | Selected chip basename, full path tooltip; pending option in menu; not automatically registered | VIS-003,001 |
| Invalid / empty input submission | “Enter an absolute folder path.”; current workspace unchanged | VIS-004 |
| Invocation error | “Couldn’t open the folder chooser. Try Browse again or enter a path.”; retains data, no destructive retry | VIS-009 |
| Remote/browser/mobile | No Browse; full-width field and connected-node helper | VIS-010,011 |
| Locked | Existing fixed field, no newly editable control | VIS-008 |
| Search no matches / empty workspace data | Unchanged — follows baseline; Open another folder remains available, no new empty-state policy | VIS-001 specifies unchanged list region; round-1 evidence covers no-match |
| Long path | Single-line input horizontally scrolls; chip truncates with full path title; helper/error wraps; no horizontal overflow of menu | VIS-002,012 |
| Permission / filesystem rejection | Actual chooser is OS-owned; invocation failure uses TR-005. Post-apply existence/access errors follow existing launch/save behavior, not fabricated by this UI | VIS-009; no new permission UI |

## Content, Labels, Validation, And Feedback
Exact English UI additions: **Browse…**, **Opening…**, **Choose a folder on this computer, or enter its full path.**, **Enter the full folder path on the connected node.**, **Couldn’t open the folder chooser. Try Browse again or enter a path.**

Retained: **Open another folder…**, **Folder path**, **Cancel**, **Use folder**, **Enter an absolute folder path.** Preserve baseline search/temp/known-workspace labels and template copy. Folder/path/model/agent/team names are illustrative data.

| Field | Type / required | Validation / trigger | Exact message |
| --- | --- | --- | --- |
| Folder path | Single-line text; required to apply | Existing rule after trimming on Use folder/Enter: slash-root, drive-letter + slash/backslash, or UNC prefix. Empty/relative paths fail. Native selection never bypasses this confirmation | Enter an absolute folder path. |

This is syntax validation, not directory existence/permission verification. No new normalization, registration or network call is implied.

zh-CN additions are in the approved reference source: 浏览…, 正在打开…, 选择此电脑上的文件夹，或输入完整路径。, 请输入所连接节点上的完整文件夹路径。, 无法打开文件夹选择器。请再次点击“浏览”或输入路径。 Locale uses existing runtime and fallback behavior. English is the final screenshot locale; Chinese was authored but has not had independent translation/layout QA. OS dialog labels are OS-owned, not the reference's systemTitle/systemOpen strings.

## Responsive And Platform Behavior
| Condition | Presentation / interaction |
| --- | --- |
| Width ≥640px | Existing anchored384px menu, viewport/panel bounds; auto placement in settings and above composer in Chat |
| Width <640px | Existing fixed bottom sheet inset8px left/right/bottom, max80vh, z50; black20% backdrop z40; list scrolls. Field flexes beside Browse if eligible |
| Embedded-local Electron + native bridge + non-mobile | Browse available. Native directory chooser, not a web File System Access picker |
| Remote-node Electron / ordinary browser / mobile | No local Browse. Manual connected-node absolute path remains; narrow viewport alone does not mean mobile runtime |
| OS variation | Native chooser appearance, navigation, button wording and permissions follow OS. Reference's browser dialog is not to be copied into production |

## Accessibility And Keyboard Behavior
- Follow the existing product's labelled controls/focus conventions; no independent whole-product WCAG certification is claimed.
- Open another folder focuses path; next Tab reaches Browse when present; Enter/Space activates the button without form submission (`type=button`). Pending state is disabled/aria-busy. Use folder is disabled while pending.
- Chosen path focuses field; cancel/error returns to Browse. Native modal traps its own focus; Escape cancels native chooser without dismissing the underlying form. Form/menu Escape follows the retained popover dismissal (TR-010); Form Cancel follows TR-009.
- Field has associated Folder path label, aria-invalid for validation and aria-describedby for current error/hint. Invocation error uses role alert. Do not announce a cancellation as an error.
- Visible text, not icon-only discovery. Focus indicator blue500/40. Colors match approved baseline palette; full contrast/screen-reader audit not performed. Native accessibility must be supplied by the OS picker, not the simulated HTML dialog.

## Motion And Transitions
Unchanged — follows baseline. No new animated transition or spinner. Pending label responds to the operation's actual lifetime; the reference's180ms synthetic latency is **not a product timing requirement**. Existing transition-colors on the chip is retained. No new motion requiring reduced-motion treatment.

## Data, Contract, And Mock Boundaries
| Boundary | Reference behavior | Production obligation / unproven capability |
| --- | --- | --- |
| Native dialog | Browser modal with three invented directories; scripted path/null/failure | Open real native **directory** chooser on eligible local Electron; platform chrome permitted to vary |
| Host eligibility | Fixture plus existing local-node/mobile gate | Evaluate actual embedded-local window/bridge and mobile runtime; never confuse local disk with remote node |
| Data | Existing wholly synthetic captured state retained; chosen path local draft state | Preserve actual workspaces/history; no migration or new data-loss policy |
| Apply/save/launch | Existing UI-reference setting owner and scripted lifecycle | Preserve existing production lifecycle; chooser return alone has no side effects |
| Failure versus cancellation | Distinct scripted outcomes | Source helper currently returns null on caught failures too; distinguish these outcomes to show approved failure feedback without errors on cancel. Architecture belongs to Engineering |

The reference does not prove filesystem access, permissions, platform compatibility, native bridge invocation, backend durability, production launch/save, or real mobile keyboard behavior. No production code was edited.

## Final Visual Reference Inventory
Captured **after UCONF-001** on2026-10-07. Files under `visual-references/`; desktop1512×862 unless specified. The affected workspace control, placement and feedback are normative. Domain names, paths, model labels, counts, dates and mock conversation content are illustrative. Unrelated surrounding UI remains governed by its baseline/approved tickets; these captures do not approve unrelated copy differences. Native chooser chrome is deliberately not a normative image.

| ID | Surface/state | File | Requirements-defining details |
| --- | --- | --- | --- |
| VIS-001 | Chat menu populated/pending selection | [image](visual-references/VIS-001-workspace-menu-desktop.jpg) | Existing structure, selected treatment, discovery entry |
| VIS-002 | Chosen path before apply | [image](visual-references/VIS-002-selected-path-desktop.jpg) | Browse placement, input/hint/actions, unchanged current selection |
| VIS-003 | Applied Chat selection | [image](visual-references/VIS-003-applied-workspace-desktop.jpg) | Chip result, menu dismissal; no launch |
| VIS-004 | Invalid manual input | [image](visual-references/VIS-004-invalid-path-desktop.jpg) | Existing validation and form layout |
| VIS-005 | Team setup empty form | [image](visual-references/VIS-005-team-folder-entry-desktop.jpg) | Same control within Team context |
| VIS-006 | Org root chosen path | [image](visual-references/VIS-006-org-selected-path-desktop.jpg) | Root anchoring, unchanged selection until apply |
| VIS-007 | Placed-Team chosen path | [image](visual-references/VIS-007-placed-team-folder-desktop.jpg) | Panel containment and override scope |
| VIS-008 | Saved root locked | [image](visual-references/VIS-008-saved-root-locked-desktop.jpg) | No newly editable workspace action |
| VIS-009 | Picker failure | [image](visual-references/VIS-009-picker-error-desktop.jpg) | Inline wrapping/error color, retained input and selection |
| VIS-010 | Remote manual fallback | [image](visual-references/VIS-010-remote-manual-path-desktop.jpg) | Browse absent, full-width input and locality hint |
| VIS-011 | Mobile-context manual,390×844 | [image](visual-references/VIS-011-mobile-manual-path-390x844.jpg) | Existing sheet, absent Browse, bounded actions |
| VIS-012 | Local desktop narrow,390×844 | [image](visual-references/VIS-012-local-narrow-entry-390x844.jpg) | Flex field/Browse fit inside existing sheet |

## Linked UI Reference Evidence
Runnable reference: `/Users/normy/autobyteus_org/autobyteus-web-design`; normal `/chat` after following [runbook](ui-reference-runbook.md). [Ticket](product-ticket.md), [confirmation](user-confirmation.md), [final validation](final-validation.md), [scenario matrix](ui-behavior-test-matrix.md), [review rationale/history](review-round-1.md), [integration](integration-record.md).

## Implementation Fidelity Boundary
Preserve specified app appearance, exact UI copy, input/apply separation, eligibility, focus/recovery and existing locks/lifecycles. Reuse production patterns; the reference's module layout, stores, fixtures, event adapter,180ms delay and HTML dialog prescribe **no production architecture**. Actual folder names/path lengths, system font rendering and native chooser chrome vary. Responsive rules above remain exact; surrounding unrelated product surfaces remain unchanged.

## Out Of Scope / Open Decisions And Risks
No unresolved UI decision within the approved scope. Native execution and platform QA, Chinese locale QA, production data lifecycle verification and canonical requirements reconciliation remain downstream. Full-root extra vue-tsc failed with TypeScript stack overflow, cause not established; configured typecheck/lint scope is narrower. Build and browser evidence do not conceal that limitation. The inherited saved-Org fixture can display known/pending duplicate path rows; not changed or recertified by this ticket.

## Final Consistency Check
Approval/source/base/UI revision recorded: **Yes**. In-scope journeys/states and applicable final references: **Yes**, transient native/pending differences explicitly specified, not screenshot-only. Visual/content/responsive/accessibility/motion values traced to approved reference: **Yes**. UI code unchanged since approval: **Yes**. Mock/illustrative boundaries and remaining technical validation limits explicit: **Yes**. Artifact paths become durable under the completed ticket after integration; integration/cleanup receipts are separate from the UI approval. No production-readiness claim.
