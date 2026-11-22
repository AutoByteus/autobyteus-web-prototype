# Review Round 1: AutoByteus Extensions UI (autobyteus-516)

For the founder. Status: **awaiting your review**; nothing here is approved yet. After your confirmation the Product Team captures the final screenshots and writes `ui-ux-spec.md`.

## How to open it

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
