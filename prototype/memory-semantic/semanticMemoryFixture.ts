/**
 * semantic-memory-view-554 (design): the node's semantic memory folders beneath the Memory page.
 *
 * Everything here is invented and illustrative: agents, folders, files, sizes, times and every document's text are
 * made up for the design. Nothing is read from a real node or a real agent's folder. The agents and teams match the
 * Memory page's synthetic world (prototype/memory-search/memoryDesignFixture.ts), so an agent's runs page and its
 * semantic memory name the same agent.
 *
 * It answers the two designed reads (`GetSemanticMemoryFolders`, `GetSemanticMemoryFiles`) in the design's shapes
 * (types/semanticMemory.ts) and stands in for the node-file loader (`loadNodeFile`) for a listed file's content.
 *
 * Scenarios (localStorage `autobyteus.prototype.scenario`): `empty` (no folder yet), `semantic_memory_unavailable`
 * (the folder list fails; Retry reads it again and then succeeds), `semantic_memory_truncated` (Project Task Manager's
 * folder holds more than the node lists), `semantic_file_fails` (a listed file was removed before it was opened).
 */
import type { SemanticMemoryFile, SemanticMemoryFileList, SemanticMemoryFolder } from '~/types/semanticMemory'

const MEMORY_DIR = '/Users/dev/.autobyteus/server-data/memory'
export const semanticFolderPathOf = (agentDefinitionId: string) => `${MEMORY_DIR}/semantic/${encodeURIComponent(agentDefinitionId)}`

type FileSpec = { path: string; at: string; text?: string; image?: boolean; link?: string }
type FolderSpec = { id: string; name: string; internal?: boolean; files: FileSpec[] }

const doc = (lines: string[]) => lines.join('\n')

/* -------------------------------------------------------------------- documents (invented) */

const PTM_INDEX = doc([
  '# Reflections',
  '',
  'What I have learned about running Projects for this user. Newest first; each links to its record.',
  '',
  '- **2026-10-26** — A Task whose description names a file path is finished faster when the path is in the first line. [record](../records/2026-10-26.md)',
  '- **2026-10-24** — Ask which Project a request belongs to before creating Tasks; two Projects share the word "panel". [record](../records/2026-10-24.md)',
  '- **2026-10-21** — Dispatch one Task at a time while the user reviews; parallel dispatch made the review queue hard to follow. [record](../records/2026-10-21.md)',
  '- **2026-10-15** — The user prefers short Task titles (under 60 characters) with the detail in the description.',
  '',
  '## Open questions',
  '',
  '- Should a blocked Task move its dependents to *Waiting* automatically? Proposed in `proposals.md`.',
])

const PTM_LESSONS = doc([
  '# Lessons',
  '',
  '## Planning',
  '',
  '1. Split a request into Tasks that one agent can finish in one run.',
  '2. Put the acceptance check in the Task description, not in a comment.',
  '3. Order Tasks by dependency first, then by the user\'s priority.',
  '',
  '## Dispatching',
  '',
  '- Confirm the agent or team before each dispatch; the user approves every one.',
  '- When a Task comes back *Blocked*, read its last comment before asking the user.',
  '',
  '## Things that went wrong',
  '',
  '| Day | What happened | What I do now |',
  '| --- | --- | --- |',
  '| 2026-10-12 | Created Tasks in the wrong Project | Ask for the Project first |',
  '| 2026-10-18 | Two Tasks edited the same file | Name the files a Task may touch |',
])

const PTM_PROPOSALS = doc([
  '# Proposals',
  '',
  'Changes I would like to make to how I work. Each waits for the user.',
  '',
  '## P-3 · Move dependents to Waiting',
  '',
  'When a Task is *Blocked*, its dependent Tasks cannot start either. Today I leave them *Open*.',
  '',
  '- **Proposal:** set them to *Waiting* and say which Task they wait for.',
  '- **Status:** not yet discussed.',
  '',
  '## P-2 · A weekly summary',
  '',
  'Every Monday, one comment on the Project with what finished and what is next.',
  '',
  '- **Status:** accepted on 2026-10-19.',
])

const record = (day: string, items: string[]) => doc([`# Record ${day}`, '', ...items.map(item => `- ${item}`)])

const DAILY_LESSONS = doc([
  '# Lessons',
  '',
  '- The user writes notes in `~/notes/inbox.md`; new items go at the top.',
  '- "Tomorrow" means the next working day.',
  '- Keep replies under five sentences unless asked for detail.',
  '- Times are in the user\'s local time zone (Europe/Berlin).',
])

const DAILY_INDEX = doc([
  '# Reflections',
  '',
  '- **2026-10-25** — A reminder is more useful with the place in it ("at the post office"), not only the time.',
  '- **2026-10-22** — The user reads the morning summary on the phone: short lines, no tables.',
])

const RESEARCH_READING = doc([
  '# Reading list',
  '',
  '## DNS providers',
  '',
  '- Provider comparison, prices per zone (read 2026-10-20)',
  '- Update API limits: most allow one update per minute',
  '',
  '## Fables',
  '',
  '- Collected versions of *The Tortoise and the Hare* for the kids\' story project',
])

const RESEARCH_LESSONS = doc([
  '# Lessons',
  '',
  '- Cite the page and the day read; prices change.',
  '- Prefer two independent sources before calling something a fact.',
  '- When the user asks "which is best", give one answer first, then the comparison.',
])

const SD_LESSONS = doc([
  '# Lessons',
  '',
  '- Read DESIGN.md before proposing a structure.',
  '- One owner per concept; when two modules decide the same thing, one of them goes.',
  '- A requirement the founder states in his words is quoted, not paraphrased.',
])

const SD_INDEX = doc([
  '# Reflections',
  '',
  '- **2026-10-26** — The founder wants to see the UI before it is built: ask the Product Team for a design early.',
  '- **2026-10-23** — An architecture review round is cheaper than a rework after implementation.',
])

const ROUTER_KNOWLEDGE = doc([
  '# Routing knowledge',
  '',
  '- Short writing tasks: a fast model is enough.',
  '- Code changes across several files: a reasoning model.',
  '- When a runtime refuses a model, choose the next one in the list and say so.',
])

const REVIEWER_LESSONS = doc([
  '# Lessons',
  '',
  '- Read the design spec before the diff.',
  '- A finding names the file, the line and what to do.',
])

/** A small invented chart, drawn in SVG, for the image viewer. */
const CHART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
<rect width="640" height="360" fill="#ffffff"/>
<text x="32" y="44" font-family="sans-serif" font-size="20" font-weight="700" fill="#111827">Update limits per provider (illustrative)</text>
<g font-family="sans-serif" font-size="14" fill="#374151">
<text x="32" y="112">Provider A</text><rect x="160" y="96" width="380" height="22" rx="4" fill="#2563eb"/>
<text x="32" y="172">Provider B</text><rect x="160" y="156" width="250" height="22" rx="4" fill="#2563eb"/>
<text x="32" y="232">Provider C</text><rect x="160" y="216" width="120" height="22" rx="4" fill="#2563eb"/>
<text x="32" y="292">Provider D</text><rect x="160" y="276" width="60" height="22" rx="4" fill="#93c5fd"/>
</g></svg>`

/* -------------------------------------------------------------------- folders (invented) */

const FOLDERS: FolderSpec[] = [
  {
    id: 'project-task-manager', name: 'Project Task Manager', files: [
      { path: 'reflections/index.md', at: '2026-10-26T08:44:00.000Z', text: PTM_INDEX },
      { path: 'records/2026-10-26.md', at: '2026-10-26T08:43:00.000Z', text: record('2026-10-26', ['Created 4 Tasks for "Router settings page" (netpanel).', 'Dispatched autobyteus-41 to the Software Engineering Team after approval.', 'The user asked for shorter titles again: noted in reflections.']) },
      { path: 'lessons.md', at: '2026-10-25T17:02:00.000Z', text: PTM_LESSONS },
      { path: 'records/2026-10-24.md', at: '2026-10-24T15:30:00.000Z', text: record('2026-10-24', ['Asked which Project "the panel" meant: netpanel.', 'Two Tasks blocked on the same review.']) },
      { path: 'proposals.md', at: '2026-10-22T09:15:00.000Z', text: PTM_PROPOSALS },
      { path: 'records/2026-10-21.md', at: '2026-10-21T18:40:00.000Z', text: record('2026-10-21', ['Dispatched three Tasks at once; the user found the review queue hard to follow.']) },
      { path: 'records/2026-10-18.md', at: '2026-10-18T11:05:00.000Z', text: record('2026-10-18', ['Two Tasks edited `settings.vue` at the same time; one was redone.']) },
      { path: 'records/2026-10-15.md', at: '2026-10-15T10:12:00.000Z', text: record('2026-10-15', ['Weekly summary posted on the Project.']) },
      { path: 'records/2026-10-12.md', at: '2026-10-12T16:48:00.000Z', text: record('2026-10-12', ['Created Tasks in the wrong Project and moved them.']) },
    ],
  },
  {
    id: 'team-local-agent:software-engineering-team:solution_designer', name: 'Solution Designer', files: [
      { path: 'reflections/index.md', at: '2026-10-26T08:20:00.000Z', text: SD_INDEX },
      { path: 'lessons.md', at: '2026-10-26T08:18:00.000Z', text: SD_LESSONS },
      { path: 'records/2026-10-26.md', at: '2026-10-26T08:17:00.000Z', text: record('2026-10-26', ['Requirements for "Router settings page" approved within the direction.', 'Asked the Product Team for the settings page design.']) },
      { path: 'records/2026-10-23.md', at: '2026-10-23T14:00:00.000Z', text: record('2026-10-23', ['Architecture review returned two findings; both fixed in the design spec.']) },
      { path: 'proposals.md', at: '2026-10-20T09:30:00.000Z', text: doc(['# Proposals', '', '- Keep a glossary entry for every new term a design introduces.']) },
    ],
  },
  {
    id: 'agent-daily', name: 'Daily Assistant', files: [
      { path: 'records/2026-10-25.md', at: '2026-10-25T19:10:00.000Z', text: record('2026-10-25', ['Set three reminders; one with its place.', 'Summarised the week\'s notes.']) },
      { path: 'reflections/index.md', at: '2026-10-25T19:08:00.000Z', text: DAILY_INDEX },
      { path: 'lessons.md', at: '2026-10-22T07:30:00.000Z', text: DAILY_LESSONS },
      { path: 'records/2026-10-22.md', at: '2026-10-22T07:28:00.000Z', text: record('2026-10-22', ['Morning summary read on the phone; shortened it.']) },
    ],
  },
  {
    id: 'team-local-agent:software-engineering-team:code_reviewer', name: 'Code Reviewer', files: [
      { path: 'lessons.md', at: '2026-10-25T13:40:00.000Z', text: REVIEWER_LESSONS },
      { path: 'records/2026-10-25.md', at: '2026-10-25T13:38:00.000Z', text: record('2026-10-25', ['Reviewed the settings page diff: two findings.']) },
    ],
  },
  {
    id: 'agent-researcher', name: 'Research Assistant', files: [
      { path: 'sources/reading-list.md', at: '2026-10-24T16:22:00.000Z', text: RESEARCH_READING },
      { path: 'shared-notes', at: '2026-10-23T12:00:00.000Z', link: 'folder' },
      { path: 'sources/latest.md', at: '2026-10-23T11:58:00.000Z', link: 'file' },
      { path: 'lessons.md', at: '2026-10-20T10:05:00.000Z', text: RESEARCH_LESSONS },
      { path: 'records/2026-10-20.md', at: '2026-10-20T10:04:00.000Z', text: record('2026-10-20', ['Compared four DNS providers for the home domain.']) },
    ],
  },
  // A folder the agent created but has not written to yet.
  { id: 'release-notes-writer', name: 'Release Notes Writer', files: [] },
  // autobyteus-308: an internal agent; the node lists it only while "Show internal agents" is on.
  {
    id: 'autobyteus-model-router', name: 'Model Router', internal: true, files: [
      { path: 'routing-knowledge.md', at: '2026-10-19T08:00:00.000Z', text: ROUTER_KNOWLEDGE },
      { path: 'records/2026-10-19.md', at: '2026-10-19T07:59:00.000Z', text: record('2026-10-19', ['Chose a reasoning model for a multi-file change.']) },
    ],
  },
]

/** Agents of the Memory page's world that have runs but no semantic folder yet (opened by ID from their runs page). */
const NAMES_WITHOUT_FOLDER: Record<string, string> = { 'server-helper': 'Server Helper' }

/* -------------------------------------------------------------------- sizes and shapes */

const sizeOf = (spec: FileSpec): number => {
  if (spec.link) return spec.link === 'folder' ? 96 : 64
  if (spec.image) return new TextEncoder().encode(CHART_SVG).length
  return new TextEncoder().encode(spec.text ?? '').length
}

const truncatedRecords = (): FileSpec[] => Array.from({ length: 48 }, (_, i) => {
  const day = new Date(Date.parse('2026-10-11T12:00:00.000Z') - i * 86_400_000).toISOString().slice(0, 10)
  return { path: `records/${day}.md`, at: `${day}T12:00:00.000Z`, text: record(day, ['An older record (illustrative).']) }
})

const filesOf = (folder: FolderSpec, scenario: string): FileSpec[] => (
  scenario === 'semantic_memory_truncated' && folder.id === 'project-task-manager' ? [...folder.files, ...truncatedRecords()] : folder.files
)

const entryOf = (folder: FolderSpec, spec: FileSpec): SemanticMemoryFile => ({
  relativePath: spec.path,
  absolutePath: `${semanticFolderPathOf(folder.id)}/${spec.path}`,
  kind: spec.link ? 'link' : 'file',
  sizeBytes: sizeOf(spec),
  modifiedAt: spec.at,
})

const byNewest = <T extends { modifiedAt: string }>(items: T[]) => [...items].sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))

/* -------------------------------------------------------------------- the node's answers */

let unavailableReads = 0

export const SEMANTIC_OPERATIONS = new Set(['GetSemanticMemoryFolders', 'GetSemanticMemoryFiles'])
export const isSemanticMemoryOperation = (name: string) => SEMANTIC_OPERATIONS.has(name)

export const semanticMemoryOperation = (
  name: string,
  variables: Record<string, any>,
  scenario: string,
  showInternalAgents: boolean,
): { data?: any; errors?: Array<{ message: string }> } => {
  const folders = scenario === 'empty' ? [] : FOLDERS
  if (name === 'GetSemanticMemoryFolders') {
    // The first read of a page load fails; Retry reads it again.
    if (scenario === 'semantic_memory_unavailable' && unavailableReads++ % 2 === 0) {
      return { errors: [{ message: 'The node could not list the semantic memory folders. (synthetic failure)' }] }
    }
    const list: SemanticMemoryFolder[] = folders
      .filter(folder => showInternalAgents || !folder.internal)
      .map(folder => {
        const entries = filesOf(folder, scenario).map(spec => entryOf(folder, spec))
        return {
          agentDefinitionId: folder.id,
          agentName: folder.name,
          fileCount: entries.filter(entry => entry.kind === 'file').length,
          latestChangeAt: byNewest(entries)[0]?.modifiedAt ?? null,
        }
      })
      .sort((a, b) => (b.latestChangeAt ?? '').localeCompare(a.latestChangeAt ?? ''))
    return { data: { semanticMemoryFolders: list } }
  }
  const id = String(variables.agentDefinitionId ?? '')
  const folder = folders.find(candidate => candidate.id === id)
  const list: SemanticMemoryFileList = folder
    ? { agentDefinitionId: id, exists: true, folderPath: semanticFolderPathOf(id), files: byNewest(filesOf(folder, scenario).map(spec => entryOf(folder, spec))), truncated: scenario === 'semantic_memory_truncated' && id === 'project-task-manager' }
    : { agentDefinitionId: id, exists: false, folderPath: semanticFolderPathOf(id), files: [], truncated: false }
  return { data: { semanticMemoryFiles: list } }
}

/** The agent's name for a folder opened by ID (the runs page passes it too). */
export const semanticAgentNameOf = (id: string): string | null => FOLDERS.find(folder => folder.id === id)?.name ?? NAMES_WITHOUT_FOLDER[id] ?? null

export type SemanticFileContent = { kind: 'text'; content: string } | { kind: 'url'; url: string } | { kind: 'refused'; refusal: 'not-found' | 'failed' }

/**
 * Stands in for the node-file loader (`loadNodeFile(restBaseUrl, absolutePath, asText)`): a listed regular file's
 * content after a node-like delay. A link is never asked for (the view does not call it for a link row).
 */
export const loadSemanticFile = async (absolutePath: string, scenario: string): Promise<SemanticFileContent> => {
  await new Promise<void>(done => setTimeout(done, 180))
  for (const folder of FOLDERS) {
    const prefix = `${semanticFolderPathOf(folder.id)}/`
    if (!absolutePath.startsWith(prefix)) continue
    const spec = filesOf(folder, scenario).find(candidate => candidate.path === absolutePath.slice(prefix.length))
    if (!spec || spec.link) return { kind: 'refused', refusal: 'not-found' }
    if (scenario === 'semantic_file_fails' && spec.path.startsWith('records/') && spec.path !== 'records/2026-10-26.md') return { kind: 'refused', refusal: 'not-found' }
    if (spec.image) return { kind: 'url', url: `data:image/svg+xml;utf8,${encodeURIComponent(CHART_SVG)}` }
    return { kind: 'text', content: spec.text ?? '' }
  }
  return { kind: 'refused', refusal: 'failed' }
}

/* -------------------------------------------------------------------- round 2: the folder as a read-only workspace */

/** The agent ID a `semantic_ws_*` workspace is rooted at. */
export const agentIdOfSemanticWorkspace = (workspaceId: string): string | null =>
  workspaceId.startsWith('semantic_ws_') ? decodeURIComponent(workspaceId.slice('semantic_ws_'.length)) : null

export type SemanticTreeEntry = { name: string; path: string; isFile: boolean; isLink: boolean; children: SemanticTreeEntry[] }

/**
 * The folder as the read-only explorer shows it: folders first, then files, each by name (the explorer's order). A
 * symbolic link is an entry of its own (`isLink`), never a folder: it is listed and never entered.
 */
export const semanticTreeOf = (agentDefinitionId: string, scenario: string): SemanticTreeEntry[] => {
  const folder = (scenario === 'empty' ? [] : FOLDERS).find(candidate => candidate.id === agentDefinitionId)
  if (!folder) return []
  const root: SemanticTreeEntry = { name: '', path: '', isFile: false, isLink: false, children: [] }
  for (const spec of filesOf(folder, scenario)) {
    const parts = spec.path.split('/')
    let node = root
    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join('/')
      const last = index === parts.length - 1
      let child = node.children.find(entry => entry.name === part)
      if (!child) {
        child = { name: part, path, isFile: last, isLink: last && !!spec.link, children: [] }
        node.children.push(child)
      }
      node = child
    })
  }
  const sort = (entries: SemanticTreeEntry[]): SemanticTreeEntry[] => entries
    .map(entry => ({ ...entry, children: sort(entry.children) }))
    .sort((a, b) => (a.isFile === b.isFile ? a.name.localeCompare(b.name) : a.isFile ? 1 : -1))
  return sort(root.children)
}

/** Whether the agent's folder exists and holds anything (the view shows its explorer only then). */
export const semanticFolderState = (agentDefinitionId: string, scenario: string): 'missing' | 'empty' | 'files' => {
  const folder = (scenario === 'empty' ? [] : FOLDERS).find(candidate => candidate.id === agentDefinitionId)
  if (!folder) return 'missing'
  return filesOf(folder, scenario).length ? 'files' : 'empty'
}

/** A regular file's text, read through the workspace (GetFileContent); null for a link or an unknown path. */
export const semanticFileText = (agentDefinitionId: string, path: string, scenario: string): string | null => {
  const folder = FOLDERS.find(candidate => candidate.id === agentDefinitionId)
  const spec = folder ? filesOf(folder, scenario).find(candidate => candidate.path === path) : null
  if (!spec || spec.link) return null
  if (scenario === 'semantic_file_fails' && spec.path.startsWith('records/') && spec.path !== 'records/2026-10-26.md') return null
  return spec.text ?? ''
}

/** File-name search inside this folder only (SearchFiles): the matching paths; links are found by name too. */
export const semanticSearch = (agentDefinitionId: string, query: string, scenario: string): string[] => {
  const folder = FOLDERS.find(candidate => candidate.id === agentDefinitionId)
  const cue = query.trim().toLowerCase()
  if (!folder || !cue) return []
  return filesOf(folder, scenario).map(spec => spec.path).filter(path => path.toLowerCase().includes(cue))
}
