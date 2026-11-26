/**
 * extensions-ui-516 (design only): the access code (pairing-contract.md §6, founder 2026-11-25).
 *
 * Made on the node's own computer by `autobyteus-docker access-code <node>` (today's setup-code, renamed; the start command
 * prints one too), or in an AutoByteus that controls the node (This node → Create access code); pasted in AutoByteus under
 * Nodes → Add node, or on a "Needs connecting" row. Today's setup code plus how to reach the node: `abps_` + base64url of
 * { nodeId, address, setupCode, expiresAt }. One-time, 30 minutes, never logged. Every value here is invented; codes used
 * in this browser are remembered in localStorage.
 */

export interface NodeCode { nodeId: string; address: string; setupCode: string; expiresAt: string }
export const NODE_CODE_LIFETIME_MS = 30 * 60_000
const USED_KEY = 'autobyteus.design.usedNodeCodes'

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const pick = (n: number) => Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
const b64url = (text: string) => btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/** Nodes this design knows by ID, as a desktop learns their names when it reaches them. */
export const DOCKER_TWO_ID = 'srv_d0ck3rTw0N0deAcc3ssC0deKp4Vm8Rt2Xw'
export const NODE_NAMES: Record<string, string> = {
  [DOCKER_TWO_ID]: 'autobyteus-node-2',
  srv_bu1ldS3rv3rN0deC0deQx7Rf2Lm9PdZt4Wn: 'build-server',
  srv_m9VFq2Lw: 'Embedded Node',
}

export function makeNodeCode(nodeId: string, address: string): { text: string; code: NodeCode } {
  const code: NodeCode = { nodeId, address, setupCode: `${pick(4)}-${pick(4)}-${pick(4)}`, expiresAt: new Date(Date.now() + NODE_CODE_LIFETIME_MS).toISOString() }
  return { text: `abps_${b64url(JSON.stringify(code))}`, code }
}

export function readNodeCode(text: string): NodeCode | null {
  const value = String(text).trim()
  if (!value.startsWith('abps_')) return null
  try {
    const body = value.slice(5).replace(/-/g, '+').replace(/_/g, '/')
    const parsed = JSON.parse(atob(body + '==='.slice((body.length + 3) % 4)))
    return parsed?.nodeId && parsed?.address && parsed?.setupCode ? parsed as NodeCode : null
  } catch { return null }
}

export const usedNodeCodes = (): string[] => { try { return JSON.parse(localStorage.getItem(USED_KEY) || '[]') } catch { return [] } }
export const markNodeCodeUsed = (setupCode: string): void => { localStorage.setItem(USED_KEY, JSON.stringify([...usedNodeCodes(), setupCode])) }
export const isNodeCodeUsed = (setupCode: string): boolean => usedNodeCodes().includes(setupCode)
