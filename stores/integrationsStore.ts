import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  definitionOf, importedIds, integrationsWorld, IntegrationActionError, phaseOf, scriptedConnect, scriptedImport,
  scriptedRemoveSource, scriptedRemoveToken, scriptedTest, scriptedUpdate, sourceOf, toolsOf, wait,
  type ImportedSource, type IntegrationPhase, type ToolCheck,
} from '~/prototype/integrations/integrationsDesignFixture'

/**
 * integrations-page (design-only). The Integrations page's state. Reads and actions are answered by the
 * scripted fixture (prototype/integrations/integrationsDesignFixture.ts); nothing is contacted.
 * Cards are read locally (no network); only Import and Update reach GitHub.
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
  /** `owner/repository`, or the folder path, the integration was imported from. */
  sourceName: string
}

export type CardBusy = 'connect' | 'test' | 'remove' | 'tools'
export type CardMessage = { kind: 'success' | 'error'; text: string }

export class IntegrationError extends Error {
  code: string
  detail: string
  constructor(code: string, detail = '') { super(code); this.code = code; this.detail = detail }
}

const sourceLabel = (source: ImportedSource | undefined): string =>
  (source ? (source.kind === 'local' ? source.repositoryUrl : source.name) : '')

export const useIntegrationsStore = defineStore('integrations', () => {
  const items = ref<IntegrationView[]>([])
  const sources = ref<ImportedSource[]>([])
  const loaded = ref(false)
  const busy = ref<Record<string, CardBusy | undefined>>({})
  const messages = ref<Record<string, CardMessage | undefined>>({})
  /** The source an Import or an Update/Remove is working on, so the dialogs can show it. */
  const sourceBusy = ref<Record<string, 'update' | 'remove' | undefined>>({})
  const importing = ref(false)

  function project(): void {
    const world = integrationsWorld()
    // Alphabetical by name, no grouping by state.
    items.value = importedIds()
      .sort((a, b) => definitionOf(a).name.localeCompare(definitionOf(b).name))
      .map((id) => {
        const definition = definitionOf(id)
        const state = world.state[id]
        return {
          id, name: definition.name, description: definition.description, skillName: definition.skillName,
          icon: definition.icon, tokenHelp: definition.tokenHelp, phase: phaseOf(id),
          login: state.login, connectedAt: state.connectedAt, tools: toolsOf(id),
          sourceName: sourceLabel(sourceOf(id)),
        }
      })
    sources.value = world.sources.map(source => ({ ...source }))
  }

  async function load(): Promise<void> {
    await wait(250)
    project()
    loaded.value = true
  }

  /** Import a repository link or a folder path. Resolves with what it added; throws an IntegrationError. */
  async function importLink(link: string): Promise<{ names: string[]; source: string }> {
    if (importing.value) return { names: [], source: '' }
    importing.value = true
    try {
      const result = await scriptedImport(link)
      project()
      return { names: result.added.map(id => definitionOf(id).name), source: result.source.name }
    } catch (cause) {
      throw toError(cause)
    } finally {
      importing.value = false
    }
  }

  async function sourceAction(sourceId: string, kind: 'update' | 'remove'): Promise<void> {
    if (sourceBusy.value[sourceId]) return
    sourceBusy.value = { ...sourceBusy.value, [sourceId]: kind }
    try {
      await (kind === 'update' ? scriptedUpdate(sourceId) : scriptedRemoveSource(sourceId))
      project()
    } catch (cause) {
      throw toError(cause)
    } finally {
      sourceBusy.value = { ...sourceBusy.value, [sourceId]: undefined }
    }
  }

  const toError = (cause: unknown): IntegrationError =>
    cause instanceof IntegrationActionError ? new IntegrationError(cause.code, cause.detail) : new IntegrationError('FAILED')

  async function act<T>(id: string, kind: CardBusy, action: () => Promise<T>): Promise<T | null> {
    if (busy.value[id]) return null
    busy.value = { ...busy.value, [id]: kind }
    messages.value = { ...messages.value, [id]: undefined }
    try {
      const result = await action()
      project()
      return result
    } catch (cause) {
      throw toError(cause)
    } finally {
      busy.value = { ...busy.value, [id]: undefined }
    }
  }

  const setMessage = (id: string, message: CardMessage | undefined) => {
    messages.value = { ...messages.value, [id]: message }
  }

  const connect = (id: string, token: string) => act(id, 'connect', () => scriptedConnect(id, token))
  const test = (id: string) => act(id, 'test', () => scriptedTest(id))
  const remove = (id: string) => act(id, 'remove', () => scriptedRemoveToken(id))
  const checkTools = (id: string) => act(id, 'tools', async () => { await wait(700) })

  return {
    items, sources, loaded, busy, messages, sourceBusy, importing,
    load, importLink, sourceAction, setMessage, connect, test, remove, checkTools,
  }
})
