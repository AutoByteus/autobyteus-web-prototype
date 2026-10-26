import type { RouterStatus } from '~/prototype/model-routing/modelRoutingState'
import type { RoutingSource } from '~/prototype/model-routing/modelRoutingData'
import { ANCHOR_MS } from '~/prototype/model-routing/modelRoutingData'

type T = (key: any, params?: Record<string, string | number>) => string

/** Why the router is not active, in one sentence (the same words the delegation notes use). */
export const routerProblem = (status: RouterStatus, t: T, locale: string): string => {
  switch (status.kind) {
    case 'not_set': return t('settings.modelRouting.problem.notSet')
    case 'blocked': return status.until
      ? t('settings.modelRouting.problem.blockedUntil', { runtime: status.runtimeName, model: status.model, time: shortDate(Date.parse(status.until), locale), by: status.by })
      : t('settings.modelRouting.problem.blocked', { runtime: status.runtimeName, model: status.model, by: status.by })
    case 'model_missing': return t('settings.modelRouting.problem.modelMissing', { runtime: status.runtimeName, model: status.model })
    case 'runtime_missing': return t('settings.modelRouting.problem.runtimeMissing', { runtime: status.runtimeName })
    case 'unknown': return t('settings.modelRouting.problem.unknown', { runtime: status.runtimeName, reason: status.reason })
    default: return ''
  }
}

export const shortDate = (ms: number, locale: string): string =>
  new Intl.DateTimeFormat(locale || 'en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(ms))

const clock = (ms: number, locale: string): string =>
  new Intl.DateTimeFormat(locale || 'en', { hour: '2-digit', minute: '2-digit' }).format(new Date(ms))

/** "Today, 09:12", "Yesterday, 18:30", "Oct 24, 18:30" (relative to the design's fixed anchor). */
export const decisionTime = (ms: number, locale: string, t: T): string => {
  const dayOf = (value: number) => new Date(value).toDateString()
  if (dayOf(ms) === dayOf(ANCHOR_MS)) return t('settings.modelRouting.time.today', { time: clock(ms, locale) })
  if (dayOf(ms) === dayOf(ANCHOR_MS - 86_400_000)) return t('settings.modelRouting.time.yesterday', { time: clock(ms, locale) })
  return shortDate(ms, locale)
}

export const SOURCE_KEY: Readonly<Record<RoutingSource, string>> = {
  router: 'settings.modelRouting.source.router',
  agent_default: 'settings.modelRouting.source.agent_default',
  team_default: 'settings.modelRouting.source.team_default',
  inherited: 'settings.modelRouting.source.inherited',
}

/** The router's own label for the kind of Task ("implementation" → "Implementation"); there is no list to manage. */
export const kindLabel = (kind: string | null, t: T): string => kind ? kind.charAt(0).toUpperCase() + kind.slice(1) : t('settings.modelRouting.kind.none')
