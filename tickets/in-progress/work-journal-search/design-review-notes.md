# Memory page — design review notes (round 1)

Review URL (the product's normal entry point, no preview switch): <http://127.0.0.1:4930/memory>

Start the reference (any free port):

```bash
cd /Users/normy/autobyteus_org/autobyteus-web-design-worktrees/work-journal-search
corepack pnpm install --ignore-workspace --frozen-lockfile   # once
corepack pnpm dev --port 4930
```

## What changed on the page (round 3: flat, like the Skills page)

The page has no title of its own (the left menu already says Memory). One toolbar row on the grey page holds a segmented control **Browse · Search · Index**; the content is cards straight on the page, with no tab line and no big box around them (the Skills page's pattern: toolbar, search box with icon, blue primary button, white cards with a light border). On Browse the lists have a second, quiet row (Agents · Agent Teams · Agent Orgs) and a filter box that applies as you type.

1. **Browse** (the entry; today's lists). Agents / Agent Teams / Agent Orgs as before. The name filter is kept and relabelled **Filter**, so "Search" only means memory search.
2. **Search.** One memory search box ("Describe what you remember, in any words or language…"). Results replace nothing else on the tab; **Clear search** empties them. Results survive a hop to another tab.
   - One card per run, best first: agent, `team · member`, run ID, workspace, *Mentioned first – latest day*; 1–2 matches, newest first, each with file, lines, day, a 2–3 line snippet, **Words / Meaning** and **Strong / Fair / Weak**. A card or a match opens the run's **Work Journal at those lines**.
   - If the index needs attention, a one-line notice above the results says so with **View the index**; if the memory was never indexed, the tab says so and offers **Index now**, which starts the build and takes you to the Index tab.
3. **Index** (the pipeline, with room to breathe). A headline status (*Up to date · 3,654 runs · updated …*, *Not indexed yet*, *Step 3 of 4 · Text index 43%*, *Stopped at Journals*, *Embedding model changed*), then four connected step cards: **1 Find runs → 2 Journals → 3 Text index → 4 Meaning index**, each with state icon, progress bar and "X of Y". Under them, what works now: **Search by words** and **Search by meaning** (*Ready / Covers 38% so far / Not yet*).
   - **Index now** (first build, only by the click), **Try again** (after a failure), **Rebuild** (inline confirmation). The embedding model is named with a link to Server Settings → Embedding.
   - The **Index tab label carries a small badge** so progress is visible from the other tabs: a spinner and percent while it builds, an amber or red dot when it needs you, nothing when it is fine.
4. **Run detail tabs**: **Work Journal** (the default), Working Context, Raw Traces. **Episodic and Semantic are gone** (tabs, badges, strings). The run badges say **Work Journal**.
5. **Work Journal view**: file list on the left (name, days, lines, size; *Active*; *Matched lines* marker), a line-numbered reader with the matched lines highlighted and scrolled into view, a banner with the cue and *Match 1 / Match 2* buttons, **Jump to day**, **Go to line**, and *Show 300 earlier / later lines* at the edges of the loaded part so a 48,000-line file stays light. Back returns to the search results (or the Browse list).
6. **Task teams** are listed in Agent Teams like any team, with a small dashed *Task team* tag. Runs of retired or renamed agents are named as recorded (*Server Helper*, *Release Notes Writer*); a run without metadata is named by its folder (*Unattributed runs* → `claude_7d21c0e4`).

## Honest states (what you can see and how to reach it)

Scenarios only choose the starting state; every outcome is reached through the page. In the browser console, then reload (remove the key to reset):
`localStorage.setItem('autobyteus.prototype.scenario', '<name>')`

| Starting state | Scenario | Try |
| --- | --- | --- |
| Index ready (default) | `populated` | search `ddns updater for the home domain`; `bunny and tortoise`; Chinese `域名 自动更新`; open a match |
| First time, not indexed | `memory_not_indexed` | the Index tab shows the first-time page; the Search box is disabled with "Index your memory to search it…"; **Index now**; watch the four steps run (accelerated: about 80 s instead of an hour); search while step 3 runs: the page says how much the Text index covers |
| Text ready, Meaning index running | `memory_meaning_running` | the status line says "Meaning index 38%"; a search says the Meaning index covers 38% |
| A step failed | `memory_index_failed` | **Try again** |
| Embedding model changed | `memory_model_changed` | **Rebuild** → inline confirmation |
| Search fails | `memory_search_fails` | any cue → error with **Retry** |

- **Weak matches:** search `purple elephant` — an amber "Only weak matches … try other words" note above the weak results. The page never says "nothing in memory".
- **Results are pointers:** the line under the results title says so.

## Decisions I made (and the alternatives, in words)

- *One search or two?* One memory search box, on its own tab; the name filter stays as a quiet "Filter" on Browse. Alternative: a single box that does both — rejected, because a name filter and a content search answer different questions and mixing their results hides which one the user got.
- *Where does the pipeline live?* On its own **Index** tab (the user's suggestion, round 2), so it can be shown as a real pipeline; the tab label carries a progress badge and the Search tab shows a one-line notice, so nothing is hidden. Alternatives: a strip under the search box (round 1: too cramped for four steps) or a modal (blocks the page during a one-hour build) — rejected.
- *Entry tab:* Browse, because it is today's page and needs no index; Search and Index follow.
- *No page title or subtitle,* and no repeated explanations: the left menu already says Memory.
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
