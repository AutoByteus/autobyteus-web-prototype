import { nextTick, onBeforeUnmount, ref, type Ref } from 'vue'

// Small popover helper for chat pickers: toggling, outside-click and Escape
// dismissal, focus return, and above/below placement with a bounded height.
export function useChatPopover(rootRef: Ref<HTMLElement | null>, triggerRef: Ref<HTMLElement | null>, preferredHeight = 460) {
  const open = ref(false)
  const placement = ref<'above' | 'below'>('below')
  const maxHeight = ref(preferredHeight)

  const onDocumentPointer = (event: MouseEvent) => {
    if (!open.value) return
    const root = rootRef.value
    if (root && event.target instanceof Node && root.contains(event.target)) return
    close(false)
  }

  const onDocumentKey = (event: KeyboardEvent) => {
    if (open.value && event.key === 'Escape') {
      event.stopPropagation()
      close(true)
    }
  }

  const measure = () => {
    const trigger = triggerRef.value
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom - 16
    const above = rect.top - 16
    const fitsBelow = below >= preferredHeight
    const fitsAbove = above >= preferredHeight
    if (fitsBelow || (!fitsAbove && below >= above)) {
      placement.value = 'below'
      maxHeight.value = Math.max(220, Math.min(preferredHeight, below))
    } else {
      placement.value = 'above'
      maxHeight.value = Math.max(220, Math.min(preferredHeight, above))
    }
  }

  const show = async () => {
    measure()
    open.value = true
    document.addEventListener('mousedown', onDocumentPointer, true)
    document.addEventListener('keydown', onDocumentKey, true)
    await nextTick()
  }

  function close(returnFocus = true) {
    open.value = false
    document.removeEventListener('mousedown', onDocumentPointer, true)
    document.removeEventListener('keydown', onDocumentKey, true)
    if (returnFocus) triggerRef.value?.focus()
  }

  const toggle = () => (open.value ? close(true) : show())

  onBeforeUnmount(() => close(false))

  return { open, placement, maxHeight, show, close, toggle }
}
