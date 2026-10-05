# Review Round 12 — run-settings-ui-unification

User (2026-10-05): remove redundant text in the member panel ("From the message box. Every member
starts with these.", "1 customized"); keep only what is necessary.

## Removed (member panel only)

- "From the message box. Every member starts with these." (the "Defaults" heading says it).
- "N customized" in the Members header (blue dots on changed members show it); "Reset all" stays
  when something is changed.
- "N of M customized" / "All N members use these settings" in the footer; footer is just "Done".
- "Default settings" / "Team defaults" on unchanged rows (no summary = defaults).
- "· N members" in the panel header and "N members" beside a placed team (it truncated the name).
- "Members of {team}" shortened to "Members".

## Kept

- "Coordinator" (who receives the message); the blue summary on a changed member (what differs).
- The line under the message box ("All N members use these settings · Customize members" /
  "● N of M customized · Edit · Reset") is unchanged.
