import { gql } from 'graphql-tag'

/**
 * semantic-memory-view-554 (design): the two reads the Memory page's semantic memory view needs. Names and fields
 * follow the Solution Designer's design spec (DS-002); the UI reference answers them locally.
 */
export const GET_SEMANTIC_MEMORY_FOLDERS = gql`
  query GetSemanticMemoryFolders {
    semanticMemoryFolders {
      agentDefinitionId
      agentName
      fileCount
      latestChangeAt
    }
  }
`

export const GET_SEMANTIC_MEMORY_FILES = gql`
  query GetSemanticMemoryFiles($agentDefinitionId: String!) {
    semanticMemoryFiles(agentDefinitionId: $agentDefinitionId) {
      agentDefinitionId
      exists
      folderPath
      truncated
      files {
        relativePath
        absolutePath
        kind
        sizeBytes
        modifiedAt
      }
    }
  }
`
