import { computed, nextTick, ref, watch, type Ref } from 'vue'
import { detectMenuTrigger } from '~/utils/skills/skillTagMenu'
import { useAnchoredPopover } from '~/composables/popover/useAnchoredPopover'
import { addDraftMention } from '~/prototype/run-mentions/runMentionState'
import { mentionToken, useRunMentions } from '~/composables/agentInput/useRunMentions'

/**
 * The `@` menu over a live-run textarea (cross-scope-agent-mentions): an `@query` token before
 * the caret opens it; choosing an Agent or Team replaces the token with `@Name ` in the text and
 * records the mention for this composer.
 */
export function useRunMentionMenu(options: {
  rootRef: Ref<HTMLElement | null>
  textareaRef: Ref<HTMLTextAreaElement | null>
  /** Reads the current text (the caller's local mirror). */
  getText: () => string
  /** Writes the requirement text (keeps the caller's local mirror in sync). */
  setText: (text: string) => void
}) {
  const mentions = useRunMentions()
  const popover = useAnchoredPopover(options.rootRef, options.textareaRef, 300, { placement: 'above' })
  const query = ref('')
  const start = ref(-1)
  const highlight = ref(0)

  const open = computed(() => mentions.available.value && popover.open.value)
  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return q
      ? mentions.options.value.filter((option) => option.name.toLowerCase().includes(q) || option.id.toLowerCase().includes(q))
      : mentions.options.value
  })
  watch(query, () => { highlight.value = 0 })

  const close = () => { if (popover.open.value) popover.close(false) }

  /** Re-evaluates the token before the caret; returns true when the `@` menu owns it. */
  const detect = (): boolean => {
    const element = options.textareaRef.value
    if (!mentions.available.value || !element) return false
    const before = element.value.slice(0, element.selectionStart ?? element.value.length)
    const trigger = detectMenuTrigger(before, { mentions: true, skills: false })
    if (!trigger) { close(); return false }
    query.value = trigger.query
    start.value = trigger.start
    if (!popover.open.value) void popover.show()
    return true
  }

  const choose = (index: number) => {
    const option = filtered.value[index]
    const element = options.textareaRef.value
    const runId = mentions.focusedRunId.value
    if (!option || !runId) return
    const text = options.getText()
    const caret = element?.selectionStart ?? text.length
    const tokenStart = Math.max(0, start.value)
    const inserted = `${mentionToken(option.name)} `
    const after = text.slice(caret).replace(/^ /, '')
    options.setText(text.slice(0, tokenStart) + inserted + after)
    addDraftMention(runId, option.key)
    close()
    void nextTick(() => {
      const position = tokenStart + inserted.length
      element?.focus()
      element?.setSelectionRange(position, position)
    })
  }

  /** Handles menu keys; returns true when the event was consumed. */
  const onKeydown = (event: KeyboardEvent): boolean => {
    if (!open.value) return false
    const count = filtered.value.length
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (count) highlight.value = (highlight.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count
      return true
    }
    if ((event.key === 'Enter' || event.key === 'Tab') && count) {
      event.preventDefault()
      choose(highlight.value)
      return true
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
      return true
    }
    // Enter with no match must not send a half-typed mention.
    if (event.key === 'Enter') { event.preventDefault(); return true }
    return false
  }

  return { mentions, popover, open, query, highlight, filtered, detect, choose, onKeydown, close }
}
