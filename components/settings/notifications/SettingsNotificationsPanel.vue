<template>
  <!-- settings-update-notifications: the quiet notification area.
       `rail`: the right-hand column of every Settings section on wide windows.
       `section`: the Notifications section on narrower windows (same content, centred like other sections). -->
  <div :class="variant === 'rail' ? 'flex h-full min-h-0 flex-col' : 'h-full overflow-auto bg-white p-6'" :data-testid="`settings-notifications-${variant}`">
    <div :class="variant === 'rail' ? 'flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-5' : 'mx-auto w-full max-w-3xl space-y-4'">
      <header class="flex shrink-0 items-baseline justify-between gap-3 px-1">
        <h2 :id="headingId" class="font-semibold text-gray-900" :class="variant === 'rail' ? 'text-base' : 'text-lg'">{{ t('settings.notifications.title') }}</h2>
        <span v-if="newCount" class="text-xs font-medium text-sky-700" data-testid="settings-notifications-new-count">{{ t('settings.notifications.newCount', { count: newCount }) }}</span>
      </header>

      <section class="shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" :aria-labelledby="headingId">
        <p v-if="!store.backgroundChecks && !store.isEmpty" class="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-600" data-testid="settings-notifications-off-notice">
          <Icon icon="heroicons:pause-circle-20-solid" class="h-4 w-4 text-gray-400" aria-hidden="true" />{{ t('settings.notifications.offNotice') }}
        </p>
        <!-- Round 2: the list is grouped by category (today: Updates). -->
        <h3 v-if="!store.isEmpty" class="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700" data-testid="settings-notifications-category-updates">
          <Icon :icon="CATEGORY_ICONS.updates" class="h-4 w-4 text-gray-500" aria-hidden="true" />{{ t('settings.notifications.category.updates') }}
          <span class="font-normal text-gray-500">{{ store.waitingCount }}</span>
        </h3>
        <ul v-if="!store.isEmpty" class="divide-y divide-gray-100" :aria-label="t('settings.notifications.listLabel')" data-testid="settings-notifications-list">
          <AppUpdateNotificationItem v-if="store.appVisible" />
          <UpdateNotificationItem v-for="item in ordered" :key="item.id" :item="item" @update="update" />
        </ul>
        <div v-else class="px-5 py-8 text-center" role="status" data-testid="settings-notifications-empty">
          <Icon icon="heroicons:bell" class="mx-auto h-6 w-6 text-gray-300" aria-hidden="true" />
          <p class="mt-2 text-sm font-medium text-gray-700">{{ t('settings.notifications.empty.title') }}</p>
          <p class="mx-auto mt-1 max-w-xs text-xs leading-5 text-gray-500">{{ t(store.backgroundChecks ? 'settings.notifications.empty.on' : 'settings.notifications.empty.off') }}</p>
        </div>
      </section>

      <!-- The per-node background-check setting, with what it sends. -->
      <section class="shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm" data-testid="settings-notifications-setting">
        <div class="flex items-start justify-between gap-3">
          <p :id="settingLabelId" class="text-sm font-medium leading-5 text-gray-900">{{ t('settings.notifications.setting.label') }}</p>
          <button
            type="button"
            role="switch"
            class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
            :class="store.backgroundChecks ? 'bg-emerald-500' : 'bg-slate-300'"
            :aria-checked="store.backgroundChecks"
            :aria-labelledby="settingLabelId"
            :aria-describedby="settingDescriptionId"
            data-testid="settings-notifications-setting-toggle"
            @click="store.backgroundChecks = !store.backgroundChecks"
          >
            <span aria-hidden="true" class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform" :class="store.backgroundChecks ? 'translate-x-5' : 'translate-x-0.5'" />
          </button>
        </div>
        <p :id="settingDescriptionId" class="mt-2 text-xs leading-5 text-gray-600" data-testid="settings-notifications-setting-description">{{ t('settings.notifications.setting.description') }}</p>
        <p class="mt-1 text-xs leading-5 text-gray-400">{{ t('settings.notifications.setting.scope') }}</p>
      </section>
    </div>

    <!-- A skill source's Update keeps its existing confirmation (local edits are replaced). -->
    <ConfirmationModal
      :show="!!confirming"
      :title="t('skills.sources.updateTitle')"
      :confirm-button-text="t('skills.sources.update')"
      variant="danger"
      @confirm="confirmSkillUpdate"
      @cancel="confirming = null"
    >
      <p class="confirm-copy text-sm leading-6 text-slate-600">{{ t('skills.sources.updateWarning') }}</p>
      <div v-if="confirming" class="confirm-source mt-3 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" data-testid="settings-notifications-confirm-source">
        <span class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200">
          <Icon icon="mdi:github" class="h-4 w-4" />
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-medium text-slate-900">{{ confirming.name }}</span>
          <span class="mt-0.5 block break-all font-mono text-[11.5px] leading-4 text-slate-500">https://github.com/{{ confirming.repository }}</span>
          <span class="version-change mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-slate-600">
            <span>{{ confirming.branch }}</span>
            <span class="font-mono text-[11.5px]" :title="confirming.installedRevision">{{ confirming.installedRevision.slice(0, 10) }}</span>
            <Icon icon="heroicons:arrow-right-20-solid" class="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span class="font-mono text-[11.5px] font-medium text-slate-900" :title="confirming.latestRevision">{{ confirming.latestRevision.slice(0, 10) }}</span>
          </span>
        </span>
      </div>
    </ConfirmationModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ConfirmationModal from '~/components/common/ConfirmationModal.vue'
import { useLocalization } from '~/composables/useLocalization'
import { CATEGORY_ICONS, useUpdateNotificationsStore, type SourceUpdateNotification } from '~/stores/updateNotificationsStore'
import AppUpdateNotificationItem from './AppUpdateNotificationItem.vue'
import UpdateNotificationItem from './UpdateNotificationItem.vue'

withDefaults(defineProps<{ variant?: 'rail' | 'section' }>(), { variant: 'rail' })
const { t } = useLocalization()
const store = useUpdateNotificationsStore()
const uid = Math.random().toString(36).slice(2, 8)
const headingId = `settings-notifications-heading-${uid}`
const settingLabelId = `settings-notifications-setting-${uid}`
const settingDescriptionId = `settings-notifications-setting-description-${uid}`

/** Waiting items first, newest first; updated ones last. */
const ordered = computed(() => [...store.visibleSources].sort((a, b) =>
  Number(a.state === 'handled') - Number(b.state === 'handled') || b.foundAt.localeCompare(a.foundAt)))
/** Items that were new when the area was opened in this visit. */
const newCount = computed(() => store.newThisVisit.length)

const confirming = ref<SourceUpdateNotification | null>(null)
const update = (item: SourceUpdateNotification) => {
  if (item.kind === 'skill_source') confirming.value = item
  else store.updateSource(item.id)
}
const confirmSkillUpdate = () => {
  if (confirming.value) store.updateSource(confirming.value.id)
  confirming.value = null
}

// Seeing the area marks its notifications read (the indicator goes off); "New" stays for this visit.
onMounted(() => store.markSeen())
</script>
