import { defineStore } from 'pinia'
import {
  answerFor,
  type OfferEntry, type PeerRefusalCode,
} from '~/prototype/remote-collaboration/offersScript'

export type PeerOffer =
  | { phase: 'waiting'; token: number }
  | { phase: 'available'; entries: OfferEntry[]; checkedAt: string }
  | { phase: 'unavailable'; code: PeerRefusalCode; checkedAt: string }

export interface AskedPeer { nodeId: string; name: string; baseUrl: string }

let nextToken = 1

/**
 * What the Remote Collaboration page knows about each peer's offer.
 * Design reference: the answers are scripted (prototype/remote-collaboration/offersScript.ts). In the product
 * the node's server asks the peer, and the window never contacts it. Nothing here polls.
 */
export const useRemoteCollaborationOffersStore = defineStore('remoteCollaborationOffers', {
  state: () => ({
    peers: {} as Record<string, PeerOffer>,
  }),

  actions: {
    /** The page opened: every peer is asked at once, each with its own waiting state. */
    open(peers: AskedPeer[]) {
      this.peers = {}
      peers.forEach((peer) => this.askPeer(peer))
    },
    /** Asks the peers that have no answer yet (a peer that was just added). */
    askNew(peers: AskedPeer[]) {
      peers.filter((peer) => !this.peers[peer.nodeId]).forEach((peer) => this.askPeer(peer))
    },
    askPeer(peer: AskedPeer) {
      const token = nextToken++
      this.peers[peer.nodeId] = { phase: 'waiting', token }
      const scripted = answerFor(peer)
      setTimeout(() => {
        const current = this.peers[peer.nodeId]
        if (!current || current.phase !== 'waiting' || current.token !== token) return
        const checkedAt = new Date().toISOString()
        this.peers[peer.nodeId] = scripted.answer.ok
          ? { phase: 'available', entries: scripted.answer.entries, checkedAt }
          : { phase: 'unavailable', code: scripted.answer.code, checkedAt }
      }, scripted.delayMs)
    },
    forget(nodeId: string) {
      delete this.peers[nodeId]
    },
    /** The switch is off: no list, nothing is asked. */
    clear() {
      this.peers = {}
    },
  },
})
