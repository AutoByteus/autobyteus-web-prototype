# Approved design checks on the refreshed baseline (WEB-BASELINE-REFRESH-011)

All checks ran against the refreshed baseline (`corepack pnpm dev --port 4620`) with design-only data on,
as the approved checks were written. The approved scripts and reference screenshots in `tickets/done/` were
not changed (`git status tickets/` is clean). The copies in this folder change only:

- the Playwright import and the browser executable;
- selectors, scenario keys and harness behaviour, as listed per check below.

Expectations are unchanged. Refreshed captures sit only in this folder (`*/refreshed-captures/`, plus the
delegated-copy VIS files). `reference-diff.json` / `reference-diff.txt` hold the per-file pixel differences
against the approved references, and `side-by-side/` holds representative pairs (approved left, refreshed
right).

Under the shared principles, an illustrative value that differs is not a parity failure on its own. It fails
only when it changes or hides a UI state. Each failure below is classified that way.

## search-model-settings (`final-validation.mjs`, SRCH-001–019)

The source now ships this section (8469d4b, 70bb036). Its components replaced the design-only ones, so this
check now tests the shipped Embedding section against the approved design.

- Result: **60 passed, 18 failed** (`search-model-settings/results.txt`).
- Copy changes:
  - data-testids `search-*` → the shipped `embedding-*`, and Project ids carry the source's `project-`
    prefix;
  - scenario keys `search_*` → `embedding_*`, `search_empty` → `empty`, `search_many_projects` →
    `embedding_many`;
  - the shipped rows write `data-state` in upper case (`READY`, `NOT_INDEXED`), so the copy compares
    case-insensitively;
  - each SRCH block that stops on a missing element is recorded as one FAIL (`SRCH-0nn-aborted`) and the run
    continues; locator timeout 4 s.
- The 18 failures, by cause:
  - **Illustrative domain values only** (the design's example data, not UI-controlled text). The
    UI states these blocks exercise all appear in the baseline, and the paired source-versus-baseline flows
    compare them (EMB-001–035):
    - the design's example Projects and counts: Desktop App "170 Tasks", Marketing Site, Agent Runtime,
      Billing Cleanup, Release Notes, "7 Projects ready", 24 Projects with 8 needing indexing, "node" as a
      Find match. Affected: SRCH-002-aborted, 007-aborted, 008c, 009b, 009-aborted, 011-aborted, 012a, 012b,
      012c, 014a ("就绪 · 170 个任务"; every zh-CN UI string is present), 017c ("Waiting for the model…"
      shows on the baseline's Project), 017-aborted;
    - the server's failure reasons: SRCH-010a ("Couldn’t reach huggingface.co"), 011a ("The model files
      failed verification."), 017a. The shipped UI shows the same templates ("Download failed: …",
      "Unavailable: …") around the fixture's invented reasons;
    - SRCH-009a: the design's default scenario has Prototype Launch at "Needs update · 3 changed". The
      baseline's default has every Project ready; that state is in `embedding_busy` ("Needs update · 2
      changed", Index now and Rebuild);
    - SRCH-014c: the zh-CN Latin-word allow-list does not know the design-only example Project names
      "AutoByteus" and "Customer Onboarding Experience Redesign". There is no untranslated UI text.
  - **The shipped UI has no equivalent hook:** SRCH-002b expects `search-pill-active` and
    `search-pill-ready`. The shipped status line ("Active · Ready", one line with a dot and plain words; the
    component's own comment says "never a boxed pill") has no such test ids. The visible text and state
    (`active-ready`) pass.
- Reference comparison (`search-model-settings/reference-diff.txt`, 21 differ, 2 not captured):
  - The models card, the switch dialog (VIS-004/005/018/021), the load error (VIS-016), loading (VIS-015),
    no Projects (VIS-014) and the narrow layouts differ only in the Project list behind them or by
    anti-aliasing (`side-by-side/search-model-settings--*.png`).
  - The Project list holds the baseline's Projects (with design-only data: AutoByteus, Customer Onboarding
    Experience Redesign, Prototype Launch). In the default scenario all of them are ready, so "Index all
    Projects" is disabled there. The design's references show a mixed default list.
  - Not captured: VIS-010 (it clicks Index now on Prototype Launch, which is ready in the default scenario)
    and VIS-013 (`embedding_many` has no Project matching the design's "p" filter with "Needs indexing").
- Fixture corrections made because of this check, both shared by the source observation and the baseline,
  and both re-compared in the paired flows:
  - in `embedding_offline`, each model's first download fails and Retry then succeeds (it used to fail
    every time);
  - Retry on an unavailable active model downloads it again when its files are not on disk.

## task-part-of (`final-validation.mjs`)

- Result: **56 passed, 0 failed** (`task-part-of/results.txt`). Copy changes: Playwright import and browser
  only.
- Reference comparison (`task-part-of/reference-diff.txt`, 34 differ): the visible change is the source's
  new board search placeholder "Describe the task you're looking for" (54e26d7, meaning search) in VIS-001,
  VIS-008, VIS-015, VIS-016d and VIS-017. The part lines, progress, Task page sections, editor picker and tab
  views match; the other differences are anti-aliasing (`side-by-side/task-part-of--*.png`).

## task-keys-and-dependencies (`final-validation.mjs`, 14 checks)

- Result: **14/14 pass** (`task-keys-and-dependencies/results.txt`).
- Copy changes: Playwright import and browser. The capture copy scrolls a card into view before clipping it,
  because cards are taller with the part-of lines.
- Reference comparison (`task-keys-and-dependencies/reference-diff.txt`):
  - every source change visible here comes from "part of":
    - Task pages show a **Parts** section ("No parts yet." and "+ New part") before Depends on (VIS-003–005,
      VIS-014);
    - cards carry "Part of …" lines and progress, so cards are taller (VIS-001, VIS-002a and VIS-009b differ
      in size, VIS-013, VIS-015);
    - the board search placeholder changed (54e26d7);
  - the r1-* files are review notes, not captured by the scripts.

## delegated-copy-task-locator (`final-validation.mjs`, 13 checks)

- Result: **10/13 pass**, the same three as REFRESH-010 (`delegated-copy-task-locator/results.txt`):
  - SCN-002 and SCN-008 expect the Project name "Desktop App"; the accepted task-keys ticket renamed it
    "AutoByteus". The located Task, focus and highlight pass;
  - SCN-011 expects `@` collaborator rows, which the source removed (5dd930d).
- Reference comparison (`delegated-copy-task-locator/reference-diff.txt`): VIS-012 and VIS-014 are
  identical. Compared with REFRESH-010's captures:
  - the AutoByteus board is longer with the accepted task-part-of example data, so the located card sits at
    a different scroll position (`side-by-side/delegated-copy--VIS-005-vs-REFRESH-010.png`);
  - the run age label is relative to today ("6d" → "1w").

## agent-definition-reconnect-ui (review scripts, `check-reconnect-preserved.mjs`)

- Result: **7/7 pass**, with no browser error and no non-local request (`../reconnect-preserved/`,
  `../logs/reconnect.log`).

## Delegated-copy example (`check-delegated-copy-example.mjs`)

- Result: **4/4 pass** (`../design-only-delegated-copy/`, `../logs/dcexample.log`). Its Team copies now
  record each member's launch and `followsTeam` (35675e3).

## Not overwritten

No approved reference screenshot was replaced.
