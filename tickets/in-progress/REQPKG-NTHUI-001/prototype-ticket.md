# Prototype Ticket

## Identity And Scope

- Ticket / request ID: `REQPKG-NTHUI-001`
- Stable package identifier: `nested-team-hierarchy-ui`
- Title: Baseline-native Workspace nested-team hierarchy product review
- Status: `Awaiting User Review`
- Related requirements revision: `RER-001` (`Draft — Requirements Visualization Needed`; no approval claimed)
- Related requirement, behavior, acceptance-criteria, and decision IDs: `BEH-001`–`BEH-005`; `REQ-001`–`REQ-012`; `AC-001`–`AC-008`; `DEC-001`–`DEC-003`
- Critical journey or product decision: On the real accepted `/workspace` route, compare compact ancestry grammar, narrow-width metadata density, and team-node identity using one identical deep Workspace-history fixture while the surrounding product remains intact.
- In scope: One team-definition group with multiple runs; one expanded run; root members; three sibling configured subteams; a deeper nested subteam; one transient task team; collapsed/expanded/selected states; mixed statuses; long names; 260/320/520px; Default/Extra Large; pointer/keyboard disclosure and identity recovery.
- Non-goals: Backend/topology/status/persistence changes; Team definition editor; right-side Team overview; mobile/global navigation; full-page org chart; drag/drop; global typography; final or production implementation.

## Prototype Context

- Prototype repository/root (separate from source repository): `/home/autobyteus/workspace/autobyteus-web-prototype`
- Prototype ticket worktree: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001`
- Prototype ticket branch: `prototype/reqpkg-nthui-001`
- Source repository and selected frontend: requirements worktree root `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements`; selected frontend `/home/autobyteus/workspace/autobyteus-workspace-nested-team-hierarchy-ui-requirements/autobyteus-web`
- Pinned source revision: `5cb39c65630b5b0baae7b4813f6e8cd798851e97` observed at intake on 2026-08-30; this is a recorded context pin, not a user-imposed refresh constraint.
- Accepted baseline revision: `550e8bd8737ddb645cc12f674d693bed76a09e9f` on canonical `personal`; the Product-accepted current-experience baseline remains applicable to the Workspace/sidebar interaction language.
- Bootstrap report: `/home/autobyteus/workspace/autobyteus-web-prototype/prototype-bootstrap-report.md`
- Product acceptance result and date: Existing accepted current-experience prototype reused; baseline preservation was rechecked before/after RV-002 and no new bootstrap is required for this ticket.
- Prototype revision for this ticket: `RV-001` at `449d3af03209bcec25ef5ac62619750fe14096f1` is withdrawn. `RV-002` at `f4bb01d5968be1c5e37aa8e879b37692ac7f3099` established the baseline-native comparison. `RV-003` at `ff8bdb5c74831e28afbd26bab0a40882cc401e40` exposed a proposed-final view. `RV-004` at `99658a5376afc4595b0a736dab2839df1d5cb1b6` removed review/help chrome. `RV-005` implements the user-directed printed-file-tree grammar; exact commit pending persistence.
- Integration target and result: Canonical `personal`; `Pending` because the clarification loop is open.
- Runtime isolation record (port / process / temporary state): Product-owned corrected Nuxt runtime uses `127.0.0.1:4193`; Nuxt PID `80344` after the post-build restart on 2026-08-30. Reset by reloading the RV-003 URL, which applies `workspace_team_hierarchy_review` and explicit query choices. Do not stop unrelated runtime on port `4180`.
- Cleanup result or blocker: Active Product worktree, branch, and port are intentionally retained while user review is open; cleanup is pending review completion.
- Ticket folder: `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001`

## Delivery And Validation

- UI/UX specification: Not created. Product Experience mode requires explicit user confirmation of `DEC-001`–`DEC-003` before a normative `ui-ux-spec.md` or final `VIS-*` reference exists.
- Runnable prototype entry point: `http://127.0.0.1:4193/workspace?prototypeReview=nested-team-hierarchy&reviewView=proposal&hierarchy=rails&metadata=responsive&teamIdentity=icon&panelWidth=320&fontSize=default&treeState=collapsed`
- Visual evidence: Clean file-tree candidate and internal regression captures under `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/REQPKG-NTHUI-001/tickets/in-progress/REQPKG-NTHUI-001/review-evidence/rv-005`; exact accepted-baseline before/after captures under the sibling `baseline` folder. Withdrawn RV-001 files remain isolated.
- Supporting artifact paths: `experience-story.md`; `ui-behavior-test-matrix.md`; `prototype-assumptions.md`; `prototype-change-log.md`; `prototype-runbook.md`; `review-guide.md`; `browser-validation-rv-002.json`, all under this ticket folder.
- Validation commands and results: RV-005 `corepack pnpm typecheck` pass; `corepack pnpm test` pass 12/12; focused system-Chromium validation pass 22/22 with zero page/console errors. It verifies zero review chrome, Rails/Responsive/Icon treatment, five normal-state rows, one-coordinate vertical/horizontal junctions, no connector/disclosure overlap, last-sibling termination, and the orthogonal pale-blue selection with a straight 2px inset accent. RV-003 passed boundary checks 13/13, lint, and build.
- User-confirmation reference: Direct user feedback on 2026-08-30 rejected RV-001 as disconnected, removed review chrome in RV-004, then identified the candidate as visually unclean and specified the familiar vertically printed file-tree grammar. The user explicitly noted that the small horizontal branch must begin at—not cross—the vertical rail, then refined selection from a thick rounded stripe to a straight orthogonal 2px accent. This authorizes RV-005 correction but is not final approval.
- Mocked boundaries and known limitations: Synthetic topology, statuses, ages, conversations, and quiet refresh; review controls are prototype-only; no production services, persistence, topology mutation, live status, or run lifecycle. Starting choices are not recommendations.

## Outcome And Handoff

- Completed behavior and evidence: RV-005 keeps the real accepted Nuxt `/workspace` shell and clean route, removes team-row cards, renders only the needed ancestor rails, uses one-direction branch elbows with correct last-sibling termination, aligns disclosure controls after the connector, suppresses repeated member age at 260/320px until hover/keyboard focus, and uses an orthogonal pale-blue selected row with a straight 2px accent.
- Remaining product decisions: `DEC-001`–`DEC-003` remain open until the user explicitly approves the File-tree rails / Responsive metadata / Structural icon candidate.
- Next expected action: User reviews the clean live candidate and explicitly approves it or requests one focused refinement. Do not create the normative final UI/UX specification or claim approval yet.
- Handoff outcome from `get_handoff_rules`: Fresh lookup pending after RV-002 commits and live runtime are durable. The prior RV-001 handoff is superseded and must not be used as review evidence.
- Matched recipient address, when a rule applies: Pending fresh dynamic lookup; do not infer from the prior route.
- Return context when no matching rule applies: Return the review package to the caller/user.
