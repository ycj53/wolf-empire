# 🤖 آموزش نصب z.ai و فعال‌سازی WOLF AI

> **WOLF AI 🐺** دستیار هوشمند پنل مستر یوسف است که با استفاده از مدل‌های زبانی بزرگ (LLM) به سوالات کاربران پاسخ می‌دهد. این راهنما نصب و فعال‌سازی کامل z.ai را آموزش می‌دهد.

---

## 📖 z.ai چیست؟

**z.ai** یک پلتفرم هوش مصنوعی است که به‌صورت SDK و CLI در دسترس است. این پلتفرم امکان استفاده از مدل‌های مختلف را فراهم می‌کند:

- **Gemini** (Google) — سریع و ارزان
- **GLM** (Zhipu) — قدرتمند برای فارسی
- **Claude** (Anthropic) — کیفیت بالا
- **GPT** (OpenAI) — همه‌کاره

پنل ما از z.ai SDK برای قابلیت‌های زیر استفاده می‌کند:

| قابلیت | توضیح |
|--------|--------|
| 🐺 **WOLF AI Chat** | چت هوشمند با کاربران |
| 📝 **تولید متن** | تولید توضیحات، تنظیمات |
| 🔄 **ترجمه** | ترجمه بین زبان‌ها |
| 💡 **پشتیبانی** | پاسخ به سوالات فنی |
| 🎫 **تیکت‌های خودکار** | پاسخ اولیه به تیکت‌ها |

---

## 🚀 نصب z.ai

### روش ۱: نصب از طریق npm (توصیه شده)

```bash
# نصب z.ai CLI به‌صورت global
npm install -g @zai/sdk

# بررسی نصب
z-ai --version
```

### روش ۲: نصب از طریق curl

```bash
# دانلود اسکریپت نصب
curl -fsSL https://z.ai/install.sh | bash

# یا به‌صورت دستی
wget https://z.ai/releases/z-ai-latest-linux-x64.tar.gz
tar -xzf z-ai-latest-linux-x64.tar.gz
sudo mv z-ai /usr/local/bin/
chmod +x /usr/local/bin/z-ai
```

### روش ۳: استفاده به‌عنوان ماژول Node.js

```bash
# در پروژه‌ات
npm install @zai/sdk
```

---

## 🔑 دریافت API Key

### مرحله ۱: ساخت اکانت

1. به سایت https://z.ai برو
2. روی **Sign Up** کلیک کن
3. اکانت بساز (با ایمیل یا Google/GitHub)

### مرحله ۲: دریافت API Key

1. وارد داشبورد بشو
2. به بخش **API Keys** یا **Settings → API** برو
3. روی **Create New Key** کلیک کن
4. اسم بده (مثلاً `wolf-empire`)
5. دسترسی‌ها رو انتخاب کن:
   - ✅ `chat.completions` (برای WOLF AI)
   - ✅ `models.list` (برای دیدن مدل‌ها)
6. روی **Create** کلیک کن
7. کلید رو کپی کن (فقط یه بار نشون داده می‌شه!)

### مرحله ۳: ذخیره امن API Key

```bash
# به‌عنوان environment variable
export ZAI_API_KEY="your_api_key_here"

# برای دائمی کردن، در ~/.bashrc یا ~/.zshrc اضافه کن
echo 'export ZAI_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

---

## ⚙️ تنظیم در پنل

### روش ۱: Cloudflare Workers

در فایل `wrangler.toml`:

```toml
[vars]
GEMINI_API_KEY = "your_zai_api_key_here"
GEMINI_MODEL = "gemini-1.5-flash"
```

سپس deploy:

```bash
wrangler deploy
```

### روش ۲: Katabump / VPS

در فایل `.env`:

```bash
GEMINI_API_KEY=your_zai_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

سپس ری‌استارت کن.

### روش ۳: Docker

```bash
docker run -d \
  --name wolf-empire \
  -e GEMINI_API_KEY=your_zai_api_key_here \
  -e GEMINI_MODEL=gemini-1.5-flash \
  wolf-empire
```

---

## 🐺 استفاده از WOLF AI

### مرحله ۱: ورود به پنل

1. پنل رو باز کن: `https://your-panel-url/`
2. با رمز ادمین لاگین کن

### مرحله ۲: باز کردن WOLF AI

دو راه برای باز کردن:

- 📱 **دکمه شناور 🐺** پایین سمت چپ صفحه
- 📋 **از drawer 👑** → بخش WOLF AI

### مرحله ۳: شروع چت

وقتی پنجره WOLF AI باز شد:

1. در کادر پایین، سوالت رو بنویس
2. روی **Send** کلیک کن (یا Enter بزن)
3. منتظر پاسخ بمون (معمولاً ۲-۵ ثانیه)

### نمونه سوالات

```
🐺 سلام، چطوری می‌تونم کاربر جدید بسازم؟
🐺 چطوری ترافیک کاربر رو محدود کنم؟
🐺 تنظیمات VLESS چیه؟
🐺 لینک اشتراک کجاست؟
🐺 چطوری بکاپ بگیرم؟
```

### قابلیت‌های WOLF AI

| قابلیت | توضیح |
|--------|--------|
| 💬 **چت چندنوبته** | تاریخچه گفتگو رو حفظ می‌کنه |
| 📋 **سوالات آماده** | دکمه‌های سوال سریع |
| 🎨 **خروجی Markdown** | فرمت‌بندی شده با کد، لیست، تیتر |
| 🔄 **پاک کردن چت** | شروع گفتگوی جدید |
| 📜 **تاریخچه** | ذخیره گفتگوهای قبلی |
| 🌐 **فارسی/انگلیسی** | هر دو زبان رو پشتیبانی می‌کنه |

---

## 🔧 تنظیمات پیشرفته z.ai

### انتخاب مدل

مدل‌های مختلف برای کاربردهای مختلف:

```bash
# سریع و ارزان (پیشنهادی برای WOLF AI)
GEMINI_MODEL=gemini-1.5-flash

# قدرتمندتر برای کارهای پیچیده
GEMINI_MODEL=gemini-1.5-pro

# برای پاسخ‌های طولانی
GEMINI_MODEL=gemini-1.5-flash-8b

# مدلی که فارسی رو عالی می‌فهمه
GEMINI_MODEL=glm-4
```

### تنظیم Temperature

هرچی Temperature بالاتر، خلاقانه‌تر:

```bash
# در کد پنل (src/wolf-brand.js)
temperature: 0.7  # پیش‌فرض: متعادل
temperature: 0.2  # دقیق و منطقی
temperature: 1.0  # خلاقانه و متغیر
```

### تنظیم Max Tokens

```bash
# حداکثر طول پاسخ
maxTokens: 1000   # کوتاه
maxTokens: 4000   # متوسط (پیش‌فرض)
maxTokens: 8000   # طولانی
```

### System Prompt سفارشی

برای تغییر شخصیت WOLF AI، در `src/wolf-brand.js`:

```javascript
const systemPrompt = `تو WOLF AI هستی، دستیار هوشمند امپراطوری مستر یوسف.
- همیشه فارسی پاسخ بده
- مودب و دوستانه باش
- اگه مطمئن نیستی، بگو
- از ایموجی 🐺👑⛓ استفاده کن`;
```

بعد از تغییر، `node src/wolf-assemble.js` رو اجرا کن.

---

## 💡 مثال‌های کاربردی

### مثال ۱: چت ساده با CLI

```bash
# نصب z.ai CLI (اگه هنوز نصب نیست)
npm install -g @zai/sdk

# چت مستقیم
z-ai chat -m "سلام! چطوری؟"

# با مدل خاص
z-ai chat -m "توضیح بده VLESS چیه" -M glm-4
```

### مثال ۲: استفاده در Node.js

```javascript
// install: npm install @zai/sdk
const ZAI = require('@zai/sdk');

const client = new ZAI({
  apiKey: process.env.ZAI_API_KEY,
});

async function chat() {
  const response = await client.chat.completions.create({
    model: 'gemini-1.5-flash',
    messages: [
      { role: 'system', content: 'تو دستیار پنل VPN هستی' },
      { role: 'user', content: 'چطوری کاربر بسازم؟' }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  
  console.log(response.choices[0].message.content);
}

chat();
```

### مثال ۳: استفاده در Python

```python
# pip install zai-sdk
from zai import ZAI

client = ZAI(api_key="your_api_key")

response = client.chat.completions.create(
    model="gemini-1.5-flash",
    messages=[
        {"role": "system", "content": "تو دستیار پنل VPN هستی"},
        {"role": "user", "content": "چطوری کاربر بسازم؟"}
    ],
    temperature=0.7,
    max_tokens=1000
)

print(response.choices[0].message.content)
```

### مثال ۴: استفاده از Vision (تحلیل تصویر)

```bash
# تحلیل تصویر با CLI
z-ai vision -m "این تصویر رو توضیح بده" -i "./screenshot.png"
```

### مثال ۵: تولید تصویر

```bash
# تولید تصویر با CLI
z-ai image -m "یه گرگ نئون طلایی با تاج" -o wolf.png
```

---

## 🧪 تست نصب

### تست ۱: بررسی نصب

```bash
# بررسی نصب CLI
z-ai --version

# بررسی API Key
z-ai whoami
```

### تست ۲: تست API

```bash
# تست چت
z-ai chat -m "Hello, are you working?"

# تست با curl
curl -X POST https://api.z.ai/v1/chat/completions \
  -H "Authorization: Bearer $ZAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-1.5-flash",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### تست ۳: تست در پنل

1. وارد پنل شو
2. دکمه 🐺 رو بزن
3. "سلام" رو بفرست
4. باید پاسخ بگیره (اگه API Key درست باشه)

---

## 💰 قیمت z.ai

| پلن | هزینه | محدودیت |
|------|-------|---------|
| **Free** | $0 | 1000 request/روز |
| **Starter** | $5/ماه | 50K request/روز |
| **Pro** | $20/ماه | 500K request/روز |
| **Enterprise** | سفارشی | نامحدود |

برای استفاده شخصی پلن Free کافیه! 🎉

---

## 🔒 امنیت API Key

### ❌ کارهای ممنوعه

- API Key رو در کد commit نکن
- API Key رو در پیام‌های عمومی نفرست
- API Key رو در لاگ‌ها چاپ نکن

### ✅ کارهای درست

```bash
# در .env (که در .gitignore هست)
GEMINI_API_KEY=your_key_here

# یا در Cloudflare secrets
wrangler secret put GEMINI_API_KEY
```

### چک‌لیست امنیتی

- [ ] API Key در `.env` هست (نه در کد)
- [ ] `.env` در `.gitignore` هست
- [ ] API Key در GitHub commit نشده
- [ ] API Key با کسی به اشتراک گذاشته نشده
- [ ] هر چند ماه یه بار، API Key رو عوض کن

---

## 🐛 عیب‌یابی WOLF AI

### مشکل: `WOLF AI is disabled`

```
⚠️ WOLF AI is disabled. Set GEMINI_API_KEY to enable.
```

**راه‌حل:** `GEMINI_API_KEY` رو در env تنظیم کن و ری‌استارت کن.

### مشکل: `Invalid API key`

```
❌ Invalid API key
```

**راه‌حل:**
1. چک کن API Key درسته
2. چک کن منقضی نشده
3. یه API Key جدید بساز

### مشکل: `Rate limit exceeded`

```
⏱️ Rate limit exceeded
```

**راه‌حل:**
- منتظر بمون (معمولاً ۱ دقیقه)
- پلن رو ارتقا بده
- یا تعداد درخواست‌ها رو کم کن

### مشکل: پاسخ خیلی کند

**راه‌حل:**
- از مدل سبک‌تر استفاده کن: `gemini-1.5-flash`
- `max_tokens` رو کم کن
- Temperature رو کم کن

### مشکل: پاسخ فارسی درست نیست

**راه‌حل:**
- مدل `glm-4` برای فارسی بهتره
- یا در system prompt تأکید کن: "همیشه فارسی پاسخ بده"

---

## 📚 منابع

- 🌐 سایت رسمی: https://z.ai
- 📖 مستندات: https://docs.z.ai
- 💬 Discord: https://discord.gg/zai
- 📧 ایمیل: support@z.ai

---

## ✅ چک‌لیست نهایی z.ai

- [ ] z.ai CLI نصب شد (`z-ai --version`)
- [ ] اکانت z.ai ساخته شد
- [ ] API Key دریافت شد
- [ ] API Key در env تنظیم شد
- [ ] `GEMINI_MODEL` انتخاب شد
- [ ] پنل ری‌استارت شد
- [ ] دکمه 🐺 در پنل ظاهر شد
- [ ] چت تست شد و پاسخ گرفت
- [ ] (اختیاری) System Prompt سفارشی شد
- [ ] (اختیاری) تاریخچه چت کار کرد

---

<div align="center">

### 🐺👑 WOLF AI آماده‌ست!

[⬅ بازگشت به README](../README.md)

</div>
