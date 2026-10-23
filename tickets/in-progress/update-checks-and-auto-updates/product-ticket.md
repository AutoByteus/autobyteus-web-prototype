# Product Ticket — update-checks-and-auto-updates

## Identity And Scope

- Ticket / request ID: `update-checks-and-auto-updates` (the package identifier of Project Task autobyteus-210).
- Title: Update behaviour and settings: a fourth category (agent runtimes), automatic-update switches in the
  Notification Center, per-category check intervals, the app's own periodic check.
- Mode: `Product Experience Design` (evolves the approved Notification Center of autobyteus-209, the Update checks
  card, Settings → Updates).
- Status: `Awaiting User Review` (round 1)
- Requester: Solution Designer, run `solution_designer_8f0e52ca19ce43c1a1bab5c82f6fe8ed`, 2026-10-23 (Project Task
  autobyteus-210, requested by `/project_task_manager`). Handoff: `Product Design Requested`, SR-002.
- Requirements (read in full): `/Users/normy/autobyteus_org/autobyteus-worktrees/update-checks-and-auto-updates/tickets/in-progress/update-checks-and-auto-updates/requirements-doc.md`
  - UI-facing IDs: REQ-001, 004, 005, 007–013, 015–018, 020–023; AC-002, 004, 006–011, 013, 015–019, 021, 022;
    DEC-003, 004, 006, 007, 009, 012, 013, 017, 018.
- The user's words: quoted in the Solution Designer's handoff (`handoff-product-design-request.md`).
- Critical journeys:
  1. A found update → the pill → the panel → turn on automatic updates at its category (explanation visible) → the
     waiting updates are applied and announced.
  2. An automatic outcome (updated / failed / local changes / runtime waiting) → unread indicator → the row.
  3. Runtime update from the panel (and unavailable while agents run).
  4. Update checks card: intervals, switches, back-off, checks off.
  5. Settings → Updates: app check switch, interval, truthful status.
- Non-goals: automatic app update, undo / pin / skip, per-source exceptions, runtime notifications for remote or Docker
  nodes, pop-ups. PQ-1 and PQ-2 of 209 are questions for the user, not designed unless approved.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/update-checks-and-auto-updates`,
  `design/update-checks-and-auto-updates`
- Accepted design base: `1cc5563` (= `origin/personal` at intake, 2026-10-23, fetched).
- Source repository / frontend: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`, `autobyteus-web`.
  Source to base the UI on (named by the requester): worktree `/Users/normy/autobyteus_org/autobyteus-worktrees/update-checks-and-auto-updates`,
  branch `codex/update-checks-and-auto-updates`, `origin/personal` `d2820672c3`.
- Baseline report: `ui-baseline-report.md` (`WEB-BASELINE-REFRESH-012`, pin `9e7a458`).
- Baseline currency check (2026-10-23, git, `9e7a458..HEAD` of the source worktree): the files the change touches are
  unchanged since the pin: `components/notifications/*`, `components/layout/SidebarNotificationsEntry.vue`,
  `components/settings/UpdateChecksCard.vue`, `components/settings/AboutSettingsManager.vue`,
  `components/settings/ServerSettingsBasicsPanel.vue`, the notification stores and GraphQL documents. The source moved
  elsewhere (Nodes page, projects, Agent Runtimes sign-in on remote nodes). None of that is on this design's path, so no
  baseline correction or refresh is requested.
- Runtime: `corepack pnpm dev --port 4930` (this ticket); PID in `/tmp/uc210-dev.pid`; scripts and captures in `/tmp/uc210/`.
- Data origin: all fixture values are invented (repository names, revisions, versions, times); no real source content is
  copied.

## Review Rounds

### Round 1 (2026-10-23) — first review

- Review URL: `http://127.0.0.1:4930/workspace` (set `autobyteus.prototype.context` = `electron_internal` first; see the runbook).
- The user's first reaction (while the design was being built): the automatic-update explanation in the panel was far too long
  (five lines at each category). Changed before review: the panel shows 3 lines while the switch is off and 2 while it is on,
  with no tinted box; the card shows the same single text. The card's network list went from five bullets to three, and the
  interval note appears once for the three intervals.
- Design decisions (one design, alternatives in words in the review message):
  1. Switch at the top of each category, under its header, text visible at all times (shorter once on).
  2. Fourth category "Agent runtime updates" (outline `cpu-chip`), same row anatomy, versions instead of revisions.
  3. Outcome rows: updated automatically (unread dot, green, what changed always visible); failed (red box, reason, Update);
     local changes (amber note, Update); runtime waiting (reason line, disabled Update).
  4. The Settings-row entry stays while an automatic update is unread, reading "N updated" when nothing waits.
  5. Update checks card: full width; switch + what is contacted; GitHub back-off line; three intervals (number + unit);
     three automatic-update switches.
  6. Settings → Updates: automatic-check switch, interval, status and last check made truthful.


### Round 2 (2026-10-23) — placement

- The user asked whether the panel should move to the right corner. Answer: no; it opens beside the sidebar instead.
  - The panel had grown tall and covered the sidebar's navigation; the ✕ floated over scrolling rows.
  - Changed: the docked panel opens to the right of the sidebar, bottom-aligned with the Settings row (the strip variant
    already opened to the right of its icon); a fixed title row ("Notifications" + ✕) with a hairline; rows scroll under it.
  - Not chosen: the right corner (far from the pill that opened it, and it covers the Projects/Files/Terminal tools).

### Round 3 (2026-10-23) — right side of the whole window

- The user clarified: not a corner of the sidebar, but the right side of the whole site, like a notification centre, coming
  out when the pill is pressed. (Round 2's "beside the sidebar" is replaced.)
- Changed: the panel opens at the right edge of the window, 8 px from the top and right, from either entry (docked pill or
  collapsed-strip icon); it slides in from the right (150 ms); max height is the window's height minus 16 px. It covers the
  right tool panel while open. Fixed title row stays.

### Round 4 (2026-10-23) — a clearer boundary and background

- The user: clean, but no clear boundary or background that fits a notification centre.
- Changed (this reverses 209's "one white sheet, no nested cards", at the user's request):
  - the panel is a solid `slate-200` surface with a `slate-300` border, `shadow-2xl` and a faint ring, 368 px wide;
  - each category is a white `rounded-xl` card with a hairline border and a light shadow; rows inside are divided by hairlines;
    the switch and its text sit between the card header and the rows, closed by a hairline;
  - the fixed title row sits on the grey with a hairline under it.
  - A translucent first try let the page tabs show through the title; the surface is opaque.
