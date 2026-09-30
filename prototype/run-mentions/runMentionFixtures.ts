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
  brief: (request: string) => `The user asked: "${request}" Please take this on and report back to me.`,
  relayPlan: (name: string) => `I'll bring ${name} into this run and pass on your request.`,
  relayDone: (name: string, entry: string) => `${name} is in this run now. I sent ${entry} the brief and will pick this up again when they report back.`,
  relayExisting: (name: string, entry: string) => `${name} is already in this run, so I messaged ${entry} instead of starting another copy.`,
  relayFailed: (name: string, reason: string) => `I couldn't bring ${name} into this run. ${reason} Nothing was added.`,
  collaboratorAck: 'Got it. I\'ll start from the chat page input box and report back with a prototype.',
  collaboratorReport: (name: string) => `Prototype is ready for ${name}: the input box sits lower and every menu opens upward. Please review.`,
  collaboratorReportShort: 'Noted. I\'ll fold this into the same prototype.',
}
