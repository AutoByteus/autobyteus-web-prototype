import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useAgentDefinitionStore } from '~/stores/agentDefinitionStore'
import { PTM_DEFINITION } from '~/prototype/delegated-copy-tasks/delegatedCopyTasksFixture'
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
    if (!list?.length || list.some((item: any) => item.id === PTM_DEFINITION.id)) return
    const template = JSON.parse(JSON.stringify(list[0]))
    definitions.agentDefinitions = [...list, { ...template, ...PTM_DEFINITION }] as any
  }, { immediate: true })
})
