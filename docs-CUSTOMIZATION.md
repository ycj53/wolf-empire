# 🎨 راهنمای سفارشی‌سازی (Customization)

> چطور تم پنل، رنگ‌ها، برند و ویژگی‌ها رو تغییر بدی

---

## 📂 ساختار سورس

```
src/
├── wolf-brand.css           # تم پنل ادمین (رنگ، فونت، drawer)
├── wolf-brand.js            # منطق drawer، دکمه‌ها، API
├── wolf-sub-page.css        # تم صفحه اشتراک
├── admin-handlers.js        # API endpoints ادمین
├── wolf-assemble.js         # اسکریپت assembly (ترکیب همه فایل‌ها)
├── wolf-avatar-b64.txt      # آواتار گرگ (کوچک)
├── wolf-avatar-full-b64.txt # آواتار گرگ (کامل)
└── wolf-avatar-old-b64.txt  # آواتار قدیمی
```

---

## 🔄 Workflow سفارشی‌سازی

```bash
# ۱. ویرایش فایل
nano src/wolf-brand.css

# ۲. Assembly مجدد (ترکیب فایل‌ها → worker.js)
node src/wolf-assemble.js

# ۳. تست محلی (اختیاری)
wrangler dev
# یا
node deploy/katabump/index.js

# ۴. Deploy
wrangler deploy
```

---

## 🎨 تغییر رنگ‌ها

رنگ‌های اصلی در `src/wolf-brand.css`:

```css
:root {
  /* === رنگ‌های اصلی امپراطوری === */
  --wolf-gold: #FFD700;          /* طلایی */
  --wolf-gold-dark: #B8860B;     /* طلایی تیره */
  --wolf-purple: #6B46C1;        /* بنفش */
  --wolf-purple-dark: #4C1D95;   /* بنفش تیره */
  --wolf-neon: #00FF7F;          /* سبز نئونی */
  --wolf-neon-dark: #008B45;     /* سبز نئونی تیره */
  
  /* === پس‌زمینه === */
  --wolf-bg: #04060E;            /* مشکی تیره */
  --wolf-bg-card: #0A0F1F;       /* کارت */
  --wolf-bg-elevated: #111827;   /* بالا آمده */
  
  /* === متن === */
  --wolf-text: #FFFFFF;          /* سفید */
  --wolf-text-dim: #9CA3AF;      /* کم‌رنگ */
  --wolf-text-muted: #4B5563;    /* محو */
}
```

### مثال: تغییر به تم آبی

```css
:root {
  --wolf-gold: #00BFFF;          /* آبی روشن */
  --wolf-gold-dark: #1E90FF;
  --wolf-purple: #4169E1;
  --wolf-purple-dark: #0000CD;
  --wolf-neon: #00FFFF;
  --wolf-neon-dark: #008B8B;
}
```

### مثال: تم قرمز خون

```css
:root {
  --wolf-gold: #FF1744;
  --wolf-gold-dark: #B71C1C;
  --wolf-purple: #880E4F;
  --wolf-purple-dark: #4A0E2A;
  --wolf-neon: #FF6B6B;
  --wolf-neon-dark: #C92A2A;
}
```

---

## 👑 تغییر برند

### تغییر اسم برند

در `wrangler.toml` یا `.env`:

```bash
BRAND_NAME="YOUR BRAND"
BRAND_FULL="YOUR BRAND FULL NAME"
```

### تغییر آواتار گرگ 🐺

آواتار فعلی به‌صورت base64 در `src/wolf-avatar-full-b64.txt` ذخیره شده.

```bash
# تبدیل تصویر به base64
base64 -w 0 your-avatar.png > src/wolf-avatar-full-b64.txt

# Assembly مجدد
node src/wolf-assemble.js
```

### تولید آواتار جدید با z.ai

```bash
# تولید گرگ نئون جدید
z-ai image -m "a neon wolf with golden crown, cyberpunk style, dark background, gold and purple neon glow" -o wolf-new.png

# تبدیل به base64
base64 -w 0 wolf-new.png > src/wolf-avatar-full-b64.txt
```

---

## 📝 تغییر متن‌ها

### تغییر عنوان drawer

در `src/wolf-brand.js`:

```javascript
// پیدا کن:
const DRAWER_TITLE = 'MASTER YOUSEF';

// تغییر بده:
const DRAWER_TITLE = 'YOUR NAME';
```

### تغییر مدالیون‌ها

در `src/wolf-brand.js`:

```javascript
const MEDALLIONS = [
  { icon: '🐺', label: 'WOLF', color: 'var(--wolf-neon)' },
  { icon: '⚡', label: 'X4G', color: 'var(--wolf-gold)' },
  { icon: '👑', label: 'MASTER', color: 'var(--wolf-purple)' },
];

// تغییر به دلخواه:
const MEDALLIONS = [
  { icon: '🔥', label: 'FIRE', color: '#FF4500' },
  { icon: '⚡', label: 'SPEED', color: '#FFD700' },
  { icon: '💎', label: 'DIAMOND', color: '#00BFFF' },
];
```

### تغییر feature chips

```javascript
const FEATURES = [
  { icon: '🔒', label: 'TLS 1.3' },
  { icon: '⚡', label: 'Low Ping' },
  { icon: '🚀', label: 'High Speed' },
  { icon: '📱', label: 'All Operators' },
];
```

---

## 🎯 افزودن بخش جدید به Drawer

در `src/wolf-brand.js`، تابع `renderDrawerSections()` رو پیدا کن و بخش جدید اضافه کن:

```javascript
function renderDrawerSections() {
  return `
    <div class="wolf-section">
      <h4>📊 بخش جدید من</h4>
      <div class="wolf-card">
        <p>محتوای جدید شما</p>
        <button class="wolf-btn" onclick="myNewFunction()">
          کلیک کن
        </button>
      </div>
    </div>
  `;
}

function myNewFunction() {
  alert('سلام از بخش جدید!');
}
```

---

## 🐺 سفارشی‌سازی WOLF AI

### تغییر شخصیت AI

در `src/wolf-brand.js`:

```javascript
const AI_SYSTEM_PROMPT = `
تو WOLF AI هستی، دستیار هوشمند امپراطوری مستر یوسف.
- همیشه فارسی پاسخ بده
- مودب و دوستانه باش
- از ایموجی 🐺👑⛓ استفاده کن
- اگه مطمئن نیستی، صادقانه بگو
`;
```

### افزودن سوالات آماده

```javascript
const AI_SUGGESTIONS = [
  'سلام، چطوری کاربر بسازم؟',
  'چطوری بکاپ بگیرم؟',
  'لینک اشتراک کجاست؟',
  'تنظیمات VLESS چیه؟',
];
```

---

## 📱 صفحه اشتراک

### تغییر استایل

در `src/wolf-sub-page.css`:

```css
.sub-page {
  background: linear-gradient(135deg, #04060E 0%, #0A0F1F 100%);
  color: var(--wolf-text);
  font-family: 'Vazirmatn', sans-serif;
}

.sub-card {
  border: 2px solid var(--wolf-gold);
  border-radius: 16px;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}
```

### تغییر محتوا

در `src/wolf-brand.js`:

```javascript
function renderSubPage(user) {
  return `
    <div class="sub-page">
      <div class="sub-header">
        <h1>👑 ${BRAND_FULL}</h1>
        <p>خوش اومدی ${user.name}!</p>
      </div>
      
      <div class="sub-card">
        <h3>🔒 لینک اشتراک شما</h3>
        <div class="sub-link">${user.subLink}</div>
        <button onclick="copySubLink()">📋 کپی</button>
      </div>
      
      <!-- بخش‌های بیشتر -->
    </div>
  `;
}
```

---

## 🎨 فونت‌ها

### افزودن فونت فارسی

در ابتدای `wolf-brand.css`:

```css
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');

:root {
  --wolf-font: 'Vazirmatn', 'Tahoma', sans-serif;
}

body {
  font-family: var(--wolf-font);
}
```

### فونت‌های پیشنهادی

```css
/* Vazirmatn - استاندارد فارسی */
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');

/* Shabnam */
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css');

/* Sahel */
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/font-face.css');
```

---

## 🌟 افکت‌های نئون

### Glow روی کارت‌ها

```css
.wolf-card {
  border: 1px solid var(--wolf-gold);
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.2),
    inset 0 0 20px rgba(255, 215, 0, 0.1);
  transition: all 0.3s ease;
}

.wolf-card:hover {
  box-shadow: 
    0 0 40px rgba(255, 215, 0, 0.5),
    inset 0 0 30px rgba(255, 215, 0, 0.2);
  transform: translateY(-2px);
}
```

### متن نئون

```css
.wolf-neon-text {
  color: var(--wolf-neon);
  text-shadow: 
    0 0 5px var(--wolf-neon),
    0 0 10px var(--wolf-neon),
    0 0 20px var(--wolf-neon),
    0 0 40px var(--wolf-neon);
}
```

### انیمیشن پالس

```css
@keyframes wolf-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  }
}

.wolf-pulse {
  animation: wolf-pulse 2s ease-in-out infinite;
}
```

---

## 📊 افزودن نمودار

### با Chart.js

```html
<canvas id="traffic-chart"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
new Chart(document.getElementById('traffic-chart'), {
  type: 'line',
  data: {
    labels: ['فروردین', 'اردیبهشت', 'خرداد'],
    datasets: [{
      label: 'ترافیک (GB)',
      data: [12, 19, 3],
      borderColor: '#FFD700',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    }]
  }
});
</script>
```

---

## 🔄 Assembly و Deploy

### Assembly

```bash
# ترکیب همه فایل‌های src/ به worker.js
node src/wolf-assemble.js

# خروجی: worker.js (در ریشه پروژه)
```

### تست محلی

```bash
# روش ۱: Wrangler
wrangler dev

# روش ۲: Node.js
node deploy/katabump/index.js

# روش ۳: Docker
docker build -t wolf-test . && docker run -p 8787:8787 wolf-test
```

### Deploy

```bash
# Cloudflare
wrangler deploy

# VPS با systemd
sudo systemctl restart wolf-empire

# Docker
docker restart wolf-empire
```

---

## 💡 نکات مهم

### ✅ انجام بده

- قبل از تغییر، از `worker.js` بکاپ بگیر
- تغییرات کوچک و تست‌شده انجام بده
- از Git برای نسخه‌بندی استفاده کن
- تغییرات رو در branch جداگانه تست کن

### ❌ انجام نده

- `worker.js` رو مستقیماً ویرایش نکن (از `src/` استفاده کن)
- فایل‌های `wolf-avatar-*.txt` رو با دست ویرایش نکن
- CSS رو inline نکن (همیشه در فایل جداگانه)
- رنگ‌ها رو hardcode نکن (از CSS variables استفاده کن)

---

## 📚 مثال کامل: تم جدید "Fire Empire"

```css
/* در src/wolf-brand.css، در ابتدای فایل */
:root {
  --wolf-gold: #FF6B35;
  --wolf-gold-dark: #C2410C;
  --wolf-purple: #DC2626;
  --wolf-purple-dark: #7F1D1D;
  --wolf-neon: #FBBF24;
  --wolf-neon-dark: #D97706;
  
  --wolf-bg: #1C0A04;
  --wolf-bg-card: #2D0F08;
  
  --wolf-text: #FFF5E6;
}

/* عنوان با افکت آتش */
.wolf-header {
  background: linear-gradient(135deg, #DC2626 0%, #FBBF24 100%);
  text-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
}
```

Assembly و Deploy:

```bash
node src/wolf-assemble.js
wrangler deploy
```

---

## 🎯 خلاصه

| برای تغییر | فایل | کجا |
|-----------|------|-----|
| رنگ‌ها | `wolf-brand.css` | `:root` variables |
| تم کلی | `wolf-brand.css` | کل فایل |
| برند | env | `BRAND_NAME`, `BRAND_FULL` |
| آواتار | `wolf-avatar-*.txt` | فایل base64 |
| منطق | `wolf-brand.js` | توابع |
| API | `admin-handlers.js` | handlers |
| صفحه اشتراک | `wolf-sub-page.css` | استایل |
| شخصیت AI | `wolf-brand.js` | `AI_SYSTEM_PROMPT` |

---

<div align="center">

### 🐺👑 خلاقیتت رو به نمایش بذار!

[⬅ بازگشت به README](../README.md)

</div>
