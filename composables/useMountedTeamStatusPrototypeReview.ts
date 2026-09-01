import { computed } from 'vue';
import { useRoute } from 'vue-router';

export const MOUNTED_TEAM_STATUS_REVIEW_KEY = 'aorg-team-status';
export type MountedTeamStatusReviewState = 'active' | 'collapsed' | 'historical';

export const useMountedTeamStatusPrototypeReview = () => {
  const route = useRoute();
  const reviewActive = computed(() => route.query.prototypeReview === MOUNTED_TEAM_STATUS_REVIEW_KEY);
  const state = computed<MountedTeamStatusReviewState>(() => {
    const value = route.query.statusState;
    return value === 'collapsed' || value === 'historical' ? value : 'active';
  });

  return {
    state,
    collapsed: computed(() => reviewActive.value && state.value === 'collapsed'),
    historical: computed(() => reviewActive.value && state.value === 'historical'),
  };
};
