# Review Round 4 — Manage Skill Sources popup

- Ticket: `skill-sources-dialog-redesign` (package `skill-sources-dialog-redesign`, SR-001)
- Date: 2026-10-10
- Review URL: `http://127.0.0.1:4731/skills` → **Sources**
- Evidence: [review-evidence/round-4/](review-evidence/round-4/) (R01–R23, `capture-results.json`, `validate-results.json`)

## User decision (round 3)

> "what is your suggestion, as long as its still clear. i think clean ui is the goal" → "lets go then"

Accepted recommendations: (1) manual check only after a failed check; (2) keep **Browse…** (DEC-002 = include, desktop app only); (3) light only (ASM-001 confirmed).

## Change in this round

| ID | Change |
| --- | --- |
| DC-020 | The manual check is offered only for *Check failed*, labelled **Try again** (new string `skills.sources.tryAgain`: en "Try again", zh-CN "重试"; accessible name stays "Check <name> again"). *Up to date* and *Not checked* show the status only; GitHub sources are checked every time the dialog opens. Supersedes DC-012's visibility rule. |

Status line per state: Up to date → `● Up to date`; Update available → `● Update available [Update]`; Check failed → `● Check failed — installed skills retained · Try again` + error; Update failed → `● Update failed — previous version retained [Update]` + error; Removal incomplete → `● Removal incomplete [Retry removal]` + error; Checking…/Updating… → spinner.

## Requirement note (for Solution Designer at handoff)

REQ-007 "Check again remains available" now holds only after a failed check (plus the automatic check on every open). This adds to the round-2/3 notes.

## Validation

- `validate.mjs` 20/20. V06 now runs Try again on the failed source; V18 expects a manual check only for Check failed. 0 browser errors, 0 non-local requests.
- `capture.mjs` 23/23. `pnpm typecheck` 0, `pnpm lint` 0, `pnpm test` 15/15.
