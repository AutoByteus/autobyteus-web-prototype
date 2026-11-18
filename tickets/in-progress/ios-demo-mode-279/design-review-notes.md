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
