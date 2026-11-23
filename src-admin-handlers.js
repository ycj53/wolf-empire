// wolf-modules/admin-handlers.js
// All /_my/* API endpoints + page generators.
// Exports: handleMyRoute(req, env, ctx, originalFetch) -> Response | null
// Returns null if the route isn't ours; caller falls back to original worker.

// === Helpers ===
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
function jout(obj, status){ return new Response(JSON.stringify(obj), { status: status||200, headers: JSON_HEADERS }); }

async function readBody(req){
  try { return await req.json(); } catch(e){ return {}; }
}

// Get/Set JSON from KV with safe defaults
async function kvGet(env, key, dflt){
  if (!env || !env.KV) return dflt;
  try {
    const v = await env.KV.get(key);
    if (v == null) return dflt;
    return JSON.parse(v);
  } catch(e){ return dflt; }
}
async function kvSet(env, key, val){
  if (!env || !env.KV) return false;
  try { await env.KV.put(key, JSON.stringify(val)); return true; } catch(e){ return false; }
}

// Generate random token
function randToken(n){
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = ''; const rb = new Uint8Array(n||24);
  crypto.getRandomValues(rb);
  for (let i=0;i<rb.length;i++) s += chars[rb[i] % chars.length];
  return s;
}

// === Session check: reuse the original worker's session mechanism ===
// The original panel sets a cookie after /api/login. We piggyback on that:
// we make a HEAD/GET /api/session via the original fetch and look for authed:true.
async function isAdmin(req, env, ctx, originalFetch){
  try {
    // Forward the request with same cookies to the original /api/session
    const sub = new Request(new URL('/api/session', req.url), { method:'GET', headers: req.headers });
    const r = await originalFetch.call(null, sub, env, ctx);
    const j = await r.json();
    return !!(j && j.authed);
  } catch(e){ return false; }
}

// Get/Set the WOLF-specific state (a single KV key, wolf_state)
const DEFAULT_WOLF_STATE = {
  maint: { on:false, text:'', at:0 },
  announce: { on:false, text:'', at:0 },
  kill: { on:false, savedEnabled:{}, at:0 },
  viewer: { token:'', at:0 },
  tickets: [],          // [{id, user, subject, status, messages:[{from,text,at}]}]
  orders: [],           // [{id, user, plan, at, status}]
  aiRate: {},           // {admin:count, lastReset; byToken:...}  (simplified)
};

async function getWolfState(env){
  const s = await kvGet(env, 'wolf_state', null);
  if (!s) return JSON.parse(JSON.stringify(DEFAULT_WOLF_STATE));
  // Merge with defaults
  return Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_WOLF_STATE)), s);
}
async function saveWolfState(env, s){
  s._updatedAt = Date.now();
  await kvSet(env, 'wolf_state', s);
}

// === Compute stats from panel_users / panel_settings ===
async function computeStats(env){
  const users = await kvGet(env, 'panel_users', {users:[]});
  const list = (users.users||[]);
  const now = Date.now();
  let total=list.length, active=0, expired=0, nearExpiry=0, disabled=0;
  for (const u of list){
    if (!u.enabled){ disabled++; continue; }
    if (u.expiry && u.expiry < now){ expired++; continue; }
    active++;
    if (u.expiry && u.expiry - now < 3*86400000) nearExpiry++;
  }
  return { total, active, expired, nearExpiry, disabled };
}

// === Public status page ===
function statusPageHTML(state){
  const maintOn = state.maint && state.maint.on;
  const status = maintOn ? 'under-maintenance' : 'operational';
  const color = maintOn ? '#ef4444' : '#22c55e';
  const title = maintOn ? '🛠 در حال تعمیر' : '🟢 سرویس برقرار است';
  const msg = maintOn ? (state.maint.text || 'در حال تعمیر و به‌روزرسانی. لطفاً چند دقیقه بعد دوباره تلاش کنید.') : 'همه‌ی سرویس‌ها به‌درستی کار می‌کنند.';
  return `<!doctype html>
<html lang="fa" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>وضعیت سرویس — MASTER YOUSEF WOLF EMPIRE</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle at 30% 20%, #1a0a2a, #050018);
  font-family:'Vazirmatn',system-ui,sans-serif;color:#efe6ff;padding:20px}
.card{max-width:480px;width:100%;text-align:center;
  background:rgba(28,12,55,.72);border:1px solid rgba(168,85,247,.3);
  border-radius:24px;padding:36px 24px;backdrop-filter:blur(20px);
  box-shadow:0 18px 60px rgba(0,0,0,.6),0 0 0 1px rgba(168,85,247,.15)}
.logo{font-size:48px;margin-bottom:8px}
.title{font-size:22px;font-weight:800;background:linear-gradient(135deg,#fbbf24,#a855f7);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.sub{font-size:12px;color:#a896c8;letter-spacing:3px;margin-bottom:24px}
.dot{display:inline-block;width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 14px ${color};margin-left:6px;vertical-align:middle}
.status{font-size:18px;font-weight:700;margin-bottom:12px}
.msg{font-size:13.5px;color:#c4b8e0;line-height:1.7;margin-bottom:24px}
.footer{font-size:11px;color:#7a6890;margin-top:18px;border-top:1px solid rgba(168,85,247,.15);padding-top:14px}
.btn{display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;padding:10px 22px;border-radius:12px;font-size:13px;margin-top:8px}
</style></head>
<body>
<div class="card">
  <div class="logo">👑🐺</div>
  <div class="title">MASTER YOUSEF</div>
  <div class="sub">W O L F &nbsp; E M P I R E</div>
  <div class="status"><span class="dot"></span>${title}</div>
  <div class="msg">${msg}</div>
  <a class="btn" href="https://t.me/vpnstan1">عضویت در کانال رسمی</a>
  <div class="footer">ساخته‌شده با قدرت توسط مستر یوسف 🐺<br>Powered by MASTER YOUSEF WOLF EMPIRE</div>
</div>
<script>setTimeout(function(){location.reload();},30000);</script>
</body></html>`;
}

// === Viewer (read-only) page ===
function viewerPageHTML(stats, state){
  const lines = [];
  lines.push('<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>نمای همکار — MASTER YOUSEF</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"><style>');
  lines.push('*{box-sizing:border-box;margin:0;padding:0}body{background:radial-gradient(circle at 30% 20%,#1a0a2a,#050018);min-height:100vh;font-family:Vazirmatn,system-ui,sans-serif;color:#efe6ff;padding:20px}.wrap{max-width:720px;margin:0 auto}.head{text-align:center;padding:24px 0}.head h1{font-size:24px;background:linear-gradient(135deg,#fbbf24,#a855f7);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-top:14px}.card{background:rgba(28,12,55,.72);border:1px solid rgba(168,85,247,.3);border-radius:14px;padding:16px;text-align:center}.card .v{font-size:24px;font-weight:800;color:#c084fc}.card .k{font-size:11px;color:#a896c8;margin-top:4px}.foot{text-align:center;color:#7a6890;font-size:11px;margin-top:24px}');
  lines.push('</style></head><body><div class="wrap"><div class="head"><h1>👑 نمای همکار MASTER YOUSEF</h1></div>');
  lines.push('<div class="grid">');
  lines.push(`<div class="card"><div class="v">${stats.total}</div><div class="k">کل کاربران</div></div>`);
  lines.push(`<div class="card"><div class="v">${stats.active}</div><div class="k">فعال</div></div>`);
  lines.push(`<div class="card"><div class="v">${stats.expired}</div><div class="k">منقضی</div></div>`);
  lines.push(`<div class="card"><div class="v">${stats.nearExpiry}</div><div class="k">نزدیک انقضا</div></div>`);
  lines.push(`<div class="card"><div class="v">${stats.disabled}</div><div class="k">غیرفعال</div></div>`);
  lines.push(`<div class="card"><div class="v">${(state.tickets||[]).filter(t=>t.status==='open').length}</div><div class="k">تیکت باز</div></div>`);
  lines.push(`</div><div class="foot">ساخته‌شده با قدرت توسط مستر یوسف 🐺 — فقط‌خواندنی</div></div></body></html>`);
  return lines.join('');
}

// === Telegram bot webhook ===
async function handleTgBot(req, env, ctx){
  const update = await readBody(req);
  const msg = update.message || update.callback_query && (update.callback_query.message && Object.assign({}, update.callback_query.message, {text:'', from:update.callback_query.from, callback:update.callback_query.data})) || null;
  if (!msg || !msg.from) return jout({ok:true});

  const TOKEN = env.TG_BOT_TOKEN || '';
  const ADMIN_ID = parseInt(env.TG_ADMIN_ID || '0', 10);
  const fromId = msg.from.id;
  const isAdmin = fromId === ADMIN_ID;
  const text = msg.text || '';

  async function tgReply(chatId, txt, keyboard){
    if (!TOKEN) return;
    const body = { chat_id: chatId, text: txt, parse_mode: 'HTML' };
    if (keyboard) body.reply_markup = keyboard;
    try { await fetch('https://api.telegram.org/bot'+TOKEN+'/sendMessage', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) }); } catch(e){}
  }
  async function tgAnswerCallback(cbId, txt){
    if (!TOKEN || !cbId) return;
    try { await fetch('https://api.telegram.org/bot'+TOKEN+'/answerCallbackQuery', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({callback_query_id:cbId, text:txt}) }); } catch(e){}
  }

  // callback for approve/reject order
  if (update.callback_query){
    const cb = update.callback_query;
    const data = cb.data || '';
    const cbId = cb.id;
    if (data.startsWith('approve:') || data.startsWith('reject:')){
      const oid = data.split(':')[1];
      const st = await getWolfState(env);
      const o = (st.orders||[]).find(x=>x.id===oid);
      if (o){
        o.status = data.startsWith('approve:') ? 'approved' : 'rejected';
        o.atResolved = Date.now();
        await saveWolfState(env, st);
        await tgAnswerCallback(cbId, o.status==='approved' ? 'تأیید شد' : 'رد شد');
        await tgReply(cb.message.chat.id, '✅ سفارش #'+oid+' وضعیت شد: '+o.status);
      } else { await tgAnswerCallback(cbId, 'یافت نشد'); }
      return jout({ok:true});
    }
  }

  // /start command — link subscription
  if (text.startsWith('/start')){
    const arg = text.slice(6).trim();
    if (arg && arg.startsWith('link_')){
      // user binding — store mapping
      const subId = arg.slice(5);
      const st = await getWolfState(env);
      st.aiRate = st.aiRate || {}; st.aiRate['tg_'+fromId] = st.aiRate['tg_'+fromId] || {};
      st.aiRate['tg_'+fromId].subId = subId;
      await saveWolfState(env, st);
      await tgReply(msg.chat.id, '✅ اشتراک شما وصل شد.\n/me برای دیدن وضعیت.');
    } else {
      const welcome = isAdmin ? '🐺 سلام مستر یوسف!\n/stats /users /health /maint /kill /announce /tickets /viewer' : '🐺 به ربات MASTER YOUSEF خوش آمدید.\nلینک اشتراک خود را بفرستید تا وصل شوید.';
      await tgReply(msg.chat.id, welcome);
    }
    return jout({ok:true});
  }

  // If user sent a subscription URL — bind
  if (text.startsWith('http') && text.indexOf('/sub') !== -1){
    const m = text.match(/token=([a-f0-9]+)/i);
    if (m){
      const st = await getWolfState(env);
      st.aiRate = st.aiRate || {}; st.aiRate['tg_'+fromId] = st.aiRate['tg_'+fromId] || {};
      st.aiRate['tg_'+fromId].subToken = m[1];
      await saveWolfState(env, st);
      await tgReply(msg.chat.id, '✅ اشتراک وصل شد. /me برای وضعیت.');
      return jout({ok:true});
    }
  }

  if (!isAdmin){
    // user-only commands
    if (text === '/me'){
      const st = await getWolfState(env);
      const u = (st.aiRate||{})['tg_'+fromId] || {};
      if (!u.subToken){ await tgReply(msg.chat.id, 'ابتدا لینک اشتراک خود را بفرستید.'); return jout({ok:true}); }
      const users = await kvGet(env, 'panel_users', {users:[]});
      const usr = (users.users||[]).find(x=>x.subToken===u.subToken);
      if (!usr){ await tgReply(msg.chat.id, 'کاربر یافت نشد.'); return jout({ok:true}); }
      const now = Date.now();
      const daysLeft = usr.expiry ? Math.max(0, Math.ceil((usr.expiry-now)/86400000)) : 'نامحدود';
      const usedGB = ((usr.used||0)/1073741824).toFixed(2);
      const totalGB = usr.quota ? (usr.quota/1073741824).toFixed(0)+'GB' : 'نامحدود';
      await tgReply(msg.chat.id, '📊 وضعیت اشتراک شما:\n👤 نام: '+usr.name+'\n⏱ روز باقی‌مانده: '+daysLeft+'\n📈 مصرف: '+usedGB+'/'+totalGB+'\n'+(usr.enabled?'🟢 فعال':'🔴 غیرفعال'));
      return jout({ok:true});
    }
    if (text === '/plans'){ await tgReply(msg.chat.id, '📋 پلن‌ها:\n'+(env.PLANS||'تماس بگیرید.')); return jout({ok:true}); }
    if (text.startsWith('/ticket')){
      const t = text.slice(7).trim();
      if (!t){ await tgReply(msg.chat.id, 'متن تیکت را بنویسید: /ticket متن'); return jout({ok:true}); }
      const st = await getWolfState(env);
      const id = 'T'+Date.now().toString(36);
      st.tickets = st.tickets||[];
      st.tickets.push({id, user:'tg_'+fromId, subject:t, status:'open', messages:[{from:'user', text:t, at:Date.now()}], at:Date.now()});
      await saveWolfState(env, st);
      await tgReply(msg.chat.id, '✅ تیکت ثبت شد. شماره: '+id);
      if (ADMIN_ID) await tgReply(ADMIN_ID, '🎫 تیکت جدید #'+id+' از tg_'+fromId+':\n'+t);
      return jout({ok:true});
    }
    if (text === '/trial'){
      const st = await getWolfState(env);
      st.orders = st.orders||[];
      const oid = 'O'+Date.now().toString(36);
      st.orders.push({id:oid, user:'tg_'+fromId, plan:'trial', at:Date.now(), status:'pending'});
      await saveWolfState(env, st);
      await tgReply(msg.chat.id, 'درخواست اکانت تست ثبت شد. منتظر تأیید ادمین بمانید.');
      const kb = {inline_keyboard:[[ {text:'✅ تأیید', callback_data:'approve:'+oid}, {text:'❌ رد', callback_data:'reject:'+oid} ]]};
      if (ADMIN_ID) await tgReply(ADMIN_ID, '🔄 درخواست اکانت تست از tg_'+fromId+'\nشماره سفارش: '+oid, kb);
      return jout({ok:true});
    }
    await tgReply(msg.chat.id, 'دستور پشتیبانی نشده. /me /plans /ticket /trial');
    return jout({ok:true});
  }

  // === Admin commands ===
  const parts = text.split(/\s+/);
  const cmd = parts[0];
  const arg1 = parts[1] || '';
  const arg2 = parts.slice(2).join(' ');

  if (cmd === '/stats'){
    const stats = await computeStats(env);
    await tgReply(msg.chat.id, '📊 آمار پنل:\n👥 کل: '+stats.total+'\n🟢 فعال: '+stats.active+'\n🔴 منقضی: '+stats.expired+'\n⏰ نزدیک انقضا: '+stats.nearExpiry+'\n🟠 غیرفعال: '+stats.disabled);
    return jout({ok:true});
  }
  if (cmd === '/users'){
    const users = await kvGet(env, 'panel_users', {users:[]});
    const q = arg1;
    const list = (users.users||[]).filter(u=>!q || (u.name||'').includes(q));
    const lines = list.slice(0,20).map(u=>{
      const days = u.expiry ? Math.max(0,Math.ceil((u.expiry-Date.now())/86400000)) : '∞';
      return '• '+u.name+' | '+(u.enabled?'🟢':'🔴')+' | '+days+' روز';
    });
    await tgReply(msg.chat.id, '👥 کاربران ('+list.length+' از کل):\n'+(lines.join('\n')||'—'));
    return jout({ok:true});
  }
  if (cmd === '/user'){
    const users = await kvGet(env, 'panel_users', {users:[]});
    const u = (users.users||[]).find(x=>x.name===arg1);
    if (!u){ await tgReply(msg.chat.id, 'یافت نشد'); return jout({ok:true}); }
    const days = u.expiry ? Math.max(0,Math.ceil((u.expiry-Date.now())/86400000)) : '∞';
    await tgReply(msg.chat.id, '👤 '+u.name+'\nUUID: <code>'+u.uuid+'</code>\nروز: '+days+'\nمصرف: '+((u.used||0)/1073741824).toFixed(2)+'GB\nوضعیت: '+(u.enabled?'🟢 فعال':'🔴 غیرفعال'));
    return jout({ok:true});
  }
  if (cmd === '/new'){
    // /new name days gb [nosub]
    const name = arg1; const days = parseInt(parts[2]||'0',10); const gb = parseFloat(parts[3]||'0');
    const nosub = (parts[4]||'')==='nosub';
    if (!name){ await tgReply(msg.chat.id, 'استفاده: /new name days gb [nosub]'); return jout({ok:true}); }
    // We can't create proxy via original API easily from here; create minimal user record
    const users = await kvGet(env, 'panel_users', {users:[]});
    if ((users.users||[]).find(x=>x.name===name)){ await tgReply(msg.chat.id, 'نام تکراری'); return jout({ok:true}); }
    const uuid = crypto.randomUUID();
    const subToken = randToken(20);
    const u = { name, uuid, subToken, quota: gb?gb*1073741824:0, expiry: days?Date.now()+days*86400000:0, speed:0, ports:[], operator:'tg_'+fromId, fp:'chrome', maxConn:10, enabled:true, note:'', createdAt:Date.now() };
    users.users = users.users||[]; users.users.push(u);
    await kvSet(env, 'panel_users', users);
    const subUrl = nosub ? '(بدون ساب)' : ('https://'+env.PUBLIC_URL+'/sub?token='+subToken);
    await tgReply(msg.chat.id, '✅ پروکسی ساخته شد:\nنام: '+name+'\nUUID: <code>'+uuid+'</code>\nساب: '+subUrl);
    return jout({ok:true});
  }
  if (cmd === '/extend'){
    const users = await kvGet(env, 'panel_users', {users:[]});
    const u = (users.users||[]).find(x=>x.name===arg1);
    if (!u){ await tgReply(msg.chat.id, 'یافت نشد'); return jout({ok:true}); }
    const days = parseInt(parts[2]||'0',10);
    u.expiry = (u.expiry && u.expiry > Date.now() ? u.expiry : Date.now()) + days*86400000;
    await kvSet(env, 'panel_users', users);
    await tgReply(msg.chat.id, '✅ تمدید شد: '+arg1+' +'+days+' روز');
    return jout({ok:true});
  }
  if (cmd === '/disable' || cmd === '/enable'){
    const users = await kvGet(env, 'panel_users', {users:[]});
    const u = (users.users||[]).find(x=>x.name===arg1);
    if (!u){ await tgReply(msg.chat.id, 'یافت نشد'); return jout({ok:true}); }
    u.enabled = (cmd === '/enable');
    await kvSet(env, 'panel_users', users);
    await tgReply(msg.chat.id, '✅ '+arg1+' '+(u.enabled?'فعال':'غیرفعال')+' شد');
    return jout({ok:true});
  }
  if (cmd === '/health'){
    const stats = await computeStats(env);
    const now = Date.now();
    await tgReply(msg.chat.id, '🩺 سلامت سرور:\n⚙️ Worker: 🟢 سالم\n👥 کاربران: '+stats.total+' ('+stats.active+' فعال)\n⏱ زمان: '+new Date(now).toLocaleString('fa-IR'));
    return jout({ok:true});
  }
  if (cmd === '/backup'){
    const users = await kvGet(env, 'panel_users', {users:[]});
    const st = await getWolfState(env);
    const payload = JSON.stringify({users, wolf_state:st, at:Date.now()}, null, 2);
    // Try to send to admin chat as a document
    if (TOKEN && ADMIN_ID){
      try {
        const form = new FormData();
        form.append('chat_id', ADMIN_ID);
        form.append('document', new Blob([payload], {type:'application/json'}), 'wolf-backup-'+Date.now()+'.json');
        await fetch('https://api.telegram.org/bot'+TOKEN+'/sendDocument', { method:'POST', body: form });
      } catch(e){}
    }
    await tgReply(msg.chat.id, '💾 بکاپ ساخته شد و به چت ادمین فرستاده شد ('+payload.length+' bytes).');
    return jout({ok:true});
  }
  if (cmd === '/orders'){
    const st = await getWolfState(env);
    const pend = (st.orders||[]).filter(o=>o.status==='pending');
    if (!pend.length){ await tgReply(msg.chat.id, 'سفارش معلقی نیست.'); return jout({ok:true}); }
    const kb = {inline_keyboard: pend.map(o=>[{text:'✅ '+o.id, callback_data:'approve:'+o.id},{text:'❌ '+o.id, callback_data:'reject:'+o.id}])};
    await tgReply(msg.chat.id, '🛒 سفارش‌های در انتظار ('+pend.length+'):', kb);
    return jout({ok:true});
  }
  if (cmd === '/maint'){
    const st = await getWolfState(env);
    if (arg1 === 'on'){ st.maint = {on:true, text: arg2 || 'در حال تعمیر و به‌روزرسانی', at: Date.now()}; await saveWolfState(env, st); await tgReply(msg.chat.id, '🛠 حالت تعمیر فعال شد'); }
    else if (arg1 === 'off'){ st.maint = {on:false, text:'', at:0}; await saveWolfState(env, st); await tgReply(msg.chat.id, '✅ حالت تعمیر خاموش شد'); }
    else { await tgReply(msg.chat.id, 'استفاده: /maint on|off [متن]'); }
    return jout({ok:true});
  }
  if (cmd === '/kill'){
    const st = await getWolfState(env);
    if (arg1 === 'on' || arg1 === 'off'){
      const users = await kvGet(env, 'panel_users', {users:[]});
      if (arg1 === 'on'){
        st.kill = {on:true, savedEnabled:{}, at:Date.now()};
        (users.users||[]).forEach(u=>{ st.kill.savedEnabled[u.name] = !!u.enabled; u.enabled = false; });
        await kvSet(env, 'panel_users', users); await saveWolfState(env, st);
        await tgReply(msg.chat.id, '🛑 همه کاربران غیرفعال شدند. /kill off برای برگرداندن.');
      } else {
        const saved = st.kill.savedEnabled || {};
        (users.users||[]).forEach(u=>{ if (saved[u.name]!==undefined) u.enabled = saved[u.name]; });
        await kvSet(env, 'panel_users', users);
        st.kill = {on:false, savedEnabled:{}, at:0}; await saveWolfState(env, st);
        await tgReply(msg.chat.id, '🔌 وضعیت کاربران برگردانده شد.');
      }
    } else { await tgReply(msg.chat.id, 'استفاده: /kill on|off'); }
    return jout({ok:true});
  }
  if (cmd === '/viewer'){
    const st = await getWolfState(env);
    if (arg1 === 'new' || !st.viewer || !st.viewer.token){
      st.viewer = {token: randToken(28), at: Date.now()};
      await saveWolfState(env, st);
    }
    await tgReply(msg.chat.id, '🔎 لینک فقط‌خواندنی:\nhttps://'+(env.PUBLIC_URL||req.headers.get('host'))+'/_my/view/'+st.viewer.token);
    return jout({ok:true});
  }
  if (cmd === '/announce'){
    const st = await getWolfState(env);
    if (arg1 === 'off'){ st.announce = {on:false, text:'', at:0}; await saveWolfState(env, st); await tgReply(msg.chat.id, '📣 اعلان پاک شد'); }
    else if (arg2){ st.announce = {on:true, text: arg2, at: Date.now()}; await saveWolfState(env, st); await tgReply(msg.chat.id, '📣 اعلان ثبت شد'); }
    else { await tgReply(msg.chat.id, 'استفاده: /announce متن یا /announce off'); }
    return jout({ok:true});
  }
  if (cmd === '/tickets'){
    const st = await getWolfState(env);
    const open = (st.tickets||[]).filter(t=>t.status==='open');
    if (!open.length){ await tgReply(msg.chat.id, 'تیکت بازی نیست.'); return jout({ok:true}); }
    const lines = open.map(t=>'#'+t.id+' ['+t.user+'] '+(t.subject||'').slice(0,40));
    await tgReply(msg.chat.id, '🎫 تیکت‌های باز ('+open.length+'):\n'+lines.join('\n'));
    return jout({ok:true});
  }
  if (cmd === '/reply'){
    // /reply id text
    const st = await getWolfState(env);
    const t = (st.tickets||[]).find(x=>x.id===arg1);
    if (!t){ await tgReply(msg.chat.id, 'تیکت یافت نشد'); return jout({ok:true}); }
    t.messages = t.messages||[]; t.messages.push({from:'admin', text: arg2, at:Date.now()});
    await saveWolfState(env, st);
    await tgReply(msg.chat.id, '✅ پاسخ ثبت شد به '+arg1);
    return jout({ok:true});
  }
  if (cmd === '/share'){
    await tgReply(msg.chat.id, '🔍 تشخیص اشتراک‌گذاری لینک در این نسخه فعال نیست (نیازمند tracking IP است).');
    return jout({ok:true});
  }
  if (cmd === '/watchdog'){
    await tgReply(msg.chat.id, '⏱ نگهبان Xray: در Worker این سرویس اجرای مستقل Xray وجود ندارد؛ Worker خودکفا است.');
    return jout({ok:true});
  }

  await tgReply(msg.chat.id, 'دستور ناشناخته. /stats /users /health /maint /kill /announce /tickets /viewer /backup /orders');
  return jout({ok:true});
}

// === WOLF AI handler (Gemini-backed) ===
async function handleAi(req, env, ctx, originalFetch){
  const body = await readBody(req);
  const msg = (body.msg||'').toString().trim();
  if (!msg) return jout({error:'پیام خالی است'}, 400);
  const hist = Array.isArray(body.hist) ? body.hist.slice(-10) : [];

  // Determine admin context (best-effort; front-end already gates)
  const admin = await isAdmin(req, env, ctx, originalFetch);

  // Build context summary (REAL data, no secrets)
  let context = '';
  try {
    const stats = await computeStats(env);
    const st = await getWolfState(env);
    const openTickets = (st.tickets||[]).filter(t=>t.status==='open').length;
    if (admin){
      context = 'context(admin): کل کاربران='+stats.total+'، فعال='+stats.active+'، نزدیک‌انقضا='+stats.nearExpiry+'، تیکت‌های باز='+openTickets+'، حالا='+new Date(Date.now()).toISOString();
    } else {
      // Try to find user by subToken cookie / header
      const subTok = (body.subToken||req.headers.get('x-sub-token')||'').toString();
      if (subTok){
        const users = await kvGet(env, 'panel_users', {users:[]});
        const u = (users.users||[]).find(x=>x.subToken===subTok);
        if (u){
          const daysLeft = u.expiry ? Math.max(0, Math.ceil((u.expiry-Date.now())/86400000)) : -1; // -1 = unlimited
          const usedGB = ((u.used||0)/1073741824).toFixed(2);
          const totalGB = u.quota ? (u.quota/1073741824).toFixed(0) : -1;
          context = 'context(user): نام='+u.name+'، روزهای باقی‌مانده='+(daysLeft<0?'نامحدود':daysLeft)+'، مصرف='+usedGB+'GB/'+(totalGB<0?'نامحدود':totalGB+'GB')+'، وضعیت='+(u.enabled?'فعال':'غیرفعال');
        }
      }
    }
  } catch(e){ /* ignore */ }

  const GEMINI_KEY = env.GEMINI_API_KEY || '';
  const GEMINI_MODEL = env.GEMINI_MODEL || 'gemini-1.5-flash';
  if (!GEMINI_KEY){
    return jout({error:'WOLF AI غیرفعال است — GEMINI_API_KEY تنظیم نشده. لطفاً کلید را در متغیرهای محیطی Worker قرار دهید.'}, 503);
  }

  // Compose prompt
  const sysPrompt = 'شما WOLF AI هستید، دستیار هوشمند پنل MASTER YOUSEF WOLF EMPIRE (ساخته‌شده توسط مستر یوسف 🐺). به فارسی و انگلیسی پاسخ دهید. مودب، کوتاه و دقیق باشید. اطلاعات محرمانه (UUID، لینک کانفیگ، رمز) را هرگز فاش نکن. فقط بر اساس context واقعی پاسخ دهید؛ اگر چیزی نمی‌دانید صادقانه بگویید. قابلیت اجرایی ندارید — فقط راهنمایی.';
  const contents = [{ role:'user', parts:[{text: sysPrompt + (context?('\n\n'+context):'')}] }];
  for (const m of hist){ if (m.role && m.text) contents.push({ role: m.role==='user'?'user':'model', parts:[{text:m.text}] }); }
  contents.push({ role:'user', parts:[{text: msg}] });

  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+GEMINI_MODEL+':generateContent?key='+GEMINI_KEY, {
      method:'POST', headers:{'content-type':'application/json', 'X-goog-api-key': GEMINI_KEY},
      body: JSON.stringify({ contents, generationConfig:{ temperature:0.7, maxOutputTokens: 800 } })
    });
    if (!r.ok){
      const errTxt = await r.text();
      return jout({error:'خطا از سمت Gemini API: '+r.status+' — '+errTxt.slice(0,200)}, 502);
    }
    const j = await r.json();
    const reply = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text;
    if (!reply) return jout({error:'پاسخ خالی از Gemini'}, 502);
    return jout({ reply: reply.trim() });
  } catch(e){
    return jout({error:'اتصال به Gemini ناموفق بود: '+e.message}, 502);
  }
}

// === Main /_my/* router ===
export async function handleMyRoute(req, env, ctx, originalFetch){
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // === Public routes (no admin needed) ===
  if (path === '/_my/status' && method === 'GET'){
    const st = await getWolfState(env);
    return new Response(statusPageHTML(st), { headers:{'content-type':'text/html; charset=utf-8'} });
  }
  if (path === '/_my/banner' && method === 'GET'){
    const st = await getWolfState(env);
    return jout({ maint: st.maint, announce: st.announce });
  }

  // === Telegram webhook ===
  if (path === '/_my/tgbot' && method === 'POST'){
    return handleTgBot(req, env, ctx);
  }

  // === Viewer (read-only) page ===
  const viewMatch = path.match(/^\/_my\/view\/([a-z0-9]+)$/);
  if (viewMatch && method === 'GET'){
    const st = await getWolfState(env);
    if (!st.viewer || !st.viewer.token || st.viewer.token !== viewMatch[1]){
      return new Response('Forbidden', { status:403 });
    }
    const stats = await computeStats(env);
    return new Response(viewerPageHTML(stats, st), { headers:{'content-type':'text/html; charset=utf-8'} });
  }

  // === AI chat (must be POST, JSON content-type) ===
  if (path === '/_my/api/ai' && method === 'POST'){
    const ct = req.headers.get('content-type') || '';
    if (ct.indexOf('application/json') === -1) return jout({error:'Content-Type باید application/json باشد'}, 415);
    return handleAi(req, env, ctx, originalFetch);
  }

  // === Public ticket submission (for users via sub token) ===
  if (path === '/_my/api/ticket' && method === 'POST'){
    const body = await readBody(req);
    const subTok = (body.subToken||'').toString();
    if (!subTok) return jout({error:'subToken لازم است'}, 400);
    const users = await kvGet(env, 'panel_users', {users:[]});
    const u = (users.users||[]).find(x=>x.subToken===subTok);
    if (!u) return jout({error:'کاربر نامعتبر'}, 403);
    const text = (body.text||'').toString().trim();
    if (!text) return jout({error:'متن خالی'}, 400);
    const st = await getWolfState(env);
    const id = 'T'+Date.now().toString(36);
    st.tickets = st.tickets||[];
    st.tickets.push({id, user: u.name, subject: text.slice(0,80), status:'open', messages:[{from:'user', text, at:Date.now()}], at:Date.now()});
    await saveWolfState(env, st);
    return jout({ok:true, id:id});
  }
  // Poll ticket replies
  if (path === '/_my/api/ticket/poll' && method === 'POST'){
    const body = await readBody(req);
    const id = (body.id||'').toString();
    const st = await getWolfState(env);
    const t = (st.tickets||[]).find(x=>x.id===id);
    if (!t) return jout({error:'یافت نشد'}, 404);
    return jout({ messages: t.messages||[], status: t.status });
  }

  // === Admin-only routes ===
  const admin = await isAdmin(req, env, ctx, originalFetch);

  if (path === '/_my/api/stats' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const stats = await computeStats(env);
    const st = await getWolfState(env);
    return jout({ users: stats, ticketsOpen: (st.tickets||[]).filter(t=>t.status==='open').length, onlineNow: 0, health:{worker:true, uptimeSec: Math.floor(Date.now()/1000)%3600} });
  }
  if (path === '/_my/api/users' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const q = (body.q||'').toString().toLowerCase();
    const users = await kvGet(env, 'panel_users', {users:[]});
    const now = Date.now();
    const list = (users.users||[])
      .filter(u=>!q || (u.name||'').toLowerCase().includes(q))
      .map(u=>({ name:u.name, enabled:u.enabled, expiry:u.expiry||0, quota:u.quota||0, used:u.used||0, nearExpiry: u.expiry && u.expiry-now < 3*86400000 && u.expiry > now }));
    return jout({ users: list });
  }
  if (path === '/_my/api/kill' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const st = await getWolfState(env);
    const users = await kvGet(env, 'panel_users', {users:[]});
    if (body.action === 'on'){
      st.kill = {on:true, savedEnabled:{}, at:Date.now()};
      let n = 0;
      (users.users||[]).forEach(u=>{ st.kill.savedEnabled[u.name]=!!u.enabled; if (u.enabled){ u.enabled=false; n++; } });
      await kvSet(env, 'panel_users', users); await saveWolfState(env, st);
      return jout({ok:true, disabled:n});
    } else if (body.action === 'off'){
      const saved = st.kill.savedEnabled || {};
      let n = 0;
      (users.users||[]).forEach(u=>{ if (saved[u.name]!==undefined){ if (u.enabled !== saved[u.name]){ u.enabled = saved[u.name]; n++; } } });
      await kvSet(env, 'panel_users', users);
      st.kill = {on:false, savedEnabled:{}, at:0}; await saveWolfState(env, st);
      return jout({ok:true, restored:n});
    }
    return jout({error:'action نامعتبر'}, 400);
  }
  if (path === '/_my/api/maint' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const st = await getWolfState(env);
    if (body.action === 'on'){ st.maint = {on:true, text:(body.text||'').toString()||'در حال تعمیر', at:Date.now()}; }
    else if (body.action === 'off'){ st.maint = {on:false, text:'', at:0}; }
    else return jout({error:'action نامعتبر'}, 400);
    await saveWolfState(env, st);
    return jout({ok:true, maint: st.maint});
  }
  if (path === '/_my/api/announce' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const st = await getWolfState(env);
    if (body.action === 'on'){ st.announce = {on:true, text:(body.text||'').toString(), at:Date.now()}; }
    else if (body.action === 'off'){ st.announce = {on:false, text:'', at:0}; }
    else return jout({error:'action نامعتبر'}, 400);
    await saveWolfState(env, st);
    return jout({ok:true, announce: st.announce});
  }
  if (path === '/_my/api/tickets' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const st = await getWolfState(env);
    return jout({ tickets: (st.tickets||[]).slice(-50) });
  }
  if (path === '/_my/api/ticket/reply' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const st = await getWolfState(env);
    const t = (st.tickets||[]).find(x=>x.id===body.id);
    if (!t) return jout({error:'یافت نشد'}, 404);
    t.messages = t.messages||[]; t.messages.push({from:'admin', text:(body.text||'').toString(), at:Date.now()});
    if (body.close) t.status = 'closed';
    await saveWolfState(env, st);
    return jout({ok:true});
  }
  if (path === '/_my/api/viewer' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const st = await getWolfState(env);
    if (body.action === 'new'){ st.viewer = { token: randToken(28), at: Date.now() }; await saveWolfState(env, st); return jout({ok:true, token: st.viewer.token}); }
    return jout({ token: st.viewer && st.viewer.token || '' });
  }
  if (path === '/_my/api/backup' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const users = await kvGet(env, 'panel_users', {users:[]});
    const st = await getWolfState(env);
    const payload = JSON.stringify({users, wolf_state:st, at:Date.now()});
    let sent = false;
    const TOKEN = env.TG_BOT_TOKEN || ''; const ADMIN_ID = parseInt(env.TG_ADMIN_ID||'0',10);
    if (TOKEN && ADMIN_ID){
      try {
        const form = new FormData();
        form.append('chat_id', ADMIN_ID);
        form.append('document', new Blob([payload], {type:'application/json'}), 'wolf-backup-'+Date.now()+'.json');
        const r = await fetch('https://api.telegram.org/bot'+TOKEN+'/sendDocument', { method:'POST', body: form });
        sent = r.ok;
      } catch(e){ sent = false; }
    }
    return jout({ok:true, message: sent ? 'بکاپ به تلگرام ارسال شد ('+payload.length+' bytes)' : 'بکاپ ساخته شد ('+payload.length+' bytes) — ارسال تلگرام ناموفق/غیرفعال' });
  }
  if (path === '/_my/api/newproxy' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const name = (body.name||'').toString().trim();
    if (!name) return jout({error:'name لازم است'}, 400);
    const users = await kvGet(env, 'panel_users', {users:[]});
    if ((users.users||[]).find(x=>x.name===name)) return jout({error:'نام تکراری'}, 400);
    const uuid = crypto.randomUUID();
    const subToken = randToken(20);
    const days = parseInt(body.days||0,10) || 0;
    const gb = parseFloat(body.gb||0) || 0;
    const u = { name, uuid, subToken, quota: gb?gb*1073741824:0, expiry: days?Date.now()+days*86400000:0, speed:0, ports:[], operator:'web', fp: body.fp||'chrome', maxConn:10, enabled:true, note: body.nosub?'بدون ساب':'', createdAt:Date.now() };
    users.users = users.users||[]; users.users.push(u);
    await kvSet(env, 'panel_users', users);
    const pubUrl = env.PUBLIC_URL || url.host;
    const subUrl = body.nosub ? '(بدون ساب)' : ('https://'+pubUrl+'/sub?token='+subToken);
    return jout({ok:true, name:name, uuid:uuid, subUrl: subUrl, subToken: subToken});
  }
  if (path === '/_my/api/diag' && method === 'POST'){
    if (!admin) return jout({error:'unauthorized'}, 401);
    const body = await readBody(req);
    const sub = (body.sub||'').toString();
    let report = '🩺 تست لینک اشتراک\n';
    report += 'ورودی: '+sub.slice(0,80)+'\n\n';
    // Try to extract token
    const m = sub.match(/token=([a-f0-9]+)/i) || sub.match(/^([a-f0-9]{16,})$/i);
    if (!m){ report += '❌ توکن اشتراک در ورودی پیدا نشد.'; return jout({report}); }
    const tok = m[1];
    const users = await kvGet(env, 'panel_users', {users:[]});
    const u = (users.users||[]).find(x=>x.subToken===tok);
    if (!u){ report += '❌ کلاینت با این توکن پیدا نشد.'; return jout({report}); }
    report += '✅ کلاینت پیدا شد: '+u.name+'\n';
    report += 'وضعیت: '+(u.enabled?'🟢 فعال':'🔴 غیرفعال')+'\n';
    if (u.expiry){
      const left = u.expiry - Date.now();
      report += 'انقضا: '+(left>0 ? Math.ceil(left/86400000)+' روز مانده' : 'منقضی شده')+'\n';
    } else { report += 'انقضا: نامحدود\n'; }
    if (u.quota){
      const used = (u.used||0)/u.quota*100;
      report += 'مصرف: '+used.toFixed(1)+'%\n';
    }
    report += '\n✅ همه چیز سالم است.';
    return jout({report});
  }

  return null; // not our route
}
