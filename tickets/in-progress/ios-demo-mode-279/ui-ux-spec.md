# UI/UX Specification — ios-demo-mode-279 (autobyteus-279): the iOS app's demo for Apple's App Review

## Status And User Confirmation

- Status: `Ready for User Review`. The decisions are confirmed; the founder's approval of these screens is pending. On his word the status becomes `Approved` and the ticket is integrated.
- Request / ticket: Project Task `autobyteus-279`; Product ticket `ios-demo-mode-279`. Request: `/Users/normy/autobyteus_org/autobyteus-worktrees/ios-demo-mode-279/tickets/in-progress/ios-demo-mode-279/product-design-request.md`. Apple's message: `…/evidence/apple-review/app-store-connect-review-message.jpg`.
- Related requirements revision ID: none yet. The Solution Designer writes the requirements after this design (founder's routing: Product designs, the founder approves, engineering builds).
- Related decision IDs: D1–D6 (below). Verification findings V-01…V-08, R2-02, A-01…A-09, R5-01, R5-02: all resolved (`design-review-notes.md`).
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`).
- Review URL: `http://127.0.0.1:3279/ios`, or on the founder's Tailscale devices `https://normys-macbook-pro.tail0347f8.ts.net:8444/ios`.
- Explicit user-confirmation reference:
  - **Decisions:** the founder, 2026-11-19, relayed verbatim by the Solution Designer: "You were decides yeah but in general I don't see we should have any difference … a demo is a should be very much similar to how your real application works right or 100% like how your real application works … of course you don't want to how to Android works it's more less harder iOS works in that right?" Under that rule, the Solution Designer decided D1–D5 as proposed and changed D6 (the share extension stays and works as on Android).
  - **Apple criteria:** the Solution Designer verified the demo at the founder's request ("perform the verification like you are the person who is doing [it] from Apple"). Round 6 verdict: "the design can pass App Review as designed" (`…/evidence/demo-verification/verdict.md`).
  - **Screens:** *pending the founder's approval of this specification.*
- Final check date: 2026-11-19.

## Repository And Baseline Provenance

- Source repository: AutoByteus workspace, read only. `autobyteus-web` (the phone `/mobile`) at `origin/personal@f7b4d68711` (1.5.13). `autobyteus-ios` and `autobyteus-android` were read at `4702c502fe` (engineering worktree `ios-demo-mode-279`).
- Selected surfaces:
  - the phone `/mobile` (run list, run screen and its views, New run, node sheet);
  - the native start screen, the iOS first screen and the iOS share extension. These are design-only routes (`/ios`, `/ios-share`), drawn from the approved Android start screen (`/android`, one-step-phone-pairing). The iOS app has no web source.
- Pinned source revision: phone baseline `phone-baseline-refresh-279` (`f7b4d68711`), accepted and integrated 2026-11-18. Desktop surfaces keep their earlier pins.
- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design`. Ticket branch `design/ios-demo-mode-279`, worktree `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/ios-demo-mode-279`. Accepted base `0d2d0b9a` (merged in), first base `fc68a7a4`.
- UI reference revision: recorded in `product-ticket.md` (the commit that adds this specification).
- Ticket folder: `tickets/in-progress/ios-demo-mode-279/` (after integration: `tickets/done/ios-demo-mode-279/`).
- Baseline report: `ui-baseline-report.md`, first section `phone-baseline-refresh-279`.

## Problem And Design Rationale

- **User problem and intent.**
  - Apple rejected AutoByteus 1.3.82 (42) under Guideline 2.1(a) "Information Needed". The reviewer cannot use the app: it needs the user's own computer, Tailscale and a pairing QR.
  - Apple named two remedies: a demonstration mode "that exhibits the app's full features and functionality" (a video "is not sufficient"), and "a demo QR code".
  - The founder chose a demo with no test node, opened by "Try demo" and by a demo QR code.
  - His rule for every choice: the demo works "100% like how your real application works", and iOS works like Android except where iOS does not allow it.
- **Key UX decisions and why.**
  1. **D1, scan-first first screen on iOS.** Today's iOS first screen is a developer form (a URL box, a cleartext switch, Tailscale/Settings buttons) and would be the reviewer's first impression. The iOS app takes the approved Android start screen (autobyteus-395 FU-001), so both apps look and work the same.
  2. **"Try demo" under Scan.** The founder's words. It is a quiet text button under the primary Scan, the same on first launch and with saved computers (**D4**), so the demo is always one tap away.
  3. **The demo QR code is the app's own link `autobyteus://demo`.** The app already registers the `autobyteus` scheme. In-app Scan says "Demo code found" and opens the demo; the system Camera opens it too. The code holds no address and no secret.
  4. **D2, the demo is built into the app.** The real `/mobile` screens run on a built-in sample world: offline, no server, and it cannot drift from the build under review.
  5. **The demo says what it is without changing the product's shape.**
     - The node button reads "Demo / Sample data" (a sparkles mark instead of the computer and its connection dot).
     - A welcome card can be closed.
     - The node sheet explains the demo and offers "Leave demo".
     - Nothing static is added to the run screens.
  6. **Every feature responds, with scripted results in the agents' own conversations.** No review controls.
  7. **D3, iPad landscape side by side.** At 1024 CSS px and wider, the run list stays as a 380 px pane beside what it opens. Sheets become centered cards from 768 px. This is the real app's iPad layout, not a demo-only one.
  8. **D6, Share to AutoByteus as on Android.**
     - Android acts on a share at once: a pairing link connects, other text opens Type an address pre-filled.
     - iOS does not let a share extension open its app, so the extension keeps the text ("Saved. Open AutoByteus to …") and the app acts on it when it opens, exactly as Android does.
  9. **D5: no "Try demo" on Android in this work.** The Play review did not ask for it; the shared start screen makes it a small later addition.
- **Alternatives considered and rejected:**
  - Adding only "Try demo" to today's iOS form: unfinished first impression, and iOS would differ from Android.
  - A website demo (it needs a server, can drift from the build, and the QR would need a web address).
  - A persistent demo banner on every screen: it costs vertical space the phone design keeps free.
  - Stretching the phone layout on iPad: it looks unfinished on an iPad Air.
  - Removing the share extension (the round 2 proposal): overruled by the founder's "no difference" rule.
  - "Share to a run" (shared text into a run's message box): a new feature, not today's behavior.

## Scope And Experience Goal

- User or actor: Apple's App Reviewer, and anyone opening the app without a computer at hand; on iPhone (17 Pro Max) and iPad (Air 11-inch).
- Context: the iOS app, first launch or later; no node, no network needed.
- Goal: try every feature of the app with sample data, and leave.
- Observable success: from the first screen, one tap ("Try demo") or one scan opens the run list of the demo. Every row opens, every ⋮ entry shows real sample content, every action responds without an error, and "Leave demo" returns to the first screen.
- In-scope surfaces and journeys: UIS-001…UIS-016, UXJ-001…UXJ-011.
- Non-goals:
  - pairing a real computer inside the demo, Switch node and Unpair (they need a computer);
  - a demo on Android;
  - an App Store submission, a TestFlight upload or any App Store Connect change (founder's word needed);
  - "Share to a run";
  - real-app follow-up: a top-level row learns its background tasks only after the run is opened (FU candidate; the demo shows them from the start).

## Related Requirements And Acceptance Criteria

| Behavior / Requirement / AC ID | UI/UX Obligation | Covered Journey / Surface / State |
| --- | --- | --- |
| Apple 2.1(a) item 1 (demonstration mode) | Every feature of the phone app is present and responds with sample data; no placeholder, unfinished or error state in the demo | UXJ-002…UXJ-009; UIS-004…UIS-013; VIS-004…VIS-025 |
| Apple 2.1(a) item 2 (demo QR code) | A demo QR code opens the demo from in-app Scan and from the Camera | UXJ-001b; UIS-002; VIS-003; `app-review/autobyteus-demo-qr-card.png` |
| D1, D4 | iOS first screen = the scan-first start screen, "Try demo" under Scan in both states | UXJ-001; UIS-001; VIS-001, VIS-002, VIS-030, VIS-032 |
| D2 | The demo is built in: no node address, no credential, no request leaves the device | all demo journeys; Data boundaries |
| D3 | iPad landscape two panes; centered sheets | UXJ-010; UIS-015; VIS-033…VIS-037 |
| D6 | Share extension keeps the text; the app acts as Android does | UXJ-011; UIS-016; VIS-026…VIS-029, VIS-037 |
| Guideline 4.2 | The app's own parts are present and named in the notes (native scanner pairing, Camera link, offline demo, iPad layout, share extension) | Notes draft |

## Visual Language

- **Existing product language to preserve:**
  - the phone shell (white, `slate-900` text, `blue-600` primary, 56 px bars, bottom sheets with a 40×4 handle, 16/500 row labels);
  - the approved native start screen (one-step-phone-pairing: 56 px header with the 28 px AutoByteus mark, the 72 px hero tile, the bottom bar with the 56 px Scan button);
  - the conversation, Activity, Files, Artifacts, Messages, Settings and VNC Viewer screens of `f7b4d68711`, unchanged.
- **Layout and hierarchy:**
  - **First screen:** header → scroll area (hero, or "Your nodes") → "Other ways to connect" → bottom bar (Scan, then Try demo). On iOS at tablet widths, the scroll content and the bar's buttons sit in one centered column, max width 448 px (`max-w-md`).
  - **Demo run list:** node button (left), "On this phone" ⋮ (right), welcome card (first item of the scroll area, 12 px side margins), the rows, the round +.
  - **iPad landscape:** the list pane is 380 px with a 1 px `slate-200` right border. The + sits at the pane's right edge (left 308 px). Screens the list opens start at 380 px. The empty pane is `slate-50` with a centered "Choose a run".
- **Grid, dimensions, spacing:**
  - welcome card: padding 12/48/12/16 px (the close button takes the right), radius 12, close button 44×44 at top 4 / right 4;
  - Try demo: 48 px high, 4 px below Scan, bottom inset `max(0.5rem, safe area)` on iOS;
  - node sheet demo row: min height 56;
  - share sheet: header 56, preview box 40 px high (10/12 padding), Done 48 high, 20 px above;
  - tablet sheet card: max width 512 px, 24 px above the bottom edge, all corners 16 px.
- **Typography:** the product's system sans.
  - Try demo: 17/600 `blue-700`.
  - Welcome title: 15/600 (line 24), body 14/20 `slate-600`.
  - Node button: name 16/600, line 12/16 `slate-500`.
  - Demo sheet text: 15/24 `slate-600`; Leave demo 16/500 with a 13/20 `slate-500` line.
  - Share preview: 13 px monospace `slate-700`, one line, truncated; share message 15/24.
  - Empty pane: 16/600 title, 14/20 `slate-500` line.
- **Color values and roles:**
  - Demo mark: `blue-50` circle with a `blue-600` sparkles icon.
  - Welcome card: `blue-50` with a `blue-100` border.
  - "Demo code found" turns the scanner corners `green-400`, as a found code does.
  - Destructive red is not used in the demo sheet: leaving loses nothing real.
- **Surfaces:** sheets `rounded-t-2xl` with `shadow-xl` over `slate-900/40`; tablet cards `rounded-2xl`. The empty pane's 56 px tile is white with `ring-1 slate-200` and `shadow-sm`, radius 16.
- **Icons** (Heroicons solid 20; every Heroicon is bundled locally, none fetched): `sparkles` (demo mark), `x-mark` (close), `arrow-left-start-on-rectangle` (Leave demo), `chevron-right`, `chat-bubble-left-right` (empty pane), `qr-code` (Scan).
- **Feedback states:**
  - Try demo pressed: `blue-50` background; focus ring 2 px `blue-500`.
  - Welcome close pressed: `blue-100`.
  - Leave demo pressed: `slate-50`.
  - The row of the open run in landscape is `blue-50` (the product's open-row state).

### New Or Changed Components

The UI reference location is traceability only; it does not prescribe the production implementation.

| Component | Purpose | Variants And States | UI Reference Location |
| --- | --- | --- | --- |
| iOS first screen (scan-first start screen) | Connect a computer, or Try demo | first launch / saved nodes; scanner (looking / code found / demo code found); connecting / connected / can't reach; Type an address (empty / pre-filled from a share); tablet column | `components/android/AndroidAppScreens.vue` (`platform="ios"`), `pages/ios.vue` |
| Demo node button | Says the run list is the demo; opens the demo sheet | demo only | `components/mobile/runList/MobileRunList.vue` |
| Welcome to the demo card | What the demo is and what to try | shown on each entry / closed for the visit | `MobileRunList.vue` |
| Demo sheet | The demo explained; Leave demo | phone sheet / tablet card | `components/mobile/connection/MobileConnectionSheet.vue` |
| iPad two-pane layout | List beside the open screen | ≥1024 px; empty pane "Choose a run" | `components/mobile/MobilePairedShell.vue` |
| Tablet sheet card | Sheets as centered cards on tablets | ≥768 px | `components/mobile/MobileBottomSheet.vue` |
| Phone Artifacts viewer (DC-011) | Read only on the phone: no Edit Mode / Preview switch | phone / desktop (unchanged) | `ArtifactContentViewer.vue` `preview-only`, `MobileArtifacts.vue` |
| Follow after your own send (DC-007, real app too) | Your send moves the view to your message and follows the reply | pinned / scrolled up | `components/workspace/agent/AgentConversationFeed.vue` |
| iOS share extension screen | Keeps shared text for the app; says what opening the app does | pairing link / demo link / other text / nothing usable; phone sheet / tablet card | `components/ios/IosShareExtension.vue`, `pages/ios-share.vue` |

## Journey Inventory

| Journey ID | User / Context | Starting State | Goal | Completion State | Related IDs |
| --- | --- | --- | --- | --- | --- |
| UXJ-001 | Reviewer, iPhone, first launch | iOS first screen | Open the demo with Try demo | Demo run list with the welcome card | D1, D2, D4 |
| UXJ-001b | Reviewer | iOS first screen; the demo QR code from the notes | Open the demo by scanning | "Demo code found", then the demo run list | Apple item 2 |
| UXJ-002 | Reviewer in the demo | Demo run list | Read a run's work | Showcase conversation of Daily Assistant | 2.1(a) |
| UXJ-003 | Reviewer | A run | Send a message and get a reply | The agent's tool call and sample answer, followed to the end | 2.1(a), DC-007 |
| UXJ-004 | Reviewer | A working run | Stop it | Idle on its screen and in the list | DC-006 |
| UXJ-005 | Reviewer | A run's ⋮ | Artifacts, Files, Messages, Activity, VNC Viewer, Settings | Each view with sample content; Settings saves | 2.1(a), V-01, R5-01 |
| UXJ-006 | Reviewer | A Team or Org | Open a member, read Messages, message it | Member conversation, Messages, a sample reply | A-01, V-05 |
| UXJ-007 | Reviewer | Run list + | Start a new run | New run, Create run, a reply | V-06 |
| UXJ-008 | Reviewer | A run's composer | Attach a file and send | The file attached; the reply names it | A-03 |
| UXJ-009 | Reviewer | Run list ⋮ | Change the text size for the whole app | Standard / Large / Largest applied | R2-02 |
| UXJ-010 | Reviewer, iPad | iPad portrait / landscape | The same journeys on iPad | Portrait: phone layout; landscape: two panes | D3 |
| UXJ-011 | User or reviewer in another app | A link or text in another app | Share it to AutoByteus | Extension "Saved. Open AutoByteus to …"; the app then connects, opens the demo, or opens Type an address pre-filled | D6 |
| UXJ-012 | Reviewer | Anywhere in the demo | Leave the demo | iOS first screen; the demo forgets everything | — |

## Journey Details

- **UXJ-001, Try demo:**
  1. The first screen shows the hero "Scan the QR code on your computer", "Other ways to connect", Scan and Try demo (VIS-001).
  2. Tap Try demo: the demo's run list opens at once, with "Demo / Sample data" and the welcome card (VIS-004).
  3. With saved computers, the same Try demo sits under Scan (VIS-002).
- **UXJ-001b, demo QR:**
  1. Tap Scan: the camera view opens, with "Point the camera at the QR code on your computer." (unchanged).
  2. On the demo code, the corners turn green and the hint reads **"Demo code found"** (VIS-003).
  3. About 0.7 s later the demo opens, as in UXJ-001.
  4. The system Camera opens `autobyteus://demo` in the app, with the same result. Any other code keeps its existing path.
- **UXJ-002:**
  1. Tap Daily Assistant. The showcase conversation shows a user message with three context files, Thinking, tool calls (`read_file`, a terminal, `edit_file`, `write_file`, the upgrade check finished), a long formatted answer, a sample chart, a message from Project Task Manager and a closing answer (VIS-007, VIS-008).
  2. Leave out failure states in the demo: no error block, no failed tool, no platform notice.
- **UXJ-003:**
  1. Type in the composer and send. Your message shows and the view moves to it, even if you had scrolled up (DC-007).
  2. The agent becomes Running. A tool call appears: Daily Assistant reads `docs/release-notes-1.6.md`; any other run lists its folder `demo-workspace`.
  3. The answer streams. It ends with "This is the demo, so this answer is a sample. With your own computer, your agent does the work and answers here the same way." Then the agent is Idle, in the list too (VIS-009).
  4. Members of a Team or Org answer the same way (VIS-020).
- **UXJ-004:** on a working run (Project Task Manager, VIS-016), the composer's red stop button turns it Idle, or "Background task running" if a background task is running, on its screen and its row (VIS-017).
- **UXJ-005, a run's ⋮** (Artifacts, Files, Activity, VNC Viewer, Settings; Messages for a member; VIS-010):
  - **Files** (VIS-011, VIS-012): the folder `demo-workspace` with `docs/`, `launch/`, `src/` and `README.md`. Every file opens with sample text; pictures open as sample screens. Search finds the files.
  - **Artifacts** (VIS-013, VIS-014): the showcase run's three finished files open read only, with no Edit Mode switch (DC-011). Any other run shows the product's empty state "No Artifacts yet".
  - **Activity** (VIS-015): background tasks (Running, Completed, Stopped with its end line), then the run's tool calls. Every agent and Team role has some.
  - **VNC Viewer** (VIS-022): a sample desktop, View only. Tap "View only" for Control, with Keyboard and Clipboard in the status row.
  - **Settings** (VIS-021): runtime and model rows. The sample models are named as samples on every runtime: demo/sample-model, demo/sample-reasoning-model, Sample Codex model / mini / fast, Sample Claude model, each "A sample model. Its answers are scripted." A live run shows the stop icon and locked rows; a stopped run changes and Saves; reopening shows the saved values.
- **UXJ-006:**
  1. Open a member of a Team or the Org, even after its Team was opened (A-01).
  2. Its conversation is about its own work, with tool calls (VIS-018).
  3. Messages are about its Team's work, with the files they name (VIS-019).
  4. Sending gets a sample reply (VIS-020).
- **UXJ-007:**
  1. Tap +: New run shows Agent, Folder `demo-workspace`, Runtime, Model and Auto approve tools (VIS-023).
  2. Create run, then send: the reply lists the run's folder and gives a general plan (VIS-024).
- **UXJ-008:** in the composer, tap + and choose a file. It attaches ("Context Files (1)"); after sending, the reply reads "I read <file name>. …" (VIS-025).
- **UXJ-009:** the run list's ⋮ (On this phone) › Text size: Standard / Large / Largest. It applies to every screen and survives a reload (VIS-005).
- **UXJ-010:**
  - **Portrait (820×1180):** the phone layout, with the first screen in one centered column (VIS-030, VIS-031).
  - **Landscape (1180×820):**
    - the list pane and "Choose a run" (VIS-033);
    - an open run on the right, with its row highlighted and no ← (VIS-034);
    - the demo sheet as a centered card (VIS-035);
    - a member's Messages on the right (VIS-036).
- **UXJ-011, share:**
  1. In another app, share to AutoByteus. The extension's sheet shows the AutoByteus mark and name, the shared text in one monospace line, and a message:
     - a pairing link: "Saved. Open AutoByteus to connect." (VIS-028);
     - the demo link: "Saved. Open AutoByteus to see the demo." (VIS-037);
     - other text: "Saved. Open AutoByteus to use it as an address." (VIS-026);
     - nothing usable: "AutoByteus couldn’t read text or a link from this share." (no preview).
  2. Done closes the extension.
  3. When AutoByteus opens next, as on Android:
     - a pairing link goes to "Connecting to <computer>" (VIS-029), then connected or "Can’t reach …";
     - the demo link opens the demo;
     - other text opens **Type an address** with the text in it (VIS-027).
  4. If the demo is open when a share arrives, the app leaves the demo for that.
  5. The shared text is used once.
- **UXJ-012:**
  1. Tap "Demo" › Leave demo ("Back to connecting your own computer"): the iOS first screen (VIS-006).
  2. Runs created, messages sent, Stop and Settings changes are forgotten. A cold launch also starts on the first screen; the demo is never remembered as a computer.

## Screen And Surface Specification

| Surface ID | Surface Name | Route / Entry | Purpose And Primary Action | Layout And Key Sections | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 | iOS first screen | app launch (no computer open) | Scan; Try demo | header, hero or Your nodes, Other ways to connect, Scan, Try demo | VIS-001, 002, 030, 032 |
| UIS-002 | Scanner | Scan | Find a code | camera, corners, hint ("Demo code found" for the demo code) | VIS-003 |
| UIS-003 | Demo run list | Try demo / demo code / demo link | Open a run | Demo node button, On this phone ⋮, welcome card, rows, + | VIS-004, 005, 031 |
| UIS-004 | Demo sheet | the Demo button | Leave demo | title "Demo", explanation, Leave demo row | VIS-006, 035 |
| UIS-005 | Run screen | a row | Read and send | product run screen; replies scripted | VIS-007, 008, 009, 016, 017, 018, 020, 024, 025 |
| UIS-006 | Run ⋮ | run screen ⋮ | Open a view | Artifacts, Files, (Messages), Activity, VNC Viewer, Settings | VIS-010 |
| UIS-007 | Files | ⋮ › Files | Open a file | demo-workspace tree, viewer | VIS-011, 012 |
| UIS-008 | Artifacts | ⋮ › Artifacts | Open a finished file | list, read-only viewer | VIS-013, 014 |
| UIS-009 | Activity | ⋮ › Activity | See work | background tasks, tool calls | VIS-015 |
| UIS-010 | Messages | member ⋮ › Messages | See messages between members | From/To rows with files | VIS-019, 036 |
| UIS-011 | Settings | ⋮ › Settings | Change runtime and model | rows, Model sheet, Save | VIS-021 |
| UIS-012 | VNC Viewer | ⋮ › VNC Viewer | See / control the desktop | View only / Control, Keyboard, Clipboard | VIS-022 |
| UIS-013 | New run | + | Start a run | Agent, Folder, Runtime, Model, Create run | VIS-023 |
| UIS-014 | Text size | run list ⋮ | Size for the whole app | Text size header, three steps | VIS-005 |
| UIS-015 | iPad two panes | ≥1024 px | List beside the open screen | 380 px pane, right area, empty pane | VIS-033, 034, 035, 036 |
| UIS-016 | Share extension | another app's share › AutoByteus | Keep the shared text | mark, preview, message, Done | VIS-026, 028, 037 |

## Interaction And State Transitions

| Transition ID | Surface / From State | User Action Or System Trigger | Immediate Feedback | Resulting State | Relevant Data Or Side Effect | Next Available Actions |
| --- | --- | --- | --- | --- | --- | --- |
| TR-001 | UIS-001 | Try demo | pressed state | UIS-003 with welcome card | fresh sample world | any demo journey |
| TR-002 | UIS-002 | demo code in view (2.2 s) | corners green, "Demo code found" | UIS-003 after ~0.7 s | — | — |
| TR-003 | UIS-003 | × on the welcome card | card closes | list without card for this visit | — | — |
| TR-004 | UIS-003 | Demo button | sheet opens | UIS-004 | — | Leave demo, Close |
| TR-005 | UIS-004 | Leave demo | — | UIS-001 | the demo's changes forgotten | Scan, Try demo |
| TR-006 | UIS-005 | Send | your message, view follows | Running → tool call → streamed answer → Idle | status on screen and row | send again |
| TR-007 | UIS-005 | Stop (red) | — | Idle (or background task running) in ~0.3 s | screen and row | send |
| TR-008 | UIS-011 | choose runtime / model, Save | Save enabled | saved; reopen shows the values | in memory | — |
| TR-009 | UIS-005 composer | attach a file | Context Files (1) | file sent with the message | local only | — |
| TR-010 | UIS-016 | Done | sheet closes | the other app | shared text kept for the app | open AutoByteus |
| TR-011 | UIS-001 (app opens with kept text) | — | — | pairing link → connecting; demo link → UIS-003; other text → Type an address pre-filled | text used once | Connect, Cancel |
| TR-012 | iPad portrait ↔ landscape | rotate | — | one screen ↔ two panes | the open run stays | — |

## State Behavior

| Surface / State | Trigger | Required Presentation And Copy | Available Actions | Recovery Or Exit | Visual ID |
| --- | --- | --- | --- | --- | --- |
| UIS-001 first launch | no computer saved | hero, Other ways to connect, Scan, Try demo | Scan, Try demo, Other ways | — | VIS-001 |
| UIS-001 saved computers | computers saved | Your nodes list, Scan, Try demo | open a computer, Scan, Try demo | — | VIS-002 |
| UIS-001 Type an address pre-filled | kept shared text that is not a link | sheet with the text | Connect | Close | VIS-027 |
| UIS-002 demo code found | demo code | "Demo code found", green corners | — | ← closes | VIS-003 |
| UIS-003 welcome | each entry | "Welcome to the demo" / "These agents, Teams and runs are samples. Nothing here is real, and nothing leaves this device." / "Open a run to read its work, send a message to get a reply, or start a new run with +." | × | — | VIS-004 |
| UIS-008 none yet | a run without artifacts | the product's "No Artifacts yet" | ← | — | — |
| UIS-015 nothing open | landscape, list only | "Choose a run" / "Its conversation opens here." | open a row | — | VIS-033 |
| UIS-016 nothing usable | share without text or a link | "AutoByteus couldn’t read text or a link from this share." | Done | — | — |
| Connecting (shared link) | kept pairing link | "Connecting to <computer>", Cancel | Cancel | the existing can't-reach screen with Retry / Scan again | VIS-029 |

Never in the demo: an error block, a failed tool, "not available", "Not reachable" rows, placeholder words (prototype, synthetic, fixture, mock), or any console error.

## Content, Labels, Validation, And Feedback

- **Voice:** plain, short, no technical words; "computer" toward the user, "node" only where the product already says it ("Your nodes").
- **Exact labels:**
  - First screen: Try demo.
  - Scanner: Demo code found.
  - Node button: Demo / Sample data.
  - Welcome card: Welcome to the demo, with the two lines above.
  - Demo sheet: title **Demo**; "The agents, Teams and runs here are samples stored on this device. Nothing is real, nothing is sent anywhere, and what you change is forgotten when you leave."; row **Leave demo** with "Back to connecting your own computer".
  - Empty pane: Choose a run / Its conversation opens here.
  - Share extension: AutoByteus; "Saved. Open AutoByteus to connect." / "Saved. Open AutoByteus to see the demo." / "Saved. Open AutoByteus to use it as an address." / "AutoByteus couldn’t read text or a link from this share."; Done.
  - Scripted reply closing line: "This is the demo, so this answer is a sample. With your own computer, your agent does the work and answers here the same way."
  - Sample model description: "A sample model. Its answers are scripted."
- **Empty, error, recovery:** the product's own (unchanged).

### Form And Input Validation

Unchanged — follows baseline (Type an address keeps its rules; the composer's file limits are the node's published limits, in the demo 25 MB for files and 200 MB for audio/video).

## Responsive And Platform Behavior

| Viewport Or Context | Range Or Condition | Layout And Navigation Changes | Interaction Changes |
| --- | --- | --- | --- |
| iPhone | < 768 CSS px (iPhone 17 Pro Max 440×956) | phone layout | — |
| iPad portrait | 768–1023 px (iPad Air 11-inch 820×1180) | phone layout; first screen one centered column (448 px); sheets as centered 512 px cards | — |
| iPad landscape | ≥ 1024 px (1180×820) | two panes (380 px list + the rest); empty pane; the run screen has no ←; views and New run open in the right area | rotating keeps the open run |
| iPhone landscape | any | phone layout (usable; verified) | — |
| Android | — | Unchanged — no Try demo (D5) | — |

## Accessibility And Keyboard Behavior

- **Target:** the product's existing phone level.
- **Focus order on the first screen:** header, scroll content, Scan, Try demo. Try demo and the welcome card's close button are buttons with visible 2 px `blue-500` focus rings.
- **Names:**
  - node button `aria-label` "Demo, sample data. About the demo";
  - welcome close "Close"; the welcome card is a labelled `section`;
  - the demo sheet is a dialog (the product's sheet);
  - the share sheet is `role="dialog"` with `aria-labelledby`, and its message is `role="status"`;
  - the scanner hint is `role="status"`.
- **Touch targets:** at least 44 px (Try demo 48, close 44, rows 56).
- **Contrast:** `blue-700` on white, `slate-600` on `blue-50`, `slate-500` on white for the secondary line, all as used in the product.

## Motion And Transitions

- Unchanged — follows the product (sheets, spinners, streaming text). Scripted timings, illustrative and matching the real app's feel:
  - demo code: found at 2.2 s, opens 0.7 s later;
  - reply: acknowledged 0.15 s, tool call about 1.9 s, text streams in 3-word steps of 70 ms;
  - Stop: about 0.3 s;
  - member reply: about 1.8 s.
- Reduced motion: the product's spinners already honor it; no new motion.

## Data, Contract, And Mock Boundaries

| Boundary / Data | UI Dependency | UI Reference Behavior | Production Behavior Required Or Still Unknown |
| --- | --- | --- | --- |
| Demo data source | every demo screen | sample world in the page (runs, conversations, files, artifacts, messages, activity, background tasks, models) | Built into the iOS app; the same `/mobile` screens; no network; resets on Leave demo and on cold launch (engineering decides the mechanism) |
| Scripted replies | UXJ-003, 006, 007, 008 | played on the local stream / added to the member's conversation | Scripted locally in the build; the closing sample line is exact copy |
| Demo QR / link | UXJ-001b, 011 | scan simulated (found after 2.2 s) | Real camera scan of `autobyteus://demo`; the Camera app opens it (registered `autobyteus` scheme) |
| Share extension | UXJ-011 | `/ios-share?text=` stands in for the other app; kept text read when `/ios` opens | iOS share extension keeps the text in the app group; the app acts on it when it next becomes active, as Android's `NodeConnectionFlow.connect` |
| Icons and assets | every screen | every Heroicon registered locally; no external request | Every icon and asset bundled; no request in airplane mode |
| Text size | UXJ-009 | phone-wide steps, kept in the browser | As shipped (f7b4d68711) |
| Illustrative data | all | names, titles, times, counts, file contents, model names | Engineering writes its own sample world of the same coverage; no real data |

## Final Visual Reference Inventory

All in `visual-references/`. Viewports: iPhone 440×956, iPad 820×1180 and 1180×820 CSS px, scale 2.

| Visual ID | Journey / Surface / State | Viewport | Image Path | Requirements-Defining Visible Details | Explicitly Illustrative Fixture Content Or Permitted Variation |
| --- | --- | --- | --- | --- | --- |
| VIS-001 | UXJ-001 / UIS-001 first launch | 440×956 | `VIS-001-iphone-first-screen-440x956.png` | hero, Other ways to connect, Scan, Try demo under Scan | — |
| VIS-002 | UIS-001 saved computers | 440×956 | `VIS-002-iphone-first-screen-saved-nodes-440x956.png` | Try demo also shown with nodes | node names |
| VIS-003 | UXJ-001b / UIS-002 | 440×956 | `VIS-003-iphone-scan-demo-code-found-440x956.png` | green corners, "Demo code found" | — |
| VIS-004 | UIS-003 welcome | 440×956 | `VIS-004-iphone-demo-run-list-welcome-440x956.png` | Demo / Sample data, sparkles mark, welcome card, ⋮, + | run names, titles, ages |
| VIS-005 | UXJ-009 / UIS-014 | 440×956 | `VIS-005-iphone-demo-on-this-phone-text-size-440x956.png` | Text size menu in the run list ⋮ | — |
| VIS-006 | UXJ-012 / UIS-004 | 440×956 | `VIS-006-iphone-demo-sheet-leave-demo-440x956.png` | sheet copy, Leave demo row | — |
| VIS-007 | UXJ-002 | 440×956 | `VIS-007-iphone-showcase-conversation-top-440x956.png` | every content type, no failure states | conversation text |
| VIS-008 | UXJ-002 | 440×956 | `VIS-008-iphone-showcase-conversation-picture-440x956.png` | sample picture, message from another agent named | chart, text |
| VIS-009 | UXJ-003 | 440×956 | `VIS-009-iphone-scripted-reply-440x956.png` | your message, tool call, sample answer with the closing line, followed to the end | reply text except the closing line |
| VIS-010 | UIS-006 | 440×956 | `VIS-010-iphone-run-menu-440x956.png` | Artifacts, Files, Activity, VNC Viewer, Settings | — |
| VIS-011 | UIS-007 | 440×956 | `VIS-011-iphone-files-440x956.png` | demo-workspace tree | file names |
| VIS-012 | UIS-007 viewer | 440×956 | `VIS-012-iphone-file-opened-440x956.png` | real sample content | content |
| VIS-013 | UIS-008 | 440×956 | `VIS-013-iphone-artifacts-440x956.png` | finished files only | names |
| VIS-014 | UIS-008 viewer (DC-011) | 440×956 | `VIS-014-iphone-artifact-opened-read-only-440x956.png` | no Edit Mode switch on the phone | content |
| VIS-015 | UIS-009 | 440×956 | `VIS-015-iphone-activity-background-tasks-440x956.png` | background tasks then tool calls | tasks, times |
| VIS-016 | UXJ-004 before | 440×956 | `VIS-016-iphone-running-run-stop-440x956.png` | Running, red stop | — |
| VIS-017 | UXJ-004 after | 440×956 | `VIS-017-iphone-after-stop-idle-440x956.png` | no longer working (background task running) | — |
| VIS-018 | UXJ-006 | 440×956 | `VIS-018-iphone-org-member-conversation-440x956.png` | member's own work with tool calls | text |
| VIS-019 | UIS-010 | 440×956 | `VIS-019-iphone-org-member-messages-440x956.png` | messages about the Org's work, with files | text, times |
| VIS-020 | UXJ-006 reply | 440×956 | `VIS-020-iphone-member-reply-440x956.png` | member's sample reply | text |
| VIS-021 | UIS-011 Model sheet | 440×956 | `VIS-021-iphone-settings-model-sheet-440x956.png` | sample model names and descriptions | — |
| VIS-022 | UIS-012 Control | 440×956 | `VIS-022-iphone-vnc-control-440x956.png` | Control, Keyboard, Clipboard | the sample desktop |
| VIS-023 | UIS-013 | 440×956 | `VIS-023-iphone-new-run-440x956.png` | Folder demo-workspace, sample model | agent |
| VIS-024 | UXJ-007 | 440×956 | `VIS-024-iphone-new-run-reply-440x956.png` | `list_directory · demo-workspace`, general plan | text |
| VIS-025 | UXJ-008 | 440×956 | `VIS-025-iphone-attachment-reply-440x956.png` | attached file named in the reply | file name |
| VIS-026 | UIS-016 other text | 440×956 | `VIS-026-iphone-share-extension-text-440x956.png` | mark, preview, "use it as an address", Done | the shared text |
| VIS-027 | UXJ-011 app | 440×956 | `VIS-027-iphone-shared-text-type-an-address-440x956.png` | Type an address pre-filled | text |
| VIS-028 | UIS-016 pairing link | 440×956 | `VIS-028-iphone-share-extension-pairing-link-440x956.png` | "Saved. Open AutoByteus to connect." | link |
| VIS-029 | UXJ-011 app | 440×956 | `VIS-029-iphone-shared-link-connecting-440x956.png` | Connecting to <computer>, Cancel | computer name |
| VIS-030 | UIS-001 iPad portrait | 820×1180 | `VIS-030-ipad-portrait-first-screen-820x1180.png` | centered 448 px column | — |
| VIS-031 | UIS-003 iPad portrait | 820×1180 | `VIS-031-ipad-portrait-demo-run-list-820x1180.png` | phone layout full width | data |
| VIS-032 | UIS-001 iPad landscape | 1180×820 | `VIS-032-ipad-landscape-first-screen-1180x820.png` | centered column | — |
| VIS-033 | UIS-015 nothing open | 1180×820 | `VIS-033-ipad-landscape-choose-a-run-1180x820.png` | 380 px pane, "Choose a run" | data |
| VIS-034 | UIS-015 run open | 1180×820 | `VIS-034-ipad-landscape-run-open-1180x820.png` | open row highlighted, no ←, run on the right | data |
| VIS-035 | UIS-004 tablet card | 1180×820 | `VIS-035-ipad-landscape-demo-sheet-1180x820.png` | centered 512 px card | — |
| VIS-036 | UIS-010 on iPad | 1180×820 | `VIS-036-ipad-landscape-member-messages-1180x820.png` | Messages in the right area | data |
| VIS-037 | UIS-016 demo link, tablet card | 1180×820 | `VIS-037-ipad-landscape-share-extension-demo-link-1180x820.png` | "Saved. Open AutoByteus to see the demo." | — |

App Review attachments: `app-review/autobyteus-demo-qr-card.png`, `app-review/autobyteus-demo-qr.png` (QR `autobyteus://demo`, error correction M). Notes draft: `app-review/app-review-notes-draft.md` (round 6).

## Linked UI Reference Evidence

- Runnable UI reference: `corepack pnpm dev --port 3279` in the design repository; `/ios`, `/ios-share?text=<shared>`, `/mobile` (runbook section `ios-demo-mode-279`).
- Ticket record: `product-ticket.md`. Review history and decisions: `design-review-notes.md` (rounds 1–6). Solution Designer's verification: `/Users/normy/autobyteus_org/autobyteus-worktrees/ios-demo-mode-279/tickets/in-progress/ios-demo-mode-279/evidence/demo-verification/verdict.md` with `crawl.mjs`, `sheets.mjs`, `final.mjs`, `upload.mjs`.
- Mocked boundaries and limitations:
  - the camera, the Camera app and the share sheet of another app are simulated (the reference cannot prove them);
  - the demo state is in the browser session;
  - `?text=` stands in for the other app only.

## Implementation Fidelity Boundary

- **Must preserve:**
  - every label and message above;
  - the placement of Try demo and the demo's node button;
  - the welcome card and the demo sheet;
  - the scripted outcomes (reply with a tool call, Stop, member reply, attach, Settings Save);
  - "no failure states, no placeholders, no console errors" in the demo;
  - the iPad breakpoints (768 cards, 1024 two panes, 380 px pane);
  - the share extension's messages and the app's Android-equal handling;
  - DC-007 (follow after your own send) and DC-011 (phone Artifacts read only) in the real app too.
- **Not prescriptive:**
  - the reference's stores, the local stream, the snapshot patching;
  - the stand-ins for the pinned desktop store (`refreshCatalog`, `refreshModelList`);
  - the browser `sessionStorage` / `localStorage` keys.
- **May vary:** every sample name, title, time, count, file and conversation content. Engineering writes its own sample world, with at least the same coverage:
  - agents, Teams with members, an Org, delegated work;
  - running, idle and stopped runs, and an idle run with background tasks;
  - Files and Artifacts with real-looking content and a picture;
  - Messages, and Activity on every run.
- **Engineering acceptance conditions** (Solution Designer, verdict Round 6):
  1. every icon and asset bundled, and no network request while the demo is open, in airplane mode;
  2. no console errors on the demo paths (VNC Control, Model sheets included);
  3. the real camera scan of the demo QR and the Camera-app link `autobyteus://demo` open the demo;
  4. no crash on a fresh install, on iPhone and iPad;
  5. the review notes work as written.

## Out Of Scope

- Android "Try demo" (D5). "Share to a run". Pairing a real computer inside the demo, Switch node, Unpair.
- The real-app follow-up candidate: a top-level row learns its background tasks only after the run is opened.
- Any App Store submission, TestFlight upload or App Store Connect change (the founder's word needed).

## Open Decisions And Risks

- The founder's approval of these screens (pending).
- Apple's guideline 2.1(a) says a demo mode needs "prior approval". The drafted reply goes with the resubmission (Solution Designer's advice, the founder's word needed).
- "It works offline … nothing is sent anywhere" stays in the notes only if engineering condition 1 passes.

## Final Consistency Check

- User confirmation is recorded: `No` — decisions recorded (the founder via the Solution Designer); the founder's approval of the screens pending.
- Design repository/root, source pin, and UI reference revision are recorded: `Yes`
- Ticket record, ticket folder, and linked artifacts agree: `Yes`
- Every in-scope journey is specified: `Yes`
- Every surface and state needed to define the approved experience has an applicable final visual reference: `Yes`
- Every section covers the affected scope or is marked `Unchanged — follows baseline` or `N/A`: `Yes`
- Recorded visual, content, responsive, accessibility, and motion values come from the existing product or the approved change: `Yes`
- UI reference, screenshots, and this specification agree: `Yes`
- Final visuals are production-quality and contain no unintended placeholders, generic starter styling, clipping, overlap, or visual drift: `Yes`
- Every visible detail is requirements-defining unless an explicit illustrative or permitted-variation entry says otherwise: `Yes`
- Mocked boundaries and unresolved production behavior are explicit: `Yes`
- Design repository artifact and visual-reference paths agree with this specification: `Yes`
