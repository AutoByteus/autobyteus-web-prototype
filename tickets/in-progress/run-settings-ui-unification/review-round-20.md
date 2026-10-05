# Review Round 20 — consistency pass across every run-settings surface

User request: check the whole UI touched by this ticket for consistency. The user also flagged
that the saved-run settings page ("Team Configuration") still had redundant text, such as
"Files are saved in …".

## Saved-run settings (Edit Config on an Agent, Team or Org run)

These now use the same language as New chat and the member panel:

- Removed "Files are saved in /…". The locked workspace shows its path on hover (round 17 rule).
- Removed the "Team defaults" / "Org defaults" / "Settings" title above the settings card.
- Removed "All use defaults" and the per-row "Team defaults" text.
- The settings card is the same white card as an opened member: `rounded-xl`, thin border, small
  shadow and no row dividers. Labels are dark.
- Members use the member-panel rows: 32 px avatar, Coordinator badge, a grey summary line
  ("model · runtime · approval"), the blue "Customized" label, and an opened member as a white card.
  The list sits under a small "Members" heading and aligns with the card above.
- Status line: a stopped run whose settings cannot be edited said "Stop this run to change its
  model or thinking.", which contradicts "Stopped". This was inherited from the product. It now says
  "This run's settings can't be changed." (en) / "此运行的设置无法更改。" (zh-CN). Running runs keep
  "Stop this run …", and stopped editable runs keep "Changes apply when this run resumes.".

## Obsolete UI removed

Every new run now starts in New chat: Run on the Agents / Agent Teams / Agent Orgs pages, "+" on
a Team or Org run, the workspace-tree "+" and the empty-workspace "Choose an agent or team" link.
The launch configuration forms can no longer be reached, so they are deleted:

- Round-1 components: `run-settings/AgentLaunchSettings.vue`, `TeamLaunchSettings.vue`,
  `OrgLaunchSettings.vue`, `RunWorkspaceHint.vue`.
- Baseline launch UI:
  - `workspace/config/AgentOrgRunConfigPanel.vue` (the `mode=configuration` Org route);
  - `DraftRunConfigEditor.vue`;
  - `AgentRunConfigForm.vue`, `TeamRunConfigForm.vue`, `AgentOrgRunConfigForm.vue` and their
    sub-forms (`TeamMemberConfigTree`, `TeamScopeConfigEditor`, `MemberOverrideItem`,
    `MemberOverridesDisclosure`, `AgentOrgDirectAgentOverrideRow`, `AutoApproveSwitch`,
    `FixedWorkspacePath`, `WorkspaceSelector`);
  - `composables/useRunActions.ts`.
- `RunConfigPanel.vue` now shows only the selected saved run's settings. `WorkspaceAdaptiveLayout`
  no longer has a pending-launch branch or an Org configuration branch.
- The shared run-settings components now have one style. The boxed member-row variant, the
  "Default" tags and the muted inherited values are removed, along with the chat controls'
  `muted` option.

Not touched: the mobile run setup (a separate paired-phone surface) and Applications launch
profiles. Neither is in this ticket's scope.

## Validation (browser, http://127.0.0.1:4520, 1440 px)

- Agent Teams → Run:
  - New chat "Product Review Team" with no workspace line.
  - The member panel shows member rows. Changing researcher's approval shows "Customized" and
    "1 of 2 customized · Edit · Reset".
  - Send launches the Team and opens its run.
- The Team run's Edit Config shows the clean saved view ("Running", "Stop this run …").
- Agent Orgs → AutoByteus Org → Run: "All 11 members use these settings"; the panel lists the 3
  teams; the resize edge is present.
- Agents → Run: New chat for the agent, with no members line and no workspace line.
- Saved Product Review Team run → Edit Config:
  - no "Files are saved", no "Team defaults", no "All use defaults";
  - the settings card and member cards align (same left and right edges).
- Saved Research Assistant run → Edit Config: "This run's settings can't be changed." next to
  "Stopped".
- Checks:
  - `vue-tsc --noEmit` reports 0 errors (whole app);
  - `pnpm typecheck` passes;
  - `pnpm test` 14/14;
  - `pnpm lint` passes.
