import runtimeFixture from '~/prototype/fixtures/runtime-state.json'
import type { Pinia, PiniaPluginContext } from 'pinia'
import type { Router } from 'vue-router'
import { addCollection } from '@iconify/vue'
import monacoLoader from '@monaco-editor/loader'
import iconCollections from '~/prototype/fixtures/icon-collections.json'
import { defineNuxtPlugin } from '#app'
import { installHostScenario } from '~/prototype/shared/install-host-scenario.js'
import { applyExperienceScenario } from '~/prototype/shared/apply-experience-scenario.js'
import { applicationAvailableExecutionResources, applicationLaunchConfigurationView, taskContextUpload } from '~/prototype/source-observation/fixtures.mjs'
import { localFixtureState } from '~/utils/apolloClient'

const SCENARIO_KEY = 'autobyteus.prototype.scenario'
const CONTEXT_KEY = 'autobyteus.prototype.context'
const DEFAULT_SCENARIO = 'populated'
const DEFAULT_CONTEXT = 'desktop'
const navigationOverlayStores = new Set(['agentRunConfig', 'agentSelection', 'teamRunConfig'])
// Projects and Tasks (0a32261) run the source's own stores unchanged: reads and
// saves are answered by utils/apolloClient.ts from the local fixtures, and
// their client cache is never reset by route snapshots. Skill sources and the
// Token tab's run meter (4dee901) run the same way, so every run kind reads its
// usage summary exactly as the source does against the same fixtures.
const sourceLoadedStores = new Set(['projects', 'projectTasks', 'skillSources', 'tokenUsageMeter'])

const localActions: Record<string, Set<string>> = {
  appFontSize: new Set(['initialize', 'setPreset', 'resetToDefault']),
  appLayout: new Set(['toggleMobileMenu', 'closeMobileMenu', 'openMobileMenu', 'setHostShellPresentation', 'resetHostShellPresentation']),
  activeContext: new Set(['addContextFilePath', 'removeContextFilePath', 'clearContextFilePaths']),
  agentRunConfig: new Set(['setTemplate', 'setAgentConfig', 'updateAgentConfig', 'setWorkspaceLoading', 'setWorkspaceLoaded', 'setWorkspaceError', 'clearWorkspaceState', 'collapsePanel', 'expandPanel', 'togglePanel', 'markFirstMessageSent', 'clearConfig']),
  agentSelection: new Set(['beginSelectionIntent', 'invalidateSelectionIntent', 'setRunSelection', 'setTeamDraftSelection', 'clearRunSelection', 'promoteTeamDraftLaunch', 'selectRunWithoutShellNavigation', 'selectTeamDraftWithoutShellNavigation', 'clearSelectionWithoutShellNavigation', 'selectRun', 'selectTeamDraft', 'clearSelection']),
  // Background Tasks (Activity tab) are live-only in the source: each stream
  // snapshot upserts one task. The prototype applies the same upsert locally.
  agentBackgroundTask: new Set(['upsertTask']),
  agentTeamContexts: new Set(['addTeamContext', 'replaceTeamContext', 'removeTeamContext', 'focusMember']),
  teamRunConfig: new Set([
    'createDraft', 'setTemplate', 'setConfig', 'applyConfigEdit',
    'applyTeamWorkspaceAuthoringCommand', 'reconcileSelectedDraftTopology',
    'clearRepairNotice', 'focusMember', 'setPendingInput', 'removeDraft',
    'selectDraft', 'replaceSelectedDraft', 'replacePreparedDraft',
    'markWorkspacePreparationFailed', 'prepareSelectedDraftWorkspaces',
    'admitDraftLaunch', 'completeDraftLaunch', 'releaseDraftLaunch',
    'setRuntimeModelCatalogLoading', 'setRuntimeModelCatalog',
    'setRuntimeModelCatalogError', 'clearConfig',
    // Accepted prototype compatibility actions retained outside the refreshed
    // current-source launch boundary.
    'setWorkspaceLoading', 'setWorkspaceLoaded', 'setWorkspaceError',
    'clearWorkspaceState', 'collapsePanel', 'expandPanel', 'togglePanel',
    'markFirstMessageSent',
  ]),
  workspaceCenterView: new Set(['showChat', 'showConfig']),
  // A Team launch runs the current source's own draft planning and hydration;
  // utils/apolloClient.ts answers its create mutation and reads locally with a
  // deterministic created TeamRun.
  agentTeamRun: new Set(['launchDraft', 'hydrateRun']),
  // A Chat first send runs the current source's own send path: the prepare
  // mutation is answered locally (utils/apolloClient.ts) and the stream is the
  // local PrototypeWebSocket, so the chat run view opens exactly as in the source.
  agentRun: new Set(['sendUserInputAndSubscribe', 'ensureAgentStreamConnected']),
  contextFileUpload: new Set(['finalizeDraftAttachments']),
  // Run settings (Edit Config) for an agent or Team run read the resume config
  // and model options through the source's own code and the local adapter.
  existingRunConfig: new Set(['loadAgentCanonical', 'loadTeamCanonical', 'refreshModelOptions']),
  uiError: new Set(['push', 'remove', 'clear', 'toggle', 'open', 'close']),
  mobileWork: new Set(['selectContext', 'setActiveTab', 'requestRunSetup', 'consumeRunSetupIntent', 'requestFilePreview', 'consumeFilePreviewRequest', 'addDraftContextAttachment', 'removeDraftContextAttachment', 'clearDraftContextAttachments', 'consumeDraftContextAttachments', 'getPendingTeamRunAttachments', 'hasPendingTeamRunAttachments', 'addPendingTeamRunAttachment', 'moveDraftAttachmentsToPendingTeamRun', 'removePendingTeamRunAttachment', 'clearPendingTeamRunAttachments', 'consumePendingTeamRunAttachments', 'rememberFocusedTeamMember', 'getRememberedFocusedTeamMember', 'updateFocusedTeamMember', 'clearContext']),
  memoryExplorerStore: new Set(['setSelectedSourceByKey', 'setHomeTab', 'setSelectedAgentFromRoute', 'setSelectedTeamFromRoute', 'setAgentsSearch', 'setTeamsSearch', 'setAgentRunsSearch', 'setTeamRunsSearch', 'changeAgentRunsPage', 'changeTeamRunsPage', 'changeHomePage', 'resetPagesForSourceChange', 'clearSelections']),
  memoryInspectorStore: new Set(['setActiveTab', 'setRawTraceLimit', 'setRawTraceFileName', 'buildVariables', 'clear']),
  tokenUsageAnalytics: new Set(['setPreset', 'clearFilters', 'fetch']),
  tokenUsageRunStatistics: new Set(['fetchStatistics']),
  mediaLibrary: new Set(['setCategory', 'changePage']),
  // Synchronous catalog reads and local projection helpers used directly by
  // current source presentation (for example the media default-model card).
  llmProviderConfig: new Set(['providerGroups', 'applyProviderSnapshotLocal', 'applyCredentialSetting', 'resetCatalogState']),
  messagingSetupNavigationStore: new Set(['selectedStepForProvider', 'setSelectedStep', 'clearSelectedStep']),
  messagingProviderScopeStore: new Set(['applyManagedAccountHints', 'setSelectedProvider']),
  messagingVerificationStore: new Set(['resetVerificationChecks', 'setVerificationCheckStatusForProvider', 'setVerificationResultForProvider', 'clearVerificationResultForProvider', 'resetAllProviderVerificationStates']),
  skill: new Set(['setCurrentSkill', 'clearError']),
  // D-19 skill-name checks run as in the source: issue reads resolve locally
  // (utils/apolloClient.ts) and the wrapped import action stays stubbed.
  skillNames: new Set(['fetchIssues', 'runWithSkillNameChecks']),
  application: new Set(['clearError']),
  applicationPackages: new Set(['clearError']),
  agentPackages: new Set(['isPackageActionLoading', 'clearError']),
  toolManagement: new Set(['clearError', 'clearPreviewResult']),
  agentDefinition: new Set(['clearDeleteResult', 'invalidateAgentDefinitions']),
  nodeStore: new Set(['replaceSnapshot', 'persistSnapshotToLocalStorage', 'persistCurrentSnapshotToLocalStorage', 'applyRegistrySnapshot', 'ensureBrowserEmbeddedNodePresent', 'initializeRegistry', 'getNodeById', 'getNodeBaseUrl', 'upsertRegistry', 'addRemoteNode', 'removeRemoteNode', 'renameNode', 'teardownRegistryListener']),
  windowNodeContext: new Set(['initializeFromWindowContext', 'bindNodeContext', 'getBoundEndpoints', 'waitForBoundBackendReady']),
  server: new Set(['initialize', 'waitForServerReady', 'handleElectronServerInitialization', 'handleBrowserServerConnection', 'attemptServerConnection', 'updateServerStatus', 'restartServer', 'resetServerDataAndRestart', 'checkServerHealth']),
  appUpdate: new Set(['initialize', 'checkForUpdates', 'downloadUpdate', 'installUpdateAndRestart', 'dismissNotice', 'applyRemoteState']),
  extensions: new Set(['startInstallPolling', 'stopInstallPolling', 'refreshInstallState', 'applyRemoteState', 'updateLocalExtension', 'initialize', 'installExtension', 'enableExtension', 'disableExtension', 'updateVoiceInputSettings', 'updateVoiceInputLanguageMode', 'updateVoiceInputAudioInputDevice', 'removeExtension', 'reinstallExtension', 'openExtensionFolder']),
  voiceInput: new Set(['setLatestResult', 'clearLatestResult', 'clearCaptureWatchdog', 'armCaptureWatchdog', 'handleCaptureStartupTimeout', 'initialize', 'queryMicrophonePermission', 'registerMediaDeviceListener', 'refreshAudioInputDevices', 'startRecording', 'stopRecording', 'cancelOperationForSource', 'cleanup']),
  browserShell: new Set(['initialize', 'openTab', 'navigateTab', 'reloadTab', 'focusSession', 'setActiveSession', 'updateHostBounds', 'setDeviceEmulation', 'closeSession']),
  agentContexts: new Set(['createRunFromTemplate', 'removeRun', 'lockConfig', 'promoteTemporaryId', 'upsertProjectionContext', 'patchConfigOnly']),
  fileExplorer: new Set([
    '_getOrCreateWorkspaceState',
    'toggleFolder',
    'openFile',
    'openFilePreview',
    '_openFileWithMode',
    'setActiveFile',
    'setFileMode',
    'closeFile',
    'closeAllFiles',
    'closeOtherFiles',
    'navigateToNextTab',
    'navigateToPreviousTab',
  ]),
  runFileChanges: new Set(['replaceRunProjection', 'mergeRunProjection', 'upsertFromLivePayload', 'clearRun']),
  // Opening a stored run executes the current source's own open/hydration
  // actions; their GraphQL reads are answered locally by utils/apolloClient.ts
  // from the same deterministic fixtures used for source observation.
  runHistory: new Set([
    'applyRunNavigationTeamFocus', 'focusTeamMemberAndEnsureHydrated', 'selectTreeRun',
    'openRun', 'openTeamMemberRun', 'inspectTeamMember', 'getTeamMemberInspectionAttempt',
    'reconcileFocusedTeamMemberProjection', 'refreshRunNavigationTopology', 'applyRunNavigationEffect',
    'ensureWorkspaceByRootPath', 'resolveWorkspaceMetadataByRootPath', 'markRunAsActive', 'markRunAsInactive',
    'reconcileActiveRunIds', 'applyAgentOrgActivity', 'markTeamAsActive', 'markTeamAsInactive',
    'reconcileActiveTeamRunIds', 'refreshAgentResumeConfig', 'refreshTeamResumeConfig',
    'refreshTreeQuietly',
  ]),
  // Projects (0a32261): a new-workspace row creates its workspace through the
  // source's own action; utils/apolloClient.ts answers CreateWorkspace locally.
  workspace: new Set(['createWorkspace', 'registerSkillWorkspace', 'acquireFileExplorerLiveSession', 'releaseFileExplorerLiveSession', 'clearFileExplorerLiveSessionForWorkspace', 'connectFileExplorerLiveStream', 'disconnectFileExplorerLiveStream', 'disconnectAllFileExplorerLiveStreams', 'refreshFileExplorerSnapshot', 'fetchFolderChildren']),
}

type RuntimeSnapshot = { item: { path: string, scenario: string, mobile?: string }, actualPath: string, state: Record<string, any>, primaryNavHeight?: string | null, bootstrapPending?: boolean }
type PrototypePinia = Pinia & { _s: Map<string, any> }
const snapshots = runtimeFixture.snapshots as Record<string, RuntimeSnapshot>

const clone = <T>(value: T): T => {
  if (value instanceof Map) {
    return new Map(Array.from(value.entries(), ([key, entry]) => [clone(key), clone(entry)])) as T
  }
  if (value instanceof Set) return new Set(Array.from(value, clone)) as T
  if (value instanceof Date) return new Date(value.getTime()) as T
  if (Array.isArray(value)) return value.map(clone) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, clone(entry)])) as T
  }
  return value
}
const readyStoreState = (storeId: string, ready: (state: Record<string, any>) => boolean): Record<string, any> | undefined =>
  Object.values(snapshots).find(snapshot => snapshot.item.scenario === 'populated' && snapshot.state?.[storeId] && ready(snapshot.state[storeId]))?.state?.[storeId]
const canonicalPath = (value: string): string => {
  const url = new URL(value, window.location.origin)
  return `${url.pathname}${url.searchParams.size ? `?${url.searchParams.toString()}` : ''}`
}
const normalizePath = (): string => canonicalPath(`${window.location.pathname}${window.location.search}`)
const defaultRouteAliases: Record<string, string> = {
  '/agents': '/agents?view=list',
  '/agent-teams': '/agent-teams?view=team-list',
  '/agent-orgs': '/agent-orgs?view=org-list',
  '/memory': '/memory?view=home&tab=agents',
  '/nodes': '/nodes?tab=manage',
}
type AgentOrgRuntimeRoute = {
  scenario: string
  phase: 'config' | 'active'
}

type AgentTeamRuntimeRoute = {
  scenario: string
  phase: 'config' | 'active'
}

const agentOrgRuntimeRoute = (): AgentOrgRuntimeRoute | null => {
  if (window.location.pathname !== '/workspace') return null
  const query = new URLSearchParams(window.location.search)
  if (query.get('root') !== 'org') return null
  const phase = query.get('phase') === 'active' ? 'active' : 'config'
  return {
    phase,
    scenario: `workspace_agent_org_${phase}`,
  }
}

const agentTeamRuntimeRoute = (): AgentTeamRuntimeRoute | null => {
  if (window.location.pathname !== '/workspace') return null
  const query = new URLSearchParams(window.location.search)
  if (query.get('root') !== 'team') return null
  const phase = query.get('phase') === 'active' ? 'active' : 'config'
  return {
    phase,
    scenario: phase === 'active' ? 'workspace_team_active' : 'workspace_team_run_config_correction',
  }
}

const setAgentOrgRuntimePhase = (phase: 'config' | 'active', router?: Router): AgentOrgRuntimeRoute | null => {
  const current = agentOrgRuntimeRoute()
  if (!current) return null
  const url = new URL(window.location.href)
  url.searchParams.set('phase', phase)
  if (router) {
    void router.replace({
      path: url.pathname,
      query: Object.fromEntries(url.searchParams.entries()),
      hash: url.hash,
    })
  } else {
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }
  return { ...current, phase, scenario: `workspace_agent_org_${phase}` }
}

const scenario = (): string => agentOrgRuntimeRoute()?.scenario || agentTeamRuntimeRoute()?.scenario || localStorage.getItem(SCENARIO_KEY) || DEFAULT_SCENARIO
const context = (): string => localStorage.getItem(CONTEXT_KEY) || (window.location.pathname === '/mobile' ? 'unpaired' : DEFAULT_CONTEXT)

const findSnapshot = (): [string, RuntimeSnapshot] => {
  const path = normalizePath()
  // Projects pages (0a32261) have their own captured snapshots. A created
  // Project or Task (synthetic ID) uses the snapshot of the same page type.
  const pathname = window.location.pathname
  const hasCapturedPath = Object.values(snapshots).some(value => canonicalPath(value.item.path) === path)
  const projectReviewPath = hasCapturedPath || !pathname.startsWith('/projects/') ? null
    : pathname.replace(/^\/projects\/[^/]+/, '/projects/project-prototype-launch').replace(/\/tasks\/(?!new$)[^/]+/, '/tasks/task-outline')
  const aliasedPath = projectReviewPath || defaultRouteAliases[path] || path
  const wantedScenario = scenario()
  const wantedContext = context()
  const entries = Object.entries(snapshots)
  const exactEntry = entries.find(([, value]) =>
    value.item.scenario === wantedScenario
    && (value.item.mobile || 'desktop') === wantedContext
    && canonicalPath(value.item.path) === aliasedPath)
  if (exactEntry) return exactEntry
  const scenarioRedirectEntry = entries.find(([, value]) =>
    value.item.scenario === wantedScenario
    && (value.item.mobile || 'desktop') === wantedContext
    && canonicalPath(value.actualPath) === path)
  if (scenarioRedirectEntry) return scenarioRedirectEntry
  const populatedEntry = entries.find(([, value]) =>
    value.item.scenario === DEFAULT_SCENARIO
    && (value.item.mobile || 'desktop') === wantedContext
    && canonicalPath(value.item.path) === aliasedPath)
  if (populatedEntry) return populatedEntry
  const desktopEntry = entries.find(([, value]) =>
    value.item.scenario === DEFAULT_SCENARIO
    && canonicalPath(value.item.path) === aliasedPath)
  if (desktopEntry) return desktopEntry
  return ['populated|desktop|/', snapshots['populated|desktop|/']]
}

const actionResult = (store: any, action: string, args: any[] = []): any => {
  if (action.startsWith('is')) return false
  if (action.startsWith('get')) return undefined
  if (action.startsWith('fetchAllAgentDefinitions')) return store.allAgentDefinitions || store.agentDefinitions || []
  if (action.startsWith('fetchAllAgentTeamDefinitions')) return store.allAgentTeamDefinitions || store.agentTeamDefinitions || []
  if (action === 'fetchApplications') return store.applications || []
  if (action === 'fetchApplicationById') return store.currentApplication
  if (store.$id === 'llmProviderConfig' && action === 'fetchProvidersWithModels') {
    // Current source keeps one catalog snapshot per runtime. When the selected
    // route snapshot never loaded it, reuse the deterministic ready catalog
    // captured from the pinned source without touching credential state.
    const runtime = String(args[0] || 'autobyteus')
    if (store.catalogByRuntimeKind?.[runtime]?.state !== 'ready') {
      const reference = readyStoreState('llmProviderConfig', state => state.catalogByRuntimeKind?.[runtime]?.state === 'ready')
      if (reference) store.$patch({ catalogByRuntimeKind: { ...store.catalogByRuntimeKind, [runtime]: clone(reference.catalogByRuntimeKind[runtime]) } })
    }
    return store.catalogByRuntimeKind?.[runtime]
  }
  if (store.$id === 'llmProviderConfig' && action === 'fetchProviderCredentialSettings') {
    if (!store.hasFetchedProviderCredentialSettings) {
      const reference = readyStoreState('llmProviderConfig', state => state.hasFetchedProviderCredentialSettings)
      if (reference) store.$patch({ providerCredentialSettings: clone(reference.providerCredentialSettings), hasFetchedProviderCredentialSettings: true })
    }
    return store.providerCredentialSettings || []
  }
  if (action === 'fetchRuntimeAvailabilities') return store.availabilities || []
  if (store.$id === 'workspace' && action === 'ensureWorkspaceMetadata') {
    const workspaceId = args[0]?.workspaceId || args[0]?.id
    return workspaceId ? store.workspaces?.[workspaceId] : undefined
  }
  if (store.$id === 'workspace' && action === 'acquireFileExplorerLiveSession') return () => {}
  if (store.$id === 'fileExplorer' && action === 'fetchFolderChildren') {
    const workspaceId = String(args[0] || 'workspace-prototype')
    const folderPath = String(args[1] || '').replace(/^\/+|\/+$/g, '')
    const fileState = store._getOrCreateWorkspaceState(workspaceId)
    const TreeNode = fileState.tree?.constructor
    const makeNode = (name: string, path: string, isFile: boolean, children: any[], id: string): any => TreeNode
      ? new TreeNode(name, path, isFile, children, id, true)
      : { id, name, path, is_file: isFile, childrenLoaded: true, children }
    const evidence = makeNode('evidence.md', 'docs/evidence.md', true, [], 'node-evidence')
    const docs = makeNode('docs', 'docs', false, [evidence], 'node-docs')
    const requirements = makeNode('requirements.md', 'requirements.md', true, [], 'node-requirements')
    if (folderPath === 'docs') {
      const currentDocs = fileState.nodeIdToNode?.['node-docs'] || docs
      currentDocs.children = [evidence]
      currentDocs.childrenLoaded = true
      fileState.nodeIdToNode = { ...fileState.nodeIdToNode, 'node-docs': currentDocs, 'node-evidence': evidence }
      return undefined
    }
    const root = makeNode(workspaceId.startsWith('skill_ws_') ? workspaceId.slice('skill_ws_'.length) : 'Prototype Workspace', '', false, [docs, requirements], 'root')
    fileState.tree = root
    fileState.nodeIdToNode = { root, 'node-docs': docs, 'node-evidence': evidence, 'node-requirements': requirements }
    return undefined
  }
  if (action === 'fetchAllSkills') return store.skills || []
  if (action === 'fetchSkill') {
    const selected = (store.skills || []).find((skill: { name?: string }) => skill.name === args[0]) || null
    store.currentSkill = selected
    return selected
  }
  if (action === 'fetchSkillFileTree') {
    store.currentSkillTree = JSON.stringify([
      { name: 'SKILL.md', path: 'SKILL.md', isDirectory: false },
      { name: 'references', path: 'references', isDirectory: true, children: [{ name: 'fixture.md', path: 'references/fixture.md', isDirectory: false }] },
    ])
    return undefined
  }
  if (action === 'readFileContent') return '# Prototype Research\n\nUse only deterministic fixture evidence.'
  if (action === 'createAgentDefinition') {
    const input = args[0] || {}
    const template = clone((store.agentDefinitions || [])[0] || {})
    const created = {
      ...template,
      ...clone(input),
      __typename: 'AgentDefinition',
      id: input.id || 'agent-created-fixture',
      avatarUrl: input.avatarUrl || null,
      skillNames: input.skillNames || [],
      toolNames: input.toolNames || [],
      inputProcessorNames: input.inputProcessorNames || [],
      llmResponseProcessorNames: input.llmResponseProcessorNames || [],
      toolExecutionResultProcessorNames: input.toolExecutionResultProcessorNames || [],
      toolInvocationPreprocessorNames: input.toolInvocationPreprocessorNames || [],
      lifecycleProcessorNames: input.lifecycleProcessorNames || [],
      defaultLaunchConfig: input.defaultLaunchConfig || null,
    }
    store.agentDefinitions = [created, ...(store.agentDefinitions || [])]
    return created
  }
  if (action === 'updateAgentDefinition') {
    const input = clone(args[0] || {})
    const existing = (store.agentDefinitions || []).find((item: { id?: string }) => item.id === input.id)
    if (!existing) return null
    const updated = { ...existing, ...input }
    store.agentDefinitions = (store.agentDefinitions || []).map((item: { id?: string }) => item.id === input.id ? updated : item)
    return updated
  }
  if (action === 'deleteAgentDefinition') {
    const id = String(args[0] || '')
    store.agentDefinitions = (store.agentDefinitions || []).filter((item: { id?: string }) => item.id !== id)
    const result = { success: true, message: 'Synthetic operation completed.' }
    store.deleteResult = result
    return result
  }
  if (action === 'createAgentTeamDefinition') {
    const input = clone(args[0] || {})
    const template = clone((store.agentTeamDefinitions || [])[0] || {})
    const created = { ...template, ...input, __typename: 'AgentTeamDefinition', id: input.id || 'team-created-fixture' }
    store.agentTeamDefinitions = [created, ...(store.agentTeamDefinitions || [])]
    return created
  }
  if (action === 'updateAgentTeamDefinition') {
    const input = clone(args[0] || {})
    const existing = (store.agentTeamDefinitions || []).find((item: { id?: string }) => item.id === input.id)
    if (!existing) return null
    const updated = { ...existing, ...input }
    store.agentTeamDefinitions = (store.agentTeamDefinitions || []).map((item: { id?: string }) => item.id === input.id ? updated : item)
    return updated
  }
  if (action === 'deleteAgentTeamDefinition') {
    const id = String(args[0] || '')
    store.agentTeamDefinitions = (store.agentTeamDefinitions || []).filter((item: { id?: string }) => item.id !== id)
    return true
  }
  if (store.$id === 'toolManagement' && action === 'configureMcpServer') {
    const input = clone(args[0] || {})
    const savedConfig = { __typename: 'StdioMcpServerConfig', serverId: input.serverId || 'prototype-files', transportType: input.transportType || 'STDIO', enabled: input.enabled ?? true, command: input.command || 'mock-adapter', args: input.args || [], env: input.env || {}, cwd: input.cwd || '/synthetic', ...input }
    store.mcpServers = [savedConfig, ...(store.mcpServers || []).filter((item: { serverId?: string }) => item.serverId !== savedConfig.serverId)]
    return { savedConfig }
  }
  if (store.$id === 'toolManagement' && action === 'deleteMcpServer') {
    const id = String(args[0] || '')
    store.mcpServers = (store.mcpServers || []).filter((item: { serverId?: string }) => item.serverId !== id)
    return { success: true, message: 'Synthetic operation completed.' }
  }
  if (store.$id === 'toolManagement' && action === 'importMcpServerConfigs') {
    return { success: true, message: 'Synthetic operation completed.', imported_count: 1, importedCount: 1, failed_count: 0, failedCount: 0 }
  }
  if (action === 'saveProviderApiKey') return true
  if (/^(?:enable|disable|update|refresh|save|create|delete|remove|reload|check|import|install)/i.test(action)) {
    return { success: true, message: 'Synthetic operation completed.' }
  }
  return undefined
}

export default defineNuxtPlugin({
  name: 'prototype-state',
  setup(nuxtApp) {
    installHostScenario({ context: context(), scenario: scenario() })
    // The retained source editor defaults to jsDelivr. Ordinary prototype
    // review must remain network-independent, so use the checked-in mirror.
    monacoLoader.config({ paths: { vs: '/prototype-assets/monaco/vs' } })
    for (const collection of Object.values(iconCollections)) {
      addCollection(collection as any)
    }
    // The source measures its primary-navigation section once at mount, before
    // or after the bound-node capabilities resolve depending on the entry route.
    // Reproduce the exact initial split recorded from the pinned source for the
    // selected snapshot (capability-gated routes resolve first).
    if (!localStorage.getItem('autobyteus.app-left-panel.primary-nav-height')) {
      const [, initialSnapshot] = findSnapshot()
      localStorage.setItem('autobyteus.app-left-panel.primary-nav-height', initialSnapshot?.primaryNavHeight || '300')
    }
    const pinia = nuxtApp.$pinia as PrototypePinia
    const router = nuxtApp.$router as Router
    // UI mutations remain local to the current browser context. Overlays keep
    // their visible result across client-side navigation without introducing
    // persistence, a backend, or cross-reviewer mutable state.
    const stateOverlays = new Map<string, Record<string, any>>()
    const hostOwnedStores = new Set(['server', 'nodeStore', 'windowNodeContext', 'appUpdate', 'extensions', 'voiceInput', 'browserShell'])
    const richExperienceOwnedStores = new Set(['agentContexts', 'agentTeamContexts', 'agentBackgroundTask', 'agentActivity', 'fileExplorer', 'runFileChanges'])
    const agentOrgRuntimeOwnedStores = new Set(['agentDefinition', 'agentTeamDefinition', 'agentRunConfig', 'teamRunConfig', 'agentSelection', 'runHistory'])
    const agentOrgRuntimeRequiredStores = ['agentContexts', 'agentSelection', 'workspace', 'runHistory', 'agentDefinition', 'agentTeamDefinition', 'agentRunConfig', 'teamRunConfig']
    let lastAppliedAgentOrgRuntimeKey = ''
    let agentOrgRuntimeApplyScheduled = false
    const scheduleAgentOrgRuntimeScenario = (): void => {
      if (!agentOrgRuntimeRoute() || agentOrgRuntimeApplyScheduled) return
      agentOrgRuntimeApplyScheduled = true
      queueMicrotask(() => {
        agentOrgRuntimeApplyScheduled = false
        const runtime = agentOrgRuntimeRoute()
        if (!runtime) return
        const key = `${window.location.pathname}${window.location.search}`
        if (key === lastAppliedAgentOrgRuntimeKey) return
        if (!agentOrgRuntimeRequiredStores.every(storeId => pinia._s.has(storeId))) return
        const applied = applyExperienceScenario({ scenario: runtime.scenario, context: context() }) as { applied?: boolean }
        if (applied?.applied) lastAppliedAgentOrgRuntimeKey = key
      })
    }
    // Source state captured as JSON loses Map/Set types. Remember which state
    // keys the current source initializes as Map/Set and restore that type
    // after every snapshot/overlay patch.
    const restoreCollectionTypes = (store: any, kinds: Map<string, 'map' | 'set'>): void => {
      for (const [key, kind] of kinds) {
        const value = store[key]
        if (kind === 'map' && !(value instanceof Map)) store[key] = new Map(value && typeof value === 'object' ? Object.entries(value) : [])
        if (kind === 'set' && !(value instanceof Set)) store[key] = new Set(Array.isArray(value) ? value : [])
      }
    }
    const collectionKinds = new Map<string, Map<string, 'map' | 'set'>>()
    const liveMapKeys: Record<string, string[]> = {
      workspace: ['fileSystemConnections', 'fileExplorerLiveConsumers', 'fileExplorerSnapshotRefreshes', 'workspaceMetadataRegistrationTasks'],
      fileExplorer: ['fileExplorerStateByWorkspace'],
    }
    // Once a chat has been sent in this browser context, the run it created is
    // live client state, as in the source (a single-page app keeps its stores
    // across navigation). Route snapshots are then no longer re-applied to the
    // run-owning stores, so the run stays in the Workspaces tree and can be
    // reopened after navigating elsewhere.
    let liveRunSession = false
    const liveRunStores = new Set(['agentContexts', 'agentSelection', 'runHistory', 'chatDraft', 'workspace', 'agentRun'])
    const patchStore = (store: any): void => {
      if (!collectionKinds.has(store.$id)) {
        collectionKinds.set(store.$id, new Map(Object.entries(store.$state)
          .filter(([, value]) => value instanceof Map || value instanceof Set)
          .map(([key, value]) => [key, value instanceof Map ? 'map' : 'set'])))
      }
      const [, selected] = findSnapshot()
      const state = selected?.state?.[store.$id]
      // Live file-explorer sessions and loaded trees are Map-typed client state
      // that captured JSON snapshots cannot carry. Keep the live values across
      // a route re-patch, as the source keeps them across navigation.
      const liveMaps = (liveMapKeys[store.$id] || [])
        .map(key => [key, store[key]] as const)
        .filter(([, value]) => value instanceof Map)
      const isRichExperience = scenario().startsWith('workspace_') || scenario().startsWith('mobile_')
      if (state
        // Projects and Tasks (0a32261) load and save through the source's own
        // stores against the local fixtures, so their client cache survives
        // navigation exactly as in the source.
        && !sourceLoadedStores.has(store.$id)
        && !(liveRunSession && liveRunStores.has(store.$id))
        // An opened Team run is live client state: a route change right after opening it (for
        // example from a chat run route back to /workspace) must not drop its context.
        && !(store.$id === 'agentTeamContexts' && store.teams instanceof Map && store.teams.size > 0)
        && !(context().startsWith('electron_') && hostOwnedStores.has(store.$id))
        && !(isRichExperience && richExperienceOwnedStores.has(store.$id))
        && !(agentOrgRuntimeRoute() && agentOrgRuntimeOwnedStores.has(store.$id))) {
        const next = clone(state)
        // The node binding revision is live client state: rewinding it on a
        // route re-patch would make the source's node-scoped caches (Projects,
        // 0a32261) drop their in-flight reads as if the window was rebound.
        if (store.$id === 'windowNodeContext') delete next.bindingRevision
        store.$patch(next)
        if (state.error && typeof state.error === 'object' && typeof state.error.message === 'string' && 'error' in store) {
          const restoreError = (): void => { store.error = new Error(state.error.message) }
          restoreError()
          // Option-store initialization may apply its initial state once after
          // plugins run. Restore the non-enumerable Error.message after that
          // deterministic initialization pass as well.
          queueMicrotask(restoreError)
        }
      }
      for (const [key, value] of liveMaps) store[key] = value
      if (store.$id === 'workspace') {
        for (const key of ['fileSystemConnections', 'fileExplorerLiveConsumers', 'fileExplorerSnapshotRefreshes', 'workspaceMetadataRegistrationTasks']) {
          if (!(store[key] instanceof Map)) store[key] = new Map()
        }
      }
      if (store.$id === 'fileExplorer' && !(store.fileExplorerStateByWorkspace instanceof Map)) {
        store.fileExplorerStateByWorkspace = new Map()
      }
      if (store.$id === 'teamRunConfig') {
        if (!(store.drafts instanceof Map)) store.drafts = new Map()
        if (!(store.inFlightDrafts instanceof Map)) store.inFlightDrafts = new Map()
      }
      if (store.$id === 'agentTeamContexts' && !(store.teams instanceof Map)) {
        store.teams = new Map()
      }
      if (scenario() === 'team_launch' && store.$id === 'runHistory') {
        store.workspaceGroups = []
        store.navigationProjection = {
          workspaceNodes: [{
            workspaceId: 'workspace-prototype', workspaceRootPath: '/synthetic/prototype-workspace',
            workspaceName: 'prototype-workspace', workspaceKind: 'filesystem', canRemoveFromWorkspaces: true, agents: [],
          }],
          teamNodes: [], teamNodesByWorkspaceRoot: {}, runIndexById: {}, teamIndexById: {}, memberIndexByIdentity: {},
          runAncestryById: {}, teamAncestryById: {}, memberAncestorExecutionKeysByIdentity: {},
        }
      }
      const overlay = stateOverlays.get(store.$id)
      if (overlay && !(agentOrgRuntimeRoute() && agentOrgRuntimeOwnedStores.has(store.$id)) && !(liveRunSession && liveRunStores.has(store.$id))) {
        store.$patch(clone(overlay))
      }
      restoreCollectionTypes(store, collectionKinds.get(store.$id) || new Map())
    }

    pinia.use(({ store, options }: PiniaPluginContext) => {
      patchStore(store)
      scheduleAgentOrgRuntimeScenario()
      const safe = localActions[store.$id] || new Set<string>()
      if (store.$id === 'agentContexts') {
        store.$onAction(({ name, after }) => {
          if (name !== 'createRunFromTemplate') return
          after(() => {
            const runtime = agentOrgRuntimeRoute()
            if (!runtime || runtime.phase !== 'config') return
            const activeRuntime = setAgentOrgRuntimePhase('active', router)
            if (activeRuntime) applyExperienceScenario({ scenario: activeRuntime.scenario, context: context() })
          })
        })
      }
      if (store.$id === 'agentRun') {
        store.$onAction(({ name, after }) => {
          if (name === 'sendUserInputAndSubscribe') after(() => { liveRunSession = true })
        })
      }
      if (navigationOverlayStores.has(store.$id)) {
        store.$onAction(({ name, after }) => {
          if (safe.has(name)) after(() => stateOverlays.set(store.$id, clone(store.$state)))
        })
      }
      if (sourceLoadedStores.has(store.$id)) return
      for (const actionName of Object.keys(options.actions || {})) {
        const pureReadAction = /^(get|is|has|format|build|resolve|find|bindingsForScope|providerStepOrder|stepStatesForProvider|selectedStepForProvider)/.test(actionName)
        if (safe.has(actionName) || pureReadAction) continue
        // Synchronous actions only mutate or read local UI state in the current
        // source; they run unchanged. Only async actions cross the backend
        // boundary and are replaced by deterministic local results.
        if (options.actions[actionName]?.constructor?.name !== 'AsyncFunction') continue
        const originalAction = options.actions[actionName]
        store[actionName] = async (...args: any[]) => {
          // Workspace history reads run the current source code against the
          // local fixtures (utils/apolloClient.ts), so launches and periodic
          // refreshes project exactly as in the source.
          if (store.$id === 'runHistory' && actionName === 'fetchTree' && context() === 'desktop' && !scenario().startsWith('workspace_')) {
            return originalAction.apply(store, args)
          }
          if (scenario() === 'loading' && (actionName === 'fetchAllWorkspaces' || actionName === 'fetchAllAgentDefinitions')) {
            await new Promise(resolve => window.setTimeout(resolve, 1500))
          }
          // The controlled paired-mobile source reports its synthetic recent
          // history refresh as failed while retaining cached recent items. The
          // switcher therefore shows the exact visible `!` segment indicator.
          if (context() === 'paired' && store.$id === 'runHistory' && actionName === 'fetchTree') {
            throw new Error('Synthetic mobile recent-history refresh failed')
          }
          const result = actionResult(store, actionName, args)
          if ((store.$id === 'agentDefinition' || store.$id === 'agentTeamDefinition' || store.$id === 'toolManagement') && result) {
            stateOverlays.set(store.$id, clone(store.$state))
          }
          return result
        }
      }
    })

    // A chat run route (`/chat?id=<runId>`, 57df63f) shows live run state that
    // the source's own send/open/hydration code owns. Store snapshots are
    // applied when stores are created, but not re-applied on navigation into
    // a chat run, so a just-sent chat or an opened stored run is not reset.
    const isChatRunRoute = (): boolean => window.location.pathname === '/chat' && new URLSearchParams(window.location.search).has('id')
    const applyCurrentSnapshot = (): void => {
      const [key] = findSnapshot()
      if (isChatRunRoute()) {
        document.documentElement.dataset.prototypeSnapshot = key
        return
      }
      for (const store of pinia._s.values()) patchStore(store)
      document.documentElement.dataset.prototypeSnapshot = key
      if (localStorage.getItem('autobyteus.prototype.deferExperienceScenario') !== '1') {
        queueMicrotask(() => {
          const runtime = agentOrgRuntimeRoute()
          const applied = applyExperienceScenario({ scenario: scenario(), context: context() }) as { applied?: boolean }
          if (runtime && applied?.applied) {
            lastAppliedAgentOrgRuntimeKey = `${window.location.pathname}${window.location.search}`
          }
        })
      }
    }

    nuxtApp.hook('page:finish', applyCurrentSnapshot)
    router.afterEach(() => queueMicrotask(applyCurrentSnapshot))

    const nativeFetch = window.fetch.bind(window)
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const resolved = new URL(url, window.location.href)
      if (/\/rest\/health$|^\/health$/.test(resolved.pathname)) {
        return Promise.resolve(new Response(JSON.stringify({ status: 'ok', version: 'prototype-1.0.0', fixture: true }), { status: 200, headers: { 'content-type': 'application/json' } }))
      }
      if (resolved.pathname.includes('/content') || resolved.pathname.includes('/file-change-content')) {
        return Promise.resolve(new Response('# Synthetic file\n\nFixture content only.', { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } }))
      }
      if (/\/applications\/[^/]+\/execution-resource-configurations$/.test(resolved.pathname)) {
        return Promise.resolve(new Response(JSON.stringify(applicationLaunchConfigurationView()), { status: 200, headers: { 'content-type': 'application/json' } }))
      }
      if (/\/applications\/[^/]+\/available-execution-resources$/.test(resolved.pathname)) {
        return Promise.resolve(new Response(JSON.stringify(applicationAvailableExecutionResources()), { status: 200, headers: { 'content-type': 'application/json' } }))
      }
      // Project Task context files (0a32261): draft begin/upload/remove/discard
      // return small synthetic records; nothing is uploaded or stored.
      if (/\/projects\/[^/]+\/task-context-drafts$/.test(resolved.pathname) && init?.method === 'POST') {
        localFixtureState.taskDraftSeq = (localFixtureState.taskDraftSeq || 0) + 1
        return Promise.resolve(new Response(JSON.stringify({ draftId: `draft-${localFixtureState.taskDraftSeq}` }), { status: 200, headers: { 'content-type': 'application/json' } }))
      }
      if (/\/projects\/[^/]+\/task-context-drafts\/[^/]+\/context-files$/.test(resolved.pathname) && init?.method === 'POST') {
        const file = (init.body as FormData | undefined)?.get?.('file') as File | null
        return Promise.resolve(new Response(JSON.stringify(taskContextUpload(localFixtureState, file)), { status: 200, headers: { 'content-type': 'application/json' } }))
      }
      if (/\/projects\/[^/]+\/(task-context-drafts|tasks)\//.test(resolved.pathname)) {
        return Promise.resolve(init?.method === 'DELETE'
          ? new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
          : new Response('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#dbeafe"/></svg>', { status: 200, headers: { 'content-type': 'image/svg+xml' } }))
      }
      if (resolved.origin !== window.location.origin || /^\/(graphql|rest)(\/|$)/.test(resolved.pathname)) {
        return Promise.reject(new Error(`Prototype boundary blocked external request: ${resolved.href}`))
      }
      return nativeFetch(input, init)
    }) as typeof window.fetch

    class PrototypeWebSocket extends EventTarget {
      static readonly CONNECTING = 0; static readonly OPEN = 1; static readonly CLOSING = 2; static readonly CLOSED = 3
      readonly CONNECTING = 0; readonly OPEN = 1; readonly CLOSING = 2; readonly CLOSED = 3
      readonly url: string; readonly protocol = ''; readonly extensions = ''; readonly bufferedAmount = 0; readonly binaryType = 'blob'
      readyState = PrototypeWebSocket.OPEN
      onopen: ((event: Event) => any) | null = null; onclose: ((event: CloseEvent) => any) | null = null; onerror: ((event: Event) => any) | null = null; onmessage: ((event: MessageEvent) => any) | null = null
      constructor(url: string | URL) {
        super(); this.url = String(url)
        queueMicrotask(() => { const event = new Event('open'); this.onopen?.(event); this.dispatchEvent(event) })
      }
      send(_data: string | ArrayBufferLike | Blob | ArrayBufferView): void {}
      close(): void {
        this.readyState = PrototypeWebSocket.CLOSED
        const event = new CloseEvent('close', { code: 1000, reason: 'prototype' })
        this.onclose?.(event); this.dispatchEvent(event)
      }
    }
    window.WebSocket = PrototypeWebSocket as unknown as typeof WebSocket

    window.__AUTOBYTEUS_PROTOTYPE__ = {
      sourceCommit: runtimeFixture.sourceCommit,
      get scenario() { return scenario() },
      get context() { return context() },
      setScenario(value: string, nextContext = context()) {
        localStorage.setItem(SCENARIO_KEY, value)
        localStorage.setItem(CONTEXT_KEY, nextContext)
        applyCurrentSnapshot()
      },
      applyExperienceScenario(options: { scenario?: string, context?: string, tab?: string } = {}) {
        return applyExperienceScenario({ scenario: options.scenario || scenario(), context: options.context || context(), tab: options.tab })
      },
      reset() {
        localStorage.setItem(SCENARIO_KEY, DEFAULT_SCENARIO)
        localStorage.setItem(CONTEXT_KEY, DEFAULT_CONTEXT)
        applyCurrentSnapshot()
      },
    }
  },
})

declare global {
  interface Window {
    __AUTOBYTEUS_PROTOTYPE__: {
      sourceCommit: string
      readonly scenario: string
      readonly context: string
      setScenario(value: string, context?: string): void
      applyExperienceScenario(options?: { scenario?: string, context?: string, tab?: string }): unknown
      reset(): void
    }
  }
}
