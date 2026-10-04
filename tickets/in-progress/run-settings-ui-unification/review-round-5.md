# Review Round 5 — run-settings-ui-unification

User feedback (2026-10-04, paraphrased):
1. Chat talks to the general agent too, so the plain New chat should also show the agent's name in
   the middle, for one consistent experience whatever you start.
2. The team heading's "· 2 members" is extra text; the page should stay clean.

## Change

- The general agent (fixture name "Daily Assistant", illustrative) gets the same heading as any
  other target: initials avatar, name, "Agent". It keeps its own hint line ("All your skills are
  available. Type / to use a skill, or @ to chat with an agent or team.") and has no "Use the
  assistant instead" link. "What should we work on?" is no longer shown.
- Team heading kind line is just "Agent team" (no member count). Org stays "Agent org".

## Round 5a — General Agent name (user: "I think now it's called General Agent")

- Confirmed in the source: since `8a4177f` ("update built-in General Agent identity", on
  `origin/personal@278fc7e`), the built-in default chat agent `autobyteus-daily-assistant` is
  displayed as **General Agent** (`built-in-agent-registry.ts` displayName, `agent.md` name).
  The design baseline (pin `e9aa4a7`) predates this and still said "Daily Assistant".
- Design data updated to the current name (fixture agent name and instructions in
  `runtime-state.json`, `source-state-snapshots.json`, `source-observation/fixtures.mjs`;
  code comments as in the source). Heading now reads "GA · General Agent · Agent".
- The way back from a team/agent/org target now names it: "↶ Chat with General Agent instead"
  (source copy is still "Use the assistant instead"; this is a proposed copy change).

## Round 5b — no type line (user: "Agent" under "General Agent" is redundant; keep it clean)

- The type line under the name ("Agent" / "Agent team" / "Agent org") is removed for every
  target. Heading = avatar or icon, name, one description line; plus the "Chat with General
  Agent instead" link for non-default targets.
