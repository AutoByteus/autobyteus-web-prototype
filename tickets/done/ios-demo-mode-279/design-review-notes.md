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

## Round 3 — the Solution Designer's round 2 verification (2026-11-18)

| ID | Finding | Resolution |
| --- | --- | --- |
| V-01 (rest) | Artifacts opened "Synthetic file — Fixture content only." | Artifacts open the demo folder's sample content and pictures, the same as Files. |
| R2-02 | The reference was behind the shipped phone screens (Text size in the run's ⋮, four steps) | The phone baseline was refreshed to `origin/personal@f7b4d68711` (ticket `phone-baseline-refresh-279`, accepted and integrated, `personal` at `0d2d0b9a`) and merged into this branch. The demo now sits on the shipped phone: Text size lives in the run list's ⋮ (On this phone: Standard, Large, Largest), Settings is last in the run's ⋮, Settings works for every run, an idle agent shows its running background tasks, and VNC Control shows Keyboard and Clipboard in the status row. Notes round 3 describe Text size where the app has it. |
| — | (found in the recheck) a listed run's background-task state appeared only after the run had been opened (the shipped product reads it from the live run) | DC-006 extended: the demo's data is on the device, so a row shows "Background task running" from the start (one status per run). |

All demo journeys were checked again on the merged branch, at 440×956 and 1180×820.

## Round 4 — the Solution Designer's strict App Reviewer sweep (2026-11-18)

| ID | Finding | Resolution |
| --- | --- | --- |
| A-01 | A member of an already-opened Team or Org did not open ("Team context … is already mounted") | The phone's open sequence (reference stand-in) focuses the member of a Team that is already open, as the product's shared open does (`selectTreeRunFromHistory` → `inspectTeamMember`); only a Team not open yet is opened. |
| A-02 | Artifacts › README.md "Content not available yet … the server captures …" | In the demo only the showcase run has artifacts (finished files); every other run, new ones too, shows the product's empty state. |
| A-03 | Attaching a file: "Couldn't attach sample.txt." | The node's context-file limits are answered (synthetic); the file attaches locally, and the agent's sample reply names it ("I read sample.txt."). |
| A-04 | Icons fetched from api.iconify.design | The reference registers the whole local Heroicons set: the sweep sees no external request. For the build: an engineering acceptance criterion (every icon and asset bundled, no request in airplane mode). The notes keep "works offline" only on that condition (noted in the draft). |
| A-05 | Three rows open a run titled "Research Assistant" | A demo run's title is its row's agent. |
| A-06 | Team (and agent) Activity "No activity yet" | Every Team role (Software Engineering, Marketing, Support, Code Searcher) and every top-level agent has one piece of its own work with a tool call; its Activity lists those calls. Messages exist for every member, not only the Org's. |
| A-07 | "Show older" repeats names | The older runs are distinct agents: Personal Assistant, Writing Coach, Travel Planner, Contract Reader, Refactoring Assistant, Weekly Planner, Billing Team, Documentation Team. The two Software Engineering Team copies under Project Task Manager stay (they show delegated copies). |
| A-08 | Console: "Disconnection timed out.", Vue readonly warnings | Both were reference artifacts and are fixed there: the local socket reports its close on a later turn, as a browser's does; the font-size store is no longer overwritten by captured snapshots. The build's no-console-error check stays an engineering criterion. |
| A-09 | Artifacts viewer's edit pencil | DC-011 (phone): Artifacts are read only on the phone, so the viewer offers no Edit Mode / Preview switch there (the desktop keeps it). |
| — | Sample wording | The showcase and its files say "imports name the row to fix" instead of "import errors / a failed import" (same meaning, no alarm words). |

Re-sweep with the Solution Designer's `crawl.mjs` (all 40 rows, every ⋮ entry, every file, attach): iPhone 440×956 and iPad 1180×820, **0 findings, 0 browser errors, no external request**. Attach-and-send, VNC Control, Stop, member reply, scan and Leave demo rechecked; `/mobile` and `/android` outside the demo unchanged.

## Round 5 — the Solution Designer's final reviewer path (2026-11-19)

| ID | Finding | Resolution |
| --- | --- | --- |
| R5-01 | Settings › Model on Codex App Server and Claude Agent SDK listed fixture names ("GPT-5.6 Sol — Synthetic run-settings model") | Every runtime's models in the demo are sample models that say so: Sample Codex model / mini / fast, Sample Claude model, each "A sample model. Its answers are scripted." |
| R5-02 | Choosing a model logged "Unhandled error … MobileChoiceSheet" | The cause was the known `llmStore.refreshCatalog is not a function`: the phone's rows (f7b4d68711) call catalog actions that the pinned desktop store lacks. The reference now has stand-ins that re-read the local catalog (`refreshCatalog`, `refreshModelList`), so opening a Model sheet, choosing a model and "Refresh models" log nothing, in and outside the demo. |

Checked: his `final.mjs` (live-run Stop, runtime and model change, Save, reopen, Leave demo, Try demo, a Team member): every step passes, errors `[]`. A sheet sweep of every Runtime and every Model option in New run and in a stopped run's Settings, plus Refresh models: 0 findings, 0 errors. `crawl.mjs` on iPhone and iPad: 40 rows, 0 findings, 0 errors.
