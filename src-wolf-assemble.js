// Assembler v2: combines obfuscated worker1.js with WOLF EMPIRE additions.
// Reads raw CSS/JS text files (no JS-eval needed) and inlines them via JSON.stringify.

const fs = require('fs');
const path = require('path');

const SRC = '/home/z/my-project/upload/worker1.js';
const OUT = '/home/z/my-project/worker-deploy/worker.js';
const MOD_DIR = '/home/z/my-project/scripts/wolf-modules';

// Read raw text files for CSS/JS (no JS interpretation needed)
const WOLF_CSS_TEXT = fs.readFileSync(path.join(MOD_DIR, 'wolf-brand.css'), 'utf8');
const WOLF_JS_TEXT = fs.readFileSync(path.join(MOD_DIR, 'wolf-brand.js'), 'utf8');
const WOLF_SUB_CSS_TEXT = fs.readFileSync(path.join(MOD_DIR, 'wolf-sub-page.css'), 'utf8');

// Read the new MASTER YOUSEF avatar (square 256px webp, base64)
const WOLF_AVATAR_SQUARE = fs.readFileSync(path.join(MOD_DIR, 'wolf-avatar-b64.txt'), 'utf8').trim();
const WOLF_AVATAR_FULL = fs.readFileSync(path.join(MOD_DIR, 'wolf-avatar-full-b64.txt'), 'utf8').trim();
// Read the original Sukot avatar we are replacing
const WOLF_AVATAR_OLD = fs.readFileSync(path.join(MOD_DIR, 'wolf-avatar-old-b64.txt'), 'utf8').trim();

// Read admin handlers ES module, strip `export ` keywords
const adminModSrc = fs.readFileSync(path.join(MOD_DIR, 'admin-handlers.js'), 'utf8');
const adminCode = adminModSrc
  .replace(/^export\s+/gm, '')
  .replace(/^\/\/\s*wolf-modules.*$/gm, '');

// JSON.stringify is the safest way to embed any text as a JS string literal
const cssLiteral = JSON.stringify(WOLF_CSS_TEXT);
const jsLiteral = JSON.stringify(WOLF_JS_TEXT);
const subCssLiteral = JSON.stringify(WOLF_SUB_CSS_TEXT);

// Read original obfuscated worker
const orig = fs.readFileSync(SRC, 'utf8');

// IMPORTANT: use string concatenation (NOT template literals) so that ${...}
// inside the CSS/JS/admin source is not interpreted as interpolation.
const wrapperCode = [
  'var sn=_0x34845a;',
  adminCode,
  '',
  '(function(){',
  '  const _origFetch = sn.fetch;',
  '  if (typeof _origFetch !== \'function\') return;',
  '',
  '  const WOLF_CSS = ' + cssLiteral + ';',
  '  const WOLF_JS = ' + jsLiteral + ';',
  '  const WOLF_SUB_CSS = ' + subCssLiteral + ';',
  '  const WOLF_AVATAR_SQUARE = ' + JSON.stringify(WOLF_AVATAR_SQUARE) + ';',
  '  const WOLF_AVATAR_FULL = ' + JSON.stringify(WOLF_AVATAR_FULL) + ';',
  '  const OLD_AVATAR_B64 = ' + JSON.stringify(WOLF_AVATAR_OLD) + ';',
  '',
  '  function rewriteHtml(body){',
  '    body = body.split(\'https://t.me/SUKOT1344\').join(\'https://t.me/vpnstan1\');',
  '    body = body.split(\'\\u06a9\\u0627\\u0646\\u0627\\u0644 \\u062a\\u0644\\u06af\\u0631\\u0627\\u0645 Sukot\').join(\'\\u06a9\\u0627\\u0646\\u0627\\u0644 \\u062a\\u0644\\u06af\\u0631\\u0627\\u0645\');',
  '    body = body.split(\'\\u06a9\\u0627\\u0646\\u0627\\u0644 \\u0631\\u0633\\u0645\\u06cc Sukot\').join(\'\\u06a9\\u0627\\u0646\\u0627\\u0644 \\u0631\\u0633\\u0645\\u06cc\');',
  '    body = body.split(\'\\u06a9\\u0627\\u0646\\u0627\\u0644 \\u067e\\u0634\\u062a\\u06cc\\u0628\\u0627\\u0646\\u06cc Sukot\').join(\'\\u06a9\\u0627\\u0646\\u0627\\u0644 \\u067e\\u0634\\u062a\\u06cc\\u0628\\u0627\\u0646\\u06cc\');',
  '    body = body.split(\'\\u062e\\u0648\\u0634 \\u0622\\u0645\\u062f\\u06cc\\u062f \\u0628\\u0647 <b>Sukot</b>\').join(\'\\u0633\\u0627\\u062e\\u062a\\u0647 \\u0634\\u062f\\u0647 \\u062a\\u0648\\u0633\\u0637 \\u0645\\u0633\\u062a\\u0631 \\u06cc\\u0648\\u0633\\u0641\');',
  '    body = body.split(\'\\u062e\\u0648\\u0634 \\u0622\\u0645\\u062f\\u06cc\\u062f \\u0628\\u0647 Sukot\').join(\'\\u0633\\u0627\\u062e\\u062a\\u0647 \\u0634\\u062f\\u0647 \\u062a\\u0648\\u0633\\u0637 \\u0645\\u0633\\u062a\\u0631 \\u06cc\\u0648\\u0633\\u0641\');',
  '    body = body.split(\'ساخته شدع توسط مستر یوسف\').join(\'ساخته‌شده توسط مستر یوسف 🐺👑\');',
  '    body = body.split(\'پنل مدیریت Sukot\').join(\'پنل MASTER YOUSEF WOLF EMPIRE\');',
  '    body = body.split(\'>Sukot</div>\').join(\'>MASTER YOUSEF</div>\');',
  '    body = body.split(\'>Sukot</title>\').join(\'>MASTER YOUSEF WOLF EMPIRE</title>\');',
  '    body = body.split(\'title>Sukot<\').join(\'title>MASTER YOUSEF WOLF EMPIRE<\');',
  '    body = body.split(\'>Sukot</a>\').join(\'>MASTER YOUSEF</a>\');',
  '    body = body.split(\'"brand">Sukot<\').join(\'"brand">MASTER YOUSEF<\');',
  '    body = body.split(\'"brand">SUKOT<\').join(\'"brand">MASTER YOUSEF<\');',
  '    body = body.split(\'"nm">SUKOT<\').join(\'"nm">MASTER YOUSEF<\');',
  '    body = body.split(\'"nm">Sukot<\').join(\'"nm">MASTER YOUSEF<\');',
  '    body = body.split(\'alt="Sukot"\').join(\'alt="MASTER YOUSEF WOLF EMPIRE"\');',
  '    body = body.split(\'<title>Sukot\').join(\'<title>MASTER YOUSEF WOLF EMPIRE\');',
  '    body = body.split(\'Sukot — پنل مدیریت\').join(\'MASTER YOUSEF — پنل مدیریت\');',
  '    body = body.split(\'>Sukot</span>\').join(\'>MASTER YOUSEF</span>\');',
  '    body = body.split(\'>SUKOT</span>\').join(\'>MASTER YOUSEF</span>\');',
  '    body = body.split(\'"Sukot"\').join(\'"MASTER YOUSEF"\');',
  '    body = body.split(\':Sukot<\').join(\':MASTER YOUSEF<\');',
  '    body = body.split(\'app":"Sukot"\').join(\'app":"MASTER YOUSEF"\');',
  '    // Replace the old panel avatar (8 occurrences) with the new MASTER YOUSEF avatar',
  '    body = body.split(OLD_AVATAR_B64).join(WOLF_AVATAR_SQUARE);',
  '    // Detect the subscriber page (it has #subcard or #head3d) and add the empire sub-page theme',
  '    var isSubPage = (body.indexOf("subcard") !== -1 || body.indexOf("head3d") !== -1);',
  '    if (isSubPage){',
  '      // Add wolf-sub-page class to <html> so the sub-page CSS overrides apply',
  '      var dq = String.fromCharCode(34);',
  '      body = body.split("<html dir=").join("<html class=" + dq + "wolf-sub-page" + dq + " dir=");',
  '      body = body.split("<html lang=").join("<html class=" + dq + "wolf-sub-page" + dq + " lang=");',
  '      body = body.split("<html>").join("<html class=" + dq + "wolf-sub-page" + dq + ">");',
  '      body = body.split("<html ").join("<html class=" + dq + "wolf-sub-page" + dq + " ");',
  '    }',
  '    var subStyleTag = isSubPage ? (\'<style id="wolf-sub-css">\' + WOLF_SUB_CSS + \'</style>\') : \'\';',
  '    if (body.indexOf(\'</head>\') !== -1){ body = body.split(\'</head>\').join(\'<style id="wolf-brand-css">\' + WOLF_CSS + \'</style>\' + subStyleTag + \'</head>\'); }',
  '    else if (body.indexOf(\'<head>\') !== -1){ body = body.split(\'<head>\').join(\'<head><style id="wolf-brand-css">\' + WOLF_CSS + \'</style>\' + subStyleTag); }',
  '    else { body = \'<style id="wolf-brand-css">\' + WOLF_CSS + \'</style>\' + subStyleTag + body; }',
  '    // Skip injecting the admin FAB/AI script on the subscriber page (cleaner UX for end users)',
  '    if (!isSubPage){',
  '      if (body.indexOf(\'</body>\') !== -1){ body = body.split(\'</body>\').join(\'<script id="wolf-brand-js">\' + WOLF_JS + \'</scr\' + \'ipt></body>\'); }',
  '      else { body = body + \'<script id="wolf-brand-js">\' + WOLF_JS + \'</scr\' + \'ipt>\'; }',
  '    }',
  '    return body;',
  '  }',
  '',
  '  sn.fetch = async function(req, env, ctx){',
  '    try {',
  '      const url = new URL(req.url);',
  '      const p = url.pathname;',
  '      if (p === \'/_my/status\' || p === \'/_my/banner\' || p === \'/_my/tgbot\' || p.indexOf(\'/_my/api/\') === 0 || p.indexOf(\'/_my/view/\') === 0){',
  '        const myRes = await handleMyRoute(req, env, ctx, _origFetch.bind(sn));',
  '        if (myRes) return myRes;',
  '      }',
  '    } catch(e){ /* fall through */ }',
  '',
  '    let res = await _origFetch.call(this, req, env, ctx);',
  '',
  '    try {',
  '      const ct = res.headers && res.headers.get ? res.headers.get(\'content-type\') : \'\';',
  '      if (ct && ct.indexOf(\'text/html\') !== -1){',
  '        let body = await res.text();',
  '        body = rewriteHtml(body);',
  '        const nh = new Headers(res.headers);',
  '        nh.set(\'content-type\', \'text/html; charset=utf-8\');',
  '        nh.delete(\'content-length\');',
  '        return new Response(body, { status: res.status, statusText: res.statusText, headers: nh });',
  '      }',
  '    } catch(e){ /* fall through */ }',
  '    return res;',
  '  };',
  '})();',
  'export{sn as default};'
].join('\n');

const old = 'var sn=_0x34845a;\nexport{sn as default};';
if (orig.indexOf(old) === -1){
  console.error('ERROR: anchor not found in original worker1.js');
  process.exit(1);
}

// IMPORTANT: use a function replacer (not a string) to avoid $&/$1/$2 special patterns
// in wrapperCode from being interpreted as replacement patterns.
const newCode = orig.replace(old, () => wrapperCode);
fs.writeFileSync(OUT, newCode, 'utf8');

console.log('✓ Assembled worker.js (v2)');
console.log('  Original size:', orig.length, 'chars');
console.log('  New size:', newCode.length, 'chars');
console.log('  Delta: +' + (newCode.length - orig.length), 'chars');
console.log('  CSS literal length:', cssLiteral.length);
console.log('  JS literal length:', jsLiteral.length);
