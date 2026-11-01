# UI/UX Specification — Integrations page, import from a link or a folder (integrations-page-r2, autobyteus-337)

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `integrations-page-r2`, revision 2 of package `integrations-page` (Project Task `autobyteus-337`). It supersedes the first approved design (`tickets/done/integrations-page/ui-ux-spec.md`, approved 2026-10-31) except where this spec says "Unchanged".
- Related requirements revision ID: `SR-006` (SR-005 and the user's change of 2026-11-01); requirement and decision IDs: REQ-001, REQ-002, REQ-003, REQ-004, REQ-008, REQ-009, REQ-010; DEC-001, DEC-002 (decided Yes), DEC-010…DEC-015; UC-001…UC-004; SCN-001, SCN-003
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`)
- Review URL (during review): http://127.0.0.1:4950/integrations
- Explicit user-confirmation reference: the user, 2026-11-01, after reviewing the build in two rounds: round 1 asked that Import also takes a local folder ("we should support both, support both local and also GitHub"); then, on the revised build: **"If you think the UI is consistent, now I would say I'm fine with the UI."** The approval was conditional on the designer's consistency check. That check was done on 2026-11-01 and found one gap, fixed before the final captures (Skills → Manage Skill Sources did not list the imported sources and removing one there did not remove its card; now it does, VIS-029). The user did not answer the two small questions put to him (keep the "Integration" label on the Skills page; the name "Manage sources"); the build he approved has both, so both are as approved.
- Final check date: 2026-11-01

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo` (worktree `/Users/normy/autobyteus_org/autobyteus-worktrees/integrations-page`, read only)
- Selected frontend application or product surface: `autobyteus-web`
- Pinned source commit or revision: unchanged from the first design: `d74f75a51ab7dc47d42a13f33e0f943c3a230ad7` for the baseline, except Settings → Server Settings → Basics and the Settings left menu (`origin/personal@e4bebdc858`). No baseline request: the revision touches only design-only surfaces (the Integrations page and its dialogs) and one design-only mark on the Skills card.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`; accepted design base `1988a5031b144c7f7ec9def7187d79dcd1562d42`
- UI reference revision or commit: recorded in `product-ticket.md` ("Integration Record")
- Ticket folder: `tickets/done/integrations-page-r2/`
- Baseline report path: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`

## Problem And Design Rationale

- User problem and intent: the first design put a built-in GitHub link into the product. The user: "I think it should be down to the user how they want to. When they want to import … here you can import from this link, and then click Import … it's like how we import agent package." Then: also a local folder, for integrations a user develops, "just like skills and agent packages".
- Key UX decisions and why:
  1. **One Import field for a link or a folder**, as the Skills source dialog and Agent Packages already do. No tabs or switch: a web address is a repository, anything else a folder. The hint under the field follows what is typed.
  2. **Import and Manage sources are page-level buttons, top right**, as on the Skills page toolbar. The cards stay one action each.
  3. **The page action is "Manage sources", not "Manage"**: a connected card has its own **Manage** button, and two buttons with one name in the same view would confuse. Skills uses "Sources" for the same kind of dialog.
  4. **A card exists only for an imported integration.** No built-in repository, no "Not installed" card, no Install. The empty state invites Import with one button (the toolbar is hidden while empty, so there is one Import button).
  5. **Cards are read locally.** No unreachable-repository states on the page; GitHub matters only inside Import and Update.
  6. **Import closes its dialog on success and the page says what happened** (a green notice that names the integrations and the source), so the user lands on the new cards.
  7. **Remove takes away the source, its skills and the connections of its integrations** (DEC-015); a local folder's files are never deleted (DEC-014); a folder has no Update.
  8. **The Skills page marks an integration's skill** with a small "Integration" label that links to its card (the user kept the skills visible and readable: "we should still show it there because some users need to read"). The label is the designer's answer to the confusion he felt.
- Alternatives considered and rejected: a separate Import page or a segmented "GitHub | Folder" control (heavier than the product's one-field pattern); keeping the dialog open after Import like the Skills dialog (the result is on the page behind it); hiding integration skills on the Skills page (the user decided to keep them); a "Manage" button name shared with the card button.

## Scope And Experience Goal

- User or actor: the user of AutoByteus on a node.
- Context: main menu → Integrations; Skills and Agents pages for the access step.
- Goal: bring integrations onto the page from a GitHub repository or a folder, connect them, keep their sources up to date or remove them.
- Observable success: SCN-001 from an empty page: Import → Connect (token) → Test → Go to Agents.
- In-scope surfaces and journeys: the Integrations page, its three dialogs and two confirmations; the Skills page card (label) and Manage Skill Sources (lists the imported sources); the main-menu item.
- Non-goals: sign-in flows, third-party integrations beyond the examples, installing tools, installing a single integration out of a source, the agent edit form.

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| REQ-001, DEC-008, DEC-011 | Menu item **Integrations** after Nodes; one card per imported integration (also from a source imported on the Skills page), alphabetical; no built-in repository | UIS-001, UIS-002; VIS-016, VIS-019 |
| REQ-002 | One chip per card: **Installed, needs a token** · **Connected as @login** · **Needs a newer AutoByteus**; no "Not installed" | UIS-002; VIS-013, VIS-016, VIS-019 |
| REQ-003, DEC-012 | **Import**: one field, "GitHub repository link or folder path", Browse… where the native picker exists; refusals and errors shown | UIS-003; TR-001…TR-004; VIS-002…VIS-012 |
| REQ-003, DEC-014, DEC-015 | **Manage sources**: imported sources with integrations; GitHub: Update, Remove; folder: Remove only; Remove says the connection goes too | UIS-004, UIS-005; TR-005…TR-009; VIS-022…VIS-027 |
| REQ-004, AC-003 | Connect, Test, Replace token, Remove token (unchanged behavior) | UIS-006; TR-010…TR-013; VIS-014, VIS-015, VIS-017, VIS-018 |
| REQ-008, AC-006 | Tools row, found / not found; no install action (unchanged) | UIS-006; VIS-020, VIS-021 |
| REQ-009 | Empty state invites Import; no unreachable states on cards; Import and Update report GitHub unreachable with the reason | UIS-001, UIS-003, UIS-004; VIS-001, VIS-009, VIS-025 |
| REQ-010, DEC-002 | Access follows the skill; the card says "Add github-integration to an agent"; the "all installed skills" line is removed | UIS-002, UIS-006 (step 3); VIS-016, VIS-017 |
| DEC-013 | The import surface tells the user to import only repositories they trust | UIS-003; VIS-003 |
| (Skills page question, user 2026-11-01) | Small "Integration" label on the skill, linking to its card | UIS-007; TR-014; VIS-028, VIS-030 |
| REQ-007 | Server Settings → Basics has no GitHub card | Unchanged: first design's VIS-019 stays normative |

## Visual Language

Unchanged from the first design (`tickets/done/integrations-page/ui-ux-spec.md`, Visual Language): the Tailwind slate/gray neutrals, blue-600 primary, rounded-lg controls, card grid, card anatomy, dialog frame, step markers, status chip colors, token form. This section records only what is new or changed.

- Page layout: the `max-w-5xl` centered column and `bg-gray-50` stay. Above the grid, when at least one integration is imported, a **toolbar** `mb-4 flex flex-wrap items-center justify-end gap-3` holds **Manage sources** (secondary: `h-9 px-4 rounded-lg border border-slate-300 bg-white text-gray-700 hover:bg-slate-50`, `heroicons:cog-6-tooth` 16 px, gap-2) then **Import** (primary: `h-9 px-4 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700`, `heroicons:plus` 16 px, gap-2). While nothing is imported the toolbar is not shown.
- Notice (after Import, or after the last source is removed): `mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900`, a 16 px `heroicons:check-circle-20-solid` `text-emerald-500` at the start, a dismiss button (`heroicons:x-mark` 16 px, `rounded-md p-1 text-emerald-700 hover:bg-emerald-100`) at the end, `role="status"`. Placed between the toolbar and the grid. It stays until dismissed or reload.
- Empty state: `rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm`; a 48 px grey circle (`bg-slate-100 text-slate-500`) with `heroicons:puzzle-piece` 24 px; title `text-lg font-semibold text-gray-900`; body `max-w-md text-sm text-gray-500`; one primary Import button (`mt-5`, as in the toolbar).
- Card: unchanged, plus `id="integration-<id>"`, `tabindex="-1"` and a focus ring `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` (offset color `gray-50`) so a card reached from the Skills label is visibly focused.
- **Import dialog** (`IntegrationImportDialog.vue`): the first design's dialog frame (`max-w-[42rem]`, `max-h-[min(44rem,90vh)]`, `rounded-2xl bg-white shadow-xl`, overlay `bg-slate-900/40`, `z-40`). Header `border-b border-slate-100 py-4 pl-6 pr-4` with the title `text-lg font-semibold text-slate-900` and a 32 px X button (`rounded-md text-slate-400 hover:bg-slate-100`). Body `px-6 py-5`: label `text-sm font-medium text-slate-700` (mb-2); a row of input + optional **Browse…** (secondary, `h-10 px-4`) + **Import** (primary, `h-10 px-4`, spinner 16 px while busy); input `h-10 rounded-lg border-slate-300 px-3 font-mono text-[13px]`, placeholder in the sans face `text-slate-400`, `focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`; below 640 px the input takes its own row and Import spans the width. Error bar under the row: `mt-3 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] leading-5 text-red-800` with `heroicons:exclamation-circle-20-solid` 16 px `text-red-500`, `role="alert"`. Hint `mt-3 text-xs leading-5 text-slate-500`; for a repository link the hint carries a 16 px `heroicons:shield-exclamation` `text-amber-500` and the trust text. Footer `border-t border-slate-100 bg-slate-50 px-6 py-3`, right-aligned **Cancel** (secondary `h-9 px-4`).
- **Manage sources dialog** (`IntegrationSourcesDialog.vue`): the same frame. Header as above (title "Manage sources"). Intro `px-6 pb-1 pt-4 text-sm text-slate-500`. A divided list (`divide-y divide-slate-100 py-1`); each row `px-6 py-3`, a grid of: a 32 px icon tile (`rounded-lg bg-slate-100 text-slate-600`, `mdi:github` or `heroicons:folder`, 18 px), the source name (`text-sm font-medium leading-5 text-slate-900`, truncated), the count ("1 integration" / "N integrations", `text-[13px] tabular-nums text-slate-700`, right aligned), a 32 px trash icon button (`text-slate-400 hover:bg-red-50 hover:text-red-600`, label "Remove <name>"); under the name the repository link or folder path in `font-mono text-[11.5px] leading-[18px] text-slate-500` (truncated); under that the status line `text-xs`: for a repository a 6 px dot + "Up to date" (dot `emerald-500`, text `slate-600`) or "Update available" (dot `amber-500`, text `amber-700`) with the **Update** chip (`h-6 rounded-md border border-blue-200 bg-blue-50 px-2 text-xs font-medium text-blue-700 hover:bg-blue-100`); for a folder the plain text "Local folder" `text-slate-600`. A busy row shows a 12 px spinner and "Updating…" / "Removing…". Result bar (success `border-emerald-200 bg-emerald-50 text-emerald-900`, error as the import error bar) in its own band `border-t border-slate-100 px-6 py-3` above the footer, which holds **Done**. Below 640 px the count moves to the status line, the row padding is `px-4`.
- Confirmations: the product's `ConfirmationModal` (danger variant, `z-50`) for Remove, and the product's "Update entire skill source?" confirmation (`SkillSourceUpdateConfirmation`) for Update, unchanged components; the source card inside the Remove confirmation repeats the icon, name and link or path.
- Skills page label: on the skill card, right of the name, `inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600` (hover `bg-slate-200 text-slate-800`), `heroicons:puzzle-piece` 14 px and the text "Integration"; it sits in the card header beside the existing "Disabled" badge (gap 6 px).
- Hover, focus, disabled, validation, feedback: every new control has the visible `focus-visible:ring-2` (blue-500); while an Import runs the field and buttons are disabled; Import is disabled when the field is empty; Update and Remove are disabled while any source operation runs.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Integrations page | Toolbar, notice, empty state, grid, dialogs | empty; one or more cards; notice | `pages/integrations.vue` |
| Import dialog | Import a link or a folder | empty, link typed, folder typed, importing, six errors | `components/integrations/IntegrationImportDialog.vue` |
| Manage sources dialog | List, update, remove sources | repository row (up to date, update available, busy), folder row, result bar | `components/integrations/IntegrationSourcesDialog.vue` |
| Integration card | Changed: no Install, no Not-installed state | needs a token, connected, needs a newer AutoByteus, tool missing line, focus ring | `IntegrationTile.vue`, `IntegrationStatusChip.vue` |
| Integration dialog | Changed: step 1 is "Imported" with the source; the "all installed skills" line is gone | needs a token, connected | `IntegrationDetail.vue`, `IntegrationDialog.vue` |
| Skill card label | Marks an integration's skill; links to its card | shown only for an imported integration's skill | `components/skills/SkillCard.vue` |
| Skills → Manage Skill Sources | Lists the imported sources; removing one removes its card | — | `utils/apolloClient.ts`, `prototype/integrations/integrationsDesignFixture.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related Behavior / Requirement / AC IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | User, main menu | Nothing imported | Import GitHub from a link and set it up | Connected as @login; user at Agents | REQ-001…004, REQ-009, REQ-010; SCN-001 |
| UXJ-002 | User with a local integration | Page has cards or is empty | Import a folder | A card for each integration in it; "Imported from <path>" | REQ-003, DEC-012, DEC-014 |
| UXJ-003 | User, Import fails | Import dialog | Understand and correct | Error under the field; field kept; nothing imported | REQ-003, REQ-009 |
| UXJ-004 | User, connected card | Connected | Check, replace or remove the token | Connected, or Installed, needs a token | REQ-004; SCN-003 |
| UXJ-005 | User, Manage sources | Sources imported | Update a repository | "<name> is up to date." | REQ-003 |
| UXJ-006 | User, Manage sources | Sources imported | Remove a source | Source, skills and connections gone; cards gone | REQ-003, DEC-014, DEC-015 |
| UXJ-007 | User, Skills page | An integration imported | See which skill is an integration and reach its card | The card, focused | Skills-page question |
| UXJ-008 | User, tool missing | `jq` not found | Understand what is missing | Check again | REQ-008 |

## Journey Details

**UXJ-001.** (1) Menu → Integrations: the empty state (VIS-001). (2) **Import**: the dialog opens with the field focused (VIS-002). Typing a repository link shows the trust hint with the amber shield (VIS-003). (3) **Import** (or Enter): the button reads "Importing…" with a spinner and the field is disabled, about 1.5 s (VIS-005). (4) The dialog closes; the page shows the toolbar, the green notice "Imported GitHub from AutoByteus/autobyteus-integrations." and the GitHub card, chip **Installed, needs a token**, button **Connect** (VIS-013). (5) **Connect** opens the integration's dialog: step 1 "Imported" (with "Imported from AutoByteus/autobyteus-integrations"), step 2 "Connect GitHub" with the integration's help text (a web address is a link) and the token field (VIS-014); a rejected token shows "GitHub rejected the token." under the field (VIS-015); an accepted one turns step 2 into "Connected to GitHub", the chip into **Connected as @alex-dev**, and step 3 active (VIS-017). (6) **Go to Agents** opens the Agents page.

**UXJ-002.** The same Import with a folder path (VIS-004: the hint changes to "The folder stays where it is; nothing is copied. …"; the shield is not shown). About 0.7 s later the notice reads "Imported SSH from /Users/alex/Projects/my-integrations." and the card's dialog says "Imported from /Users/alex/Projects/my-integrations". **Browse…** appears beside the field only where the product's native folder picker exists (the desktop app); it fills the field with the chosen folder and returns focus to the field. The reference does not show it (no native picker in the browser).

**UXJ-003.** The errors, each in the red bar under the field, with the field kept and focused so the user can edit (VIS-006…VIS-012). Nothing is imported.

**UXJ-004.** As in the first design: Test → "The token works: @alex-dev." in green, or "GitHub rejected the stored token. Replace it or remove it." in red (VIS-018); Replace token; Remove (no confirmation) → "GitHub token removed." and the chip returns to Installed, needs a token.

**UXJ-005.** **Manage sources** → a repository row with **Update available** and the **Update** chip (VIS-022…VIS-024). Update opens the existing "Update entire skill source?" confirmation (VIS-024); confirming shows "Updating…" about 1.5 s, then the result bar "<name> is up to date." and "Up to date" on the row. When GitHub cannot be reached the result bar reads "Could not update <name>: GitHub could not be reached (<reason>). Nothing was changed." and the row keeps **Update available** (VIS-025).

**UXJ-006.** The trash button opens "Remove source?" (VIS-026, VIS-027): "Remove “<name>”? This deletes the whole source and its N skills, so its integrations leave this page. Upstream files are not changed." plus, when an integration in it is connected, "This also removes your GitHub connection." For a folder: "Remove “<name>”? Its N skill(s) will no longer be available, and its integrations leave this page. The files on disk are not deleted." After Remove the row and the cards are gone and the result bar says "Removed <name>."; removing the last source closes the dialog and the page shows the notice "Removed <name>." over the empty state. Re-importing means connecting again.

**UXJ-007.** Skills page: the skill `github-integration` shows the **Integration** label (VIS-028); the skill stays listed and readable like any skill. Clicking the label opens `/integrations#integration-github`: the page scrolls to the card and focuses it with a blue ring (VIS-030). Skills → Sources lists the imported sources like any (VIS-029); removing one there removes its card and connection.

**UXJ-008.** As in the first design (VIS-020, VIS-021).

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Integrations page | `/integrations` (menu item Integrations) | List imported integrations; one action per card; Import | toolbar (Manage sources, Import), optional notice, card grid; or the empty state | VIS-001, VIS-013, VIS-016, VIS-019, VIS-031, VIS-032 |
| UIS-002 | Integration card | grid | State and the next action | icon, name, description; optional amber tool line; connected: access line; footer chip + button | VIS-013, VIS-016, VIS-019, VIS-020, VIS-030 |
| UIS-003 | Import dialog | Import button (toolbar or empty state) | Import a link or a folder | label, field (+ Browse…) + Import, error bar, hint, Cancel | VIS-002…VIS-012, VIS-033 |
| UIS-004 | Manage sources dialog | Manage sources button | Update and remove sources | intro, source rows, result bar, Done | VIS-022, VIS-023, VIS-025, VIS-034 |
| UIS-005 | Update and Remove confirmations | Update chip, trash button | Confirm | the product's confirmation modals with the source card | VIS-024, VIS-026, VIS-027 |
| UIS-006 | Integration dialog | Connect / Manage | Imported, connect, access, tools | header; chip; three steps; tools row | VIS-014, VIS-015, VIS-017, VIS-018, VIS-021, VIS-035 |
| UIS-007 | Skills page card and Manage Skill Sources | `/skills` | Mark and list | label on the card header; imported sources in the dialog list | VIS-028, VIS-029 |
| UIS-008 | Server Settings → Basics | `/settings?section=server-settings&mode=quick` | Unchanged: no GitHub card | — | first design's VIS-019 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Page, empty or with cards | Import | Dialog opens, field focused | Import dialog | — | type, Browse…, Cancel, X, Esc |
| TR-002 | Import dialog | Import (button or Enter) with a link or folder | "Importing…", field and buttons disabled | Dialog closes; notice; new cards | The source is imported as a skill source; its skills join the catalog; each integration in it becomes a card | Connect on a card |
| TR-003 | Import dialog | Import is refused or fails | Red bar under the field; field kept and focused | Dialog stays | Nothing imported | edit and retry, Cancel |
| TR-004 | Import dialog | Cancel, X, Esc, click outside | Dialog closes; focus returns to the button that opened it | Page | — | — |
| TR-005 | Page with cards | Manage sources | Dialog opens | Manage sources dialog | — | Update, trash, Done |
| TR-006 | Manage sources | Update (repository with an update) | Confirmation opens | Confirmation | — | Update, Cancel |
| TR-007 | Update confirmation | Update | "Updating…", row busy | Row "Up to date"; result bar | The source is replaced by the latest revision; skills refresh | Done |
| TR-008 | Update confirmation | Update, GitHub unreachable | Red result bar with the reason | Row keeps "Update available" | Nothing changed | Update |
| TR-009 | Manage sources | Trash → Remove | "Removing…", row busy | Row and cards gone; result bar (or notice on the page if it was the last source) | The source and its skills are removed; the stored token of its integrations is removed; a folder's files stay | Done |
| TR-010 | Card, Installed, needs a token | Connect | Dialog opens, focus on the dialog | Integration dialog, step 2 | — | token field, X |
| TR-011 | Integration dialog | Connect (token) or Enter | "Checking…" | Connected as @login, step 3 active | Token checked with the service, then stored; never shown again | Test, Replace token, Remove, Go to Agents |
| TR-012 | Integration dialog | Test / Replace token / Remove | As the first design (TR-004…TR-006 there) | — | — | — |
| TR-013 | Integration dialog | Esc, X, click outside | Dialog closes; focus returns to the Connect or Manage button | Page | — | — |
| TR-014 | Skills page card | Integration label | Navigates | `/integrations#integration-<id>`: card scrolled to and focused | — | Connect / Manage |
| TR-015 | Card, Needs a newer AutoByteus | Check for updates | Navigates | Settings → Updates | — | — |
| TR-016 | Notice | Dismiss (X) | Notice disappears | — | — | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| Page, empty | Nothing imported | Card: puzzle-piece icon, "No integrations yet", "Import a GitHub repository or a folder that contains integrations. Each integration appears here as a card.", button **Import**; no toolbar | Import | — | VIS-001, VIS-032 |
| Import dialog, empty field | Open | Label "GitHub repository link or folder path"; placeholder "https://github.com/owner/repository or /path/to/folder"; hint "A public GitHub repository, or a folder on this computer that contains integrations."; Import disabled | type | Cancel | VIS-002 |
| Import dialog, link typed | A web address typed | Hint with the amber shield: "Import only repositories you trust. AutoByteus sends a token only to its service's own address, but an integration's scripts can still use the service as you." | Import | — | VIS-003 |
| Import dialog, folder typed | Any other text typed | Hint: "The folder stays where it is; nothing is copied. Its integrations appear on this page and its skills in your skills." | Import | — | VIS-004 |
| Import dialog, importing | Import | Button "Importing…" with spinner; field, Browse… and Cancel disabled | — | wait | VIS-005 |
| Error, no integrations (repository) | Repository without an integration | "No integrations in this repository. Nothing was imported." | edit | — | VIS-006 |
| Error, no integrations (folder) | Folder without an integration | "No integrations in this folder. Nothing was imported." | edit | — | VIS-007 |
| Error, skill-name clash | A skill name already exists in another source | "Could not import. A skill named “github-integration” already exists in another skill source. Remove or rename it on the Skills page, then try again." | edit | fix on Skills | VIS-008 |
| Error, GitHub unreachable | Download fails | "Could not reach GitHub: <reason>. Check your internet connection, then try again." (reason from the importer; illustrative here: "the request timed out after 30 seconds") | retry | — | VIS-009 |
| Error, folder not found | Path missing | "Directory not found: <path>" | edit | — | VIS-010 |
| Error, not a link or path | Neither | "Enter a GitHub repository link, like https://github.com/owner/repository, or the full path of a folder." | edit | — | VIS-011 |
| Error, already imported | Same link or path | "This repository is already imported. Use Manage sources to update it." / "This folder is already imported. Use Manage sources to see it." | — | Manage sources | VIS-012 |
| Page, after Import | Imported | Toolbar; notice "Imported <names> from <repository or folder>."; the new cards | Connect | dismiss the notice | VIS-013 |
| Card, needs a token | — | Chip **Installed, needs a token**; button **Connect** | Connect | — | VIS-013 |
| Card, connected | — | Chip **Connected as @alex-dev**; line "Add github-integration to an agent to give it access."; button **Manage** | Manage | — | VIS-016 |
| Card, needs a newer AutoByteus | The app cannot deliver this integration's credential | Chip with `heroicons:arrow-up-circle`; button **Check for updates** | Check for updates | — | VIS-019 |
| Dialog, step 1 | Any | Title "Imported"; "The github-integration skill is in your skills."; "Imported from <owner/repository or folder path>" in `text-xs text-gray-500` | — | — | VIS-014, VIS-017 |
| Dialog, token rejected / test refused / tool missing | As the first design | As the first design's State Behavior | — | — | VIS-015, VIS-018, VIS-021 |
| Manage sources, rows | Sources imported | Repository: icon, `owner/repository`, "N integrations", link, status; folder: folder icon, folder name, path, "Local folder" | Update (repository with an update), trash | Done | VIS-022, VIS-023 |
| Manage sources, update confirmation | Update chip | The product's "Update entire skill source?" with the repository, branch and installed → latest revision | Update, Cancel | Cancel | VIS-024 |
| Manage sources, update error | Update fails | Red bar "Could not update <name>: GitHub could not be reached (<reason>). Nothing was changed." | Update | — | VIS-025 |
| Manage sources, remove (repository) | Trash | "Remove source?" … "This also removes your GitHub connection." (only when connected) | Remove, Cancel | Cancel | VIS-026 |
| Manage sources, remove (folder) | Trash | "… The files on disk are not deleted." | Remove, Cancel | Cancel | VIS-027 |
| Skills page card | Skill belongs to an imported integration | Label "Integration" beside the name | open the card | — | VIS-028 |
| Skills → Manage Skill Sources | Sources imported | The imported sources are listed with the others (repository with status; folder with path) | as the dialog | — | VIS-029 |
| Page, loading | First read | Spinner and "Loading integrations…" (brief; cards are read locally) | — | — | not captured (transient) |

## Content, Labels, Validation, And Feedback

- Product voice: short sentences, sentence case, "node" for the machine.
- Exact labels: menu **Integrations**; page buttons **Import**, **Manage sources**; Import dialog title **Import integrations**, label **GitHub repository link or folder path**, buttons **Browse…**, **Import**, **Importing…**, **Cancel**; Manage dialog title **Manage sources**, buttons **Update**, **Remove**, **Done**, row texts **Up to date**, **Update available**, **Updating…**, **Removing…**, **Local folder**, counts "1 integration" / "N integrations"; confirmations **Remove source?** and the product's **Update entire skill source?**; chip texts and the card and dialog labels of the first design, except that **Install**, **Installing…**, **Not installed** and the "all installed skills" line no longer exist; Skills label **Integration**. All strings, with their zh-CN translations, are in `localization/messages/{en,zh-CN}/integrations.ts`.
- Help text: the integration's own text (`token.help` in production); a web address in it becomes a link (new tab, `rel="noopener noreferrer"`); nothing else is interpreted.
- Notice texts: "Imported {names} from {source}." ({names} comma-separated; {source} is `owner/repository` or the folder's name), "{name} is up to date.", "Removed {name}."

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| GitHub repository link or folder path | text, no autocomplete, no spellcheck | yes | A web address must be a GitHub repository (`github.com/owner/repository`); anything else must be an absolute path; the source must hold at least one integration | Import or Enter | see State Behavior errors; Import is disabled while the field is empty |
| {Service} token and Test | as the first design | | | | as the first design |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop | ≥ 1024 px content width (`lg`) | Two card columns; toolbar right-aligned | — |
| Narrow | below `lg` (checked at 390 px, with the app's icon-only menu) | One column; the toolbar buttons stay on one row; in the Import dialog the field takes its own row and Import spans the width; in Manage sources rows use `px-4`, the count moves to the status line | The dialogs are `w-full` with 16 px margin and scroll |

## Accessibility And Keyboard Behavior

- Target: the product's existing level (labelled controls, visible focus, keyboard operable).
- Focus: opening any dialog moves focus into it (the Import dialog focuses the field; the others focus the dialog); **closing returns focus to the button that opened it** (required of production, for all three dialogs; the reference implements it). Esc closes a dialog; while an operation runs the dialog does not close. A card reached through `#integration-<id>` is focused.
- Keyboard: Enter in the field imports; all controls are buttons, links or inputs in reading order. Engineering should give the dialogs the product's shared modal behavior (Tab cycle) as the Skills source dialog has; the reference's new dialogs do not trap Tab.
- Roles and names: dialogs `role="dialog" aria-modal="true"` labelled by their titles; the Import error `role="alert"`, notices and result bars `role="status"` (errors in the Manage dialog `role="alert"`); the trash button is named "Remove <name>"; the Skills label is a link named "Open the <name> card on the Integrations page"; icons are decorative.
- Contrast: as the first design; the notice and result bars use `emerald-900`/`red-800` text on their tinted backgrounds.

## Motion And Transitions

- Spinners (`animate-spin`) on Importing, Connect and the busy source row; no other motion; the dialogs appear without animation. The scripted waits (Import 1.5 s for a repository and 0.7 s for a folder, Update 1.5 s, Remove 0.8 s, Connect 1.2 s, Test 0.9 s, page read 0.25 s) are illustrative, not requirements.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| The integrations in a source (name, description, `icon.svg`, `token.help`, prerequisites) | cards and dialog text | Invented text in `prototype/integrations/integrationsDesignFixture.ts`; GitHub, Jira, SSH; two repositories and one folder | Read from each integration's `integration.json` and icon in the imported source |
| Import (link or folder) | TR-001…TR-004 | Scripted by keywords in what is typed (see the runbook); the importer's real error texts are shown in production | The skill-source import (GitHub download or local folder); "No integrations in this repository/folder" when no folder has an `integration.json` |
| Update, Remove | TR-005…TR-009 | Scripted; the Skills page lists the same sources | The skill-source Update and Remove; Remove also deletes the stored token of the source's integrations; a folder is unlinked, never deleted |
| Token check, Test, Remove token | TR-011, TR-012 | Token containing `bad`, `reject` or `revoked` is rejected; `offline` cannot be checked; anything else connects as `@alex-dev` | Checked with the service; vault storage |
| Tools found | UIS-006 | Scripted per scenario (`jq` missing) | `command -v` on the node |
| Browse… | UIS-003 | Not shown (no native picker in the browser) | Shown only where the native folder picker exists |
| Menu section height | menu | Unchanged from the first design | Same behavior required |
| State | all | In memory; a reload resets it | — |

## Final Visual Reference Inventory

All at `visual-references/` in this ticket folder. Viewport 1440×900 unless stated. Every visible detail is requirements-defining except the illustrative items in the last column. The first design's `VIS-019` (Server Settings → Basics without the GitHub card, `tickets/done/integrations-page/visual-references/`) stays normative; every other first-design reference is superseded by this inventory.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UIS-001 empty page | 1440×900 | `visual-references/VIS-001-empty-page-desktop-1440x900.png` | menu with Integrations after Nodes, empty card, Import button, no toolbar | — |
| VIS-002 | UIS-003 empty field | 1440×900 | `VIS-002-import-dialog-empty-field-desktop-1440x900.png` | dialog frame, label, placeholder, hint, disabled Import | — |
| VIS-003 | repository link typed | 1440×900 | `VIS-003-import-dialog-repository-link-trust-hint-desktop-1440x900.png` | trust hint with the amber shield | the typed link |
| VIS-004 | folder path typed | 1440×900 | `VIS-004-import-dialog-folder-path-hint-desktop-1440x900.png` | folder hint, no shield | the typed path |
| VIS-005 | importing | 1440×900 | `VIS-005-import-dialog-importing-desktop-1440x900.png` | spinner, "Importing…", disabled field | — |
| VIS-006 | no integrations, repository | 1440×900 | `VIS-006-import-error-no-integrations-repository-desktop-1440x900.png` | red bar | the link |
| VIS-007 | no integrations, folder | 1440×900 | `VIS-007-import-error-no-integrations-folder-desktop-1440x900.png` | red bar | the path |
| VIS-008 | skill-name clash | 1440×900 | `VIS-008-import-error-skill-name-clash-desktop-1440x900.png` | red bar | the importer's exact wording (shown in production) |
| VIS-009 | GitHub unreachable | 1440×900 | `VIS-009-import-error-github-unreachable-desktop-1440x900.png` | red bar with a reason | the reason text |
| VIS-010 | folder not found | 1440×900 | `VIS-010-import-error-folder-not-found-desktop-1440x900.png` | red bar | the path |
| VIS-011 | not a link or path | 1440×900 | `VIS-011-import-error-not-a-link-or-path-desktop-1440x900.png` | red bar | — |
| VIS-012 | already imported | 1440×900 | `VIS-012-import-error-already-imported-desktop-1440x900.png` | red bar over a page with a card | `@alex-dev` |
| VIS-013 | after Import | 1440×900 | `VIS-013-imported-card-needs-a-token-with-notice-desktop-1440x900.png` | toolbar, green notice, card, amber chip, Connect | GitHub's description |
| VIS-014 | connect step | 1440×900 | `VIS-014-dialog-connect-step-after-import-desktop-1440x900.png` | step 1 Imported with source, step 2 token form, tools row | help text and link |
| VIS-015 | token rejected | 1440×900 | `VIS-015-dialog-token-rejected-desktop-1440x900.png` | red message | — |
| VIS-016 | connected card | 1440×900 | `VIS-016-connected-card-desktop-1440x900.png` | toolbar, green chip, access line, Manage | `@alex-dev` |
| VIS-017 | dialog connected | 1440×900 | `VIS-017-dialog-connected-manage-desktop-1440x900.png` | steps 1–2 done, step 3 active, Test / Replace token / Remove, Go to Agents | `@alex-dev`, the date |
| VIS-018 | Test refused | 1440×900 | `VIS-018-dialog-test-refused-desktop-1440x900.png` | red message | — |
| VIS-019 | several cards | 1440×900 | `VIS-019-several-cards-desktop-1440x900.png` | grid, equal-height rows, three chip kinds, letter tile | Jira and SSH (invented) |
| VIS-020 | tool missing, card | 1440×900 | `VIS-020-tool-missing-card-desktop-1440x900.png` | amber line | — |
| VIS-021 | tool missing, dialog | 1440×900 | `VIS-021-dialog-tool-missing-desktop-1440x900.png` | amber pill, sentence, Check again | — |
| VIS-022 | Manage sources, two repositories | 1440×900 | `VIS-022-manage-sources-two-repositories-desktop-1440x900.png` | rows, counts, status | repository names and links |
| VIS-023 | Manage sources, repository and folder | 1440×900 | `VIS-023-manage-sources-repository-and-folder-desktop-1440x900.png` | folder row: icon, path, "Local folder", no Update | names, path |
| VIS-024 | Update confirmation | 1440×900 | `VIS-024-update-confirmation-desktop-1440x900.png` | the product's confirmation | revisions |
| VIS-025 | Update error | 1440×900 | `VIS-025-update-error-github-unreachable-desktop-1440x900.png` | red bar, row keeps Update | reason text |
| VIS-026 | Remove, repository | 1440×900 | `VIS-026-remove-confirmation-repository-with-connection-desktop-1440x900.png` | text including "This also removes your GitHub connection." | names, counts |
| VIS-027 | Remove, folder | 1440×900 | `VIS-027-remove-confirmation-folder-desktop-1440x900.png` | "The files on disk are not deleted." | names, path |
| VIS-028 | Skills page label | 1440×900 | `VIS-028-skills-page-integration-label-desktop-1440x900.png` | label beside the skill name | other skills on the page |
| VIS-029 | Skills → Manage Skill Sources | 1440×900 | `VIS-029-skills-sources-lists-imported-sources-desktop-1440x900.png` | imported sources listed with the others | the other (baseline) sources |
| VIS-030 | card reached from the label | 1440×900 | `VIS-030-card-focused-from-skills-label-desktop-1440x900.png` | blue focus ring on the card | — |
| VIS-031 | several cards, narrow | 390×844 | `VIS-031-several-cards-narrow-390x844.png` | one column, toolbar on one row | as VIS-019 |
| VIS-032 | empty, narrow | 390×844 | `VIS-032-empty-page-narrow-390x844.png` | empty card | — |
| VIS-033 | Import error, narrow | 390×844 | `VIS-033-import-error-narrow-390x844.png` | field on its own row, full-width Import | — |
| VIS-034 | Manage sources, narrow | 390×844 | `VIS-034-manage-sources-narrow-390x844.png` | count in the status line | — |
| VIS-035 | dialog connected, narrow | 390×844 | `VIS-035-dialog-connected-narrow-390x844.png` | full-width dialog | as VIS-017 |

## Linked UI Reference Evidence

- Runnable UI reference: the design repository root; `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4950`; entry http://127.0.0.1:4950/integrations
- Ticket record: `product-ticket.md`; review notes: `design-review-notes.md`; runbook: `/ui-reference-runbook.md` (section integrations-page)
- Starting states: `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` then reload: `integrations_connected`, `integrations_several`, `integrations_local_folder`, `integrations_tool_missing`, `integrations_token_revoked`, `integrations_update_available`, `integrations_update_offline`; default = nothing imported. Scripted Import outcomes: see the runbook.
- Journey and transition IDs: UXJ-001…008, TR-001…016.
- Mocked boundaries and limitations: see above.

## Implementation Fidelity Boundary

- Must preserve: the first design's card grid and anatomy, one action per state, the three-step dialog and tools row, the token form, the menu position (last, after Nodes), the menu section following its content; this revision's toolbar, Import dialog (one field for a link or a folder), Manage sources dialog (Update for repositories, Remove for both, folder rows without Update), the empty state, the notice, the Remove texts including the connection sentence, focus return to the opening button, the Skills label and its link, and the imported sources in Manage Skill Sources.
- Does not prescribe: the reference's store, fixture, timings, scripted keywords, or the transient loading state.
- Allowed to vary: illustrative content listed above; the date format (the user's locale); timing of spinners.
- Existing design-system constraints: the product's Tailwind tokens, dialog pattern and shared confirmation modals.

## Out Of Scope

- Sign-in flows; third-party integrations; installing tools; other kinds of connect step (site address, email, key): only the GitHub token form is designed (DEC-010); installing one integration out of a source; removing one integration out of a source (Remove removes the whole source); a card state for an integration that left its source after an Update (it disappears with the update).

## Open Decisions And Risks

- The chip text "Installed, needs a token" is kept as approved; DEC-010 applies when another connect kind arrives.
- The "already imported" and "not a GitHub link or path" messages come from the skill-source importer's own rules in production; the reference wording is illustrative.
- A user's stored left-menu height smaller than the new menu can still hide the last item; engineering decides whether to raise it (unchanged from the first design).
- Importing a source whose integration is already imported from another source is a skill-name clash (the skills share a name); production behavior follows the importer.

## Final Consistency Check

- User confirmation is recorded: `Yes` (conditional on the designer's consistency check, which was done; see Status)
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (the loading state is transient and is not captured; Browse… is not shown in the browser build)
- Every section covers the affected scope or is marked `Unchanged` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
