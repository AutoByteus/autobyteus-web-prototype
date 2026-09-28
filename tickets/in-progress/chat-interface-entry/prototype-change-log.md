# Prototype Change Log — chat-interface-entry

Base: accepted prototype `5ae0fe1` (source pin `origin/personal@fcd3e83a4ca931ba52ed19bd37b8df3050ee529e`).
All entries are **proposals under user review** (round 1). Nothing here is approved yet.

| ID | Kind | Change | Related IDs | Preserved behavior |
| --- | --- | --- | --- | --- |
| PC-001 | Addition | `Chat` is the first primary-navigation item, above `Agents` (icon: chat bubbles). The left-panel collapse control moves with the first item. | REQ-001, AC-001 | All existing nav items, order and routes unchanged below Chat |
| PC-002 | Addition | `/chat` New chat: heading "What should we work on?", a large composer with Agent, Workspace and Model pills plus Send. Enter sends; Shift+Enter adds a new line. | REQ-002, REQ-004, SCN-001, SCN-003 | — |
| PC-003 | Change | Initial primary-nav/section split grows by one 40px row so `Memory` stays visible with the added `Chat` row. | REQ-001 | Split remains user-resizable and persisted as before |
| PC-004 | Addition | Combined runtime + model picker (DEC-001). The pill reads `Runtime / model · effort`. The popover has: cross-runtime search; Quick picks (pinned ★ first, then recent); a runtime rail (model count, loading spinner, error ⚠, `Off` for unavailable, blue dot for the current runtime); the chosen runtime's models grouped by provider, with a pin star; and Reasoning effort for models that support it. Unavailable runtimes show their reason and link to runtime settings. Catalogs load per runtime on demand; search loads enabled catalogs and lists unavailable runtimes as "Not searched". | REQ-005, AC-004, SCN-002, DEC-001, RSK-001 | Only enabled runtimes selectable; per-runtime catalogs; provider grouping |
| PC-005 | Addition | On `/chat` the left panel's lower section shows `New chat` plus a `Chats` list grouped Today / Yesterday / Previous 7 days (running dot, age, hover delete). Other routes keep the Workspaces tree. | UC-004, DEC-004 | Workspaces tree unchanged on all non-chat routes |
| PC-006 | Addition | Active chat: a simplified view with a header (agent, title, workspace, Running state), a centered conversation (existing message styling) and a bottom composer with a model pill. Files/Terminal/Activity are hidden by default and open on demand as a right panel. | REQ-003, DEC-007 | Message avatars/typography follow the existing conversation |
| PC-007 | Addition | Mid-chat model switching: runtime fixed for the chat, model and effort switchable (matches source existing-run model replacement); a divider note "Model switched to … It applies from the next message." Other runtimes explain "is for new chats". | DEC-006 | Run runtime lock preserved |
| PC-008 | Addition | Agent pill (DEC-002): choose among agent definitions; defaults to the last-used agent (Daily Assistant initially). An agent's `defaultLaunchConfig` is applied to the model pill with a hint; otherwise the last-used runtime/model is kept. | REQ-006, DEC-002 | Agent definitions unchanged |
| PC-009 | Addition | Workspace pill: Temp workspace (Default badge), your workspaces, "Open another folder…" with path validation. Workspace is fixed after the first message and shown in the header. | REQ-004, AC-003 | Temp workspace `temp_ws_default` semantics |
| PC-010 | Addition (proposal for DEC-003) | Chat ⋯ menu → "Save setup as agent…" dialog previewing name, base agent, skills and default model. Prototype-only toast; scope pending user decision. | DEC-003, SCN-004 | — |

## Simulation boundaries

- Chat state, catalogs, streaming replies and created agents are browser-local synthetic fixtures (`prototype/chat/chat-fixtures.ts`, `composables/chat/usePrototypeChat.ts`). No production run, catalog, GraphQL or stream protocol is reproduced.
- Model names, descriptions, providers, workspace paths, chat titles and reply text are **illustrative**.
- Scenarios: default; `chat_first_run` (no chats/recents/pins); `chat_catalog_error` (first Antigravity CLI catalog load fails, Retry recovers).
