/**
 * memory-baseline-refresh-554 (origin/personal@8430d9ef12, autobyteus-320): a scripted voice capture for Memory → Search, beneath the UI.
 *
 * The product records from the microphone and transcribes locally through the desktop app's voice input extension; the UI
 * reference has neither. For the Memory search box only (`source: 'memory-search'`), the voice store's toggle and cancel play the
 * store's own visible sequence on its own state: Starting (0.4 s) → Recording until the user taps stop → Transcribing (0.9 s) →
 * the transcript joins the typed text, and the search waits for the Search button, as in the source. The transcript is invented.
 * Other voice targets (composer, Projects) keep the baseline's earlier, inert stand-in.
 */
const TRANSCRIPT = 'where did we set up the dynamic DNS updater'

const result = (store: any, outcome: string, transcript = '') =>
  store.setLatestResult({ source: 'memory-search', outcome, transcript, detectedLanguage: transcript ? 'en' : null, error: null, diagnostics: null })

let timer: ReturnType<typeof setTimeout> | null = null
// extensions-ui-516 (design): the first transcription after the voice program starts is slow (~30 s measured; 5 s here), so the
// slow note shows; later ones take 0.9 s.
let warm = false
const clear = () => { if (timer) { clearTimeout(timer); timer = null } }

export const isMemorySearchVoice = (store: any, action: string, args: any[]): boolean =>
  store.$id === 'voiceInput' && (
    (action === 'toggleRecording' && args[0]?.source === 'memory-search')
    || (action === 'cancelOperationForTarget' && store.recordingSource === 'memory-search' && store.transcriptTarget?.key === args[0])
  )

export const memorySearchVoice = (store: any, action: string, args: any[]): void => {
  if (action === 'cancelOperationForTarget') {
    clear()
    store.isStarting = false; store.isRecording = false; store.isTranscribing = false
    store.recordingSource = null; store.transcriptTarget = null
    return
  }
  const request = args[0]
  if (store.isStarting || store.isTranscribing) return
  if (!store.isRecording) {
    store.isStarting = true
    store.recordingSource = 'memory-search'
    store.transcriptTarget = request.target
    timer = setTimeout(() => { store.isStarting = false; store.isRecording = true; result(store, 'recording') }, 400)
    return
  }
  const target = store.transcriptTarget
  store.isRecording = false
  store.isTranscribing = true
  result(store, 'transcribing')
  timer = setTimeout(() => {
    result(store, 'transcript-ready', TRANSCRIPT)
    if (target?.isCurrent()) target.appendTranscript(TRANSCRIPT)
    store.isTranscribing = false; store.recordingSource = null; store.transcriptTarget = null
  }, warm ? 900 : 5000)
  warm = true
}
