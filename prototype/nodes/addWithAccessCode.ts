/**
 * extensions-ui-516 (design only): adding a node with its access code (pairing-contract §6), shared by Add node in "Nodes
 * you control" and by Control on a node found on the private network. The code says which node and where; its setup code
 * is exchanged for this AutoByteus's owner credential (today's setup exchange), so the node is listed under control.
 * Every value is invented; the network of nodes is simulated (`network-world.mjs`).
 */
import { useLocalization } from '~/composables/useLocalization'
import { isNodeCodeUsed, markNodeCodeUsed, NODE_NAMES, readNodeCode } from '~/prototype/nodes/nodeCode'
import { useNodeAccessStore } from '~/stores/nodeAccessStore'
import { useNodeListStore } from '~/stores/nodeListStore'
import { useNodeStore } from '~/stores/nodeStore'

export type AddWithCodeResult =
  | { ok: true; nodeId: string; name: string }
  | { ok: false; field: 'code' | 'address'; message: string }
  | { ok: false; field: 'duplicate'; existing: string }

export const accessCodeAddress = (address: string): string => (address.includes(':') ? address : `${address}:29695`)
const later = (ms: number) => new Promise<void>((done) => setTimeout(done, ms))

export function useAddWithAccessCode() {
  const { t } = useLocalization()
  const nodeStore = useNodeStore()
  const access = useNodeAccessStore()
  const list = useNodeListStore()

  /**
   * `expect`: the node the code must be for (a found node's Control), or the address typed in Add node.
   * `name`: a typed name; otherwise the node says its own when it is reached.
   */
  async function add(text: string, options: { name?: string; expectNodeId?: string; expectName?: string; typedAddress?: string; onStep: (step: string) => void }): Promise<AddWithCodeResult> {
    const code = readNodeCode(text)
    if (!code) return { ok: false, field: 'code', message: t('nodes.nodeCode.errorNotCode') }
    if (Date.parse(code.expiresAt) < Date.now()) return { ok: false, field: 'code', message: t('nodes.nodeCode.errorExpired') }
    if (isNodeCodeUsed(code.setupCode)) return { ok: false, field: 'code', message: t('nodes.nodeCode.errorUsed') }
    if (options.expectNodeId && code.nodeId !== options.expectNodeId) {
      return { ok: false, field: 'code', message: t('nodes.nodeCode.errorOtherNode', { name: options.expectName ?? '' }) }
    }
    const typed = (options.typedAddress ?? '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
    if (typed && typed !== accessCodeAddress(code.address)) {
      return { ok: false, field: 'address', message: t('nodes.nodeCode.errorAddress', { address: accessCodeAddress(code.address) }) }
    }
    const listed = nodeStore.nodes.find((entry) => entry.nodeId === code.nodeId)
    if (listed) return { ok: false, field: 'duplicate', existing: listed.name }
    const name = options.name?.trim() || options.expectName || NODE_NAMES[code.nodeId] || 'new-node'
    const baseUrl = `http://${accessCodeAddress(code.address)}`
    options.onStep(t('nodes.nodeCode.stepReach', { address: code.address.replace(/:\d+$/, '') }))
    await later(900)
    ;(window as any).__designNetworkWorld?.()?.addOwnedNode({ nodeId: code.nodeId, name, address: baseUrl })
    options.onStep(t('nodes.nodeCode.stepOwner', { name }))
    await later(700)
    const entry = await nodeStore.addRemoteNode({ name, baseUrl, nodeId: code.nodeId })
    await access.connect(entry.id, code.setupCode)
    markNodeCodeUsed(code.setupCode)
    await list.open()
    list.flashKey = code.nodeId
    setTimeout(() => { if (list.flashKey === code.nodeId) list.flashKey = null }, 2500)
    return { ok: true, nodeId: code.nodeId, name }
  }

  return { add }
}
