import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUpdateNotificationsStore } from '~/stores/updateNotificationsStore'

/** Where the panel floats: its distance from the window's right edge and top edge (the right side of the whole window). */
export type NotificationCenterAnchor = { right: number; top: number }

/**
 * The Notification Center panel: open or closed, where it floats, and which rows were unread when
 * it opened (they keep their "New" dot until it closes, although opening marks them read).
 */
export const useNotificationCenterStore = defineStore('notificationCenter', () => {
  const isOpen = ref(false)
  const anchor = ref<NotificationCenterAnchor | null>(null)
  const newRowIds = ref<string[]>([])
  /** A confirmation opened from the panel (turning on an automatic update) is showing: outside clicks and Esc belong to it. */
  const modalOpen = ref(false)

  function open(at: NotificationCenterAnchor): void {
    const notifications = useUpdateNotificationsStore()
    anchor.value = at
    newRowIds.value = notifications.rows.filter((row) => row.unread).map((row) => row.id)
    isOpen.value = true
    void notifications.markAllRead()
  }

  function close(): void {
    isOpen.value = false
    newRowIds.value = []
  }

  const isNew = (rowId: string): boolean => newRowIds.value.includes(rowId)

  return { isOpen, anchor, modalOpen, open, close, isNew }
})
