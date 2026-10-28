# Design Review Notes — Settings → Search (`search-model-settings`)

Review URL: <http://127.0.0.1:4691/settings?section=server-settings&mode=embedding> (Settings → Server Settings → **Embedding**). State is synthetic and in memory; reload resets it.

**Revision 2 (2026-10-19, the user's direction):** the section is a sub-section of **Server Settings** named **Embedding** (not a top-level "Search"), and the wording is technical: "Embedding model". This resolves DEC-005 in favour of "under Server Settings".

**Revision 3 (2026-10-19, "make the UI cleaner"):** a visual design review of the first candidate found too many boxes, pills and coloured buttons. Changes: one bordered list
per card instead of a box per row; status as one plain line (dot and words) instead of pills; the five catalog facts as one quiet line per model instead of a labelled five-column grid
repeated three times; progress as a thin bar and one text line (no tinted box); failures and outcomes as plain text lines; buttons grey outlines, Remove and Rebuild as text buttons, and
**Index all Projects** the only filled blue button on the page; filter chips became plain text tabs; the loose intro paragraph moved into the card description; the "one model at a time" note
became a footnote; Projects of an unavailable model show quiet grey "Unavailable".

**Revision 4 (2026-10-19, "be conservative about the information"):** each model now shows only **its name, its state, its language label and its download size** (for example
"English · 55 MB"). Licence, indexing speed and memory are gone from the rows, and the switch dialog states the **download size only**. Size is the only fact that is certain (the sum of the
model's file sizes). The language label is the one catalog fact kept, because it is the one that changes which model a user should pick (an English-only model for Chinese Tasks);
it is optional in the UI, so a model without a label simply shows its size. The per-model "on disk" text is gone (size already says it); the card still totals "On disk: N MB".
**Requirement impact for the Solution Designer:** this narrows REQ-001 (licence, indexing speed and memory no longer shown) and the cost in REQ-004 / DEC-008 (the dialog no longer
shows time per Task). It also removes the need for structured speed and memory values in the catalog (old F-1, F-3).

**Revision 5 (2026-10-19, "less text; where does the model come from?"):** the people who open Embedding are technical, so the copy is cut to what they need. The Embedding model card has one
line under its title: "Used for meaning search. Downloaded from Hugging Face." (every catalog model is pinned to a Hugging Face repository, so the source is said once, as a link, not per row).
Removed: the "applies to this node" sentence, the "one model at a time / stays on disk" footnote, the Project indexes help sentence, the dialog's two extra bullets, the "No partial files",
"Exact-match search still works" and "You can download it again" lines, and the completion/cancel/removed notices (the row's state change is the feedback). A failed download still names
`huggingface.co`. The switch dialog is now: title, one lead sentence, one bullet (exact matches only until then), and the download size.

## The design in one paragraph

Server Settings gets a fourth sub-section, **Embedding**, between *Basics* and *Advanced* (Basics · Embedding · Advanced · Migrations). It uses the Server Settings page's own look (slate page,
large white rounded cards with a 2xl title) and has a one-line intro (what embeddings are for, and that the settings apply to the node the window is connected to) and two cards:
**Embedding model** and **Project indexes**. Route: `/settings?section=server-settings&mode=embedding`.

## Answers to the four open questions

1. **Placement (DEC-005): under Server Settings, as "Embedding"** (the user's decision). It sits next to Advanced, where the raw `AUTOBYTEUS_EMBEDDING_MODEL` key lives, and it is node-level
   like the rest of Server Settings. Nothing is Electron-specific, so it renders the same in a browser (Docker / self-hosted node) and the desktop window.
2. **Structure: two cards.** Each model is a row with name, state pill and (for Active) readiness; the five catalog facts (Languages, Download, Indexing speed, Memory, Licence) are always
   shown as a small labelled grid, so the three models compare at a glance down the column. Memory shows "—" when the catalog has none. The Active row has a blue tint and an *Active* pill;
   no radio buttons (they would not be controls). Each downloaded model shows "N MB on disk", and the card header totals it (QR-003).
3. **Many Projects:** one row per Project with fixed columns (name · state · actions) in a stable, alphabetical order, so rows do not jump during live updates. Count chips
   (**All · Needs indexing · Indexing · Ready**) summarise and filter; a name filter appears once there are more than 8 Projects (scenario `search_many_projects`). No paging.
4. **Confirmation dialog:** a standard modal (Cancel focused, Esc cancels). It says every Project has to be indexed again, that meaning search finds exact matches only until a Project is
   indexed, when indexing starts (first search, or Index all Projects), and that only the active model's index is kept. A "What it costs" box shows the **download** ("346 MB, not downloaded
   yet" or "Already downloaded"), **indexing speed** (per Task), and **memory** when the catalog has it.

## States and actions covered (try them in the live reference)

- Model: Not downloaded · Downloading N of M MB with Cancel · Downloaded (Use this model, Remove) · Active ready / preparing (download or loading) / unavailable with reason and Retry ·
  download failed with reason, "No partial files were kept" and Retry · cancelled and removed notices.
- Project: Not indexed · Waiting · Indexing N of M · Ready (M Tasks) · Needs update (K changed) · Unavailable; Index now, Rebuild, Index all Projects.
- Section: loading, load error with Retry, no Projects, en and zh-CN (nav label 嵌入, card 嵌入模型), narrow layout (390 px).
- Live: progress ticks on its own, and leaving the section and coming back shows the current state. Opening the section starts nothing.

Scenarios (seed the start state only; set `localStorage['autobyteus.prototype.scenario']` and reload): `search_offline` (the first download fails, then Retry works),
`search_unavailable`, `search_many_projects`, `search_empty`, `search_load_failed`.

## Design choices that go beyond the requirement text (please confirm or drop)

- **D-1 Inline confirmation for Remove and for Rebuild.** Both are quick inline confirmations inside the row (not dialogs): Remove says it frees N MB and can be downloaded again; Rebuild says
  meaning search for that Project is exact-only until it finishes. Reason: a mistaken Remove of EmbeddingGemma 2 costs a 346 MB re-download. Easy to drop.
- **D-2 "Use this model" is also offered on a model that is not downloaded** (the download then happens as part of switching, shown on the Active row). It is hidden while that model is
  downloading ahead. The active model's own preparing download has no Cancel (the user can choose another model).
- **D-3 A Project can show "Waiting…"** (RV-001, 2026-10-28: one wording, whatever the model's state; the model card shows the model's state) before "Indexing N of M". "Index all Projects" is therefore usable right after a switch.
- **D-4 "Index all Projects" means "Index now" for every Project that is Not indexed or Needs update**; it is disabled when nothing needs it and when the model is unavailable.
  "Needs update" progress counts the changed Tasks ("Indexing 1 of 3").
- **D-5 Unavailable model:** every Project shows Unavailable, its actions are hidden, and a note points to Retry on the model.

## Findings for the requirements / architecture (not decided here)

- **F-1 What the UI needs from the catalog:** per model its id, name, total download size in bytes, and (optionally) a short language label (the catalog has `languages: ["en"]` / `["multilingual"]`, so the UI maps these to "English" / "100+ languages"). The reference localises the language label by
  model id, so zh-CN works; if the server supplies it only in English, either keep a client table by model id or omit the label.
- **F-2 Status shape.** Per Project: state, Tasks indexed, Tasks to index, changed count, and "waiting". Per model: file state, downloaded bytes, readiness and a failure reason.
- **F-3 Default model:** the "Default" tag needs only the default model id, which the setting already defines.

## Self-validation round (2026-10-19, before the final approval)

Checked the reference against the requirements (REQ-001–009, AC-001–009), the real catalog code (`embedding-model-catalog.ts`, `embedding-model-setting.ts`) and the flows. Found and fixed:

1. **LEAF-IR is 24 MB, not 23.** Its files total 23,888,539 bytes (23.9 MB in decimal MB); the catalog's "About 23 MB" text is rounded down. Sizes are the sum of the file bytes in decimal MB: Granite 55, LEAF-IR 24, EmbeddingGemma 2 346 (total 425, which matches ASM-001). The UI must compute sizes from `files[].bytes`, not from the description text.
2. **Model ids** in the reference now match the catalog ids (`granite-embedding-small-english-r2`, `mdbr-leaf-ir`, `embeddinggemma-2`).
3. **Keyboard focus** follows the inline Remove and Rebuild confirmations (into Cancel, back to the row's button on Esc or Cancel, onto the row after a confirm).
4. **Completions are announced** to screen readers (a hidden polite status: "<model> downloaded.", "<model> is ready.", "<Project> indexed."), since the visible notices were removed.
5. **The Embedding panel does not wait for the raw settings to load** (it has its own loading and error states).
6. New browser checks: a switch whose download fails then Retry (SRCH-017), Index all while the model prepares, focus and announcements (SRCH-018), sizes (SRCH-019): 87/87.

Behavior the reference does not model, for the specification and the architecture:

- **REQ-009 / AC-009:** a value set in Advanced or an env file must show as Active in Embedding. The code resolves a blank value, or a value outside the catalog, to the default model (`resolveActiveEmbeddingModel`), so the Active row shows the resolved model. The reference has no link between the Advanced table and this section.
- Index all means "Index now for every Project that is Not indexed or Needs update"; Ready Projects show Rebuild only, Not indexed Projects show Index now only.
- Downloads of different models may run side by side in the UI; whether the server allows it is an architecture matter.
