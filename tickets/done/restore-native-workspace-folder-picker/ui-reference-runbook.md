> **Completed-stage run location:** use `/Users/normy/autobyteus_org/autobyteus-web-design` and the normal `/chat` route. Historical review server/worktree information below is not a promise of an always-live URL. See [integration-record.md](integration-record.md) for final process/cleanup state.

# Folder-selection UI reference — runbook

Package `restore-native-workspace-folder-picker`; review round 1; UI revision `a677e01558b2b9d48253950bc2b8db821358625a`.
Provenance, requirements links and approval state: [product-ticket.md](product-ticket.md). Source remains read-only and separate.

## Review now
`http://127.0.0.1:4581/chat` — normal product entry, no preview query. Chrome review tab 1211486311 is retained for user review. Built preview owned by this ticket: PID 41883 / session 78855; loopback only. Port checked before initial launch. No production or source-observation server is running for this change.

1. Select the workspace chip beneath the composer, then **Open another folder…**.
2. Enter a path, or **Browse…**. The browser-only chooser has three invented folders. Select one and Open.
3. Verify the input changes but the current workspace chip does not; choose **Use folder** to apply.
4. Switch Daily Assistant → Product Review Team via the normal target chooser for Team setup; Product Launch Org for Org setup.
5. In Org setup, **Customize members → Product Review Team → Workspace** reaches the placed-Team override. The existing sidebar history and Edit Config reach saved-run lock cases.

## Start/restart
```bash
cd /Users/normy/autobyteus_org/autobyteus-web-design
corepack pnpm install --ignore-workspace --frozen-lockfile
corepack pnpm dev --port 4581
```
Do not start a second process on an occupied port. For a stable built review, stop only this ticket's owned process and:
```bash
corepack pnpm build
HOST=127.0.0.1 PORT=4581 node .output/server/index.mjs
```
Build and dev cannot own this worktree's Nuxt lock simultaneously. Current live server uses the built output from the review UI source. It does not update on file edits; rebuild/restart or use dev for revisions.

## Deterministic starting context / host outcome
No extra review controls are added to product UI. Default fixture `prototype/folder-selection/hostFixture.ts` is local-electron + choose. Context can be seeded **before reload** through this design-origin localStorage key (or by temporarily editing the fixture for dev validation):

`autobyteus.design.folderPicker.context`: `local-electron`, `remote-electron`, `browser`, `mobile`.

One-shot sessionStorage key `autobyteus.design.folderPicker.nextOutcome`: `error` or `empty`; consumed by the user's next real Browse action. Subsequent Browse goes back to choosing. The module's `firstOutcome` is an alternative deterministic seed used during this review's error/empty tests; it was restored to `choose` before commit/build. Context was likewise restored to `local-electron`.

Reload resets this reference's mock page state and the module's one-shot counter; New chat resets the draft through normal UI. Remove only the two keys above to remove explicit folder-picker overrides. Do not clear unrelated user storage. Use the ticket's loopback origin, not the user's app. Temporary narrow viewport testing was reset.

## Simulation contract
The custom browser `<dialog>` in `prototype/folder-selection/FolderDialogReference.vue` is a **stand-in for an OS-owned directory picker**, not a proposed application modal or normative native chrome. It reads no local directory. `/synthetic/client-portal`, `/synthetic/design-system`, and `/synthetic/prototype-workspace` are invented. Its Open/Cancel model only the returned path/cancel. Actual OS navigation, permission prompts, directory existence and OS button wording vary and require later Electron validation by Engineering.

The accepted synthetic state remains intact; neither the captured fixture format nor its size was rewritten. Local state models draft and selected-setting behavior. Save, launch, persistence, bridge availability and mobile/remote contexts remain simulated, not production capabilities. Existing fixture-origin evidence is in [baseline-reevaluation.md](baseline-reevaluation.md).

## Preservation / cleanup
Keep the review process and isolated ticket worktree while review is pending. No push, default integration, ticket closure or worktree removal until approved finalization. Only this ticket's server may be stopped during revisions. Canonical `personal` and production source have not been edited.
