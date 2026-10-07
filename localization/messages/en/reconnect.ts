import type { TranslationCatalog } from '../../runtime/types';

// agent-definition-reconnect-ui: Reconnect a run whose agent folder was renamed or removed.
// The English strings are normative UI copy (tickets/in-progress/agent-definition-reconnect-ui/ui-ux-spec.md).
const reconnectMessages = {
  'reconnect.action': 'Reconnect…',
  'reconnect.actionAria': 'Reconnect {{name}} to an agent',
  'reconnect.notice.title': 'Agent “{{id}}” no longer exists',
  'reconnect.notice.detail': 'It was renamed or removed. Reconnect to an agent to continue. The conversation and session stay the same.',
  'reconnect.done.title': 'Reconnected to {{agent}}',
  'reconnect.done.detail': 'Send a message to continue where you left off.',
  'reconnect.done.instructions': 'Tools and skills apply from the next message. {{runtime}} keeps this session’s original instructions, so {{agent}}’s instructions apply from a new session.',
  'reconnect.done.dismiss': 'Dismiss',
  'reconnect.card.title': 'Agent “{{id}}” no longer exists',
  'reconnect.card.detail': 'It was renamed or removed, so this run could not continue. Reconnect to an agent, then send your message again.',
  'reconnect.card.resolved': 'Reconnected to {{agent}}.',
  'reconnect.dialog.title': 'Reconnect to an agent',
  'reconnect.dialog.contextRun': 'This run used',
  'reconnect.dialog.contextIn': 'in {{team}} used',
  'reconnect.dialog.contextGone': ', which was renamed or removed.',
  'reconnect.dialog.keeps': 'The run keeps its conversation, address and session. Its next message uses the agent you choose.',
  'reconnect.dialog.search': 'Search agents',
  'reconnect.dialog.listAria': 'Agents',
  'reconnect.dialog.noMatch': 'No agents match “{{query}}”.',
  'reconnect.dialog.similar': 'Similar names',
  'reconnect.dialog.all': 'All agents',
  'reconnect.dialog.teamLocal': 'Team-local agent of {{team}}',
  'reconnect.dialog.cancel': 'Cancel',
  'reconnect.dialog.confirm': 'Reconnect',
  'reconnect.dialog.reconnecting': 'Reconnecting…',
  'reconnect.dialog.busy': '{{name}} is running. Stop it, then reconnect.',
  'reconnect.dialog.failed': 'Couldn’t reconnect: {{reason}}',
  'reconnect.settings.missingRun': 'Agent “{{id}}” no longer exists.',
  'reconnect.settings.missingMember': '{{name}}: agent “{{id}}” no longer exists.',
  'reconnect.settings.reconnectedRun': 'Reconnected to {{agent}}.',
  'reconnect.settings.reconnectedMember': '{{name}} reconnected to {{agent}}.',
  'reconnect.settings.instructions': 'Its instructions apply from a new session ({{runtime}}).',
  'reconnect.member.missing': 'Agent missing',
  'reconnect.tree.missing': 'Agent “{{id}}” no longer exists',
} as const satisfies TranslationCatalog;

export default reconnectMessages;
