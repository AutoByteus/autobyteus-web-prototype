/**
 * Entry points of the local run for `cross-scope-agent-mentions`: one per run kind.
 * See `runMentionPlayer.ts` for the script and the `*RunDriver.ts` files for how each
 * run kind applies it.
 */
import { playReplyOnly, playRunSend } from './runMentionPlayer'
import { createTeamRunDriver } from './teamRunDriver'
import { createOrgRunDriver } from './orgRunDriver'
import { createAgentRunDriver } from './agentRunDriver'

const play = async (driver: ReturnType<typeof createTeamRunDriver>, content: string): Promise<void> => {
  if (driver) await playRunSend(driver, content)
}

export const simulateTeamRunSend = (content: string): Promise<void> => play(createTeamRunDriver(), content)
export const simulateOrgRunSend = (orgRunId: string, content: string): Promise<void> => play(createOrgRunDriver(orgRunId), content)
export const simulateAgentRunSend = (content: string): Promise<void> => play(createAgentRunDriver(), content)
/** Replies to a standalone Agent message that the product's own send delivered. */
export const simulateAgentRunReply = async (): Promise<void> => {
  const driver = createAgentRunDriver()
  if (driver) await playReplyOnly(driver)
}
