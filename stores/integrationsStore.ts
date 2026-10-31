import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  definitionOf, integrationsWorld, IntegrationActionError, phaseOf, scriptedConnect, scriptedInstall, scriptedRemove,
  scriptedRepositoryRead, scriptedTest, toolsOf, wait,
  type IntegrationPhase, type ToolCheck,
} from '~/prototype/integrations/integrationsDesignFixture'

/**
 * integrations-page (design-only). The Integrations page's state. Reads and actions are answered by the
 * scripted fixture (prototype/integrations/integrationsDesignFixture.ts); nothing is contacted.
 */
export interface IntegrationView {
  id: string
  name: string
  description: string
  skillName: string
  icon: 'github' | null
  tokenHelp: string
  phase: IntegrationPhase
  login: string | null
  connectedAt: string | null
  tools: ToolCheck[]
}

export type CardBusy = 'install' | 'connect' | 'test' | 'remove' | 'tools'
export type CardMessage = { kind: 'success' | 'error'; text: string; step: 'install' | 'connect' }

export class IntegrationError extends Error {
  code: string
  constructor(code: string) { super(code); this.code = code }
}

export const useIntegrationsStore = defineStore('integrations', () => {
  const items = ref<IntegrationView[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  /** The official repository could not be reached (the page then shows only what is installed). */
  const repositoryUnreachable = ref(false)
  const retrying = ref(false)
  const retryFailed = ref(false)
  const busy = ref<Record<string, CardBusy | undefined>>({})
  const messages = ref<Record<string, CardMessage | undefined>>({})

  function project(): void {
    const world = integrationsWorld()
    const visible = world.ids.filter(id => world.repository === 'reachable' || world.state[id].installed)
    items.value = visible.map((id) => {
      const definition = definitionOf(id)
      const state = world.state[id]
      return {
        id, name: definition.name, description: definition.description, skillName: definition.skillName,
        icon: definition.icon, tokenHelp: definition.tokenHelp, phase: phaseOf(id),
        login: state.login, connectedAt: state.connectedAt, tools: toolsOf(id),
      }
    })
    repositoryUnreachable.value = world.repository === 'unreachable'
  }

  async function load(): Promise<void> {
    loading.value = true
    try {
      await scriptedRepositoryRead(false)
      project()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function retry(): Promise<void> {
    if (retrying.value) return
    retrying.value = true
    retryFailed.value = false
    try {
      const result = await scriptedRepositoryRead(true)
      retryFailed.value = result === 'unreachable'
      project()
    } finally {
      retrying.value = false
    }
  }

  async function act<T>(id: string, kind: CardBusy, action: () => Promise<T>): Promise<T | null> {
    if (busy.value[id]) return null
    busy.value = { ...busy.value, [id]: kind }
    messages.value = { ...messages.value, [id]: undefined }
    try {
      const result = await action()
      project()
      return result
    } catch (cause) {
      const code = cause instanceof IntegrationActionError ? cause.code : 'FAILED'
      throw new IntegrationError(code)
    } finally {
      busy.value = { ...busy.value, [id]: undefined }
    }
  }

  const setMessage = (id: string, message: CardMessage | undefined) => {
    messages.value = { ...messages.value, [id]: message }
  }

  const install = (id: string) => act(id, 'install', () => scriptedInstall(id))
  const connect = (id: string, token: string) => act(id, 'connect', () => scriptedConnect(id, token))
  const test = (id: string) => act(id, 'test', () => scriptedTest(id))
  const remove = (id: string) => act(id, 'remove', () => scriptedRemove(id))
  const checkTools = (id: string) => act(id, 'tools', async () => { await wait(700) })

  return { items, loading, loaded, repositoryUnreachable, retrying, retryFailed, busy, messages, load, retry, setMessage, install, connect, test, remove, checkTools }
})
