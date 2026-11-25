# Round 5 — spine coverage (extensions-ui-516, autobyteus-516)

For the Solution Designer's spine-by-spine validation. Authorities: `extension-contract.md`, `pairing-contract.md` and `use-case-spines.md` as rewritten on 2026-11-25. Captures are in `review-captures/round-5/` (1440×900, English, interim review aids, not normative); each was taken by walking the spine through the UI reference from its normal entry. "Not visible: server only" means the step has no screen of its own; its result shows in the next visible step.

Live: https://normys-macbook-pro.tail0347f8.ts.net:8445/settings?section=extensions (opens as the desktop app's own window). Starting states: `localStorage['autobyteus.prototype.extensions']` = `fresh`, `voice_update`, `voice_failed`, `voice_not_available`, `extension_broken`, `state_unreadable`, `network_joined`, `network_trust`, `network_headscale`, `network_headscale_down`, `network_host`, `network_approval`, `network_signed_out`, `network_restarting`, `network_vpn`, `voice_newer_contract`; `localStorage['autobyteus.prototype.catalog'] = 'unverified'` or `'offline'`; context `electron_external` = a Docker node's window, scenario `nodes_access` = a window without owner access.

## Part V — Voice Input (Stage 1)

| Spine | Step | Screen | Capture |
| --- | --- | --- | --- |
| V1 list | Owner opens Settings → Extensions in a window | Extensions page, "Extensions of Embedded Node · this computer", one card per offered extension | V1-01-list-this-computer |
| V1 | offeredOn: Voice Input not listed on another node | Docker node's window: Private Network only, note "Voice Input belongs to the computer you work at…" | V1-02-list-docker-window-no-voice |
| V1 | No owner credential → nothing listed | Note only: "This AutoByteus does not control docker yet. Connect this node in Nodes to manage its extensions." | V1-03-no-owner-credential-note-only |
| V1 | Plain browser / phone | Note only | V1-04-browser-window-note |
| V1 | Platform filter → notAvailableHere | "Not available on this computer" + platforms offered | V1-05-not-available-on-this-computer |
| V1 | Credential attached, GraphQL owner check, catalog verify, state.json, status() | Not visible: server only | — |
| V2 install | Card Install | Not installed + Install | V2-01-not-installed |
| V2 | Package download (a few KB), sha256, unpack, compare with catalog | "Downloading Voice Input 1.0.0", moving bar (no percent) | V2-02-installing-downloading-the-package |
| V2 | Server part install: the runtime's prepare step downloads ~2 GB, no byte total | "Preparing the speech model (downloads about 2 GB once; this can take a few minutes)", moving bar, no percent. (The percent bar stays for extensions that report `progress.percent`: Private Network, T1-01.) | V2-03-installing-preparing-speech-model-no-percent |
| V2 | state.json {enabled:false} → installed | Off, "Installed. Turn it on to use it." (open: Off or On) | V2-04-installed-off |
| V3 adopt | One-time move, first start fetches the small package, adopts | Not visible: server / desktop start only | — |
| V3 | Result: still On, English, folder | Card On; page: Language English, Voice runtime 0.3.0, model, folder | V3-01-adopted-on-english-folder |
| V4 on/off | Switch on → On at once (status() is ready when runtime and model are present; the program starts on the first transcription, where the slow note shows, V5-03 / V8-03) | Card states | V4-01-off, V4-02-on-at-once, V4-03-off-again |
| V4 | Off stops the worker; actions refused while off | Not visible: server only (microphone button hidden while not ready: V5-05) | — |
| V5 dictate | Microphone button on a voice surface | Memory search (composer, Task, Project use the same button) | V5-01-microphone-button-memory-search |
| V5 | Recorder (this window, chosen microphone) | Recording, Cancel recording | V5-02-recording |
| V5 | POST …/actions/transcribe, route owner check, Server Part Host, worker | Not visible: server only; "Transcribing voice input…"; after ~2 s "Starting the speech model. The first use can take up to 30 seconds." | V5-03-transcribing-slow-note |
| V5 | {text} → draft, not sent | Transcript in the search box; Search waits | V5-04-transcript-in-search-box |
| V5 | Not installed / off / not ready → no button | No microphone | V5-05-no-microphone-when-voice-not-ready |
| V6 | Window of another node: WAV to this computer's node | Docker window: the microphone is offered (this computer's Voice Input) | V6-01-docker-window-microphone-uses-this-computer |
| V7 language | Page → bridge setLanguage → settings.json → reply | Voice Input page: Language → "Saved" | V7-01-language-saved-on-extension-page |
| V7 | event.source check, page has no network | Not visible: frame boundary only | — |
| V8 mic & Test | Microphone choice (AutoByteus's own section) | "Microphone on this computer" | V8-01-microphone-choice-autobyteus-section |
| V8 | Test: record → transcribe (as V5) → result in the card | Recording, transcribing with the slow note, last result | V8-02-test-recording, V8-03-test-transcribing-slow-note, V8-04-test-result |
| V9 update | Catalog higher → "Update to x.y.z" | "1.1.0 available" + Update to 1.1.0 | V9-01-update-available |
| V9 | stop → replace package/ → install(ctx) | "Updating · Keeping your voice runtime, speech model and language" | V9-02-updating |
| V9 | still on | 1.1.0, On | V9-03-updated-still-on |
| V10 remove | Remove (confirmed) | Confirmation (deletes runtime, model, language; about 2 GB again on reinstall; microphone choice stays) | V10-01-remove-confirmation |
| V10 | stop → delete → state entry removed | Removing → Not installed | V10-02-removing, V10-03-not-installed |
| V11 log | View log → last lines | Log dialog, Copy, Close | V11-01-log |
| V12 | A broken extension → its card Failed; the others work | Private Network Failed with its message, Voice Input On | V12-01-broken-extension-failed-other-works |
| V12 | Unreadable state.json → everything Off | Voice Input Off | V12-02-unreadable-state-everything-off |
| V13 | No owner / phone credential | as V1-03 / V1-04 | V1-03, V1-04 |
| V13 | Tampered catalog / other signing key | Red note "AutoByteus could not verify the list of extensions…"; Install / Update disabled; installed ones keep working | V13-01-catalog-unverified |
| V13 | Catalog cannot be reached (offline) | Calm note "Could not reach the list of extensions. Installed extensions keep working; try again later."; Install / Update disabled | V13-03-catalog-not-reachable |
| V13 | Wrong checksum / package differs from the catalog | The card's Failed state with the message, Install again | V13-02-install-refused-checksum-failed |
| V13 | Unsupported contract version | "Not available" + "Needs a newer AutoByteus. Update AutoByteus to install Voice Input 2.0.0." (contract §6 notAvailableHere) | V13-04-needs-a-newer-autobyteus |
| V13 | Inherited property as an action name | Not visible: server only | — |

## Part T — Private Network (Tailscale / Headscale)

| Spine | Step | Screen | Capture |
| --- | --- | --- | --- |
| T1 install & sign in | Install (downloads the network program) | Installing, percent | T1-01-installing |
| T1 | On → start step: server part starts the program | Not ready "Starting the network program…" | T1-02-starting-network-program |
| T1 | Page: choose the network | Not ready "Not connected to a private network yet. Choose one below." + Tailscale account / My own Headscale server / Host | T1-03-not-ready-choose-network |
| T1 | signIn → login link → user approves on Tailscale's site (provisional) | "Finish signing in to Tailscale in your browser. This page continues by itself." | T1-04-sign-in-waiting |
| T1 | Running → status ready → This machine, My machines | On "Connected … as home-mac"; This machine; My machines with added-by, tag and shared machines | T1-05-joined-this-machine-my-machines |
| T1 | (on joining) offer "find this node" | "Let your other AutoByteus nodes find this node?" | T1-06-offer-let-network-find-this-node |
| T1 | Pasted auth key (option, provisional) | Auth key field, "a one-time key without tags" | T1-07-auth-key-option |
| T1 | Headscale: invite code shown before joining ("for") | "Joins as bob's machine: it will be bob's, not yours." | T1-08-invite-code-joins-as-bob |
| T1 | Device approval may make it wait (provisional) | "Waiting for approval in your Tailscale admin console." | T1-09-waiting-for-approval |
| T1 | Key expiry (provisional) | "Signed out of Tailscale… Sign in again" | T1-10-signed-out-sign-in-again |
| T2 restart | Node start → start step → rejoins (~12.6 s) | Not ready "Rejoining your private network after a restart…" → On; Nodes card the same | T2-01-rejoining-after-restart, T2-02-rejoined, T2-03-nodes-card-while-rejoining |
| T3 discoverable | Nodes switch → one boolean | "Let my private network find this node" Off / On | T3-01-find-this-node-off, T3-02-find-this-node-on |
| T3 | /autobyteus/info answered only when on | Not visible: server only | — |
| T4 discovery | foundNodes → machine list → /autobyteus/info → minus paired → marked | "Found on your private network": yours / someone else's / unknown on your account; requests above | T4-01-found-on-your-private-network |
| T5 pair own | Owned node in the Nodes list, not paired | linux-box row: "Agents here can't work with linux-box yet" | T5-01-linux-box-in-list-not-paired |
| T5 | Pair → grant on B → A sends /pair → keys exchanged (G1 for the app → node B) | "Pairing…", "exchange keys over your private network" | T5-02-pairing |
| T5 | Both store peer records → Nodes list mark | linux-box paired in place, "Private network" mark | T5-03-paired-in-place-private-network-mark |
| T6 someone else's | Pair → /pair without grant → outstanding request | "Waiting for bob to accept", Cancel | T6-01-waiting-for-bob-to-accept-cancel |
| T6 | /pair-rejected | "Its owner declined", Pair again | T6-02-its-owner-declined-pair-again |
| T6 | Accept on B → /pair-accepted → A stores teammate | bob-laptop row: "Teammate · bob's node · peer only", no Open | T6-03-bob-accepted-teammate-row |
| T6 | Incoming on this node | "carol-server, added by carol, wants to pair", Reject / Accept | T6-04-carol-wants-to-pair-accept-reject |
| T6 | Accept → pairs as teammate | "Pairing…" → carol-server teammate row | T6-05-accepting, T6-06-carol-teammate-row |
| T6 | Cancel → withdrawn on B | Not visible here (B shows the request gone) | — |
| T7 collaborate | Signed requests between peers | Not visible: server only; the paired row's agents list (e.g. "2 Agents") as today | T5-03 |
| T8 access code | First-run page (that computer, no owner; G4 on Docker) | Step 1 Join | T8-01-first-run-join |
| T8 | Installs Private Network first (G2) → Sign in | "Installing Private Network on this node first (about 30 MB)…" | T8-02-first-run-installing-private-network |
| T8 | Make an access code {nodeId, address, setupCode, expiresAt} | Access code with QR, Copy, "Expires in 30:00 · works once", warning | T8-03-first-run-access-code |
| T8 | Pasted under Nodes → Add node → expiry checked → reached through the app's node relay (G1) | "Reaching the node at 100.88.80.80…" then "Connecting to build-server as its owner…" | T8-04-add-node-reaching-the-node |
| T8 | Setup exchange → owner credential → node listed | build-server in the list, owner access, not paired | T8-05-listed-with-owner-access |
| T8 | (the node's page) | "build-server is added: it is listed under Nodes, where you can pair it." | T8-06-first-run-added |
| T8 | Used / expired / malformed refused | "This access code was already used. Make a new one on the node." | T8-07-used-access-code-refused |
| T8 | A node with an owner: This node → Make an access code (owner windows only) | Access code panel in This node | T8-08-this-node-make-an-access-code |
| T8 | Then Pair as T5 | as T5 | T5-02, T5-03 |
| T9 | Unpair your own node (peer records deleted) | **Unpair** on the row's "Private network" mark → inline confirmation "Unpair linux-box? Agents here stop working with it. It stays in your Nodes list, and you can pair it again." | T9-01-unpair-own-node-confirmation |
| T9 | Your node stays listed with control, mark gone, "Agents here can't work with linux-box yet"; found again | Nodes list; Found on your private network | T9-02-own-node-unpaired-stays-in-list, T9-03-found-again |
| T9 | Unpair a teammate's node | "Unpair carol-server? It leaves your list; carol's node has to ask to pair again." (a teammate row has no Remove) | T9-04-unpair-teammate-confirmation |
| T9 | The teammate row leaves the list (found again) | Nodes list | T9-05-teammate-unpaired-row-gone |
| T9 | Leave → program logs out, state forgotten | Inline confirmation; then "Join a private network" again | T9-06-leave-confirmation, T9-07-left-join-again |
| T9 | Remove (today's): takes a node out of the list | Unchanged (trash icon) on nodes you control | — |
| T9 | Machine removed in the admin console (~11 s) | Not visible as a control: the machine disappears from My machines / Found | — |
| T10 trust | Switch on (confirmation with the risk) | Confirmation; On with the risk line | T10-01-trust-confirmation, T10-02-trust-on-risk |
| T10 | /pair without grant from your account → paired | Not visible: server only (the node appears paired in the list) | — |

Also designed (private-network-types.md): Headscale server unreachable, hosting on this machine, your own VPN ranges, the host's invite code (captures in round 3: R3-02…R3-17).

## Open (kept as designed, listed in the spec)

- Founder: install ends Off or On; translated name / description and the page's language; Reinstall and Open folder; one click for your own nodes (or Pair + Accept); the first-run page offering "Let my private network find this node".
- Provisional: Tailscale sign-in, auth keys, device approval, key expiry, sharing; G1 (the app reaching a private address through its own node's relay; visible only as "Reaching the node…"); G2 (first-run installs the extension; needs the internet); G4 ("only this computer" on a Docker node's first-run page); hosting.
- Corrections applied 2026-11-25 (your validation): V2, V4, V13 (offline, newer contract), T9 (Unpair); DC-058…DC-061.
