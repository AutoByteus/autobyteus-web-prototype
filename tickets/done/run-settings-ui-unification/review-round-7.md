# Review Round 7 — run-settings-ui-unification

User feedback (2026-10-04): "Uses its own tools and skills." is redundant; "Chat with General
Agent instead" is not needed either — keep the UI clean.

## Change

- Removed the agent description ("Uses its own tools and skills.") and the org description
  ("Your message starts this org.").
- Removed the "Chat with General Agent instead" link. Returning to General Agent is the existing
  New chat action (sidebar pencil next to Chat).
- Kept for the team: "Your message goes to the team’s coordinator." (says where the message
  goes) — open for the user to remove.
- General Agent keeps its `/` and `@` hint line.
- Heading is now: [avatar if any] Name; then, only when it adds information, one grey line.

## Round 7a (user: do we need "Your message goes to the team’s coordinator"?)

- Removed. The team conversation opens on the coordinator after sending, so the line added little.
- Agent, team and org headings are now the name only (with the avatar when one exists);
  General Agent keeps its `/` and `@` hint.
