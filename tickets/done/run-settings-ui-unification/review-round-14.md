# Review Round 14 — run-settings-ui-unification

User (2026-10-05): the flat panel feels like it lacks something; it doesn't look clear enough.

## Change (member panel)

- Two-line member rows: name (+ a small "Coordinator" badge) and a grey line with what the member
  runs with — workspace (placed teams) · model · runtime · tool approval — so a closed row is
  informative.
- A changed member's second line starts with a blue "Customized" (a placed team with changed
  members shows "N customized"); the reset button sits on the right.
- 32 px avatars (agents: soft green circle with initials; teams: slate tile with a team icon),
  rows have a hover surface; the list uses spacing instead of divider lines.
- An opened member is one light rounded surface: header, summary and its settings rows together;
  a placed team's members sit inside it under a small "MEMBERS" label.
- The reset icon uses a bundled icon (`arrow-uturn-left-solid`); the previous one was not in the
  offline icon set.

## Note on the user's screenshot

Several icons rendered blank in the user's tab. Apart from the reset icon (fixed above), all panel
icons are in the bundled set; the tab most likely predated the baseline refresh — a hard reload
(Cmd+Shift+R) restores them.
