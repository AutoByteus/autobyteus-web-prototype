import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const NARROW_MAX_WIDTH_PX = 640
const VIEWPORT_MARGIN_PX = 16
const MENU_GAP_PX = 6

/**
 * `auto` picks below/above by available space (running-conversation `/` menu).
 * `above` always opens upward and limits the height to the space above the trigger; the menu
 * content scrolls instead of flipping down (new-chat composer menus).
 */
export type AnchoredPopoverPlacementPolicy = 'auto' | 'above'

/**
 * Anchored popover behavior shared by the Chat menus and the message box's `/` skill menu:
 * toggling, outside-click and Escape dismissal with focus return, above/below placement with a
 * bounded height, and the narrow (bottom sheet) breakpoint.
 */
export function useAnchoredPopover(
  rootRef: Ref<HTMLElement | null>,
  triggerRef: Ref<HTMLElement | null>,
  preferredHeight = 460,
  options: { placement?: AnchoredPopoverPlacementPolicy } = {},
) {
  const policy = options.placement ?? 'auto'
  const open = ref(false)
  const placement = ref<'above' | 'below'>(policy === 'above' ? 'above' : 'below')
  const maxHeight = ref(preferredHeight)
  const narrow = ref(false)

  const updateNarrow = () => {
    narrow.value = typeof window !== 'undefined' && window.innerWidth < NARROW_MAX_WIDTH_PX
  }

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
    const below = window.innerHeight - rect.bottom - VIEWPORT_MARGIN_PX
    const above = rect.top - VIEWPORT_MARGIN_PX
    if (policy === 'above') {
      // The menu is positioned against its containing block (the root when positioned, otherwise
      // the root's offset parent, e.g. the composer card), so measure the space above that box.
      const root = rootRef.value
      const anchor = root && getComputedStyle(root).position === 'static'
        ? (root.offsetParent as HTMLElement | null) ?? root
        : root ?? trigger
      const spaceAbove = anchor.getBoundingClientRect().top - MENU_GAP_PX - VIEWPORT_MARGIN_PX
      placement.value = 'above'
      maxHeight.value = Math.max(0, Math.min(preferredHeight, Math.floor(spaceAbove)))
      return
    }
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
    updateNarrow()
    measure()
    open.value = true
    document.addEventListener('mousedown', onDocumentPointer, true)
    document.addEventListener('keydown', onDocumentKey, true)
    await nextTick()
  }

  function close(returnFocus = true) {
    if (!open.value) return
    open.value = false
    document.removeEventListener('mousedown', onDocumentPointer, true)
    document.removeEventListener('keydown', onDocumentKey, true)
    if (returnFocus) triggerRef.value?.focus()
  }

  const toggle = () => (open.value ? close(true) : show())

  onMounted(() => {
    updateNarrow()
    window.addEventListener('resize', updateNarrow)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateNarrow)
    close(false)
  })

  return { open, placement, maxHeight, narrow, show, close, toggle }
}
