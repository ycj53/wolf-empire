# 🐳 آموزش نصب روی Katabump

> **توجه مهم:** Katabump فقط **پنل UI و صفحه اشتراک** رو بالا میاره. VPN واقعی (VLESS/VMess) اینجا کار نمی‌کنه چون `cloudflare:sockets` فقط روی Cloudflare کار می‌کنه. اگه VPN واقعی می‌خوای، از [Cloudflare Workers](DEPLOY-CLOUDFLARE.md) استفاده کن.

## 📋 پیش‌نیازها

- اکانت Katabump (رایگان) — https://katabump.com
- GitHub (برای تمدید خودکار)

## 🚀 نصب قدم به قدم

### مرحله ۱: ثبت‌نام در Katabump

1. برو به https://katabump.com
2. روی **Sign Up** کلیک کن
3. اکانت بساز و لاگین کن

### مرحله ۲: ساخت سرور جدید

1. داشبورد → **"Create Server"** یا **"New App"**
2. تنظیمات:
   - **Name:** `wolf-empire`
   - **Runtime:** Node.js (نسخه ۱۸ یا ۲۰)
   - **Plan:** Free
3. دکمه **Create** رو بزن
4. دامنه‌ای که بهت میده رو یادداشت کن (مثلاً `wolf-empire.kdns.fr`)
5. آیدی سرور رو از URL بردار: `katabump.com/server/12345` → `12345`

### مرحله ۳: آپلود فایل‌ها

از پوشه `deploy/katabump/` این فایل‌ها رو آپلود کن:

| فایل | توضیح |
|------|--------|
| `worker.js` | پنل اصلی (۳.۲MB) |
| `index.js` | اجرا کننده Node.js |
| `package.json` | dependencies |
| `.env.example` | نمونه تنظیمات |

> ⚠️ **نکته:** Katabump به‌طور پیش‌فرض دنبال `index.js` می‌گرده. فایل `server.js` رو به `index.js` rename کن.

### مرحله ۴: تنظیم `.env`

فایل `.env.example` رو به `.env` تغییر نام بده و ویرایش کن:

```bash
# مهم‌ترین متغیرها
PANEL_HOST="wolf-empire.kdns.fr"     # دامنه واقعی Katabump
ADMIN_PASSWORD="Wolf2026Empire!"     # رمز قوی
UUID="06472f28-8568-4e61-9bd1-8ed64f25acc1"  # UUID جدید بساز
KV_DIR="/data"                        # volume دائمی Katabump
PUBLIC_TLS=1
```

### مرحله ۵: تنظیم Environment Variables در داشبورد

تو داشبورد Katabump → **Settings → Environment Variables**:

| کلید | مقدار |
|------|--------|
| `NODE_ENV` | `production` |
| `PANEL_HOST` | `wolf-empire.kdns.fr` |
| `ADMIN_PASSWORD` | `Wolf2026Empire!` |
| `UUID` | UUID که ساختی |
| `KV_DIR` | `/data` |
| `PUBLIC_TLS` | `1` |

> 💡 Katabump خودش `PORT` رو ست می‌کنه. تو env نذار.

### مرحله ۶: تنظیم Startup Command

تو داشبورد Katabump → **Settings → Startup Command**:

```bash
npm install && node index.js
```

یا اگه dependencies قبلاً نصب شدن:

```bash
npm start
```

### مرحله ۷: Start!

دکمه **Start** رو بزن. لاگ‌ها باید اینطوری باشن:

```
[INFO] Node.js version: v26.12.1 (npm 11.20.0)
📦 Loaded worker.js (3220.5 KB)
🐺 Starting MASTER YOUSEF WOLF EMPIRE panel...
   Port: 20191
   Panel host: https://wolf-empire.kdns.fr
   KV storage: /data

🐺👑 MASTER YOUSEF WOLF EMPIRE — Panel is LIVE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ➜  Local:    http://localhost:20191
  ➜  Public:   https://wolf-empire.kdns.fr
  ➜  Password: Wolf2026Empire!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛓ chains ready  •  👑 crown shining  •  🐺 wolf watching
```

### مرحله ۸: ورود به پنل

- آدرس: `https://wolf-empire.kdns.fr`
- رمز: همون `ADMIN_PASSWORD` که گذاشتی

---

## 🔄 تمدید خودکار (مهم!)

Katabump رایگان **هر ۴ روز** یه بار باید تمدید بشه، وگرنه سرور پاک می‌شه.

### روش: GitHub Actions

#### قدم ۱: ساخت GitHub Repository

```bash
# کلون ریپو
git clone https://github.com/USERNAME/wolf-empire.git
cd wolf-empire

# یه ریپو جدید برای تمدید بساز (یا از همین استفاده کن)
```

#### قدم ۲: اضافه کردن Secrets

تو ریپو برو به: **Settings → Secrets and variables → Actions → New repository secret**

این ۳ secret رو اضافه کن:

| Secret Name | Value |
|-------------|-------|
| `KATABUMP_EMAIL` | ایمیل لاگین Katabump |
| `KATABUMP_PASSWORD` | رمز لاگین Katabump |
| `SERVER_ID` | آیدی سرور از URL داشبورد |

#### قدم ۳: تست دستی

1. برو به تب **Actions** در ریپو
2. workflow **"Katabump Renewal"** رو انتخاب کن
3. روی **Run workflow** کلیک کن
4. نتیجه رو چک کن — باید موفق باشه

#### قدم ۴: تمدید خودکار

Workflow از قبل تنظیم شده که هر ۳ روز یه بار اجرا بشه:

```yaml
# .github/workflows/katabump-renew.yml
on:
  schedule:
    - cron: '0 3 */3 * *'  # هر ۳ روز ساعت ۰۳:۰۰ UTC
  workflow_dispatch: # اجرای دستی
```

می‌تونی زمان‌بندی رو هم تغییر بدی. مثلاً هر روز:

```yaml
on:
  schedule:
    - cron: '0 3 * * *'  # هر روز ساعت ۰۳:۰۰ UTC
```

### نحوه کار تمدید خودکار

اسکریپت `renew.py` این کارها رو می‌کنه:

1. با Playwright به katabump.com لاگین می‌شه
2. به صفحه سرور می‌ره
3. دکمه **Renew / تمدید** رو پیدا و کلیک می‌کنه
4. اسکرین‌شات از نتیجه می‌گیره (در صورت خطا)

---

## ⚠️ محدودیت‌های Katabump

### ❌ چه چیزی کار نمی‌کنه

| قابلیت | دلیل |
|--------|------|
| VPN واقعی (VLESS/VMess) | `cloudflare:sockets` فقط روی Cloudflare |
| WebSocket upgrade برای ترافیک VPN | محدودیت Node.js adapter |
| چند پورت همزمان | Katabump فقط یه پورت می‌ده |
| HTTPS خودکار | باید از دامنه Katabump استفاده کنی |

### ✅ چه چیزی کار می‌کنه

| قابلیت | وضعیت |
|--------|-------|
| پنل ادمین UI | ✅ |
| صفحه اشتراک | ✅ |
| WOLF AI 🐺 | ✅ (با GEMINI_API_KEY) |
| مدیریت کاربران | ✅ |
| تیکت‌ها و Telegram | ✅ |
| آمار و نمودارها | ✅ |
| بکاپ | ✅ |

---

## 🐛 عیب‌یابی

### مشکل: `Your index.js file was not found`

```
[ERROR] Your index.js file was not found.
```

**راه‌حل:** فایل `server.js` رو به `index.js` تغییر نام بده.

```bash
mv server.js index.js
```

### مشکل: `EADDRINUSE` (پورت اشغاله)

```
Error: listen EADDRINUSE: address already in use 0.0.0.0:8080
```

**راه‌حل:** `PORT` رو از env vars حذف کن. Katabump خودش ست می‌کنه.

### مشکل: دیسک پر شده

```
Out of memory: false
Disk usage: 716 MB / 263 MB
```

**راه‌حل:**

1. `node_modules` رو از فایل منیجر پاک کن
2. تنظیم کن `npm install` فقط موقع start اجرا بشه
3. اگه بازم پر شد، از نسخه سبک‌تر استفاده کن (فقط miniflare بدون wrangler)

### مشکل: صفحه اشتراک باز نمی‌شه

```
404 Not Found
```

**راه‌حل:** چک کن:
- `PANEL_HOST` درست تنظیم شده (بدون `https://`)
- `KV_DIR=/data` هست
- کاربر از قبل ساخته شده (از پنل ادمین)

### مشکل: لاگین نمی‌شه

**راه‌حل:**
- چک کن `ADMIN_PASSWORD` در env همونیه که وارد می‌کنی
- کش مرورگر رو پاک کن
- کوکی `pauth` رو در DevTools چک کن

### مشکل: KV داده‌ها از بین رفت

**راه‌حل:** `KV_DIR` باید `/data` باشه (volume دائمی Katabump). اگه `/tmp` یا مسیر دیگه‌ای باشه، بعد از restart پاک می‌شه.

---

## 💰 هزینه

| منبع | هزینه |
|------|-------|
| Katabump Free | رایگان |
| GitHub Actions (تمدید) | رایگان |
| دامنه kdns.fr | رایگان |

**کلاً رایگان!** 🎉

---

## ✅ چک‌لیست نهایی

- [ ] اکانت Katabump ساخته شد
- [ ] سرور Node.js ساخته شد
- [ ] ۴ فایل آپلود شد (`worker.js`, `index.js`, `package.json`, `.env`)
- [ ] `.env` با مقادیر واقعی پر شد
- [ ] Environment Variables در داشبورد تنظیم شد
- [ ] Startup Command = `npm install && node index.js`
- [ ] سرور Start شد
- [ ] لاگ "Panel is LIVE" رو نشون داد
- [ ] پنل روی دامنه باز شد
- [ ] لاگین موفق بود
- [ ] GitHub repo برای تمدید ساخته شد
- [ ] ۳ secret در GitHub اضافه شد
- [ ] تمدید خودکار تست شد

---

## 🎯 توصیه نهایی

اگه فقط می‌خوای پنل UI رو تست کنی یا نمایش بدی، Katabump عالیه. ولی اگه **VPN واقعی** با کانفیگ‌های کار می‌کنن می‌خوای، حتماً از [Cloudflare Workers](DEPLOY-CLOUDFLARE.md) استفاده کن — هم رایگانه هم کامل.

---

<div align="center">

### 🐺👑 موفق باشی داداش!

[⬅ بازگشت به README](../README.md)

</div>
