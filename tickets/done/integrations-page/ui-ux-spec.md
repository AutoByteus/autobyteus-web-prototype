# UI/UX Specification — Integrations page (integrations-page, autobyteus-337)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `integrations-page` (Project Task `autobyteus-337`)
- Related requirements revision ID: `SR-001` (DEC-007…DEC-010 added by the Solution Designer on 2026-10-31)
- Related requirement, behavior, acceptance-criteria, and decision IDs: REQ-001…REQ-004, REQ-007…REQ-010; BEH-001, BEH-002, BEH-004; AC-001, AC-002, AC-003, AC-005, AC-006; UC-001…UC-003; SCN-001, SCN-003; DEC-001, DEC-002 (open, marked below), DEC-007…DEC-010
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (during review): http://127.0.0.1:4940/integrations
- Explicit user-confirmation reference: the user, 2026-10-31, after four review rounds: "its much better now. approve" (revision 4, the compact card grid with the integration dialog)
- Final check date: 2026-10-31

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (worktree `/Users/normy/autobyteus_org/autobyteus-worktrees/integrations-page`, read only)
- Selected frontend application or product surface: `autobyteus-web`
- Pinned source commit or revision: `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` for the whole baseline, except Settings → Server Settings → Basics and the Settings left menu, which reflect `origin/personal@e4bebdc858` (scoped refresh `WEB-BASELINE-REFRESH-014`, integrated into `personal` at `345a439`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- UI reference revision or commit: recorded in `product-ticket.md` ("Integration Record")
- Ticket folder: `tickets/done/integrations-page/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md` (section "Scoped refresh WEB-BASELINE-REFRESH-014")

## Problem And Design Rationale

- User problem and intent: "Why does the user have to go to a server setting to do the GitHub thing? … Each integration should handle their own configuration." One card per integration; installing it installs its skill; the card asks for what it needs; then the user adds the skill to any agent, as today.
- Key UX decisions and why:
  1. **A grid of compact cards, one action each** (Install / Connect / Manage / Check for updates). It stays tidy with one card or many (Jira, SSH later) and works like the Skills page.
  2. **The integration's dialog holds the work**: Installed → Connect → Give agents access, plus the tools. The dialog is the product's own pattern (Manage Skill Sources), so the grid does not grow tall as cards are added.
  3. **Three steps, numbered, in the dialog**, so the path the user described (install, connect, add the skill to an agent) is visible before he starts and after he finishes.
  4. **Step 2 is a general "Connect" step** (DEC-010): only the GitHub token form is designed; the word "token" appears only inside that form (and in the status chip text the brief fixes).
  5. **No page title or subtitle**: the menu item names the page, as on Skills and Projects.
  6. **Integrations is the last menu item, after Nodes** (the user's choice).
  7. **Agent access is explained on the card** (the connected card line, step 3 of the dialog) with a "Go to Agents" button; there is no tick list.
- Alternatives considered and rejected: a Settings-style full-width card per integration (does not scale; the user's objection); expanding a card in place (pushes neighbours around, uneven rows); a form with an always-visible token field (hides the install → connect → access path); a page header with explanatory sentence (redundant).

## Scope And Experience Goal

- User or actor: the user of AutoByteus on a node.
- Context: the main menu → Integrations; Skills and Agents pages for the access step.
- Goal: discover, install, connect and check an integration on its own card; understand that agent access means adding its skill to an agent.
- Observable success: SCN-001 completes from the card: Install → Connect (token) → Test → Go to Agents.
- In-scope surfaces and journeys: the Integrations page and dialog; the main-menu item; Settings → Server Settings → Basics without the GitHub card; the Skills page and Skills → Sources listing the installed skill and source (consequences of Install).
- Non-goals: uninstall on the card (stays on the Skills page), sign-in flows, third-party integrations, installing tools, the agent edit form (unchanged).

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, AC-001, DEC-008, DEC-009 | Main-menu item **Integrations** (after Nodes); one card per integration (name, one-sentence description, optional icon), alphabetical by name, everything in the repository plus everything installed | UIS-001, UIS-002; UXJ-001; VIS-001, VIS-009, VIS-017 |
| REQ-002 | One chip per card: Not installed · Installed, needs a token · Connected as @login · Needs a newer AutoByteus | UIS-002; VIS-001, VIS-003, VIS-006, VIS-009 |
| REQ-003, AC-002 | Install on the card; then the dialog asks to connect and shows the integration's help text (links clickable); name clash error | TR-001, TR-002, TR-009; VIS-002, VIS-003, VIS-004, VIS-012 |
| REQ-004, AC-003 | Connect, Test, Replace token, Remove; the token is write-only and never shown again; a rejected token gives an error | TR-003…TR-006; VIS-004, VIS-005, VIS-007, VIS-008 |
| REQ-008, AC-006 | Tools the integration needs, each found or not found; no install action | UIS-003; VIS-010, VIS-011 |
| REQ-009, DEC-007 | Repository unreachable and nothing installed → message with Retry; unreachable with something installed → installed cards plus a note with Retry; reachable but empty → "No integrations are available yet." | UIS-004; VIS-013…VIS-016 |
| REQ-010, REQ-005/006 | The card says access comes from adding the integration's skill to an agent, with a way to the Agents page; no tick list | UIS-002, UIS-003 (step 3); VIS-006, VIS-007 |
| REQ-007, AC-005, BEH-001 | Server Settings → Basics has no GitHub card | UIS-005; VIS-019 |
| REQ-002 (DEC-001) | **Needs a newer AutoByteus** card: name, description, icon, the state, a link to Settings → Updates; no Install, no connect step. **Exists only if DEC-001 = (a) (the app decides where tokens go, recommended).** | UIS-002; VIS-009, VIS-017 |
| DEC-002 | The line "Agents set to use all installed skills do not get access automatically." states the recommended answer. **Remove it if the user decides Yes.** | UIS-003 step 3; VIS-004, VIS-007 |

## Visual Language

- Existing product language to preserve: Tailwind utilities of the Settings cards and the Skills grid; slate/gray neutrals; blue-600 primary buttons; rounded-lg controls; the Manage Skill Sources dialog frame; the Projects page's grid spacing.
- Layout structure and visual hierarchy: the page content is a centered column, `max-w-5xl` (64rem), padding `px-4 py-8 sm:px-6 lg:px-8`, on `bg-gray-50`, no header. Cards in a grid `grid-cols-1 gap-4 lg:grid-cols-2`. The state card (offline, empty) spans the column width. The dialog is centered over a `bg-slate-900/40` overlay.
- Grid, dimensions, spacing, and density:
  - Card: `rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`, flex column, equal height per row; header row gap-4; footer pinned to the bottom (`mt-auto pt-4`) with the chip left and the button right (wraps below 2 lines).
  - Icon tile: 44×44 (`h-11 w-11 rounded-xl border-slate-200 bg-slate-50`), icon 24×24; no icon → the first letter, `text-base font-semibold text-slate-500`.
  - Dialog: `max-w-[42rem]`, `max-h-[min(44rem,90vh)]`, `rounded-2xl bg-white shadow-xl`; header `px-6 py-5` with bottom border `slate-100`; body `px-6 py-5`, scrolls.
  - Steps: marker 28×28 (`h-7 w-7 rounded-full text-xs font-semibold`), gap-4 to the text, step spacing `pb-6`; the connector is a 1 px `slate-200` line from under a marker to the next one (not under step 3).
- Typography (the product's Inter stack): card name `text-lg font-semibold leading-7 text-gray-900`; dialog name `text-xl font-semibold leading-7`; description `text-sm text-gray-500` (not clamped); step title `text-sm font-semibold leading-7`; step text `text-sm text-gray-600`; small notes `text-xs text-gray-500`; skill names in `font-mono text-xs` on a `bg-slate-100 rounded px-1.5 py-0.5` chip; tool names `font-mono text-xs`.
- Color values and semantic roles: Not installed — chip `bg-slate-100 text-slate-600`, dot `slate-400`. Installed, needs a token — `bg-amber-50 text-amber-800 ring-1 ring-amber-200`, dot `amber-500`. Connected — `bg-green-50 text-green-700 ring-1 ring-green-200`, dot `green-500`. Needs a newer AutoByteus — `bg-slate-100 text-slate-600 ring-1 ring-slate-200` with the `heroicons:arrow-up-circle` icon. Errors `text-red-600`; success/test result `text-green-700`; missing tools `bg-amber-50 text-amber-800 ring-1 ring-amber-200` with `text-amber-600` icon. Step marker: done `bg-green-50 text-green-700 ring-1 ring-green-200` with a check; active `bg-blue-600 text-white`; upcoming `bg-slate-100 text-slate-500`; upcoming step text `text-gray-400`.
- Surfaces, borders, radii, shadows, elevation: see Grid above; overlay `z-40`.
- Controls, icons, imagery: primary button `h-9 px-4 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700`, disabled `bg-slate-200 text-slate-500`, with a 16 px spinner while busy; secondary `h-9 px-3 rounded-lg border-slate-300 bg-white text-gray-700 hover:bg-slate-50`; Remove `border-red-200 text-red-700 hover:bg-red-50`; token input `h-10 rounded-lg border-gray-300` with `focus:ring-2 focus:ring-blue-500` (password type); the dialog X is a 20 px `heroicons:x-mark` in a `p-2 rounded-lg` button. Menu icon `heroicons:puzzle-piece` (outline, as the other menu icons). The GitHub mark is the integration's `icon.svg` (illustrative in the reference).
- Hover, active, focus, selected, disabled, validation, and feedback treatment: every control has a visible `focus-visible:ring-2` (blue-500; red-400 on Remove; amber-500 on the notice's Retry). Connect is disabled until the field has text; all actions of a card are disabled while one runs. Feedback is inline in the step that caused it: errors `text-red-600`, Test result `text-green-700`. Install and Connect success are shown by the state change itself, with no separate message.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Integrations menu item | Opens the page | default, active (`bg-gray-100 text-gray-900`); last item, after Nodes | `composables/useShellPrimaryNavigation.ts` |
| Left panel menu section height | The menu section follows its content until the user drags the divider, so the last items are never cut off | — | `composables/useAppLeftPanelSectionResize.ts` |
| Integration card (tile) | One integration in the grid | not installed, installing, installed needs a token, connected, needs a newer AutoByteus; tool missing line; install error | `components/integrations/IntegrationTile.vue` |
| Status chip, icon tile | State and identity | the four states; icon or letter | `IntegrationStatusChip.vue`, `IntegrationIcon.vue` |
| Integration dialog | The steps and tools of one integration | opens from Connect and Manage | `IntegrationDialog.vue`, `IntegrationDetail.vue`, `IntegrationStepMarker.vue` |
| Page states | repository unreachable (nothing installed), notice (something installed), empty | — | `pages/integrations.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User, main menu | Integrations opened, GitHub Not installed | Set up GitHub | Connected as @login; user at Agents | REQ-001…004, REQ-010; AC-001…003; SCN-001 |
| UXJ-002 | User, connected card | Connected | Check, replace or remove the token | Connected (re-checked or replaced) or Installed, needs a token | REQ-004; AC-003; SCN-003 |
| UXJ-003 | User, tool missing | GitHub shows `jq` not found | Understand what is missing | Tool installed outside the app; Check again | REQ-008; AC-006 |
| UXJ-004 | User, repository unreachable | Nothing installed (or something installed) | Retry | Cards appear, or the message stays | REQ-009; DEC-007 |

## Journey Details

**UXJ-001.** (1) Menu → Integrations: the page shows the cards (VIS-001). (2) Install on the card: the button becomes a spinner with "Installing…" for about 2 s (VIS-002), then the chip reads **Installed, needs a token** and the button reads **Connect** (VIS-003); the skill is now listed on Skills and the source under Skills → Sources. (3) Connect opens the dialog on step 2 with the integration's help text (a web address in it is a link that opens in a new tab) and the token field (VIS-004). (4) Paste a token → Connect: the button reads "Checking…" for about 1 s; a rejected token shows "GitHub rejected the token." under the field and keeps the field (VIS-005); an accepted token turns step 2 into "Connected to GitHub", the chip into **Connected as @alex-dev** and activates step 3 (VIS-007). (5) Go to Agents opens the Agents page (the agent's Skills field then lists the new skill). Failure: a name clash on Install shows the red message on the card and the button returns (VIS-012).

**UXJ-002.** Manage opens the dialog (VIS-007). Test → "Testing…" → "The token works: @alex-dev." in green; if GitHub refuses the stored token: "GitHub rejected the stored token. Replace it or remove it." in red (VIS-008). Replace token reveals the field with Connect and Cancel (Cancel hides it and clears it). Remove (no confirmation) → "GitHub token removed.", step 2 returns to the token form and the chip to Installed, needs a token.

**UXJ-003.** A missing tool shows an amber pill "jq not found" and, on the card, one amber line "jq not found on this node." (VIS-010); in the dialog an amber sentence "jq was not found on this node. AutoByteus does not install tools: install it yourself, then check again." with **Check again** (VIS-011). There is no install action.

**UXJ-004.** See State Behavior (VIS-013…VIS-016).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Integrations page | `/integrations` (menu item Integrations) | List the integrations; one action per card | Card grid, no header | VIS-001, VIS-009, VIS-017 |
| UIS-002 | Integration card | grid | State and the next action | icon, name, description; optional amber tool line; connected: access line; footer chip + button | VIS-001, VIS-003, VIS-006, VIS-009, VIS-010, VIS-012 |
| UIS-003 | Integration dialog | Connect / Manage | Install status, connect, access, tools | header (icon, name, description, X); chip; three steps; tools row | VIS-004, VIS-005, VIS-007, VIS-008, VIS-011, VIS-018 |
| UIS-004 | Repository states | `/integrations` | Unreachable / notice / empty | centered card; notice bar above the grid | VIS-013…VIS-016 |
| UIS-005 | Server Settings → Basics | `/settings?section=server-settings&mode=quick` | Unchanged except the GitHub card is gone | after Web Search Configuration comes Compaction configuration | VIS-019 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Card, Not installed | Install | Spinner, "Installing…", card actions disabled | Installed, needs a token; button Connect | The integration's skill is added to the skill catalog; the official repository appears in Skills → Sources | Connect |
| TR-002 | Card, Installed, needs a token | Connect | Dialog opens, focus on the dialog | Dialog on step 2 | — | token field, X |
| TR-003 | Dialog, step 2 | Connect (token) or Enter | "Checking…", field and buttons disabled | Connected as @login, step 3 active | Token checked with the service, then stored; never shown again; field cleared | Test, Replace token, Remove, Go to Agents |
| TR-004 | Dialog, connected | Test | "Testing…" | Connected (green result) | Token checked again | all |
| TR-005 | Dialog, connected | Replace token | Field appears | Replacing | — | Connect, Cancel |
| TR-006 | Dialog, connected | Remove | "Removing…" | Installed, needs a token; "GitHub token removed." | Token deleted from the vault | token form |
| TR-007 | Dialog | Esc, X, or a click outside | Dialog closes | Page | — | — |
| TR-008 | Card, connected | Go to Agents (dialog step 3) | Navigates | `/agents?view=list` | — | add the skill to an agent |
| TR-009 | Card, Not installed | Install fails (name clash) | Red message on the card | Not installed | Nothing installed | Install |
| TR-010 | Page | Retry (unreachable) | Button "Checking…" | Cards appear, or the message remains with "Still can't reach …" | Repository read again | Retry |
| TR-011 | Dialog | Check again (missing tool) | "Checking…" about 0.7 s | Tool list refreshed | Tools re-checked | — |
| TR-012 | Card, Needs a newer AutoByteus | Check for updates | Navigates | Settings → Updates | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Page, default (one card) | Open `/integrations` | One card "GitHub", chip "Not installed", button Install | Install | — | VIS-001 |
| Card, installing | Install | Button "Installing…" with spinner, disabled | — | wait | VIS-002 |
| Card, installed | Install done | Chip "Installed, needs a token"; button "Connect" | Connect | — | VIS-003 |
| Dialog, connect step | Connect | Help text with a link, "GitHub token" field, hint "The token is checked with GitHub before it is saved. It is stored on this node and never shown again.", steps 1 done, 2 active, 3 upcoming | Connect, X | — | VIS-004 |
| Dialog, token rejected | Bad token | "GitHub rejected the token." (red, under the field) | retry, X | edit the field | VIS-005 |
| Card, connected | Connected | Chip "Connected as @alex-dev"; line "Add github-integration to an agent to give it access."; button Manage | Manage | — | VIS-006 |
| Dialog, connected | Manage | Step 2 "Connected to GitHub": "What AutoByteus needs is stored on this node and is never shown again. Connected since <date>."; Test / Replace token / Remove; step 3 active with Go to Agents | all | — | VIS-007 |
| Dialog, test refused | Test | "GitHub rejected the stored token. Replace it or remove it." | Replace token, Remove | — | VIS-008 |
| Page, several cards | more than one integration | Alphabetical, equal-height rows; a card the app cannot deliver shows "Needs a newer AutoByteus" with Check for updates | per card | — | VIS-009, VIS-017 |
| Card / dialog, tool missing | a tool not found | See UXJ-003 | Check again | install the tool | VIS-010, VIS-011 |
| Card, install error | name clash | "Could not install GitHub. A skill named “github-integration” already exists in another skill source. Remove or rename it on the Skills page, then try again." | Install | fix on Skills | VIS-012 |
| Page, unreachable, nothing installed | repository unreachable | Centered card: "Can't reach the integrations repository" / "AutoByteus could not load the list of integrations from github.com/AutoByteus/autobyteus-integrations. Check your internet connection, then try again." + Retry | Retry | Retry | VIS-013 |
| Page, still unreachable | Retry fails | The same plus red "Still can't reach github.com/AutoByteus/autobyteus-integrations." | Retry | — | VIS-014 |
| Page, unreachable, something installed | repository unreachable | Amber notice above the cards: "Couldn't check github.com/AutoByteus/autobyteus-integrations for new integrations. Showing the integrations you have installed." + Retry; installed cards shown | Retry, cards | Retry | VIS-015 |
| Page, empty | reachable, no valid integration | Card: puzzle-piece icon in a grey circle, "No integrations are available yet." | — | — | VIS-016 |
| Page, loading | first read | Spinner and "Loading integrations…" | — | — | not captured (transient) |

## Content, Labels, Validation, And Feedback

- Product voice: short sentences, sentence case, "node" for the machine, the product's existing GitHub-card wording where it still applies.
- Exact labels: menu **Integrations**; chip texts as above; buttons **Install**, **Installing…**, **Connect**, **Checking…**, **Manage**, **Test**, **Testing…**, **Replace token**, **Cancel**, **Remove**, **Removing…**, **Go to Agents**, **Check for updates**, **Retry**, **Check again**; step titles **Install** / **Installed**, **Connect {name}** / **Connected to {name}**, **Give agents access**; tools heading **Tools on this node**; step texts: "Adds the {skill} skill.", "The {skill} skill is in your skills.", "Connect your {name} account. AutoByteus keeps what it needs on this node.", "Add the {skill} skill to an agent's Skills.", "Agents set to use all installed skills do not get access automatically.". All strings, with their zh-CN translations, are in `localization/messages/{en,zh-CN}/integrations.ts` (and `shell.navigation.integrations`).
- Help text: the integration's own text (`token.help` in production). A web address in it becomes a link (new tab, `rel="noopener noreferrer"`); nothing else is interpreted.
- Empty, error, recovery messages: see State Behavior.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| {Service} token | password, no autocomplete, no spellcheck | yes | Non-empty (Connect disabled when empty); the service accepts it | Connect or Enter | rejected: "{name} rejected the token."; could not check: "The token could not be checked with {name}. Try again."; other: "Failed to save the {name} token." |
| Test | button | — | stored token still accepted | click | "{name} rejected the stored token. Replace it or remove it."; other: "Failed to test the {name} token." |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 1024 px content width (`lg`) | Two card columns | — |
| Narrow | below `lg` (checked at 390 px, with the app's icon-only menu) | One column; footer chip and button wrap onto two lines if needed; the dialog is `w-full` with 16 px margin and scrolls | The tool pills wrap under the heading |

## Accessibility And Keyboard Behavior

- Target: the product's existing level (labelled controls, visible focus, keyboard operable).
- Focus: opening the dialog focuses the dialog; Esc closes it. Focus return to the opening button is **not** implemented in the reference; engineering should return focus to the Connect or Manage button on close.
- Keyboard: all controls are buttons, links or inputs in reading order; Enter in the token field connects.
- Roles and names: cards are `article` labelled by their name; the grid is a `list`; the dialog is `role="dialog" aria-modal="true"` labelled by its title; step markers are decorative (`aria-hidden`); a status/result message is `role="status"`; the tool check icons are decorative and the tool pill text ("not found") carries the meaning.
- Contrast: chip and note colors use the product's slate/amber/green text on tinted backgrounds as listed; upcoming step text `gray-400` is intentionally low-emphasis and is not the only carrier of the step's meaning.

## Motion And Transitions

- Spinners (`animate-spin`) on Install, Connect, Retry; no other motion; the dialog appears without animation. Durations of the reference are scripted waits (Install 1.8 s, Connect 1.2 s, Test 0.9 s, Remove 0.5 s, Retry 1.2 s, page load 0.7 s): illustrative, not requirements. Reduced motion: none to reduce.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| The official repository's integrations (name, description, `icon.svg`, `token.help`, prerequisites) | cards and dialog text | Invented text in `prototype/integrations/integrationsDesignFixture.ts`; GitHub, plus Jira and SSH as examples in `integrations_several` | Read from each integration's `integration.json` and icon; Jira and SSH here are illustrative |
| Install | TR-001 | Scripted; adds the skill to the Skills page and the source to Skills → Sources | Install the official repository as a skill source (DEC-003) |
| Token check, Test, Remove | TR-003…TR-006 | Token containing `bad`, `reject` or `revoked` is rejected; `offline` cannot be checked; anything else connects as `@alex-dev` | Checked with the service; vault storage; unchanged from the current GitHub card |
| Tools found | UIS-003 | Scripted per scenario (`jq` missing) | `command -v` on the node |
| Repository reachability | UIS-004 | Scenarios `integrations_offline`, `integrations_offline_installed`, `integrations_empty` | The real read and its rate limit (UNK-001) |
| Menu section height | menu | Follows content until the user drags the divider | Same behavior required, so the last items are never hidden; an existing user's stored height is **not** corrected in the reference |
| State | all | In memory; a reload resets it | — |

## Final Visual Reference Inventory

All at `visual-references/` in this ticket folder. Viewport 1440×900 unless stated. Every visible detail is requirements-defining except the illustrative items in the last column.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UIS-001/002 default, GitHub Not installed | 1440×900 | `visual-references/VIS-001-integrations-default-not-installed-desktop-1440x900.png` | menu with Integrations after Nodes, card layout, chip, Install | GitHub's description; menu data |
| VIS-002 | Card installing | 1440×900 | `VIS-002-installing-desktop-1440x900.png` | spinner, "Installing…", disabled | — |
| VIS-003 | Card Installed, needs a token | 1440×900 | `VIS-003-installed-needs-a-token-card-desktop-1440x900.png` | amber chip, Connect | — |
| VIS-004 | Dialog, connect step | 1440×900 | `VIS-004-dialog-connect-step-token-form-desktop-1440x900.png` | dialog frame, steps, link, field, hint, tools | the help text and link |
| VIS-005 | Dialog, token rejected | 1440×900 | `VIS-005-dialog-token-rejected-desktop-1440x900.png` | red message under the field | — |
| VIS-006 | Card connected | 1440×900 | `VIS-006-connected-card-desktop-1440x900.png` | green chip, access line, Manage | `@alex-dev` |
| VIS-007 | Dialog, connected | 1440×900 | `VIS-007-dialog-connected-manage-desktop-1440x900.png` | steps 1–2 done, step 3 active, Test / Replace token / Remove, Go to Agents | `@alex-dev`, the date |
| VIS-008 | Dialog, Test refused | 1440×900 | `VIS-008-dialog-test-refused-desktop-1440x900.png` | red message | — |
| VIS-009 | Several cards | 1440×900 | `VIS-009-several-cards-desktop-1440x900.png` | grid, equal-height rows, the three card kinds, letter tile | Jira and SSH cards (invented) |
| VIS-010 | Card, tool missing | 1440×900 | `VIS-010-tool-missing-card-desktop-1440x900.png` | amber line | — |
| VIS-011 | Dialog, tool missing | 1440×900 | `VIS-011-dialog-tool-missing-desktop-1440x900.png` | amber pill, sentence, Check again | — |
| VIS-012 | Card, install error | 1440×900 | `VIS-012-install-name-clash-desktop-1440x900.png` | red message | exact importer wording (the importer's error is shown in production) |
| VIS-013 | Unreachable, nothing installed | 1440×900 | `VIS-013-repository-unreachable-nothing-installed-desktop-1440x900.png` | message, Retry | — |
| VIS-014 | Still unreachable after Retry | 1440×900 | `VIS-014-repository-still-unreachable-after-retry-desktop-1440x900.png` | red line | — |
| VIS-015 | Unreachable, installed shown | 1440×900 | `VIS-015-repository-unreachable-installed-shown-desktop-1440x900.png` | notice with Retry above the card | — |
| VIS-016 | Empty repository | 1440×900 | `VIS-016-empty-repository-desktop-1440x900.png` | icon, text | — |
| VIS-017 | Several cards, narrow | 390×844 | `VIS-017-several-cards-narrow-390x844.png` | one column, wrapping footers | as VIS-009 |
| VIS-018 | Dialog connected, narrow | 390×844 | `VIS-018-dialog-connected-narrow-390x844.png` | full-width dialog; the tools row is below the fold and the dialog body scrolls | as VIS-007 |
| VIS-019 | Server Settings → Basics, scrolled | 1440×900 | `VIS-019-server-settings-basics-no-github-card-desktop-1440x900.png` | Web Search Configuration followed directly by Compaction configuration; Settings menu without icons (baseline) | all other cards are unchanged baseline content, including the validation example |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root; `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4940`; entry http://127.0.0.1:4940/integrations
- Ticket record: `product-ticket.md`; review notes: `design-review-notes.md`
- Starting states: `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` then reload: `integrations_connected`, `integrations_several`, `integrations_tool_missing`, `integrations_install_clash`, `integrations_token_revoked`, `integrations_offline`, `integrations_offline_installed`, `integrations_empty`; default = one GitHub card, Not installed.
- Journey and transition IDs: UXJ-001…004, TR-001…012.
- Mocked boundaries and limitations: see above.

## Implementation Fidelity Boundary

- Must preserve: the grid and card anatomy, one action per state, the dialog with three steps and the tools row, the states and exact copy, the menu position (last, after Nodes), the menu section following its content, no page header, no GitHub card in Server Settings → Basics.
- Does not prescribe: the reference's store, fixture, timings, or scripted token rules.
- Allowed to vary: illustrative content listed above; the date format (the user's locale); timing of spinners.
- Existing design-system constraints: the product's Tailwind tokens and dialog pattern.

## Out Of Scope

- Uninstall on the card; sign-in flows; third-party integrations; installing tools; other kinds of connect step (site address, email, key) — only the GitHub token form is designed (DEC-010); a card state for an installed integration that left the repository (it looks like any installed card).

## Open Decisions And Risks

- **DEC-001** (user): the "Needs a newer AutoByteus" state and its link exist only if the app decides where tokens go. If the manifest decides, delete that state.
- **DEC-002** (user): delete the line "Agents set to use all installed skills do not get access automatically." if agents with "all installed skills" should get access.
- The status chip text "Installed, needs a token" is the brief's wording; if other integrations will not ask for a token, a neutral text (for example "Installed, needs connecting") is better. For the Solution Designer.
- Existing users with a stored menu height smaller than the new menu can still have the last item scrolled out of view; engineering decides whether to raise it.
- The page makes at most a few unauthenticated GitHub requests (QR-002); the Retry and unreachable states depend on it.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (the loading state is transient and is not captured)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
