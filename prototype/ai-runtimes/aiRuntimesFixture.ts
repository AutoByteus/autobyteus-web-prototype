// runtime-lifecycle-review (design-only): local synthetic state for Settings -> AI Runtimes.
// Everything here is invented and in memory; a reload resets it. The "node" is a module-level
// timeline: checks, updater runs and agent hand-backs advance on timers whether or not the
// section is mounted, so leaving the page and returning shows the current state.
// Versions are illustrative (they follow the values on the requester's Mac on 2026-10-20).
import { computed, reactive } from 'vue'

export type EngineId = 'codex' | 'claude' | 'antigravity' | 'grok'
export type CheckState = 'idle' | 'checking' | 'up_to_date' | 'update_available' | 'failed'
export type SignInState = 'signed_in' | 'not_signed_in' | 'unknown'
export type UpdatePhase = 'idle' | 'running' | 'succeeded' | 'failed'
export type LoadStatus = 'loading' | 'ready' | 'error'

export interface EngineRuntime {
  id: EngineId
  name: string
  installed: boolean
  version: string | null
  latest: string | null // what the vendor's own source reports on the next check
  checkWillFail: boolean // the vendor's source cannot be reached on the next check(s)
  updateWillFail: boolean // the vendor's updater exits with an error
  check: CheckState
  availableVersion: string | null
  signIn: SignInState
  agentsRunning: number
  signInInApp: boolean // the engine's own sign-in can be started from AutoByteus (otherwise: its command line)
  signInWillFail: boolean // the sign-in does not finish
  signing: { phase: 'idle' | 'waiting' | 'failed'; token: number }
  installUrl: string
  update: { phase: UpdatePhase; step: number; fromVersion: string | null; toVersion: string | null; failureOutput: string | null }
}

export const ENGINE_ORDER: EngineId[] = ['codex', 'claude', 'antigravity', 'grok']
// Vendor install-instruction pages. Illustrative: the requirements confirm the exact URLs.
const INSTALL_URL: Record<EngineId, string> = {
  codex: 'https://github.com/openai/codex',
  claude: 'https://code.claude.com/docs/en/setup',
  antigravity: 'https://antigravity.google/',
  grok: 'https://docs.x.ai/build',
}
const NAME: Record<EngineId, string> = { codex: 'Codex', claude: 'Claude', antigravity: 'Antigravity', grok: 'Grok' }
// How long the vendor's source takes to answer (ms): the checks resolve one by one, never together.
const CHECK_MS: Record<EngineId, number> = { codex: 650, claude: 1000, antigravity: 1500, grok: 1250 }
const UPDATE_STEP_MS = 1100
export const UPDATE_STEPS = 4 // checking, downloading, installing, finishing

const SCENARIO_KEY = 'autobyteus.prototype.scenario'

const state = reactive({
  loadStatus: 'loading' as LoadStatus,
  loadAttempts: 0,
  scenario: 'populated',
  isOwnNode: true,
  nodeName: '',
  engines: [] as EngineRuntime[],
  checkedAt: null as number | null,
  now: 0,
  announce: '' as string,
})

const engine = (
  id: EngineId, installed: boolean, version: string | null, latest: string | null, signIn: SignInState, extra: Partial<EngineRuntime> = {},
): EngineRuntime => ({
  id, name: NAME[id], installed, version, latest, checkWillFail: false, updateWillFail: false, check: 'idle', availableVersion: null,
  signIn, agentsRunning: 0, signInInApp: true, signInWillFail: false, signing: { phase: 'idle', token: 0 }, installUrl: INSTALL_URL[id],
  update: { phase: 'idle', step: 0, fromVersion: null, toVersion: null, failureOutput: null }, ...extra,
})

// The desktop's own node, as on the requester's Mac (2026-10-20).
const ownNode = (): EngineRuntime[] => [
  engine('codex', true, '0.163.0', '0.163.0', 'signed_in'),
  engine('claude', true, '2.1.302', '2.1.304', 'signed_in'),
  engine('antigravity', true, '1.4.3', '1.4.3', 'not_signed_in'),
  engine('grok', true, '1.0.62', '1.0.62', 'unknown'),
]

// A remote or Docker node carries its own engines (status only here).
const remoteNode = (): EngineRuntime[] => [
  engine('codex', true, '0.161.0', '0.163.0', 'signed_in'),
  engine('claude', true, '2.1.304', '2.1.304', 'signed_in'),
  engine('antigravity', true, '1.4.3', '1.4.3', 'unknown'),
  engine('grok', false, null, null, 'unknown'),
]

const byId = (id: EngineId) => state.engines.find((e) => e.id === id)!

const seed = (scenario: string, isOwnNode: boolean, nodeName: string) => {
  state.scenario = scenario
  state.isOwnNode = isOwnNode
  state.nodeName = nodeName
  state.engines = isOwnNode ? ownNode() : remoteNode()
  state.checkedAt = null
  state.loadStatus = 'loading'
  const get = (id: EngineId) => state.engines.find((e) => e.id === id)!
  if (scenario === 'runtimes_all_current') {
    get('claude').latest = '2.1.302'
  }
  if (scenario === 'runtimes_mixed' && isOwnNode) {
    Object.assign(get('codex'), { installed: false, version: null, latest: null, signIn: 'unknown' })
    get('claude').agentsRunning = 2
    get('antigravity').checkWillFail = true
    get('grok').signIn = 'not_signed_in'
    get('grok').signInInApp = false
  }
  if (scenario === 'runtimes_agents_running') get('claude').agentsRunning = 2
  if (scenario === 'runtimes_update_fails') get('claude').updateWillFail = true
  if (scenario === 'runtimes_signed_out') {
    // Claude's own sign-in can start here; Codex's cannot (command line only) — illustrative of an engine without in-app sign-in.
    get('claude').signIn = 'not_signed_in'
    get('codex').signIn = 'not_signed_in'
    get('codex').signInInApp = false
  }
  if (scenario === 'runtimes_sign_in_fails') get('antigravity').signInWillFail = true
  if (scenario === 'runtimes_check_failed') {
    for (const e of state.engines) if (e.installed) e.checkWillFail = true
  }
}

// ---- timeline ----

const timers = new Set<ReturnType<typeof setTimeout>>()
const later = (ms: number, fn: () => void) => {
  const handle = setTimeout(() => { timers.delete(handle); fn() }, ms)
  timers.add(handle)
}

const announce = (name: string, kind: string, extra = '') => { state.announce = `${name}|${kind}|${extra}` }

const resolveCheck = (e: EngineRuntime) => {
  if (!e.installed) return
  if (e.checkWillFail) { e.check = 'failed'; e.availableVersion = null; return }
  if (e.latest && e.version && e.latest !== e.version) { e.check = 'update_available'; e.availableVersion = e.latest }
  else { e.check = 'up_to_date'; e.availableVersion = null }
}

const startChecks = (ids: EngineId[]) => {
  let pending = 0
  for (const id of ids) {
    const e = byId(id)
    if (!e.installed || e.update.phase === 'running') continue
    e.check = 'checking'
    pending += 1
    later(CHECK_MS[id], () => {
      resolveCheck(e)
      pending -= 1
      if (pending === 0) { state.checkedAt = Date.now(); announce('', 'checked') }
    })
  }
  if (pending === 0) state.checkedAt = Date.now()
}

const scheduleAgentHandBack = () => {
  // runtimes_agents_running: the two agents on Claude finish their work (a scripted timeline).
  if (state.scenario !== 'runtimes_agents_running') return
  later(12000, () => { byId('claude').agentsRunning = 1 })
  later(24000, () => { byId('claude').agentsRunning = 0 })
}

let initialized = false
const finishLoad = () => {
  state.loadAttempts += 1
  if (state.scenario === 'runtimes_load_failed' && state.loadAttempts === 1) { state.loadStatus = 'error'; return }
  state.loadStatus = 'ready'
  startChecks(ENGINE_ORDER) // opening the page checks every installed engine, each on its own
}

export const initAiRuntimes = (isOwnNode: boolean, nodeName: string) => {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  seed(window.localStorage.getItem(SCENARIO_KEY) || 'populated', isOwnNode, nodeName)
  scheduleAgentHandBack()
  later(700, finishLoad)
}

// Opening the page again (after leaving it) re-checks, as the first open did.
export const reopenAiRuntimes = () => {
  if (!initialized || state.loadStatus !== 'ready') return
  startChecks(ENGINE_ORDER)
}

export const retryLoad = () => {
  state.loadStatus = 'loading'
  later(500, finishLoad)
}

export const checkAgain = () => startChecks(ENGINE_ORDER)

const UPDATE_FAILURE: Record<EngineId, string> = {
  claude: "claude update: EACCES: permission denied, rename '/usr/local/bin/claude'",
  codex: 'codex update: could not replace the running binary',
  antigravity: 'agy update: update manifest could not be verified',
  grok: 'grok update: installer exited with status 1',
}

export const startUpdate = (id: EngineId) => {
  const e = byId(id)
  if (!state.isOwnNode || e.update.phase === 'running' || e.agentsRunning > 0 || e.check !== 'update_available') return
  e.update = { phase: 'running', step: 0, fromVersion: e.version, toVersion: e.availableVersion, failureOutput: null }
  const advance = () => {
    e.update.step += 1
    const failsHere = e.updateWillFail && e.update.step === 3
    if (failsHere) {
      e.update = { ...e.update, phase: 'failed', failureOutput: UPDATE_FAILURE[id] }
      announce(e.name, 'updateFailed')
      return
    }
    if (e.update.step >= UPDATE_STEPS) {
      e.version = e.update.toVersion
      e.update = { ...e.update, phase: 'succeeded' }
      announce(e.name, 'updated', e.version ?? '')
      // After the vendor's updater finishes, the page checks again.
      e.check = 'checking'
      later(CHECK_MS[id], () => { resolveCheck(e); state.checkedAt = Date.now() })
      return
    }
    later(UPDATE_STEP_MS, advance)
  }
  later(UPDATE_STEP_MS, advance)
}

const SIGN_IN_WAIT_MS = 5000
export const startSignIn = (id: EngineId) => {
  const e = byId(id)
  if (!state.isOwnNode || !e.installed || !e.signInInApp || e.signIn !== 'not_signed_in' || e.signing.phase === 'waiting') return
  const token = e.signing.token + 1
  e.signing = { phase: 'waiting', token }
  // The user finishes (or abandons) the vendor's own sign-in in the browser; the engine then reports its status.
  later(SIGN_IN_WAIT_MS, () => {
    if (e.signing.phase !== 'waiting' || e.signing.token !== token) return
    if (e.signInWillFail) { e.signing = { phase: 'failed', token }; return }
    e.signIn = 'signed_in'
    e.signing = { phase: 'idle', token }
    announce(e.name, 'signedIn')
  })
}
export const cancelSignIn = (id: EngineId) => {
  const e = byId(id)
  if (e.signing.phase === 'waiting' || e.signing.phase === 'failed') e.signing = { phase: 'idle', token: e.signing.token }
}

// A new action on the row clears the previous outcome.
export const dismissOutcome = (id: EngineId) => {
  const e = byId(id)
  if (e.update.phase === 'succeeded' || e.update.phase === 'failed') e.update = { phase: 'idle', step: 0, fromVersion: null, toVersion: null, failureOutput: null }
}

// ---- relative time for "Checked … ago" ----

let clock: ReturnType<typeof setInterval> | null = null
export const useRelativeClock = () => {
  state.now = Date.now()
  if (!clock && typeof window !== 'undefined') clock = setInterval(() => { state.now = Date.now() }, 20000)
}

export const useAiRuntimesState = () => ({
  state,
  engines: computed(() => state.engines),
  isChecking: computed(() => state.engines.some((e) => e.check === 'checking')),
  minutesSinceCheck: computed(() => (state.checkedAt === null ? null : Math.floor((Math.max(state.now, state.checkedAt) - state.checkedAt) / 60000))),
})
