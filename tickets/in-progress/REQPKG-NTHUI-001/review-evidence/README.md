# Nested Team Hierarchy Review Evidence

These captures are non-normative review aids. They were generated before user
confirmation and must not be treated as final `VIS-*` implementation
references.

## Accepted Baseline Preservation

- `baseline/current-workspace-expanded-1440x1000.png`: accepted Workspace
  product surface captured before RV-002 edits with `workspace_team_launch`.
- `baseline/after-workspace-expanded-1440x1000.png`: the same route, viewport,
  scenario, and expansion state after RV-002 edits with the review query absent.
- Pixel probe: 102 of 1,440,000 pixels differed; the bounding box was only
  `(36,382)–(45,410)`, within the status-dot area. No shell/layout/content drift
  was observed.

## Baseline-Native Alternatives

- `rv-002/review-rails-320-default.png`
- `rv-002/review-surfaces-320-default.png`
- `rv-002/review-hybrid-320-default.png`
- `rv-002/review-rails-on-focus-260-extra-large.png`

The first three use the same 17 visible execution rows at the same actual
320px product-panel width and Default font. The focused narrow capture uses the
actual 260px product width and Extra Large (125%) setting and demonstrates full
identity recovery. Automated fixture-signature equality and browser results are
recorded in `../browser-validation-rv-002.json`.

## RV-003 Proposed-Final Review

- `rv-003/proposed-final-ui-320-default.png`: the approval candidate in the
  normal five-row, default-collapsed state using Hybrid ancestry, Responsive
  metadata, and Structural team icons.
- `rv-003/review-rails-320-default.png`
- `rv-003/review-surfaces-320-default.png`
- `rv-003/review-hybrid-320-default.png`
- `rv-003/review-rails-on-focus-260-extra-large.png`

RV-003 keeps the alternatives as stress evidence but opens the user-visible
review URL on the proposed-final state. Automated results are recorded in
`../browser-validation-rv-003.json`. These remain proposal-review aids until
the user explicitly approves the bundled recommendation.

## RV-004 Clean Final Candidate

- `rv-004/clean-final-candidate-320-default.png`: automated clean-route capture.
- `rv-004/user-visible-clean-final-candidate.png`: direct user-visible tab
  capture after removing every review/help overlay.

The remaining `rv-004/review-*` captures are internal regression evidence for
alternative parity and stress states; they are not exposed on the clean
candidate route. Automated results are in `../browser-validation-rv-004.json`.

## RV-005 File-Tree Candidate

- `rv-005/file-tree-candidate-preview.png`: direct collapsed-state preview.
- `rv-005/file-tree-one-expanded-preview.png`: direct one-branch-expanded
  preview showing ancestor continuation and terminating `├─`/`└─` elbows.
- `rv-005/file-tree-one-expanded-final.png`: direct user-visible expanded
  capture of the refined selected state; the final evidence refresh uses a
  stronger pale-blue background and straight, square 2px inset accent.
- `rv-005/file-tree-final-candidate-320-default.png`: automated clean-route
  evidence.

RV-005 removes team cards, renders only the ancestor rails that must continue,
starts every horizontal branch at the vertical junction without crossing it,
and terminates the last sibling as an elbow. Automated geometry and behavior
results are in `../browser-validation-rv-005.json`.
