/**
 * A browser `fetch` that answers requests to other nodes' addresses from the simulated network of nodes
 * (prototype/nodes/network-world.mjs), the way the network would: after the node's own delay, or as a failed request
 * (a browser reports only that a request failed; a node that does not answer in time ends the request by the caller's own
 * timeout). `resolve(url, init)` returns the world's result for an address that belongs to the network, or `null` for any
 * other request, which goes to `nativeFetch` unchanged. `{ proxy: true }`: the window's own node answers it at `localBase`. Plain ECMAScript with no imports: the baseline plugin and the
 * browser harness (which also runs the pinned source) both use it.
 */
export function createNodeNetworkFetch(nativeFetch, resolve, localBase) {
  const wait = (ms, signal) => new Promise((done, fail) => {
    if (signal?.aborted) return fail(signal.reason ?? new DOMException('The operation was aborted.', 'AbortError'))
    const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); done() }, ms)
    const onAbort = () => { clearTimeout(timer); fail(signal.reason ?? new DOMException('The operation was aborted.', 'AbortError')) }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
  return async function nodeNetworkFetch(input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const request = { method: init?.method ?? (typeof input === 'object' && input && 'method' in input ? input.method : 'GET'), body: init?.body }
    const result = await resolve(url, request)
    if (!result) return nativeFetch(input, init)
    // The window's own node answers this itself (its own endpoint), not the simulated network.
    if (result.proxy) { const own = new URL(url); return nativeFetch(`${localBase}${own.pathname}${own.search}`, init) }
    const signal = init?.signal
    if (result.failure === 'timeout') {
      await wait(result.delayMs, signal)
      throw new DOMException('The operation timed out.', 'TimeoutError')
    }
    await wait(result.delayMs ?? 0, signal)
    if (result.failure) throw new TypeError('Failed to fetch')
    const body = result.json !== undefined ? JSON.stringify(result.json) : String(result.text ?? '')
    return new Response(body, { status: result.status ?? 200, headers: { 'content-type': result.json !== undefined ? 'application/json' : 'text/html' } })
  }
}
