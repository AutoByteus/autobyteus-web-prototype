/**
 * integrations-page (design-only layer), revision 2: integrations are imported from a link.
 *
 * Invented, illustrative data for the Integrations page: the integrations a few repositories would contain, the
 * sources imported so far, the tools "found" on this node, and scripted outcomes for Import, Update, Remove, Connect
 * and Test. Nothing is read from GitHub, from a node, or from a real repository; the texts below stand in for each
 * integration's own `integration.json`. There is no built-in repository: the page starts empty.
 *
 * Starting states are seeded with the existing `autobyteus.prototype.scenario` key (no visible control):
 * - `populated` (default): nothing imported; the page shows its empty state.
 * - `integrations_connected`: the GitHub repository imported, GitHub connected as @alex-dev.
 * - `integrations_several`: two sources: GitHub (connected) and an ops repository with SSH (needs a token) and Jira
 *   (needs a newer AutoByteus).
 * - `integrations_tool_missing`: GitHub imported, needs a token; `jq` is not found.
 * - `integrations_token_revoked`: GitHub connected; Test is refused by GitHub.
 * - `integrations_update_available`: GitHub connected; its source has an update.
 * - `integrations_update_offline`: as above, and Update cannot reach GitHub.
 *
 * - `integrations_local_folder`: GitHub (connected) from the official repository, and SSH from a local folder
 *   `/Users/alex/Projects/my-integrations` (needs a token).
 *
 * Scripted outcomes under the product's own controls (typed into the Import field: a GitHub repository link, or the
 * full path of a folder):
 * - neither a GitHub link nor an absolute path -> "Enter a GitHub repository link or the full path of a folder.";
 * - a link or path containing `empty` -> "No integrations in this repository/folder" (nothing imported);
 * - a link or path containing `clash`, or one whose integration is already imported from another source -> the
 *   skill-name clash error;
 * - a link containing `offline` -> "Could not reach GitHub" with the reason;
 * - a path containing `missing` -> "Directory not found: <path>";
 * - a link or path already imported -> "This repository/folder is already imported …";
 * - a link containing `ops` -> imports the SSH and Jira integrations;
 * - any other GitHub link -> imports the GitHub integration; any other folder -> imports the SSH integration.
 *
 * Scripted outcomes typed into the token field: a token containing `bad`, `reject` or `revoked` -> "GitHub rejected
 * the token."; containing `offline` -> "The token could not be checked with GitHub. Try again."; any other
 * non-empty token -> Connected as @alex-dev.
 */
export type IntegrationPhase = 'needs_token' | 'connected' | 'needs_newer'

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

export interface ToolCheck { tool: string; found: boolean }

export type SourceStatus = 'UP_TO_DATE' | 'UPDATE_AVAILABLE'

export interface ImportedSource {
  sourceId: string
  kind: 'github' | 'local'
  /** `owner/repository`, or the folder's name */
  name: string
  /** The repository link, or the folder path. */
  repositoryUrl: string
  integrationIds: string[]
  /** Skills in the whole source: the integrations' skills plus any other skill the repository holds. */
  skillCount: number
  skillNames: string[]
  status: SourceStatus
  installedRevision: string
  latestRevision: string | null
}

export interface IntegrationState {
  login: string | null
  connectedAt: string | null
}

export interface IntegrationsWorld {
  scenario: string
  sources: ImportedSource[]
  state: Record<string, IntegrationState>
  missingTools: Set<string>
  updateOffline: boolean
}

export const OFFICIAL_URL = 'https://github.com/AutoByteus/autobyteus-integrations'
const OPS_URL = 'https://github.com/acme-labs/ops-integrations'

const officialSource = (status: SourceStatus = 'UP_TO_DATE'): ImportedSource => ({
  sourceId: 'github-autobyteus-integrations',
  kind: 'github',
  name: 'AutoByteus/autobyteus-integrations',
  repositoryUrl: OFFICIAL_URL,
  integrationIds: ['github'],
  skillCount: 1,
  skillNames: ['github-integration'],
  status,
  installedRevision: '8887475c1d2e3f40a5b6c7d8',
  latestRevision: status === 'UPDATE_AVAILABLE' ? 'b41c9e07a2d3f5681790ab12' : '8887475c1d2e3f40a5b6c7d8',
})

const opsSource = (): ImportedSource => ({
  sourceId: 'github-acme-labs-ops-integrations',
  kind: 'github',
  name: 'acme-labs/ops-integrations',
  repositoryUrl: OPS_URL,
  integrationIds: ['jira', 'ssh'],
  skillCount: 3,
  skillNames: ['jira-integration', 'ssh-integration', 'ops-runbook-style'],
  status: 'UP_TO_DATE',
  installedRevision: '5c0de1f2a3b4c5d6e7f80912',
  latestRevision: '5c0de1f2a3b4c5d6e7f80912',
})

export const LOCAL_FOLDER = '/Users/alex/Projects/my-integrations'

const localSource = (path = LOCAL_FOLDER): ImportedSource => ({
  sourceId: `local-${path.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}`,
  kind: 'local',
  name: path.split(/[\\/]+/).filter(Boolean).at(-1) ?? path,
  repositoryUrl: path,
  integrationIds: ['ssh'],
  skillCount: 1,
  skillNames: ['ssh-integration'],
  status: 'UP_TO_DATE',
  installedRevision: '',
  latestRevision: null,
})

const fresh = (): IntegrationState => ({ login: null, connectedAt: null })
const connected = (at: string): IntegrationState => ({ login: LOGIN, connectedAt: at })

const scenarioKey = (): string => {
  try { return localStorage.getItem('autobyteus.prototype.scenario') || 'populated' } catch { return 'populated' }
}

const build = (scenario: string): IntegrationsWorld => {
  const world: IntegrationsWorld = {
    scenario,
    sources: [],
    state: { github: fresh(), jira: fresh(), ssh: fresh() },
    missingTools: new Set(),
    updateOffline: false,
  }
  const at = '2026-10-24T09:12:00.000Z'
  if (['integrations_connected', 'integrations_token_revoked', 'integrations_several', 'integrations_local_folder', 'integrations_update_available', 'integrations_update_offline'].includes(scenario)) {
    world.sources = [officialSource(scenario.startsWith('integrations_update') ? 'UPDATE_AVAILABLE' : 'UP_TO_DATE')]
    world.state.github = connected(at)
  }
  if (scenario === 'integrations_several') world.sources.push(opsSource())
  if (scenario === 'integrations_local_folder') {
    world.sources = [officialSource(), localSource()]
    world.state.github = connected(at)
  }
  if (scenario === 'integrations_tool_missing') {
    world.sources = [officialSource()]
    world.missingTools.add('jq')
  }
  if (scenario === 'integrations_update_offline') world.updateOffline = true
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

export const importedIds = (): string[] => integrationsWorld().sources.flatMap(source => source.integrationIds)

export const sourceOf = (id: string): ImportedSource | undefined =>
  integrationsWorld().sources.find(source => source.integrationIds.includes(id))

export const phaseOf = (id: string): IntegrationPhase => {
  const definition = definitionOf(id)
  if (definition.needsNewerApp) return 'needs_newer'
  return integrationsWorld().state[id].login ? 'connected' : 'needs_token'
}

export const toolsOf = (id: string): ToolCheck[] =>
  definitionOf(id).prerequisites.map(tool => ({ tool, found: !integrationsWorld().missingTools.has(tool) }))

export const wait = (ms: number) => new Promise<void>(done => setTimeout(done, ms))

export class IntegrationActionError extends Error {
  code: string
  detail: string
  constructor(code: string, detail = '') { super(code); this.code = code; this.detail = detail }
}

const GITHUB_REPOSITORY = /^\s*(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?\s*$/i
const LOOKS_LIKE_LINK = /^\s*(https?:\/\/|www\.|github\.com\/)/i
const ABSOLUTE_PATH = /^\s*(\/|~\/|[A-Za-z]:[\\/])/

export interface ImportResult { source: ImportedSource; added: string[] }

/** Import a GitHub repository link (downloaded) or a folder path (used where it is) as a skill source. */
export const scriptedImport = async (input: string): Promise<ImportResult> => {
  const current = integrationsWorld()
  const link = LOOKS_LIKE_LINK.test(input)
  const match = link ? GITHUB_REPOSITORY.exec(input) : null
  if (link ? !match : !ABSOLUTE_PATH.test(input)) throw new IntegrationActionError(link ? 'NOT_A_REPOSITORY' : 'NOT_A_LOCATION')
  const location = match ? `https://github.com/${match[1]}/${match[2]}` : input.trim().replace(/[\\/]+$/, '')
  const lowered = location.toLowerCase()
  const kind = match ? 'github' : 'local'
  await wait(match ? 1500 : 700)
  if (current.sources.some(source => source.repositoryUrl.toLowerCase() === lowered)) throw new IntegrationActionError('ALREADY_IMPORTED', kind)
  if (lowered.includes('offline') && match) throw new IntegrationActionError('GITHUB_UNREACHABLE', 'the request timed out after 30 seconds')
  if (lowered.includes('missing') && !match) throw new IntegrationActionError('FOLDER_NOT_FOUND', location)
  if (lowered.includes('empty')) throw new IntegrationActionError('NO_INTEGRATIONS', kind)
  const base = match ? (lowered.includes('ops') ? opsSource() : officialSource()) : localSource(location)
  // An integration whose skill already exists in another source clashes with it.
  const clashing = base.integrationIds.find(id => importedIds().includes(id))
  if (lowered.includes('clash') || clashing) throw new IntegrationActionError('SKILL_NAME_CLASH', definitionOf(clashing ?? base.integrationIds[0]).skillName)
  const source: ImportedSource = match
    ? { ...base, sourceId: `github-${match[1]}-${match[2]}`.toLowerCase(), name: `${match[1]}/${match[2]}`, repositoryUrl: location }
    : base
  current.sources = [...current.sources, source]
  return { source, added: source.integrationIds }
}

export const scriptedUpdate = async (sourceId: string): Promise<void> => {
  const current = integrationsWorld()
  await wait(1500)
  if (current.updateOffline) throw new IntegrationActionError('GITHUB_UNREACHABLE', 'the request timed out after 30 seconds')
  current.sources = current.sources.map(source => (source.sourceId === sourceId
    ? { ...source, status: 'UP_TO_DATE' as const, installedRevision: source.latestRevision ?? source.installedRevision }
    : source))
}

/** Remove the whole source and its skills. */
export const scriptedRemoveSource = async (sourceId: string): Promise<void> => {
  const current = integrationsWorld()
  await wait(800)
  const gone = current.sources.find(source => source.sourceId === sourceId)
  current.sources = current.sources.filter(source => source.sourceId !== sourceId)
  for (const id of gone?.integrationIds ?? []) current.state[id] = fresh()
}

export const scriptedConnect = async (id: string, token: string): Promise<string> => {
  const current = integrationsWorld()
  await wait(1200)
  const value = token.toLowerCase()
  if (/(bad|reject|revoked)/.test(value)) throw new IntegrationActionError('TOKEN_REJECTED')
  if (value.includes('offline')) throw new IntegrationActionError('TOKEN_CHECK_FAILED')
  current.state[id] = { login: LOGIN, connectedAt: new Date().toISOString() }
  return LOGIN
}

export const scriptedTest = async (id: string): Promise<string> => {
  const current = integrationsWorld()
  await wait(900)
  if (current.scenario === 'integrations_token_revoked') throw new IntegrationActionError('TOKEN_REJECTED')
  return current.state[id].login ?? LOGIN
}

export const scriptedRemoveToken = async (id: string): Promise<void> => {
  const current = integrationsWorld()
  await wait(500)
  current.state[id] = fresh()
}

/**
 * Importing puts every skill of the source in the skill catalog (the Skills page and the agent skill picker list
 * them) and one managed GitHub source in Skills -> Sources.
 */
export const integrationSkills = (): any[] => integrationsWorld().sources.flatMap(source =>
  source.skillNames.map(name => {
    const integration = CATALOG.find(item => item.skillName === name)
    return {
      __typename: 'Skill', name, description: integration?.description ?? 'Style notes for runbooks agents write after an operation.',
      content: '', rootPath: source.kind === 'local' ? `${source.repositoryUrl}/${name}` : `/Users/alex/.autobyteus/server-data/skill-sources/github/${source.sourceId}/g1/${name}`,
      fileCount: 2, isReadonly: true, isDisabled: false,
    }
  }))

export const integrationSkillNames = (): string[] => [...CATALOG.map(item => item.skillName), 'ops-runbook-style']

/** The imported integration a skill belongs to (the Skills page marks it), or null for any other skill. */
export const integrationIdForSkill = (skillName: string): string | null => {
  const found = CATALOG.find(item => item.skillName === skillName)
  return found && importedIds().includes(found.id) ? found.id : null
}

const sourceEntries = (): any[] => integrationsWorld().sources.map(source => ({
  __typename: 'SkillSource', sourceId: source.sourceId, sourceKind: source.kind === 'local' ? 'LOCAL_PATH' : 'GITHUB_REPOSITORY',
  path: source.kind === 'local' ? source.repositoryUrl : `/Users/alex/.autobyteus/server-data/skill-sources/github/${source.sourceId}/g1`,
  skillCount: source.skillCount, isDefault: false,
  github: source.kind === 'local' ? null : {
    repositoryUrl: source.repositoryUrl, defaultBranch: 'main',
    installedRevision: source.installedRevision, latestRevision: source.latestRevision,
    latestCheckedAt: '2026-11-01T08:00:00.000Z', status: source.status, lastError: null,
  },
}))

/**
 * Skill-source mutations on the Skills page answer with the whole list: it carries the imported integration sources
 * too, and removing one there removes it from the Integrations page (and its connection) as well.
 */
export const withIntegrationSourceInMutation = (name: string, variables: Record<string, any>, answer: any): any => {
  if (!answer?.data) return answer
  if (name === 'RemoveGitHubSkillSource' || name === 'RemoveSkillSource') {
    const current = integrationsWorld()
    const gone = current.sources.find(source => (name === 'RemoveSkillSource' ? source.repositoryUrl === variables.path : source.sourceId === variables.sourceId))
    if (gone) {
      current.sources = current.sources.filter(source => source !== gone)
      for (const id of gone.integrationIds) current.state[id] = { login: null, connectedAt: null }
    }
  }
  const extra = sourceEntries()
  const merge = (list: any[]) => [...list.filter(entry => !extra.some(item => item.sourceId === entry.sourceId)), ...extra]
  const data: Record<string, any> = {}
  for (const [key, value] of Object.entries(answer.data)) {
    if (Array.isArray(value) && value.every((entry: any) => entry?.__typename === 'SkillSource')) data[key] = merge(value)
    else if ((value as any)?.sources && Array.isArray((value as any).sources)) data[key] = { ...(value as any), sources: merge((value as any).sources) }
    else data[key] = value
  }
  return { ...answer, data }
}

export const withIntegrationSource = (name: string, data: any): any => {
  if (!data || integrationsWorld().sources.length === 0 || name !== 'GetSkillSources') return data
  return { ...data, skillSources: [...data.skillSources, ...sourceEntries()] }
}
