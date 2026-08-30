# Nested-team hierarchy requirements visualizer

Ticket-scoped exploratory comparison for package `nested-team-hierarchy-ui` and
Product ticket `REQPKG-NTHUI-001`. This is not production code or a final
prototype.

## Run

```bash
npm install
npm run dev -- --port 4193
```

Or build and preview:

```bash
npm run build
npm run preview -- --port 4193
```

Open <http://127.0.0.1:4193/>.

## Scope and template

- Copied from the Product Visualizer scaffold on 2026-08-30 after the design
  gate passed.
- Scaffold package manifest SHA-256:
  `9593789e197fea77b4c87d833bf8d525e5905dda61cf2e9e5ddf0374e6528a33`.
- Active capabilities: React, Vite, TypeScript, semantic HTML/ARIA, CSS, inline
  SVG.
- Deliberately omitted: Motion, Three.js, React Three Fiber, Drei, production
  APIs, authentication, persistence, and live runtime state.
- All names, topology, statuses, ages, selection, refresh, and action outcomes
  are deterministic synthetic fixtures.
