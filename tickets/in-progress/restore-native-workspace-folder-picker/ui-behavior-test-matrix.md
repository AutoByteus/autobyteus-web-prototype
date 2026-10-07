# Folder-selection behavior evidence — round 1

Package `restore-native-workspace-folder-picker`; R2 Draft / SR-004, **not approved**.
UI source `a677e01558b2b9d48253950bc2b8db821358625a` at `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/restore-native-workspace-folder-picker`. Source and accepted-base provenance: [ticket](product-ticket.md). All results are UI-reference evidence, not production AC completion. Manual browser execution used CUA Chrome at the normal `/chat` entry and product navigation on 2026-10-07. Screenshots: [review](review-round-1.md).

| Check | Related scope | Observed result | Evidence / limitation |
| --- | --- | --- | --- |
| Workspace discovery | SCN-001,005; REQ-001,004; AC-001,007 | Pass: search, Temp, known workspace and Open another folder remain | discovery screenshot; preserved shared menu markup |
| Local Agent choose/apply | SCN-001; AC-001,003,006 | Pass: Browse opens simulated chooser; selected client-portal fills field; Temp remains selected until Use folder; then menu closes and chip updates | selected-before-apply screenshot; manual browser sequence |
| Keyboard and pending | AC-003 | Pass: Tab from path focuses Browse; Return starts Opening…; Browse/Use folder disabled; chooser opens; Escape cancels | AX observed in built preview; no timed screenshot needed |
| Chooser Cancel | SCN-004; AC-005 | Pass: typed `/synthetic/my-typed-folder` and Temp selection unchanged; focus Browse | manual browser sequence |
| Chooser Escape | SCN-004; AC-005 | Pass: typed invalid relative path and existing client-portal selection preserved; no workspace apply; focus Browse | browser AX + DOM value inspection |
| Empty result | SCN-004; AC-005 | Pass: `/synthetic/empty-result-preserved` remains; Temp unchanged; no new error; focus Browse | firstOutcome=empty fixture, real Browse action |
| Failure/retry | SCN-004; AC-005 | Pass: typed `/synthetic/keep-this-path` preserved, Temp unchanged, inline error, Browse focus; retry opens chooser and successful return clears feedback | error screenshot; firstOutcome=error, subsequent normal choose |
| Manual invalid path | SCN-003,005; AC-007 | Pass: `relative/folder` shows existing absolute-path error; no workspace apply | browser AX |
| Manual valid path | SCN-001,003; AC-004,007 | Pass: `/synthetic/manual-team-folder` applies to Team; `/srv/project` applies in remote context | browser AX; no filesystem existence claim |
| Known directory | SCN-005; AC-006 | Pass: choose `/synthetic/prototype-workspace`, Use folder reuses known choice; no duplicate newly created workspace | menu after confirm; unchanged known-path handler |
| Search empty | SCN-005; AC-007 | Pass: query not-a-workspace shows existing no-match copy; Open another folder remains; Escape dismisses | browser AX |
| Team setup | SCN-001; AC-001 | Pass: normal target chooser to Product Review Team; same input/Browse/apply UI | Team screenshot; manual selection |
| Org root setup | SCN-002; AC-002 | Pass: normal target chooser to Product Launch Org; Browse fills design-system, root stays manual-team-folder until Use folder | Org selected screenshot |
| Placed-Team setup override | SCN-002; AC-002 | Pass: Customize members → Product Review Team; Browse fills client-portal; Use folder changes Team only, root design-system stays; customized count becomes 1 of 3 | placed-Team screenshot + AX |
| Saved Agent root lock | SCN-002,005; AC-002,007 | Pass: saved run → Edit Config shows fixed workspace, no menu/Browse | saved-agent screenshot |
| Saved Team root lock | SCN-002,005; AC-002,007 | Pass: saved Team → Edit Config shows fixed workspace; not unlocked | browser AX |
| Saved Org root / editable Team | SCN-002; AC-002 | Pass: saved Org member → Edit Config root fixed; already-editable Team field has shared menu/Browse | saved-org screenshot; no save invoked by browse/form cancel |
| Remote Electron gating | SCN-003; AC-004 | Pass: no Browse; connected-node hint; manual entry applies | remote screenshot; context fixture, not actual remote host |
| Ordinary browser gating | SCN-003; AC-004 | Pass: no Browse; manual field remains | context fixture; browser AX |
| Mobile-context gating | SCN-003; AC-004 | Pass: no Browse; manual connected-node path at 390×844 | mobile screenshot; modeled eligibility, not complete iOS runtime |
| Narrow local desktop | AC-007 | Pass: at 390×844 Browse, field, hint and actions fit in existing bottom sheet | narrow-local screenshot; viewport reset afterward |
| Browse lifecycle preservation | SCN-005; AC-006 | Pass in reference: no workspace list insertion, message or launch from opening/closing chooser; pending new path follows existing Use folder handler | unchanged emit boundary and browser selected-chip/list observations; no production persistence proof |
| Chinese locale | AC-003 / QR-001 | Copy added; rendered locale review not performed | not counted as a browser pass |

## Commands and technical limits
- `corepack pnpm install --ignore-workspace --frozen-lockfile`: exit 0; lock unchanged; package manager warned ignored build scripts (esbuild/sharp/vue-demi).
- `corepack pnpm typecheck`: exit 0. Configured `tsconfig.prototype.json` covers infrastructure/plugins/tests, not all Vue source.
- `corepack pnpm test`: exit 0, 3 files / 14 existing tests. These are baseline fixture/host/token tests, not new component unit tests.
- `corepack pnpm lint`: exit 0. Existing target excludes presentation Vue/localization files.
- `corepack pnpm validate:boundaries`: exit 0, 13 checks. This is the repository's boundary check, not fresh source screenshot certification.
- `corepack pnpm exec vue-tsc --noEmit --pretty false`: exit 1, `RangeError: Maximum call stack size exceeded`; full-root static typing is **not proven**. [failure log](review-evidence/full-vue-tsc-failure.log).
- First `corepack pnpm build`: refused active owned Nuxt-dev lock. Stopped only PID 80070 owned by this ticket; reran normally. Second build: exit 0. Duplicate `getters` auto-import and large-chunk warnings retained in [build.log](review-evidence/build.log).
- Built preview `HOST=127.0.0.1 PORT=4581 node .output/server/index.mjs`: starts; normal `/chat` loaded and keyboard/pick path rechecked. PID 41883, execution session 78855.
- Initial dev cold load had one dynamic-module fetch failure; warmed/reloaded successfully before journey checks. Not counted as success on the failed load.
- [Configured check log](review-evidence/checks.log), [boundary output](review-evidence/boundary-validation.json).

No live production data, native-dialog automation, OS/platform matrix, backend permission test, persistence test, source-current Electron test, or blanket whole-app parity audit was run. Untested items above are not silently promoted to passes.
