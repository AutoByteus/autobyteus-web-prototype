# RV-002 Review Evidence

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
