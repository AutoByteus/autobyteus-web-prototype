// WEB-BASELINE-REFRESH-014 (origin/personal@e4bebdc858): the node-side state behind Settings → Server Settings → Basics → GitHub,
// as one small in-memory "server" state per caller (`state.github`), reset with the scenario. The observation node
// (mock-node.mjs) and the baseline (utils/apolloClient.ts) both answer from here, so both sides show the same scripted outcome.
// Nothing is sent to GitHub, no vault is used and every value is invented.
//
// Scripted outcomes (UI behavior, not GitHub logic):
// - Save: a token containing "reject" is refused (`TOKEN_REJECTED`), one containing "offline" cannot be checked
//   (`TOKEN_CHECK_FAILED`); any other token connects as the invented account `synthetic-octocat`.
// - Test: works, or fails with `TOKEN_REJECTED` in the `github_test_rejected` scenario.
// - Remove: the connection goes; the ticked agents are kept. `github_vault_unavailable` refuses Save and Remove.
// - Agent tick list: a tick changes the in-memory list; `github_agents_fail` refuses it.
// - Starting states: default = not connected; `github_connected` (two agents ticked); `github_load_failed` (the first read fails).

export const GITHUB_MUTATIONS = new Set([
  'ConnectGitHubIntegration', 'TestGitHubIntegration', 'DisconnectGitHubIntegration', 'SetGitHubIntegrationAgentAccess',
])

const failure = (message, code) => ({ __projectError: { message, extensions: { code } } })
const CONNECTED_AT = '2026-08-20T09:30:00.000Z'
const LOGIN = 'synthetic-octocat'

const githubOf = (state) => (state.github ??= {
  connected: state.scenario === 'github_connected' || state.scenario === 'github_test_rejected' || state.scenario === 'github_agents_fail',
  login: null,
  connectedAt: null,
  agentDefinitionIds: state.scenario === 'github_connected' ? ['agent-researcher', 'agent-writer'] : [],
  reads: 0,
})
const view = (github) => ({
  __typename: 'GitHubIntegrationStatus',
  connected: github.connected,
  login: github.connected ? LOGIN : null,
  connectedAt: github.connected ? CONNECTED_AT : null,
  agentDefinitionIds: [...github.agentDefinitionIds],
})

/** The answer for a GitHub operation, or `undefined` when the operation is not one of them. */
export function githubOperation(operationName, variables, state) {
  if (operationName !== 'GetGitHubIntegration' && !GITHUB_MUTATIONS.has(operationName)) return undefined
  const github = githubOf(state)
  if (operationName === 'GetGitHubIntegration') {
    github.reads += 1
    if (state.scenario === 'github_load_failed' && github.reads === 1) return failure('Synthetic GitHub connection read failure.', 'GITHUB_READ_FAILED')
    return { githubIntegration: view(github) }
  }
  const vaultDown = state.scenario === 'github_vault_unavailable'
  if (operationName === 'ConnectGitHubIntegration') {
    const token = String(variables.token || '')
    if (vaultDown) return failure('Synthetic vault failure.', 'VAULT_UNAVAILABLE')
    if (!token.trim()) return failure('Synthetic empty token.', 'TOKEN_REQUIRED')
    if (token.toLowerCase().includes('reject')) return failure('Synthetic GitHub refusal.', 'TOKEN_REJECTED')
    if (token.toLowerCase().includes('offline')) return failure('Synthetic GitHub check failure.', 'TOKEN_CHECK_FAILED')
    github.connected = true
    return { connectGitHubIntegration: view(github) }
  }
  if (operationName === 'TestGitHubIntegration') {
    if (!github.connected) return failure('Synthetic not connected.', 'INTEGRATION_NOT_CONNECTED')
    if (state.scenario === 'github_test_rejected') return failure('Synthetic GitHub refusal.', 'TOKEN_REJECTED')
    return { testGitHubIntegration: view(github) }
  }
  if (operationName === 'DisconnectGitHubIntegration') {
    if (vaultDown) return failure('Synthetic vault failure.', 'VAULT_UNAVAILABLE')
    github.connected = false
    return { disconnectGitHubIntegration: view(github) }
  }
  if (state.scenario === 'github_agents_fail') return failure('Synthetic agent choice failure.', 'GITHUB_AGENTS_FAILED')
  github.agentDefinitionIds = [...(variables.agentDefinitionIds || [])]
  return { setGitHubIntegrationAgentAccess: view(github) }
}
