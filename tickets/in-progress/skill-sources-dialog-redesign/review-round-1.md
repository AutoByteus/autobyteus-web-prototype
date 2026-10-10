# Review Round 1 — Manage Skill Sources popup

- Ticket: `skill-sources-dialog-redesign` (package `skill-sources-dialog-redesign`, SR-001)
- Date: 2026-10-10
- Review URL: `http://127.0.0.1:4731/skills` → **Sources** (normal product entry, no review control)
- Evidence: [review-evidence/round-1/](review-evidence/round-1/) (R01–R23, 1440×900 @2x unless named; `capture-results.json`, `validate-results.json`)

## Recommended design (DEC-001)

One compact dialog in the product's newer dialog style (`ProjectDialogFrame` / Reconnect dialog: `rounded-2xl`, `bg-slate-900/40` overlay, slate header/footer borders), 720 px wide.

1. **Fixed header**: title + icon × (`heroicons:x-mark`).
2. **Scrolling list** (the only part that scrolls): full-width divided rows.
   - Kind tile (32 px): folder (Default tinted blue), GitHub mark.
   - Line 1: **name** — folder name (`.codex/skills`, `skills-library`; a generic `skills` keeps its parent) or `owner/repo`; small blue **Default** badge on the Default source.
   - Right: **skill count** in its own aligned column (`56 skills`, `1 skill`, **`No skills`** in grey with a hint tooltip), then icon actions: **Check again** (↻, GitHub only) and **Remove** (🗑, hover red). No Remove on Default.
   - Line 2: kind label · full path/URL in monospace, truncated with the full value in the tooltip, plus a **copy** button.
   - GitHub: status line (coloured dot + existing status text, inline **Update** or **Retry removal** chip), then "Installed … · branch · Latest … · Checked …", then the error in red when present.
3. **Fixed add area** under the list: label + Local folder / GitHub segmented switch, input, **Browse…** (DEC-002, desktop app only), primary **Add Folder / Import repository**; hint underneath (trust hint with a shield icon for GitHub). Alerts (error / registry error / success / warnings) appear directly above the form, so add results show where the user is looking.
4. **Fixed footer**: **Done** as a normal secondary button (the only blue button is now the add action).

Confirmation dialogs stay the existing `ConfirmationModal` (danger); the body now shows a source card (icon, name, full path wrapping) below the existing message.

## Alternatives considered (described, not built)

- **Row "⋯" menu** for Check again / Remove: one fewer visible icon, but hides the most-used action and adds a click; with at most two icons per row inline icons are lighter and more discoverable.
- **"Add source" button in the header that reveals the form**: cleaner list, but the user asked for an obvious add path; an always-visible form needs no discovery and keeps the existing one-step flow.
- **Bordered list box (Settings → Agent Packages)**: matches that page, but inside a dialog it adds a second frame; full-bleed divided rows give more room.
- **Hiding GitHub revision metadata behind a disclosure**: more compact, but the request keeps revision/branch/checked visible.

## Intentional design changes (to confirm)

| ID | Change |
| --- | --- |
| DC-001 | Card-per-source → compact divided rows; name primary, path secondary/truncated with tooltip + copy. |
| DC-002 | Count column; `1 skill` singular (today "1 skills"); `No skills` empty state (grey, hint tooltip). |
| DC-003 | Remove → trash icon button with accessible name "Remove <name>" and tooltip "Remove source"; still opens the same confirmation; never on Default. Check again → ↻ icon button. Update / Retry removal → small inline chips on the status line. |
| DC-004 | Add form fixed below the list (never scrolls away); alerts above it; header/footer fixed. |
| DC-005 | Done becomes a secondary button; × becomes an icon button; dialog restyled to the newer product dialog frame. |
| DC-006 | Focus moves into the dialog on open, Tab stays inside, focus returns to **Sources** on close; visible focus rings. Esc / × / Done / outside click unchanged. |
| DC-007 | Checked time shown short ("Oct 9, 2026, 4:32 PM") instead of with seconds. |
| DC-008 | The add button shows "Working…" only while its own add/import runs (today it also says "Working…" while GitHub sources are checked on open; it stays disabled then). |
| DC-009 | Confirmation body shows a source card with the full path. |
| DC-010 (DEC-002, proposed) | **Browse…** next to the path input in the local desktop app only (same rule as the workspace folder picker); fills the input, never submits. |

## Validation

- `validate.mjs`: 17/17 behaviour checks pass (order, Default not removable, remove cancel/confirm, GitHub messages, update busy → up to date, check busy, retry removal, add success/error/conflict with path kept, GitHub trust hint/import/invalid URL, Browse only in embedded desktop, all close paths, focus/Tab/accessible names, copy, scrolling, alerts); 0 browser errors, 0 non-local requests.
- `capture.mjs`: 23/23 states captured.
- Narrow (390 px) and 1024×700 checked; zh-CN checked.

## Questions for the user

1. DEC-001: approve this design (or tell me what to change).
2. DEC-002: keep **Browse…** (desktop app only) or drop it?
3. ASM-001: light only (the app has no dark theme) — OK?
