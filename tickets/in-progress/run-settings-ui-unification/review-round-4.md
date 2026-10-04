# Review Round 4 — run-settings-ui-unification

User feedback (2026-10-04, paraphrased): the team shouldn't sit inside the message box as a
chip; show it in the middle of the page as the big name, and keep the message box for the message.

## Change

- For an agent, team or org target, the page heading becomes the target: 48 px avatar (agent
  initials circle; team/org icon tile), the name as the 1.75rem heading, a kind line ("Agent",
  "Agent team · 2 members", "Agent org"), a short description ("Uses its own tools and skills." /
  "Your message goes to the team’s coordinator." / "Your message starts this org.") and a quiet
  "↶ Use the assistant instead" link (replaces the chip's ×).
- The target chip is removed from the message box; the placeholder still names the target.
- The default assistant keeps "What should we work on?" and its `/` and `@` hint.
- The members line wraps cleanly on narrow screens.
