# Review Round 2 — Manage Skill Sources popup

- Ticket: `skill-sources-dialog-redesign` (package `skill-sources-dialog-redesign`, SR-001)
- Date: 2026-10-10
- Review URL: `http://127.0.0.1:4731/skills` → **Sources** (normal product entry, no review control)
- Evidence: [review-evidence/round-2/](review-evidence/round-2/) (R01–R23 recaptured, `capture-results.json`, `validate-results.json`)

## User feedback (round 1)

> "what is the difference betwee update and refresh?" (about the ↻ icon next to **Update**)
>
> "i sit possible to make the UI cleaner. i feel its a bit busy. does people really care about which branch they are on on the UI? also installed etc. i think they only care whether update available, and then there is a button to update i feel"

## Changes in this round

| ID | Change |
| --- | --- |
| DC-011 | The GitHub version line ("Installed … · branch · Latest … · Checked …") is removed from the row. A GitHub row is now name + count + trash, kind · URL · copy, and one status line. The version details stay available as the status tooltip (hover). |
| DC-012 | The ↻ **Check again** icon is removed from the row's icon actions; the only icon action left is Remove (trash). **Check again** is a quiet text link after the status, shown only where a check can tell the user something new: *Up to date*, *Not checked*, *Check failed*. It is not shown with *Update available* / *Update failed* (the row offers **Update** instead) or *Removal incomplete* (as before). Accessible name stays "Check <name> again". |
| DC-013 | The **Update** confirmation's source card adds the version change — `main  9a8b7c6d5e → c0ffee1234` — so the version detail appears when the user is about to change it. |
| DC-014 | *Removal incomplete — retry removal* becomes *Removal incomplete* when the **Retry removal** button is beside it (the button already says what to do). New string `skills.sources.status.REMOVING_SHORT` (en "Removal incomplete", zh-CN "移除未完成"). |

Supersedes DC-003's "Check again → ↻ icon button" and the GitHub metadata line of DC-001/round-1 item 2. DC-007 (short checked time) now applies to the tooltip.

Per status, the GitHub status line reads:

| Status | Status line |
| --- | --- |
| Up to date | ● Up to date · Check again |
| Not checked | ● Not checked · Check again |
| Checking… / Updating… | spinner + text (actions disabled) |
| Update available | ● Update available **[Update]** |
| Check failed | ● Check failed — installed skills retained · Check again, then the error |
| Update failed | ● Update failed — previous version retained **[Update]**, then the error |
| Removal incomplete | ● Removal incomplete **[Retry removal]**, then the error |

## Requirement note (for Solution Designer at handoff)

REQ-007 says GitHub status, revision metadata, errors, Check again, Update and Retry removal **remain available**. In this design:

- Revision metadata is available through the status tooltip and the Update confirmation, not on the row.
- Check again is no longer offered next to *Update available* / *Update failed*, where it adds nothing. GitHub sources are still checked automatically every time the dialog opens.

If AC-006 ("render and behave as before") is meant literally, these two points need the requirement wording adjusted.

## Alternatives considered (described, not built)

- **Drop Check again entirely** (sources are checked on every open): cleanest, but leaves no manual retry after *Check failed*. Not built.
- **Keep the ↻ icon with a clearer tooltip**: still reads like a second update button next to **Update**.

## Validation

- `validate.mjs`: 19/19 pass. V01–V17 unchanged; new V18 (no version line; Check again only for Up to date / Not checked / Check failed; tooltip shows Installed · branch / Latest / Checked) and V19 (Update confirmation `main 9a8b7c6d5e → c0ffee1234`; *Removal incomplete* short label). 0 browser errors, 0 non-local requests.
- `capture.mjs`: 23/23 states, 0 failures.
- `pnpm typecheck` exit 0, `pnpm lint` exit 0, `pnpm test` 15/15.
- Visual review: desktop 1440×900, narrow 390 px (R19), zh-CN (R21), issues scenario (R03), Update confirmation (R12).

## Questions for the user

1. Is the GitHub row clean enough now, or should **Check again** go too?
2. DEC-002 (**Browse…**) and ASM-001 (light only) from round 1 are still open.
