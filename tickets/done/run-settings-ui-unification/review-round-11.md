# Review Round 11 — run-settings-ui-unification

User (2026-10-05): opening the workspace menu in the member panel distorts the whole panel; the
panel is too small for the menu.

## Cause

The workspace menu (384 px) opens from the chip toward the right and ran past the panel's right
edge; the panel's scroll area then scrolled sideways, cutting off the left of every row.

## Change

- The member panel never scrolls sideways (`overflow-x: hidden`).
- Workspace, model and thinking menus keep themselves inside the box that would clip them (the
  nearest scrolling panel, else the window): shifted back in when they would cross an edge, and
  narrowed when wider than the box. Applies everywhere these Chat menus are used; menus that
  already fit (Chat page) are unchanged.

## Validated

- Org panel, placed team → Workspace: panel `scrollLeft` 0; menu 1048–1432 px inside panel
  960–1440 px. Model menu inside the panel. Chat page workspace menu unchanged.
