# Design review notes — iOS demo mode for App Review (autobyteus-279)

For the founder's review. The proposal is runnable: `http://127.0.0.1:3279/ios` (an iPhone 17 Pro Max is 440×956 CSS px; an iPad Air 11-inch is 820×1180 in portrait and 1180×820 in landscape).

## What to try (5 minutes)

1. `/ios`: the iOS app's first screen. Tap **Try demo**.
2. The run list says **Demo · Sample data** at the top, with a welcome card (close it with ×).
3. Open **Daily Assistant**: the showcase conversation. Scroll it, then send any message: the agent reads a file (a tool call) and answers.
4. Open **Project Task Manager** (working): tap the red stop button; it becomes Idle. Open its ⋮: Artifacts, Files, Activity (background tasks), Settings, VNC Viewer, Text size.
5. Open **Product Launch Org › launch_lead** ⋮ › **Messages** (messages between agents).
6. Tap **+** (New run) › **Create run**, send a message, and get an answer.
7. Tap **Demo** (top left) › **Leave demo**: back to the first screen.
8. Again on `/ios`: tap **Scan**. The camera finds the demo QR code ("Demo code found") and opens the demo.
9. Resize to iPad landscape (1180×820): the run list stays on the left, and the open run shows on the right.

## The answers to the six questions

| # | Question | Proposed answer |
| --- | --- | --- |
| 1 | "Try demo" entry | A text button **Try demo** right under the blue **Scan** button on the first screen. The iOS first screen becomes the **same scan-first screen the Android app has** (autobyteus-395, FU-001), not today's URL/paste form. |
| 2 | Demo QR code | A QR code holding `autobyteus://demo` (the app's own link, no address or secret). The in-app **Scan** shows "Demo code found" and opens the demo. The iPhone/iPad Camera also opens it, through the app's existing `autobyteus` link. Image for the notes: `app-review/autobyteus-demo-qr-card.png`. |
| 3 | Shows it is a demo, and how to leave | The top-left name reads **Demo / Sample data** (a blue sparkles mark instead of the computer icon and connection dot), plus a dismissible **Welcome to the demo** card. Tapping **Demo** opens a sheet: what the demo is, and **Leave demo** (back to connecting your own node), which returns to the first screen and forgets everything. |
| 4 | Sample content and actions | The phone's sample world, all on the demo (no other nodes, so nothing says "Not reachable"). The showcase conversation leaves out failure states (no error block, no failed tool, no platform notices). Scripted actions: send → reply with a tool call; Stop → Idle; New run → a run that answers; Settings Save; Text size; VNC Viewer (view only). Read-only: Files, Artifacts, Messages, Activity. |
| 5 | iPad | Portrait: the phone layout, full width, with the first screen in one centered column. Landscape (1024 px and wider): the run list as a 380 px pane on the left, the open run (and its views, New run) on the right, and "Choose a run" when nothing is open. Sheets become centered 512 px cards. |
| 6 | App Review notes | `app-review/app-review-notes-draft.md` (notes + an optional reply in the review thread about Apple's "prior approval"). |

## Decisions for the founder

- **D1. iOS first screen = Android's scan-first screen.** Recommended. The reviewer's first impression is this screen. Today's iOS screen is a developer form (a URL box, a "cleartext http://" switch, Tailscale/Settings buttons, "The existing /mobile web shell owns Home, Chat, Runs and Files"). Putting "Try demo" on it would ask Apple to review that form. *Alternative:* keep today's screen and add a "Try demo" button under its title. That is a smaller engineering change, but the first screen still looks unfinished and the iOS and Android apps differ.
- **D2. Built into the app (offline)**, as the Solution Designer recommends. The demo QR's `autobyteus://demo` only works with the demo built in. A website demo would need a web address in the QR code and a server that is up during review, and it can drift from the app version under review. The screens are the same either way.
- **D3. iPad landscape side by side.** Recommended, because Apple reviewed on an iPad Air and a stretched phone layout looks unfinished. It applies to real use too, not only the demo. *Alternative:* keep the phone layout on iPad and only center the first screen.
- **D4. "Try demo" stays under Scan when the phone has nodes**, too, so the demo is always one tap away. *Alternative:* show it only while no node is saved.
- **D5. Android gets no "Try demo" in this work.** The Play review did not ask for it. It is easy to add later because the screen is shared.

## What engineering must know (not founder decisions)

- The demo is a data source behind the real `/mobile` screens: same components, sample data, scripted answers. Nothing leaves the device and there is no node address or credential.
- Leaving the demo or relaunching the app starts it fresh: runs created, messages sent and Stop are forgotten.
- The model names in the demo say they are samples ("demo/sample-model": "A sample model. Its answers are scripted."), so nothing suggests a real AI call.

## Round 2 — the Solution Designer's verification (2026-11-18)

The founder asked the Solution Designer to verify the demo against Apple's criteria ("he will base his approval on your verification"). Verdict: `/Users/normy/autobyteus_org/autobyteus-worktrees/ios-demo-mode-279/tickets/in-progress/ios-demo-mode-279/evidence/demo-verification/verdict.md`. How each finding is resolved:

| ID | Finding | Resolution (DC) |
| --- | --- | --- |
| V-01 | Placeholder file content ("Prototype Workspace — This content is synthetic") | DC-008: the demo's folder (`demo-workspace`) holds the files its conversations name, all with sample content: `README.md`, `docs/release-notes-1.6.md`, `docs/pilot-summary.md`, `docs/pilot-customers.csv`, `docs/dashboard-before.png`, `docs/dashboard-after.png`, `launch/announcement.md`, `launch/pilot-email.md`, `launch/checklist.md`, `src/export/filters.ts`. Pictures are sample screens. Artifacts are finished files with their full content. Search finds them. |
| V-02 | A run's status differs between the list and its screen | DC-006: one status per run. An opened run shows its row's status; a reply goes Running → Idle and Stop goes to Idle, on the screen and in the list together (agents and Team/Org members). |
| V-03 | Share extension without a demo path | **D6 (new decision): remove the share extension from this build.** Today it only carries a pairing link or node address into the old connection form (`Shared input was saved … tap Connect`), which the scan-first screen replaces; Scan and "Paste a link" cover that job. Without it there is no share-sheet entry for the reviewer to find. *Alternative (not built):* "Share to a run": text or a link shared into AutoByteus lands in the message box of a run you pick, in the demo and with a real computer. This is a new feature for a later ticket. |
| V-04 | After Send the view stays behind "↓" | DC-007 (demo and real app): your own Send moves the view to your message and follows the reply, even when you had scrolled up; other new activity still waits behind "Jump to latest". |
| V-05 | One-line member conversations; Messages off topic | DC-009: the Org's members (launch_lead, content_writer, release_manager) and a Team member (Software Engineering Team › implementation_engineer) have conversations with tool calls and Activity about their own work. Org Messages are about the launch, with the files they name. Other members get a short exchange about their Team's work. A message to a member now gets a sample reply (it was silent). |
| V-06 | A new run's reply reads another run's file | DC-010: only Daily Assistant continues its own release notes. Every other run, a new one too, lists its own folder (`list_directory · demo-workspace`) and answers with a general plan. |
| V-07 | VNC view only | Already there: tap **View only** to switch to **Control** (Keyboard, Clipboard) in the demo. The notes now say so. |
| V-08 | 4.2: name the app's own parts | Notes round 2 name the native scanner pairing, the Camera opening the app, the offline built-in demo and the iPad layout. They also use "AutoByteus", drop "every feature", say "works offline", and add one line on the desktop app. |

Answer (d): the reply to Apple is now drafted to go with the resubmission, quoting Apple's own line, without waiting for an answer.
