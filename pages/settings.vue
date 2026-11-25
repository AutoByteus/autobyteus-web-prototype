<template>
  <div
    class="flex h-full min-w-0 flex-col bg-white md:flex-row"
    data-testid="settings-page-layout"
    :style="navigationWidthStyle"
  >
    <!-- extensions-ui-516 (design, founder 2026-11-25): on narrow widths a compact header with a breadcrumb replaces the
         stacked section list; the list opens as a sheet from "Settings" or the menu button. -->
    <div class="sticky top-0 z-30 flex shrink-0 items-center gap-1 border-b border-gray-200 bg-white px-2 py-1.5 md:hidden" data-testid="settings-narrow-header">
      <button
        type="button"
        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-label="$t('settings.page.backAriaLabel')"
        data-testid="settings-narrow-back"
        @click="goBackToWorkspace"
      ><Icon icon="heroicons:arrow-left-20-solid" class="h-5 w-5" /></button>
      <nav class="min-w-0 flex-1" :aria-label="$t('settings.page.breadcrumb')">
        <ol class="flex min-w-0 items-center gap-1 text-sm">
          <li class="flex-shrink-0">
            <button type="button" class="rounded px-1 py-1 text-gray-500 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-testid="settings-breadcrumb-root" @click="openSectionSheet">{{ $t('settings.page.title') }}</button>
          </li>
          <li class="flex-shrink-0 text-gray-300" aria-hidden="true">›</li>
          <li class="min-w-0 truncate font-semibold text-gray-900" aria-current="page" data-testid="settings-breadcrumb-current">{{ $t(sectionLabelKey(activeSection)) }}</li>
        </ol>
      </nav>
      <button
        ref="sectionMenuButtonRef"
        type="button"
        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-label="$t('settings.page.allSections')"
        :aria-expanded="sectionSheetOpen"
        aria-controls="settings-section-sheet"
        data-testid="settings-narrow-menu"
        @click="sectionSheetOpen ? closeSectionSheet() : openSectionSheet()"
      ><Icon :icon="sectionSheetOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-20-solid'" class="h-5 w-5" /></button>
    </div>
    <Teleport to="body">
      <div v-if="sectionSheetOpen" class="fixed inset-0 z-50 md:hidden" data-testid="settings-section-sheet-overlay" @keydown.esc="closeSectionSheet">
        <div class="absolute inset-0 bg-black/30" aria-hidden="true" @click="closeSectionSheet"></div>
        <div id="settings-section-sheet" class="absolute inset-x-0 top-0 max-h-[85dvh] overflow-y-auto rounded-b-2xl bg-white pb-2 shadow-xl" role="dialog" aria-modal="true" :aria-label="$t('settings.page.allSections')" data-testid="settings-section-sheet">
          <div class="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
            <span class="text-base font-semibold text-gray-900">{{ $t('settings.page.title') }}</span>
            <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" :aria-label="$t('settings.page.closeSections')" @click="closeSectionSheet"><Icon icon="heroicons:x-mark-20-solid" class="h-5 w-5" /></button>
          </div>
          <ul class="px-2 pt-2">
            <li v-for="section in NARROW_SECTIONS" :key="section.id">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[15px] text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                :class="activeSection === section.id ? 'bg-gray-100 font-semibold text-gray-900' : ''"
                :aria-current="activeSection === section.id ? 'page' : undefined"
                :data-testid="`settings-sheet-${section.id}`"
                @click="chooseSection(section.id)"
              >
                {{ $t(section.labelKey) }}
                <Icon v-if="activeSection === section.id" icon="heroicons:check-20-solid" class="h-5 w-5 text-blue-600" />
              </button>
            </li>
          </ul>
          <div class="mx-2 mt-1 border-t border-gray-100 pt-1">
            <button type="button" class="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-[15px] text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" @click="goBackToWorkspace">
              <Icon icon="heroicons:arrow-left-20-solid" class="h-5 w-5" />{{ $t('settings.page.backLabel') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Sidebar -->
    <div
      ref="navigationRef"
      class="settings-page-navigation-resizable hidden max-h-[38dvh] w-full shrink-0 overflow-y-auto border-b border-gray-200 bg-white md:block md:max-h-none md:border-b-0"
      data-testid="settings-page-navigation"
      :inert="isNavigationInteractionHidden || undefined"
      :aria-hidden="isNavigationInteractionHidden ? 'true' : undefined"
    >
      <div class="px-2 py-3 sm:px-4 sm:py-4 md:py-5">
        <nav class="w-full">
          <ul class="w-full space-y-2">
            <li class="w-full border-b border-gray-100 pb-2">
              <button
                ref="narrowFocusFallbackRef"
                type="button"
                :aria-label="$t('settings.page.backAriaLabel')"
                data-testid="settings-nav-back"
                class="flex w-full items-center justify-start rounded-md px-4 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800"
                @click="goBackToWorkspace"
              >
                <Icon icon="heroicons:arrow-left-20-solid" class="h-5 w-5 flex-shrink-0" />
                <span class="ml-2 text-sm font-medium">{{ $t('settings.page.backLabel') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'api-keys'"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'api-keys' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.apiKeys') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'agent-runtimes'"
                data-testid="settings-nav-agent-runtimes"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'agent-runtimes' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.agentRuntimes') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'model-routing'"
                data-testid="settings-nav-model-routing"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'model-routing' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.modelRouting') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'token-usage'"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'token-usage' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.tokenUsage') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'display'"
                data-testid="settings-nav-display"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'display' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.display') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'language'"
                data-testid="settings-nav-language"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'language' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.language') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'local-tools'"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'local-tools' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.localTools') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'mcp-servers'"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'mcp-servers' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.mcpServers') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'application-packages'"
                data-testid="settings-nav-application-packages"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'application-packages' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.applicationPackages') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'agent-packages'"
                data-testid="settings-nav-agent-packages"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'agent-packages' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.agentPackages') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="selectServerSettings()"
                data-testid="settings-nav-server-settings"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'text-gray-900 font-medium': activeSection === 'server-settings' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.serverSettings') }}</span>
              </button>
              <div v-if="activeSection === 'server-settings'" class="ml-2 mt-1 pl-3 space-y-1">
                <button
                  type="button"
                  data-testid="settings-nav-server-settings-quick"
                  class="w-full text-left px-3 py-1.5 text-base rounded-md transition-colors duration-200"
                  :class="serverSettingsMode === 'quick' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                  @click="selectServerSettings('quick')"
                >
                  {{ $t('settings.page.serverSettings.quick') }}
                </button>
                <button
                  type="button"
                  data-testid="settings-nav-server-settings-embedding"
                  class="w-full text-left px-3 py-1.5 text-base rounded-md transition-colors duration-200"
                  :class="serverSettingsMode === 'embedding' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                  @click="selectServerSettings('embedding')"
                >
                  {{ $t('settings.page.serverSettings.embedding') }}
                </button>
                <button
                  type="button"
                  data-testid="settings-nav-server-settings-advanced"
                  class="w-full text-left px-3 py-1.5 text-base rounded-md transition-colors duration-200"
                  :class="serverSettingsMode === 'advanced' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                  @click="selectServerSettings('advanced')"
                >
                  {{ $t('settings.page.serverSettings.advanced') }}
                </button>
                <button
                  type="button"
                  data-testid="settings-nav-server-settings-migrations"
                  class="w-full text-left px-3 py-1.5 text-base rounded-md transition-colors duration-200"
                  :class="serverSettingsMode === 'migrations' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
                  @click="selectServerSettings('migrations')"
                >
                  {{ $t('settings.page.serverSettings.migrations') }}
                </button>
              </div>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'extensions'"
                data-testid="settings-nav-extensions"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'extensions' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.extensions') }}</span>
              </button>
            </li>
            <li class="w-full">
              <button
                @click="activeSection = 'updates'"
                data-testid="settings-nav-updates"
                class="flex w-full items-center justify-start px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 group"
                :class="{ 'bg-gray-100 text-gray-900': activeSection === 'updates' }"
              >
                <span class="text-left">{{ $t('settings.page.sections.updates') }}</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div
      class="settings-navigation-separator-anchor relative z-20 hidden w-0 shrink-0 self-stretch overflow-visible md:block"
      data-testid="settings-navigation-separator-anchor"
    >
      <div
        class="settings-navigation-separator-edge pointer-events-none absolute inset-y-0 w-px"
        :style="separatorLineStyle"
        aria-hidden="true"
        data-testid="settings-navigation-separator-line"
      ></div>
      <div
        class="settings-navigation-separator-feedback pointer-events-none absolute inset-y-0 z-10 w-1 bg-transparent"
        :class="{ 'is-resizing': isResizing }"
        :style="separatorFeedbackStyle"
        aria-hidden="true"
        data-testid="settings-navigation-separator-feedback"
      ></div>
      <div
        ref="separatorRef"
        class="settings-navigation-resize-target absolute inset-y-0 z-20 w-2 cursor-col-resize touch-none bg-transparent"
        :style="separatorTargetStyle"
        role="separator"
        aria-orientation="vertical"
        :aria-label="$t('settings.page.resizeNavigationLabel')"
        :aria-valuemin="SETTINGS_NAVIGATION_MIN_WIDTH"
        :aria-valuemax="SETTINGS_NAVIGATION_MAX_WIDTH"
        :aria-valuenow="navigationWidth"
        tabindex="0"
        data-testid="settings-navigation-resize-handle"
        @pointerdown="startResize"
        @keydown="handleSeparatorKeydown"
      ></div>
    </div>

    <!-- Content section -->
    <div
      class="min-h-0 min-w-0 flex-1 overflow-auto bg-white p-2 sm:p-3 md:py-4 md:pl-0 md:pr-4"
      data-testid="settings-page-content"
    >
      <div class="h-full w-full flex flex-col">
        <ProviderAPIKeyManager v-if="activeSection === 'api-keys'" />
        <AgentRuntimesManager v-if="activeSection === 'agent-runtimes'" />
        <ModelRoutingManager v-if="activeSection === 'model-routing'" />
        <TokenUsageStatistics v-if="activeSection === 'token-usage'" />
        <DisplaySettingsManager v-if="activeSection === 'display'" />
        <LanguageSettingsManager v-if="activeSection === 'language'" />
        <ExtensionsManager v-if="activeSection === 'extensions'" />
        <AboutSettingsManager v-if="activeSection === 'updates'" />
        <ToolsManagementWorkspace
          v-if="activeSection === 'local-tools'"
          initial-root-section="local-tools"
        />
        <ToolsManagementWorkspace
          v-if="activeSection === 'mcp-servers'"
          initial-root-section="mcp-servers"
        />
        <ApplicationPackagesManager v-if="activeSection === 'application-packages'" />
        <AgentPackagesManager v-if="activeSection === 'agent-packages'" />
        <div
          v-if="activeSection === 'server-settings'"
          class="flex h-full min-h-0 flex-col"
        >
          <div class="min-h-0 flex-1">
            <ServerSettingsManager :section-mode="serverSettingsMode" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useServerStore } from '~/stores/serverStore';
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore';
import ProviderAPIKeyManager from '~/components/settings/ProviderAPIKeyManager.vue';
import AgentRuntimesManager from '~/components/settings/agent-runtimes/AgentRuntimesManager.vue';
import ModelRoutingManager from '~/components/settings/model-routing/ModelRoutingManager.vue';
import TokenUsageStatistics from '~/components/settings/TokenUsageStatistics.vue';
import ServerSettingsManager from '~/components/settings/ServerSettingsManager.vue';
import ExtensionsManager from '~/components/settings/ExtensionsManager.vue';
import AboutSettingsManager from '~/components/settings/AboutSettingsManager.vue';
import AgentPackagesManager from '~/components/settings/AgentPackagesManager.vue';
import ApplicationPackagesManager from '~/components/settings/ApplicationPackagesManager.vue';
import DisplaySettingsManager from '~/components/settings/DisplaySettingsManager.vue';
import LanguageSettingsManager from '~/components/settings/LanguageSettingsManager.vue';
import ToolsManagementWorkspace from '~/components/tools/ToolsManagementWorkspace.vue';
import {
  SETTINGS_NAVIGATION_MAX_WIDTH,
  SETTINGS_NAVIGATION_MIN_WIDTH,
  useSettingsNavigationResize,
} from '~/composables/useSettingsNavigationResize';

definePageMeta({
  layout: 'settings',
});

type SettingsSection =
  | 'api-keys'
  | 'agent-runtimes'
  | 'model-routing'
  | 'token-usage'
  | 'display'
  | 'language'
  | 'extensions'
  | 'updates'
  | 'local-tools'
  | 'mcp-servers'
  | 'application-packages'
  | 'agent-packages'
  | 'server-settings';
type ServerSettingsMode = 'quick' | 'embedding' | 'advanced' | 'migrations';

const route = useRoute();
const router = useRouter();
const serverStore = useServerStore();
const windowNodeContextStore = useWindowNodeContextStore();
const activeSection = ref<SettingsSection>('api-keys');
const serverSettingsMode = ref<ServerSettingsMode>('quick');
const isEmbeddedWindow = computed(() => windowNodeContextStore.isEmbeddedWindow);
// ---- extensions-ui-516 (design): the narrow header's breadcrumb and section sheet.
const NARROW_SECTIONS: Array<{ id: SettingsSection; labelKey: string }> = [
  { id: 'api-keys', labelKey: 'settings.page.sections.apiKeys' },
  { id: 'agent-runtimes', labelKey: 'settings.page.sections.agentRuntimes' },
  { id: 'model-routing', labelKey: 'settings.page.sections.modelRouting' },
  { id: 'token-usage', labelKey: 'settings.page.sections.tokenUsage' },
  { id: 'display', labelKey: 'settings.page.sections.display' },
  { id: 'language', labelKey: 'settings.page.sections.language' },
  { id: 'local-tools', labelKey: 'settings.page.sections.localTools' },
  { id: 'mcp-servers', labelKey: 'settings.page.sections.mcpServers' },
  { id: 'application-packages', labelKey: 'settings.page.sections.applicationPackages' },
  { id: 'agent-packages', labelKey: 'settings.page.sections.agentPackages' },
  { id: 'server-settings', labelKey: 'settings.page.sections.serverSettings' },
  { id: 'extensions', labelKey: 'settings.page.sections.extensions' },
  { id: 'updates', labelKey: 'settings.page.sections.updates' },
];
const sectionLabelKey = (id: SettingsSection): string => NARROW_SECTIONS.find((section) => section.id === id)?.labelKey ?? 'settings.page.title';
const sectionSheetOpen = ref(false);
const sectionMenuButtonRef = ref<HTMLButtonElement | null>(null);
const openSectionSheet = async (): Promise<void> => {
  sectionSheetOpen.value = true;
  await nextTick();
  (document.querySelector('[data-testid="settings-section-sheet"] [aria-current="page"]') as HTMLButtonElement | null)?.focus();
};
const closeSectionSheet = (): void => { sectionSheetOpen.value = false; void nextTick(() => sectionMenuButtonRef.value?.focus()); };
const chooseSection = (id: SettingsSection): void => {
  if (id === 'server-settings') selectServerSettings('quick'); else activeSection.value = id;
  closeSectionSheet();
};
const {
  navigationWidth,
  isResizing,
  isNavigationInteractionHidden,
  navigationRef,
  separatorRef,
  narrowFocusFallbackRef,
  navigationWidthStyle,
  separatorLineStyle,
  separatorFeedbackStyle,
  separatorTargetStyle,
  startResize,
  handleSeparatorKeydown,
} = useSettingsNavigationResize();
const validSections = new Set<SettingsSection>([
  'api-keys',
  'agent-runtimes',
  'model-routing',
  'token-usage',
  'display',
  'language',
  'extensions',
  'updates',
  'local-tools',
  'mcp-servers',
  'application-packages',
  'agent-packages',
  'server-settings',
]);

const normalizeSection = (section: string | undefined): SettingsSection | null => {
  if (!section) {
    return null;
  }

  const normalized = section === 'about' ? 'updates' : section;
  return validSections.has(normalized as SettingsSection) ? normalized as SettingsSection : null;
};

const normalizeServerSettingsMode = (mode: string | undefined): ServerSettingsMode =>
  mode === 'embedding' || mode === 'advanced' || mode === 'migrations' ? mode : 'quick';

const selectServerSettings = (mode: ServerSettingsMode = 'quick') => {
  activeSection.value = 'server-settings';
  serverSettingsMode.value = mode;
};

const goBackToWorkspace = async (): Promise<void> => {
  try {
    await router.push('/workspace');
  } catch (error) {
    console.error('settings page back navigation error:', error);
  }
};

onMounted(() => {
  // Check for section query parameter
  const sectionParam = route.query.section as string | undefined;
  if (sectionParam === 'server-status') {
    selectServerSettings('advanced');
  } else {
    const normalizedSection = normalizeSection(sectionParam);
    if (normalizedSection) {
      activeSection.value = normalizedSection;
      if (normalizedSection === 'server-settings') {
        serverSettingsMode.value = normalizeServerSettingsMode(route.query.mode as string | undefined);
      }
    }
  }

  // If server is not running and we are in Electron mode, default to server-settings section.
  if (isEmbeddedWindow.value && serverStore.status !== 'running') {
    selectServerSettings(serverSettingsMode.value);
  }
});
</script>

<style scoped>
@media (min-width: 768px) {
  .settings-page-navigation-resizable {
    width: var(--settings-navigation-width);
    overflow-x: hidden;
  }
}

.settings-navigation-separator-edge {
  background: #e5e7eb;
  box-shadow: 1px 0 3px rgb(0 0 0 / 10%);
}

.settings-navigation-separator-feedback {
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.settings-navigation-separator-anchor:hover .settings-navigation-separator-feedback,
.settings-navigation-separator-anchor:focus-within .settings-navigation-separator-feedback {
  background-color: #9ca3af;
}

.settings-navigation-separator-anchor .settings-navigation-separator-feedback.is-resizing {
  background-color: #6b7280;
}

.settings-navigation-resize-target:focus-visible {
  outline: 2px solid #6b7280;
  outline-offset: -2px;
}
</style>
