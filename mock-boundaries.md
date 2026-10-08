# Mock And Isolation Boundaries

## Contract

The prototype preserves the exact observable current UI while replacing all production/external capability underneath it with deterministic local state. It uses only synthetic data, performs no production writes, needs no production credential, and can be reset per browser context.

| Production capability | Exact visible experience preserved | Local prototype implementation | Intentionally absent |
| --- | --- | --- | --- |
| GraphQL/REST catalogs and settings | Routes, records, loading/empty/error/permission states, validation, feedback and retry | Deterministic snapshots plus intercepted store actions | Apollo transport, API server, production schemas/URLs |
| Authentication and access | Trusted desktop, paired/unpaired/denied mobile presentation | Local context key and inert synthetic mobile-session record | Identity provider, token validation, production session |
| Node/window context | Node list/binding, Electron internal/external distinction, native-capability controls | Browser-local host registry/window fixture | Node process, IPC, real windows |
| Electron bridge | Extensions, Updates, native folder actions, embedded server status/logs/recovery and Browser tool | `install-host-scenario.js` installs deterministic `window.electronAPI` | Electron package/runtime/preload/native bridge |
| Embedded server lifecycle | Starting, ready, failure, log/details, restart, shutdown and recovery UI | Scripted status state and timers | Server child process, filesystem logs, destructive reset |
| Persistence | Locale/layout/scenario continuity and local UI mutations | Isolated `localStorage` and in-memory Pinia overlays | Database, durable customer writes |
| Agent/team execution | Catalog Run, workspace draft, launch readiness, chosen-workspace Team/member projection and member focus, conversation, streaming, activity/background tasks, messages, delegation, status, interrupt/error/recovery/history | Real presentation state with synthetic messages and scripted transitions; focused `launchDraft` creates one local deterministic context; enumerated local selection/focus actions mutate resettable reactive view state | Model/provider calls, run scheduler, production stream |
| Chat (New chat and chat run, 57df63f) | Composer menus (workspace, model, thinking, `/` skills, `@` targets), approval toggle, first send → `/chat?id=…` run view, run settings, reopening from the Workspaces tree | The source's own chat draft, send (`sendUserInputAndSubscribe`) and Edit Config code; `PrepareAgentRun` and reads answered locally by `utils/apolloClient.ts`; after a send, route snapshots are no longer re-applied to the run-owning stores | Run preparation, model inference, agent stream server |
| Projects and Tasks (0a32261) | List, create/edit/delete Project pages with existing or new-folder workspaces, Workspaces tab, Task board/search, create/detail/edit/delete Task pages, context files, validation and notices | The source's own `projects`/`projectTasks` stores; queries and mutations answered by `utils/apolloClient.ts` from one in-memory fixture copy; context-file uploads answered by the `fetch` boundary | Project/Task persistence, file storage, voice transcription |
| WebSocket streaming | Open/ready presentation and visible transitions | Local `EventTarget`-based `PrototypeWebSocket` | Agent/team/file/terminal/transcription servers |
| Files/workspace/viewers | Tree, viewer, context actions, create dialogs, attachment feedback | Synthetic `TreeNode` objects and text/media fixtures | Filesystem access, file watcher, production path |
| Terminal | Terminal tab/shell presentation and scripted output | Local view state | PTY/shell/command execution |
| Browser/VNC | Tabs, controls, device/view states and connection presentation | Host/browser fixture and view state | Browser automation host, VNC server/socket |
| Token usage/cost | Exact unavailable/populated presentation required by each controlled scenario | Synthetic local summary/error state | Billing store, usage ingestion, price service |
| Models/providers/tools/MCP | Catalogs, editors, required validation, save/delete/import feedback | Synthetic records and UI-local state mutations | Credentials, model calls, MCP processes/tools |
| Messaging | Provider/scope/binding/verification/recovery UI | Synthetic provider/account/binding state | Gateway, messaging transport, external account |
| Applications | Catalog/detail/setup/retry UI | Synthetic application and locally scripted response | Application server/iframe backend/orchestration |
| Packages/extensions/updates | Inventory, enable/disable/install/remove/import/update feedback | Local host/action fixtures | Download, installer, package or extension writes |
| Media | Categories, viewer and delete confirmation | Local synthetic SVG/text metadata | Media repository/storage |
| Icons/fonts/assets | Exact source visual assets and Monaco-backed viewers | Reused checked-in assets, local Iconify collections, and `/public/prototype-assets/monaco/vs` | Icon/font/editor CDN request |

## Enforcement Points

- `plugins/00.prototype-state.client.ts` selects snapshots, applies resettable overlays, retains only enumerated UI-local actions and replaces integration actions.
- `plugins/10.prototype-host-bootstrap.client.ts` installs host state before the UI initializes.
- `prototype/shared/install-host-scenario.js` is the Electron/window/server/update/extension/browser-shell adapter.
- `prototype/shared/apply-experience-scenario.js` builds deterministic agent/team/mobile UI objects, including the `workspace_team_launch` context/selection/tree projection, reactive focused-member state, and lifecycle state.
- `plugins/00.prototype-state.client.ts` directs the retained Monaco loader to
  the checked-in local mirror so ordinary review does not depend on jsDelivr.
- `utils/apolloClient.ts` is a no-network compatibility object.
- The prototype's `fetch` wrapper rejects external and API boundary requests; file/application responses needed for visible review are generated locally.
- The prototype replaces `window.WebSocket` with a local scripted implementation.
- `corepack pnpm validate:boundaries` checks that Electron/native/server/backend/Docker/packaging roots and dependencies were not copied and verifies the explicit request/WebSocket/reset boundary.

## Controlled Source Observation

An exact export of the pinned source is run against `prototype/source-observation/mock-node.mjs` only for parity evidence. That local server provides synthetic GraphQL/REST shapes, static media/application content, a controlled file-stream WebSocket, and the source-only `team_launch` create/resume execution tree. The evidence harness blocks non-loopback traffic and injects the same host scenario for Electron-visible source comparison. This observation adapter is not needed by the independently runnable prototype.

## Presentation Reuse Rationale

Exact source Vue components, pages, layouts, styles, localization and assets are retained because they are the smallest reliable way to preserve a 100% current UI appearance. Read-only store/view-model definitions remain where components consume their getters directly. A byte audit proves all 369 retained presentation files match the pin. Runtime behavior is nevertheless supplied by one prototype adapter and small fixtures; production clients/processes/contracts are not runtime dependencies.

This is high experience fidelity and deliberately low implementation fidelity—not a production frontend copy, Electron build, integration environment, or target architecture.

## Projects, Tasks and live-run `@` mentions (WEB-BASELINE-REFRESH-004)

Source `0a32261` shipped its own page-based Project/Task authoring and live-run
`@` mentions, replacing the accepted prototype versions. The prototype now runs
the source's own Projects stores and composer code unchanged:

- `utils/apolloClient.ts` answers the Project/Task queries and mutations,
  `CreateWorkspace`, runtime availability and `@` candidates from
  `prototype/source-observation/fixtures.mjs`. Saves update one in-memory
  copy per browser context; a reload resets it. The observation node uses the
  same fixtures, so both sides show the same scripted outcome.
- Task context-file uploads are answered by the prototype `fetch` boundary with
  a small synthetic file record (name, type, size of the chosen browser file).
  Nothing is uploaded or stored.
- Sending a message in a live run uses the source's own send path against the
  silent local stream. Adding a collaborator, its run, and the agents' replies
  are not simulated, exactly as in the source against the synthetic node. The
  earlier scripted local run (`prototype/run-mentions/`) was removed because it
  patched source files that the shipped version replaced.

## Skill sources, browse pages and run token usage (WEB-BASELINE-REFRESH-006)

- The source's own `skillSources` store runs unchanged; `utils/apolloClient.ts`
  answers the skill-source query and the import/check/update/remove mutations
  from one in-memory fixture copy per browser context. No repository is
  downloaded, checked or written.
- A task Agent's earlier event-monitor page is a small synthetic fixture
  (`GetAgentRunCollaborationMemberEventMonitorActiveTracePage`).
- The Token tab's run meter (`tokenUsageMeter`) now runs the source's own store
  for every run kind against the same synthetic usage summaries. The earlier
  prototype rule that made per-run summaries fail was removed because it no
  longer matched the source.

## Projects tab, Task roots, run settings and Reconnect (WEB-BASELINE-REFRESH-008)

Source `1cd1a3a` shipped the designs that earlier Product tickets had simulated
(run settings, Task-run cleanup, Project Manager live board and Temp tasks,
New chat Draft rows, native folder picker). Their design-era simulation layers
were retired; the source's own stores and components run unchanged:

- `prototype/source-observation/fixtures.mjs` (shared by the observation node and
  `utils/apolloClient.ts`) now answers path-only Project workspaces, Task roots
  (`root`: running, couldn't start, closed by DONE), `tasksWithoutProject`,
  `closed_task_executions`, "Archive all" (the archived runs leave this browser
  context's history until reload), and two more synthetic runtimes (Codex with
  thinking effort and Fast mode, Claude Agent SDK).
- The `/ws/projects` change feed opens on the local `PrototypeWebSocket` and
  stays silent: nothing changes Projects or Tasks behind the user's back.
- On the desktop the Workspaces history is loaded by the source's own
  `fetchTree` against the local fixtures, never from a route snapshot.
- A Team or Org started from New chat or the Org launch page opens its run
  through the retained scripted launch (`prototype/run-settings/`); nothing runs.
- The accepted design-only Reconnect change keeps its own fixture and simulation
  (`prototype/agent-reconnect/`, `plugins/97.agent-reconnect.client.ts`). The
  `autobyteus.prototype.designOnlyLayers=off` local-storage key, set only by the
  source-comparison scripts, turns its data off
  (`prototype/shared/design-only-layers.ts`).
