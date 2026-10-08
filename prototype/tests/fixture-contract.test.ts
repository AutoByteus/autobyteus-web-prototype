import { describe, expect, it } from 'vitest'
import runtimeFixture from '../fixtures/runtime-state.json'
import {
  baseState,
  exposedFixtures,
  fixtureContext,
  operationFixture,
  scenarioCatalog,
} from '../source-observation/fixtures.mjs'

const snapshots = runtimeFixture.snapshots as Record<string, {
  item: { scenario: string, path: string, mobile?: string }
  state: Record<string, any>
}>

describe('deterministic prototype fixture contract', () => {
  it('is pinned to the selected source and covers every recorded scenario', () => {
    expect(runtimeFixture.sourceCommit).toBe('1cd1a3abc126df820e334c023621d0fb82de5b7b')
    expect(Object.keys(snapshots)).toHaveLength(72)
    expect(new Set(Object.values(snapshots).map(value => value.item.scenario))).toEqual(new Set(['populated', 'empty', 'apps_disabled', 'loading', 'error', 'permission_denied', 'skill_name_issues', 'agy_runtime']))
  })

  it('uses synthetic domain records and local-only node addresses', () => {
    const serialized = JSON.stringify(runtimeFixture)
    expect(serialized).toContain('Synthetic local agent')
    expect(serialized).toContain('/synthetic/prototype-workspace')
    expect(serialized).not.toMatch(/sk-[A-Za-z0-9_-]{12,}/)
    const nodeUrls = Object.values(snapshots).flatMap(snapshot => [
      snapshot.state.windowNodeContext?.nodeBaseUrl,
      ...((snapshot.state.nodeStore?.nodes || []).map((node: { baseUrl?: string }) => node.baseUrl)),
    ]).filter((value): value is string => Boolean(value))
    expect(nodeUrls.length).toBeGreaterThan(0)
    expect(nodeUrls.every(url => /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(url))).toBe(true)
  })

  it('represents host and access contexts as browser-selectable state', () => {
    expect(Object.keys(snapshots).some(key => key.startsWith('apps_disabled|desktop|'))).toBe(true)
    expect(Object.keys(snapshots)).toContain('populated|paired|/mobile')
    expect(Object.keys(snapshots)).toContain('populated|unpaired|/mobile')
    expect(Object.keys(snapshots)).toContain('permission_denied|paired|/mobile')
    expect(Object.keys(snapshots)).toContain('populated|desktop|/chat')
    expect(Object.keys(snapshots)).toContain('skill_name_issues|desktop|/skills')
  })

  it('keeps Project and Task saves in one resettable in-memory copy (0a32261, 9dad89b)', () => {
    const state = baseState()
    const created = operationFixture('CreateProject', { input: { name: 'Launch Review', description: '', workspaces: [{ workspaceRootPath: '/synthetic/prototype-workspace', description: 'Primary' }, { workspaceRootPath: '/synthetic/elsewhere', description: '' }] } }, state)
    expect(created.createProject).toMatchObject({ name: 'Launch Review', taskCount: 0, openTaskCount: 0 })
    expect(created.createProject.workspaces.map((link: { displayName: string, availability: string }) => [link.displayName, link.availability]))
      .toEqual([['prototype-workspace', 'AVAILABLE'], ['elsewhere', 'UNREGISTERED']])
    expect(operationFixture('CreateProject', { input: { name: 'Relative', description: '', workspaces: [{ workspaceRootPath: 'relative/path', description: '' }] } }, state).__projectError.extensions.code).toBe('WORKSPACE_PATH_INVALID')
    expect(operationFixture('CreateProject', { input: { name: 'prototype launch', description: '' } }, state).__projectError.extensions.code).toBe('PROJECT_NAME_TAKEN')
    const task = operationFixture('CreateProjectTask', { input: { projectId: 'project-prototype-launch', description: 'Draft notes.' } }, state).createProjectTask
    expect(task).toMatchObject({ status: 'TODO', contextFiles: [], root: null })
    expect(operationFixture('GetProjects', {}, state).projects.find((item: { projectId: string }) => item.projectId === 'project-prototype-launch')).toMatchObject({ taskCount: 5, openTaskCount: 4 })
    expect(operationFixture('GetProjects', {}, baseState()).projects).toHaveLength(1)
  })

  it('covers every Task root state and the Temp tasks (4d469b0)', () => {
    const tasks = operationFixture('GetProjectTasks', { projectId: 'project-prototype-launch' }, baseState()).projectTasks
    expect(tasks.map((task: { root: null | { start: string, closed: boolean, status: string } }) => task.root && [task.root.start, task.root.closed, task.root.status]))
      .toEqual([null, ['started', false, 'running'], ['failed', false, 'offline'], ['started', true, 'offline']])
    expect(operationFixture('GetTasksWithoutProject', {}, baseState()).tasksWithoutProject.map((task: { taskId: string }) => task.taskId))
      .toEqual(['temp-task-links', 'temp-task-check'])
    expect(operationFixture('GetTasksWithoutProject', {}, { ...baseState(), scenario: 'empty' }).tasksWithoutProject).toEqual([])
  })

  it('keeps skill-source operations in one resettable in-memory copy (4dee901)', () => {
    const state = baseState()
    expect(operationFixture('GetSkillSources', {}, state).skillSources.map((source: { sourceKind: string }) => source.sourceKind))
      .toEqual(['DEFAULT', 'LOCAL_PATH', 'GITHUB_REPOSITORY', 'GITHUB_REPOSITORY', 'GITHUB_REPOSITORY'])
    const imported = operationFixture('ImportGitHubSkillSource', { repositoryUrl: 'https://github.com/acme/launch-skills' }, state)
    expect(imported.importGitHubSkillSource.sources.at(-1).github).toMatchObject({ repositoryUrl: 'https://github.com/acme/launch-skills', status: 'UP_TO_DATE' })
    expect(operationFixture('ImportGitHubSkillSource', { repositoryUrl: 'not a repository' }, state).__projectError.extensions.code).toBe('INVALID_GITHUB_REPOSITORY_URL')
    const updated = operationFixture('UpdateGitHubSkillSource', { sourceId: 'github-review-skills' }, state)
    expect(updated.updateGitHubSkillSource.sources.find((source: { sourceId: string }) => source.sourceId === 'github-review-skills').github.status).toBe('UP_TO_DATE')
    expect(operationFixture('GetSkillSources', {}, { ...baseState(), scenario: 'skill_source_issues' }).skillSources.map((source: { github: { status: string } | null }) => source.github?.status ?? null))
      .toEqual([null, null, 'UP_TO_DATE', 'UPDATE_AVAILABLE', 'UPDATE_FAILED', 'REMOVING'])
  })

  it('uses the captured source loading frame with unresolved capabilities', () => {
    const loading = snapshots['loading|desktop|/agents?view=list']
    expect(loading.state.server.status).toBe('running')
    expect(loading.state.applicationsCapability).toEqual({ capability: null, status: 'loading', error: null })
    expect(loading.state.agentDefinition.agentDefinitions).toHaveLength(0)
  })

  it('defines an isolated source-observation fixture for the catalog Team launch journey', () => {
    expect(scenarioCatalog.team_launch).toContain('deterministic newly launched Team execution')

    const state = { ...baseState(), scenario: 'team_launch' }
    const context = fixtureContext(state)
    expect(context.workspaces).toEqual([
      expect.objectContaining({
        workspaceId: 'workspace-prototype',
        workspaceRootPath: '/synthetic/prototype-workspace',
        kind: 'filesystem',
      }),
      expect.objectContaining({ workspaceId: 'temp_ws_default', isTemp: true }),
    ])

    expect(operationFixture('ListWorkspaceRunHistory', {}, state)).toEqual({ listWorkspaceRunHistory: [] })

    const create = operationFixture('CreateAgentTeamRun', { input: {} }, state).createAgentTeamRun
    expect(create).toEqual(expect.objectContaining({
      __typename: 'CreateAgentTeamRunResult',
      success: true,
      teamRunId: 'team-run-created-fixture',
    }))

    const resume = operationFixture('GetTeamRunResumeConfig', { teamRunId: create.teamRunId }, state).getTeamRunResumeConfig
    expect(resume).toEqual(expect.objectContaining({
      teamRunId: 'team-run-created-fixture',
      isActive: true,
      executionTree: exposedFixtures.createdTeamExecutionTree,
    }))
    expect(resume.executionTree.root_team.members.map((member: { address: string, agent_run_id: string }) => [member.address, member.agent_run_id])).toEqual([
      ['/researcher', 'team-member-researcher-created'],
      ['/writer', 'team-member-writer-created'],
    ])
  })
})
