# 🚀 آموزش نصب روی Cloudflare Workers

> **پیشنهادی** — این تنها روشی هست که VPN واقعی کار می‌کنه (VLESS/VMess با WebSocket)

## 📋 پیش‌نیازها

- اکانت Cloudflare (رایگان)
- Node.js 18 یا بالاتر
- npm

## 🛠️ مرحله ۱: نصب Wrangler

```bash
# نصب Wrangler CLI
npm install -g wrangler

# بررسی نسخه
wrangler --version
```

## 🔐 مرحله ۲: ورود به Cloudflare

```bash
wrangler login
```

مرورگر باز میشه و ازت می‌خواد به Cloudflare اجازه بدی. روی **Allow** کلیک کن.

## 📦 مرحله ۳: دریافت فایل‌ها

```bash
# کلون از GitHub
git clone https://github.com/USERNAME/wolf-empire.git
cd wolf-empire

# یا اگه فایل zip داری
unzip wolf-empire-panel.zip
cd wolf-empire
```

## 🗃️ مرحله ۴: ساخت KV Namespace

KV برای ذخیره کاربران، تنظیمات و آمار استفاده می‌شه:

```bash
wrangler kv:namespace create KV
```

خروجی شبیه این می‌شه:

```json
{
  "id": "abc123def456...",
  "title": "wolf-empire-KV"
}
```

آیدی `id` رو کپی کن.

## ⚙️ مرحله ۵: تنظیم wrangler.toml

فایل `wrangler.toml.example` رو به `wrangler.toml` تغییر نام بده و ویرایش کن:

```bash
cp wrangler.toml.example wrangler.toml
nano wrangler.toml
```

این موارد رو تغییر بده:

```toml
name = "wolf-empire"           # اسم ورکرت
main = "worker.js"
compatibility_date = "2024-11-06"
compatibility_flags = ["nodejs_compat"]

workers_dev = true

[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_ID_HERE"          # ← KV id از مرحله ۴

[[durable_objects.bindings]]
name = "LiveCounter"
class_name = "LiveCounter"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["LiveCounter"]

[vars]
UUID = "06472f28-8568-4e61-9bd1-8ed64f25acc1"   # ← UUID جدید بساز
TG_BOT_TOKEN = "your_bot_token"                  # ← توکن ربات تلگرام
TG_ADMIN_ID = "123456789"                        # ← آیدی عددی شما
PUBLIC_URL = "wolf-empire.your-subdomain.workers.dev"
GEMINI_API_KEY = ""                              # اختیاری
GEMINI_MODEL = "gemini-1.5-flash"
BRAND_NAME = "MASTER YOUSEF"
BRAND_FULL = "MASTER YOUSEF WOLF EMPIRE"
SUPPORT_URL = "@Kmnbvczx0090"
TELEGRAM_CHANNEL = "https://t.me/vpnstan1"
```

### 🔑 تولید UUID جدید

```bash
# روش ۱: wrangler
wrangler uuid

# روش ۲: node
node -e "console.log(crypto.randomUUID())"

# روش ۳: آنلاین
# https://www.uuidgenerator.net
```

## 🚀 مرحله ۶: Deploy

```bash
wrangler deploy
```

بعد از موفقیت، خروجی شبیه این می‌شه:

```
Uploaded wolf-empire (3.2 sec)
Published wolf-empire (4.5 sec)
  https://wolf-empire.your-subdomain.workers.dev
```

پنلت روی این آدرس در دسترسه!

## 🔑 مرحله ۷: ورود به پنل

1. آدرس پنل رو باز کن: `https://wolf-empire.your-subdomain.workers.dev`
2. رمز پیش‌فرض: `SUKOT`
3. دکمه 👑 پایین سمت راست = ابزارهای ادمین

> ⚠️ **مهم:** بعد از اولین ورود، رمز رو از بخش تنظیمات تغییر بده.

## 🤖 مرحله ۸: تنظیم Telegram Bot (اختیاری)

```bash
# ۱. توکن ربات بگیر
# به @BotFather در تلگرام پیام بده:
/newbot
# اسم و username ربات رو بده
# توکن رو کپی کن

# ۲. آیدی عددی خودت رو بگیر
# به @userinfobot پیام بده
# آیدی عددی رو کپی کن

# ۳. در wrangler.toml تنظیم کن
TG_BOT_TOKEN = "1234567890:ABC..."
TG_ADMIN_ID = "123456789"
```

## 🌐 مرحله ۹: اتصال دامنه شخصی (اختیاری)

اگه دامنه داری و می‌خوای پنل رو روی هم وصل کنی:

```bash
# ۱. دامنه رو در Cloudflare اضافه کن (اگه هنوز نیست)
# ۲. Workers → Routes → Add route

# در wrangler.toml:
[[routes]]
pattern = "panel.yourdomain.com"
custom_domain = true
```

## 📊 تست و بررسی

### تست دستی

```bash
# ۱. پنل رو باز کن
curl https://wolf-empire.your-subdomain.workers.dev/

# ۲. تست لاگین
curl -X POST https://wolf-empire.your-subdomain.workers.dev/api/login \
  -H "Content-Type: application/json" \
  -d '{"pass":"SUKOT"}' \
  -c cookies.txt

# ۳. تست آمار
curl -b cookies.txt https://wolf-empire.your-subdomain.workers.dev/api/stats
```

### تست با Playwright

```bash
# نصب playwright
npm install -D playwright
npx playwright install chromium

# تست لاگین
node -e "
const {chromium} = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://wolf-empire.your-subdomain.workers.dev');
  await page.fill('#login-pass', 'SUKOT');
  await page.click('#btn-login');
  await page.waitForTimeout(2000);
  console.log('Title:', await page.title());
  await browser.close();
})();
"
```

## 🔄 بروزرسانی پنل

```bash
# ویرایش فایل‌های src/
nano src/wolf-brand.css

# Assembly مجدد
node src/wolf-assemble.js

# Deploy مجدد
wrangler deploy
```

## 💰 هزینه

| منبع | هزینه |
|------|-------|
| Cloudflare Workers | رایگان (100K requests/day) |
| KV | رایگان (1GB storage) |
| Durable Objects | رایگان |
| Custom Domain | رایگان (اگه دامنه داری) |

**کلاً رایگان!** 🎉

## 🐛 مشکلات رایج

### مشکل: `wrangler login` کار نمی‌کنه

```bash
# روش ۱: با توکن API لاگین کن
export CLOUDFLARE_API_TOKEN="your_api_token"
wrangler deploy

# روش ۲: با آیدی اکانت
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
```

### مشکل: `KV namespace not found`

```bash
# چک کن KV id درست تنظیم شده
wrangler kv:namespace list

# اگه نبود، دوباره بساز
wrangler kv:namespace create KV
```

### مشکل: `Durable Object migration failed`

```bash
# برای اولین deploy، migration لازمه
wrangler deploy
# اگه خطا داد، tag رو عوض کن
# در wrangler.toml:
# [[migrations]]
# tag = "v2"
# new_sqlite_classes = ["LiveCounter"]
```

### مشکل: پنل بالا میاد ولی لاگین نمی‌شه

- چک کن `UUID` و `ADMIN_PASSWORD` درست تنظیم شدن
- کش مرورگر رو پاک کن
- در حالت incognito تست کن

---

## ✅ چک‌لیست نهایی

- [ ] Wrangler نصب شد
- [ ] به Cloudflare لاگین شد
- [ ] KV namespace ساخته شد
- [ ] `wrangler.toml` تنظیم شد (UUID, KV id, env vars)
- [ ] `wrangler deploy` موفق بود
- [ ] پنل روی workers.dev باز می‌شه
- [ ] لاگین موفق بود
- [ ] Drawer 👑 باز می‌شه
- [ ] (اختیاری) Telegram bot تنظیم شد
- [ ] (اختیاری) دامنه شخصی وصل شد

---

<div align="center">

### 🐺👑 موفق باشی داداش!

[⬅ بازگشت به README](../README.md)

</div>
