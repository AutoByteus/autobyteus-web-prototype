# UI/UX Specification — The Memory Page As The Home Of Memory Search

Canonical contract for the Memory page of AutoByteus Web: memory search, the memory index pipeline, the Work Journal view, and the cleanup of the old per-run tabs. The final screenshots in `visual-references/` are normative; every visible detail in them is requirements-defining unless this specification marks it illustrative.

## Status And User Confirmation

- Status: `Approved` (2026-10-26); revision SR-006 (2026-10-27) `Approved` by the user ("its done")
- Request / ticket: `work-journal-search` (Project Task `autobyteus-185`, "Agent search over Work Journals across all agents"; first step of `autobyteus-233`)
- Related requirements revision ID: SR-001 (`requirements-doc.md`, approved 2026-10-26); revision SR-006 (UD-020, 2026-10-27: no Strong / Fair / Weak labels; results state facts)
- Related requirement, behavior, acceptance-criteria, and decision IDs: R-009, R-010, R-012, R-013, R-014, R-015; AC-008, AC-011; UC-007, UC-008; UD-002, UD-008, UD-010, UD-013, UD-014, UD-020
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL: the product's normal entry point, `http://127.0.0.1:4930/memory` while the ticket was in review (no preview switch)
- Explicit user-confirmation reference: revision SR-006: the user, 2026-10-27, "its done" after the match-fact changes and card tidying. Original: the user, 2026-10-26, after four review rounds: "Oh, I think that the UI is correct now. I feel it's good." Decisions he gave during review are listed under Key UX decisions.
- Final check date: 2026-10-27

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`, the Memory page (`/memory`)
- Pinned source commit or revision: `origin/personal@d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` (baseline `WEB-BASELINE-REFRESH-013`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Accepted design base: `01290bf990342efc48918ce75d4dbffd05fffc59`
- UI reference revision or commit: the integrated revision recorded in `product-ticket.md` (first approval `d011922`; revision SR-006 on branch `design/work-journal-search-sr006`)
- Ticket folder: `tickets/done/work-journal-search/` (the working copy was `tickets/in-progress/work-journal-search/`)
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- **User problem and intent.** The Memory page lists agents, teams and orgs and filters them by name; nothing searches what past runs did, and the user cannot see or start indexing. The user wants Memory to become the home of memory: search it in his own words, see the indexing "as a pipeline… when I click index, I can see where it is", see task teams, and drop the outdated per-run Episodic and Semantic tabs.
- **Key UX decisions and why.**
  1. **Three tabs: Browse · Search · Index** (the user's decision, round 2: "use different tabs… on the index you can show the pipeline much better"). Browse is the entry because it is today's page and needs no index.
  2. **No page title, no explanatory sub-text** (the user, round 2: the left menu already says Memory). Words that repeat on every row are removed too (the user, round 4): no "Members" label, no "Updated" prefix, no path words in headings, and no availability badge unless something is missing.
  3. **Flat, like the Skills page** (the user, round 3): one toolbar row on the grey page, cards directly on the page, Skills' search box (icon, rounded), blue primary buttons. No wrapping box, no tab line.
  4. **The Search tab starts with the box centred, like Google's start page** (the user, round 4); the box moves to the top once there are results.
  5. **The pipeline is four connected step cards** with state, progress bar and "X of Y". The status headline above them says where the build is. No repeated "search by words / meaning ready" rows (the user: "is it really needed?").
  6. **Rebuild is always on the Index tab** (the user asked for it); it waits, greyed with a reason, while a build runs.
  7. **No grade on a match; facts instead (UD-020, the user, 2026-10-27: "lets remove it. otherwise later during testing we still fail").** Embedding scores have no reliable absolute meaning, so the page shows what the index can check: a text match lists the search words found in it (`Words: ddns, home`); a meaning match has no label and no grade (a card without a `Words:` label is a meaning match); and a note names the search words that occur in no journal (`Not found in your memory: cloudflare.` or, when none of the words occur, `None of these words appear in your memory: purple, elephant.`). The page never says "nothing in memory" while results exist. This replaces the earlier Strong / Fair / Weak chips and the amber "Only weak matches" note.
  8. **Working Context is removed** from the run detail (user's question, round 4: "do we really need it?"; the Product UI/UX Designer recommended removal). It is the agent's live context window, not a record of what happened; the Work Journal is the readable account and Raw Traces the authority. The run detail has two tabs: Work Journal and Raw Traces.
  9. **Work Journal view uses windows of lines**, not endless scroll: a file can be several MB.
  10. **The old "Memory source" card is shown only when more than one memory source exists** (imported memory is held back); the search is local-only.
- **Alternatives considered and why they were rejected.**
  - One box for both the name filter and the content search: a name filter and a content search answer different questions; mixing them hides which one the user got. The name filter stays as a quiet "Filter" on Browse.
  - The pipeline as a strip under the search box (round 1): too cramped for four steps with progress. As a modal: blocks the page during a build that can run an hour.
  - Results above the browse lists: two competing lists on one screen. They are on their own tab.
  - A grade of any kind (three words, a number or dots): off-topic and real matches overlap, and three calibration rounds passed only by thin margins. Instead of a grade, the facts above.
  - Keeping Working Context as a third tab: one more tab of equal weight for something that cannot answer "what did we do back then".

## Scope And Experience Goal

- **User or actor:** the user, on the Memory page of this node.
- **Context:** local memory only; nothing leaves the machine; no model call.
- **Goal:** find which run did a piece of work from a cue in any words or language, open that run's Work Journal at the matched lines, and start and watch the memory index.
- **Observable success:** from a cue, the user opens the right run's journal at the right lines in two clicks (search, open); an index build is visible step by step; a result says which search words it found, which words occur in no journal, and how much of memory is covered.
- **In-scope surfaces and journeys:** the Memory page's three tabs; agent, team and run detail; the Work Journal view; Raw Traces tab; task teams in the team list.
- **Non-goals:** summaries (FU-005); time, agent or workspace filters (UD-009); choosing the embedding model (stays on Server Settings → Embedding); imported memory from other nodes; the server API (the Solution Designer's design spec).

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| R-014, UC-007 | A memory search box; results one per run, best first; opening a result opens the run's Work Journal at the matched lines | UXJ-002; UIS-003, UIS-007; TR-005, TR-006; VIS-005, VIS-006, VIS-017 |
| R-014 | Work Journal view in the run detail: several files, files of several MB, jump to lines | UXJ-006; UIS-007; TR-007…TR-010; VIS-017, VIS-018, VIS-020, VIS-024 |
| R-013, UC-008, AC-008 | Indexing as four steps with state and progress; "Index now" only by click; "Rebuild"; progress visible on the Memory page | UXJ-004, UXJ-005; UIS-004; TR-011…TR-016; VIS-011…VIS-016, VIS-023 |
| R-009, AC-007, UD-020 | Facts instead of grades: found words per text match (a meaning match has no label), the search words found in no journal; never "nothing in memory" while results exist; incomplete coverage is said | UXJ-003; UIS-003; VIS-006, VIS-007, VIS-008, VIS-025, VIS-026 |
| R-010 | Results show days; per run the newest matching part first; a line says results are pointers, not facts | UIS-003; VIS-006 |
| R-012, UD-008, AC-010 | Task teams listed like other teams; retired or renamed agents named as recorded; runs without metadata named by folder | UIS-002, UIS-006; VIS-001, VIS-002, VIS-004 |
| R-014, R-015, AC-011 | The Episodic and Semantic tabs (and badges, strings) are gone; Raw traces kept; Memory words are Memory, memory search, memory index, Work Journal | UIS-007, UIS-008; VIS-017, VIS-019 |
| UD-002 | Snippets show paths, IPs and domains; secrets are masked (server-side) | VIS-006 (snippet shows an IP, a domain and a path) |

## Visual Language

- **Existing product language to preserve:** the app shell and left menu; Tailwind palette (gray, blue, amber, emerald, red, indigo); the product's sans-serif stack for text and its monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, …`) for run IDs, snippets and journal text; the Skills page's toolbar and card language; the dashed-indigo "task" language already used for task teams.
- **Layout structure and visual hierarchy.** Page background gray-50 (`#f9fafb`; the product's page grey). Content column `max-w-7xl` (1280 px), centred, padding 32 px, vertical gap 20 px. Top: one toolbar row holding the segmented tab control. Below it the active tab's content, directly on the page. No title.
- **Grid, dimensions, spacing, and density.**
  - Browse / run lists: grid gap 16 px; 1 column below 768 px, 2 from 768 px, 3 from 1280 px. Card padding 20 px.
  - Pipeline: 4 columns from 1280 px (gap 16 px, card padding 20 px); 1 column below, card padding 16 px.
  - Search box: centred at max width 672 px while the tab is empty; left-aligned at max width 768 px with results.
  - Work Journal: file rail 240 px (from 1280 px) beside the viewer; viewer height max 62 vh, min 320 px.
- **Typography.** Card title 16 px / 600; IDs 12 px monospace gray-500; secondary lines 12 px gray-500; section text 14 px; segment labels 14 px / 500; step name 16 px / 600, step description 14 px / 22 px line height gray-500; status headline 18 px / 600; journal text 12 px monospace, line height 20 px.
- **Color values and semantic roles.** Primary action and active tab `#2563eb` (hover `#1d4ed8`), text white. Borders `#e5e7eb`; hover border `#d1d5db`. Text `#111827` (title), `#4b5563`/`#6b7280` (secondary). Done / success `#10b981` icon, `#34d399` bar. Running `#2563eb` (card border `#93c5fd`). Failed `#ef4444` icon, `#f87171` bar, card border `#fca5a5`, message `#dc2626`. Attention amber (`#fffbeb` fill, `#fde68a` border, `#78350f` text). Task team indigo (`#a5b4fc` dashed border, `#4338ca` text). Matched journal lines `#fffbeb` with gutter `#fef3c7`, border `#fcd34d`, number `#92400e`.
- **Surfaces, borders, radii, shadows, elevation, and layering.** Cards: white, 1 px `#e5e7eb`, radius 8 px, no resting shadow; hover: border `#d1d5db` and a medium soft shadow. Segmented control: white, 1 px border, radius 8 px, padding 4 px; segments radius 6 px. Banners: 1 px border, radius 8 px. Step connectors: 24 px white circle, 1 px `#e5e7eb`, arrow icon `#9ca3af`, centred on the gap between cards (from 1280 px only).
- **Controls, icons, imagery, and media assets.** Heroicons 20 solid (search, check-circle, exclamation-circle, exclamation-triangle, arrow-right, user-group, chevron) and the `svg-spinners:ring-resize` spinner, from the product's offline icon collection. No imagery.
- **Hover, active, focus, selected, disabled, validation, and feedback treatment.** A result match is clickable as a whole: on hover it gets a 1 px `#e5e7eb` border, a `#f9fafb` background and a white snippet with a 1 px `#e5e7eb` ring; the pointer is a hand; keyboard focus shows the 2 px blue ring. There is no "Open" button or link on a match. Focus: 2 px blue-500 ring (inputs: blue-500 border plus a 2 px blue-100 ring). Selected tab: blue fill, white text. Disabled: 50 % opacity, `not-allowed` cursor (Search before the index can answer; Rebuild during a build, with a tooltip). Selected file in the journal rail: `#eff6ff` fill, `#93c5fd` border.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Memory page shell (tabs) | The Browse · Search · Index segmented control and the page container | active tab; Index badge: none, spinner + percent while building, amber dot (not indexed, model changed), red dot (failed) | `components/memory/MemoryHome.vue` |
| Browse lists | Agents, Agent Teams, Agent Orgs cards with a name filter that applies as you type | task-team tag; availability note only when missing; imported-source select only when more than one source | `components/memory/MemoryHome.vue`, `MemoryBadges.vue` |
| Memory search | The search box and the index notice | centred (empty) / top (results); disabled (not indexed); notice: not indexed (with Index now), building, failed, model changed | `components/memory/MemorySearchPanel.vue` |
| Search results | One card per run with 1–2 matches | text match with its found words; meaning match (no label); note of search words found in no journal (some / none found); coverage note; loading; error with Retry | `components/memory/MemorySearchResults.vue` |
| Memory index | Headline status and the four-step pipeline with Index now, Try again, Rebuild | needs indexing, building (per step), meaning running, failed, ready, model changed; rebuild confirmation | `components/memory/MemoryIndexPanel.vue`, `composables/useMemoryIndexView.ts` |
| Work Journal view | File rail, line reader, jumps, windows, search banner | opened from a result (highlight, banner, match buttons); opened plainly; large file | `components/memory/WorkJournalTab.vue` |
| Run / team / agent detail | Flat detail pages with a name heading and a filter | agent runs; team runs with member chips; run detail with two tabs | `AgentMemoryDetail.vue`, `CollaborationMemoryDetail.vue`, `MemoryInspector.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User browsing memory | Index ready (or not) | Find a run from the lists and read it | Run detail open on Work Journal | R-012, R-014, AC-011 |
| UXJ-002 | User with an index | Search tab, empty | Find a run by a cue and open it at the matched lines | Work Journal at the lines, matched lines highlighted | R-014, UC-007, AC-011 |
| UXJ-003 | User searching | A cue whose words are absent, a partial index, or a failing search | Understand what the answer is based on | Found words per match, the "not found" note, the coverage note, or an error with Retry | R-009, R-010, AC-007 |
| UXJ-004 | User with a never-indexed memory | Not indexed | Start the first build and watch it | Index ready; search works as soon as the Text index has content | R-013, UC-008, AC-008 |
| UXJ-005 | User after an embedding model change or a failure | Model changed or failed | Rebuild or retry | Pipeline runs again to ready | R-013, UC-008 |
| UXJ-006 | User reading a large run | Run detail, Work Journal | Reach a day or line in a multi-MB file | The window shows the requested lines | R-014 |

## Journey Details

**UXJ-001 Browse a run.** Entry: `/memory` (Browse, Agents). The user picks Agents, Agent Teams or Agent Orgs, may type in the filter (applies after 300 ms), clicks a card, then a run card (agent) or a member chip (team or org run). The run detail opens on **Work Journal**; **Raw Traces** is the other tab. Back returns to the list. Task teams are cards like any team, with a dashed "Task team" tag. Visuals: VIS-001…VIS-004, VIS-020, VIS-019.

**UXJ-002 Search and open.** Entry: Search tab. Type a cue, Enter or **Search**. A short searching state, then the results (one card per run, best first). The user clicks a match (or the card header, which opens the first match). The run detail opens on the Work Journal at the matched file and lines: the file is selected, the lines are highlighted and scrolled into view, a banner names the cue and the match (`lines 5353–5355 · Words: ddns, home`; a meaning match shows only `lines 310–311`), and, when the run has two matches, *Match 1 / Match 2* buttons jump between them. **Back to search results** returns to the same results (the cue is in the address). Visuals: VIS-006, VIS-017, VIS-024.

**UXJ-003 Honest results.** Each text match lists the search words found in it; a meaning match carries no label. When some search words occur in no journal, a gray note names them (`Not found in your memory: cloudflare.`); when none of them do, an amber note says so (`None of these words appear in your memory: purple, elephant.`), and the results are still listed. While the Text index is incomplete these notes are not shown (absence is not yet certain); only the coverage note is. Partial coverage: a blue note says how much the Text or Meaning index covers. Failure: a red note with **Retry**. The page never says "nothing in memory". Visuals: VIS-006, VIS-007, VIS-025, VIS-008, VIS-009, VIS-026.

**UXJ-004 First build.** Not indexed: the Search box is disabled and says "Index your memory to search it…"; the Search tab offers **Index now**; the Index tab shows the first-time text and the four steps waiting, with **Index now**. Clicking starts the build (only by this click). The steps run in order; the headline reads `Step N of 4 · <step> P%`; the Index tab shows a spinner and the percent. As soon as the Text index has content the Search box is enabled and results say how much is covered. When the Meaning index finishes the headline reads `Up to date`. Visuals: VIS-010…VIS-014, VIS-023.

**UXJ-005 Rebuild and retry.** Failed: the failed step shows its reason; **Try again** resumes, **Rebuild** starts over. Model changed: an amber note names both models; **Rebuild** is the primary button. **Rebuild** asks for confirmation in a slim row ("Rebuild starts every step again. Search covers less of your memory while it runs." **Rebuild** / **Cancel**); confirming starts the pipeline from step 1. Rebuild is greyed with a tooltip while a build runs. Visuals: VIS-015, VIS-016.

**UXJ-006 Read a large journal.** The file list shows each file's days, lines and size, *Active* for the open file, and *Matched lines* for files holding matches. Selecting a file shows its first 300 lines. **Jump to day** and **Go to line** show a 300-line window around the target; *Show 300 earlier / later lines* at the window edges extend it. The footer says `Lines a–b of N` and, above 5,000 lines, "Large file: lines load in parts." Visual: VIS-018.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Memory page shell | `/memory` | Choose Browse, Search or Index | Segmented control in the toolbar row; active tab below | VIS-001 |
| UIS-002 | Browse | `/memory?view=home&section=browse&tab=agents\|teams\|orgs` | Pick an agent, team or org | Sub-tabs (quiet text buttons) left, filter box right; card grid | VIS-001, VIS-002, VIS-021 |
| UIS-003 | Search | `/memory?view=home&section=search[&q=…]` | Search memory | Empty: centred box. With a cue: box at top, optional notes, results header, result cards | VIS-005…VIS-010, VIS-022 |
| UIS-004 | Index | `/memory?view=home&section=index` | Start, watch, rebuild the index | Status headline and actions; four step cards; footer note on the embedding model | VIS-011…VIS-016, VIS-023 |
| UIS-005 | Agent detail | `/memory?view=agent-detail&…` | Pick a run of an agent | Back link; agent name and filter; run cards | VIS-003 |
| UIS-006 | Team / org detail | `/memory?view=team-detail&…` | Pick a member run | Back link; team name and filter; run cards with member chips | VIS-004 |
| UIS-007 | Run detail: Work Journal | `/memory?view=agent-inspector\|team-inspector\|org-inspector&…` | Read the journal | Back link; run name; run ID and workspace; tabs; optional search banner; file rail and reader | VIS-017, VIS-018, VIS-020, VIS-024 |
| UIS-008 | Run detail: Raw Traces | same, second tab | Read raw traces (unchanged behavior) | Raw trace file select, limit, trace cards | VIS-019 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001 | Click a tab | Selected tab turns blue; content swaps | Tab content shown; cue kept in the address | — | Any tab |
| TR-002 | UIS-002 | Click a sub-tab | Selected sub-tab greys | List of that kind; filter reset | list read | Filter, open a card |
| TR-003 | UIS-002 | Type in the filter | Debounce 300 ms, then the list narrows | Filtered list | name filter (title, run ID) | Clear text |
| TR-004 | UIS-002 | Click a card, then a run or member | Page changes | UIS-005/006, then UIS-007 | run view read | Back |
| TR-005 | UIS-003 empty | Enter the cue, Enter / Search | Box moves to the top; "Searching…" | Results (or note, or error) | memory search | Open a match, Clear search |
| TR-006 | UIS-003 results | Click a match or card header | Run detail opens | UIS-007 at the matched lines | journal read | Back to search results |
| TR-007 | UIS-007 | Click a file | File selected | First 300 lines of that file | journal read | Jump, load more |
| TR-008 | UIS-007 | Choose a day / enter a line, Go | Reader jumps and scrolls | 300-line window around the target | journal read | Load earlier / later |
| TR-009 | UIS-007 | Show 300 earlier / later lines | Lines added; position kept | Window grows | journal read | Further loads |
| TR-010 | UIS-007 with search banner | Click Match 1 / Match 2 | Reader jumps to that match | Match highlighted | — | Other match |
| TR-011 | UIS-004 not indexed | Click Index now (Index or Search tab) | Steps start; tab badge spinner | Building | build starts (user's click only) | Watch |
| TR-012 | UIS-004 building | Time | Step bars advance; headline changes; Index tab shows percent | Next step, then ready | — | Rebuild disabled |
| TR-013 | UIS-004 failed | Click Try again | Failed step resumes | Building | resume | Watch |
| TR-014 | UIS-004 ready or failed | Click Rebuild | Confirmation row | Confirming | — | Rebuild, Cancel |
| TR-015 | UIS-004 confirming | Click Rebuild | Pipeline restarts at step 1 | Building | all steps run again | Watch |
| TR-016 | UIS-003 notice | Click View the index | Index tab opens | UIS-004 | — | Any |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Browse default | Open Memory | Cards: name, ID, run count, date; availability note only when missing | Filter, open | — | VIS-001 |
| Browse: task team | Team started by an agent | Dashed indigo "Task team" tag (tooltip: "Task team · started by <agent>") | Open | — | VIS-002 |
| Browse: nothing yet | No memory of that kind | Existing empty copy | — | — | Unchanged — follows baseline |
| Search empty | Open Search | Centred box; placeholder "Describe what you remember, in any words or language…" | Type | — | VIS-005 |
| Search not indexed | Index never built | Disabled box ("Index your memory to search it…"); "Memory is not indexed yet" / "Index your memory once to search what your agents did before. Search by words is ready after about 5 minutes on a large memory." and **Index now** | Index now | Index tab | VIS-010 |
| Search results | Cue answered | `Results for “<cue>”`, `N runs · Pointers to check in the Work Journal, not facts`; cards | Open, Clear search | Clear | VIS-006 |
| Search: none of the words found | Every search word occurs in no journal; results exist | Amber note "None of these words appear in your memory: <words>."; no match carries a `Words:` label | Open, new cue | Clear | VIS-007 |
| Search: some words not found | Some search words occur in no journal | Gray note "Not found in your memory: <words>."; the matches list their found words | Open, new cue | Clear | VIS-025 |
| Search partial coverage | A step incomplete | Blue note "Still indexing: the Text index covers N% of your journals, so older work may be missing." (or the Meaning index wording) | Open | — | VIS-008 |
| Search failed | Search error | Red "The search could not be completed." with **Retry** | Retry, Clear | — | VIS-009 |
| Index first time | Never built | Headline "Not indexed yet"; first-time text; four steps "Waiting"; **Index now** | Index now | — | VIS-011 |
| Index building | A step running | Headline `Step N of 4 · <step> P%`; running card blue; Rebuild disabled | — | — | VIS-012 |
| Index meaning running | Steps 1–3 done | Headline `Meaning index P%` with "Search by words is ready; matches by meaning grow in the background" | Search meanwhile | — | VIS-013 |
| Index ready | All done | Headline "Up to date" with `N runs · updated <time>`; footer "After this build, the memory index keeps itself current after each turn." | Rebuild | — | VIS-014 |
| Index failed | A step failed | Headline "Stopped at <step>"; the failed card shows its reason | Try again, Rebuild | — | VIS-015 |
| Index model changed | Meaning index built with another model | Headline "Embedding model changed"; note "The Meaning index was built with <old>. Rebuild to use <new>."; Rebuild primary; confirmation row | Rebuild | Cancel | VIS-016 |
| Work Journal opened from a result | Click a match | Banner, highlight, file marker, match buttons | Jump, load, Back | Back to search results | VIS-017 |
| Work Journal large file | A file over 5,000 lines | Window of 300 lines; "Large file: lines load in parts." | Load, jump | — | VIS-018 |
| Work Journal empty | A run with no files | "This run has no recorded activity yet." | Back | — | Not captured (copy only) |
| Raw Traces | Second tab | Unchanged baseline content (select, limit, trace cards) | As today | — | VIS-019 |

## Content, Labels, Validation, And Feedback

- **Voice and wording.** Plain, short, no repeated words. Domain words: **memory**, **memory search**, **memory index**, **Work Journal**, **Raw traces**; the old words "Episodic" and "Semantic" appear nowhere (tabs, badges, strings, docs). Dates follow the browser locale.
- **Exact labels.** Tabs: `Browse`, `Search`, `Index`. Browse sub-tabs: `Agents`, `Agent Teams`, `Agent Orgs`. Filter placeholders: `Filter agents by name or run ID…`, `Filter agent teams by name…`, `Filter agent orgs by name…`, `Filter runs by title or run ID…`. Search: `Search`, `Clear search`, `Retry`, `View the index`. Pipeline: `Find runs — Every run folder on this node`; `Journals — Each run’s Work Journal made current`; `Text index — Search by words works from here`; `Search by meaning, in the background` (Meaning index); step counts `X of Y runs|journal files · P%`; `Waiting`. Actions: `Index now`, `Try again`, `Rebuild`, `Cancel`. Match: `Words: <found words>` (text match only; separator `, `, in zh-CN `、`; a meaning match carries no label); notes `None of these words appear in your memory: <words>.` and `Not found in your memory: <words>.`; `lines a–b`; no separate open button: the whole match is the click target; `<day>` / `<first> – <latest>` (no "Mentioned" prefix). Journal: `Files`, `Active`, `Matched lines`, `Jump to day`, `Go to line`, `Go`, `Show 300 earlier lines`, `Show 300 later lines`, `<n> not shown`, `Lines a–b of N`, `From your search “<cue>”`, `Match 1`. Run detail tabs: `Work Journal`, `Raw Traces`. Exceptions note: `No Work Journal`, `No Raw traces`, `Archive`. Embedding note: `The Meaning index uses the embedding model chosen in Server Settings → Embedding (<model>).` with the link `Embedding settings` (to Server Settings → Embedding).
- **Empty, error, and recovery messages.** As in State Behavior. The full English and Chinese (zh-CN) strings are in `localization/messages/{en,zh-CN}/memory.ts`.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Memory search box | Text | Yes (to search) | Non-empty after trimming; enabled only when the Text index has content | Submit | None: the button stays disabled and the box says "Index your memory to search it…" while not ready |
| Browse filter | Text | No | None | Typing (300 ms) or Enter | — |
| Go to line | Number | No | Whole line within the file; out-of-range values are clamped to the first or last line | Go / Enter | — |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop (primary) | 1280 px and wider | Pipeline in 4 columns with connectors; journal file rail beside the reader; Browse 3 columns | — |
| Tablet / laptop | 768–1279 px | Pipeline in 1 column; journal file choice is a select above the reader; Browse 2 columns | — |
| Narrow / phone | below 768 px (checked at 390 px) | Browse 1 column; filter box full width; step cards compact (number beside the name, icon in the corner); search results header wraps; match chips wrap | The tab control and cards keep their desktop behavior |
| Language | zh-CN | Same layout; all strings translated | — |

## Accessibility And Keyboard Behavior

- **Accessibility target:** the existing product's level (no stricter target in the requirements).
- **Focus order, focus movement, and focus return:** tabs → page content in reading order. Opening a result moves to the run detail; Back returns to the results with the cue still in the box.
- **Keyboard interaction:** tabs and buttons by Tab/Enter/Space; search and Go-to-line submit with Enter; filters apply on typing or Enter.
- **Roles, names, states, and live announcements:** the page tabs and the run tabs use `role="tablist"` / `role="tab"` with `aria-selected`; each pipeline step is a list item with a progress bar named after the step (`role="progressbar"`, value 0–100); the results region is `aria-live="polite"`; the rebuild confirmation is an `alertdialog`; the search box has an accessible name ("Memory search").
- **Contrast of new or changed text and UI boundaries:** text uses the product's grays (`#6b7280` or darker for readable text). The journal's raw-link lines (`#d1d5db`) and line numbers (`#9ca3af`) are deliberately de-emphasised machine detail, below normal contrast; they carry no required information.

## Motion And Transitions

- Progress bar width changes over 300 ms; spinners (`ring-resize`) while a step runs or a search is pending; card and button hover transitions at the product's default 150 ms. No other motion.
- Reduced-motion behavior: not specified by the reference; implementation should stop the spinners and the bar transition under `prefers-reduced-motion`.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Memory search | Per result: agent name, team and member, run ID, workspace, first and latest day, and per match (1–2): journal file, lines, day, snippet (2–3 lines), kind (`text` / `meaning`), `matchedWords` (text match: the search words found in it, in query order; empty for meaning) | Scripted: a cue is matched to a few invented topics by keywords; a match's kind and found words follow from its snippet; ordering and snippets are fixed | Real search over the memory index (Solution Designer's API) |
| Words found in no journal | `wordsNotFound` (search words that occur in no journal; empty while the Text index is incomplete), taken once for the whole search response | Computed from the invented journals' text; empty while the Text index is incomplete | Exact check in the text index (design-spec § Match Facts, SR-006). No strength, score or grade anywhere |
| Opening a result | The run detail is addressed by run ID; a member run also needs its team or org run ID; a standalone run needs its agent definition ID for the Back link and heading | Result carries them | **Open:** the result must carry the team / org run ID and agent definition ID |
| Index status | Per step: state (`waiting`, `running`, `done`, `failed`), done and total counts, an optional failure message; the model the Meaning index was built with and the active embedding model; when it was last updated | A timer advances the four steps (accelerated: about 80 s instead of an hour) | Real pipeline status |
| Search readiness | The box is enabled when the Text index has any content, and results state coverage | As described | **Open:** if search should wait until step 3 is done, the box stays disabled until then |
| Rebuild | A confirmation says search covers less while it runs | Steps restart from 0 and coverage drops | **Open:** if the old index keeps answering until the new one is ready, the sentence changes |
| Task team listing | A list entry may carry `isTaskTeam` and `startedByAgentName` for the tag and its tooltip | Present on the example task team | Optional; the page works without them |
| Journal read | Files (name, line count, size, days with their first line, active flag); lines of a file in a range | Generated line by line from word pools and a seeded generator; planted passages for the scripted results | Real journal reads in ranges (Solution Designer's API) |
| Static copy | "about 5 minutes", "about an hour" in the first-time text | Fixed text (measured on the reference machine) | Not from the server |
| Date and time formats | Browser locale | Browser locale | — |
| Memory lists | Agents, runs, teams, orgs, runs without metadata named by folder | Invented in `prototype/memory-search/memoryDesignFixture.ts` | Real lists, including every run folder and task teams (R-012) |

## Final Visual Reference Inventory

All images are real browser screenshots at the stated viewport, taken through the product's normal entry point with the scenario seeding noted. Paths are relative to the ticket folder. Date and time values come from the invented fixtures and the browser locale (captured with locale `en-GB`, UTC).

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-002 Browse, Agents (default entry) | 1440×900 | `visual-references/VIS-001-browse-agents-desktop-1440x900.png` | Tab control, sub-tabs, filter box, card layout, no availability badges | Agent names, IDs, counts, dates |
| VIS-002 | UIS-002 Browse, Agent Teams with a task team | 1440×900 | `visual-references/VIS-002-browse-teams-task-team-desktop-1440x900.png` | Dashed "Task team" tag position and style | Team names, counts, dates |
| VIS-003 | UIS-005 Agent detail | 1440×900 | `visual-references/VIS-003-browse-agent-runs-desktop-1440x900.png` | Back link, name heading, filter, run cards (a retired agent named as recorded) | Run titles ("hello" included), IDs, paths, dates |
| VIS-004 | UIS-006 Team detail (task team) | 1440×900 | `visual-references/VIS-004-browse-team-runs-task-team-desktop-1440x900.png` | Run cards with member chips, no "Members" label | Names, IDs, dates |
| VIS-005 | UIS-003 Search, empty | 1440×900 | `visual-references/VIS-005-search-empty-centered-desktop-1440x900.png` | Centred box and button, placeholder | — |
| VIS-006 | UXJ-002 Search results (text matches with found words) | 1440×900 | `visual-references/VIS-006-search-results-desktop-1440x900.png` | Result card anatomy, the `Words: …` label of each match, snippet; no grade and no open button | Cue, agent, IDs, paths, IP and domain, snippets, days |
| VIS-007 | UXJ-003 None of the search words found | 1440×900 | `visual-references/VIS-007-search-none-of-the-words-found-desktop-1440x900.png` | Amber note and copy; matches without a `Words:` label | Cue and results |
| VIS-008 | UXJ-003 Partial coverage (Meaning index running) | 1440×900 | `visual-references/VIS-008-search-results-partial-coverage-desktop-1440x900.png` | Blue coverage note and copy; tab badge with percent | Percentages |
| VIS-009 | UXJ-003 Search failed | 1440×900 | `visual-references/VIS-009-search-error-desktop-1440x900.png` | Red note with Retry, Clear search | — |
| VIS-010 | UXJ-004 Search, not indexed | 1440×900 | `visual-references/VIS-010-search-not-indexed-desktop-1440x900.png` | Disabled box, message, Index now, amber dot on the Index tab | — |
| VIS-011 | UXJ-004 Index, first time | 1440×900 | `visual-references/VIS-011-index-first-time-desktop-1440x900.png` | Headline, first-time text, four waiting steps, connectors, Index now | Counts |
| VIS-012 | UXJ-004 Index, building (Text index) | 1440×900 | `visual-references/VIS-012-index-building-text-index-desktop-1440x900.png` | Done / running / waiting step styling, headline, Rebuild disabled, tab spinner and percent | Percentages and counts |
| VIS-013 | UXJ-004 Index, Meaning index running | 1440×900 | `visual-references/VIS-013-index-meaning-running-desktop-1440x900.png` | Headline "Meaning index P%" and its sub-line | Percentages and counts |
| VIS-014 | Index, ready | 1440×900 | `visual-references/VIS-014-index-ready-desktop-1440x900.png` | "Up to date" headline and detail, Rebuild, footer notes | Counts, time |
| VIS-015 | UXJ-005 Index, failed step | 1440×900 | `visual-references/VIS-015-index-failed-desktop-1440x900.png` | Failed card with reason, Try again, Rebuild, red tab dot | Reason text and counts |
| VIS-016 | UXJ-005 Index, model changed, Rebuild confirmation | 1440×900 | `visual-references/VIS-016-index-model-changed-rebuild-confirm-desktop-1440x900.png` | Amber note, confirmation row with Rebuild and Cancel | Model names |
| VIS-017 | UXJ-002 / UIS-007 Work Journal opened from a result | 1440×900 | `visual-references/VIS-017-work-journal-opened-from-result-desktop-1440x900.png` | Heading, tabs, banner with match buttons, file rail with markers, highlighted lines, footer | Journal content, files, sizes, days |
| VIS-018 | UXJ-006 Large file after Go to line | 1440×900 | `visual-references/VIS-018-work-journal-large-file-jump-desktop-1440x900.png` | 300-line window, range footer, "Large file" note | Journal content |
| VIS-019 | UIS-008 Raw Traces | 1440×900 | `visual-references/VIS-019-raw-traces-desktop-1440x900.png` | Two-tab run detail, Raw Traces content (unchanged) | Trace content |
| VIS-020 | UIS-007 Work Journal of a team member (opened plainly) | 1440×900 | `visual-references/VIS-020-work-journal-team-member-desktop-1440x900.png` | Heading `member · team`, journal header lines, day marker, first lines | Journal content |
| VIS-021 | UIS-002 Browse, narrow | 390×844 | `visual-references/VIS-021-browse-agents-narrow-390x844.png` | One column, full-width filter | Content |
| VIS-022 | UIS-003 Results, narrow | 390×844 | `visual-references/VIS-022-search-results-narrow-390x844.png` | Wrapped header, card layout, the `Words: …` label wrapping under the file line, one-line snippets | Content |
| VIS-023 | UIS-004 Index, narrow | 390×844 | `visual-references/VIS-023-index-meaning-running-narrow-390x844.png` | Compact step cards, headline, Rebuild disabled | Percentages |
| VIS-024 | UIS-007 Work Journal from a result, narrow | 390×844 | `visual-references/VIS-024-work-journal-opened-from-result-narrow-390x844.png` | Wrapped banner and match chips, file select, wrapped reader lines | Content |
| VIS-025 | UXJ-003 Some search words not found | 1440×900 | `visual-references/VIS-025-search-some-words-not-found-desktop-1440x900.png` | Gray note `Not found in your memory: cloudflare.`; matches list the words they do contain | Cue, results |
| VIS-026 | UXJ-002 Work Journal opened from a meaning match | 1440×900 | `visual-references/VIS-026-work-journal-opened-from-meaning-match-desktop-1440x900.png` | Banner `… · lines 310–311` (no label); highlight; single-file rail | Journal content |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root at the integrated revision (`corepack pnpm dev --port <free port>`; entry `/memory`).
- Ticket record: `tickets/done/work-journal-search/product-ticket.md`
- Run instructions: `ui-reference-runbook.md` (section `work-journal-search`); starting states: browser console `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with `memory_not_indexed`, `memory_meaning_running`, `memory_index_failed`, `memory_model_changed`, `memory_search_fails` (default = index ready).
- Relevant supporting artifacts: `design-review-notes.md` (review rounds, decisions, open points).
- Cues that show each state: `ddns updater for the home domain` (text matches with found words, some with no found words), `bunny and tortoise` (game), `域名 自动更新` (Chinese), `purple elephant` (none of the words found), `ddns updater cloudflare` (some words not found: cloudflare).
- Mocked boundaries and limitations: the search, the index pipeline timing, the journal files and every list are invented and scripted (`prototype/memory-search/memoryDesignFixture.ts`, `stores/memorySearchStore.ts`, `stores/memoryJournalStore.ts`); nothing is read from a real node, run or journal; a reload resets all state.

## Implementation Fidelity Boundary

- **Exact behavior and visible design implementation must preserve:** the three tabs and their order; no page title; the flat layout and the values above; the centred empty Search; result anatomy (agent, `team · member`, `run ID · workspace` on one line, the date or first–latest range without a prefix, a match's own day only when the card's date does not already say it, 1–2 matches newest first with file, lines, day, a 2–3 line snippet, and `Words: <found words>` for a text match only, no label on a meaning match; no grade of any kind); opening a result at its lines with the highlight and banner; the four-step pipeline with the states and progress shown; Index now only by the user's click; Rebuild always on the Index tab with its confirmation; the honest states and their copy (the "not found in your memory" notes, the coverage note, the error); Work Journal as the default run tab with Raw Traces beside it; no Episodic, Semantic or Working Context tab.
- **UI reference state, fixtures, and simulated mechanisms that do not prescribe production architecture:** the stores, the scripted search, the timer-driven pipeline, the generated journal lines, and the GraphQL mock answers.
- **Fixture content or visible details explicitly allowed to vary:** all names, IDs, paths, IPs, domains, counts, percentages, dates and times, and journal content; the exact scripted ordering of results.
- **Permitted responsive or platform variation:** the breakpoints above; the browser's date format.
- **Existing design-system constraints:** Tailwind palette and the product's fonts and icon set; the Skills page's toolbar and card language.

## Out Of Scope

- Summaries (FU-005); time, agent and workspace filters (UD-009); choosing the embedding model; imported memory from other nodes (the source dropdown exists in the code and appears only with more than one source, untouched by this design); the server API; the removal of the unused per-run Episodic and Semantic code in the engine and server (FU-003).

## Open Decisions And Risks

1. **Result addressing (for the Solution Designer):** a result for a team or org member must carry the team or org run ID, and a standalone run its agent definition ID.
2. **Search readiness:** this design enables search as soon as the Text index has content and states coverage (R-009). If search must wait for step 3 to finish, the box stays disabled until then.
3. **Rebuild semantics:** the confirmation says "Search covers less of your memory while it runs". If the old index keeps answering until the new one is ready, the sentence changes.
4. **Match facts (SR-006):** the page depends on `matchedBy`, `matchedWords` (text matches), and `wordsNotFound` (taken once for the whole search response, empty while the Text index is incomplete). If the server returns `wordsNotFound` per run instead, the page uses the same value from any result. No data beyond these fields is needed.
5. **Task team tag:** needs `isTaskTeam` (and optionally `startedByAgentName`); without them task teams look like any team.
6. **First-time copy quotes measured times** ("about 5 minutes", "about an hour"); they are static text and may be wrong on other machines.
7. **Working Context is removed from the page.** If the product still wants to show the agent's live context somewhere, it needs its own place; the server field is no longer read by this page.
8. **Reduced motion** is a recommendation, not shown in the reference.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (the "no recorded activity" empty state is copy only)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes` (one clipping defect found in the final check, the narrow Work Journal match chips, was fixed and VIS-024 recaptured)
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
