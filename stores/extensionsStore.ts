import { defineStore } from 'pinia';
import { THIS_COMPUTER_OFF, usePrivateNetworkStore } from '~/stores/privateNetworkStore';
import { useWindowNodeContextStore } from '~/stores/windowNodeContextStore';

/**
 * extensions-ui-516 (design only). Settings → Extensions on the extension foundation of autobyteus-516 Stage 1.
 *
 * In the product, each node's extension manager answers the node API of extension-contract.md §6 (the list with one
 * state per extension; Install, Update, Remove, Turn on/off; the log; an extension's actions), and each extension's
 * server part does the work. Here a small scripted world stands for every node's manager and for the two extensions'
 * server parts. Every name, version, size, path, log line and timing below is invented.
 *
 * Starting state (no visible control): `localStorage['autobyteus.prototype.extensions']` =
 *   (none) Voice Input installed and on · `fresh` nothing installed · `voice_failed` · `voice_update` (1.1.0 offered) ·
 *   `voice_not_available` (this computer is linux-arm64) · `voice_newer_contract` · `voice_update_newer_contract` · `extension_broken` · `state_unreadable` · `network_*` (Private Network installed and on; the network's state
 *   is chosen in stores/privateNetworkStore.ts: joined, approval, sign-in expired, signed out, unreachable, access rules …).
 * The older `autobyteus.prototype.scenario` values `extension_error` and `extension_missing` still choose a failed / not installed Voice Input.
 */

export type ExtensionId = 'voice-input' | 'private-network';
export interface CatalogEntry {
  id: ExtensionId;
  name: string;
  description: string;
  version: string;
  contractVersion: number;
  offeredOn: 'desktop-node' | 'every-node';
  platforms: string[];
  /** Optional (contract §1, DEC-015): the card shows these when the app's language has an entry; otherwise the English text. */
  translations?: Record<string, { name: string; description: string }>;
}
export type ExtensionState =
  | { kind: 'notAvailableHere'; reason?: 'platform' | 'contract' }
  | { kind: 'notInstalled' }
  | { kind: 'installing'; message: string; percent: number | null; isUpdate: boolean; removing?: boolean }
  | { kind: 'installed'; version: string; enabled: boolean; ready: boolean; message: string; updateAvailable: boolean; updateNeedsNewerApp?: boolean; warming?: boolean }
  | { kind: 'failed'; message: string };
export interface NodeExtension { entry: CatalogEntry; state: ExtensionState }

/** The catalog AutoByteus read and verified (signed). Text is the extension's own, with optional translations (contract §1, DEC-015). */
const CATALOG: CatalogEntry[] = [
  {
    id: 'voice-input', name: 'Voice Input', version: '1.0.0', contractVersion: 1, offeredOn: 'desktop-node',
    description: 'Dictate instead of typing. Speech becomes text on this computer. Uses the microphone; downloads about 2 GB on install.',
    platforms: ['darwin-arm64', 'darwin-x64', 'linux-x64', 'win32-x64'],
    translations: { 'zh-CN': { name: '语音输入', description: '用说话代替打字。语音在这台电脑上转成文字。使用麦克风；安装时下载约 2 GB。' } },
  },
  {
    id: 'private-network', name: 'Private Network', version: '0.1.0', contractVersion: 1, offeredOn: 'every-node',
    description: 'Connect your AutoByteus nodes through your Tailscale account. AutoByteus is never opened to the internet. Needs no administrator password; downloads about 30 MB on install.',
    platforms: ['darwin-arm64', 'darwin-x64', 'linux-x64', 'linux-arm64', 'win32-x64'],
    translations: { 'zh-CN': { name: '私有网络', description: '通过你的 Tailscale 账号连接你的 AutoByteus 节点。AutoByteus 永远不会暴露到互联网。无需管理员密码；安装时下载约 30 MB。' } },
  },
];
const UPDATE_VERSION = '1.1.0';
/**
 * Voice Input warms its speech model in the background when it is on (REQ-012, contract part 6 `start`): after AutoByteus
 * starts and after turning it on. About 30 s in the product; shortened here. Dictation works meanwhile (the slow note covers
 * a dictation that waits for it).
 */
const WARM_MS = 6000;
const WARMING_MESSAGE = 'Getting ready: the speech model is loading (about 30 seconds).';
/** The name and description the card shows in the app's language (contract §1). */
export const displayOf = (entry: CatalogEntry, locale: string): { name: string; description: string; lang: string } => {
  const translated = entry.translations?.[locale];
  return translated ? { ...translated, lang: locale } : { name: entry.name, description: entry.description, lang: 'en' };
};
const SUPPORTED_CONTRACT = 1;
/** V13: a catalog entry that needs a newer contract (starting state `voice_newer_contract`). */
const NEWER_CONTRACT = typeof window !== 'undefined' && localStorage.getItem('autobyteus.prototype.extensions') === 'voice_newer_contract';
if (NEWER_CONTRACT) Object.assign(CATALOG[0]!, { version: '2.0.0', contractVersion: 2 });

type NodeKey = string; // 'embedded' or a remote entry ID
interface NodeRecord { platform: string; states: Record<ExtensionId, ExtensionState>; logs: Record<ExtensionId, string[]>; voiceLanguage: 'auto' | 'en' | 'zh' }

const startState = () => (typeof window === 'undefined' ? '' : String(localStorage.getItem('autobyteus.prototype.extensions') || ''));
const legacyScenario = () => (typeof window === 'undefined' ? '' : String(localStorage.getItem('autobyteus.prototype.scenario') || ''));
const later = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));
const clock = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

const voiceReady = (): ExtensionState => ({ kind: 'installed', version: '1.0.0', enabled: true, ready: true, updateAvailable: false, message: 'Ready.' });

function seedEmbedded(): NodeRecord {
  const seed = startState();
  const legacy = legacyScenario();
  let voice: ExtensionState = voiceReady();
  if (seed === 'fresh' || seed === 'voice_newer_contract' || legacy === 'extension_missing') voice = { kind: 'notInstalled' };
  if (seed === 'voice_failed' || legacy === 'extension_error') voice = { kind: 'failed', message: 'The speech model download stopped before it finished: its checksum did not match. Nothing was changed; install again to retry.' };
  if (seed === 'voice_update') voice = { kind: 'installed', version: '1.0.0', enabled: true, ready: true, updateAvailable: true, message: 'Ready.' };
  // The catalog's newer version needs a newer AutoByteus: the installed version keeps working; no Update (contract §1, §6).
  if (seed === 'voice_update_newer_contract') voice = { kind: 'installed', version: '1.0.0', enabled: true, ready: true, updateAvailable: false, updateNeedsNewerApp: true, message: 'Ready.' };
  const platform = seed === 'voice_not_available' ? 'linux-arm64' : 'darwin-arm64';
  let network: ExtensionState = seed.startsWith('network_')
    ? { kind: 'installed', version: '0.1.0', enabled: true, ready: true, updateAvailable: false, message: 'Ready.' }
    : { kind: 'notInstalled' };
  // V12: one extension cannot be read; the other and the node keep working, nothing is deleted.
  if (seed === 'extension_broken') network = { kind: 'failed', message: 'Private Network could not be read: its package/extension.json is missing. Nothing was deleted; install it again to repair it.' };
  // V12: an unreadable state.json: everything is shown Off (logged, never rewritten until a change).
  if (seed === 'state_unreadable') voice = { kind: 'installed', version: '1.0.0', enabled: false, ready: false, updateAvailable: false, message: 'Turned off.' };
  return {
    platform,
    states: { 'voice-input': voice, 'private-network': network },
    voiceLanguage: 'en',
    logs: {
      'voice-input': [
        '2026-11-20 08:14:02  install: package voice-input 1.0.0 verified (sha256 matches the signed catalog)',
        '2026-11-20 08:14:02  install: adopted the existing voice runtime 0.3.0 and speech model (no download)',
        '2026-11-20 08:14:03  status: ready',
        '2026-11-22 09:02:41  transcribe: 4.8 s of audio, language en, 1.9 s',
        '2026-11-22 09:05:10  transcribe: 2.1 s of audio, no speech',
        ...(voice.kind === 'failed' ? [
          '2026-11-22 09:31:15  install: downloading the speech model (512 MB)',
          '2026-11-22 09:33:02  install: error: sha256 mismatch for the model archive; download discarded',
        ] : []),
      ],
      'private-network': network.kind === 'installed' ? [
        '2026-11-21 18:40:11  install: package private-network 0.1.0 verified (sha256 matches the signed catalog)',
        '2026-11-21 18:41:02  start: network program 0.1.0 started in userspace mode',
        '2026-11-21 18:41:09  join: joined the private network as home-mac (100.88.10.10)',
        '2026-11-22 09:00:00  machines: 7 machines, 6 online',
      ] : [],
    },
  };
}
function seedRemote(): NodeRecord {
  // private-network-661 (design seed `autobyteus.prototype.thisComputerNetwork` = `off`): the window's node is on the private network.
  const onNetwork = THIS_COMPUTER_OFF && startState().startsWith('network_');
  return {
    platform: 'linux-x64',
    states: { 'voice-input': { kind: 'notInstalled' }, 'private-network': onNetwork ? { kind: 'installed', version: '0.1.0', enabled: true, ready: true, updateAvailable: false, message: 'Ready.' } : { kind: 'notInstalled' } },
    voiceLanguage: 'auto',
    logs: { 'voice-input': [], 'private-network': [] },
  };
}

interface ExtensionsStoreState {
  initialized: boolean;
  nodes: Record<NodeKey, NodeRecord>;
  /** The microphone this computer records from: an AutoByteus setting of this computer, not the extension's. */
  microphoneDeviceId: string | null;
  openPages: Record<string, boolean>;
  logFor: ExtensionId | null;
  removeFor: ExtensionId | null;
  /** Desktop app only (a browser window cannot hold the owner credential). */
  isElectron: boolean;
  error: string | null;
}

export const useExtensionsStore = defineStore('extensions', {
  state: (): ExtensionsStoreState => ({
    initialized: false,
    nodes: {},
    microphoneDeviceId: null,
    openPages: {},
    logFor: null,
    removeFor: null,
    isElectron: typeof window !== 'undefined' && Boolean(window.electronAPI),
    error: null,
  }),

  getters: {
    windowKey(): NodeKey {
      const windowNode = useWindowNodeContextStore();
      return windowNode.isEmbeddedWindow ? 'embedded' : windowNode.entryId;
    },
    isEmbeddedWindow(): boolean { return useWindowNodeContextStore().isEmbeddedWindow; },
    windowRecord(): NodeRecord {
      const key = this.windowKey;
      return this.nodes[key] ?? (key === 'embedded' ? seedEmbedded() : seedRemote());
    },
    /** The extensions offered on this window's node (REQ-011): Voice Input only on the desktop's own node. */
    list(): NodeExtension[] {
      const record = this.windowRecord;
      return CATALOG
        .filter((entry) => entry.offeredOn === 'every-node' || this.windowKey === 'embedded')
        .map((entry) => {
          // An extension this AutoByteus cannot run (its contract version is newer) or with no build for this platform (contract §6).
          const stored: ExtensionState = entry.contractVersion > SUPPORTED_CONTRACT ? { kind: 'notAvailableHere', reason: 'contract' }
            : entry.platforms.includes(record.platform) ? record.states[entry.id] : { kind: 'notAvailableHere', reason: 'platform' };
          // Private Network's card says what its status() says now (joined, waiting for approval, expired, signed out, unreachable, access rules).
          if (entry.id === 'private-network' && stored.kind === 'installed' && stored.enabled && !/^Starting/.test(stored.message)) {
            return { entry, state: { ...stored, ...usePrivateNetworkStore().status } };
          }
          return { entry, state: stored };
        });
    },
    platform(): string { return this.windowRecord.platform; },
    /**
     * Voice Input for the voice surfaces (composer, Task, Project, Memory search, Test): always this computer's own node,
     * in every window (REQ-008). Shape kept for the voice store: available when installed, on and ready.
     */
    voiceInput(): { id: 'voice-input'; status: string; enabled: boolean; settings: { audioInputDeviceId: string | null; languageMode: string } } | null {
      const record = this.nodes.embedded ?? seedEmbedded();
      const state = record.platform === 'linux-arm64' ? { kind: 'notAvailableHere' } as ExtensionState : record.states['voice-input'];
      return {
        id: 'voice-input',
        status: state.kind === 'installed' ? 'installed' : state.kind === 'installing' ? 'installing' : state.kind === 'failed' ? 'error' : 'not-installed',
        enabled: state.kind === 'installed' && state.enabled && state.ready,
        settings: { audioInputDeviceId: this.microphoneDeviceId, languageMode: record.voiceLanguage },
      };
    },
    updateVersion(): string { return UPDATE_VERSION; },
    /**
     * The signed catalog could not be verified (contract §3; V13): nothing can be installed or updated until it can; installed
     * extensions keep working. Starting state `localStorage['autobyteus.prototype.catalog'] = 'unverified'`.
     */
    catalogUnverified(): boolean { return typeof window !== 'undefined' && localStorage.getItem('autobyteus.prototype.catalog') === 'unverified'; },
    /** The catalog could not be reached (offline): installed extensions keep working; Install / Update wait. `catalog = 'offline'`. */
    catalogOffline(): boolean { return typeof window !== 'undefined' && localStorage.getItem('autobyteus.prototype.catalog') === 'offline'; },
  },

  actions: {
    recordOf(key: NodeKey): NodeRecord {
      if (!this.nodes[key]) this.nodes[key] = key === 'embedded' ? seedEmbedded() : seedRemote();
      return this.nodes[key]!;
    },
    async initialize(): Promise<void> {
      if (this.initialized) return;
      this.initialized = true;
      this.isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI);
      this.recordOf('embedded');
      this.recordOf(this.windowKey);
      // AutoByteus started: Voice Input, when on, warms its speech model in the background (REQ-012).
      const voice = this.recordOf('embedded').states['voice-input'];
      if (voice.kind === 'installed' && voice.enabled && voice.ready) void this.warmVoice();
    },
    /** Voice Input's background warm-up: "Getting ready…" on its card, then Ready. Dictation is not blocked meanwhile. */
    async warmVoice(prefix = ''): Promise<void> {
      const state = this.recordOf('embedded').states['voice-input'];
      if (state.kind !== 'installed' || !state.enabled) return;
      this.log('voice-input', 'start: warming the speech model', 'embedded');
      this.set('voice-input', { ...state, ready: true, warming: true, message: `${prefix}${WARMING_MESSAGE}` }, 'embedded');
      await later(WARM_MS);
      const now = this.recordOf('embedded').states['voice-input'];
      if (now.kind !== 'installed' || !now.enabled || !now.warming) return;
      this.log('voice-input', 'start: speech model ready', 'embedded');
      this.set('voice-input', { ...now, warming: false, message: 'Ready.' }, 'embedded');
    },
    set(id: ExtensionId, state: ExtensionState, key: NodeKey = this.windowKey): void { this.recordOf(key).states[id] = state; },
    log(id: ExtensionId, line: string, key: NodeKey = this.windowKey): void { this.recordOf(key).logs[id].push(`${clock()}  ${line}`); },
    logOf(id: ExtensionId): string[] { return this.recordOf(this.windowKey).logs[id]; },
    togglePage(id: ExtensionId): void { const k = `${this.windowKey}:${id}`; this.openPages[k] = !this.openPages[k]; },
    isPageOpen(id: ExtensionId): boolean { return Boolean(this.openPages[`${this.windowKey}:${id}`]); },

    /** Install and Update: the extension's server part reports progress (a message and a percent, or none). */
    async install(id: ExtensionId, isUpdate = false): Promise<void> {
      const key = this.windowKey;
      const before = this.recordOf(key).states[id];
      const entry = CATALOG.find((e) => e.id === id)!;
      const version = isUpdate ? UPDATE_VERSION : entry.version;
      const steps: Array<[string, number | null, number]> = id === 'voice-input'
        ? [
          // The package is small (a few KB); the ~2 GB arrives in the runtime's own prepare step, which reports no byte total
          // (measured: runtime archive 3,365 bytes; use-case probe: only "Preparing the speech model" for ~75 s).
          [`Downloading ${entry.name} ${version}`, null, 900],
          isUpdate
            ? ['Keeping your voice runtime, speech model and language', null, 1500] as [string, number | null, number]
            : ['Preparing the speech model (downloads about 2 GB once; this can take a few minutes)', null, 7000] as [string, number | null, number],
        ]
        : [
          [`Downloading ${entry.name} ${version}`, null, 800],
          ...[0, 35, 70, 100].map((p) => [`Downloading the network program · ${Math.round(31 * p / 100)} of 31 MB`, p, 450] as [string, number, number]),
          ['Checking the network program', null, 1000],
        ];
      this.log(id, `${isUpdate ? 'update' : 'install'}: package ${id} ${version} verified (sha256 matches the signed catalog)`, key);
      for (const [message, percent, ms] of steps) {
        this.set(id, { kind: 'installing', message, percent, isUpdate }, key);
        await later(ms);
      }
      const enabledBefore = before.kind === 'installed' && before.enabled;
      this.log(id, `${isUpdate ? 'update' : 'install'}: done (${version})`, key);
      if (isUpdate) {
        this.set(id, { kind: 'installed', version, enabled: enabledBefore, ready: enabledBefore, updateAvailable: false, message: enabledBefore ? 'Ready.' : 'Turned off.' }, key);
        return;
      }
      // An install ends On (DEC-015, AC-002): Voice Input is on at once and warms its model; Private Network starts its
      // network program and continues straight into choosing a network.
      this.set(id, { kind: 'installed', version, enabled: false, ready: false, updateAvailable: false, message: 'Installed and on.' }, key);
      await this.turnOn(id, 'Installed and on. ');
    },
    async turnOn(id: ExtensionId, prefix = ''): Promise<void> {
      const key = this.windowKey;
      const state = this.recordOf(key).states[id];
      if (state.kind !== 'installed') return;
      const network = usePrivateNetworkStore();
      this.log(id, 'start: turned on', key);
      // Voice Input's status() is ready as soon as its runtime and model are present; its program starts on the first
      // transcription (the slow note covers that). Private Network's start step runs its network program first.
      if (id === 'voice-input') { this.set(id, { ...state, enabled: true, ready: true, message: 'Ready.' }, key); void this.warmVoice(prefix); return; }
      this.set(id, { ...state, enabled: true, ready: false, message: 'Starting the network program…' }, key);
      await later(1500);
      const now = this.recordOf(key).states[id];
      if (now.kind !== 'installed' || !now.enabled) return;
      if (id === 'voice-input') {
        this.set(id, { ...now, ready: true, message: 'Ready.' }, key);
      } else {
        this.set(id, { ...now, ...network.status }, key);
        if (!network.status.ready) this.openPages[`${key}:${id}`] = true;
      }
    },
    async turnOff(id: ExtensionId): Promise<void> {
      const key = this.windowKey;
      const state = this.recordOf(key).states[id];
      if (state.kind !== 'installed') return;
      this.log(id, 'stop: turned off', key);
      this.set(id, { ...state, enabled: false, ready: false, warming: false, message: 'Turned off.' }, key);
    },
    async remove(id: ExtensionId): Promise<void> {
      const key = this.windowKey;
      this.removeFor = null;
      this.set(id, { kind: 'installing', message: 'Removing', percent: null, isUpdate: false, removing: true }, key);
      await later(1000);
      this.set(id, { kind: 'notInstalled' }, key);
      this.recordOf(key).logs[id] = [];
      this.openPages[`${key}:${id}`] = false;
      if (id === 'voice-input') this.recordOf(key).voiceLanguage = 'auto';
      if (id === 'private-network') usePrivateNetworkStore().reset();
    },
    /**
     * The page bridge (extension-contract.md §5): a call from an extension's own page, answered by its own server part's
     * action. The page's height message `{ resize: { height } }` (contract §5) is handled by the frame itself.
     */
    async callAction(id: ExtensionId, call: string, input: any): Promise<unknown> {
      const key = this.windowKey;
      const record = this.recordOf(key);
      const state = record.states[id];
      if (id === 'voice-input') {
        if (call === 'getSettings') {
          // Voice Input's real action (Solution Designer, 2026-11-24): { language, runtimeVersion, model, folder }.
          return { language: record.voiceLanguage, runtimeVersion: '0.3.0', model: 'whisper-small (English and Chinese)', folder: '~/.autobyteus/extensions/voice-input/data' };
        }
        if (call === 'setLanguage') {
          await later(300);
          if (!['auto', 'en', 'zh'].includes(input?.language)) throw new Error('Unknown language.');
          record.voiceLanguage = input.language;
          this.log(id, `settings: language ${input.language}`, key);
          return { language: record.voiceLanguage };
        }
      }
      if (id === 'private-network') {
        const network = usePrivateNetworkStore();
        // private-network-661 (design, D-1): Tailscale only; its own conditions (REQ-015) and access rules (REQ-017).
        const view = () => ({
          joined: network.joined, signingIn: network.signingIn,
          awaitingApproval: network.awaitingApproval, expired: network.expired, signedOut: network.signedOut, unreachable: network.unreachable,
          account: network.ownerAccount,
          thisMachine: { ...network.thisMachine },
          machines: network.machines.map((m) => ({ ...m, accountLabel: network.accountLabel(m.account) })),
        });
        const logged = (line: string) => this.log(id, line, key);
        const fail = (result: { ok: boolean; error?: string }) => { if (!result.ok) throw new Error(result.error); };
        const sync = () => { const now = this.recordOf(key).states[id]; if (now.kind === 'installed' && now.enabled) this.set(id, { ...now, ...network.status }, key); };
        switch (call) {
          case 'getState': network.touch(); sync(); return view();
          case 'signIn': await network.signIn(); if (network.joined) logged(`join: signed in to Tailscale as ${network.thisMachine.name}`); sync(); return view();
          case 'cancelSignIn': network.cancelSignIn(); sync(); return view();
          case 'joinWithKey': {
            fail(await network.joinWithKey(String(input?.key ?? '')));
            logged(`join: joined the private network as ${network.thisMachine.name} (auth key; the key itself is never logged)`);
            sync();
            return view();
          }
          case 'leave': await network.leave(); logged('leave: this machine left the private network'); sync(); return view();
        }
      }
      throw new Error(`${call} is not an action of ${id}.`);
    },

    // ---- this computer's microphone (an AutoByteus setting, not the extension's)
    setMicrophone(deviceId: string | null): void { this.microphoneDeviceId = deviceId; },
    async updateVoiceInputAudioInputDevice(deviceId: string | null): Promise<void> { this.microphoneDeviceId = deviceId; },
    async refresh(): Promise<void> { /* the state is local */ },
  },
});
