# UI reference runbook — phone-conversation-readability-506

- Install and start (in the design repository root): `corepack pnpm install --ignore-workspace --frozen-lockfile`, `corepack pnpm dev --port 4510`. Open `http://127.0.0.1:4510/mobile` at 412 px (device scale 3 for the reference screenshots). The first visit opens a paired phone (the phone's starting states are in `ui-reference-runbook.md` at the repository root, first section).
- Over Tailscale for a real phone: start the server with `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.ts.net` (it stays on 127.0.0.1), add one Tailscale Serve entry on a free port, and remove only that entry afterwards.
- The conversation: list → "Summarize the 1.6 release notes for the pilot customers" (Daily Assistant; stopped; holds every message and segment type). A running run: "Project Task Manager" (Settings shows Stop run).
- Text size: ⋮ → Text size (four steps; kept in `localStorage` `autobyteus.phone.textSize`). Reset: remove that key.
- Settings: ⋮ → Settings. The run's selection is kept in `sessionStorage` `autobyteus.prototype.runModelSelections`; reset by removing it (or a new tab). "Sonnet (earlier version)" is the model the invented node refuses until "Refresh models". A list-running run opens as Running until Stop run.
- All data is invented (`prototype/source-observation/mobile-world.mjs`, `prototype/mobile-runs/runModelFixture.ts`).
