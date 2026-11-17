/**
 * A minimal VNC (RFB 3.8) server, only enough for the viewer to show a picture: no authentication, one raw frame of an
 * invented desktop (a blue-grey wallpaper, a window with a title bar, a taskbar), never any input. It is the stand-in for the
 * node's node desktop (the agent's virtual desktop in a Docker node); the UI reference and the disposable observation node
 * both play it, so the viewer shows the same picture on both. `send(bytes)` is the connection's write; feed the client's
 * bytes to the returned function.
 */
const W = 1024, H = 640
const frame = () => {
  const out = new Uint8Array(W * H * 4)
  const put = (x, y, r, g, b) => { const i = (y * W + x) * 4; out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = 0 }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(x, y, 40 + (x >> 5), 70 + (y >> 4), 120 + (x + y >> 6))
  const rect = (x0, y0, w, h, r, g, b) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(x, y, r, g, b) }
  rect(140, 90, 640, 400, 245, 247, 250); rect(140, 90, 640, 34, 51, 65, 85)
  rect(160, 100, 12, 12, 239, 68, 68); rect(180, 100, 12, 12, 234, 179, 8); rect(200, 100, 12, 12, 34, 197, 94)
  for (let l = 0; l < 9; l++) rect(170, 150 + l * 34, 300 + ((l * 53) % 220), 12, 203, 213, 225)
  rect(0, H - 36, W, 36, 15, 23, 42); rect(12, H - 28, 90, 20, 59, 130, 246)
  return out
}
const u16 = (n) => [(n >> 8) & 255, n & 255]
const u32 = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]

export const createRfbServer = (send) => {
  let step = 'version'
  const pixels = frame()
  const sendBytes = (bytes) => send(Uint8Array.from(bytes))
  setTimeout(() => sendBytes([...new TextEncoder().encode('RFB 003.008\n')]), 20)
  return (data) => {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data)
    if (step === 'version') { step = 'security'; sendBytes([1, 1]); return }
    if (step === 'security') { step = 'result'; sendBytes(u32(0)); return }
    if (step === 'result') {
      step = 'ready'
      const name = new TextEncoder().encode('Node desktop')
      sendBytes([...u16(W), ...u16(H), 32, 24, 0, 1, ...u16(255), ...u16(255), ...u16(255), 16, 8, 0, 0, 0, 0, ...u32(name.length), ...name])
      return
    }
    // FramebufferUpdateRequest (3): answer with the whole picture once, then only empty updates.
    for (let i = 0; i < bytes.length;) {
      const type = bytes[i]
      if (type === 3) {
        if (step === 'ready') { step = 'drawn'; const head = [0, 0, ...u16(1), ...u16(0), ...u16(0), ...u16(W), ...u16(H), ...u32(0)]; const all = new Uint8Array(head.length + pixels.length); all.set(head); all.set(pixels, head.length); send(all) }
        i += 10
      } else if (type === 0) i += 20
      else if (type === 2) i += 4 + 4 * ((bytes[i + 2] << 8) | bytes[i + 3])
      else if (type === 4) i += 8
      else if (type === 5) i += 6
      else if (type === 6) { i += 8 + ((bytes[i + 4] << 24) | (bytes[i + 5] << 16) | (bytes[i + 6] << 8) | bytes[i + 7]) }
      else break
    }
  }
}
