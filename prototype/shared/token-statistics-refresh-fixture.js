const DAY_MS = 86_400_000

const isoDate = value => new Date(value).toISOString()
const addDays = (value, days) => isoDate(Date.parse(value) + days * DAY_MS)

export const emptyTokenUsageAggregate = (overrides = {}) => ({
  __typename: 'TokenUsageCostSummaryAggregateGraphql',
  grossInputTokens: 0,
  standardInputTokens: 0,
  cacheMissInputTokens: 0,
  cacheReadInputTokens: 0,
  cacheCreationInputTokens: 0,
  cacheCreation5mInputTokens: 0,
  cacheCreation1hInputTokens: 0,
  outputTokens: 0,
  reasoningOutputTokens: 0,
  billableOutputTokens: 0,
  totalTokens: 0,
  cacheReadInputTokenRate: null,
  standardInputTokenRate: null,
  cacheCreationInputTokenRate: null,
  cacheState: 'unknown',
  estimatedApiInputCost: null,
  estimatedApiStandardInputCost: null,
  estimatedApiCacheReadInputCost: null,
  estimatedApiCacheCreationInputCost: null,
  estimatedApiCacheCreation5mInputCost: null,
  estimatedApiCacheCreation1hInputCost: null,
  estimatedApiOutputCost: null,
  estimatedApiReasoningOutputCost: null,
  estimatedApiTotalCost: null,
  currency: null,
  apiCostStatus: 'price_missing',
  missingPriceDimensions: [],
  pricingPolicyKey: null,
  selectedPricingTierId: null,
  usageReportCount: 0,
  updatedAt: null,
  observedRuntimeKinds: [],
  observedModelIdentifiers: [],
  observedModelProviders: [],
  ...overrides,
})

const quality = (kind = 'COMPLETE', currency = 'USD', missingPriceDimensions = []) => ({
  __typename: 'TokenUsageAnalyticsCostQualityGraphql',
  kind,
  currency,
  missingPriceDimensions,
})

const aggregate = ({
  input,
  cached = 0,
  cacheCreated = 0,
  output,
  reasoning = 0,
  inputCost = null,
  outputCost = null,
  totalCost = null,
  currency = 'USD',
  status = 'estimated',
  reports = 1,
  runtime,
  model,
  provider,
  missing = [],
}) => {
  const standard = Math.max(0, input - cached - cacheCreated)
  return emptyTokenUsageAggregate({
    grossInputTokens: input,
    standardInputTokens: standard,
    cacheMissInputTokens: standard,
    cacheReadInputTokens: cached,
    cacheCreationInputTokens: cacheCreated,
    outputTokens: output,
    reasoningOutputTokens: reasoning,
    billableOutputTokens: output,
    totalTokens: input + output,
    cacheReadInputTokenRate: input ? cached / input : null,
    standardInputTokenRate: input ? standard / input : null,
    cacheCreationInputTokenRate: input ? cacheCreated / input : null,
    cacheState: cached > 0 ? 'positive' : 'zero_reported',
    estimatedApiInputCost: inputCost,
    estimatedApiStandardInputCost: inputCost == null ? null : inputCost * (standard / Math.max(input, 1)),
    estimatedApiCacheReadInputCost: inputCost == null ? null : inputCost * (cached / Math.max(input, 1)),
    estimatedApiCacheCreationInputCost: inputCost == null ? null : inputCost * (cacheCreated / Math.max(input, 1)),
    estimatedApiCacheCreation5mInputCost: 0,
    estimatedApiCacheCreation1hInputCost: 0,
    estimatedApiOutputCost: outputCost,
    estimatedApiReasoningOutputCost: reasoning && outputCost != null ? outputCost * reasoning / Math.max(output, 1) : 0,
    estimatedApiTotalCost: totalCost,
    currency,
    apiCostStatus: status,
    missingPriceDimensions: missing,
    pricingPolicyKey: status === 'local_no_api_bill' ? null : 'synthetic-observable-fixture',
    selectedPricingTierId: null,
    usageReportCount: reports,
    updatedAt: '2026-08-29T12:00:00.000Z',
    observedRuntimeKinds: runtime ? [runtime] : [],
    observedModelIdentifiers: model ? [model] : [],
    observedModelProviders: provider ? [provider] : [],
  })
}

const baseBreakdownRows = () => [
  {
    rowKey: 'codex:gpt-5.6-sol',
    identityKey: 'codex:gpt-5.6-sol',
    providerKey: 'openai',
    modelKey: 'openai:gpt-5.6-sol',
    runtimeKind: 'codex_app_server',
    modelProvider: 'openai',
    providerName: 'openai',
    providerDisplayName: 'OpenAI',
    modelIdentifier: 'gpt-5.6-sol',
    modelValue: 'openai/gpt-5.6-sol',
    modelDisplayName: 'GPT-5.6 Sol',
    aggregate: aggregate({ input: 62_000, cached: 12_000, output: 18_000, reasoning: 6_000, inputCost: 0.22, outputCost: 0.45, totalCost: 0.67, reports: 8, runtime: 'codex_app_server', model: 'gpt-5.6-sol', provider: 'openai' }),
    costQuality: quality(),
  },
  {
    rowKey: 'claude:sonnet-4.5',
    identityKey: 'claude:sonnet-4.5',
    providerKey: 'anthropic',
    modelKey: 'anthropic:claude-sonnet-4.5',
    runtimeKind: 'claude_agent_sdk',
    modelProvider: 'anthropic',
    providerName: 'anthropic',
    providerDisplayName: 'Anthropic',
    modelIdentifier: 'claude-sonnet-4.5',
    modelValue: 'anthropic/claude-sonnet-4.5',
    modelDisplayName: 'Claude Sonnet 4.5',
    aggregate: aggregate({ input: 34_000, cached: 4_000, output: 11_000, reasoning: 0, inputCost: 0.17, outputCost: 0.33, totalCost: 0.50, reports: 6, runtime: 'claude_agent_sdk', model: 'claude-sonnet-4.5', provider: 'anthropic' }),
    costQuality: quality(),
  },
  {
    rowKey: 'autobyteus:local-prototype',
    identityKey: 'autobyteus:local-prototype',
    providerKey: 'local',
    modelKey: 'local:prototype-model',
    runtimeKind: 'autobyteus',
    modelProvider: 'local',
    providerName: 'local',
    providerDisplayName: 'Local',
    modelIdentifier: 'prototype-model',
    modelValue: 'local/prototype-model',
    modelDisplayName: 'Prototype Local Model',
    aggregate: aggregate({ input: 19_000, output: 8_000, inputCost: null, outputCost: null, totalCost: null, currency: null, status: 'local_no_api_bill', reports: 4, runtime: 'autobyteus', model: 'prototype-model', provider: 'local' }),
    costQuality: quality('LOCAL', null),
  },
]

const sumAggregates = rows => {
  const result = emptyTokenUsageAggregate({
    cacheState: 'positive',
    currency: 'USD',
    apiCostStatus: 'estimated',
    pricingPolicyKey: 'synthetic-observable-fixture',
    updatedAt: '2026-08-29T12:00:00.000Z',
  })
  const numericFields = [
    'grossInputTokens', 'standardInputTokens', 'cacheMissInputTokens', 'cacheReadInputTokens',
    'cacheCreationInputTokens', 'cacheCreation5mInputTokens', 'cacheCreation1hInputTokens',
    'outputTokens', 'reasoningOutputTokens', 'billableOutputTokens', 'totalTokens',
    'estimatedApiInputCost', 'estimatedApiStandardInputCost', 'estimatedApiCacheReadInputCost',
    'estimatedApiCacheCreationInputCost', 'estimatedApiCacheCreation5mInputCost',
    'estimatedApiCacheCreation1hInputCost', 'estimatedApiOutputCost',
    'estimatedApiReasoningOutputCost', 'estimatedApiTotalCost', 'usageReportCount',
  ]
  for (const row of rows) {
    for (const field of numericFields) {
      if (row.aggregate[field] != null) result[field] = (result[field] ?? 0) + row.aggregate[field]
    }
  }
  result.cacheReadInputTokenRate = result.grossInputTokens ? result.cacheReadInputTokens / result.grossInputTokens : null
  result.standardInputTokenRate = result.grossInputTokens ? result.standardInputTokens / result.grossInputTokens : null
  result.cacheCreationInputTokenRate = result.grossInputTokens ? result.cacheCreationInputTokens / result.grossInputTokens : null
  result.observedRuntimeKinds = [...new Set(rows.flatMap(row => row.aggregate.observedRuntimeKinds))]
  result.observedModelIdentifiers = [...new Set(rows.flatMap(row => row.aggregate.observedModelIdentifiers))]
  result.observedModelProviders = [...new Set(rows.flatMap(row => row.aggregate.observedModelProviders))]
  return result
}

const scaledAggregate = (source, ratio) => ({
  ...source,
  grossInputTokens: Math.round(source.grossInputTokens * ratio),
  standardInputTokens: Math.round(source.standardInputTokens * ratio),
  cacheMissInputTokens: Math.round(source.cacheMissInputTokens * ratio),
  cacheReadInputTokens: Math.round(source.cacheReadInputTokens * ratio),
  cacheCreationInputTokens: Math.round(source.cacheCreationInputTokens * ratio),
  outputTokens: Math.round(source.outputTokens * ratio),
  reasoningOutputTokens: Math.round(source.reasoningOutputTokens * ratio),
  billableOutputTokens: Math.round(source.billableOutputTokens * ratio),
  totalTokens: Math.round(source.totalTokens * ratio),
  estimatedApiInputCost: source.estimatedApiInputCost == null ? null : source.estimatedApiInputCost * ratio,
  estimatedApiStandardInputCost: source.estimatedApiStandardInputCost == null ? null : source.estimatedApiStandardInputCost * ratio,
  estimatedApiCacheReadInputCost: source.estimatedApiCacheReadInputCost == null ? null : source.estimatedApiCacheReadInputCost * ratio,
  estimatedApiCacheCreationInputCost: source.estimatedApiCacheCreationInputCost == null ? null : source.estimatedApiCacheCreationInputCost * ratio,
  estimatedApiOutputCost: source.estimatedApiOutputCost == null ? null : source.estimatedApiOutputCost * ratio,
  estimatedApiReasoningOutputCost: source.estimatedApiReasoningOutputCost == null ? null : source.estimatedApiReasoningOutputCost * ratio,
  estimatedApiTotalCost: source.estimatedApiTotalCost == null ? null : source.estimatedApiTotalCost * ratio,
  usageReportCount: Math.max(1, Math.round(source.usageReportCount * ratio)),
})

const rangeBucket = (start, end, source, ratio, bucketQuality = quality()) => ({
  bucketStart: start,
  bucketEndExclusive: end,
  aggregate: scaledAggregate(source, ratio),
  costQuality: bucketQuality,
})

const comparisonRangeFor = (startTime, endTimeExclusive) => {
  const duration = Date.parse(endTimeExclusive) - Date.parse(startTime)
  return {
    startTime: isoDate(Date.parse(startTime) - duration),
    endTimeExclusive: startTime,
  }
}

const filterRows = (rows, input) => rows.filter(row => (
  (!input.runtimeKind || row.runtimeKind === input.runtimeKind) &&
  (!input.providerKey || row.providerKey === input.providerKey) &&
  (!input.modelKey || row.modelKey === input.modelKey)
))

export const createTokenUsageAnalyticsResult = (input = {}, scenario = 'populated') => {
  const startTime = input.startTime || '2026-08-01T00:00:00.000Z'
  const endTimeExclusive = input.endTimeExclusive || '2026-08-30T00:00:00.000Z'
  const comparisonRange = comparisonRangeFor(startTime, endTimeExclusive)
  let rows = filterRows(baseBreakdownRows(), input)
  const isEmpty = scenario === 'token_empty'
  const unavailable = scenario === 'token_unavailable'
  const partial = scenario === 'token_partial'
  const mixed = scenario === 'token_mixed_currency'
  const local = scenario === 'token_local'

  if (isEmpty || unavailable) rows = []
  if (local) rows = rows.filter(row => row.costQuality.kind === 'LOCAL')
  if (mixed && rows[1]) {
    rows[1] = {
      ...rows[1],
      aggregate: { ...rows[1].aggregate, currency: 'EUR', estimatedApiTotalCost: 0.46 },
      costQuality: quality('COMPLETE', 'EUR'),
    }
  }

  const selectedAggregate = sumAggregates(rows)
  let selectedCostQuality = quality()
  if (!rows.length) selectedCostQuality = quality('NO_USAGE', null)
  else if (partial) {
    selectedCostQuality = quality('PARTIAL', 'USD', ['output'])
    selectedAggregate.apiCostStatus = 'partial_price_missing'
    selectedAggregate.missingPriceDimensions = ['output']
    selectedAggregate.estimatedApiTotalCost = 0.87
  } else if (mixed) {
    selectedCostQuality = quality('MIXED_CURRENCY', null)
    selectedAggregate.apiCostStatus = 'mixed'
    selectedAggregate.currency = null
    selectedAggregate.estimatedApiTotalCost = null
  } else if (local) {
    selectedCostQuality = quality('LOCAL', null)
    selectedAggregate.apiCostStatus = 'local_no_api_bill'
    selectedAggregate.currency = null
    selectedAggregate.estimatedApiTotalCost = null
  }

  const comparisonAggregate = rows.length ? scaledAggregate(selectedAggregate, 0.78) : emptyTokenUsageAggregate()
  const selectedQualityForBuckets = selectedCostQuality.kind === 'NO_USAGE' ? quality('NO_USAGE', null) : selectedCostQuality
  const ratios = [0.17, 0.28, 0.24, 0.31]
  const durationDays = Math.max(4, Math.round((Date.parse(endTimeExclusive) - Date.parse(startTime)) / DAY_MS))
  const step = Math.max(1, Math.floor(durationDays / 4))
  const trendBuckets = rows.length ? ratios.map((ratio, index) => {
    const bucketStart = addDays(startTime, index * step)
    const bucketEnd = index === ratios.length - 1 ? endTimeExclusive : addDays(startTime, (index + 1) * step)
    return rangeBucket(bucketStart, bucketEnd, selectedAggregate, ratio, selectedQualityForBuckets)
  }) : []
  const comparisonBuckets = rows.length && !partial && !unavailable ? ratios.map((ratio, index) => {
    const bucketStart = addDays(comparisonRange.startTime, index * step)
    const bucketEnd = index === ratios.length - 1 ? comparisonRange.endTimeExclusive : addDays(comparisonRange.startTime, (index + 1) * step)
    return rangeBucket(bucketStart, bucketEnd, comparisonAggregate, ratio, selectedQualityForBuckets)
  }) : []

  const coverageStart = partial || unavailable ? addDays(startTime, Math.min(10, durationDays - 1)) : addDays(startTime, -180)
  return {
    appliedRange: {
      preset: input.rangePreset || 'THIS_MONTH',
      startTime,
      endTimeExclusive,
      granularity: durationDays > 120 ? 'MONTH' : durationDays > 45 ? 'WEEK' : 'DAY',
    },
    comparisonRange: partial || unavailable ? null : comparisonRange,
    coverage: { status: unavailable ? 'UNAVAILABLE' : partial ? 'PARTIAL' : 'FULL', coverageStart },
    comparisonCoverage: partial || unavailable ? null : { status: 'FULL', coverageStart: addDays(comparisonRange.startTime, -180) },
    appliedFilters: {
      runtimeKind: input.runtimeKind || null,
      providerKey: input.providerKey || null,
      modelKey: input.modelKey || null,
    },
    selectedAggregate,
    selectedCostQuality,
    comparisonAggregate: partial || unavailable ? null : comparisonAggregate,
    comparisonCostQuality: partial || unavailable ? null : selectedCostQuality,
    activeDayCount: rows.length ? 6 : 0,
    trendBuckets,
    comparisonBuckets,
    breakdownRows: rows,
    filterOptions: {
      runtimeKinds: ['autobyteus', 'codex_app_server', 'claude_agent_sdk'],
      providers: [
        { key: 'openai', modelProvider: 'openai', providerName: 'openai', displayName: 'OpenAI' },
        { key: 'anthropic', modelProvider: 'anthropic', providerName: 'anthropic', displayName: 'Anthropic' },
        { key: 'local', modelProvider: 'local', providerName: 'local', displayName: 'Local' },
      ],
      models: baseBreakdownRows().map(row => ({ key: row.modelKey, modelIdentifier: row.modelIdentifier, modelValue: row.modelValue, displayName: row.modelDisplayName })),
    },
  }
}

const teamAggregate = aggregate({ input: 88_000, cached: 16_000, cacheCreated: 3_000, output: 27_000, reasoning: 7_000, inputCost: 0.31, outputCost: 0.68, totalCost: 0.99, reports: 12, runtime: 'codex_app_server', model: 'gpt-5.6-sol', provider: 'openai' })
const researcherAggregate = aggregate({ input: 52_000, cached: 10_000, output: 17_000, reasoning: 5_000, inputCost: 0.19, outputCost: 0.43, totalCost: 0.62, reports: 7, runtime: 'codex_app_server', model: 'gpt-5.6-sol', provider: 'openai' })
const writerAggregate = aggregate({ input: 36_000, cached: 6_000, cacheCreated: 3_000, output: 10_000, reasoning: 2_000, inputCost: 0.12, outputCost: 0.25, totalCost: 0.37, reports: 5, runtime: 'claude_agent_sdk', model: 'claude-sonnet-4.5', provider: 'anthropic' })
const agentAggregate = aggregate({ input: 21_000, cached: 2_500, output: 6_500, reasoning: 1_200, inputCost: 0.08, outputCost: 0.16, totalCost: 0.24, reports: 3, runtime: 'autobyteus', model: 'gpt-prototype', provider: 'mock' })

export const createTokenUsageRunStatistics = (scenario = 'populated') => {
  if (scenario === 'token_empty' || scenario === 'token_unavailable') return { taskRows: [], modelRows: [] }
  const children = [
    { __typename: 'TokenUsageTaskStatisticsRowGraphql', rowId: 'member:researcher', rowKind: 'MEMBER_RUN', runId: 'team-member-researcher-001', taskId: null, rootTeamRunId: 'team-run-product-001', displayName: '/researcher', summary: 'Evidence review', createdAt: '2026-08-28T09:00:00.000Z', createdTimeSource: 'RUN_HISTORY', models: ['gpt-5.6-sol'], modelDisplayNames: ['GPT-5.6 Sol'], runtimeKinds: ['codex_app_server'], aggregate: researcherAggregate, children: [] },
    { __typename: 'TokenUsageTaskStatisticsRowGraphql', rowId: 'member:writer', rowKind: 'MEMBER_RUN', runId: 'team-member-writer-001', taskId: null, rootTeamRunId: 'team-run-product-001', displayName: '/writer', summary: 'Baseline report', createdAt: '2026-08-28T09:00:00.000Z', createdTimeSource: 'RUN_HISTORY', models: ['claude-sonnet-4.5'], modelDisplayNames: ['Claude Sonnet 4.5'], runtimeKinds: ['claude_agent_sdk'], aggregate: writerAggregate, children: [] },
  ]
  const taskRows = [
    { __typename: 'TokenUsageTaskStatisticsRowGraphql', rowId: 'team:product-review', rowKind: 'TEAM_RUN', runId: 'team-run-product-001', taskId: null, rootTeamRunId: 'team-run-product-001', displayName: 'Product Review Team', summary: 'Validate current Token Statistics experience', createdAt: '2026-08-28T09:00:00.000Z', createdTimeSource: 'RUN_HISTORY', models: ['gpt-5.6-sol', 'claude-sonnet-4.5'], modelDisplayNames: ['GPT-5.6 Sol', 'Claude Sonnet 4.5'], runtimeKinds: ['codex_app_server', 'claude_agent_sdk'], aggregate: teamAggregate, children },
    { __typename: 'TokenUsageTaskStatisticsRowGraphql', rowId: 'agent:research', rowKind: 'AGENT_RUN', runId: 'run-agent-research-001', taskId: null, rootTeamRunId: null, displayName: 'Research Assistant', summary: 'Inspect selected source evidence', createdAt: '2026-08-27T15:30:00.000Z', createdTimeSource: 'FIRST_USAGE_OBSERVED', models: ['gpt-prototype'], modelDisplayNames: ['GPT Prototype'], runtimeKinds: ['autobyteus'], aggregate: agentAggregate, children: [] },
  ]
  const modelRow = (runtimeKind, llmModel, modelDisplayName, value) => ({
    __typename: 'UsageStatisticsGraphql',
    rowId: `runtime-model:${runtimeKind}:${llmModel}`,
    runtimeKind,
    llmModel,
    modelDisplayName,
    inputTokens: value.grossInputTokens,
    cacheReadInputTokens: value.cacheReadInputTokens,
    cacheCreationInputTokens: value.cacheCreationInputTokens,
    cacheReadInputTokenRate: value.cacheReadInputTokenRate,
    cacheState: value.cacheState,
    outputTokens: value.outputTokens,
    thinkingTokens: value.reasoningOutputTokens,
    inputCost: value.estimatedApiInputCost,
    outputCost: value.estimatedApiOutputCost,
    thinkingCost: value.estimatedApiReasoningOutputCost,
    totalCost: value.estimatedApiTotalCost,
    currency: value.currency,
    apiCostStatus: value.apiCostStatus,
    aggregate: value,
  })
  const modelRows = [
    modelRow('codex_app_server', 'gpt-5.6-sol', 'GPT-5.6 Sol', researcherAggregate),
    modelRow('claude_agent_sdk', 'claude-sonnet-4.5', 'Claude Sonnet 4.5', writerAggregate),
    modelRow('autobyteus', 'gpt-prototype', 'GPT Prototype', agentAggregate),
  ]
  return { taskRows, modelRows }
}
