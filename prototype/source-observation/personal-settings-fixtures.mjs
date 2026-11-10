// package-clone-auto-update-457 (origin/personal@f78b60dddd): the node-side state behind the personal settings of the Agents, Teams and
// Orgs editors. Every value is invented. The UI reference has no backend: this module only says which fixture definitions come from a
// package (or are built in), which of their four settings are personal at the start, what the package's own value is (the value a reset
// brings back), and answers the three Reset mutations. What is personal is a scripted fact of the fixture; nothing is computed.
//
// Used by the observation node (`mock-node.mjs`, through `fixtures.mjs`) and by the UI reference (`utils/apolloClient.ts` answers,
// `plugins/96.personal-settings.client.ts` fills the stores), so both show the same fixture.

/** A small inert image (an indigo disc), the personal avatar of the fixture definitions. */
const personalAvatar = (letter) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#4f46e5"/><text x="48" y="62" font-family="sans-serif" font-size="44" font-weight="700" text-anchor="middle" fill="#fff">${letter}</text></svg>`)}`

const LAUNCH_PERSONAL = Object.freeze({ __typename: 'DefaultLaunchConfig', llmModelIdentifier: 'mock/reasoning-prototype', runtimeKind: 'autobyteus', llmConfig: null })

/**
 * id -> the definition's base, the settings personal at the start, and for each personal setting its package (or built-in) value.
 * `personal` holds the value while the setting is personal; `base` holds the value a reset brings back.
 */
const WORLD = Object.freeze({
  agent: {
    // An agent from a package with all four settings personal.
    'agent-researcher': {
      base: 'PACKAGE',
      personal: ['TOOLS', 'SKILLS', 'AVATAR', 'DEFAULT_LAUNCH_CONFIG'],
      values: {
        TOOLS: { personal: { toolNames: ['web_search', 'read_file', 'run_bash'] }, base: { toolNames: ['web_search', 'read_file'] } },
        SKILLS: { personal: { skillNames: ['prototype-research', 'prototype-writing'] }, base: { skillNames: ['prototype-research'] } },
        AVATAR: { personal: { avatarUrl: personalAvatar('R') }, base: { avatarUrl: null } },
        DEFAULT_LAUNCH_CONFIG: {
          personal: { defaultLaunchConfig: LAUNCH_PERSONAL },
          base: { defaultLaunchConfig: { __typename: 'DefaultLaunchConfig', llmModelIdentifier: 'mock/gpt-prototype', runtimeKind: 'autobyteus', llmConfig: { temperature: 0.2 } } },
        },
      },
    },
    // An agent from a package with nothing personal: only the note under the title.
    'agent-writer': { base: 'PACKAGE', personal: [], values: {} },
    // A built-in agent with two personal settings.
    'autobyteus-daily-assistant': {
      base: 'BUILT_IN',
      personal: ['TOOLS', 'AVATAR'],
      values: {
        TOOLS: { personal: { toolNames: ['run_bash', 'read_url'] }, base: { toolNames: ['run_bash', 'read_url', 'search_web'] } },
        AVATAR: { personal: { avatarUrl: personalAvatar('D') }, base: { avatarUrl: null } },
      },
    },
  },
  team: {
    'team-product': {
      base: 'PACKAGE',
      personal: ['AVATAR', 'DEFAULT_LAUNCH_CONFIG'],
      values: {
        AVATAR: { personal: { avatarUrl: personalAvatar('P') }, base: { avatarUrl: null } },
        DEFAULT_LAUNCH_CONFIG: {
          personal: { defaultLaunchConfig: LAUNCH_PERSONAL },
          base: { defaultLaunchConfig: { __typename: 'DefaultLaunchConfig', llmModelIdentifier: 'mock/gpt-prototype', runtimeKind: 'autobyteus', llmConfig: { temperature: 0.2 } } },
        },
      },
    },
  },
  org: {
    'org-product-launch': {
      base: 'PACKAGE',
      personal: ['AVATAR', 'DEFAULT_LAUNCH_CONFIG'],
      values: {
        AVATAR: { personal: { avatarUrl: personalAvatar('L') }, base: { avatarUrl: null } },
        DEFAULT_LAUNCH_CONFIG: {
          personal: { defaultLaunchConfig: LAUNCH_PERSONAL },
          base: { defaultLaunchConfig: { __typename: 'DefaultLaunchConfig', llmModelIdentifier: 'mock/gpt-prototype', runtimeKind: 'autobyteus', llmConfig: { temperature: 0.2 } } },
        },
      },
    },
  },
})

/** The agent made by hand in the app's own storage (scenario `personal_settings`): no package, so no personal-settings base. */
export const HANDMADE_AGENT_ID = 'agent-release-notes'
export const handmadeAgent = (template) => ({
  ...JSON.parse(JSON.stringify(template)),
  id: HANDMADE_AGENT_ID,
  name: 'Release Notes Helper',
  role: 'Drafts release notes from a list of changes.',
  description: 'An agent made by hand in this app.',
  avatarUrl: null,
  toolNames: ['read_file', 'write_file'],
  skillNames: [],
  skillScope: 'CONFIGURED',
  ownerPackageId: null,
  defaultLaunchConfig: null,
  personalSettings: [],
  personalSettingsBase: null,
})

/** The resets done in this browser/node session: `{ 'agent:agent-researcher': Set('TOOLS') }`. In memory; a reload (or a scenario change) starts again. */
const resetsOf = (state) => (state.personalResets ??= {})
const resetKey = (kind, id) => `${kind}:${id}`
const doneOf = (state, kind, id) => resetsOf(state)[resetKey(kind, id)] ?? []

/** The settings that are personal now: those at the start minus the ones reset. */
const personalNow = (entry, state, kind, id) => entry.personal.filter(setting => !doneOf(state, kind, id).includes(setting))

/**
 * The definition as the node reports it: `personalSettings` and `personalSettingsBase`, and the value of each setting (personal while it
 * is, the package's once reset). A definition with no entry here has no personal-settings base (made by hand).
 */
export const withPersonalSettings = (kind, definition, state) => {
  const entry = WORLD[kind]?.[definition.id]
  if (!entry) return { ...definition, personalSettings: [], personalSettingsBase: null }
  const merged = { ...definition }
  for (const [setting, values] of Object.entries(entry.values)) {
    Object.assign(merged, personalNow(entry, state, kind, definition.id).includes(setting) ? values.personal : values.base)
  }
  return { ...merged, personalSettings: personalNow(entry, state, kind, definition.id), personalSettingsBase: entry.base }
}

/**
 * A definition already in a store (from a captured snapshot, an earlier answer or a copy of another entry): one this fixture knows keeps
 * what it carries (a reset or an earlier read already settled it); any other one is made by hand.
 */
export const settleDefinition = (kind, definition, state) => {
  if (WORLD[kind]?.[definition.id]) return definition.personalSettingsBase !== undefined ? definition : withPersonalSettings(kind, definition, state)
  const byHand = definition.personalSettingsBase === null && Array.isArray(definition.personalSettings) && definition.personalSettings.length === 0
  return byHand ? definition : withPersonalSettings(kind, definition, state)
}

/** Reset one setting: its package value applies again. An unknown or already-reset setting changes nothing (the node answers the same definition). */
export const resetPersonalSetting = (kind, id, setting, state) => {
  const entry = WORLD[kind]?.[id]
  if (!entry || !entry.personal.includes(setting)) return
  const done = doneOf(state, kind, id)
  if (!done.includes(setting)) resetsOf(state)[resetKey(kind, id)] = [...done, setting]
}

export const PERSONAL_RESET_MUTATIONS = new Set(['ResetAgentPersonalSetting', 'ResetAgentTeamPersonalSetting', 'ResetAgentOrgPersonalSetting'])

const LIST = {
  GetAgentDefinitions: { kind: 'agent', field: 'agentDefinitions' },
  GetAgentTeamDefinitions: { kind: 'team', field: 'agentTeamDefinitions' },
  GetAgentOrgDefinitions: { kind: 'org', field: 'agentOrgDefinitions' },
}
const RESET = {
  ResetAgentPersonalSetting: { kind: 'agent', list: 'GetAgentDefinitions', field: 'resetAgentPersonalSetting' },
  ResetAgentTeamPersonalSetting: { kind: 'team', list: 'GetAgentTeamDefinitions', field: 'resetAgentTeamPersonalSetting' },
  ResetAgentOrgPersonalSetting: { kind: 'org', list: 'GetAgentOrgDefinitions', field: 'resetAgentOrgPersonalSetting' },
}

/**
 * Post-processes a node answer: the three definition lists carry the personal-settings fields (and, in scenario `personal_settings`, the
 * hand-made agent), and a Reset answers the definition with that setting reset. `read(name)` answers a list the ordinary way.
 */
export const personalSettingsOperation = (name, variables, data, state, read) => {
  const list = LIST[name]
  if (list && data?.[list.field]) {
    const entries = data[list.field].map(definition => (WORLD[list.kind]?.[definition.id] ? withPersonalSettings(list.kind, definition, state) : { ...definition, personalSettings: [], personalSettingsBase: null }))
    if (list.kind === 'agent' && state.scenario === 'personal_settings' && entries.length && !entries.some(entry => entry.id === HANDMADE_AGENT_ID)) {
      entries.push(handmadeAgent(entries[0]))
    }
    return { ...data, [list.field]: entries }
  }
  const reset = RESET[name]
  if (reset && state.scenario === 'personal_settings_reset_fails') return { __projectError: { message: 'The package files could not be read.', extensions: { code: 'PERSONAL_SETTING_RESET_FAILED' } } }
  if (reset) {
    resetPersonalSetting(reset.kind, variables.definitionId, variables.setting, state)
    const definition = personalSettingsOperation(reset.list, {}, read(reset.list), state, read)[LIST[reset.list].field].find(entry => entry.id === variables.definitionId)
    return { [reset.field]: definition ?? null }
  }
  return data
}
