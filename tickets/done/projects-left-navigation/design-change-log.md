# Design Change Log — projects-left-navigation

Each entry is an addition, behavior change or removal against the accepted baseline (`origin/personal@752b6b8`, source pin `d74f75a`). IDs are never reused.

| ID | Change | Kind | Where | Source of the decision |
| --- | --- | --- | --- | --- |
| DC-001 | Run-section header: the "Workspaces" heading becomes a flat text switch "Workspaces \| Projects" (tablist, remembered per node); "+" adds a workspace or, in Projects mode, a Project | Added / changed | `WorkspaceAgentRunsTreePanel.vue` | Request; user rounds 5–7 (flat, text only, faint hover effect, normal gray) |
| DC-002 | Projects tree: Project rows (chevron, briefcase, name, hover "+"), agent / team / Org groups, runs and nested delegated rows as in a workspace; no selected mark; name selects, chevron opens | Added | `ProjectsRunsTree.vue`, `WorkspaceHistoryWorkspaceSection.vue` (`projectScope`) | Request; user: "don't highlight the project name" |
| DC-003 | Delegated rows scoped to the Project's Tasks (Temp-task work only under a run started under the Project) | Added | `AgentRunTaskRows.vue` (`projectScope`) | REQ-008 |
| DC-004 | Briefcase replaces the folder as the icon of a Project: the Projects entry in the left list and the right strip, the Project cards and the Projects empty states | Changed (preserved areas) | `useShellPrimaryNavigation.ts`, `RightSidebarStrip.vue`, `ProjectCard.vue`, `ProjectsList.vue`, `ProjectsPanel.vue` | User: stay consistent with the briefcase |
| DC-005 | Team groups get a "+" in Projects mode (not in Workspaces) | Added | `WorkspaceHistoryWorkspaceSection.vue` | REQ-004; default accepted by the user |
| DC-006 | "Archive all runs" on a group in Projects mode archives only that Project's listed runs | Added | `useWorkspaceHistoryGroupArchive.ts` | REQ-014 |
| DC-007 | States of the Projects tree: loading, no Projects, error with Retry, refresh error keeping the last tree, Project without runs | Added | `ProjectsRunsTree.vue`, `projectsTreeStore.ts` | REQ-011 |
| DC-008 | New chat start surface: the folder chip's menu gets flat Workspaces \| Projects tabs; a Project can be chosen on plain Chat; the chip shows the folder or the Project (with the folder only when it differs); "+" on a Project presets it | Added / changed | `ChatWorkspaceMenu.vue`, `ChatNewSurface.vue`, `chatDraftStore.ts`, `useRunStart.ts`, `chatLaunchService.ts` | Request; user in review; SR-004 (DEC-014) |
| DC-009 | The agent picker under a Project lists Agents and Teams only | Added | `RunTargetSwitcher.vue` (`noOrgs`) | DEC-006 |
| DC-010 | The run-tree entry of the collapsed strip keeps one icon in both modes; its name and tooltip say the mode | Changed | `LeftSidebarStrip.vue` | Review of the final screenshots: a briefcase there would duplicate the Projects page entry |
| DC-011 | Removed during review: pill and track tabs with icons; selected-Project highlight; always-visible Project "+"; a separate Project chip beside the folder chip; per-tab icons | Removed | — | User |
