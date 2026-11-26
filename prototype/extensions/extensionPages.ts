/**
 * extensions-ui-516 (design only): the two extensions' own pages (`ui/index.html` of each package, extension-contract.md §2, §5).
 *
 * Written as an extension author would: one HTML page, its own styles, no network access (the CSP below and the frame's
 * sandbox), and calls only through the message bridge to its own extension's actions. AutoByteus sends the app's language
 * once when the page loads (`{ locale }`, contract §5, DEC-015); a page shows its texts in that language when it has them
 * (here: a zh-CN table per page). The styles follow AutoByteus's Settings look by hand, as a first-party extension would.
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
// The app's language, sent once by AutoByteus when the page loads (contract §5): the page shows its own texts in it.
let LOCALE = 'en'; let ZH = {}; let ZH_PATTERNS = [];
const tr = (text) => {
  const key = text.trim(); if (!key) return null;
  if (ZH[key]) return text.replace(key, ZH[key]);
  for (const [re, to] of ZH_PATTERNS) if (re.test(key)) return text.replace(key, key.replace(re, to));
  return null;
};
function localize(el) {
  if (LOCALE !== 'zh-CN') return;
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
  for (const n of nodes) { const v = tr(n.nodeValue); if (v !== null) n.nodeValue = v; }
  el.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach((e) => { for (const a of ['aria-label', 'alt', 'title']) { const v = e.getAttribute(a) && tr(e.getAttribute(a)); if (v) e.setAttribute(a, v); } });
}
new MutationObserver(() => localize(document.body)).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
addEventListener('message', (event) => {
  if (event.source !== parent || !event.data || typeof event.data.locale !== 'string') return;
  LOCALE = event.data.locale; document.documentElement.lang = LOCALE; localize(document.body);
});
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
ZH = { 'Language': '语言', 'Auto (English or Chinese)': '自动（英文或中文）', 'English': '英文', 'Chinese': '中文',
  'Auto recognizes English and Chinese in each recording. Choose one language if Auto often guesses wrong.': '自动会在每段录音中识别英文和中文。如果自动经常识别错误，请选择一种语言。',
  'Installed': '已安装', 'Voice runtime': '语音运行时', 'Speech model': '语音模型', 'Folder': '文件夹',
  'Saving…': '正在保存…', 'Saved': '已保存', 'Copy': '复制', 'Copied': '已复制', 'Press ⌘C to copy': '按 ⌘C 复制', 'Copy the folder path': '复制文件夹路径' };
const lang = document.getElementById('lang'); const saved = document.getElementById('saved'); const facts = document.getElementById('facts');
call('getSettings').then((s) => {
  lang.value = s.language; lang.disabled = false;
  // The folder with Copy (no Open folder: the contract has no folder action; DEC-015).
  facts.innerHTML = [['Voice runtime', esc(s.runtimeVersion)], ['Speech model', esc(s.model)],
    ['Folder', '<span class="mono" id="folder">' + esc(s.folder) + '</span> <button class="link" id="copyfolder" aria-label="Copy the folder path">Copy</button>']]
    .map(([k, v]) => '<dt>' + esc(k) + '</dt><dd>' + v + '</dd>').join('');
  document.getElementById('copyfolder').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(s.folder); b.textContent = 'Copied'; }
    catch { getSelection().selectAllChildren(document.getElementById('folder')); b.textContent = 'Press ⌘C to copy'; }
    setTimeout(() => { b.textContent = 'Copy'; }, 2000);
  });
});
lang.addEventListener('change', async () => {
  lang.disabled = true; saved.className = 'hint'; saved.textContent = 'Saving…';
  try { await call('setLanguage', { language: lang.value }); saved.className = 'ok'; saved.textContent = 'Saved'; }
  catch (e) { saved.className = 'error'; saved.textContent = e.message; }
  finally { lang.disabled = false; setTimeout(() => { if (saved.textContent === 'Saved') saved.textContent = ''; }, 2000); }
});
`)

// ---------------------------------------------------------------------------------------------------- Private Network
// private-network-661 (design, D-1): Tailscale only for now. No choice of network: Headscale, hosting a network and your own
// VPN are later stages and are not shown. Tailscale's own conditions are stated on the page (REQ-015, REQ-017).

export const PRIVATE_NETWORK_PAGE = page(`
.wide{width:100%;max-width:420px}
.machine-me{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 16px;margin-top:6px}
.machine-me .name{font-weight:600}
table{width:100%;border-collapse:collapse;margin-top:8px;font-size:14px}
th{text-align:left;font-size:12px;font-weight:500;color:#6b7280;padding:0 12px 6px 0;border-bottom:1px solid #e5e7eb}
td{padding:8px 12px 8px 0;border-bottom:1px solid #f3f4f6;vertical-align:middle}
tr:last-child td{border-bottom:0}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;vertical-align:1px}
.on{background:#10b981}.off{background:#d1d5db}.blocked{background:#f59e0b}
.tag{display:inline-block;margin-left:6px;padding:0 6px;border-radius:4px;background:#f3f4f6;color:#4b5563;font-size:12px;line-height:18px}
.state-blocked{color:#b45309}
.alert{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-radius:8px;background:#fffbeb;border:1px solid #fde68a;color:#78350f}
.alert b{color:#78350f}
.alert .row{margin-top:2px}
.retrying{display:flex;align-items:center;gap:8px;font-size:13px;color:#92400e}
.waiting{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
.danger{color:#b91c1c}
.danger-btn{background:#dc2626;color:#fff}
.danger-btn:hover:not(:disabled){background:#b91c1c}
@media (max-width:560px){.col-addr,.col-account{display:none}}
`, `<div id="root" class="stack"><p class="muted"><span class="spin"></span> Loading…</p></div>`, `
ZH = {
  'Loading…': '正在加载…', 'Waiting for approval in your Tailscale admin console.': '正在等待你在 Tailscale 管理控制台中批准。',
  'Finish signing in to Tailscale in your browser. This page continues by itself.': '请在浏览器中完成 Tailscale 登录。此页面会自动继续。',
  'Open the sign-in page again': '再次打开登录页面', 'Cancel': '取消', 'Auth key': '认证密钥', 'Join': '加入', 'Joining…': '正在加入…',
  'Make a one-time key without tags in the Tailscale admin console under Settings → Keys. A machine joined with a tagged key belongs to the tag, not to you.': '在 Tailscale 管理控制台的“Settings → Keys”中生成一个不带标签的一次性密钥。用带标签的密钥加入的机器属于该标签，而不属于你。',
  'Sign in instead': '改为登录', 'Sign in with Tailscale': '使用 Tailscale 登录', 'Use an auth key instead': '改用认证密钥',
  'Opens Tailscale’s sign-in page in your browser. Sign in with the account your other machines use.': '在浏览器中打开 Tailscale 的登录页面。请使用你其他机器所用的账号登录。',
  'Join your private network': '加入你的私有网络',
  'This node joins your tailnet as a machine of its own. Only AutoByteus uses the connection: nothing else on this computer changes, and AutoByteus is never opened to the internet.': '此节点作为一台独立的机器加入你的 tailnet。只有 AutoByteus 使用该连接：这台电脑上的其他内容不会改变，AutoByteus 也永远不会暴露到互联网。',
  'shared with you': '与你共享', 'This machine': '这台机器', 'Online': '在线', 'Offline': '离线', 'Blocked by access rules': '被访问规则阻止',
  'Your Tailscale sign-in expired.': '你的 Tailscale 登录已过期。', 'Signed out of Tailscale.': '已从 Tailscale 退出登录。', 'Sign in again': '重新登录',
  'Tailscale can’t be reached.': '无法连接 Tailscale。', 'This computer may be offline. Nodes already connected keep working for a while.': '这台电脑可能已离线。已连接的节点还能继续工作一段时间。',
  'Trying again…': '正在重试…', 'Your tailnet’s access rules block AutoByteus.': '你的 tailnet 访问规则阻止了 AutoByteus。',
  'My machines': '我的机器', 'Name': '名称', 'Private address': '私有地址', 'Added by': '添加者', 'State': '状态', 'you': '你',
  'Every machine on your private network, AutoByteus or not. Your AutoByteus nodes among them are in Manage Nodes. A machine added with a tagged key belongs to its tag and never counts as yours; a shared machine is someone else’s.': '你私有网络上的每一台机器，无论是否运行 AutoByteus。其中你的 AutoByteus 节点在“管理节点”中。用带标签的密钥添加的机器属于该标签，永远不算作你的；共享的机器属于别人。',
  'Leave this private network': '离开这个私有网络', 'Leave this private network?': '离开这个私有网络？', 'Leave': '离开',
  'Its pairings over the private network stop working. After it joins again, pair those nodes again.': '它通过私有网络建立的配对将停止工作。重新加入后，请重新配对这些节点。',
};
ZH_PATTERNS = [
  [/^Your tailnet approves new machines by hand: an admin approves (.+) under Machines\\. This page continues by itself\\.$/, '你的 tailnet 需要手动批准新机器：管理员需在“Machines”中批准 $1。此页面会自动继续。'],
  [/^(.+) can’t reach your other machines, and they can’t reach it\\. To keep it signed in, turn off key expiry for (.+) in the Tailscale admin console\\.$/, '$1 无法访问你的其他机器，其他机器也无法访问它。要让它保持登录，请在 Tailscale 管理控制台中为 $2 关闭密钥过期。'],
  [/^(.+) was signed out or removed in your Tailscale admin console, so it is not on your private network\\.$/, '$1 已在你的 Tailscale 管理控制台中被退出登录或移除，因此不在你的私有网络上。'],
  [/^(.+) (is|are) online, but this node can’t reach AutoByteus on (it|them)\\. In the Tailscale admin console, under Access controls, let your machines reach each other\\.$/, '$1 在线，但此节点无法访问其上的 AutoByteus。请在 Tailscale 管理控制台的“Access controls”中允许你的机器互相访问。'],
  [/^(.+) signs out of your tailnet\\.$/, '$1 将退出你的 tailnet。'],
  [/^It stays listed in your Tailscale admin console until you remove it there\\.$/, '它会一直列在你的 Tailscale 管理控制台中，直到你在那里移除它。'],
];
const root = document.getElementById('root');
let state = null; let tsMode = 'signin'; let busy = ''; let error = ''; let leaving = false; let poll = null;

function render() {
  if (!state) return;
  if (state.awaitingApproval || state.signingIn || state.unreachable) startPoll(); else stopPoll();
  let html = '';
  if (state.awaitingApproval) html += approvalBlock();
  else if (state.signingIn) html += signingBlock();
  else if (!state.joined) html += joinBlock();
  else html += joinedBlock() + '<hr class="divider">' + leaveBlock();
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
function joinBlock() {
  const body = tsMode === 'key'
    ? '<div class="field"><label class="label" for="key">Auth key</label><div class="row"><input id="key" class="wide mono" autocomplete="off" spellcheck="false" placeholder="tskey-auth-…">' + btn('join', 'Join', 'Joining…') + '</div>'
      + '<p class="hint">Make a one-time key without tags in the Tailscale admin console under Settings → Keys. A machine joined with a tagged key belongs to the tag, not to you.</p><div><button class="link" id="tssignin">Sign in instead</button></div></div>'
    : '<div class="field"><div class="row"><button class="primary" id="signin">Sign in with Tailscale</button><button class="link" id="tskey">Use an auth key instead</button></div>'
      + '<p class="hint">Opens Tailscale’s sign-in page in your browser. Sign in with the account your other machines use.</p></div>';
  return '<div class="field"><h3>Join your private network</h3>'
    + '<p class="hint">This node joins your tailnet as a machine of its own. Only AutoByteus uses the connection: nothing else on this computer changes, and AutoByteus is never opened to the internet.</p></div>'
    + body + (error ? '<p class="error" role="alert">' + esc(error) + '</p>' : '');
}

// ---------- joined
function condition() {
  const me = esc(state.thisMachine.name);
  if (state.expired) return '<div class="alert" role="alert"><b>Your Tailscale sign-in expired.</b><span>' + me + ' can’t reach your other machines, and they can’t reach it. To keep it signed in, turn off key expiry for ' + me + ' in the Tailscale admin console.</span><div class="row"><button class="primary" id="signin">Sign in again</button></div></div>';
  if (state.signedOut) return '<div class="alert" role="alert"><b>Signed out of Tailscale.</b><span>' + me + ' was signed out or removed in your Tailscale admin console, so it is not on your private network.</span><div class="row"><button class="primary" id="signin">Sign in again</button></div></div>';
  if (state.unreachable) return '<div class="alert" role="alert"><b>Tailscale can’t be reached.</b><span>This computer may be offline. Nodes already connected keep working for a while.</span><span class="retrying"><span class="spin"></span>Trying again…</span></div>';
  const blocked = state.machines.filter((m) => m.blocked && m.online).map((m) => m.name);
  if (blocked.length) return '<div class="alert" role="alert"><b>Your tailnet’s access rules block AutoByteus.</b><span>' + esc(blocked.join(', ')) + (blocked.length > 1 ? ' are' : ' is') + ' online, but this node can’t reach AutoByteus on ' + (blocked.length > 1 ? 'them' : 'it') + '. In the Tailscale admin console, under Access controls, let your machines reach each other.</span></div>';
  return '';
}
function machineRow(m) {
  const who = m.account.startsWith('tag:') ? '<span class="tag" style="margin-left:0">' + esc(m.account) + '</span>' : esc(m.accountLabel) + (m.shared ? ' <span class="tag"' + (m.accountLabel ? '' : ' style="margin-left:0"') + '>shared with you</span>' : '');
  const st = !m.online ? 'Offline' : m.blocked ? '<span class="state-blocked">Blocked by access rules</span>' : 'Online';
  return '<tr><td><span class="dot ' + (!m.online ? 'off' : m.blocked ? 'blocked' : 'on') + '" aria-hidden="true"></span>' + esc(m.name) + (m.isThisMachine ? '<span class="tag">This machine</span>' : '') + '</td>'
    + '<td class="col-addr mono muted">' + esc(m.address) + '</td><td class="col-account muted">' + who + '</td><td class="muted">' + st + '</td></tr>';
}
function joinedBlock() {
  const me = state.thisMachine;
  return condition()
    + '<div><h3>This machine</h3><div class="machine-me"><span class="name">' + esc(me.name) + '</span><span class="mono muted">' + esc(me.address) + '</span>'
    + '<span class="muted">Tailscale · ' + esc(state.account) + '</span></div></div>'
    // Signed out or expired: this machine is not on the network, so it has no list of machines to show.
    + (state.expired || state.signedOut ? '' : '<div><h3>My machines <span class="muted" style="font-weight:400">' + state.machines.length + '</span></h3>'
    + '<table><thead><tr><th>Name</th><th class="col-addr">Private address</th><th class="col-account">Added by</th><th>State</th></tr></thead><tbody>' + state.machines.map(machineRow).join('') + '</tbody></table>'
    + '<p class="hint" style="margin-top:8px">Every machine on your private network, AutoByteus or not. Your AutoByteus nodes among them are in Manage Nodes. A machine added with a tagged key belongs to its tag and never counts as yours; a shared machine is someone else’s.</p></div>');
}
function leaveBlock() {
  if (!leaving) return '<div><button class="link danger" id="leave">Leave this private network</button></div>';
  return '<div class="alert" role="alertdialog" aria-label="Leave"><b>Leave this private network?</b><span>' + esc(state.thisMachine.name) + ' signs out of your tailnet. Its pairings over the private network stop working. After it joins again, pair those nodes again.</span>'
    + (state.expired || state.signedOut || state.unreachable ? '<span>It stays listed in your Tailscale admin console until you remove it there.</span>' : '')
    + '<div class="row"><button class="danger-btn" id="leaveyes"' + (busy === 'leave' ? ' disabled' : '') + '>' + (busy === 'leave' ? '<span class="spin"></span> ' : '') + 'Leave</button><button class="secondary" id="leaveno">Cancel</button></div></div>';
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
  on('signin', () => { const p = call('signIn'); state = { ...state, signingIn: true }; render(); p.then((s) => { state = s; render(); }); });
  on('again', () => {});
  on('cancel', async () => { state = await call('cancelSignIn'); render(); });
  on('tskey', () => { tsMode = 'key'; error = ''; render(); });
  on('tssignin', () => { tsMode = 'signin'; error = ''; render(); });
  on('join', () => run('join', async () => { error = ''; state = await call('joinWithKey', { key: val('key') }); }, (m) => { error = m; }));
  on('leave', () => { leaving = true; render(); });
  on('leaveno', () => { leaving = false; render(); });
  on('leaveyes', () => run('leave', async () => { state = await call('leave'); leaving = false; }, () => {}));
}
function startPoll() { if (poll) return; poll = setInterval(async () => { const s = await call('getState'); const changed = s.awaitingApproval !== state.awaitingApproval || s.joined !== state.joined || s.signingIn !== state.signingIn || s.unreachable !== state.unreachable; state = s; if (changed) render(); }, 2000); }
function stopPoll() { if (poll) clearInterval(poll); poll = null; }

call('getState').then((s) => { state = s; render(); });
`)


export const EXTENSION_PAGES: Record<string, string> = {
  'voice-input': VOICE_INPUT_PAGE,
  'private-network': PRIVATE_NETWORK_PAGE,
}
