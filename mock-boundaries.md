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

## Cancelled Task status (delegated-copy-task-locator, mixed pin)

The Projects Task-status surfaces follow `origin/personal@ff227eb`; everything
else stays at `1cd1a3a`. The source's own boards, Task pages, right-panel Task
view and `taskStatusPresentation.ts` run unchanged:

- `fixtures.mjs` adds one CANCELLED Project Task (`task-retire`, closed agent
  root) and one CANCELLED Temp task (`temp-task-faq`). Both are invented. Open
  counts leave Done and Cancelled out, as the source does.
- The "Cancelled (N)" toggle is local component state in the source code. It
  starts off on every visit. Deleting the only Cancelled Project Task (an
  in-memory change, reset on reload) shows a board with no toggle; the empty
  scenario shows the same for Temp tasks.
- A Projects sub-page in a non-default scenario takes that scenario's captured
  `/projects` shell (`plugins/00.prototype-state.client.ts`); the Projects and
  Task stores still load through the source code.
- Status changes stay agent-only, so the board changes status only through the
  silent change feed. The UI offers no control that sets status.

## Whole-frontend refresh to `73f7432` (WEB-BASELINE-REFRESH-009)

The mixed pin ends: every surface follows `origin/personal@73f7432`. The source
shipped three accepted design-only changes (delegated-copy Task locator,
collapsed-left-panel Workspaces strip icon, skill sources dialog). Their source
versions now run unchanged; the design-only code was removed. New server data is
answered from invented fixtures:

- `GetTaskWorkerTasks`: a Task worker's current Task is the open Task it is the
  root of (the latest one when none is open), computed from the in-memory
  Project and Temp task copy. The Workspaces tree's Task summaries and "Show Task
  in Projects" run the source's `taskWorkerTaskStore` and `taskLocatorStore`.
- `GetDefinitionProblems`, `loadIssue` / `loadIssues` and
  `AgentPackage.autoRefresh`: empty in the default scenarios; the
  `definition_issues` scenario has invented parse errors, a missing package
  folder, a Team member with no working version and unusable definitions with a
  dependency chain. `ReloadAgentPackageDefinitions` answers `true`.
- The `/ws/agent-package-definitions` feed opens on the local
  `PrototypeWebSocket` and stays silent, like `/ws/projects`.
- Member launch defaults: the Documentation Writer's default names a model the
  node does not offer, so a fresh Team start shows its "can't be used" note.
- Delegated launches: the stored Agent run's collaborators and Task workers carry
  launch sources (Agent default, Team default, Inherited with a skipped default,
  and Source not recorded).
- Token meter summaries report an auto-compaction threshold. The "Compacted —
  updates on the next model call" note is live-session state; no scripted
  compaction plays in the baseline (comparison scripts apply it through the
  source's own store on both sides).
- `agy_signed_out`: the Antigravity CLI is listed but unavailable with a
  sign-in reason.

Design-only layers kept (off with `autobyteus.prototype.designOnlyLayers=off`):
Reconnect (`prototype/agent-reconnect/`), the delegated-copy example data
(`prototype/delegated-copy-tasks/`, `plugins/98.delegated-copy-tasks.client.ts`;
its Tasks now answer `GetTaskWorkerTasks` through the same rule), and the skill
sources example data (`prototype/skill-sources/`).

## Refresh to `9227d61` (WEB-BASELINE-REFRESH-011)

The source shipped two approved designs, "part of" (`task-part-of`) and the
Embedding section (`search-model-settings`); their source versions run
unchanged. The design-only search-settings simulation (`prototype/search-settings/`
and the design's own Search components) was removed: it was an implementation of
the design's components, not example data on the source's API. New server data is
answered from invented fixtures (`prototype/source-observation/embedding-fixtures.mjs`,
shared by the observation node and the baseline):

- Embedding: the three catalog models and sizes are the design's invented catalog.
  The node's state lives in memory per caller and resets with the scenario. Work
  (downloads, the active model's preparation, one indexing Project at a time)
  moves one step per status or search read, so both sides advance alike; nothing
  runs in the background. Index-only extra Projects in `embedding_busy` and
  `embedding_many` exist only in the index list (invented names and counts).
- Meaning search: `SearchProjectTasks` answers exact substring matches first, then
  Tasks sharing a four-letter word prefix as "related by meaning"; its status follows
  the active model (preparing, unavailable).
- Part of: the base Prototype Launch Tasks `prototype-launch-3`, `-4` and `-5` are
  parts of `prototype-launch-1` (one in progress, one done, one cancelled).
- Bulk MCP import: an entry without `url` or `command` fails with an invented
  reason; a result with failures is not a success. The source's store action runs
  against the local answer.
- Delegated copies: every Team copy member records its launch and `followsTeam`
  (35675e3); a test checks the stored run's views against the pinned contract.
  Copy file-change reads answer empty lists.
- A scripted read failure (`embedding_load_failed`) answers a GraphQL error.

## Refresh to `2f21134` (WEB-BASELINE-REFRESH-010)

The source shipped the accepted design-only Task keys and "depends on"
(`task-keys-and-dependencies`, `task-keys-off-lists`); their source versions
run unchanged. New and changed server data is answered from invented fixtures:

- Project Tasks carry `taskKey` (`prototype-launch-N`, numbered per Project in
  creation order; a new Task gets the next number) and `dependsOnTaskIds`
  (Blocked by with "+1", Dependency cancelled, and only-Done dependencies are all
  present on the Prototype Launch board). Saves store the chosen dependencies;
  a deleted Task leaves its dependents' lists. The key rule lives in
  `fixtures.mjs`; the task-keys example layer reuses it.
- Collaborators are gone from every execution tree (the source removed them):
  the stored run's former collaborator Team is an open delegated copy Team with
  launch sources; Teams are flat (no Team inside a Team).
- Delegated copies: `DelegatedLaunchModelOptions` answers the stored run's copies;
  `UpdateDelegatedLaunchSelections` records the user's choice in this context's
  memory (reset with the scenario) and later reads carry it as
  `userLaunchSelection`; `StopDelegatedExecution` answers "already stopped" for the
  stored run and "stopped" in `live_runs`. The stored Agent run's own settings are
  editable, so a stopped copy's model can be changed.
- `live_runs` scenario: the stored Research Assistant run and the stored Product
  Review Team run are live. Their streams (`/ws/agent-collaboration/…`,
  `/ws/agent-team/…`) answer with one synthetic snapshot each, played by the
  observation node and by the baseline's local WebSocket from the same module
  (`prototype/source-observation/live-streams.mjs`): a running copy, a copy Team
  with an agent in error, and a busy Team run. Nothing changes after the
  snapshot; a Stop does not make the copy offline (no stream event follows).
- The stored run's conversation ends with a platform skill update notice
  (replayed history).
- The TPS value is live-session state (each model call's measured TPS on the
  stream); the baseline plays no model calls, so the card shows "—" until one is
  reported. Comparisons apply a report through the source's own store.
- Local mutations answer after 40 ms and replaced store actions after 40 ms
  (longer than a rendering frame), so a control disabled while it waits loses
  focus exactly as in the source.

Design-only layers kept (off with `autobyteus.prototype.designOnlyLayers=off`):
Reconnect (its former collaborator `/tutorial_video_producer` is now two delegated
copies of the same agent; its `/post_production` sub-team was removed because
Teams are flat), the delegated-copy example data, the task-keys example data
(AutoByteus and Customer Onboarding Projects) and the skill sources example data.

## Notification Center, Agent Runtimes and Remote Collaboration (WEB-BASELINE-REFRESH-012)

Source `9e7a458` shipped the approved `settings-update-notifications` and `runtime-lifecycle-review` designs and added Remote
Collaboration. Their design-only simulations (`plugins/99.update-notifications.client.ts`, `components/settings/AiRuntimesManager.vue`,
`prototype/ai-runtimes/`) were removed; the source's own components, stores and composables run unchanged:

- `prototype/source-observation/node-settings-fixtures.mjs` (new) is the node-side state, one in-memory copy per browser context,
  reset with the scenario. The observation node and `utils/apolloClient.ts` answer from it alike. It holds the update notifications
  (and their read, handled and cleared states), the "Update checks" switch, the four agent runtimes (checks, updates and sign-ins move
  one step per `AgentRuntimes` read) and the Remote Collaboration switch and peers. The package and skill source updates run the
  source's existing mutations (`UpdateAgentPackage`, `UpdateGitHubSkillSource`), which also mark the notification handled.
- The `/ws/update-notifications` feed greets each connection with `{"type":"connected"}` (the window reads its notifications on it);
  the baseline's local WebSocket plays the same greeting.
- The desktop shell's app-update record (`notification`, read, clear) and a Download that plays progress in steps live in
  `prototype/shared/install-host-scenario.js`, used by the source comparison and by the baseline alike.
- Absent: real update checks, downloads and installs, runtime updaters and logins, and contacting peer nodes.

## Remote Collaboration offers (remote-nodes-page)

| Boundary | UI reference behavior | Production behavior required |
| --- | --- | --- |
| A peer's Agents and Agent Teams, and its state | `stores/remoteCollaborationOffersStore.ts` answers from `prototype/remote-collaboration/offersScript.ts` after a scripted delay (0.8 s to 20 s); invented names, descriptions and delays | This node's server asks the peer; the window never contacts it; only name, kind and description travel |
| Peer refusal reasons | Four scripted codes mapped to localized sentences | The server's refusal code (REMOTE_COLLABORATION_OFF, PEER_NOT_REGISTERED, PEER_UNREACHABLE, PEER_IDENTITY_MISMATCH) |
| Timing | Scripted `setTimeout`; no polling | Each peer bounded by the 20 s request bound; asked on open, on add and on Refresh only |
