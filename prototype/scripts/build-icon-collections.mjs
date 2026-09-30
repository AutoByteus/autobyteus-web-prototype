#!/usr/bin/env node
// Adds every statically referenced Iconify icon used by the retained source
// presentation to the offline icon bundle (prototype/fixtures/icon-collections.json),
// so the prototype renders icons without contacting api.iconify.design.
// Existing entries are kept (some icons are referenced dynamically).
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve, join } from 'node:path'

const root = resolve(new URL('../..', import.meta.url).pathname)
const require = createRequire(import.meta.url)
const output = resolve(root, 'prototype/fixtures/icon-collections.json')
const prefixes = ['heroicons', 'ph', 'mdi', 'svg-spinners', 'vscode-icons', 'logos']
const scanDirs = ['app.vue', 'error.vue', 'components', 'composables', 'layouts', 'pages', 'utils', 'services', 'stores', 'types', 'display']
const pattern = new RegExp(`\\b(${prefixes.map(p => p.replace('-', '\\-')).join('|')}):([a-z0-9]+(?:-[a-z0-9]+)*)`, 'g')

const files = []
const walk = async path => {
  const entries = await readdir(path, { withFileTypes: true }).catch(() => null)
  if (!entries) { if (/\.(vue|ts|js)$/.test(path)) files.push(path); return }
  for (const entry of entries) {
    if (entry.name === '__tests__' || entry.name === 'node_modules') continue
    const next = join(path, entry.name)
    if (entry.isDirectory()) await walk(next)
    else if (/\.(vue|ts|js)$/.test(entry.name)) files.push(next)
  }
}
for (const dir of scanDirs) await walk(resolve(root, dir))

const wanted = new Map(prefixes.map(prefix => [prefix, new Set()]))
for (const file of files) {
  for (const match of (await readFile(file, 'utf8')).matchAll(pattern)) wanted.get(match[1]).add(match[2])
}

const bundle = JSON.parse(await readFile(output, 'utf8'))
const added = []
for (const prefix of prefixes) {
  const full = require(`@iconify-json/${prefix}/icons.json`)
  const target = bundle[prefix] ||= { prefix, icons: {}, width: full.width, height: full.height }
  for (const name of wanted.get(prefix)) {
    if (target.icons[name] || target.aliases?.[name]) continue
    if (full.icons[name]) { target.icons[name] = full.icons[name]; added.push(`${prefix}:${name}`) }
    else if (full.aliases?.[name]) {
      const parent = full.aliases[name].parent
      target.aliases = { ...(target.aliases || {}), [name]: full.aliases[name] }
      if (!target.icons[parent] && full.icons[parent]) target.icons[parent] = full.icons[parent]
      added.push(`${prefix}:${name}`)
    }
  }
}
await writeFile(output, `${JSON.stringify(bundle, null, 2)}\n`)
process.stdout.write(`Added ${added.length} icons${added.length ? `: ${added.join(', ')}` : ''}\n`)
