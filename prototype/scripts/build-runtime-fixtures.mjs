#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(new URL('../..', import.meta.url).pathname)
const sourcePath = resolve(root, 'prototype/fixtures/source-state-snapshots.json')
const outputPath = resolve(root, 'prototype/fixtures/runtime-state.json')
const sourceCommit = '4dee901d6163ca7053916fa1edc295afbfd7a6da'
const source = JSON.parse(await readFile(sourcePath, 'utf8'))

const snapshots = Object.fromEntries(Object.entries(source.snapshots).map(([key, value]) => [key, {
  item: value.item,
  actualPath: value.actualPath,
  state: value.state,
  primaryNavHeight: value.primaryNavHeight ?? null,
  bootstrapPending: Boolean(value.bootstrapPending),
}]))

// The pinned source now mounts its stores before the delayed responses arrive,
// so the captured loading frame (unresolved capabilities, history loading) is
// used directly. Only if a capture was taken before any store mounted is the
// transient frame derived from the populated shell, as in earlier baselines.
const loadingKey = 'loading|desktop|/agents?view=list'
const populatedKey = 'populated|desktop|/agents?view=list'
const loading = snapshots[loadingKey]
const populated = snapshots[populatedKey]
if (!loading || !populated) throw new Error('Required loading/populated source snapshots are missing')
if (loading.bootstrapPending || !Object.keys(loading.state || {}).length) {
  loading.state = structuredClone(populated.state)
  loading.bootstrapPending = false
  loading.state.applicationsCapability = { capability: null, status: 'loading', error: null }
  loading.state.projectsCapability = { capability: null, status: 'loading', error: null }
}
loading.primaryNavHeight = loading.primaryNavHeight || populated.primaryNavHeight

await writeFile(outputPath, `${JSON.stringify({ sourceCommit, snapshots }, null, 2)}\n`)
process.stdout.write(`Wrote ${Object.keys(snapshots).length} deterministic runtime snapshots to ${outputPath}\n`)
