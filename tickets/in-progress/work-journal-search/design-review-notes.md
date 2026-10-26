# Memory page — design review notes (round 1)

Review URL (the product's normal entry point, no preview switch): <http://127.0.0.1:4930/memory>

Start the reference (any free port):

```bash
cd /Users/normy/autobyteus_org/autobyteus-web-design-worktrees/work-journal-search
corepack pnpm install --ignore-workspace --frozen-lockfile   # once
corepack pnpm dev --port 4930
```

## What changed on the page

1. **One memory search box at the top**, with the memory index right under it.
   - The old name filter stays, but only inside the browse card, relabelled **Filter** (and "Filter agents by name, title or run ID…"), so "Search" means memory search everywhere.
   - While a search is active its results replace the browse card; **Clear search** brings the lists back. Browse still works while the memory is not indexed.
2. **Memory index** (the pipeline) is a slim line under the search box: *Up to date · 3,654 runs · updated …*. It opens on its own when something needs attention (not indexed, building, failed, model changed) and any time you click it.
   - Four steps, each a row with its own state, a progress bar and "X of Y": **1 Find runs, 2 Journals, 3 Text index, 4 Meaning index** (each with its one-line description).
   - **Index now** (first build, only by the click), **Try again** (after a failure), **Rebuild** (with an inline confirmation).
   - The embedding model is named in the panel with a link to Server Settings → Embedding; the page never chooses it.
3. **Results**: one card per run, best first. The card header shows agent, `team · member`, run ID, workspace and *Mentioned first – latest day*. Under it 1–2 matches, newest first, each with the journal file, lines, day, a 2–3 line snippet, **Words / Meaning** and a three-level strength (**Strong / Fair / Weak**, dots plus text). Clicking the header or a match opens the run's **Work Journal at those lines**.
4. **Run detail tabs**: **Work Journal** (the default), Working Context, Raw Traces. **Episodic and Semantic are gone** (tabs, badges, strings). The run badges now say **Work Journal**.
5. **Work Journal view**: a file list on the left (name, days, lines, size; *Active*; *Matched lines* marker), a line-numbered reader on the right with the matched lines highlighted and scrolled into view, a banner with the cue and *Match 1 / Match 2* buttons, **Jump to day**, **Go to line**, and *Show 300 earlier / later lines* at the edges of the loaded part so a 48,000-line file stays light.
6. **Task teams** are listed in Agent Teams like any team, with a small dashed *Task team* tag (the same dashed-indigo language the team detail already uses for task teams). Runs of retired or renamed agents are named as recorded (*Server Helper*, *Release Notes Writer*); a run with no metadata is named by its folder (*Unattributed runs* → `claude_7d21c0e4`).

## Honest states (what you can see and how to reach it)

Scenarios only choose the starting state; every outcome is reached through the page. In the browser console, then reload (remove the key to reset):
`localStorage.setItem('autobyteus.prototype.scenario', '<name>')`

| Starting state | Scenario | Try |
| --- | --- | --- |
| Index ready (default) | `populated` | search `ddns updater for the home domain`; `bunny and tortoise`; Chinese `域名 自动更新`; open a match |
| First time, not indexed | `memory_not_indexed` | the box is disabled with "Index your memory to search it…"; **Index now**; watch the four rows run (accelerated: about 80 s instead of an hour); search while step 3 runs: the page says how much the Text index covers |
| Text ready, Meaning index running | `memory_meaning_running` | the status line says "Meaning index 38%"; a search says the Meaning index covers 38% |
| A step failed | `memory_index_failed` | **Try again** |
| Embedding model changed | `memory_model_changed` | **Rebuild** → inline confirmation |
| Search fails | `memory_search_fails` | any cue → error with **Retry** |

- **Weak matches:** search `purple elephant` — an amber "Only weak matches … try other words" note above the weak results. The page never says "nothing in memory".
- **Results are pointers:** the line under the results title says so.

## Decisions I made (and the alternatives, in words)

- *One search or two?* One memory search box on top; the name filter stays as a quiet "Filter" inside the browse card. Alternative: a single box that does both — rejected, because a name filter and a content search answer different questions and mixing their results hides which one the user got.
- *Where does the pipeline live?* Next to the search box, as a collapsed status line that opens itself when needed. Alternatives: a separate "Index" tab (hides the status where the user needs it) or a modal (blocks the page during a one-hour build) — rejected.
- *Results replace the browse lists* while a search is active, instead of sitting above them: keeps one thing on screen.
- *Strength is three words, not a number.* The evaluation report found no usable absolute score (off-topic and true matches overlap), so the page shows Strong / Fair / Weak.
- *Work Journal is the default run tab; Working Context stays* (it is the live context window, not an old per-run file).
- *Work Journal windows, not endless scroll:* a 3 MB file is read in 300-line parts around the jump.
- *Cleanup in the area I touched:* the old "Memory source" card (a dropdown with only "This node" and a "Local runnable memory" pill) is shown only when there is more than one memory source, so imported memory can come back without redesign. The run detail is as wide as the home (6xl).

## What the page depends on (for the Solution Designer's API)

Only the fields in the brief: per result the agent name, team and member, run ID, workspace, first and latest day, and per match the file, lines, day, snippet, kind (`text` / `meaning`) and strength; index status per step (`waiting / running / done / failed`, X of Y, an optional failure message), the active embedding model and the model the Meaning index was built with, and when it was last updated.

Also needed, beyond the brief (open for the Solution Designer):

1. A result for a **team or org member** needs the **team / org run ID** so the run detail can be addressed (the page's run detail is addressed that way today); `agentDefinitionId` for a standalone run (for the breadcrumb and Back link).
2. Strength is shown in **three levels**; if the server returns a number, it maps it.
3. The page assumes **search is usable as soon as the Text index has any journal** and says how much is covered (R-009). If search should wait for step 3 to finish, the box stays disabled until then.
4. During **Rebuild** the page says "search covers less while it runs"; if the old index keeps answering until the new one is ready, the sentence changes.
5. A list entry may carry `isTaskTeam` and `startedByAgentName` for the *Task team* tag; the page works without them.
6. The First-time copy quotes measured times ("about 5 minutes", "about an hour"); they are static text, not from the server.
