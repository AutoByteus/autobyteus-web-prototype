# Design review notes — integrations-page (revision 1, for the user)

Review URL: http://127.0.0.1:4940/integrations (the main-menu item **Integrations**, after Skills). Everything is clicked from the product's own controls.

## The design in one sentence
One full-width card per integration, laid out as the path the user described: **1 Install → 2 Connect → 3 Give agents access** (adding the integration's skill to an agent), with the tools the integration needs at the bottom.

## What to try
1. Install (1.8 s), then paste a token and Connect. A token containing `bad`, `reject` or `revoked` is rejected ("GitHub rejected the token."), `offline` gives "could not be checked"; anything else connects as `@alex-dev`.
2. Test, Replace token, Remove (back to "Installed, needs a token").
3. Skills now lists `github-integration` and Skills → Sources lists the repository; "Go to Agents" opens the agents page.
4. Other starting states (browser console, then reload; remove the key to reset): `localStorage.setItem('autobyteus.prototype.scenario', '<name>')` with
   `integrations_connected`, `integrations_several` (GitHub connected, Jira "Needs a newer AutoByteus", SSH not installed; Jira and SSH are invented examples with no icon), `integrations_tool_missing` (jq not found), `integrations_install_clash`, `integrations_token_revoked` (Test refused), `integrations_offline` (nothing installed; the first Retry fails again, the second works), `integrations_offline_installed` (installed card plus a notice with Retry).
5. Settings → Server Settings → Basics no longer has the GitHub card.

## Decisions I made (and the alternatives, in words)
- **Steps on the card, not a form.** The alternative was a Settings-style card with a token field always visible. The steps teach the model the user asked for (install, connect, then add the skill to an agent) and let the same card serve all four states.
- **One column.** Cards are tall and carry text, so a grid would make one card look half-empty now and cramped later.
- **Menu position:** after Skills (an integration installs a skill); icon `heroicons:puzzle-piece`.
- **"Replace token"** is a button that reveals the field, so a connected card is calm. Remove has no confirmation (as today).
- **Tools** show in every state but "Needs a newer AutoByteus"; a missing tool is amber with text, a "Check again" link, and no install action.
- **Agent access** lives on the card (the sentence, with the skill name highlighted) plus a "Go to Agents" button once connected.
- Success of Install and Connect is shown by the card changing; only Test results, Remove and errors get a message, beside the step they belong to.

## Open decisions, marked as such
- **DEC-001** (who decides where tokens go): the state **Needs a newer AutoByteus** (and its "Check for updates" link to Settings → Updates) exists only if the app decides (recommended option a). If the manifest decides, delete that state.
- **DEC-002** (agents set to "all installed skills"): the small line "Agents set to use all installed skills do not get access automatically." states the recommended answer. If the user decides Yes, delete the line. (The Agents page already shows an agent, Daily Assistant, set to "All installed skills".)

## Illustrative
GitHub's description and token help (and the link in it), the account `@alex-dev`, dates, and the Jira and SSH cards are invented. Engineering shows each integration's own `integration.json` text; a web address in `token.help` becomes a link and nothing else is interpreted.

## Data origin
All data is invented (`prototype/integrations/integrationsDesignFixture.ts`); nothing is read from GitHub or a node. State is in memory: a reload resets it. No test, `validate:*` or `capture:*` script was added.

## Revision 2 (2026-10-31): the Solution Designer's answers (DEC-007…DEC-010)
- **Empty page (DEC-007):** the repository is reachable but lists no valid integration -> a plain card, "No integrations are available yet." (scenario `integrations_empty`). Unreachable and nothing installed -> the Retry message (unchanged). Unreachable with something installed -> the installed cards plus a note: "Couldn't check github.com/AutoByteus/autobyteus-integrations for new integrations. Showing the integrations you have installed." with Retry (reworded).
- **Order (DEC-008, DEC-009):** alphabetical by name, no grouping by state; the page lists everything in the repository plus everything installed (an installed integration that left the repository still shows as a normal card). An integration the app has no definition for shows name, description and icon with "Needs a newer AutoByteus", no Install and no connect step. No icon -> the letter tile.
- **Step 2 is a general "Connect" step (DEC-010):** its title and general texts no longer say "token" ("Connect GitHub", "Connect your GitHub account. AutoByteus keeps what it needs on this node.", "Connected to GitHub"). The word "token" stays inside the GitHub token form (label, placeholder, hint, "Replace token") only. Only that form is designed.
- **To confirm:** the status chip text **Installed, needs a token** is the wording in the brief (REQ-002), so it still says "token". If other integrations will not use a token, a neutral wording such as "Installed, needs connecting" is better; the Solution Designer decides.
