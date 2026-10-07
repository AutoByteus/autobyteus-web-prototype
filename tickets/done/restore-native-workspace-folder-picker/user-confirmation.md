# UI confirmation — UCONF-001

Package `restore-native-workspace-folder-picker`; Product Experience Design; date 2026-10-07.

## Explicit user confirmation
User, in this Product conversation after review round 1:

> Hey, I think this UI is good. The, yeah, the, I just got that confirmed.

The preceding user question was whether Browse opens the computer's native explorer. Product clarified: in the local Electron desktop app Browse opens the native **folder-selection dialog**; its selected path fills the field and **Use folder** applies it. The browser-based UI reference simulates that dialog; ordinary web, remote-node and mobile contexts retain manual path entry. The user then confirmed the UI above.

## Approved scope
The round-1 recommendation and rendered UI at `a677e01558b2b9d48253950bc2b8db821358625a`: existing workspace menu and Open another folder entry; Browse beside the path; choose then explicitly Use folder; non-destructive cancel/empty, inline failure and retry/manual fallback; current eligibility and locks. Review evidence checkpoint `0d74b3522f51a56514deab914430b91f667d8c04`. Source pin `88fad73cbd20201642acdcfe75e69b1897ec135c`; accepted design base `8cd41f886459630909e827d7df1b67910618aaac`.

Design repository `/Users/normy/autobyteus_org/autobyteus-web-design`; ticket branch `design/restore-native-workspace-folder-picker`. This confirms UI/UX, not the OS-look of the illustrative chooser, production implementation, actual Electron validation or canonical requirements approval. Solution Designer owns reconciliation of R2 Draft / SR-004, SCN-001..005, REQ-001..004 and AC-001..007.

No visible or behavioral change is planned after this confirmation. Post-confirmation screenshots and final validation will be recorded in `ui-ux-spec.md` and `final-validation.md`. Any material discrepancy requiring a design change reopens review.
