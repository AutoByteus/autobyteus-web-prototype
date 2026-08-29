import { describe, expect, it } from 'vitest'
import {
  createTokenUsageAnalyticsResult,
  createTokenUsageRunStatistics,
} from '../shared/token-statistics-refresh-fixture.js'

describe('Token Statistics refresh fixtures', () => {
  it('keeps populated analytics deterministic and filterable', () => {
    const populated = createTokenUsageAnalyticsResult({}, 'populated')
    expect(populated.breakdownRows).toHaveLength(3)
    expect(populated.selectedAggregate.totalTokens).toBe(152_000)
    expect(populated.selectedCostQuality.kind).toBe('COMPLETE')

    const filtered = createTokenUsageAnalyticsResult({ runtimeKind: 'codex_app_server' }, 'populated')
    expect(filtered.breakdownRows).toHaveLength(1)
    expect(filtered.selectedAggregate.totalTokens).toBe(80_000)
  })

  it('represents empty, unavailable, partial, mixed-currency, and local-only states', () => {
    expect(createTokenUsageAnalyticsResult({}, 'token_empty')).toEqual(expect.objectContaining({
      coverage: expect.objectContaining({ status: 'FULL' }),
      selectedCostQuality: expect.objectContaining({ kind: 'NO_USAGE' }),
      activeDayCount: 0,
    }))
    expect(createTokenUsageAnalyticsResult({}, 'token_unavailable')).toEqual(expect.objectContaining({
      coverage: expect.objectContaining({ status: 'UNAVAILABLE' }),
      selectedCostQuality: expect.objectContaining({ kind: 'NO_USAGE' }),
    }))
    expect(createTokenUsageAnalyticsResult({}, 'token_partial')).toEqual(expect.objectContaining({
      coverage: expect.objectContaining({ status: 'PARTIAL' }),
      selectedCostQuality: expect.objectContaining({ kind: 'PARTIAL' }),
      comparisonRange: null,
    }))
    expect(createTokenUsageAnalyticsResult({}, 'token_mixed_currency')).toEqual(expect.objectContaining({
      selectedCostQuality: expect.objectContaining({ kind: 'MIXED_CURRENCY' }),
    }))
    expect(createTokenUsageAnalyticsResult({}, 'token_local')).toEqual(expect.objectContaining({
      selectedCostQuality: expect.objectContaining({ kind: 'LOCAL' }),
      breakdownRows: [expect.objectContaining({ runtimeKind: 'autobyteus' })],
    }))
  })

  it('provides the expandable Team hierarchy and model grouping used by Run details', () => {
    const populated = createTokenUsageRunStatistics('populated')
    expect(populated.taskRows).toHaveLength(2)
    expect(populated.taskRows[0]).toEqual(expect.objectContaining({
      rowKind: 'TEAM_RUN',
      children: [
        expect.objectContaining({ displayName: '/researcher' }),
        expect.objectContaining({ displayName: '/writer' }),
      ],
    }))
    expect(populated.modelRows).toHaveLength(3)
    expect(createTokenUsageRunStatistics('token_empty')).toEqual({ taskRows: [], modelRows: [] })
  })
})
