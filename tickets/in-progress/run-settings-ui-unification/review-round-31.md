# Review Round 31 — SR-003: Org launch page; Orgs are not chat targets; Terminate/Stop wording

Request: Solution Designer, `product-design-request-r2.md` (SR-003, Result Correction). The user
decided that an Agent Org has no coordinator or recipient (`autobyteus-web/docs/agent_orgs.md:56`,
`:192-211`), so:

- an Org cannot be started from chat;
- `@` lists only Agents and Agent Teams on every surface;
- Orgs start from Agent Orgs → Run, or "+" on an Org run, on a short Org launch page (option A).

Everything else stays approved.

## Intake

- Both repositories were fetched. Design `origin/personal` = `b8ce240` (unchanged). Source
  `origin/personal` = `02d6ddf` has no `autobyteus-web` change since pin `10fb695`, so no baseline
  refresh is needed.
- The ticket was reopened (`tickets/done` → `tickets/in-progress`) on branch
  `design/run-settings-ui-unification` (= `b8ce240`) in a fresh worktree.

## Org launch page (new)

- **Route:** the product's existing Org launch route,
  `/workspace?rootSubjectKind=agent_org&definitionId=…&mode=configuration`, plus
  `&sourceOrgRunId=…` for "+".
  - Agent Orgs → Run (list and detail) and "+" on an Org run navigate there, as in the product
    before this ticket.
- **Layout:** the same composition as New chat, with a settings card where the message box would be:
  - the Org name as the heading, in the same place and size;
  - a white settings card with Workspace / Model / Thinking / Tool approval, using the chat controls
    and the saved-run row style, but editable;
  - the card footer: a status text on the left and **Run Agent Org** (indigo) on the right;
  - the same members line under the card ("All N members use these settings · Customize members" /
    "● n of N customized · Edit · Reset") and the same Member settings drawer, with placed teams
    (+ workspace), their members, and direct agents.
- **Default model:** the Org's default launch config, else the last model used in chat, else the
  default runtime's first model (the same last step as New chat).
- **States:**
  - **Default.**
  - **Customized:** "1 of 11 customized".
  - **Model missing:** amber "Choose a model to start."; Run disabled.
  - **Runtime unavailable:** the existing chat copy.
  - **Launching:** spinner + "Starting {Org} on {runtime}…"; settings locked; Run disabled.
  - **Launch failed:** red "Couldn't start this Agent Org. Try again."; the page and values are
    kept; Run re-enabled.
  - **Org unavailable:** the heading + "This Agent Org isn't available. Choose another Agent Org." +
    "Back to Agent Orgs".
  - **"+" prefill:** "Copying the run's settings…" while it reads; then the run's workspace,
    approval, model+thinking and member overrides.
- **On success:** the Org run view (`mode=active`), where the user chooses an exact Agent or Team, as
  today.

## Orgs removed from chat

- The `ChatTarget` `org` variant, the New chat Org heading, placeholder and members line,
  `launchOrgChat` and the Org readiness branch are removed. `chatDraftComposerTarget` is restored to
  the product's file.
- `useStartRunInChat.runOrg` / `runOrgFromRun` are removed.
- Copy removed: `chat.new.placeholderOrg`, `chat.launch.orgUnavailable` (en, zh-CN).
- `@` lists only shared Agents and Agent Teams (`useChatComposerOptions.targetOptions`, unchanged).
  The footer names the agent, or the team's coordinator.

## Stop wording on the saved-run page (user's choice)

| Kind | Tooltip / aria | Pending | Failure |
| --- | --- | --- | --- |
| Agent | "Terminate run" (tree key) | "Terminating…" | "Couldn't terminate this run. Try again." |
| Team | "Terminate team" (tree key) | "Terminating…" | "Couldn't terminate this run. Try again." |
| Org | "Stop Agent Org" (tree key) | "Stopping…" | "Couldn't stop this org. Try again." |

## Small fix

At 390 px the workspace page keeps its side strips, so the card is narrow. "Auto-approve" broke onto
two lines, so the approval label is now `whitespace-nowrap` (in `ChatApprovalToggle`; harmless
elsewhere).

## Implementation notes (UI reference)

- `components/run-settings/memberSettingsSource.ts`: the members line and drawer read a small source
  (target, defaults, member settings, setters). Team New chat and the Org page each provide one.
  - The parameter is named `mutators`: the product's Nuxt auto-import list maps a free `actions`
    identifier to `agentRunStore`.
- `stores/orgLaunchDraftStore.ts` (design reference store).
  - Design-only states:
    `localStorage['autobyteus.design.runSettings.orgLaunchState'] = 'launch_failed' | 'unavailable'`
    (set it, then reload).
  - `orgLaunchDraft.launch` is allowed through the prototype plugin's action stubs.
- `components/run-settings/OrgLaunchPage.vue`; `WorkspaceAdaptiveLayout` renders it for
  `mode=configuration`.

## Validation (http://127.0.0.1:4520)

- Agent Orgs → AutoByteus Org → Run → the Org launch page (default state, 11 members).
- Member panel: "Member settings · AutoByteus Org"; a team's approval change → "Customized", and
  the line shows "1 of 11 customized".
- Run Agent Org → the Org run view (`mode=active`).
- Launching, launch-failed and unavailable states render as specified.
- "+" on the stored Product Launch Org run → the page prefilled (prototype-workspace, Ask first,
  3 members).
- Team Run → New chat for Product Review Team (unchanged).
- Running Team settings: stop tooltip "Terminate team"; stopping → "● Stopped".
- 390 px (fresh frame): no overflow; "Auto-approve" stays on one line.
- Checks:
  - `vue-tsc --noEmit` reports 0 errors;
  - `pnpm test` 14/14;
  - `pnpm lint` passes;
  - en and zh-CN keys match;
  - no leftover chat-Org references.

Evidence: `review-evidence/round-31/R31-01..04`.
