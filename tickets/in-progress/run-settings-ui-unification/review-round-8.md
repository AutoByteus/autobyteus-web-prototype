# Review Round 8 — run-settings-ui-unification

User: "now let's continue" (after the baseline refresh).

## Gap found

"+" in a running Team's or Org's header still opened the round-1 run panel with the run's
settings copied (Team: copied launch config; Org: `mode=configuration&sourceOrgRunId`). Every
other way to start a run already opened New chat.

## Change

- Team "+" (header, and the running-runs panel): loads the same copied launch settings as before,
  then opens New chat addressed to the team with them prefilled — workspace, model + runtime,
  thinking, approval — and each member's own settings as member customizations ("● N of M
  customized · Edit · Reset").
- Org "+": opens New chat addressed to the Org, prefilled from the source Org run (defaults,
  agent overrides, team overrides, and a placed team's workspace only where it differs from the
  Org's). If the copy cannot be read, the Org still opens in New chat with its defaults.
- Agent "+" is unchanged: it already opens New chat with the agent and the run's workspace (the
  model follows the last-used model, as approved in UIS-013 R3).
- Review data: the hand-written review runtimes are now marked verified-ready, as the refreshed
  source checks per-runtime readiness before launch (a Claude SDK team default launches).

## Simulation limit

The synthetic node returns one stored Team run configuration, so Team "+" in the review build
copies that stored run (prototype-workspace, Ask first), not the run just launched.

## Open question for the user

Should Agent "+" also copy the run's model, thinking and approval (like Team and Org "+"), or keep
today's behaviour (agent + workspace, last-used model)?
