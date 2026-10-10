# Review Round 3 — Manage Skill Sources popup

- Ticket: `skill-sources-dialog-redesign` (package `skill-sources-dialog-redesign`, SR-001)
- Date: 2026-10-10
- Review URL: `http://127.0.0.1:4731/skills` → **Sources** (normal product entry, no review control)
- Evidence: [review-evidence/round-3/](review-evidence/round-3/) (R01–R23 recaptured, `capture-results.json`, `validate-results.json`)

## User feedback (round 2)

> "the github link already shows the name and also github icon also is clear its from Github … This separate Github word is not needed"
>
> "do we need this separate two button, because i feel like its very clear user just put it there the system validate right? … the hint could be put local folder or github address here something like that"

## Changes in this round

| ID | Change |
| --- | --- |
| DC-015 | The kind word ("GitHub ·", "Local folder ·") is removed from the row's second line. The icon tile and the URL/path already show the kind. The Default row never had it. Screen readers still hear the kind (visually hidden text). |
| DC-016 | The Local folder / GitHub switch is removed. One input, labelled **Add skill source**, with placeholder *Folder path or GitHub repository URL*, and one **Add** button. Supersedes the switch, labels and buttons of round-1 DC-004 and item 3. |
| DC-017 | Detection: input starting with `http://`, `https://`, `www.` or `github.com/` is imported as a GitHub repository (existing import operation). Anything else is added as a local folder (existing add operation). A non-GitHub URL reaches the import and gets its existing message (*Enter a public GitHub repository root URL…*); the typed value is kept. |
| DC-018 | The hint below the input follows the detection. Empty or a path shows *A folder on this computer that contains skills, or a public GitHub repository URL.* A URL shows the existing GitHub trust warning (shield icon). The hint is `aria-live="polite"` and is the input's description. |
| DC-019 | **Browse…** (DEC-002) is shown whenever the folder picker is available. It no longer depends on a mode. |

New strings (en / zh-CN): `skills.sources.addSource`, `skills.sources.add`, `skills.sources.inputPlaceholder`, `skills.sources.inputHint`. The mode-switch strings (`skills.sources.sourceType`, `skills.sources.repositoryUrl`, `skills.sources.import`, the old folder label/placeholder/hint) are no longer used by this dialog.

## Requirement note (for Solution Designer at handoff)

- AC-001 lists "name + kind + count". The kind is now shown by the icon tile and the URL/path, not by a word. On narrow windows the icon tile is hidden, so the URL/path alone shows the kind.
- REQ-005 / AC-004: adding works as before, but the kind is now detected from the input instead of chosen. The detection rule (DC-017) is a new UI rule that implementation must match.
- Round-2 notes on REQ-007 / AC-006 still apply.

## Alternatives considered (described, not built)

- **Button label follows the detection** (*Add Folder* ↔ *Import repository*): clearer about what will happen, but the button width jumps while typing. The hint already changes with the input, so the button stays **Add**.
- **Small folder/GitHub icon inside the input** showing the detected kind: more feedback, more noise. Not built.

## Validation

- `validate.mjs`: 20/20 pass. V08–V12 and V17 now use the single input. V11 is rewritten: no mode switch; neutral hint before typing; trust hint for a URL; a non-GitHub URL gets the import error and is kept; a GitHub URL is imported; the hint returns to neutral after the input clears. New V20: no visible kind word on any row, and a hidden kind for screen readers. 0 browser errors, 0 non-local requests.
- `capture.mjs`: 23/23, 0 failures.
- `pnpm typecheck` exit 0, `pnpm lint` exit 0, `pnpm test` 15/15.
- Visual review: desktop 1440×900 (R01, R05 GitHub URL typed), narrow 390 px (R19, R20), zh-CN (R21).
