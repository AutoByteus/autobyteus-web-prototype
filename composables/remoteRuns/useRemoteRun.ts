import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { remoteRunInfo } from '~/prototype/remote-runs/remoteRunsFixture'

/**
 * remote-runs-in-tree: whether an agent run is run by another node (this node's delegation started it).
 * Null for a local run. In the UI reference the answer comes from the scenario's fixture; in the product
 * it is part of the run's tree data (the node's name, and whether it answered).
 */
export const useRemoteRun = (agentRunId: MaybeRefOrGetter<string | null | undefined>) =>
  computed(() => remoteRunInfo(toValue(agentRunId)))
