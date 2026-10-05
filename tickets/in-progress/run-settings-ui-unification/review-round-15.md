# Review Round 15 — member panel: clear text, card for an opened member

User feedback (round 14): the panel is flat but "not super clear". The labels and values
(Model, Thinking, Tool approval) are grey, while the same values on the chat page are clearer.
"Do we need some kind of borders?"

## Answer

Yes to one light border, no to borders everywhere. The panel looked washed out because it used
grey text on a grey surface, not because it lacked structure.

## Changes

- Values in the member panel use the message box's text strength (model `gray-800`, runtime
  `gray-500`, approval and workspace `gray-600`). Inherited values are no longer muted there;
  the blue "Customized" label already marks what differs.
- Setting labels (Model, Thinking, Tool approval, Workspace) are darker (`gray-600`).
- "Not available for this model" goes from `gray-400` to `gray-500`.
- The summary line under each name is `gray-600`.
- An opened member is a white card with a thin `gray-200` border, `rounded-xl` and a small shadow,
  the same as the message box, with a hairline between the member's name and its settings. This
  replaces the grey fill.
- Closed rows stay borderless with a light hover, so a long Org list does not become a stack of boxes.
- Rows are spaced a little further apart (`space-y-1.5`).
- The saved-run (boxed) view is unchanged.

## Validation

- Browser at http://127.0.0.1:4520: Agent Teams → Run → Customize members. Both members opened
  show bordered white cards. A closed row has a transparent border (computed style checked).
- `pnpm test` 14/14; `pnpm typecheck` passes.
