/**
 * extensions-ui-516 (design only): the two extensions' own pages (`ui/index.html` of each package, extension-contract.md §2, §5).
 *
 * Written as an extension author would: one HTML page, its own styles, no network access (the CSP below and the frame's
 * sandbox), and calls only through the message bridge to its own extension's actions. The pages are English only: the
 * contract passes no language or theme to a page (see the UI/UX spec's findings). The styles follow AutoByteus's
 * Settings look by hand, as a first-party extension would.
 */

const CSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:">`

const BASE_CSS = `
*{box-sizing:border-box}
html,body{margin:0;background:transparent}
body{font:14px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;color:#111827;-webkit-font-smoothing:antialiased}
h3{margin:0;font-size:14px;line-height:20px;font-weight:600;color:#111827}
p{margin:0}
.stack{display:flex;flex-direction:column;gap:20px}
.field{display:flex;flex-direction:column;gap:6px}
.label{font-size:14px;font-weight:500;color:#374151}
.hint{font-size:12px;line-height:16px;color:#6b7280}
.muted{color:#6b7280}
select,input,textarea{font:inherit;font-size:14px;color:#111827;background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:8px 12px}
select{padding-right:32px}
textarea{resize:none;width:100%}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;font-size:12px;line-height:18px}
select:focus,input:focus,textarea:focus,button:focus-visible,a:focus-visible{outline:2px solid #3b82f6;outline-offset:1px}
select:disabled{background:#f9fafb;color:#6b7280}
button{font:inherit;font-size:14px;font-weight:500;border-radius:6px;padding:8px 16px;cursor:pointer;border:1px solid transparent;transition:background-color .15s}
button:disabled{cursor:not-allowed;opacity:.6}
.primary{background:#2563eb;color:#fff}
.primary:hover:not(:disabled){background:#1d4ed8}
.secondary{background:#fff;color:#374151;border-color:#d1d5db}
.secondary:hover:not(:disabled){background:#f9fafb}
.link{background:none;border:0;padding:0;color:#1d4ed8;font-size:14px;font-weight:500}
.link:hover{color:#1e40af;text-decoration:underline}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.error{font-size:14px;color:#b91c1c}
.ok{font-size:12px;color:#047857}
.spin{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #bfdbfe;border-top-color:#1d4ed8;animation:spin 1s linear infinite;vertical-align:-2px}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){.spin{animation:none;border-top-color:#bfdbfe;border-right-color:#1d4ed8}}
.divider{height:1px;background:#e5e7eb;border:0;margin:0}
`

/** The page's side of the bridge: `call(name, input)` posts `{ id, call, input }` and resolves with the matching reply. */
const BRIDGE = `
let seq = 0; const pending = {};
function call(name, input) {
  return new Promise((resolve, reject) => {
    const id = String(++seq); pending[id] = { resolve, reject };
    parent.postMessage({ id, call: name, input: input ?? null }, '*');
  });
}
addEventListener('message', (event) => {
  if (event.source !== parent) return;
  const m = event.data || {}; const p = pending[m.id]; if (!p) return; delete pending[m.id];
  m.ok ? p.resolve(m.output) : p.reject(new Error(m.error || 'The extension did not answer.'));
});
// Design addition (not in contract v1): the page tells its frame how tall it is.
const tellHeight = () => parent.postMessage({ id: 'size', call: 'resize', input: { height: Math.ceil(document.documentElement.getBoundingClientRect().height) } }, '*');
new ResizeObserver(tellHeight).observe(document.documentElement);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
`

const page = (css: string, body: string, script: string) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8">${CSP}<style>${BASE_CSS}${css}</style></head><body>${body}<script>${BRIDGE}${script}</script></body></html>`

// ---------------------------------------------------------------------------------------------------- Voice Input

export const VOICE_INPUT_PAGE = page(`
.facts{display:grid;grid-template-columns:max-content 1fr;column-gap:24px;row-gap:4px;margin:8px 0 0;font-size:14px}
.facts dt{color:#6b7280}
.facts dd{margin:0;color:#111827}
.lang{display:flex;align-items:center;gap:12px}
.lang select{width:240px}
`, `
<div class="stack">
  <div class="field">
    <label class="label" for="lang">Language</label>
    <div class="lang">
      <select id="lang" disabled>
        <option value="auto">Auto (English or Chinese)</option>
        <option value="en">English</option>
        <option value="zh">Chinese</option>
      </select>
      <span id="saved" class="hint" aria-live="polite"></span>
    </div>
    <p class="hint">Auto recognizes English and Chinese in each recording. Choose one language if Auto often guesses wrong.</p>
  </div>
  <div>
    <h3>Installed</h3>
    <dl class="facts" id="facts"><dt>Voice runtime</dt><dd>…</dd></dl>
  </div>
</div>
`, `
const lang = document.getElementById('lang'); const saved = document.getElementById('saved'); const facts = document.getElementById('facts');
call('getSettings').then((s) => {
  lang.value = s.language; lang.disabled = false;
  const i = s.installed;
  facts.innerHTML = i ? [['Voice runtime', i.runtime], ['Speech model', i.model], ['Engine', i.engine], ['Space used', i.size + ' · ' + i.folder]]
    .map(([k, v]) => '<dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd>').join('') : '<dt>Not installed</dt><dd></dd>';
});
lang.addEventListener('change', async () => {
  lang.disabled = true; saved.className = 'hint'; saved.textContent = 'Saving…';
  try { await call('setLanguage', { language: lang.value }); saved.className = 'ok'; saved.textContent = 'Saved'; }
  catch (e) { saved.className = 'error'; saved.textContent = e.message; }
  finally { lang.disabled = false; setTimeout(() => { if (saved.textContent === 'Saved') saved.textContent = ''; }, 2000); }
});
`)

// ---------------------------------------------------------------------------------------------------- Private Network

export const PRIVATE_NETWORK_PAGE = page(`
.choice{display:inline-flex;align-self:flex-start;gap:4px;padding:4px;background:#f3f4f6;border-radius:8px}
.choice label{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;font-size:14px;font-weight:500;color:#4b5563;cursor:pointer}
.choice input{position:absolute;opacity:0;pointer-events:none}
.choice label:has(input:checked){background:#fff;color:#111827;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.choice label:has(input:focus-visible){outline:2px solid #3b82f6;outline-offset:1px}
.wide{width:100%;max-width:420px}
.machine-me{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 16px;margin-top:6px}
.machine-me .name{font-weight:600}
table{width:100%;border-collapse:collapse;margin-top:8px;font-size:14px}
th{text-align:left;font-size:12px;font-weight:500;color:#6b7280;padding:0 12px 6px 0;border-bottom:1px solid #e5e7eb}
td{padding:8px 12px 8px 0;border-bottom:1px solid #f3f4f6;vertical-align:middle}
tr:last-child td{border-bottom:0}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;vertical-align:1px}
.on{background:#10b981}.off{background:#d1d5db}
.tag{display:inline-block;margin-left:6px;padding:0 6px;border-radius:4px;background:#f3f4f6;color:#4b5563;font-size:12px;line-height:18px}
.code{border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#f9fafb}
.code-top{display:flex;gap:16px;align-items:flex-start}
.qr{width:132px;height:132px;flex:none;border-radius:6px;background:#fff;border:1px solid #e5e7eb;padding:4px}
.warn{margin-top:8px;display:flex;gap:8px;align-items:flex-start;padding:8px 12px;border-radius:8px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;font-size:13px;line-height:18px}
.expiry{margin-top:8px;font-size:12px;color:#4b5563;font-variant-numeric:tabular-nums}
.expired .qr,.expired textarea{opacity:.35}
.code textarea{margin-top:12px;height:92px;background:#fff;color:#374151;word-break:break-all}
.waiting{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
@media (max-width:560px){.code-top{flex-direction:column}.col-addr,.col-account{display:none}}
`, `<div id="root" class="stack"><p class="muted"><span class="spin"></span> Loading…</p></div>`, `
const root = document.getElementById('root');
let state = null; let kind = 'tailscale'; let keyOpen = false; let error = ''; let codeError = ''; let code = null; let timer = null; let busy = '';
const NAMES = { tailscale: 'Tailscale', headscale: 'Headscale' };

function render() {
  if (!state) return;
  if (state.signingIn) {
    root.innerHTML = '<div class="waiting"><span class="spin"></span><span>Finish signing in to Tailscale in your browser. This page continues by itself.</span></div>'
      + '<div class="row"><button class="secondary" id="again">Open the sign-in page again</button><button class="link" id="cancel">Cancel</button></div>';
    on('cancel', () => act('cancelSignIn'));
    on('again', () => {});
    return;
  }
  if (!state.joined) return renderJoin();
  renderJoined();
}

function renderJoin() {
  root.innerHTML = '<div class="field"><h3>Join a private network</h3>'
    + '<p class="hint">This node joins as a machine of its own. Only AutoByteus uses the connection: nothing else on this computer changes and nothing is opened to the internet.</p></div>'
    + '<div class="field"><span class="label">Network</span><div class="choice" role="radiogroup" aria-label="Network">'
    + radio('tailscale', 'Tailscale account') + radio('headscale', 'My own Headscale server') + '</div></div>'
    + (kind === 'tailscale'
      ? '<div class="field">' + (keyOpen
          ? '<label class="label" for="key">Join key</label><div class="row"><input id="key" class="wide mono" autocomplete="off" spellcheck="false" placeholder="tskey-auth-…"><button class="primary" id="join"' + dis('join') + '>' + (busy === 'join' ? '<span class="spin"></span> Joining…' : 'Join') + '</button></div>'
            + '<p class="hint">Make a join key in the Tailscale admin console under Settings → Keys. Use a one-time key.</p><div><button class="link" id="nokey">Sign in instead</button></div>'
          : '<div class="row"><button class="primary" id="signin">Sign in with Tailscale</button><button class="link" id="usekey">Use a join key instead</button></div>'
            + '<p class="hint">Opens Tailscale’s sign-in page in your browser. Sign in with the account your other machines use.</p>')
        + '</div>'
      : '<div class="field"><label class="label" for="url">Server address</label><input id="url" class="wide" autocomplete="off" spellcheck="false" placeholder="https://headscale.example.com"></div>'
        + '<div class="field"><label class="label" for="key">Join key</label><div class="row"><input id="key" class="wide mono" autocomplete="off" spellcheck="false" placeholder="hskey-auth-…"><button class="primary" id="join"' + dis('join') + '>' + (busy === 'join' ? '<span class="spin"></span> Joining…' : 'Join') + '</button></div>'
        + '<p class="hint">On your server, run “headscale preauthkeys create --user &lt;you&gt;” and paste the key here.</p></div>')
    + (error ? '<p class="error" role="alert">' + esc(error) + '</p>' : '')
    + '<hr class="divider">'
    + '<div class="field"><h3>Or use a connection code</h3><p class="hint">Made on a node you already use, in its Private Network card under Add a machine. It joins this node to that private network and pairs the two nodes.</p>'
    + '<textarea id="code" class="mono" rows="3" spellcheck="false" placeholder="abpn_…" aria-label="Connection code"></textarea>'
    + '<div class="row"><button class="secondary" id="usecode"' + dis('code') + '>' + (busy === 'code' ? '<span class="spin"></span> Joining and pairing…' : 'Join and pair') + '</button></div>'
    + (codeError ? '<p class="error" role="alert">' + esc(codeError) + '</p>' : '') + '</div>';
  root.querySelectorAll('input[name=kind]').forEach((r) => r.addEventListener('change', () => { kind = r.value; error = ''; render(); }));
  on('signin', () => act('signIn'));
  on('usekey', () => { keyOpen = true; error = ''; render(); document.getElementById('key').focus(); });
  on('nokey', () => { keyOpen = false; error = ''; render(); });
  on('join', async () => {
    const key = document.getElementById('key').value; const url = document.getElementById('url')?.value || '';
    busy = 'join'; error = ''; render(); keep('key', key); keep('url', url);
    try { state = await call('joinWithKey', { network: kind, key, serverUrl: url }); } catch (e) { error = e.message; }
    busy = ''; render(); if (error) { keep('key', key); keep('url', url); }
  });
  on('usecode', async () => {
    const text = document.getElementById('code').value;
    busy = 'code'; codeError = ''; render(); keep('code', text);
    try { state = await call('useConnectionCode', { code: text }); } catch (e) { codeError = e.message; }
    busy = ''; render(); if (codeError) keep('code', text);
  });
}

function renderJoined() {
  const me = state.thisMachine;
  const rows = state.machines.map((m) => '<tr><td><span class="dot ' + (m.online ? 'on' : 'off') + '" aria-hidden="true"></span>' + esc(m.name)
    + (m.isThisMachine ? '<span class="tag">This machine</span>' : '') + '</td>'
    + '<td class="col-addr mono muted">' + esc(m.address) + '</td><td class="col-account muted">' + esc(m.accountLabel) + '</td>'
    + '<td class="muted">' + (m.online ? 'Online' : 'Offline') + '</td></tr>').join('');
  root.innerHTML = '<div><h3>This machine</h3><div class="machine-me"><span class="name">' + esc(me.name) + '</span><span class="mono muted">' + esc(me.address) + '</span>'
    + '<span class="muted">' + NAMES[state.network] + (state.network === 'headscale' && state.serverUrl ? ' (' + esc(state.serverUrl) + ')' : '') + ' · ' + esc(state.account) + '</span></div></div>'
    + '<div><h3>My machines <span class="muted" style="font-weight:400">' + state.machines.length + '</span></h3>'
    + '<table><thead><tr><th>Name</th><th class="col-addr">Private address</th><th class="col-account">Added by</th><th>State</th></tr></thead><tbody>' + rows + '</tbody></table>'
    + '<p class="hint" style="margin-top:8px">Every machine on your private network, AutoByteus or not. Your AutoByteus nodes among them are in Nodes, under Found on your private network.</p></div>'
    + '<hr class="divider">'
    + (code ? codeBlock() : '<div class="field"><h3>Add a machine</h3><p class="hint">Make a one-time code for a new machine. Pasted there, it joins your private network and pairs that node with this one, without addresses or a command line.</p>'
      + '<div style="margin-top:6px"><button class="primary" id="add"' + dis('add') + '>' + (busy === 'add' ? '<span class="spin"></span> Making a code…' : 'Add a machine') + '</button></div></div>');
  on('add', async () => { busy = 'add'; render(); try { code = await call('addMachine'); startTimer(); } finally { busy = ''; render(); } });
  on('copy', async () => { const b = document.getElementById('copy'); try { await navigator.clipboard.writeText(code.text); b.textContent = 'Copied'; } catch { document.getElementById('codetext').select(); b.textContent = 'Press ⌘C to copy'; } setTimeout(() => { if (document.getElementById('copy')) document.getElementById('copy').textContent = 'Copy code'; }, 2000); });
  on('done', () => { code = null; stopTimer(); render(); });
  on('again', async () => { busy = 'add'; render(); try { code = await call('addMachine'); startTimer(); } finally { busy = ''; render(); } });
}

function codeBlock() {
  const left = Math.max(0, code.expiresAt - Date.now()); const expired = left === 0;
  const mm = Math.floor(left / 60000); const ss = String(Math.floor(left / 1000) % 60).padStart(2, '0');
  return '<div class="code' + (expired ? ' expired' : '') + '" aria-labelledby="codeh"><div class="code-top"><img class="qr" alt="QR code of the connection code" src="' + code.qr + '">'
    + '<div><h3 id="codeh">Connection code</h3><p class="hint" style="margin-top:4px;font-size:13px;line-height:18px;color:#4b5563">Paste it on the new machine: on its first-run page, or in its Private Network card. It joins your private network and pairs that node with this one.</p>'
    + '<p class="warn"><span aria-hidden="true">⚠</span><span>Treat it like a password. Anyone who has it can add a machine to your private network and pair it with this node. It works once.</span></p>'
    + '<p class="expiry" id="expiry" aria-live="off">' + (expired ? 'This code expired.' : 'Expires in ' + mm + ':' + ss) + '</p></div></div>'
    + '<textarea id="codetext" class="mono" readonly aria-label="Connection code"' + (expired ? ' disabled' : '') + '>' + esc(code.text) + '</textarea>'
    + '<div class="row" style="margin-top:12px">' + (expired ? '<button class="primary" id="again">Make a new code</button>' : '<button class="primary" id="copy">Copy code</button>')
    + '<button class="secondary" id="done">Done</button></div></div>';
}
function startTimer() { stopTimer(); timer = setInterval(() => { const el = document.getElementById('expiry'); if (!el || !code) return stopTimer(); const left = code.expiresAt - Date.now(); if (left <= 0) { stopTimer(); render(); return; } el.textContent = 'Expires in ' + Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0'); }, 1000); }
function stopTimer() { if (timer) clearInterval(timer); timer = null; }

function radio(value, label) { return '<label><input type="radio" name="kind" value="' + value + '"' + (kind === value ? ' checked' : '') + '>' + label + '</label>'; }
function dis(what) { return busy === what ? ' disabled' : ''; }
function on(id, fn) { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); }
function keep(id, value) { const el = document.getElementById(id); if (el) el.value = value; }
async function act(name) { const pendingCall = call(name); state = { ...state, signingIn: name === 'signIn' }; render(); state = await pendingCall; render(); }

call('getState').then((s) => { state = s; render(); });
`)

export const EXTENSION_PAGES: Record<string, string> = {
  'voice-input': VOICE_INPUT_PAGE,
  'private-network': PRIVATE_NETWORK_PAGE,
}
