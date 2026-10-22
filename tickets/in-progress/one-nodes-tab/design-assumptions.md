# Design Assumptions — one-nodes-tab

## Product Assumptions

| ID | Assumption | Why needed | Decision still required |
| --- | --- | --- | --- |
| PA-701 | The Agents and Agent Teams of a node appear only once the row's Agents switch is on (recommended answer to open question 1) | It is the list exactly as this node's agents see it (through the registration), and needs no new read path | The user |
| PA-702 | DEC-709 option (b): the confirmation does not show the address of a node whose switch is being turned on by the same confirmation | Keeps every node silent while its switch is off | The user (DEC-709) |
| PA-703 | Removing a node also removes this node's registration on the other node when that node can be reached; when it cannot, the row is removed here and the result says this node stays registered there | REQ-710 asks the confirmation to say whether the other side is removed too | The Solution Designer to confirm as the REQ-710 rule |
| PA-704 | A row is keyed by the node ID; a desktop entry remembers its node's ID once reached (seeded in the reference) | One row per node without migration (DEC-701) | Engineering design |
| PA-705 | "Different node" shows a red dot; "not reachable" a hollow grey dot; "checking" a spinner | Reachability dot = "reachable now" and a wrong node is worse than an absent one | The user |

## Mocked Boundaries

| Boundary | Real in the UI reference | Mocked or simplified | Deterministic scenarios | Production gap |
| --- | --- | --- | --- | --- |
| This node's server and the other nodes' servers | The page, its store, every control, dialog, validation, feedback and timing (each node answers after its own delay, up to 20 s; nothing polls) | `prototype/nodes/nodeWorld.ts` answers for the nodes: what each address answers, each node's switch and peers, the offers, the name rule, address candidates and the loopback hint | `nodes_user`, `nodes_states` (invented nodes, names, IDs, addresses, delays and offers) | Real GraphQL/REST calls, identity pinning, address resolution by candidate verification, error causes |
| Desktop host (Electron) | The Nodes registry (add, rename, remove) through the existing host mock in `prototype/shared/install-host-scenario.js` | Opening a window does nothing visible | contexts `electron_internal`, `electron_external`, browser | Real windows |
| A node that goes away mid-way | The partial row state and its retry | `localhost:8005` refuses its first write from this window and stays away for 8 s | `nodes_user` | — |
| Docker address hint | The hint, "Use this", Docker Guide link | A loopback address from a Docker node fails; `localhost:8004` cannot find an address for this node until "Use this" | `nodes_user` | Docker detection |

## Deliberate Simplifications And Non-Goals

| ID | Simplification | Why safe | Decision still required |
| --- | --- | --- | --- |
| PS-701 | One scripted world per page load; reload resets | Review aid; state is in memory | — |
| PS-702 | Address rules for added nodes are by host:port (and the substrings `slow`, `nohost`, `notab`) | Lets the review reach every cause | — |

## Production Readiness Gaps

- Security: peers are not authenticated (RSK-401/701); the confirmation says "Trusted private network only".
- Persistence, integrations, performance, reliability, observability: not modelled; see `design-spec.md` of the engineering ticket.
