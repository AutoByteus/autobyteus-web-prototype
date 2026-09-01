import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeftPanel } from '~/composables/useLeftPanel';

export type NestedHierarchyTreatment = 'rails' | 'surfaces' | 'hybrid';
export type NestedHierarchyMetadata = 'full' | 'responsive' | 'on-demand';
export type NestedHierarchyTeamIdentity = 'icon' | 'header' | 'band';
export type NestedHierarchyReviewState = 'collapsed' | 'one' | 'several' | 'deep' | 'selected';
export type NestedHierarchyPanelWidth = 260 | 320 | 520;
export type NestedHierarchyFontSize = 'default' | 'extra-large';
export type NestedHierarchyReviewView = 'proposal' | 'compare';

const REVIEW_KEY = 'nested-team-hierarchy';

const oneOf = <T extends string>(value: unknown, options: readonly T[], fallback: T): T =>
  typeof value === 'string' && options.includes(value as T) ? value as T : fallback;

const panelWidth = (value: unknown): NestedHierarchyPanelWidth => {
  const normalized = Number(Array.isArray(value) ? value[0] : value);
  return normalized === 260 || normalized === 520 ? normalized : 320;
};

export const useNestedTeamHierarchyPrototypeReview = () => {
  const route = useRoute();
  const router = useRouter();
  const { leftPanelWidth } = useLeftPanel();

  const reviewActive = computed(() => route.query.prototypeReview === REVIEW_KEY);
  const active = computed(() => route.path === '/workspace');
  const view = computed(() => oneOf(
    route.query.reviewView,
    ['proposal', 'compare'] as const,
    'proposal',
  ));
  const treatment = computed(() => oneOf(
    route.query.hierarchy,
    ['rails', 'surfaces', 'hybrid'] as const,
    'rails',
  ));
  const metadata = computed(() => oneOf(
    route.query.metadata,
    ['full', 'responsive', 'on-demand'] as const,
    'responsive',
  ));
  const teamIdentity = computed(() => oneOf(
    route.query.teamIdentity,
    ['icon', 'header', 'band'] as const,
    'icon',
  ));
  const reviewState = computed(() => oneOf(
    route.query.treeState,
    ['collapsed', 'one', 'several', 'deep', 'selected'] as const,
    'collapsed',
  ));
  const width = computed(() => {
    if (reviewActive.value) return panelWidth(route.query.panelWidth);
    if (leftPanelWidth.value < 290) return 260;
    if (leftPanelWidth.value >= 420) return 520;
    return 320;
  });
  const fontSize = computed(() => oneOf(
    route.query.fontSize,
    ['default', 'extra-large'] as const,
    'default',
  ));

  const update = async (changes: Record<string, string | number>): Promise<void> => {
    await router.replace({
      query: {
        ...route.query,
        ...(reviewActive.value ? { prototypeReview: REVIEW_KEY } : {}),
        ...changes,
      },
    });
  };

  const showProposal = async (): Promise<void> => {
    await update({
      reviewView: 'proposal',
      hierarchy: 'rails',
      metadata: 'responsive',
      teamIdentity: 'icon',
      panelWidth: 320,
      fontSize: 'default',
      treeState: 'collapsed',
    });
  };

  const showComparison = async (): Promise<void> => {
    await update({ reviewView: 'compare' });
  };

  return {
    active,
    reviewActive,
    view,
    treatment,
    metadata,
    teamIdentity,
    reviewState,
    width,
    fontSize,
    update,
    showProposal,
    showComparison,
  };
};
