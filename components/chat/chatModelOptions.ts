import { getThinkingParamKeys } from '~/utils/llmThinkingConfigAdapter'
import type { UiModelConfigSchema } from '~/utils/llmConfigSchema'
import { humanizeThinkingValue } from '~/components/chat/chatThinkingMenu'

/**
 * run-settings-ui-unification (SR-005, REQ-022): the selected model's **other model settings**, the
 * config-schema parameters that are not thinking settings (e.g. Codex Fast mode, `service_tier`).
 * Each one is its own small control next to Thinking: a toggle when it is "Default or one value"
 * (or a boolean), otherwise a choice. "Default" leaves the parameter unset.
 */
type ModelConfig = Record<string, unknown>

export type ModelOptionChoice = { id: string; label: string; value: unknown; checked: boolean }
export type ModelOption = {
  key: string
  /** From the schema title (e.g. "Fast mode"). */
  title: string
  kind: 'toggle' | 'choice'
  /** Toggle: the value set when on, and its label (e.g. "fast" → "Fast"). */
  onValue: unknown
  onLabel: string
  /** Whether a non-default value is set. */
  set: boolean
  /** The current value's label ("Default" when unset). */
  valueLabel: string
  choices: ModelOptionChoice[]
  icon: string
}

/**
 * Known settings get a meaningful icon; any other setting uses a neutral one. The "on" state uses the
 * solid variant (heroicons:bolt-solid, heroicons:adjustments-horizontal-solid).
 */
const ICONS: Record<string, string> = { service_tier: 'heroicons:bolt' }

const labelOf = (value: unknown): string => {
  if (value === true) return 'On'
  if (value === false) return 'Off'
  return humanizeThinkingValue(String(value))
}

export const otherModelSettingKeys = (schema: UiModelConfigSchema | null): string[] => {
  if (!schema) return []
  const thinking = new Set(getThinkingParamKeys(schema))
  return Object.keys(schema).filter((key) => !thinking.has(key)
    && (Array.isArray(schema[key]?.enum) ? Boolean(schema[key]!.enum!.length) : schema[key]?.type === 'boolean'))
}

export const buildModelOptions = (
  schema: UiModelConfigSchema | null,
  config: ModelConfig | null | undefined,
  defaultLabel: string,
): ModelOption[] => otherModelSettingKeys(schema).map((key) => {
  const param = schema![key]!
  const values: unknown[] = Array.isArray(param.enum) && param.enum.length ? param.enum : [true]
  const current = config?.[key]
  const isSet = current !== undefined && current !== null && (param.type !== 'boolean' || current === true)
  const title = param.title?.trim() || humanizeThinkingValue(key)
  const kind = values.length === 1 ? 'toggle' : 'choice'
  return {
    key,
    title,
    kind,
    onValue: values[0],
    onLabel: param.type === 'boolean' ? title : labelOf(values[0]),
    set: isSet,
    valueLabel: isSet ? labelOf(current) : defaultLabel,
    choices: [
      { id: 'default', label: defaultLabel, value: undefined, checked: !isSet },
      ...values.map((value) => ({ id: String(value), label: labelOf(value), value, checked: isSet && Object.is(current, value) })),
    ],
    icon: ICONS[key] ?? 'heroicons:adjustments-horizontal',
  }
})

/** The config with one other setting set, or removed for "Default". Thinking keys are kept. */
export const applyModelOption = (config: ModelConfig | null | undefined, key: string, value: unknown): ModelConfig | null => {
  const next: ModelConfig = { ...(config ?? {}) }
  if (value === undefined || value === null || value === false) delete next[key]
  else next[key] = value
  return Object.keys(next).length ? next : null
}

/** Labels of the other settings that are set, for one-line summaries (e.g. "Fast"). */
export const setModelOptionLabels = (options: readonly ModelOption[]): string[] =>
  options.filter((option) => option.set).map((option) => (option.kind === 'toggle' ? option.onLabel : `${option.title}: ${option.valueLabel}`))

/** The config without the other settings, to compare thinking alone. */
export const withoutModelOptions = (schema: UiModelConfigSchema | null, config: ModelConfig | null | undefined): ModelConfig | null => {
  if (!config) return null
  const next = { ...config }
  for (const key of otherModelSettingKeys(schema)) delete next[key]
  return Object.keys(next).length ? next : null
}
