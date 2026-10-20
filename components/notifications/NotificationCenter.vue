<template>
  <!-- settings-update-notifications (round 6): the Notification Center. The user opens it from the sidebar entry
       ("3 updates"); it floats next to that entry, over the current page, in the manner of macOS: compact cards
       grouped by category, each with its actions in place (round 7: no separate Settings list, no gear). Never opens by itself. Esc, a click outside, or the close button
       closes it. -->
  <Teleport to="body">
    <transition name="notification-center">
      <section
        v-if="store.centerOpen && store.centerAnchor"
        ref="panel"
        class="fixed z-[90] flex w-[360px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl bg-gray-50/95 shadow-2xl ring-1 ring-black/10 backdrop-blur"
        :style="position"
        role="dialog"
        :aria-labelledby="headingId"
        data-testid="notification-center"
      >
        <header class="flex items-center gap-2 px-4 pb-2 pt-3">
          <h2 :id="headingId" ref="heading" tabindex="-1" class="flex-1 text-sm font-semibold text-gray-900 outline-none">{{ t('settings.notifications.title') }}</h2>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            :aria-label="t('settings.notifications.center.close')"
            :title="t('settings.notifications.center.close')"
            data-testid="notification-center-close"
            @click="close(true)"
          ><Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" aria-hidden="true" /></button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          <template v-if="!store.isEmpty">
            <!-- One group per category (today: Updates). -->
            <p class="flex items-center gap-1.5 px-1 pb-1.5 text-xs font-medium text-gray-500" data-testid="notification-center-group-updates">
              <span class="text-gray-700">{{ t('settings.notifications.category.updates') }}</span>
              <span>{{ store.waitingCount }}</span>
            </p>
            <ul class="space-y-2" :aria-label="t('settings.notifications.listLabel')">
              <NotificationCard v-if="store.appVisible" />
              <NotificationCard v-for="item in ordered" :key="item.id" :item="item" @update="update" />
            </ul>
          </template>
          <div v-else class="rounded-xl bg-white px-4 py-6 text-center ring-1 ring-gray-200/80" role="status" data-testid="notification-center-empty">
            <p class="text-sm font-medium text-gray-700">{{ t('settings.notifications.empty.title') }}</p>
            <p class="mt-1 text-xs leading-5 text-gray-500">{{ t(store.backgroundChecks ? 'settings.notifications.empty.on' : 'settings.notifications.empty.off') }}</p>
          </div>
        </div>
      </section>
    </transition>

    <!-- A skill source's Update keeps its existing confirmation (local edits are replaced). -->
    <ConfirmationModal :show="!!confirming" :title="t('skills.sources.updateTitle')" :confirm-button-text="t('skills.sources.update')" variant="danger" @confirm="confirmSkillUpdate" @cancel="confirming = null">
      <p class="confirm-copy text-sm leading-6 text-slate-600">{{ t('skills.sources.updateWarning') }}</p>
      <div v-if="confirming" class="confirm-source mt-3 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" data-testid="notification-center-confirm-source">
        <span class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200"><Icon icon="mdi:github" class="h-4 w-4" /></span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-medium text-slate-900">{{ confirming.name }}</span>
          <span class="mt-0.5 block break-all font-mono text-[11.5px] leading-4 text-slate-500">https://github.com/{{ confirming.repository }}</span>
          <span class="version-change mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-slate-600">
            <span>{{ confirming.branch }}</span>
            <span class="font-mono text-[11.5px]">{{ confirming.installedRevision.slice(0, 10) }}</span>
            <Icon icon="heroicons:arrow-right-20-solid" class="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span class="font-mono text-[11.5px] font-medium text-slate-900">{{ confirming.latestRevision.slice(0, 10) }}</span>
          </span>
        </span>
      </div>
    </ConfirmationModal>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ConfirmationModal from '~/components/common/ConfirmationModal.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useUpdateNotificationsStore, type SourceUpdateNotification } from '~/stores/updateNotificationsStore'
import NotificationCard from './NotificationCard.vue'

const { t } = useLocalization()
const store = useUpdateNotificationsStore()
const panel = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const headingId = 'notification-center-heading'
const confirming = ref<SourceUpdateNotification | null>(null)

const ordered = computed(() => [...store.visibleSources].sort((a, b) =>
  Number(a.state === 'handled') - Number(b.state === 'handled') || b.foundAt.localeCompare(a.foundAt)))
/** Next to the entry that opened it: above the Settings row (docked panel) or right of the strip icon. */
const position = computed(() => {
  const anchor = store.centerAnchor
  if (!anchor) return {}
  return { left: `${anchor.left}px`, bottom: `${anchor.bottom}px`, maxHeight: `min(72vh, calc(100vh - ${anchor.bottom + 16}px))` }
})

const update = (item: SourceUpdateNotification) => {
  if (item.kind === 'skill_source') confirming.value = item
  else store.updateSource(item.id)
}
const confirmSkillUpdate = () => {
  if (confirming.value) store.updateSource(confirming.value.id)
  confirming.value = null
}

const returnFocus = () => (document.querySelector('button[data-test^="sidebar-notifications-"]') as HTMLElement | null)?.focus()
const close = (focusEntry: boolean) => {
  store.closeCenter()
  if (focusEntry) void nextTick(returnFocus)
}
/** A click outside the panel (and outside the entry that toggles it, and the confirmation) closes it. */
const onPointerDown = (event: PointerEvent) => {
  const target = event.target as HTMLElement | null
  if (!store.centerOpen || !target || confirming.value) return
  if (panel.value?.contains(target) || target.closest('[data-test^="sidebar-notifications-"]')) return
  close(false)
}
/** Esc closes it wherever focus is (but first closes the skill confirmation when that is open). */
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !store.centerOpen || confirming.value) return
  event.preventDefault()
  close(true)
}
watch(() => store.centerOpen, async (open) => {
  if (open) {
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    await nextTick()
    heading.value?.focus()
  } else {
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('keydown', onKeyDown)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown, true)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.notification-center-enter-active, .notification-center-leave-active { transition: opacity 150ms ease, transform 150ms ease; }
.notification-center-enter-from, .notification-center-leave-to { opacity: 0; transform: translateY(6px); }
@media (prefers-reduced-motion: reduce) {
  .notification-center-enter-active, .notification-center-leave-active { transition: none; }
}
</style>
