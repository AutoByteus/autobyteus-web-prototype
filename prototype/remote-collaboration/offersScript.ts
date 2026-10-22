// What a node offers (design remote-nodes-page, autobyteus-267; reused by one-nodes-tab).
// UI-reference simulation only: the entries each node offers are invented here.
// Every name, description, delay and reason below is illustrative.

export type OfferKind = 'AGENT' | 'AGENT_TEAM'

export interface OfferEntry {
  key: string
  name: string
  kind: OfferKind
  /** Present only when the definition has one (the 260 rule: only fields that have a value). */
  description?: string
}

const agent = (name: string, description?: string): OfferEntry => ({ key: `a:${name}`, kind: 'AGENT', name, ...(description ? { description } : {}) })
const team = (name: string, description?: string): OfferEntry => ({ key: `t:${name}`, kind: 'AGENT_TEAM', name, ...(description ? { description } : {}) })

export const DOCKER_OFFER: OfferEntry[] = [
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
export const STUDIO_OFFER: OfferEntry[] = [
  ...STUDIO_NAMES.map((name, index) => index % 3 === 1 ? agent(name) : agent(name, `Studio agent for ${name.toLowerCase()} tasks.`)),
  team('Campaign Team', 'Plans and drafts a campaign from a brief.'),
  team('Launch Visuals Team', 'Moodboard, posters and thumbnails for a launch.'),
  team('Localization Team', 'Translates and proofreads in several languages.'),
  team('Pitch Deck Team', 'Outline, copy and visuals for a pitch deck.'),
  team('Rebrand Team'),
  team('Social Calendar Team', 'Plans a month of posts and drafts each one.'),
  team('Video Team', 'Script, storyboard and captions for a short video.'),
]

export const EIGHT_THREE_OFFER: OfferEntry[] = [
  agent('Code Reviewer', 'Reviews a change and lists risks before merge.'),
  agent('Researcher', 'Searches the web and summarizes what it finds.'),
  agent('Writer'),
  team('Software Team', 'Design, build and test a change.'),
]

export const EMBEDDED_OFFER: OfferEntry[] = [
  agent('Project Planner', 'Breaks a goal into tasks and tracks them.'),
  agent('Doc Writer', 'Drafts and edits documentation.'),
  team('Product Team', 'Plans, designs and reviews a product change.'),
]
