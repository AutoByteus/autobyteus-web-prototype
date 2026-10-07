<template>
  <div
    data-test="workspace-left-navigation-strip"
    role="navigation"
    :aria-label="$t('shell.workspaceSurfaces.navigationDrawerTitle')"
    :data-strip-behavior="props.stripBehavior"
    :data-strip-activation="props.stripActivation"
    :class="stripClasses"
  >
    <div class="flex flex-col space-y-2">
      <button
        v-for="item in primaryNavItems"
        :key="item.key"
        type="button"
        class="group relative rounded-md p-2 transition-colors hover:bg-gray-100"
        :class="isPrimaryNavActive(item.key) ? 'bg-gray-100 text-gray-900' : ''"
        :data-nav-key="item.key"
        :title="navLabel(item)"
        :aria-label="navLabel(item)"
        @click="handlePrimaryClick(item.key, $event)"
      >
        <svg
          v-if="item.key === 'nodes'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          aria-hidden="true"
          data-testid="nodes-network-icon"
        >
          <rect x="9" y="3" width="6" height="6" rx="1.5" />
          <rect x="4" y="15" width="6" height="6" rx="1.5" />
          <rect x="14" y="15" width="6" height="6" rx="1.5" />
          <path d="M12 9v3" />
          <path d="M7 15v-1a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
        </svg>
        <Icon v-else :icon="item.icon" class="h-5 w-5" />

        <!-- chat-new-draft-kept-on-navigation: kept drafts are counted on the collapsed Chat icon. -->
        <span
          v-if="item.key === 'chat' && draftCount > 0"
          data-test="strip-chat-draft-count"
          class="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white"
          aria-hidden="true"
        >{{ draftCount > 9 ? '9+' : draftCount }}</span>

        <div class="absolute left-full ml-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible z-50">
          {{ navLabel(item) }}
        </div>
      </button>
    </div>

    <div v-if="showSettingsNavigation" class="mt-auto">
      <button
        type="button"
        class="group relative rounded-md p-2 transition-colors hover:bg-gray-100"
        :class="isSettingsActive ? 'bg-gray-100 text-gray-900' : ''"
        data-nav-key="settings"
        :title="$t('shell.components.layout.LeftSidebarStrip.settings')"
        :aria-label="$t('shell.navigation.settings')"
        @click="handleSettingsClick($event)"
      >
        <Icon icon="heroicons:cog-6-tooth" class="h-5 w-5" />

        <div class="absolute left-full ml-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible z-50">
          {{ $t('shell.navigation.settings') }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router';
import { useAppLayoutStore } from '~/stores/appLayoutStore';
import { rememberDrawerTrigger } from '~/composables/useAccessibleDrawer';
import { useShellPrimaryNavigation, type ShellPrimaryNavItem, type ShellPrimaryNavKey } from '~/composables/useShellPrimaryNavigation';
import { useChatDraftStore } from '~/stores/chatDraftStore';
import { isFeatureAvailableInRuntime } from '~/utils/mobileFeatureGates';
import type { StripBehavior, StripActivation } from '~/utils/layout/responsiveLayoutPolicy';

const { t } = useLocalization();
const {
  primaryNavItems,
  resolvePrimaryRoute,
  isPrimaryNavActive,
  ensurePrimaryNavigationReady,
} = useShellPrimaryNavigation();

const route = useRoute();
const chatDraftStore = useChatDraftStore();
const draftCount = computed(() => chatDraftStore.keptDrafts.length);
const navLabel = (item: ShellPrimaryNavItem): string => {
  if (item.key !== 'chat' || draftCount.value === 0) return t(item.labelKey);
  const drafts = draftCount.value === 1
    ? t('shell.components.AppLeftPanel.draft_count_one')
    : t('shell.components.AppLeftPanel.draft_count', { count: draftCount.value });
  return `${t(item.labelKey)} · ${drafts}`;
};
const router = useRouter();
const appLayoutStore = useAppLayoutStore();

const props = withDefaults(defineProps<{
  stripBehavior?: StripBehavior
  stripActivation: StripActivation
}>(), {
  stripBehavior: 'consuming',
});

const stripClasses = computed(() =>
  'relative flex h-full w-[50px] flex-none flex-col items-center border-r border-gray-200 bg-white py-4 text-gray-500',
);

const isSettingsActive = computed(() => route.path.startsWith('/settings'));
const showSettingsNavigation = computed(() => isFeatureAvailableInRuntime('desktopSettings'));

const emit = defineEmits<{
  (event: 'request-redock'): void
}>();

const activateStrip = (event?: MouseEvent): void => {
  if (props.stripActivation === 'redock-panel') {
    emit('request-redock');
    return;
  }

  const trigger = event?.currentTarget instanceof HTMLElement
    ? event.currentTarget
    : document.activeElement;
  rememberDrawerTrigger(trigger);

  if (appLayoutStore.isMobileMenuOpen) {
    appLayoutStore.closeMobileMenu();
  } else {
    appLayoutStore.openMobileMenu();
  }
};
const pushRoute = async (target: RouteLocationRaw): Promise<void> => {
  try {
    await router.push(target);
  } catch (error) {
    console.error('LeftSidebarStrip navigation error:', error);
  }
};

const handlePrimaryClick = async (key: ShellPrimaryNavKey, event: MouseEvent): Promise<void> => {
  activateStrip(event);

  if (props.stripActivation === 'open-drawer') {
    return;
  }

  await pushRoute(resolvePrimaryRoute(key));
};

const handleSettingsClick = async (event: MouseEvent): Promise<void> => {
  activateStrip(event);

  if (props.stripActivation === 'open-drawer') {
    return;
  }

  await pushRoute('/settings');
};

onMounted(() => {
  void ensurePrimaryNavigationReady().catch(() => undefined);
});
</script>
