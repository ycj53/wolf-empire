// wolf-modules/brand-css.js
// Injected CSS + JS for WOLF EMPIRE branding, purple neon theme, day/night switch.
// This is plain string content; will be wrapped in <style>/<script> tags by the assembler.

export const WOLF_CSS = `
:root{
  --wolf-purple:#a855f7;
  --wolf-purple-bright:#c084fc;
  --wolf-purple-deep:#7c3aed;
  --wolf-purple-glow:rgba(168,85,247,.55);
  --wolf-gold:#fbbf24;
  --wolf-bg-dark:#0a0612;
  --wolf-bg-mid:#150a26;
  --wolf-bg-card:rgba(28,12,55,.72);
  --wolf-text:#efe6ff;
  --wolf-mut:#a896c8;
  --wolf-line:rgba(168,85,247,.18);
  --wolf-red:#ef4444;
  --wolf-green:#22c55e;
  --wolf-yellow:#facc15;
  --wolf-blue:#3b82f6;
  --wolf-pink:#ec4899;
}
html.wolf-day{
  --wolf-bg-dark:#f5f0ff;
  --wolf-bg-mid:#ede4ff;
  --wolf-bg-card:rgba(255,255,255,.85);
  --wolf-text:#1f1235;
  --wolf-mut:#5b4680;
  --wolf-line:rgba(124,58,237,.22);
  --wolf-purple-glow:rgba(168,85,247,.35);
}
html.wolf-red{ --wolf-purple:#ef4444; --wolf-purple-bright:#f87171; --wolf-purple-deep:#b91c1c; --wolf-purple-glow:rgba(239,68,68,.55); }
html.wolf-blue{ --wolf-purple:#3b82f6; --wolf-purple-bright:#60a5fa; --wolf-purple-deep:#1d4ed8; --wolf-purple-glow:rgba(59,130,246,.55); }
html.wolf-pink{ --wolf-purple:#ec4899; --wolf-purple-bright:#f472b6; --wolf-purple-deep:#be185d; --wolf-purple-glow:rgba(236,72,153,.55); }
html.wolf-green{ --wolf-purple:#22c55e; --wolf-purple-bright:#4ade80; --wolf-purple-deep:#15803d; --wolf-purple-glow:rgba(34,197,94,.55); }

/* === Top day/night switch === */
#wolfThemeSwitch{
  position:fixed; top:14px; left:14px; z-index:2147483646;
  width:42px; height:42px; border-radius:50%;
  background:linear-gradient(135deg, var(--wolf-purple-deep), var(--wolf-purple));
  color:#fff; border:1px solid var(--wolf-purple-glow);
  box-shadow:0 0 16px var(--wolf-purple-glow), inset 0 0 12px rgba(255,255,255,.15);
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  font-size:18px; transition:transform .3s ease, box-shadow .3s ease;
  -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px);
}
#wolfThemeSwitch:hover{ transform:scale(1.08); box-shadow:0 0 22px var(--wolf-purple-glow); }

/* === Color picker === */
#wolfColorPicker{
  position:fixed; top:64px; left:14px; z-index:2147483646;
  display:flex; flex-direction:column; gap:8px;
  background:var(--wolf-bg-card); padding:10px 8px; border-radius:14px;
  border:1px solid var(--wolf-line); box-shadow:0 8px 24px rgba(0,0,0,.4);
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
  transform:translateX(-90px); opacity:0; pointer-events:none;
  transition:transform .3s ease, opacity .3s ease;
}
#wolfColorPicker.wolf-show{ transform:translateX(0); opacity:1; pointer-events:auto; }
#wolfColorPicker .wolf-clr{
  width:26px; height:26px; border-radius:50%; cursor:pointer; border:2px solid transparent;
  transition:transform .2s ease;
}
#wolfColorPicker .wolf-clr:hover{ transform:scale(1.15); }
#wolfColorPicker .wolf-clr[data-c="purple"]{ background:#a855f7; }
#wolfColorPicker .wolf-clr[data-c="blue"]{ background:#3b82f6; }
#wolfColorPicker .wolf-clr[data-c="red"]{ background:#ef4444; }
#wolfColorPicker .wolf-clr[data-c="pink"]{ background:#ec4899; }
#wolfColorPicker .wolf-clr[data-c="green"]{ background:#22c55e; }

/* === Tools FAB === */
#wolfToolsFab{
  position:fixed; bottom:22px; right:22px; z-index:2147483646;
  width:58px; height:58px; border-radius:50%;
  background:radial-gradient(circle at 30% 30%, var(--wolf-purple-bright), var(--wolf-purple-deep));
  color:#fff; border:0; cursor:pointer; font-size:26px;
  box-shadow:0 8px 28px var(--wolf-purple-glow), 0 0 0 4px rgba(255,255,255,.06);
  display:flex; align-items:center; justify-content:center;
  transition:transform .3s ease;
}
#wolfToolsFab:hover{ transform:rotate(8deg) scale(1.05); }

/* === Tools drawer === */
#wolfToolsDrawer{
  position:fixed; bottom:90px; right:22px; z-index:2147483646;
  width:min(360px, calc(100vw - 28px)); max-height:calc(100vh - 130px); overflow-y:auto;
  background:var(--wolf-bg-card); border:1px solid var(--wolf-line); border-radius:18px;
  box-shadow:0 18px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(168,85,247,.12);
  -webkit-backdrop-filter:blur(20px); backdrop-filter:blur(20px);
  padding:18px 16px; color:var(--wolf-text);
  transform:translateY(20px) scale(.96); opacity:0; pointer-events:none;
  transition:transform .28s ease, opacity .28s ease;
  font-family:'Vazirmatn', system-ui, sans-serif;
}
#wolfToolsDrawer.wolf-show{ transform:translateY(0) scale(1); opacity:1; pointer-events:auto; }
#wolfToolsDrawer h3{
  margin:0 0 12px; font-size:16px; font-weight:800; color:var(--wolf-purple-bright);
  display:flex; align-items:center; gap:8px;
}
#wolfToolsDrawer .wolf-section{ margin-bottom:14px; padding-bottom:12px; border-bottom:1px dashed var(--wolf-line); }
#wolfToolsDrawer .wolf-section:last-child{ border-bottom:0; }
#wolfToolsDrawer .wolf-row{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px; }
#wolfToolsDrawer button.wolf-btn{
  flex:1; min-width:120px;
  background:rgba(168,85,247,.14); color:var(--wolf-text); border:1px solid var(--wolf-purple-glow);
  padding:9px 10px; border-radius:10px; cursor:pointer; font-size:12.5px; font-family:inherit;
  display:flex; align-items:center; gap:6px; justify-content:center;
  transition:background .2s ease, transform .2s ease;
}
#wolfToolsDrawer button.wolf-btn:hover{ background:rgba(168,85,247,.28); transform:translateY(-1px); }
#wolfToolsDrawer button.wolf-btn.wolf-danger{ background:rgba(239,68,68,.16); border-color:rgba(239,68,68,.5); }
#wolfToolsDrawer button.wolf-btn.wolf-danger:hover{ background:rgba(239,68,68,.28); }
#wolfToolsDrawer button.wolf-btn.wolf-success{ background:rgba(34,197,94,.16); border-color:rgba(34,197,94,.5); }
#wolfToolsDrawer button.wolf-btn.wolf-success:hover{ background:rgba(34,197,94,.28); }
#wolfToolsDrawer textarea{
  width:100%; min-height:60px; resize:vertical; box-sizing:border-box;
  background:rgba(0,0,0,.35); color:var(--wolf-text); border:1px solid var(--wolf-line);
  border-radius:8px; padding:8px 10px; font-family:inherit; font-size:12.5px;
}
#wolfToolsDrawer .wolf-stat{ font-size:12px; color:var(--wolf-mut); margin:4px 0; }
#wolfToolsDrawer .wolf-stat b{ color:var(--wolf-text); }
#wolfToolsDrawer .wolf-out{
  margin-top:6px; padding:8px 10px; border-radius:8px; font-size:12px; line-height:1.6;
  background:rgba(0,0,0,.3); border:1px solid var(--wolf-line); color:var(--wolf-text); white-space:pre-wrap; word-break:break-word;
}
#wolfToolsDrawer .wolf-close{ position:absolute; top:10px; left:10px; background:transparent; border:0; color:var(--wolf-mut); cursor:pointer; font-size:18px; }

/* === WOLF AI chat bubble === */
#wolfAiFab{
  position:fixed; bottom:22px; left:22px; z-index:2147483645;
  width:62px; height:62px; border-radius:50%;
  background:radial-gradient(circle at 35% 30%, #1a0a2a, #050018);
  border:1px solid var(--wolf-purple-glow); cursor:pointer;
  box-shadow:0 0 24px var(--wolf-purple-glow);
  display:flex; align-items:center; justify-content:center; font-size:30px;
  position:fixed; transition:transform .3s ease;
}
#wolfAiFab:hover{ transform:scale(1.08); }
#wolfAiFab .wolf-eyes{ position:absolute; top:42%; left:50%; transform:translate(-50%,-50%); display:flex; gap:6px; }
#wolfAiFab .wolf-eyes::before, #wolfAiFab .wolf-eyes::after{
  content:''; width:5px; height:5px; border-radius:50%; background:var(--wolf-purple-bright);
  box-shadow:0 0 8px var(--wolf-purple-bright), 0 0 4px #fff;
  animation:wolfBlink 4s infinite;
}
@keyframes wolfBlink{ 0%,92%,100%{ transform:scaleY(1); } 95%{ transform:scaleY(.1); } }

#wolfAiPanel{
  position:fixed; bottom:96px; left:22px; z-index:2147483645;
  width:min(380px, calc(100vw - 28px)); height:min(520px, calc(100vh - 140px));
  display:flex; flex-direction:column;
  background:linear-gradient(180deg, rgba(20,8,40,.92), rgba(8,4,20,.96));
  border:1px solid var(--wolf-purple-glow); border-radius:18px;
  box-shadow:0 18px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(168,85,247,.18);
  -webkit-backdrop-filter:blur(24px); backdrop-filter:blur(24px);
  color:var(--wolf-text); font-family:'Vazirmatn', system-ui, sans-serif;
  transform:translateY(20px) scale(.96); opacity:0; pointer-events:none;
  transition:transform .28s ease, opacity .28s ease; overflow:hidden;
}
#wolfAiPanel.wolf-show{ transform:translateY(0) scale(1); opacity:1; pointer-events:auto; }
#wolfAiPanel .wolf-ai-head{
  padding:12px 14px; border-bottom:1px solid var(--wolf-line);
  display:flex; align-items:center; gap:8px; background:rgba(168,85,247,.08);
}
#wolfAiPanel .wolf-ai-head .wolf-title{ font-weight:800; font-size:14px; color:var(--wolf-purple-bright); }
#wolfAiPanel .wolf-ai-head .wolf-sub{ font-size:10.5px; color:var(--wolf-mut); }
#wolfAiPanel .wolf-ai-head .wolf-actions{ margin-left:auto; display:flex; gap:4px; }
#wolfAiPanel .wolf-ai-head button{
  background:rgba(168,85,247,.15); color:var(--wolf-text); border:1px solid var(--wolf-line);
  border-radius:8px; padding:5px 8px; cursor:pointer; font-size:11px; font-family:inherit;
}
#wolfAiPanel .wolf-ai-head button:hover{ background:rgba(168,85,247,.3); }
#wolfAiPanel .wolf-ai-body{ flex:1; overflow-y:auto; padding:12px 14px; display:flex; flex-direction:column; gap:10px; }
#wolfAiPanel .wolf-msg{ max-width:85%; padding:9px 12px; border-radius:12px; font-size:13px; line-height:1.6; word-break:break-word; white-space:pre-wrap; }
#wolfAiPanel .wolf-msg.wolf-user{ align-self:flex-end; background:linear-gradient(135deg, var(--wolf-purple-deep), var(--wolf-purple)); color:#fff; border-bottom-right-radius:4px; }
#wolfAiPanel .wolf-msg.wolf-bot{ align-self:flex-start; background:rgba(255,255,255,.06); border:1px solid var(--wolf-line); border-bottom-left-radius:4px; }
#wolfAiPanel .wolf-msg.wolf-bot b{ color:var(--wolf-purple-bright); }
#wolfAiPanel .wolf-msg.wolf-bot code{
  display:block; background:rgba(0,0,0,.45); border:1px solid var(--wolf-line); border-radius:6px;
  padding:6px 8px; font-family:'Vazirmatn', ui-monospace, monospace; font-size:11.5px; margin-top:6px; white-space:pre-wrap; direction:ltr;
}
#wolfAiPanel .wolf-typing{ display:flex; gap:4px; align-self:flex-start; padding:9px 14px; }
#wolfAiPanel .wolf-typing span{
  width:7px; height:7px; border-radius:50%; background:var(--wolf-purple-bright);
  animation:wolfDot 1.2s infinite;
}
#wolfAiPanel .wolf-typing span:nth-child(2){ animation-delay:.2s; }
#wolfAiPanel .wolf-typing span:nth-child(3){ animation-delay:.4s; }
@keyframes wolfDot{ 0%,60%,100%{ transform:translateY(0); opacity:.4; } 30%{ transform:translateY(-5px); opacity:1; } }
#wolfAiPanel .wolf-ai-input{ padding:10px 12px; border-top:1px solid var(--wolf-line); display:flex; gap:8px; background:rgba(0,0,0,.25); }
#wolfAiPanel .wolf-ai-input textarea{
  flex:1; resize:none; max-height:80px; min-height:38px;
  background:rgba(0,0,0,.35); color:var(--wolf-text); border:1px solid var(--wolf-line); border-radius:10px;
  padding:8px 10px; font-family:inherit; font-size:13px; direction:rtl;
}
#wolfAiPanel .wolf-ai-input button{
  width:42px; background:linear-gradient(135deg, var(--wolf-purple-deep), var(--wolf-purple));
  color:#fff; border:0; border-radius:10px; cursor:pointer; font-size:18px;
}
#wolfAiPanel .wolf-chips{ display:flex; gap:6px; padding:6px 10px; flex-wrap:wrap; border-top:1px solid var(--wolf-line); background:rgba(0,0,0,.2); }
#wolfAiPanel .wolf-chips button{
  background:rgba(168,85,247,.15); color:var(--wolf-purple-bright); border:1px solid var(--wolf-line);
  border-radius:99px; padding:5px 11px; cursor:pointer; font-size:11.5px; font-family:inherit;
}
#wolfAiPanel .wolf-chips button:hover{ background:rgba(168,85,247,.3); }
#wolfAiPanel .wolf-msg .wolf-copy{
  display:inline-block; margin-top:6px; padding:3px 9px; font-size:10.5px; cursor:pointer;
  background:rgba(168,85,247,.18); border:1px solid var(--wolf-line); border-radius:6px; color:var(--wolf-purple-bright);
}

/* === Toast === */
#wolfToast{
  position:fixed; top:14px; left:50%; transform:translateX(-50%) translateY(-100px); z-index:2147483647;
  background:rgba(20,8,40,.95); color:#fff; padding:10px 18px; border-radius:10px;
  border:1px solid var(--wolf-purple-glow); box-shadow:0 8px 24px rgba(0,0,0,.4);
  font-family:'Vazirmatn', system-ui, sans-serif; font-size:13px; opacity:0;
  transition:transform .35s ease, opacity .35s ease; pointer-events:none;
}
#wolfToast.wolf-show{ transform:translateX(-50%) translateY(0); opacity:1; }

/* === Maintenance / announcement banner === */
#wolfBanner{
  position:fixed; top:0; left:0; right:0; z-index:2147483644;
  background:linear-gradient(90deg, rgba(168,85,247,.96), rgba(124,58,237,.96));
  color:#fff; padding:10px 16px; font-family:'Vazirmatn', system-ui, sans-serif; font-size:13px;
  text-align:center; box-shadow:0 2px 12px rgba(0,0,0,.4);
  transform:translateY(-100%); transition:transform .35s ease;
}
#wolfBanner.wolf-show{ transform:translateY(0); }
#wolfBanner.wolf-maint{ background:linear-gradient(90deg, rgba(239,68,68,.96), rgba(185,28,28,.96)); }
`;

export const WOLF_JS = `
(function(){
  function ts(){ return Date.now(); }
  function $(id){ return document.getElementById(id); }
  function post(path, body, cb){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        try { var j = JSON.parse(xhr.responseText); cb(j, xhr.status); }
        catch(e){ cb({error:'پاسخ نامعتبر'}, xhr.status); }
      }
    };
    xhr.send(JSON.stringify(body||{}));
  }
  function toast(msg, dur){
    var t = $('wolfToast');
    if (!t){ t = document.createElement('div'); t.id='wolfToast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('wolf-show');
    clearTimeout(t._timer); t._timer = setTimeout(function(){ t.classList.remove('wolf-show'); }, dur||2500);
  }
  window.__wolfToast = toast;

  // === Theme + color picker ===
  function applyTheme(mode){
    if (mode === 'day') document.documentElement.classList.add('wolf-day');
    else document.documentElement.classList.remove('wolf-day');
    try { localStorage.setItem('wolfTheme', mode); } catch(e){}
  }
  function autoTheme(){
    try { var saved = localStorage.getItem('wolfTheme'); if (saved) return saved; } catch(e){}
    var h = new Date().getHours();
    return (h >= 6 && h < 18) ? 'day' : 'night';
  }
  function applyColor(c){
    document.documentElement.classList.remove('wolf-red','wolf-blue','wolf-pink','wolf-green');
    if (c && c !== 'purple') document.documentElement.classList.add('wolf-' + c);
    try { localStorage.setItem('wolfColor', c||'purple'); } catch(e){}
  }

  function ensureSwitch(){
    if ($('wolfThemeSwitch')) return;
    var btn = document.createElement('button');
    btn.id = 'wolfThemeSwitch'; btn.title = 'حالت شب/روز';
    btn.innerHTML = '<span class="wolf-icon">🌙</span>';
    btn.onclick = function(){
      var cur = document.documentElement.classList.contains('wolf-day') ? 'day' : 'night';
      applyTheme(cur === 'day' ? 'night' : 'day');
      btn.querySelector('.wolf-icon').textContent = cur === 'day' ? '☀️' : '🌙';
      var cp = $('wolfColorPicker'); if (cp) cp.classList.toggle('wolf-show');
    };
    document.body.appendChild(btn);

    var cp = document.createElement('div');
    cp.id = 'wolfColorPicker';
    cp.innerHTML = '<div class="wolf-clr" data-c="purple" title="بنفش"></div>'
                 + '<div class="wolf-clr" data-c="blue" title="آبی"></div>'
                 + '<div class="wolf-clr" data-c="red" title="قرمز"></div>'
                 + '<div class="wolf-clr" data-c="pink" title="صورتی"></div>'
                 + '<div class="wolf-clr" data-c="green" title="سبز"></div>';
    cp.querySelectorAll('.wolf-clr').forEach(function(el){
      el.onclick = function(){ applyColor(el.getAttribute('data-c')); };
    });
    document.body.appendChild(cp);
  }

  // === Banner (announcement / maintenance) ===
  function ensureBanner(){
    if ($('wolfBanner')) return;
    var b = document.createElement('div'); b.id = 'wolfBanner'; document.body.appendChild(b);
  }
  function showBanner(text, isMaint){
    ensureBanner();
    var b = $('wolfBanner');
    b.textContent = text; b.className = 'wolf-show' + (isMaint ? ' wolf-maint' : '');
  }
  function hideBanner(){
    var b = $('wolfBanner'); if (b) b.className = '';
  }

  // === Tools FAB + drawer (admin only) ===
  function ensureTools(){
    if ($('wolfToolsFab')) return;
    var fab = document.createElement('button'); fab.id='wolfToolsFab'; fab.innerHTML='👑'; fab.title='ابزارهای مستر یوسف';
    document.body.appendChild(fab);

    var dr = document.createElement('div'); dr.id='wolfToolsDrawer';
    dr.innerHTML = '<button class="wolf-close" onclick="document.getElementById(\\'wolfToolsDrawer\\').classList.remove(\\'wolf-show\\')">×</button>'
      + '<h3>👑 ابزارهای مستر یوسف</h3>'
      + '<div class="wolf-section">'
      +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnStats">📊 آمار</button>'
      +   '<button class="wolf-btn" id="wolfBtnUsers">👥 کاربران</button></div>'
      +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnMaint">🛠 حالت تعمیر</button>'
      +   '<button class="wolf-btn wolf-danger" id="wolfBtnKill">🛑 قطع همه</button></div>'
      +   '<div class="wolf-row"><button class="wolf-btn wolf-success" id="wolfBtnRevive">🔌 وصل دوباره</button>'
      +   '<button class="wolf-btn" id="wolfBtnViewer">🔎 لینک همکار</button></div>'
      +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnBackup">💾 بکاپ</button>'
      +   '<button class="wolf-btn" id="wolfBtnAnnounce">📣 اعلان</button></div>'
      + '</div>'
      + '<div class="wolf-section">'
      +   '<div class="wolf-stat" id="wolfStatsLine">در حال بارگذاری آمار…</div>'
      + '</div>'
      + '<div class="wolf-section">'
      +   '<label style="font-size:12px;color:var(--wolf-mut)">متن اعلان / حالت تعمیر:</label>'
      +   '<textarea id="wolfAnnounceText" placeholder="متن اعلان یا حالت تعمیر…"></textarea>'
      +   '<div class="wolf-row" style="margin-top:6px"><button class="wolf-btn" id="wolfBtnSetAnnounce">ثبت اعلان</button>'
      +   '<button class="wolf-btn" id="wolfBtnSetMaint">ثبت تعمیر</button>'
      +   '<button class="wolf-btn wolf-danger" id="wolfBtnClearAnnounce">پاک کردن</button></div>'
      + '</div>'
      + '<div class="wolf-section">'
      +   '<label style="font-size:12px;color:var(--wolf-mut)">بخش تیکت‌ها:</label>'
      +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnTickets">🎫 تیکت‌های باز</button></div>'
      +   '<div class="wolf-out" id="wolfTicketsOut">—</div>'
      + '</div>'
      + '<div class="wolf-section">'
      +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnGenSub">📱 ساخت پروکسی</button>'
      +   '<button class="wolf-btn" id="wolfBtnHealth">🩺 تست لینک</button></div>'
      +   '<div class="wolf-out" id="wolfActionOut"></div>'
      + '</div>';
    document.body.appendChild(dr);

    fab.onclick = function(){
      dr.classList.toggle('wolf-show');
      if (dr.classList.contains('wolf-show')) loadStats();
    };

    function out(id, txt){ var e=$(id); if(e){ e.textContent = txt; } }

    function loadStats(){
      post('/_my/api/stats', {}, function(j, s){
        if (s !== 200){ out('wolfStatsLine', 'خطا در دریافت آمار'); return; }
        var u = j.users||{}, h = j.health||{};
        out('wolfStatsLine',
          '👥 کل: '+u.total+' • فعال: '+u.active+' • منقضی: '+u.expired+' • نزدیک: '+u.nearExpiry+'\\n'
          + '🎫 تیکت باز: '+(j.ticketsOpen||0)+' • 🌐 آنلاین: '+(j.onlineNow||0)+'\\n'
          + '⚙️ Xray/Worker: '+(h.worker?'🟢':'🔴')+' • ⏱ Uptime: '+(h.uptimeSec||0)+'s'
        );
      });
    }
    if ($('wolfBtnStats')) $('wolfBtnStats').onclick = loadStats;

    if ($('wolfBtnUsers')) $('wolfBtnUsers').onclick = function(){
      post('/_my/api/users', {q:''}, function(j, s){
        if (s !== 200){ out('wolfActionOut', 'خطا: '+(j.error||s)); return; }
        var lines = (j.users||[]).map(function(u){
          var stat = u.enabled ? (u.expiry && u.expiry < Date.now() ? '🔴 منقضی' : '🟢 فعال') : '🟠 غیرفعال';
          return '['+u.name+'] '+stat+' • روز: '+(u.expiry?Math.max(0,Math.ceil((u.expiry-Date.now())/86400000)):'∞')+' • مصرف: '+(u.quota?((u.used||0)/1073741824).toFixed(2)+'/'+(u.quota/1073741824).toFixed(0)+'GB':((u.used||0)/1073741824).toFixed(2)+'GB/∞');
        });
        out('wolfActionOut', lines.join('\\n') || 'بدون کاربر');
      });
    };

    if ($('wolfBtnKill')) $('wolfBtnKill').onclick = function(){
      if (!confirm('قطع اضطراری همه‌ی اینباندها؟ وضعیت قبلی ذخیره می‌شود.')) return;
      post('/_my/api/kill', {action:'on'}, function(j, s){
        out('wolfActionOut', s===200 ? ('🛑 همه قطع شدند. '+j.disabled+' اینباند.') : ('خطا: '+(j.error||s)));
      });
    };
    if ($('wolfBtnRevive')) $('wolfBtnRevive').onclick = function(){
      post('/_my/api/kill', {action:'off'}, function(j, s){
        out('wolfActionOut', s===200 ? ('🔌 همه وصل شدند. '+j.restored+' اینباند.') : ('خطا: '+(j.error||s)));
      });
    };
    if ($('wolfBtnViewer')) $('wolfBtnViewer').onclick = function(){
      post('/_my/api/viewer', {action:'new'}, function(j, s){
        if (s===200){ out('wolfActionOut', 'لینک فقط‌خواندنی:\\n'+location.origin+'/_my/view/'+j.token); toast('لینک ساخته شد'); }
        else out('wolfActionOut', 'خطا: '+(j.error||s));
      });
    };
    if ($('wolfBtnBackup')) $('wolfBtnBackup').onclick = function(){
      toast('در حال بکاپ…'); post('/_my/api/backup', {}, function(j, s){
        out('wolfActionOut', s===200 ? ('💾 '+j.message) : ('خطا: '+(j.error||s)));
      });
    };
    if ($('wolfBtnTickets')) $('wolfBtnTickets').onclick = function(){
      post('/_my/api/tickets', {action:'list'}, function(j, s){
        if (s !== 200){ out('wolfTicketsOut', 'خطا'); return; }
        var t = (j.tickets||[]).map(function(x){
          return '#'+x.id+' ['+x.user+'] '+(x.subject||'')+' ('+x.status+')';
        });
        out('wolfTicketsOut', t.join('\\n') || 'تیکت بازی نیست');
      });
    };
    if ($('wolfBtnAnnounce')) $('wolfBtnAnnounce').onclick = function(){
      var t = ($('wolfAnnounceText').value||'').trim();
      post('/_my/api/announce', {action:'on', text:t}, function(j, s){
        out('wolfActionOut', s===200 ? '📣 اعلان ثبت شد' : ('خطa: '+(j.error||s)));
      });
    };
    if ($('wolfBtnSetMaint')) $('wolfBtnSetMaint').onclick = function(){
      var t = ($('wolfAnnounceText').value||'').trim() || 'در حال تعمیر و به‌روزرسانی';
      post('/_my/api/maint', {action:'on', text:t}, function(j, s){
        out('wolfActionOut', s===200 ? '🛠 حالت تعمیر فعال شد' : ('خطا: '+(j.error||s)));
      });
    };
    if ($('wolfBtnClearAnnounce')) $('wolfBtnClearAnnounce').onclick = function(){
      post('/_my/api/announce', {action:'off'}, function(){ post('/_my/api/maint',{action:'off'}, function(j,s){ out('wolfActionOut','پاک شد'); }); });
    };
    if ($('wolfBtnGenSub')) $('wolfBtnGenSub').onclick = function(){
      var name = prompt('اسم پروکسی جدید:'); if (!name) return;
      var days = parseInt(prompt('تعداد روز (0=نامحدود):','0')||'0',10);
      var gb = parseFloat(prompt('حجم GB (0=نامحدود):','0')||'0');
      post('/_my/api/newproxy', {name:name, days:days, gb:gb, nosub:false}, function(j, s){
        if (s===200){ out('wolfActionOut', '✅ ساخته شد:\\n'+j.subUrl+'\\nUUID: '+j.uuid); toast('پروکسی ساخته شد'); }
        else out('wolfActionOut', 'خطا: '+(j.error||s));
      });
    };
    if ($('wolfBtnHealth')) $('wolfBtnHealth').onclick = function(){
      var sub = prompt('آیدی اشتراک یا لینک کامل:'); if (!sub) return;
      post('/_my/api/diag', {sub:sub}, function(j, s){
        out('wolfActionOut', s===200 ? (j.report||'—') : ('خطا: '+(j.error||s)));
      });
    };
  }

  // === WOLF AI panel ===
  function ensureAi(){
    if ($('wolfAiFab')) return;
    var fab = document.createElement('button'); fab.id='wolfAiFab'; fab.title='WOLF AI';
    fab.innerHTML = '🐺<span class="wolf-eyes"></span>';
    document.body.appendChild(fab);

    var p = document.createElement('div'); p.id='wolfAiPanel';
    p.innerHTML = '<div class="wolf-ai-head">'
      + '<div><div class="wolf-title">🐺 WOLF AI</div><div class="wolf-sub">دستیار هوشمند مستر یوسف</div></div>'
      + '<div class="wolf-actions"><button id="wolfAiNew">جدید</button><button id="wolfAiClear">پاک</button><button id="wolfAiExport">خروجی</button><button id="wolfAiToggle">×</button></div>'
      + '</div>'
      + '<div class="wolf-ai-body" id="wolfAiBody"></div>'
      + '<div class="wolf-chips" id="wolfAiChips"></div>'
      + '<div class="wolf-ai-input"><textarea id="wolfAiInput" placeholder="سوالت رو بپرس…" rows="1"></textarea><button id="wolfAiSend">➤</button></div>';
    document.body.appendChild(p);

    fab.onclick = function(){ p.classList.toggle('wolf-show'); };
    $('wolfAiToggle').onclick = function(){ p.classList.remove('wolf-show'); };
    $('wolfAiNew').onclick = function(){ try{ localStorage.removeItem('wolfAiHist'); }catch(e){} $('wolfAiBody').innerHTML=''; renderChips(); };
    $('wolfAiClear').onclick = function(){ $('wolfAiBody').innerHTML=''; };
    $('wolfAiExport').onclick = function(){
      var txt = Array.from($('wolfAiBody').children).map(function(m){
        return (m.classList.contains('wolf-user')?'[شما] ':'[WOLF] ')+m.innerText;
      }).join('\\n');
      var blob = new Blob([txt], {type:'text/plain'});
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='wolf-ai-chat.txt'; a.click();
    };

    function loadHist(){
      try { return JSON.parse(localStorage.getItem('wolfAiHist')||'[]'); } catch(e){ return []; }
    }
    function saveHist(h){ try { localStorage.setItem('wolfAiHist', JSON.stringify(h.slice(-30))); } catch(e){} }
    function renderHist(){
      var body = $('wolfAiBody'); body.innerHTML='';
      loadHist().forEach(function(m){ addMsg(m.role, m.text, false); });
    }
    function addMsg(role, text, save){
      var body = $('wolfAiBody');
      var m = document.createElement('div');
      m.className = 'wolf-msg ' + (role==='user'?'wolf-user':'wolf-bot');
      m.innerHTML = formatMd(text);
      var cp = document.createElement('span'); cp.className='wolf-copy'; cp.textContent='کپی'; cp.onclick=function(){ navigator.clipboard && navigator.clipboard.writeText(text); toast('کپی شد'); };
      m.appendChild(cp);
      body.appendChild(m); body.scrollTop = body.scrollHeight;
      if (save){ var h = loadHist(); h.push({role:role, text:text}); saveHist(h); }
    }
    function formatMd(t){
      // bold + triple-backtick code blocks; use charCode for backticks
      var bt = String.fromCharCode(96);
      var triple = bt + bt + bt;
      var esc = t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      esc = esc.replace(/\\*\\*([^*]+)\\*\\*/g,'<b>$1</b>');
      var escaped = triple.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&');
      var re = new RegExp(escaped + '([\\\\s\\\\S]*?)' + escaped, 'g');
      esc = esc.replace(re, '<code>$1</code>');
      return esc;
    }
    function showTyping(){
      var body = $('wolfAiBody'); var t = document.createElement('div'); t.className='wolf-typing'; t.id='wolfTyping';
      t.innerHTML='<span></span><span></span><span></span>'; body.appendChild(t); body.scrollTop = body.scrollHeight;
    }
    function hideTyping(){ var t=$('wolfTyping'); if(t) t.remove(); }

    function send(text){
      if (!text || !text.trim()) return;
      addMsg('user', text, true);
      $('wolfAiInput').value='';
      showTyping();
      var hist = loadHist(); hist.push({role:'user', text:text});
      post('/_my/api/ai', {msg:text, hist:hist.slice(-10)}, function(j, s){
        hideTyping();
        if (s===200 && j.reply){ addMsg('bot', j.reply, true); }
        else { addMsg('bot', '⚠️ '+(j.error||'خطای ناشناخته'), false); }
      });
    }
    $('wolfAiSend').onclick = function(){ send($('wolfAiInput').value); };
    $('wolfAiInput').addEventListener('keydown', function(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(this.value); } });

    function renderChips(){
      var c = $('wolfAiChips'); c.innerHTML='';
      var admin = (document.cookie.indexOf('wolf_admin=1') !== -1) || !!window.__wolfIsAdmin;
      var chips = admin
        ? ['خلاصه‌ی وضعیت امروز چیه؟','چند کاربر نزدیک انقضا داریم؟','تیکت‌های باز رو بگو','سلامت سرور چطوره؟']
        : ['اشتراکم کی تموم میشه؟','چطور وصل شم؟','مصرفم چقدره؟','سرعت چطوره؟'];
      chips.forEach(function(q){
        var b = document.createElement('button'); b.textContent=q; b.onclick=function(){ send(q); };
        c.appendChild(b);
      });
    }

    renderHist(); renderChips();
  }

  // === Boot ===
  function boot(){
    applyTheme(autoTheme());
    try { applyColor(localStorage.getItem('wolfColor')||'purple'); } catch(e){ applyColor('purple'); }
    ensureSwitch();
    ensureBanner();
    ensureTools();
    ensureAi();

    // Load banner state
    fetch('/_my/api/banner').then(function(r){ return r.json(); }).then(function(j){
      if (j && j.maint && j.maint.on) showBanner('🛠 حالت تعمیر: '+(j.maint.text||''), true);
      else if (j && j.announce && j.announce.on) showBanner('📣 '+(j.announce.text||''), false);
    }).catch(function(){});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
`;
