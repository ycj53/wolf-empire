# 🔒 Security Policy

## 🛡️ Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
|---------|-------------------|
| 2.7.x   | ✅ Yes            |
| 2.6.x   | ✅ Yes            |
| < 2.6   | ❌ No             |

## 🐛 Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

### ✅ DO

1. **Email:** Send details to `@Kmnbvczx0090` on Telegram (private message)
2. **Wait:** Allow up to 48 hours for a response
3. **Coordinate:** Work with us on a fix before public disclosure
4. **Provide:** Include steps to reproduce, potential impact, and suggested fix

### ❌ DO NOT

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it's fixed
- Test vulnerabilities on production deployments without permission

## 🎁 Bug Bounty

We appreciate responsible disclosure. Contributors who report valid security vulnerabilities will be:

- 🏆 Credited in our hall of fame
- 🎁 Receive priority support
- 💎 Be invited to our private beta testing group

## 🔐 Security Best Practices

When deploying this panel, follow these best practices:

### 1. **Change Default Passwords**

```bash
ADMIN_PASSWORD="YourStrongPassword123!"
```

### 2. **Use Strong UUID**

```bash
# Generate a new UUID (don't use the default!)
node -e "console.log(crypto.randomUUID())"
```

### 3. **Keep API Keys Secret**

- Never commit `.env` to git
- Use Cloudflare Secrets for production
- Rotate keys regularly

### 4. **Enable TLS**

```bash
PUBLIC_TLS=1
PUBLIC_LINK_PORT=443
```

### 5. **Regular Backups**

```bash
# Backup KV data regularly
cp -r kv-data/ backup-$(date +%F)/
```

### 6. **Monitor Logs**

```bash
# Watch for suspicious activity
sudo journalctl -u wolf-empire -f | grep -i "error\|warn"
```

## 🔍 Known Security Considerations

### Default Password

The default password `SUKOT` is for testing only. **Always change it in production.**

### KV Data

- KV data is stored unencrypted (by default)
- For sensitive data, consider encrypting before storing
- Use Cloudflare's encrypted KV for production

### CORS

The panel sets permissive CORS headers by default. For production with a custom domain, consider restricting this.

## 📞 Contact

- **Security reports:** Telegram [@Kmnbvczx0090](https://t.me/Kmnbvczx0090)
- **General issues:** [GitHub Issues](https://github.com/USERNAME/wolf-empire/issues)

---

🐺👑 Stay safe out there!
