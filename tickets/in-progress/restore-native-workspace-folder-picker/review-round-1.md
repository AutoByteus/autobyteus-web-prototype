# Folder selection — review round 1

**Awaiting User Review — unapproved proposal, not an implementation-ready specification.**

Package: `restore-native-workspace-folder-picker`; Solution R2 Draft / SR-004. Date: 2026-10-07.
Source: `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web` @ `88fad73cbd20201642acdcfe75e69b1897ec135c`.
Canonical design: `/Users/normy/autobyteus_org/autobyteus-web-design`; accepted base `8cd41f886459630909e827d7df1b67910618aaac`.
UI reference: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker` on `design/restore-native-workspace-folder-picker` @ `a677e01558b2b9d48253950bc2b8db821358625a`.
Related: [ticket](product-ticket.md), [baseline re-evaluation](baseline-reevaluation.md), [scenario evidence](ui-behavior-test-matrix.md), [runbook](ui-reference-runbook.md).

## Recommendation to review

Open the existing workspace menu → **Open another folder…** → type a full path or select **Browse…** beside the field → choose a directory → review/edit the filled path → **Use folder**.

- The existing workspace list, search, Temp workspace and Open another folder entry stay in place.
- Browse is a secondary, labelled input action, available only for embedded-local Electron outside mobile runtime. Manual entry remains first-class.
- Browse does not apply a workspace. Only Use folder hands the choice to the existing setting owner. That owner's existing draft/save/launch lifecycle stays intact.
- While opening, Browse reads **Opening…** and both Browse and Use folder are disabled. The native chooser owns interaction while open.
- Cancel/Escape in the chooser, or an empty result, keeps both typed input and the current workspace unchanged; focus returns to Browse. No error for cancellation.
- A chosen path replaces the input, clears stale path/picker feedback and returns focus to the field. The current workspace stays unchanged until Use folder.
- Picker failure stays inline: **“Couldn’t open the folder chooser. Try Browse again or enter a path.”** It preserves input and workspace, returns focus to Browse, and permits retry or manual entry. Successful retry clears it.
- Form Cancel leaves the workspace unchanged and returns to the workspace menu. Form Escape follows the same path. Existing absolute-path error and known-directory reuse remain.
- Browser, remote Electron and mobile context show no Browse. The helper reads **“Enter the full folder path on the connected node.”** No local filesystem is implied.
- Saved root locks remain fixed. Already-editable placed-Team fields share this same menu; this proposal does not make locked fields editable.

### Why this design
The menu is already the place users choose workspaces; the path form is already where they specify a new folder. Putting Browse beside that field adds one familiar way to supply the same value without changing what selection means. Keeping Use folder makes typing and browsing symmetrical and leaves room to inspect/correct the path before applying it.

Considered, not built: (1) a direct Browse command in the menu, which saves one click but separates browsing from manual entry and needs another apply rule; (2) auto-apply on native Open, which removes a step but makes chooser dismissal/selection a different commit boundary from typing. Neither is assumed forbidden. This is Product's recommendation, not adoption of the earlier SD suggestion as an approved constraint.

## Visual design and preservation
The existing 384px white menu, gray dividers, compact typography, search/options and blue selected treatment are retained. The field flexes beside an 86px-ish label-sized Browse button; no new modal/app shell or review controls were introduced. Helper/error text fits below the input; existing Cancel/Use folder hierarchy stays unchanged. Desktop (1512×862) and narrow (390×844) were inspected. At narrow widths the existing bottom-sheet menu remains; both local-desktop narrow and mobile-context manual layouts fit without horizontal clipping. The Org member panel's menu stays within the panel/window boundary.

New UI copy exists in English and zh-CN. English was browser-reviewed; Chinese layout and translation have not had an independent locale review. No full-app refresh or blanket 72-state parity certification is claimed. Unchanged source outside the localized menu delta was not re-audited.

## Review images — NOT normative final references
All records and paths are invented; surrounding previously accepted UI is preserved. Native chrome and sample folders in the chooser image are **illustrative**, not an app-dialog design.

- [Workspace discovery](review-evidence/chat-workspace-discovery.jpg)
- [Selected path before applying](review-evidence/chat-folder-selected-before-apply.jpg)
- [Picker failure](review-evidence/chat-picker-error.jpg)
- [Team setup](review-evidence/team-folder-entry.jpg)
- [Org setup](review-evidence/org-folder-selected.jpg)
- [Placed-Team override](review-evidence/placed-team-folder-selected.jpg)
- [Saved Agent root locked](review-evidence/saved-agent-workspace-locked.jpg)
- [Saved Org root locked / Team editable](review-evidence/saved-org-editable-team-folder.jpg)
- [Remote manual fallback](review-evidence/remote-manual-path.jpg)
- [Mobile-context manual sheet](review-evidence/mobile-manual-path-390.jpg)
- [Narrow local-desktop sheet](review-evidence/local-narrow-folder-entry-390.jpg)
- [Illustrative chooser only](review-evidence/illustrative-directory-chooser.jpg)

## Evidence limits and findings
1. All validation is of the **browser UI reference**. No Electron bridge, actual filesystem chooser, OS permissions, production backend, save durability, run execution, or actual mobile keyboard was tested. Browser return states model these boundaries.
2. Source `composables/useNativeFolderDialog.ts` currently returns null for both cancellation and caught exceptions. The proposed visible failure state requires those outcomes to remain distinguishable in the eventual implementation. This is a UI requirement for reconciliation, not an instruction to use the reference's adapter or architecture.
3. The saved-Org synthetic fixture displays the same known folder twice (existing row plus pending-folder row). The current shared menu deliberately renders both when seeded that way. This predates the Browse change; no broad fixture or source refresh is inferred. The tested known-path confirmation correctly resolves to an existing workspace. The duplicate is not presented as newly certified parity or part of the proposed delta.
4. Build and the repository's configured checks passed. An additional full-root `vue-tsc --noEmit` attempt failed with a TypeScript stack overflow; its cause has not been diagnosed and it is not claimed to be pre-existing. The configured typecheck/lint target a subset of reference infrastructure, not all Vue components. See logs and matrix. Successful build and UI journeys are the direct changed-surface evidence.

## Approval
User-confirmation reference: **None**. “Continue your work” authorizes continuing design, not approving this proposal. No final `ui-ux-spec.md` or normative `VIS-*` references have been created for this ticket. No default-branch integration or production changes.

Review question: **Does this Browse placement, choose-then-Use-folder flow, and non-destructive cancel/error behavior match the intended experience?** Changes or confirmation are requested before final artifacts and handoff for requirements reconciliation.
