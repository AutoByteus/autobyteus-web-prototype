# UI/UX Specification — Settings → Server Settings → Embedding

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Product ticket `search-model-settings`; Project Task `autobyteus-146` (follow-up FU-1 of `autobyteus-71`), requested by the Solution Designer (`solution_designer_80624588913d473bac3ef7d8c3d4d305`) for the user.
- Related requirements revision ID: `SR-001` (`requirements-doc.md` in `/Users/normy/autobyteus_org/autobyteus-worktrees/search-model-settings/tickets/in-progress/search-model-settings/`). **This design changes that revision; see "Requirement Impact" below.**
- Related IDs: UC-001–UC-004; REQ-001–REQ-009; AC-001–AC-009; SCN-001–SCN-004; DEC-003, DEC-005 (resolved here), DEC-006, DEC-007, DEC-008; QR-003. Checks SRCH-001 to SRCH-019 in `visual-references/final-validation.mjs`.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: `http://127.0.0.1:4691/settings?section=server-settings&mode=embedding` (`corepack pnpm dev --port 4691`)
- Explicit user-confirmation reference (2026-10-19): the user replied **"done"** to the review package that listed the final design and the self-validation round, after the user's own direction on five points: (1) the section lives under **Server Settings** and is named **Embedding**, with technical wording; (2) a cleaner look; (3) only the most necessary facts per model; (4) the model source (Hugging Face) said once, not per row; (5) much less explanatory text. The package also said that the open choices D-1…D-5 (below) would be recorded as approved unless the user said otherwise; the user did not object.
- Final validation date: 2026-10-19

### Requirement Impact (for the Solution Designer to reconcile)

1. **DEC-005 is resolved by the user:** the section is **Server Settings → Embedding** (a fourth sub-section after Basics, before Advanced and Migrations), not a top-level "Search" section. Route `/settings?section=server-settings&mode=embedding`. The model card is titled "Embedding model".
2. **REQ-001 is narrowed by the user.** Each model shows only: name, state, a language label, and download size (plus the shared "Downloaded from Hugging Face" line and a "Default" mark). **Licence, indexing speed and memory are not shown.**
3. **REQ-004 / DEC-008 cost is narrowed:** the switch dialog states the **download size only** ("346 MB, not downloaded yet" or "Already downloaded"). It no longer states time per Task or memory.
4. **Copy is deliberately minimal.** Sentences in the sketch and the earlier candidates (what embeddings are, "applies to this node", "one model at a time", "indexing starts when…", "only the active model's index is kept", "No partial files", "Exact-match search still works", completion notices) were removed on purpose. They are not required copy.
5. Everything else in REQ-001–REQ-009 is covered as specified below. Design additions beyond the requirement text that the user approved: D-1…D-5 (see "Open Decisions And Risks", which records them as decided).

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web` Settings page (`pages/settings.vue`), Server Settings (`components/settings/ServerSettingsManager.vue`), one new sub-section.
- Pinned source commit or revision: `2f211340ee36b81cef74a74b2e042b5102c269d3` (baseline; v1.5.6-beta.1). The request's code base `origin/personal@8d40ba3b6c` was checked: `autobyteus-web/pages/settings.vue` and `autobyteus-web/components/settings` are identical to the pin (the only Settings change is unrelated NFS-guide copy in `localization/messages/*/settings.ts`). The board's meaning-search status line (`ProjectTaskBoard.vue`) is not in the UI reference and is unchanged by this design.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (`personal`)
- UI reference revision or commit: recorded in `product-ticket.md` at finalization (branch `design/search-model-settings`, accepted base `10207c6badd8a14b7d286fcbffc41c6b0cb12c47`).
- Ticket folder: `tickets/done/search-model-settings/` after finalization
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- User problem and intent: the embedding model could be changed only through a raw server setting (`AUTOBYTEUS_EMBEDDING_MODEL`, visible in Advanced only once it has a value). A model was downloaded and a Project indexed only on the first search. The user wants to see the catalog models, download one ahead of time, choose the active one, see each Project's index state and start or rebuild indexing, on any node, with minimal, technical, clean UI.
- Key UX decisions and why:
  - **Placement: Server Settings → Embedding** (the user's decision). It is node-level like the rest of Server Settings, sits next to Advanced where the raw key lives, and is not Electron-specific.
  - **Two cards: "Embedding model" and "Project indexes"**, in the Server Settings page's own card style (white `rounded-3xl` cards on the slate page, 2xl titles), no separate page header.
  - **One list per card instead of a box per row.** One bordered list with thin dividers; the Active model is a tinted row (`bg-blue-50/40`), not a box, a pill or a radio.
  - **Status is one plain line** (a dot and words), never a pill. Facts are one quiet line ("English · 55 MB"). The source is said once.
  - **Quiet buttons.** Grey outline buttons for Download, Use this model, Index now and Cancel; Remove is red text; Rebuild is grey text. **Index all Projects** is the only filled blue button on the page. Inline confirmations (Remove, Rebuild) are quiet grey strips; the model switch is a modal dialog.
  - **Technical, minimal copy.** The people who open Embedding are technical; the page does not explain itself.
  - **Stable order and live updates.** Projects stay alphabetical so rows do not jump while progress ticks.
- Alternatives considered and why they were rejected: a top-level "Search" section (the user chose Server Settings; "Search" is less precise than "Embedding" for this audience); under Extensions (Electron-only, and this is node state); a boxed card per model with a five-column fact grid (too much information, some not guaranteed by the catalog); pills for status (noise); a table with column headers (does not fit progress and confirmations); paging for many Projects (not needed up to the QR-001 size; a filter is enough); an estimated total re-indexing time in the dialog (needs numeric speeds and Task counts that are not guaranteed).

## Scope And Experience Goal

- User or actor: a technical user or operator of the node the window is connected to (desktop app, Docker node, self-hosted server).
- Context: Settings → Server Settings. Everything is node state; nothing is browser state or Electron-specific.
- Goal: see the models, download one ahead of time, choose the active one, see each Project's index state, and start or rebuild indexing.
- Observable success: the user prepares a model and indexes Projects on purpose, and board and agent search then use the chosen model.
- In-scope surfaces and journeys: the Embedding sub-section (its two cards, the switch dialog, the inline confirmations) and its sub-navigation entry.
- Non-goals: models outside the catalog, browsing Hugging Face, a board link, automatic pre-indexing, scheduling, a per-Project model, proxy support, changes to the Advanced table.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, AC-001, UC-001, SCN-001 | List all catalog models with name, state (Active with readiness / Downloaded / Not downloaded / Downloading N of M MB), language label and download size (narrowed, see Requirement Impact) | UXJ-001; UIS-001; VIS-001, VIS-002, VIS-011 |
| REQ-002, AC-002, AC-003, UC-002, SCN-002 | Download ahead with live progress and Cancel; failure with reason and Retry; Remove on a downloaded non-active model; no Remove on the Active model | UXJ-002, UXJ-003; TR-002…TR-008; VIS-002, VIS-003, VIS-008 |
| REQ-003 | Downloaded models stay until Remove; the card shows each size and the on-disk total | UIS-001; VIS-001, VIS-006 |
| REQ-004, AC-004, UC-003, SCN-003 | Use this model asks for confirmation (re-index of every Project, exact-only until then, download size); Cancel changes nothing | UXJ-004; TR-009…TR-012; VIS-004, VIS-005 |
| REQ-005, AC-005, UC-004 | Every Project with its state for the active model; opening the section starts nothing | UXJ-001, UXJ-005; UIS-002; VIS-001, VIS-012 |
| REQ-006, AC-006, SCN-004 | Index now, Rebuild, Index all Projects, each with progress; Unavailable → Retry at model level | UXJ-005, UXJ-006; TR-013…TR-019; VIS-007, VIS-009, VIS-010, VIS-011 |
| REQ-007, AC-007 | Progress updates live (≤ 2 s stale); leaving and returning shows current state | UXJ-007; TR-020 |
| REQ-008, AC-008, QR-004 | Nothing Electron-specific; the same in a browser | All surfaces (browser-only UI reference) |
| REQ-009, AC-009 | The Active row reflects the resolved setting (blank or unknown value = default model) | Data boundary (not modelled; see Data, Contract, And Mock Boundaries) |
| QR-001, QR-002 | Loading state; opening does no work | VIS-015; SRCH-003 |
| QR-003 | Size per model and "On disk: N MB" total; Remove frees it | UIS-001; VIS-001 |
| Localization | en and zh-CN | VIS-017, VIS-018, VIS-019 |

## Visual Language

- Existing product language to preserve: Server Settings page (slate `bg-slate-50` page, white `rounded-3xl border border-slate-200 shadow-sm` cards with `px-6 py-5`, `text-2xl font-semibold` card titles, `text-sm text-gray-500` descriptions), the Settings sidebar, the product's modal pattern (`fixed inset-0 z-50 bg-black bg-opacity-50`, white `rounded-lg p-6 shadow-xl`, `max-w-lg` here), Tailwind default palette, system font stack of the product.
- Layout structure and visual hierarchy: a single column filling the Server Settings content area, two cards with a 20 px gap. In each card: title row (title and one description line at left, a small grey figure or the primary button at right), then one bordered list (`rounded-xl border border-slate-200`, `divide-y divide-slate-100`, `overflow-hidden`).
- Grid, dimensions, spacing, and density: model row `px-4 py-4`, three text lines (name, status, facts); Project row `px-4 py-2.5`, min height 2.25rem at ≥ 640 px, columns name 30% · status flex · actions 14rem right-aligned; progress bars 6 px (models, `max-w-md`) and 4 px (Projects, `max-w-[16rem]`); button min height 36 px (models, dialog, Index all) and 32 px (Project rows).
- Typography: model name `text-base font-semibold text-gray-900`; status line `text-sm`; facts `text-sm text-gray-500`; "Default" `text-xs text-gray-400`; progress caption `text-xs text-gray-500`; Project name `text-sm font-medium text-gray-900`; dialog title `text-lg font-semibold`, lead `text-sm font-medium text-gray-900`, bullet `text-sm text-gray-600`.
- Color values and semantic roles (Tailwind): Active label `text-blue-700`; ready and Ready Projects `text-green-700` with a `bg-green-600` 6 px dot; preparing, downloading, indexing and Needs update `text-amber-700` (spinner `border-amber-300 border-t-amber-600`; Needs update dot `bg-amber-500`); failure and unavailable `text-red-700` (`bg-red-600` dot); Not indexed, Waiting and Not downloaded `text-gray-500` / `text-gray-400` with grey dots; progress bars `bg-blue-500` on `bg-gray-100`; Active row `bg-blue-50/40`; Remove `text-red-700` hover `bg-red-50`; primary button `bg-blue-600` hover `bg-blue-700` white text; secondary button `border-gray-300 bg-white text-gray-700` hover `bg-gray-50`; accent-free "Rebuild" text button `text-gray-600` hover `bg-gray-100`; inline confirmation strip `bg-gray-50 rounded-lg`, with a `bg-red-600` confirm for Remove and a `bg-blue-600` confirm for Rebuild.
- Surfaces, borders, radii, shadows, elevation, and layering: cards `rounded-3xl` + `shadow-sm`; lists `rounded-xl`; buttons `rounded-md`; dialog `rounded-lg shadow-xl` over a 50% black backdrop (`z-50`).
- Controls, icons, imagery, and media assets: no icons beyond CSS spinners and 6 px dots and the 16 px search glyph in the Project filter; no imagery. "Hugging Face" is a text link (underline `decoration-gray-300`, offset 2 px) to `https://huggingface.co` opening in a new tab (`rel="noopener noreferrer"`).
- Hover, active, focus, selected, disabled, validation, and feedback treatment: focus ring `ring-2 ring-blue-500 ring-offset-1` (Remove: red ring); disabled primary button `opacity-50` with `cursor-not-allowed` and a `title` explaining why; filter tab selected = `border-b-2 border-blue-500 font-medium text-gray-900`, others `text-gray-500`; state changes are their own feedback (no toasts).

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Settings sub-navigation item "Embedding" | Entry in Server Settings: Basics · Embedding · Advanced · Migrations | selected / unselected | `pages/settings.vue` |
| Embedding panel | Hosts both cards, the loading and load-error states | loading, load error, ready | `components/settings/SearchSettingsManager.vue` (rendered by `ServerSettingsManager.vue` before the raw-settings loading gate) |
| Embedding model card | Models list, disk total, source line | per model: Active (ready / preparing: downloading or loading / unavailable), Downloaded, Not downloaded, Downloading, download failed, Remove confirmation | `components/settings/SearchModelsCard.vue` |
| Project indexes card | Index all, filter tabs, name filter, Project rows | per Project: Not indexed, Waiting, Indexing N of M, Ready (M Tasks), Needs update (K changed), Unavailable, Rebuild confirmation; list: empty, no match, many | `components/settings/SearchProjectIndexesCard.vue` |
| Switch dialog | Confirm "Use this model" | for a not-downloaded or a downloaded model | `components/settings/SearchModelSwitchDialog.vue` |
| Design-only state | Synthetic status and scripted timeline | seeded by scenario | `prototype/search-settings/searchSettingsFixture.ts` |

The `Search*` file names and `search-*` test ids are historical; the product name is **Embedding**.

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User opens Settings | Any | Understand the models and the index state | Knows the Active model and each Project's state; nothing started | REQ-001, REQ-005, AC-001, AC-005, SCN-001 |
| UXJ-002 | User, heavy model not downloaded | Model Not downloaded | Download ahead | Model Downloaded | REQ-002, AC-002, SCN-002 |
| UXJ-003 | User | Model Downloading, or Downloaded | Cancel a download, or remove a downloaded model | Not downloaded, no files kept | REQ-002, REQ-003, AC-002, AC-003 |
| UXJ-004 | User | Another model chosen | Switch the active model | New model Active and prepared; Projects Not indexed | REQ-004, AC-004, SCN-003 |
| UXJ-005 | User | Projects Not indexed or Needs update | Index on purpose | Projects Ready | REQ-006, AC-006, SCN-003, SCN-004 |
| UXJ-006 | User | A Project looks wrong | Rebuild a Project from scratch | Project Ready again | REQ-006, DEC-006 |
| UXJ-007 | User | Work in progress | Leave the page and return | Current state shown, work continued | REQ-007, AC-007 |
| UXJ-008 | User | Model problem | Recover (download fails, or the active model is Unavailable) | Retry succeeds | REQ-002, REQ-005, AC-002, AC-006 |

## Journey Details

**UXJ-001 Understand.** Settings → Server Settings → Embedding. The panel shows a loading skeleton (VIS-015) until the status arrives, then the two cards (VIS-001). The Active model has the tinted row and "Active · Ready". Each other row shows "Downloaded" or "Not downloaded". Nothing starts by opening the page.

**UXJ-002 Download ahead.** On a Not downloaded model, **Download**. The row's status becomes a spinner and "Downloading"; a progress bar and "N of M MB · P%" appear under the facts; the only action is **Cancel** (Use this model is hidden). The On-disk total counts partial files. When the download completes, the row shows "Downloaded" with **Use this model** and **Remove**. (VIS-002)

**UXJ-003 Cancel / Remove.** **Cancel** returns the row to Not downloaded with no files kept. **Remove** on a Downloaded non-active model opens an inline confirmation: "Remove <name>? This frees <size> MB." with **Remove** (red) and **Cancel**; focus moves to Cancel. Confirming returns the row to Not downloaded and lowers the total. The Active model has no Remove. (VIS-008)

**UXJ-004 Switch.** **Use this model** opens the dialog (VIS-004 not downloaded, VIS-005 downloaded). **Cancel** or Esc closes it and changes nothing. **Use this model** (confirm) writes the setting: the chosen row becomes Active, the previous model becomes Downloaded, the "Project indexes" subtitle names the new model, and every Project shows **Not indexed** (VIS-006). If the model was not downloaded the Active row shows "Preparing…" with "Downloading the model: N of M MB · P%", then a short "Loading the model…" bar, then "Ready" (VIS-007). Focus lands on the new Active row. Search on the board keeps working with exact matches meanwhile (existing behavior).

**UXJ-005 Index.** **Index all Projects** starts every Project that is Not indexed or Needs update. A Project shows "Waiting to start…" (or "Waiting for the model…" while the model prepares), then "Indexing N of M" with a thin bar, then "Ready · M Tasks". Per Project, **Index now** appears on Not indexed and Needs update Projects (Needs update indexes only the changed Tasks: "Indexing N of K"). Index all is disabled when nothing needs indexing and when the model is unavailable (its `title` says why). (VIS-007, VIS-010)

**UXJ-006 Rebuild.** **Rebuild** (Ready and Needs update Projects) opens an inline confirmation: "Rebuild “<name>” from scratch? Meaning search is exact-only until it finishes." with **Rebuild** (blue) and **Cancel**. Confirming re-indexes every Task of that Project; the row shows Waiting, then Indexing N of M, then Ready. (VIS-009)

**UXJ-007 Leave and return.** Work is node state. Leaving Settings or the section does not stop it; returning shows the current progress. Opening or refreshing the section never starts a download or indexing.

**UXJ-008 Recover.** A failed download (VIS-003) shows "Download failed: Couldn't reach huggingface.co. Check this node's network connection." in red with **Retry** and **Use this model**; the row is Not downloaded. If the *active* model is Unavailable (a failed switch download, or damaged files), its row shows "Active · Unavailable", the reason line and **Retry**; every Project shows a quiet grey "Unavailable" with no actions and **Index all Projects** is disabled (VIS-011). Retry restarts preparation.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Embedding model card | `/settings?section=server-settings&mode=embedding` | Choose, download and remove models | Title row ("Embedding model" · one description line with the Hugging Face link · "On disk: N MB"); one list of three rows | VIS-001…VIS-003, VIS-008, VIS-011 |
| UIS-002 | Project indexes card | same | Index and rebuild Projects | Title row ("Project indexes" · "Using <model>." · **Index all Projects**); filter tabs; name filter above 8 Projects; one list | VIS-001, VIS-009…VIS-014 |
| UIS-003 | Switch dialog | opened by Use this model | Confirm a model switch | Title, lead, one bullet, download line, Cancel and Use this model | VIS-004, VIS-005, VIS-018, VIS-021 |
| UIS-004 | Panel states | same route | Loading, load error | Skeleton cards; red alert with Retry | VIS-015, VIS-016 |
| UIS-005 | Sub-navigation | Settings sidebar | Reach Embedding | Server Settings sub-items: Basics · **Embedding** · Advanced · Migrations | all |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Panel loading | Status arrives | Skeleton replaced by the cards | Ready (or load error) | Read-only status; nothing started | all |
| TR-002 | Model Not downloaded | Download | Spinner, "Downloading", progress bar | Downloading | Download starts on the server | Cancel |
| TR-003 | Model Downloading | Progress tick (≤ 2 s) | Bar and "N of M MB · P%" advance | Downloading | Total on disk grows | Cancel |
| TR-004 | Model Downloading | Cancel | Row returns to Not downloaded | Not downloaded | Partial files deleted | Download, Use this model |
| TR-005 | Model Downloading | Completed | "Downloaded", size on disk | Downloaded | Files verified | Use this model, Remove |
| TR-006 | Model Downloading | Failure | Red reason line, Retry | Not downloaded (failed) | Partial files deleted | Retry, Use this model |
| TR-007 | Model Downloaded (non-active) | Remove | Inline confirmation, focus on Cancel | Confirming | — | Remove (confirm), Cancel |
| TR-008 | Confirming remove | Confirm | Row returns to Not downloaded; total drops; focus on the row | Not downloaded | Files deleted | Download, Use this model |
| TR-009 | Any non-active model | Use this model | Dialog opens, focus on Cancel | Dialog | — | Cancel, Esc, confirm |
| TR-010 | Dialog | Cancel / Esc | Dialog closes, focus returns to the opener | Unchanged | Nothing changes | — |
| TR-011 | Dialog | Confirm | New Active row; previous Downloaded; Projects Not indexed; focus on the new row | Active preparing (or ready when Downloaded) | Setting `AUTOBYTEUS_EMBEDDING_MODEL` written; model prepared (downloaded if needed) | Retry (if it fails), Index now, Index all |
| TR-012 | Active preparing | Download then load complete | Status "Ready" (announced) | Active ready | Waiting Projects start | all |
| TR-013 | Project Not indexed / Needs update | Index now | "Waiting to start…" then "Indexing N of M" | Indexing | Background indexing; model prepared if needed | — |
| TR-014 | Projects needing work | Index all Projects | Each shows Waiting then Indexing | Indexing | One at a time in list order (UI reference); scheduling is the server's | — |
| TR-015 | Indexing | Progress tick | "Indexing N of M" and bar advance | Indexing | — | — |
| TR-016 | Indexing | Completed | "Ready · M Tasks" (announced) | Ready | Vectors stored for the active model | Rebuild |
| TR-017 | Project Ready / Needs update | Rebuild | Inline confirmation, focus on Cancel | Confirming | — | Rebuild (confirm), Cancel |
| TR-018 | Confirming rebuild | Confirm | Row shows Waiting; focus on the row | Waiting → Indexing | Vectors of the Project dropped, all Tasks re-indexed | — |
| TR-019 | Active model Unavailable | Retry | "Preparing…" | Active preparing | Preparation restarts | — |
| TR-020 | Any | Leave Settings, return | Current state shown | Unchanged | Work continued on the node | all |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Model: Active · Ready | Default | Tinted row; "Active · ● Ready"; facts line; no actions | none | — | VIS-001 |
| Model: Active · Preparing | Switch to a model | "Active · ○ Preparing…"; bar + "Downloading the model: N of M MB · P%", then bar + "Loading the model…" | none | Becomes Ready | VIS-007 |
| Model: Active · Unavailable | Model problem | "Active · ● Unavailable"; red "Unavailable: <reason>" | Retry | Retry | VIS-011 |
| Model: Downloaded | Downloaded | "Downloaded" (plain); facts | Use this model, Remove | — | VIS-001 |
| Model: Not downloaded | Default | "Not downloaded" (grey); facts | Download, Use this model | — | VIS-001 |
| Model: Downloading | Download | Spinner "Downloading"; bar + "N of M MB · P%" | Cancel | Cancel | VIS-002 |
| Model: download failed | Failure | Red "Download failed: <reason>" under the facts | Retry, Use this model | Retry | VIS-003 |
| Model: Remove confirmation | Remove | Grey strip "Remove <name>? This frees <size> MB." | Remove, Cancel | Cancel / Esc | VIS-008 |
| Project: Not indexed | Default | Grey dot "Not indexed" | Index now | — | VIS-001 |
| Project: Waiting | Queued | Hollow dot "Waiting to start…" or "Waiting for the model…" | none | — | VIS-007 |
| Project: Indexing | Running | Spinner "Indexing N of M" + 4 px bar | none | — | VIS-001, VIS-010 |
| Project: Ready | Done | Green dot "Ready · M Tasks" ("Ready · 1 Task" for one) | Rebuild | — | VIS-001 |
| Project: Needs update | Changed Tasks | Amber dot "Needs update · K changed" | Index now, Rebuild | — | VIS-001, VIS-010 |
| Project: Unavailable | Model unavailable | Grey dot "Unavailable"; filter tabs hidden | none | Retry on the model | VIS-011 |
| Project: Rebuild confirmation | Rebuild | Grey strip under the row: "Rebuild “<name>” from scratch? Meaning search is exact-only until it finishes." | Rebuild, Cancel | Cancel / Esc | VIS-009 |
| Project list: many | More than 8 Projects | Name filter (search field, 14 rem) beside the tabs | filter | — | VIS-012, VIS-013 |
| Project list: filtered, no match | Filter | "No Projects match." | change filter | — | — |
| Project list: empty | No Projects | Dashed box "No Projects yet."; Index all disabled | — | — | VIS-014 |
| Panel: loading | Opening | Skeleton cards, `aria-busy` | none | — | VIS-015 |
| Panel: load error | Status unavailable | Red alert "Couldn’t load the search status." + Retry | Retry | Retry | VIS-016 |
| Switch dialog | Use this model | See Content; "Already downloaded" instead of the size when downloaded | Cancel, Use this model | Esc / Cancel | VIS-004, VIS-005 |

## Content, Labels, Validation, And Feedback

- Product voice and wording conventions to follow: technical, terse, sentence case, no explanation of what embeddings are. Use "Tasks" and "Projects" capitalised as elsewhere; "meaning search" is the board's term.
- Exact labels, headings, and action text (en), keys in `localization/messages/en/settings.ts` (`settings.search.*`, `settings.page.serverSettings.embedding`):
  - Sub-navigation: **Embedding**. Card titles: **Embedding model**, **Project indexes**.
  - Model description: "Used for meaning search. Downloaded from Hugging Face." ("Hugging Face" is the link). Total: "On disk: N MB". "Default".
  - Status: Active · Ready / Preparing… / Unavailable; Downloaded; Not downloaded; Downloading. Facts: language label (English / 100+ languages) · "N MB".
  - Actions: Download, Cancel, Use this model, Remove, Retry; Index now, Rebuild, Index all Projects.
  - Progress: "N of M MB", "Downloading the model: N of M MB", "Loading the model…"; "Indexing N of M", "Waiting to start…", "Waiting for the model…".
  - Project states: "Not indexed", "Ready · M Tasks", "Ready · 1 Task", "Needs update · K changed", "Unavailable". Card subtitle: "Using <model name>."
  - Filter tabs: All · Needs indexing · Indexing · Ready (each with a count); placeholder "Filter Projects".
  - Dialog: title "Use <model name>?"; lead "Every Project has to be indexed again with this model."; bullet "Until then, meaning search finds exact matches only."; line "Download: 346 MB, not downloaded yet" / "Download: Already downloaded"; buttons "Cancel", "Use this model".
- Empty, error, and recovery messages: "No Projects yet."; "No Projects match."; "Couldn’t load the search status." + Retry; "Download failed: <reason>"; "Unavailable: <reason>"; reasons shown in the reference: "Couldn’t reach huggingface.co. Check this node’s network connection." and "The model files failed verification." (reasons come from the server; the host name is part of the network reason).
- Inline confirmations: "Remove <name>? This frees <size> MB." and "Rebuild “<name>” from scratch? Meaning search is exact-only until it finishes."
- zh-CN: the same keys in `localization/messages/zh-CN/settings.ts` (nav 嵌入, card 嵌入模型 / 项目索引, 使用此模型, 为所有项目建立索引, …). See VIS-017…VIS-019. Model names, "Hugging Face" and "Apache" style proper names stay as is.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Filter Projects | Search text | No | Case-insensitive match on the Project name; shown only above 8 Projects | On input | "No Projects match." when empty result |
| Raw setting `AUTOBYTEUS_EMBEDDING_MODEL` | (not in this UI) | — | Blank or exactly one catalog id; rejected otherwise — existing server behavior | In Advanced / env | Unchanged — follows baseline |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 768 px (the Settings layout's `md` breakpoint) | As in VIS-001; Project rows are three columns (name 30% · status · actions 14 rem) | — |
| Narrow | < 768 px (reference: 390 px) | The Settings navigation stacks on top (existing behavior); the model card header stacks ("On disk" below the description); the model actions drop below the facts; Project rows stack (name, status, actions); facts wrap without separators below 640 px | Same actions |
| Dialog | any | `max-w-lg`, centred, 16 px margin, scrolls inside if taller than the viewport | Same |
| Platform | desktop window, browser, Docker, self-hosted | Identical; no Electron-specific control | Hugging Face link opens an external tab (the desktop host's external-link handling is an implementation detail) |

## Accessibility And Keyboard Behavior

- Accessibility target: the existing product's (keyboard-operable controls, visible focus, labelled regions); no formal level is defined in the requirements.
- Focus order, focus movement, and focus return: dialog — focus starts on **Cancel**, Tab and Shift+Tab stay inside, Esc cancels, focus returns to the opener on cancel; after confirming a switch, focus lands on the new Active row (`tabindex=-1`). Inline confirmations — focus moves to **Cancel** when opened; Esc or Cancel returns focus to the row's own Remove / Rebuild button; confirming moves focus to the row.
- Keyboard interaction for new or changed controls: all are native buttons, links and inputs. Filter tabs are buttons with `aria-pressed`.
- Roles, names, states, and live announcements: sections are `aria-labelledby` their titles; lists have `aria-label`; progress bars are `role="progressbar"` with `aria-valuemin/max/now` and a name; errors use `role="alert"`; the dialog is `role="dialog" aria-modal="true"` with `aria-labelledby` and `aria-describedby`; the facts line carries visually hidden labels ("Languages:", "Download size:"); a hidden polite status announces completions ("<model> downloaded.", "<model> is ready.", "<Project> indexed."). Live progress itself is not announced.
- Contrast of new or changed text and UI boundaries: text uses the product's grey, green, amber, red and blue 700 shades on white or near-white; grey `text-gray-400` is used only for non-essential text ("Default", "Not downloaded", filter counts, Waiting / Unavailable dots).

## Motion And Transitions

- Motion for new or changed elements, following the product's existing motion conventions: spinners (`animate-spin`) beside Downloading, Preparing and Indexing; progress bars grow with `transition-all duration-300`; the "Loading the model…" bar and the loading skeleton pulse (`animate-pulse`); no other animation. The dialog appears without a transition.
- Durations and easing: 300 ms for bar width (default easing); spinner and pulse use Tailwind defaults.
- Reduced-motion behavior: the product's existing handling; no extra motion is required for meaning (state text carries every state).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Model catalog | Per model: id, name, total download size, optional language label | Synthetic module data: the three catalog models with sizes 55, 24 and 346 MB. Sizes are the sum of the files' bytes in decimal MB (LEAF-IR is 23.9 MB, so 24 MB; its description text says "about 23 MB") | **Required:** compute the size from `files[].bytes`; map `languages: ["en"]` / `["multilingual"]` to "English" / "100+ languages" (or omit the label); default id for the "Default" mark. Unknown: how the localized language label is delivered |
| Download source | The one-line "Downloaded from Hugging Face" | Static text and link | All catalog models are pinned Hugging Face repositories downloaded from `huggingface.co`. A second source would require a per-row source |
| Active model (REQ-009) | Which row is Active | Seeded; changed only by Use this model | **Required:** derive from the setting; a blank or unknown value resolves to the default model (`resolveActiveEmbeddingModel`); a value changed in Advanced or an env file must show as Active. The reference does not model Advanced |
| Status and polling | Model: file state, downloaded bytes, readiness, failure reason. Project: state, Tasks indexed, Tasks to index, changed count, waiting | A 1 s scripted timeline in a module, running whether or not the panel is mounted | **Required:** refresh at least every 2 s while open (REQ-007); a read-only status that starts nothing (REQ-005, QR-002); the load within 1 s (QR-001). Unknown: transport |
| Download ahead and cancel | Progress and Cancel | Scripted (about 18 ticks for any size) | Real cancel, partial-file cleanup, checksum verification (REQ-002). Whether several models may download side by side is an architecture decision |
| Indexing | Index now, Rebuild, Index all | Sequential in list order; Needs update indexes only the changed Tasks | **Required:** scheduling is the server's. Rebuild drops the Project's vectors then indexes every Task (DEC-006) |
| Failure reasons | Text after "Download failed:" / "Unavailable:" | Fixture reasons (localised in the reference) | Reasons come from the server; the network reason should name `huggingface.co` |
| Persistence | Everything | In memory; reload resets | Node state, not browser state (REQ-008) |

Scenario selection (starting state only, via the existing `autobyteus.prototype.scenario` key; every change after load is triggered through the real controls): default `populated`; `search_offline` (the first download fails, then succeeds), `search_unavailable`, `search_many_projects`, `search_empty`, `search_load_failed`.

## Final Visual Reference Inventory

All images are in `visual-references/`, captured by `capture-references.mjs` after the user's approval from the validated reference (paused clock, so states are deterministic). Every visible detail is requirements-defining, except the illustrative content named in the last column.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001; UIS-001, UIS-002; default | 1440×1180 | `visual-references/VIS-001-embedding-default-1440x1180.png` | Sidebar entry, both cards, row layout, status lines, buttons, filter tabs, Project rows in every static state, one running Project | Project names, Task counts, the "12 of 24" figure, the three model sizes beyond the catalog facts |
| VIS-002 | UXJ-002; Downloading | 1440×1180 | `…/VIS-002-download-ahead-progress-1440x1180.png` | Spinner status, bar, "N of M MB · P%", Cancel only, total including partial files | Progress values (140 of 346 MB), the running Project's progress |
| VIS-003 | UXJ-008; download failed | 1440×1180 | `…/VIS-003-download-failed-1440x1180.png` | Red failure line, Retry beside Use this model | The reason wording is server-provided |
| VIS-004 | UXJ-004; dialog, not downloaded | 1440×1180 | `…/VIS-004-switch-dialog-not-downloaded-1440x1180.png` | Dialog title, lead, bullet, "Download: 346 MB, not downloaded yet", buttons | — |
| VIS-005 | UXJ-004; dialog, downloaded | 1440×1180 | `…/VIS-005-switch-dialog-downloaded-1440x1180.png` | "Download: Already downloaded" | — |
| VIS-006 | UXJ-004; after a switch to a downloaded model | 1440×1180 | `…/VIS-006-after-switch-all-projects-not-indexed-1440x1180.png` | New Active row, previous Downloaded, subtitle names the new model, every Project Not indexed, Index all enabled | — |
| VIS-007 | UXJ-004, UXJ-005; preparing and Index all | 1440×1180 | `…/VIS-007-switch-preparing-index-all-waiting-1440x1180.png` | Active · Preparing… with download bar, "Waiting for the model…" rows, Index all disabled | Progress values |
| VIS-008 | UXJ-003; Remove confirmation | 1440×1180 | `…/VIS-008-remove-confirmation-1440x1180.png` | Inline strip and buttons | — |
| VIS-009 | UXJ-006; Rebuild confirmation | 1440×1180 | `…/VIS-009-rebuild-confirmation-1440x1180.png` | Inline strip under the Project row | — |
| VIS-010 | UXJ-005; Needs update indexing | 1440×1180 | `…/VIS-010-needs-update-indexing-1440x1180.png` | "Indexing N of K" for a Needs update Project, others waiting | Progress values |
| VIS-011 | UXJ-008; model unavailable | 1440×1180 | `…/VIS-011-model-unavailable-1440x1180.png` | Active · Unavailable, reason, Retry, grey "Unavailable" rows, filter tabs hidden, Index all disabled | The reason wording |
| VIS-012 | UXJ-001; many Projects | 1440×2000 | `…/VIS-012-many-projects-1440x2000.png` | Filter field beside the tabs, 24 rows | Names and counts |
| VIS-013 | Many Projects, filtered | 1440×1500 | `…/VIS-013-many-projects-filtered-1440x1500.png` | Selected tab with counts unchanged by the name filter, filtered list | Names and counts |
| VIS-014 | No Projects | 1440×1180 | `…/VIS-014-no-projects-1440x1180.png` | "No Projects yet." box, Index all disabled | — |
| VIS-015 | Panel loading | 1440×1180 | `…/VIS-015-loading-1440x1180.png` | Skeleton cards | — |
| VIS-016 | Panel load error | 1440×1180 | `…/VIS-016-load-error-1440x1180.png` | Red alert, Retry | — |
| VIS-017 | zh-CN default | 1440×1180 | `…/VIS-017-zh-CN-default-1440x1180.png` | All zh-CN copy, sub-navigation labels | Project names (not translated) |
| VIS-018 | zh-CN dialog | 1440×1180 | `…/VIS-018-zh-CN-switch-dialog-1440x1180.png` | zh-CN dialog copy | — |
| VIS-019 | zh-CN download failed | 1440×1180 | `…/VIS-019-zh-CN-download-failed-1440x1180.png` | zh-CN failure copy naming huggingface.co | — |
| VIS-020a–c | Narrow layout, scrolled | 390×1100 (scroll 0 / 700 / 1400) | `…/VIS-020a-narrow-390x1100-scroll-0.png`, `…/VIS-020b-narrow-390x1100-scroll-700.png`, `…/VIS-020c-narrow-390x1100-scroll-1400.png` | Stacked header, wrapped facts, stacked rows | The Settings navigation block above is the existing product behavior |
| VIS-021 | Narrow dialog | 390×1100 | `…/VIS-021-narrow-switch-dialog-390x1100.png` | Dialog at narrow width | — |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root on `personal` after integration (`corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port <port>`), route `/settings?section=server-settings&mode=embedding`.
- Ticket record: `tickets/done/search-model-settings/product-ticket.md`
- Run instructions: `ui-reference-runbook.md` (repository root), section "search-model-settings".
- Relevant supporting artifacts: `design-review-notes.md` (revision history, findings, self-validation round); `visual-references/final-validation.mjs` (SRCH-001…SRCH-019); `visual-references/capture-references.mjs`.
- Relevant journey, transition, or scenario IDs: UXJ-001…UXJ-008, TR-001…TR-020; scenarios listed above.
- Mocked boundaries and limitations: see Data, Contract, And Mock Boundaries. Not modelled: the Advanced table and the raw setting (REQ-009), real downloads, cancel and verification, real indexing and scheduling, the board's status line, Electron external-link handling.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: the placement and naming; the two cards and their list structure; the status-line, facts-line and button treatments; the narrowed fact set; the exact copy and the zh-CN copy; the states, transitions, focus movement and announcements above; the single filled blue button.
- UI reference state, fixtures, and simulated mechanisms that do not prescribe production architecture: the module-level store, the 1 s timeline, the sequential indexing, the scenario seeds, the file and test-id names (`Search*`, `search-*`).
- Fixture content or visible details explicitly allowed to vary: Project names, Task counts and progress numbers; the failure and unavailable reason wording (server-provided); model sizes follow the real catalog bytes.
- Permitted responsive or platform variation: Settings navigation behavior on narrow screens is the existing product's.
- Existing design-system constraints: Tailwind default palette and the Server Settings page patterns named under Visual Language.

## Out Of Scope

- Models outside the catalog, browsing or adding models; an "Index now" link on the board; automatic pre-indexing; scheduling; per-Project or per-collection models; proxy support (`autobyteus-168`); any change to Advanced; licence, indexing speed and memory facts; an estimated total re-indexing time.

## Open Decisions And Risks

- **Decided by the user's approval (2026-10-19):** D-1 inline confirmation for Remove and Rebuild; D-2 Use this model is also offered on a not-downloaded model (the download then happens as part of switching; it is hidden while that model downloads ahead; the active model's own preparing download has no Cancel); D-3 a Project can show "Waiting…" before "Indexing N of M"; D-4 Index all Projects = Index now for every Project that is Not indexed or Needs update, disabled when none and when the model is unavailable, and Needs update progress counts the changed Tasks; D-5 an unavailable model shows every Project as Unavailable with no actions.
- For the Solution Designer / architecture: the requirement impact above; the catalog delivery of size and language label (F-1); the status shape (F-2); the Advanced ↔ Embedding consistency rule (REQ-009); whether downloads of different models may overlap; the Hugging Face link in the desktop host.
- Risk: the language label ("English", "100+ languages") is a UI mapping of catalog values, not a catalog string.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (revision recorded in `product-ticket.md` at finalization)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
