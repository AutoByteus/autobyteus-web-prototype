import { computed, type ComputedRef } from 'vue'
import { useActiveContextStore } from '~/stores/activeContextStore'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { useAgentTeamDefinitionStore } from '~/stores/agentTeamDefinitionStore'
import { useLocalization } from '~/composables/useLocalization'
import { initialsFor, type ChatTargetOption } from '~/components/chat/chatComposerMenus'
import { DEFAULT_CHAT_AGENT_DEFINITION_ID } from '~/utils/chat/chatDefaults'
import { resolveRunMentionScope } from '~/prototype/run-mentions/runMentionScopes'
import { illustrativeRunMentionDefinitions } from '~/prototype/run-mentions/runMentionFixtures'
import {
  draftMentionKeys,
  runMentionRoute,
  type RunMentionDefinition,
} from '~/prototype/run-mentions/runMentionState'

/** A shared Agent or Team offered by `@` in a live run, with its relation to that run. */
export interface RunMentionOption extends ChatTargetOption {
  definition: RunMentionDefinition
  /** Already reachable in this run (a configured member or an added collaborator). */
  inRun: boolean
}

/** A chosen mention that is still present in the composer text. */
export interface RunMentionChip {
  key: string
  kind: 'agent' | 'team'
  name: string
  inRun: boolean
}

export const mentionToken = (name: string): string => `@${name}`

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** True when `@Name` appears in the text as a whole mention (not a prefix of a longer word). */
export const textHasMention = (text: string, name: string): boolean =>
  new RegExp(`(^|\\s)${escapeRegExp(mentionToken(name))}(?![\\w-])`).test(text)

/** Splits text into plain parts and the known `@Name` mentions it contains. */
export const splitMentionText = (
  text: string,
  names: readonly string[],
): Array<{ kind: 'text' | 'mention'; value: string }> => {
  const known = [...names].filter(Boolean).sort((left, right) => right.length - left.length)
  if (!known.length || !text.includes('@')) return [{ kind: 'text', value: text }]
  const pattern = new RegExp(`(^|\\s)(${known.map((name) => escapeRegExp(mentionToken(name))).join('|')})(?![\\w-])`, 'g')
  const parts: Array<{ kind: 'text' | 'mention'; value: string }> = []
  let cursor = 0
  for (const match of text.matchAll(pattern)) {
    const start = (match.index ?? 0) + match[1]!.length
    if (start > cursor) parts.push({ kind: 'text', value: text.slice(cursor, start) })
    parts.push({ kind: 'mention', value: match[2]!.slice(1) })
    cursor = start + match[2]!.length
  }
  if (cursor < text.length) parts.push({ kind: 'text', value: text.slice(cursor) })
  return parts
}

/** Shared Agents (except the default chat agent) and Teams, plus the illustrative review fixtures. */
export const listRunMentionDefinitions = (): RunMentionDefinition[] => {
  const agentDefinitionStore = useAgentDefinitionStore()
  const teamDefinitionStore = useAgentTeamDefinitionStore()
  return [
    ...agentDefinitionStore.sharedAgentDefinitions
      .filter((definition) => definition.id !== DEFAULT_CHAT_AGENT_DEFINITION_ID)
      .map((definition): RunMentionDefinition => ({
        key: `agent:${definition.id}`, kind: 'agent', id: definition.id, name: definition.name,
        description: definition.description, members: [], unrunnableReason: null,
      })),
    ...illustrativeRunMentionDefinitions.filter((definition) => definition.kind === 'agent'),
    ...teamDefinitionStore.sharedAgentTeamDefinitions.map((team): RunMentionDefinition => ({
      key: `team:${team.id}`, kind: 'team', id: team.id, name: team.name, description: '',
      members: [
        ...team.nodes.filter((node) => node.memberName === team.coordinatorMemberName),
        ...team.nodes.filter((node) => node.memberName !== team.coordinatorMemberName),
      ].map((node) => ({ name: node.memberName, agentDefinitionId: node.ref })),
      unrunnableReason: null,
    })),
    ...illustrativeRunMentionDefinitions.filter((definition) => definition.kind === 'team'),
  ]
}

/**
 * `@` in a live run (cross-scope-agent-mentions): shared Agents and Teams that can be brought
 * into the current run. Agent Orgs are not offered. Supplied for Team runs, Org runs and
 * standalone Agent runs; launch drafts return `available: false`.
 */
export function useRunMentions() {
  const activeContextStore = useActiveContextStore()
  const { t } = useLocalization()

  const target = computed(() => activeContextStore.activeWorkspaceTarget)
  const scope = computed(() => resolveRunMentionScope())
  const available = computed(() => Boolean(scope.value))
  const rootRunId = computed(() => scope.value?.rootRunId ?? null)
  const focusedRunId = computed(() => scope.value?.focusedRunId ?? null)
  const focusedName = computed(() => scope.value?.focusedName ?? '')
  const route = computed(() => runMentionRoute())

  const definitions = computed<RunMentionDefinition[]>(() => listRunMentionDefinitions())
  const inRunKeys = computed<ReadonlySet<string>>(() => scope.value?.inRunKeys ?? new Set<string>())

  const options = computed<RunMentionOption[]>(() => definitions.value.map((definition) => ({
    key: definition.key,
    kind: definition.kind,
    id: definition.id,
    name: definition.name,
    initials: initialsFor(definition.name),
    description: definition.kind === 'team'
      ? t('chat.targets.teamDescription', { count: definition.members.length, coordinator: definition.members[0]?.name ?? '' })
      : definition.description,
    definition,
    inRun: inRunKeys.value.has(definition.key),
  }))
    // Agents, then Teams; within each, what can still be brought in comes first.
    .map((option, index) => ({ option, index }))
    .sort((left, right) => Number(left.option.kind === 'team') - Number(right.option.kind === 'team')
      || Number(left.option.inRun) - Number(right.option.inRun)
      || left.index - right.index)
    .map((entry) => entry.option))

  const chips = computed<RunMentionChip[]>(() => {
    const text = target.value?.context.requirement ?? ''
    return draftMentionKeys(focusedRunId.value)
      .map((key) => options.value.find((option) => option.key === key))
      .filter((option): option is RunMentionOption => Boolean(option) && textHasMention(text, option!.name))
      .map((option) => ({ key: option.key, kind: option.kind, name: option.name, inRun: option.inRun }))
  })

  return { available, rootRunId, focusedRunId, focusedName, route, options, chips }
}

/** Names that render as mention chips in sent messages. */
export function useRunMentionNames(): ComputedRef<string[]> {
  const agentDefinitionStore = useAgentDefinitionStore()
  const teamDefinitionStore = useAgentTeamDefinitionStore()
  return computed(() => [
    ...agentDefinitionStore.sharedAgentDefinitions.map((definition) => definition.name),
    ...teamDefinitionStore.sharedAgentTeamDefinitions.map((team) => team.name),
    ...illustrativeRunMentionDefinitions.map((definition) => definition.name),
  ])
}
