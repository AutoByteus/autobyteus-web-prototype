# Design Review Notes — Settings → Search (`search-model-settings`)

Review URL: <http://127.0.0.1:4691/settings?section=search> (Settings → **Search**). State is synthetic and in memory; reload resets it.

## The design in one paragraph

A new top-level Settings section **Search**, placed between *Agent Packages* and *Server Settings*, with the same header as *Extensions* (eyebrow, title "Meaning search", one
sentence that says it applies to the node the window is connected to) and two cards in the product's existing card style: **Search model** and **Project indexes**.

## Answers to the four open questions

1. **Placement (DEC-005): top-level "Search", before Server Settings.** Users look for "search"; it is node-level, so Extensions (Electron-only today) is wrong, and Server
   Settings has Basics / Advanced / Migrations sub-sections that this would crowd. Putting it before Server Settings keeps Server Settings' sub-items next to Extensions and Updates.
   Route: `/settings?section=search`. Nothing is Electron-specific, so it renders the same in a browser (Docker / self-hosted node) and the desktop window.
2. **Structure: two cards, as sketched.** Each model is a row with name, state pill and (for Active) readiness; the five catalog facts (Languages, Download, Indexing speed, Memory,
   Licence) are always shown as a small labelled grid, so the three models can be compared at a glance down the column. Memory shows "—" when the catalog has none. The Active
   row has a blue tint and an *Active* pill; no radio buttons (they would not be controls). Each downloaded model shows "N MB on disk", and the card header totals it (QR-003).
3. **Many Projects:** the Project list shows one row per Project with fixed columns (name · state · actions) and keeps a stable, alphabetical order, so rows do not jump during live
   updates. A row of count chips (**All · Needs indexing · Indexing · Ready**) summarises and filters; a name filter appears once there are more than 8 Projects
   (try scenario `search_many_projects`). No paging; the list scrolls with the page.
4. **Confirmation dialog:** a standard modal (Cancel focused, Esc cancels). It says every Project has to be indexed again, that meaning search finds exact matches only until a
   Project is indexed, when indexing starts (first search, or Index all Projects), and that only the active model's index is kept. A "What it costs" box shows the **download**
   ("346 MB, not downloaded yet" or "Already downloaded"), **indexing speed** (per Task), and **memory** when the catalog has it.

## States and actions covered (try them in the live reference)

- Model: Not downloaded · Downloading N of M MB with Cancel · Downloaded (Use this model, Remove) · Active ready / preparing (download or loading) / unavailable with reason and Retry ·
  download failed with reason, "No partial files were kept" and Retry · cancelled and removed notices.
- Project: Not indexed · Waiting · Indexing N of M · Ready (M Tasks) · Needs update (K changed) · Unavailable; Index now, Rebuild, Index all Projects.
- Section: loading, load error with Retry, no Projects, en and zh-CN, narrow layout (390 px).
- Live: progress ticks on its own, and leaving the section and coming back shows the current state. Opening the section starts nothing.

Scenarios (seed the start state only; set `localStorage['autobyteus.prototype.scenario']` and reload): `search_offline` (the first download fails, then Retry works),
`search_unavailable`, `search_many_projects`, `search_empty`, `search_load_failed`.

## Design choices that go beyond the requirement text (please confirm or drop)

- **D-1 Inline confirmation for Remove and for Rebuild.** Both are quick inline confirmations inside the row (not dialogs): Remove says it frees N MB and can be downloaded again; Rebuild says
  meaning search for that Project is exact-only until it finishes. Reason: a mistaken Remove of EmbeddingGemma 2 costs a 346 MB re-download. Easy to drop.
- **D-2 "Use this model" is also offered on a model that is not downloaded** (the download then happens as part of switching, shown on the Active row). It is hidden while that model is
  downloading ahead. The active model's own preparing download has no Cancel (the user can choose another model).
- **D-3 A Project can show "Waiting…"** (waiting for the model, or for its turn) before "Indexing N of M". "Index all Projects" is therefore usable right after a switch.
- **D-4 "Index all Projects" means "Index now" for every Project that is Not indexed or Needs update**; it is disabled when nothing needs it and when the model is unavailable.
  "Needs update" progress counts the changed Tasks ("Indexing 1 of 3").
- **D-5 Unavailable model:** every Project shows Unavailable, its actions are hidden, and a note points to Retry on the model.

## Findings for the requirements / architecture (not decided here)

- **F-1 Catalog values in zh-CN.** The reference localises the catalog facts (languages, speed, memory) by model id. If the server sends them only as an English description, the web
  client needs structured facts (size in MB, seconds per Task) or a client-side table by model id. "Fastest" for LEAF-IR is a catalog word, not a number.
- **F-2 Status shape.** The UI needs per Project: state, Tasks indexed, Tasks to index, changed count, and "waiting"; per model: file state, downloaded bytes, readiness and a failure reason.
- **F-3 Estimated total time** (Tasks × time per Task) in the dialog would be more persuasive for EmbeddingGemma 2, but needs numeric speeds and Task counts for Projects that are not
  indexed. Not designed in; the requirement asks only for download size and time per Task.
