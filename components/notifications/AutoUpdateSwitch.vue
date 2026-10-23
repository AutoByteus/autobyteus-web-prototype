<template>
  <!-- The automatic-update switch of one kind, with what turning it on means, right where the user sees the update
       (the panel) and in the Update checks card (the full home). One setting: both places read and write the same store.
       `panel`: a quiet well under the section header; `card`: a row of the card's inner list. -->
  <div
    :class="variant === 'panel' ? 'mt-1 border-b border-gray-100 pb-2.5' : 'px-4 py-3.5'"
    :data-testid="`auto-update-${kind}`"
    :data-variant="variant"
  >
    <div class="flex items-center justify-between gap-3">
      <span :id="labelId" class="min-w-0 font-medium text-gray-900" :class="variant === 'panel' ? 'text-xs leading-5' : 'text-sm font-semibold'">{{ label }}</span>
      <button
        type="button"
        role="switch"
        class="relative inline-flex flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        :class="[variant === 'panel' ? 'h-5 w-9' : 'h-6 w-11', enabled ? 'bg-emerald-500' : 'bg-slate-300']"
        :aria-checked="enabled"
        :aria-labelledby="labelId"
        :aria-describedby="describedBy"
        :disabled="settings.status !== 'resolved' || saving"
        :data-testid="`auto-update-${kind}-toggle`"
        @click="toggle"
      >
        <span
          aria-hidden="true"
          class="inline-block transform rounded-full bg-white shadow-sm transition-transform"
          :class="variant === 'panel' ? ['h-4 w-4', enabled ? 'translate-x-[18px]' : 'translate-x-0.5'] : ['h-5 w-5', enabled ? 'translate-x-5' : 'translate-x-0.5']"
        />
      </button>
    </div>
    <p :id="explainId" class="mt-0.5 text-xs leading-5" :class="variant === 'card' ? 'text-gray-600 sm:text-[13px] sm:leading-5' : 'text-gray-500'" :data-testid="`auto-update-${kind}-explanation`">{{ $t(`settings.notifications.auto.${enabled ? 'explainOn' : 'explain'}.${kind}`) }}</p>
    <p v-if="enabled && checksOff" :id="noEffectId" class="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-amber-800" :data-testid="`auto-update-${kind}-no-effect`">
      <Icon icon="heroicons:pause-circle-20-solid" class="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" />{{ $t('settings.notifications.auto.noEffect') }}
    </p>
    <p v-else-if="enabled && applyingCount > 0" :id="noEffectId" class="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-sky-800" role="status" :data-testid="`auto-update-${kind}-applying`">
      <Icon icon="heroicons:clock-20-solid" class="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-600" aria-hidden="true" />{{ $t(`settings.notifications.auto.applying.${applyingCount === 1 ? 'one' : 'other'}`, { count: applyingCount }) }}
    </p>
    <p v-if="failed" class="mt-1.5 text-xs leading-5 text-red-700" role="alert" :data-testid="`auto-update-${kind}-error`">{{ $t('settings.notifications.auto.saveFailed') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import { useUpdateAutomationStore } from '~/stores/updateAutomationStore'
import { useUpdateChecksCapabilityStore } from '~/stores/capabilities/updateChecksCapabilityStore'
import type { UpdateAutomationSwitch } from '~/types/updateNotifications'

const props = defineProps<{
  kind: 'agent_package' | 'skill_source' | 'agent_runtime'
  variant: 'panel' | 'card'
  /** Panel: waiting rows this switch will apply within about a minute once it is on. */
  applyingCount?: number
}>()
const { t } = useLocalization()
const settings = useUpdateAutomationStore()
const updateChecks = useUpdateChecksCapabilityStore()
const saving = ref(false)
const failed = ref(false)
const labelId = `auto-update-label-${useId()}`
const explainId = `auto-update-explain-${useId()}`
const noEffectId = `auto-update-note-${useId()}`

const SETTING: Record<typeof props.kind, UpdateAutomationSwitch> = {
  agent_package: 'autoUpdatePackages', skill_source: 'autoUpdateSkills', agent_runtime: 'autoUpdateRuntimes',
}
const enabled = computed(() => settings.resolved?.[SETTING[props.kind]] === true)
const checksOff = computed(() => updateChecks.status === 'resolved' && !updateChecks.isEnabled)
const applyingCount = computed(() => props.applyingCount ?? 0)
const label = computed(() => props.variant === 'panel' ? t('settings.notifications.auto.label') : t(`settings.notifications.auto.kind.${props.kind}`))
const describedBy = computed(() => [explainId, (enabled.value && (checksOff.value || applyingCount.value > 0)) ? noEffectId : ''].filter(Boolean).join(' '))

const toggle = async () => {
  if (saving.value || settings.status !== 'resolved') return
  saving.value = true
  failed.value = false
  try {
    await settings.save({ [SETTING[props.kind]]: !enabled.value })
  } catch {
    failed.value = true
  } finally {
    saving.value = false
  }
}
onMounted(() => {
  void settings.ensureResolved()
  void updateChecks.ensureResolved().catch(() => undefined)
})
</script>
