# Design Review Notes: semantic-memory-view-554 (round 1)

Package `semantic-memory-for-every-agent` (autobyteus-554), requirements SR-003: REQ-004 … REQ-008, AC-004 … AC-008.
The design sits on the accepted baseline refresh `memory-baseline-refresh-554` (the Memory page and the Agents page's
semantic memory card at `origin/personal@8430d9ef12`).

## Review URL and how to look

Run (already running for the review): `corepack pnpm dev --port 4554` in
`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/semantic-memory-view-554`, then <http://localhost:4554/memory>
in a desktop-sized window.

| # | Journey | Where |
| --- | --- | --- |
| J-1 | Memory → Browse → **Semantic Memory** → a card → the folder: files on the left, the newest file open on the right → click another file | `/memory` |
| J-2 | Memory → Browse → Agents → **Daily Assistant** → **Semantic memory** (button beside the filter) → the folder → **Back to Daily Assistant** | `/memory` |
| J-3 | Research Assistant's folder: an image (`sources/update-limits.svg`) and two **links** (`shared-notes`, `sources/latest.md`), listed as "Link · not opened" and not clickable | J-1 |
| J-4 | Empty folder: **Release Notes Writer** ("has not written anything to its folder yet"). Missing folder: Agents → **Server Helper** → Semantic memory ("The folder is created when Server Helper next runs.") | J-1, J-2 |
| J-5 | Agents page → any agent → **View Details**: the Semantic memory card shows the folder path for every agent; Edit has no semantic memory switch | `/agents` |

Starting states (browser console, then reload; remove the key to reset):
`localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with
`memory_imported_source` (choose "Office Mac (imported)" under Memory source: "Semantic memory is not part of synced memory"),
`empty` (no folder on the node), `semantic_memory_unavailable` (the list fails; Retry works), `semantic_memory_truncated`
(Project Task Manager: "Showing the first 5,000 entries…"), `semantic_file_fails` (an older record "was not found on the
computer"), `loading` (slow answers). Chinese: `localStorage.setItem('autobyteus.localization.preference-mode', 'zh-CN')`.
Internal agents: Settings → Server Settings → **Show internal agents** on, then Memory → Semantic Memory lists **Model Router**.

## The design (one recommendation)

- **Entry (REQ-006 a):** a fourth Browse tab, **Semantic Memory**, after Agents / Agent Teams / Agent Orgs, with the same
  filter box ("Filter agents by name or ID…") and the same cards: agent name, definition ID, a count pill ("9 files",
  "1 file", "No files") and the newest change. Newest change first. Team-local agents are listed like any other
  (their ID shows the team). Internal agents follow "Show internal agents".
- **Entry (REQ-006 b):** on an agent's runs page, a **Semantic memory** button (light-bulb icon) beside the run filter.
  It is not shown for "Unattributed runs" (no agent). Back returns to that runs page.
- **Folder view (REQ-005):** the Work Journal's layout: the agent's name, "Semantic memory · <folder path>" (selectable),
  a **Files · N** list on the left (newest first; folder part grey, file name bold; modified time and size) and the open
  file on the right in the Files panel's own viewer (`FileViewer`, read-only preview: Markdown rendered, images in the
  image viewer, other types as the Files panel shows them). The newest file opens on arrival. Below 1280 px the list
  becomes a File select, as the Work Journal does. The open file is in the address (`&file=`), so Back and reload keep it.
- **Links (REQ-007):** a link row shows a link icon, its path and "Link · not opened"; it is not a button, its tooltip
  explains, and nothing is requested for it. In the narrow select it is a disabled option.
- **Empty / missing (REQ-005):** "No semantic memory yet" with one sentence for each case, in the Memory page's plain
  empty-state style (centred grey text, no box).
- **Imported source (REQ-008):** the tab and the folder view say "Semantic memory is not part of synced memory" and why;
  nothing is listed or requested. The folder header carries the page's "Imported · read-only" pill.
- **Errors:** the list's error with Retry (the Memory page's red box); a file the node refuses shows the Files panel's
  words ("This file was not found on the computer.") in the Memory page's red box.
- **Agents page (REQ-004, REQ-002):** the Semantic memory card always shows "The agent keeps its reusable knowledge in
  this folder:" and the path; "On." and "Off" are gone. The form's Semantic memory checkbox and its personal-setting reset
  are gone, and the personal-settings note no longer names semantic memory.
- **Room for autobyteus-555:** a node- or Project-wide folder can be a card in the same tab (for example first, named
  for its scope) and open the same folder view; nothing in this design needs to change for it.

## Alternatives considered (not built)

- A fourth top-level section (Browse / Search / Index / Semantic memory): rejected; Browse is where the page lists
  memory by subject, and semantic memory is per agent.
- A folder tree instead of a flat list: REQ-005 asks for newest first; the folders hold few, shallow files
  (`reflections/`, `records/`), so the grey folder prefix keeps the structure readable without expand/collapse.
- A Preview / Source switch on Markdown: the Files panel offers none for a read-only node file; kept the same.
- A "View in Memory" link on the Agents page's Semantic memory card: useful, but REQ-006 names two entries only. It
  would be a requirement change; say if you want it.

## Findings for the Solution Designer

- F-1: the folder listing has no team name for a team-local agent; the card shows its ID
  (`team-local-agent:software-engineering-team:solution_designer`). A team name would need the listing to return it.
- F-2: a relative link inside a Markdown file (for example `[record](../records/2026-10-26.md)`) does nothing when
  clicked: this is the existing viewer's behaviour, unchanged here.
- F-3: the count pill counts regular files; link rows are listed but not counted.

## Simulation (UI reference only)

`prototype/memory-semantic/semanticMemoryFixture.ts`: invented folders, files and Markdown, answered as the designed
`GetSemanticMemoryFolders` / `GetSemanticMemoryFiles` reads (`graphql/queries/semanticMemoryQueries.ts`, answered in
`utils/apolloClient.ts`) and a stand-in for the node-file loader (180 ms). Store: `stores/semanticMemoryStore.ts`. None of
this prescribes the server's or the web store's shape.
