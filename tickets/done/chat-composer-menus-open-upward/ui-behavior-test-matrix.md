# UI Behavior Test Matrix — chat-composer-menus-open-upward

Script: `prototype/scripts/validate-chat-composer-menus-open-upward.mjs <baseUrl> [outDir] [--capture]`. Entry `/` → `/chat`, scenario `populated`, dpr 1. Result 2026-09-30: 15/15 pass, 0 page errors, 0 external requests (`review-evidence/final-validation/results.json`).

Each open-menu check asserts: menu fully inside the viewport; menu bottom ≤ its positioning box top (except the flyout); menu bottom ≤ hint-line top; narrow checks assert a fixed bottom sheet 8px from the bottom.

| Check | Viewport | Action | Expectation | IDs | VIS |
| --- | --- | --- | --- | --- | --- |
| CHK-001 | 1512x952 | idle | default entry lands on `/chat`; heading top 379 | REQ-002, AC-003 | VIS-001 |
| CHK-002 | 1512x952 | `@` | above card | REQ-001, AC-001 | VIS-002 |
| CHK-003 | 1512x952 | `/` | above card | REQ-001, AC-001 | VIS-003 |
| CHK-004 | 1512x952 | Workspace | above trigger | REQ-001, AC-002 | VIS-004 |
| CHK-005 | 1512x952 | Model + runtime hover | menu and flyout above composer | REQ-001, AC-002 | VIS-005 |
| CHK-006 | 1512x952 | Thinking (reasoning model) | above trigger | REQ-001, AC-002 | VIS-006 |
| CHK-007 | 1280x720 | `@` | above card | REQ-001 | VIS-007 |
| CHK-008 | 1024x520 | `@` | above, height-limited, list scrolls | REQ-003, AC-004 | VIS-008 |
| CHK-009–012 | 1024x440 | `@`, Workspace, Model, Thinking | above and on screen | REQ-003, AC-004 | — |
| CHK-013–014 | 390x844 | `@`, Workspace | bottom sheet preserved | REQ-004, AC-005 | VIS-009 |
| CHK-015 | 1512x952 | run view `/` | still above run composer | REQ-004, AC-005 | VIS-010 |

Static checks: `corepack pnpm typecheck` exit 0, `corepack pnpm lint` pass, `corepack pnpm test` 12/12.
