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
// The page tells its frame how tall it is (contract §5): no id, no reply.
const tellHeight = () => parent.postMessage({ resize: { height: Math.ceil(document.documentElement.getBoundingClientRect().height) } }, '*');
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
  facts.innerHTML = [['Voice runtime', s.runtimeVersion], ['Speech model', s.model], ['Folder', s.folder]]
    .map(([k, v]) => '<dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd>').join('');
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
.types{display:flex;flex-direction:column;gap:8px}
.type{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid #e5e7eb;border-radius:10px;cursor:pointer;background:#fff}
.type:hover{border-color:#cbd5e1}
.type:has(input:checked){border-color:#2563eb;background:#eff6ff;box-shadow:0 0 0 1px #2563eb inset}
.type:has(input:focus-visible){outline:2px solid #3b82f6;outline-offset:1px}
.type input{margin-top:3px;accent-color:#2563eb}
.type b{display:block;font-weight:600;color:#111827}
.type span{display:block;font-size:13px;line-height:18px;color:#6b7280;margin-top:1px}
.wide{width:100%;max-width:420px}
.port{width:96px}
.machine-me{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 16px;margin-top:6px}
.machine-me .name{font-weight:600}
table{width:100%;border-collapse:collapse;margin-top:8px;font-size:14px}
th{text-align:left;font-size:12px;font-weight:500;color:#6b7280;padding:0 12px 6px 0;border-bottom:1px solid #e5e7eb}
td{padding:8px 12px 8px 0;border-bottom:1px solid #f3f4f6;vertical-align:middle}
tr:last-child td{border-bottom:0}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;vertical-align:1px}
.on{background:#10b981}.off{background:#d1d5db}
.tag{display:inline-block;margin-left:6px;padding:0 6px;border-radius:4px;background:#f3f4f6;color:#4b5563;font-size:12px;line-height:18px}
.box{border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#f9fafb}
.code-top{display:flex;gap:16px;align-items:flex-start}
.qr{width:132px;height:132px;flex:none;border-radius:6px;background:#fff;border:1px solid #e5e7eb;padding:4px}
.warn{margin-top:8px;display:flex;gap:8px;align-items:flex-start;padding:8px 12px;border-radius:8px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;font-size:13px;line-height:18px}
.alert{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-radius:8px;background:#fffbeb;border:1px solid #fde68a;color:#78350f}
.alert b{color:#78350f}
.expiry{margin-top:8px;font-size:12px;color:#4b5563;font-variant-numeric:tabular-nums}
.expired .qr,.expired textarea{opacity:.35}
.box textarea{margin-top:12px;height:92px;background:#fff;color:#374151;word-break:break-all}
.waiting{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
.facts{display:grid;grid-template-columns:max-content 1fr;column-gap:24px;row-gap:6px;margin:8px 0 0;font-size:14px}
.facts dt{color:#6b7280}.facts dd{margin:0;color:#111827}
.steps{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:14px}
.steps li{display:flex;gap:10px;align-items:center}
.mark{width:16px;text-align:center;color:#9ca3af}
.mark.done{color:#059669}.mark.failed{color:#dc2626}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:6px;padding:4px 6px 4px 10px;border-radius:6px;background:#f3f4f6;font-size:13px}
.chip button{padding:2px 6px;font-size:12px;border:0;background:transparent;color:#6b7280}
.chip button:hover{color:#b91c1c}
.chip-large{background:#fef3c7;color:#78350f}
.danger{color:#b91c1c}
.danger-btn{background:#dc2626;color:#fff}
.danger-btn:hover:not(:disabled){background:#b91c1c}
ul.plain{margin:4px 0 0;padding-left:18px;font-size:13px;line-height:20px;color:#4b5563}
.ok-line{color:#047857}.bad-line{color:#b45309}
@media (max-width:560px){.code-top{flex-direction:column}.col-addr,.col-account{display:none}}
`, `<div id="root" class="stack"><p class="muted"><span class="spin"></span> Loading…</p></div>`, `
const root = document.getElementById('root');
let state = null; let choice = 'tailscale'; let tsMode = 'signin'; let hsMode = 'key'; let busy = ''; let error = '';
let code = null; let invite = null; let timer = null; let addOpen = false; let addError = ''; let apiOpen = false; let apiError = '';
let leaving = false; let rangeError = ''; let hostRun = null; let poll = null; let inviteOpen = false; let forWhom = 'me'; let inviteError = '';
const NAMES = { tailscale: 'Tailscale', headscale: 'Headscale', host: 'Hosted on this machine' };

function render() {
  if (!state) return;
  if (state.awaitingApproval || state.signingIn) startPoll(); else stopPoll();
  let html = '';
  if (state.awaitingApproval) html += approvalBlock();
  else if (state.signingIn) html += signingBlock();
  else if (!state.joined) html += joinBlock();
  else html += joinedBlock();
  if (!state.signingIn) html += '<hr class="divider">' + vpnBlock();
  if (state.joined && !state.signingIn) html += '<hr class="divider">' + leaveBlock();
  root.innerHTML = html;
  wire();
}

// ---------- joining
function approvalBlock() {
  return '<div class="waiting"><span class="spin"></span><span><b>Waiting for approval in your Tailscale admin console.</b><br>Your tailnet approves new machines by hand: an admin approves ' + esc(state.thisMachine.name) + ' under Machines. This page continues by itself.</span></div>';
}
function signingBlock() {
  return '<div class="waiting"><span class="spin"></span><span>Finish signing in to Tailscale in your browser. This page continues by itself.</span></div>'
    + '<div class="row"><button class="secondary" id="again">Open the sign-in page again</button><button class="link" id="cancel">Cancel</button></div>';
}
function typeCard(value, title, text) {
  return '<label class="type"><input type="radio" name="type" value="' + value + '"' + (choice === value ? ' checked' : '') + '><div><b>' + title + '</b><span>' + text + '</span></div></label>';
}
function joinBlock() {
  let body = '';
  if (choice === 'tailscale') {
    body = tsMode === 'key'
      ? '<div class="field"><label class="label" for="key">Auth key</label><div class="row"><input id="key" class="wide mono" autocomplete="off" spellcheck="false" placeholder="tskey-auth-…">' + btn('join', 'Join', 'Joining…') + '</div>'
        + '<p class="hint">Make a one-time key without tags in the Tailscale admin console under Settings → Keys. A machine joined with a tagged key belongs to the tag, not to you.</p><div><button class="link" id="tssignin">Sign in instead</button></div></div>'
      : '<div class="field"><div class="row"><button class="primary" id="signin">Sign in with Tailscale</button><button class="link" id="tskey">Use an auth key instead</button></div>'
        + '<p class="hint">Opens Tailscale’s sign-in page in your browser. Sign in with the account your other machines use.</p></div>';
  } else if (choice === 'headscale') {
    body = hsMode === 'invite'
      ? '<div class="field"><label class="label" for="invite">Invite code</label><div class="row"><input id="invite" class="wide mono" autocomplete="off" spellcheck="false" placeholder="abhi_…">' + btn('joininvite', 'Join', 'Joining…') + '</div>'
        + '<p class="hint">Made on the machine that hosts the network, under Invite someone. It works once, within 24 hours.</p><div><button class="link" id="hskey">Enter the server and a join key instead</button></div></div>'
      : '<div class="field"><label class="label" for="url">Server address</label><input id="url" class="wide" autocomplete="off" spellcheck="false" placeholder="https://headscale.example.com"></div>'
        + '<div class="field"><label class="label" for="key">Join key</label><div class="row"><input id="key" class="wide mono" autocomplete="off" spellcheck="false" placeholder="hskey-auth-…">' + btn('join', 'Join', 'Joining…') + '</div>'
        + '<p class="hint">On your server, run “headscale preauthkeys create --user &lt;you&gt;” and paste the key it prints. The key’s user decides who this machine belongs to: use your own.</p><div><button class="link" id="hsinvite">I have an invite code</button></div></div>';
  } else {
    body = hostForm();
  }
  return '<div class="field"><h3>Join a private network</h3>'
    + '<p class="hint">This node joins as a machine of its own. Only AutoByteus uses the connection: nothing else on this computer changes, and AutoByteus is never opened to the internet.</p></div>'
    + '<div class="types" role="radiogroup" aria-label="Network">'
    + typeCard('tailscale', 'Tailscale account', 'Use the Tailscale account your other machines are on.')
    + typeCard('headscale', 'My own Headscale server', 'A Headscale server you or your team run, or a network hosted on another of your machines.')
    + typeCard('host', 'Host a private network on this machine', 'This machine runs the network and your other machines join it. Needs an always-on machine with a public address.')
    + '</div>' + body + (error ? '<p class="error" role="alert">' + esc(error) + '</p>' : '');
}
function hostForm() {
  const steps = hostRun ? '<ol class="steps" aria-live="polite">' + hostRun.map((s) => '<li><span class="mark ' + s.status + '">' + (s.status === 'running' ? '<span class="spin"></span>' : s.status === 'done' ? '✓' : s.status === 'failed' ? '✕' : '○') + '</span>' + esc(s.text) + '</li>').join('') + '</ol>' : '';
  const failed = hostRun && hostRun.some((s) => s.status === 'failed');
  return '<div class="warn"><span aria-hidden="true">⚠</span><span>Use an always-on machine with a public address. A laptop sleeps and changes networks, so it makes a poor host. If this machine is off, nobody can join and changes wait; existing connections keep working for a while.</span></div>'
    + '<div class="row" style="align-items:flex-end;gap:12px"><div class="field" style="flex:1;min-width:220px;max-width:420px"><label class="label" for="domain">Domain name</label><input id="domain" autocomplete="off" spellcheck="false" placeholder="net.example.com"' + (hostRun ? ' disabled' : '') + '></div>'
    + '<div class="field"><label class="label" for="port">HTTPS port</label><input id="port" class="port" inputmode="numeric" value="443"' + (hostRun ? ' disabled' : '') + '></div></div>'
    + '<div><span class="label">Before you start</span><ul class="plain"><li>Point the domain to this machine’s public address.</li><li>At home, forward the HTTPS port on your router to this machine.</li><li>Only that port is public. AutoByteus and its agents are not.</li></ul></div>'
    + steps
    + '<div class="row">' + (failed ? '<button class="primary" id="hostcheck">Check again</button><button class="link" id="hostback">Change the domain</button>' : hostRun ? '' : '<button class="primary" id="host">Start hosting</button>') + '</div>';
}

// ---------- joined
function machineRow(m) {
  const who = m.account.startsWith('tag:') ? '<span class="tag">' + esc(m.account) + '</span>' : esc(m.accountLabel) + (m.shared ? ' <span class="tag">shared with you</span>' : '');
  return '<tr><td><span class="dot ' + (m.online ? 'on' : 'off') + '" aria-hidden="true"></span>' + esc(m.name) + (m.isThisMachine ? '<span class="tag">This machine</span>' : '') + '</td>'
    + '<td class="col-addr mono muted">' + esc(m.address) + '</td><td class="col-account muted">' + who + '</td><td class="muted">' + (m.online ? 'Online' : 'Offline') + '</td></tr>';
}
function joinedBlock() {
  const me = state.thisMachine; let html = '';
  if (state.signedOut) html += '<div class="alert" role="alert"><b>Signed out of Tailscale.</b><span>This machine’s key expired, so it cannot reach your other machines and they cannot reach it. To avoid this, turn off key expiry for this machine in the Tailscale admin console.</span><div><button class="primary" id="signin">Sign in again</button></div></div>';
  if (state.serverDown) html += '<div class="alert" role="alert"><b>Your Headscale server cannot be reached.</b><span>' + esc(state.serverUrl) + ' does not answer. Nobody can join or change anything; existing connections keep working for a while.</span></div>';
  if (state.network === 'host' && state.hosting) {
    const h = state.hosting;
    html += '<div><h3>Hosting</h3><dl class="facts"><dt>Address</dt><dd class="mono">https://' + esc(h.domain) + (h.port !== 443 ? ':' + h.port : '') + '</dd>'
      + '<dt>Certificate</dt><dd>Valid until ' + esc(new Date(h.certificateUntil).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })) + ', renewed by itself</dd>'
      + '<dt>From the internet</dt><dd>' + (h.reachable === false ? '<span class="bad-line">Not reachable on port ' + h.port + '</span>' : '<span class="ok-line">Reachable on port ' + h.port + '</span>') + ' <button class="link" id="reach">' + (busy === 'reach' ? 'Checking…' : 'Check again') + '</button></dd></dl>'
      + '<p class="hint" style="margin-top:8px">Only this port is public. If this machine is off, nobody can join and changes wait; existing connections keep working for a while.</p></div>';
  }
  html += '<div><h3>This machine</h3><div class="machine-me"><span class="name">' + esc(me.name) + '</span><span class="mono muted">' + esc(me.address) + '</span>'
    + '<span class="muted">' + NAMES[state.network] + (state.network === 'headscale' ? ' (' + esc(state.serverUrl) + ')' : '') + ' · ' + esc(state.account) + '</span></div></div>'
    + '<div><h3>My machines <span class="muted" style="font-weight:400">' + state.machines.length + '</span></h3>'
    + '<table><thead><tr><th>Name</th><th class="col-addr">Private address</th><th class="col-account">Added by</th><th>State</th></tr></thead><tbody>' + state.machines.map(machineRow).join('') + '</tbody></table>'
    + '<p class="hint" style="margin-top:8px">Every machine on your private network, AutoByteus or not. Your AutoByteus nodes among them are in Nodes, under Found on your private network.'
    + (state.network === 'tailscale' ? ' A machine added with a tagged key belongs to its tag and never counts as yours; a shared machine is someone else’s.' : '') + '</p></div>'
    + '<hr class="divider">' + (code ? codeBlock(code, 'code') : addMachineBlock());
  if (state.network === 'host') html += '<hr class="divider">' + (invite ? codeBlock(invite, 'invite') : inviteBlock());
  return html;
}
function ownUserNote() {
  return state.network === 'tailscale' ? '' : '<p class="hint" style="margin-top:2px">Made with your own user, ' + esc(state.account) + ': the key’s user decides whose machine it is, and this code makes you its owner.</p>';
}
function inviteBlock() {
  const lead = '<h3>Invite someone</h3><p class="hint">For a machine that already runs AutoByteus: an invite code joins it to this network, and it pairs afterwards from Nodes. Who the invite is for decides whose machine it is.</p>';
  if (!inviteOpen) return '<div class="field">' + lead + '<div style="margin-top:6px"><button class="secondary" id="inviteopen">Make an invite</button></div></div>';
  return '<div class="field">' + lead
    + '<div class="types" role="radiogroup" aria-label="Who the invite is for" style="margin-top:6px">'
    + '<label class="type"><input type="radio" name="forwhom" value="me"' + (forWhom === 'me' ? ' checked' : '') + '><div><b>For one of my machines</b><span>It joins as yours (' + esc(state.account) + ').</span></div></label>'
    + '<label class="type"><input type="radio" name="forwhom" value="teammate"' + (forWhom === 'teammate' ? ' checked' : '') + '><div><b>For a teammate</b><span>It joins under the teammate’s own name, so it is theirs: they pair with Connect and Allow and never get owner access.</span></div></label></div>'
    + (forWhom === 'teammate' ? '<label class="label" for="teammate" style="margin-top:6px">Teammate’s name</label><input id="teammate" class="mono" style="width:220px" autocomplete="off" spellcheck="false" placeholder="bob"><p class="hint">Becomes their own user on this network; it is created if it is new.</p>' : '')
    + '<div class="row" style="margin-top:6px">' + btn('mkinvite', 'Make the invite', 'Making an invite…') + '<button class="link" id="invitecancel">Cancel</button></div>'
    + (inviteError ? '<p class="error" role="alert">' + esc(inviteError) + '</p>' : '') + '</div>';
}
function addMachineBlock() {
  const lead = '<h3>Add a machine</h3><p class="hint">Make a one-time code for a new machine. Pasted on its first-run page, it joins your private network, pairs that node with this one and makes you its owner, without addresses or a command line.</p>';
  if (state.network === 'host' || (state.network === 'headscale' && state.apiKeyStored)) {
    return '<div class="field">' + lead + (state.network === 'headscale' ? '<p class="ok" style="margin-top:2px">This node makes join keys itself with the API key in its vault.</p>' : '') + ownUserNote() + '<div style="margin-top:6px">' + btn('add', 'Add a machine', 'Making a code…') + '</div>' + (addError ? '<p class="error" role="alert">' + esc(addError) + '</p>' : '') + '</div>';
  }
  if (apiOpen) {
    return '<div class="field">' + lead + '<label class="label" for="apikey" style="margin-top:6px">Headscale API key</label>'
      + '<p class="hint">On your server, run “headscale apikeys create” and paste the key. It is kept in this node’s vault and never shown again; this node then makes one-time join keys itself.</p>'
      + '<div class="row"><input id="apikey" type="password" class="wide mono" autocomplete="off" spellcheck="false">' + btn('storeapi', 'Store the key', 'Storing…') + '<button class="link" id="apicancel">Cancel</button></div>'
      + (apiError ? '<p class="error" role="alert">' + esc(apiError) + '</p>' : '') + '</div>';
  }
  if (!addOpen) return '<div class="field">' + lead + '<div style="margin-top:6px">' + btn('add', 'Add a machine', 'Making a code…') + '</div></div>';
  const how = state.network === 'tailscale'
    ? 'Create a one-time auth key without tags in your Tailscale admin console (Settings → Keys → Generate auth key) and paste it here. AutoByteus puts it into the connection code.'
    : 'On your server, run “headscale preauthkeys create --user ' + esc(state.account) + ' --expiration 10m” and paste the key it prints. Use your own user: the key’s user decides who the machine belongs to, and the code makes you its owner.';
  return '<div class="field">' + lead + '<p class="hint" style="font-size:13px;line-height:18px;color:#4b5563;margin-top:6px">' + how + '</p>'
    + '<label class="label" for="addkey" style="margin-top:6px">' + (state.network === 'tailscale' ? 'Auth key' : 'Join key') + '</label>'
    + '<div class="row"><input id="addkey" class="wide mono" autocomplete="off" spellcheck="false" placeholder="' + (state.network === 'tailscale' ? 'tskey-auth-…' : 'hskey-auth-…') + '">'
    + btn('makecode', 'Make the code', 'Making a code…') + '<button class="link" id="addcancel">Cancel</button></div>'
    + (addError ? '<p class="error" role="alert">' + esc(addError) + '</p>' : '')
    + (state.network === 'headscale' ? '<div style="margin-top:4px"><button class="link" id="apiopen">Let this node make keys itself instead</button></div>' : '') + '</div>';
}
function codeBlock(c, kind) {
  const left = Math.max(0, c.expiresAt - Date.now()); const expired = left === 0;
  const isInvite = kind === 'invite';
  return '<div class="box' + (expired ? ' expired' : '') + '"><div class="code-top"><img class="qr" alt="QR code of the ' + (isInvite ? 'invite' : 'connection code') + '" src="' + c.qr + '">'
    + '<div><h3>' + (isInvite ? (c.teammate ? 'Invite code for ' + esc(c.user) : 'Invite code for one of your machines') : 'Connection code') + '</h3><p class="hint" style="margin-top:4px;font-size:13px;line-height:18px;color:#4b5563">'
    + (isInvite ? 'Paste it in the other machine’s Private Network card, under My own Headscale server → I have an invite code. Machines that join with it are ' + (c.teammate ? esc(c.user) + '’s (a teammate): they pair with Connect and Allow.' : 'yours (' + esc(c.user) + '): pair them afterwards from Nodes.') : 'Paste it on the new machine’s first-run page (opened in a browser on that machine). It joins your private network, pairs that node with this one and makes you its owner.') + '</p>'
    + '<p class="warn"><span aria-hidden="true">⚠</span><span>Treat it like a password. Anyone who has it can add a machine to your private network' + (isInvite ? '' : ' and pair it with this node') + '. It works once.</span></p>'
    + '<p class="expiry" id="expiry-' + kind + '">' + (expired ? 'This ' + (isInvite ? 'invite' : 'code') + ' expired.' : expiryText(left)) + '</p></div></div>'
    + '<textarea id="text-' + kind + '" class="mono" readonly aria-label="' + (isInvite ? 'Invite code' : 'Connection code') + '"' + (expired ? ' disabled' : '') + (isInvite ? ' style="height:72px"' : '') + '>' + esc(c.text) + '</textarea>'
    + '<div class="row" style="margin-top:12px">' + (expired ? '<button class="primary" id="again-' + kind + '">Make a new one</button>' : '<button class="primary" id="copy-' + kind + '">Copy</button>')
    + '<button class="secondary" id="done-' + kind + '">Done</button></div></div>';
}
function expiryText(left) {
  if (left > 3600000) return 'Expires in ' + Math.round(left / 3600000) + ' hours';
  return 'Expires in ' + Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0');
}

// ---------- own VPN, leaving
function vpnBlock() {
  const chips = state.vpnRanges.length ? '<div class="chips">' + state.vpnRanges.map((r) => '<span class="chip mono' + (r.large ? ' chip-large' : '') + '">' + esc(r.range) + '<button data-range="' + esc(r.range) + '" aria-label="Stop accepting ' + esc(r.range) + '">Remove</button></span>').join('') + '</div>' : '';
  const large = state.vpnRanges.filter((r) => r.large).map((r) => r.range);
  return '<div class="field"><h3>Your own VPN</h3>'
    + '<p class="hint">If you run your own VPN (plain WireGuard or any other), this node can accept connections from its private address range, with or without a private network above. Your own VPN cannot find nodes or tell who is calling: add those nodes by address in Nodes and pair them with codes.</p>'
    + chips
    + '<div class="row"><input id="range" class="mono" style="width:200px" autocomplete="off" spellcheck="false" placeholder="10.8.0.0/24" aria-label="Private address range">' + btn('addrange', 'Accept range', 'Saving…', 'secondary') + '</div>'
    + (rangeError ? '<p class="error" role="alert">' + esc(rangeError) + '</p>' : '')
    + (large.length ? '<p class="warn"><span aria-hidden="true">⚠</span><span>' + esc(large.join(', ')) + (large.length > 1 ? ' are large ranges' : ' is a large range') + ': every machine in it can reach this node’s sign-in. Use your VPN’s own, smaller range if you can.</span></p>' : '')
    + '<p class="warn"><span aria-hidden="true">⚠</span><span>Every machine in the range can reach this node’s sign-in. Its data still needs a credential.</span></p></div>';
}
function leaveBlock() {
  const host = state.network === 'host';
  if (!leaving) return '<div><button class="link danger" id="leave">' + (host ? 'Stop hosting and end this private network' : 'Leave this private network') + '</button></div>';
  return '<div class="alert" role="alertdialog" aria-label="Leave"><b>' + (host ? 'End this private network for everyone?' : 'Leave this private network?') + '</b><span>'
    + (host ? 'Every machine on it loses the network, and nobody can join again. Pairings stay but cannot reach each other until the machines are on one network again and paired again.'
      : 'This machine is removed from the network. To use another one, join it and pair your nodes again: pairings belong to this network, and the old ones stay but cannot reach.') + '</span>'
    + (state.signedOut ? '<span>This machine is signed out, so it stays listed on the network until you remove it in your Tailscale admin console.</span>' : state.serverDown ? '<span>The server cannot be reached, so this machine stays listed on the network until you remove it on the Headscale server.</span>' : '')
    + '<div class="row"><button class="danger-btn" id="leaveyes"' + (busy === 'leave' ? ' disabled' : '') + '>' + (busy === 'leave' ? '<span class="spin"></span> ' : '') + (host ? 'End the network' : 'Leave') + '</button><button class="secondary" id="leaveno">Cancel</button></div></div>';
}

// ---------- events
function btn(id, label, busyLabel, cls) { return '<button class="' + (cls || 'primary') + '" id="' + id + '"' + (busy === id ? ' disabled' : '') + '>' + (busy === id ? '<span class="spin"></span> ' + busyLabel : label) + '</button>'; }
function on(id, fn) { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); }
function val(id) { return document.getElementById(id)?.value || ''; }
function keep(values) { for (const [id, v] of Object.entries(values)) { const el = document.getElementById(id); if (el) el.value = v; } }
async function run(id, fn, onError) {
  const values = Object.fromEntries([...root.querySelectorAll('input')].filter((i) => i.id).map((i) => [i.id, i.value]));
  busy = id; render(); keep(values);
  try { await fn(); } catch (e) { onError(e.message); }
  busy = ''; render(); keep(values);
}
function wire() {
  root.querySelectorAll('input[name=type]').forEach((r) => r.addEventListener('change', () => { choice = r.value; error = ''; hostRun = null; render(); }));
  on('signin', () => { const p = call('signIn'); state = { ...state, signingIn: true }; render(); p.then((s) => { state = s; render(); }); });
  on('cancel', async () => { state = await call('cancelSignIn'); render(); });
  on('tskey', () => { tsMode = 'key'; error = ''; render(); });
  on('tssignin', () => { tsMode = 'signin'; error = ''; render(); });
  on('hsinvite', () => { hsMode = 'invite'; error = ''; render(); });
  on('hskey', () => { hsMode = 'key'; error = ''; render(); });
  on('join', () => run('join', async () => { error = ''; state = await call('joinWithKey', { network: choice, key: val('key'), serverUrl: val('url') }); }, (m) => { error = m; }));
  on('joininvite', () => run('joininvite', async () => { error = ''; state = await call('joinWithInvite', { code: val('invite') }); }, (m) => { error = m; }));
  on('host', () => startHosting(val('domain'), Number(val('port')) || 443));
  on('hostcheck', () => continueHosting(2));
  on('hostback', () => { hostRun = null; error = ''; render(); });
  on('reach', () => run('reach', async () => { state = await call('checkReachable'); }, () => {}));
  on('add', () => { if (state.network === 'host' || state.apiKeyStored) return makeCode(''); addOpen = true; addError = ''; render(); document.getElementById('addkey')?.focus(); });
  on('makecode', () => makeCode(val('addkey')));
  on('addcancel', () => { addOpen = false; addError = ''; render(); });
  on('apiopen', () => { apiOpen = true; apiError = ''; render(); document.getElementById('apikey')?.focus(); });
  on('apicancel', () => { apiOpen = false; render(); });
  on('storeapi', () => run('storeapi', async () => { apiError = ''; state = await call('storeApiKey', { key: val('apikey') }); apiOpen = false; addOpen = false; }, (m) => { apiError = m; }));
  on('inviteopen', () => { inviteOpen = true; inviteError = ''; render(); });
  on('invitecancel', () => { inviteOpen = false; render(); });
  root.querySelectorAll('input[name=forwhom]').forEach((r) => r.addEventListener('change', () => { forWhom = r.value; inviteError = ''; render(); document.getElementById('teammate')?.focus(); }));
  on('mkinvite', () => run('mkinvite', async () => { inviteError = ''; invite = await call('makeInvite', { forWhom, teammate: val('teammate') }); inviteOpen = false; startTimer(); }, (m) => { inviteError = m; }));
  for (const kind of ['code', 'invite']) {
    on('copy-' + kind, async () => { const c = kind === 'code' ? code : invite; const b = document.getElementById('copy-' + kind); try { await navigator.clipboard.writeText(c.text); b.textContent = 'Copied'; } catch { document.getElementById('text-' + kind).select(); b.textContent = 'Press ⌘C to copy'; } setTimeout(() => { const el = document.getElementById('copy-' + kind); if (el) el.textContent = 'Copy'; }, 2000); });
    on('done-' + kind, () => { if (kind === 'code') code = null; else invite = null; render(); });
    on('again-' + kind, () => { if (kind === 'invite') { invite = null; inviteOpen = true; render(); } else { code = null; addOpen = state.network !== 'host' && !state.apiKeyStored; if (!addOpen) makeCode(''); else render(); } });
  }
  on('addrange', async () => { await run('addrange', async () => { rangeError = ''; state = await call('addRange', { range: val('range') }); }, (m) => { rangeError = m; }); if (!rangeError) keep({ range: '' }); });
  root.querySelectorAll('[data-range]').forEach((b) => b.addEventListener('click', async () => { state = await call('removeRange', { range: b.dataset.range }); render(); }));
  on('leave', () => { leaving = true; render(); });
  on('leaveno', () => { leaving = false; render(); });
  on('leaveyes', () => run('leave', async () => { state = await call('leave'); leaving = false; code = null; invite = null; addOpen = false; }, () => {}));
}
async function makeCode(joinKey) {
  await run('makecode', async () => { addError = ''; code = await call('addMachine', { joinKey }); addOpen = false; startTimer(); }, (m) => { addError = m; addOpen = true; });
  if (addError) keep({ addkey: joinKey });
}

// ---------- hosting steps (each a call to the extension, so the page shows them one by one)
async function startHosting(domain, port) {
  hostRun = [
    { step: 'server', text: 'Start the network server' },
    { step: 'certificate', text: 'Get a certificate for ' + (domain || 'the domain') },
    { step: 'reachable', text: 'Check that it is reachable from the internet on port ' + port },
    { step: 'join', text: 'Join this machine to its own network' },
  ].map((s) => ({ ...s, status: 'pending' }));
  hostRun.domain = domain; hostRun.port = port; error = '';
  await continueHosting(0);
}
async function continueHosting(from) {
  error = '';
  for (let i = from; i < hostRun.length; i += 1) {
    hostRun[i].status = 'running'; render(); keep({ domain: hostRun.domain, port: String(hostRun.port) });
    try { state = await call('hostStep', { step: hostRun[i].step, domain: hostRun.domain, port: hostRun.port }); hostRun[i].status = 'done'; }
    catch (e) { hostRun[i].status = 'failed'; error = e.message; if (i === 0) hostRun = null; render(); keep({ domain: hostRun?.domain || '', port: String(hostRun?.port || 443) }); return; }
  }
  hostRun = null; render();
}

function startTimer() { stopTimer(); timer = setInterval(() => {
  for (const [kind, c] of [['code', code], ['invite', invite]]) {
    const el = document.getElementById('expiry-' + kind); if (!el || !c) continue;
    const left = c.expiresAt - Date.now(); if (left <= 0) { render(); continue; } el.textContent = expiryText(left);
  }
}, 1000); }
function stopTimer() { if (timer) clearInterval(timer); timer = null; }
function startPoll() { if (poll) return; poll = setInterval(async () => { const s = await call('getState'); const changed = s.awaitingApproval !== state.awaitingApproval || s.joined !== state.joined || s.signingIn !== state.signingIn; state = s; if (changed) render(); }, 2000); }
function stopPoll() { if (poll) clearInterval(poll); poll = null; }

call('getState').then((s) => { state = s; if (s.joined) choice = s.network; render(); });
`)

export const EXTENSION_PAGES: Record<string, string> = {
  'voice-input': VOICE_INPUT_PAGE,
  'private-network': PRIVATE_NETWORK_PAGE,
}
