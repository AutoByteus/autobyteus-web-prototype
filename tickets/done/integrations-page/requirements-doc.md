# Requirements Document — Integrations page (autobyteus-337)

## Document Status

- Status: `Ready for Approval`. DEC-001 and DEC-002 need the user.
- Current solution revision ID: `SR-001`
- Package identifier: `integrations-page`
- Request / ticket: Project Task `autobyteus-337`, Project `project_a1377344-25db-482a-97cc-ecfdb0fb495a`
- Requested by: `/project_task_manager` (run `project_task_manager_7c8dce0c4a8b44f88e776a83809dee03`), on the user's direction of 2026-10-30
- Requirements owner: Solution Designer
- Date: 2026-10-31
- Approved by and reference: not yet
- Behavior-defining supplements: the manifest contract `AutoByteus/autobyteus-integrations` `main` `8887475` `docs/integration-manifest.md` (delivered, read-only)

## Problem And Desired Outcome

- **Problem:** GitHub is set up in Server Settings, the skill is installed somewhere else (Skills → add a source), and access is a separate tick list. The user: "Why does the user have to go to a server setting to do the GitHub thing? … Each integration should handle their own configuration."
- **Desired outcome:** an **Integrations** page in the main menu shows one card per integration. On a card the user:
  - installs the integration, which installs its skill;
  - gives what it asks for: a token now, a sign-in later.

  Then he adds the integration's skill to any agent, the way he adds skills today, and that agent's runs can use the integration through the proxy.
- **Success:** on an isolated instance, a user opens Integrations, installs GitHub, pastes a token, adds the GitHub skill to an agent, and that agent's shell reaches GitHub through the proxy. The token is in no output or log.

## Relevant Current And Desired Behavior

| ID | Current (evidence: investigation) | Desired | Preserved |
| --- | --- | --- | --- |
| BEH-001 | The GitHub card is in Server Settings → Basics | Server Settings → Basics has no GitHub card; GitHub is on the Integrations page | The token stays in the vault; Test and Remove behave as today |
| BEH-002 | The skill is installed from Skills → add source | The card's Install adds the official integrations source (installing the skill) | Skills page source management unchanged (it lists the same source) |
| BEH-003 | Access = ticked on the card | Access = the integration's skill is among the agent's configured skills (DEC-002 for "all installed") | The proxy, run passes, routes and activity log unchanged |
| BEH-004 | No list of integrations | Cards from the official repository's manifests, with state | — |

## Scope Guardrail (Mandatory)

### In-Scope Use Cases

| ID | Use case |
| --- | --- |
| UC-001 | The user opens Integrations and sees the available integrations with their state |
| UC-002 | The user installs an integration from its card |
| UC-003 | The user connects it (token), tests it, removes it |
| UC-004 | An agent whose configured skills include the integration's skill gets the integration in its runs |

### Out Of Scope

- Jira and SSH integrations;
- sign-in flows (OAuth);
- third-party integration repositories (official only, 244 DEC-010);
- installing a single integration out of the repository (optional, later);
- uninstalling from the card (the Skills page keeps source removal, because one source holds every integration);
- installing prerequisite tools;
- the proxy's behavior itself.

### Non-Goals

None beyond the above.

### Preserved Behavior Boundary

autobyteus-311's AC-002…AC-008: the proxy, passes, routes, redaction, activity log, refusals and the loopback-only rule are unchanged.

### Prerequisites

None (autobyteus-311 step 1 is delivered).

### Review Authority

Standard.

## Requirements

| ID | Requirement | BEH | Priority | Feasibility | Source |
| --- | --- | --- | --- | --- | --- |
| REQ-001 | The main menu has **Integrations**. The page shows one card per integration available in the official repository `AutoByteus/autobyteus-integrations`, with the integration's name, description and icon (when present), read from its folder (`integration.json`, `icon.svg`) | BEH-004 | Must | N/A | User; manifest contract |
| REQ-002 | Each card shows one state: **Not installed** · **Installed, needs a token** · **Connected as @login** · **Needs a newer AutoByteus** (the repository has it, but this app can't deliver its credential yet, per DEC-001) | BEH-004 | Must | N/A | Task |
| REQ-003 | **Install** on a card installs the official repository as a skill source (or updates it if it is already installed). The integration's skill then appears in the skill catalog. The card then asks for the token, showing the manifest's `token.help` | BEH-002 | Must | Exists (skill sources) | User |
| REQ-004 | Connect, Test and Remove behave as the current GitHub card: the token is write-only, checked with GitHub before it is stored, never returned, shown or logged | BEH-001 | Must | Exists | 311 REQ-001 |
| REQ-005 | A run gets an integration's address and git redirection when its agent definition's **configured** skills include the integration's skill and the integration is installed. Whether agents with "all installed skills" also get it is DEC-002. Access is still checked on every proxied call, so removing the skill from an agent stops its next call | BEH-003 | Must | N/A | User; Task |
| REQ-006 | The per-agent tick list is gone (clean cut): its mutation, field and stored lists. Agents ticked before keep access only through their skill (DEC-005) | BEH-003 | Must | N/A | Task |
| REQ-007 | Server Settings → Basics no longer has the GitHub card | BEH-001 | Must | N/A | User |
| REQ-008 | Each card lists the integration's prerequisites with whether each tool is found on this node (`command -v`). Missing ones show as "missing" with no install action | BEH-004 | Should | N/A | Manifest contract |
| REQ-009 | When the official repository can't be reached and nothing is installed, the page says so with a Retry. Installed integrations still show from the installed source | BEH-004 | Must | N/A | — |
| REQ-010 | The card tells the user how to give agents access ("Add the *github-integration* skill to an agent"), linking to the agents page | BEH-003 | Should | N/A | User ("go to any agent like how they do now") |

## Acceptance Criteria

| ID | REQ | Trigger | Expected | Alternate | Verification |
| --- | --- | --- | --- | --- | --- |
| AC-001 | REQ-001, REQ-002 | Open Integrations on a fresh isolated instance | A GitHub card: name, description, icon if any, "Not installed" | Repository unreachable → message and Retry (REQ-009) | e2e on an isolated instance; web tests |
| AC-002 | REQ-003 | Install on the GitHub card | The source is installed; the skill is in the catalog; the card shows "Installed, needs a token" with `token.help` | A name clash → the error from the importer is shown | e2e |
| AC-003 | REQ-004 | Paste a token, Test, Remove | "Connected as @login"; the value is never in any response; Remove → "Installed, needs a token" | A rejected token → "GitHub rejected the token" | e2e with the test-vault token |
| AC-004 | REQ-005, REQ-006 | Add the GitHub skill to an agent; start a run; run `curl "$AUTOBYTEUS_GITHUB_API_URL/repos/<test repo>/issues/1"` | GitHub's answer; one activity record | An agent without the skill has no variables; removing the skill → the next call is `INTEGRATION_NOT_ALLOWED` | Live (gated) on an isolated instance |
| AC-005 | REQ-007, REQ-006 | Open Server Settings → Basics; check the API | No GitHub card; no agent-access mutation or field | — | Web and API tests |
| AC-006 | REQ-008 | Open the card on a node where one tool is missing | That tool shows as missing | — | Web and server tests |
| AC-007 | REQ-004, all | After AC-001…AC-004 | The token value is in no output, log, trace or file of the test | — | Scan |

## Relevant Scenarios

| ID | Kind | Goal | Steps | Outcome | Validity |
| --- | --- | --- | --- | --- | --- |
| SCN-001 | User | Set up GitHub | Integrations → GitHub → Install → paste token → Test → Agents: add the skill | The agent's runs use GitHub | Supported Normal Scenario |
| SCN-002 | User | A teammate on another node does the same | Same, on their node and with their token | Same | Supported Normal Scenario |
| SCN-003 | User | Stop an agent's access | Remove the skill from the agent, or Remove the token | Next call refused | Supported Normal Scenario |

## UI, Interaction, And Experience Requirements

- Applicable: Yes. A new page with cards in the app's existing card style; no Product Design round unless the user asks.
- Product decisions that need the user: DEC-001, DEC-002.

## Quality And Non-Functional Requirements

| ID | Area | Constraint |
| --- | --- | --- |
| QR-001 | Security | The token handling is unchanged from 311: write-only, vault only |
| QR-002 | Operability | Opening the page makes at most a few unauthenticated GitHub requests and works within GitHub's unauthenticated rate limit (results may be cached briefly) |

## Data Continuity

- `connections.json`: `login` and `connectedAt` are kept. `agentDefinitionIds` is no longer used (DEC-005).
- The vault entry is kept. Users of beta.4 stay connected.

## Decisions

| ID | Question | Why | Options | Reasoning and recommendation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DEC-001 | Who decides where an integration's token may be sent? | Security; how new integrations ship | (a) **The app**: each service has a definition in the app's code (hosts, how the token is added, the variables). A new service (Jira) needs an app release. (b) **The integration's `integration.json`**: it declares hosts and auth format, shown to the user when connecting; official repository only | (a) is today's design, and the manifest contract says so. It means a change in the GitHub repository can never send tokens somewhere new. The proxy also does things a simple declaration can't express safely: GitHub needs a different auth format for git than for the API, redirects are rewritten, git's URLs are redirected. With (b), anyone who can merge to that repository (or takes over an account that can) could add a host that receives every user's token on the next update. New integrations are rare, and betas ship often. **Recommend (a)**; revisit when there are many integrations. Under (a), a repository integration the app doesn't know shows "Needs a newer AutoByteus" | User | **Needs user** |
| DEC-002 | Do agents set to "all installed skills" get integration access automatically? | "Nothing is exposed automatically" | Yes / **No: only an explicitly configured skill grants access** | "All installed" agents would get every integration silently as soon as it's installed, against the user's rule. **Recommend No.** Such an agent gets access by switching to configured skills and adding the integration's skill | User | **Needs user** |
| DEC-003 | What does Install install? | The importer accepts a whole repository only | The official repository as one source, all its integrations' skills | Only GitHub exists today. Single-integration install is optional, later (RSK-001) | Solution Designer | Decided |
| DEC-004 | Uninstall from the card? | One source holds every integration | Not in this step: the card has Remove (token); source removal stays on the Skills page | Uninstalling GitHub would remove every integration's skill | Solution Designer | Decided |
| DEC-005 | Agents ticked on the beta.4 card | Clean cut | Their ticks are dropped; they keep access only if the GitHub skill is configured on them | The beta.4 card was used only by the user (and the integrations-1 test). The card states the new rule | Solution Designer | Decided (user informed) |
| DEC-006 | App definition's `displayName`/`description` | One fact, one owner (P11) | Removed; the manifest is the only source for name, description, token help and prerequisites | — | Solution Designer | Decided |

## Traceability

| REQ | UC | AC | SCN |
| --- | --- | --- | --- |
| REQ-001, REQ-002, REQ-009 | UC-001 | AC-001 | SCN-001 |
| REQ-003 | UC-002 | AC-002 | SCN-001 |
| REQ-004 | UC-003 | AC-003, AC-007 | SCN-001, SCN-003 |
| REQ-005, REQ-006, REQ-010 | UC-004 | AC-004, AC-005 | SCN-001, SCN-003 |
| REQ-007 | UC-001 | AC-005 | — |
| REQ-008 | UC-001 | AC-006 | — |

## Architecture Phase Input

- To verify:
  - how to read the official repository's folders before install, within the unauthenticated rate limit (UNK-001);
  - where an installed source's manifests are read from;
  - the effective configured-skill check at run preparation for team members and application-owned agents.
- Deferred to design:
  - the GraphQL shape for the page;
  - caching;
  - the card component structure.

## Readiness Check

- Content ready for approval: Yes. Waiting for DEC-001 and DEC-002.
- Approved basis ready for design: No.
