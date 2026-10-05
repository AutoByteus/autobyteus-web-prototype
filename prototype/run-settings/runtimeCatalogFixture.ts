/**
 * run-settings-ui-unification — small hand-written runtime catalog fixture.
 *
 * Adds three synthetic runtimes next to the baseline AutoByteus catalog so the run-settings
 * review can show model + runtime choice across runtimes, a thinking schema with effort levels,
 * and the Antigravity "always auto-approve" lock. Every value is invented and illustrative.
 */

const effortSchema = (levels: string[], fallback: string) => ({
  type: 'object',
  properties: {
    thinking_enabled: { type: 'boolean', title: 'Thinking', default: false },
    reasoning_effort: { type: 'string', title: 'Effort', enum: levels, default: fallback },
  },
})

/**
 * SR-005: Codex models in the server's parameter format, as `codex-app-server-model-normalizer.ts`
 * emits them: reasoning effort and, for models that support it, Fast mode (`service_tier`, one value
 * "fast"; unset = Default). Values are illustrative.
 */
const codexEffort = (levels: string[], fallback: string) => ({
  name: 'reasoning_effort', type: 'enum', required: false, default_value: fallback, enum_values: levels,
  description: 'Controls reasoning depth for Codex turn/start.',
})
const codexFast = {
  name: 'service_tier', label: 'Fast mode', type: 'enum', required: false, enum_values: ['fast'],
  description: 'Enable Codex Fast mode for this model. Default leaves Codex service tier unchanged.',
}

const model = (runtime: string, providerId: string, providerName: string, identifier: string, name: string, configSchema: object) => ({
  __typename: 'ModelDetail',
  modelIdentifier: identifier,
  name,
  description: 'Synthetic run-settings review model; no inference request is made.',
  value: identifier,
  canonicalName: identifier,
  providerId,
  providerName,
  providerType: 'mock',
  runtime,
  hostUrl: 'mock://local',
  configSchema,
  maxContextTokens: 200000,
  activeContextTokens: 100000,
  maxInputTokens: 190000,
  maxOutputTokens: 16000,
  metadataProvenance: 'fixture',
  selectionPresentation: null,
})

const catalog = (runtimeKind: string, providerId: string, providerName: string, models: ReturnType<typeof model>[]) => ({
  runtimeKind,
  currentRequestId: 1,
  state: 'ready',
  hasSuccessfulPayload: true,
  errorMessage: null,
  providersById: {
    [providerId]: {
      __typename: 'ProviderModelCatalogSnapshotObject',
      runtimeKind,
      ownerProvider: {
        __typename: 'CatalogProviderObject', id: providerId, name: providerName, providerType: 'mock',
        isCustom: false, baseUrl: 'mock://local', catalogMode: 'STATIC',
      },
      sources: [{
        __typename: 'ModelSourceStatusObject', modelKind: 'LLM', state: 'READY', modelCount: models.length,
        successfulUnitCount: 1, failedUnitCount: 0, safeMessage: null,
      }],
      llmModels: models,
    },
  },
})

export const RUN_SETTINGS_RUNTIME_AVAILABILITIES = [
  { runtimeKind: 'autobyteus', enabled: true, reason: null },
  { runtimeKind: 'codex_app_server', enabled: true, reason: null },
  { runtimeKind: 'claude_agent_sdk', enabled: true, reason: null },
  { runtimeKind: 'antigravity_cli', enabled: true, reason: null },
]

export const RUN_SETTINGS_RUNTIME_CATALOGS: Record<string, ReturnType<typeof catalog>> = {
  codex_app_server: catalog('codex_app_server', 'openai', 'OpenAI', [
    model('codex_app_server', 'openai', 'OpenAI', 'gpt-5.6-sol', 'GPT-5.6 Sol', { parameters: [codexEffort(['low', 'medium', 'high', 'xhigh'], 'medium'), codexFast] }),
    model('codex_app_server', 'openai', 'OpenAI', 'gpt-5.6-mini', 'GPT-5.6 Mini', {}),
    // SR-005: a model with only other settings (Fast mode, no thinking).
    model('codex_app_server', 'openai', 'OpenAI', 'gpt-5.6-instant', 'GPT-5.6 Instant', { parameters: [codexFast] }),
  ]),
  claude_agent_sdk: catalog('claude_agent_sdk', 'anthropic', 'Anthropic', [
    model('claude_agent_sdk', 'anthropic', 'Anthropic', 'claude-sonnet-4.5', 'Claude Sonnet 4.5', effortSchema(['low', 'medium', 'high'], 'medium')),
  ]),
  antigravity_cli: catalog('antigravity_cli', 'google', 'Google', [
    model('antigravity_cli', 'google', 'Google', 'gemini-3-pro', 'Gemini 3 Pro', {}),
  ]),
}
