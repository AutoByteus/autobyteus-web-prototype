# UI/UX Specification — Settings → Agent Runtimes

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `runtime-lifecycle-review` (Solution Designer package identifier, SR-004); ticket folder `tickets/done/runtime-lifecycle-review/` once integrated
- Related requirements revision ID: SR-004 (draft, not approved)
- Related requirement, behavior, acceptance-criteria, and decision IDs: BEH-001…005, REQ-001…005, DEC-001…003 (`requirements-doc.md`); evidence E-R19, E-R20, E-R21; open Q-1, Q-2, Q-3 (below). No acceptance-criteria IDs exist yet.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (during review): `http://127.0.0.1:4701/settings?section=agent-runtimes`
- Explicit user-confirmation reference: 2026-10-20, in the Product UI/UX Designer conversation. After the final design summary the user replied "yes approved", and directed that Q-1, Q-2 and Q-3 be taken to the Solution Designer ("for question 1 2 3 you should ask solution designer"). Earlier user direction folded into this design: the full sign-in feature as the target; install stays in the terminal; Antigravity sign-in is `agy` → Enter → browser; the name "AI Runtimes" was disliked and replaced by "Agent Runtimes"; a not-installed runtime must be visible in the default view; the sign-in terminal "perfect". **Approval covers the UI; it does not settle Q-1…Q-3 or the vendor-terms questions.**
- Final validation date: 2026-10-20 (`visual-references/final-validation.mjs`, 96 checks; `corepack pnpm typecheck` 0 errors, `lint` clean, `test` 17/17)

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend application or product surface: `autobyteus-web`, Settings page
- Pinned source commit or revision: `2f211340ee36b81cef74a74b2e042b5102c269d3` (baseline pin, v1.5.6-beta.1); request code `origin/personal@9227d61597`. `git diff 2f21134 9227d61597` over `pages/settings.vue` and `components/settings` shows only the Embedding section (already designed and integrated) and unrelated NFS-guide copy, so the Settings shell is current.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- UI reference revision or commit: recorded in `product-ticket.md` (the commit that holds this specification); accepted design base `cb384e32c216048c5214410c435b854dc3fa96fd`; ticket branch `design/runtime-lifecycle-review`
- Ticket folder: `tickets/done/runtime-lifecycle-review/`
- Baseline report path: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- User problem and intent: users normally install the coding agent runtimes themselves (Codex, Claude, Antigravity, Grok) and AutoByteus uses whatever is installed, but the app has no place that shows them; the only signal is an "Unavailable" reason in the model menu. Many users forget to go to a terminal to update or sign in. One page should show each runtime's version, whether a newer one exists, whether it is signed in, let the user update it, and sign in from the app where that is possible.
- Key UX decisions and why:
  - **One table, four rows** (Runtime · Installed · Updates · Account · action): four fixed items are compared across the same three facts, so columns beat per-row cards.
  - **Name "Agent Runtimes"**: the product already says "runtime" (model menu "Runtimes", "Preferred runtime", "Default runtime"); "AI" adds nothing in an AI app; "provider" collides with the model providers under API Keys. The page says "runtimes", never "engines".
  - **Placement**: a top-level Settings item right after API Keys (both are about what AutoByteus can use to run models).
  - **Honest evidence only**: "Up to date", "Update available", "Signed in" appear only from a result; otherwise "Checking for updates…", "Check failed", or "Sign-in unknown". A failed check keeps the installed version and says the runtime "still works".
  - **Update** is the single dark button (as in Agent Packages). **Sign in** is a secondary button. Progress of the vendor updater is indeterminate (vendors give no percentage) and shows the vendor command and its current step.
  - **Update is blocked, visibly** while the runtime has agents running: the button stays, is aria-disabled, and the reason with the count is written beneath the status.
  - **Per-runtime sign-in** follows the Solution Designer's evidence (E-R21): Codex and Grok start their own login and the browser opens; Antigravity has no login command, so Sign in opens a terminal running `agy` where the user presses Enter and then finishes in the browser; Claude shows "Sign in from its command line." until Anthropic approves (a button is a design variant the user may choose).
  - **Install stays in the terminal**: a not-installed runtime shows "Not installed" and a link to the vendor's install instructions; there is no install button.
  - **Remote and Docker nodes are status only**: the same rows, no Update and no Sign in, one explanatory note.
  - Copy is minimal, following the user's earlier "much less text" direction for Settings.
- Alternatives considered and why not chosen (described, not built):
  - Per-runtime cards: heavier, hard to compare four runtimes.
  - Per-row "Check again": four controls for one action; a page-level button is enough.
  - A real progress percentage: vendors do not report one.
  - Names "Runtimes" (vague beside Display), "Coding Agents" (not the product's word; Antigravity and Grok are not only coding tools), "Agent Engines" (the product never says engine), "provider" (collides with API Keys).
  - A Claude Sign in button: needs Anthropic's approval (E-R21); kept as a one-line variant.
  - Antigravity sign-in text only ("Sign in from its command line."): replaced at the user's request by the terminal flow.

## Scope And Experience Goal

- User or actor: a user of the desktop app (and of a remote/Docker node window) who uses Codex, Claude, Antigravity or Grok as agent runtimes.
- Context: Settings → Agent Runtimes, per node (the node the window is bound to).
- Goal: see each runtime's state, update it, sign in, or learn how to install it, without a terminal where that is possible.
- Observable success: with Claude one version behind, the page says "Update available (version 2.1.304)"; Update brings it to 2.1.304 and the page then says "Up to date". A signed-out Codex gets "Signed in" after one click and a browser step.
- In-scope surfaces and journeys: the Agent Runtimes page and its states (UXJ-001…UXJ-009).
- Non-goals: no AutoByteus-managed copies, no version catalogue, no automatic updates by AutoByteus, no notifications outside this page, no install button, no changes to the model menu, no remote Update or remote Sign in.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| BEH-001 / REQ-001 | List Codex, Claude, Antigravity, Grok for the current node with installed state and version | UXJ-001; UIS-001; VIS-001, VIS-002, VIS-019 |
| BEH-002 / REQ-002 | Check each installed runtime when the page opens and on Check again; Up to date / Update available (version X) / Check failed; checking changes nothing | UXJ-001, UXJ-002; VIS-003, VIS-015, VIS-016 |
| BEH-003 / REQ-003 | Update runs the vendor's updater, shows progress and result, then re-checks; unavailable while agents run | UXJ-003, UXJ-004, UXJ-005; VIS-004–VIS-007 |
| BEH-004 / REQ-004 | Not installed + link to the vendor's install instructions; no install by AutoByteus | UXJ-006; VIS-001, VIS-014 |
| BEH-001, BEH-005 / REQ-005 (Q-2) | Signed in / Not signed in / Sign-in unknown; Sign in where supported, otherwise the command-line instruction | UXJ-007, UXJ-008, UXJ-009; VIS-008–VIS-013 |
| BEH-005 (Q-3) | Remote/Docker node: status only | UXJ-010; VIS-019 |
| DEC-003 | Update unavailable while the runtime has running agents | UXJ-005; VIS-007 |

## Visual Language

- Existing product language to preserve: the Settings shell and left menu unchanged; the Embedding card pattern (`rounded-3xl` white card, slate border, `shadow-sm`, `text-2xl` title, `text-sm text-gray-500` description) and its status-line vocabulary (a dot and plain words, no boxed pills); secondary and dark buttons as in Agent Packages.
- Layout structure and visual hierarchy: one card in the Settings content area. Header: title and description left; "Checked …" text and Check again right. Node line below the description. Optional remote note. Then the table. No sticky or layered elements except the sign-in terminal, which expands inside its row.
- Grid, dimensions, spacing, density: card `px-6 py-5`; table `rounded-xl border border-slate-200`, header row `bg-gray-50 px-4 py-2`; rows `px-4 py-3` separated by `divide-slate-100`; at ≥640 px the row grid is `8rem 9rem minmax(0,1fr) 15rem 8rem` with `gap-x 1.5rem` (Runtime, Installed, Updates, Account, action); first lines of every cell and the buttons share a 36 px line (`min-h-9`), so rows align. Below 640 px each row stacks: runtime name, then labelled lines (label column 5rem, `text-xs text-gray-400`), then the action.
- Typography (product font, Tailwind scale): page title `text-2xl font-semibold leading-tight text-gray-900`; description and node line `text-sm text-gray-500` (node name `font-medium text-gray-700`); column headers `text-xs font-medium text-gray-500`; runtime name `text-base font-semibold text-gray-900`; cells `text-sm`; progress line `text-xs text-gray-500` with the command in `font-mono text-gray-700`; terminal `font-mono text-sm leading-6`.
- Color values and semantic roles: Up to date — `text-green-700` with `bg-green-600` dot; Update available and Not signed in — `text-amber-700` with `bg-amber-500` dot; Check failed and failures — `text-red-700` with `bg-red-600` dot; Signed in — `text-gray-700` with `bg-green-600` dot; unknown, Not installed and notes — `text-gray-500`; install link — `text-blue-700` underlined (`decoration-blue-200`, hover `blue-500`); progress bar `bg-blue-500` on `bg-gray-100`; vendor error box `bg-gray-50 text-gray-600 font-mono text-xs`; remote note `bg-gray-50 text-gray-700`.
- Surfaces, borders, radii, shadows, elevation, layering: card `rounded-3xl` + `shadow-sm`; table `rounded-xl`; buttons `rounded-md`; terminal window `rounded-xl border border-slate-200 shadow-sm` (title bar `bg-gray-800`, body `bg-gray-900`, steps strip `bg-gray-50 border-t`).
- Controls, icons, imagery, and media assets: Settings menu icon `heroicons:cpu-chip-20-solid`; external-link icon `heroicons:arrow-top-right-on-square-20-solid` (16 px) after "Install instructions"; check icon `heroicons:check-circle-20-solid` (20 px, `text-green-600`) in the sign-in steps; spinners are 12 px (`h-3 w-3`, `border-2`, `animate-spin`). No imagery.
- Hover, active, focus, selected, disabled, validation, and feedback treatment: all buttons `min-h-9`, `px-3 py-1.5`, `text-sm font-medium`; secondary = white, `border-gray-300`, hover `bg-gray-50`, disabled `opacity-60`; Update = `bg-gray-900 text-white`, hover `bg-gray-800`; Update blocked by agents = `opacity-50`, `cursor-not-allowed`, `aria-disabled`; Updating… / Signing in… = disabled, spinner, `cursor-wait`; focus = 2 px blue ring (`ring-blue-500`, offset 1) on every control; the terminal body has an inset blue ring when focused.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Settings menu item "Agent Runtimes" | Entry | normal, selected | `pages/settings.vue` |
| Agent Runtimes card | Header, node line, Check again, remote note, table | loading, ready, load error, remote | `components/settings/AiRuntimesManager.vue` |
| Runtime row | One runtime's state and actions | not installed; checking; up to date; update available; check failed; updating; updated; update failed; blocked by agents; signed in / not signed in / unknown; sign-in waiting / failed | same |
| Sign-in terminal | Antigravity sign-in inside the row | press Enter; browser step; signed in (closing) | same |
| Scripted node timeline (design only) | Checks, updater, sign-in and agent timeline | scenarios below | `prototype/ai-runtimes/aiRuntimesFixture.ts` |

(The `AiRuntimes*` file names are historical; the product name is Agent Runtimes.)

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User on the desktop | Opens Settings → Agent Runtimes | See every runtime's state | Rows resolved; "Checked just now" | BEH-001, BEH-002 |
| UXJ-002 | User | Page open | Re-check | Rows resolved again | BEH-002 |
| UXJ-003 | User | A runtime shows Update available | Update it | Updated, re-checked, Up to date | BEH-003 |
| UXJ-004 | User | Updater fails | Understand and retry | Retried | BEH-003 |
| UXJ-005 | User | Agents running on a runtime with an update | Know why Update is unavailable | Update enabled when agents finish | BEH-003, DEC-003 |
| UXJ-006 | User | A runtime is not installed | Learn how to install | Install page opened in the browser | BEH-004 |
| UXJ-007 | User | Codex (or Grok) not signed in | Sign in from the app | Signed in | REQ-005 |
| UXJ-008 | User | Sign-in does not finish | Cancel or retry | Back to Sign in / retried | REQ-005 |
| UXJ-009 | User | Antigravity not signed in | Sign in through its terminal | Signed in | REQ-005 |
| UXJ-010 | User in a remote/Docker node window | Opens the page | See that node's runtimes | Status only | BEH-005 |

## Journey Details

- **UXJ-001 Open.** The page shows a four-row loading skeleton (about 0.7 s), then the rows. Installed versions are known at once. Each installed runtime shows "Checking for updates…" and resolves on its own, not together (VIS-003). Check again reads "Checking…" and is disabled until all are done; then "Checked just now" (then "Checked N min ago"). Leaving the page and returning re-checks. A long-running updater or sign-in keeps running while the user is away.
- **UXJ-002 Check again.** The same as opening. An earlier "Updated…" or "Update failed" message is cleared by a new check. A row that is updating is not re-checked.
- **UXJ-003 Update (VIS-004, VIS-005).** Click Update on Claude. The button becomes "Updating…" (disabled, spinner). Under the status: an indeterminate blue bar and one line, `claude update · <step>`, stepping Checking for updates… → Downloading 2.1.304… → Installing… → Finishing up…. On success: the installed version changes, the line "Updated from 2.1.302 to 2.1.304." appears, and the row re-checks ("Checking for updates…") then reads "Up to date" with no Update button. A polite announcement: "Claude updated to 2.1.304." Vendor commands: `claude update`, `codex update`, `agy update`, `grok update`.
- **UXJ-004 Update fails (VIS-006).** Red "Update failed. Version 2.1.302 is unchanged." and the vendor's own error in a monospace box; the status still says Update available; the button reads "Try again". Try again starts the updater again. Announcement: "Claude update failed."
- **UXJ-005 Blocked by agents (VIS-007).** The Update button stays but is disabled and described by the line "Update unavailable while 2 agents are running." (singular: "1 agent is running."). Clicking does nothing. When the count reaches zero the line disappears and Update works.
- **UXJ-006 Not installed (VIS-001, VIS-014).** Installed column "Not installed"; Updates column "Install instructions ↗" (opens the vendor's page in a new tab, `rel="noopener noreferrer"`); Account "–" (screen reader: "Not applicable"); no action button. After the user installs in a terminal, Check again picks it up.
- **UXJ-007 Browser sign-in (VIS-008).** Click Sign in. The button becomes "Signing in…" (disabled, spinner) and a line appears: "Finish signing in to Codex in your browser." with a Cancel text button. The runtime's own login opens the browser; when the runtime reports it is signed in, the row reads "Signed in" and the button disappears. Announcement: "Codex is signed in."
- **UXJ-008 Sign-in fails or is cancelled (VIS-009).** Cancel returns to Sign in. If the sign-in does not finish (vendor logins wait indefinitely, so the product needs a time-out), the line "Sign-in didn't finish. Try again." appears in red and the button reads "Try again". The row stays Not signed in.
- **UXJ-009 Antigravity terminal sign-in (VIS-010–VIS-012).** Click Sign in. The button becomes "Signing in…" and a terminal window opens under the row (title bar "Terminal" and Close) already running `agy`; its body takes keyboard focus and shows "Press Enter to sign in." with a blinking cursor. A two-step strip reads: ① Press Enter in the terminal (current) ② Finish signing in to Antigravity in your browser. Enter: the terminal says "Opening your browser…", step ① gets a check and step ② a spinner. When the runtime reports it is signed in: "Signed in." in the terminal, both steps checked, the row reads "Signed in", and the terminal closes after about 1.4 s. Close at any time returns to the Sign in button.
- **UXJ-010 Remote/Docker node (VIS-019).** The node line names the node ("Prototype Remote Node · Remote node") and a note reads "Status only. Update these runtimes on that node's computer." Statuses and sign-in states show; no Update, no Sign in, no sign-in hint. Install instructions still show for a missing runtime.
- Command-line fallback (Claude; VIS-013): "Not signed in" with the line "Sign in from its command line." and no button. The same line is shown for any runtime whose in-app sign-in is unavailable.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Agent Runtimes page | `/settings?section=agent-runtimes` (Settings menu → Agent Runtimes) | See runtime state; Update; Sign in | Card: header (title, description, node line, Checked + Check again), optional remote note, table | VIS-001–VIS-023 |
| UIS-002 | Sign-in terminal | inside the Antigravity row after Sign in | Press Enter, finish in the browser | Window: title bar, body, steps strip | VIS-010–VIS-012, VIS-021, VIS-023 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Page not shown | Open the page | Loading skeleton | Rows, each "Checking for updates…" | Each installed runtime checked on its own | Check again (disabled until done) |
| TR-002 | Checking | Check result | Status replaced | Up to date / Update available (version X) / Check failed | Installed version always kept | Update, Check again |
| TR-003 | Any | Check again | "Checking…", rows re-check | as TR-002 | Clears earlier update/failed message | — |
| TR-004 | Update available | Update | Updating…, bar, vendor command and step | Updated, then re-check | Vendor updater runs (production) | none on that row until it ends |
| TR-005 | Updating | Updater error | "Update failed…" + vendor message | Update failed | Version unchanged | Try again |
| TR-006 | Update available + agents | Agents finish | Reason line disappears | Update enabled | — | Update |
| TR-007 | Not signed in (button) | Sign in | Signing in…, waiting line + Cancel | Waiting | Runtime's own login starts | Cancel |
| TR-008 | Waiting | Runtime reports signed in | Row "Signed in" | Signed in | — | — |
| TR-009 | Waiting | Cancel / time-out | Back to Sign in / "Sign-in didn't finish. Try again." | Not signed in | — | Sign in / Try again |
| TR-010 | Not signed in (Antigravity) | Sign in | Terminal opens, focused | Press Enter | `agy` started in a terminal on the node | Enter, Close |
| TR-011 | Press Enter | Enter | "Opening your browser…", step 2 | Browser step | — | Close |
| TR-012 | Browser step | Runtime reports signed in | "Signed in.", both steps checked, row Signed in, terminal closes | Signed in | — | — |
| TR-013 | Page left | Return to page | Re-check | as TR-001 (no skeleton) | A running update/sign-in continues meanwhile | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Default (a desktop node) | Open | Rows as in VIS-001; versions illustrative | Check again, Update, Sign in, install link | — | VIS-001, VIS-002 |
| Loading | Open | Four grey skeleton rows | — | resolves | VIS-017 |
| Load error | Node unreadable | "Couldn't read the agent runtimes on this node." + Retry | Retry | Retry | VIS-018 |
| Checking | Open / Check again | "Checking for updates…" with spinner | — | resolves | VIS-003 |
| Up to date | Check ok | green "Up to date" | — | — | VIS-015 |
| Update available | Check ok | amber "Update available (version X)" | Update | — | VIS-001 |
| Check failed | Source unreachable | red "Check failed", note "Couldn't reach the update source. <Runtime> still works.", installed version kept | Check again | — | VIS-014, VIS-016 |
| Updating | Update | see UXJ-003 | none | — | VIS-004 |
| Updated | Updater ok | green "Updated from X to Y." then re-check | — | — | VIS-005 |
| Update failed | Updater error | see UXJ-004 | Try again | — | VIS-006 |
| Blocked by agents | Agents running | see UXJ-005 | none | wait | VIS-007 |
| Not installed | not found | "Not installed", "Install instructions ↗", Account "–" | link | install in terminal, Check again | VIS-001, VIS-014 |
| Signed in / Not signed in / unknown | runtime reports | "Signed in" (green dot) / "Not signed in" (amber dot) / "Sign-in unknown" (grey) | Sign in where supported | — | VIS-001, VIS-013, VIS-019 |
| Sign-in waiting / failed | Sign in | UXJ-007, UXJ-008 | Cancel / Try again | — | VIS-008, VIS-009 |
| Terminal sign-in | Antigravity Sign in | UXJ-009 | Enter, Close | — | VIS-010–VIS-012 |
| Command-line fallback | in-app sign-in unavailable | "Not signed in" + "Sign in from its command line." | — | sign in in a terminal, Check again | VIS-013, VIS-022 |
| Remote node | window bound to a remote/Docker node | node line + status-only note; no Update, no Sign in | Check again, install link | — | VIS-019 |
| zh-CN | locale | all copy localized | same | — | VIS-020, VIS-021 |
| Narrow (390 px) | viewport | stacked rows with labels | same | — | VIS-022, VIS-023 |

## Content, Labels, Validation, And Feedback

- Product voice and wording conventions to follow: short, plain, no vendor jargon; "runtime" (never "engine"); "Signed in" for account state; sentence case.
- Exact labels, headings, and action text (en):
  - Menu / title: `Agent Runtimes`. Description: `The agent runtimes AutoByteus uses on this node. They normally update themselves; use Update when one has not.`
  - Node line: `<Node name> · This computer` / `<Node name> · Remote node`. Remote note: `Status only. Update these runtimes on that node's computer.`
  - Columns: `Runtime`, `Installed`, `Updates`, `Account`. Buttons: `Check again` / `Checking…`, `Update` / `Updating…` / `Try again`, `Sign in` / `Signing in…` / `Try again`, `Cancel`, `Close`, `Retry`.
  - Checked: `Checked just now`, `Checked {n} min ago`.
  - Status: `Checking for updates…`, `Up to date`, `Update available (version {version})`, `Check failed`, `Couldn't reach the update source. {Runtime} still works.`, `Not installed`, `Install instructions` (screen reader adds "(opens in your browser)").
  - Update: `Update unavailable while 1 agent is running.` / `… while {n} agents are running.`; steps `Checking for updates…`, `Downloading {version}…`, `Installing…`, `Finishing up…`; `Updated from {from} to {to}.`; `Update failed. Version {version} is unchanged.` + the vendor's message verbatim.
  - Account: `Signed in`, `Not signed in`, `Sign-in unknown`, `Sign in from its command line.`; waiting `Finish signing in to {Runtime} in your browser.`; failure `Sign-in didn't finish. Try again.`
  - Terminal: title `Terminal`; text `$ agy`, `Press Enter to sign in.`, `Opening your browser…`, `Signed in.` (**illustrative**: the real `agy` screen was not observed); steps `Press Enter in the terminal`, `Finish signing in to {Runtime} in your browser`.
  - Load error: `Couldn't read the agent runtimes on this node.`
  - zh-CN: see `localization/messages/zh-CN/settings.ts` (`settings.aiRuntimes.*`; menu and title 智能体运行时).
- Empty, error, and recovery messages: above. There is no empty state (four fixed runtimes).

### Form And Input Validation

N/A — the page has no text inputs.

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 640 px (the product's `sm`) | Five-column table with a header row | — |
| Narrow | < 640 px (validated at 390 px) | Header actions stack under the text; each row stacks: name, labelled lines (Installed, Updates, Account), action; terminal keeps its window, steps stack | Same controls; no horizontal overflow |
| Node context | embedded (this computer) / remote or Docker | Remote shows the node line, the status-only note, no Update or Sign in | — |
| Locale | en, zh-CN | Same layout | — |

## Accessibility And Keyboard Behavior

- Accessibility target: the product's existing Settings behavior (keyboard operable, visible focus, names and states exposed).
- Focus order, focus movement, and focus return: natural DOM order (Check again, then each row's buttons and link). When the terminal opens, focus moves to its body so Enter goes straight to it; Close returns to the page flow (the Sign in button reappears).
- Keyboard interaction: Check again, Update, Sign in, Cancel, Close and the install link work with Enter/Space; Enter inside the terminal advances sign-in. A blocked Update is `aria-disabled` (focusable, announces its reason) and does nothing.
- Roles, names, states, and live announcements: the list is labelled "Agent runtimes on this node"; the column header row is hidden from assistive technology and each value carries its label (visible on narrow, screen-reader only on desktop); buttons are named with the runtime ("Update Claude", "Sign in Codex"); the progress bar has a name; the terminal is a read-only textbox named "<Runtime> sign-in terminal"; the sign-in steps mark the current step (`aria-current="step"`); a polite live region announces "Checked for updates.", "<Runtime> updated to <version>.", "<Runtime> update failed.", "<Runtime> is signed in."; failures use `role="alert"`; the checking status uses `role="status"`.
- Contrast of new or changed text and UI boundaries: uses the product's Tailwind gray/green/amber/red/blue 700 text on white; grey notes `text-gray-500`. Final contrast measurement is an implementation check (not measured in this reference).

## Motion And Transitions

- Motion for new or changed elements: spinners (`animate-spin`, 1 s linear), the indeterminate update bar and the terminal cursor (`animate-pulse`), the loading skeleton (`animate-pulse`); no other animation, no slide or fade.
- Durations and easing: Tailwind defaults; the reference timeline (below) is design-only.
- Reduced-motion behavior: unchanged — follows baseline (the product defines none for these utilities).

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Installed state and version of each runtime | Installed column | Synthetic values (Codex 0.163.0, Claude 2.1.302, Antigravity 1.4.3, Grok not installed; Grok 1.0.62 with scenario `runtimes_mac`) — **illustrative** | Detection per runtime (existing). Windows unchecked. |
| Latest version / update check | Updates column | Scripted per runtime, 0.65–1.5 s each, independent | Each vendor's own source (E-R20); each fails alone |
| Updater | Update | 4 scripted steps of 1.1 s; failure scenario | The vendor's own `update` command; vendor error verbatim; no percentage available |
| Running agents per runtime | Update blocked | Scripted; scenario `runtimes_agents_running` finishes at 12 s and 24 s | Real count of running agents on that runtime |
| Sign-in detection | Account column | Scripted | Per runtime (E-R21): Codex `account/read`; Claude `claude auth status --json`; Grok `grok models` ("You are not authenticated."; signed-in output not seen); Antigravity `agy models` ("Please sign in") |
| Browser sign-in (Codex, Grok; Claude if allowed) | Sign in | Scripted 5 s wait; failure scenario | The runtime's own login command; waits indefinitely, so Cancel and a time-out are required; Claude may ask for a pasted code |
| Antigravity terminal | Terminal window | Scripted text; Enter advances; 4 s browser step | A terminal on the node running `agy`; AutoByteus's existing Terminal is a Workspace right-side tab tied to a workspace folder, and Settings has none, so a node-level terminal is new work. Real `agy` screen text unknown. |
| Node context | Node line, status-only | Window bound to embedded or remote node (`autobyteus.prototype.context` = `electron_remote`) | The node's own runtimes; remote Update/Sign in out of scope (Q-3) |
| Install links | "Install instructions" | Illustrative URLs: Claude `https://code.claude.com/docs/en/setup`, Codex `https://github.com/openai/codex`, Antigravity `https://antigravity.google/`, Grok `https://docs.x.ai/build` | Exact vendor URLs to be confirmed in requirements |

Scenarios seed the starting state only (`localStorage['autobyteus.prototype.scenario']`, reload): default, `runtimes_mac`, `runtimes_all_current`, `runtimes_mixed`, `runtimes_agents_running`, `runtimes_update_fails`, `runtimes_signed_out`, `runtimes_sign_in_fails`, `runtimes_check_failed`, `runtimes_load_failed`. No overlay, toolbar or URL switch exists; every change is triggered through the page's own controls.

## Final Visual Reference Inventory

Images are in `visual-references/` (captured by `capture-references.mjs` after the user's approval; page clock paused, so deterministic). Together with this specification they define the exact approved appearance. Viewport 1440×760 unless stated. Unless noted, **versions, node name, command output and counts are illustrative fixture content**; everything else visible is requirements-defining.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001/006/007: default (one of each state) | 1440×760 | `visual-references/VIS-001-default-1440x760.png` | menu item, card, table, columns, status words and colors, Update and Sign in buttons, Not installed + link | version numbers, Embedded Node name |
| VIS-002 | UXJ-001: all four installed (Mac values) | 1440×760 | `visual-references/VIS-002-your-mac-all-installed-1440x760.png` | same layout; Grok signed in, no action | versions |
| VIS-003 | UXJ-001/002: runtimes resolving one by one | 1440×760 | `visual-references/VIS-003-checking-runtimes-resolve-one-by-one-1440x760.png` | per-row "Checking for updates…", header button "Checking…" | which rows are still checking |
| VIS-004 | UXJ-003: updating | 1440×760 | `visual-references/VIS-004-claude-updating-1440x760.png` | Updating… button, bar, `claude update · <step>` line | step shown, version |
| VIS-005 | UXJ-003: updated, re-checking | 1440×760 | `visual-references/VIS-005-claude-updated-rechecking-1440x760.png` | new version, "Updated from … to …." line, re-check | versions |
| VIS-006 | UXJ-004: update failed | 1440×760 | `visual-references/VIS-006-claude-update-failed-1440x760.png` | red message, vendor error box, Try again | the vendor error text |
| VIS-007 | UXJ-005: blocked by agents | 1440×760 | `visual-references/VIS-007-update-unavailable-agents-running-1440x760.png` | disabled Update, reason line | agent count |
| VIS-008 | UXJ-007: Codex signing in | 1440×760 | `visual-references/VIS-008-codex-signing-in-1440x760.png` | Signing in… button, waiting line, Cancel | — |
| VIS-009 | UXJ-008: sign-in did not finish | 1440×760 | `visual-references/VIS-009-codex-sign-in-failed-1440x760.png` | red line, Try again | — |
| VIS-010 | UXJ-009: terminal, press Enter | 1440×760 | `visual-references/VIS-010-antigravity-terminal-press-enter-1440x760.png` | terminal window, title bar, Close, steps strip with step 1 current | terminal text |
| VIS-011 | UXJ-009: browser step | 1440×760 | `visual-references/VIS-011-antigravity-terminal-finish-in-browser-1440x760.png` | step 1 checked, step 2 spinner, "Opening your browser…" | terminal text |
| VIS-012 | UXJ-009: signed in, closing | 1440×760 | `visual-references/VIS-012-antigravity-signed-in-terminal-closing-1440x760.png` | "Signed in." line, both steps checked, row Signed in | terminal text |
| VIS-013 | All signed out; Claude command-line fallback | 1440×760 | `visual-references/VIS-013-all-signed-out-claude-command-line-1440x760.png` | Sign in buttons on three rows, "Sign in from its command line." on Claude | which runtime has the fallback is a product decision (Q-2) |
| VIS-014 | Mixed: not installed, blocked, check failed, signed out | 1440×760 | `visual-references/VIS-014-mixed-not-installed-check-failed-blocked-1440x760.png` | each state's treatment, Check failed note | — |
| VIS-015 | All up to date | 1440×760 | `visual-references/VIS-015-all-up-to-date-1440x760.png` | no Update button | — |
| VIS-016 | All checks failed | 1440×760 | `visual-references/VIS-016-all-checks-failed-1440x760.png` | three Check failed rows with notes and kept versions | — |
| VIS-017 | Loading | 1440×760 | `visual-references/VIS-017-loading-1440x760.png` | four skeleton rows, header without actions | — |
| VIS-018 | Load error | 1440×760 | `visual-references/VIS-018-load-error-1440x760.png` | message and Retry | — |
| VIS-019 | UXJ-010: remote node | 1440×760 | `visual-references/VIS-019-remote-node-status-only-1440x760.png` | node line, status-only note, no Update or Sign in | node name, versions |
| VIS-020 | zh-CN default | 1440×760 | `visual-references/VIS-020-zh-CN-default-1440x760.png` | all copy in Chinese | translations may be refined |
| VIS-021 | zh-CN terminal | 1440×760 | `visual-references/VIS-021-zh-CN-terminal-1440x760.png` | localized terminal and steps | terminal text |
| VIS-022 | Narrow, mixed | 390×1500 (full page) | `visual-references/VIS-022-narrow-mixed-390x1500.png` | stacked rows with labels | — |
| VIS-023 | Narrow, terminal | 390×1500 (full page) | `visual-references/VIS-023-narrow-terminal-390x1500.png` | terminal and stacked steps fit | terminal text |

## Linked UI Reference Evidence

- Runnable UI reference: design repository root; `corepack pnpm dev --port 4701`; open `/settings?section=agent-runtimes`.
- Ticket record: `tickets/done/runtime-lifecycle-review/product-ticket.md`
- Run instructions: `ui-reference-runbook.md` (section runtime-lifecycle-review)
- Relevant supporting artifacts: `visual-references/final-validation.mjs` (RTM-001…RTM-020, 96 checks), `visual-references/capture-references.mjs`
- Relevant journey, transition, or scenario IDs: UXJ-001…UXJ-010, TR-001…TR-013, RTM-001…RTM-020, scenarios above
- Mocked boundaries and limitations: see Data, Contract, And Mock Boundaries. All data is synthetic and in memory; reload resets it.

## Implementation Fidelity Boundary

- Exact behavior and visible design implementation must preserve: the table layout and columns, status wording and colors, the single dark Update button, the visible reason when Update is blocked, independent per-runtime checks, evidence-only statuses, the failure and cancel paths, the sign-in line and Cancel, the terminal window and two-step strip, the remote status-only treatment, the copy above, keyboard and screen-reader behavior.
- UI reference state, fixtures, and simulated mechanisms that do not prescribe production architecture: the module-level timeline, timers, scenarios, scripted terminal text.
- Fixture content or visible details explicitly allowed to vary: version numbers, node names, agent counts, vendor error text, terminal text, install URLs (until confirmed).
- Permitted responsive or platform variation: none beyond the 640 px stacking above.
- Existing design-system constraints: Tailwind utility values of the Settings page; heroicons; the product's localization catalogs.

## Out Of Scope

- Installing runtimes (Q-1), remote or Docker Update and Sign in (Q-3), a Claude Sign in button until approved (Q-2), automatic updates, notifications outside this page, changing the model menu's "Unavailable" label or its runtime names, a node-level terminal implementation, Windows behavior.

## Open Decisions And Risks

- **Q-1 (Solution Designer to take to the user; recommended):** AutoByteus does not download or install runtimes. UI consequence: Not installed + link, no button.
- **Q-2 (Solution Designer to take to the user; E-R21):** which runtimes get a Sign in button. Designed as: Codex and Grok (browser), Antigravity (terminal running `agy`), Claude command line only. Needs: the user's acceptance of OpenAI's "open-source local app" condition for Codex; Anthropic's approval before a Claude button; xAI/Google terms unclear (Antigravity account-suspension reports are recorded as FU-001). A first version could ship with Not signed in + command-line text for every runtime; the per-runtime fallback is already designed.
- **Q-3 (Solution Designer to take to the user; recommended):** Update and Sign in only on the desktop's own node.
- **Requirement impacts for the Solution Designer:** (1) section renamed "AI Runtimes" → "Agent Runtimes" (the draft's terminology note); (2) the target feature now includes Sign in (REQ-005 is no longer status-only) and a sign-in time-out/Cancel; (3) "Sign-in unknown" stays only for a failed detection; (4) a node-level terminal is new engineering work; (5) the page uses the plain names Codex / Claude / Antigravity / Grok while the model menu says "Claude SDK" / "Grok Build" — whether to align them is open.
- Risks: vendor update sources and the Antigravity manifest are undocumented (R-02: each check fails alone); install URLs are guesses; Grok's signed-in output was not observed; real `agy` screen text unknown.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes` (revision in `product-ticket.md`)
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
