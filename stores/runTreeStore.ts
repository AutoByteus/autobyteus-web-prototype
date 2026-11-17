import { defineStore } from 'pinia'
import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'

export type RunTreeRef = Readonly<{ kind: 'agent' | 'agent_team' | 'agent_org'; runId: string }>

/** An agent of a run on a peer node, as its tree row has it: its run and node, and what the node last answered about it. */
export type PeerRunOfAgent = Readonly<{
  runId: string
  nodeId: string
  nodeName: string
  reachable: boolean | null
  title: string | null
}>

/**
 * Stand-in for the product's run tree store (the rows the server built). Only what the conversation's views read is
 * simulated: which agent runs another node runs. The phone's run list rows are `stores/mobileRunTreeStore.ts`.
 */
export const useRunTreeStore = defineStore('runTree', () => {
  const world = useMobileRunTreeStore()
  const peerRunOf = (agentRunId: string | null | undefined): PeerRunOfAgent | null => {
    const node = world.byId(agentRunId)
    if (!node?.node) return null
    return Object.freeze({ runId: node.id, nodeId: node.node, nodeName: node.node, reachable: world.isNodeReachable(node.node), title: node.summary || null })
  }
  return { peerRunOf }
})
