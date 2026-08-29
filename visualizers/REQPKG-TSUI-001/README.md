# REQPKG-TSUI-001 Requirements Visualizer

Exploratory comparison for `DEC-001`–`DEC-004`. This is not a final normative prototype.

## Run

```bash
npm install
npm run dev -- --port 3262
```

Review the two product-only directions at:

- Direction A — Focused hierarchy: `http://127.0.0.1:3262/?direction=focus`
- Direction B — Dense explorer: `http://127.0.0.1:3262/?direction=dense`

The rendered page intentionally contains no Requirements Visualization header,
direction picker, journey picker, selection summary, or explanatory footer.
That review chrome was removed in `RV-002` so each URL shows only the proposed
product experience.

For deterministic evidence capture, append one of these optional states:
`&scene=comparable`, `&scene=filters`, `&scene=evidence`, `&scene=runs`, or
`&scene=narrow`. The same states are also reachable with product-native range,
filter, evidence, tab, and navigation-resize controls.

## Technology

Copied from the Product Prototyper visualizer scaffold at agent repository revision
`a6af4fd689a1c6cb1ec1f06c07d0b6011a8c8679` (template last changed in
`e9a158b4cb80d4fa54d0c495d6ba862a34cf874d`). Active capability is React,
Vite, TypeScript, SVG, and CSS. Optional motion and 3D packages were removed
because the decision is compositional and does not depend on animation or
spatial reasoning.

All values and interactions are deterministic synthetic review fixtures. No
backend, production query, persistence, accounting, customer data, or live
service is used.
