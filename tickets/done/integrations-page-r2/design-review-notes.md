# Review notes — Integrations page r2 (import from a link)

Review URL: http://127.0.0.1:4950/integrations (dev server on port 4950, worktree `integrations-page-r2`).

## What changed from the approved design (DC-*)

- DC-001 No built-in repository, no "Not installed" card, no Install on a card. A card exists only for an imported integration.
- DC-002 **Import** (primary button, top right) opens "Import integrations": one field, "GitHub repository link or folder path" (as the Skills source dialog; Browse… where the native folder picker exists), Import, and a hint that follows what is typed (trust line for a link, "stays where it is; nothing is copied" for a folder). Errors show under the field: no integrations in the repository, skill-name clash, GitHub unreachable with the reason, not a GitHub link, already imported. On success the dialog closes and a green notice names what was imported.
- DC-009 (user, 2026-11-01) A local folder can be imported as well as a GitHub repository (requirements SR-006: REQ-003, DEC-012, DEC-014). Errors add "Directory not found: <path>" and "No integrations in this folder". A folder row in Manage sources has the folder icon, the path and "Local folder"; **Remove only, no Update** (it unlinks; files on disk are not deleted).
- DC-010 (SR-006 DEC-015) Removing a source also removes the stored token of its integrations: the Remove confirmation says "This also removes your GitHub connection." when one is connected.
- DC-003 **Manage sources** (secondary button, next to Import): the imported sources that contain integrations, with Update (existing update confirmation) and Remove (confirmation: whole source and its skills).
- DC-004 Empty state invites Import.
- DC-005 No repository-unreachable states on the page (cards are read locally); the network matters in Import and Update only.
- DC-006 Dialog step 1 is now "Imported" with "Imported from owner/repository"; the "all installed skills" line is gone (DEC-002 decided Yes).
- DC-007 Skills page: a small "Integration" label on an integration's skill card links to its card on Integrations (the card is scrolled to and focused).
- DC-008 Every new dialog returns focus to the button that opened it.

## Alternatives, in words

- The page action is named **Manage sources**, not "Manage": a card also has a **Manage** button (connected), and two buttons with the same name in one view would confuse. Skills uses "Sources" for the same dialog.
- Import closes the dialog on success and reports on the page (the user lands on the new cards); the Skills dialog stays open with a success line. Closing is better here because the result is on the page behind it.
- The toolbar is hidden while the page is empty; the empty state carries the one Import button.
- Folder versus repository: one field and one button, no tabs or switch; the kind is read from what is typed (a web address is a repository, anything else a folder), as in the Skills source dialog.
- The Skills-page mark is a small grey pill with a puzzle icon beside the skill name; not on disabled-state logic or the detail view. The user decides whether to keep it.

## Decisions for the user in this review

1. Keep the small "Integration" label on the Skills page? (Recommended: yes. Skills stay listed and readable.)
2. The page action is called "Manage sources". OK?

## Open for the Solution Designer

- Does Remove (source) also remove the stored token of an integration in it? The design says nothing about the token on removal.
- "Already imported" and "not a GitHub link" come from the existing skill-source importer's rules; the reference wording is illustrative.
