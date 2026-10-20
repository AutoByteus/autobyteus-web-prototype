# Product Ticket — settings-update-notifications

## Identity And Scope

- Ticket / request ID: `settings-update-notifications` (the package identifier of autobyteus-209). Supplied
  request identifier: Project Task `autobyteus-212` (the design step of autobyteus-209).
- Title: The update-notifications area in Settings.
- Mode: `Product Experience Design` (evolves the Settings page, the sidebar Settings entries and the app-update
  presentation).
- Status: `Awaiting User Review`
- Requester: `/project_task_manager` (AgentRun `project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`),
  2026-10-20, for autobyteus-209's Solution Designer (run `solution_designer_8f0e52ca19ce43c1a1bab5c82f6fe8ed`).
  The handoff is `Product Design Requested`, New Request, SR-001.
- The user's words (2026-10-20):

  > A small, quiet notification area, not a pop-up … the Settings page has a lot of empty space on the right
  > … also consider a small badge or dot on the Settings entry in the sidebar bottom-left … the Product Team
  > decides the placement and look.

- Requirements: SR-001 requirements-doc. UI-facing IDs:
  - REQ-004, 005, 007–014, 016–018; QR-004;
  - AC-002–007, 009–011, 016, 018, 019;
  - decisions DEC-001, 002, 004, 005, 006, 008, 009, 012.
- Critical journey: a background check finds updates → a dot on the Settings entry → Settings shows the
  notification area → the user reads what changed → Update (the existing flow of that kind) or Skip this
  version.
- Non-goals:
  - any automatic update;
  - pop-ups, toasts or OS notifications;
  - telemetry;
  - a "check now" button in the area (RSK-001);
  - local, built-in or application-package sources;
  - the mobile client;
  - the technical mechanism (checks, storage).

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/settings-update-notifications`,
  `design/settings-update-notifications` (base `cb384e3`)
- Source pin of the baseline: `autobyteus-web@2f211340ee` (`WEB-BASELINE-REFRESH-010`).
- Baseline check (2026-10-20): `2f21134..9227d61` changes 176 files, including the Settings page (a Server
  Settings → Embedding sub-section). This does not block the placement decision. A full refresh,
  `WEB-BASELINE-REFRESH-011`, runs in parallel in its own worktree; it is merged here before the final
  references.
- Runtime: `corepack pnpm dev --port 4681` (this ticket); scripts and captures in `/tmp/sun/` (copies in
  `review-evidence/`).

## Proposed Design (round 1)

One recommended design.

- **DEC-A Placement — a quiet rail on the right of Settings.**
  - On windows at least 1280 px wide, every Settings section shows a 352 px "Notifications" column on its
    right: `gray-50` background, a white `rounded-xl` gray-200 card with `shadow-sm`, as other Settings cards.
  - On narrower windows the rail folds into a **Notifications** entry at the top of the Settings navigation,
    with the unread count. It opens the same list as a section, centred like the other sections.
- **DEC-B Indicator outside Settings.**
  - A small dot (8 px, `sky-600`, white ring) on the Settings cog of the collapsed strip, and at the end of the
    Settings row of the docked left panel.
  - It shows only while unread notifications exist. Its accessible name is "Settings, 3 new notifications".
  - With unread notifications, the Settings entry opens on the notifications.
- **DEC-C Item anatomy.**
  - The kind (icon + "App update" / "Agent package" / "Skill source") · "Found 3 hours ago", plus a "New" dot.
  - The name (2 lines) and the `owner/repo` (1 line).
  - `branch installed → latest`, as short revisions in mono.
  - "See changes on GitHub ↗", the compare page.
  - Actions: **Update** (sky-600) and **Skip this version** (text button; tooltip "Don't notify me about this
    version again").
  - The app: "AutoByteus 1.5.7", "1.5.6 → 1.5.7 · Stable", "Release notes" (expands inline) and "Release
    page ↗", then **Download** → "Downloading 42%" with a bar → "Downloaded. Restart AutoByteus to install it."
    **Install and restart** (emerald-600) → "Restarting to install…".
- **DEC-D States.**
  - **New / read:** opening the area marks items read (the dot goes off); "New" stays for that visit.
  - **Updating:** "Updating…" with a spinner.
  - **Failed:** a red box "Update failed. Nothing was changed." with the reason; Try again; Skip this version.
  - **Updated** (by any path): "✓ Updated to 9f8e7d6" with Clear; sorted last.
  - **Empty:** "No updates waiting", with a line that depends on whether checks are on.
  - **Checks off:** "Background checks are off." above the list, or in the empty state.
- **DEC-E Skill source Update** opens the existing confirmation dialog ("Update entire skill source?", local
  edits overwritten, the source box with branch installed → latest). Cancel changes nothing.
- **DEC-F App update without the pop-up.** The self-opening bottom-right card is retired (DEC-001). The app
  notification and Settings → Updates show the same state; Download and Install only run when pressed.
- **DEC-G Background-check setting** in the rail footer: a switch (emerald / slate, as "Receive beta updates")
  with the full description of REQ-014 and "Applies to this node."
- **DEC-H Order:** the app first, then waiting items newest first, then updated ones.
- Alternatives considered (not built):
  - a Notifications section only, without the rail (ignores the empty space the user pointed at);
  - a bell icon in the workspace header (a new global control; not quiet);
  - a count badge on the cog (louder than a dot);
  - "Dismiss" (vague) instead of "Skip this version";
  - a "Check now" button (spends the shared GitHub budget; RSK-001);
  - a disclosure hiding the network description (REQ-014 asks for it to be visible).
- Round 1 changes (UI reference):
  - DC-001: `stores/updateNotificationsStore.ts` (new).
  - DC-002: `components/settings/notifications/*` (new): panel, source item, app item, meta.
  - DC-003: `pages/settings.vue` (rail, section, nav entry, end of visit).
  - DC-004: `LeftSidebarStrip.vue` and `AppLeftPanel.vue` (dot, accessible name, opens on notifications).
  - DC-005: `app.vue` (the self-opening card is no longer mounted).
  - DC-006: en / zh-CN `settings.notifications.*`.
  - DC-007: icon bundle (computer-desktop, cube, arrow-top-right-on-square, pause-circle, bell).
  - DC-008: the design-only `plugins/99.update-notifications.client.ts`:
    - synthetic items and scripted outcomes (one package's Update fails once);
    - the app at 1.5.6 with 1.5.7 available;
    - review states through `autobyteus.prototype.notifications` = `empty` | `off` | `browser` | `many`.
- Round 1 validation (`review-evidence/round-1/r2.mjs`): **18/18**.
  - indicator and its accessible count; opening the area; read after viewing;
  - package Update → updated; failed → Try again;
  - skill confirmation (Cancel / confirm); Clear;
  - app Download → progress (also in Settings → Updates) → Install and restart;
  - Skip this version (package and app); checks off;
  - empty; checks-off empty; browser (no app item); many items; zh-CN.

## Delivery And Validation

- UI/UX specification: pending
- Runnable UI reference entry point:
  - `http://127.0.0.1:4681/settings?section=updates` (wide window);
  - any page for the sidebar dot (e.g. `/chat`);
  - a window narrower than 1280 px for the section.
- Visual-reference directory: pending
- Validation: see above
- User-confirmation reference: pending
- Mocked boundaries: items and outcomes are scripted; production fills them from the node and the desktop
  shell.

## Outcome And Handoff

- Next expected action: the user reviews round 1.
- Return context: `/project_task_manager` (forwards to autobyteus-209's Solution Designer).
