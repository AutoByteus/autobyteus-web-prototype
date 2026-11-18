# Product Ticket: ios-demo-mode-279 (autobyteus-279)

- Status: `Awaiting User Review` (review package sent 2026-11-18; the founder approves the screens before engineering builds)
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

D1 iOS first screen = the Android scan-first screen; D2 built in (offline); D3 iPad landscape side by side; D4 "Try demo" also shown when nodes are saved; D5 no Android "Try demo" now. Details: `design-review-notes.md`.

## The founder's words so far

- 2026-11-18 (via the Solution Designer): "So based on the email we can just provide a demo right then yeah try demo we don't need a test node … dedicated task to the product team".
