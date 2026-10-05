# Review Round 9 — run-settings-ui-unification

User (2026-10-05, confirmed): "no matter in what agent … the @ itself is always the current agent
… sending a message to the target agent … then the behaviour will be consistent"; "The @ will
always behave the same, basically bring in the collaborator, right?" — yes; "please do updates …
so that the behaviour is consistent now."

## Change (New chat)

- `@` always brings a collaborator in; it no longer changes who you talk to. Who you talk to is
  set by how the chat started (Run on an agent/team/org, or New chat for General Agent).
- The `@` menu is the running-conversation menu: header "Bring into this run @…", footer
  "{name} gets your message and brings them into this run" ({name} = the agent, the team's
  coordinator, or the org). The agent or team already being addressed is not offered; Orgs are not
  offered (as in running conversations).
- Choosing inserts `@Name` as the same single native inline highlight as in a running conversation
  and records the mention on the draft.
- General Agent hint: "All your skills are available. Type / to use a skill, or @ to bring in an
  agent or team." (zh-CN updated). Placeholder unchanged.
- Sending starts the run and the first message carries the mention (the source previously dropped
  mentions on a new run's first message).

## Validated (1440×900)

- New chat (General Agent): `@` menu with relay footer; Research Assistant inserted inline; heading
  stays General Agent; send opens the General Agent run with the `@Research Assistant` chip on the
  sent message.
- New chat (Product Review Team): team not offered; footer "researcher gets your message…".
- Tests 14/14, lint pass; ticket-owned files typecheck clean.

## UI reference simplification

- The synthetic message stream now accepts any send that carries `@` mentions (scripted
  admission); no reply is played, as before.

## Requirement impact (to route at completion)

- `@` semantics change on New chat (bring in, not retarget) — reverses the approved chat-entry
  behaviour where `@` switched the target.
- A new run's first message must carry `@` mentions and bring the collaborator in.
- Team/Org New chat: the coordinator/Org receives the first message and brings the collaborator in.
