import type { TranslationCatalog } from '../../runtime/types';

// agent-definition-reconnect-ui: Reconnect a run whose agent folder was renamed or removed.
// The English strings are normative UI copy (tickets/in-progress/agent-definition-reconnect-ui/ui-ux-spec.md).
const reconnectMessages = {
  'reconnect.action': 'Reconnect',
  'reconnect.actionAria': 'Reconnect {{name}} to an agent',
  'reconnect.notice.title': 'Agent {{id}} no longer exists',
  'reconnect.done.title': 'Reconnected to {{agent}}',
  'reconnect.done.instructions': 'instructions apply from a new session',
  'reconnect.done.dismiss': 'Dismiss',
  'reconnect.card.title': 'Agent {{id}} no longer exists',
  'reconnect.card.resolved': '{{id}} reconnected to {{agent}}',
  'reconnect.dialog.title': 'Reconnect to an agent',
  'reconnect.dialog.search': 'Search agents',
  'reconnect.dialog.listAria': 'Agents',
  'reconnect.dialog.noMatch': 'No agents match “{{query}}”.',
  'reconnect.dialog.similar': 'Similar names',
  'reconnect.dialog.all': 'All agents',
  'reconnect.dialog.teamLocal': 'Team-local agent of {{team}}',
  'reconnect.dialog.cancel': 'Cancel',
  'reconnect.dialog.confirm': 'Reconnect',
  'reconnect.dialog.reconnecting': 'Reconnecting…',
  'reconnect.dialog.failed': 'Couldn’t reconnect: {{reason}}',
  'reconnect.settings.missingRun': 'Agent {{id}} no longer exists',
  'reconnect.settings.missingMember': '{{name}}: agent no longer exists',
  'reconnect.settings.reconnectedRun': 'Reconnected to {{agent}}',
  'reconnect.settings.reconnectedMember': '{{name}} reconnected to {{agent}}',
  'reconnect.settings.instructions': '· instructions apply from a new session',
  'reconnect.member.missing': 'Agent missing',
  'reconnect.tree.missing': 'Agent {{id}} no longer exists',
  'reconnect.done.instructionsTitle': '{{runtime}} keeps this session’s instructions. Tools and skills apply now.',
  'reconnect.dialog.context': 'Replaces {{id}}. History and session are kept.',
  'reconnect.dialog.contextMember': '{{name}} · replaces {{id}}. History and session are kept.',
  'reconnect.dialog.agentRunActive': '{{name}} is running. Stop it, then reconnect.',
  'reconnect.dialog.rebindPending': 'Reconnect is still finishing. Try again.',
  'reconnect.dialog.runActive': 'This run is in use by another workflow. Stop it, then reconnect.',
  'reconnect.dialog.definitionNotFound': '{{agent}} no longer exists. Choose another agent.',
  'reconnect.done.runs': '{{count}} runs',
} as const satisfies TranslationCatalog;

export default reconnectMessages;
