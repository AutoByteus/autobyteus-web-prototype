# package-clone-auto-update-457: comparison results (source `f78b60dddd` vs baseline)

Disposable harness (outside the repository, `/tmp/r457`): the exact `git archive` of `f78b60dddd` (`autobyteus-web` and the four contract packages) served by
`nuxt dev` on :4572 against the observation node (`prototype/source-observation/mock-node.mjs`, :4573); the baseline `corepack pnpm dev` on :4570 with
`autobyteus.prototype.designOnlyLayers` = `off`. Each state is a fresh 1440×900 (and 656×900 for narrow) browser context, same scenario, same host context
(the same `install-host-scenario.js` is injected into the source), same locale. Compared per component: element tree, own text, attributes, classes, rectangle
relative to the component root, 29 computed style properties of every element. Masked: the time tooltip of a notification row, generated ids.
Screenshots here are a sample (`src-*` = source, `base-*` = baseline).

Result: every state below is SAME unless a note says otherwise.

Personal settings (form root): agent from a package (all four personal), agent from a package (none personal), built-in agent, hand-made agent (scenario
`personal_settings`), agent create, Team edit, Team create, Org edit, Org create, agent/Team/Org detail pages, zh-CN of the four editors, 656 px of agent and Org
editors, Reset of each setting (agent: tools with an unsaved Name edit kept, avatar, skills, runtime/model; built-in tools; Team avatar, runtime/model;
Org avatar, runtime/model), Reset failure (`personal_settings_reset_fails`: the red line under the note, the unsaved edit kept).

Notifications (section roots `agent_package`, `skill_source`, `app`; the confirmation dialog): switch off (`updates_waiting`), the confirmation dialog for Agent
packages and for Skill sources (en, zh-CN), cancel with Esc, confirm → switch on and the automatic outcomes (updated, failed with its reason) arrive,
`updates_auto_on` (every outcome row, en, zh-CN), `updates_outcomes_only`, `updates_off` (no-effect line) and its switch turned off, switch turned off again from
`updates_auto_on`, a browser window (no desktop), 656 px, the app's own switch on and its zh-CN row. Update checks card (`/settings?section=server-settings`,
browser window): switch off and on, confirmation from the card for both kinds, zh-CN. The only difference found is hidden `<option>` boxes of its interval select
(0×0 rectangles, scroll offset). Skills → Sources dialog (SkillSourceRow): populated, `skill_source_issues`, zh-CN.

Required tools row: not compared with the source (the source's Integrations page needs the integrations GraphQL, which the observation node does not
answer, and the baseline's Integrations page is a design). `IntegrationToolsRow.vue` is byte-identical to the source; the baseline page's tools block before
and after this refresh (old HEAD checkout vs now) is SAME for `integrations_connected`, `integrations_tool_missing`, `integrations_several`, en and zh-CN.

Not comparable in this harness (not part of the scope): the Agent runtime section of the Notification Center and the Update checks card's runtime lines
exist only in the desktop's own window; the source harness does not reproduce that binding, so the whole-panel and sidebar-entry counts differ there
(6 vs 4 "updates"). The scoped sections, and the sidebar entry in a browser window, were compared and are SAME.
