# Product Acceptance — WEB-BASELINE-REFRESH-002

- Date: 2026-09-30
- Reviewer: Product Prototyper
- Candidate: Bootstrapper `Completed — Refresh` to `origin/personal@57df63f079363ccab4f2301213f9d8a3458f72fa`
- Decision: `Accepted`

## Independent Checks

- Bootstrap report read: `prototype-bootstrap-report.md` (source identity, pin, prototype identity, 85/86 matrix with WBR-S015 box-height-only note, 30/30 + 2/2 chat flows, 15/15 FLW, 12/13 host with HOST-006 1-pixel noise, independent preview clean).
- Byte comparison vs. pinned source export: all `components/chat/*`, `components/agentInput/*` and `composables/popover/useAnchoredPopover.ts` identical.
- `corepack pnpm typecheck` exit 0; `corepack pnpm lint` pass; `corepack pnpm test` 12/12 pass.
- Paired browser geometry at the user's window size 1512x952 (source :4291 vs prototype :4199, synthetic `populated` scenario): heading, composer group, hint line and open menu boxes identical for `@` (menu below, top 590 / bottom 850) and Workspace (menu above). Screenshots: `refresh-4291-at.png`, `refresh-4199-at.png`, `refresh-4291-ws.png`, `refresh-4199-ws.png` (non-normative acceptance evidence).
- The `@`-below defect in the user screenshot reproduces identically in the refreshed prototype.

## Accepted Supersession

The shipped source Chat replaces the prototype-only `chat-interface-entry` implementation (PC-001–PC-047): engineering shipped that design, so the source version wins under the refresh rule. No prototype-only change without a source equivalent needed to be preserved.

## Known Gaps Accepted (unchanged carry-over)

Legacy rich-state injector, paired-mobile MOB rows and historical review scripts not re-run; chat replies not simulated (identical Offline status in source and prototype).
