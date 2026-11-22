import { defineStore } from 'pinia';
import { usePrivateNetworkStore } from '~/stores/privateNetworkStore';
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
 *   `voice_not_available` (this computer is linux-arm64) · `network_joined` / `network_trust` (Private Network on and joined).
 * The older `autobyteus.prototype.scenario` values `extension_error` and `extension_missing` still choose a failed / not installed Voice Input.
 */

export type ExtensionId = 'voice-input' | 'private-network';
export interface CatalogEntry {
  id: ExtensionId;
  name: string;
  description: string;
  version: string;
  contractVersion: 1;
  offeredOn: 'desktop-node' | 'every-node';
  platforms: string[];
}
export type ExtensionState =
  | { kind: 'notAvailableHere' }
  | { kind: 'notInstalled' }
  | { kind: 'installing'; message: string; percent: number | null; isUpdate: boolean; removing?: boolean }
  | { kind: 'installed'; version: string; enabled: boolean; ready: boolean; message: string; updateAvailable: boolean }
  | { kind: 'failed'; message: string };
export interface NodeExtension { entry: CatalogEntry; state: ExtensionState }

/** The catalog AutoByteus read and verified (signed). Text is the extension's own (English only: the contract has no translations). */
const CATALOG: CatalogEntry[] = [
  {
    id: 'voice-input', name: 'Voice Input', version: '1.0.0', contractVersion: 1, offeredOn: 'desktop-node',
    description: 'Dictate instead of typing. Speech becomes text on this computer. Uses the microphone; downloads about 500 MB on install.',
    platforms: ['darwin-arm64', 'darwin-x64', 'linux-x64', 'win32-x64'],
  },
  {
    id: 'private-network', name: 'Private Network', version: '0.1.0', contractVersion: 1, offeredOn: 'every-node',
    description: 'Connect your AutoByteus nodes through your own private network: a Tailscale account or your own Headscale server. Nothing is opened to the internet. Needs no administrator approval; downloads about 30 MB on install.',
    platforms: ['darwin-arm64', 'darwin-x64', 'linux-x64', 'linux-arm64', 'win32-x64'],
  },
];
const UPDATE_VERSION = '1.1.0';

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
  if (seed === 'fresh' || legacy === 'extension_missing') voice = { kind: 'notInstalled' };
  if (seed === 'voice_failed' || legacy === 'extension_error') voice = { kind: 'failed', message: 'The speech model download stopped before it finished: its checksum did not match. Nothing was changed; install again to retry.' };
  if (seed === 'voice_update') voice = { kind: 'installed', version: '1.0.0', enabled: true, ready: true, updateAvailable: true, message: 'Ready.' };
  const platform = seed === 'voice_not_available' ? 'linux-arm64' : 'darwin-arm64';
  const network: ExtensionState = seed === 'network_joined' || seed === 'network_trust'
    ? { kind: 'installed', version: '0.1.0', enabled: true, ready: true, updateAvailable: false, message: 'Connected to your private network as home-mac.' }
    : { kind: 'notInstalled' };
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
  return {
    platform: 'linux-x64',
    states: { 'voice-input': { kind: 'notInstalled' }, 'private-network': { kind: 'notInstalled' } },
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
        .map((entry) => ({ entry, state: entry.platforms.includes(record.platform) ? record.states[entry.id] : { kind: 'notAvailableHere' } as ExtensionState }));
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
          [`Downloading ${entry.name} ${version}`, null, 800],
          ...(isUpdate ? [] : [0, 12, 27, 41, 55, 68, 80, 91, 100].map((p) => [`Downloading the voice runtime and speech model · ${Math.round(520 * p / 100)} of 520 MB`, p, 480] as [string, number, number])),
          [isUpdate ? 'Keeping your voice runtime, speech model and language' : 'Unpacking the voice runtime', null, 1200],
          ['Checking that the voice runtime starts', null, 1200],
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
      this.set(id, {
        kind: 'installed', version, enabled: isUpdate ? enabledBefore : false, ready: isUpdate ? enabledBefore : false, updateAvailable: false,
        message: isUpdate ? (enabledBefore ? 'Ready.' : 'Turned off.') : 'Installed. Turn it on to use it.',
      }, key);
    },
    async turnOn(id: ExtensionId): Promise<void> {
      const key = this.windowKey;
      const state = this.recordOf(key).states[id];
      if (state.kind !== 'installed') return;
      const network = usePrivateNetworkStore();
      this.set(id, { ...state, enabled: true, ready: false, message: id === 'voice-input' ? 'Starting the voice runtime…' : 'Starting the network program…' }, key);
      this.log(id, 'start: turned on', key);
      await later(1500);
      const now = this.recordOf(key).states[id];
      if (now.kind !== 'installed' || !now.enabled) return;
      if (id === 'voice-input') {
        this.set(id, { ...now, ready: true, message: 'Ready.' }, key);
      } else {
        this.set(id, network.joined
          ? { ...now, ready: true, message: `Connected to your private network as ${network.thisMachine.name}.` }
          : { ...now, ready: false, message: 'Not connected to a private network yet. Choose one below.' }, key);
        if (!network.joined) this.openPages[`${key}:${id}`] = true;
      }
    },
    async turnOff(id: ExtensionId): Promise<void> {
      const key = this.windowKey;
      const state = this.recordOf(key).states[id];
      if (state.kind !== 'installed') return;
      this.log(id, 'stop: turned off', key);
      this.set(id, { ...state, enabled: false, ready: false, message: 'Turned off.' }, key);
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
    /** The node joined: the Private Network extension's status turns ready. */
    networkJoined(): void {
      const name = usePrivateNetworkStore().thisMachine.name;
      for (const key of Object.keys(this.nodes)) {
        const state = this.nodes[key]!.states['private-network'];
        if (state.kind === 'installed' && state.enabled) {
          this.nodes[key]!.states['private-network'] = { ...state, ready: true, message: `Connected to your private network as ${name}.` };
          this.nodes[key]!.logs['private-network'].push(`${clock()}  join: joined the private network as ${name}`);
        }
      }
    },

    /**
     * The page bridge (extension-contract.md §5): a call from an extension's own page, answered by its own server part's
     * action. `resize` is handled by the frame itself (a design addition; see the UI/UX spec's findings).
     */
    async callAction(id: ExtensionId, call: string, input: any): Promise<unknown> {
      const key = this.windowKey;
      const record = this.recordOf(key);
      const state = record.states[id];
      if (id === 'voice-input') {
        if (call === 'getSettings') {
          return {
            language: record.voiceLanguage,
            installed: state.kind === 'installed'
              ? { extension: state.version, runtime: '0.3.0', model: 'whisper-small, English and Chinese', engine: 'faster-whisper', size: '520 MB', folder: '~/.autobyteus/extensions/voice-input/data' }
              : null,
          };
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
        const view = () => ({
          joined: network.joined, signingIn: network.signingIn, network: network.network, serverUrl: network.serverUrl,
          account: network.ownerAccount,
          thisMachine: { ...network.thisMachine },
          machines: network.machines.map((m) => ({ ...m, accountLabel: network.accountLabel(m.account) })),
        });
        if (call === 'getState') return view();
        if (call === 'signIn') { await network.signIn(); if (network.joined) this.networkJoined(); return view(); }
        if (call === 'cancelSignIn') { network.cancelSignIn(); return view(); }
        if (call === 'joinWithKey') {
          const result = await network.joinWithKey(input?.network === 'headscale' ? 'headscale' : 'tailscale', String(input?.key ?? ''), String(input?.serverUrl ?? ''));
          if (!result.ok) throw new Error(result.error);
          this.networkJoined();
          return view();
        }
        if (call === 'useConnectionCode') {
          const result = await network.useConnectionCode(String(input?.code ?? ''));
          if (!result.ok) throw new Error(result.error);
          this.networkJoined();
          return view();
        }
        if (call === 'addMachine') {
          const code = await network.makeConnectionCode();
          this.log(id, 'invite: a connection code was made (one use, 10 minutes; the code itself is never logged)', key);
          return { text: code.text, qr: code.qr, expiresAt: code.expiresAt };
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
