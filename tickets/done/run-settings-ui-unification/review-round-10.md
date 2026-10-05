# Review Round 10 — run-settings-ui-unification

User (2026-10-05): the member area looks squeezed and very small; make it cleaner and flatter.

## Cause

Box-in-box: a grey expanded row, an indented bordered card inside it, then a label column — the
model control was left a sliver ("mock/gpt-pro… AutoBy…"), and every row carried a "Default" tag.

## Change (member settings panel only; saved-run view keeps its card)

- Flat list: members separated by hairline dividers; no outer box, no grey expanded row.
- An opened member shows its settings directly underneath, aligned with the name (no inner card),
  so the controls get the full width (model names no longer truncate).
- No "Default" tag per row: inherited values read muted; a member's own value reads normally with
  "Reset".
- Defaults section is flat: heading "Defaults", line "From the message box. Every member starts
  with these.", then the four settings in the same row rhythm.
- Org placed teams: their settings and "Members of {team}" follow the same flat pattern.
