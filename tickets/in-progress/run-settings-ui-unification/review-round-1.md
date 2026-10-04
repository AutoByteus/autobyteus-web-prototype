# Review Round 1 — run-settings-ui-unification

Review URL: http://127.0.0.1:4520 (ticket worktree, `corepack pnpm dev --port 4520`)

## Proposal (for user decision; nothing here is approved)

**DEC-001 → recommend "refresh the run panels with the Chat vocabulary" (ideas A + B + C), not "Run opens the chat composer" (D).**
Why: D still needs a panel for member customization and for saved-run settings, Orgs cannot be Chat targets today (UNK-002), and launching without a first message (UNK-003) would be new behaviour. A keeps every Run entry point and gives the clean look.

One vocabulary everywhere:

- The same four rows in the same order, in one bordered card: **Workspace · Model · Thinking · Tool approval**.
- Each value is the Chat composer's own control: the workspace menu, the model menu (runtime chosen inside it, shown as grey secondary text), the merged thinking menu (Off / Low / Medium / High) and the Auto-approve / Ask first toggle.
- No help text that repeats the label, no Existing/New toggle, no green confirmation line, no separate Runtime dropdown, no Advanced section.
- The definition name becomes a small header (avatar, name, "Agent team · 2 members") instead of a disabled input.
- The workspace path is one grey footnote, as in Chat.

**DEC-002 → recommend that members customize Model (runtime comes with it), Thinking and Tool approval.** Workspace is chosen per run, and per placed team inside an Org. Members do not get a workspace or a separate runtime control.

Team / Org "defaults and exceptions":

- "Team defaults" / "Org defaults" card, then one compact **Members** list.
- A collapsed row shows only what that member changes (blue dot + "GPT-5.6 Sol · Ask first"), otherwise grey "Team defaults".
- Each customized row has a reset icon; the header shows "1 customized · Reset all".
- Click a row to customize it inline: the same rows; values it inherits are muted and marked "Team default", its own values get "Reset".
- Org: agents and teams placed in the Org are rows. A team row shows "2 members" and opens to its own settings (including workspace) plus its members. There are no `TEAM` badges and no raw addresses; the address is only a tooltip.
- Validation names the member: "Choose a model for writer to run." The old "Select a model for / before launch." is gone (REQ-003).

Saved run (B):

- Header with status ("● Stopped · Team run").
- One quiet line replaces the banners: "Changes apply when this run resumes." / "Stop this run to change its model or thinking." / amber "Saved settings need a refresh before you can change them. Refresh".
- Workspace, runtime and tool approval read as plain values with a small lock. Model and thinking stay editable while the run is stopped. The model menu lists only the run's runtime ("Models on AutoByteus").
- Saved settings the model no longer offers stay visible ("Kept from the saved run: temperature 0.2").
- **Save appears only after a change**, as a bar with "Unsaved changes · Discard · Save".

Antigravity: the approval chip shows "Auto-approve 🔒", with the tooltip "Antigravity always runs with auto-approve." It is never counted as a customization.

## Where To Look

1. Agents → **Run** on Daily Assistant (SCN-001). Pick a model from the model chip; Run.
2. Agent Teams → **Run** (SCN-002). Expand `writer`, pick a model under *Antigravity CLI* → see the AGY lock, the summary, Reset and Reset all.
3. Agent Orgs → **Run** (SCN-003). Expand *Product Review Team*.
4. Workspace tree → prototype-workspace → Product Review Team → "Review the current prot…" → ⚙ (SCN-004, stopped). Change the model → Save bar.
   - Refresh-required state: in the browser console run `localStorage.setItem('autobyteus.design.runSettings.existingState','refresh_required')`, then reload. Remove the key to reset.
5. Research Assistant → "Compare current navigatio…" → ⚙ (a saved Agent run whose model settings are locked).

## Evidence

`review-evidence/round-1/` (disposable review aids, not normative):
R1-00 baseline Agent and Org, R1-01 Agent launch, R1-02 Team member customized (AGY), R1-03 Org team open, R1-04 model/runtime menu, R1-05 saved Team with unsaved change, R1-06 refresh required, R1-07 saved Agent locked, R1-08 Team at 390 px.

## Validated In Browser (1440×900 unless noted)

- New Agent / Team / Org panels render inside the unchanged shell. Agent and Team Run launch exactly as before; Org Run behaves the same as the baseline.
- Model menu opens downward, with the runtime submenu flipping before the panel edge. The thinking menu works and a member customize/reset round-trips through the real launch draft.
- Saved Team (stopped) edit → Save bar → Saved. Refresh-required and locked states render.
- 390×844: rows fit, member summaries collapse to the indicator dot.
- `vue-tsc` on all changed files: no errors beyond the baseline's global `$t` typing noise. Repository `pnpm typecheck` passes.

## Questions For The User

1. DEC-001: is A (refreshed panels, recommended) right, or do you want to see D (Run opens Chat) built as well?
2. DEC-002: members get Model / Thinking / Tool approval only, and a team placed in an Org also gets its own Workspace. OK?
3. Is the labelled four-row card right, or should the panel be even closer to Chat (one horizontal chip row)?
4. Source delta: fresh launches in the latest source default to Auto-approve; the review keeps the baseline's "Ask first". Should the design follow the newer source default?
