import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const AGENT_ORG_PROTOTYPE_REVIEW_KEY = 'agent-org-flat';

export const useAgentOrgPrototypeReview = () => {
  const route = useRoute();
  const router = useRouter();

  const reviewActive = computed(() => (
    route.query.prototypeReview === AGENT_ORG_PROTOTYPE_REVIEW_KEY
  ));
  const active = computed(() => (
    reviewActive.value
    || route.path.startsWith('/agent-orgs')
    || route.path.startsWith('/agent-teams')
    || (route.path.startsWith('/agents') && typeof route.query.returnToTeam === 'string')
    || (route.path.startsWith('/workspace') && (route.query.root === 'org' || route.query.root === 'team'))
  ));

  const push = async (
    path: string,
    query: Record<string, string | undefined> = {},
  ): Promise<void> => {
    const normalized = Object.fromEntries(
      Object.entries(query).filter(([, value]) => typeof value === 'string' && value.length > 0),
    );
    await router.push({
      path,
      query: {
        ...(reviewActive.value ? { prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY } : {}),
        ...normalized,
      },
    });
  };

  return { active, reviewActive, push };
};
