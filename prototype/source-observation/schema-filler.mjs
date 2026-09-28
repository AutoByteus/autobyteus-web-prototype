// Schema-aware completion for controlled source observation only.
//
// The pinned source's committed `generated/graphql.ts` describes every GraphQL
// type the source UI can select. The synthetic fixtures supply the visible
// values; this module walks each requested operation and fills any selected
// field that a fixture omits with a deterministic empty value (null for
// nullable fields, [] for lists, 0/false/'' for scalars, the first member for
// enums). It lets the exact source UI render against deterministic data without
// hand-maintaining every field of every newer query. The independently
// runnable prototype never loads this module.
import { readFileSync } from 'node:fs'
import { parse } from 'graphql'

const FIXED_DATE = '2026-08-22T04:00:00.000Z'

const parseTypeExpression = (raw) => {
  let text = raw.trim()
  let nullable = false
  const unwrap = (prefix) => {
    if (text.startsWith(prefix) && text.endsWith('>')) {
      text = text.slice(prefix.length, -1).trim()
      return true
    }
    return false
  }
  if (unwrap('Maybe<')) nullable = true
  let list = false
  let itemNullable = false
  if (unwrap('Array<')) {
    list = true
    if (unwrap('Maybe<')) itemNullable = true
  }
  const scalar = text.match(/^Scalars\['(\w+)'\]\['output'\]$/)
  return { nullable, list, itemNullable, scalar: scalar?.[1] || null, named: scalar ? null : text }
}

export const loadSchema = (generatedPath) => {
  const text = readFileSync(generatedPath, 'utf8')
  const objects = new Map()
  const enums = new Map()
  const unions = new Map()
  const objectPattern = /^export type (\w+) = \{\n  __typename\?: '(\w+)';\n([\s\S]*?)\n\};/gm
  for (const match of text.matchAll(objectPattern)) {
    const fields = new Map()
    for (const line of match[3].split('\n')) {
      const field = line.match(/^  (\w+)\??: (.+);$/)
      if (field) fields.set(field[1], parseTypeExpression(field[2]))
    }
    objects.set(match[1], { typename: match[2], fields })
  }
  for (const match of text.matchAll(/^export enum (\w+) \{\n([\s\S]*?)\n\}/gm)) {
    const first = match[2].match(/= '([^']+)'/)
    if (first) enums.set(match[1], first[1])
  }
  for (const match of text.matchAll(/^export type (\w+) = ((?:\w+)(?: \| \w+)+);$/gm)) {
    const members = match[2].split('|').map(value => value.trim())
    if (members.every(member => /^[A-Z]\w*$/.test(member))) unions.set(match[1], members)
  }
  return { objects, enums, unions }
}

const scalarDefault = (scalar) => {
  switch (scalar) {
    case 'Int': case 'Float': case 'SafeInt': return 0
    case 'Boolean': return false
    case 'JSON': return {}
    case 'DateTime': return FIXED_DATE
    default: return ''
  }
}

export const createSchemaFiller = (generatedPath) => {
  const schema = loadSchema(generatedPath)

  const resolveObjectType = (named, value) => {
    if (value && typeof value === 'object' && typeof value.__typename === 'string' && schema.objects.has(value.__typename)) {
      return value.__typename
    }
    if (schema.objects.has(named)) return named
    const members = schema.unions.get(named)
    return members?.[0] || null
  }

  const collectFields = (selectionSet, typeName, fragments, out = []) => {
    for (const selection of selectionSet?.selections || []) {
      if (selection.kind === 'Field') out.push(selection)
      else if (selection.kind === 'InlineFragment') {
        const condition = selection.typeCondition?.name.value
        if (!condition || condition === typeName || schema.unions.get(condition)?.includes(typeName)) {
          collectFields(selection.selectionSet, typeName, fragments, out)
        }
      } else if (selection.kind === 'FragmentSpread') {
        const fragment = fragments.get(selection.name.value)
        const condition = fragment?.typeCondition.name.value
        if (fragment && (condition === typeName || schema.unions.get(condition)?.includes(typeName))) {
          collectFields(fragment.selectionSet, typeName, fragments, out)
        }
      }
    }
    return out
  }

  const fillValue = (value, type, selectionSet, fragments) => {
    if (value === undefined) {
      if (type.nullable) return null
      if (type.list) return []
      if (type.scalar) return scalarDefault(type.scalar)
      if (schema.enums.has(type.named)) return schema.enums.get(type.named)
      if (!selectionSet) return null
      value = {}
    }
    if (value === null) return null
    if (type.list) {
      if (!Array.isArray(value)) return value
      const itemType = { ...type, list: false, nullable: type.itemNullable }
      return value.map(item => fillValue(item, itemType, selectionSet, fragments))
    }
    if (!selectionSet || typeof value !== 'object') return value
    return fillObject(value, type.named, selectionSet, fragments)
  }

  const fillObject = (value, named, selectionSet, fragments) => {
    const typeName = resolveObjectType(named, value)
    const definition = typeName ? schema.objects.get(typeName) : null
    const result = { ...value }
    if (definition && result.__typename === undefined) result.__typename = definition.typename
    for (const field of collectFields(selectionSet, typeName, fragments)) {
      const name = field.name.value
      const key = field.alias?.value || name
      if (name === '__typename') {
        result[key] = result.__typename ?? definition?.typename ?? named
        continue
      }
      const fieldType = definition?.fields.get(name)
      const current = result[key] !== undefined ? result[key] : result[name]
      if (!fieldType) {
        result[key] = current === undefined ? null : current
        continue
      }
      result[key] = fillValue(current, fieldType, field.selectionSet, fragments)
    }
    return result
  }

  return (query, operationName, data) => {
    let document
    try { document = parse(String(query || '')) } catch { return data }
    const fragments = new Map(document.definitions
      .filter(definition => definition.kind === 'FragmentDefinition')
      .map(definition => [definition.name.value, definition]))
    const operation = document.definitions.find(definition => definition.kind === 'OperationDefinition'
      && (!operationName || definition.name?.value === operationName))
      || document.definitions.find(definition => definition.kind === 'OperationDefinition')
    if (!operation) return data
    const rootName = operation.operation === 'mutation' ? 'Mutation' : operation.operation === 'subscription' ? 'Subscription' : 'Query'
    return fillObject(data || {}, rootName, operation.selectionSet, fragments)
  }
}
