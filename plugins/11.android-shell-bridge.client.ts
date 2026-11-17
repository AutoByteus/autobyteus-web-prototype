import { activeAndroidNodeName, isInAndroidApp, loadAndroidNodes } from '~/prototype/phone-pairing/phonePairingFixture'
import { defineNuxtPlugin } from '#app'

/**
 * The Android app's shell bridge (`window.AutoByteusShell`), simulated for the pages the design's `/android` route opens
 * "in the app" (session flag `autobyteus.prototype.inAndroidApp`). The app itself is native and not part of this UI
 * reference; this object answers the page's messages the way the app does: its `hello` carries the node count, the phone's
 * name and the open node's name; `showNodeList` returns to the app's node list (`/android`). Nothing else is acted on.
 * A plain browser tab has no bridge.
 */
export default defineNuxtPlugin(() => {
  if (!isInAndroidApp()) return
  const listeners = new Set<(event: { data: unknown }) => void>()
  const reply = (message: unknown): void => { setTimeout(() => listeners.forEach((listener) => listener({ data: JSON.stringify(message) })), 0) }
  ;(window as unknown as { AutoByteusShell: unknown }).AutoByteusShell = {
    postMessage(raw: string) {
      let message: { type?: string } = {}
      try { message = JSON.parse(raw) } catch { return }
      if (message.type === 'hello') reply({ type: 'shell', nodeCount: loadAndroidNodes().length, deviceName: 'Prototype phone', nodeName: activeAndroidNodeName() ?? '' })
      else if (message.type === 'showNodeList') window.location.assign('/android?from=node')
    },
    addEventListener(_type: 'message', listener: (event: { data: unknown }) => void) { listeners.add(listener) },
    removeEventListener(_type: 'message', listener: (event: { data: unknown }) => void) { listeners.delete(listener) },
  }
})
