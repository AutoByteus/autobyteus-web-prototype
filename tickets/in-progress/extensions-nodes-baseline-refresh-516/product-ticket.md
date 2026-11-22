# Product Ticket: extensions-nodes-baseline-refresh-516 (baseline refresh for autobyteus-516)

## Identity And Scope

- Ticket / request ID: `extensions-nodes-baseline-refresh-516` (baseline ticket for the design ticket `extensions-ui-516`, package `autobyteus-516-extensions`, autobyteus-516)
- Title: Scoped baseline refresh of Settings → Extensions (Voice Input card) and the Nodes page (Manage Nodes, Phone Setup / phones)
- Status: `Completed` (baseline accepted by the Product UI/UX Designer, 2026-11-22; integration below)
- Mode: baseline refresh (Bootstrapper), scoped, requested by the Product UI/UX Designer
- Why (git check, 2026-11-22): the design repository's Manage Nodes reflects `3b9dc912a1` (with the approved designs `manage-nodes-professional`, `one-step-phone-pairing` on top) and Settings → Extensions reflects `d74f75a51a`. Against `origin/personal@b768c503f9761242089cdee35e47dc2bf65ab8ea` (the base of the Software Engineering ticket autobyteus-516; `50af37b59b` changes no file of these surfaces), the source changed the UI files of the surfaces the design ticket will change:
  - `components/settings/VoiceInputExtensionCard.vue`: the decorative microphone icon removed (autobyteus-320 item 1), typed language choice;
  - `components/settings/NodeManager.vue` (Phone Setup now renders `PhonesPanel`), new `components/settings/phone/{PhonesPanel,PhoneWayTab,PhoneCodeBlock,ConnectedPhones}.vue`;
  - `components/settings/nodes/{NodeRow,NodeChangeDialog,NodeServerUpdate,NodeConnectionDetails,NodeCollaborationSwitch,NodeNoticeIcon,AddNodePanel}.vue`, new `NodeAccessNotice.vue`, `NodeAutoUpdate.vue`, `stores/nodeAccessStore.ts` (node access / owner credentials, autobyteus-437: disconnect, "needs connecting" notice);
  - catalogs `nodesPage.ts`, `settings.ts` (en, zh-CN).
  - Byte-identical (not in scope): `ExtensionsManager.vue`, `NodeManagerTabs.vue`, `pages/settings.vue`, `pages/nodes.vue`, `extensionsStore.ts`, `voiceInputStore.ts`, `VoiceInputButton.vue`, `NodeList.vue`, `ThisNodeCard.vue`, `NodeAddressHint.vue`.
- In scope: `/settings?section=extensions` (Voice Input card in each state) and `/nodes` (Manage Nodes with its node access states, Phone Setup and the phones list), en and zh-CN.
- Non-goals: every other surface keeps its pin; no future-state work.

## Design & Repository Context

- Design repository/root: `/Users/normy/autobyteus_org/autobyteus-web-design` (default branch `personal`, remote `origin`)
- Ticket worktree / branch: `/Users/normy/autobyteus_org/autobyteus-web-design-worktrees/extensions-nodes-baseline-refresh-516` / `design/extensions-nodes-baseline-refresh-516`
- Accepted design base: `437bad9aa27f6aa20a11cf86c7bd44f5cce27cfb` (`origin/personal`, fetched 2026-11-22)
- Selected source: `/Users/normy/autobyteus_org/autobyteus-workspace-superrepo/autobyteus-web` at `origin/personal@b768c503f9761242089cdee35e47dc2bf65ab8ea` (read only)
- Established report: `/Users/normy/autobyteus_org/autobyteus-web-design/ui-baseline-report.md`
- Runtime isolation: Bootstrapper's own choice, recorded in its report (port 4517 suggested; the design ticket uses 4516)
- After acceptance: commit, integrate into `personal`, then merge `personal` into `design/extensions-ui-516`.

## Bootstrapper result and acceptance (2026-11-22)

- Result: `Completed`, scoped Refresh of Settings → Extensions (Voice Input card) and /nodes Manage Nodes and Phone Setup to `origin/personal@b768c503f9`; 95 matched states (en, zh-CN; 1440, 1100, 700 px; desktop, external and browser windows). Report: `ui-baseline-report.md` first section; runbook first section; evidence `evidence/extensions-nodes-baseline-refresh-516/`.
- Accepted. Checked: the 45 files the audit lists as identical re-compared with `cmp` against `git show b768c503:` (0 mismatches); the four merged catalog/index files explained in the audit; data boundary: `prototype/nodes/network-world.mjs`, `rest-fixtures.mjs`, `install-host-scenario.js` hold invented names and RFC 1918 / CGNAT / `.example` / invented `.ts.net` addresses, no real node, phone or credential data; the running baseline on :4517 (Extensions `populated`; Manage Nodes `nodes_states`) looks like the source (no microphone badge, the source's row grid, server update, Update automatically).
- Noted, not a parity difference: the Voice Input card's audio-source list is the browser's own `enumerateDevices()` answer, so it shows the reviewing computer's device names; the design ticket uses invented device names for its references.
- Known gaps recorded by the Bootstrapper (outside scope): Memory Sync, Docker Guide, NFS Guide, Settings → Updates keep their pins.

## Outcome And Handoff (initial request)

- Next expected action: the Bootstrapper returns `Completed` or `Blocked`; the Product UI/UX Designer reviews and accepts.
- Handoff outcome: `Baseline Needed` -> UI Baseline Bootstrapper
