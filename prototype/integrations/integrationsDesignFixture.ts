/**
 * integrations-page (design-only layer).
 *
 * Invented, illustrative data for the Integrations page: the integrations of the "official repository", the tools
 * "found" on this node, and scripted outcomes for Install, Connect, Test and Remove. Nothing is read from GitHub,
 * from a node, or from a real repository; the texts below stand in for each integration's own `integration.json`.
 *
 * Starting states are seeded with the existing `autobyteus.prototype.scenario` key (no visible control):
 * - `populated` (default): one card, GitHub, Not installed; curl, jq and git found.
 * - `integrations_connected`: GitHub installed and connected as @alex-dev.
 * - `integrations_several`: three cards: GitHub (connected), Jira (needs a newer AutoByteus), SSH (not installed).
 * - `integrations_tool_missing`: GitHub, Not installed; `jq` is not found.
 * - `integrations_install_clash`: Install fails on a skill name clash.
 * - `integrations_token_revoked`: GitHub connected; Test is refused by GitHub.
 * - `integrations_offline`: the repository cannot be reached and nothing is installed (the first Retry fails again).
 * - `integrations_offline_installed`: GitHub connected, the repository cannot be reached.
 *
 * Scripted outcomes under the product's own controls (typed into the token field):
 * - a token containing `bad`, `reject` or `revoked` -> "GitHub rejected the token.";
 * - a token containing `offline` -> "The token could not be checked with GitHub. Try again.";
 * - any other non-empty token -> Connected as @alex-dev.
 */
export type IntegrationPhase = 'not_installed' | 'needs_token' | 'connected' | 'needs_newer'

export interface IntegrationDefinition {
  id: string
  name: string
  description: string
  skillName: string
  icon: 'github' | null
  tokenHelp: string
  prerequisites: string[]
  needsNewerApp: boolean
}

export const OFFICIAL_REPOSITORY = 'github.com/AutoByteus/autobyteus-integrations'

export const LOGIN = 'alex-dev'

const CATALOG: IntegrationDefinition[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Lets agents use GitHub from their shell: read issues and pull requests, comment, and push branches.',
    skillName: 'github-integration',
    icon: 'github',
    tokenHelp: 'Create a fine-grained token at https://github.com/settings/personal-access-tokens/new and limit it to the repositories your agents need. A Projects board on a personal account needs a classic token with the project scope.',
    prerequisites: ['curl', 'jq', 'git'],
    needsNewerApp: false,
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Lets agents read and update Jira issues from their shell.',
    skillName: 'jira-integration',
    icon: null,
    tokenHelp: 'Create an API token at https://id.atlassian.com/manage-profile/security/api-tokens and paste it here.',
    prerequisites: ['curl', 'jq'],
    needsNewerApp: true,
  },
  {
    id: 'ssh',
    name: 'SSH',
    description: 'Lets agents run commands on the servers you choose, over SSH.',
    skillName: 'ssh-integration',
    icon: null,
    tokenHelp: 'Paste the key AutoByteus should use. It is stored on this node.',
    prerequisites: ['ssh', 'ssh-keygen'],
    needsNewerApp: false,
  },
]

export interface ToolCheck { name: string; found: boolean }

export interface IntegrationState {
  installed: boolean
  login: string | null
  connectedAt: string | null
}

export interface IntegrationsWorld {
  scenario: string
  /** The order the repository lists them in. */
  ids: string[]
  state: Record<string, IntegrationState>
  missingTools: Set<string>
  /** 'unreachable' until a Retry works. */
  repository: 'reachable' | 'unreachable'
  retryFailuresLeft: number
}

const fresh = (): IntegrationState => ({ installed: false, login: null, connectedAt: null })
const connected = (at: string): IntegrationState => ({ installed: true, login: LOGIN, connectedAt: at })

const scenarioKey = (): string => {
  try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated' } catch { return 'populated' }
}

const build = (scenario: string): IntegrationsWorld => {
  const world: IntegrationsWorld = {
    scenario,
    ids: ['github'],
    state: { github: fresh(), jira: fresh(), ssh: fresh() },
    missingTools: new Set(),
    repository: 'reachable',
    retryFailuresLeft: 0,
  }
  if (scenario === 'integrations_connected' || scenario === 'integrations_token_revoked') world.state.github = connected('2026-10-24T09:12:00.000Z')
  if (scenario === 'integrations_several') {
    world.ids = ['github', 'jira', 'ssh']
    world.state.github = connected('2026-10-24T09:12:00.000Z')
  }
  if (scenario === 'integrations_tool_missing') world.missingTools.add('jq')
  if (scenario === 'integrations_offline') { world.repository = 'unreachable'; world.retryFailuresLeft = 1 }
  if (scenario === 'integrations_offline_installed') { world.repository = 'unreachable'; world.state.github = connected('2026-10-24T09:12:00.000Z') }
  return world
}

let world: IntegrationsWorld | null = null

/** One browser context's state; a scenario change or a reload starts again. */
export const integrationsWorld = (): IntegrationsWorld => {
  const scenario = scenarioKey()
  if (!world || world.scenario !== scenario) world = build(scenario)
  return world
}

export const definitionOf = (id: string): IntegrationDefinition => CATALOG.find(item => item.id === id) as IntegrationDefinition

export const phaseOf = (id: string): IntegrationPhase => {
  const current = integrationsWorld().state[id]
  const definition = definitionOf(id)
  if (!current.installed) return definition.needsNewerApp ? 'needs_newer' : 'not_installed'
  return current.login ? 'connected' : 'needs_token'
}

export const toolsOf = (id: string): ToolCheck[] =>
  definitionOf(id).prerequisites.map(name => ({ name, found: !integrationsWorld().missingTools.has(name) }))

export const wait = (ms: number) => new Promise<void>(done => setTimeout(done, ms))

export class IntegrationActionError extends Error {
  code: string
  constructor(code: string) { super(code); this.code = code }
}

export const scriptedInstall = async (id: string): Promise<void> => {
  const current = integrationsWorld()
  await wait(1800)
  if (current.scenario === 'integrations_install_clash') throw new IntegrationActionError('SKILL_NAME_CLASH')
  current.state[id] = { installed: true, login: null, connectedAt: null }
}

export const scriptedConnect = async (id: string, token: string): Promise<string> => {
  const current = integrationsWorld()
  await wait(1200)
  const value = token.toLowerCase()
  if (/(bad|reject|revoked)/.test(value)) throw new IntegrationActionError('TOKEN_REJECTED')
  if (value.includes('offline')) throw new IntegrationActionError('TOKEN_CHECK_FAILED')
  current.state[id] = { installed: true, login: LOGIN, connectedAt: new Date().toISOString() }
  return LOGIN
}

export const scriptedTest = async (id: string): Promise<string> => {
  const current = integrationsWorld()
  await wait(900)
  if (current.scenario === 'integrations_token_revoked') throw new IntegrationActionError('TOKEN_REJECTED')
  return current.state[id].login ?? LOGIN
}

export const scriptedRemove = async (id: string): Promise<void> => {
  const current = integrationsWorld()
  await wait(500)
  current.state[id] = { installed: true, login: null, connectedAt: null }
}

/** Reading the repository: unreachable until a Retry works (the offline scenario fails the first Retry too). */
export const scriptedRepositoryRead = async (retry: boolean): Promise<'reachable' | 'unreachable'> => {
  const current = integrationsWorld()
  await wait(retry ? 1200 : 700)
  if (current.repository === 'unreachable') {
    if (retry && current.retryFailuresLeft > 0) { current.retryFailuresLeft -= 1; return 'unreachable' }
    if (retry) current.repository = 'reachable'
  }
  return current.repository
}

/**
 * Installing the official repository puts every integration's skill in the skill catalog (the Skills page and the
 * agent skill picker list them) and one managed GitHub source in Skills -> Sources.
 */
export const integrationSkills = (): any[] => {
  const current = integrationsWorld()
  if (!current.ids.some(id => current.state[id].installed)) return []
  return current.ids.filter(id => !definitionOf(id).needsNewerApp).map(id => ({
    __typename: 'Skill', name: definitionOf(id).skillName, description: definitionOf(id).description,
    content: '', rootPath: `/Users/alex/.autobyteus/server-data/skill-sources/github/autobyteus-integrations/g1/${id}`,
    fileCount: 2, isReadonly: true, isDisabled: false,
  }))
}

export const integrationSkillNames = (): string[] => CATALOG.map(item => item.skillName)

export const withIntegrationSource = (name: string, data: any): any => {
  const skills = integrationSkills()
  if (!data || skills.length === 0 || name !== 'GetSkillSources') return data
  return {
    ...data,
    skillSources: [...data.skillSources, {
      __typename: 'SkillSource', sourceId: 'github-autobyteus-integrations', sourceKind: 'GITHUB_REPOSITORY',
      path: '/Users/alex/.autobyteus/server-data/skill-sources/github/github-autobyteus-integrations/g1',
      skillCount: skills.length, isDefault: false,
      github: {
        repositoryUrl: 'https://github.com/AutoByteus/autobyteus-integrations', defaultBranch: 'main',
        installedRevision: '8887475c1d2e3f40a5b6c7d8', latestRevision: '8887475c1d2e3f40a5b6c7d8',
        latestCheckedAt: '2026-10-31T08:00:00.000Z', status: 'UP_TO_DATE', lastError: null,
      },
    }],
  }
}
