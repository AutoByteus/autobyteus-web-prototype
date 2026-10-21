<template>
  <div class="space-y-5" data-testid="remote-collaboration-card">
    <FeatureCapabilityToggleCard
      :store="capabilityStore"
      :title="t('settings.components.settings.RemoteCollaboration.title')"
      :description="t('settings.components.settings.RemoteCollaboration.description')"
      test-id-prefix="remote-collaboration"
      :status-labels="statusLabels"
      :status-message="statusMessage"
    />

    <p
      v-if="store.error && store.errorScope === 'load'"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
      data-testid="remote-collaboration-error"
    >
      {{ store.error }}
    </p>

    <RemoteCollaborationPeersSection :switch-on="capabilityStore.isEnabled" />

    <RemoteCollaborationAvailabilitySection :switch-on="capabilityStore.isEnabled" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import FeatureCapabilityToggleCard from '~/components/settings/FeatureCapabilityToggleCard.vue'
import RemoteCollaborationAvailabilitySection from '~/components/settings/RemoteCollaborationAvailabilitySection.vue'
import RemoteCollaborationPeersSection from '~/components/settings/RemoteCollaborationPeersSection.vue'
import { useLocalization } from '~/composables/useLocalization'
import { useRemoteCollaborationCapabilityStore } from '~/stores/remoteCollaborationCapabilityStore'
import { useRemoteCollaborationOffersStore } from '~/stores/remoteCollaborationOffersStore'
import { useRemoteCollaborationStore } from '~/stores/remoteCollaborationStore'

const { t } = useLocalization()
const capabilityStore = useRemoteCollaborationCapabilityStore()
const store = useRemoteCollaborationStore()
const offers = useRemoteCollaborationOffersStore()

const statusLabels = computed(() => ({
  loading: t('settings.components.settings.RemoteCollaboration.status.loading'),
  error: t('settings.components.settings.RemoteCollaboration.status.error'),
  enabled: t('settings.components.settings.RemoteCollaboration.status.enabled'),
  disabled: t('settings.components.settings.RemoteCollaboration.status.disabled'),
  saving: t('settings.components.settings.RemoteCollaboration.status.saving'),
}))

const statusMessage = computed(() => capabilityStore.capability?.source === 'DEFAULT_DISABLED'
  ? t('settings.components.settings.RemoteCollaboration.source.defaultDisabled')
  : null)

// Opening the page asks every peer once, in parallel, and checks this node's list (REQ-504). Nothing polls.
onMounted(async () => {
  await Promise.all([capabilityStore.ensureResolved().catch(() => undefined), store.load()])
  if (capabilityStore.isEnabled) offers.open(store.peers)
})

// Turning the switch on loads the lists; turning it off drops them and asks nobody.
watch(() => capabilityStore.isEnabled, (on, was) => {
  if (on === was) return
  if (on) offers.open(store.peers)
  else offers.clear()
})

// A peer added while the page is open is asked at once.
watch(() => store.peers.map((peer) => peer.nodeId).join(','), () => {
  if (capabilityStore.isEnabled) offers.askNew(store.peers)
})
</script>
