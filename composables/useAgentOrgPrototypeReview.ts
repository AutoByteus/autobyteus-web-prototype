import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const AGENT_ORG_PROTOTYPE_REVIEW_KEY = 'agent-org-flat';

export const useAgentOrgPrototypeReview = () => {
  const route = useRoute();
  const router = useRouter();

  const active = computed(() => (
    route.query.prototypeReview === AGENT_ORG_PROTOTYPE_REVIEW_KEY
    || route.path.startsWith('/agent-orgs')
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
        prototypeReview: AGENT_ORG_PROTOTYPE_REVIEW_KEY,
        ...normalized,
      },
    });
  };

  return { active, push };
};
