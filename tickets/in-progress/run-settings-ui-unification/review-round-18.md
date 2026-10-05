# Review Round 18 — the real AutoByteus Org as a review fixture

User request: simulate the real AutoByteus Org from `/Users/normy/autobyteus_org/autobyteus-agents`.
The synthetic Org (2 members, a 2-member team) is too small to judge how member settings behave.

## Source

`autobyteus-agents` `origin/main@d5233c3` (fetched; the local checkout was 2 commits behind with
unrelated ticket files):

- `agent-orgs/autobyteus-org`
- `agent-teams/{product,software-engineering,marketing}-team`
- `agents/computer-use-operator`

## Fixture

`prototype/run-settings/autobyteusOrgFixture.ts` is hand-written and about 10 KB.

| Org member | Team | Coordinator | Members |
| --- | --- | --- | --- |
| `product_team` | Product Team | `product_ui_ux_designer` | `product_ui_ux_designer`, `ui_baseline_bootstrapper` |
| `software_engineering_team` | Software Engineering Team | `solution_designer` | `solution_designer`, `architecture_reviewer`, `implementation_engineer`, `code_reviewer`, `api_e2e_engineer`, `delivery_engineer` |
| `marketing_team` | Marketing Team | `marketing_content_creator` | `marketing_content_creator`, `marketing_performance_analyst`, `computer_use_operator` (shared agent) |

- Team members are team-local agents (`team-local-agent:<team>:<agent>`), as in the product.
  Computer Use Operator is a shared agent.
- Copied: structure and display text only (IDs, names, member names, coordinators, ownership, one-line
  descriptions). Instructions, skills, tools, handoff text and account data are not copied.
- None of the definitions sets a default model, as in the source. The message box opens with the
  design app's current model.
- The fixture is added to the populated scenario only. It appears in Agent Orgs, Agent Teams and
  Agents, and in the local GraphQL reads that the Org launch uses.

## Validation

- Browser at http://127.0.0.1:4520:
  - Agent Orgs lists AutoByteus Org with its three teams.
  - Run opens New chat headed "AutoByteus Org" with "All 11 members use these settings".
  - The member panel shows Product Team / Software Engineering Team / Marketing Team. Opening them
    shows 2 / 6 / 3 members, with the coordinators marked.
  - Agent Teams → Software Engineering Team → Run shows "All 6 members use these settings".
- `pnpm test` 14/14; lint passes; `vue-tsc` clean for changed files.

## What the realistic size shows (for review)

At the default 480 px panel width:

- long member names (`product_ui_ux_designer`) and the second summary line truncate;
- the model menu inside an opened team truncates ("mock/gpt-prot… AutoBy…");
- with all teams opened, the panel is a long scroll.

These are left for the user to judge with the real Org. They can be addressed in the next round.
