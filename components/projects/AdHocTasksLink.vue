<template>
  <!-- project-manager-ux round 2: the entry to Temp tasks (Tasks with no Project). It sits in the
       Projects header beside "New project", not among the Project cards, because it is not a Project. -->
  <NuxtLink
    :to="`/projects/${NO_PROJECT_ID}`"
    class="inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    :aria-label="open ? `${t('projects.adHoc.title')}, ${t('projects.adHoc.openShort', { count: open })}` : t('projects.adHoc.title')"
    data-testid="adhoc-tasks-link"
  >
    <Icon icon="heroicons:queue-list" class="h-4 w-4 text-slate-500" aria-hidden="true" />
    {{ t('projects.adHoc.title') }}
    <span v-if="open" class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600" data-testid="adhoc-tasks-link-count">{{ t('projects.adHoc.openShort', { count: open }) }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useLocalization } from '~/composables/useLocalization'
import { useProjectTaskStore } from '~/stores/projectTaskStore'
import { NO_PROJECT_ID } from '~/prototype/project-manager/adHocTasksFixture'

const { t } = useLocalization()
const store = useProjectTaskStore()
const open = computed(() => (store.getList(NO_PROJECT_ID)?.tasks ?? []).filter((task) => task.status !== 'DONE').length)
onMounted(() => { void store.fetchTasks(NO_PROJECT_ID).catch(() => undefined) })
onBeforeUnmount(() => store.releaseRead(NO_PROJECT_ID))
</script>
