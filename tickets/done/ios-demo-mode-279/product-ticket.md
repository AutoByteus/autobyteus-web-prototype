# Product Ticket: ios-demo-mode-279 (autobyteus-279)

- Status: `Completed` (the founder approved the screens, 2026-11-19; integration: see the Integration record below)
- Mode: Product Experience Design. It evolves the accepted `/mobile` phone shell and the approved scan-first native start screen (`/android`, one-step-phone-pairing). The iOS app's native first screen is a design-only route (`/ios`), like `/android`.
- Requested by: Solution Designer run `solution_designer_529aaf7328ab4ca5a0ba571f7910cbb3` (software engineering team), on the founder's word ("dedicated task to the product team"), 2026-11-18
- Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/ios-demo-mode-279/tickets/in-progress/ios-demo-mode-279/product-design-request.md`; Apple's message: `…/evidence/apple-review/app-store-connect-review-message.jpg`
- Design repository: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin` = `AutoByteus/autobyteus-web-prototype`)
- Ticket branch / worktree: `design/ios-demo-mode-279` / `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/ios-demo-mode-279`
- Accepted design base: `fc68a7a4d249029d672d6b398b6d6ce2835cbbdc` (`origin/personal`, fetched 2026-11-18; local `personal` equal to it)
- Source pin (read only): the phone shell as accepted by `phone-run-screen-baseline-refresh-506` / `phone-conversation-readability-506` (`origin/personal@e4f4b3e176` for `/mobile`); the iOS app's current first screen read from `autobyteus-ios/AutoByteusMobile/ConnectionViewController.swift` at `4702c502fe` (engineering worktree `ios-demo-mode-279`). It is native UIKit with no web source, so it is not in the web baseline and is not re-created; the proposal replaces it with the approved scan-first screen (decision D1).
- Baseline: accepted (existing). No bootstrap: the changed surfaces (`/mobile` run list header, node sheet, bottom sheet, paired shell; the native start-screen route) are baseline or approved design components and were read directly.
- Runtime: `corepack pnpm dev --port 3279` in the ticket worktree (owned by this ticket; host 127.0.0.1). State: `sessionStorage` `autobyteus.prototype.iosDemo` / `autobyteus.prototype.inIosApp` (set by "Try demo" or the demo scan; removed by Leave demo); `localStorage` `autobyteus.prototype.iosStart` = `ios_first_launch` (default) | `ios_several`. Reset: close the tab (new session) or remove those keys and reload.

## Artifacts

- Review notes (questions, decisions D1–D5, what to try): `design-review-notes.md`
- App Review notes draft and the demo QR code: `app-review/app-review-notes-draft.md`, `app-review/autobyteus-demo-qr-card.png`, `app-review/autobyteus-demo-qr.png`
- `ui-ux-spec.md` and final `visual-references/`: after the founder's approval

## Decisions asked of the founder

D1 iOS first screen = the Android scan-first screen; D2 built in (offline); D3 iPad landscape side by side; D4 "Try demo" also shown when nodes are saved; D5 no Android "Try demo" now; D6 (round 2) remove the share extension from this build. Details: `design-review-notes.md`.

## The founder's words so far

- 2026-11-18 (via the Solution Designer): "So based on the email we can just provide a demo right then yeah try demo we don't need a test node … dedicated task to the product team".

## Review round 1 (2026-11-18)

- The founder asked for a Tailscale address: `https://normys-macbook-pro.tail0347f8.ts.net:8444/ios` (Serve entry on 8444 owned by this ticket; the existing 443 and 8443 entries untouched; dev server restarted with `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` for this run only). Turn off: `tailscale serve --https=8444 off`.
- The founder: he does not know Apple's demo-mode criteria; the Solution Designer should test and verify the demo himself, and the founder's approval follows that verification. Verification request sent to the Solution Designer (questions a–d). Status stays `Awaiting User Review`.

## Review round 2 (2026-11-18)

- The Solution Designer's verification (at the founder's request): not yet complete; must fix V-01…V-03, should fix V-04…V-08. All resolved in the reference (DC-006…DC-010; V-03 by decision D6, V-07 already present). Details: `design-review-notes.md`, Round 2. Notes draft round 2: `app-review/app-review-notes-draft.md`. Re-verification requested from the Solution Designer.
- The dev server reached the tool's 2-hour background limit and was restarted detached (`nohup`, PID recorded at cleanup); same port 3279, same Tailscale address.

## Review round 3 (2026-11-18)

- The Solution Designer's round 2 verification: V-01 half fixed (Artifacts showed "Synthetic file — Fixture content only."), new R2-02 (the reference is behind the shipped phone screens: Text size moved to "On this phone" with three steps). Everything else verified fixed; D6 agreed (still the founder's decision).
- V-01 rest: Artifacts open the demo folder's sample content and pictures (`plugins/00` content handler, demo only).
- R2-02: verified with git (phone UI files changed since `e4f4b3e176`). Baseline refresh ticket `phone-baseline-refresh-279` opened (worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/phone-baseline-refresh-279`); refresh request sent to the UI Baseline Bootstrapper against `origin/personal@f7b4d68711`, phone surfaces only. After acceptance and integration, `personal` is merged into this ticket and the demo is checked again. Status: waiting on the baseline.
- Notes round 3: Text size is described where the shipped app has it (run list ⋮ › On this phone, three steps).
- For engineering (V-07 minor): switching VNC to Control logs "Disconnection timed out." in the reference console; the build must show and log no error there.
- Baseline refresh `phone-baseline-refresh-279`: Bootstrapper `Completed`; accepted (audit, data boundary, pairs, running baseline checked; see `tickets/done/phone-baseline-refresh-279/product-ticket.md`); integrated into `personal` (`0d2d0b9a`, local = origin); worktree and branch removed; its dev server (4279) stopped. `personal` merged into this branch (conflicts in `useMobileRunOpening.ts` and the runbook resolved, keeping the source's lines and the demo's). Accepted design base is now `0d2d0b9a`. All demo journeys rechecked. Re-verification (round 3) requested.

## Round 3 verification (2026-11-18)

- The Solution Designer: "round 3 verified. From Apple's criteria as I know them, the demo is ready to submit" (verdict.md Round 3, shots-r3/). Status stays `Awaiting User Review`: the founder's D1–D6 and his approval of the screens are being put to him by the Solution Designer.
- Engineering items carried into the spec: VNC Control must log no error; DC-007 (follow after your own send) changes the real app too.
- Follow-up candidate (real app, not this ticket): a top-level row learns its background tasks only after the run is opened (the demo shows them from the start, DC-006).
- Beyond what a reference can prove (engineering tests): the real camera scan of the demo QR, the Camera app opening `autobyteus://demo`, offline behaviour in the built app, the iPad build.

## Review round 4 (2026-11-18/19)

- The Solution Designer's strict App Reviewer sweep at the founder's request: not ready (A-01…A-09). All resolved (design-review-notes.md, Round 4). His `crawl.mjs` re-run here: iPhone and iPad 0 findings, 0 errors. Re-sweep requested from him. Engineering criteria added: every icon and asset bundled (no network request in airplane mode), no console errors on these paths.

## Review round 5 (2026-11-19)

- The Solution Designer's round 5: his sweep clean (A-01…A-09 resolved); `final.mjs` found R5-01 (fixture model names on the other runtimes) and R5-02 (an error when choosing a model). Both resolved (design-review-notes.md, Round 5); his `final.mjs`, a full Runtime/Model sheet sweep and `crawl.mjs` on both sizes are clean. Round 6 sweep requested.

## Review round 6 (2026-11-19)

- The Solution Designer: round 6 clean (crawl.mjs on iPhone and iPad, sheets.mjs, final.mjs, upload.mjs: 0 findings, 0 errors, 0 external requests). Verdict: "the design can pass App Review as designed" (verdict.md, Round 6).
- Notes round 6: one sentence on the web view's plain-HTTP allowance (NSAllowsArbitraryLoadsInWebContent: the user's own computer on a private network or Tailscale, often without HTTPS).
- Engineering conditions for the spec (verdict Round 6): every icon and asset bundled (offline); no console errors; the real camera scan and the Camera-app link `autobyteus://demo`; no crash on a fresh install; the notes working as written.
- Waiting for the founder's approval of D1–D6 and the screens (the Solution Designer is asking him); then the final specification and screenshots.

## Decisions and specification (2026-11-19)

- The founder, via the Solution Designer: "You were decides yeah but in general I don't see we should have any difference … a demo is a should be very much similar to how your real application works right or 100% like how your real application works …". The Solution Designer decided D1–D5 as proposed; **D6 changed: keep the iOS share extension, working as on Android** (a shared pairing link connects, the demo link opens the demo, other text opens Type an address pre-filled; iOS keeps the text and acts on it when the app opens).
- Built: the share extension screen (`/ios-share`) and the first screen's handling of kept text; the notes mention Share to AutoByteus and the web view's plain-HTTP reason.
- `ui-ux-spec.md` written (status `Ready for User Review`), final references `visual-references/VIS-001…VIS-037` (iPhone 440×956, iPad 820×1180 and 1180×820). The round 1 interim screenshots were removed (superseded).
- Next: the founder's approval of the screens; the Solution Designer's last sweep; then `Completed`, integration into `personal`, and the handoff.

## Approval (2026-11-19)

- The founder, relayed verbatim by the Solution Designer: "I trust you I trusted you okay you you know our product you know apple you are you have good standards so if you think it's good then I think the design is finished the right if you think it passed your verification then we're ready then I think you're ready to continue with your work".
- The Solution Designer's round 7 sweep on `78b51f73` passed, including the share paths (verdict.md, Round 7). `ui-ux-spec.md` marked `Approved`.
