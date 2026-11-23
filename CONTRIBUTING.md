# 🤝 Contributing to MASTER YOUSEF WOLF EMPIRE

First off, **thank you** for taking the time to contribute! 🐺👑

This document outlines how to contribute to the project.

---

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive.

---

## 🚀 Ways to Contribute

- 🐛 **Report bugs** — [Open an issue](https://github.com/USERNAME/wolf-empire/issues/new?template=bug_report.yml)
- ✨ **Suggest features** — [Open a feature request](https://github.com/USERNAME/wolf-empire/issues/new?template=feature_request.yml)
- 📖 **Improve docs** — Fix typos, add examples, translate
- 🎨 **Design improvements** — New themes, better UX
- 💻 **Write code** — Fix bugs, implement features
- 🌍 **Translate** — Help translate the panel to other languages
- 💬 **Help others** — Answer questions in issues

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm
- Git

### Step 1: Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/wolf-empire.git
cd wolf-empire
git remote add upstream https://github.com/USERNAME/wolf-empire.git
```

### Step 2: Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Step 3: Install Dependencies

```bash
cd deploy/katabump
npm install
```

### Step 4: Make Changes

Edit files in `src/` directory (not `worker.js` directly):

```bash
# Edit theme
nano src/wolf-brand.css

# Edit logic
nano src/wolf-brand.js

# Re-assemble worker.js
node src/wolf-assemble.js
```

### Step 5: Test Locally

```bash
# Start the panel
PORT=8787 PANEL_HOST=localhost:8787 node deploy/katabump/index.js

# In another terminal, test:
curl http://localhost:8787/
curl -X POST http://localhost:8787/api/login \
  -H "Content-Type: application/json" \
  -d '{"pass":"SUKOT"}'
```

### Step 6: Commit Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add new drawer section for traffic stats"
```

Commit types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, etc.)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Build process, dependencies, etc.

### Step 7: Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then go to GitHub and open a Pull Request.

---

## 📏 Coding Standards

### JavaScript

- Use 2-space indentation
- Use single quotes for strings
- Use `const`/`let`, never `var`
- Add JSDoc comments for functions
- Use descriptive variable names

```javascript
// ✅ Good
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

// ❌ Bad
function fetchData(url){
  return fetch(url).then(r => r.json())
}
```

### CSS

- Use CSS variables for colors
- Use kebab-case for class names
- Group related styles together
- Use `rem` units (not `px` where possible)

```css
/* ✅ Good */
.wolf-card {
  border: 1px solid var(--wolf-gold);
  border-radius: 0.5rem;
}

/* ❌ Bad */
.WolfCard {
  border: 1px solid #FFD700;
  border-radius: 8px;
}
```

### HTML

- Use semantic HTML5 tags
- Add `alt` attributes to images
- Use ARIA attributes for accessibility
- Keep markup clean and minimal

---

## 🧪 Testing

Before submitting a PR, make sure:

- [ ] Code runs without errors
- [ ] All smoke tests pass:
  - `GET /` returns 200
  - `POST /api/login` with correct password returns `{"ok":true}`
  - `GET /api/stats` with cookie returns stats
- [ ] No console errors in browser
- [ ] UI looks good on mobile (375px) and desktop (1920px)
- [ ] Persian text renders correctly
- [ ] No leftover `TODO`, `XXX`, or `FIXME` comments

---

## 📁 Project Structure

```
wolf-empire/
├── worker.js                    # Built worker (DO NOT edit directly)
├── src/                         # Source files (EDIT THESE)
│   ├── wolf-brand.css           # Theme styles
│   ├── wolf-brand.js            # UI logic
│   ├── wolf-sub-page.css        # Subscription page styles
│   ├── admin-handlers.js        # API handlers
│   ├── wolf-assemble.js         # Build script
│   └── wolf-avatar-*.txt        # Avatar images (base64)
├── deploy/                      # Deployment configs
├── docs/                        # Documentation
├── scripts/                     # Helper scripts
└── .github/                     # GitHub config
```

**IMPORTANT:** Never edit `worker.js` directly! Always edit files in `src/` and run `node src/wolf-assemble.js` to rebuild.

---

## 🌍 Translations

The panel currently supports Persian. To add a new language:

1. Create `src/translations/{lang}.js`:
   ```javascript
   module.exports = {
     login: 'Login',
     password: 'Password',
     // ...
   };
   ```

2. Update `src/wolf-brand.js` to load translations

3. Add the language to the language switcher

4. Submit a PR

---

## 🎨 Theme Contributions

To create a new theme:

1. Copy `src/wolf-brand.css` to `src/themes/your-theme.css`
2. Modify the CSS variables in `:root`
3. Add a theme switcher in the panel
4. Test thoroughly
5. Submit a PR with screenshots

---

## 📝 Documentation Contributions

- Fix typos and grammar
- Add examples and screenshots
- Translate docs to other languages
- Improve clarity

---

## 🐛 Bug Reports

When reporting bugs, include:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment (platform, Node version, browser)
- Screenshots if applicable
- Logs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml).

---

## ✨ Feature Requests

When requesting features:

- Clear description of the feature
- Why it's useful
- Proposed implementation (optional)
- Mockups or examples (optional)

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml).

---

## 🔄 Review Process

1. PRs are reviewed within 2-3 days
2. We may request changes
3. Once approved, we'll merge
4. You'll be credited in the changelog

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

## 🆘 Need Help?

- 💬 Telegram: [@Kmnbvczx0090](https://t.me/Kmnbvczx0090)
- 📢 Channel: [t.me/vpnstan1](https://t.me/vpnstan1)
- 🐛 Issues: [GitHub Issues](https://github.com/USERNAME/wolf-empire/issues)

---

<div align="center">

### 🐺👑 Thanks for contributing!

⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓
🐾 🐾 🐾

</div>
