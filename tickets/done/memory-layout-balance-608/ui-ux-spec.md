# UI/UX Specification — Memory page layout balance (`memory-layout-balance-608`)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: Project Task `autobyteus-608` / Product ticket `memory-layout-balance-608`
- Related requirements revision ID: Task `autobyteus-608` description (2026-11-25) with the founder's screenshot of Memory → Agent → Semantic memory (2026-11-22). No requirements doc exists; this is a layout and visual-balance change.
- Related requirement, behavior, acceptance-criteria, and decision IDs: `autobyteus-608` items 1–4 (heavy header stack; cramped split pane and truncation; oversized Markdown headings; cohesion across all Memory views). Related: `autobyteus-554` (Memory page by owner, DONE).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: `http://127.0.0.1:4568/memory` (LAN `http://192.168.2.158:4568/memory`, tailnet `https://normys-macbook-pro.tail0347f8.ts.net:8447/memory`)
- Explicit user-confirmation reference: the founder, 2026-11-26, after six review rounds (desktop and his Android phone): "Okay if you think that UI is consistent and clean now we're done." The designer's final check (all Memory views at 1440×900, 1280×800, 390×844; 0 page errors) found the UI consistent and clean, which completes that conditional approval. Round history: `product-ticket.md`, Rounds 2–6.
- Final check date: 2026-11-26

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web` → `/memory` (Browse: Global, Agents, Agent Teams, Agent Orgs; owner pages; Search; Index; run inspector: Work Journal, Raw Traces)
- Pinned source commit or revision: Memory surfaces at `8430d9ef12` (scoped refresh `memory-baseline-refresh-554`) plus the approved design `semantic-memory-view-554`. The source has since shipped autobyteus-554 (`56b02294d0`, `a9ca3c48c6`, `cd26f4d913`) and touched `FileExplorerTabs.vue` (`4c77e3e78a`, error-label spacing only). Engineering applies the deltas below to the shipped components; see Implementation Fidelity Boundary.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- UI reference revision or commit: ticket branch `design/memory-layout-balance-608`, base `9bec8f39f3efb2c4f1addd23e8bc84c6c3d7f885`; the ticket commit is recorded in `product-ticket.md` (Integration).
- Ticket folder: `tickets/done/memory-layout-balance-608/` (after finalization)
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`, section "Scoped refresh `memory-baseline-refresh-554`"

## Problem And Design Rationale

- User problem and intent: the founder found the Memory page unbalanced. A five-row header stack (Browse/Search/Index; Back; name, subtitle, raw ID; Episodic/Semantic; raw URL-encoded folder path) took ~40% of the window before any content. File names were cut off early, and document headings were poster-sized.
- Key UX decisions and why:
  1. **Remove what gives no value, then lay out** (the founder's principle, round 4). Before rearranging, every word, ID, label and control was asked what it gives the user. Repeated words, IDs that repeat the name, titles that repeat the selected tab, labels that repeat the box or tab, and Apply/Go buttons that Enter already covers were removed. Details that are sometimes needed (IDs, full paths, descriptions) live in tooltips or a copy action.
  2. **A page you drill into is its own page** (round 2). Agent, team, org and run pages drop Browse | Search | Index; one quiet Back remains.
  3. **One header row** (round 3). Back (showing where it goes), the name, and the page's own switch (and filter) share one row; vertical space goes to the content.
  4. **One control style per kind of choice** (round 6). Every picker is a bordered box with one down arrow. There are no ⇅ chevrons or number spinners, and a picker appears only when there is more than one thing to pick.
  5. **The reader fills the window.** The semantic-memory panel and the Work Journal take the remaining height; document typography is proportional to the pane.
- Alternatives considered and rejected:
  - Decoding the `%3A` in the folder path: rejected. That *is* the folder's real name; showing a decoded path would show a path that does not exist. The path moved to a "Copy folder path" action instead.
  - A narrower file list (≈260 px): rejected. It truncates names such as `network-settings-and-routing-facts.md` again (the original complaint).
  - Keeping Browse | Search | Index on owner pages with Back beside it (round 1): replaced at the founder's request (round 2).
  - A borderless file-name picker with a ⇅ chevron (round 5): replaced by the shared bordered picker at the founder's request (round 6).

## Scope And Experience Goal

- User or actor: the node's owner reading agent, team, org and global memory (desktop app and phone browser).
- Context: Memory page, `autobyteus-web`.
- Goal: read memory with the header out of the way; every view feels like one calm, consistent page.
- Observable success (1440×900): an owner page's content starts at 85 px from the top (was 153 px after round 1; ≈40% of the window before); Global memory's panel at 74 px (was 129 px); no file name truncated in the file list at desktop widths; no page errors.
- In-scope surfaces and journeys: UXJ-001…UXJ-006 below.
- Non-goals: Search and Index pages (already minimal; unchanged); semantic-memory behaviour (`autobyteus-554`); the app's left navigation; the Files panel and Skills page beyond the two shared-component changes in DC-010/DC-011.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| 608-1 heavy header stack | One header row on owner and run pages; no title row on Global; Browse/Search/Index only on top-level pages | UXJ-001…006; UIS-001…006 |
| 608-2 cramped split pane & truncation | Reader fills the window; 280/300 px file list; read-only file tabs up to 320 px with full name in tooltip; path bar removed | UXJ-001, UXJ-002; UIS-002, UIS-003 |
| 608-3 oversized Markdown headings | Proportional reader typography (see Visual Language) | UIS-002, UIS-003 |
| 608-4 cohesion across all Memory views | Same header pattern, card density, picker style and Back text on every view | all |

## Visual Language

- Existing product language to preserve: Tailwind grey surfaces (`bg-gray-50` canvas, white cards, `border-gray-200`), blue-600 primary (Browse/Search/Index selected), 8 px radii on cards, Inter/system UI font, heroicons.
- Layout structure and hierarchy:
  - Page container: `max-w-7xl`, padding 20 px × 16 px (phone) / 28 px × 20 px (≥640 px).
  - **Top-level pages** (Global, Agents, Agent Teams, Agent Orgs): one row = Browse | Search | Index (segmented, blue selected) · 1 px divider · Global | Agents | Agent Teams | Agent Orgs (text tabs, selected `bg-gray-200/80`). Content directly below (gap 16 px).
  - **Owner and run pages** (agent, team, org, Work Journal / Raw Traces): one header row, bottom border `border-gray-200`, padding-bottom 12 px:
    - left: Back button (`← <where it goes>`, 14 px medium, `text-gray-500`, hover blue-600 on `bg-gray-200/60`) · `/` (`text-gray-300`) · name as `h1` (18 px semibold, `tracking-tight`, `text-gray-900`, truncates);
    - right: filter (episodic runs / team runs, 240 px, ≥640 px) then the page switch (grey segmented `bg-gray-200/75`, selected white with `shadow-sm`, count pill).
  - Below 640 px: the filter and the switch each take a full-width row under Back / name.
- Grid, dimensions, spacing, density:
  - Card grids: 1 / 2 (≥768) / 3 (≥1280) columns, gap 14 px. Cards `p-4`, 8 px radius, hover `border-gray-300 shadow-sm`.
  - Semantic panel: 12 px radius, `shadow-sm`, fills to the window bottom (min 460 px); file list 280 px (≥768) / 300 px (≥1024), `bg-gray-50/70`, list search row 46 px aligned with the tab bar; below 768 px the list sits above the document (max 34vh).
  - Work Journal lines: fill the window (`max-height: calc(100vh − 215px)` ≥768 px); line numbers 56 px (≥640) / 40 px (phone).
- Typography:
  - Reader (`.semantic-memory-reader .markdown-body`): body 14 px / 1.65, `#374151`; h1 22 px semibold, line-height 1.3, letter-spacing −0.015em, bottom hairline `#f3f4f6`, margin-bottom 0.9rem; h2 17.6 px semibold, top 1.4rem; h3 15.2 px semibold; lists 0.3rem item spacing; inline code 13 px on `#f3f4f6`, radius 4 px, no backticks; tables 13 px; text measure max 74ch, padding 12 px × 20 px.
  - Card title 14 px semibold; secondary lines 12 px `text-gray-500`; times `text-gray-400`.
- Colors and roles: unchanged palette; Back and secondary text `gray-500`; separators `gray-300`; active file `emerald` "Active" pill unchanged.
- Surfaces, borders, radii, shadows: unchanged except the semantic panel (12 px radius, `shadow-sm`, no inner card chrome on the viewer).
- Controls and icons:
  - **Picker** (Work Journal file below 1280 px, Raw Traces file, Jump to day): bordered box `border-gray-200`, white, radius 6 px, text 14 px (Jump to day 12 px), padding-right 32 px, `heroicons:chevron-down-20-solid` 16 px `text-gray-500` at right 8 px; focus `border-blue-500 ring-2 ring-blue-100`. No native arrow, no ⇅.
  - Number fields (Show, Go to line): no spinner.
  - Back: `heroicons:arrow-left-20-solid` 16 px.
  - Markdown file icon in file lists: heroicons-style document outline 14 px, `text-blue-500/80` (DC-011).
  - "Copy folder path": 12 px `text-gray-500`, clipboard icon; after copying, check icon `text-green-600` and "Copied" for 1.5 s.
- States: hover/focus as above; every control keeps `focus-visible:ring-2 ring-blue-500`.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Owner header row | Back + name + filter + switch | agent (Episodic/Semantic, filter on Episodic), team/org (Members/Runs, filter on Runs), unattributed (Episodic only) | `components/memory/AgentMemoryPage.vue`, `GroupMemoryPage.vue` |
| Run header row | Back + run title + Work Journal/Raw Traces | run title known / unknown (falls back to run ID · workspace) | `components/memory/MemoryInspector.vue` |
| Top-level bar | Browse/Search/Index + Browse tabs | Global (tooltip = Global memory description) | `components/memory/MemoryHome.vue`, `MemoryBrowse.vue` |
| Semantic reader | File list + document, filling the window | auto-opens the first root document; "Copy folder path" at the list's foot | `components/memory/SemanticMemoryFolder.vue` |
| Run cards | Agent runs; team/org runs | workspace · time on one line; team: time beside title, member chips name-only | `AgentMemoryPage.vue`, `CollaborationMemoryDetail.vue` |
| File picker | Choose a journal / trace file | shown only for 2+ files; one file named as text | `WorkJournalTab.vue`, `RawTracesTab.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Owner, desktop/phone | Memory → Agent Teams → Software Engineering Team → Solution Designer | Read an agent's semantic memory | Document open, reader filling the window | 608-1, 608-2, 608-3 |
| UXJ-002 | Owner | Memory → Global | Read global memory | `product.md` open | 608-1, 608-2, 608-4 |
| UXJ-003 | Owner | Memory → Agents → Project Task Manager | Find a run in episodic memory | Filtered run cards | 608-1, 608-4 |
| UXJ-004 | Owner | A team page | See members and the team's runs | Members cards / filtered run cards | 608-1, 608-4 |
| UXJ-005 | Owner | A run card | Read the run's Work Journal, switch files | Journal at a chosen file / day / line | 608-1, 608-4 |
| UXJ-006 | Owner | A run's Raw Traces | Read raw traces, switch files, change the limit | Trace entries of the chosen file | 608-4 |

## Journey Details

- **UXJ-001**: click Agent Teams → the team card → Solution Designer (Members) → Semantic memory. Header: `← Software Engineering Team / Solution Designer` (no "Belongs to Software Engineering Team": Back names it) and the switch at the right. The first root-level document opens automatically (TR-004). Clicking a file in the list opens it as a tab; long names show in full up to 320 px with the name in the tab's tooltip. Back returns to the team page (TR-001). VIS-001, VIS-002, VIS-003.
- **UXJ-002**: click Global. There is no title row; hovering the Global tab shows "Knowledge shared by every agent, agent team and agent org on this node. Every agent reads it and writes to it." The reader shows `product.md`. "Copy folder path" copies the full path. VIS-006, VIS-007.
- **UXJ-003**: Agents → Project Task Manager → Episodic memory (default). Header: `← Memory / Project Task Manager`, filter, `Episodic memory 16 | Semantic memory`. Typing filters cards by title, run ID, place or workspace (TR-002). Cards: title (run ID in tooltip), place line only when the agent works in several places, then workspace · time on one line. VIS-004, VIS-005.
- **UXJ-004**: a team card → Members (cards: icon + name, "Shared agent" pill for shared agents; ID in the name's tooltip) → Runs: the filter appears in the header row, 300 ms after typing (TR-003). Run cards: title + time, workspace, member chips (name only; run ID in tooltip). A chip opens that member's run. VIS-009, VIS-010, VIS-011.
- **UXJ-005**: a run card → `← Project Task Manager / Rename the helper and update callers` with Work Journal | Raw Traces. One journal file: no file list or picker; the journal's header names the file. Two or more: at ≥1280 px a "FILES · n" list at the left; below 1280 px the file's name in the journal header becomes the picker (TR-005). Jump to day (picker) and Go to line (Enter jumps). VIS-012, VIS-013, VIS-015.
- **UXJ-006**: Raw Traces → one file: `segment-0001.jsonl (active) · 1 record` as text; two or more: the picker lists `raw_traces_active.jsonl (active) · 57 records`, … newest first; choosing one loads its entries (TR-006). "Show [500]" applies on Enter or leaving the field (TR-007). VIS-014, VIS-016, VIS-017.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Agents / Agent Teams / Agent Orgs | `/memory?section=browse&node=agents\|teams\|orgs` | Pick an owner | Top-level bar; cards: name (ID in tooltip), time; team/org: "N runs" pill, "N members · time" | VIS-008 |
| UIS-002 | Global memory | `node=global` | Read global memory | Top-level bar; reader directly below (no title row) | VIS-006, VIS-007 |
| UIS-003 | Agent page | `node=…/agent:<id>&pane=episodic\|semantic` | Read an agent's memory | Owner header row; run cards or reader | VIS-001…005 |
| UIS-004 | Team / org page | `node=teams/team:<id>&pane=members\|runs` | See members and runs | Owner header row; member cards or run cards | VIS-009…011 |
| UIS-005 | Work Journal | `view=agent-inspector…` (from a run card) | Read a run's journal | Run header row; file list (2+ files, ≥1280 px); journal card filling the window | VIS-012, VIS-013, VIS-015 |
| UIS-006 | Raw Traces | same, Raw Traces tab | Read raw traces | Run header row; file picker or name · Show; trace cards | VIS-014, VIS-016, VIS-017 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Owner / run page | Back | Navigates | The page Back names (top-level tab, team/org page, owner page, or search results) | Address `node`/`pane`/`back` | — |
| TR-002 | Agent Episodic | Type in filter | Cards filter as you type | Matching cards or "No runs match this filter" | Matches title, run ID, place, workspace | Clear filter, open a run |
| TR-003 | Team/org Runs | Type in header filter | List updates after 300 ms | Matching runs | Same as the run list's former filter | Open a member's run |
| TR-004 | Semantic reader | Folder with files shown | First root-level document opens | Document tab open | Read-only workspace for the folder | Open other files, Copy folder path |
| TR-005 | Work Journal, 2+ files | Choose a file (list ≥1280 px, picker below) | Journal reloads | Chosen file's lines | — | Jump to day, Go to line |
| TR-006 | Raw Traces, 2+ files | Choose a file | List reloads (Loading…) | Chosen file's entries | `rawTraceFileName` | Show |
| TR-007 | Raw Traces | Change Show, press Enter or leave the field | List reloads when the value changed | Up to N entries | Limit ≥ 1; unchanged value does nothing | — |
| TR-008 | Semantic reader | Copy folder path | Check icon + "Copied" 1.5 s | Path on clipboard | Full real path (with `%3A`) | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Semantic reader: folder missing / empty / not synced / error | As in `autobyteus-554` | Unchanged — follows baseline (centred message; error with Retry) | Retry | Back | — |
| Agent episodic: loading / error / none / no match | As baseline | Unchanged copy; filter now in header | Retry, clear filter | Back | — |
| Team runs: loading / error / no match / pages | As baseline | Unchanged copy; Prev / Page n / m / Next unchanged | Retry | Back | — |
| Work Journal: one file | 1 journal file | No file list, no picker | Jump to day, Go to line | Back | VIS-012 |
| Work Journal: several files | 2+ | List ≥1280 px; header picker below | as TR-005 | Back | VIS-013, VIS-015 |
| Raw Traces: one file / several | 1 / 2+ files | Name as text / picker | Show | Back | VIS-017 / VIS-014, VIS-016 |
| Long names | Any | Name `h1` truncates with ellipsis; Back text max 16 rem; file list names show in full at ≥768 px | Tooltip | — | VIS-001 |

## Content, Labels, Validation, And Feedback

- Product voice: plain, short; no labels that repeat what a tab, box or title already says.
- Exact labels:
  - Back shows the destination: "Memory" (`memory.page.title`) from a top-level tab; the team's/org's name from a team or org; the agent's/team's/org's name from a run; "Search results" from search. Accessible name and tooltip: "Back to <destination>" (existing strings).
  - Run header title: the run's title from its card ("Rename the helper and update callers"); without one, "<run ID> · <workspace>" in mono 12 px.
  - Raw Traces file: "<file> (active) · N records", "1 record" for one.
  - Raw Traces limit: "Show" + number (accessible name: existing "Raw Trace Limit").
  - "Copy folder path" / "Copied".
- Removed visible text (kept for screen readers or tooltips where noted): Global's "Global memory" title (sr-only) and description (Global tab tooltip); "Agent Team"/"Agent Org" beside a group's name (in the name's tooltip); owner IDs (name tooltip); run IDs on cards and member chips (tooltips); the "Belongs to <team>" line when Back names that team; "File", "Raw trace file", "Raw Trace Limit" labels (sr-only); "Apply" and "Go" buttons; the folder path bar.
- Empty, error and recovery messages: unchanged.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Show (Raw Traces) | number, no spinner | Yes | integer ≥ 1; empty or < 1 is ignored | Enter / change | none (value not applied) |
| Go to line | number, no spinner, `enterkeyhint=go` | No | 1…file lines | Enter | Unchanged — follows baseline |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Phone | < 640 px | Owner/run header: Back + name row; filter full width; switch full width (Episodic/Semantic use short labels). Raw Traces picker full width, Show below at right. Journal detail lines indent 2 ch; line numbers 40 px | Pickers open the OS list |
| Small tablet | 640–767 px | Header on one row when it fits (wraps otherwise); file list above the document | — |
| Tablet / laptop | 768–1279 px | Reader split: list 280 px (300 px ≥1024); Work Journal picker in its header for 2+ files | — |
| Desktop | ≥ 1280 px | Work Journal "FILES · n" list at the left for 2+ files; card grids 3 columns | — |

## Accessibility And Keyboard Behavior

- Target: the existing product's (labels, focus rings, keyboard reachability).
- Focus order: Back → name (not focusable) → filter → switch tabs → content.
- Keyboard: Back, tabs, pickers, filter and Copy folder path are native buttons/inputs/selects; Enter applies Show and Go to line.
- Roles and names: switches keep `role="tablist"`/`tab` with `aria-selected`; Back's accessible name is "Back to <destination>"; Global keeps an `h1` for screen readers; the run page keeps the agent's name as `h1` (screen-reader only when Back already shows it); removed labels stay as `sr-only` labels.
- Contrast: Back and secondary text `gray-500` on `gray-50`; separators decorative.

## Motion And Transitions

- Unchanged — follows baseline (hover/colour transitions only; Copy feedback is an instant icon/text swap for 1.5 s).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Run title on the run page | The run's title | Passed in the address (`runLabel`) from the clicked card | Production should use the run's summary the page already has or can read; behaviour unchanged when absent (falls back to run ID · workspace) |
| Raw trace files | `rawTraceFiles`, `rawTraceFileName` | `prototype/source-observation/fixtures.mjs` `memoryTraceFilesOf`: run `project-task-manager_83dc9125` has 3 files, others 1 | Unchanged contract |
| Semantic folders, journals, runs | as `autobyteus-554` | Synthetic fixtures (`prototype/memory-semantic/*`, `prototype/memory-search/*`); one added document `network-settings-and-routing-facts.md` (Solution Designer) | Unchanged |
| Clipboard | Copy folder path | `navigator.clipboard.writeText` | Same; Electron allows it |

All data is invented and illustrative (mock data origin: written for the design, no real content; checked: the two fixture additions in this ticket).

## Final Visual Reference Inventory

Directory: `tickets/done/memory-layout-balance-608/visual-references/`.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-003 / Semantic, from a team | 1440×900 | `VIS-001-agent-semantic-memory-desktop-1440x900.png` | One header row; no Browse/Search/Index; no ID line; reader from 85 px to the bottom; list 300 px; Copy folder path at the list foot; typography | Agent, file names and document text |
| VIS-002 | UXJ-001 / UIS-003 | 1280×800 | `VIS-002-agent-semantic-memory-laptop-1280x800.png` | Same at laptop size | as VIS-001 |
| VIS-003 | UXJ-001 / UIS-003 | 390×844 | `VIS-003-agent-semantic-memory-phone-390x844.png` | Phone header (switch full width, short labels); list above document | as VIS-001 |
| VIS-004 | UXJ-003 / UIS-003 / Episodic | 1440×900 | `VIS-004-agent-episodic-memory-desktop-1440x900.png` | Filter in header; cards without run ID; workspace · time on one line | Run titles, paths, times, count |
| VIS-005 | UXJ-003 | 390×844 | `VIS-005-agent-episodic-memory-phone-390x844.png` | Phone header rows | as VIS-004 |
| VIS-006 | UXJ-002 / UIS-002 | 1440×900 | `VIS-006-global-memory-desktop-1440x900.png` | No title row; reader at 74 px | Files and text |
| VIS-007 | UXJ-002 | 390×844 | `VIS-007-global-memory-phone-390x844.png` | Phone layout | as VIS-006 |
| VIS-008 | UIS-001 / Agents | 1440×900 | `VIS-008-agents-tab-desktop-1440x900.png` | Cards: name and time only | Names, times |
| VIS-009 | UXJ-004 / UIS-004 / Members | 1440×900 | `VIS-009-team-members-desktop-1440x900.png` | Header row without "Agent Team"; member cards without IDs | Names |
| VIS-010 | UXJ-004 / Runs | 1440×900 | `VIS-010-team-runs-desktop-1440x900.png` | Filter in header; run cards: title + time, workspace, name-only chips | Titles, paths, times, members |
| VIS-011 | UXJ-004 / Runs | 390×844 | `VIS-011-team-runs-phone-390x844.png` | Phone header rows; chips wrap | as VIS-010 |
| VIS-012 | UXJ-005 / UIS-005 / one file | 1440×900 | `VIS-012-work-journal-one-file-desktop-1440x900.png` | Run header row with run title; no file list; journal fills the window; Jump to day picker; Go to line without Go | Journal text, run title |
| VIS-013 | UXJ-005 / two files | 1440×900 | `VIS-013-work-journal-two-files-desktop-1440x900.png` | "FILES · 2" list at ≥1280 px | as VIS-012 |
| VIS-014 | UXJ-006 / UIS-006 / three files | 1440×900 | `VIS-014-raw-traces-three-files-desktop-1440x900.png` | Picker (one down arrow) left, Show right, one row; no labels, no Apply | File names, counts, entries |
| VIS-015 | UXJ-005 / two files | 390×844 | `VIS-015-work-journal-two-files-phone-390x844.png` | Header picker replaces the file name; detail lines indent 2 ch; 40 px line numbers | as VIS-012 |
| VIS-016 | UXJ-006 / three files | 390×844 | `VIS-016-raw-traces-three-files-phone-390x844.png` | Picker full width; Show below at right | as VIS-014 |
| VIS-017 | UXJ-006 / one file | 390×844 | `VIS-017-raw-traces-one-file-phone-390x844.png` | One file named as text (wraps); no picker; Show without spinner | as VIS-014 |

## Linked UI Reference Evidence

- Runnable UI reference: design repository `personal` (after integration); `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port <port>`, open `/memory`.
- Ticket record: `tickets/done/memory-layout-balance-608/product-ticket.md` (round-by-round record with measurements).
- Run instructions: as above; the multi-file run: Memory → Agents → Project Task Manager → "Rename the helper and update callers".
- Relevant IDs: UXJ-001…006, UIS-001…006, TR-001…008, DC-001…012.
- Mocked boundaries and limitations: synthetic fixtures; the run title travels in the address in the reference only.

### Design changes (DC)

- DC-001 Owner pages (agent, team, org) drop Browse | Search | Index; one Back.
- DC-002 One header row: `← <destination> / <Name>` · filter · switch; no ID line or copy button; "Belongs to <team>" hidden when Back names that team; no "Agent Team"/"Agent Org" label.
- DC-003 Global: no title row; description in the Global tab's tooltip.
- DC-004 Semantic reader fills the window; 280/300 px list; auto-opens the first root document; path bar → "Copy folder path" at the list foot.
- DC-005 Proportional reader typography (values above).
- DC-006 Cards without IDs (owner cards, member cards, agent run cards, team run cards and chips); workspace · time on one line; team run time beside the title.
- DC-007 Run page: one header row with the run's title; switch full width on phones; Back shows only its destination.
- DC-008 Work Journal: file list/picker only for 2+ files; the picker is in the journal header below 1280 px; journal fills the window; phone indent 2 ch and 40 px line numbers.
- DC-009 One picker style (bordered, one down arrow) for Work Journal file, Raw Traces file and Jump to day; no spinners; no Apply/Go buttons; Raw Traces labels removed; "Show [N]"; "1 record".
- DC-010 Shared `FileExplorerTabs` (read-only mode only): file tab name up to 320 px (150 px elsewhere) with the full name as tooltip. Also affects the Skills page's read-only skill viewer.
- DC-011 Shared `FileItem`: the `.md` icon is a document outline (`text-blue-500/80`). Finding: the product renders `<i class="fab fa-…">` icons as nothing (Font Awesome is loaded as SVG components, not the font), so `.md`, `.js`, `.vue`, `.html`, `.css` icons are blank in every file list today (the founder's screenshot shows it). This change fixes `.md` only; it also shows in the Files panel and Skills page.
- DC-012 Team Runs filter moved to the page header (the run list's own filter row is not shown when embedded).

## Implementation Fidelity Boundary

- Must preserve exactly: everything in VIS-001…017 except the illustrative content listed; the label and accessibility rules above; behaviour of all unchanged states.
- Reference-only mechanisms: fixtures; `runLabel` in the address; `memoryTraceFilesOf`.
- Shipped source differs in structure: `autobyteus-web` implemented `autobyteus-554` after the pin (e.g. `pages/memory.vue` passes `node-key`/`pane` and `select-node` to `MemoryHome`; `SemanticMemoryFolder` uses `isGlobal`/`emptyBody`). Apply DC-001…012 to the shipped components; the visual result and behaviour must match the references, the component structure need not.
- Permitted variation: data values; the exact hover tint where the product has an equivalent token.
- Design-system constraints: existing Tailwind tokens and heroicons; no new colours.

## Out Of Scope

- Search and Index pages; the other blank `fab` file-type icons (`.js`, `.vue`, `.html`, `.css`) — recommended follow-up; decoding the folder path.

## Open Decisions And Risks

- DC-010/DC-011 reach the Files panel and Skills page (shared components); engineering should confirm them there.
- Follow-up: replace the remaining `fab fa-*` file icons, which render blank.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (commit in `product-ticket.md`)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality with no unintended placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
