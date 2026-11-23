# 🔧 راهنمای عیب‌یابی (Troubleshooting)

> راه‌حل کامل مشکلات رایج پنل مستر یوسف

---

## 📋 فهرست مشکلات

- [نصب و راه‌اندازی](#نصب-و-راه-اندازی)
- [پنل و UI](#پنل-و-ui)
- [لاگین و احراز هویت](#لاگین-و-احراز-هویت)
- [VPN و کانفیگ](#vpn-و-کانفیگ)
- [KV و ذخیره‌سازی](#kv-و-ذخیره-سازی)
- [Telegram Bot](#telegram-bot)
- [WOLF AI](#wolf-ai)
- [Cloudflare Workers](#cloudflare-workers)
- [Katabump](#katabump)
- [VPS و Docker](#vps-و-docker)

---

## نصب و راه‌اندازی

### ❌ `Cannot find module 'miniflare'`

**علت:** dependencies نصب نشده

**راه‌حل:**

```bash
npm install
# یا
npm install --omit=dev
```

### ❌ `Your index.js file was not found` (Katabump)

**علت:** Katabump به‌طور پیش‌فرض دنبال `index.js` می‌گرده

**راه‌حل:** فایل `server.js` رو به `index.js` تغییر نام بده:

```bash
mv server.js index.js
```

و در `package.json`:

```json
{
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

### ❌ `EADDRINUSE: address already in use`

**علت:** پورت اشغاله

**راه‌حل:**

```bash
# بررسی چه چیزی داره پورت رو اشغال کرده
sudo lsof -i :8787
# یا
sudo netstat -tulpn | grep 8787

# kill کردن
sudo kill -9 PID_NUMBER

# یا تغییر پورت
PORT=8788 node index.js
```

### ❌ `Permission denied` در فایل‌ها

**علت:** مشکل permission

**راه‌حل:**

```bash
sudo chown -R $USER:$USER ~/wolf-empire
chmod +x index.js worker.js
```

### ❌ `Node.js version too old`

**علت:** نسخه Node.js کمتر از ۱۸

**راه‌حل:**

```bash
# نصب Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# بررسی
node --version  # باید v20.x باشه
```

---

## پنل و UI

### ❌ صفحه سفید (Blank Page)

**علت‌های ممکن:**

1. فایل `worker.js` آپلود نشده
2. `PANEL_HOST` اشتباه
3. مشکل CORS

**راه‌حل:**

```bash
# چک کن worker.js وجود داره
ls -lh worker.js

# چک کن PANEL_HOST درست تنظیم شده (بدون https://)
echo $PANEL_HOST

# تست مستقیم
curl http://localhost:8787/
```

### ❌ 404 Not Found

**علت:** مسیر اشتباه

**راه‌حل:**

```bash
# مسیرهای درست:
/              # پنل ادمین
/sub?token=X   # صفحه اشتراک
/api/login     # API لاگین
/api/stats     # API آمار
/_my/api/*     # API ادمین
```

### ❌ 500 Internal Server Error

**علت:** خطای داخلی

**راه‌حل:**

```bash
# دیدن لاگ‌ها
sudo journalctl -u wolf-empire -f
# یا
docker logs -f wolf-empire

# چک کردن KV
ls -la kv-data/
```

### ❌ استایل‌ها بارگذاری نمی‌شن

**علت:** احتمالاً CSP یا مشکل cache

**راه‌حل:**

```bash
# پاک کردن کش مرورگر (Ctrl+Shift+R)
# یا در حالت incognito تست کن
```

### ❌ تصاویر بارگذاری نمی‌شن

**علت:** آواتار base64 خراب شده

**راه‌حل:**

```bash
# چک کردن فایل آواتار
ls -la src/wolf-avatar-*.txt

# اگه خرابه، assembly مجدد
node src/wolf-assemble.js
```

### ❌ فونت فارسی نمایش داده نمی‌شه

**علت:** فونت بارگذاری نشده

**راه‌حل:**

در `src/wolf-brand.css` مطمئن شو این خط هست:

```css
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');

body {
  font-family: 'Vazirmatn', 'Tahoma', sans-serif;
}
```

---

## لاگین و احراز هویت

### ❌ `Invalid password`

**علت:** رمز اشتباه

**راه‌حل:**

```bash
# چک کن ADMIN_PASSWORD در env چیست
echo $ADMIN_PASSWORD

# یا در .env
cat .env | grep ADMIN_PASSWORD
```

### ❌ بعد از لاگین، دوباره صفحه لاگین میاد

**علت:** کوکی ست نمی‌شه

**راه‌حل:**

1. چک کن کوکی `pauth` ست شده (DevTools → Application → Cookies)
2. مطمئن شو `PANEL_HOST` همون دامنه‌ای هست که باز می‌کنی
3. اگه از HTTPS استفاده می‌کنی، `PUBLIC_TLS=1` رو تنظیم کن

### ❌ `401 Unauthorized` در API

**علت:** کوکی auth نشده

**راه‌حل:**

```bash
# اول لاگین کن و کوکی ذخیره کن
curl -c cookies.txt -X POST https://your-panel/api/login \
  -H "Content-Type: application/json" \
  -d '{"pass":"SUKOT"}'

# بعد با کوکی درخواست بزن
curl -b cookies.txt https://your-panel/api/stats
```

### ❌ رمز `SUKOT` کار نمی‌کنه

**علت:** رمز تغییر کرده یا env ست نشده

**راه‌حل:**

```bash
# چک env
echo $ADMIN_PASSWORD

# اگه خالیه، در .env تنظیم کن
echo 'ADMIN_PASSWORD="SUKOT"' >> .env

# ری‌استارت
sudo systemctl restart wolf-empire
```

---

## VPN و کانفیگ

### ❌ کانفیگ‌ها وصل نمی‌شن

**علت‌های ممکن:**

1. روی Katabump هستی (محدودیت اساسی)
2. UUID اشتباه
3. WebSocket بسته شده
4. CDN در دسترس نیست

**راه‌حل:**

```bash
# ۱. اگه روی Katabump هستی، به Cloudflare برو
# ۲. چک کن UUID درست تنظیم شده
echo $UUID

# ۳. تست WebSocket
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: test" -H "Sec-WebSocket-Version: 13" \
  https://your-panel/bp-vless
```

### ❌ پینگ بالاست

**راه‌حل:**

1. سرور نزدیک‌تر انتخاب کن
2. از پروتکل VLESS + WebSocket استفاده کن
3. TLS رو فعال کن
4. در v2rayNG، "Mux" رو غیرفعال کن

### ❌ سرعت پایینه

**راه‌حل:**

1. CDN Cloudflare رو فعال کن
2. از Reality استفاده کن (نسخه‌های آینده)
3. شبکه داخلی Cloudflare رو استفاده کن
4. اطلاعات رو فشرده کن

### ❌ کانفیگ کار می‌کنه ولی اینترنت ندارم

**علت:** DNS مشکل داره

**راه‌حل:**

در v2rayNG:

```
DNS: 1.1.1.1, 8.8.8.8
Domain: sni دامنه‌ت
```

### ❌ QR کد کار نمی‌کنه

**علت:** احتمالاً صفحه اشتراک کامل لود نشده

**راه‌حل:**

1. منتظر بمون تا صفحه کامل لود بشه
2. کش مرورگر رو پاک کن
3. لینک اشتراک رو دستی کپی کن

---

## KV و ذخیره‌سازی

### ❌ داده‌ها بعد از ری‌استارت از بین می‌رن

**علت:** `KV_DIR` به مسیر غیردائمی اشاره می‌کنه

**راه‌حل:**

```bash
# Katabump: از /data استفاده کن
KV_DIR="/data"

# Docker: volume مپ کن
docker run -v wolf-kv:/app/kv-data ...

# VPS: از مسیر دائمی استفاده کن
KV_DIR="/var/lib/wolf-empire"
```

### ❌ `KV namespace not found` (Cloudflare)

**علت:** KV id اشتباه

**راه‌حل:**

```bash
# لیست KV namespaces
wrangler kv:namespace list

# ساختن مجدد
wrangler kv:namespace create KV

# آیدی رو در wrangler.toml جایگزین کن
```

### ❌ KV پر شده

**علت:** حجم زیاد

**راه‌حل:**

```bash
# چک حجم
du -sh kv-data/

# پاکسازی آمار قدیمی
# (از پنل ادمین، بخش "تنظیمات" → "پاکسازی")
```

### ❌ KV write limit

**علت:** محدودیت ۱۰۰۰ write/day در Cloudflare Free

**راه‌حل:**

1. به پلن پولی ارتقا بده
2. تعداد writes رو کم کن
3. آمار رو کم‌تر آپدیت کن

---

## Telegram Bot

### ❌ ربات کار نمی‌کنه

**علت‌های ممکن:**

1. توکن اشتباه
2. آیدی ادمین اشتباه
3. ربات start نشده

**راه‌حل:**

```bash
# چک توکن
echo $TG_BOT_TOKEN

# تست توکن
curl https://api.telegram.org/bot$TG_BOT_TOKEN/getMe

# چک آیدی ادمین
echo $TG_ADMIN_ID
```

### ❌ پیام‌ها نمی‌رسن

**علت:** ربات block شده یا اشتباه

**راه‌حل:**

1. به ربات در تلگرام `/start` بفرست
2. چک کن آیدی درسته
3. چک کن ربات ban نشده

### ❌ تیکت‌ها نمی‌رسن

**راه‌حل:**

```bash
# چک لاگ‌ها برای ارورهای Telegram
grep -i "telegram" /var/log/wolf-empire.log
```

---

## WOLF AI

### ❌ `WOLF AI is disabled`

**علت:** `GEMINI_API_KEY` ست نشده

**راه‌حل:**

```bash
# در .env
echo 'GEMINI_API_KEY="your_api_key"' >> .env

# ری‌استارت
sudo systemctl restart wolf-empire
```

### ❌ `Invalid API key`

**علت:** کلید اشتباه یا منقضی

**راه‌حل:**

1. به https://z.ai برو
2. API Key جدید بساز
3. در env جایگزین کن

### ❌ `Rate limit exceeded`

**علت:** محدودیت درخواست

**راه‌حل:**

1. منتظر بمون (۱ دقیقه)
2. به پلن بالاتر ارتقا بده
3. تعداد درخواست‌ها رو کم کن

### ❌ پاسخ خیلی کند

**راه‌حل:**

```bash
# از مدل سبک‌تر استفاده کن
GEMINI_MODEL="gemini-1.5-flash"

# max_tokens رو کم کن (در کد)
```

### ❌ پاسخ فارسی درست نیست

**راه‌حل:**

```bash
# مدل glm-4 برای فارسی بهتره
GEMINI_MODEL="glm-4"
```

---

## Cloudflare Workers

### ❌ `wrangler login` کار نمی‌کنه

**راه‌حل:**

```bash
# روش ۱: با API Token
export CLOUDFLARE_API_TOKEN="your_token"
wrangler deploy

# روش ۲: با Account ID
export CLOUDFLARE_ACCOUNT_ID="your_id"
```

### ❌ `wrangler deploy` خطا می‌ده

**راه‌حل:**

```bash
# چک ورژن
wrangler --version
npm update -g wrangler

# چک لاگ verbose
wrangler deploy --verbose
```

### ❌ Durable Object migration خطا

**راه‌حل:**

```toml
# در wrangler.toml، tag رو عوض کن
[[migrations]]
tag = "v2"  # از v1 به v2 تغییر بده
new_sqlite_classes = ["LiveCounter"]
```

### ❌ `Worker exceeded CPU limit`

**علت:** ۱۰ms CPU limit در Free

**راه‌حل:**

1. به Workers Paid ارتقا بده ($5/ماه)
2. کد رو بهینه کن
3. عملیات سنگین رو با KV انجام بده

---

## Katabump

### ❌ سرور crash می‌کنه

**علت‌های ممکن:**

1. دیسک پر
2. RAM کم
3. نسخه Node.js قدیمی

**راه‌حل:**

```bash
# چک دیسک
df -h

# پاک کردن node_modules و نصب مجدد
rm -rf node_modules
npm install

# چک RAM
free -h
```

### ❌ دیسک پر شده

**راه‌حل:**

```bash
# پاک کردن فایل‌های غیرضروری
rm -rf node_modules/.cache
rm -rf /tmp/*

# تنظیم KV_DIR به /data
KV_DIR="/data"
```

### ❌ پنل بالا میاد ولی کانفیگ نمی‌ده

**علت:** محدودیت Katabump (VPN واقعی کار نمی‌کنه)

**راه‌حل:** به [Cloudflare Workers](DEPLOY-CLOUDFLARE.md) منتقل شو.

### ❌ تمدید خودکار کار نمی‌کنه

**راه‌حل:**

1. چک کن secrets در GitHub تنظیم شدن:
   - `KATABUMP_EMAIL`
   - `KATABUMP_PASSWORD`
   - `SERVER_ID`

2. workflow رو دستی اجرا کن و لاگ‌ها رو ببین

3. اگه صفحه ورود Katabump تغییر کرده، `renew.py` رو آپدیت کن

---

## VPS و Docker

### ❌ Docker container اجرا نمی‌شه

**راه‌حل:**

```bash
# چک لاگ
docker logs wolf-empire

# چک وضعیت
docker ps -a

# اجرای interactive برای دیباگ
docker run -it --rm wolf-empire /bin/bash
```

### ❌ nginx 502 Bad Gateway

**راه‌حل:**

```bash
# چک کن پنل بالا هست
curl http://localhost:8787/

# چک nginx config
sudo nginx -t

# ری‌استارت nginx
sudo systemctl restart nginx

# چک لاگ‌ها
sudo tail -f /var/log/nginx/error.log
```

### ❌ systemd service کار نمی‌کنه

**راه‌حل:**

```bash
# چک وضعیت
sudo systemctl status wolf-empire

# چک لاگ
sudo journalctl -u wolf-empire -f

# ری‌استارت
sudo systemctl restart wolf-empire
```

### ❌ Let's Encrypt کار نمی‌کنه

**راه‌حل:**

```bash
# چک پورت ۸۰ بازه
sudo ufw allow 80/tcp

# DNS دامنه رو چک کن
dig panel.yourdomain.com

# مجدد تلاش کن
sudo certbot --nginx -d panel.yourdomain.com
```

---

## ابزارهای دیباگ

### 📊 دیدن لاگ‌ها

```bash
# Cloudflare
wrangler tail

# Node.js / VPS
sudo journalctl -u wolf-empire -f

# Docker
docker logs -f wolf-empire

# Katabump
# از داشبورد، بخش Console
```

### 🔍 تست API

```bash
# لاگین
curl -v -c cookies.txt -X POST https://your-panel/api/login \
  -H "Content-Type: application/json" \
  -d '{"pass":"SUKOT"}'

# آمار
curl -v -b cookies.txt https://your-panel/api/stats

# کاربران
curl -v -b cookies.txt https://your-panel/api/users
```

### 📈 مانیتورینگ

```bash
# مصرف RAM/CPU
htop

# دیسک
df -h

# شبکه
sudo netstat -tulpn

# پروسه‌ها
ps aux | grep node
```

---

## 🆘 پشتیبانی

اگه هیچ‌کدوم از راه‌حل‌ها کار نکرد:

1. **لاگ کامل** رو جمع کن
2. **اسکرین‌شات** از ارور بگیر
3. **محیط اجرا** رو مشخص کن (Cloudflare/Katabump/VPS)
4. در GitHub Issues با label `bug` گزارش بده

### راه‌های ارتباطی

- 📧 **Telegram:** [@Kmnbvczx0090](https://t.me/Kmnbvczx0090)
- 📢 **Channel:** [t.me/vpnstan1](https://t.me/vpnstan1)
- 🐛 **Issues:** [GitHub Issues](https://github.com/USERNAME/wolf-empire/issues)

---

## 📋 گزارش باگ قالب

وقتی باگ گزارش می‌دی، این اطلاعات رو اضافه کن:

````markdown
## 🐛 Bug Report

### شرح مشکل
[توضیح کوتاه]

### محیط
- پلتفرم: [Cloudflare / Katabump / VPS / Docker]
- Node.js version: [node --version]
- مرورگر: [Chrome / Firefox / Safari]
- دستگاه: [Android / iOS / Windows / Linux]

### مراحل بازتولید
1. ...
2. ...
3. ...

### رفتار مورد انتظار
[چه چیزی باید اتفاق بیفته]

### رفتار واقعی
[چه چیزی اتفاق افتاد]

### لاگ‌ها
```bash
[لاگ‌های مربوطه]
```

### اسکرین‌شات
[اگه ممکنه]
````

---

<div align="center">

### 🐺👑 مشکل حل نشد؟

[⬅ بازگشت به README](../README.md) | [FAQ](FAQ.md)

</div>
