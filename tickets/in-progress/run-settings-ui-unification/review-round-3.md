# Review Round 3 — run-settings-ui-unification

Review URL: http://127.0.0.1:4520

## User feedback (2026-10-04, paraphrased)

The inline member list still needs improvement. Better: clicking "Customize members" slides a
configuration panel in from the right side, like back-office tools do.

## Change (DC: round 3)

- "Customize members" / "Edit" opens a **right-side member settings panel** (480 px, full height,
  slides in from the right edge; full-screen sheet below 640 px). The chat content shifts left so
  the message box stays visible and usable; no backdrop.
- Panel: header (icon, "Member settings", "{team} · N members", close ×); a grey summary of
  what members start with ("Members start with the settings from the message box": workspace ·
  model runtime · thinking · approval); the member list (rows expand inline with the Chat
  controls; Org teams as groups with their own workspace); footer with live count and **Done**.
- Esc closes an open menu first, then the panel; focus returns to the trigger.
- Inside the panel the model menu right-aligns and opens a runtime's models in place (drill-in)
  instead of a side flyout.
- Choosing a member model no longer counts its default thinking as a customization.
- The line under the composer is unchanged ("All N members use these settings · Customize
  members" / "● 1 of 2 customized · Edit · Reset").

## Round 3a (user: the top summary looks squeezed)

- The inherited-settings summary is now a labelled list, one setting per line in the run-settings
  order and words (Workspace · Model · Thinking · Tool approval), instead of one dot-separated
  line that wrapped with dangling separators. Heading shortened to "Members start with the message
  box settings". Unavailable thinking reads "Not available for this model" in grey.
