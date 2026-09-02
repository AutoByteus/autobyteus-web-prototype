# AgentTeam Launch Baseline Refresh — Comparison Summary

- Stable package: `AORG-FLAT-TEAM-001`
- Request: `Refresh`
- Source authority: `/home/autobyteus/workspace/autobyteus-workspace/autobyteus-web` at `origin/personal@5fb16658e7bd2aefd750f99eb596a17382e161ac`
- Prototype candidate: uncommitted working tree in `/home/autobyteus/workspace/autobyteus-web-prototype-worktrees/AORG-TEAM-LAUNCH-BASELINE-REFRESH-001`
- Browser: Chromium at `/usr/bin/chromium`
- Normalization: English, light theme, reduced motion, UTC, fresh storage, identical deterministic fixture, blocked non-loopback requests.
- Compared region: Workspace center pane through the viewport edge. The Product-owned accepted future-state right tool panel is masked; the future-state Agent Orgs item in the left navigation is outside the selected current-source boundary.

| Visual ID | State | Viewport | Semantic | Geometry | Action/state | Screenshot | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `UXV-TEAM-LAUNCH-REFRESH-001` | Defaults + missing-workspace feedback | 1440×900 | Exact | Exact | Exact | 0 changed pixels | Pass |
| `UXV-TEAM-LAUNCH-REFRESH-002` | Model picker open | 1440×900 | Exact | Exact | Exact | 0 changed pixels | Pass |
| `UXV-TEAM-LAUNCH-REFRESH-003` | Existing workspace selected; ready | 1440×900 | Exact | Exact | Exact | 0 changed pixels | Pass |
| `UXV-TEAM-LAUNCH-REFRESH-004` | New workspace path; ready | 1440×900 | Exact | Exact | Exact | 1 normalized pixel | Pass |
| `UXV-TEAM-LAUNCH-REFRESH-005` | Root auto-approve enabled | 1440×900 | Exact | Exact | Exact | 0 changed pixels | Pass |
| `UXV-TEAM-LAUNCH-REFRESH-006` | Keyboard-opened member disclosure | 1440×900 | Exact | Exact | Exact | 0 changed pixels | Pass |
| `UXV-TEAM-LAUNCH-REFRESH-007` | Per-agent override | 1440×900 | Exact | Exact | Exact | 0 changed pixels | Pass |
| `UXV-TEAM-LAUNCH-REFRESH-008` | Narrow defaults + recovery feedback | 390×844 | Exact | Exact | Exact | 2 pixels at max channel delta 1 | Pass |

The three nonzero pixels across the matrix are browser rasterization noise only. No geometry, semantic value, control state, action result, or perceptible visual differs. Source and prototype browser error arrays are empty for all eight rows.

## Durable evidence

- `team-launch-refresh-summary.json`: machine summary (`8/8` pass).
- `team-launch-refresh-results.json`: complete paired semantic, geometry, action, browser-error, hash, and screenshot-diff records.
- `source/`: eight pinned-source screenshots.
- `prototype/`: eight prototype screenshots.
- `comparison/`: eight amplified pixel-diff images.
- `source-provenance.json`: source/worktree identity and SHA-256 parity inventory.
- `direct-browser-source-default.png`: direct browser-tool source observation.
- `direct-browser-prototype-default.png`: direct browser-tool prototype replay.
- `independent-preview.png`: built candidate running with source and mock servers stopped.
