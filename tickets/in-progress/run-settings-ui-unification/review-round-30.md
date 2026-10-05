# Review Round 30 — self-validation before finishing

User request: self-validate the whole ticket for consistency, then finish if it is consistent.

## Repositories

- Design: fetched; `origin/personal` = `b4f3ed1` (unchanged). The ticket branch contains it.
- Product: fetched; `origin/personal` = `02d6ddf`. There is no `autobyteus-web` change since the baseline
  pin `10fb695`, so no baseline refresh is needed.

## Static checks

- `vue-tsc --noEmit` (whole app): 0 errors.
- `pnpm typecheck`, `pnpm test` (14/14) and `pnpm lint` all pass.
- Copy:
  - `runSettings` and `chat` keys are identical in en and zh-CN.
  - Every `runSettings` key in use exists.
  - Found and fixed: 32 unused `runSettings` keys left from removed UI, and 2 unused `chat` keys,
    are deleted. The missing zh-CN `chat.new.placeholderOrg` and `chat.launch.orgUnavailable` are
    added.
  - The unused `kindLabel` / `subtitle` heading fields are removed from `ChatNewSurface`.

## Browser checks (http://127.0.0.1:4520, clean localStorage)

| Area | Result |
| --- | --- |
| New chat: General Agent, Agent, Team, Org | Same heading, the same three controls, no workspace line; members line only for Team/Org (2 and 11 members) |
| Placeholders | General "Ask anything · / for skills · @ for an agent or team", agent "Ask X anything…", team/org "Message X…" (product copy; Org follows Team) |
| Member panel (Team) | Antigravity model on writer → "Customized · Gemini 3 Pro · Antigravity · Auto-approve", Tool approval locked ("Antigravity always runs with auto-approve."); line "1 of 2 customized · Edit · Reset"; model menu stays inside the panel; reset per member; Escape closes the panel |
| `@` | The current team is not offered; `@Res` + Enter inserts "@Research Assistant " |
| Team start | Customized member + message → the Team run opens |
| Member panel (Org) | analyst + review-team (with researcher and writer); a placed team's workspace change → "Customized · prototype-workspace · …", "1 of 3 customized"; sending starts the Org (the landing view is the existing fixture gap F-004) |
| "+" | Team, Org and Agent "+" all open New chat with the run's workspace, approval and model (**fixed:** Agent "+" used to copy only the workspace) |
| Saved runs | Running → stop icon; stopped → editable, Save bar "Unsaved changes · they apply when this run resumes · Cancel · Save"; agent read-only → "This run's settings can't be changed."; refresh-required and model-unavailable design states render; the saved Org run loads, and an Org-wide model change reaches every member |
| 390 px (fresh load in a 390 px frame) | New chat has no overflow; the member panel is full width with no resize edge and no overflowing rows; the model menu opens as a bottom sheet; saved-run settings fit (50–338 px) |

## Behaviour change in this round

Agent "+" on a running agent opens New chat with that run's model, thinking and approval, as well
as its workspace. This makes all three "+" entry points behave the same. It resolves the open
question raised earlier.

## Test-environment notes (not product issues)

The automation browser runs the tab in the background, so animation frames do not advance and
slide transitions do not finish there. As a result:

- a closing panel can linger in the DOM;
- an opening panel can stay off-screen.

Measurements were taken after forcing a frame. Device emulation does not survive navigation, so
the 390 px checks loaded the app fresh in a 390 px frame.
