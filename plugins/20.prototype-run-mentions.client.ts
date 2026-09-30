import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'
import { simulateTeamRunSend } from '~/prototype/run-mentions/runMentionSimulator'
import { resumedTeamRunIds } from '~/prototype/run-mentions/runMentionState'

/**
 * cross-scope-agent-mentions: registers the deterministic local Team run that
 * plugins/00.prototype-state.client.ts plays when a message is sent in a Team
 * run. Kept in its own plugin so the state plugin stays free of source-store
 * imports.
 */
export default defineNuxtPlugin({
  name: 'prototype-run-mentions',
  setup(nuxtApp) {
    window.__AUTOBYTEUS_PROTOTYPE_TEAM_RUN_SEND__ = simulateTeamRunSend

    // A Team run driven by the local run has no socket, so the source would
    // treat it as "connecting" and show Initializing on every history refresh.
    // Report its stream as ready so member statuses stay as the local run set them.
    const pinia = nuxtApp.$pinia as Pinia & { _s: Map<string, any> }
    const reportLocalRunReady = (store: any): void => {
      if (store?.$id !== 'agentTeamRun' || store.__prototypeLocalRunReady) return
      const original = store.isTeamStreamReady
      store.isTeamStreamReady = (rootTeamRunId: string): boolean =>
        resumedTeamRunIds.has(rootTeamRunId) || original.call(store, rootTeamRunId)
      store.__prototypeLocalRunReady = true
    }
    pinia.use(({ store }) => { reportLocalRunReady(store) })
    reportLocalRunReady(pinia._s.get('agentTeamRun'))
  },
})
