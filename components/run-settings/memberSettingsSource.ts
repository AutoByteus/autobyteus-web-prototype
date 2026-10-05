import type { ChatDraft, ChatDraftWorkspace, ChatMemberSettings } from '~/stores/chatDraftStore'
import type { RunSettingsValues } from './runSettings'

/**
 * run-settings-ui-unification (SR-003): what the members line and the Member settings drawer need.
 * A Team New chat and the Org launch page both provide one, so both use the same line and drawer.
 */
export type MemberSettingsTarget =
  | Readonly<{ kind: 'team'; teamDefinitionId: string }>
  | Readonly<{ kind: 'org'; orgDefinitionId: string }>

export type MemberSettingsSource = {
  /** Identity of the draft; a new draft gets fresh member state. */
  key: string
  target: MemberSettingsTarget
  /** The settings every member uses unless customized (the composer or the Org settings card). */
  defaults: RunSettingsValues
  memberSettings: Readonly<Record<string, ChatMemberSettings>>
  /** null or an empty object returns the member to the defaults. */
  setMemberSettings: (address: string, settings: ChatMemberSettings | null) => void
  resetAllMemberSettings: () => void
}

export type { ChatDraftWorkspace, ChatMemberSettings }

/** The Team New chat draft as a member-settings source. */
export const chatDraftMemberSource = (
  draft: ChatDraft,
  mutators: Pick<MemberSettingsSource, 'setMemberSettings' | 'resetAllMemberSettings'>,
): MemberSettingsSource | null => draft.target.kind !== 'team' ? null : {
  key: `chat:${draft.context.state.runId}:${draft.target.teamDefinitionId}`,
  target: draft.target,
  defaults: {
    workspace: draft.workspace,
    runtimeKind: draft.context.config.runtimeKind,
    llmModelIdentifier: draft.context.config.llmModelIdentifier || '',
    llmConfig: draft.context.config.llmConfig ?? null,
    autoExecuteTools: draft.autoExecuteTools,
  },
  memberSettings: draft.memberSettings,
  ...mutators,
}
