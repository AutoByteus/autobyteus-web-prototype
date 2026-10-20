# UI/UX Specification: Update Notifications (Notification Center)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket:
  - Product ticket `settings-update-notifications`;
  - Project Task autobyteus-212, the design step of autobyteus-209.
- Related requirements revision: **SR-002**
  (`/Users/normy/autobyteus_org/autobyteus-worktrees/settings-update-notifications/tickets/in-progress/settings-update-notifications/requirements-doc.md`).
- Related IDs:
  - requirements: REQ-004, 005, 007–014, 016–018;
  - acceptance criteria: AC-002–007, 009–011, 016, 018, 019;
  - quality requirement: QR-004;
  - decisions: DEC-001, 002, 005, 006, 008, 009, 012, 013.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL: `http://127.0.0.1:4681/chat`, the product's normal entry point. The design-only fixtures seed the
  update state; there is no preview-only control.
- Explicit user confirmation, 2026-10-20: "i like the UI approved", given on round 14 (commit `e6ef28c`) after
  the review rounds recorded in `product-ticket.md`.
  - Two fixes followed, during final validation, neither material:
    - below about 420 px the panel now stays inside the window (it was clipped on the right);
    - Install and restart is `emerald-700` instead of `emerald-600`, for text contrast (3.8 → 5.5:1).
- Final validation date: 2026-10-20.
  - Click-through `visual-references/final-validation.mjs`: 30/30.
  - tsc 0; tests 20/20.

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`. The surfaces are the sidebar Settings row
  (docked and collapsed), the Notification Center panel, and Settings → Server Settings → Basics.
- Pinned source commit: `9227d61597fd7ef8f6324fc9092be24ed1684c8a` (baseline `WEB-BASELINE-REFRESH-011`).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- UI reference revision: the integrated revision recorded in `product-ticket.md` (Delivery And Validation).
  - Ticket branch: `design/settings-update-notifications`.
  - Accepted design base: `c3b29e5`.
- Ticket folder: `tickets/done/settings-update-notifications/`
- Baseline report: `ui-baseline-report.md` at the design repository root (`WEB-BASELINE-REFRESH-011`).

## Problem And Design Rationale

- **User problem and intent.** Updates to the app, to imported GitHub agent packages and to imported GitHub skill
  sources should be announced quietly. Today the app update pops up by itself. Packages and skills are never
  announced.
  - The user asked for "a small, quiet notification area, not a pop-up", for words rather than an anonymous dot,
    and later for a panel "like Mac notifications" that opens where the user is.
- **Key UX decisions and why** (rounds 1–14, all in `product-ticket.md`):
  1. **Entry: a word pill on the Settings row** ("4 updates"), not a dot. Users could not recognise a dot as a
     notification. Words name the content, and the pill sits on the row the user already knows.
  2. **The pill is blue while updates wait.**
     - Solid dark blue while any is unread; soft blue once all are read.
     - Grey read as "nothing here".
  3. **A floating Notification Center, opened in place.** Jumping to a Settings page with a large list "felt not
     nice". The macOS pattern keeps the user's context.
  4. **One section per type, one row per update, one action per row.**
     - Separate cards per item looked crowded.
     - Rows with the action on the right (App Store style) put the name and change first and use one line each.
  5. **No Skip / Dismiss.** The user always updates to the latest, and a newer version replaces a waiting
     notification (SR-002 REQ-009, DEC-013).
  6. **One quiet surface.**
     - One white panel with the app-update card's light-blue border; one thin divider between sections.
     - No nested cards, no visible header, no group label.
     - A small ✕ makes closing discoverable.
  7. **The per-node setting is a Basics card** ("Update checks"), where Server Settings keeps feature settings. It
     is not a separate Notifications section.
- **Alternatives considered and rejected:**
  - a dot on Settings (unrecognisable);
  - two sidebar rows;
  - a Settings right-hand rail, and later a Settings → Notifications section (redundant, a page jump);
  - per-item cards (crowded), then card per type with stacked buttons (wasted lines);
  - a grey seen state (looked like "nothing");
  - the full app-update-card look with a gradient and uppercase labels ("too heavy");
  - Skip this version (unused).

## Scope And Experience Goal

- **User or actor:** the AutoByteus user on a desktop window or on a browser window of a server node. The
  background check and the app's own update check are the actors that cause notifications.
- **Context:** any page with the left sidebar (docked panel or collapsed strip).
- **Goal:** see that updates wait, see what changed, update each one in place, and leave.
- **Observable success:**
  - the pill appears without any pop-up;
  - one click shows every waiting update with its change;
  - Update, Download and Install run in the row, with their progress and result;
  - the pill softens once seen and disappears when nothing waits.
- **In-scope surfaces and journeys:** UIS-001 to UIS-004; UXJ-001 to UXJ-008.
- **Non-goals:**
  - any automatic update;
  - pop-ups, toasts or OS notifications;
  - telemetry;
  - a "check now" button;
  - local, built-in or application-package sources (REQ-016 keeps the area open to new kinds);
  - the mobile client;
  - the checking mechanism and storage.

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-004, AC-003, DEC-005 | Each update shows its kind (section header), its name, installed → latest (short revision or version), and when it was found. The row's details show the repository (· branch) and "See changes on GitHub" (compare link). The app shows current → new, with release notes and the release page in its details. | UIS-002 rows, VIS-003/005/006 |
| REQ-005 | One row per source and one for the app. A newer version replaces the row's revisions and makes it unread (blue dot, solid pill). | UIS-002 |
| REQ-007, AC-005–007, DEC-012 | Update in the row: the package updates directly; the skill source first shows its existing confirmation; the app goes Download → progress → Install and restart → restarting. Progress, failure and result show in the row. A failure keeps the row, with Try again. | UXJ-003–005, VIS-007–013 |
| REQ-008, AC-011 | Handled: "✓ Updated to …" in green, a grey name, the action Clear; it no longer counts. | VIS-008 |
| REQ-009, AC-009, DEC-008, DEC-013 | No Skip or Dismiss anywhere. A waiting row goes only by update or by replacement; a handled row goes by Clear. | UXJ-006, VIS-003/008/020 |
| REQ-010, AC-010 | Opening the panel marks everything read. The pill changes from solid to soft and keeps the count. Blue "New" dots stay until the panel closes. | UXJ-002, VIS-001/003/004 |
| REQ-011, AC-002 | The panel opens only on a click of the Settings-row pill or the strip icon, over the current page. The pill shows the waiting count whenever any wait, and is absent when none wait. | UIS-001, UIS-003, VIS-001–004, 017–018, 021 |
| REQ-012, DEC-001 | The self-opening app-update card is not shown. The app update appears only as the Software update section and in the count. Settings → Updates is unchanged. | VIS-003 |
| REQ-013/014, AC-016, DEC-002 | The "Update checks" card in Server Settings → Basics: the switch, on by default, with a description of the network calls and "Applies to this node." | UIS-004, VIS-022/023/025 |
| REQ-016 | Sections are generic per kind (icon, singular and plural title, rows). A new kind adds an icon and strings only. | UIS-002 |
| REQ-017, AC-018, DEC-009 | Desktop: the node's sources plus the app. Browser window of a server node: no Software update section. Mobile: none. | VIS-019 |
| REQ-018, AC-019 | All strings in en and zh-CN (see Content). | VIS-024/025 |
| QR-004 | The pill, the strip icon, every row action, the details toggle and ✕ are reachable by keyboard and named in en and zh-CN. | Accessibility section, VIS-014 |
| DEC-006 | Check failures create no notification (nothing to design). | — |

## Visual Language

- **Existing product language preserved:**
  - Tailwind gray / slate neutrals and the app's `sky` blue;
  - Heroicons outline icons (`heroicons:*`), the same set as the sidebar;
  - the Basics card pattern (`rounded-3xl` card, 2xl title, inner switch row, as in Codex full access);
  - the existing skill-source update confirmation dialog, unchanged.
- **Layout and hierarchy:**
  - The sidebar footer row is `Settings` (flex-1) with the pill at its right, in one row.
  - The panel floats above the footer. Its sections stack: a small grey header, then rows. In each row the name
    is the focal text, the change line sits below it, and the action is on the right, vertically centred.
- **Dimensions and spacing:**
  - Pill: `h-7` (28 px), `px-3`, `rounded-full`.
  - Panel:
    - width 360 px (`max-w: 100vw − 1rem`);
    - max height `min(72vh, 100vh − bottom − 16px)`;
    - the body scrolls.
  - Section: `px-4 pt-3 pb-1.5`. Row: `py-2`. Row text-to-action gap: 12 px.
  - Close: 28 px, at 8 px from the top and right.
  - Position:
    - docked: left 8 px, bottom = window height − pill top + 8 px;
    - collapsed strip: left = the icon's right + 8 px, clamped so the panel keeps 8 px from the window's right
      edge; bottom = max(8, window height − icon bottom).
- **Typography** (the app font, as baseline):
  - pill: 12 px semibold;
  - section header: 12 px medium, `leading-5`;
  - row name: 13 px medium, `leading-5`, truncated with an ellipsis (`title` = full name);
  - change line: 12 px;
  - revisions: mono 11 px, the latest one medium;
  - details and messages: 12 px, `leading-5`;
  - buttons: 12 px semibold.
- **Color roles:**

  | Role | Value |
  | --- | --- |
  | Pill, unread | `bg-sky-700` (#0369a1), white text, `ring-sky-700`; hover `bg-sky-800` |
  | Pill, read | `bg-sky-100` (#e0f2fe), `text-sky-800` (#075985), `ring-sky-300`; hover `bg-sky-200` |
  | Strip badge | `bg-sky-700`, white text, `ring-2 ring-white` |
  | Panel | `bg-white`, `border border-sky-200`, `shadow-xl`, `rounded-2xl` |
  | Section divider | `divide-gray-100` |
  | Section header | `text-gray-500`, with the icon in the same colour |
  | Name | `text-gray-900`; handled `text-gray-500` |
  | Change line | `text-gray-500`; latest `text-gray-700` medium; arrow `gray-400` |
  | "New" dot | 6 px `bg-sky-700` |
  | Primary action (Download, Update, Try again) | `bg-sky-700`, white; hover `bg-sky-800` |
  | Install and restart | `bg-emerald-700`; hover `bg-emerald-800` (white text 5.5:1; the old card's `emerald-600` gives only 3.8:1) |
  | Clear | `text-gray-600`; hover `bg-gray-100 text-gray-900` |
  | Updating… | `text-sky-800`, with a spinner |
  | Handled, Downloaded, Restarting | `text-emerald-700`; check icon `emerald-600` |
  | Error box | `bg-red-50`, `text-red-800`; reason `text-red-700` |
  | Links (compare, release page, Show N more) | `text-sky-700` medium, underline on hover |
  | Progress | track `bg-gray-200`, fill `bg-sky-700`, `h-1.5`, `rounded-full` |
  | Release notes box | `rounded-md bg-gray-50 px-2.5 py-1.5 text-gray-700` |
  | Close | `text-gray-400` on `bg-white` (`rounded-full`); hover `bg-gray-100 text-gray-700` |

- **Surfaces and elevation:**
  - the panel at `z-[90]`, above the page and below the confirmation dialog;
  - no nested card surfaces;
  - tooltips: `bg-gray-900`, white 12 px text, `rounded`, `px-2.5 py-1.5`.
- **Icons:**
  - kinds: `computer-desktop` (app), `cube` (agent package), `sparkles` (skill source), 16 px outline in headers;
  - strip entry: `arrow-down-circle`, 20 px;
  - change arrow: `arrow-right-20-solid`, 12 px;
  - external links: `arrow-top-right-on-square-20-solid`;
  - spinner: `arrow-path-20-solid`;
  - close: `x-mark-20-solid`, 16 px.
- **Interaction treatment:**
  - hover as in the colour table;
  - every control: `focus-visible:ring-2 ring-sky-500`;
  - the panel takes programmatic focus without a visible outline.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Settings-row entry (pill) | Count of waiting updates; opens the panel | unread (solid), read (soft), hover lines, expanded; absent when 0 | `components/layout/SidebarNotificationsEntry.vue` (`inline`), `components/AppLeftPanel.vue` |
| Strip entry | The same in the collapsed sidebar | icon + count badge, hover lines | `SidebarNotificationsEntry.vue` (`strip`), `components/layout/LeftSidebarStrip.vue` |
| Notification Center panel | The notification area | open / closed; sections; empty | `components/notifications/NotificationCenter.vue` (mounted in `app.vue`) |
| Type section | One per kind | singular title (1 row) / plural title (2+); first 3 rows + "Show N more" / "Show less" | `components/notifications/NotificationCard.vue` |
| Update row | One update | waiting (new / read), details open, updating, failed, handled; app: available, downloading, downloaded, installing, error | `components/notifications/NotificationEntry.vue` |
| Update checks card | The per-node setting | on / off | `components/settings/UpdateChecksCard.vue`, in `ServerSettingsBasicsPanel.vue` (last in the grid) |
| App update card (removed) | The self-opening card | not mounted | `app.vue` (`AppUpdateNotice` removed) |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Any page, docked sidebar | Background or app check found updates | Notice them | Solid pill "N updates"; hover lists the types | REQ-011, AC-002 |
| UXJ-002 | Same | Pill solid | See what changed | Panel open; rows with changes; pill soft | REQ-004, 010, AC-010 |
| UXJ-003 | Panel | Package row waiting | Update a package | Updating… → ✓ Updated to …, Clear; or failed, Try again | REQ-007/008, AC-005 |
| UXJ-004 | Panel | Skill row waiting | Update a skill source | Existing confirmation → Update → handled; Cancel changes nothing | REQ-007, AC-006, DEC-012 |
| UXJ-005 | Panel, desktop | App row waiting | Update the app | Download → progress → Install and restart → Restarting to install… | REQ-007/012, AC-007 |
| UXJ-006 | Panel | A row handled | Remove it | Clear removes the row; the panel shows the empty state when nothing remains | REQ-009, DEC-008 |
| UXJ-007 | Panel | Open | Close it | ✕, Esc, a click outside or the pill closes it; ✕ and Esc return focus to the pill | REQ-011, QR-004 |
| UXJ-008 | Server Settings → Basics | — | Control the background checks | The Update checks switch on or off, with the network-call description | REQ-013/014, AC-016 |

## Journey Details

- **UXJ-001 Notice.**
  - Entry: at least one waiting update. The pill shows "N updates" (N = waiting rows, the app included).
  - Solid dark blue if any waiting row is unread.
  - Hover or keyboard focus shows the type lines above the pill, right-aligned ("1 software update", "2 agent
    package updates", "1 skill update").
  - Nothing opens by itself. VIS-001, VIS-002; strip: VIS-017.
- **UXJ-002 Open and read.**
  - Click the pill. The panel appears above the Settings row (strip: to the right of the icon), with a 150 ms
    fade and rise.
  - Focus moves to the panel. All rows become read: the pill turns soft immediately (it stays visible behind the
    open panel).
  - Rows that were unread keep their blue dot while the panel stays open. The dots go when it closes.
  - Clicking a row's name or change line toggles its details (repository · branch, See changes on GitHub; app:
    release notes, Release page).
  - VIS-003, VIS-004, VIS-005, VIS-006.
- **UXJ-003 Package update.**
  - Update → the action becomes "Updating…" with a spinner → "✓ Updated to 9f8e7d6", with a grey name and the
    action Clear. The count drops by one.
  - Failure: a red box under the row reads "Update failed. Nothing was changed." with the reason below it, and
    the action reads Try again. The row and the count stay.
  - VIS-007, VIS-008, VIS-009.
- **UXJ-004 Skill update.** Update opens the existing "Update entire skill source?" confirmation over the open
  panel. Cancel returns to the panel unchanged; Update proceeds as in UXJ-003. VIS-010.
- **UXJ-005 App update.**
  1. Download → under the row: "Downloading N%" and a progress bar. The action is hidden while downloading.
  2. Then "Downloaded. Restart AutoByteus to install it.", and the action becomes Install and restart (emerald).
  3. Install and restart → "Restarting to install…" with a spinner.
  4. A download error shows "Download failed. Nothing was changed." with Try again.
  - VIS-011, VIS-012, VIS-013.
- **UXJ-006 Clear.** Clear removes a handled row. If no rows remain, the panel shows "No updates waiting" and the
  description of where updates come from (or the checks-off text), and the pill disappears. VIS-020.
- **UXJ-007 Close.**
  - ✕ (top right), or Esc anywhere (unless the skill confirmation is open: Esc closes that first), returns focus
    to the pill.
  - A click outside the panel and the pill closes it without moving focus. Clicking the pill toggles it.
- **UXJ-008 Setting.**
  - Settings → Server Settings → Basics → the "Update checks" card (last in the grid).
  - The switch is on by default. Turning it off stops background checks for packages and skills; existing rows
    stay.
  - VIS-022, VIS-023, VIS-025.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Settings-row entry | Every page with the docked left panel | Show the count; open the panel | Footer row: Settings (cog + label, flex-1), then the pill at the right | VIS-001, 002, 004, 021 |
| UIS-002 | Notification Center | Pill or strip icon | See and act on updates | Close ✕ at the top right; sections Software update, Agent package update(s), Skill update(s); rows (name / change · time / action); details; empty state | VIS-003, 005–016, 018–020, 024, 026, 028 |
| UIS-003 | Strip entry | Collapsed left strip, above the cog | The same | 20 px icon with a count badge at the top right; hover card with the summary and the type lines | VIS-017, 018, 027 |
| UIS-004 | Update checks card | `/settings?section=server-settings` (Basics) | Turn background checks on or off | Title, summary; inner row with label, description and switch; scope note | VIS-022, 023, 025 |

**Order in the panel:**
- the Software update section first;
- then one section per kind, ordered by its newest waiting update (most recent first);
- within a section, waiting rows newest first, then handled rows.

**Section titles:** singular with one row ("Agent package update"), plural with two or more ("Agent package
updates"). The app is always singular.

**Long lists:** a section shows its first three rows, then "Show N more", which expands in place to all rows and
then reads "Show less".

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | No entry | A check finds an update | Pill appears, solid | Waiting, unread | Count +1 | Open |
| TR-002 | Pill (closed) | Click or Enter | Panel fades in; focus moves to the panel | Open; all read | Pill turns soft | Row actions, details, close |
| TR-003 | Row | Click the name or change | Details expand below | Details open (`aria-expanded=true`) | — | Collapse, links |
| TR-004 | Package row, waiting or failed | Update / Try again | "Updating…" + spinner | Updating | Existing package update | — |
| TR-005 | Updating | Success | ✓ Updated to …; Clear | Handled | Count −1; pill absent at 0 | Clear |
| TR-006 | Updating | Failure | Red box with the reason; Try again | Failed | Source unchanged; row kept | Try again |
| TR-007 | Skill row, waiting | Update | Existing confirmation dialog | Confirming | — | Cancel (no change) / Update (TR-004) |
| TR-008 | App row, available or error | Download / Try again | Progress under the row | Downloading | Existing app download | — |
| TR-009 | Downloading | Complete | "Downloaded. Restart AutoByteus to install it."; Install and restart | Downloaded | — | Install and restart |
| TR-010 | Downloaded | Install and restart | "Restarting to install…" + spinner | Installing | App restarts | — |
| TR-011 | Handled row | Clear | Row removed | Gone; empty state when the last one goes | Persisted cleared | — |
| TR-012 | Section with more than 3 rows | Show N more / Show less | Rows expand or collapse in place | Expanded / collapsed | — | — |
| TR-013 | Open | ✕ / Esc / click outside / pill | Panel fades out | Closed; "New" dots end | ✕ and Esc return focus to the pill | Open again |
| TR-014 | Waiting row | A newer version is found | Row shows the new revision; dot; pill solid | Waiting, unread | Same row (REQ-005) | — |
| TR-015 | Update checks switch | Click / Space | Switch moves; colour changes | On / off | Per-node setting | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Entry / unread | ≥1 waiting row unread | Solid sky-700 pill, "N updates" | Open | — | VIS-001 |
| Entry / read | All waiting rows read | Soft sky-100 pill, same text | Open | — | VIS-004 |
| Entry / none | 0 waiting | No pill; Settings row as baseline | — | — | VIS-021 |
| Entry / hover | Hover or focus | Dark tooltip above-right, one line per type; hidden while the panel is open | — | — | VIS-002 |
| Row / waiting, new | Unread | 6 px blue dot left of the name | Update / Download | — | VIS-003 |
| Row / details | Name clicked | Repository · branch; See changes on GitHub ↗; app: notes box, Release page ↗ | Links | Click again | VIS-005, 006 |
| Row / updating | TR-004 | "Updating…" + spinner in place of the action | — | — | VIS-007 |
| Row / handled | TR-005 | Grey name; "✓ Updated to {{revision}}" in green | Clear | — | VIS-008 |
| Row / failed | TR-006 | Red box: "Update failed. Nothing was changed." + reason | Try again | Try again | VIS-009 |
| Row / app downloading | TR-008 | "Downloading N%" + bar (full row width) | — | — | VIS-011 |
| Row / app downloaded | TR-009 | Green message; emerald Install and restart | Install and restart | — | VIS-012 |
| Row / app installing | TR-010 | "Restarting to install…" + spinner | — | — | VIS-013 |
| Row / app error | Download failed | "Download failed. Nothing was changed." | Try again | — | (as VIS-009) |
| Section / many | >3 rows | First 3 + "Show N more" | Show more / less | — | VIS-015, 016 |
| Panel / empty | Last row cleared while open | "No updates waiting" + "Updates to the app and to the agent packages and skill sources you imported from GitHub appear here." (checks off: "Background checks are off. Updates are still found when you open Agent Packages or Manage skill sources.") | Close | — | VIS-020 |
| Panel / browser window | Server node in a browser | No Software update section | — | — | VIS-019 |
| Long name | — | Single-line ellipsis; full name in `title` | — | — | VIS-003 ("Research Assistant Agents for Long Li…") |
| Update checks / on, off | Switch | Emerald on / slate off | Toggle | — | VIS-022, 023 |

## Content, Labels, Validation, And Feedback

- **Voice:** the product's plain, short sentence style; the type in words; no exclamation marks; "Nothing was
  changed." after failures.
- **Exact strings (en / zh-CN):**

  | Key | en | zh-CN |
  | --- | --- | --- |
  | `sidebar.updates.short.one/other` (pill) | 1 update / {{count}} updates | 1 个更新 / {{count}} 个更新 |
  | `sidebar.updates.one/other` (name) | 1 update available / {{count}} updates available | 1 个可用更新 / {{count}} 个可用更新 |
  | `sidebar.kind.app.*` | 1 software update / {{count}} software updates | 1 个软件更新 / {{count}} 个软件更新 |
  | `sidebar.kind.agent_package.*` | 1 agent package update / {{count}} agent package updates | 1 个智能体包更新 / {{count}} 个智能体包更新 |
  | `sidebar.kind.skill_source.*` | 1 skill update / {{count}} skill updates | 1 个技能更新 / {{count}} 个技能更新 |
  | `sidebar.description` / `listSeparator` | {{summary}}: {{details}} / ", " | {{summary}}：{{details}} / "、" |
  | `title` (panel name) | Notifications | 通知 |
  | `center.close` | Close | 关闭 |
  | `kind.*` | Software update · Agent package update · Skill update | 软件更新 · 智能体包更新 · 技能更新 |
  | `kindGroup.*` | Software updates · Agent package updates · Skill updates | 软件更新 · 智能体包更新 · 技能更新 |
  | `new` (screen readers) | New | 新 |
  | `update` / `tryAgain` / `clear` | Update / Try again / Clear | 更新 / 重试 / 清除 |
  | `updating` | Updating… | 正在更新… |
  | `failed` | Update failed. Nothing was changed. | 更新失败，未做任何更改。 |
  | `handled` | Updated to {{revision}} | 已更新到 {{revision}} |
  | `compare` / `releasePage` | See changes on GitHub / Release page | 在 GitHub 上查看变更 / 发布页面 |
  | `app.name` | AutoByteus | AutoByteus |
  | `app.download` / `app.install` | Download / Install and restart | 下载 / 安装并重启 |
  | `app.downloading` | Downloading {{percent}}% | 正在下载 {{percent}}% |
  | `app.downloaded` | Downloaded. Restart AutoByteus to install it. | 已下载。重启 AutoByteus 即可安装。 |
  | `app.installing` | Restarting to install… | 正在重启以安装… |
  | `app.failed` | Download failed. Nothing was changed. | 下载失败，未做任何更改。 |
  | `showMore` / `showLess` | Show {{count}} more / Show less | 再显示 {{count}} 个 / 收起 |
  | `empty.title` / `empty.on` / `empty.off` | (as in State Behavior) | 没有待处理的更新 / 应用以及你从 GitHub 导入的智能体包和技能来源有更新时，会显示在这里。 / 后台检查已关闭。打开“智能体包”或“管理技能来源”时仍会检查更新。 |
  | `setting.title` / `setting.summary` | Update checks / Find new versions of the agent packages and skill sources you imported from GitHub, and show them in Notifications. | 更新检查 / 查找你从 GitHub 导入的智能体包和技能来源的新版本，并显示在“通知”中。 |
  | `setting.label` | Check GitHub packages and skills in the background | 在后台检查 GitHub 智能体包和技能 |
  | `setting.description` | At most every 6 hours, this node asks api.github.com for the latest commit of each agent package and skill source you imported from GitHub. No account or token is used. GitHub sees your IP address and the repository names; nothing is sent to AutoByteus. Nothing is updated until you press Update. The desktop app also checks GitHub releases for its own update when it starts. | (zh-CN in `localization/messages/zh-CN/settings.ts`, same meaning) |
  | `setting.scope` | Applies to this node. | 仅适用于此节点。 |
  | `listLabel` | Update notifications | 更新通知 |

  Keys are under `settings.notifications.`. The skill confirmation uses the existing
  `skills.sources.updateTitle`, `skills.sources.updateWarning` and `skills.sources.update` strings.
- **Formats:**
  - Revisions are the first 7 characters. The confirmation shows 10, as today.
  - The time is a short relative time (`Intl.RelativeTimeFormat`, `style: 'short'`, `numeric: 'auto'`): minutes
    under an hour, hours under a day, then days. Examples: "3 hr. ago", "yesterday", "2 days ago"; zh-CN
    "3小时前", "昨天".
  - The full local date and time is in the `title`.

### Form And Input Validation

N/A. The only input is the switch.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Docked left panel | Baseline widths with the panel shown (VIS-003 1440, VIS-026 1000) | Pill on the Settings row; panel above it at left 8 px | — |
| Collapsed strip | User-collapsed, or the baseline's narrow layout (390) | Icon and badge above the cog; panel to the right of the icon | — |
| Narrow window | Below ~420 px | The panel's width becomes window − 16 px and it moves left to keep 8 px from the right edge, covering the strip (VIS-028) | Close with ✕ / Esc / outside click |
| Short window | Any height | Panel max height `min(72vh, 100vh − bottom − 16px)`; the body scrolls; ✕ stays at the top | — |
| Desktop window | Electron | Software update section shown when the app has an update | — |
| Browser window of a server node | — | No Software update section (VIS-019) | — |
| Mobile client | — | No entry, no panel | — |

## Accessibility And Keyboard Behavior

- **Target:** QR-004 and the product's existing practice.
- **Focus:**
  - On open, focus moves to the panel (`tabindex=-1`, `role=dialog`, named "Notifications" by a visually hidden
    heading).
  - Tab order: ✕, then for each section its rows (details toggle, then action), then "Show N more".
  - On ✕ or Esc, focus returns to the pill (or the strip icon).
  - A click outside does not move focus.
  - The skill confirmation keeps its existing focus handling. The panel stays open behind it (outside clicks and
    Esc do not close the panel while it is open).
- **Keyboard:**
  - Enter or Space activates the pill, toggles, actions and links.
  - Esc closes the panel; when the confirmation is open, Esc closes the confirmation first.
  - The switch toggles with Space.
- **Roles, names and announcements:**
  - Pill: `aria-label` "4 updates available: 1 software update, 2 agent package updates, 1 skill update",
    `aria-haspopup="dialog"`, `aria-expanded`.
  - Row toggle: `aria-expanded`, `aria-controls`.
  - Primary action: `aria-label` "{{action}}: {{name}}" (for example "Update: AutoByteus Agents").
  - "New:" is read before the names of new rows.
  - Updating, download progress and installing are `role=status`; the failure box is `role=alert`.
  - Sections are lists named by their headers. The whole list is named "Update notifications".
  - The switch is `role=switch` with `aria-checked`, labelled by its label and described by its description.
- **Contrast** (computed):
  - white on `sky-700`: 5.93:1;
  - `sky-800` on `sky-100`: 6.59:1;
  - `gray-500` on white: 4.83:1;
  - `sky-700` links on white: 5.93:1;
  - white on `emerald-700`: 5.48:1;
  - `emerald-700` text on white: 5.48:1;
  - the `sky-200` panel border is decorative; the panel is also delimited by its shadow.

## Motion And Transitions

- Panel enter and leave: opacity 0 → 1 and translateY 6 px → 0, 150 ms, `ease`.
- Spinners use `animate-spin`. The progress fill animates its width (`transition-all`).
- Reduced motion: no panel transition and no spinner rotation (`motion-reduce:animate-none`).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Source notifications (packages, skills) | kind, name, repository, branch, installed/latest revision, foundAt, unread, state, error | Design store `stores/updateNotificationsStore.ts`, seeded by `plugins/99.update-notifications.client.ts` (design-only; off with `designOnlyLayers=off`) | Server-side producer, persistence of read, handled and cleared (REQ-010), and live push to the window (AC-004): Solution Designer and engineering |
| Package and skill Update | progress, result, error | 1.6 s timer; `pkg-research` fails once with a GitHub 502 message | The existing update pipelines (REQ-007) |
| App update | status, versions, notes, progress | Design-owned `appUpdateStore` state; download in 8 % steps | Existing Electron updater; the app's read and found state lives in the shell (DEC-009) |
| Mark read / "New" this visit | — | `markSeen` on open; dots kept until close | Persisted read state |
| Update checks setting | on/off | In-memory | Per-node setting (REQ-013) |
| Scenarios (review only) | — | localStorage `autobyteus.prototype.notifications` = `many`, `empty`, `off`, `browser` | — |

## Final Visual Reference Inventory

All 1440 × 900 unless stated. Captured with reduced motion. Script: `visual-references/capture-references.mjs`.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 pill, unread | 1440×900 | `visual-references/VIS-001-entry-new-1440x900.png` | Solid pill on the Settings row; text; position | Count, names |
| VIS-002 | Pill hover | 1440×900 | `VIS-002-entry-hover-types-1440x900.png` | Tooltip: placement, one line per type | Counts |
| VIS-003 | UXJ-002 panel open | 1440×900 | `VIS-003-panel-open-1440x900.png` | Panel surface and border; ✕; section headers; rows; dots; buttons; order; soft pill behind | Names, revisions, times |
| VIS-004 | Pill, read | 1440×900 | `VIS-004-entry-seen-1440x900.png` | Soft pill | Count |
| VIS-005 | Package details | 1440×900 | `VIS-005-package-details-1440x900.png` | Repository · branch; compare link | Repository, branch |
| VIS-006 | App details | 1440×900 | `VIS-006-app-release-notes-1440x900.png` | Release notes box; Release page link | Notes text |
| VIS-007 | Updating | 1440×900 | `VIS-007-package-updating-1440x900.png` | Spinner and "Updating…" in place of the action | — |
| VIS-008 | Handled | 1440×900 | `VIS-008-package-updated-clear-1440x900.png` | Grey name; green "Updated to"; Clear | Revision |
| VIS-009 | Failed | 1440×900 | `VIS-009-package-failed-try-again-1440x900.png` | Red box, reason line, Try again | Reason text |
| VIS-010 | Skill confirmation | 1440×900 | `VIS-010-skill-update-confirmation-1440x900.png` | Existing dialog over the open panel | Source, revisions; section order follows the newest waiting |
| VIS-011 | App downloading | 1440×900 | `VIS-011-app-downloading-1440x900.png` | Percent text and full-width bar; no action | Percent |
| VIS-012 | App downloaded | 1440×900 | `VIS-012-app-downloaded-install-1440x900.png` | Green message; emerald Install and restart | — |
| VIS-013 | App installing | 1440×900 | `VIS-013-app-installing-1440x900.png` | Spinner and "Restarting to install…" | — |
| VIS-014 | Keyboard focus | 1440×900 | `VIS-014-keyboard-focus-first-control-1440x900.png` | First Tab stop is ✕, with the sky focus ring | — |
| VIS-015 | Many | 1440×900 | `VIS-015-many-show-more-1440x900.png` | 3 rows + "Show N more"; panel scrolls | Counts, names |
| VIS-016 | Many, expanded | 1440×900 | `VIS-016-many-expanded-1440x900.png` | All rows; "Show less" | — |
| VIS-017 | Strip entry | 1440×900 | `VIS-017-strip-entry-1440x900.png` | Icon with sky-700 badge above the cog | Count |
| VIS-018 | Strip, panel open | 1440×900 | `VIS-018-strip-panel-open-1440x900.png` | Panel to the right of the icon, bottoms aligned | — |
| VIS-019 | Browser window | 1440×900 | `VIS-019-browser-window-no-software-1440x900.png` | No Software update section | — |
| VIS-020 | Empty after clearing | 1440×900 | `VIS-020-panel-all-cleared-empty-1440x900.png` | Empty-state copy; no pill | — |
| VIS-021 | Nothing waiting | 1440×900 | `VIS-021-nothing-waiting-no-entry-1440x900.png` | Settings row as baseline, no pill | — |
| VIS-022 | Update checks, on | 1440×900 | `VIS-022-update-checks-card-on-1440x900.png` | Card pattern, copy, emerald switch, scope | — |
| VIS-023 | Update checks, off | 1440×900 | `VIS-023-update-checks-card-off-1440x900.png` | Slate switch | — |
| VIS-024 | zh-CN panel | 1440×900 | `VIS-024-panel-open-zh-CN-1440x900.png` | Chinese copy and layout | — |
| VIS-025 | zh-CN card | 1440×900 | `VIS-025-update-checks-card-zh-CN-1440x900.png` | Chinese copy | — |
| VIS-026 | Compact window | 1000×760 | `VIS-026-panel-open-compact-1000x760.png` | Same panel; height cap | — |
| VIS-027 | Narrow: strip entry | 390×844 | `VIS-027-narrow-strip-entry-390x844.png` | Strip icon and badge | — |
| VIS-028 | Narrow: panel | 390×844 | `VIS-028-narrow-panel-open-390x844.png` | Panel inside the window (8 px margins), over the strip | — |

Paths without a folder are in `visual-references/`. Everywhere, names, repositories, revisions, versions,
counts, times, release notes and error reasons are illustrative fixture values; template text around them is
exact.

## Linked UI Reference Evidence

- Runnable UI reference: `corepack pnpm install --ignore-workspace --frozen-lockfile && corepack pnpm dev --port <port>`,
  then `/chat`. See `ui-reference-runbook.md` (section settings-update-notifications).
- Ticket record: `tickets/done/settings-update-notifications/product-ticket.md`. It records rounds 1–14, the
  user's words, the DC-001 to DC-046 changes and the Requirement Impact.
- Validation:
  - `visual-references/final-validation.mjs` (C-001–C-028, 30 checks);
  - per-round evidence in `review-evidence/round-1` … `round-14`.
- Scenarios: localStorage `autobyteus.prototype.notifications` = `many` | `empty` | `off` | `browser`, and
  `autobyteus.localization.preference-mode` = `zh-CN`.
- Mocked boundaries: see Data, Contract, And Mock Boundaries.

## Implementation Fidelity Boundary

- **Must preserve:**
  - every visible value above: colours, sizes, radii, borders, order, copy, states;
  - the in-place behaviour: no navigation, nothing opens by itself, one action per row;
  - focus and keyboard behaviour.
- **Does not prescribe:**
  - the design store, the plugin, the timers, scripted failures and the `appUpdateStore` overrides;
  - the component split (section and row components are a suggestion).
- **May vary:**
  - fixture values;
  - the exact relative-time wording produced by `Intl` per locale.
- **Responsive variation:** only as in the Responsive section.
- **Design-system constraints:** Tailwind palette and Heroicons as used today. The existing confirmation dialog
  is reused unchanged.

## Out Of Scope

- A Settings section or page for notifications.
- Dismiss or Skip, and per-source muting.
- Notifications for check failures (DEC-006), application packages, or local and built-in sources.
- The mobile client.
- A "check now" button.

## Open Decisions And Risks

- **REQ-004 placement.** In the approved design the repository and the compare link are in the row's details,
  one click away. Name, kind (section), installed → latest and found time are always visible. The Solution
  Designer may record this reading of "shows" when folding in.
- **Live order.** In the reviewed UI reference the order is live while the panel is open:
  - a row that becomes handled moves to the end of its section;
  - sections follow their newest waiting update, so a section can move (see VIS-010 after a package update).
  - This was the reviewed behaviour. If engineering finds the movement disruptive in use, it is a Product
    question, not a silent change.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (app download error shares VIS-009's treatment)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
