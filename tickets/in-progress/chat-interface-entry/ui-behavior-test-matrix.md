# UI Behavior Test Matrix — chat-interface-entry

Automated by `prototype/scripts/validate-chat-interface-entry.mjs` (headless Chromium, 1440×900 unless noted, en-US, UTC). Final run 2026-09-28: **30/30 pass, 0 browser errors** (1 known pre-existing baseline upload error classified separately). Evidence: `review-evidence/round-6/results.json` and screenshots.

| Transition / Scenario ID | Related Requirement / AC IDs | Screen / Flow | Trigger | From State | To State | Expected Visible Feedback | Service Scenario | Result / Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CHK-001 · TR-001 | REQ-001, AC-001 | Navigation | Load Agents page | — | — | `Chat` is the first item, above `Agents` | default | Pass |
| CHK-002 · TR-001 | REQ-002 | Navigation → New chat | Click `Chat` | Agents | New chat | Composer shown and focused | default | Pass |
| CHK-003 | REQ-004, REQ-006, DEC-002 | New chat | Load | — | Default draft | No agent picker/chip; Temp workspace; last-used model; effort shown; send disabled when empty | default | Pass |
| CHK-004 · TR-003 | REQ-005, DEC-001 | Model menu | Open; hover runtime | Closed | Menu + submenu | Search, 3 Recent pairs, 5 runtime rows, width ≤320px, submenu with models | default | Pass |
| CHK-005 · TR-003 | REQ-005 | Model menu | Click Antigravity CLI | Menu | Submenu loading → loaded | "Loading models…" then models | default | Pass |
| CHK-006 | REQ-005 | Model menu | Click Grok Build | Menu | Submenu | Available runtime with its models | default | Pass |
| CHK-007 | REQ-005 | Model menu search | Type "opus" | Menu | Results | Matches from Claude SDK and AutoByteus with runtime labels | default | Pass |
| CHK-008 · TR-004 | REQ-005 | Model menu | Pick result | Results | Closed | Button shows model + runtime; default effort | default | Pass |
| CHK-009 | REQ-005 | Thinking control | Open, pick Low | Closed | Closed | Separate control updates to Low | default | Pass |
| CHK-010 · TR-005/006 | Skill tagging | Skill menu | `/sk`, Enter; `/`, `shell`, click; `/research`, click, × | Empty box | Chips | Prefix ranked first; bare `/` lists all; chips added/removed; typed `/q` removed | default | Pass |
| CHK-011 | REQ-004, AC-003 | Workspace menu | Open; pick folder | Temp | autobyteus-agents | Button and hint update | default | Pass |
| CHK-012 · TR-004 | REQ-005 | Model menu | Click Recent pair | Menu | Closed | Pair restored in one click | default | Pass |
| CHK-013 · TR-002 | REQ-002, REQ-003, AC-002 | New chat → chat view | Send | Draft | Live chat | Title from message; run row selected in tree; chips on message; reply uses skills; sent-as tooltip text exact; returns to Idle | default | Pass |
| CHK-014 · TR-009/010 | DEC-006 | Chat view | Try locked control; Terminate run in tree; pick model | Live | Offline, unlocked | Lock + aria-disabled; click opens nothing; no Stop button in box; status Offline; runtime-only list; footer shows new model; no divider notes | default | Pass |
| CHK-015 · TR-013 | DEC-007 | Right side | Click Artifacts in strip | Strip | Panel | Strip icons (files, terminal, progress, usage, artifacts, vnc); panel opens on Artifacts; strip replaced | default | Pass |
| CHK-016 | DEC-003, DEC-004 | Tree | Collapse panel; delete a stored chat | Panel | Strip; row removed | Panel collapse returns strip; no ⋯ menu; existing confirmation + toast | default | Pass |
| CHK-017 · TR-014 | DEC-007 (Option B) | Tree → chat view | Click chat run | — | Chat view | Opens that run in the chat view | default | Pass |
| CHK-022 | Addressing | Tree `+` | `+` on Daily Assistant; `+` on Codex; `/`; × | — | New chat drafts | No chip for Daily Assistant; Codex chip + workspace preset; `/` lists only Codex's skill; × reverts | default | Pass |
| CHK-025 | Skill tagging | New chat | Send tag only | Draft | Chat | Sent-as text is only the instruction; title from tag | default | Pass |
| CHK-026 · TR-007/008 | Addressing, team quick path | New chat → Team view | `@`, `prod`, Enter, send | Draft | Team view | Agents + Agent teams groups (no Daily Assistant); team chip; quick-path note; lands on `/workspace` with the team | default | Pass |
| CHK-027 | DEC-004 | Tree | Fresh New chat | — | — | Workspaces alphabetical; all collapsed | default | Pass |
| CHK-028 · TR-012 | Auto-approve default | New chat → chat view | Change workspace; toggle; send; new chat | Draft | Chat | On by default in any workspace; Ask first; header shows it; next chat on again | default | Pass |
| CHK-029 · TR-011 | Unified box | New chat | 📎 two files; send | Draft | Chat | File chip + thumbnail + Clear all; message lists Context files | default | Pass |
| CHK-030 · TR-011 | Unified box | Team member view | Open run; model menu; 📎 file | — | — | No Context Files row; 📎, model, send in footer; "Runtime fixed"; file chip in chip row | default | Pass |
| CHK-023 · TR-001 | REQ-001, REQ-002 | Navigation | Click pencil | Chat | New chat | Pencil on Chat item; no New chat row in the tree area | default | Pass |
| CHK-018 | REQ-007, AC-005 | Agents catalog | Click Agents | Chat | Agents | Catalog and Run buttons unchanged | default | Pass |
| CHK-019 | REQ-005 | Model menu | Open failing runtime; Retry | Menu | Loaded | Error + Retry recovers | `chat_catalog_error` | Pass |
| CHK-024 | REQ-005 | Model menu | Open | — | — | "Not installed", disabled, reason tooltip | `chat_runtime_unavailable` | Pass |
| CHK-020 | REQ-005 | New chat | Load; open menu | — | — | No chats in tree; AutoByteus default; no Recent | `chat_first_run` | Pass |
| CHK-021 | Responsive | New chat 390×844 | Load; open menu; drill in | — | — | No horizontal overflow; bottom sheet within viewport; drill-in list | default | Pass |

## Scenario Catalog

| Scenario ID | Purpose | Inputs / Setup | Mocked Boundary Behavior | Expected Product Outcome | Selection Method |
| --- | --- | --- | --- | --- | --- |
| default | Normal use | Synthetic chats, recents, 5 runtimes available | Catalog latency simulated | Full experience | No scenario key |
| `chat_first_run` | New user | No chats, no recents | — | No Recent; AutoByteus default model; empty tree | `localStorage['autobyteus.prototype.scenario']='chat_first_run'` + reload |
| `chat_catalog_error` | Catalog failure | First Antigravity CLI load fails | Error then success on Retry | Error row + Retry recovery | `…='chat_catalog_error'` |
| `chat_runtime_unavailable` | Missing runtime | Grok Build disabled with reason | — | "Not installed" row | `…='chat_runtime_unavailable'` |
| desktop-app context | Voice available | Voice Input extension installed | Recording simulated | Mic before send | `localStorage['autobyteus.prototype.context']='electron_internal'` + reload |

## Unresolved Behavior

| Requirement / Decision ID | Missing Or Ambiguous Behavior | Prototype Limitation | Required Product Decision |
| --- | --- | --- | --- |
| OPEN-001 | Thinking control shape per runtime/model (on/off, budget, level) | Illustrative effort levels | Confirm schema-driven presentation |
| OPEN-002 / DEC-005 | Landing route | `/` still redirects to Agents | Land on Chat or Agents |
| OPEN-003 | Daily Assistant provisioning | Fixture agent with all skills | Built-in vs package agent |
| — | Team run creation from Chat | Stand-in stored team run | None (engineering) |
| — | Run-view attachment upload completion | Synthetic server gap (baseline) | None (engineering) |
