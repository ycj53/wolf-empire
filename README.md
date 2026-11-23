<div align="center">

# 🐺👑 MASTER YOUSEF WOLF EMPIRE

### پنل مدیریت VPN کامل با تم امپراطوری نئون — Cloudflare Workers + Node.js

[![Deploy](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](docs/DEPLOY-CLOUDFLARE.md)
[![Katabump](https://img.shields.io/badge/Host%20on-Katabump-blueviolet?style=for-the-badge&logo=docker&logoColor=white)](docs/DEPLOY-KATABUMP.md)
[![VPS](https://img.shields.io/badge/Run%20on-VPS%20%2F%20Docker-success?style=for-the-badge&logo=docker&logoColor=white)](docs/DEPLOY-VPS.md)
[![WOLF AI](https://img.shields.io/badge/WOLF%20AI-z.ai-FFD700?style=for-the-badge&logo=googlegemini&logoColor=black)](docs/AI-FEATURES.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.7.0-FFD700?style=flat-square)]()
[![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4-FF1493?style=flat-square)]()
[![Persian RTL](https://img.shields.io/badge/UI-Persian%20RTL-00897B?style=flat-square)]()

### ⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓
### 🐾 🐾 🐾

</div>

---

## 📖 درباره پروژه

**MASTER YOUSEF WOLF EMPIRE** یک پنل مدیریت VPN کامل و حرفه‌ای است که با تم **Neon Fantasy Empire** (طلایی/بنفش/سبز نئونی) طراحی شده. این پنل از همان کد اصلی Cloudflare Worker استفاده می‌کند و به‌طور همزمان روی **Cloudflare Workers، Katabump، VPS و Docker** اجرا می‌شود.

> **نکته مهم:** این پنل برای اولین بار قابلیت اجرای **همان کد** را روی چندین پلتفرم مختلف فراهم می‌کند — بدون تغییر در منطق پنل.

### ✨ ویژگی‌های برجسته

- 🎨 **تم Neon Fantasy Empire** — طلایی، بنفش، سبز نئونی
- 👑 **ابزار ادمین (Drawer)** با تاج و مدالیون‌های امپراطوری
- 🐺 **WOLF AI** — دستیار هوشمند مبتنی بر Gemini با تاریخچه چت
- 📱 **صفحه اشتراک فارسی RTL** با QR کد و لینک‌های کپی
- 🔔 **Telegram Bot** برای تیکت‌ها و اعلان‌ها
- 📊 **آمار زنده** کاربران، آنلاین، ترافیک
- 💾 **بکاپ خودکار** و بازیابی
- 🌐 **پروتکل‌های VLESS، VMess، Trojan، Reality**
- 🔒 **احراز هویت امن** با کوکی pauth
- 🇮🇷 **رابط کاربری فارسی راست‌چین (RTL)**

---

## 🚀 نصب سریع

### روش ۱: Cloudflare Workers (پیشنهادی — VPN واقعی کار می‌کند)

```bash
# ۱. کلون کن
git clone https://github.com/USERNAME/wolf-empire.git
cd wolf-empire

# ۲. نصب Wrangler
npm install -g wrangler

# ۳. ورود به Cloudflare
wrangler login

# ۴. ساخت KV namespace
wrangler kv:namespace create KV
# آیدی KV رو در wrangler.toml جایگزین کن

# ۵. ویرایش تنظیمات
nano wrangler.toml.example
mv wrangler.toml.example wrangler.toml

# ۶. Deploy!
wrangler deploy
```

📖 [آموزش کامل Cloudflare](docs/DEPLOY-CLOUDFLARE.md)

### روش ۲: Katabump (رایگان — فقط پنل UI)

```bash
# فایل‌های پوشه deploy/katabump/ رو آپلود کن
# Startup Command: npm install && node index.js
```

📖 [آموزش کامل Katabump](docs/DEPLOY-KATABUMP.md)

### روش ۳: VPS / Docker (پنل کامل)

```bash
docker build -t wolf-empire .
docker run -d -p 8787:8787 -v wolf-kv:/app/kv-data wolf-empire
```

📖 [آموزش کامل VPS](docs/DEPLOY-VPS.md)

---

## 🤖 آموزش نصب z.ai (هوش مصنوعی)

پنل ما از **z.ai SDK** برای قابلیت‌های AI استفاده می‌کند. برای فعال‌سازی:

### مرحله ۱: نصب z.ai CLI

```bash
# نصب z.ai CLI (روش npm)
npm install -g @zai/sdk

# یا دانلود مستقیم از https://z.ai
```

### مرحله ۲: دریافت API Key

1. به https://z.ai برو
2. اکانت بساز
3. به بخش **API Keys** برو
4. یه کلید جدید بساز

### مرحله ۳: تنظیم در پنل

در فایل `.env` یا تنظیمات Cloudflare:

```bash
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### مرحله ۴: فعال‌سازی WOLF AI 🐺

1. وارد پنل شو
2. روی دکمه 🐺 پایین سمت چپ کلیک کن
3. شروع به چت کن!

📖 [آموزش کامل AI Features](docs/AI-FEATURES.md)

---

## 📂 ساختار پروژه

```
wolf-empire/
├── worker.js                    # پنل اصلی Cloudflare Worker (3.2MB)
├── wrangler.toml.example        # تنظیمات Cloudflare
├── src/                         # سورس کد قابل ویرایش
│   ├── wolf-brand.css           # تم پنل ادمین
│   ├── wolf-brand.js            # منطق drawer و ابزارها
│   ├── wolf-sub-page.css        # تم صفحه اشتراک
│   ├── admin-handlers.js        # API endpoints ادمین
│   ├── wolf-assemble.js         # اسکریپت assembly
│   └── wolf-avatar-*.txt        # آواتار base64
├── deploy/
│   ├── cloudflare/              # تنظیمات Cloudflare
│   ├── katabump/                # نسخه Node.js (index.js)
│   └── vps/                     # Dockerfile
├── docs/                        # آموزش‌ها
├── .github/
│   ├── workflows/               # GitHub Actions
│   └── scripts/                 # اسکریپت تمدید Katabump
├── scripts/                     # اسکریپت‌های کمکی
└── examples/                    # نمونه‌ها
```

---

## 🎨 ویژگی‌های پنل

### پنل ادمین (Admin Dashboard)

| بخش | توضیح |
|------|--------|
| 📊 آمار زنده | کاربران، آنلاین، ترافیک، تیکت‌ها |
| 👥 مدیریت کاربران | ساخت، ویرایش، حذف، بکاپ |
| 🎫 تیکت‌ها | سیستم تیکت کامل با Telegram |
| 🔔 اعلان‌ها | اعلان سراسری به کاربران |
| 🔧 حالت تعمیر | قطع موقت سرویس |
| 💾 بکاپ | بکاپ کامل از داده‌ها |
| 🐺 WOLF AI | دستیار هوشمند |
| 📈 نمودارها | آمار مصرف و رشد |

### ابزار ادمین (Drawer 👑)

- 🏛️ **هدر امپراطوری** با تاج 👑 و عنوان MASTER YOUSEF
- ۳ **مدالیون طلایی** (WOLF / X4G / MASTER)
- **Feature chips** (TLS، پینگ، سرعت، اپراتورها)
- **آمار سریع** با کارت‌های طلایی
- **عملیات سریع** (وصل/قطع همه، بکاپ)
- **ابزار پروکسی** و مدیریت آی‌پی
- فوتر با **زنجیرها ⛓ و پنجه‌های گرگ 🐾**

### صفحه اشتراک (Subscriber Page)

- تم امپراطوری نئون (مشابه پنل ادمین)
- کارت‌های border طلایی با glow
- لینک اشتراک + QR کد
- مشخصات فنی، دانلود نرم‌افزار، تست پینگ
- پروکسی تلگرام MTProto

---

## ⚙️ متغیرهای محیطی

| متغیر | ضروری | توضیح | پیش‌فرض |
|--------|------|--------|---------|
| `UUID` | ✅ | UUID اصلی پنل | UUID نمونه |
| `ADMIN_PASSWORD` | ✅ | رمز ورود ادمین | `SUKOT` |
| `PANEL_HOST` | ✅ | دامنه/آی‌پی عمومی پنل | — |
| `PUBLIC_TLS` | ❌ | `1` اگر پشت TLS هست | (خالی) |
| `KV_DIR` | ❌ | مسیر ذخیره KV | `./kv-data` |
| `TG_BOT_TOKEN` | ❌ | توکن ربات تلگرام | (خالی) |
| `TG_ADMIN_ID` | ❌ | آیدی عددی ادمین | (خالی) |
| `GEMINI_API_KEY` | ❌ | کلید Gemini برای WOLF AI | (خالی) |
| `BRAND_NAME` | ❌ | اسم برند | `MASTER YOUSEF` |
| `BRAND_FULL` | ❌ | اسم کامل | `MASTER YOUSEF WOLF EMPIRE` |
| `SUPPORT_URL` | ❌ | آیدی پشتیبانی تلگرام | `@Kmnbvczx0090` |
| `TELEGRAM_CHANNEL` | ❌ | لینک کانال | `https://t.me/vpnstan1` |

📖 [لیست کامل متغیرها](docs/CONFIGURATION.md)

---

## 🛠️ توسعه و سفارشی‌سازی

### تغییر تم پنل

```bash
# ویرایش فایل تم
nano src/wolf-brand.css

# Assembly مجدد
node src/wolf-assemble.js

# Deploy مجدد
wrangler deploy
```

### افزودن قابلیت جدید

```bash
# ویرایش منطق
nano src/wolf-brand.js

# Assembly
node src/wolf-assemble.js

# تست
wrangler dev
```

📖 [راهنمای سفارشی‌سازی](docs/CUSTOMIZATION.md)

---

## 📊 مقایسه پلتفرم‌ها

| پلتفرم | هزینه | VPN واقعی | پایداری | مناسب برای |
|--------|------|-----------|---------|------------|
| **Cloudflare Workers** | رایگان | ✅ کامل | ⭐⭐⭐⭐⭐ | بهترین گزینه |
| **VPS (DO/Hetzner)** | $5/ماه | ✅ کامل | ⭐⭐⭐⭐⭐ | حرفه‌ای |
| **Docker (هر جا)** | متغیر | ✅ با nginx | ⭐⭐⭐⭐⭐ | حرفه‌ای |
| **Katabump رایگان** | رایگان | ❌ فقط UI | ⭐⭐⭐ | تست |
| **Railway** | $5/ماه | ⚠️ ممنوع | ⭐⭐⭐⭐ | فقط پنل |

---

## 🔧 عیب‌یابی

| مشکل | راه‌حل |
|------|--------|
| پنل بالا نمیاد | چک کن `PORT` و `PANEL_HOST` درست تنظیم شدن |
| لاگین نمی‌شه | `ADMIN_PASSWORD` رو در env چک کن |
| KV داده‌ها از بین رفت | `KV_DIR=/data` روی Katabump، volume روی Docker |
| کانفیگ‌ها کار نمی‌کنن | روی Katabump ممکن نیست — از Cloudflare استفاده کن |
| WOLF AI کار نمی‌کنه | `GEMINI_API_KEY` رو تنظیم کن |

📖 [راهنمای کامل عیب‌یابی](docs/FAQ.md)

---

## 📚 آموزش‌ها

| آموزش | توضیح |
|-------|-------|
| [🚀 نصب Cloudflare](docs/DEPLOY-CLOUDFLARE.md) | نصب کامل روی Cloudflare Workers |
| [🐳 نصب Katabump](docs/DEPLOY-KATABUMP.md) | نصب رایگان روی Katabump |
| [🖥️ نصب VPS](docs/DEPLOY-VPS.md) | نصب روی VPS با Docker |
| [🤖 AI Features](docs/AI-FEATURES.md) | راه‌اندازی WOLF AI با z.ai |
| [⚙️ Configuration](docs/CONFIGURATION.md) | تمام متغیرهای محیطی |
| [🎨 Customization](docs/CUSTOMIZATION.md) | سفارشی‌سازی تم و برند |
| [❓ FAQ](docs/FAQ.md) | سوالات متداول |
| [🔧 Troubleshooting](docs/TROUBLESHOOTING.md) | عیب‌یابی کامل |

---

## 🔄 تمدید خودکار Katabump

Katabump رایگان هر ۴ روز باید تمدید بشه. این کار با GitHub Actions خودکار می‌شه:

1. ریپو رو fork کن
2. به **Settings → Secrets** این‌ها رو اضافه کن:
   - `KATABUMP_EMAIL`
   - `KATABUMP_PASSWORD`
   - `SERVER_ID`
3. هر ۳ روز GitHub Actions خودش تمدید می‌کنه

📖 [آموزش کامل تمدید خودکار](docs/DEPLOY-KATABUMP.md#تمدید-خودکار)

---

## 📸 گالری

<div align="center">

| پنل ادمین | ابزار ادمین (Drawer) | صفحه اشتراک |
|----------|---------------------|-------------|
| ![Dashboard](panel-dashboard.png) | ![Drawer](panel-drawer-upgraded.png) | ![Sub Page](sub-page-after.png) |

</div>

---

## 📋 Roadmap

- [x] تم Neon Fantasy Empire
- [x] WOLF AI با Gemini
- [x] پشتیبانی از Katabump
- [x] تمدید خودکار با GitHub Actions
- [x] نسخه Docker
- [ ] اپ موبایل (Flutter)
- [ ] پشتیبانی از Reality
- [ ] سیستم پلن‌های اشتراک
- [ ] درگاه پرداخت

---

## 🤝 مشارکت

مشارکت‌ها رو خوشحال می‌شیم بپذیریم!

1. Fork کن
2. یه branch بساز (`git checkout -b feature/amazing-feature`)
3. Commit کن (`git commit -m 'Add amazing feature'`)
4. Push کن (`git push origin feature/amazing-feature`)
5. یه Pull Request باز کن

---

## 📜 License

این پروژه تحت لایسنس MIT منتشر شده. [LICENSE](LICENSE) رو ببین.

---

## 👥 Credits

- **Author:** MASTER YOUSEF
- **Branding:** WOLF EMPIRE
- **Inspiration:** Empire Fantasy Series
- **Powered by:** Cloudflare Workers + Miniflare + z.ai

---

## 🆘 پشتیبانی

- 📧 **Telegram:** [@Kmnbvczx0090](https://t.me/Kmnbvczx0090)
- 📢 **Channel:** [t.me/vpnstan1](https://t.me/vpnstan1)
- 🐛 **Issues:** [GitHub Issues](https://github.com/USERNAME/wolf-empire/issues)

---

<div align="center">

### 🐺👑 امپراطوری مستر یوسف

### ⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓
### 🐾 🐾 🐾

**ساخته شده با ❤️ و قدرت توسط مستر یوسف**

[⬆ بالا](#-master-yousef-wolf-empire)

</div>
