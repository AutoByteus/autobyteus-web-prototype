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

## Round 1 Feedback And Round 2 (current proposal)

- User feedback on round 1 (2026-10-20), with screenshots of the docked Settings row with and without the dot:

  > Wow, the sidebar dot looks really ugly. … Who is able to recognize it's a notification? The dot. No, you
  > shouldn't do that. … notification has a category, right? You have like software update, you have other
  > kind of notification, and you give each notification a different type. And then you show some kind of
  > different icon or something, or at least they should be bigger … people can click the notification and
  > then there's action what they can do there.

- Round 2:
  - **DEC-B replaced: a labelled category entry, no dot.**
    - Every notification belongs to a **category** with its own icon and wording. Today there is one,
      **Updates** (`heroicons:arrow-down-circle-20-solid`, sky-600), covering the app, agent packages and
      skill sources. A later category adds its icon and strings.
    - **Docked left panel:** while a category has unread notifications, a row sits just above Settings:
      "↓ 3 updates available ›" (`sky-50` background, `sky-200` ring, 14 px medium `sky-900`).
    - **Collapsed strip:** the category icon is a button above the cog, with a count badge (sky-600, white
      ring) and the tooltip / accessible name "3 updates available".
    - Clicking either opens the notification area (`/settings?section=notifications`: the section on narrow
      windows; on wide windows the first section with the rail beside it), where each item has its actions.
    - The entry goes away once the notifications are read.
    - The Settings entries are unchanged and open Settings as before (the round-1 dot is removed).
  - **DEC-C extended: larger kind icons.** Each item has a 32 px tile beside it: app `computer-desktop` on
    sky-50 / sky-600; agent package `cube` on violet-50 / violet-600; skill source `sparkles` on amber-50 /
    amber-600.
  - **The list is grouped by category:** an "Updates" heading with its icon and the number of items, at the
    top of the list card.
  - Strings:
    - `settings.notifications.category.updates` (Updates / 更新);
    - `settings.notifications.sidebar.updates.one|other` (1 update available / {{count}} updates available;
      1 个可用更新 / {{count}} 个可用更新);
    - `settings.notifications.indicator` is removed.
- Round 2 changes:
  - DC-009: `components/layout/SidebarNotificationsEntry.vue` (new), placed in `LeftSidebarStrip.vue` and
    `AppLeftPanel.vue`; the dot and the "Settings opens on notifications" routing are removed.
  - DC-010: the store's categories (`KIND_CATEGORY`, `CATEGORY_ICONS`, `unreadByCategory`).
  - DC-011: `UpdateNotificationKindTile.vue` (new); the items use a two-column layout; the panel has a
    category heading.
  - DC-012: icons `arrow-down-circle-20-solid` and `chevron-right-20-solid`.
- Round 2 validation (`review-evidence/round-2/r2.mjs`): **19/19**.
  - N-001: panel "3 updates available"; strip `aria-label` "3 updates available".
  - N-002: the entry opens the area.
  - N-003: the entry is gone after viewing.
  - N-012 / N-013: no entry when nothing waits.
  - N-016 / N-017: zh-CN, including "3 个可用更新".
  - All of round 1's interactions still pass.

## Round 2 Feedback And Round 3 (current proposal)

- User feedback on round 2 (2026-10-20), with a zh-CN screenshot of the "3 个可用更新" row above "设置":

  > Oh no, you definitely don't want to put them into two rows. Or if you wanna put it into two rows … above
  > [the] setting, you'll use notifications … Or what I imagined is that the notification is on the same row,
  > on the same row as setting itself, you know, on the right side of setting.

- Round 3 (the user's preferred option, "same row, on the right side of Settings"):
  - **Docked left panel.** The Settings row is unchanged on the left. On its right, while a category has
    unread notifications, a pill shows the category icon and the count, e.g. `↓ 3`.
    - Style: 32 px high, fully rounded, `sky-50` background with a `sky-200` ring; 14 px semibold `sky-700`
      count; 16 px `sky-600` icon; hover `sky-100`.
    - Name and tooltip: "3 updates available" / "3 个可用更新".
    - Clicking it opens the notification area. One pill per category with unread items.
  - **Collapsed strip** (one column, so no shared row): unchanged from round 2, the category icon with a count
    badge just above the cog.
  - Removed: round 2's full-width "3 updates available ›" row above Settings.
- Round 3 changes:
  - DC-013: `SidebarNotificationsEntry.vue` variant `inline` (replaces `panel`).
  - DC-013: `AppLeftPanel.vue` footer: one row with Settings (flex-1) and the pill.
- Round 3 validation (`review-evidence/round-3/r2.mjs`): **19/19**; N-001 / N-017 read the pill's accessible
  name.

## Round 3 Feedback And Round 4 (current proposal)

- User feedback on round 3 (2026-10-20), with screenshots of the zh-CN rail and the `↓ 3` pill:

  > … you got a software updates, you show like software updates, the words there … if you have a skill update,
  > you show agent package update … this gives the user very good notification … this kind of small icon, there
  > was actually nice, but … I feel that the icon you put there is not like in line with our overall styling.

- Round 4:
  - **The headline says the type in words:** "Software update" / "Agent package update" / "Skill update"
    (软件更新 / 智能体包更新 / 技能更新), 14 px semibold `gray-900`, with a "New" marker on the right while
    unread.
    - Below: the name (14 px medium `gray-800`) and the repository (12 px `gray-500`).
    - For the app: "1.5.6 → 1.5.7 · Stable · Found 2 hours ago".
    - For packages and skills: `branch installed → latest`, then "See changes on GitHub ↗" and "Found 3 hours
      ago" (12 px `gray-400`, beside the link when it fits, else under it).
  - **Icons in the app's style:** grey (`gray-500`) 20 px **outline** heroicons from the sidebar's set, with no
    coloured tiles or filled icons:
    - `computer-desktop` (software update);
    - `cube` (agent package update);
    - `sparkles` (skill update; the sidebar's Skills icon);
    - `arrow-down-circle` (the Updates category heading).
    - The round-2 tiles are removed.
  - **Sidebar, in the same style:**
    - **Pill on the Settings row:** a grey outline `arrow-down-circle` (20 px, like the cog) and a small blue
      count (`sky-600`, white 11 px semibold); hover `gray-100`. Name: "3 updates available".
    - **Collapsed strip:** the same outline icon with the blue count badge, above the cog.
- Round 4 changes:
  - DC-014: `UpdateNotificationMeta.vue` (headline with the outline icon); `FoundTime.vue` (new);
    `UpdateNotificationKindTile.vue` removed; the items are restructured.
  - DC-015: `CATEGORY_ICONS` uses the outline icon; the panel heading icon is grey.
  - DC-016: `SidebarNotificationsEntry.vue` styles.
  - DC-017: strings `settings.notifications.kind.*` changed to headline wording.
  - DC-018: icons `arrow-down-circle` (outline).
- Round 4 validation (`review-evidence/round-4/r2.mjs`): **19/19**.

## Round 4 Feedback And Round 5 (current proposal)

- User feedback on round 4 (2026-10-20), with a screenshot of the outline icon and the separate "3" badge on the
  Settings row:

  > Still not good. … I think it doesn't look like it's a whole. … You have updates, you have three … you show
  > like updates or something, some words. … I think it's better to use some words. It's much more clear. For
  > example, software updates, agent package updates, skill updates.

- Round 5:
  - **The Settings row shows words as one pill:** "3 updates" ("1 update"; zh-CN "3 个更新").
    - Style: 28 px high, fully rounded, `sky-50` background with a `sky-200` ring, 12 px semibold `sky-700`;
      hover `sky-100`. No separate icon or badge.
  - **The types in words:**
    - On hover or keyboard focus, the pill shows the app's dark tooltip with one line per type: "1 software
      update", "1 agent package update", "1 skill update" (zh-CN "1 个软件更新" …).
    - The accessible name is "3 updates available: 1 software update, 1 agent package update, 1 skill update"
      (zh-CN "3 个可用更新：1 个软件更新、1 个智能体包更新、1 个技能更新").
  - **Collapsed strip** (one icon wide; words do not fit): the outline icon with its count badge on it, as one
    unit. Its tooltip reads "3 updates available" with the same per-type lines.
  - The list items keep their round-4 type headlines ("Software update" / "Agent package update" / "Skill
    update").
- Round 5 changes:
  - DC-019: `SidebarNotificationsEntry.vue` `inline` is the word pill with its tooltip; both variants carry the
    per-type description.
  - DC-020: `unreadByKind` in the store.
  - DC-021: strings `settings.notifications.sidebar.updates.short.*`, `sidebar.kind.*.one|other`,
    `sidebar.listSeparator` and `sidebar.description`.
- Round 5 validation (`review-evidence/round-5/r2.mjs`): **19/19**; N-001 / N-017 check the pill's words and its
  full name in en and zh-CN.

- Round 5 adjustment (user, 2026-10-20: "Blue is nice. Can you make the blue … the color is a little bit too
  light"): the pill is one step deeper: `sky-100` background, `sky-300` ring, `sky-800` text, hover `sky-200`.

## Round 5 Feedback And Round 6 (superseded in part by round 7)

- User feedback on round 5 (2026-10-20), with a screenshot of Settings with the right-hand list:

  > … when I click the update notification, then immediately jump to the setting page and show a very big list
  > on the very right side of the area … makes me feel not so nice. … You know how Mac … show notification …
  > I feel like their notification is super nice.

- Round 6 (a Notification Center in the manner of macOS):
  - **Opened where the user is.** Clicking the sidebar entry opens a floating **Notification Center** next to it,
    over the current page; nothing navigates.
    - Docked panel: it opens above the Settings row. Collapsed strip: to the right of the icon.
    - Panel: 360 px wide, up to 72 % of the window high, `rounded-2xl`, `gray-50/95` with backdrop blur,
      `shadow-2xl`, a `black/10` ring.
    - Header: "Notifications", a gear "Notification settings" (→ Settings → Notifications) and a close button.
    - Esc, a click outside, the close button or the entry again closes it; focus returns to the entry.
    - It never opens by itself. Opening it marks the notifications read.
  - **Compact cards grouped by category** ("Updates 4"). Each card is white, `rounded-xl`, with `shadow-sm` and a
    ring, and contains:
    - a 32 px `gray-100` square with the type's grey outline icon;
    - the type in words (13 px semibold), the short time ("3 hr. ago"), and a blue dot while new;
    - the name; the change (`main a1b2c3d → 9f8e7d6`, or `1.5.6 → 1.5.7`);
    - the actions: Update / Download / Install and restart, Skip this version, Clear (for updated cards).
    - Clicking the summary expands the details: the repository and "See changes on GitHub"; for the app, the
      release notes and the release page.
    - Updating, failed (with the reason and Try again) and download progress show inside the card.
    - A skill source's Update keeps the existing confirmation dialog.
  - **The entry stays available.** The Settings-row pill shows the waiting count ("4 updates"): blue while some are
    new, grey once all are read, and gone when nothing waits. The strip badge is blue or grey in the same way.
    The hover lines and the name list the waiting types ("1 software update, 2 agent package updates, 1 skill
    update").
  - **Settings:** the always-visible right-hand column is removed. **Notifications** is a regular Settings section
    (first in the navigation at every width) with the full list and the background-check setting with its
    description (REQ-013/014).
- Note for the Solution Designer (SR-002 integration): REQ-011 says "it lives in Settings, and an indicator on
  the Settings entry". In this design the full area is the Settings → Notifications section and the indicator is
  the entry on the Settings row. The Notification Center is an additional quick view that the user opens. It is
  never opened by itself, so it keeps "no pop-up by itself". Wording such as "a Notification Center opened from
  the Settings row" may be added when integrating.
- Round 6 changes:
  - DC-022: `components/notifications/NotificationCenter.vue` and `NotificationCard.vue` (new), mounted in
    `app.vue`.
  - DC-023: `SidebarNotificationsEntry.vue` toggles the panel; waiting count; blue / grey; tooltips hidden while
    open.
  - DC-024: the store (`centerOpen`, `centerAnchor`, `openCenter`, `closeCenter`, `waitingByKind`,
    `waitingByCategory`).
  - DC-025: `pages/settings.vue`: rail removed; the Notifications section in the navigation at every width.
  - DC-026: strings `settings.notifications.center.settings|close`.
- Round 6 validation (`review-evidence/round-6/r8.mjs`): **20/20**.
  - The pill (words, blue while new, the type list) opens the panel in place; read turns it grey.
  - A card expands; Update → updated; failure → Try again; the skill confirmation (Cancel keeps the panel);
    app Download → progress → Install.
  - Esc returns focus; a click outside closes; the gear goes to the Settings section with the setting.
  - Skip; Clear; the strip opens the panel beside it.
  - Empty and checks-off (no entry; the section's empty state); browser (no software card); zh-CN.

## Round 6 Feedback And Round 7 (card layout superseded by round 8)

- User feedback on round 6 (2026-10-20), with screenshots of the panel, its gear, the Settings setting card and
  Server Settings → Basics:
  - Use the darker blue (the user pointed at the darker Download button).
  - Keep it simple and in place. Download progress in the card is right. Everything happens in the card.
  - Remove the separate Notifications list in Settings ("don't make it redundant"). Remove the gear.
  - The background-check setting is a separate card in Server Settings → Basics, where the features' settings are.
- Round 7:
  - **Darker blue.** Primary buttons are `bg-sky-700` with `hover:bg-sky-800` (was `sky-600` / `sky-700`). The
    download progress, the card's new dot and the strip badge are `sky-700` too. The Settings-row pill keeps its
    approved blue (`sky-100` / `sky-800` / `sky-300`).
  - **One place for notifications.** The Notification Center panel is the whole notification area. Every action
    (Update, Download → Install and restart, Skip this version, Clear, Try again, the details) happens in the
    card. The panel header has the title and the close button only (no gear).
  - **Settings → Notifications removed.** The section, its navigation item and count, and the
    `components/settings/notifications/*` list components are gone. `pages/settings.vue` is back to the baseline.
  - **Update checks card in Server Settings → Basics** (`components/settings/UpdateChecksCard.vue`, last in the
    Basics grid). It follows the Basics card pattern (`rounded-3xl`, a 2xl title, a summary), with an inner row like
    Codex full access:
    - the label "Check GitHub packages and skills in the background";
    - the REQ-014 description of exactly what is sent;
    - the emerald / slate switch;
    - "Applies to this node."
- Note for the Solution Designer (SR-002 integration). This replaces the round 6 note. REQ-011 says the area "lives
  in Settings, and an indicator on the Settings entry". In the approved design:
  - the area is the **Notification Center**, which the user opens from the entry on the Settings row (or the strip
    icon) and which is never opened by itself;
  - there is **no Settings section** for notifications;
  - the per-node setting (REQ-013/014) is the **Update checks** card in **Server Settings → Basics**.
  - REQ-011 and the related AC need this wording when integrating.
- Round 7 changes:
  - DC-027: darker primary blue.
  - DC-028: the Settings Notifications section and the list components are removed; the gear is removed.
  - DC-029: `UpdateChecksCard.vue` in `ServerSettingsBasicsPanel.vue`.
  - DC-030: strings: added `settings.notifications.setting.title|summary`; removed `newCount`, `found`,
    `releaseNotes`, `offNotice`, `app.channel.*` and `center.settings`.
- Round 7 validation (`review-evidence/round-7/r9.mjs`): **25/25**. This is the round 6 set without the gear and
  section checks, plus:
  - C-011: no gear and no Settings link;
  - C-019: the button colour is `rgb(3, 105, 161)`;
  - C-020: no Notifications section in Settings;
  - C-021: the Basics card text, the switch and the scope;
  - C-022: zh-CN;
  - C-023: compact width;
  - the empty and off scenarios show the card's switch on and off.

## Round 7 Feedback And Round 8 (panel header superseded by round 9)

- User feedback on round 7 (2026-10-20), with a screenshot showing two "Agent package update" cards and two "Skill
  update" cards: "there should be only one entry … for each category … why do we have multiple entries there?"
- Round 8: **one card per type**, in the manner of macOS grouping notifications by app.
  - Cards: Software update; Agent package update(s); Skill update(s). The app is first; then the types ordered by
    their newest waiting update.
  - **One update:** the card reads "Agent package update", with the time and the "New" dot in its header. It looks
    the same as round 7.
  - **Several updates:** the card reads "Agent package updates  2" (the waiting count in grey). Its entries are
    separated by thin dividers. Each entry has:
    - its name (medium weight), its own time and its "New" dot;
    - the change (`main a1b2c3d → 9f8e7d6`, or "Updated to …");
    - its own actions in place: Update / Skip this version / Try again / Clear.
    - Clicking an entry's name or change expands its details (the repository and the compare link) in place.
  - **Long lists:** a card shows its first three entries and "Show N more" (then "Show less"), in place.
  - **Kept:** one notification per source (each source keeps its own Update and Skip, as REQ requires); the panel;
    the pill; the darker blue; the Update checks card in Server Settings → Basics.
- Round 8 changes:
  - DC-031: `NotificationCard.vue` is now the per-type card. The new `NotificationEntry.vue` is one update inside
    it, and the new `notificationTime.ts` holds the shared short time.
  - DC-032: `NotificationCenter.vue` groups the sources by type.
  - DC-033: strings: added `settings.notifications.kindGroup.*`, `showMore` and `showLess` (en, zh-CN).
  - Test ids: `notification-card-<kind>` is the card; `notification-entry-<id>` and its parts are the entries.
- Round 8 validation (`review-evidence/round-8/r10.mjs`): **27/27**. This is the round 7 set plus:
  - C-024: three cards (Software update; Agent package updates 2; Skill updates 1);
  - C-025: `many` shows three entries and "Show 2 more", and expands in place.

## Round 8 Feedback And Round 9 (actions superseded by round 10)

- User feedback on round 8 (2026-10-20): "Do you need this separate … notification headers and updates …? Isn't it
  already quite obvious what the user sees? … keep the UI cleaner."
- Round 9: **the panel is just the cards.**
  - Removed: the visible "Notifications" title, the close button and the "Updates 4" group label.
  - The panel keeps its accessible name ("Notifications", from a visually hidden heading). Focus moves to the panel
    when it opens, so Esc and Tab work at once.
  - It closes with Esc, a click outside, or the Settings-row entry again. Focus returns to the entry.
  - Padding: `p-2.5` around the cards. Everything else is as in round 8 (one card per type, entries inside).
- Round 9 changes:
  - DC-034: `NotificationCenter.vue` header and group label removed; the panel takes focus.
  - DC-035: strings `settings.notifications.center.close` and `category.updates` removed.
- Round 9 validation (`review-evidence/round-9/r11.mjs`): **28/28**. This is the round 8 set plus C-026 (no
  visible header or group label; the name is kept; the panel takes focus).

## Round 9 Feedback And Round 10 (layout superseded by round 11)

- User question on round 9 (2026-10-20): "do we really need the skip? … I personally have never clicked a skip … when
  you have a new version … a new version will be shown there … when I do updates … I update to the latest. So do we
  need this skip?"
- Product answer, which the user accepted when asking: no.
  - Each source has one notification, which always shows the newest version, so skipping a version and waiting
    for the next one happens by itself.
  - Updating always goes to the latest version.
  - The notification is quiet: it never opens by itself, and the pill turns grey once seen.
  - The Update checks card turns off the package and skill checks for those who never want them.
  - Common products (VS Code, Chrome, the App Store) keep an available update until it is installed.
  - Removing Skip also removes the need to store a skipped version for each source.
  - Accepted cost: someone who deliberately stays on an old package keeps seeing it in the grey count.
- Round 10: **no "Skip this version".**
  - Each update's only action is its update: **Update** (with the skill confirmation), or **Download** then
    **Install and restart** for the app.
  - **Try again** appears after a failure.
  - **Clear** removes an entry that has already been updated.
  - A waiting notification goes away when it is updated, or is replaced when a newer version is found.
- Note for the Solution Designer (SR-002 integration). The user decided to remove Dismiss (= skip this version)
  from SR-001: its requirement, acceptance criteria and decision, and any skipped-version storage. The
  notifications store no skip state.
- Round 10 changes:
  - DC-036: Skip buttons removed from `NotificationEntry.vue`.
  - DC-037: the store's `skipApp` and `appSkippedVersion` are removed; `skipSource` is renamed `clearSource` (used
    by Clear).
  - DC-038: strings `settings.notifications.skip` and `skipHint` are removed (en, zh-CN).
- Round 10 validation (`review-evidence/round-10/r12.mjs`): **28/28**. C-012 now checks that there is no Skip and
  four update actions.

## Round 10 Feedback And Round 11 (current proposal)

- User feedback on round 10 (2026-10-20): "why do I feel like you have information layout problem … the content
  inside the card … looks strange".
- Problems found:
  1. Each update spent a whole line on a lone button, leaving an empty strip to its right (three lines per update).
  2. There was no hierarchy: the type title and the item name were nearly the same size and weight.
  3. The time and "New" dot moved: they were on the title line in a single card, but on the item line in a
     grouped card.
  4. A 32 px icon column took width from the names, so they truncated early.
  5. The app repeated the version ("AutoByteus 1.5.7" above "1.5.6 → 1.5.7").
- Round 11: **rows, App Store style.**
  - **Card header:** a small grey line with the type's 16 px outline icon and the type in words (`text-xs`,
    `gray-500`): "Software update", "Agent package updates", "Skill updates". There is no count and no big icon
    column. The card is `px-4`.
  - **Each update is one row:**
    - left: the name (13 px, medium, `gray-900`), and below it the change and when it was found
      (`a1b2c3d → 9f8e7d6 · 3 hr. ago`; for the app `1.5.6 → 1.5.7 · 2 hr. ago`);
    - right, vertically centred: its one action as a small rounded button. The actions are Download / Update /
      Try again (`sky-700`), Install and restart (emerald), Clear (grey text), or "Updating…" with a spinner.
  - **"New":** a 6 px `sky-700` dot in a fixed gutter left of the name, in the same place in every card.
  - **The app's name is "AutoByteus"**; the versions are on the change line.
  - **The branch moved to the details** (`AutoByteus/autobyteus-agents · main`, then See changes on GitHub).
  - **Download progress, errors and "Downloaded…"** show under the row, at full width.
  - Each Update button's accessible name includes the item ("Update: AutoByteus Agents").
- Round 11 changes:
  - DC-039: `NotificationCard.vue` (a small header; rows).
  - DC-040: `NotificationEntry.vue` (a row with the action on the right; the dot gutter; the time on the change
    line; the branch in the details).
  - DC-041: the string `settings.notifications.app.name` is now "AutoByteus".
- Round 11 validation (`review-evidence/round-11/r13.mjs`): **29/29**. This adds C-027: one row, with the action
  to the right of the text and vertically centred, and the change line carrying the time. C-024 checks the titles
  without counts.

## Delivery And Validation

- UI/UX specification: pending
- Runnable UI reference entry point (round 7: `/chat`, then the "4 updates" pill on the Settings row; Settings → Server Settings → Basics → Update checks for the setting). Earlier:
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
