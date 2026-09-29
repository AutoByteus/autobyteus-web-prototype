# UI Behavior Test Matrix — chat-interface-entry

Automated by `prototype/scripts/validate-chat-interface-entry.mjs` (headless Chromium, 1440×900 unless noted, en-US, UTC). R3 final run 2026-09-29: **32/32 pass, 0 browser errors**. Evidence: `review-evidence/r3/results.json` and screenshots (R2: `review-evidence/r2/`; R1: `review-evidence/round-6/`). UXJ-010 / UIS-010 / VIS-020 are superseded (DEC-013); CHK-030 now asserts the team view is unchanged.

| Transition / Scenario ID | Related Requirement / AC IDs | Screen / Flow | Trigger | From State | To State | Expected Visible Feedback | Service Scenario | Result / Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CHK-001 · TR-001 | REQ-001, AC-001 | Navigation | Load Agents page | — | — | `Chat` is the first item, above `Agents` | default | Pass |
| CHK-031 · TR-000 | REQ-020, AC-017, DEC-005 | Landing | Open `/` | — | New chat | Redirects to `/chat`; New chat heading and Chat box shown | default | Pass |
| CHK-002 · TR-001 | REQ-002 | Navigation → New chat | Click `Chat` | Agents | New chat | Composer shown and focused | default | Pass |
| CHK-003 | REQ-004, REQ-006, REQ-019, DEC-002 | New chat | Load | — | Default draft | No agent picker/chip; Temp workspace; last-used model (gpt-5.5 · Codex); effort shown; send disabled when empty | default | Pass |
| CHK-004 · TR-003 | REQ-005, AC-004, DEC-001, DEC-011 | Model menu | Open; hover runtime | Closed | Menu + submenu | Search, no Recent section, 5 runtime rows, width ≤320px, submenu with models | default | Pass |
| CHK-005 · TR-003 | REQ-005 | Model menu | Click Antigravity CLI | Menu | Submenu loading → loaded | "Loading models…" then models | default | Pass |
| CHK-006 | REQ-005 | Model menu | Click Grok Build | Menu | Submenu | Available runtime with its models | default | Pass |
| CHK-007 | REQ-005 | Model menu search | Type "opus" | Menu | Results | Matches from Claude SDK and AutoByteus with runtime labels | default | Pass |
| CHK-008 · TR-004 | REQ-005 | Model menu | Pick result | Results | Closed | Button shows model + runtime; default effort | default | Pass |
| CHK-009 | REQ-005 | Thinking control | Open, pick Low | Closed | Closed | Separate control updates to Low | default | Pass |
| CHK-010 · TR-005/006 | Skill tagging | Skill menu | `/sk`, Enter; `/`, `shell`, click; `/research`, click, × | Empty box | Chips | Prefix ranked first; bare `/` lists all; chips added/removed; typed `/q` removed | default | Pass |
| CHK-011 | REQ-004, AC-003 | Workspace menu | Open; pick folder | Temp | autobyteus-agents | Button and hint update | default | Pass |
| CHK-012 · TR-004 | REQ-005 | Model menu | Codex App Server row → gpt-5.5-codex | Menu | Closed | Runtime row opens its models; button shows the chosen model + runtime | default | Pass |
| CHK-013 · TR-002 | REQ-002, REQ-003, AC-002 | New chat → chat view | Send | Draft | Live chat | Title from message; run row selected in tree; chips on message; reply uses skills; sent-as tooltip text exact; returns to Idle | default | Pass |
| CHK-014 · TR-009/010 | REQ-011, DEC-006 | Chat run view → ⚙ | Open ⚙ while live; Terminate run in tree | Live | Offline, editable | Run view box has no model/thinking/footer; ⚙ shows "Stop this run before changing model settings."; after terminate "This run is stopped…"; status Offline; no divider notes | default | Pass |
| CHK-015 · TR-013 | REQ-012, DEC-007 | Chat run view right side | Panel open (shared default); collapse; strip Files/Terminal/Artifacts | Panel | Strip ↔ panel | Workspace frame: right column top ≤1px, header right ≤ panel left, header and tab bar bottoms aligned, resize handle; strip icons; each icon opens exactly its tab | default | Pass |
| CHK-016 | DEC-003, DEC-004 | Tree | Collapse panel; delete a stored chat | Panel | Strip; row removed | Panel collapse returns strip; no ⋯ menu; existing confirmation + toast | default | Pass |
| CHK-017 · TR-014 | DEC-007 (Option B) | Tree → chat view | Click chat run | — | Chat view | Opens that run in the chat view | default | Pass |
| CHK-022 | Addressing | Tree `+` | `+` on Daily Assistant; `+` on Codex; `/`; × | — | New chat drafts | No chip for Daily Assistant; Codex chip + workspace preset; `/` lists only Codex's skill; × reverts | default | Pass |
| CHK-025 | Skill tagging | New chat | Send tag only | Draft | Chat | Sent-as text is only the instruction; title from tag | default | Pass |
| CHK-026 · TR-007/008 | Addressing, team quick path | New chat → Team view | `@`, `prod`, Enter, send | Draft | Team view | Agents + Agent teams groups (no Daily Assistant); team chip; quick-path note; lands on `/workspace` with the team | default | Pass |
| CHK-027 | DEC-004 | Tree | Fresh New chat | — | — | Workspaces alphabetical; all collapsed | default | Pass |
| CHK-028 · TR-012 | REQ-014 | New chat → chat run view | Change workspace; toggle; send; new chat | Draft | Chat | On by default in any workspace; Ask first; run header has no agent/workspace/approval details; next chat on again | default | Pass |
| CHK-029 · TR-011 | REQ-013, AC-011, DEC-014 | New chat | Upload two files via the Context Files `+`; send | Draft | Chat | "Context Files (2)"; image thumbnail + file row + Clear All; send enabled by files alone; message lists Context files | default | Pass |
| CHK-030 | REQ-013, DEC-013 | Team member view | Open team run member | — | — | Unchanged product box: "Context Files (0)" row; no Chat footer, model or thinking controls | default | Pass |
| CHK-032 · TR-015/016 | REQ-011, REQ-016 | Chat run header | ⚙; change thinking; Save; back; ＋ | Run view | Settings → run view → New chat | Header has no duplicated details; product Agent Configuration (agent, fixed runtime/workspace, Auto approve tools); Save disabled until a change; saved; no thinking control in the box; ＋ opens New chat preset to agent + workspace | default | Pass |
| CHK-023 · TR-001 | REQ-001, REQ-002 | Navigation | Click pencil | Chat | New chat | Pencil on Chat item; no New chat row in the tree area | default | Pass |
| CHK-018 | REQ-007, AC-005 | Agents catalog | Click Agents | Chat | Agents | Catalog and Run buttons unchanged | default | Pass |
| CHK-019 | REQ-005 | Model menu | Open failing runtime; Retry | Menu | Loaded | Error + Retry recovers | `chat_catalog_error` | Pass |
| CHK-024 | REQ-005 | Model menu | Open | — | — | "Not installed", disabled, reason tooltip | `chat_runtime_unavailable` | Pass |
| CHK-020 | REQ-005, REQ-019, AC-016 | New chat | Load; open menu | — | — | No chats in tree; no last-used value → AutoByteus runtime default; no Recent | `chat_first_run` | Pass |
| CHK-021 | Responsive | New chat 390×844 | Load; open menu; drill in | — | — | No horizontal overflow; bottom sheet within viewport; drill-in list | default | Pass |

## Scenario Catalog

| Scenario ID | Purpose | Inputs / Setup | Mocked Boundary Behavior | Expected Product Outcome | Selection Method |
| --- | --- | --- | --- | --- | --- |
| default | Normal use | Synthetic chats, last-used Codex App Server · gpt-5.5-codex, 5 runtimes available | Catalog latency simulated | Full experience | No scenario key |
| `chat_first_run` | New user | No chats, no last-used value | — | Runtime default model; empty tree | `localStorage['autobyteus.prototype.scenario']='chat_first_run'` + reload |
| `chat_catalog_error` | Catalog failure | First Antigravity CLI load fails | Error then success on Retry | Error row + Retry recovery | `…='chat_catalog_error'` |
| `chat_runtime_unavailable` | Missing runtime | Grok Build disabled with reason | — | "Not installed" row | `…='chat_runtime_unavailable'` |
| desktop-app context | Voice available | Voice Input extension installed | Recording simulated | Mic before send | `localStorage['autobyteus.prototype.context']='electron_internal'` + reload |

## Unresolved Behavior

All product decisions are resolved (DEC-005, DEC-009, DEC-010, DEC-011, DEC-013, DEC-014). Remaining items are engineering boundaries, not product decisions:

| Requirement / Decision ID | Missing Or Ambiguous Behavior | Prototype Limitation | Required Product Decision |
| --- | --- | --- | --- |
| DEC-009 | Thinking parameters per runtime/model | Illustrative effort levels | None (schema-driven rule stated in spec) |
| DEC-010 | Daily Assistant provisioning | Fixture agent with all skills; not in the prototype Agents catalog fixture | None (engineering) |
| REQ-010 | Team run creation from Chat | Stand-in stored team run | None (engineering) |
| REQ-013 | Context Files upload in Chat | Prototype mirror of `ContextFilePathInputArea` with local files | None (reuse product component) |
