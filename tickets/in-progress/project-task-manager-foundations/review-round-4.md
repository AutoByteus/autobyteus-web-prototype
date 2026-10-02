# Review round 4 — Task voice and context files

Package PROJ-TASK-MANAGER-20261002-001 / SR-002 Draft. Product candidate PC-008–009; **not approved**, not a production implementation or completed Product stage.

## Feedback and reference
UF-007 user: “i would like to ask you to learn from the agent input form, there we have one audio input, and also attachment in the task we should also support that thanks”.

Read the accepted prototype's `components/agentInput/VoiceInputButton.vue`, `VoiceInputStatusRow.vue`, `AgentUserInputTextArea.vue`, `ContextFilePathInputArea.vue`, `components/chat/ChatComposer.vue`, `stores/voiceInputStore.ts` and `utils/voiceInputCapture.ts`. The microphone pattern is speech-to-editable-text, not automatically a saved audio clip. The reference has Context Files above the text area and a round microphone control with recording/transcription states. The current default Chat reference screenshot has no visible mic because availability is gated; the mic behavior reference is the component/store code. No extension was enabled and no source refresh/parity audit is claimed.

## Proposed experience
- PC-008: New/Edit Task use the familiar framed composer: Context Files header, plus attachment control, removable filename/type/size rows, image thumbnails, Clear all, multiline description and round mic/stop control. Keep the existing full-page flow, required description, first-line summary, Cancel and Ctrl/Meta+Enter. Inline validation clears when the required description is filled.
- Voice start → recording → stop → transcribing → editable appended text. Cancel recording leaves typed text intact. Save waits for voice/file input to settle. Failure and no-speech states preserve text and provide retry/type recovery, rather than expiring as success feedback does.
- PC-009: saved Task Detail displays Context Files; images preview inline with Close preview, never a modal. Edit can change/remove files; Cancel discards draft changes. A compact paperclip/count on the existing board card indicates saved context without cluttering the summary. Status remains read-only; identity is preserved.
- Description is still required with files selected. Attachment-only Tasks and saving raw recorded audio have not been decided.

## Simulation and open decisions
`TaskDescriptionComposer.vue` is a small prototype-native adapter, not the production upload/voice service. Voice uses a handwritten sample transcript, 250ms starting and 800ms transcription transitions, with `?voiceDemo=error` / `no-speech` recovery scenarios. Only the existing pure transcript-merge helper is reused. No microphone permission, capture, provider request or real speech recognition occurs.

File selection is browser-local metadata; image preview uses a local object URL. No file body is uploaded or stored on disk/server by the application. Context and all mock records reset on reload/dev remount. Ordinary non-image/audio files are metadata-only, not a fake working viewer/player. The two browser-test inputs are handwritten synthetic fixtures (575 bytes total), not user or production content.

Production voice availability/permissions, transcription privacy, raw audio handling, attachment types/size limits, storage, workspace ownership, permission/access by delegated agents and failure recovery are unapproved requirements/engineering decisions for the later handoff. Draft REQ-007/009 and DEC-006 remain the traceability context, not approval of this candidate or an amendment to canonical requirements.

## Validation
- 24 Vitest tests / 5 files pass, including attachment cloning/preservation/removal and agent transcript-merge behavior.
- Repository-configured lint passes; it does not cover copied Vue presentation files. Scoped `tsconfig.prototype.json` TypeScript check passes; not whole-frontend type checking. Nuxt build passes; final post-polish build rerun also passes (`review-evidence/round-4-build-final.log`, local ignored diagnostic log).
- Browser TI-001–020: desktop and 390×844 narrow checks pass for required text, voice Save blocking/cancel/appending/error/no-speech, native picker additions, collapse, saved files, inline preview, Edit/Clear/Cancel/removal, Task identity, board count and action reachability. See `review-evidence/round-4-task-input-checks.json`.
- Programmatic chooser `setFiles` was blocked by the Chrome extension's file-URL permission. It was not changed. Native picker fallback successfully selected both synthetic files separately. A single multi-selection, file drag/drop and clipboard-file paste are implemented but not browser-tested. Real microphone/transcription, upload/persistence, actual phone keyboard and delegated-agent file access deliberately not exercised.
- Nuxt preparation temporarily produced a dynamic-import error in the reference Chat tab; it recovered before reference capture. Stable task-input validation returned no console errors. A small live validation-polish change remounted the New Task component and reset its synthetic draft; files were selected again through the normal picker. A stale native AX-index action did not execute and was corrected from a fresh tree.

## Non-normative review evidence
- `review-evidence/round-4-agent-composer-reference.jpg` — accepted prototype Chat reference, not a newer-source parity claim.
- `review-evidence/round-4-task-composer-desktop.jpg` — current task input controls.
- `review-evidence/round-4-voice-recording.jpg` and `round-4-voice-error.jpg` — scripted voice states.
- `review-evidence/round-4-task-context-detail.jpg` — saved files and inline preview.
- `review-evidence/round-4-task-composer-narrow.jpg` and `round-4-task-composer-narrow-actions.jpg` — narrow layout and reachable actions.

## Review and repository state
Live normal entry: `http://127.0.0.1:3286/projects/project-prototype-launch/tasks/new` (also Projects → Project → New task).

Canonical repository `/Users/normy/autobyteus_org/autobyteus-web-prototype`; active worktree `/Users/normy/autobyteus_org/autobyteus-web-prototype-worktrees/project-task-manager-foundations`; branch `prototype/project-task-manager-foundations`; accepted base `df2f5cdaf9b168298dcae79ac47c11f31dd82d7c`; source pin `e9aa4a74ca36f62303bb7f5f0efd74bf89a9ea71`. Round-3 candidate persisted at `ea6e3d2`; this candidate's commit is the revision introducing this report. All 20 browser checks pass, including normal board entry and post-polish validation recovery. No integration, promotion or push. Runtime/worktree retained for user review. Projects default-off in the installed product is untouched.

User approval: pending. No final UI/UX spec or normative VIS references. UF-004 Product-first gate remains: no interim Solution Designer message. Broader Manager/dependency/execution/result decisions remain open.
