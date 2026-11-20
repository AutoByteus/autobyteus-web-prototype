# UI/UX Specification: semantic-memory-view-554

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `semantic-memory-view-554` (package `semantic-memory-for-every-agent`, Project Task autobyteus-554; autobyteus-555 merged in)
- Related requirements revision ID: `requirements-doc.md` SR-006 (design-spec SR-006 and SR-004 Revision sections)
- Related IDs: REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-010, REQ-011, REQ-012; AC-004 … AC-010; BEH-004, BEH-005; DEC-003, DEC-004, DEC-005, DEC-008 … DEC-014
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (during review): http://localhost:4554/memory; on the founder's devices https://normys-macbook-pro.tail0347f8.ts.net:8445/memory
- Explicit user-confirmation reference: the founder, 2026-11-20, in the Product UI/UX Designer's session after round 6:
  1. "The Sims to be fine it seems I tried it … basically feels like the navigation follows the hierarchy seems to be good for example when I click a global memory it's just a file Explorer which is good when I click agent it shows all those agent I can click into it then I can select semantic memory and that can select episodic memory … the same for agent teams for aging organizations the navigation follows hierarchy"
  2. On the Global line: "I think a global memory is shared by every agent and also every agent team and every agent organization I think" (built in)
  3. Asked whether this is his approval of the round-6 design: "Approved"
- Final check date: 2026-11-20

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (read only)
- Selected frontend application or product surface: `autobyteus-web`: the Memory page (`/memory`) and the Agents page's agent detail and form
- Pinned source commit or revision: `origin/personal@8430d9ef12` (scoped baseline refresh `memory-baseline-refresh-554`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- UI reference revision or commit: the ticket's final commit on `design/semantic-memory-view-554`, integrated into `personal` (recorded in `product-ticket.md`, Integration)
- Ticket folder: `tickets/done/semantic-memory-view-554/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (with the accepted refresh `tickets/done/memory-baseline-refresh-554/`)

## Problem And Design Rationale

- User problem and intent: every agent now always has semantic memory, a folder of reusable knowledge (REQ-004). The node also has one global semantic folder that every agent reads and writes (REQ-010, REQ-011). The user wants to see this memory in the Memory area, read only, organised as he thinks about it: by owner. Global contains Orgs, Orgs contain Teams, Teams contain Agents (DEC-011).
- Key UX decisions and why:
  1. **Browse is organised by owner, with cards** (round 4, the founder: "the original UI I like … when I click the agents you show the … agents cards and then I click into it"). The tabs are Global · Agents · Agent Teams · Agent Orgs, with no list filter: a node holds few agents, teams and orgs.
  2. **An agent page holds both kinds of memory**: Episodic memory (its runs) and Semantic memory (its folder). A shared agent opens the same page from every place it appears (membership is not ownership).
  3. **Team and org pages** have Members (each opens its own page) and Runs (today's team/org runs).
  4. **A semantic folder is shown as the Skills page shows a skill's folder, read only** (round 2, the founder: "the semantic memory is simply just a folder … I can just click and look at any file I want"). The view uses the file explorer and the Files panel's tabs, with the five engineering points (links listed and never opened, no edit affordance, the folder is never created by the view, it is never listed as a workspace, and search covers file names in that folder only).
  5. **Global is semantic only**: "Global memory", one line, the folder path, the same folder view (round 5/6, the founder: "it's just a file Explorer which is good").
- Alternatives considered and rejected (see `design-review-notes.md`): a separate "Semantic Memory" Browse tab listing folders (rounds 1–2; the founder found the mixed tabs, where one tab was a memory kind, confusing); a tree of owners with a filter box (round 3; rejected by the founder: "very inconvenient … the user don't have so many agents"); a newest-first file list with its own content pane (round 1; replaced by the Skills-style explorer); a fourth top-level section; a "View in Memory" link on the Agents page (not requested; would be a requirement change).

## Scope And Experience Goal

- User or actor: the node's owner, reading what his agents remember.
- Context: the Memory page, Browse section; an imported memory source (Memory Sync) selected or not.
- Goal: find any owner's memory by its place in the hierarchy and read any file in its semantic folder.
- Observable success: Global → files → a file's content; Agents → an agent → Episodic memory / Semantic memory; Agent Teams / Agent Orgs → a team or org → Members → an agent's page, or Runs.
- In-scope surfaces and journeys: `/memory` Browse (tabs, cards, owner pages, the folder view, its states); the Agents page's agent detail (Semantic memory card) and the agent form (switch removed); English and Simplified Chinese.
- Non-goals: editing, creating, renaming, moving, uploading or deleting semantic files; the phone layout beyond the existing narrow behaviour; team- or org-level semantic folders (room only); server, runtime, prompt and sync behaviour (requirements and design-spec).

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-004, AC-004 | The Agents page shows every agent's semantic folder path; the on/off switch and its personal-setting reset are gone | UXJ-006; UIS-008, VIS-019 |
| REQ-005, REQ-007, AC-005, AC-007 | Read-only folder view: explorer + preview tabs; links listed, never opened; no edit affordance; never creates the folder; not a listed workspace; search covers file names in the folder only; missing and empty states | UXJ-002, UXJ-003; UIS-005; VIS-002, 003, 005, 006, 007, 014, 017, 018 |
| REQ-006, AC-006 | Browse tabs Global · Agents · Agent Teams · Agent Orgs, opening on Agents; cards; owner pages; Back; shared agents open one page; internal agents hidden unless "Show internal agents" | UXJ-001 … UXJ-005; UIS-001 … UIS-004; VIS-001, 004, 008 … 013 |
| REQ-008, AC-008 | Imported source: the not-synced note instead of any folder | TR-012; VIS-015 |
| REQ-010, REQ-012, AC-010 | Global: "Global memory", the line, the path `<memory>/semantic-global`, the same read-only view, its own missing and empty copy, the not-synced note | UXJ-002; UIS-006; VIS-002, 003, 014 … 017 |
| REQ-011, DEC-013, DEC-014 | The Global line says every agent reads and writes the folder; the view itself stays read-only | UIS-006 |

## Visual Language

- Existing product language to preserve: the Memory page's grey canvas (`bg-gray-50`), the Browse / Search / Index segmented control, the owner cards of today's Browse, the file explorer and Files panel of the Skills page, the Memory page's plain empty states (centred grey text, no box) and red error box with Retry, the amber "Imported · read-only" pill.
- Layout and hierarchy: the page content column (`max-w-7xl`, `p-8`), then the Browse/Search/Index control, then either the Browse tab row (group view) or "← Back to …" (owner page). Owner page header: title (`text-xl font-semibold text-gray-900`), subtitle (`text-sm text-gray-500`), ID (`font-mono text-xs text-gray-400`), then a segmented tab control (white, `border-gray-200`, `rounded-lg`, `p-1`; selected `bg-blue-600 text-white`, count `text-blue-100`; unselected `text-gray-600`, count `text-gray-400`). Vertical rhythm `space-y-5`.
- Browse tab row (group view): pill tabs `rounded-md px-3 py-1.5 text-sm font-medium`; selected `bg-gray-200 text-gray-900`; unselected `text-gray-600`, hover `bg-gray-100 text-gray-900`. At the right, only when an imported source exists: the Memory source select and the amber pill.
- Cards: grid `gap-4`, 1 column, 2 from 768 px (`md`), 3 from 1280 px (`xl`). Card `rounded-lg border border-gray-200 bg-white p-5`, hover `border-gray-300 shadow-md`, focus-visible `ring-2 ring-blue-500`. Name `text-base font-semibold text-gray-900`; ID `font-mono text-xs text-gray-500`; meta `text-xs text-gray-500` with `mt-3`; count pill `rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600`.
- Folder view: the path line `font-mono text-xs text-gray-500`, selectable, breaking anywhere, `mb-3`; then one panel `rounded-lg border border-gray-200 bg-white`, height `64vh`, min 420 px. Explorer column 260 px, `bg-gray-50`, right border; Files panel tabs fill the rest. Below 768 px they stack: the explorer (max `38vh`, bottom border) above the open file.
- Link row: link icon (`heroicons:link-20-solid`, 14 px, `text-gray-400`), name (`text-gray-500`), then "Link · not opened" (`text-xs text-gray-400`); no hover highlight, default cursor, tooltip.
- Typography, colours, radii, shadows, icons: the product's existing Tailwind tokens and Iconify Heroicons, as listed; no new values.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Memory Browse | Owner tabs and cards; owner pages | Group view (Global, Agents, Teams, Orgs); owner page; loading; error + Retry; empty group; not found | `components/memory/MemoryBrowse.vue` |
| Agent memory page | One agent's memory | Episodic (cards, filter, place line, empty, no match, loading, error); Semantic (folder view); Unattributed (Episodic only) | `components/memory/AgentMemoryPage.vue` |
| Team / org memory page | A team's or org's members and runs | Members (agent and team member cards; "Shared agent" pill); Runs (today's run list embedded) | `components/memory/GroupMemoryPage.vue`, `CollaborationMemoryDetail.vue` (`embedded`) |
| Semantic memory folder | A semantic folder, read only (agent or Global) | Files; file open; link rows; missing; empty; loading; error + Retry; imported (not synced) | `components/memory/SemanticMemoryFolder.vue` |
| File explorer / Files panel tabs, read-only mode | The shared explorer with `readOnly` | No context menu, rename, drag/drop, upload; preview only, no edit/Save; link rows; read-only empty-tab copy | `components/fileExplorer/FileExplorer.vue`, `FileItem.vue`, `FileExplorerTabs.vue` |
| Agent detail: Semantic memory card | The agent's folder path | Always the folder sentence and path | `components/agents/AgentDefinitionDetailSections.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Owner, local node | Memory → Browse (opens on Agents) | See the owners | Agents cards; Global / Agent Teams / Agent Orgs tabs | REQ-006 |
| UXJ-002 | Owner | Browse | Read global memory | Global → a file open in preview | REQ-010, REQ-012 |
| UXJ-003 | Owner | Browse → Agents | Read an agent's memory | Agent page → Episodic memory (a run opens its Work Journal) / Semantic memory (a file open) | REQ-005 … 007 |
| UXJ-004 | Owner | Browse → Agent Teams | Read a team's memory | Team page → Members → an agent's page ("← Back to <team>"), or Runs → a member's inspector | REQ-006 |
| UXJ-005 | Owner | Browse → Agent Orgs | Read an org's memory | Org page → Members (agents and teams) → their pages, or Runs | REQ-006 |
| UXJ-006 | Owner | Agents page → an agent → View Details | See where the agent keeps its knowledge | The Semantic memory card with the path | REQ-004 |

## Journey Details

**UXJ-001 Browse by owner.** Memory opens on Browse → **Agents** (address `node` absent = `agents`). Tabs: **Global · Agents · Agent Teams · Agent Orgs**. Agents cards: standalone and shared agents, then **Unattributed runs** last; each card: name, ID (`unattributed` for that card), latest change; no run count. Agent Teams / Agent Orgs cards: name, ID, "N runs" pill, "N members · <latest change>". No filter box. Internal agents appear only with Settings → Server Settings → "Show internal agents" on. (VIS-001, VIS-008, VIS-012)

**UXJ-002 Global.** Click **Global** → "Global memory", the line "Knowledge shared by every agent, agent team and agent org on this node. Every agent reads it and writes to it.", the path `/…/memory/semantic-global`, the folder panel with "No file selected · Select a file to read it." Click a file → it opens in a preview tab (Markdown rendered). More files open as more tabs; the full-view button works as on the Skills page. Alternate: missing folder (VIS-014), empty folder (copy only, as VIS-006), imported source (VIS-015), error with Retry. (VIS-002, VIS-003)

**UXJ-003 An agent.** Agents → a card → the agent page under "← Back to Memory": name; "Belongs to <team>" (team-local) or "Also works in <teams · orgs>" (shared); ID; tabs **Episodic memory · N** / **Semantic memory**, with Episodic selected. Episodic: run cards newest first (summary, run ID, "In <team/org>" with its icon only when the agent works in more than one place, workspace, time) and the filter "Filter runs by title or run ID…". A run card opens today's Work Journal / Raw traces inspector, whose Back reads "Back to <agent>" and returns to this tab. **Semantic memory** shows the folder view (VIS-005): folders expand, files open in preview, link rows show "Link · not opened" and do nothing. Missing: "No semantic memory yet · The folder is created when <agent> next runs." (VIS-007). Empty: "No semantic memory yet · <agent> has not written anything to its folder yet." (VIS-006). **Unattributed runs** has Episodic only ("Runs that no agent definition names."). (VIS-004)

**UXJ-004 A team.** Agent Teams → a card → team page: name, "Agent Team", ID; tabs **Members · N** / **Runs · N**. Member cards: user icon, name, ID; a shared agent carries the "Shared agent" pill (tooltip "A shared agent: one memory, the same page wherever it appears."). A member opens its agent page under "← Back to <team>" (VIS-011). Runs: today's team runs list (filter, run cards with member chips; a member opens its inspector; Back returns to the Runs tab). (VIS-009, VIS-010)

**UXJ-005 An org.** As UXJ-004 with "Agent Org"; members include teams (user-group icon, "Agent Team · N members"), which open their team page. (VIS-013)

**UXJ-006 Agents page.** Agents → a card → View Details: the **Semantic memory** card says "The agent keeps its reusable knowledge in this folder:" above the selectable path. The form has no Semantic memory checkbox; the personal-settings note reads "Tools, skills, avatar and runtime/model are your personal settings on this computer. …". (VIS-019)

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Browse group view | `/memory?view=home&section=browse&node=agents\|teams\|orgs` | Choose an owner | Tab row (+ source select when imported); card grid | VIS-001, 008, 012 |
| UIS-002 | Agent page | `node=<group>/agent:<id>[&pane=semantic]` (also under a team/org key) | Read one agent's memory | Back; header; Episodic/Semantic tabs; filter (Episodic) | VIS-004, 005, 011 |
| UIS-003 | Team page | `node=teams/team:<id>[&pane=runs]` | Members and runs of a team | Back; header; Members/Runs tabs; cards or run list | VIS-009, 010 |
| UIS-004 | Org page | `node=orgs/org:<id>[&pane=runs]` | Members and runs of an org | As UIS-003 | VIS-013 |
| UIS-005 | Semantic folder view | Inside UIS-002 (Semantic) and UIS-006 | Read files | Path; explorer (search, tree) + tabs | VIS-002, 003, 005, 017, 018 |
| UIS-006 | Global | `node=global` | Read global memory | Tab row; title; line; UIS-005 | VIS-002, 003, 014 … 017 |
| UIS-007 | Work Journal inspector (existing) | From an episode or a team/org member | Read a run | Unchanged, Back label "Back to <owner>" | — (unchanged) |
| UIS-008 | Agents page detail (existing, changed) | `/agents?view=detail&id=<id>` | See the folder path | Semantic memory card | VIS-019 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001 | Click a Browse tab | Tab selected | That group's cards (or Global) | `node` in the address | Card, tab |
| TR-002 | UIS-001 | Click an agent card | Page change | UIS-002, Episodic | Loads the agent's episodes from every place | Tabs, filter, run, Back |
| TR-003 | UIS-002 | Click Semantic memory | Tab selected | UIS-005 for the agent | `pane=semantic`; a transient read-only workspace is registered; nothing is created | File, folder, search, Back |
| TR-004 | UIS-005 | Click a folder | Expands/collapses | Children listed | Children read on demand | — |
| TR-005 | UIS-005 | Click a file | Tab opens, row highlighted (blue left bar) | File in preview | Read through the read-only workspace | More files, close tab, full view |
| TR-006 | UIS-005 | Click / right-click / drag a link row | Nothing (tooltip on hover) | Unchanged | No request | — |
| TR-007 | UIS-005 | Right-click a file or the panel; drag a file; drop files | Nothing | Unchanged | No menu, no move, no upload | — |
| TR-008 | UIS-005 | Type in the explorer search | Results as the Skills explorer shows them | File names in this folder only | — | Open a result |
| TR-009 | UIS-002 Episodic | Click a run card | Page change | UIS-007; Back "Back to <agent>" | — | Back returns to the agent's Episodic tab |
| TR-010 | UIS-003/004 | Click a member card | Page change | That agent's or team's page; Back "← Back to <team/org>" | Same agent page as from Agents | — |
| TR-011 | UIS-003/004 | Click Runs | Tab selected | Today's run list | `pane=runs` | Filter, page, a member → UIS-007 |
| TR-012 | Any Browse view | Choose an imported source under Memory source | Pill "Imported · read-only" | Global and every Semantic tab show the not-synced note | No semantic request | Choose this node again |
| TR-013 | UIS-002/003/004 | Click "← Back to …" | Page change | The card or page it came from (same tab) | — | — |
| TR-014 | Error states | Click Retry | Loading copy | Reloaded | — | — |
| TR-015 | Leaving UIS-005 | Navigate away | — | — | The transient workspace is released; it is never listed in Workspaces or a picker | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 loading | Owners loading | "Loading memory catalog…" style centred grey (existing key) | — | — | — |
| UIS-001 error | Owners fail | Red box with the error and **Retry** | Retry | TR-014 | — |
| UIS-001 empty group | No owners of that kind | The existing empty copy for Agents / Teams / Orgs, centred grey | Tabs | — | — |
| UIS-005 no file open | Folder with files | Explorer + "No file selected" / "Select a file to read it." | Files | — | VIS-002, VIS-017 |
| UIS-005 file open | TR-005 | Preview tab; Markdown rendered; images in the image viewer | Tabs, full view | Close tab | VIS-003, 005, 018 |
| UIS-005 links | Folder holds symbolic links | Link row, "Link · not opened", tooltip "A link to a file or folder outside this folder. Links are listed but never opened." | None | — | VIS-005 |
| Agent folder missing | Folder does not exist | "No semantic memory yet" / "The folder is created when <agent> next runs." (no path, no panel) | Tabs, Back | — | VIS-007 |
| Agent folder empty | Exists, no entries | "No semantic memory yet" / "<agent> has not written anything to its folder yet." | Tabs, Back | — | VIS-006 |
| Global missing (rare) | Folder does not exist | "No global memory yet" / "The folder is created when an agent next runs." | Tabs | — | VIS-014 |
| Global empty | Exists, no entries | "No global memory yet" / "Nothing has been written to global memory yet." (presentation as VIS-014) | Tabs | — | (as VIS-014) |
| Folder loading | Reading the folder | "Loading the folder…" centred grey | — | — | — |
| Folder error | Read fails | Red box with the error and **Retry** | Retry | TR-014 | — |
| A file the node refuses | File removed/unreadable | The Files panel's own message in the tab | Other files | — | — |
| Imported source | TR-012 | "Semantic memory is not part of synced memory" / "Memory Sync copies runs and their Work Journals. An agent’s semantic memory stays on the node where the agent runs." | Source select | Choose this node | VIS-015 |
| Episodic empty / no match / loading / error | — | "<agent> has no runs yet." / the existing "no runs match this filter" copy / "Loading runs…" / red box + Retry | Filter, Retry | — | — |
| Owner not found | Stale address | "This agent, team or org is not in this memory." | Back | — | — |
| Long values | Long IDs/paths | IDs and paths break anywhere (`break-all`); names wrap | — | — | VIS-017, 018, 019 |

## Content, Labels, Validation, And Feedback

- Product voice: plain, short, sentence case; product terms Agents, Agent Teams, Agent Orgs, Memory Sync, Work Journal.
- Exact labels (en / zh-CN):

| Key | English | 简体中文 |
| --- | --- | --- |
| Browse tabs | Global · Agents · Agent Teams · Agent Orgs | 全局 · (existing) |
| Global title | Global memory | 全局记忆 |
| Global line | Knowledge shared by every agent, agent team and agent org on this node. Every agent reads it and writes to it. | 本节点上所有智能体、智能体团队和智能体组织共享的知识。每个智能体都会读取和写入它。 |
| Global missing | No global memory yet · The folder is created when an agent next runs. | 还没有全局记忆 · 智能体下次运行时会创建此文件夹。 |
| Global empty | No global memory yet · Nothing has been written to global memory yet. | 还没有全局记忆 · 还没有向全局记忆写入任何内容。 |
| Agent tabs | Episodic memory · Semantic memory (below 640 px: Episodic · Semantic) | catalog `memory.agent.*` |
| Agent subtitle | Belongs to {team} / Also works in {names joined by " · "} / Runs that no agent definition names. | catalog |
| Episode place | In {team or org} | catalog |
| Group | Agent Team / Agent Org; Members · Runs; {count} members; Shared agent | catalog `memory.group.*` |
| Back | ← Back to Memory / ← Back to {name} | catalog |
| Agent missing / empty | No semantic memory yet · The folder is created when {name} next runs. / {name} has not written anything to its folder yet. | catalog `memory.semantic.*` |
| No file | No file selected · Select a file to read it. | catalog |
| Link | Link · not opened (tooltip as above) | 链接 · 不打开 |
| Not synced | as State Behavior | catalog |
| Agents page card | The agent keeps its reusable knowledge in this folder: | catalog `agents.*` |

  The full en and zh-CN strings are in the reference: `localization/messages/{en,zh-CN}/memory.ts` (`memory.global.*`, `memory.agent.*`, `memory.group.*`, `memory.browse.*`, `memory.semantic.*`), `agents.ts`, `personalSettings.ts`.
- Form validation: N/A (no input other than the existing filters and the explorer search).

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 1280 px | Cards 3 columns; folder explorer 260 px beside the tabs | — |
| Tablet | 768–1279 px | Cards 2 columns; folder side by side | — |
| Narrow | < 768 px | Cards 1 column; folder stacked (explorer max 38 vh above the open file); Browse tabs wrap to a second line | — |
| Small | < 640 px | Agent tabs full width with short labels "Episodic" / "Semantic"; episodic filter full width | — |
| zh-CN | Locale | Same layout; strings from the zh-CN catalog | — |

## Accessibility And Keyboard Behavior

- Target: the existing product's level.
- Tabs use `role="tablist"` / `role="tab"` with `aria-selected`; cards and member cards are buttons with visible `focus-visible` rings; the Episodic filter has an aria-label; the source select has a screen-reader label.
- Link rows are `aria-disabled="true"` with a tooltip; they are not focusable actions.
- Focus order: Browse/Search/Index → tabs → source select → cards; owner pages: Back → tabs → filter → cards/explorer.
- Contrast: existing tokens only (gray-500/600/900 on white or gray-50; white on blue-600).

## Motion And Transitions

- Existing only: card hover shadow and border transition (`transition`), tab colour transitions. No new motion; reduced motion unchanged.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Owners (agents, teams, orgs, membership, shared) | Cards, member cards, subtitles | `prototype/memory-semantic/memoryOwnersFixture.ts`, `stores/memoryBrowseStore.ts` | From definitions and run discovery (design-spec) |
| An agent's episodes from every place | Episodic tab | Gathered in the store from standalone, team and org runs | One memory-explorer query (confirmed feasible by the Solution Designer) |
| Semantic folders and files | Folder view | `prototype/memory-semantic/semanticMemoryFixture.ts` through a transient workspace in `stores/workspace.ts` | `SemanticMemoryWorkspace` (`semantic_ws_<id>`), read-only refusal `WORKSPACE_READ_ONLY`, links by `lstat` (`WORKSPACE_LINK_NOT_OPENED`), `semanticMemoryFolders` with `exists` (SR-004) |
| Global folder | UIS-006 | Same fixture, id `__global__`, path `<memory>/semantic-global` | `globalSemanticMemoryFolder { folderPath, exists }`, workspace id `semantic_global_ws` (SR-006) |
| Memory folder path | Every path | `/Users/normy/.autobyteus/server-data/memory` (the founder's node) | The node's own memory folder |
| Imported sources | Not-synced note | Scenario `memory_imported_source` | Memory Sync does not carry semantic folders (INV-11) |

## Final Visual Reference Inventory

All at 1440×900 CSS px (2× pixels) unless stated; captured 2026-11-20 by clicking from `/` → Memory.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Illustrative / Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-001 Agents | Desktop | `visual-references/VIS-001-browse-agents-cards.png` | Tab order and style; card anatomy; Unattributed last; no filter; no run count on agents | Names, IDs, times |
| VIS-002 | UXJ-002 / UIS-006 files | Desktop | `visual-references/VIS-002-global-folder.png` | Title, line, path line, panel, empty tab copy | File names, path prefix |
| VIS-003 | UXJ-002 / file open | Desktop | `visual-references/VIS-003-global-file-open.png` | Preview tab, selected row, no edit controls | File content |
| VIS-004 | UXJ-003 / Episodic | Desktop | `visual-references/VIS-004-agent-episodic.png` | Back, header (Also works in …), tabs with count, filter, run card anatomy, place line | Runs, counts, paths |
| VIS-005 | UXJ-003 / Semantic, links, file open | Desktop | `visual-references/VIS-005-agent-semantic-links-file-open.png` | Path, link rows "Link · not opened", preview | Files, content |
| VIS-006 | Agent folder empty | Desktop | `visual-references/VIS-006-agent-semantic-empty.png` | Copy and plain empty style; no path or panel | Agent name |
| VIS-007 | Agent folder missing | Desktop | `visual-references/VIS-007-agent-semantic-missing.png` | Copy; nothing created | Agent name |
| VIS-008 | UXJ-004 / Teams | Desktop | `visual-references/VIS-008-browse-teams-cards.png` | Team card anatomy (runs pill, members · time) | Values |
| VIS-009 | Team Members | Desktop | `visual-references/VIS-009-team-members.png` | Header, Members/Runs tabs, member cards, "Shared agent" | Members |
| VIS-010 | Team Runs | Desktop | `visual-references/VIS-010-team-runs.png` | Embedded runs list (no second title/back) | Runs |
| VIS-011 | Shared agent reached from a team | Desktop | `visual-references/VIS-011-shared-agent-from-team.png` | "← Back to Software Engineering Team"; same agent page | Runs; the hover shadow on one card is the pointer's position |
| VIS-012 | UXJ-005 / Orgs | Desktop | `visual-references/VIS-012-browse-orgs-cards.png` | Org card anatomy | Values |
| VIS-013 | Org Members | Desktop | `visual-references/VIS-013-org-members.png` | Team and agent member cards | Members |
| VIS-014 | Global missing | Desktop | `visual-references/VIS-014-global-missing.png` | Copy; no path, no panel | — |
| VIS-015 | Global, imported source | Desktop | `visual-references/VIS-015-global-imported-not-synced.png` | Source select, pill, not-synced note | Source name |
| VIS-016 | Global, zh-CN, file open | Desktop | `visual-references/VIS-016-global-zh-CN.png` | zh-CN strings | Content |
| VIS-017 | Global, narrow | 390×844 | `visual-references/VIS-017-global-narrow.png` | Collapsed sidebar, wrapped tabs, stacked folder | — |
| VIS-018 | Agent Semantic, narrow, file open | 390×844 | `visual-references/VIS-018-agent-semantic-narrow.png` | Short tab labels, stacked folder | Content |
| VIS-019 | UXJ-006 / Agents page detail | Desktop | `visual-references/VIS-019-agents-detail-semantic-folder.png` | Semantic memory card sentence and path; no On/Off | Agent, path |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root at the integrated revision (`corepack pnpm install`, then `corepack pnpm dev --host 127.0.0.1 --port <port>`, open `/memory`).
- Ticket record: `product-ticket.md`
- Run instructions and starting states: `design-review-notes.md` ("How to look"); scenarios through `localStorage.setItem('autobyteus.prototype.scenario', …)`: `empty` (no folders: Global and agent missing), `memory_imported_source` (then choose "Office Mac (imported)"), `semantic_memory_unavailable`, `semantic_file_fails`, `loading`; zh-CN via `autobyteus.localization.preference-mode`.
- Supporting artifacts: `design-review-notes.md` (rounds 1–6, the founder's words, alternatives, findings F-1…F-3).
- Mocked boundaries and limitations: as the Data section; the image viewer is not exercised (the reference cannot serve a workspace image).

## Implementation Fidelity Boundary

- Must preserve: the owner navigation and its tabs/order; card anatomy; owner page anatomy; the read-only folder view with all five engineering points; every copy string above; the states; the responsive changes.
- Reference-only mechanisms: fixtures, the scenario key, the in-store episode gathering, the reference's use of `registerSemanticMemoryWorkspace`; leftover pre-round-3 runs pages (`view=agent-detail|team-detail|org-detail`) are not part of the design: the owner pages replace them in Browse.
- May vary: fixture names, IDs, counts, times, paths, file content; locale date formats.
- Design-system constraints: existing Tailwind tokens, Heroicons, the shared file explorer components (read-only is a mode; the Skills page keeps editing).

## Out Of Scope

- Editing semantic or global files from the UI; team- or org-level semantic folders (room for a later tab); search across semantic memory in Memory → Search; the phone's own surfaces.

## Open Decisions And Risks

- None open for the UI. Findings for engineering (from earlier rounds): F-2, a relative Markdown link in a file does nothing when clicked (the existing viewer's behaviour); the not-synced note's body names "an agent’s semantic memory" also on Global (kept as approved).

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (revision in `product-ticket.md`)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed has an applicable final visual reference: `Yes` (Global empty shares VIS-014's presentation; loading/error states use the existing Memory page styles)
- Every section covers the affected scope or is marked: `Yes`
- Recorded values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality without placeholders, clipping, overlap, or drift: `Yes`
- Every visible detail is requirements-defining unless marked illustrative: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
