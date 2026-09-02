# Focused Review Guide — AgentOrg Mounted-Team Member Overrides (RV-003)

## Open

`http://127.0.0.1:4198/workspace?root=org&org=software-development-department&phase=config&prototypeReview=aorg-team-overrides`

The ticket-owned server remains active on port `4198`. Reload this URL to reset the deterministic draft.

## Review Only These Four States

1. **Initial:** confirm `Member overrides (7)` is collapsed, its chevron is immediately beside the label rather than at the far edge, and the typography/control treatment matches AgentTeam.
2. **Teams collapsed:** open `Member overrides`; confirm the direct Agent row is preserved and both Team rows are collapsed, each showing name, `TEAM`, exact mounted address, and `Inherited`.
3. **One Team expanded:** open **Product Design & Prototyping**; confirm **Software Engineering** stays collapsed and the expanded Team uses the familiar AgentTeam launch controls plus its two exact Agent rows.
4. **Selective customization and continuity:** turn on the Team-level **Auto approve tools**, then turn on Auto approve for `product_prototyper`; confirm the Team says `Customized`, only that Agent says `Overridden`, then collapse and reopen the Team to confirm the draft remains.

Also confirm that setting only an Agent override on a fresh reload leaves the Team row `Inherited`.

## Evidence

- Browser validation: `review-evidence/rv-003/browser-validation.json` — `14/14` pass, exact-Agent count `7`, measured `6px` label-to-chevron gap, exact computed disclosure styling, and zero browser errors.
- Desktop captures: `RV3-001`–`RV3-004` under `review-evidence/rv-003/`.
- Narrow capture: `RV3-005-outer-open-teams-collapsed-narrow-390x844.png`.
- Static validation: `validation/static-validation-rv-003.txt`.

The user approved RV-003 on `2026-09-02`. The `RV-*` captures remain non-normative review evidence; the canonical approved references are `VIS-OVR-001`–`VIS-OVR-006` under `visual-references/`.
