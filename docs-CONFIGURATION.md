# ⚙️ تنظیمات کامل (Configuration)

> لیست کامل متغیرهای محیطی و تنظیمات پنل

---

## 📋 متغیرهای محیطی

### 🚀 Server

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `PORT` | ❌ | `8787` | پورت سرور (Katabump خودش ست می‌کنه) |
| `HOST` | ❌ | `0.0.0.0` | bind address |
| `NODE_ENV` | ❌ | `production` | محیط اجرا |

### 🌐 Public URL

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `PANEL_HOST` | ✅ | — | دامنه/آی‌پی عمومی پنل (بدون https://) |
| `PUBLIC_URL` | ❌ | = `PANEL_HOST` | URL عمومی کامل |
| `PUBLIC_TLS` | ❌ | (خالی) | `1` اگر پشت TLS هست |
| `PUBLIC_LINK_PORT` | ❌ | = `PORT` | پورت لینک‌ها |
| `SERVER_IP` | ❌ | — | آی‌پی سرور (VPS) |

### 🔐 Admin

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `ADMIN_PASSWORD` | ✅ | `SUKOT` | رمز ورود ادمین |
| `UUID` | ✅ | UUID نمونه | UUID اصلی پنل |

### 📦 Storage

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `KV_DIR` | ❌ | `./kv-data` | مسیر ذخیره KV (Katabump: `/data`) |
| `KATABUMP_ROOT` | ❌ | — | Volume root در Katabump |

### 🤖 Telegram Bot

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `TG_BOT_TOKEN` | ❌ | — | توکن ربات از @BotFather |
| `TG_ADMIN_ID` | ❌ | — | آیدی عددی ادمین |

### 🐺 WOLF AI (z.ai)

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `GEMINI_API_KEY` | ❌ | — | API Key از z.ai |
| `GEMINI_MODEL` | ❌ | `gemini-1.5-flash` | مدل LLM |

### 🎨 Branding

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `BRAND_NAME` | ❌ | `MASTER YOUSEF` | اسم برند کوتاه |
| `BRAND_FULL` | ❌ | `MASTER YOUSEF WOLF EMPIRE` | اسم برند کامل |
| `SUPPORT_URL` | ❌ | `@Kmnbvczx0090` | آیدی پشتیبانی تلگرام |
| `TELEGRAM_CHANNEL` | ❌ | `https://t.me/vpnstan1` | لینک کانال |

### 👤 User Defaults

| متغیر | ضروری | پیش‌فرض | توضیح |
|--------|------|---------|--------|
| `USER_TRAFFIC_GB` | ❌ | `0` | حجم پیش‌فرض کاربر (GB، 0=نامحدود) |
| `USER_EXPIRY_DAYS` | ❌ | `30` | مدت اعتبار پیش‌فرض (روز) |

---

## 📝 نمونه فایل `.env`

```bash
# === Server ===
PORT=8787
HOST=0.0.0.0
NODE_ENV=production

# === Public URL ===
PANEL_HOST="panel.yourdomain.com"
PUBLIC_TLS=1
PUBLIC_LINK_PORT=443

# === Admin ===
ADMIN_PASSWORD="Wolf2026Empire!"
UUID="06472f28-8568-4e61-9bd1-8ed64f25acc1"

# === Storage ===
KV_DIR="./kv-data"

# === Telegram Bot ===
TG_BOT_TOKEN="1234567890:ABC-DEF..."
TG_ADMIN_ID="123456789"

# === WOLF AI ===
GEMINI_API_KEY="your_zai_api_key"
GEMINI_MODEL="gemini-1.5-flash"

# === Branding ===
BRAND_NAME="MASTER YOUSEF"
BRAND_FULL="MASTER YOUSEF WOLF EMPIRE"
SUPPORT_URL="@Kmnbvczx0090"
TELEGRAM_CHANNEL="https://t.me/vpnstan1"

# === User Defaults ===
USER_TRAFFIC_GB=0
USER_EXPIRY_DAYS=30
```

---

## 🔑 wrangler.toml (Cloudflare)

```toml
#:schema node_modules/wrangler/config-schema.json
name = "wolf-empire"
main = "worker.js"
compatibility_date = "2024-11-06"
compatibility_flags = ["nodejs_compat"]

workers_dev = true

[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_ID"

[[durable_objects.bindings]]
name = "LiveCounter"
class_name = "LiveCounter"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["LiveCounter"]

[vars]
UUID = "06472f28-8568-4e61-9bd1-8ed64f25acc1"
TG_BOT_TOKEN = "your_bot_token"
TG_ADMIN_ID = "123456789"
PUBLIC_URL = "wolf-empire.your-subdomain.workers.dev"
GEMINI_API_KEY = "your_zai_api_key"
GEMINI_MODEL = "gemini-1.5-flash"
BRAND_NAME = "MASTER YOUSEF"
BRAND_FULL = "MASTER YOUSEF WOLF EMPIRE"
SUPPORT_URL = "@Kmnbvczx0090"
TELEGRAM_CHANNEL = "https://t.me/vpnstan1"
```

---

## 🔒 Secret Management

### روش ۱: `.env` (ساده)

```bash
cp .env.example .env
nano .env
# مقادیر رو پر کن
```

> ⚠️ `.env` رو در `.gitignore` بذار!

### روش ۲: Cloudflare Secrets

```bash
# تنظیم secret
wrangler secret put GEMINI_API_KEY
# مقدار رو وارد کن

# دیدن لیست secrets
wrangler secret list

# حذف secret
wrangler secret delete GEMINI_API_KEY
```

### روش ۳: Environment Variables در Docker

```bash
docker run -d \
  --name wolf-empire \
  -e GEMINI_API_KEY=your_key \
  -e ADMIN_PASSWORD=your_pass \
  wolf-empire
```

یا با `docker-compose.yml`:

```yaml
environment:
  - GEMINI_API_KEY=${GEMINI_API_KEY}
  - ADMIN_PASSWORD=${ADMIN_PASSWORD}
```

### روش ۴: Systemd Environment

```bash
# در فایل service
sudo systemctl edit wolf-empire

# اضافه کن:
[Service]
Environment="GEMINI_API_KEY=your_key"
Environment="ADMIN_PASSWORD=your_pass"
```

---

## 🌍 متغیرهای خاص هر پلتفرم

### Katabump

| متغیر | مقدار پیشنهادی |
|--------|----------------|
| `PORT` | (خالی - Katabump ست می‌کنه) |
| `KV_DIR` | `/data` |
| `PANEL_HOST` | `wolf-empire.kdns.fr` |

### VPS

| متغیر | مقدار پیشنهادی |
|--------|----------------|
| `PORT` | `8787` |
| `KV_DIR` | `/var/lib/wolf-empire` |
| `PANEL_HOST` | `panel.yourdomain.com` |

### Cloudflare Workers

| متغیر | مقدار پیشنهادی |
|--------|----------------|
| `PUBLIC_URL` | `wolf-empire.sub.workers.dev` |
| (KV خودکار) | (از binding) |

### Docker

| متغیر | مقدار پیشنهادی |
|--------|----------------|
| `KV_DIR` | `/app/kv-data` (volume) |
| `PORT` | `8787` (mapped) |

---

## 📊 محدودیت‌ها

### Cloudflare Workers (Free)

| منبع | محدودیت |
|------|---------|
| Requests | 100,000/day |
| KV reads | 100,000/day |
| KV writes | 1,000/day |
| KV storage | 1 GB |
| CPU time | 10 ms/request |

### Katabump (Free)

| منبع | محدودیت |
|------|---------|
| Disk | ~263 MB |
| RAM | 256 MB |
| CPU | 25% |
| Renewal | هر ۴ روز |

### VPS (متغیر)

بسته به پلن.

---

## 🔄 تغییر مقادیر بدون ری‌استارت

### Cloudflare Workers

```bash
# تغییر env var
wrangler deploy

# یا اگه secret هست
wrangler secret put GEMINI_API_KEY
```

### Node.js / Katabump / VPS

باید ری‌استارت کنی:

```bash
# systemd
sudo systemctl restart wolf-empire

# Docker
docker restart wolf-empire

# Katabump
# در داشبورد، Restart بزن
```

---

## 📚 مثال تنظیمات کامل

### تنظیمات برای VPN تجاری

```bash
ADMIN_PASSWORD="StrongRandomPassword123!"
USER_TRAFFIC_GB=50
USER_EXPIRY_DAYS=30
GEMINI_MODEL="gemini-1.5-flash"  # ارزان
TELEGRAM_CHANNEL="https://t.me/yourchannel"
SUPPORT_URL="@yoursupport"
```

### تنظیمات برای استفاده شخصی

```bash
ADMIN_PASSWORD="PersonalPassword!"
USER_TRAFFIC_GB=0   # نامحدود
USER_EXPIRY_DAYS=0  # بدون انقضا
GEMINI_MODEL="gemini-1.5-pro"  # باکیفیت
```

### تنظیمات برای تست

```bash
ADMIN_PASSWORD="test"
GEMINI_API_KEY=""   # AI غیرفعال
TG_BOT_TOKEN=""     # Telegram غیرفعال
```

---

## 🔍 چک کردن تنظیمات

### روش ۱: API

```bash
# لاگین
curl -X POST https://your-panel/api/login \
  -H "Content-Type: application/json" \
  -d '{"pass":"your_pass"}' \
  -c cookies.txt

# دیدن تنظیمات
curl -b cookies.txt https://your-panel/api/config
```

### روش ۲: پنل ادمین

1. وارد پنل شو
2. روی 👑 کلیک کن
3. بخش "Settings" یا "تنظیمات"

### روش ۳: لاگ سرور

در startup log، این موارد رو چک کن:

```
🐺 Starting MASTER YOUSEF WOLF EMPIRE panel...
   Port: 8787
   Panel host: https://your-domain
   KV storage: /data
   Password: *******
   AI: enabled
   Telegram: enabled
```

---

<div align="center">

### 🐺👑 تنظیمات کامل!

[⬅ بازگشت به README](../README.md)

</div>
