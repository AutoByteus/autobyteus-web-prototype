# Product Ticket

## Identity And Scope

- Ticket / request ID: `memory-layout-balance-608` (Project Task `autobyteus-608`)
- Title: Rebalance Memory page header hierarchy, split-pane proportions, and Semantic memory reader layout
- Status: `Completed`
- Related requirements revision: Task `autobyteus-608` description (2026-11-25) & founder screenshot (`ctx_9531069db895__ctx_c6d2ba45493d_image.png`)
- Related requirement, behavior, acceptance-criteria, and decision IDs: `autobyteus-608` (related: `autobyteus-554`)
- Critical journey or product decision:
  - Navigate `/memory` across Browse (`Global`, `Agents`, `Agent Teams`, `Agent Orgs`), Search, and Index.
  - Open an Agent (standalone or via Team/Org member) and switch between Episodic memory and Semantic memory.
  - Open Global memory and read/switch Markdown documents in the Semantic memory split-pane reader.
  - Open a Team or Org owner page (Members and Runs) and drill into a member agent or run inspector.
- In scope:
  - Compact, well-balanced Memory page header & navigation hierarchy (eliminating the ~40% vertical header stack on owner views and aligning top-level Browse/Search/Index with secondary controls).
  - Cleaner presentation of owner subtitle, raw ID, and Semantic memory folder path (decoded, unobtrusive, copyable/selectable without dominating the viewport).
  - Balanced Semantic memory split-pane proportions (wider or better-proportioned file list, cleaner document tab truncation, taller reader canvas that uses available viewport height instead of being pushed down).
  - Proportional Markdown typography inside the Semantic memory viewer (`h1`–`h3`, spacing, readable measure) without breaking unrelated viewers.
  - Cohesive proportions across all Memory views: Global, Agents, Agent Teams, Agent Orgs (Episodic & Semantic, Members & Runs), Search, and Index, on desktop (1440×900, 1280×800) and narrow/mobile widths.
- Non-goals:
  - Production implementation, backend API changes, or Memory data/indexing semantics.
  - Changing the left application sidebar or unrelated product pages.
  - Altering the underlying read-only Semantic memory behavior established in `autobyteus-554`.

## Design & Repository Context

- Design repository/root (separate from source repository): `/Users/normy/autobyteus_org/autobyteus-web-design`
- Design ticket worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/memory-layout-balance-608`
- Design ticket branch: `design/memory-layout-balance-608`
- Source repository and selected frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web`
- Pinned source revision: Memory surface matches `autobyteus-554` (`semantic-memory-view-554`, accepted in `autobyteus-web-design@437bad9a`, shipped in `autobyteus-web@cd26f4d913`)
- Accepted baseline revision: `9bec8f39` (`origin/personal`)
- Baseline report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Product acceptance result and date: Existing accepted Memory baseline (`memory-baseline-refresh-554` + approved `semantic-memory-view-554`) confirmed in UI parity with current `autobyteus-web` (2026-11-25)
- Design revision for this ticket: `a4e314f5339e015f3d1588c909e1b0edfdfb7bde` (ticket branch `design/memory-layout-balance-608`, base `9bec8f39`; the default branch had not moved)
- Opens from the default branch after integration: `Yes` (2026-11-26: from `/memory` → Agent Teams → Software Engineering Team → Solution Designer → Semantic memory at `a4e314f5`; one header row, panel at 85 px, 0 page errors)
- Integration target and result: `personal` (`Completed`): fast-forward push `9bec8f39..a4e314f5`; canonical checkout fast-forwarded; local `personal` = `origin/personal` (this record follows in the next commit)
- Runtime isolation record (port / process / temporary state): Dev server port `4568` (`http://127.0.0.1:4568/memory`), disposable Playwright capture scripts under `/tmp/memory-608`
- Cleanup result or blocker: `Completed` after this record: review server on 4568 stopped; Tailscale Serve entry 8447 (added for this ticket) turned off, other entries unchanged; worktree and branch `design/memory-layout-balance-608` removed
- Ticket folder: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/memory-layout-balance-608` (on `personal`; in-progress path during the work: `tickets/in-progress/memory-layout-balance-608`)

## Delivery

- UI/UX specification: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/memory-layout-balance-608/ui-ux-spec.md`
- Runnable UI reference entry point: `/memory` on the design repository's `personal` (`corepack pnpm dev --port <port>`); the multi-file run: Memory → Agents → Project Task Manager → "Rename the helper and update callers"
- Visual-reference directory: `/Users/normy/autobyteus_org/autobyteus-web-design/tickets/done/memory-layout-balance-608/visual-references` (VIS-001…VIS-017, captured 2026-11-26 after approval)
- Supporting artifact paths: design changes DC-001…DC-012 are listed in `ui-ux-spec.md`; round history in this ticket
- Checked in the browser (journeys and viewports):
  - Desktop `1440×900`: Agent Semantic memory (`Solution Designer` with long filename + multi-tab bar), Agent Episodic memory, Global memory (`product.md`), Agents list, Team detail (Members & Runs), Search, Index — 0 console/page errors.
  - Narrow `700×900`: Agent Semantic memory stacked split-pane + responsive header wrap — 0 console/page errors, no clipping or overlap.
- User-confirmation reference: the founder, 2026-11-26: "Okay if you think that UI is consistent and clean now we're done."; the designer's final check (all Memory views at 1440×900, 1280×800, 390×844; 0 page errors) found it consistent and clean. Review was at `http://127.0.0.1:4568/memory`; tailnet share `https://normys-macbook-pro.tail0347f8.ts.net:8447/memory` (Tailscale Serve entry 8447 → 127.0.0.1:4568, added 2026-11-25; turn off with `tailscale serve --https=8447 off`; dev server run with `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=normys-macbook-pro.tail0347f8.ts.net`, no file changed)
- Mocked boundaries and known limitations: Uses local synthetic Memory fixtures (`prototype/memory-semantic/*` and `prototype/memory-search/*`), no production backend.

## Outcome And Handoff

- Completed behavior and evidence:
  - Unified single-row top bar (`Browse | Search | Index` + divider + `Global | Agents | Agent Teams | Agent Orgs` or `← Back to ...`).
  - Balanced two-column owner header on Agent, Team, Org, and Run Inspector views (identity + inline subtitle + quiet copyable ID on left; calm neutral segmented switcher on right, removing the competing second blue pill bar).
  - Compact Global memory header so the Semantic memory reader gets full viewport height.
  - Semantic memory split-pane card fills available viewport height (`calc(100vh - 176px)`), with 280–300px file sidebar, aligned search input, crisp `.md` document icon, 320px read-only tab filename limit, auto-opening the first document, and folder path tucked into a quiet single-line card footer with Copy path button.
  - Scoped proportional Markdown typography (`22px` semibold `h1` with subtle hairline, `17.6px` `h2`, `14px` body, `74ch` max measure, clean inline code badges).
- Round 2 (2026-11-26, the founder): "when I clicked a certain agent ... I'm already in the agent's perspective ... remove the top tabs ... you only have a back ... move it up ... more vertical space."
  - Owner pages (agent, team, org) no longer show Browse | Search | Index; a quiet Back (13 px, arrow icon) sits alone at the very top, the owner header right under it. The run inspector's Back uses the same style.
  - Top-level pages (Global, Agents, Agent Teams, Agent Orgs, Search, Index) keep Browse | Search | Index.
  - Measured at 1440×900: the semantic panel now starts at 131 px (was 153 px; the founder's original screenshot ≈ 40% down) and fills to the bottom with no page scroll. Checked 1440×900 and 390×844: agent Semantic/Episodic, team, Global, Agents, run inspector and Back from it; 0 page errors. Evidence: `/tmp/memory-608/r2/`.
- Round 3 (2026-11-26, the founder): "Do you need to have this duplicate ID under the name and then even a copy button? ... move ... episodic and semantic ... to the very top ... remove those redundant stuff which takes additional space."
  - Agent, team and org pages: one header row: `← <where Back goes> / <Name>` on the left (Back shows "Memory" or the team/org name; accessible name "Back to …"), the run filter (Episodic only) and the Episodic / Semantic (or Members / Runs) switch on the right. No ID line and no copy button (the ID is in the name's tooltip). "Belongs to <team>" is dropped when Back already names that team.
  - Run cards: no run ID line (it repeated the agent's name; still in the tooltip and matched by the filter). Member cards: no ID line.
  - Run inspector: Back, run ID · workspace and Work Journal / Raw Traces on one row; the agent's name is screen-reader only when Back already names it.
  - Measured: the semantic panel starts at 85 px at 1440×900 and 1280×800 (round 2: 131 px; round 1: 153 px). Checked 1440×900, 1280×800, 390×844: agent Semantic/Episodic, team Members/Runs, Global, Agents, run inspector and Back; 0 page errors. Evidence `/tmp/memory-608/r3/`.
  - Not changed yet: the team Runs pane still has its own filter row and run IDs on every run card and member chip.
- Round 4 (2026-11-26, the founder): "first identify any redundant words ... which doesn't give us any value ... don't treat the user as a stupid user ... only show the necessary things ... then think about the layout ... go ahead."
  - Removed: Global memory's title row and description (the selected Global tab says it; the description is its tooltip; heading kept for screen readers); the semantic panel's full-width path bar (now "Copy folder path" at the foot of the file list, path in its tooltip); ID lines on Agents / Agent Teams / Agent Orgs cards; the "Agent Team" / "Agent Org" label beside a team's name; the team Runs filter row (now in the header row); run IDs on team run cards and member chips (tooltips); the Work Journal's one-file list and file picker (shown only for 2+ files).
  - Tightened: agent run cards put workspace and time on one line; team run cards put the time beside the title; the Work Journal fills the window; the Work Journal's Back shows only where it goes ("← Project Task Manager", "← Search results") like the owner pages.
  - Measured at 1440×900: Global panel starts at 74 px (was 129); agent/team pages' content at 85 px; team run cards ~110 px tall (were ~170); Work Journal lines 136–821 px. Team Runs filter "nightly" → 2 runs. Checked 1440×900, 1280×800, 390×844 across Global, Agents, Agent Teams, agent Semantic/Episodic, team Members/Runs, Search, Index, Work Journal; 0 page errors. Evidence `/tmp/memory-608/r4/`.
  - Kept on purpose: member chips on each team run (they open that member's run); the file list's Search box (folders can be large); the file list width (narrower truncates names, the original complaint); Search and Index pages unchanged (already minimal / outside the complaint).
- Round 5 (2026-11-26, the founder on his phone, Work Journal of a run with two journal files): "the file word is on its own row".
  - No "File" label row and no separate picker: below 1280 px, with 2+ journal files, the file's name in the journal's own header is the picker (chevron; label for screen readers). With one file, no picker at all (round 4).
  - Header on a phone: Work Journal / Raw Traces takes its own full-width row, so Back is never cut off ("← Project T…" before).
  - The run is named by its title ("Rename the helper and update callers"; from the run card) instead of its run ID; run ID · workspace in the title's tooltip.
  - Journal on a phone: detail lines indent 2 characters instead of their ~11 leading spaces (full alignment kept from 640 px); line-number column 40 px instead of 56 px.
  - Checked 390×844 (before/after: `/tmp/memory-608/r5-phone-before.png`, `r5-phone-after.png`) and 1440×900; 0 page errors.
- Round 6 (2026-11-26, the founder on his phone, Raw Traces): "use the similar selection with one downward arrow ... instead of this two-direction arrow".
  - One picker style on both tabs: a bordered box with one down arrow (Work Journal's file below 1280 px, Raw Traces' file, Jump to day). A file picker only for 2+ files; one file is named as text ("segment-0001.jsonl (active) · 1 record", wrapping on a phone).
  - Raw Traces: no "Raw trace file" / "Raw Trace Limit" labels (the tab says it; screen-reader labels kept); "Raw Trace Limit [500] Apply" → "Show [500]", applied on Enter or leaving the field; "1 records" → "1 record".
  - No up/down spinner on number fields (Show, Go to line); no Go button (Enter / the phone keyboard's Go jumps).
  - Checked 390×844 and 1440×900: file picker switches files, Go to line 120 by Enter, Jump to day, Show 20 by Enter; 0 page errors. Evidence `/tmp/memory-608/r6b-*.png`.
  - For review of the Raw Traces picker (the founder asked for a run with several raw trace files): `prototype/source-observation/fixtures.mjs` `memoryTraceFilesOf` gives Project Task Manager's run "Rename the helper and update callers" (`project-task-manager_83dc9125`) three files (`raw_traces_active.jsonl` 57 records, `raw_traces_000002.jsonl` 388, `raw_traces_000001.jsonl` 412), each with its own illustrative entries; every other run keeps one file. Below 640 px the picker takes its own row and "Show" sits under it at the right. Checked 390×844 and 1440×900: three options, switching to `raw_traces_000001.jsonl` loads its entries; 0 page errors (`/tmp/memory-608/r7-raw-*.png`).
- Final check (2026-11-26): every Memory view at 1440×900, 1280×800, 390×844, 0 page errors (`/tmp/memory-608/final/`); no change needed after approval. Of the six suggestions after round 1: Global description, Episodic filter, raw IDs and the phone heading were done; the folder path became "Copy folder path" (decoding rejected: `%3A` is the real folder name); the tab style in the top bar was left (two levels of navigation, distinct on purpose).
- Remaining product decisions: none. Findings for engineering: DC-010/DC-011 change shared file-explorer components (Files panel, Skills page); the other `fab fa-*` file-type icons render blank in the product (follow-up).
- Next expected action: `/project_task_manager` hands the approved design to Software Engineering for implementation (autobyteus-608).
- Handoff outcome from `get_handoff_rules`: Pending
- Matched recipient address, when a rule applies: Pending
- Return context when no matching rule applies: `/project_task_manager` (`project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`)
