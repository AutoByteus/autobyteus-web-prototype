# Review Round 2 — run-settings-ui-unification

Review URL: http://127.0.0.1:4520 (ticket worktree, `corepack pnpm dev --port 4520`)

## User feedback (2026-10-04, paraphrased)

"Whether it's an agent, team or org, my usual journey is: pick workspace, runtime/model,
thinking, approval — and go. I rarely override members, and users are lazy too. The chat page's
way of setting this is already enough. But we need a way to bring up per-member/team advanced
settings from that simple chat page." Then: "just design it so I can experiment … I guess we're
going in the right direction."

## Round-2 design (experimental; supersedes round 1 for new launches)

- **Run opens Chat.** Every Run button (Agents list/detail, Agent Teams list/detail, Agent Orgs
  list/detail) opens New chat addressed to that agent, team or org (target chip in the
  composer). The composer footer is the run's settings: Workspace · Auto-approve · Model (+runtime)
  · Thinking. The first message starts the run.
- **Org is a Chat target** (new): building chip, "Your message starts {org}.", "Message {org}…".
- **Members, one quiet line under the composer** (team/org only):
  - default: "👥 All 5 members use these settings · Customize members"
  - customized: "● 1 of 2 customized · Edit · Reset"
- **Customize members** expands an inline "Member settings" list under the composer: one row
  per member ("Default settings"), placed Org teams as groups ("2 members") with their own
  workspace. A row opens the same Chat controls; inherited values are muted ("Default"), own
  values get "Reset"; per-row reset icon and "Reset all". Members customize Model (+runtime),
  Thinking, Tool approval (DEC-002 proposal unchanged).
- Saved-run settings (⚙) keep the round-1 view (same vocabulary, locked values, Save on change).

## Validated (1440×900; 390×844 for the composer + member list)

- Agent → Run → /chat with the agent chip → send → agent run opens (`/chat?id=…`).
- Team → Run → customize `writer` to GPT-5.6 Sol (Codex) + Thinking High → line shows
  "1 of 2 customized" → send → Team run created and opened; launch draft carried the writer
  override.
- Org → Run → /chat with Org chip → members list shows Research Assistant + Product Review Team
  (2 members, own workspace) → send → same Org view as the baseline Org Run.

## UI reference simplifications

- A Team started from New chat launches its draft through the source's launch path; the first
  message itself is not played back (plugin stub). Org launch uses the Org launch path; delivering
  the first message to an Org is a production concern.
- Orgs are not offered in the `@` target menu (only via Run) in this round.

## Requirement impact to route at completion (pending user confirmation)

- Run from Agents/Teams/Orgs no longer opens a run-config form; a run starts with a first
  message (UNK-003).
- Agent Orgs become New chat targets (UNK-002), including member/placed-team overrides at launch.
