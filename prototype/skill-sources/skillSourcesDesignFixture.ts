/**
 * skill-sources-dialog-redesign (design-only layer).
 *
 * Representative synthetic skill sources for the Manage Skill Sources redesign: a mixed list with
 * 0- and 56-skill sources and long paths, every GitHub status, and a long list that scrolls. All
 * names, paths, revisions, counts and messages are invented and illustrative.
 *
 * Scripted outcomes run under the product's own controls (Add folder, Import repository, Check
 * again, Update, Remove, Retry removal). Operations take a short, fixed time so the product's busy
 * states (Checking…, Updating…, Removing…, Working…) are visible. There is no review control.
 *
 * Scenarios (seeded with the existing `autobyteus.prototype.scenario` key, no visible control):
 * - `populated`: the mixed list (7 sources).
 * - `skill_source_issues`: the mixed list plus Update failed and Removal incomplete rows.
 * - `skill_sources_many`: 14 sources, so the list scrolls.
 * - `skill_sources_registry_error`: the mixed list with a registry error.
 *
 * Scripted add/import outcomes (typed into the product's own input):
 * - a local path containing `missing` -> "Directory not found: <path>" (error alert);
 * - a local path already in the list -> "Skill source already exists" (error alert);
 * - a local path containing `duplicate` -> the existing duplicate-skill-name dialog;
 * - a local path containing `empty` -> added with 0 skills; any other path -> added with 4 skills;
 * - a GitHub URL containing `with-warnings` -> imported with one warning.
 */
import { SKILL_SOURCE_MUTATIONS } from '~/prototype/source-observation/fixtures.mjs'

type GitHubStatus = 'NOT_CHECKED' | 'UP_TO_DATE' | 'UPDATE_AVAILABLE' | 'CHECK_FAILED' | 'UPDATE_FAILED' | 'REMOVING'

const checkedAt = '2026-10-09T14:32:00.000Z'
const HOME = '/Users/alex'
const MANAGED = `${HOME}/.autobyteus/server-data/skill-sources/github`

const local = (sourceId: string, path: string, skillCount: number) => ({
  __typename: 'SkillSource', sourceId, sourceKind: 'LOCAL_PATH', path, skillCount, isDefault: false, github: null,
})

const github = (
  sourceId: string, owner: string, repo: string, skillCount: number, status: GitHubStatus,
  installed: string, latest: string | null, lastError: string | null = null, branch = 'main',
) => ({
  __typename: 'SkillSource', sourceId, sourceKind: 'GITHUB_REPOSITORY', path: `${MANAGED}/${sourceId}/g1`, skillCount, isDefault: false,
  github: {
    repositoryUrl: `https://github.com/${owner}/${repo}`, defaultBranch: branch,
    installedRevision: installed, latestRevision: latest, latestCheckedAt: latest ? checkedAt : null, status, lastError,
  },
})

const defaultSource = () => ({
  __typename: 'SkillSource', sourceId: 'default', sourceKind: 'DEFAULT', path: `${HOME}/.autobyteus/server-data/skills`, skillCount: 0, isDefault: true, github: null,
})

const mixedSources = () => [
  defaultSource(),
  local('local-codex', `${HOME}/.codex/skills`, 0),
  local('local-research-library', `${HOME}/Projects/acme-research-platform/shared/agent-tooling/skills-library`, 56),
  local('local-team-skills', `${HOME}/Projects/team-skills`, 7),
  github('github-docs-skills', 'acme-labs', 'docs-skills', 3, 'UP_TO_DATE', '1f2e3d4c5b6a798807162534', '1f2e3d4c5b6a798807162534'),
  github('github-review-skills', 'acme-labs', 'code-review-skills', 12, 'UPDATE_AVAILABLE', '9a8b7c6d5e4f302112030405', 'c0ffee1234abcd5678901234'),
  github('github-legacy-skills', 'old-team', 'legacy-skills', 1, 'CHECK_FAILED', '5e5e5e5e5e5e5e5e5e5e5e5e', null,
    'Could not reach github.com: the request timed out after 30 seconds.'),
]

const issueSources = () => [
  ...mixedSources().filter(source => source.sourceId !== 'github-legacy-skills'),
  github('github-legacy-skills', 'old-team', 'legacy-skills', 1, 'UPDATE_FAILED', '5e5e5e5e5e5e5e5e5e5e5e5e', '6f6f6f6f6f6f6f6f6f6f6f6f',
    'Update contains no valid skills; previous source retained.'),
  github('github-old-skills', 'old-team', 'archived-skills', 0, 'REMOVING', '7a7a7a7a7a7a7a7a7a7a7a7a', null,
    'Removal incomplete: the managed folder is in use by another process.'),
]

const manySources = () => [
  ...mixedSources(),
  local('local-claude', `${HOME}/.claude/skills`, 9),
  local('local-writing', `${HOME}/Documents/writing/skills`, 4),
  local('local-data', `${HOME}/Projects/data-pipeline-tools/skills`, 18),
  local('local-empty-sandbox', `${HOME}/Projects/sandbox/new-skills`, 0),
  github('github-design-skills', 'acme-labs', 'design-review-skills', 6, 'NOT_CHECKED', '2b2b2b2b2b2b2b2b2b2b2b2b', null, null, 'trunk'),
  github('github-ops-skills', 'acme-ops', 'runbook-skills', 21, 'UP_TO_DATE', '3c3c3c3c3c3c3c3c3c3c3c3c', '3c3c3c3c3c3c3c3c3c3c3c3c'),
  local('local-zz', `${HOME}/Workspace/clients/northwind/very-long-client-project-name/agents/skills`, 2),
]

export const DESIGN_SKILL_SOURCE_SCENARIOS = new Set(['populated', 'skill_source_issues', 'skill_sources_many', 'skill_sources_registry_error'])

/** Seeds the in-memory skill-source state for a design scenario (null: keep the baseline fixture). */
export const designSkillSourceData = (scenario: string) => {
  if (!DESIGN_SKILL_SOURCE_SCENARIOS.has(scenario)) return null
  const sources = scenario === 'skill_source_issues' ? issueSources()
    : scenario === 'skill_sources_many' ? manySources() : mixedSources()
  return { sources, seq: 0, designLayer: true }
}

export const designRegistryError = (scenario: string): string | null => scenario === 'skill_sources_registry_error'
  ? `GitHub skill sources unavailable: Error: ${MANAGED}/registry.json is not valid JSON.`
  : null

const delay = (ms: number) => new Promise(done => setTimeout(done, ms))
const LOCAL_LATENCY_MS = 600
const GITHUB_LATENCY_MS = 1400

type MutationResult = { data: any, errors?: any[] } | null

const clone = <T>(value: T): T => structuredClone(value)
const result = (data: any, warnings: string[] = []) => ({ sources: clone(data.sources), warnings })
const failure = (message: string, extensions: Record<string, unknown> = {}) => ({ data: null, errors: [{ message, extensions }] })

/**
 * Scripted skill-source mutation outcomes for the design layer. Returns null for operations the
 * baseline fixture should answer unchanged.
 */
export async function designSkillSourceMutation(name: string, variables: Record<string, any>, state: Record<string, any>): Promise<MutationResult> {
  if (!SKILL_SOURCE_MUTATIONS.has(name)) return null
  const data = state.skillSourceData
  if (!data?.designLayer) return null
  const isGitHub = !['AddSkillSource', 'RemoveSkillSource'].includes(name)
  await delay(isGitHub ? GITHUB_LATENCY_MS : LOCAL_LATENCY_MS)
  const find = (id: string) => data.sources.find((item: any) => item.sourceId === id)
  switch (name) {
    case 'AddSkillSource': {
      const path = String(variables.path || '').trim()
      if (/missing/i.test(path)) return failure(`Directory not found: ${path}`)
      if (data.sources.some((item: any) => item.path === path)) return failure('Skill source already exists')
      if (/duplicate/i.test(path)) {
        return failure('Duplicate skill names', {
          code: 'SKILL_NAME_CONFLICT',
          conflicts: [{ name: 'summarize-paper', existingPath: `${HOME}/Projects/team-skills/summarize-paper`, incomingPath: `${path}/summarize-paper` }],
        })
      }
      data.sources.push(local(`local-added-${++data.seq}`, path, /empty/i.test(path) ? 0 : 4))
      return { data: { addSkillSource: clone(data.sources) } }
    }
    case 'RemoveSkillSource':
      data.sources = data.sources.filter((item: any) => item.path !== variables.path)
      return { data: { removeSkillSource: clone(data.sources) } }
    case 'ImportGitHubSkillSource': {
      const url = String(variables.repositoryUrl || '').trim()
      const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/.exec(url)
      if (!match) return failure('Enter a public GitHub repository root URL, for example https://github.com/owner/repository.')
      const revision = 'ab12cd34ef56ab78cd90ef12'
      data.sources.push(github(`github-imported-${++data.seq}`, match[1]!, match[2]!, 5, 'UP_TO_DATE', revision, revision))
      const warnings = /with-warnings/i.test(url) ? [`Skipped ${match[2]}/drafts/outline-helper: SKILL.md has no name field.`] : []
      return { data: { importGitHubSkillSource: result(data, warnings) } }
    }
    case 'CheckGitHubSkillSourceUpdates':
      // Scripted: each source reports its fixed synthetic status again.
      return { data: { checkGitHubSkillSourceUpdates: result(data) } }
    case 'UpdateGitHubSkillSource': {
      const source = find(variables.sourceId)
      if (source?.github) {
        Object.assign(source.github, {
          installedRevision: source.github.latestRevision || source.github.installedRevision,
          latestCheckedAt: checkedAt, status: 'UP_TO_DATE', lastError: null,
        })
      }
      return { data: { updateGitHubSkillSource: result(data) } }
    }
    case 'RemoveGitHubSkillSource':
      data.sources = data.sources.filter((item: any) => item.sourceId !== variables.sourceId)
      return { data: { removeGitHubSkillSource: result(data) } }
    default:
      return null
  }
}
