<template>
  <!-- extensions-ui-516 (design, DEC-015 item 7): the AutoByteus apps that control this node (owner credentials, NA-11), with
       Revoke on every other one. Revoking this AutoByteus itself is Remove in its own list, not here. -->
  <div class="border-t border-slate-100 px-5 py-4" data-testid="this-node-controllers">
    <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('nodes.controlledBy.title') }}</h4>
    <ul class="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200">
      <li v-for="item in controllers" :key="item.id" class="px-3 py-2.5" :data-testid="`this-node-controller-${item.id}`">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span class="text-sm font-medium text-slate-900">{{ item.name }}</span>
          <span v-if="item.isThis" class="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">{{ t('nodes.controlledBy.thisApp') }}</span>
          <span class="text-xs text-slate-500">{{ t('nodes.controlledBy.since', { date: item.since }) }} · {{ item.lastUsed ? t('nodes.controlledBy.lastUsed', { date: item.lastUsed }) : t('nodes.controlledBy.neverUsed') }}</span>
          <span class="flex-1" />
          <span v-if="revoking === item.id" class="inline-flex items-center gap-1.5 text-xs text-slate-600" role="status"><span class="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500 motion-reduce:animate-none" aria-hidden="true" />{{ t('nodes.controlledBy.revoking') }}</span>
          <button
            v-else-if="!item.isThis && asking !== item.id"
            type="button"
            class="rounded px-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            :data-testid="`this-node-revoke-${item.id}`"
            @click="asking = item.id"
          >{{ t('nodes.controlledBy.revoke') }}</button>
        </div>
        <div v-if="asking === item.id" class="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700" role="alertdialog" :aria-label="t('nodes.controlledBy.revoke')" :data-testid="`this-node-revoke-confirm-${item.id}`">
          <span class="min-w-0 flex-1 basis-56">{{ t('nodes.controlledBy.confirm', { name: item.name }) }}</span>
          <button type="button" class="h-7 rounded-md bg-red-600 px-2.5 font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" :data-testid="`this-node-revoke-yes-${item.id}`" @click="revoke(item.id)">{{ t('nodes.controlledBy.revoke') }}</button>
          <button type="button" class="h-7 rounded-md border border-slate-300 bg-white px-2.5 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="asking = null">{{ t('nodes.privateNetwork.cancel') }}</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocalization } from '~/composables/useLocalization'

/**
 * Who controls this node: the node's owner credentials (`GET /rest/node-access/owner-credentials`, NA-11:
 * `credentialId`, `desktopName`, `createdAt`, `lastSeenAt`). The name is `desktopName`, "since" is `createdAt`, "last used" is
 * `lastSeenAt` (or never used). "This AutoByteus" is the credential this app holds for the node. Revoke deletes one
 * (`DELETE …/owner-credentials/:id`): that app loses control and needs a new access code. Every value here is invented.
 * A node no other computer can reach (127.0.0.1 only, not on a private network) realistically has only this AutoByteus.
 */
const props = defineProps<{ reachableFromOthers: boolean }>()
const { t } = useLocalization()
interface Controller { id: string; name: string; since: string; lastUsed: string | null; isThis?: boolean }
const fixture = (others: boolean): Controller[] => [
  { id: 'home-mac', name: 'home-mac', since: '20 Oct 2026', lastUsed: '26 Nov 2026', isThis: true },
  ...(others ? [
    { id: 'work-laptop', name: 'work-laptop', since: '18 Nov 2026', lastUsed: '25 Nov 2026' },
    { id: 'studio-mac', name: 'studio-mac', since: '2 Nov 2026', lastUsed: null },
  ] : []),
]
const controllers = ref<Controller[]>(fixture(props.reachableFromOthers))
watch(() => props.reachableFromOthers, (others) => { controllers.value = fixture(others) })
const asking = ref<string | null>(null)
const revoking = ref<string | null>(null)
const revoke = async (id: string): Promise<void> => {
  asking.value = null
  revoking.value = id
  await new Promise((done) => setTimeout(done, 900))
  controllers.value = controllers.value.filter((item) => item.id !== id)
  revoking.value = null
}
</script>
