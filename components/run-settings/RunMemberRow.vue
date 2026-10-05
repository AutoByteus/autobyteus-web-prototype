<template>
  <div :data-test="`run-member-${node.key}`" :data-customized="isCustomized ? 'true' : 'false'">
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
        <Icon icon="heroicons:arrow-uturn-left" class="h-3.5 w-3.5" aria-hidden="true" />
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
import { countCustomized, hasCustomization, type RunMemberNode, type RunSettingField, type RunSettingFlags } from './runSettings'
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
const missingModel = computed(() => props.node.fields.includes('model') && !props.node.values.llmModelIdentifier)
</script>
