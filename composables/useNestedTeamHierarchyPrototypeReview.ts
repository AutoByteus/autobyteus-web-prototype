import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export type NestedHierarchyTreatment = 'rails' | 'surfaces' | 'hybrid';
export type NestedHierarchyMetadata = 'full' | 'responsive' | 'on-demand';
export type NestedHierarchyTeamIdentity = 'icon' | 'header' | 'band';
export type NestedHierarchyReviewState = 'collapsed' | 'one' | 'several' | 'deep' | 'selected';
export type NestedHierarchyPanelWidth = 260 | 320 | 520;
export type NestedHierarchyFontSize = 'default' | 'extra-large';

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

  const active = computed(() => route.query.prototypeReview === REVIEW_KEY);
  const treatment = computed(() => oneOf(
    route.query.hierarchy,
    ['rails', 'surfaces', 'hybrid'] as const,
    'hybrid',
  ));
  const metadata = computed(() => oneOf(
    route.query.metadata,
    ['full', 'responsive', 'on-demand'] as const,
    'responsive',
  ));
  const teamIdentity = computed(() => oneOf(
    route.query.teamIdentity,
    ['icon', 'header', 'band'] as const,
    'header',
  ));
  const reviewState = computed(() => oneOf(
    route.query.treeState,
    ['collapsed', 'one', 'several', 'deep', 'selected'] as const,
    'deep',
  ));
  const width = computed(() => panelWidth(route.query.panelWidth));
  const fontSize = computed(() => oneOf(
    route.query.fontSize,
    ['default', 'extra-large'] as const,
    'default',
  ));

  const update = async (changes: Record<string, string | number>): Promise<void> => {
    await router.replace({
      query: {
        ...route.query,
        prototypeReview: REVIEW_KEY,
        ...changes,
      },
    });
  };

  return {
    active,
    treatment,
    metadata,
    teamIdentity,
    reviewState,
    width,
    fontSize,
    update,
  };
};
