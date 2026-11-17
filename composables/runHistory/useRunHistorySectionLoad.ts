import { useMobileRunTreeStore } from '~/stores/mobileRunTreeStore'
import { useRunHistoryStore } from '~/stores/runHistoryStore'

/**
 * Stand-in for the desktop Runs view's history load and poll. The first read answers by the starting state the scenario
 * seeds (loading, error, empty, populated); a later read (Retry, Check) finds the run history again.
 */
export function useRunHistorySectionLoad(_options: { window: () => unknown; polling: () => boolean }) {
  const world = useMobileRunTreeStore()
  const history = useRunHistoryStore()
  const apply = (): void => {
    history.$patch({ loading: world.listState === 'loading', historyFamilyErrors: { workspace: world.listState === 'error' ? 'The runs could not be read.' : null, agentOrg: null } })
  }
  apply()
  return {
    /** The first read, already under way when the shell starts (the shell waits for it). */
    initialLoad: Promise.resolve(),
    load: async (): Promise<void> => {
      if (world.listState === 'error') { world.listState = 'ready' }
      apply()
    },
  }
}
