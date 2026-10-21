// Remote Collaboration offers (design remote-nodes-page, autobyteus-267).
// UI-reference simulation only: what each peer answers and what this node shares are invented here.
// Every name, description, delay and reason below is illustrative.

export type OfferKind = 'AGENT' | 'AGENT_TEAM'

export interface OfferEntry {
  key: string
  name: string
  kind: OfferKind
  /** Present only when the definition has one (the 260 rule: only fields that have a value). */
  description?: string
}

export type PeerRefusalCode =
  | 'REMOTE_COLLABORATION_OFF'
  | 'PEER_NOT_REGISTERED'
  | 'PEER_UNREACHABLE'
  | 'PEER_IDENTITY_MISMATCH'

export type Readiness =
  | { state: 'ready' }
  | { state: 'no_default'; member?: string }
  | { state: 'cannot_run'; reason: string }

export interface SharedEntry extends OfferEntry {
  definitionId: string
  readiness: Readiness
}

export type PeerAnswer =
  | { ok: true; entries: OfferEntry[] }
  | { ok: false; code: PeerRefusalCode }

export interface ScriptedPeerAnswer { delayMs: number; answer: PeerAnswer }

const agent = (name: string, description?: string): OfferEntry => ({ key: `a:${name}`, kind: 'AGENT', name, ...(description ? { description } : {}) })
const team = (name: string, description?: string): OfferEntry => ({ key: `t:${name}`, kind: 'AGENT_TEAM', name, ...(description ? { description } : {}) })

const DOCKER_OFFER: OfferEntry[] = [
  agent('Build Runner', 'Runs the project build and reports failing steps.'),
  agent('Code Reviewer', 'Reviews a change and lists risks before merge.'),
  agent('Data Cleaner', 'Normalizes CSV exports and flags odd rows.'),
  agent('Log Analyst'),
  agent('Release Notes Writer', 'Drafts release notes from merged changes.'),
  agent('Test Author', 'Writes unit tests for a given module.'),
  agent('Translator', 'Translates product copy between English and Chinese.'),
  team('Release Crew', 'Build Runner, Test Author and Release Notes Writer working through a release.'),
  team('Review Panel', 'Two reviewers and a moderator for a second opinion.'),
]

const STUDIO_NAMES = [
  'Brand Voice Editor', 'Caption Writer', 'Color Palette Picker', 'Copy Editor', 'Deck Outliner', 'Font Pairing Advisor',
  'Icon Curator', 'Image Describer', 'Layout Critic', 'Logo Brief Writer', 'Moodboard Builder', 'Motion Brief Writer',
  'Naming Brainstormer', 'Poster Designer', 'Proofreader', 'Social Post Planner', 'Storyboard Artist', 'Style Guide Keeper',
  'Tagline Tester', 'Thumbnail Ideator', 'Tone Checker', 'UX Copy Reviewer', 'Video Script Writer', 'Visual QA',
]
const STUDIO_OFFER: OfferEntry[] = [
  ...STUDIO_NAMES.map((name, index) => index % 3 === 1 ? agent(name) : agent(name, `Studio agent for ${name.toLowerCase()} tasks.`)),
  team('Campaign Team', 'Plans and drafts a campaign from a brief.'),
  team('Launch Visuals Team', 'Moodboard, posters and thumbnails for a launch.'),
  team('Localization Team', 'Translates and proofreads in several languages.'),
  team('Pitch Deck Team', 'Outline, copy and visuals for a pitch deck.'),
  team('Rebrand Team'),
  team('Social Calendar Team', 'Plans a month of posts and drafts each one.'),
  team('Video Team', 'Script, storyboard and captions for a short video.'),
]

/** What each seeded peer answers, by its registered name. An added peer is judged by its URL (see `answerFor`). */
const BY_NAME: Record<string, ScriptedPeerAnswer> = {
  docker: { delayMs: 900, answer: { ok: true, entries: DOCKER_OFFER } },
  studio: { delayMs: 3200, answer: { ok: true, entries: STUDIO_OFFER } },
  lab: { delayMs: 1400, answer: { ok: false, code: 'REMOTE_COLLABORATION_OFF' } },
  nas: { delayMs: 1100, answer: { ok: false, code: 'PEER_NOT_REGISTERED' } },
  edge: { delayMs: 20000, answer: { ok: false, code: 'PEER_UNREACHABLE' } },
  spare: { delayMs: 1700, answer: { ok: false, code: 'PEER_IDENTITY_MISMATCH' } },
  empty: { delayMs: 800, answer: { ok: true, entries: [] } },
}

export const answerFor = (peer: { name: string; baseUrl: string }): ScriptedPeerAnswer => {
  const named = BY_NAME[peer.name.trim().toLowerCase()]
  if (named) return named
  const url = peer.baseUrl.toLowerCase()
  if (url.includes('off')) return BY_NAME.lab
  if (url.includes('unregistered')) return BY_NAME.nas
  if (url.includes('mismatch')) return BY_NAME.spare
  if (url.includes('slow')) return BY_NAME.edge
  return { delayMs: 1200, answer: { ok: true, entries: DOCKER_OFFER.slice(0, 3) } }
}

const sharedAgent = (definitionId: string, name: string, readiness: Readiness, description?: string): SharedEntry => ({
  key: `a:${definitionId}`, definitionId, kind: 'AGENT', name, readiness, ...(description ? { description } : {}),
})
const sharedTeam = (definitionId: string, name: string, readiness: Readiness, description?: string): SharedEntry => ({
  key: `t:${definitionId}`, definitionId, kind: 'AGENT_TEAM', name, readiness, ...(description ? { description } : {}),
})
const ready: Readiness = { state: 'ready' }

/** This node's shared Agents and Teams. Ids that exist in the baseline fixtures make the settings links open a real edit page. */
export const SHARED_ENTRIES: SharedEntry[] = [
  sharedAgent('agent-researcher', 'Research Assistant', ready, 'Finds sources and summarizes them with citations.'),
  sharedAgent('agent-writer', 'Documentation Writer', { state: 'no_default' }, 'Writes and edits product documentation.'),
  sharedAgent('autobyteus-daily-assistant', 'Daily Assistant', { state: 'cannot_run', reason: 'Codex App Server command “codex” is not available.' }, 'Plans the day and keeps a running list of follow-ups.'),
  sharedAgent('agent-ex-01', 'Bug Triager', ready, 'Sorts incoming bug reports by severity.'),
  sharedAgent('agent-ex-02', 'Changelog Keeper', ready),
  sharedAgent('agent-ex-03', 'Code Explainer', ready, 'Explains unfamiliar code in plain language.'),
  sharedAgent('agent-ex-04', 'Data Analyst', ready, 'Answers questions about a spreadsheet or CSV.'),
  sharedAgent('agent-ex-05', 'Meeting Summarizer', ready, 'Turns a transcript into decisions and action items.'),
  sharedAgent('agent-ex-06', 'Support Replier', ready, 'Drafts replies to customer questions.'),
  sharedAgent('agent-ex-07', 'Test Author', ready),
  sharedAgent('agent-ex-08', 'Translator', ready, 'Translates between English and Chinese.'),
  sharedTeam('team-product', 'Product Review Team', { state: 'no_default', member: 'Documentation Writer' }, 'Researcher, writer and reviewer for a product page.'),
  sharedTeam('team-ex-01', 'Release Crew', ready, 'Build, test and release notes for a release.'),
  sharedTeam('team-ex-02', 'Support Desk Team', ready),
]

/** Scenario `collab_all_ready` (starting state only): every shared entry already has a default that runs. */
export const sharedEntries = (scenario: string): SharedEntry[] =>
  scenario === 'collab_all_ready' ? SHARED_ENTRIES.map((entry) => ({ ...entry, readiness: ready })) : SHARED_ENTRIES

export const SHARED_DELAY_MS = 1800
