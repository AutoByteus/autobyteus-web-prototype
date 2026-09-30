<template>
  <div
    class="rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300"
    :class="hasMenus ? 'relative' : 'overflow-hidden'"
  >
    <!-- With a `/` or `@` menu, only the Context Files area clips, so the menu can open above the box. -->
    <div :class="hasMenus ? 'overflow-hidden rounded-t-xl' : ''">
      <ContextFilePathInputArea :target="target" />
    </div>
    <div class="border-t border-gray-100" :class="hasMenus ? 'rounded-b-xl' : ''">
      <!-- `@` mentions chosen for this message (cross-scope-agent-mentions). -->
      <div
        v-if="mentions.chips.value.length"
        class="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-3 pt-2.5"
        data-test="agent-input-mention-chips"
      >
        <RunMentionChips :chips="mentions.chips.value" @remove="removeMention" />
      </div>
      <div
        v-if="skillTagging && requestedSkillNames.length"
        class="flex flex-wrap items-center gap-1.5 px-3 pt-2.5"
        data-test="agent-input-skill-chips"
      >
        <SkillTagChips :names="requestedSkillNames" @remove="removeSkill" />
      </div>
      <AgentUserInputTextArea :target="target" :before-send="beforeSend" :skill-tagging="skillTagging" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContextFilePathInputArea from '~/components/agentInput/ContextFilePathInputArea.vue';
import AgentUserInputTextArea from '~/components/agentInput/AgentUserInputTextArea.vue';
import SkillTagChips from '~/components/chat/SkillTagChips.vue';
import RunMentionChips from '~/components/agentInput/RunMentionChips.vue';
import { mentionToken, useRunMentions, type RunMentionChip } from '~/composables/agentInput/useRunMentions';
import { removeDraftMention } from '~/prototype/run-mentions/runMentionState';
import { computed } from 'vue';
import { useComposerTarget } from '~/composables/agentInput/useComposerTarget';
import type { SkillTaggingCapability } from '~/composables/agentInput/useSkillTagMenu';

const props = defineProps<{
  beforeSend?: () => void | Promise<void>;
  /** `/` skill tags and their chip row; supplied only for standalone agent runs. */
  skillTagging?: SkillTaggingCapability | null;
}>();

const target = useComposerTarget();
const mentions = useRunMentions();
const hasMenus = computed(() => Boolean(props.skillTagging) || mentions.available.value);

/** Removing a chip keeps the words and drops the mention. */
const removeMention = (chip: RunMentionChip) => {
  const context = target.value?.context;
  if (!context) return;
  removeDraftMention(context.state.runId, chip.key);
  context.requirement = context.requirement.split(mentionToken(chip.name)).join(chip.name);
};
const requestedSkillNames = computed(() => target.value?.context.requestedSkillNames ?? []);
const removeSkill = (name: string) => {
  const context = target.value?.context;
  if (!context) return;
  context.requestedSkillNames = context.requestedSkillNames.filter((entry) => entry !== name);
};
</script>
