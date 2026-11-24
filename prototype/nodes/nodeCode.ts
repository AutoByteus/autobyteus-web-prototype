/**
 * extensions-ui-516 (design only): the node code (pairing-contract.md §6a, founder's decision 2026-11-24).
 *
 * The target node makes it in its own UI (its first-run page while it has no owner, or "Let another desktop control this
 * node" by its existing owner); the owner pastes it on the desktop that should control the node (Nodes → Add node). It is
 * today's setup code made in the UI, plus how to reach the node: `abps_` + base64url of { nodeId, address, setupCode,
 * expiresAt }. One-time, 30 minutes, never logged. Every value here is invented; codes used in this browser are remembered
 * in localStorage so a first-run page in another tab sees its code being used (the desktop's paste, simulated).
 */

export interface NodeCode { nodeId: string; address: string; setupCode: string; expiresAt: string }
export const NODE_CODE_LIFETIME_MS = 30 * 60_000
const USED_KEY = 'autobyteus.design.usedNodeCodes'

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const pick = (n: number) => Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
const b64url = (text: string) => btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/** Nodes this design knows by ID, as a desktop learns their names when it reaches them. */
export const NODE_NAMES: Record<string, string> = {
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
