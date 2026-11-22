<template>
  <div v-if="network.joined" class="mt-5 border-t border-gray-100 pt-5" data-testid="private-network-finding">
    <div
      v-if="network.offerDiscovery"
      class="max-w-2xl rounded-lg border border-blue-200 bg-blue-50 px-4 py-3"
      role="region"
      :aria-label="t('extensions.network.offerTitle')"
      data-testid="private-network-offer"
    >
      <p class="text-sm font-semibold text-blue-900">{{ t('extensions.network.offerTitle') }}</p>
      <p class="mt-1 text-sm leading-6 text-blue-900/80">{{ t('extensions.network.offerText') }}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button type="button" class="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-testid="private-network-offer-yes" @click="network.setDiscoverable(true)">{{ t('extensions.network.offerYes') }}</button>
        <button type="button" class="rounded-md border border-blue-200 bg-white px-3.5 py-2 text-sm font-medium text-blue-800 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="private-network-offer-no" @click="network.dismissDiscoveryOffer()">{{ t('extensions.network.offerNo') }}</button>
      </div>
    </div>
    <div v-else class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-gray-700">
        <span class="font-medium text-gray-900">{{ t('extensions.network.findableLabel') }}</span>
        {{ network.discoverable ? t('extensions.network.findableOn') : t('extensions.network.findableOff') }}
      </p>
      <NuxtLink to="/nodes?nodeTab=manage" class="inline-flex items-center gap-1 rounded text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="private-network-open-nodes">
        {{ t('extensions.network.openNodes') }}
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10h12m-4-4 4 4-4 4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalization } from '~/composables/useLocalization';
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore';

/** Private Network's connection point in its card, drawn by AutoByteus: whether this node can be found, offered once on joining. */
const { t } = useLocalization();
const network = usePrivateNetworkStore();
</script>
