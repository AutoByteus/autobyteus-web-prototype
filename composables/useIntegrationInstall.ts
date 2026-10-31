import { computed } from 'vue'
import { useLocalization } from '~/composables/useLocalization'
import { IntegrationError, useIntegrationsStore, type IntegrationView } from '~/stores/integrationsStore'

/** Install, shared by the card's tile and its detail: the same action and the same error message in both. */
export function useIntegrationInstall(item: () => IntegrationView) {
  const store = useIntegrationsStore()
  const { t } = useLocalization()
  const busy = computed(() => store.busy[item().id])
  const installError = computed(() => {
    const message = store.messages[item().id]
    return message && message.step === 'install' ? message.text : ''
  })

  const runInstall = async () => {
    const current = item()
    try {
      await store.install(current.id)
    } catch (cause) {
      const clash = cause instanceof IntegrationError && cause.code === 'SKILL_NAME_CLASH'
      store.setMessage(current.id, {
        kind: 'error', step: 'install',
        text: t(clash ? 'integrations.install.errorClash' : 'integrations.install.errorFailed', { name: current.name, skill: current.skillName }),
      })
    }
  }

  return { busy, installError, runInstall }
}
