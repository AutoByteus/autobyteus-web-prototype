# Review Round 17 — no "Files are saved in …" line under the message box

User feedback: the line "Files are saved in the temp workspace · /synthetic/temp_workspace" repeats
the workspace the user just picked in the message box. Is it needed?

## Decision

No. The workspace control already names the workspace and shows its full path on hover (its
`title`). The workspace menu also lists each workspace's path. The line only repeated that.

## Changes

- New chat no longer shows the idle workspace line under the message box. This applies to every
  target: General Agent, agents, teams and orgs.
- The same spot still shows "Starting {name} on {runtime}…" while a run starts. That is the only
  feedback in that moment.
- For Team and Org, the members line ("All N members use these settings · Customize members") now
  sits directly under the message box.
- Removed the now-unused copy `chat.new.hintTemp` / `chat.new.hintWorkspace` (en, zh-CN).

## Requirement impact

This removes a line that ships in the product baseline (`ChatNewSurface` workspace hint). It is
routed with this package as a UI change. The path stays available as a tooltip on the workspace
control.

## Validation

- Browser at http://127.0.0.1:4520: Agent Teams → Run.
  - No `chat-new-hint` element and no "Files are saved" text.
  - The members line renders under the composer.
  - The workspace control's tooltip is `/synthetic/temp_workspace`.
- `pnpm test` 14/14; `vue-tsc` clean for changed files.
