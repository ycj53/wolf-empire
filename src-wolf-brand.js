
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
    var existingFab = $('wolfToolsFab');
    var existingDrawer = $('wolfToolsDrawer');
    // If both exist, just make sure onclick is bound and stop.
    if (existingFab && existingDrawer){
      if (!existingFab._wolfBound){
        existingFab.onclick = function(){
          existingDrawer.classList.toggle('wolf-show');
          if (existingDrawer.classList.contains('wolf-show')) loadStats();
        };
        existingFab._wolfBound = true;
      }
      return;
    }
    var fab = existingFab || document.createElement('button');
    if (!existingFab){
      fab.id='wolfToolsFab'; fab.title='ابزارهای مستر یوسف';
      fab.innerHTML='<span class="wolf-fab-ring"></span>👑<span class="wolf-fab-crown">🐺</span>';
      document.body.appendChild(fab);
    }

    var dr = existingDrawer || document.createElement('div');
    var isNewDrawer = !existingDrawer;
    if (isNewDrawer){
      dr.id='wolfToolsDrawer';
      var closeBtn = document.createElement('button'); closeBtn.className='wolf-close'; closeBtn.innerHTML='×';
      closeBtn.onclick = function(){ dr.classList.remove('wolf-show'); };
      dr.appendChild(closeBtn);

      // === Empire header: crown + gold title + subtitle ribbon + live badge ===
      var head = document.createElement('div'); head.className='wolf-drawer-head';
      head.innerHTML =
          '<div class="wolf-crown-top">👑</div>'
        + '<h3>MASTER YOUSEF</h3>'
        + '<div class="wolf-subtitle">🐺 WOLF EMPIRE 🐺</div>'
        + '<div class="wolf-tag"><span class="wolf-live">آنلاین</span> <b>•</b> پنل مدیریت <b>امپراطوری</b></div>';
      dr.appendChild(head);

      // === Body with premium empire sections ===
      var bodyDiv = document.createElement('div'); bodyDiv.className='wolf-body';

      // Section 1: Medallions row (gold-rim server badges like reference)
      bodyDiv.innerHTML += '<div class="wolf-section wolf-section-gold">'
        +   '<div class="wolf-section-label"><span class="wolf-sec-ico">🏰</span> امپراطوری مستر یوسف</div>'
        +   '<div class="wolf-medallion-row">'
        +     '<div class="wolf-medallion"><span class="wolf-med-ico">🐺</span><span class="wolf-med-txt">WOLF</span></div>'
        +     '<div class="wolf-medallion wolf-med-green"><span class="wolf-med-ico">⚡</span><span class="wolf-med-txt">X4G</span></div>'
        +     '<div class="wolf-medallion"><span class="wolf-med-ico">👑</span><span class="wolf-med-txt">MASTER</span></div>'
        +   '</div>'
        +   '<div class="wolf-chips">'
        +     '<span class="wolf-chip"><span class="wolf-chip-ico">🔒</span> اتصال امن TLS</span>'
        +     '<span class="wolf-chip"><span class="wolf-chip-ico">📶</span> پینگ مناسب</span>'
        +     '<span class="wolf-chip"><span class="wolf-chip-ico">⚡</span> سرعت بالا</span>'
        +     '<span class="wolf-chip"><span class="wolf-chip-ico">📡</span> همه اپراتورها</span>'
        +   '</div>'
        + '</div>';

      // Section 2: Quick stat cards (gold-rim medallions)
      bodyDiv.innerHTML += '<div class="wolf-section">'
        +   '<div class="wolf-section-label"><span class="wolf-sec-ico">📊</span> آمار امپراطوری</div>'
        +   '<div class="wolf-cards">'
        +     '<div class="wolf-card"><span class="wolf-num" id="wolfCardTotal">—</span><span class="wolf-lbl">👥 کل کاربران</span></div>'
        +     '<div class="wolf-card"><span class="wolf-num" id="wolfCardActive">—</span><span class="wolf-lbl">🟢 فعال</span></div>'
        +     '<div class="wolf-card"><span class="wolf-num" id="wolfCardOnline">—</span><span class="wolf-lbl">🌐 آنلاین</span></div>'
        +     '<div class="wolf-card"><span class="wolf-num" id="wolfCardTickets">—</span><span class="wolf-lbl">🎫 تیکت باز</span></div>'
        +   '</div>'
        +   '<div class="wolf-stat" id="wolfStatsLine">⏳ در حال بارگذاری…</div>'
        +   '<div class="wolf-row"><button class="wolf-btn wolf-gold" id="wolfBtnStats">🔄 بارگذاری مجدد</button>'
        +   '<button class="wolf-btn" id="wolfBtnUsers">👥 لیست کاربران</button></div>'
        + '</div>';

      // Section 3: Quick actions (danger zone with green/gold)
      bodyDiv.innerHTML += '<div class="wolf-section wolf-section-green">'
        +   '<div class="wolf-section-label"><span class="wolf-sec-ico">⚡</span> عملیات سریع</div>'
        +   '<div class="wolf-row"><button class="wolf-btn wolf-success" id="wolfBtnRevive">🔌 وصل همه</button>'
        +   '<button class="wolf-btn wolf-danger" id="wolfBtnKill">🛑 قطع اضطراری</button></div>'
        +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnMaint">🛠 حالت تعمیر</button>'
        +   '<button class="wolf-btn wolf-gold" id="wolfBtnBackup">💾 بکاپ امپراطوری</button></div>'
        + '</div>';

      // Section 4: Announcements
      bodyDiv.innerHTML += '<div class="wolf-section">'
        +   '<div class="wolf-section-label"><span class="wolf-sec-ico">📣</span> اعلان و تعمیر</div>'
        +   '<textarea id="wolfAnnounceText" placeholder="متن اعلان یا حالت تعمیر…"></textarea>'
        +   '<div class="wolf-row" style="margin-top:8px"><button class="wolf-btn wolf-success" id="wolfBtnSetAnnounce">📣 ثبت اعلان</button>'
        +   '<button class="wolf-btn wolf-gold" id="wolfBtnSetMaint">🛠 ثبت تعمیر</button>'
        +   '<button class="wolf-btn wolf-danger" id="wolfBtnClearAnnounce">🧹 پاک</button></div>'
        +   '<button class="wolf-btn" id="wolfBtnAnnounce" style="margin-top:8px;width:100%">📣 ثبت سریع اعلان</button>'
        + '</div>';

      // Section 5: Tickets
      bodyDiv.innerHTML += '<div class="wolf-section">'
        +   '<div class="wolf-section-label"><span class="wolf-sec-ico">🎫</span> تیکت‌ها</div>'
        +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnTickets" style="width:100%">🎫 تیکت‌های باز</button></div>'
        +   '<div class="wolf-out" id="wolfTicketsOut">—</div>'
        + '</div>';

      // Section 6: Proxy tools
      bodyDiv.innerHTML += '<div class="wolf-section wolf-section-gold">'
        +   '<div class="wolf-section-label"><span class="wolf-sec-ico">📱</span> ابزار پروکسی</div>'
        +   '<div class="wolf-row"><button class="wolf-btn" id="wolfBtnGenSub">📱 ساخت پروکسی</button>'
        +   '<button class="wolf-btn" id="wolfBtnHealth">🩺 تست لینک</button></div>'
        +   '<div class="wolf-row"><button class="wolf-btn wolf-gold" id="wolfBtnViewer" style="width:100%">🔎 ساخت لینک همکار</button></div>'
        +   '<div class="wolf-out" id="wolfActionOut"></div>'
        + '</div>';

      // Section 7: Panel info
      bodyDiv.innerHTML += '<div class="wolf-section">'
        +   '<div class="wolf-section-label"><span class="wolf-sec-ico">ℹ️</span> اطلاعات پنل</div>'
        +   '<div class="wolf-stat" id="wolfPanelInfo">—</div>'
        + '</div>';

      dr.appendChild(bodyDiv);

      // === Footer with chains decoration ===
      var foot = document.createElement('div'); foot.className='wolf-drawer-foot';
      foot.innerHTML =
          '<div class="wolf-chain-row">⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓</div>'
        + '<div class="wolf-foot-title">👑 MASTER YOUSEF WOLF EMPIRE 👑</div>'
        + '<div class="wolf-foot-sub">ساخته شده با قدرت توسط مستر یوسف</div>'
        + '<div class="wolf-foot-paws">🐾 🐾 🐾</div>';
      dr.appendChild(foot);

      document.body.appendChild(dr);
    }

    if (!fab._wolfBound){
      fab.onclick = function(){
        dr.classList.toggle('wolf-show');
        if (dr.classList.contains('wolf-show')) loadStats();
      };
      fab._wolfBound = true;
    }

    function out(id, txt){ var e=$(id); if(e){ e.textContent = txt; } }
    function setHTML(id, html){ var e=$(id); if(e){ e.innerHTML = html; } }

    function fmtUptime(sec){
      sec = sec||0;
      var d = Math.floor(sec/86400), h = Math.floor((sec%86400)/3600), m = Math.floor((sec%3600)/60);
      if (d>0) return d+' روز و '+h+' ساعت';
      if (h>0) return h+' ساعت و '+m+' دقیقه';
      return m+' دقیقه';
    }

    function loadStats(){
      out('wolfStatsLine', '⏳ در حال بارگذاری…');
      post('/_my/api/stats', {}, function(j, s){
        if (s !== 200){ out('wolfStatsLine', '❌ خطا در دریافت آمار'); return; }
        var u = j.users||{}, h = j.health||{};
        // Fill stat cards
        out('wolfCardTotal', u.total||0);
        out('wolfCardActive', u.active||0);
        out('wolfCardOnline', j.onlineNow||0);
        out('wolfCardTickets', j.ticketsOpen||0);
        // Detailed stats
        out('wolfStatsLine',
          '👥 کل: '+u.total+' • فعال: '+u.active+' • منقضی: '+u.expired+' • نزدیک انقضا: '+u.nearExpiry+'\n'
          + '🎫 تیکت باز: '+(j.ticketsOpen||0)+' • 🌐 آنلاین: '+(j.onlineNow||0)+'\n'
          + '⚙️ Worker: '+(h.worker?'🟢 سالم':'🔴 قطع')+' • ⏱ آپ‌تایم: '+fmtUptime(h.uptimeSec)
        );
        // Panel info footer
        out('wolfPanelInfo',
          '🐺 برند: MASTER YOUSEF WOLF EMPIRE\n'
          + '🌐 آدرس: '+location.host+'\n'
          + '📊 وضعیت: '+(h.worker?'🟢 فعال':'🔴 غیرفعال')+' • ⏱ '+fmtUptime(h.uptimeSec)
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
  function ensureAll(){
    ensureSwitch();
    ensureBanner();
    ensureTools();
    ensureAi();
  }
  function boot(){
    applyTheme(autoTheme());
    try { applyColor(localStorage.getItem('wolfColor')||'purple'); } catch(e){ applyColor('purple'); }
    ensureAll();

    // Re-inject after delays in case the panel's SPA renders after us
    setTimeout(ensureAll, 300);
    setTimeout(ensureAll, 1000);
    setTimeout(ensureAll, 2500);
    setTimeout(ensureAll, 5000);

    // Watch for our elements being removed and re-add them
    try {
      var mo = new MutationObserver(function(mutations){
        // Check if any of our FABs are missing
        if (!$('wolfToolsFab') || !$('wolfAiFab') || !$('wolfThemeSwitch')) {
          ensureAll();
        }
      });
      mo.observe(document.body, { childList:true, subtree:false });
    } catch(e){}

    // Load banner state
    fetch('/_my/api/banner').then(function(r){ return r.json(); }).then(function(j){
      if (j && j.maint && j.maint.on) showBanner('🛠 حالت تعمیر: '+(j.maint.text||''), true);
      else if (j && j.announce && j.announce.on) showBanner('📣 '+(j.announce.text||''), false);
    }).catch(function(){});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
