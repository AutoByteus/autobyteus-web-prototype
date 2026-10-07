# Agent Package Creator request — refine synthetic-state guidance

## User authorization and objective
2026-10-07. The user explicitly requested delegation to `/agent_package_creator` to refine Product skill wording that caused confusion, with a detailed account of what happened. The user's position: using synthetic state instead of a backend to drive the UI/UX frontend is correct; requiring fixtures to be “small and handwritten” and treating large/captured state as automatically wrong may be inaccurate. They asked us to explain the confusion to the package owner, not to rewrite the current UI reference.

Please review and implement focused wording refinements in the owning agent package under your own repository/worktree/review workflow. Distinguish valid synthetic-state techniques from actual copying of production/customer content, and prevent unnecessary baseline-refresh work based on insufficient evidence. Preserve the Product team's code-first, high-UI-fidelity, low-implementation-complexity boundary.

## Context: what the Product Designer was doing
- Product request/package: `restore-native-workspace-folder-picker`; Solution Designer SR-004 / requirements R2 Draft, no UI/requirements approval.
- User wanted the UI first for restoring native workspace-folder choice in existing Chat/Agent/Team/Org setup. No production implementation was requested from Product.
- Canonical UI-reference repository: `/Users/normy/autobyteus_org/autobyteus-web-design`, default `personal`, inspected revision `8cd41f886459630909e827d7df1b67910618aaac`.
- Isolated Product worktree: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker`, branch `design/restore-native-workspace-folder-picker`.
- Requested production source: `/Users/normy/autobyteus_org/autobyteus-worktrees/restore-native-workspace-folder-picker/autobyteus-web` at `88fad73cbd20201642acdcfe75e69b1897ec135c`.
- Root UI baseline report identifies earlier source `10fb69504f99a615e0728ffdd6c1fcab0104ff05`. The design repository ALSO includes later accepted Product changes, including unified run settings and Chat drafts. An older report is not proof those current screens are outdated.

## What happened, including my error
1. I read the older report and saw large captured-state fixture files.
2. I combined these into a `Baseline Needed (Refresh)` conclusion and sent the Bootstrapper a current-source refresh plus fixture-replacement request BEFORE demonstrating that the current reference UI differs from the current product.
3. I told the user it had “stale source coverage and captured state fixtures that must be corrected.” That communicated greater certainty than the evidence supported.
4. The user challenged this: what if the UI is already current? Why create redundant work before verifying? They also questioned why legitimate synthetic state should be treated as defective.
5. I retracted the unsupported UI-staleness conclusion, recorded it at design commit `be73afe`, and sent a hold to the same Bootstrapper. Delivery of the hold was confirmed to `ui_baseline_bootstrapper_9f22a91a249f48f7bf87803f910b026c`. No assertion that the teammate has acknowledged/finished stopping beyond delivered message.
6. I then inspected actual JSON. The sampled entries are plainly synthetic. I have not demonstrated a functional problem, real-data misuse, or current UI mismatch. I have NOT audited all file contents or certified all UI parity; avoid swinging from an unsupported failure to an unsupported full pass.

This was my reasoning error, not just a documentation defect. However, literal skill language encouraged conflating (a) stale report metadata, (b) UI staleness, (c) generated/captured synthetic state, (d) copied real content, and (e) file size. Please make these distinctions clear enough that future agents do not repeat it.

## Concrete fixture evidence
Read-only files in the canonical reference:
- `/Users/normy/autobyteus_org/autobyteus-web-design/prototype/fixtures/runtime-state.json`: 2,911,993 bytes; top-level `sourceCommit`, `snapshots`; 72 keyed route/scenario snapshots. First snapshot has `item`, `actualPath`, `state`, `primaryNavHeight`, `bootstrapPending`.
- `/Users/normy/autobyteus_org/autobyteus-web-design/prototype/fixtures/source-state-snapshots.json`: 4,989,853 bytes; `generatedAt`, `sourceBaseUrl`, `mockBaseUrl`, `snapshots`; 72 snapshots, including application state, store information, rendered body text and errors.
- Report describes capture from the source app RUNNING AGAINST SYNTHETIC observation data, not an export of a real customer account.
- Sample route key: `populated|desktop|/chat`; keys cover multiple routes and contexts.
- Example actual record: `workspaceId: workspace-prototype`, `name: prototype-workspace`, `absolutePath: /synthetic/prototype-workspace`, `kind: filesystem`, `isTemp: false`.
- Example agent: Research Assistant, description “Synthetic local agent used only by the parity prototype.” Another: Documentation Writer, “A second deterministic synthetic agent.”
- Each snapshot contains many app stores/flags. Repeated synthetic state across scenarios can explain megabyte size; size cannot establish that real data was copied.
- Existing accepted ticket WEB-BASELINE-REFRESH-007 records DATA-001 as historically deferred. That history is not proof that every current instruction is satisfied, but explains why a rigid new gate can unexpectedly derail an unrelated focused request.

## Exact source of wording confusion
Authoritative shared principles:
`/Users/normy/autobyteus_org/autobyteus-agents/agent-teams/product-team/shared/product-design-principles.md`

Relevant current statements (verify line positions before editing):
- Around 65–67: a stub answers data requests from “hand-written fixtures”.
- Around 75–76: excludes “recorded, replayed or captured source responses”.
- Around 84–89: “A healthy data layer is measured in kilobytes. If fixtures or content files reach megabytes, or match the source's item counts, real data has been copied.”
- Around 304–308: “Real, recorded, replayed, captured or bulk-copied source data or content is a defect wherever it sits ...”.

Product Experience Design skill:
`/Users/normy/autobyteus_org/autobyteus-agents/agent-teams/product-team/agents/product-ui-ux-designer/skills/product-experience-design/SKILL.md`
- Table/quick checks around 63–74; bootstrap acceptance around 281–287; quality gate around 438–442; anti-patterns around 489–500 repeat hand-written/small/captured prohibitions and mandatory correction.
- Bootstrap routing says do not infer refresh from a moving branch (around 238), but later says request refresh when explicitly selected new source authority differs from report (around 290–291). Clarify the distinction between an explicit instruction to refresh and a task merely referencing a newer production revision while the cumulative design already contains accepted newer UI work. Do not use stale metadata alone as a factual UI-mismatch claim.

Bootstrapper skill:
`/Users/normy/autobyteus_org/autobyteus-agents/agent-teams/product-team/agents/ui-baseline-bootstrapper/skills/ui-baseline-bootstrapper/SKILL.md`
- Hand-made fixture requirements around 106, 271 and related references should agree with the shared rule.

Repository lifecycle skill (only adjust if consistency requires it):
`/Users/normy/autobyteus_org/autobyteus-agents/agent-teams/product-team/agents/product-ui-ux-designer/skills/product-design-repository-management/SKILL.md`

These are real canonical files. `.codex/skills` entries in the software workspace are symlinks, not independent owners. Follow your package-management workflow; do not directly modify unrelated dirty checkouts.

## Requested refinements — desired semantics, not preapproved exact prose
- Explicitly affirm: local synthetic/mock state is the intended way to drive design UI without a production backend. Hand-authoring is an option, not the only legitimate provenance.
- Distinguish snapshots/serialization/generated fixtures derived wholly from controlled synthetic scenarios from captured real production/customer/account content. Do not label all “capture” equally or all snapshots as defects.
- Size is an inspection/maintainability signal, not a proof of real-data copying or an automatic blocking threshold. Prefer representative, understandable, proportional state without an arbitrary KB cutoff or forced hand transcription.
- Judge by provenance, independence from live production, coverage of meaningful UI states, deterministic/resettable behavior, UI fidelity, and proportionate complexity. A generated file can satisfy these. A tiny copied customer response can fail them.
- Preserve the prohibition on real customer data/credentials/content dumps, unnecessary backend/service replicas and production implementation. Do not permit real-data replay simply by naming it a fixture.
- Separate a verified UI parity gap from unverified currency and optional fixture cleanup. Require concrete reasons before demanding a refresh/rebuild. Do not invent a heavy comparison bureaucracy or require revalidating every unrelated surface for a small feature.
- Preserve the existing authority boundaries: Product controls design/review; user approval controls future behavior; Solution Designer owns canonical requirements; Bootstrapper reproduces current experience, not future feature decisions.
- Harmonize repeated rules and templates in this Product package as needed; avoid unrelated package redesign or a second inconsistent source of truth.

## Boundaries and completion evidence
- Scope: agent-package guidance refinement. DO NOT modify the UI reference, its fixtures, production software, source requirements, or implement the folder picker. Do not automatically resume the held Bootstrapper.
- Do not treat this task as user approval of the folder-picker interaction or blanket certification of the 72 snapshots.
- Return: exact owning repo/worktree, changed files, committed revision/integration state under your workflow, before/after rationale, consistency/validation results, and any unresolved decisions.
- Check example classifications: (1) generated purely synthetic 5 MB multi-scenario state is not an automatic defect; (2) tiny real customer response remains prohibited; (3) old report plus later approved design commits does not prove stale UI; (4) a verified missing source interaction justifies a focused correction; (5) explicit user-requested source refresh still works.
- Reply to this assigning Product Designer execution; the assigning agent will mark the returned delegated Task DONE only when work is finished. Follow-up will use your returned AgentRun ID; no duplicate work request will be sent.
