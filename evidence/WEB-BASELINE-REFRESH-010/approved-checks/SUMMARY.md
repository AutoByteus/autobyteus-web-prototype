# Approved design checks on the refreshed baseline (WEB-BASELINE-REFRESH-010)

All checks ran against the refreshed baseline (`corepack pnpm dev --port 4620`) with design-only data
on, as the approved checks were written. The approved scripts and reference screenshots in
`tickets/done/` were not changed. Copies of the scripts are kept in this folder:

- the copies change only the Playwright import (the worktrees the scripts named no longer exist), the
  browser executable, and the selectors or harness calls listed below;
- expectations are unchanged.

## task-keys-and-dependencies (`final-validation.mjs`, 14 checks)

- Result: **14/14 pass** (`task-keys-and-dependencies/results.txt`).
- Copy changes: the Playwright import and the browser only. No selector needed changing: the source
  ships the same data-testids.
- Reference comparison: `capture-references.mjs` and `capture-new-task.mjs` were run as copies into
  `task-keys-and-dependencies/refreshed-captures/`. `reference-diff.json` holds the per-file pixel
  differences against VIS-001–VIS-015.
  - VIS-002d is identical.
  - VIS-001, 002a–c, 003–009c, 013, 014 and 015 differ only by icon and rounded-corner
    anti-aliasing (a different browser build); there is no visible change.
  - VIS-010, VIS-011 and VIS-012 differ in the Workspaces tree. Both changes are source changes:
    - delegated Teams under an Agent run now start collapsed (b9cbb74);
    - every Team row shows the universal Team status dot before its people icon (d1a66fe).
  - The Task-key parts of VIS-010, VIS-011 and VIS-012 are unchanged:
    - the board badges;
    - the tab's Task view with its key chip and dependencies;
    - the tree summary without a key.

## delegated-copy-task-locator (`final-validation.mjs`, 13 checks)

- Result: **10/13 pass** (`delegated-copy-task-locator/results.txt`, `final-validation-results.json`).
- Copy changes (selectors and harness only):
  - the summary's `data-test` is now the source's `workspace-task-worker-task-summary`;
  - `taskLocator.locate` now takes the source's `(task, openRun)` signature.
- The three failures:
  - **SCN-002 and SCN-008** fail only because the picker reads "AutoByteus", where the check
    expects "Desktop App".
    - The example Project was renamed by the later accepted `task-keys-and-dependencies` ticket
      (6d071fd), before this refresh.
    - The located Task, the focus and the highlight all pass.
  - **SCN-011** expects `@` collaborator rows (`collab-writer-001` and others). The source removed
    collaborators (5dd930d): a run's only children are its delegated copies. The rows the check
    expects no longer exist in the product. Task workers still show their summary.
- Reference comparison (`reference-diff.json`): every VIS file differs. The visible causes are:
  - delegated Teams start collapsed, and Team rows show the status dot (source b9cbb74, d1a66fe);
  - the example Project is "AutoByteus" with the task-keys example Tasks (accepted ticket 6d071fd);
  - VIS-014: the collaborator rows are gone (source 5dd930d).

## agent-definition-reconnect-ui (review scripts j1, j2, j4–j7, narrow)

- Result: **7/7 pass**, with no browser error and no non-local request (`../reconnect-preserved/`).
- Reconnect's fixture follows the source's data shape:
  - the former collaborator `/tutorial_video_producer` is now two delegated copies of the same agent
    (the source has no collaborators);
  - the `/post_production` sub-team was removed (Teams are flat since 065430d).
- "Reconnected to Product Video Producer · 2 runs" still shows (VIS-015).
- Visible differences from VIS-001–VIS-018, paired by eye with the review captures. All are
  product changes outside Reconnect:
  - Projects is the first right-panel tab (REFRESH-008);
  - the primary navigation shows one more item;
  - Team rows have a status dot;
  - the Team's Settings list the copies under **Delegated copies** (3126536).
- Product decision needed: Reconnect's "collaborator" case (VIS-014, VIS-015) now shows on delegated
  copies, because the source has no collaborators any more.

## Not overwritten

No approved reference screenshot was replaced. The refreshed captures sit only in this folder.
