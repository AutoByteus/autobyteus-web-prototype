# Review Round 6 — run-settings-ui-unification

User feedback (2026-10-04, paraphrased): show an avatar only when there is one, to the left of
the name (no "GA" placeholder); the heading sits too low with too much empty space above.

## Change

- Heading = [avatar] Name on one row, centred. The avatar (40 px circle) renders only when the
  agent/team/org has an `avatarUrl`; no initials placeholder and no generic team/org icon.
- Vertical layout: the block is anchored in the upper part of the page (top padding 18vh on
  desktop, 12vh on narrow) instead of being centred plus padded; at 1440×900 the name sits at
  ~180 px instead of ~390 px.
- Narrow screens: name is 1.5rem and wraps instead of truncating.
- Review data: Documentation Writer has a small hand-made illustrative avatar
  (`public/prototype-assets/run-settings/avatar-documentation-writer.svg`) so the with-avatar
  state is reviewable; all other fixture records have no avatar (as before).

## Round 6a (user: the message box moved up too far; keep it and the hint where they were, lift only the name)

- Restored the original New chat vertical layout (`justify-center`, top padding 14vh), so the
  hint line and the message box sit exactly where they did before this ticket (message box top
  at 448 px at 1440×900, as in the baseline).
- Only the name row is lifted, by a fixed 40 px (24 px below 640 px wide) using relative
  positioning, which leaves the hint + message box group untouched and opens a gap between the
  name and the hint.
