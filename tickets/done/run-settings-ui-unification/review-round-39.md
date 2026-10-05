# Review Round 39 — SR-005: other model settings (Codex Fast mode)

Request: Solution Designer, `product-design-request-r3.md` (SR-005, Result Correction). After the old
run forms were removed, Codex **Fast mode** (`service_tier`, one value `fast`; unset = Default) and
any other non-thinking model setting could not be set anywhere. Requirements REQ-022 / AC-019 /
BEH-009 are approved; the presentation is Product's call.

User confirmation (2026-10-05): "perfect. i checked. its great".

## Intake

- Both repositories were fetched. Design `origin/personal` = `a5b0eec`; source `origin/personal` =
  `fc79fad` (unchanged since SR-003), so no baseline refresh.
- Ticket reopened (`tickets/done` → `tickets/in-progress`) on `design/run-settings-ui-unification`,
  re-created from `origin/personal`.

## Decision: each other model setting is its own small control next to Thinking

Not a group inside the Thinking menu (the provisional idea). Fast mode is about speed and cost, not
thinking: inside "Thinking" it would be mislabelled and one click deeper, and a model with only Fast
mode would show a "Thinking" chip with nothing to think about. The user confirmed this proposal over
the in-menu alternative.

- **Generic rule.** Every config-schema parameter of the selected model that is not a thinking
  setting is an "other model setting", labelled by its schema title (e.g. "Fast mode"):
  - "Default or one value" (or a boolean) → a **toggle chip** showing the value (e.g. "Fast");
    on = set, off = unset (Default).
  - Several values → a small **menu chip** ("{value} ⌄", menu titled by the setting, Default first).
  - Known settings get an icon (`service_tier` → bolt); others use the neutral adjustments icon.
- **Message box (New chat).** After Thinking: `⚡ Fast`. Off: gray text and outline bolt. On: blue
  text on a light-blue background with a solid bolt; `aria-pressed`; tooltip/aria "Fast mode: On" /
  "Fast mode: Off". On phones (< `sm`) the chip shows the icon only, so Send keeps its place.
- **Labelled settings (Org card, member drawer, saved runs).** A row per setting under Thinking,
  labelled by the schema title ("Fast mode"), with the same chip.
  - Members: the row is marked "Customized" and has its own Reset when the member's value differs
    from its parent's. Thinking is compared without the other settings, so changing or resetting
    Fast mode leaves Thinking inherited (and vice versa). A member whose model settings match the
    parent again follows the parent again.
  - Saved runs: locked while running (value + lock: "Fast" or "Off"), editable when stopped; a
    change shows the Save bar; members follow unless customized.
  - Launching/copying: locked like the other rows.
- **Member summary line** adds the label of each setting that is on, after the model: "GPT-5.6 Sol ·
  Codex · Fast · Auto-approve".
- **A model with only other settings** (no thinking): the message box shows only the chip; the card
  keeps "Thinking: Not available for this model" and adds the Fast mode row.
- **A model without other settings** shows nothing extra.
- Changing thinking keeps Fast mode and vice versa (one model config). "+" copy and the heading
  switcher carry it with the model config, as thinking.

## Copy (en / zh-CN)

- `chat.modelOption.default`: "Default" / "默认"
- `chat.modelOption.on`: "On" / "开"; `chat.modelOption.off`: "Off" / "关"
- `chat.modelOption.toggleTitle`: "{{setting}}: {{state}}" / "{{setting}}：{{state}}"
- The setting title ("Fast mode") and value ("Fast") come from the model's schema (server label
  and enum value, humanized), as Thinking's labels do.

## UI reference changes

- `components/chat/chatModelOptions.ts` (options from the schema, apply, summary labels);
  `components/chat/ChatModelOptionControl.vue` (toggle/menu chip).
- `ChatNewSurface.vue` (chips after Thinking), `RunSettingsCard.vue` (rows, per-setting Customized
  and Reset, Thinking compared without other settings), `RunMemberRow.vue` (summary),
  `useChatTargetMembers.ts` / `memberNodes.ts` / `runSettings.ts` (parent config per member).
- Fixtures (`runtimeCatalogFixture.ts`): Codex models in the server's parameter format — GPT-5.6 Sol
  (reasoning effort + Fast mode), GPT-5.6 Instant (Fast mode only); GPT-5.6 Mini unchanged (no
  settings).
- Icons `heroicons:bolt(-solid)`, `heroicons:adjustments-horizontal(-solid)` added to the offline
  bundle.

## Validation

- Browser (http://127.0.0.1:4520): New chat Sol → Fast off/on, thinking change keeps Fast; Instant →
  only the chip; Org card row; member Fast off → Customized + row Reset → follows the Org again;
  Team launched with Sol + Fast → saved run running (locked) → stop → editable, Save bar; 390 px
  (icon-only chip, Send inside the box).
- `pnpm test` 14/14; lint clean; no type errors in ticket files.

## Additional visual references (user request: "take enough screenshot")

Besides the SR-005 states (VIS-020..029), the states previously specified only by copy were
captured: `@` menu (VIS-030), Org page no model / copying / prefilled / starting / switcher open /
tools open (VIS-031..036), saved run stopping / stop failed / read-only / refresh required / model
unavailable (VIS-037..041), New chat prefilled from an Agent run "+" (VIS-042).
