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
