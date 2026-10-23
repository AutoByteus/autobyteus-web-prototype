# UI/UX Specification: Update Checks, Agent Runtimes And Automatic Updates (autobyteus-210)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket:
  - Product ticket `update-checks-and-auto-updates`;
  - Project Task autobyteus-210 (design step), requested by the Solution Designer (run
    `solution_designer_8f0e52ca19ce43c1a1bab5c82f6fe8ed`) for `/project_task_manager`.
- Related requirements revision: **SR-003**
  (`/Users/normy/autobyteus_org/autobyteus-worktrees/update-checks-and-auto-updates/tickets/in-progress/update-checks-and-auto-updates/requirements-doc.md`).
- Related IDs:
  - requirements: REQ-001, 004, 005, 007, 008, 009, 010, 011, 012, 013, 015, 016, 017, 018, 020, 021, 022, 023;
  - acceptance criteria: AC-002, 004, 006–011, 013, 015–019, 021, 022;
  - decisions: DEC-003, 004, 006, 007, 009, 012, 013, 017, 018, 019;
  - 209: REQ-004–014, 016–018 (this spec extends `tickets/done/settings-update-notifications/ui-ux-spec.md`, VIS-001..028, and
    replaces its panel look, placement and one-sheet layout where stated below).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (rounds 1–7): `http://127.0.0.1:4930/workspace`, the product's normal entry point. Scenario and window context are seeded
  from local storage (see the runbook); no preview-only control exists.
- Explicit user confirmation, 2026-10-23, after round 7: "Okay, now I think I like [it]. It's satisfying. I like it now. Works nice.
  Looks nice as well. Approved." (the user, in the Product UI/UX Designer conversation).
  - Decisions the user gave on the way: the panel opens on the right side of the whole window (not beside the sidebar);
    a grey surface with one white card per category; far fewer words in the panel, the Update checks card and Settings → Updates;
    a package's Update runs without a confirmation; with an automatic update on, local changes are replaced (a confirmation
    when it is turned on); no indicator on Settings pages (both attempts were removed).
- Final check date: 2026-10-23 (each journey below clicked through in the browser from the normal entry point, en and zh-CN).

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`; the requester's source for this design:
  worktree `/Users/normy/autobyteus_org/autobyteus-worktrees/update-checks-and-auto-updates`, branch
  `codex/update-checks-and-auto-updates`, `origin/personal` `d2820672c3`.
- Selected frontend application or product surface: `autobyteus-web`: the Notification Center (entry, panel, rows), the "Update
  checks" card (Settings → Server Settings → Basics), Settings → Updates.
- Pinned source commit of the baseline: `9e7a45880865912442f4188e6d2a58d99b10a54c` (`WEB-BASELINE-REFRESH-012`). The files this design
  changes were unchanged in the source between that pin and `d2820672c3` (checked with git, recorded in `product-ticket.md`), so no
  baseline refresh was needed.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- UI reference revision: the integrated revision recorded in `product-ticket.md` (Delivery And Validation).
  - Ticket branch: `design/update-checks-and-auto-updates`; accepted design base: `1cc5563`.
- Ticket folder: `tickets/done/update-checks-and-auto-updates/`
- Baseline report: `ui-baseline-report.md` at the design repository root.

## Problem And Design Rationale

- **User problem and intent.** Users did not see that an agent package had been updated; users forget or do not know to update
  packages, skill sources and agent runtimes. The user wants: updates found sooner (an interval per category), agent runtimes as a
  fourth notification category, and an opt-in automatic update he can turn on "right where they see the notice". The app itself is
  never updated automatically.
- **Key UX decisions and why** (rounds 1–7, all in `product-ticket.md`):
  1. **The switch sits at its category, under the card header, with its meaning in the text.** The user sees it before the rows.
     Software has none. The text is 3 lines while off ("Downloads … installs them without asking. They can change what your agents
     do. Local changes are replaced.") and 2 while on. The user: the first version (five lines per category) was far too much text.
  2. **Turning packages or skill sources on asks once** (a danger-variant confirmation), because later updates replace local changes
     without asking. Turning runtimes on asks nothing (no local changes exist; the text at the switch is enough). Cancel leaves it off.
  3. **Local changes are replaced, not skipped** (the user; DEC-019). A skipped package that has files added would never update and
     every existing package would be skipped once. The "not updated: local changes" row is gone.
  4. **The panel opens on the right side of the whole window**, from the top (like a notification centre), from either entry. It is a
     grey surface with one white card per category, so the boundary and the groups read clearly. This replaces 209's one white
     sheet with the sky border, at the user's request ("no clear boundary or background").
  5. **A fixed title row** ("Notifications" + ✕); the rows scroll under it, never under the close button.
  6. **Outcomes are rows of their category**, not a separate list: updated automatically (unread until seen), failed (red box with the
     reason), runtime waiting for agents (reason line).
  7. **The Settings-row entry stays while an automatic update is unread**, reading "N updated" when nothing waits.
  8. **Update checks card**: full width, three blocks (the background-check switch with its contacts, the three intervals, the three
     automatic-update switches), the same switch text as the panel, one-sentence back-off.
  9. **Settings → Updates**: a switch and an interval for the app's own check, truthful status and last check.
- **Alternatives considered and rejected:**
  - panel at the far right corner (far from the pill, covers the tools) → the user then clarified the right side of the whole window
    and chose it; the panel beside the sidebar (tried, replaced);
  - a tinted well around the switch (more boxes, more height) → plain text under the label;
  - the full explanation at every switch → short text there, the confirmation carries the full warning;
  - an indicator on Settings pages: a "Notifications" row with a pill in the Settings navigation, then an icon button at the top right
    → both rejected by the user as ugly/not clean; Settings pages have none (PQ-1 not adopted);
  - a backup of the replaced folder, undo, pin, skip-version → out of scope (DEC-003, SR-003);
  - skipping an update that would replace local changes → superseded (DEC-019).
- **Related questions from 209:** PQ-1 (no indicator on Settings pages): not adopted. PQ-2 (skill confirmation overlaps the panel
  below about 1100 px): fixed; the confirmation opened from the panel is above it (VIS-017).

## Scope And Experience Goal

- **User or actor:** the AutoByteus user (desktop window of the desktop's own node; a window of another node; a browser window). The
  node's scheduled checks and automatic updates, and the app's periodic check, are the actors that cause the changes.
- **Context:** any page with the Notification Center entry (docked sidebar or collapsed strip); Settings → Server Settings →
  Basics; Settings → Updates.
- **Goal:** learn of updates sooner; update by one press where it is shown; opt in to automatic updates where the notice is, knowing
  what it means; see what automatic updates did.
- **Observable success:** see the journeys below and VIS-001..037.
- **In-scope surfaces and journeys:** UIS-001..006; UXJ-001..012.
- **Non-goals:** automatic update of the app; undo, pin, skip; per-source exceptions; runtime notifications, switches or Update on
  remote or Docker nodes; pop-ups, toasts or OS notifications; an update indicator on Settings pages; a backup of replaced files.

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, 011, AC-002 | Intervals per category in the Update checks card: number + unit (minutes or hours), 15 minutes to 24 hours; a value out of range is refused with a message and the old value stays; saved on blur or Enter with "Saved". A one-line GitHub note. | UIS-004, UXJ-009, VIS-018, 021, 022 |
| REQ-004, AC-004 | "GitHub asked this node to wait until HH:MM." in the card; no notification for it. | UIS-004, VIS-019 |
| REQ-005, 006, 010, AC-010, 011 | Switches (packages, skill sources, runtimes on the desktop's own node), off by default, in the panel at their category and in the card; one setting (both read and write the same state). The text at the switch says what it means. A waiting update is applied within about a minute of turning on (the reference: a few seconds), said at the switch. | UIS-002, 004, UXJ-003, 004, VIS-004–009, 018 |
| REQ-007 (SR-003), AC-008 | Turning packages or skill sources on opens a confirmation: what is downloaded and from where; updates can change what agents do; local changes and added files are replaced without asking and cannot be restored; how to turn it off. Cancel leaves the switch off. | UXJ-004, VIS-006, 023 |
| REQ-008, 009, AC-006, 007 | Automatic outcomes as rows: updated automatically to … (what changed: compare link, or "From …" for a runtime), unread until seen; automatic update failed, nothing changed, with the reason, and a manual Update. The entry shows while one is unread. | UXJ-005, 006, VIS-008, 010, 014, 015 |
| REQ-012, 013, 015, 016, AC-013, 015, 016 | Settings → Updates: switch (on by default), interval (default 60 min), truthful status and Last Checked, "Automatic checks: every …/off"; what it contacts. | UIS-005, UXJ-010, VIS-024–027, 030 |
| REQ-016 | The card lists what the node contacts: github.com for packages and skill sources; for runtimes GitHub (Codex), downloads.claude.ai, Antigravity's updater, xAI (Grok); for automatic updates GitHub downloads and each runtime's own update command; no account or token; nothing sent to AutoByteus. | VIS-018 |
| REQ-017, AC-017 | With Update checks off, the card dims the intervals and automatic-update areas and says they do nothing; a switch that is on says so in the panel. | UXJ-008, VIS-016, 020 |
| REQ-018, AC-016 | All new text in en and zh-CN (Content). | VIS-028–030 |
| REQ-020, 021, AC-018, 019, 022 | Fourth category "Agent runtime updates": rows with installed → newest version; Update runs the vendor update; unavailable with the reason while that runtime has running agents; failure shows the vendor message and Try again. Only in windows of the desktop's own node. | UIS-002, UXJ-007, VIS-004, 011–013, 036, 037 |
| REQ-022, AC-020 | Runtime automatic updates: only when no agent of that runtime runs; the row says it waits ("It will be updated automatically once no agent is running."). | VIS-009, 010 |
| REQ-023, AC-021 | No switch, text or action for automatic app updates; the app row keeps Download → Install and restart; Settings → Updates says an update is only announced. | VIS-003, 024 |
| DEC-006 | Check failures create no notification; the card says it only for GitHub's wait. | VIS-019 |

## Visual Language

- **Existing product language preserved:** Tailwind slate/gray neutrals; `sky-700` as the Notification Center's blue; Heroicons
  (outline in section headers, `-20-solid` small glyphs); the Basics card pattern (`rounded-3xl`, 2xl title, inner rows); the shared
  `ConfirmationModal` (danger variant) used by the skill confirmation; the emerald switch of the Basics cards.
- **Notification Center panel** (replaces 209's panel look; the entry's pill is unchanged except as stated):
  - Placement: fixed, `right: 8px`, `top: 8px`; width 368 px (`max-width: 100vw − 1rem`); max height `100vh − 16px`; `z-90`. From
    either entry (docked pill or collapsed-strip icon). It slides in from the right (opacity 0 → 1, `translateX(8px) → 0`, 150 ms;
    none under reduced motion).
  - Surface: `bg-slate-200` (opaque), `border border-slate-300`, `rounded-2xl`, `shadow-2xl`, `ring-1 ring-black/5`.
  - Title row: height 44 px (`h-11`), `border-b border-slate-300/60`, `pl-4 pr-2.5`; "Notifications" `text-sm font-semibold
    text-gray-900`; ✕ 28 px round, `text-gray-400`, hover `bg-gray-100 text-gray-700`.
  - Body: scrolls; `p-3`, cards `space-y-3` apart.
  - Category card: `rounded-xl bg-white border border-slate-200/80 px-4 pb-1 pt-3`, shadow `0 1px 2px rgba(15,23,42,.08)`; header:
    16 px outline icon + `text-xs font-medium leading-5 text-gray-500`; icons: software `computer-desktop`, package `cube`, skill
    `sparkles`, runtime `cpu-chip`.
  - Switch block (packages, skill sources, runtimes only): under the header, `mt-1 border-b border-gray-100 pb-2.5`; label "Update
    automatically" `text-xs font-medium leading-5 text-gray-900`; switch 36 × 20 px (`h-5 w-9`, knob 16 px; on `bg-emerald-500`, off
    `bg-slate-300`); text `mt-0.5 text-xs leading-5 text-gray-500`.
    - applying note (on, waiting rows): `text-xs text-sky-800`, `clock-20-solid` `sky-600`, `role=status`;
    - no-effect note (on, checks off): `text-xs text-amber-800`, `pause-circle-20-solid` `amber-600`;
    - save error: `text-xs text-red-700`, `role=alert`.
  - Rows: `divide-y divide-gray-100`; row `py-2.5`; name 13 px medium; versions plain 12 px (revisions mono 11 px); "New" dot 6 px
    `sky-700` at the row's left; action `rounded-full px-3 py-1 text-xs font-semibold` (Update `bg-sky-700` white; Clear
    `text-gray-600`).
  - Update unavailable (runtime with agents running): same button at 50 % opacity, `aria-disabled`, hover unchanged; reason line
    `text-xs leading-5 text-gray-600` below the row.
  - Updated automatically: line 2 `text-emerald-700` with `check-circle-20-solid` `emerald-600`; line 3 `text-xs text-gray-500`:
    relative time · "See changes on GitHub ↗" (`text-sky-700`, packages and skill sources) or "From {{version}}" (runtimes); the
    name stays `text-gray-900` and the dot shows while unread or new this visit; Clear on the right.
  - Automatic failure box: `rounded-md bg-red-50 px-2.5 py-1.5 text-xs leading-5 text-red-800`; reason `text-red-700`, multi-line kept.
  - Confirmation overlays above the panel: `z-[100]` (the shared modal's `layerClass`); the skill-source confirmation opened from
    the panel uses it too.
- **Settings-row entry** (docked pill, collapsed-strip icon): unchanged look; text and rule below.
- **Update checks card** (full width, `xl:col-span-2`): card as the Basics pattern; three blocks:
  1. inner row (`rounded-2xl border border-slate-200 bg-slate-50/60 p-4`): label 14 px semibold, one-line text, switch 44 × 24 px
     (as the Basics cards), then a hairline and "Contacts" (`text-xs font-semibold uppercase tracking-wide text-gray-500`) with three
     bullets (`text-[13px] leading-5 text-gray-600`);
  2. "How often to check": `divide-y` list in a `rounded-2xl border border-slate-200` box; each row: label left; right
     "Every" + number input (`h-10 w-20 rounded-lg border border-gray-300 px-3 text-sm`) + unit select (`h-10 rounded-lg`) + a
     64 px "Saved" slot (`text-xs font-medium text-emerald-700`); invalid: input `border-red-400`, a `text-xs text-red-700` message
     under the row; one `text-xs text-gray-500` note under the list;
  3. "Automatic updates": `divide-y` list in a `rounded-2xl` box; each row: kind label (14 px semibold) + 44 × 24 switch + the same
     text as the panel (`text-[13px] leading-5 text-gray-600`).
  - Back-off banner under block 1: `rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900`, `clock-20-solid`
    `amber-600`. Checks-off banner: same style, `pause-circle-20-solid`.
  - Checks off: blocks 2 and 3 get `bg-slate-50/40` and the intervals `opacity-60`; they stay editable.
- **Settings → Updates**: the existing panel (`rounded-xl border p-5`); an "automatic check" section under the message strip
  (`border-t pt-4`): label 14 px medium, description, 44 × 24 switch; below it a `rounded-lg bg-slate-50 px-4 py-3` box with the
  interval field and, when off, `text-xs text-amber-800` "Automatic checks are off, so the interval has no effect. …"; the beta
  channel row and buttons follow as before.
- **Confirmation overlay** (turning packages or skill sources on): the shared `ConfirmationModal`, `variant="danger"`: title
  `text-lg font-semibold text-red-700`; body list `text-sm leading-6 text-slate-600` with the "replaced" line `font-medium
  text-slate-900`; buttons Cancel / "Turn on" (`bg-red-600`); backdrop `bg-black/50`; `max-w-md`, `p-6`, `rounded-lg`.
- **Typography:** the app font as the product.
- **Contrast** (computed): white on `sky-700` 5.93:1; `emerald-700` on white 5.48:1; `gray-500` on white 4.83:1; `amber-800` on
  `amber-50` ≥ 7:1; `red-800` on `red-50` ≥ 7:1; the disabled Update button is intentionally low-contrast and is explained by the
  adjacent reason line.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Notification Center panel | The notification area (changed: right side, grey surface, white cards, title row) | open/closed; sections; empty; modal open | `components/notifications/NotificationCenter.vue`, `stores/notificationCenterStore.ts` |
| Category card | One per kind (changed: card, switch block, 4th kind) | software, runtimes, packages, skills; switch off/on | `components/notifications/NotificationSection.vue` |
| Automatic-update switch | The switch, its text, applying/no-effect/error notes, the confirmation | panel / card; off, on, applying, no effect, error | `components/notifications/AutoUpdateSwitch.vue` |
| Update row | One update (changed: runtime kind, outcomes) | waiting (new/read), updating, failed, handled, updated automatically, automatic failure, runtime blocked | `components/notifications/NotificationRow.vue` |
| Entry | Count of what waits or is unread (changed: "N updated") | unread (solid), read (soft), outcome-only, strip | `components/layout/SidebarNotificationsEntry.vue` |
| Update checks card | The node's settings (changed: full) | checks on/off; GitHub wait; remote node (no runtimes) | `components/settings/UpdateChecksCard.vue`, `UpdateIntervalField.vue` |
| Settings → Updates | The app's check (changed) | on/off; up to date, available, failed | `components/settings/AboutSettingsManager.vue` |
| Shared modal | Layer option | `layerClass` (default `z-50`) | `components/common/ConfirmationModal.vue`, `components/skills/SkillSourceUpdateConfirmation.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Any page, docked sidebar | A check found updates | Notice them | Solid pill "N updates"; hover lists the types | REQ-020, 209 UXJ-001 |
| UXJ-002 | Same | Pill solid | See them | The panel on the right; rows read; pill soft | 209 UXJ-002 |
| UXJ-003 | Panel | Updates wait, switch off | Opt in at the category | Switch on, "N waiting … within about a minute"; they are applied | REQ-005, 006, 010, AC-010 |
| UXJ-004 | Panel or card | Packages or skill sources switch off | Confirm what it means | Confirmation → Turn on (or Cancel/Esc: stays off) | REQ-007 (SR-003), AC-008 |
| UXJ-005 | Panel | Automatic updates ran | See what happened | "Updated automatically" rows, unread dot, entry "N updated" if nothing waits | REQ-008, AC-006, 007 |
| UXJ-006 | Panel | An automatic update failed | Retry by hand | Red box with the reason, Update | REQ-008, 009, AC-009 |
| UXJ-007 | Panel (own node) | A runtime update waits | Update it | Updating… → Updated to …; unavailable while agents run; failure → Try again | REQ-020, 021, 022, AC-018–020 |
| UXJ-008 | Panel / card | Update checks off | Understand | "No effect while Update checks is off …"; card banner | REQ-017, AC-017 |
| UXJ-009 | Settings → Server Settings → Basics | — | Set intervals and switches; read GitHub's wait | Interval saved or refused; switches; banner | REQ-001, 004, 010, 011, 016 |
| UXJ-010 | Settings → Updates | — | Control and read the app check | Switch, interval, status, last check | REQ-012–016, 023 |
| UXJ-011 | Panel | Skill source Update, narrow window | Confirm without overlap | Confirmation above the panel | 209 PQ-2 |
| UXJ-012 | Desktop window of another node / browser window | — | Notifications without runtimes | No runtime category, no runtime switch or interval | REQ-020, AC-022 |

## Journey Details

- **UXJ-001 Notice.** As 209: the pill on the Settings row, "N updates" (N = waiting rows including runtimes), solid while any row is
  unread; hover or focus shows one line per type above it: "1 software update", "2 agent runtime updates", "2 agent package
  updates", "1 skill update". When something has been updated automatically and not yet seen, a last line reads "N updated
  automatically". When nothing waits and N such rows are unread, the pill reads "N updated" (solid) and the name reads "N updates
  applied automatically"; it disappears once they are seen and the panel closes. The strip icon's badge follows the same count.
  VIS-001, 002, 014, 033.
- **UXJ-002 Open.** Click the pill (or the strip icon): the panel slides in at the right, top. Focus moves to it; every waiting row
  and unread automatic outcome becomes read (the pill turns soft; the pill stays while the panel is open, even when only outcomes
  were unread); "New" dots stay until it closes. Categories: Software update first, then by newest waiting. Closing: ✕, Esc, a
  click outside (not on the entry), or the entry again; ✕ and Esc return focus to the entry. While a confirmation is open, outside
  clicks and Esc belong to it (Esc cancels it first). VIS-003–005, 034.
- **UXJ-003 Opt in.** Packages, skill sources and runtimes cards each have "Update automatically" under their header. Press the
  switch: runtimes turn on at once; packages and skill sources open UXJ-004. Once on, the text reads "Installs new revisions on its
  own, replacing local changes. Switch off to update by hand." (runtimes: "Updates on its own when no agent of that runtime is
  running. Switch off to update by hand.") and, with waiting updates that will be applied, the sky line "N waiting update(s) will be
  installed within about a minute." Within about a minute (the reference: ~3.5 s) the waiting rows of that kind become outcomes
  (UXJ-005/006). Turning off applies at once and cancels the pending application. VIS-006–009.
- **UXJ-004 Confirm.** Title "Turn on automatic updates for agent packages?" (or "… skill sources?"). Four lines: what is downloaded and
  from where; "An update can change what your agents do."; in medium weight, "Local changes and files you added in a package are
  replaced without asking and cannot be restored."; how to turn it off. Buttons: Cancel (gray), Turn on (red). Cancel and Esc leave the switch off. The same confirmation in the card. Not shown for runtimes or when turning off.
  VIS-006, 023.
- **UXJ-005 Updated automatically.** A row of the kind: name (dark, with the dot while new), "✓ Updated automatically to 9f8e7d6" in
  green, then "1 hr. ago · See changes on GitHub ↗" (runtime: "1 hr. ago · From 0.163.0"), Clear on the right. It does not count as
  waiting. Clear removes it. The text does not say that local changes were replaced (the node cannot know; the confirmation said so).
  VIS-008, 009, 010, 015.
- **UXJ-006 Failed automatically.** The row stays waiting with its change line and Update; below it the red box: "Automatic update
  failed. Nothing was changed." and the reason (a vendor's message may have several lines). Update (skill source: the existing
  confirmation first) runs the update as in 209; a manual failure shows "Update failed. Nothing was changed." with Try again.
  The failure is shown once per revision (REQ-009). VIS-008, 010, 013.
- **UXJ-007 Runtime update.** Row: "Codex 0.163.0 → 0.164.0 · 2 hr. ago", Update. Update → "Updating…" with a spinner (the vendor
  update) → "✓ Updated to 0.164.0", Clear. While that runtime has running agents Update is shown at 50 %, does nothing, and the row
  says "Update unavailable while 2 agents are running." (with the runtime switch on, adds "It will be updated automatically once no
  agent is running."). Failure: red box with the vendor's message and Try again; the runtime is unchanged. VIS-004, 009, 011–013.
- **UXJ-008 Checks off.** Panel: a switch that is on adds "No effect while Update checks is off for this node. Turn it on in Settings
  → Server Settings → Basics." Card: the amber banner "Update checks are off. Intervals and automatic updates do nothing." and
  dimmed blocks. VIS-016, 020.
- **UXJ-009 Card.** Settings → Server Settings → Basics → Update checks (last card, full width). Interval fields save on blur or
  Enter (also when the unit changes); out of range ("5 minutes", "25 hours") shows "Enter a whole number from 15 minutes to 24
  hours." and keeps the old value; success shows "Saved" for about 2 s. Defaults 30 / 30 / 60 minutes (60 is shown as the number 1 with the unit
  "hours"). The GitHub wait banner shows while the node reports a wait; the time is the locale's hour and
  minute, with a short weekday when not today. Remote or Docker node window: no runtime interval, switch or contact line (VIS-037).
  VIS-018–023, 029, 037.
- **UXJ-010 Settings → Updates.** Status values: Up to date, Update available, Check failed (periodic or manual check; quiet, no
  toast for a periodic one) and, before any check with automatic checks off, "Automatic checks are off". Under Last Checked:
  "Automatic checks: every 1 hour" or "Automatic checks: off". After a failed periodic check: "The last automatic check failed. The
  next one runs at the interval." Switch (on by default); interval default 60 minutes; off dims the interval and says it has no
  effect; Check for Updates always works. No Download or Install without the user's press. VIS-024–027, 030.
- **UXJ-011 Skill confirmation above the panel.** "Update entire skill source?" opens over the dimmed panel (not under it), also in a
  1000 px window. VIS-017.
- **UXJ-012 Other windows.** A window of another node (desktop) shows Software update, packages and skill sources, never
  runtimes; the card has no runtime parts. A browser window has no Software update section (209). VIS-035–037.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Settings-row entry | Every page with the docked left panel; the strip icon when collapsed | Show the count; open the panel | Pill "N updates" / "N updated"; strip: icon + badge | VIS-001, 002, 014, 031, 033 |
| UIS-002 | Notification Center | The entry | See, act on, and opt in to updates | Title row; category cards (software, runtimes, packages, skills): header, switch block, rows | VIS-003–013, 015–017, 028, 032, 034–036 |
| UIS-003 | Confirmation | Turning packages / skill sources on | Say what automatic updates mean | Danger modal, four lines | VIS-006, 023 |
| UIS-004 | Update checks card | `/settings?section=server-settings` (Basics) | Switch, intervals, automatic updates | Switch + contacts; banners; intervals; automatic updates | VIS-018–023, 029, 037 |
| UIS-005 | Settings → Updates | `/settings?section=updates` | App check switch, interval, status | Status grid; automatic check; beta; buttons | VIS-024–027, 030 |
| UIS-006 | Panel empty state | Last row cleared | As 209 | "No updates waiting" in a white card on the grey | (as 209 VIS-020, in the new surface) |

**Order in the panel:** Software update first; then one card per kind ordered by its newest waiting update (most recent first); within a
card, waiting rows newest first, then handled rows (updated automatically and updated manually). Titles: singular with one row,
plural with two or more ("Agent runtime update(s)", "Agent package update(s)", "Skill update(s)"); the app is always singular. A card
shows its first three rows, then "Show N more" / "Show less". A card exists while it has a row; its switch exists with it.

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-101 | Entry | Press | Panel slides in at the right; focus in the panel | Open; rows read | 209 TR-002 | Everything below |
| TR-102 | Switch (packages / skill sources), off | Press | Confirmation opens over the panel | Confirming | Panel ignores outside click and Esc | TR-103, TR-104 |
| TR-103 | Confirmation | Turn on | Closes; switch on; text changes; "N waiting … about a minute" when rows wait | On; applying | Node setting saved | TR-105, TR-107 |
| TR-104 | Confirmation | Cancel or Esc | Closes | Switch stays off; panel stays open | Nothing saved | — |
| TR-105 | Switch on, waiting rows | The node's pass (time) | Rows change to outcomes without a click | Updated automatically / failed / (runtime) waiting | Entry may become "N updated" | Clear, Update |
| TR-106 | Switch (runtimes), off | Press | Switch on at once, no confirmation | On | Saved | TR-105 |
| TR-107 | Switch, on | Press | Switch off at once, no confirmation | Off; pending application cancelled | Saved | TR-102 |
| TR-108 | Runtime row, waiting, no agents | Update | "Updating…" + spinner | Updating | The vendor update (as Settings → Agent Runtimes) | TR-109, TR-110 |
| TR-109 | Runtime row updating | Success | "✓ Updated to X", Clear | Handled | Count −1 | Clear |
| TR-110 | Runtime row updating | Failure | Red box: "Update failed. Nothing was changed." + the vendor's message; Try again | Failed | Runtime unchanged | Try again |
| TR-111 | Runtime row, agents running | Update | Nothing; reason line is the explanation | Waiting | `aria-disabled` | — |
| TR-112 | Package / skill row with an automatic failure | Update | As 209 (skill source: the existing confirmation) | Updating → handled or failed | — | — |
| TR-113 | Updated-automatically row | Clear | Row removed | Gone; card gone when it was the last | Persisted cleared | — |
| TR-114 | Panel open | Close (✕, Esc, outside click, entry) | Panel slides out | Closed; "New" dots end | ✕/Esc return focus to the entry | — |
| TR-115 | Interval field | Blur or Enter, valid | "Saved" for ~2 s; value normalised (60 min → 1 hour) | Saved | Node setting | — |
| TR-116 | Interval field | Blur or Enter, invalid | Red border and message; old value kept | Invalid | Nothing saved | Correct it |
| TR-117 | Update checks switch | Press | Switch moves; banner and dimming follow | On / off | Node setting; automatic updates stop while off | — |
| TR-118 | Settings → Updates switch | Press | Switch moves; interval dims when off; state line follows | On / off | The shell's setting | — |
| TR-119 | Settings → Updates interval | Blur or Enter | As TR-115 / TR-116 | — | — | — |
| TR-120 | Skill-source Update opened from the panel | Press | Confirmation above the dimmed panel | Confirming | 209 TR-007 | Cancel / Update |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Entry / waiting, unread | ≥ 1 waiting row unread, or an automatic outcome unread | Solid pill "N updates" (N = waiting) | Open | — | VIS-001 |
| Entry / nothing waits, outcome unread | Only "updated automatically" rows unread | Solid pill "N updated" | Open | Seen → gone when the panel closes | VIS-014 |
| Entry / hover | Hover or focus | Dark card, one line per type and "N updated automatically" | — | — | VIS-002 |
| Switch / off | Default | Label, off switch, 3-line text | Press | — | VIS-003 |
| Switch / confirming | Press (packages, skills) | Danger confirmation | Turn on, Cancel, Esc | — | VIS-006 |
| Switch / on, rows applying | Turned on | On switch; 2-line text; sky "N waiting … within about a minute" | Off | Rows become outcomes | VIS-007 |
| Switch / on, checks off | Update checks off | Adds the amber "No effect while Update checks is off …" | Off | Turn checks on | VIS-016 |
| Row / updated automatically | An automatic update | Green "✓ Updated automatically to X"; time · compare link (runtime: "From X"); unread dot | Clear | — | VIS-008–010 |
| Row / automatic failure | An automatic update failed | Waiting row + red box + reason; Update | Update | — | VIS-008, 010 |
| Row / runtime blocked | Agents of that runtime run | Update at 50 %, reason line | — | Agents stop | VIS-004, 009 |
| Row / runtime updating, updated, failed | TR-108–110 | As UXJ-007 | Clear / Try again | — | VIS-011–013 |
| Card / checks on | Default | Three blocks | — | — | VIS-018 |
| Card / GitHub wait | The node reports a wait | Amber banner "GitHub asked this node to wait until 06:46 PM." | — | Clears when the wait ends | VIS-019 |
| Card / checks off | Switch off | Amber banner; blocks dimmed | Switch on | — | VIS-020 |
| Card / interval invalid, saved | TR-115/116 | Red message, or "Saved" | — | — | VIS-021, 022 |
| Card / remote node | Window of another node | No runtime interval, switch or contact line | — | — | VIS-037 |
| Settings → Updates / up to date | After a check | Status "Up to date", time, "Automatic checks: every 1 hour" | Check for Updates | — | VIS-024 |
| Settings → Updates / available | A check found one | "Update available"; Download | Download | — | VIS-027 |
| Settings → Updates / check failed | A check failed | "Check failed", time, the failure message, "The last automatic check failed. The next one runs at the interval." (periodic) | Check for Updates | — | VIS-025 |
| Settings → Updates / checks off | Switch off | Status "Automatic checks are off" (no check yet) or the last result; "Automatic checks: off"; the interval dimmed with the no-effect line | Check for Updates | — | VIS-026 |
| Panel / window of another node | Not the desktop's own node | Software update (desktop), packages, skill sources; no runtimes | — | — | VIS-036 |
| Panel / browser window | No Electron shell | No Software update section (209) | — | — | VIS-035 |

## Content, Labels, Validation, And Feedback

- **Voice:** plain, short; the type in words; no exclamation marks; "Nothing was changed." after failures; one fact per line.
- **Exact strings.** Keys under `settings.notifications.` unless a full key is shown; the 209 strings that are not listed are
  unchanged (`localization/messages/{en,zh-CN}/settings.ts`). "new / changed" are relative to the baseline.

| Key (prefix `settings.notifications.` unless a full key is shown) | en | zh-CN | |
| --- | --- | --- | --- |
| `setting.summary` | Find new versions of your GitHub agent packages and skill sources. | 查找你的 GitHub 智能体包和技能来源的新版本。 | changed |
| `auto.confirm.title.agent_package` | Turn on automatic updates for agent packages? | 开启智能体包的自动更新？ | new |
| `auto.confirm.title.skill_source` | Turn on automatic updates for skill sources? | 开启技能来源的自动更新？ | new |
| `auto.confirm.download.agent_package` | This node downloads new revisions of the agent packages you imported, from their GitHub repositories, and installs them without asking. | 此节点会从你导入的智能体包的 GitHub 仓库下载新修订，并直接安装，无需询问。 | new |
| `auto.confirm.download.skill_source` | This node downloads new revisions of the skill sources you imported, from their GitHub repositories, and installs them without asking. | 此节点会从你导入的技能来源的 GitHub 仓库下载新修订，并直接安装，无需询问。 | new |
| `auto.confirm.change` | An update can change what your agents do. | 更新可能改变智能体的行为。 | new |
| `auto.confirm.replace.agent_package` | Local changes and files you added in a package are replaced without asking and cannot be restored. | 智能体包中的本地更改和你添加的文件会被直接替换，无需询问，且无法恢复。 | new |
| `auto.confirm.replace.skill_source` | Local changes and files you added in a skill source are replaced without asking and cannot be restored. | 技能来源中的本地更改和你添加的文件会被直接替换，无需询问，且无法恢复。 | new |
| `auto.confirm.off` | You can turn this off at any time, here or in Settings → Server Settings → Basics → Update checks, and update by hand. | 你可以随时在这里，或在“设置 → 服务器设置 → 基本 → 更新检查”中关闭，并改为手动更新。 | new |
| `auto.confirm.action` | Turn on | 开启 | new |
| `kind.agent_runtime` | Agent runtime update | 智能体运行时更新 | new |
| `kindGroup.agent_runtime` | Agent runtime updates | 智能体运行时更新 | new |
| `sidebar.kind.agent_runtime.one` | 1 agent runtime update | 1 个智能体运行时更新 | new |
| `sidebar.kind.agent_runtime.other` | {{count}} agent runtime updates | {{count}} 个智能体运行时更新 | new |
| `sidebar.updated.one` | 1 update applied automatically | 1 个更新已自动应用 | new |
| `sidebar.updated.other` | {{count}} updates applied automatically | {{count}} 个更新已自动应用 | new |
| `sidebar.updated.short.one` | 1 updated | 1 个已更新 | new |
| `sidebar.updated.short.other` | {{count}} updated | {{count}} 个已更新 | new |
| `sidebar.autoUpdated.one` | 1 updated automatically | 1 个已自动更新 | new |
| `sidebar.autoUpdated.other` | {{count}} updated automatically | {{count}} 个已自动更新 | new |
| `auto.label` | Update automatically | 自动更新 | new |
| `auto.kind.agent_package` | Agent packages | 智能体包 | new |
| `auto.kind.skill_source` | Skill sources | 技能来源 | new |
| `auto.kind.agent_runtime` | Agent runtimes | 智能体运行时 | new |
| `auto.explain.agent_package` | Downloads new revisions from GitHub and installs them without asking. They can change what your agents do. Local changes are replaced. | 从 GitHub 下载新修订并直接安装，无需询问。更新可能改变智能体的行为。本地更改会被替换。 | new |
| `auto.explainOn.agent_package` | Installs new revisions on its own, replacing local changes. Switch off to update by hand. | 自动安装新修订，并替换本地更改。关闭此开关即可改为手动更新。 | new |
| `auto.explain.skill_source` | Downloads new revisions from GitHub and installs them without asking. They can change what your agents do. Local changes are replaced. | 从 GitHub 下载新修订并直接安装，无需询问。更新可能改变智能体的行为。本地更改会被替换。 | new |
| `auto.explainOn.skill_source` | Installs new revisions on its own, replacing local changes. Switch off to update by hand. | 自动安装新修订，并替换本地更改。关闭此开关即可改为手动更新。 | new |
| `auto.explain.agent_runtime` | Runs the vendor's own update, which downloads from the vendor, when no agent of that runtime is running. New versions can change how your agents work. | 没有该运行时的智能体在运行时，运行其供应商自带的更新，并从供应商处下载。新版本可能改变智能体的工作方式。 | new |
| `auto.explainOn.agent_runtime` | Updates on its own when no agent of that runtime is running. Switch off to update by hand. | 没有该运行时的智能体在运行时自动更新。关闭此开关即可改为手动更新。 | new |
| `auto.noEffect` | No effect while Update checks is off for this node. Turn it on in Settings → Server Settings → Basics. | 此节点的“更新检查”已关闭，因此不起作用。可在“设置 → 服务器设置 → 基本”中开启。 | new |
| `auto.applying.one` | 1 waiting update will be installed within about a minute. | 1 个待处理的更新将在大约一分钟内安装。 | new |
| `auto.applying.other` | {{count}} waiting updates will be installed within about a minute. | {{count}} 个待处理的更新将在大约一分钟内安装。 | new |
| `auto.saveFailed` | Couldn't save this setting. Try again. | 无法保存此设置，请重试。 | new |
| `outcome.updated` | Updated automatically to {{revision}} | 已自动更新到 {{revision}} | new |
| `outcome.from` | From {{version}} | 原版本 {{version}} | new |
| `outcome.failed` | Automatic update failed. Nothing was changed. | 自动更新失败，未做任何更改。 | new |
| `runtime.blocked.one` | Update unavailable while 1 agent is running. | 有 1 个智能体正在运行，暂时无法更新。 | new |
| `runtime.blocked.other` | Update unavailable while {{count}} agents are running. | 有 {{count}} 个智能体正在运行，暂时无法更新。 | new |
| `runtime.blockedAuto` | It will be updated automatically once no agent is running. | 没有智能体运行后将自动更新。 | new |
| `runtime.details` | Runs {{name}}'s own update on this computer, as in Settings → Agent Runtimes. | 在这台电脑上运行 {{name}} 自带的更新，与“设置 → 智能体运行时”相同。 | new |
| `setting.summaryOwn` | Find new versions of your GitHub agent packages, skill sources and agent runtimes. | 查找你的 GitHub 智能体包、技能来源和智能体运行时的新版本。 | new |
| `setting.label` | Check for updates in the background | 在后台检查更新 | changed |
| `setting.description` | No account or token is used. Nothing is sent to AutoByteus. | 不使用任何账号或令牌。不会向 AutoByteus 发送任何内容。 | changed |
| `setting.network.title` | Contacts | 访问地址 | new |
| `setting.network.packages` | Packages and skill sources: github.com | 智能体包和技能来源：github.com | new |
| `setting.network.runtimes` | Agent runtimes: GitHub (Codex), downloads.claude.ai, Antigravity's updater, xAI (Grok) | 智能体运行时：GitHub（Codex）、downloads.claude.ai、Antigravity 更新服务、xAI（Grok） | new |
| `setting.network.updates` | Automatic updates: GitHub downloads and each runtime's own update command | 自动更新：从 GitHub 下载，以及运行各运行时自带的更新命令 | new |
| `setting.backoff` | GitHub asked this node to wait until {{time}}. | GitHub 要求此节点等到 {{time}}。 | new |
| `setting.checksOff` | Update checks are off. Intervals and automatic updates do nothing. | 更新检查已关闭。检查间隔和自动更新不起作用。 | new |
| `setting.interval.title` | How often to check | 检查频率 | new |
| `setting.interval.githubNote` | Very short intervals can make GitHub refuse checks. The node then waits and says so above. | 间隔过短可能导致 GitHub 拒绝检查，届时节点会等待，并在上方说明。 | new |
| `interval.agent_package` | Agent packages | 智能体包 | new |
| `interval.skill_source` | Skill sources | 技能来源 | new |
| `interval.agent_runtime` | Agent runtimes (this computer) | 智能体运行时（这台电脑） | new |
| `interval.every` | Every | 每 | new |
| `interval.value` | Interval for {{name}} | {{name}}的检查间隔 | new |
| `interval.unit` | Unit for {{name}} | {{name}}的间隔单位 | new |
| `interval.unit.minutes` | minutes | 分钟 | new |
| `interval.unit.hours` | hours | 小时 | new |
| `interval.minutes.one` | 1 minute | 1 分钟 | new |
| `interval.minutes.other` | {{count}} minutes | {{count}} 分钟 | new |
| `interval.hours.one` | 1 hour | 1 小时 | new |
| `interval.hours.other` | {{count}} hours | {{count}} 小时 | new |
| `interval.range` | 15 minutes to 24 hours. | 15 分钟到 24 小时。 | new |
| `interval.invalid` | Enter a whole number from 15 minutes to 24 hours. | 请输入 15 分钟到 24 小时之间的整数。 | new |
| `interval.saved` | Saved | 已保存 | new |
| `setting.auto.title` | Automatic updates | 自动更新 | new |
| `setting.auto.summary` | Off by default. Applies the updates a check finds, without asking. | 默认关闭。直接应用检查发现的更新，无需询问。 | new |
| `settings.components.settings.AboutSettingsManager.status.checkFailed` | Check failed | 检查失败 | new |
| `settings.components.settings.AboutSettingsManager.status.checksOff` | Automatic checks are off | 自动检查已关闭 | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.label` | Check for app updates automatically | 自动检查应用更新 | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.description` | Asks github.com for a newer version at launch and at the interval below. No account or token is used; nothing is sent to AutoByteus. A newer version is only announced; you decide to download and install it. | 启动时以及之后按下方间隔向 github.com 查询是否有新版本。不使用任何账号或令牌；不会向 AutoByteus 发送任何内容。新版本只会被提示，是否下载和安装由你决定。 | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.interval` | Check interval | 检查间隔 | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.range` | From 15 minutes to 24 hours. | 范围为 15 分钟到 24 小时。 | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.noEffect` | Automatic checks are off. Check for Updates below still works. | 自动检查已关闭。下方的“检查更新”仍然可用。 | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.stateEvery` | Automatic checks: every {{interval}} | 自动检查：每 {{interval}} | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.stateOff` | Automatic checks: off | 自动检查：已关闭 | new |
| `settings.components.settings.AboutSettingsManager.autoCheck.failedNote` | The last automatic check failed. The next one runs at the interval. | 上一次自动检查失败。下一次将按间隔进行。 | new |

- **Formats:** revisions are the first 7 characters; versions whole; times are short relative times (`Intl.RelativeTimeFormat`,
  `short`, `auto`) as in 209, with the full local date and time in the `title`; the GitHub wait time is the locale's two-digit hour
  and minute (with a short weekday when not today). Interval fields: whole numbers; minutes or hours; stored in minutes; 60 minutes
  displays as 1 hour.
- **Illustrative fixture values:** names (Research Pack, Docs Pack…, review-skills, docs-skills), repositories, revisions, versions
  (Codex 0.163.0 → 0.164.0, Claude 2.1.302 → 2.1.304, Antigravity 1.4.3 → 1.4.4), counts, times, the failure reasons ("GitHub
  answered 502 while downloading the repository archive.", the vendor message) and the wait time. Template text around them is exact.

### Form And Input Validation

- Interval (card, Settings → Updates): a whole number of minutes or hours, from 15 minutes to 24 hours. Empty, non-integer or out of
  range: red border, "Enter a whole number from 15 minutes to 24 hours.", the old value kept, nothing saved. The node also refuses
  a value out of range (the same message).
- Nothing else is typed.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop windows | 1440 × 900 and wider | Panel 368 px at the right, top 8 px; card two-column grid with the Update checks card full width | — |
| Compact | 1000 × 760 | Same panel; the confirmation above it (VIS-017) | — |
| Narrow | 390 × 844 | Panel width = window − 16 px, covering the strip; the entry is the strip icon with a badge | Close with ✕ / Esc / outside click |
| Short window | Any | Panel max height = window − 16 px; the body scrolls under the fixed title row | — |
| Desktop window of the desktop's own node | Electron, embedded node | All four categories; the Software update section when the app has an update | — |
| Window of another node | Electron, remote or Docker node | No runtime category, switch, interval or contact line | — |
| Browser window | No Electron shell | No Software update section (209); the runtime category follows the Agent Runtimes page's own-node rule | — |
| Mobile client | — | No entry, no panel | — |

## Accessibility And Keyboard Behavior

- **Focus:** on open, focus moves to the panel (`role=dialog`, named by its visible title); tab order: ✕, then each card's switch
  and rows (details toggle, then action), then "Show N more"; ✕ and Esc return focus to the entry; a click outside does not move it.
  Every control has `focus-visible:ring-2 ring-sky-500`.
- **Confirmation:** `role=dialog`, `aria-modal`, named by its title; Esc cancels (and the panel stays open behind it); while it is
  open, the panel does not close on outside clicks or Esc.
- **Switches:** `role=switch`, `aria-checked`, labelled by their label, described by their text (and by the applying or no-effect
  note when shown); Space or Enter toggles.
- **Update unavailable:** `aria-disabled="true"` and `aria-describedby` = the reason line; the action label is "Update: Claude".
- **Announcements:** applying note, updating, and the "Saved" slot are `role=status`; failures and the invalid-interval message are
  `role=alert`. The entry's name: "5 updates available: …" or "1 update applied automatically: 1 updated automatically".
- **Interval fields:** the number input is labelled by the row label; the unit select is named "Unit for {{name}}"; invalid sets
  `aria-invalid` and `aria-describedby` to the message.
- **Contrast:** as in Visual Language.

## Motion And Transitions

- Panel enter and leave: opacity 0 → 1 and `translateX(8px) → 0`, 150 ms, `ease`; the confirmation fades in (the shared modal's
  300 ms). Spinners `animate-spin`; the progress fill animates its width.
- Reduced motion: no panel transition, no spinner rotation (`motion-reduce:animate-none`).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Notifications (packages, skill sources, runtimes) | kind (`AGENT_PACKAGE`, `SKILL_SOURCE`, `AGENT_RUNTIME`), name, revisions/versions, foundAt, read, state, handled revision/time, `outcome` (`AUTO_UPDATED`, `AUTO_FAILED`, `AUTO_WAITING`), `outcomeReason`, `runningAgentCount` | `prototype/source-observation/node-settings-fixtures.mjs`, answered locally to the source's own stores | The node's records and feed; the real GraphQL shape is engineering's |
| Node settings | three intervals (minutes), three switches, `waitUntil` | `GetUpdateAutomationSettings` / `SetUpdateAutomationSettings` in the same fixture; the range is refused with the message | Persistence per node; GitHub's back-off (REQ-004) |
| Automatic passes | outcomes appear without a click | A timer ~3.5 s after a switch is turned on (the product: within about a minute); scripted per source: updated, failed (Docs Pack…), runtime waiting (Claude) | The scheduler and the update pipelines |
| Runtime update | operation state | The Agent Runtimes fixture's update steps (three reads), polled every second by the panel row | The vendor update, as Settings → Agent Runtimes |
| App check | `autoCheck {enabled, intervalMinutes}`, status, checkedAt | `prototype/shared/install-host-scenario.js`; nothing is requested | The shell's periodic check, its setting and persistence |
| Scenarios (review only) | — | `autobyteus.prototype.scenario` = `updates_waiting` (default for review), `updates_many`, `updates_one`, `updates_off`, `updates_auto_on`, `updates_outcomes_only`, `updates_backoff`, `updates_discover`, `update_up_to_date`, `update_available`, `update_check_failed`, `update_checks_off`; context `autobyteus.prototype.context` = `electron_internal` (own node) / `electron_external` (another node) / `desktop` (browser window) | — |

The design store, the fixtures, the timer and the `layerClass` are not prescriptions for the production code.

## Final Visual Reference Inventory

Paths are in `visual-references/` of this ticket folder. Captured with reduced motion in the UI reference at the product's normal
entry point; the context is `electron_internal` unless the row says otherwise.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 entry, waiting, unread | 1440×900 | `VIS-001-entry-waiting-unread-1440x900.png` | Solid pill on the Settings row | Count |
| VIS-002 | Entry hover | 1440×900 | `VIS-002-entry-hover-lines-1440x900.png` | Type lines incl. runtimes | Counts |
| VIS-003 | UXJ-002 panel, top | 1440×900 | `VIS-003-panel-open-default-top-1440x900.png` | Right-side panel, grey surface, title row, white cards, switches off, software row | Names, versions, times |
| VIS-004 | Runtimes (blocked) and packages | 1440×900 | `VIS-004-panel-runtimes-blocked-and-packages-1440x900.png` | Runtime rows, 50 % Update + reason, switch text (off) | Names, counts |
| VIS-005 | Panel bottom, skills | 1440×900 | `VIS-005-panel-skills-bottom-1440x900.png` | Skills card, handled row, Clear | Names |
| VIS-006 | UXJ-004 confirmation | 1440×1300 | `VIS-006-confirm-turn-on-packages-1440x1300.png` | Danger modal text and buttons over the dimmed panel | — |
| VIS-007 | Switch on, applying note | 1440×1300 | `VIS-007-packages-on-applying-note-1440x1300.png` | On text; sky "waiting … within about a minute" | Count |
| VIS-008 | Outcomes after applying | 1440×1300 | `VIS-008-packages-applied-outcomes-1440x1300.png` | Updated automatically row; automatic failure box | Names, reason |
| VIS-009 | Runtimes on | 1440×1300 | `VIS-009-runtimes-on-codex-updated-claude-waiting-1440x1300.png` | Codex updated automatically ("From"), Claude waiting text | Versions |
| VIS-010 | All outcomes (seed) | 1440×1500 | `VIS-010-panel-all-outcomes-auto-on-1440x1500.png` | Every outcome row type, switches on | Names, reasons |
| VIS-011 | UXJ-007 runtime updating | 1440×900 | `VIS-011-runtime-updating-1440x900.png` | "Updating…" + spinner | — |
| VIS-012 | Runtime updated | 1440×900 | `VIS-012-runtime-updated-clear-1440x900.png` | "✓ Updated to …", Clear | Version |
| VIS-013 | Runtime update failed | 1440×1500 | `VIS-013-runtime-update-failed-try-again-1440x1500.png` | Red box, vendor message, Try again | Message |
| VIS-014 | Entry, nothing waits | 1440×900 | `VIS-014-entry-updated-nothing-waits-1440x900.png` | Pill "1 updated" | Count |
| VIS-015 | Panel, outcome only | 1440×900 | `VIS-015-panel-outcome-only-1440x900.png` | Updated-automatically row with the card | Names |
| VIS-016 | UXJ-008 checks off | 1440×1100 | `VIS-016-panel-checks-off-no-effect-1440x1100.png` | Amber no-effect line | — |
| VIS-017 | UXJ-011 | 1000×760 | `VIS-017-skill-confirmation-above-panel-compact-1000x760.png` | Confirmation above the dimmed panel | Source |
| VIS-018 | UXJ-009 card | 1440×1250 | `VIS-018-update-checks-card-default-1440x1250.png` | Three blocks, contacts, defaults 30/30/60 | — |
| VIS-019 | GitHub wait | 1440×1250 | `VIS-019-update-checks-card-github-wait-1440x1250.png` | Amber banner | Time |
| VIS-020 | Checks off | 1440×1250 | `VIS-020-update-checks-card-checks-off-1440x1250.png` | Banner, dimmed blocks | — |
| VIS-021 | Interval refused | 1440×1250 | `VIS-021-update-checks-interval-refused-1440x1250.png` | Red border and message, old value | — |
| VIS-022 | Interval saved | 1440×1250 | `VIS-022-update-checks-interval-saved-1440x1250.png` | "Saved" | — |
| VIS-023 | Card confirmation | 1440×1250 | `VIS-023-update-checks-confirm-turn-on-skills-1440x1250.png` | Skill sources confirmation | — |
| VIS-024 | UXJ-010 up to date | 1440×900 | `VIS-024-settings-updates-up-to-date-1440x900.png` | Status, last check, state line, switch, interval | Times |
| VIS-025 | Check failed | 1440×900 | `VIS-025-settings-updates-check-failed-1440x900.png` | "Check failed" and the notes | Time |
| VIS-026 | Checks off | 1440×900 | `VIS-026-settings-updates-checks-off-1440x900.png` | Off switch, dimmed interval, no-effect line | — |
| VIS-027 | Available | 1440×900 | `VIS-027-settings-updates-available-1440x900.png` | "Update available", Download | Version |
| VIS-028 | zh-CN panel | 1440×1500 | `VIS-028-panel-zh-CN-1440x1500.png` | Chinese copy and layout | Reasons are English fixture text |
| VIS-029 | zh-CN card | 1440×1250 | `VIS-029-update-checks-card-zh-CN-1440x1250.png` | Chinese copy | — |
| VIS-030 | zh-CN Settings → Updates | 1440×900 | `VIS-030-settings-updates-zh-CN-1440x900.png` | Chinese copy | — |
| VIS-031 | Narrow entry | 390×844 | `VIS-031-narrow-strip-entry-390x844.png` | Strip icon and badge | Count |
| VIS-032 | Narrow panel | 390×844 | `VIS-032-narrow-panel-open-390x844.png` | Panel inside the window with margins | — |
| VIS-033 | Collapsed sidebar | 1440×900 | `VIS-033-strip-entry-collapsed-sidebar-1440x900.png` | Strip icon + badge | Count |
| VIS-034 | Strip, panel open | 1440×900 | `VIS-034-strip-panel-open-1440x900.png` | Panel on the right from the strip | — |
| VIS-035 | UXJ-012 browser window (`desktop`) | 1440×900 | `VIS-035-browser-window-no-software-update-1440x900.png` | No Software update section | The runtime category shows because the reference's browser context is its own node (see Open Decisions) |
| VIS-036 | Window of another node (`electron_external`) | 1440×900 | `VIS-036-remote-node-window-no-runtimes-1440x900.png` | Software update, packages, skills; no runtimes | Names |
| VIS-037 | Card on another node | 1440×1250 | `VIS-037-update-checks-card-remote-node-no-runtimes-1440x1250.png` | No runtime interval, switch or contact line | — |

Everywhere, names, repositories, revisions, versions, counts, times, release notes and failure reasons are illustrative fixture values;
template text around them is exact.

## Linked UI Reference Evidence

- Runnable UI reference: `corepack pnpm install --ignore-workspace --frozen-lockfile && corepack pnpm dev --port <port>`, then
  `/workspace` with the context and scenario seeded as in `ui-reference-runbook.md` (section `update-checks-and-auto-updates`).
- Ticket record: `tickets/done/update-checks-and-auto-updates/product-ticket.md` (rounds 1–7, the user's words, the decisions, the
  requirement impact and its resolution at SR-003).
- Mocked boundaries: see Data, Contract, And Mock Boundaries. Source files changed in the reference (design-owned unless noted):
  the notification components and stores, `AutoUpdateSwitch.vue`, `UpdateIntervalField.vue`, `UpdateChecksCard.vue`,
  `AboutSettingsManager.vue`, `appUpdateStore.ts`, `updateAutomationStore.ts`, `ConfirmationModal.vue` (optional layer), the mock node
  and host fixtures, the two localization files.

## Implementation Fidelity Boundary

- **Must preserve:** every visible value above (placement, surfaces, sizes, colours, copy, states, order); the one-setting-two-places
  rule; the confirmation before packages and skill sources are turned on; no automatic app update; no confirmation for a package's
  manual Update; the in-place behaviour of the rows; focus and keyboard behaviour; the layer order (confirmation above the panel).
- **Does not prescribe:** the design store, fixtures, timers, scripted outcomes, the GraphQL shape, component splitting.
- **May vary:** fixture values; the relative-time wording per locale; the exact time of an automatic application (the product:
  within about a minute of turning a switch on; otherwise at the check's interval).
- **Responsive variation:** only as in the Responsive section.
- **Design-system constraints:** Tailwind palette and Heroicons as used today; the shared modal reused.

## Out Of Scope

- Automatic update of the app; undo, pin, skip; per-package or per-source exceptions; a backup of replaced files.
- An indicator on Settings pages (PQ-1, rejected by the user).
- Runtime notifications, switches or Update on remote or Docker nodes; installing a runtime that is not installed.
- Notifications for check failures; pop-ups, toasts, OS notifications.
- The mobile client; a "check now" button in the panel.

## Open Decisions And Risks

- **Which windows are "the desktop's own node".** The runtime category follows the Agent Runtimes page's rule (`isEmbeddedWindow`).
  In the reference a browser window (`desktop` context) counts as own node. Engineering confirms that a browser window of a server
  node gets no runtime category (REQ-020, AC-022); that is a rule question, not a visual one.
- **Replacement is irreversible by design (DEC-019, DEC-003).** The confirmation is the only warning; the "updated automatically"
  row does not say what was replaced (the node cannot know). If this proves harmful in use, a backup or an exclusion list is a new
  requirement, not a silent change.
- **Live order.** As 209: rows that become handled move to the end of their card; cards follow their newest waiting update.
- **Settings → Updates beta toggle.** Unchanged and inert in the reference (no host command); it works in the product.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed has an applicable final visual reference: `Yes` (the empty state follows 209's copy in the new surface; not recaptured)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals contain no unintended placeholders, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
