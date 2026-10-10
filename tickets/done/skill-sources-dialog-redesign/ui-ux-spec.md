# UI/UX Specification — Manage Skill Sources popup

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `skill-sources-dialog-redesign` (package `skill-sources-dialog-redesign`)
- Related requirements revision ID: `SR-001` (Draft) — `/Users/normy/autobyteus_org/autobyteus-worktrees/skill-sources-dialog-redesign/tickets/in-progress/skill-sources-dialog-redesign/requirements-doc.md`
- Related IDs: REQ-001..REQ-009, BEH-001..BEH-007, AC-001..AC-008, UC-001..UC-005, SCN-001..SCN-004, QR-001, ASM-001, DEC-001, DEC-002
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (during review): `http://127.0.0.1:4731/skills` → **Sources**
- Explicit user-confirmation reference: 2026-10-10, after round 4: "approved". Round decisions: round 3 → "what is your suggestion, as long as its still clear. i think clean ui is the goal" / "lets go then" (accepts: manual check only after a failed check; keep **Browse…** = DEC-002 include; light only = ASM-001 confirmed). Review history: [review-round-1.md](review-round-1.md) … [review-round-4.md](review-round-4.md).
- Final validation date: 2026-10-10

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (`autobyteus-web`)
- Selected frontend application or product surface: AutoByteus Web — Skills page → **Sources** popup (`SkillSourcesModal`)
- Pinned source commit or revision: baseline `1cd1a3abc126df820e334c023621d0fb82de5b7b` (WEB-BASELINE-REFRESH-008). The touched components are byte-identical up to `origin/personal@d28c56d5d` (currency check in `product-ticket.md`).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- UI reference revision or commit: the finalization commit on `design/skill-sources-dialog-redesign` that adds this specification, integrated into `personal` (exact hashes in `product-ticket.md` → Finalization)
- Ticket folder: `tickets/done/skill-sources-dialog-redesign/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (WEB-BASELINE-REFRESH-008)

## Problem And Design Rationale

- User problem and intent:
  - The popup used a large grey card per source, with a wrapping full path and a full-width red **Remove** button.
  - The add form scrolled away with many sources, and GitHub sources showed raw revision metadata.
  - It looked busy, and the main facts were hard to scan: which source, how many skills, is there an update.
- Key UX decisions and why they were chosen:
  1. **Compact divided rows** in the product's newer dialog frame. The name and skill count lead, and the full path or URL is secondary, truncated, with tooltip and copy. *Why:* scanning, consistent with the Reconnect / Project dialogs.
  2. **No kind word.** The icon tile (folder / GitHub mark) and the URL/path already say the kind; the user called the word "not needed".
  3. **GitHub rows answer one question: is there an update?** One status line. **Update** sits next to *Update available*. The manual check is offered only after a failed check, as **Try again**, because sources are checked every time the dialog opens. Revision details move to the status tooltip and to the Update confirmation, where they matter. *Why:* the user: "they only care whether update available, and then there is a button to update".
  4. **One add input** for both kinds. A web address is imported as a GitHub repository; anything else is added as a folder. The hint follows the input and shows the GitHub trust warning as soon as a URL is typed. *Why:* the user: "its very clear user just put it there the system validate".
  5. **Fixed header, add area and footer**; only the list scrolls. Alerts appear directly above the add form.
  6. **Lighter destructive affordance**: a trash icon (hover red) with the same confirmation. It is never shown on Default.
- Alternatives considered and why they were rejected:
  - Row "⋯" menu: it hides the only action and adds a click.
  - "Add source" button revealing the form: the always-visible form needs no discovery.
  - Bordered list box: it creates a second frame inside the dialog.
  - Local folder / GitHub switch: replaced by the single input in round 3.
  - Button label following the detection (Add Folder ↔ Import repository): the width jumps while typing.
  - ↻ icon for Check again: it read as a second update button.
  - "Check again" link on Up to date rows: it adds nothing, because every open already checks.
  - Hiding *Up to date* entirely: without it, the row can't distinguish fine from never checked.

## Scope And Experience Goal

- User or actor: an AutoByteus user managing where agent skills come from.
- Context: Skills page → **Sources** toolbar button; local desktop app (Electron) or browser context.
- Goal: see the sources and their skill counts at a glance, add a folder or GitHub repository, keep GitHub sources updated, and remove sources safely.
- Observable success: the user can tell each source and its count and whether an update exists without reading metadata. Adding takes one input. Every existing operation still works.
- In-scope surfaces and journeys: `SkillSourcesModal` (header, list, add area, alerts, footer), `SkillSourceRow`, the confirmation body inside the existing `ConfirmationModal`, new UI strings (en, zh-CN).
- Non-goals:
  - store / GraphQL / server, new source types, reordering or renaming, bulk actions
  - Settings → Agent Packages, an app-wide dark theme
  - redesign of `ConfirmationModal` or the skill-name conflict dialog

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001 / BEH-001 / AC-001 | Compact divided rows in the newer dialog frame | UXJ-001; UIS-001; VIS-001, VIS-004 |
| REQ-002 / AC-001 | Name and count primary. Full path/URL secondary, truncated, with full value in tooltip and a copy button. **Kind is shown by the icon tile and the URL/path, not a word** (approved change, see Open Decisions) | VIS-001, VIS-018 |
| REQ-003 / AC-002 | 0 skills → grey **No skills** with hint tooltip | VIS-001 |
| REQ-004 / BEH-004 / AC-003 | Trash icon → existing confirmation; never on Default | UXJ-004; VIS-010, VIS-011, VIS-017 |
| REQ-005 / BEH-002 / BEH-003 / AC-004 | One fixed add input, always visible; folder vs GitHub detected from the input (DC-017); same operations, conflict checks, kept input on failure | UXJ-002, UXJ-003; VIS-005..VIS-009, VIS-015, VIS-016 |
| REQ-006 / AC-005 | Header, add area and footer fixed; list scrolls | VIS-004, VIS-023 |
| REQ-007 / BEH-005 / AC-006 | All GitHub states, errors, **Update** and **Retry removal** shown. Manual check offered after *Check failed* (**Try again**); automatic check on every open. Revision details in the status tooltip and the Update confirmation (approved change, see Open Decisions) | UXJ-005; VIS-002, VIS-003, VIS-012, VIS-013 |
| REQ-008 / BEH-007 / AC-007 / QR-001 | Focus into the dialog, Tab trapped, focus returned; labelled icon buttons; visible focus; Esc closes | VIS-017 |
| REQ-009 / BEH-006 | Busy rules, alerts and messages unchanged except the changes listed here | VIS-007, VIS-013, VIS-014 |
| DEC-001 | This design | all |
| DEC-002 | **Browse…** included: desktop app only, fills the input, never submits | VIS-006, VIS-022 |
| ASM-001 | Light only | all |

## Visual Language

- Existing product language to preserve:
  - the newer dialog frame (as `ReconnectAgentDialog` / `ProjectDialogFrame`)
  - slate neutrals, blue primary, red danger, amber warning, emerald success
  - Iconify Heroicons; `mdi:github` for GitHub
- Layout structure and visual hierarchy:
  - Overlay `fixed inset-0 z-40`, `bg-slate-900/40`, `p-4`, centred.
  - Panel `max-w-[45rem]` (720 px), `max-h-[min(48rem,90vh)]`, flex column.
  - Regions, top to bottom:
    1. header (fixed)
    2. list (`flex-1 overflow-y-auto`, the only scrolling region)
    3. add area (fixed, `border-t border-slate-200`)
    4. footer (fixed, `border-t border-slate-100 bg-slate-50`, `px-4 py-3`, `sm:px-6`)
- Grid, dimensions, spacing, and density:
  - Header: `py-4 pl-4 pr-3`, `sm:pl-6 sm:pr-4`, `border-b border-slate-100`.
  - List: `divide-y divide-slate-100`, `py-1`.
  - Row: `px-4 py-2.5`, `sm:px-6`. Grid columns ≥ sm: `2rem | minmax(0,1fr) | 4.5rem | 2rem`, `gap-x-3`. Below sm: `minmax(0,1fr) | auto | auto`, `gap-x-2`, icon tile hidden.
  - Row lines:
    - line 1: name (+ Default badge) | count (right-aligned) | trash
    - line 2: URL/path + copy, `mt-0.5`
    - GitHub status line: `mt-1.5`, `min-h-6`, `gap-x-2`
    - error: `mt-1`
  - Add area: `px-4 pb-4 pt-3`, `sm:px-6`. Label `mb-2`; input row `gap-2`; hint `mt-2`; alerts `mb-3 space-y-2` above the form.
- Typography:
  - Product sans; monospace for paths, URLs and revisions.
  - Title: `text-lg font-semibold text-slate-900`.
  - Name: `text-sm font-medium leading-5 text-slate-900`, truncated.
  - Count: `text-[13px] leading-5 tabular-nums`, slate-700 (slate-400 for No skills).
  - Path/URL: `font-mono text-[11.5px] text-slate-500`, single line, truncated.
  - Status line: `text-xs`, status `font-medium`.
  - Add label: `text-[13px] font-medium text-slate-700`.
  - Input: `font-mono text-[13px]`; placeholder in sans, slate-400.
  - Hint: `text-xs leading-5 text-slate-500`.
- Color values and semantic roles:

  | Status | Text | Dot |
  | --- | --- | --- |
  | Up to date | slate-600 | emerald-500 |
  | Update available | amber-700 | amber-500 |
  | Check failed / Update failed / Removal incomplete | red-700 | red-500 |
  | Not checked | slate-500 | slate-300 |
  | Checking… / Updating… | slate-500 | spinner `svg-spinners:ring-resize` (slate-400) |

  - Default badge: `bg-blue-50 text-blue-700`, 11 px.
  - Icon tiles: Default `bg-blue-50 text-blue-600`; others `bg-slate-100 text-slate-600`.
  - Error line: red-700 with a `heroicons:exclamation-circle-20-solid` red-500 icon.
- Surfaces, borders, radii, shadows:
  - Panel: `rounded-2xl shadow-xl bg-white`.
  - Icon tile: 32 px, `rounded-lg`.
  - Row hover: `bg-slate-50/70`.
  - Alert bars: `rounded-lg`, 1 px border, `px-3 py-1.5`, 13 px text.
    - error: red-200 / red-50 / red-800
    - success: emerald-200 / emerald-50 / emerald-900
    - warning: amber-200 / amber-50 / amber-900
  - Input: `h-9 rounded-lg border-slate-300`. Focus: `border-blue-500 ring-2 ring-blue-500/20`.
- Controls, icons, imagery:
  - Close: `heroicons:x-mark`, 32 px icon button.
  - Remove: `heroicons:trash` 16 px in a 32 px button, slate-400; hover `bg #fef2f2`, red-600.
  - Copy: `heroicons:clipboard-document` 14 px in a 24 px button; `clipboard-document-check` emerald-600 for 1.5 s after copying.
  - **Update** chip: 24 px high, `rounded-md`, `border-blue-200 bg-blue-50 text-blue-700`, hover `bg-blue-100`, icon `heroicons:arrow-up-circle`.
  - **Retry removal** chip: `border-red-200 bg-white text-red-700`, hover `bg-red-50`, icon `heroicons:arrow-path`.
  - **Try again**: a text button (slate-500, `font-medium`; hover slate-800 + underline), preceded by a slate-300 `·`.
  - **Add**: primary, `h-9 rounded-lg bg-blue-500` (hover blue-600), white, `heroicons:plus`.
  - **Browse…** and **Done**: secondary, `h-9 rounded-lg`, 1 px slate-200 border, white, slate-700 text, hover `bg-slate-50`.
- Hover, active, focus, selected, disabled, validation, and feedback treatment:
  - Focus ring: icon buttons and chips use a 2 px blue-500 ring; primary and secondary buttons use a 2 px white + 4 px blue-500 ring.
  - Disabled: opacity .4–.5 and `not-allowed`.
  - While any operation runs, every action and the add form are disabled.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Skill sources dialog | Frame, list, add area, alerts, footer | loading, populated, many (scrolling), registry error, busy | `components/skills/SkillSourcesModal.vue` |
| Source row | One source | Default / local / GitHub; count 0, 1, n; GitHub statuses (table above); busy; copied | `components/skills/SkillSourceRow.vue` |
| Add skill source input | Add a folder or import a GitHub repository | empty, path typed (neutral hint), URL typed (trust hint), working, error (input kept), success (input cleared); **Browse…** in the desktop app only | `SkillSourcesModal.vue` (form) |
| Confirmation body | Source card inside the existing danger `ConfirmationModal` | remove local (unlink), remove GitHub (delete copy), update (adds `branch installed → latest`) | `SkillSourcesModal.vue` (`ConfirmationModal` slot) |
| Display name rule | Row name | GitHub → `owner/repo`; folder → last segment, or `parent/skills` when the last segment is the generic `skills` | `utils/skills/skillSourceDisplay.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User, Skills page | Dialog closed | Review sources, counts and update state | List shown; GitHub sources checked | UC-001, REQ-001..003, REQ-006 |
| UXJ-002 | User | Dialog open | Add a local folder | New row; success alert; input cleared | UC-002, REQ-005 |
| UXJ-003 | User | Dialog open | Import a GitHub repository | New GitHub row; success alert | UC-002, REQ-005 |
| UXJ-004 | User | Dialog open | Remove a non-default source | Row gone; success alert | UC-003, REQ-004 |
| UXJ-005 | User | GitHub row shows a state | Update / try again / retry removal | Row shows the new status | UC-004, REQ-007 |
| UXJ-006 | User | Dialog open | Close | Dialog closed; focus back on **Sources** | UC-005, REQ-008 |

## Journey Details

- **UXJ-001 Review.**
  1. Skills → **Sources** opens the dialog with focus on the panel. The list shows *Loading sources* until the first load (`skills.components.skills.SkillSourcesModal.loading_sources`).
  2. Order: Default first, then by path.
  3. GitHub sources are checked automatically on open. Their rows show *Checking…* and all actions are disabled until the check ends (VIS-002).
  4. Result: VIS-001. Many sources scroll inside the list only (VIS-004).
- **UXJ-002 Add folder.**
  1. Type a path, or click **Browse…** (desktop app only), which fills the input.
  2. **Add** shows a spinner and *Working…*; everything is disabled (VIS-007).
  3. Success: a green alert *Source is available. Skills list refreshed.*, the input clears, the row appears (VIS-008).
  4. Failure: a red alert with the server message; the typed path is kept (VIS-009).
  5. Duplicate skill names open the existing conflict dialog; the path is kept (VIS-016).
- **UXJ-003 Import GitHub.**
  1. Type or paste a URL. The hint switches to the trust warning with a shield icon (VIS-005).
  2. **Add** runs the import.
  3. Success as UXJ-002. Import warnings appear as an amber alert (VIS-015).
  4. A non-GitHub or non-root URL gets the import's message and the URL is kept.
- **UXJ-004 Remove.**
  1. The trash icon opens the danger confirmation: the existing message, then a source card with the icon, name and full path wrapping (VIS-010 local *unlink*, VIS-011 GitHub *delete copy*).
  2. Cancel changes nothing.
  3. Confirm: success alert *Skill source removed. Skills list refreshed.*
  4. A GitHub removal that cannot finish leaves the row at *Removal incomplete* with **Retry removal** (VIS-003).
- **UXJ-005 GitHub maintenance.**
  1. **Update** opens the confirmation *Update entire skill source?* with the warning text. The source card adds `main 9a8b7c6d5e → c0ffee1234` (VIS-012).
  2. Confirm: *Updating…* (VIS-013), then *Up to date* and a success alert *Source is up to date. Skills list refreshed.*
  3. *Update failed* keeps **Update** to retry.
  4. *Check failed* offers **Try again**, which runs a check (*Checking…*).
  5. **Retry removal** opens the remove confirmation again.
- **UXJ-006 Close.** ×, **Done**, a click on the overlay, or Esc closes the dialog. Esc is ignored while a confirmation is open. Focus returns to the **Sources** button.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Manage Skill Sources | `/skills` → **Sources** | Review and manage sources; primary action **Add** | Header (title, ×) / scrolling list / fixed add area (alerts, label, input, Browse…, Add, hint) / footer (Done) | VIS-001 |
| UIS-002 | Remove confirmation | Trash or Retry removal | Confirm removal | Existing `ConfirmationModal` (danger) + source card | VIS-010, VIS-011 |
| UIS-003 | Update confirmation | **Update** | Confirm update | Existing `ConfirmationModal` (danger) + source card + version change line | VIS-012 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Dialog opening | Open | Loading line; then GitHub rows *Checking…*, actions disabled | Populated list with statuses | `fetchSkillSources`, then `checkGitHubSources` | All |
| TR-002 | Add area | Input changes | Hint: URL → trust warning (shield); otherwise neutral hint | — | Detection `^\s*(https?://\|www\.\|github\.com/)` (case-insensitive) | Add when non-empty |
| TR-003 | Add area | **Add** with a path | Spinner + *Working…*; all disabled | Success alert + new row + cleared input, or error alert + kept input, or conflict dialog | `addSkillSource(path)` via skill-name checks; catalog refresh | All |
| TR-004 | Add area | **Add** with a URL | Same as TR-003 | Same; import warnings as an amber alert | `githubOperation('import', url)` | All |
| TR-005 | Add area | **Browse…** | Native folder dialog | Input filled (never submitted); focus back to input | desktop folder picker | Add |
| TR-006 | Row | Trash / Retry removal | Confirmation opens; dialog inert | — | — | Cancel / Remove |
| TR-007 | Remove confirmation | Remove | Confirm pending | Row removed + success alert, or *Removal incomplete* | local: unlink; GitHub: delete copy; catalog refresh | All |
| TR-008 | GitHub row | **Update** | Update confirmation | — | — | Cancel / Update |
| TR-009 | Update confirmation | Update | *Updating…*; all disabled | *Up to date* + success alert, or *Update failed* + error | `githubOperation('update')`; catalog refresh | All |
| TR-010 | GitHub row *Check failed* | **Try again** | *Checking…*; all disabled | New status | `githubOperation('check')` | Per status |
| TR-011 | Row | Copy | Icon → check (emerald) and tooltip *Copied* for 1.5 s | — | Clipboard = full path/URL | — |
| TR-012 | Dialog | ×, Done, overlay, Esc | — | Closed; focus to **Sources** | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| List / loading | First load | Spinner + *Loading sources* | Close | — | — |
| List / populated | Loaded | Rows as specified | All | — | VIS-001 |
| List / many | ≥ 8 sources | List scrolls; header, add area and footer stay | All | — | VIS-004, VIS-023 |
| Row / Default | Default source | Blue tile + **Default** badge; no trash | Copy | — | VIS-001 |
| Row / 0 skills | count 0 | *No skills* slate-400, tooltip *No skills found here. A source needs a SKILL.md at its root or skill folders that each contain one.* | Copy, Remove | — | VIS-001 |
| Row / 1 skill | count 1 | *1 skill* | — | — | VIS-001 |
| GitHub / Up to date | Status | `● Up to date`; tooltip on the status: `Installed <10-char rev> · <branch>` / `Latest <rev>` / `Checked <medium date, short time>` | Copy, Remove | — | VIS-001 |
| GitHub / Not checked | Status | `● Not checked` | Copy, Remove | Automatic check on the next open | — |
| GitHub / Checking… / Updating… | Operation | Spinner + text; every action disabled | — | — | VIS-002, VIS-013 |
| GitHub / Update available | Status | `● Update available` + **Update** chip | Update, Copy, Remove | — | VIS-001 |
| GitHub / Check failed | Status | `● Check failed — installed skills retained · Try again`, error line below | Try again, Copy, Remove | Try again | VIS-001, VIS-003 |
| GitHub / Update failed | Status | `● Update failed — previous version retained` + **Update**, error line below | Update, Copy, Remove | Update | VIS-003 |
| GitHub / Removal incomplete | Status | `● Removal incomplete` + **Retry removal**, error line below; no trash, no Try again | Retry removal, Copy | Retry removal | VIS-003 |
| Alerts / registry error | Load failure | Red alert above the form | Close | Reopen | VIS-014 |
| Alerts / success, warning | Operation result | Green / amber alert above the form | — | — | VIS-008, VIS-015 |
| Add / browser context | No desktop folder picker | No **Browse…** | Add | — | VIS-022 |
| Narrow | < 640 px | Icon tile hidden; input full width; Add full width below | All | — | VIS-019, VIS-020 |

## Content, Labels, Validation, And Feedback

- Product voice and wording conventions to follow: sentence case; short status text; em dash in status suffixes.
- Exact labels, headings, and action text for new or changed controls (en / zh-CN):

  | Key | en | zh-CN |
  | --- | --- | --- |
  | `skills.sources.addSource` (add label) | Add skill source | 添加技能来源 |
  | `skills.sources.inputPlaceholder` | Folder path or GitHub repository URL | 文件夹路径或 GitHub 仓库地址 |
  | `skills.sources.inputHint` | A folder on this computer that contains skills, or a public GitHub repository URL. | 本机上包含技能的文件夹，或公开的 GitHub 仓库地址。 |
  | `skills.sources.add` (button) | Add | 添加 |
  | `skills.sources.tryAgain` | Try again | 重试 |
  | `skills.sources.status.REMOVING_SHORT` | Removal incomplete | 移除未完成 |
  | `skills.sources.browse` | Browse… | 浏览… |
  | `skills.sources.oneSkill` | 1 skill | — |
  | `skills.sources.noSkills` / `noSkillsHint` | No skills / (hint above) | — |
  | `skills.sources.copyPath` / `copyUrl` / `copied` | Copy path / Copy URL / Copied | — |
  | `skills.sources.removeNamed` (aria) | Remove {{name}} | — |
  | `skills.sources.checkNamed` (aria of Try again) | Check {{name}} again | — |
  | `skills.sources.close` | Close | — |
  | `skills.sources.listLabel` (aria) | Skill sources | — |

  - Unchanged existing copy, used as is: title *Manage Skill Sources*, *Done*, the trust hint, all `skills.sources.status.*` texts, the confirmation titles and messages, and the success / warning / error messages.
  - No longer used by this dialog: `skills.sources.sourceType`, `skills.sources.repositoryUrl`, `skills.sources.import`, `skills.sources.check`, `skills.sources.status.REMOVING`, and the old folder label / placeholder / hint / *Add Folder* keys.
- Empty, error, and recovery messages: the existing store and server messages, shown as the red alert (add) or the row error line (GitHub).

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Add skill source | text, monospace, no autocomplete/spellcheck | Yes (Add disabled when empty or whitespace) | URL (`http(s)://`, `www.`, `github.com/`) → GitHub import, validated by the import (public repository root, default branch); otherwise → local folder, validated by the add operation | On **Add** | Existing operation messages, e.g. *Enter a public GitHub repository root URL, for example https://github.com/owner/repository.*; *Directory not found: <path>*. Input kept on failure; cleared on success |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 640 px (`sm`) | 720 px panel; icon tile column; input row = input + Browse… + Add | — |
| Narrow | < 640 px | Panel fills width minus 16 px; no icon tile; row grid `1fr auto auto`; input full width; Add full width below (`.input-group` wraps) | Same |
| Short window | e.g. 1024×700 | Panel `max-h 90vh`; list shrinks and scrolls | Same (VIS-023) |
| Desktop app (Electron, local node) | Folder picker available | **Browse…** shown | Native folder dialog |
| Browser / remote node | No folder picker | No **Browse…** | Type or paste only (VIS-022) |

## Accessibility And Keyboard Behavior

- Accessibility target: QR-001 (keyboard operable, visible focus, labelled icon buttons, labelled dialog).
- Focus order, movement, and return:
  - On open, focus goes to the panel.
  - Tab and Shift+Tab cycle inside the panel.
  - The dialog is `inert` while a confirmation is open.
  - On close, focus returns to the element that opened the dialog (**Sources**).
- Keyboard: every control is a native button or input. Enter in the input submits **Add**. Esc closes, except while a confirmation is open.
- Roles, names, states, and live announcements:
  - Dialog: `role="dialog"`, `aria-modal`, `aria-labelledby` (title), and `aria-busy` while operations run.
  - List: `aria-label` *Skill sources*.
  - Rows: `aria-busy` while pending. Status: `role="status"`.
  - Visually hidden kind text (*GitHub* / *Local folder*) before the path.
  - Trash: *Remove {name}*. Try again: *Check {name} again*. Copy: *Copy path* / *Copy URL* / *Copied*.
  - The input is described by the hint (`aria-describedby`); the hint is `aria-live="polite"`, so the switch to the trust warning is announced.
- Contrast: body text slate-500 or darker on white; status reds/ambers use the 700 tones.
- Limitation: the revision tooltip is a native `title` on the status (pointer only). The same information is available in the Update confirmation.

## Motion And Transitions

- Motion: colour transitions .15 s on hover for buttons and rows. Spinners (`svg-spinners:ring-resize`) for loading and busy. The copied state lasts 1.5 s.
- Durations and easing: browser default easing, .15 s.
- Reduced-motion behavior: no movement besides spinners; unchanged from baseline.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Skill sources list, GitHub status | Rows, statuses, revisions, errors | Synthetic fixture `prototype/skill-sources/skillSourcesDesignFixture.ts` answered locally for GraphQL operations; scenarios `populated`, `skill_source_issues`, `skill_sources_many`, `skill_sources_registry_error`; fixed delays | Existing store / GraphQL, unchanged |
| Add / import | Results, errors, warnings, conflicts | Scripted by the typed value (e.g. `missing` → not found, `duplicate` → conflict, `with-warnings` → warning, non-GitHub URL → import error) | Existing operations; the UI must choose the operation by the DC-017 rule |
| Folder picker | **Browse…** | Returns `/synthetic/selected-folder` | Existing desktop IPC (`showFolderDialog`) |
| Clipboard | Copy | Browser clipboard | Same |

## Final Visual Reference Inventory

All references were captured 2026-10-10 after approval and final validation, at deviceScaleFactor 2, locale en (VIS-021 zh-CN), timezone Europe/Berlin. Paths are relative to this ticket folder.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 populated: Default, Up to date, Check failed + Try again, Update available + Update, local 0/1/n skills | 1440×900 | `visual-references/VIS-001-populated-mixed-list-desktop-1440x900.png` | Frame, row structure, no kind word, status lines, Try again only on Check failed, count column, trash, add area, footer | Source names, paths, counts, revisions, error text, background page |
| VIS-002 | Opening: GitHub *Checking…*, actions disabled | 1440×900 | `visual-references/VIS-002-opening-checking-github-desktop-1440x900.png` | Spinner status, disabled state | Same |
| VIS-003 | Update failed + Update; Removal incomplete + Retry removal; errors | 1440×900 | `visual-references/VIS-003-github-issues-update-failed-removal-incomplete-desktop-1440x900.png` | Short *Removal incomplete*, chips, error lines, no trash on removing row | Same |
| VIS-004 | Many sources, scrolled | 1440×900 | `visual-references/VIS-004-many-sources-scrolled-desktop-1440x900.png` | Only the list scrolls | Same |
| VIS-005 | GitHub URL typed → trust hint | 1440×900 | `visual-references/VIS-005-add-github-trust-hint-desktop-1440x900.png` | Single input, Add enabled, shield + trust text | URL value |
| VIS-006 | Browse… filled the path | 1440×900 | `visual-references/VIS-006-add-local-browse-filled-desktop-1440x900.png` | Browse… position, neutral hint | Path value |
| VIS-007 | Add working | 1440×900 | `visual-references/VIS-007-add-local-working-desktop-1440x900.png` | Spinner + *Working…*, disabled | Path value |
| VIS-008 | Add success | 1440×900 | `visual-references/VIS-008-add-local-success-desktop-1440x900.png` | Green alert above form, input cleared, new row | Names |
| VIS-009 | Add error, input kept | 1440×900 | `visual-references/VIS-009-add-local-error-kept-input-desktop-1440x900.png` | Red alert above form, kept value | Message path |
| VIS-010 | Remove confirmation, local | 1440×900 | `visual-references/VIS-010-remove-confirmation-local-desktop-1440x900.png` | Unlink message + source card | Names |
| VIS-011 | Remove confirmation, GitHub | 1440×900 | `visual-references/VIS-011-remove-confirmation-github-desktop-1440x900.png` | Delete-copy message + source card | Names |
| VIS-012 | Update confirmation | 1440×900 | `visual-references/VIS-012-update-confirmation-desktop-1440x900.png` | Version change line `branch rev → rev` | Branch, revisions |
| VIS-013 | Updating busy | 1440×900 | `visual-references/VIS-013-updating-busy-desktop-1440x900.png` | *Updating…*, disabled | Same |
| VIS-014 | Registry error | 1440×900 | `visual-references/VIS-014-registry-error-desktop-1440x900.png` | Red alert placement | Message |
| VIS-015 | Import warning | 1440×900 | `visual-references/VIS-015-import-warning-desktop-1440x900.png` | Amber alert placement | Message |
| VIS-016 | Duplicate-name conflict | 1440×900 | `visual-references/VIS-016-duplicate-name-conflict-desktop-1440x900.png` | Existing conflict dialog over the popup; input kept | Names |
| VIS-017 | Keyboard focus on Remove | 1440×900 | `visual-references/VIS-017-keyboard-focus-remove-desktop-1440x900.png` | Focus ring | — |
| VIS-018 | Row hover / tooltip target | 1440×900 | `visual-references/VIS-018-hover-row-tooltip-target-desktop-1440x900.png` | Row hover tint | Native tooltip not captured |
| VIS-019 | Narrow list | 390×844 | `visual-references/VIS-019-narrow-list-mobile-390x844.png` | No icon tile; truncation; status lines | Same |
| VIS-020 | Narrow add area | 390×844 | `visual-references/VIS-020-narrow-add-mobile-390x844.png` | Full-width input and Add | Same |
| VIS-021 | zh-CN | 1440×900 | `visual-references/VIS-021-zh-cn-desktop-1440x900.png` | Translated labels | Same |
| VIS-022 | Browser context | 1440×900 | `visual-references/VIS-022-browser-context-no-browse-desktop-1440x900.png` | No Browse… | Same |
| VIS-023 | Small window | 1024×700 | `visual-references/VIS-023-small-window-desktop-1024x700.png` | Fixed regions; list scrolls | Same |

## Linked UI Reference Evidence

- Runnable UI reference: design repository `personal`. Run `corepack pnpm dev --port <port> --host 127.0.0.1`, open `/skills` → **Sources**. The scenario is set with `localStorage['autobyteus.prototype.scenario']` and the context with `localStorage['autobyteus.prototype.context']` (`electron_internal` shows Browse…).
- Ticket record: [product-ticket.md](product-ticket.md)
- Run and validation scripts: `prototype/skill-sources/review-scripts/validate.mjs` (V01–V20), `capture.mjs` (states R01–R23 = VIS-001–VIS-023)
- Final validation evidence: [review-evidence/final/](review-evidence/final/) (`validate-results.json` 20/20; `capture-results.json` 23/23; 0 browser errors; 0 non-local requests)
- Review rounds: [review-round-1.md](review-round-1.md), [review-round-2.md](review-round-2.md), [review-round-3.md](review-round-3.md), [review-round-4.md](review-round-4.md)
- Design changes: DC-001..DC-020 (round notes). DC-003's ↻ icon, DC-004's mode switch, and DC-012's visibility rule are superseded by DC-016 and DC-020.

## Implementation Fidelity Boundary

- Must preserve exactly:
  - all visible structure, copy, states and per-status presentation above
  - the detection rule (DC-017)
  - Try again only on *Check failed*
  - version details only in the tooltip and the Update confirmation
  - no visible kind word (screen-reader kind kept)
  - fixed header / add area / footer
  - focus behavior
- UI reference mechanisms that do not prescribe production: the design fixture, scripted outcomes and delays, and the `apolloClient` design-layer hook.
- Allowed to vary: fixture names, paths, counts, revisions, dates and error texts; native tooltip appearance.
- Permitted platform variation: Browse… exists only where the desktop folder picker is available.
- Design-system constraints: Tailwind tokens and Iconify icons as in the existing product. `ConfirmationModal` and the conflict dialog are unchanged.

## Out Of Scope

- Store/GraphQL/server changes; new source types; reorder or rename; bulk actions; Settings → Agent Packages; dark theme; redesign of `ConfirmationModal` or the conflict dialog.

## Open Decisions And Risks

- No open product decision (DEC-001 approved, DEC-002 included, ASM-001 confirmed).
- **Requirement wording to update (Solution Designer):** these approved changes differ from the literal SR-001 text.
  - AC-001 "name + kind + count": the kind is shown by the icon tile and URL/path, not a word.
  - REQ-005 / AC-004: the add kind is detected from the input (DC-017), not chosen.
  - REQ-007 / AC-006: revision metadata only in the tooltip and the Update confirmation. The manual check is offered only after *Check failed*; there is an automatic check on every open.
- Risk: an input such as `gitlab.com/x` (no scheme, not github.com) is treated as a folder path and fails with the folder error. Accepted; the hint names both accepted forms.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (Not checked and loading are described in text; both are transient)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
