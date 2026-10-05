# Review Round 13 — run-settings-ui-unification

User (2026-10-05): should the Defaults in the member panel be editable and kept in sync with the
message box, or not shown at all (the panel shows the members directly)? Which is better?

## Decision proposed and built: not shown

- The message box is the one place for the defaults; it stays visible beside the open panel (the
  chat page shifts left). An editable copy would be a second control for the same values.
- The panel is for exceptions. An opened member still shows all four values, inherited ones muted.
- On a phone-width screen (panel full screen) the opened member rows still show the values.

## Change

- Defaults section removed from the member panel.
- The "Members" heading is gone too (it repeated the "Member settings" title); "Reset all" appears
  above the list only when something is changed. A placed team's inner list keeps a small
  "Members" label.
- The doubled top line under the header removed.

Alternative kept open for the user: an editable Defaults section that stays in sync with the
message box.
