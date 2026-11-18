/**
 * phone-baseline-refresh-279: stand-ins under the source's phone Settings screen (`components/mobile/views/MobileRunSettings.vue`,
 * `origin/personal@f7b4d68711`, autobyteus-458/522). The source reads and saves the open run's selection through the
 * desktop's saved-run settings store (`useExistingRunConfigStore`) and stops it through `useRunStopAction`; the desktop
 * surfaces of this UI reference keep their earlier pin, so the phone screen imports these two instead (its only change).
 *
 * Nothing here is the node's logic. The selection is the open run's own config (what New run started it with), the
 * "the node holds the run" answer is its status, Save writes the config back, and the node's refusal is scripted: with
 * the starting state `mobile_settings_refused` (`localStorage` `autobyteus.prototype.scenario`) the first Save is refused
 * in the node's words (`run-model-selection-refusal.ts`), later ones succeed. A stop marks the run stopped.
 */
import { computed, reactive, ref, watch, type Ref } from 'vue';
import { agentRuntimeName } from '@autobyteus/agent-presentation-contracts';
import { hasBeenStopped, markStopped, saveIsRefused } from '~/prototype/mobile-runs/runSettingsFixture';
import { mobileRunNode } from '~/prototype/mobile-runs/mobileRunsFixture';
import { useActiveContextStore } from '~/stores/activeContextStore';
import { useRunTreeStore } from '~/stores/runTreeStore';
import type { ActiveAgentWorkspaceTarget } from '~/types/workspace/activeAgentWorkspaceTarget';
import { mobileRunSettingsScope as sourceScope, type MobileRunSettingsScope } from '~/utils/mobile/mobileRunSettingsScope';

/**
 * The scope as the source's `mobileRunSettingsScope` gives it. The UI reference holds a simulated peer run as a local run
 * underneath (its `browse` is `run`); the source's peer run is a `peerRun` subject, so Settings names it `remote`.
 */
export const mobileRunSettingsScope = (target: ActiveAgentWorkspaceTarget): MobileRunSettingsScope =>
  (useRunTreeStore().peerRunOf(target.context.state.runId) ? { kind: 'remote' } : sourceScope(target));

type Selection = { runtimeKind: string; llmModelIdentifier: string; llmConfig: Record<string, unknown> | null };
type Scope = { original: Selection; draft: Selection };
type Draft =
  | { kind: 'agent'; runId: string; isActive: boolean; editability: { editable: boolean }; metadata: Selection; draftSelection: Selection }
  | { kind: 'team'; teamRunId: string; isActive: boolean; editability: { editable: boolean }; planner: { scopesByAddress: Record<string, { originalSelection: Selection; draftSelection: Selection }> } }
  | { kind: 'agent_org'; orgRunId: string; isActive: boolean; editability: { editable: boolean }; planner: { scopesByAddress: Record<string, { originalSelection: Selection; draftSelection: Selection }> } };

const openTarget = () => useActiveContextStore().activeWorkspaceTarget;
const configOf = () => openTarget()?.context.config as unknown as Selection | undefined;
const savedOf = (): Selection => {
  const config = configOf();
  return { runtimeKind: config?.runtimeKind ?? 'autobyteus', llmModelIdentifier: config?.llmModelIdentifier ?? '', llmConfig: config?.llmConfig ?? null };
};
const same = (a: Selection, b: Selection): boolean => a.runtimeKind === b.runtimeKind && a.llmModelIdentifier === b.llmModelIdentifier
  && JSON.stringify(a.llmConfig ?? null) === JSON.stringify(b.llmConfig ?? null);

/** The node holds the run (idle or working): an agent run by its own status, a Team or Org run by the run's. */
const isActiveRun = (runId: string, agentRunId: string | undefined): boolean => {
  if (hasBeenStopped(runId)) return false;
  const status = String(openTarget()?.context.state.currentStatus ?? 'offline').toLowerCase();
  if (agentRunId && agentRunId !== runId) {
    const run = mobileRunNode(runId);
    return run ? run.status !== 'offline' && !hasBeenStopped(agentRunId) : status !== 'offline';
  }
  return status !== 'offline';
};

let refusedOnce = false;
const state = reactive({
  draft: null as Draft | null,
  scope: null as Scope | null,
  address: '/',
  saving: false,
  loadingCanonical: false,
  reconciling: false,
  reconciliationRequired: false,
  feedback: null as { kind: 'success' | 'error'; message: string } | null,
  /** A "not offered" refusal leaves the refused model's settings unavailable until another choice (as the source does). */
  modelBlocked: false,
});

const build = (): void => {
  const target = openTarget();
  if (!target) { state.draft = null; return; }
  const scope = mobileRunSettingsScope(target);
  if (scope.kind === 'remote') { state.draft = null; return; }
  const original = savedOf();
  const previous = state.scope && same(state.scope.original, original) ? state.scope.draft : original;
  state.scope = { original, draft: { ...previous } };
  state.address = scope.address;
  const agentRunId = target.context.state.runId;
  if (scope.kind === 'agent') {
    state.draft = { kind: 'agent', runId: scope.runId, isActive: isActiveRun(scope.runId, agentRunId), editability: { editable: true }, metadata: original, draftSelection: state.scope.draft };
    return;
  }
  const scopesByAddress = { [scope.address]: { originalSelection: original, draftSelection: state.scope.draft } };
  state.draft = scope.kind === 'team'
    ? { kind: 'team', teamRunId: scope.teamRunId, isActive: isActiveRun(scope.teamRunId, agentRunId), editability: { editable: true }, planner: { scopesByAddress } }
    : { kind: 'agent_org', orgRunId: scope.orgRunId, isActive: isActiveRun(scope.orgRunId, agentRunId), editability: { editable: true }, planner: { scopesByAddress } };
};
const load = async (): Promise<boolean> => { state.scope = null; state.feedback = null; state.modelBlocked = false; build(); return true; };
const update = (next: Selection): void => {
  if (!state.scope || !state.draft || state.draft.isActive) return;
  state.scope = { ...state.scope, draft: { ...next } };
  state.feedback = null;
  state.modelBlocked = false;
  build();
};

const store = reactive({
  ...toRefsOf(state),
  canSave: computed(() => Boolean(state.draft && state.scope && !state.draft.isActive && state.draft.editability.editable
    && !state.modelBlocked && !same(state.scope.original, state.scope.draft))),
  loadAgentCanonical: (_runId: string) => load(),
  loadTeamCanonical: (_teamRunId: string) => load(),
  loadAgentOrgCanonical: (_orgRunId: string) => load(),
  reloadCanonical: async (): Promise<void> => { build(); },
  clear: (): void => { state.draft = null; state.scope = null; state.feedback = null; state.modelBlocked = false; },
  updateAgentModelConfig: (selection: { llmModelIdentifier: string; llmConfig: Record<string, unknown> | null }, runtimeKind: string): void =>
    update({ runtimeKind, llmModelIdentifier: selection.llmModelIdentifier, llmConfig: selection.llmConfig ?? null }),
  updateTeamScopeModelConfig: (_address: string, selection: Selection): void => update(selection),
  updateAgentOrgScopeModelConfig: (_address: string, selection: Selection): void => update(selection),
  save: async (): Promise<boolean> => {
    const scope = state.scope, config = configOf();
    if (!scope || !config) return false;
    state.saving = true;
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    state.saving = false;
    if (saveIsRefused() && !refusedOnce) {
      refusedOnce = true;
      const forScope = state.address !== '/' ? ` (for '${state.address}')` : '';
      state.feedback = { kind: 'error', message: `'${scope.draft.llmModelIdentifier}' is not offered by ${agentRuntimeName(scope.draft.runtimeKind)} now${forScope}. Refresh the model list and choose again.` };
      state.modelBlocked = true;
      return false;
    }
    Object.assign(config, { runtimeKind: scope.draft.runtimeKind, llmModelIdentifier: scope.draft.llmModelIdentifier, llmConfig: scope.draft.llmConfig });
    state.scope = null;
    build();
    return true;
  },
});

function toRefsOf<T extends object>(source: T): { [K in keyof T]: Ref<T[K]> } {
  return Object.fromEntries(Object.keys(source).map((key) => [key, computed({
    get: () => (source as Record<string, unknown>)[key],
    set: (value) => { (source as Record<string, unknown>)[key] = value; },
  })])) as never;
}

/** The phone Settings' stand-in for `useExistingRunConfigStore` (the same calls and fields the screen reads). */
export const useExistingRunConfigStore = () => store;

/** The run whose settings are open: an Agent run, a Team run or an Org run. */
export type RunStopSubject =
  | Readonly<{ kind: 'agent'; runId: string }>
  | Readonly<{ kind: 'team'; teamRunId: string }>
  | Readonly<{ kind: 'agent_org'; orgRunId: string }>;

/**
 * Stand-in for `useRunStopAction`: the node stops the run the scope belongs to (a member's Team or Org run with all its
 * members), then the screen reads it again. Scripted: it always stops.
 */
export function useRunStopAction(subject: Ref<RunStopSubject | null>, options: { onStopped?: () => Promise<void> | void; shell?: string } = {}) {
  const pending = ref(false);
  const failed = ref(false);
  watch(subject, () => { failed.value = false; });
  const error = computed(() => (failed.value ? 'The run did not stop.' : null));
  const stop = async (): Promise<void> => {
    const current = subject.value;
    if (!current || pending.value) return;
    pending.value = true;
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    const runId = current.kind === 'agent' ? current.runId : current.kind === 'team' ? current.teamRunId : current.orgRunId;
    markStopped(runId);
    for (const member of mobileRunNode(runId)?.children ?? []) markStopped(member.id);
    const target = openTarget();
    if (target) {
      markStopped(target.context.state.runId);
      (target.context.state as { currentStatus: string }).currentStatus = 'offline';
      target.context.state.backgroundTasksRunning = 0;
    }
    pending.value = false;
    await options.onStopped?.();
  };
  return { pending, error, label: computed(() => 'Stop run'), stop };
}
