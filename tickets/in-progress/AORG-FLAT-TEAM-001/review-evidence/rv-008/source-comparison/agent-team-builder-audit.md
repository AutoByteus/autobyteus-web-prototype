# AgentTeam Builder Preservation Audit

- Product ticket: `AORG-FLAT-TEAM-001`
- Review revision: `RV-008`
- Accepted prototype base: `893cde9dbcc5ccc8904cf08ba6b031668dff0041`
- Pinned source authority: `8ef282ba77705180d985e7000d801f0e0068cdc1`
- Baseline comparison URL: `http://127.0.0.1:4195/agent-teams?view=team-create`
- Future review URL: `http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-create`

## Preserved From The Product

- real HTML drag source in the library and drop target on Team Canvas;
- click-to-add fallback;
- initially empty create canvas and empty Member Details state;
- automatic unique member names and first-Agent coordinator assignment;
- selected canvas card and editable selected-member details;
- Member Name, Type, Source, Scope, and Coordinator fields;
- coordinator switch, member removal, drop highlight, form checklist, responsive stacking;
- Basics, LLM config, and product-native control/spacing language.

## Intentional Requirements-Driven Delta

The accepted baseline library contains both Agents and Teams. `RER-012` keeps
flat AgentTeams, so RV-008 removes only the Team library/group and Team member
kind. All preserved Agent builder interactions remain real.

## Evidence

- Accepted baseline screenshot: `accepted-baseline-agent-team-create.png`
- Future empty create state: `../REV-AORG-002-agent-team-authoring.png` after deterministic drag/drop and selected-member editing
- Future narrow state: `../REV-AORG-016-agent-team-builder-narrow.png`
- Machine checks: `../../../browser-validation-rv-008.json`, checks `AORG-RV8-004`, `005`, `045`–`048`

The review captures are non-normative pending explicit user approval.
