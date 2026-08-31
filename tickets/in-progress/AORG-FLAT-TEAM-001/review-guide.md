# AORG-FLAT-TEAM-001 — RV-012 Approved Review Record

## Status

- Review state: `Approved on 2026-08-31`
- Prototype revision: `RV-012`
- Requirements authority: `RER-013`, commit `86df311c4`
- Approved runnable behavior: `891b4e667d51fffb92ebd85dd2dc90a8e0afcf2e`
- Post-approval visual-reference capture: `3de2c08b6f3d8cfdb75714edaa88b00d04d67aaf`
- Review server: `http://127.0.0.1:4194`
- Browser validation: `59/59` pass, `20` captures, zero runtime errors
- Static validation: diff check, typecheck, lint, `12/12` tests, `13/13` boundaries, and build pass
- Final package integrity: `6/6` approval/specification/browser/visual/provenance checks pass

## Primary Review — AgentOrg Run

1. Open [Software Development Department](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department) and select **Run**.
2. Confirm Run opens [one AgentOrg configuration](http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&phase=config) directly.
   - There is no Agent/Team entry selector or modal.
   - The controls follow the accepted Team configuration: Runtime, Default LLM Model, Workspace Directory, Auto approve tools, Member overrides, and Run Agent Org.
3. Expand **Member overrides**.
   - Direct Agents and Teams are top-level placements.
   - Exact Agents inside Teams are indented under their mounted Team.
   - Select a Team or Agent row to edit its override; only customized rows gain the restrained `Custom` state.
4. Choose `/synthetic/prototype-workspace`, then select **Run Agent Org**.
5. Confirm the complete AgentOrg scope is active and no member is initially selected.
   - The center says only **Choose an Agent or Team**.
   - The left sidebar shows the direct Agent, both Teams, their Agents, and task-scoped lineage.
   - Continuous rails and L-shaped branch connectors show the exact Org → Team → Agent/task hierarchy; this is preserved production tree treatment, not a new layout proposal.
6. Select `requirements_engineer`.
   - The exact Agent conversation opens.
7. Select **Product Design & Prototyping**.
   - The Team workspace opens through `product_prototyper`, its coordinator.
8. Select another Agent nested under a Team.
   - That exact mounted Agent becomes the Team focus.
9. Inspect the separate **Teams** section and Task Agent / Task Team rows.
   - Standalone Team definitions remain distinct from the AgentOrg run.
   - Task rows remain runtime lineage, not configured nested Teams.

Direct links:

- [AgentOrg configuration](http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&phase=config)
- [Active AgentOrg, initially unfocused](http://127.0.0.1:4194/workspace?prototypeReview=agent-org-flat&root=org&org=software-development-department&phase=active)

## Preserved Surface Review

1. [AgentOrg create](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-create)
   - Name and Description only; Category is absent.
   - **Add member** expands in the document flow, with Agent/Team tabs and search; no overlay.
2. [AgentOrg detail](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-detail&id=software-development-department)
   - Description, Members, and Handoffs only; no fabricated run facts or redundant architecture copy.
   - Handoff cards show From, To, exact addresses, and When only. No Handoff or condition number badges are visible; vertical placement carries the order.
3. [AgentOrg edit](http://127.0.0.1:4194/agent-orgs?prototypeReview=agent-org-flat&view=org-edit&id=software-development-department)
   - Add/edit/delete/reorder Handoffs and When conditions.
   - Cancel an open draft; remove a used endpoint and verify save is blocked until resolution.
4. [AgentTeam create](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-create), [detail](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-detail&id=product-design-prototyping-team), and [edit](http://127.0.0.1:4194/agent-teams?prototypeReview=agent-org-flat&view=team-edit&id=product-design-prototyping-team)
   - The accepted product layout, drag/drop, click fallback, Instructions, Member Details, Agent-detail navigation, configuration-first Run, and Team-local Handoffs remain preserved.
   - The intentional structural delta is Agent-only Team membership.

## Responsive Review

At `390×844`, review:

- AgentOrg create with the in-flow Add member chooser.
- AgentOrg configuration with all controls and Run action.
- AgentTeam builder with click fallback and selected-member details.

None uses a modal overlay or document-level horizontal overflow.

## Approved Evidence

- Manifest: `review-evidence/rv-012/capture-manifest.json`
- Configuration: `review-evidence/rv-012/REV-AORG-RV12-006-agent-org-configuration.png`
- Overrides: `review-evidence/rv-012/REV-AORG-RV12-007-agent-org-placement-overrides.png`
- Clean Handoff detail: `review-evidence/rv-012/REV-AORG-RV12-014-agent-org-handoff-detail.png`
- Active, unfocused: `review-evidence/rv-012/REV-AORG-RV12-008-agent-org-active-unfocused.png`
- Direct Agent focus: `review-evidence/rv-012/REV-AORG-RV12-009-agent-org-direct-agent-focus.png`
- Team coordinator focus: `review-evidence/rv-012/REV-AORG-RV12-010-agent-org-team-coordinator-focus.png`
- Narrow configuration: `review-evidence/rv-012/REV-AORG-RV12-017-agent-org-configuration-narrow.png`

The listed `REV-*` files are historical, non-normative review captures. The approved normative references are `visual-references/VIS-001`–`VIS-020`; see `visual-references/README.md` and `visual-references/visual-reference-manifest.json`. The approval statement is recorded in `user-decision-record.md`.
