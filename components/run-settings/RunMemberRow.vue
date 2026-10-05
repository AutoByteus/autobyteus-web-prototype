<template>
  <!-- Round 14 (member panel): two-line rows, a Customized label, and one soft surface for an
       opened member. The boxed variant below is the saved-run view. -->
  <div
    v-if="flat"
    :data-test="`run-member-${node.key}`"
    :data-customized="isCustomized ? 'true' : 'false'"
    class="rounded-lg transition-colors"
    :class="expanded ? 'bg-gray-50' : ''"
  >
    <div
      class="group flex items-center gap-1 rounded-lg pr-1 transition-colors"
      :class="expanded ? '' : 'hover:bg-gray-100/70'"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        :aria-expanded="expanded ? 'true' : 'false'"
        :aria-label="$t('runSettings.members.toggleAria', { name: node.name })"
        :title="node.detail || node.name"
        data-test="run-member-toggle"
        @click="emit('toggle', node.key)"
      >
        <span
          v-if="node.kind === 'team'"
          class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
          aria-hidden="true"
        >
          <Icon icon="heroicons:user-group" class="h-4 w-4" />
        </span>
        <span
          v-else
          class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[0.6875rem] font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-100"
          aria-hidden="true"
        >{{ initialsFor(node.name) }}</span>
        <span class="min-w-0 flex-1">
          <span class="flex min-w-0 items-center gap-2">
            <span class="truncate text-sm font-medium text-gray-900">{{ node.name }}</span>
            <span v-if="node.isCoordinator" class="flex-shrink-0 rounded-full bg-gray-100 px-1.5 py-px text-[0.6875rem] font-medium text-gray-600">{{ $t('runSettings.members.coordinator') }}</span>
          </span>
          <span class="mt-0.5 flex min-w-0 items-center gap-1 text-xs" data-test="run-member-summary">
            <template v-if="missingModel">
              <span class="truncate font-medium text-amber-700">{{ $t('chat.model.chooseModel') }}</span>
            </template>
            <template v-else>
              <span v-if="isCustomized" class="flex-shrink-0 font-medium text-blue-700">{{ $t('runSettings.members.customizedLabel') }}</span>
              <span v-if="isCustomized" class="flex-shrink-0 text-gray-300" aria-hidden="true">·</span>
              <span v-else-if="childCustomizedCount" class="flex-shrink-0 font-medium text-blue-700">{{ $t('runSettings.members.customizedCount', { count: childCustomizedCount }) }}</span>
              <span v-if="!isCustomized && childCustomizedCount" class="flex-shrink-0 text-gray-300" aria-hidden="true">·</span>
              <span class="truncate text-gray-500">{{ effectiveSummary }}</span>
            </template>
          </span>
        </span>
      </button>
      <button
        v-if="isCustomized && !readOnly"
        type="button"
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-white hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        :aria-label="$t('runSettings.members.resetMemberAria', { name: node.name })"
        :title="$t('runSettings.members.resetMemberAria', { name: node.name })"
        data-test="run-member-reset"
        @click="emit('reset', node.key, null)"
      >
        <Icon icon="heroicons:arrow-uturn-left-solid" class="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        tabindex="-1"
        aria-hidden="true"
        class="inline-flex h-8 w-7 flex-shrink-0 items-center justify-center text-gray-400"
        @click="emit('toggle', node.key)"
      >
        <Icon icon="heroicons:chevron-down" class="h-4 w-4 transition-transform duration-150 motion-reduce:transition-none" :class="expanded ? 'rotate-180' : ''" />
      </button>
    </div>

    <!-- One surface: the opened member's settings sit under its name, on the same light block. -->
    <div v-if="expanded" class="pb-3 pl-[3.25rem] pr-3" data-test="run-member-detail">
      <RunSettingsCard
        nested
        flat
        :values="node.values"
        :fields="node.fields"
        :customized="node.customized"
        :inherited-label="inheritedLabel"
        :locked="locked"
        :runtime-locked="runtimeLocked"
        :resettable="!readOnly"
        :test-suffix="node.key"
        @update:workspace="emit('update', node.key, 'workspace', $event)"
        @update:model="emit('update', node.key, 'model', $event)"
        @update:thinking="emit('update', node.key, 'thinking', $event)"
        @update:approval="emit('update', node.key, 'approval', $event)"
        @reset="emit('reset', node.key, $event)"
      />
      <template v-if="node.children?.length">
        <p class="mb-1 mt-3 text-[0.6875rem] font-medium uppercase tracking-wide text-gray-400">{{ $t('runSettings.members.title') }}</p>
        <div class="-ml-2 space-y-0.5">
          <RunMemberRow
            v-for="child in node.children"
            :key="child.key"
            :node="child"
            :expanded-keys="expandedKeys"
            :inherited-label="$t('runSettings.inherited.team')"
            :defaults-label="$t('runSettings.members.usesTeamDefaults')"
            :locked="locked"
            :runtime-locked="runtimeLocked"
            :read-only="readOnly"
            flat
            @toggle="emit('toggle', $event)"
            @update="(key, field, value) => emit('update', key, field, value)"
            @reset="(key, field) => emit('reset', key, field)"
          />
        </div>
      </template>
    </div>
  </div>
  <div v-else :data-test="`run-member-${node.key}`" :data-customized="isCustomized ? 'true' : 'false'">
    <div class="flex items-center gap-1" :class="flat ? 'min-h-[3rem]' : ['min-h-[2.75rem] pl-3 pr-2', expanded ? 'bg-gray-50/70' : 'hover:bg-gray-50/70']">
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2.5 rounded-md py-1.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        :aria-expanded="expanded ? 'true' : 'false'"
        :aria-label="$t('runSettings.members.toggleAria', { name: node.name })"
        :title="node.detail || node.name"
        data-test="run-member-toggle"
        @click="emit('toggle', node.key)"
      >
        <span
          v-if="node.kind === 'team'"
          class="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-slate-500"
          aria-hidden="true"
        >
          <Icon icon="heroicons:user-group" class="h-3.5 w-3.5" />
        </span>
        <span
          v-else
          class="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-[0.5625rem] font-semibold text-slate-600"
          aria-hidden="true"
        >{{ initialsFor(node.name) }}</span>

        <span class="flex min-w-0 flex-shrink items-baseline gap-1.5">
          <span class="truncate text-[0.8125rem] font-medium text-gray-900">{{ node.name }}</span>
          <span v-if="node.isCoordinator" class="flex-shrink-0 text-[0.6875rem] text-gray-400 max-sm:hidden">{{ $t('runSettings.members.coordinator') }}</span>
          <span v-if="node.kind === 'team' && !flat" class="flex-shrink-0 text-[0.6875rem] text-gray-400">{{ $t('runSettings.members.memberCount', { count: node.children?.length ?? 0 }) }}</span>
        </span>

        <span class="ml-auto flex min-w-0 items-center justify-end gap-1.5 pl-3 text-xs" data-test="run-member-summary">
          <template v-if="missingModel">
            <span class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
            <span class="truncate text-amber-700 max-sm:hidden">{{ $t('chat.model.chooseModel') }}</span>
          </template>
          <template v-else-if="summary.length">
            <span class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
            <span class="truncate text-gray-700 max-sm:hidden">{{ summary.join(' · ') }}</span>
          </template>
          <span v-else-if="childCustomizedCount" class="truncate text-gray-500 max-sm:hidden">{{ $t('runSettings.members.customizedCount', { count: childCustomizedCount }) }}</span>
          <span v-else-if="!flat" class="truncate text-gray-400 max-sm:hidden">{{ defaultsLabel }}</span>
        </span>
      </button>

      <button
        v-if="isCustomized && !readOnly"
        type="button"
        class="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        :aria-label="$t('runSettings.members.resetMemberAria', { name: node.name })"
        :title="$t('runSettings.members.resetMemberAria', { name: node.name })"
        data-test="run-member-reset"
        @click="emit('reset', node.key, null)"
      >
        <Icon icon="heroicons:arrow-uturn-left-solid" class="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        tabindex="-1"
        aria-hidden="true"
        class="inline-flex h-7 w-6 flex-shrink-0 items-center justify-center text-gray-400"
        @click="emit('toggle', node.key)"
      >
        <Icon icon="heroicons:chevron-down" class="h-3.5 w-3.5 transition-transform duration-150 motion-reduce:transition-none" :class="expanded ? 'rotate-180' : ''" />
      </button>
    </div>

    <div v-if="expanded" :class="flat ? 'pb-3 pl-[2.125rem]' : 'bg-gray-50/70 pb-3 pl-[2.875rem] pr-3'" data-test="run-member-detail">
      <RunSettingsCard
        nested
        :flat="flat"
        :values="node.values"
        :fields="node.fields"
        :customized="node.customized"
        :inherited-label="inheritedLabel"
        :locked="locked"
        :runtime-locked="runtimeLocked"
        :resettable="!readOnly"
        :test-suffix="node.key"
        @update:workspace="emit('update', node.key, 'workspace', $event)"
        @update:model="emit('update', node.key, 'model', $event)"
        @update:thinking="emit('update', node.key, 'thinking', $event)"
        @update:approval="emit('update', node.key, 'approval', $event)"
        @reset="emit('reset', node.key, $event)"
      />

      <template v-if="node.children?.length">
        <p class="mb-1.5 mt-3 text-[0.6875rem] font-medium text-gray-400">{{ flat ? $t('runSettings.members.title') : $t('runSettings.members.teamMembers', { team: node.name }) }}</p>
        <div :class="flat ? 'divide-y divide-gray-100 border-t border-gray-100' : 'divide-y divide-gray-100 rounded-md border border-gray-200 bg-white [&>*:first-child>div:first-child]:rounded-t-md [&>*:last-child>div:first-child]:rounded-b-md'">
          <RunMemberRow
            v-for="child in node.children"
            :key="child.key"
            :node="child"
            :expanded-keys="expandedKeys"
            :inherited-label="$t('runSettings.inherited.team')"
            :defaults-label="$t('runSettings.members.usesTeamDefaults')"
            :locked="locked"
            :runtime-locked="runtimeLocked"
            :read-only="readOnly"
            :flat="flat"
            @toggle="emit('toggle', $event)"
            @update="(key, field, value) => emit('update', key, field, value)"
            @reset="(key, field) => emit('reset', key, field)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { initialsFor } from '~/components/chat/chatComposerMenus'
import RunSettingsCard from './RunSettingsCard.vue'
import { countCustomized, hasCustomization, isApprovalLockedForRuntime, type RunMemberNode, type RunSettingField, type RunSettingFlags } from './runSettings'
import { useRunSettingsPresentation } from './useRunSettingsPresentation'

defineOptions({ name: 'RunMemberRow' })

const props = withDefaults(defineProps<{
  node: RunMemberNode
  expandedKeys: ReadonlySet<string>
  inheritedLabel: string
  defaultsLabel: string
  locked?: RunSettingFlags
  runtimeLocked?: boolean
  readOnly?: boolean
  flat?: boolean
}>(), { locked: () => ({}), runtimeLocked: false, readOnly: false, flat: false })

const emit = defineEmits<{
  (event: 'toggle', key: string): void
  (event: 'update', key: string, field: RunSettingField, value: unknown): void
  (event: 'reset', key: string, field: RunSettingField | null): void
}>()

const presentation = useRunSettingsPresentation()
const expanded = computed(() => props.expandedKeys.has(props.node.key))
const isCustomized = computed(() => hasCustomization(props.node.customized))
const summary = computed(() => presentation.customizedSummary(props.node.values, props.node.customized, props.node.fields))
const childCustomizedCount = computed(() => countCustomized(props.node.children ?? []))
/** What this member runs with, in one line: workspace (teams), model · runtime, approval. */
const effectiveSummary = computed(() => {
  const values = props.node.values
  const parts: string[] = []
  if (props.node.fields.includes('workspace')) parts.push(presentation.workspaceName(values.workspace))
  if (values.llmModelIdentifier) parts.push(`${presentation.modelLabel(values)} · ${presentation.runtimeShortLabel(values.runtimeKind)}`)
  parts.push(presentation.approvalLabel(values.autoExecuteTools || isApprovalLockedForRuntime(values.runtimeKind)))
  return parts.filter(Boolean).join(' · ')
})
const missingModel = computed(() => props.node.fields.includes('model') && !props.node.values.llmModelIdentifier)
</script>
