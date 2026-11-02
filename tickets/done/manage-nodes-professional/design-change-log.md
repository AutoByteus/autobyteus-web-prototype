# Design Change Log — manage-nodes-professional (autobyteus-363)

Baseline for these changes: the 268 look as shipped in beta.10 (refreshed baseline `WEB-BASELINE-REFRESH-015`, `8a71c842`). IDs are stable and never reused (268 used DC-701…723).

| ID | Change | Kind | Reason (finding in `design-review-notes.md`) |
| --- | --- | --- | --- |
| DC-901 | Row anatomy: one grid with fixed columns (who · server · offer · collaboration · actions), laid out by the Nodes card's width in three steps (≥64 rem, 38–64 rem, narrow stack); items align to the top | Visual | F1, F2 |
| DC-902 | The server version and update move from their own line under the address into the server column; the version is quiet (13 px, slate-600, "Server …" copy unchanged); "Update to …" becomes a small blue chip; progress, restarting and not-reachable show in the same cell; the update result/refusal/blocker is one notice under the row | Visual (305 states kept) | F3 |
| DC-903 | The remote-collaboration icon and switch become one capsule (emerald when on, slate when off) in every row and the add band | Visual | F4 |
| DC-904 | Open and Remove: 40 px bordered boxes → 32 px quiet icons (hover fill); the 268 rejection of ⋯ menu / text buttons is respected | Visual | F4 |
| DC-905 | The offer summary row: the trailing name list is removed (names in the button's tooltip); the summary becomes a button that opens the panel; `RemoteCollaborationOfferDisclosure` is replaced by `RemoteCollaborationOfferToggle` | Visual | F5 |
| DC-906 | One notice shape (tone icon, text, one small button; amber / red / slate / green) for the checking line's sibling lines, the fixing lines and the server notices; ✓ ⚠ ✗ ⓘ text marks replaced by icons in notices, connection details, the Docker hint and the duplicate message | Visual | F7 |
| DC-907 | The open offer list and connection details sit in one framed panel under the row; the details footer gets a divider | Visual | F7 |
| DC-908 | This node card: overline + larger name + type tag + address; the collaboration header row keeps icon, title, status and switch together; the explanation gets a readable measure; the off note is a slate notice; the rules panel is a framed block | Visual | F6, F9 |
| DC-909 | Both cards share one frame; the Nodes header is white; the add form is a slate-50 band with 40 px fields, a sans placeholder for the address placeholder text, a plus icon on Add node | Visual | F7, F8 |
| DC-910 | Spacing: `space-y-6` between the two cards of the Manage tab; row `py-3.5`; dividers slate-100 | Visual | F1 |
| DC-911 | Narrow: the notice's button wraps under its text; the offer and the capsule each take their own line; the indent is reduced below 640 px | Visual | narrow check |
| DC-912 | In a browser (no Open) the Open slot is not reserved | Visual | user feedback, round 1 |
| DC-913 | The empty-offer sentence wraps instead of truncating | Visual | final check |
| DC-914 | UI reference only: scenario `nodes_empty_offer` (docker shares nothing) so the empty offer can be shown | Reference | REQ-903 |

Preserved (not changed): every function, state, transition, validation message and copy string of 268 and 305; the confirmation dialog; the other tabs; the rejected patterns of 268.
