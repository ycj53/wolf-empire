# 🛠️ Scripts

Helper scripts for deploying, managing, and maintaining the panel.

## 📁 Available Scripts

| Script | Type | Description |
|--------|------|-------------|
| [`install.py`](install.py) | Python | One-click installer (auto-detects platform) |
| [`deploy-cloudflare.sh`](deploy-cloudflare.sh) | Bash | Deploy to Cloudflare Workers |
| [`deploy-vps.sh`](deploy-vps.sh) | Bash | Deploy to VPS with nginx + TLS |
| [`backup.py`](backup.py) | Python | Backup and restore KV data |

## 🚀 Quick Start

### One-Click Install (All Platforms)

```bash
python3 scripts/install.py
```

This script will:
1. Detect your platform (Cloudflare / Katabump / VPS / Docker)
2. Check Node.js is installed
3. Create `.env` file with random UUID and password
4. Install npm dependencies
5. Show next steps

### Deploy to Cloudflare Workers

```bash
./scripts/deploy-cloudflare.sh
```

This script will:
1. Check/install Wrangler
2. Authenticate with Cloudflare
3. Create KV namespace if needed
4. Generate UUID if needed
5. Deploy to Cloudflare

### Deploy to VPS (with nginx + TLS)

```bash
sudo ./scripts/deploy-vps.sh panel.yourdomain.com
```

This script will:
1. Install Node.js 20
2. Copy files to `/opt/wolf-empire`
3. Create `.env` with random password
4. Setup systemd service
5. Configure nginx with Let's Encrypt TLS

### Backup Data

```bash
# Create backup
python3 scripts/backup.py

# Backup to specific location
python3 scripts/backup.py --output /backups/wolf-2024.zip

# Restore from backup
python3 scripts/backup.py --restore wolf-empire-backup-2024-01-01.zip
```

## 📋 Usage Examples

### Fresh Install on New VPS

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Clone the repo
git clone https://github.com/USERNAME/wolf-empire.git
cd wolf-empire

# 3. Run installer
sudo ./scripts/deploy-vps.sh panel.yourdomain.com

# 4. Done! Panel is live at https://panel.yourdomain.com
```

### Migrate from Katabump to Cloudflare

```bash
# 1. Backup current data
python3 scripts/backup.py --output katabump-backup.zip

# 2. Setup Cloudflare
./scripts/deploy-cloudflare.sh

# 3. Restore data
python3 scripts/backup.py --restore katabump-backup.zip
```

### Update to Latest Version

```bash
# 1. Pull latest changes
git pull origin main

# 2. Rebuild worker.js
node src/wolf-assemble.js

# 3. Restart service
sudo systemctl restart wolf-empire
# or
docker restart wolf-empire

# 4. Redeploy to Cloudflare (if using it)
wrangler deploy
```

## 🧪 Testing

Test your deployment:

```bash
# Test root page
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://your-panel/

# Test login
curl -X POST https://your-panel/api/login \
  -H "Content-Type: application/json" \
  -d '{"pass":"your_password"}' \
  -c cookies.txt

# Test stats (with cookie)
curl -b cookies.txt https://your-panel/api/stats
```

## 🐛 Troubleshooting

If scripts fail, check:

1. **Permissions:** Run as root (`sudo`) for VPS deploy
2. **Node.js:** Version 18+ required (`node --version`)
3. **Network:** Can you reach the internet?
4. **Disk space:** At least 500MB free
5. **Ports:** Port 8787 (or 80/443) must be available

---

<div align="center">

### 🐺👑 Choose your script and deploy!

[⬅ Back to README](../README.md)

</div>
