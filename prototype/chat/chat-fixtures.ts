// Synthetic, illustrative fixtures for the chat-interface-entry Product ticket.
// Runtime identities mirror the product's runtime kinds; model names, providers,
// descriptions, workspaces, and chat titles are illustrative fixture content.

export type ChatRuntimeId =
  | 'autobyteus'
  | 'codex_app_server'
  | 'claude_agent_sdk'
  | 'antigravity_cli'
  | 'grok_build'

export interface ChatRuntime {
  id: ChatRuntimeId
  label: string
  shortLabel: string
  monogram: string
  tint: string
  enabled: boolean
  unavailableReason?: string
  catalogLatencyMs: number
}

export interface ChatModel {
  id: string
  name: string
  provider: string
  runtime: ChatRuntimeId
  description?: string
  thinkingLevels?: string[]
  defaultThinking?: string
}

export interface ChatAgent {
  id: string
  name: string
  initials: string
  description: string
  skills: string[]
  tools: string[]
  defaultLaunch?: { runtime: ChatRuntimeId; modelId: string; thinking?: string }
}

export interface ChatWorkspace {
  id: string
  name: string
  path: string
  isTemp?: boolean
}

export interface ChatCombo {
  runtime: ChatRuntimeId
  modelId: string
  thinking?: string
}

export const CHAT_RUNTIMES: ChatRuntime[] = [
  { id: 'autobyteus', label: 'AutoByteus', shortLabel: 'AutoByteus', monogram: 'AB', tint: 'bg-blue-50 text-blue-700 border-blue-200', enabled: true, catalogLatencyMs: 0 },
  { id: 'codex_app_server', label: 'Codex App Server', shortLabel: 'Codex', monogram: 'CX', tint: 'bg-gray-100 text-gray-800 border-gray-300', enabled: true, catalogLatencyMs: 450 },
  { id: 'claude_agent_sdk', label: 'Claude Agent SDK', shortLabel: 'Claude SDK', monogram: 'CL', tint: 'bg-orange-50 text-orange-700 border-orange-200', enabled: true, catalogLatencyMs: 450 },
  { id: 'antigravity_cli', label: 'Antigravity CLI', shortLabel: 'Antigravity', monogram: 'AG', tint: 'bg-emerald-50 text-emerald-700 border-emerald-200', enabled: true, catalogLatencyMs: 900 },
  {
    id: 'grok_build',
    label: 'Grok Build',
    shortLabel: 'Grok Build',
    monogram: 'GB',
    tint: 'bg-gray-50 text-gray-700 border-gray-300',
    // Available by default like the real product. The `chat_runtime_unavailable`
    // scenario turns it off to show the unavailable-runtime state.
    enabled: true,
    unavailableReason: 'Grok Build CLI was not found on this machine.',
    catalogLatencyMs: 600,
  },
]

const EFFORT = ['Low', 'Medium', 'High']
const EFFORT_X = ['Low', 'Medium', 'High', 'Extra high']

export const CHAT_MODELS: ChatModel[] = [
  // AutoByteus — API-backed and local models, many providers.
  { id: 'gpt-5.5', name: 'gpt-5.5', provider: 'OpenAI', runtime: 'autobyteus', description: 'General purpose, strong reasoning', thinkingLevels: EFFORT, defaultThinking: 'Medium' },
  { id: 'gpt-5.5-mini', name: 'gpt-5.5-mini', provider: 'OpenAI', runtime: 'autobyteus', description: 'Fast and inexpensive' },
  { id: 'claude-opus-5-5', name: 'claude-opus-5-5', provider: 'Anthropic', runtime: 'autobyteus', description: 'Most capable Claude model', thinkingLevels: EFFORT, defaultThinking: 'Medium' },
  { id: 'claude-sonnet-5', name: 'claude-sonnet-5', provider: 'Anthropic', runtime: 'autobyteus', description: 'Balanced speed and quality' },
  { id: 'gemini-3-pro', name: 'gemini-3-pro', provider: 'Google', runtime: 'autobyteus', description: 'Long context, multimodal' },
  { id: 'deepseek-v4', name: 'deepseek-v4', provider: 'DeepSeek', runtime: 'autobyteus', description: 'Open-weight reasoning model' },
  { id: 'qwen3-coder-30b', name: 'qwen3-coder-30b', provider: 'LM Studio (local)', runtime: 'autobyteus', description: 'Runs on this machine' },
  { id: 'qwen3.6-27b-mlx', name: 'qwen3.6-27b-mlx', provider: 'LM Studio (local)', runtime: 'autobyteus', description: 'Runs on this machine' },
  // Codex App Server
  { id: 'gpt-5.5-codex', name: 'gpt-5.5-codex', provider: 'OpenAI', runtime: 'codex_app_server', description: 'Optimized for agentic coding', thinkingLevels: EFFORT_X, defaultThinking: 'High' },
  { id: 'codex:gpt-5.5', name: 'gpt-5.5', provider: 'OpenAI', runtime: 'codex_app_server', description: 'General purpose, strong reasoning', thinkingLevels: EFFORT_X, defaultThinking: 'Medium' },
  { id: 'codex:gpt-5.5-mini', name: 'gpt-5.5-mini', provider: 'OpenAI', runtime: 'codex_app_server', description: 'Fast and inexpensive', thinkingLevels: EFFORT, defaultThinking: 'Low' },
  // Claude Agent SDK
  { id: 'sdk:claude-opus-5-5', name: 'claude-opus-5-5', provider: 'Anthropic', runtime: 'claude_agent_sdk', description: 'Opus 5.5 — most capable', thinkingLevels: EFFORT, defaultThinking: 'High' },
  { id: 'sdk:claude-sonnet-5', name: 'claude-sonnet-5', provider: 'Anthropic', runtime: 'claude_agent_sdk', description: 'Sonnet 5 — balanced', thinkingLevels: EFFORT, defaultThinking: 'Medium' },
  { id: 'sdk:claude-haiku-5', name: 'claude-haiku-5', provider: 'Anthropic', runtime: 'claude_agent_sdk', description: 'Haiku 5 — fastest' },
  // Antigravity CLI
  { id: 'ag:gemini-3-pro', name: 'gemini-3-pro', provider: 'Google', runtime: 'antigravity_cli', description: 'Long context, multimodal', thinkingLevels: EFFORT, defaultThinking: 'Medium' },
  { id: 'ag:gemini-3-flash', name: 'gemini-3-flash', provider: 'Google', runtime: 'antigravity_cli', description: 'Fast, low latency' },
  // Grok Build (catalog is reported by the Grok CLI; names are illustrative)
  { id: 'grok:grok-4.2', name: 'grok-4.2', provider: 'xAI', runtime: 'grok_build', description: 'Most capable Grok model', thinkingLevels: EFFORT, defaultThinking: 'Medium' },
  { id: 'grok:grok-code-fast-2', name: 'grok-code-fast-2', provider: 'xAI', runtime: 'grok_build', description: 'Fast agentic coding' },
]

export interface ChatSkill {
  name: string
  description: string
}

// Names mirror the user's skills package; descriptions are shortened and illustrative.
export const CHAT_SKILLS: ChatSkill[] = [
  { name: 'shell-first-operating-practice', description: 'Shell-first execution practice for agents' },
  { name: 'software-engineering-workflow-skill', description: 'Staged software delivery from requirements to handoff' },
  { name: 'deep-research-article', description: 'Deep research synthesized into one structured article' },
  { name: 'bilingual-author-style-writer', description: 'Publish-ready Chinese and English articles' },
  { name: 'infographic-powerpoint-deck', description: 'Image-based PowerPoint decks from notes' },
  { name: 'infographics', description: 'Single-image infographics from content' },
  { name: 'emotion-metaphor-image-prompting', description: 'Image prompts that turn feelings into metaphors' },
  { name: 'product-ui-prototyping', description: 'Validate UI behavior as visual state prototypes' },
  { name: 'ux-journey-definition', description: 'Story-first product experience before UI work' },
  { name: 'skill-optimizer', description: 'Review and improve existing skills' },
  { name: 'llm-fine-tuning-skill', description: 'Staged LLM fine-tuning workflow' },
]

/** The built-in general agent that backs Chat: general tools, every skill enabled (lazy-loaded). */
export const CHAT_ASSISTANT_ID = 'autobyteus-assistant'

export const CHAT_AGENTS: ChatAgent[] = [
  {
    id: CHAT_ASSISTANT_ID,
    name: 'AutoByteus Assistant',
    initials: 'AA',
    description: 'Built-in general agent for chat. All skills enabled.',
    skills: CHAT_SKILLS.map((skill) => skill.name),
    tools: ['bash', 'read_file', 'write_file', 'web_search', 'browser', 'media'],
  },
  {
    id: 'daily-assistant',
    name: 'Daily Assistant',
    initials: 'DA',
    description: 'General assistant with shell, web, browser and media tools.',
    skills: ['shell-first-operating-practice'],
    tools: ['bash', 'web_search', 'browser', 'media'],
  },
  {
    id: 'codex',
    name: 'Codex',
    initials: 'CO',
    description: 'Minimal wrapper agent — "You are Codex".',
    skills: ['software-engineering-workflow-skill'],
    tools: ['browser', 'media'],
  },
  {
    id: 'agent-researcher',
    name: 'Research Assistant',
    initials: 'RA',
    description: 'Synthetic local agent used only by the parity prototype.',
    skills: ['prototype-research'],
    tools: ['web_search', 'read_file'],
    defaultLaunch: { runtime: 'claude_agent_sdk', modelId: 'sdk:claude-sonnet-5', thinking: 'Medium' },
  },
  {
    id: 'agent-writer',
    name: 'Documentation Writer',
    initials: 'DW',
    description: 'A second deterministic synthetic agent.',
    skills: ['prototype-writing'],
    tools: ['read_file', 'write_file'],
  },
]

export const TEMP_WORKSPACE_ID = 'temp_ws_default'

export const CHAT_WORKSPACES: ChatWorkspace[] = [
  { id: TEMP_WORKSPACE_ID, name: 'Temp workspace', path: '~/.autobyteus/temp_workspace', isTemp: true },
  { id: 'ws-agents', name: 'autobyteus-agents', path: '~/autobyteus_org/autobyteus-agents' },
  { id: 'ws-superrepo', name: 'autobyteus-workspace-superrepo', path: '~/autobyteus_org/autobyteus-workspace-superrepo' },
  { id: 'ws-prototype', name: 'prototype-workspace', path: '/synthetic/prototype-workspace' },
]

export const INITIAL_RECENTS: ChatCombo[] = [
  { runtime: 'codex_app_server', modelId: 'gpt-5.5-codex', thinking: 'High' },
  { runtime: 'claude_agent_sdk', modelId: 'sdk:claude-opus-5-5', thinking: 'High' },
  { runtime: 'autobyteus', modelId: 'qwen3-coder-30b' },
]

export const INITIAL_FAVORITES: string[] = ['codex_app_server|gpt-5.5-codex', 'autobyteus|qwen3-coder-30b']

export type ChatMessage =
  | { id: string; role: 'user'; text: string; skills?: string[] }
  | { id: string; role: 'assistant'; text: string; streaming?: boolean }
  | { id: string; role: 'event'; text: string }

export interface ChatRecord {
  id: string
  title: string
  agentId: string
  runtime: ChatRuntimeId
  modelId: string
  thinking?: string
  workspaceId: string
  group: 'Today' | 'Yesterday' | 'Previous 7 days'
  age: string
  /** Minutes before prototype load; drives the tree's relative time. */
  ageMinutes: number
  status: 'idle' | 'running'
  messages: ChatMessage[]
}

export const INITIAL_CHATS: ChatRecord[] = [
  {
    id: 'chat-skill-review',
    title: 'Improve the shell-first skill',
    agentId: CHAT_ASSISTANT_ID,
    runtime: 'codex_app_server',
    modelId: 'gpt-5.5-codex',
    thinking: 'High',
    workspaceId: 'ws-agents',
    group: 'Today',
    age: '2h',
    ageMinutes: 120,
    status: 'idle',
    messages: [
      { id: 'm1', role: 'user', text: 'Review this skill and suggest what to tighten.', skills: ['skill-optimizer', 'shell-first-operating-practice'] },
      {
        id: 'm2',
        role: 'assistant',
        text: 'I read skills/shell-first-operating-practice/SKILL.md. Three suggestions:\n\n1. Move the "verify before claiming" rule to the top — it is the most violated.\n2. Split the long command examples into a references/ file so the skill stays short.\n3. Add one explicit stop condition for destructive commands.\n\nWant me to draft the edits?',
      },
    ],
  },
  {
    id: 'chat-trip',
    title: 'Plan a weekend in Munich',
    agentId: CHAT_ASSISTANT_ID,
    runtime: 'claude_agent_sdk',
    modelId: 'sdk:claude-opus-5-5',
    thinking: 'High',
    workspaceId: TEMP_WORKSPACE_ID,
    group: 'Today',
    age: '5h',
    ageMinutes: 300,
    status: 'idle',
    messages: [
      { id: 'm1', role: 'user', text: 'Plan a relaxed weekend in Munich for two.' },
      { id: 'm2', role: 'assistant', text: 'Here is a relaxed two-day plan: Saturday — Viktualienmarkt, English Garden, dinner in Haidhausen. Sunday — Nymphenburg Palace and a late brunch.' },
    ],
  },
  {
    id: 'chat-codex-refactor',
    title: 'Refactor run config store',
    agentId: 'codex',
    runtime: 'codex_app_server',
    modelId: 'gpt-5.5-codex',
    thinking: 'High',
    workspaceId: 'ws-superrepo',
    group: 'Yesterday',
    age: '1d',
    ageMinutes: 1500,
    status: 'idle',
    messages: [
      { id: 'm1', role: 'user', text: 'Where is the run config locked after the first message?' },
      { id: 'm2', role: 'assistant', text: 'In autobyteus-web/types/agent/AgentRunConfig.ts the isLocked flag is set when the first message is sent.' },
    ],
  },
  {
    id: 'chat-local-model',
    title: 'Try the local Qwen model',
    agentId: CHAT_ASSISTANT_ID,
    runtime: 'autobyteus',
    modelId: 'qwen3-coder-30b',
    workspaceId: TEMP_WORKSPACE_ID,
    group: 'Previous 7 days',
    age: '4d',
    ageMinutes: 5760,
    status: 'idle',
    messages: [
      { id: 'm1', role: 'user', text: 'Say hello from the local model.' },
      { id: 'm2', role: 'assistant', text: 'Hello from qwen3-coder-30b running in LM Studio on this machine.' },
    ],
  },
]
