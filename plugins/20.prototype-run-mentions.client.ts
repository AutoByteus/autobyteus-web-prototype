import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'
import { simulateAgentRunReply, simulateAgentRunSend, simulateOrgRunSend, simulateTeamRunSend } from '~/prototype/run-mentions/runMentionSimulator'
import { agentRunScope, draftMentionKeys, resumedAgentRunIds, resumedOrgRunIds, resumedTeamRunIds } from '~/prototype/run-mentions/runMentionState'

/**
 * cross-scope-agent-mentions: registers the deterministic local run that plays
 * when a message is sent in a Team run, an Org run or a standalone Agent run.
 * Kept in its own plugin so plugins/00.prototype-state.client.ts stays free of
 * source-store imports.
 */
export default defineNuxtPlugin({
  name: 'prototype-run-mentions',
  setup(nuxtApp) {
    const pinia = nuxtApp.$pinia as Pinia & { _s: Map<string, any> }
    window.__AUTOBYTEUS_PROTOTYPE_TEAM_RUN_SEND__ = simulateTeamRunSend
    window.__AUTOBYTEUS_PROTOTYPE_AGENT_RUN_SEND__ = simulateAgentRunSend

    // Whether the composer's own send must run (instead of the inert prototype stub) because
    // the local run handles the message for the selected run.
    window.__AUTOBYTEUS_PROTOTYPE_LOCAL_SEND__ = (): boolean => {
      const target = pinia._s.get('activeContext')?.activeWorkspaceTarget
      if (!target) return false
      if (target.kind === 'standalone_team_member' || 'root' in target) return true
      if (target.kind !== 'standalone_agent') return false
      const rootRunId = pinia._s.get('agentContexts')?.activeRun?.state?.runId
      return Boolean(agentRunScope(rootRunId)) || draftMentionKeys(target.context.state.runId).length > 0
    }

    const patchStore = (store: any): void => {
      if (!store || store.__prototypeRunMentions) return
      if (store.$id === 'agentTeamRun') {
        // A Team run driven by the local run has no socket, so the source would treat it as
        // "connecting" and show Initializing on every history refresh. Report its stream as
        // ready so member statuses stay as the local run set them.
        const original = store.isTeamStreamReady
        store.isTeamStreamReady = (rootTeamRunId: string): boolean =>
          resumedTeamRunIds.has(rootTeamRunId) || original.call(store, rootTeamRunId)
        store.__prototypeRunMentions = true
      }
      if (store.$id === 'agentRun') {
        // A standalone Agent message sent through the product's own path (the first message of a
        // chat, or a plain reply) gets a short scripted answer, so the run settles at Idle and can
        // be continued. Without it the prototype's silent stream leaves the run pending forever.
        store.$onAction(({ name, after }: { name: string; after: (callback: () => void) => void }) => {
          if (name === 'sendUserInputAndSubscribe') after(() => { void simulateAgentRunReply() })
        })
        // As for a Team run: a locally driven Agent run has no socket; report its stream as ready
        // so a history refresh keeps the status the local run set.
        const originalReady = store.isAgentStreamReady
        store.isAgentStreamReady = (runId: string): boolean =>
          resumedAgentRunIds.has(runId) || originalReady.call(store, runId)
        store.__prototypeRunMentions = true
      }
      if (store.$id === 'agentOrgContexts') {
        // An Org member's composer sends through the local run. Without a backend the source
        // offers a stored Org only "continue" (restore + stream) and makes task Agents read-only.
        const originalTarget = store.activeTargetFor
        store.activeTargetFor = (orgRunId: string) => {
          const target = originalTarget(orgRunId)
          if (!target) return null
          return Object.freeze({
            ...target,
            access: 'live',
            interaction: Object.freeze({
              send: (content: string) => simulateOrgRunSend(orgRunId, content),
              interrupt: async () => undefined,
              decideTool: async () => undefined,
            }),
          })
        }
        // A locally driven Org run is never re-read from the fixtures; that would drop its task rows.
        const originalOpen = store.openForInspection
        store.openForInspection = (orgRunId: string, intent?: unknown) =>
          resumedOrgRunIds.has(orgRunId) && store.contextFor(orgRunId) ? Promise.resolve() : originalOpen(orgRunId, intent)
        store.__prototypeRunMentions = true
      }
    }
    pinia.use(({ store }) => { patchStore(store) })
    for (const id of ['agentTeamRun', 'agentRun', 'agentOrgContexts']) patchStore(pinia._s.get(id))
  },
})
