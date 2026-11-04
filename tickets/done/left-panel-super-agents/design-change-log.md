# Design Change Log — left-panel-super-agents

One chronological log. IDs are never reused. Preserved everywhere: the page list and divider, the New chat start surface and chip, the right panel, the nested delegated rows, row actions and dialogs, the Memory page.

| Change ID | Type | Trigger / Date | Related IDs | Affected Journey / Transition / Scenario IDs | Preserved Behavior | Changed Or Removed Behavior | Validation And Regression Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DC-001 | Remove | The user, 2026-11-03: the Workspaces and Projects views are an intermediary | DEC-001 | UXJ-001 | Folder and Project are still chosen in the New chat chip; runs can still be started anywhere | The Workspaces | Projects switch, the header "+", workspace rows, Project rows, the inline add-workspace form, "remove from workspaces" | Browser walk-through; reference code for both trees deleted |
| DC-002 | Remove | The user: no groups under a workspace or Project | DEC-001 | UXJ-001 | Row look (dot, avatar, two lines, actions, age) | Agent, team and Org group headers (name, count, group "Archive all", group "+"), the "TEAMS" and "ORGS" labels | same |
| DC-003 | Add | Round 1 to 4 of the review | PRES-001 | UXJ-001, UXJ-002 | The data the trees listed | One flat list of runs (agent, team, Org), newest first, two-line rows | VIS-001, VIS-002 |
| DC-004 | Remove | The user: no special agent; orchestration is just tools | UXJ-001 | UXJ-001 | — | A fixed "super agent" row, "Your agents" header, per-agent latest-run rows, "Earlier runs" line (all built and shown in earlier rounds, then removed) | Not present in the reference |
| DC-005 | Add | The user: hand-started runs stay until archived; "show older is nice" | PRES-001, PRES-003 | UXJ-005, UIT-009, UIT-010 | Existing "Archive all" confirmation and toasts | Newest 5 runs show; "Show older (N)" / "Show fewer"; "Archive all older" in the open fold | VIS-006, VIS-007 |
| DC-006 | Change | Consistency check | UXJ-002 | UIT-003, VIS-008 | The Org's own member tree | The Org run's member tree opens under its row in the flat list (a stopped Org needs it to continue) | Opened a stopped Org: its members are listed |
| DC-007 | Change | Consistency check | UXJ-006 | VIS-012 | Strip placement (after the page icons, after the divider) | The strip entry's icon is `heroicons:queue-list` (was `ph:tree-view`); its tooltip and name read "Your runs" | VIS-012 |
| DC-008 | Change | Consistency check | UXJ-006 | VIS-009, VIS-011 | Existing single-block state style | Empty (invitation row), loading, error and refresh-error texts for the new list | VIS-009…VIS-011 |
| DC-009 | Change | Visual review | UXJ-001 | VIS-001 | The existing row anatomy | Rows without delegated work keep an empty disclosure cell so all dots align; Archive and Delete are always visible below `md` | VIS-001, VIS-014 |

Left in the reference but unused, for the Solution Designer's information: `stores/projectsTreeStore.ts` keeps its mode field (no component reads it any more); the old `projectsTree.*` strings of the Projects view; `prototype/scripts/capture-projects-left-navigation-final.mjs` (captures the removed view, historical).
