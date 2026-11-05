import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { PTM_DEFINITION } from '~/prototype/delegated-copy-tasks/delegatedCopyTasksFixture'
import { CATALOG_ADDITIONS } from '~/prototype/conversations-list/conversationsFixture'
import { designOnlyLayersEnabled } from '~/prototype/shared/design-only-layers'

/**
 * delegated-copy-task-locator (design-only): the Project Task Manager agent is in the agent catalog,
 * so its example run is an ordinary run (no missing-agent mark). Its data comes from
 * prototype/delegated-copy-tasks/delegatedCopyTasksFixture.ts.
 */
export default defineNuxtPlugin(() => {
  if (!designOnlyLayersEnabled()) return
  const definitions = useAgentDefinitionStore()
  watch(() => definitions.agentDefinitions, (list) => {
    // left-panel-super-agents (design-only): the agents of the extra example runs are in the catalog too.
    const wanted = [PTM_DEFINITION, ...CATALOG_ADDITIONS].filter((entry: any) => !list.some((item: any) => item.id === entry.id))
    if (!list?.length || !wanted.length) return
    const template = JSON.parse(JSON.stringify(list[0]))
    definitions.agentDefinitions = [...list, ...wanted.map((entry: any) => ({ ...template, ...entry, avatarUrl: null }))] as any
  }, { immediate: true })
})
