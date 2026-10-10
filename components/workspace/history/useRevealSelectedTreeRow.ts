import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/** How long the panel waits for the open run's row to render after it appears. */
const REVEAL_WAIT_MS = 3000;
/** The open run's row: agent, task child, Team member (incl. sub-team) or Org row. Deepest wins. */
const SELECTED_ROW_SELECTOR = '[aria-current="true"], [aria-selected="true"]';

/**
 * collapsed-left-panel-expand-keeps-run (design): when the left panel appears (docked expand, drawer
 * open, app start) and a run is open, its row is scrolled into view once its ancestors have opened.
 * A row that is already fully visible does not move; otherwise it is centred so its siblings show.
 * The first user scroll, wheel or press in the tree cancels the pending reveal. When the panel was
 * opened from the strip's Workspaces icon, keyboard focus lands on that row.
 */
export const useRevealSelectedTreeRow = (container: Ref<HTMLElement | null>): void => {
  let observer: MutationObserver | null = null;
  let deadline: ReturnType<typeof setTimeout> | null = null;
  let frame = 0;

  const stop = (): void => {
    observer?.disconnect();
    observer = null;
    if (deadline !== null) clearTimeout(deadline);
    deadline = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    const el = container.value;
    if (!el) return;
    el.removeEventListener('wheel', stop);
    el.removeEventListener('pointerdown', stop);
    el.removeEventListener('keydown', stop);
  };

  const selectedRow = (el: HTMLElement): HTMLElement | null => {
    const rows = el.querySelectorAll<HTMLElement>(SELECTED_ROW_SELECTOR);
    return rows.length ? rows[rows.length - 1] : null;
  };

  const tryReveal = (): void => {
    frame = 0;
    const el = container.value;
    if (!el) return;
    const row = selectedRow(el);
    if (!row) return;
    const box = el.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    if (rect.top < box.top || rect.bottom > box.bottom) {
      el.scrollTop += (rect.top - box.top) - (box.height - rect.height) / 2;
    }
    // Opened from the strip's Workspaces icon (focus is on the Workspaces section): focus the run's row.
    if (document.activeElement?.matches('[data-test="app-left-panel-run-history"]')) {
      row.focus({ preventScroll: true });
    }
    // Keeps watching until the deadline: rows that load later above it may push it out again.
  };

  const schedule = (): void => {
    if (!frame) frame = requestAnimationFrame(tryReveal);
  };

  onMounted(() => {
    const el = container.value;
    if (!el) return;
    el.addEventListener('wheel', stop, { passive: true });
    el.addEventListener('pointerdown', stop);
    el.addEventListener('keydown', stop);
    observer = new MutationObserver(schedule);
    observer.observe(el, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-current', 'aria-selected'] });
    deadline = setTimeout(stop, REVEAL_WAIT_MS);
    schedule();
  });

  onBeforeUnmount(stop);
};
