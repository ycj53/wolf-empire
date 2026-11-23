# 🎨 Source Files

Editable source files for the panel. Edit these, then run `node src/wolf-assemble.js` to rebuild `worker.js`.

## 📁 Files

| File | Type | Description |
|------|------|-------------|
| `wolf-brand.css` | CSS | Panel admin theme (colors, fonts, drawer, FAB) |
| `wolf-brand.js` | JS | Drawer logic, buttons, API calls |
| `wolf-sub-page.css` | CSS | Subscription page styles |
| `admin-handlers.js` | JS | Admin API endpoints |
| `wolf-assemble.js` | JS | Build script (combines all → `worker.js`) |
| `wolf-avatar-b64.txt` | TXT | Wolf avatar (small, base64) |
| `wolf-avatar-full-b64.txt` | TXT | Wolf avatar (full, base64) |
| `wolf-avatar-old-b64.txt` | TXT | Old avatar (legacy) |
| `brand-css.js` | JS | CSS module exporter |

## 🛠️ Build Process

```bash
# Edit source files
nano wolf-brand.css

# Rebuild worker.js
node wolf-assemble.js

# Test
wrangler dev
# or
node ../deploy/katabump/index.js

# Deploy
wrangler deploy
```

## 🎨 What to Edit

- **Change colors** → `wolf-brand.css` → `:root` CSS variables
- **Change brand name** → `wolf-brand.js` → `BRAND_FULL` constant
- **Change avatar** → `wolf-avatar-full-b64.txt` (base64 of new PNG)
- **Change AI personality** → `wolf-brand.js` → `AI_SYSTEM_PROMPT`
- **Add drawer section** → `wolf-brand.js` → `renderDrawerSections()`

See [Customization guide](../docs/CUSTOMIZATION.md) for full details.

## ⚠️ Important

- **Never edit `worker.js` directly** — always edit files here and rebuild
- **Run `node wolf-assemble.js` after every change**
- **Test locally before deploying**

---

[⬅ Back to README](../README.md)
