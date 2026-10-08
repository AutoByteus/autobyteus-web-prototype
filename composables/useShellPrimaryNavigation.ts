import { computed, type ComputedRef } from 'vue';
import { useRoute, type RouteLocationRaw } from 'vue-router';
import { useApplicationsCapabilityStore } from '~/stores/applicationsCapabilityStore';
import { useProjectsCapabilityStore } from '~/stores/projectsCapabilityStore';
import { isFeatureAvailableInRuntime } from '~/utils/mobileFeatureGates';

export type ShellPrimaryNavKey =
  | 'chat'
  | 'agents'
  | 'agentTeams'
  | 'agentOrgs'
  | 'applications'
  | 'skills'
  | 'memory'
  | 'nodes'
  | 'projects';

export interface ShellPrimaryNavItem {
  key: ShellPrimaryNavKey;
  labelKey: string;
  icon: string;
}

export const SHELL_NODES_NETWORK_ICON = 'autobyteus:nodes-network';

const allShellPrimaryNavItems: readonly ShellPrimaryNavItem[] = [
  { key: 'chat', labelKey: 'shell.navigation.chat', icon: 'heroicons:chat-bubble-left-right' },
  { key: 'agents', labelKey: 'shell.navigation.agents', icon: 'heroicons:users' },
  { key: 'agentTeams', labelKey: 'shell.navigation.agentTeams', icon: 'heroicons:user-group' },
  { key: 'agentOrgs', labelKey: 'shell.navigation.agentOrgs', icon: 'heroicons:building-office-2' },
  { key: 'projects', labelKey: 'shell.navigation.projects', icon: 'heroicons:folder' },
  { key: 'applications', labelKey: 'shell.navigation.applications', icon: 'heroicons:squares-2x2' },
  { key: 'skills', labelKey: 'shell.navigation.skills', icon: 'heroicons:sparkles' },
  { key: 'memory', labelKey: 'shell.navigation.memory', icon: 'ph:brain' },
  { key: 'nodes', labelKey: 'shell.navigation.nodes', icon: SHELL_NODES_NETWORK_ICON },
];

export function resolveShellPrimaryRoute(key: ShellPrimaryNavKey): RouteLocationRaw {
  switch (key) {
    case 'chat':
      return '/chat';
    case 'agents':
      return { path: '/agents', query: { view: 'list' } };
    case 'agentTeams':
      return { path: '/agent-teams', query: { view: 'team-list' } };
    case 'agentOrgs':
      return { path: '/agent-orgs', query: { view: 'org-list' } };
    case 'applications':
      return '/applications';
    case 'skills':
      return '/skills';
    case 'memory':
      return '/memory';
    case 'nodes':
      return '/nodes';
    case 'projects':
      return '/projects';
  }
}

export function isShellPrimaryRouteActive(key: ShellPrimaryNavKey, path: string): boolean {
  switch (key) {
    case 'chat':
      return path.startsWith('/chat');
    case 'agents':
      return path.startsWith('/agents');
    case 'agentTeams':
      return path.startsWith('/agent-teams');
    case 'agentOrgs':
      return path.startsWith('/agent-orgs');
    case 'applications':
      return path.startsWith('/applications');
    case 'skills':
      return path.startsWith('/skills');
    case 'memory':
      return path.startsWith('/memory');
    case 'nodes':
      return path.startsWith('/nodes');
    case 'projects':
      return path.startsWith('/projects');
  }
}

export function useShellPrimaryNavigation(): {
  primaryNavItems: ComputedRef<readonly ShellPrimaryNavItem[]>;
  resolvePrimaryRoute: (key: ShellPrimaryNavKey) => RouteLocationRaw;
  isPrimaryNavActive: (key: ShellPrimaryNavKey) => boolean;
  isRunOpen: ComputedRef<boolean>;
  ensurePrimaryNavigationReady: () => Promise<unknown>;
} {
  const route = useRoute();
  const applicationsCapabilityStore = useApplicationsCapabilityStore();
  const projectsCapabilityStore = useProjectsCapabilityStore();

  // An open run: an Agent run in chat (`/chat?id=…`) or a Team/Org run in the workspace view.
  const isRunOpen = computed(() => route.path.startsWith('/workspace')
    || (route.path.startsWith('/chat') && Boolean(String(route.query.id ?? '').trim())));

  const primaryNavItems = computed(() => {
    return allShellPrimaryNavItems.filter((item) => {
      if (item.key === 'applications') {
        return applicationsCapabilityStore.isEnabled && isFeatureAvailableInRuntime('applicationIframe');
      }
      if (item.key === 'nodes') {
        return isFeatureAvailableInRuntime('desktopSettings');
      }
      if (item.key === 'projects') {
        return projectsCapabilityStore.isEnabled && isFeatureAvailableInRuntime('projects');
      }
      return true;
    });
  });

  return {
    primaryNavItems,
    resolvePrimaryRoute: resolveShellPrimaryRoute,
    // collapsed-left-panel-expand-keeps-run (round 2): Chat is lit only on New chat (`/chat` with no
    // run id), because clicking it opens New chat. An open run lights the strip's Workspaces icon.
    isPrimaryNavActive: (key: ShellPrimaryNavKey) => isShellPrimaryRouteActive(key, route.path)
      && !(key === 'chat' && isRunOpen.value),
    isRunOpen,
    ensurePrimaryNavigationReady: () => Promise.allSettled([
      applicationsCapabilityStore.ensureResolved(),
      projectsCapabilityStore.ensureResolved(),
    ]),
  };
}
