# Review: AutoByteus Extensions UI (autobyteus-516), rounds 1–4

For the founder. Status: **awaiting your review**; nothing here is approved yet. After your confirmation the Product Team captures the final screenshots and writes `ui-ux-spec.md`.

## Round 4 (2026-11-24): your node code, confirmed by the Solution Designer

Your decision: the target node makes the code in its own UI, and you paste it on the desktop that should control it (pairing-contract §6a; DC-043…DC-047).

- **New node, first-run page** (on that computer): 1 Join your private network (Tailscale sign-in, an invite code, or no private network), 2 Connect this node to your desktop: Make a node code (QR, Copy, 30 minutes, works once, password warning). When your desktop has used it: "build-server is connected".
- **Desktop:** Nodes → Add node → "Have a node code? Paste it instead" → Add node: the node appears with owner access, not paired (pair it there as before). Expired or used codes are refused.
- **A node that has an owner:** Manage Nodes → This node → "Let another desktop control this node" (only in windows with owner access).
- Removed: the desktop's "Add a machine" connection code. The host's "Invite someone" stays.

Try it: open https://normys-macbook-pro.tail0347f8.ts.net:8445/first-run in one tab and /nodes?nodeTab=manage in a second tab of the same browser (the first-run page notices the paste through the shared browser storage; in the product, the node knows).

Provisional: the desktop reaching a private address through its own node (G1); "only this computer can use this page" on a Docker node (G4).

## Round 3 (2026-11-24): every Private Network type, confirmed by the Solution Designer

You asked for a design per network type. The Solution Designer wrote how each one works (`private-network-types.md` in the Software Engineering ticket) and confirmed this round against it (DC-029…DC-041).

- **Join** offers Tailscale account, My own Headscale server, Host a private network on this machine; **Your own VPN** (private address ranges) is under them in every state.
- **Tailscale:** sign in or a one-time auth key without tags; "Waiting for approval in your Tailscale admin console"; "Signed out of Tailscale… Sign in again"; tagged and shared machines never count as yours.
- **Headscale:** server address + join key, or an invite code from a host; Add a machine with a pasted key, or a stored API key so the node makes keys itself; "server cannot be reached".
- **Hosting (designed now, built later):** warning (always-on machine, not a laptop), domain + port, the steps with a reachability check, then Hosting facts, Add a machine in one click and **Invite someone**: first "for one of my machines" or "for a teammate" (the teammate's own name, so their machine is theirs), then an invite code with QR.
- **Your own VPN:** private ranges only (public addresses refused), large ranges warned; alone, Nodes says it cannot find nodes: add them by address and pair with codes.
- **Nodes** names the network, or shows what needs attention; **Leave** says switching means pairing again.

Try it on the share: Settings → Extensions → Private Network (Install, turn on, choose a type). Starting states for the browser console: `localStorage.setItem('autobyteus.prototype.extensions', 'network_host')` (or `network_headscale`, `network_approval`, `network_signed_out`, `network_headscale_down`, `network_vpn`), then reload. A host domain starting with `home.` fails the first reachability check.

Provisional (drawn, not proved): everything with a real Tailscale account, Headscale invite codes and API-made keys, everything specific to hosting. Proved: joining a Headscale server, the machine list, pairing, the connection code.

## Round 2 (2026-11-24): checked with the Solution Designer

The Solution Designer checked every flow against the validated contracts and probes and confirmed round 2 ("now follow the validated workflow", 2026-11-24). Changes since round 1 (DC-018…DC-028 in `design-change-log.md`):

- **Pair** is for your own node that is already in your Nodes list (linux-box): it is paired in place and gets the "Private network" mark.
- **Trust machines I added** acts only on requests: your own machines that ask to pair with this node are paired without asking you; nodes you find still need Pair.
- **The connection code** goes only on a new node's first-run page (the paste option on an existing node is gone).
- **Add a machine on Tailscale** first asks for a one-time join key from the Tailscale admin console; a Headscale server makes its own.
- **A declined Connect** shows "Its owner declined" with Connect again (raspberrypi in the example).
- **A window without owner access** shows only "Connect this node in Nodes to manage its extensions".
- **Voice Input** shows its real fields (runtime, speech model, folder), the slow-start note appears only when a transcription waits longer than about 2 s, sizes are about 1.2 GB.
- Pairing takes about 2 s, as measured; the first-run node is "build-server".

Provisional (drawn, not validated yet): Sign in with Tailscale, a Tailscale join key, Add a machine on a Tailscale network.

Your open decisions (also asked by the Solution Designer): install ends **Off** (built) or On; an installed card without **Reinstall** and **Open Folder** (built); extensions' text **English** in the Chinese app for now (built) or translated.

Opens directly at https://normys-macbook-pro.tail0347f8.ts.net:8445/settings?section=extensions as the desktop app (no console step on the share).

## How to open it (round 1)

Run the UI reference (`/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/extensions-ui-516`, port 4516) and open it as the desktop app's own window: in the browser console of <http://127.0.0.1:4516> run

```js
localStorage.setItem('autobyteus.prototype.context', 'electron_internal'); localStorage.setItem('autobyteus.prototype.scenario', 'nodes_user'); location.reload()
```

Then:

1. **Settings → Extensions** <http://127.0.0.1:4516/settings?section=extensions>: Voice Input (installed, on) and Private Network (not installed).
   - Voice Input → Show settings: its own page (Language, what is installed), then AutoByteus's Microphone and Test. Start Test → Stop Test: the first transcription says it can take up to 30 s.
   - View log, Remove (confirmation), the switch (Not ready → On).
2. **Private Network → Install** (progress) → switch on → its page opens: **Sign in with Tailscale** (finishes by itself after about 3 s), or a join key, or your own Headscale server, or a connection code.
   - Joined: This machine, My machines, **Add a machine** (QR, code, expiry, password warning).
   - The offer "Let your other AutoByteus nodes find this node?".
3. **Nodes → Manage Nodes** <http://127.0.0.1:4516/nodes?nodeTab=manage>: **Found on your private network**:
   - linux-box **Pair** (one click; it moves into Nodes);
   - bob-laptop **Connect** (bob allows after about 7 s; teammate, peer only, no Open);
   - raspberrypi flagged (Connect only, never one click);
   - carol-server **Allow / Reject**;
   - the two switches (turning trust on asks first).
4. **First-run page of a new node** <http://127.0.0.1:4516/first-run>: paste the code you copied in step 2 → set up. An old code is refused.

To start already joined, add `localStorage.setItem('autobyteus.prototype.extensions', 'network_joined')`.

Other starting states (`autobyteus.prototype.extensions`):
- `fresh`, `voice_failed`, `voice_update`, `voice_not_available`;
- `network_trust` (trust already on: your nodes pair by themselves).

A Docker node's window: context `electron_external` (Voice Input is not listed there). Chinese: `localStorage['autobyteus.localization.preference-mode']='zh-CN'`.

## What I recommend, and the alternatives

| Question (request) | Recommendation (built) | Alternatives considered |
| --- | --- | --- |
| How a card opens its extension page | **In place, inside its card** (Show settings). Extension pages are small; you keep the card's state, log and Remove in view; no new route or panel. | A side panel (more room, but hides the list and is a second pattern in Settings); an own page per extension (a route per extension; heavier than the pages need). |
| Where the microphone choice and Test live | **In Voice Input's card, under its page, drawn by AutoByteus** ("Microphone on this computer"). Everything about voice stays in one place, as today; only the code owner changes. | A "Voice" section in Settings (splits voice in two places); a menu on each microphone button (the choice exists, but the Test has no room there). |
| Install progress and the long first transcription | The extension's own message with a percent bar (or a moving bar); "Not ready" with its message while it starts; the Test says the first transcription takes up to 30 s. | A toast at the end of the install (easy to miss); a note on every microphone button (noise every time, not only the first). |
| Found nodes, requests, unknown machines in the Nodes tab | **One "Private network" card between This node and Nodes**: switches, then requests, then found nodes. Paired nodes move into Nodes with a mark. | Found nodes mixed into the Nodes list (finding would look like trust); a separate tab (hides requests). |
| The two switches | In the Nodes card (your words: "in the nodes area … a toggle"); "find this node" is also **offered once on joining**, inside the Private Network card. | Both switches in the extension's page (an extension page cannot change pairing policy; pairing is AutoByteus's). |
| Connection code | Text + QR + countdown + "works once" + password warning, with Copy; expired → Make a new code. Pasted on the new node's first-run page, or in an existing node's Private Network page ("Join and pair"). | Text only (no QR for a second screen nearby); a link (would need a server that is reachable publicly). |

## Findings for the Solution Designer (to decide or approve)

1. **Page height (contract §5):**
   - The bridge has no way for a page to tell its frame how tall it is, so a frame would need a fixed height or an inner scroll bar.
   - The reference adds one optional message, `{ call: "resize", input: { height } }`, from page to frame, with no answer.
   - Recommend adding it as an optional message of contract v1.
2. **English text in the Chinese app (contract §1, §5):**
   - The catalog has no translations, and the bridge passes no language, so in Chinese the card's description and the extension's own page stay English. You can see this in the reference.
   - Recommend optional translated `name` and `description` in the catalog entry, plus the app's language in a first message to the page.
   - This is your decision; the reference shows the contract as validated.
3. **Install ends Off (AC-002):** built as written. If you prefer an install to end On (one click fewer), AC-002 changes.
4. **Reinstall and Open Folder go away on an installed card (DC-009):**
   - Remove then Install covers Reinstall; "Install again" stays on a failed card.
   - The contract has no folder action, so Voice Input's page shows the folder instead.
   - AC-002 names Reinstall, and Open Folder is today's behavior, so please confirm.
5. **Who may read the list:**
   - A window without owner access shows the list read-only.
   - A browser window shows a note and no list.
   - AC-006 leaves reading to the design's route table, so this is a recommendation.
6. **Removing Private Network:** the confirmation says nodes paired through it stay paired but cannot reach this node. This consequence is an assumption; please confirm it.
7. **Not designed, because not proved:**
   - direct vs relayed (left out of My machines);
   - different networks, mobile data, Android, real Tailscale invites;
   - a "teammate" connection code;
   - leaving the network.
8. **Pairing time:** "Pairing…" is shown while keys are exchanged. The probe measured restart/revocation at 11–13 s; the reference shortens pairing to about 4.5 s.

## Simulated in the reference (not production)

- Each node's extension manager, the two extensions' server parts, the private network, discovery and pairing are small scripted stores (`stores/extensionsStore.ts`, `stores/privateNetworkStore.ts`). Every name, account, address, key, code, size and log line is invented (`alex@example.com`, `100.88.x.x`).
- The extension pages are real sandboxed frames with a real `postMessage` bridge; their network access is blocked by CSP and sandbox.
- No microphone is opened (the Test is scripted; the microphones are invented). A paired node joins the simulated network of nodes.
- The first-run page is a design route standing for the node's own page.
