# Design Review Notes — manage-nodes-professional (autobyteus-363)

Working notes for the user review. Status: first design built on the accepted baseline (8a71c842); review round 1.

## What I measured in the beta.10 screenshot (3024×1902 capture, 2× scale)

| # | Finding | Evidence | Effect on the look |
| --- | --- | --- | --- |
| F1 | A node row is about 160 px tall at 1× and carries **four text lines in four styles** (name 14/600, address mono 12, "Server 1.5.11-beta.10" 14/500 body, summary 14/500 + 14 muted names). | docker-8001 row | Rows read as a stack of unrelated lines, not one record |
| F2 | **No columns.** The identity sits far left, the controls sit far right, about 780 px of nothing between them at this window width (page max width 80 rem). | Row y=840 | The eye cannot scan a list; each row looks different |
| F3 | The **version line** (305, no Product pass) is the largest, darkest line under the address, has no relation to the row's other parts, and is in a different weight than the address above it. | "Server 1.5.11-beta.10" | The most noticeable defect: it looks pasted in |
| F4 | The right cluster mixes **four control idioms**: a bare green stroke icon, a switch, and two 40 px bordered icon boxes (grey line, different corner radius than the Add button). The icon+switch has no label anywhere. | Row controls | "A mix of icons and switches" |
| F5 | **Summary line plus a long truncated name list** ("Agent Package Creator, Article Writing Team, AudioGenerator, …C…") ends in a hard cut. | y=963 | Visual noise; cut-off text looks broken |
| F6 | **Header scale is inverted** on "This node": the heading is 14 px semibold, the node name under it is 16 px regular, the type is a blue uppercase pill and the address a grey mono box: three treatments for one line. | This node card | No hierarchy |
| F7 | The two cards use **different frames** (This node: blue border and white header; Nodes: slate header band; add form: another white band). | Both cards | Looks assembled, not designed |
| F8 | The add form is a **row of unlike things**: a mono placeholder, a sans placeholder, an unlabeled icon+switch, a primary button. It looks like one more node row. | Add row | Add and list blur together |
| F9 | The "This node" card is mostly empty space: a 2-line explanation spans the full width (about 1,200 px, ~170 characters per line), the switch is at the far edge. | Card | Long measure, hard to read; the switch is far from the thing it controls |

## Plan (one recommended design)

See `ui-ux-spec.md` once written. Principles: one row anatomy with fixed columns; one control language; one notice shape for every line under a row; one card frame; the existing palette, radii and type of the product (the Integrations page is the reference).

## Alternatives, described in words (shown only if you ask to see one)

- **A. Column headings above the list** (Node · Server · Agents offered · Remote collaboration). It would make the columns explicit, but it needs three or four new static labels in both languages. The requirements say no new messages, so I did not do it. Say so if you want it and I will ask the Solution Designer to allow them.
- **B. Cards per node** (a card in a grid) instead of rows. Better for few nodes, worse for many; wastes width.
- **C. Keep the name preview** after the counts ("49 Agents · 24 Agent Teams  Agent Package Creator, …"). I recommend removing it from the collapsed row; the names stay in the list that opens, and in the tooltip.
- **D. Bring back a ⋯ menu / text buttons for Open and Remove.** You rejected these in the 268 review. Not used.
- **E. A plain switch with no icon** (the column's meaning carried by the "Remote collaboration" heading above the list). Simpler, but a lone switch in a row is unlabeled.
