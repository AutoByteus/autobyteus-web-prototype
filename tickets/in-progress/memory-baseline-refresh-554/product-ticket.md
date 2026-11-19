# Product Ticket: memory-baseline-refresh-554 (baseline refresh for autobyteus-554)

## Identity And Scope

- Ticket / request ID: `memory-baseline-refresh-554` (baseline ticket for the design ticket `semantic-memory-view-554`, package `semantic-memory-for-every-agent`, autobyteus-554)
- Title: Scoped baseline refresh of the Memory page and the Agents page's semantic memory card and field
- Status: `Completed` (baseline accepted by the Product UI/UX Designer, 2026-11-19; integration below)
- Mode: baseline refresh (Bootstrapper), scoped, requested by the Product UI/UX Designer
- Why (git check, 2026-11-19): the desktop surfaces of the design repository reflect `d74f75a51a` (the Memory page also carries the approved design `work-journal-search`). Between `d74f75a51a` and `origin/personal@8430d9ef12` the source changed the UI files of the surfaces the design ticket will change:
  - `pages/memory.vue` and `components/memory/*` (shipped autobyteus Memory page with Browse, Search, Index and the Work Journal, differently from the design in places: the "Task team" tag on Teams cards is gone (461), a run known only by its folder opens a Work Journal-only inspector (`folder-inspector`), an index error state with Retry, `MemorySpinner` with a still ring under reduced motion, dates in the app's UI locale (426), voice input in Search (320));
  - `components/agents/AgentDefinitionDetailSections.vue` (a "Semantic memory" card on the agent detail page) and `AgentDefinitionForm.vue` + new `AgentSemanticMemoryField.vue` (the opt-in switch), commit `0fa12575c5`; with their en and zh-CN texts.
  - The file viewers (`components/fileExplorer/FileViewer.vue`, `viewers/*`, `utils/fileExplorer/nodeFileContent.ts`) are byte-identical: not in scope.
- In scope: `/memory` (Browse: Agents, Teams, Orgs tabs and their empty/loading/error states; an agent's runs page; Team and Org detail; the run inspector with Work Journal and Raw traces; the folder-only inspector; Search; Index) and the Agents page's agent detail (semantic memory card, on and off) and edit form (the semantic memory field), en and zh-CN.
- Non-goals: every other surface keeps its pin; no future-state work.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/memory-baseline-refresh-554` / `design/memory-baseline-refresh-554`
- Accepted design base: `5d46595ab4bbe995050cee124e458a6f041f48f4` (`origin/personal`, fetched 2026-11-19)
- Selected source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` at `origin/personal@8430d9ef12385bb77e9ee2f808bc123c891b97b7` (read only)
- Established report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Runtime isolation: Bootstrapper's own choice, recorded in its report (port 4555 suggested; the design ticket uses 4554)
- After acceptance: commit, integrate into `personal`, then merge `personal` into `design/semantic-memory-view-554`.

## Bootstrapper result and acceptance (2026-11-19)

- Result: `Completed`, scoped Refresh, `/memory` in full and the Agents page's semantic memory card and field, source `origin/personal@8430d9ef12`; other surfaces keep their pins. Report: `ui-baseline-report.md` first section; runbook first section; evidence `evidence/memory-baseline-refresh-554/` (74 matched states, `pixel-differences.txt`, `copied-files-audit.txt`).
- Accepted. Checked: the 39 copied UI files are byte-identical to `8430d9ef12` (re-run of `cmp` against `git show 8430d9ef12:` for the page, every `components/memory` file and the three agents components); the data boundary (`prototype/memory-search/memoryDesignFixture.ts` generated from word pools and invented runs, `/Users/dev/...` workspaces, documentation IP ranges; the new semantic memory personal setting is invented; no real memory, journal or definition content); the pairs (0 differing pixels except running-build timers and one caret pixel); the running baseline on :4555 (Browse Agents tab; agent detail with the Semantic memory card).
- Recorded gaps (not parity differences, outside scope): `RuntimeModelConfigFields.vue` (autobyteus-9), memory sync settings and the left panel's workspace tree changed in the range and keep their pins; voice input in Search is baseline-only evidence.

## Integration record

- Integration: see the commit after this record.

## Outcome And Handoff (initial request)

- Next expected action: the Bootstrapper returns `Completed` or `Blocked`; the Product UI/UX Designer reviews and accepts.
- Handoff outcome: `Baseline Needed` -> `/ui_baseline_bootstrapper`
