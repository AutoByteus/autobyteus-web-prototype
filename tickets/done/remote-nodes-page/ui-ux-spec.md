# UI/UX Specification — Nodes → Remote Collaboration: each peer's state and offer

The final screenshots in `visual-references/` are normative: every visible detail is requirements-defining unless a section below marks it illustrative.

## Status And User Confirmation

- Status: `Approved`
- Request / ticket: `remote-nodes-page` (engineering Task autobyteus-267)
- Related requirements revision ID: SR-001 (`requirements-doc.md`, Ready for Approval). This design changes the scope of that document; see "Requirement impact".
- Related IDs: UC-501, UC-503 (peers' lists), REQ-501, REQ-502, REQ-504, REQ-507 (peers' lists), REQ-508, REQ-509, BEH-501, BEH-503, AC-501, AC-502 (the UI part), AC-504, AC-505, AC-506, DEC-502, DEC-504, SCN-501, SCN-503. Removed by the user: UC-502, REQ-505, REQ-506, AC-503, SCN-502, DEC-501, DEC-503.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`
- Review URL (during review): `http://127.0.0.1:4781/nodes?nodeTab=remoteCollaboration`, scenario `collab_peers` (see `ui-reference-runbook.md`, section `remote-nodes-page`)
- Explicit user-confirmation reference: the user's message "approved" to the Product UI/UX Designer, 2026-10-21, in the design review conversation. It followed the review in which the user (1) rejected the first layout as too busy and not clean, (2) found the list of this node's own Agents and Teams redundant and asked twice for it to be removed, and (3) confirmed the resulting page (switch card + Peer nodes only) before the final checks.
- Final check date: 2026-10-21

## Repository And Baseline Provenance

- Source repository: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo`
- Selected frontend: `autobyteus-web`
- Pinned source commit: `origin/personal@9e7a45880865912442f4188e6d2a58d99b10a54c` (baseline refresh `WEB-BASELINE-REFRESH-012`, integrated into the design repository at `d711b81`)
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`, default branch `personal`
- Ticket branch: `design/remote-nodes-page`; accepted base `d711b817115b9456732e5be03f6b53c7a0e1ca4f`
- UI reference revision: code and final screenshots at `4ddbe0e` on the ticket branch; the integrated revision is in `product-ticket.md`
- Ticket folder: `tickets/done/remote-nodes-page/`
- Baseline report: `ui-baseline-report.md` (repository root)

## Problem And Design Rationale

- User problem and intent: after adding a peer node, the owner sees only its name, URL and ID. He wants to see what the peer offers, "we could really see their agents and agent teams", and whether the peer is usable now.
- Key UX decisions and why:
  1. **One short line per peer by default.** The line is: a state chip, then (for an available peer) a disclosure showing the counts and the first names, cut by the line's width. Expanding it shows the full list. A first version that showed every list, search box and description at once was rejected by the user as too much text and not clean.
  2. **Ask on open, on add and on Refresh (DEC-502, decided).** Every peer is asked when the page opens, in parallel, each with its own waiting state; a peer you add is asked at once; a Refresh icon per peer asks it again. Nothing polls. The alternative "on expand" was not chosen: the state (off there, not registered, not reachable) is what the owner came to see, and a collapsed peer would hide it.
  3. **Reasons are sentences, not codes.** Each unavailable state says what is wrong and, where the owner can act, what to do ("Remote Collaboration is off on lab. Turn it on there.").
  4. **No card for this node's own Agents and Teams.** The user knows them from the Agents and Agent Teams pages and called the list redundant. The card "Agents and Agent Teams available to peers", its readiness flags and its settings links are removed.
  5. **The rules stay, collapsed.** The rules the removed card stated (temp workspace, tool calls auto-approved, local login, no default is refused) remain as one collapsed line "How peers' runs work" at the bottom of the Peer nodes card.
- Alternatives considered and why rejected:
  - Show every peer's lists expanded: too tall and noisy with several peers.
  - A card for this node's shared Agents and Teams with readiness flags (a flagged-only version existed, git `e8f76d6`): removed at the user's request as duplicate information.
  - Fetch a peer only when expanded: hides the peer's state.
  - A per-list "Show all" button and a short cap per kind: replaced by one expand per peer, which is simpler and reads cleaner.

## Scope And Experience Goal

- User or actor: the node's owner, in the desktop window (also when it is opened on a Docker node: the same page, answered by that node's server) and in the web UI.
- Context: Settings area → Nodes → Remote Collaboration tab.
- Goal: see each registered peer's state now and, for an available peer, its Agents and Agent Teams (name, kind, description when it has one).
- Observable success: opening the page shows every peer's state within its own time, the page stays usable while a peer takes up to 20 s, and an available peer's offer can be read and narrowed by name.
- In-scope surfaces and journeys: the Remote Collaboration tab: the switch card (unchanged), the Peer nodes card (changed), the rules line (moved).
- Non-goals: starting or messaging remote runs; changing what is shared; live updates or polling; any view of this node's own Agents and Teams on this page.

## Related Requirements And Acceptance Criteria

| ID | UI/UX Obligation | Covered By |
| --- | --- | --- |
| REQ-501, BEH-501 | Each peer shows its state: Available, or one of four unavailable states with a sentence | UIS-001, ST-01…ST-06, VIS-001, VIS-005 |
| REQ-502 | An available peer shows its Agents and Agent Teams with name, kind (the group) and description when it has one | UXJ-002, VIS-003 |
| REQ-504 | Asked on open and on Refresh; each peer has a waiting state; the page stays usable; no timer | UXJ-001, ST-02, VIS-002. Also on add (see Open decisions) |
| REQ-507, BEH-503 | A peer's list starts short (one line) and expands; both kinds are narrowed by name | UXJ-002, VIS-003 |
| REQ-508 | Switch off: no states, no lists, one sentence says why | UXJ-005, VIS-005 |
| REQ-509 | The same page in a window opened on a Docker node | No UI difference |
| AC-501 | Each peer shows its own state at its own pace; a black-holed peer shows waiting, then not reachable after about 20 s | VIS-002, VIS-001 |
| AC-504 | With 30+ entries the list starts short; typing narrows; clearing shows all | VIS-003 |
| AC-505 | Switch off asks nobody; turning it on loads the lists | UXJ-005 |

## Visual Language

- Existing product language preserved: the Nodes page shell and tab list; white cards `rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm`; card heading `text-xl font-semibold text-gray-900`; description `text-sm text-gray-500`; buttons `rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700`; the red Remove button; pills as on the Manage Nodes tab (`rounded-full px-2.5 py-1 text-xs font-semibold`, `bg-green-100 text-green-700`, `bg-amber-100 text-amber-700`).
- Layout of the Peer nodes card, top to bottom: heading and description (unchanged); switch-off notice (only when off); the peer list; the add form (unchanged); a divider; the "How peers' runs work" line.
- Peer entry (`li`, `py-4`, `divide-y divide-slate-100`):
  - Header row: `flex flex-wrap items-center gap-3`. Left block `min-w-[13rem] flex-1`: name `font-medium text-slate-900` followed by the state chip, then `text-xs text-slate-500` URL · node ID (single line, truncated). Right: refresh icon button, Rename, Remove.
  - Below the header (`mt-2`): the state sentence (`text-sm`), or for an available peer the offer disclosure.
- State chip: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold`, with a 6 px dot (`h-1.5 w-1.5 rounded-full`) or, while waiting, a 12 px spinner.

  | State | Chip classes | Dot |
  | --- | --- | --- |
  | Checking… | `bg-slate-100 text-slate-700` | spinner `border-b-2 border-slate-500`, `animate-spin` |
  | Available | `bg-green-100 text-green-700` | `bg-green-600` |
  | Off there; Not registered there (the owner can act) | `bg-amber-100 text-amber-700` | `bg-amber-600` |
  | Not reachable; Different server | `bg-red-100 text-red-700` | `bg-red-600` |

- Refresh icon button: `h-8 w-8 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50`, a 16 px circular-arrow icon; disabled while waiting (`text-slate-300`, the icon spins). `title` and `aria-label` as in the content table.
- Offer disclosure (a button row): a 16 px chevron (`text-slate-400`, rotates 90° when open), the counts `text-sm font-medium text-slate-800`, then (only when closed) the names `text-sm text-slate-500` on one line, cut by `truncate`.
- Expanded list (`pl-6`): optional search box, then one or two groups.
  - Search box: `max-w-xs rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-sm`, a 16 px magnifier at the left; focus `border-blue-400 ring-2 ring-blue-100`.
  - Groups side by side from `md` (768 px) up (`md:grid-cols-2`, `gap-x-10`), stacked below it.
  - Group heading: `text-xs font-semibold uppercase tracking-wide text-slate-500`, the count `text-slate-400` after it; a `border-b border-slate-100` under it.
  - Row: name `text-sm font-medium text-slate-900`; description `text-xs text-slate-500` under it; `py-2`; rows divided by `divide-y divide-slate-100`.
  - Footer: "Checked HH:MM" `text-xs text-slate-400`, local time.
- Switch-off notice: `rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800`.
- Rules line: a button `text-sm font-medium text-slate-600` with a chevron; open: a `text-sm text-gray-500` sentence and a bulleted list.
- Hover, focus and disabled: buttons follow the product (hover `bg-slate-50`; disabled grey). Every new interactive element shows `focus-visible:ring-2 focus-visible:ring-blue-500`.

### New Or Changed Components

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| Peer entry (changed) | Name, state chip, URL and ID, actions, state sentence or offer | waiting, available, available-empty, four unavailable, switch off, renaming | `components/settings/RemoteCollaborationPeersSection.vue` |
| State chip (new) | The peer's state now | see table above | same file |
| Refresh icon button (new) | Ask this peer again | enabled, waiting (disabled and spinning) | same file |
| Offer disclosure (new) | The short default view and its expansion | closed (counts and names), open | `components/settings/RemoteCollaborationOfferDisclosure.vue` |
| Offer list (new) | Full list, groups, search | with or without search, filtered, no match | `components/settings/RemoteCollaborationOfferList.vue` |
| Rules line (moved, collapsed) | The rules the removed card stated | closed, open | `RemoteCollaborationPeersSection.vue` |
| Offers store (reference only) | Scripted peer answers | n/a | `stores/remoteCollaborationOffersStore.ts`, `prototype/remote-collaboration/offersScript.ts` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Owner, switch on, peers registered | Opens the Remote Collaboration tab | See each peer's state | Every peer shows its state; slow peers still show Checking… while the others are done | REQ-501, REQ-504, AC-501, SCN-503 |
| UXJ-002 | Owner | A peer is Available | See and find its Agents and Teams | The list is open; narrowed by name when searching | REQ-502, REQ-507, AC-504, SCN-501 |
| UXJ-003 | Owner | A peer is unavailable (or stale) | Act and re-check | Refresh asks only that peer; the new answer replaces the old | REQ-504 |
| UXJ-004 | Owner | Just added a peer | See what it offers | The new peer shows Checking…, then its state or offer | SCN-501 |
| UXJ-005 | Owner | Switch on or off | See the page explain itself | Off: no chips, no lists, one notice; On: peers are asked | REQ-508, AC-505 |

## Journey Details

- **UXJ-001.** The tab opens. The switch card resolves first. When the switch is on, every registered peer immediately shows "Checking…" and the sentence "Waiting for {name}… up to 20 seconds.", with its refresh icon disabled. Rename and Remove stay enabled, and the add form and the other peers stay usable. Each peer replaces its waiting state when its own answer arrives. A peer that does not answer within the server's 20 s bound is shown as Not reachable. Re-opening the tab asks again.
- **UXJ-002.** An available peer shows `› 7 Agents · 2 Agent Teams  Build Runner, Code Reviewer, …`. Click the row (or Enter/Space) to open: the chevron turns, the names disappear, and the groups appear. A search box appears when either kind has more than 6 entries. Typing filters both groups by name (case-insensitive, contains); each count shows "2 of 24"; a group with no match shows "No match."; no match in either group shows "No Agents or Agent Teams match "{query}"." with "Clear search". Clearing the text shows everything. Click the row again to close; closing clears the search text, and so does a Refresh of that peer.
- **UXJ-003.** The refresh icon turns that peer to Checking… (its previous list is dropped) and asks it again. Other peers are untouched.
- **UXJ-004.** After "Add peer" succeeds, the new peer appears at the end of the list with Checking… and is asked at once.
- **UXJ-005.** Turning the switch off removes every chip, sentence and list at once, shows the notice at the top of the card, and asks nobody. Rename and Remove still work. Turning it on asks every peer again.
- Failure and recovery: a refused add keeps its existing error text (unchanged). A refresh on an unavailable peer after the owner fixed the cause shows the new state.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | Nodes → Remote Collaboration | `/nodes?nodeTab=remoteCollaboration` | See each peer's state and offer; manage peers | Switch card (unchanged); Peer nodes card as specified above | VIS-001…VIS-007 |

## Interaction And State Transitions

| Transition ID | From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Side Effect | Next Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | Tab closed | Open the tab, switch on | Every peer: chip Checking…, sentence, disabled refresh | Each peer settles on its own | Each peer asked once, in parallel | Refresh, Rename, Remove, expand |
| TR-002 | Checking | Answer: available with entries | Chip Available; disclosure line | Available | none | Expand |
| TR-003 | Checking | Answer: available, no entries | Chip Available; "{name} shares no Agents or Agent Teams." | Available-empty | none | Refresh |
| TR-004 | Checking | Answer: a refusal | Chip and sentence of the code | Unavailable | none | Refresh |
| TR-005 | Any answered | Refresh icon | Chip Checking…, spinner on the icon, old content dropped | Checking | That peer asked | as TR-002…004 |
| TR-006 | Available, closed | Click the disclosure row | Chevron turns; groups appear | Open | none | Search, close |
| TR-007 | Open | Type in search | Groups filter; counts "n of m" | Filtered | none | Clear |
| TR-008 | Switch on | Switch off | Chips, sentences and lists disappear; notice appears | Off | Nobody asked | Switch on |
| TR-009 | Switch off | Switch on | Peers show Checking… | as TR-001 | All asked | as TR-001 |
| TR-010 | Any | Add peer succeeds | New peer appears with Checking… | as TR-001 for it | New peer asked | as TR-002…004 |
| TR-011 | Any | Remove | Peer disappears | n/a | Its state is dropped | none |
| TR-012 | Rules closed | Click "How peers' runs work" | Chevron turns; the rules appear | Open | none | Close |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| ST-01 Available | Answer with entries | Chip "Available"; line `› {n} Agents · {m} Agent Teams  {names…}` | Expand, Refresh, Rename, Remove | Refresh | VIS-001 |
| ST-02 Checking | Open, add, switch on, Refresh | Chip "Checking…"; "Waiting for {name}… up to 20 seconds." | Rename, Remove (Refresh disabled) | Answer arrives | VIS-002 |
| ST-03 Off there | REMOTE_COLLABORATION_OFF | Chip "Off there"; "Remote Collaboration is off on {name}. Turn it on there." | Refresh, Rename, Remove | Owner turns it on there, Refresh | VIS-001 |
| ST-04 Not registered there | PEER_NOT_REGISTERED | Chip "Not registered there"; "{name} doesn't know this node yet. Register this node there." | same | Owner registers this node there, Refresh | VIS-001 |
| ST-05 Not reachable | PEER_UNREACHABLE (also an older build) | Chip "Not reachable"; "{name} didn't answer. It may be offline, or on an older version." | same | Refresh | VIS-001 |
| ST-06 Different server | PEER_IDENTITY_MISMATCH | Chip "Different server"; "A different server answers at this address. Check the URL." | same | Owner removes and re-adds, or Refresh | VIS-001 |
| ST-07 Available, empty | Answer with no entries | Chip "Available"; "{name} shares no Agents or Agent Teams." | same | none | VIS-004 |
| ST-08 Open | Disclosure clicked | Groups; search when a kind has more than 6; "Checked HH:MM" | Search, close | Close | VIS-003 |
| ST-09 Filtered / no match | Search text | counts "n of m"; "No match."; or the all-groups no-match sentence with Clear search | Clear search | Clear | VIS-003 |
| ST-10 Switch off | Switch off | Notice "Remote Collaboration is off, so peers are not asked. Turn it on to see their Agents and Agent Teams."; no chips or lists | Rename, Remove | Switch on | VIS-005 |
| ST-11 Peer with only one kind | Answer | Only that group is shown (no empty group) | as open | none | n/a |

## Content, Labels, Validation, And Feedback

- Voice: short, plain, second person for the owner; no codes or "agent-facing" English. Peer names are inserted as given.
- Reasons come from the refusal code and are localized in the window (DEC-504).
- Exact strings (English and Simplified Chinese); `{x}` are placeholders.

| Key (under `settings.components.settings.RemoteCollaboration.`) | English | 简体中文 |
| --- | --- | --- |
| `peers.status.waiting` | Checking… | 检查中… |
| `peers.status.available` | Available | 可用 |
| `peers.status.REMOTE_COLLABORATION_OFF` | Off there | 对方已关闭 |
| `peers.status.PEER_NOT_REGISTERED` | Not registered there | 未在对方登记 |
| `peers.status.PEER_UNREACHABLE` | Not reachable | 无法连接 |
| `peers.status.PEER_IDENTITY_MISMATCH` | Different server | 服务器不一致 |
| `peers.detail.waiting` | Waiting for {name}… up to 20 seconds. | 正在等待 {name}…最多 20 秒。 |
| `peers.detail.REMOTE_COLLABORATION_OFF` | Remote Collaboration is off on {name}. Turn it on there. | {name} 上的远程协作已关闭。请在对方开启。 |
| `peers.detail.PEER_NOT_REGISTERED` | {name} doesn't know this node yet. Register this node there. | {name} 还不认识本节点。请在对方登记本节点。 |
| `peers.detail.PEER_UNREACHABLE` | {name} didn't answer. It may be offline, or on an older version. | {name} 没有响应。它可能已离线，或版本较旧。 |
| `peers.detail.PEER_IDENTITY_MISMATCH` | A different server answers at this address. Check the URL. | 此地址上响应的是另一台服务器。请检查 URL。 |
| `peers.emptyOffer` | {name} shares no Agents or Agent Teams. | {name} 没有共享智能体或智能体团队。 |
| `peers.checkedAt` | Checked {time} | 检查于 {time} |
| `peers.refresh` (title) | Refresh | 刷新 |
| `peers.refreshLabel` (aria-label) | Refresh {name} | 刷新 {name} |
| `peers.switchOff` | Remote Collaboration is off, so peers are not asked. Turn it on to see their Agents and Agent Teams. | 远程协作已关闭，不会询问对等节点。开启后可查看它们的智能体和智能体团队。 |
| `offer.agents` / `offer.teams` | Agents / Agent Teams | 智能体 / 智能体团队 |
| `offer.agentOne` / `offer.agentsCount` | 1 Agent / {count} Agents | 1 个智能体 / {count} 个智能体 |
| `offer.teamOne` / `offer.teamsCount` | 1 Agent Team / {count} Agent Teams | 1 个智能体团队 / {count} 个智能体团队 |
| `offer.countFiltered` | {shown} of {count} | {shown} / {count} |
| `offer.search` (placeholder and aria-label) | Search by name | 按名称搜索 |
| `offer.noMatchInKind` | No match. | 没有匹配项。 |
| `offer.noMatch` | No Agents or Agent Teams match “{query}”. | 没有名称匹配“{query}”的智能体或智能体团队。 |
| `offer.clearSearch` | Clear search | 清除搜索 |
| `rules.title` | How peers' runs work | 对等节点的运行方式 |
| `rules.lead` | With Remote Collaboration on, registered peer nodes can start any shared Agent or Agent Team of this node. | 开启远程协作后，已登记的对等节点可以启动本节点任何已共享的智能体或智能体团队。 |
| `rules.runtime` | Each agent runs with its own default runtime and model; a team member without one uses its team's default. | 每个智能体使用自己的默认运行时和模型；没有默认值的团队成员使用其团队的默认值。 |
| `rules.workspace` | It runs in this node's temp workspace, and every agent of the run has its tool calls auto-approved. | 它在本节点的临时工作区中运行，该次运行中每个智能体的工具调用都会自动批准。 |
| `rules.login` | An agent whose default runtime signs in with this node's local login (for example Codex or Claude) uses that login for every registered peer. | 默认运行时使用本节点本地登录的智能体（例如 Codex 或 Claude），会为每个已登记的对等节点使用该登录。 |
| `rules.refused` | An agent, or a team member, with no default runtime and model is refused. | 没有默认运行时和模型的智能体或团队成员会被拒绝。 |

- Removed keys: `availability.title`, `availability.note` (its sentence now reads `rules.lead` and its rules `rules.*`). Everything else on the page is unchanged: the switch card, the Peer nodes heading and description, Rename, Remove, Save, Cancel, the add form and its errors, and the existing hint `peers.switchHint`.
- The peer's name, the entry names and the descriptions are the peer's own data and are shown as received (not translated). In the Chinese screenshot they are English because the fixture is.

### Form And Input Validation

| Field / Control | Input Type | Required | Validation Rule | Validation Trigger | Exact Message |
| --- | --- | --- | --- | --- | --- |
| Search by name (per open peer) | text | No | Case-insensitive "contains" on the name only; trimmed | Every keystroke | none; the counts and "No match." show the result |
| Add peer form | unchanged | | unchanged | | unchanged |

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| Desktop window and web | ≥ 768 px | Header row on one line; the two groups side by side | none |
| Narrow | < 768 px (checked at 390 px) | The left block (name, chip, URL) keeps at least 13 rem, so the refresh icon, Rename and Remove wrap to a second line under it; the groups stack | none |
| Desktop window opened on a Docker node | any | Identical: this node's server answers everything | none |

## Accessibility And Keyboard Behavior

- Target: the existing product's (keyboard reachable, visible focus, labels).
- Order: tab through each peer: refresh icon, Rename, Remove, then the disclosure row, then (when open) the search box; the rules line last, after the add form.
- Keys: Enter and Space toggle a disclosure; Escape is not used; the search box is `type="search"`.
- Roles, names, states: the chip has `role="status"`; each peer's sentence/offer area is `aria-live="polite"` so a settling peer is announced; disclosure buttons carry `aria-expanded`; the refresh icon has an `aria-label` with the peer's name; the search box has an `aria-label`; decorative icons are `aria-hidden`.
- Contrast: chip text colours are the product's existing `text-*-700` on `bg-*-100`; secondary text uses `text-slate-500` or darker. Counts and "Checked" times use `text-slate-400` and are not the only carrier of any information.

## Motion And Transitions

- Chevron: rotates 90° with Tailwind's default `transition-transform` (150 ms, ease-in-out). Spinners: `animate-spin`. No other motion.
- Reduced motion: follow the product (no specific handling exists); the spinner is a status cue, and the sentence "Waiting for {name}…" carries the same information without it.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| A peer's state and offer | Chip, sentence, lists | Scripted per peer name, delay 0.8 s to 20 s (`offersScript.ts`) | This node's server asks the peer (REQ-503); the window never does; each peer bounded by 20 s |
| Entry fields | Name, kind, description | `name`, `kind` (Agent or Agent Team), `description` only when present | Only fields with a value (REQ-510); nothing else is shown |
| Refusal reasons | Four sentences | Four scripted codes | The server's refusal code, localized in the window (DEC-504) |
| When a peer is asked | Waiting state | Open, switch on, add, Refresh | Same; never on a timer |
| "Checked" time | Footer | The window's clock at the moment the answer arrived | The time the window received the answer |
| Sort order | Names | Alphabetical by name within each kind (`localeCompare`) | Not specified by the server; the window sorts |

## Final Visual Reference Inventory

Images are captured from the running UI reference at the CSS viewport shown. The tool that captured them returns scaled images; the viewport, not the pixel size, is normative. All peer names, entry names, descriptions, URLs, node IDs and times are illustrative.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UIS-001 with six peers settled: ST-01, ST-03, ST-04, ST-05, ST-06 | 1440 px wide | `visual-references/VIS-001-peers-settled-desktop-1440.png` | Header row, chip colours and wording, state sentences, disclosure line, icon buttons, the add form, the closed rules line | Peer names, URLs, IDs, entry names |
| VIS-002 | UXJ-001 mid-way: ST-02 on two peers, others settled | 1440 px | `visual-references/VIS-002-peers-waiting-desktop-1440.png` | Checking… chip with spinner, waiting sentence, disabled refresh | as above |
| VIS-003 | ST-08, ST-09: docker open (7 and 2 entries), studio open and filtered "copy" | 1440 px | `visual-references/VIS-003-peers-expanded-search-desktop-1440.png` | Search box, groups side by side, headings and counts, "2 of 24", "No match.", footer | Entry names, descriptions, "Checked" times |
| VIS-004 | ST-07 and TR-012: a peer sharing nothing; the rules line open | 1440 px | `visual-references/VIS-004-empty-offer-and-rules-desktop-1440.png` | Empty sentence, the rules text and bullets | as above |
| VIS-005 | ST-10: switch off | 1440 px | `visual-references/VIS-005-switch-off-desktop-1440.png` | Notice, peers with only Rename and Remove, no chips | Peer names |
| VIS-006 | Chinese UI (ST-01 open, ST-03…ST-06) | 1440 px | `visual-references/VIS-006-zh-CN-desktop-1440.png` | Chinese strings from the table | Entry names and descriptions are English fixture data |
| VIS-007 | Narrow, docker open | 390 px | `visual-references/VIS-007-narrow-390.png` | Header wrap, stacked groups | as above |

Not captured as separate images: a peer with only one kind of entry (ST-11) and the all-groups no-match sentence; both follow the text rules above.

## Linked UI Reference Evidence

- Runnable UI reference: the design repository, `pnpm dev`; entry `/nodes?nodeTab=remoteCollaboration`
- Ticket record: `product-ticket.md`
- Run instructions: `ui-reference-runbook.md` (repository root), section `remote-nodes-page`
- Journey/scenario IDs: UXJ-001…005, TR-001…012, ST-01…ST-11, scenario `collab_peers`
- Mocked boundaries and limitations: `mock-boundaries.md`, section "Remote Collaboration offers"; and the table above

## Implementation Fidelity Boundary

- Must preserve: the one-line default per peer, the chip colours and wording, the sentences, the disclosure with counts and names, the two groups with headings and counts, the search rules and thresholds (more than 6 entries in either kind), the icon refresh button, the switch-off behavior, the narrow wrap rule, the English and Chinese strings.
- May differ: how the window obtains the answers; the store shape; component names; the exact pixel size of icons that keep the stated sizes.
- Fixture content that may vary: every peer, entry, description, URL, ID and time.
- Existing design-system constraints: Tailwind classes of the Nodes page; no new colours.

## Out Of Scope

- A view of this node's own shared Agents and Teams, their readiness flags and settings links (removed at the user's request).
- Starting or messaging remote runs; changing what is shared; polling; caching peers' lists; version checks.

## Open Decisions And Risks

- **Asked when added.** REQ-504 lists "when the page opens and when the owner refreshes it". This design also asks a newly added peer at once (UXJ-004), because the user's request was to see a peer's agents "after I add the remote node". The Solution Designer should add this to REQ-504.
- **Requirement impact (user decision).** The removed card changes the requirements: UC-502, REQ-505, REQ-506, AC-503, SCN-502, DEC-501 and DEC-503 have no UI; REQ-507 and AC-504 apply to peers' lists only; the readiness check (E-05) is not needed by this page. BEH-502 now only requires that the rules stay stated (they do: "How peers' runs work").
- **Very long peer lists.** An open list is as long as the peer's list; there is no inner scroll or cap. Search narrows it. If lists in the hundreds are expected, a cap is a later decision.
- **Re-asking on every open.** Leaving the tab and returning asks every peer again (no cache, by REQ non-goal). A peer that takes 20 s therefore shows Checking… again.
- **Wording of Not reachable.** It covers an offline peer and an older build with one sentence, as REQ-501 says.

## Final Consistency Check

- User confirmation is recorded: `Yes`
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes` (two minor text-only states are named above)
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
