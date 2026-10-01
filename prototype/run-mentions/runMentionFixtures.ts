/**
 * Illustrative shared definitions for the live-run `@` menu
 * (`cross-scope-agent-mentions`). The accepted baseline catalog has one Team
 * and two addressable Agents, all of which already belong to the synthetic
 * runs, so the review needs definitions that are outside the run. They exist
 * only in the live-run `@` menu; catalog pages and the New chat `@` menu are
 * unchanged. Names and copy are synthetic, not requirements.
 */
import type { RunMentionDefinition } from './runMentionState'

export const illustrativeRunMentionDefinitions: readonly RunMentionDefinition[] = Object.freeze([
  {
    key: 'team:fixture-product-team',
    kind: 'team',
    id: 'fixture-product-team',
    name: 'Product Team',
    description: '',
    members: [
      { name: 'product prototyper', agentDefinitionId: 'fixture-product-prototyper' },
      { name: 'prototype bootstrapper', agentDefinitionId: 'fixture-prototype-bootstrapper' },
    ],
    unrunnableReason: null,
  },
  {
    key: 'team:fixture-marketing-team',
    kind: 'team',
    id: 'fixture-marketing-team',
    name: 'Marketing Team',
    description: '',
    members: [
      { name: 'campaign lead', agentDefinitionId: 'fixture-campaign-lead' },
      { name: 'content writer', agentDefinitionId: 'fixture-content-writer' },
      { name: 'social editor', agentDefinitionId: 'fixture-social-editor' },
    ],
    // SC-006: cannot run with the inherited settings.
    unrunnableReason: 'Its agents need the Codex runtime, and this run uses AutoByteus.',
  },
  {
    key: 'agent:fixture-computer-use-agent',
    kind: 'agent',
    id: 'fixture-computer-use-agent',
    name: 'Computer Use Agent',
    description: 'Operates the desktop and browser to carry out tasks on screen.',
    members: [],
    unrunnableReason: null,
  },
  {
    key: 'agent:fixture-code-reviewer',
    kind: 'agent',
    id: 'fixture-code-reviewer',
    name: 'Code Reviewer',
    description: 'Reviews implementation source and reports actionable findings.',
    members: [],
    unrunnableReason: null,
  },
])

/** Scripted, illustrative agent prose for the deterministic run. */
export const runMentionScript = {
  brief: (request: string) => `The user asked: "${request}"\nPlease take this on and report back to me.`,
  plainReply: 'Understood. I\'ll take it from here.',
  relayPlan: (name: string) => `I'll brief ${name} on this.`,
  relayDone: (name: string) => `I sent ${name} the brief and will pick this up again when they report back.`,
  collaboratorAck: 'Got it. I\'ll start on this now and report back.',
  collaboratorReport: (name: string) => `Done, ${name}. The result is ready for you to review.`,
  collaboratorReportShort: 'Noted. I\'ll fold this into the same prototype.',
}
