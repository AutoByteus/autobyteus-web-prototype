# Requirement Impact Findings — AgentOrg Handoff UI

## Resolution

- Package: `AORG-FLAT-TEAM-001`
- Finding: `RIF-AORG-001`
- Original outcome: `Requirement Impact`
- Resolved by: approved `RER-012`, commit `658d602a1`
- Product response: implemented in unapproved `RV-009`; browser validation passes `55/55`

## Clarification Received

Requirements Engineering confirmed one Handoff as one ordered From Agent, one
eligible To endpoint, and one or more ordered natural-language When conditions.
It also confirmed endpoint eligibility, Team versus Org ownership, Team
destination coordinator resolution, CRUD/reorder/cancel, validation, atomic
save, duplicate/self-resolution rejection, and explicit stale-member
resolution.

Relevant IDs are `BEH-003`; `REQ-006`, `REQ-019`–`REQ-023`; `AC-003`,
`AC-014`–`AC-018`; `SCN-003`, `SCN-008`; `DEC-007`–`DEC-010`; and
`ORG-CASE-032`–`ORG-CASE-042`.

## RV-009 Product Treatment

- Detail cards expose only From, To, exact addresses, and ordered When.
- Aggregate Handoff/condition counts, type badges, same-definition copy, and the
  repeated `Via coordinator` endpoint block are removed under explicit user
  feedback.
- A referenced Team's coordinator remains visible and inspectable through its
  adjacent member card and Team detail rather than being repeated in every
  Handoff.
- Org and Team-local editors implement the required interactions and
  validation; unavailable endpoints remain visible and block full save.
- Exact entry selection continues through the accepted Agent/Team run configuration and runtime surfaces; it does not introduce a competing runtime model.

No unresolved requirements gap remains for construction. The visual and
interaction treatment remains pending explicit user approval.

---

## New Requirement Impact — `RIF-AORG-002`

### Outcome

- Outcome: `Requirement Impact`
- Status: `Open — canonical reconciliation required before Product changes launch behavior`
- Trigger: explicit user rejection of the validated RV-009 pre-launch exact-entry selector
- Prototype evidence: `review-evidence/rv-009/REV-AORG-RV9-006-agent-org-exact-entry-launch.png` and the live `launch=1` state

### User Feedback

The user states that the current AgentOrg launch is incorrect. AgentOrg should,
like AgentTeam, go directly to configuration. After the Org is launched, the
user should use the left sidebar to focus the Agent or Team they want to
communicate with. A separate exact Agent-or-Team selection before configuration
is considered redundant and wrong.

### Observed Candidate Versus Requested Direction

| Alternative | Observable behavior | Current standing |
| --- | --- | --- |
| RV-009 exact-entry selector | Run opens a modal; one exact Agent/Team must be selected; the selected type then opens its accepted configuration | Rejected by user |
| Unified configuration with embedded entry selector | Configuration opens directly but still requires an entry before run | Explored verbally; does not fully reflect the user's latest focus-after-launch direction |
| Org configuration then focus after launch | Run opens one AgentOrg configuration; launching creates the Org scope; the user focuses a member in the left sidebar before communicating | User-requested direction; not implemented pending requirements reconciliation |

### Approved Contract Conflict

The requested direction materially affects approved `RER-012` semantics:

- `BEH-004`, `REQ-004`, and `DEC-002` currently require an exact mounted Agent
  or Team target on launch or interaction.
- `REQ-019` explicitly requires prototype evidence for an exact Org entry
  selector.
- `AC-002`, `SCN-002`, and `SCN-007` treat exact entry selection as part of the
  launch journey.
- `ORG-CASE-009`–`ORG-CASE-011` require an exact target for a
  recipient-requiring action and reject guessing/fallback.

The feedback does not request an Org coordinator or first-member fallback. It
instead separates **Org activation/configuration** from **post-launch focus and
recipient selection**. Requirements Engineering must clarify whether launching
an Org is itself recipient-requiring, how Org-wide launch configuration applies
to its Agent and Team members, and when exact focus becomes mandatory before the
first message.

### Required Canonical Decision

1. Does AgentOrg launch activate the full Org scope without choosing an initial
   Agent/Team recipient?
2. Is exact member focus required only when the user sends the first message or
   performs another recipient-requiring interaction?
3. Does one Org launch-configuration surface apply defaults to all direct Agents
   and referenced Teams, while preserving per-member overrides and Team
   coordinator ingress?
4. Which parts of `REQ-004`, `REQ-019`, `AC-002`, `SCN-002`, `SCN-007`, and
   `DEC-002` must be revised without introducing an Org coordinator or implicit
   recipient fallback?

Product Prototyper will not silently replace the approved exact-entry contract.
RV-009 remains durable historical review evidence, but its launch selector is
not approved and must not become normative.
