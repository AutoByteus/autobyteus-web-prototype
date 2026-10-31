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
