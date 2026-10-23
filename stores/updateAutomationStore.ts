import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { getApolloClient } from '~/utils/apolloClient'
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore'
import { GET_UPDATE_AUTOMATION_SETTINGS, SET_UPDATE_AUTOMATION_SETTINGS } from '~/graphql/updateNotifications'
import type { UpdateAutomationSettings } from '~/types/updateNotifications'

/**
 * The bound node's check intervals and automatic-update switches (update-checks-and-auto-updates). One store: the "Update
 * checks" card and the Notification Center read and write the same settings, so changing one changes the other.
 * The window learns of another window's change through the update-notifications feed (`refresh`).
 */
export const useUpdateAutomationStore = defineStore('updateAutomation', () => {
  const node = useWindowNodeContextStore()
  const settings = ref<UpdateAutomationSettings | null>(null)
  const status = ref<'unknown' | 'loading' | 'resolved' | 'error'>('unknown')
  const error = ref<Error | null>(null)
  let pending: Promise<void> | null = null

  watch(() => node.bindingRevision, () => { settings.value = null; status.value = 'unknown'; error.value = null; pending = null })

  const graphqlErrors = (errors: ReadonlyArray<{ message: string }> | undefined): void => {
    if (errors?.length) throw new Error(errors.map((entry) => entry.message).join(', '))
  }

  async function refresh(): Promise<void> {
    const revision = node.bindingRevision
    try {
      const { data, errors } = await getApolloClient().query({ query: GET_UPDATE_AUTOMATION_SETTINGS, fetchPolicy: 'network-only' })
      graphqlErrors(errors)
      if (revision === node.bindingRevision && data?.updateAutomationSettings) {
        settings.value = data.updateAutomationSettings
        status.value = 'resolved'
        error.value = null
      }
    } catch (cause) {
      if (status.value !== 'resolved') status.value = 'error'
      console.warn('Failed to load the update automation settings:', cause)
    }
  }

  function ensureResolved(): Promise<void> {
    if (status.value === 'resolved') return Promise.resolve()
    if (!pending) {
      status.value = 'loading'
      pending = refresh().finally(() => { pending = null })
    }
    return pending
  }

  /** Saves some of the settings; a refusal (for example an interval out of range) is thrown with the node's message. */
  async function save(input: Partial<Omit<UpdateAutomationSettings, 'waitUntil'>>): Promise<void> {
    const revision = node.bindingRevision
    error.value = null
    try {
      const { data, errors } = await getApolloClient().mutate({ mutation: SET_UPDATE_AUTOMATION_SETTINGS, variables: { input } })
      graphqlErrors(errors)
      if (revision === node.bindingRevision && data?.setUpdateAutomationSettings) settings.value = data.setUpdateAutomationSettings
    } catch (cause) {
      error.value = cause instanceof Error ? cause : new Error(String(cause))
      throw error.value
    }
  }

  const resolved = computed(() => status.value === 'resolved' ? settings.value : null)
  return { settings, status, error, resolved, ensureResolved, refresh, save }
})
