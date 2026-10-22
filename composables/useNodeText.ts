import { useLocalization } from '~/composables/useLocalization'
import type { Cause, DirState } from '~/prototype/nodes/nodeWorld'
import type { StepError } from '~/stores/nodeListStore'

const P = 'settings.components.settings.NodesPage.'

/** Plain-words causes and direction labels of the Nodes page (REQ-706, REQ-707). */
export function useNodeText() {
  const { t } = useLocalization()
  const k = (key: string): any => `${P}${key}`

  const causeText = (cause: Cause, host: string, fromNode?: string): string => {
    if (cause === 'dns') return fromNode ? t(k('cause.dnsFrom'), { host, node: fromNode }) : t(k('cause.dns'), { host })
    return t(k(`cause.${cause}`))
  }

  const errorText = (error: StepError | { kind: 'different' }, nodeName: string): string => {
    if (error.kind === 'different') return t(k('address.different'))
    if (error.kind === 'unreachable') return causeText(error.cause, error.host.split(':')[0] || error.host, nodeName)
    return t(k('hint.noAddress'), { node: nodeName, address: error.firstTried })
  }

  const dirLabel = (dir: DirState, name: string): string => {
    switch (dir.state) {
      case 'working': return t(k('dir.working'))
      case 'offHere': return t(k('dir.offHere'))
      case 'offThere': return t(k('dir.offThere'), { name })
      case 'notRegisteredHere': return t(k('dir.notRegisteredHere'))
      case 'notRegisteredThere': return t(k('dir.notRegisteredThere'), { name })
      case 'unreachable': return t(k('dir.unreachable'))
      case 'different': return t(k('dir.different'))
    }
  }

  return { t, k, causeText, errorText, dirLabel }
}
