# Requirements Visualization Design Plan

- Package / ticket ID: `nested-team-hierarchy-ui` / `REQPKG-NTHUI-001`
- Revision: `RV-001`
- Decision question: Which compact hierarchy, metadata, and team-node treatments make the same deep Workspace-history tree clearest at supported widths?
- One-sentence user takeaway: “I can trace every agent to its team and choose a compact grammar whose role/name remains primary even at 260px Extra Large.”
- Chosen visual form: Interactive comparison with one stable product-grounded tree model and one changed decision variable at a time.
- Why this is the smallest suitable representation: The ambiguity is perceptual and responsive; one live panel with treatment switches exposes the difference directly without requiring simultaneous three-panel scanning or a broader application shell.
- Alternatives considered and rejected: Simultaneous side-by-side panels were rejected because 260/320/520px fixtures cannot fit without shrinking or horizontal scroll; static screenshots were rejected because disclosure, focus, full-name recovery, and keyboard semantics are part of the decision; a full Workspace clone was rejected as unrelated surface.
- Implementation technology selected after the design gate: Ticket-scoped React/Vite/TypeScript scaffold with plain CSS and inline semantic SVG/icons; no Motion or 3D capability activated.

## Visible Model

- Initial view: `DEC-001`, Hybrid treatment, 320px Default, “Several teams expanded + selected leaf”; one panel, one short instruction, and the three treatment choices.
- Actors or objects to show: One team definition, two collapsed historical runs plus one expanded current run, root coordinator/direct agent, three sibling subteams, one deeper configured team, one transient task team, and representative agents.
- States to show: Five tree presets, three supported widths, two required font presets, mixed exact/aggregate statuses, selection, hover/focus, truncation/tooltips, action-menu availability, and independent disclosure.
- Relationship or causal distinction: Switching the treatment changes only ancestry grammar, metadata priority, or team-role treatment; expanding/collapsing changes only the intended subtree; selecting a leaf keeps its ancestor path visible.
- Details intentionally hidden or deferred: Stress-test controls and model boundary live behind `Stress test`; treatment notes appear only for the active choice; run actions are in the existing ellipsis menu; implementation/internal identifiers are omitted.

## Motion Design

- Motion purpose, or why motion is not needed: No decision-relevant motion is needed; this is a stable scanability and interaction-semantics comparison. A short CSS state transition may soften hover/disclosure but carries no meaning.
- Motion phases and order: Not applicable.
- Teaching pace and consequence dwell: State changes are immediate and remain stable until the next user action.
- Pause, replay, reset, step-through, slow, or skip controls: `Reset tree` restores the diagnostic default; no playback controls because no causal sequence is animated.
- Reduced-motion and stable-state equivalent: All meaning is present in static shapes, borders, labels, connectors, roles, `aria-*` state, and visible result text; `prefers-reduced-motion` disables transitions.
- Which changes must not happen instantaneously: None; instantaneous stable comparison is intentional.

## Interaction Storyboard

1. **Show:** One diagnostic tree and the current decision lens with three named treatments.
2. **User action:** Switch treatment, stress width/type/state, or toggle/focus/select a tree node.
3. **Visible consequence:** The same fixture receives only the selected visual rule; one subtree changes; selected agent and ancestor path remain legible; full role/name is exposed on hover/focus.
4. **Simplified boundary:** A persistent note identifies synthetic state and says the visualizer records choices but does not approve or implement them.

## Cognitive Foundation Check

- How does the first view avoid unnecessary cognitive load? It renders one tree, one decision question, and one treatment selector; responsive/state controls and detailed rationale are progressive.
- What is the simplicity budget for this visualizer? One main canvas; one decision lens at a time; three treatment choices; one identical diagnostic fixture; one optional stress-test disclosure; one concise choice summary.
- What is progressively disclosed, and when? Width/font/state controls, alternative trade-offs, keyboard help, accessible state transcript, and mock boundaries.
- What text is necessary to name the model without repeating it? Decision number, one question, three treatment labels, one one-line trade-off per active treatment, and a review-only boundary.
- How can the user pause, replay, reset, or understand the result without motion? No motion sequence exists; `Reset tree` and stable selected states make every comparison inspectable.
- Can a first-time observer follow the full motion sequence at the chosen teaching pace? Not applicable; no decision-relevant sequence.
- What will demonstrate that the user understood the intended relationship? They can select one answer per decision, trace the selected leaf’s visible ancestor path, and retrieve its full role/name in the narrow stress case.

## Truthful Boundaries

- Mocked data or behavior: Synthetic run records, node topology, state aggregation, timestamps, quiet refresh, menu actions, and selection state.
- Intentionally omitted behavior: Production data loading/streaming/persistence, action completion, topology mutation, unrelated Workspace surfaces, mobile, and final implementation structure.
- Why the omissions are safe for this question: The decisions concern visual ancestry, density, role recognition, responsive layout, and accessible disclosure in one bounded panel.
- What the visualizer must not imply about the product: That any choice is approved; that implementation architecture is prescribed; or that simulated actions affect real runs.

## Design Gate

- [x] The first view presents one decision question and one focused journey.
- [x] The visible model fits the decision-specific simplicity budget and excludes unnecessary dashboard, navigation, identifier, and implementation surface.
- [x] The user can identify the action and consequence without a long explanation or hidden prior state.
- [x] Secondary detail is deferred behind intentional progressive disclosure.
- [x] Decision-relevant motion is not used; stable changes avoid unrelated simultaneous movement.
- [x] The same decision-relevant meaning is available without motion or 3D.
- Status: `Ready to Build`
- Remaining design concern: The required diagnostic fixture exceeds the default 3–5-object teaching budget; this is intentional because sibling and deeper-parent ambiguity only appears with the supplied representative topology. Progressive subtree presets keep the first scan bounded.
- Evidence for the decision: `REQ-002`, `REQ-004`, `AC-001`–`AC-007`, and the two supplied screenshots require dense responsive interaction rather than prose or a static single state.
