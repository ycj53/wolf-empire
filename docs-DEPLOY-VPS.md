# 🖥️ آموزش نصب روی VPS / Docker

> این روش برای حرفه‌ای‌هاست — VPN واقعی با WebSocket (پشت nginx)

## 📋 پیش‌نیازها

- یه VPS (DigitalOcean, Hetzner, AWS Lightsail, ...)
- Node.js 18+
- (اختیاری) Docker
- (اختیاری) nginx برای TLS

---

## 🚀 روش ۱: نصب مستقیم (ساده‌ترین)

### مرحله ۱: نصب Node.js

```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS / RHEL / Fedora
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# بررسی نسخه
node --version  # باید v20.x باشه
npm --version
```

### مرحله ۲: دریافت فایل‌ها

```bash
# ساخت پوشه
mkdir -p ~/wolf-empire && cd ~/wolf-empire

# از GitHub کلون کن
git clone https://github.com/USERNAME/wolf-empire.git .

# یا از فایل zip
unzip wolf-node-panel.zip
```

### مرحله ۳: تنظیم `.env`

```bash
cp .env.example .env
nano .env
```

این موارد رو تنظیم کن:

```bash
PORT=8787
HOST=0.0.0.0
PANEL_HOST="panel.yourdomain.com"
ADMIN_PASSWORD="Wolf2026Empire!"
UUID="06472f28-8568-4e61-9bd1-8ed64f25acc1"
KV_DIR="./kv-data"
PUBLIC_TLS=1
```

### مرحله ۴: نصب و اجرا

```bash
# نصب dependencies
npm install --omit=dev

# اجرا
npm start
```

پنل روی `http://localhost:8787` بالا میاد.

### مرحله ۵: سرویس دائمی (systemd)

برای اینکه پنل همیشه بالا بمونه:

```bash
sudo tee /etc/systemd/system/wolf-empire.service <<'EOF'
[Unit]
Description=MASTER YOUSEF WOLF EMPIRE Panel
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/wolf-empire
ExecStart=/usr/bin/node index.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now wolf-empire

# بررسی وضعیت
sudo systemctl status wolf-empire

# دیدن لاگ‌ها
sudo journalctl -u wolf-empire -f
```

---

## 🐳 روش ۲: نصب با Docker

### مرحله ۱: نصب Docker

```bash
# نصب Docker
curl -fsSL https://get.docker.com | sh

# اضافه کردن کاربر به گروه docker
sudo usermod -aG docker $USER

# لاگ‌اوت و لاگین مجدد
exit
# دوباره ssh کن
```

### مرحله ۲: ساخت Image

```bash
cd ~/wolf-empire

# ساخت image
docker build -t wolf-empire .
```

### مرحله ۳: اجرای Container

```bash
docker run -d \
  --name wolf-empire \
  --restart unless-stopped \
  -p 8787:8787 \
  -v wolf-kv:/app/kv-data \
  -e PANEL_HOST=panel.yourdomain.com \
  -e ADMIN_PASSWORD='Wolf2026Empire!' \
  -e UUID='06472f28-8568-4e61-9bd1-8ed64f25acc1' \
  -e PUBLIC_TLS=1 \
  wolf-empire

# دیدن لاگ‌ها
docker logs -f wolf-empire
```

### مرحله ۴: مدیریت Container

```bash
# توقف
docker stop wolf-empire

# شروع
docker start wolf-empire

# ری‌استارت
docker restart wolf-empire

# حذف
docker rm -f wolf-empire

# بروزرسانی (بعد از تغییر کد)
docker build -t wolf-empire .
docker rm -f wolf-empire
docker run -d --name wolf-empire ...
```

### مرحله ۵: استفاده از Docker Compose (پیشنهادی)

```yaml
# docker-compose.yml
version: '3.8'

services:
  wolf-empire:
    build: .
    container_name: wolf-empire
    restart: unless-stopped
    ports:
      - "8787:8787"
    volumes:
      - wolf-kv:/app/kv-data
      - ./worker.js:/app/worker.js:ro
    environment:
      - NODE_ENV=production
      - PANEL_HOST=panel.yourdomain.com
      - ADMIN_PASSWORD=Wolf2026Empire!
      - UUID=06472f28-8568-4e61-9bd1-8ed64f25acc1
      - KV_DIR=/app/kv-data
      - PUBLIC_TLS=1
      # اختیاری
      - TG_BOT_TOKEN=${TG_BOT_TOKEN}
      - TG_ADMIN_ID=${TG_ADMIN_ID}
      - GEMINI_API_KEY=${GEMINI_API_KEY}

volumes:
  wolf-kv:
```

اجرا:

```bash
docker compose up -d
docker compose logs -f
```

---

## 🔒 روش ۳: نصب با nginx + TLS

برای HTTPS رایگان با Let's Encrypt:

### مرحله ۱: نصب nginx + certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### مرحله ۲: کانفیگ nginx

```bash
sudo tee /etc/nginx/sites-available/wolf-empire <<'EOF'
server {
    listen 80;
    server_name panel.yourdomain.com;

    # Client body size for backups/uploads
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (برای VLESS)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/wolf-empire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### مرحله ۳: دریافت گواهی TLS

```bash
sudo certbot --nginx -d panel.yourdomain.com
```

### مرحله ۴: تنظیم env

در `.env`:

```bash
PANEL_HOST="panel.yourdomain.com"
PUBLIC_TLS=1
PUBLIC_LINK_PORT=443
```

حالا پنل روی `https://panel.yourdomain.com` در دسترسه!

---

## 🛡️ روش ۴: نصب با Caddy (بهترین برای TLS خودکار)

Caddy به‌طور خودکار TLS از Let's Encrypt می‌گیره:

### مرحله ۱: نصب Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### مرحله ۲: کانفیگ Caddy

```bash
sudo tee /etc/caddy/Caddyfile <<'EOF'
panel.yourdomain.com {
    reverse_proxy 127.0.0.1:8787
    
    # WebSocket support
    encode gzip
    
    # Upload limit
    request_body {
        max_size 50MB
    }
}
EOF

sudo systemctl restart caddy
```

Caddy به‌طور خودکار TLS رو فعال می‌کنه!

---

## 🔄 آپدیت پنل

### روش مستقیم

```bash
cd ~/wolf-empire

# دریافت آخرین نسخه
git pull origin main

# Assembly مجدد (اگه src/ رو تغییر دادی)
node src/wolf-assemble.js

# ری‌استارت سرویس
sudo systemctl restart wolf-empire
# یا
docker restart wolf-empire
```

### روش Docker

```bash
cd ~/wolf-empire

# دریافت آخرین نسخه
git pull origin main

# ساخت مجدد
docker compose build

# اجرای مجدد
docker compose up -d
```

---

## 📊 مانیتورینگ

### لاگ‌ها

```bash
# systemd
sudo journalctl -u wolf-empire -f

# Docker
docker logs -f wolf-empire

# اگه از nginx استفاده می‌کنی
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### آمار سیستم

```bash
# مصرف RAM/CPU
htop

# دیسک
df -h

# شبکه
sudo netstat -tulpn | grep 8787
```

---

## 🔥 firewall

```bash
# اگه ufw استفاده می‌کنی
sudo ufw allow 8787/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 💰 هزینه‌های پیشنهادی VPS

| Provider | RAM | قیمت ماهانه | مناسب برای |
|----------|-----|-------------|------------|
| Hetzner | 4GB | ~$4 | بهترین قیمت |
| DigitalOcean | 2GB | $12 | ساده |
| Vultr | 2GB | $12 | ساده |
| AWS Lightsail | 2GB | $12 | قابل اعتماد |
| Contabo | 8GB | ~$6 | ارزان |
| Linode | 2GB | $12 | ساده |

---

## 🐛 عیب‌یابی

### مشکل: `Cannot find module 'miniflare'`

```bash
# نصب مجدد dependencies
npm install
```

### مشکل: پورت اشغاله

```bash
# چه چیزی داره استفاده می‌کنه
sudo lsof -i :8787

# kill کردن
sudo kill -9 PID_NUMBER
```

### مشکل: Permission denied در kv-data

```bash
sudo chown -R $USER:$USER ~/wolf-empire/kv-data
```

### مشکل: nginx 502 Bad Gateway

```bash
# چک کن پنل بالا هست
curl http://localhost:8787/

# چک nginx config
sudo nginx -t

# ری‌استارت
sudo systemctl restart nginx
```

### مشکل: Docker container اجرا نمی‌شه

```bash
# لاگ‌ها رو ببین
docker logs wolf-empire

# بررسی وضعیت
docker ps -a
```

---

## ✅ چک‌لیست نهایی

- [ ] VPS تهیه شد
- [ ] Node.js 18+ نصب شد
- [ ] فایل‌ها در `~/wolf-empire` کپی شدند
- [ ] `.env` تنظیم شد
- [ ] `npm install` اجرا شد
- [ ] `npm start` کار کرد
- [ ] پنل روی localhost:8787 باز شد
- [ ] (اختیاری) systemd service ساخته شد
- [ ] (اختیاری) Docker container اجرا شد
- [ ] (اختیاری) nginx + TLS نصب شد
- [ ] پنل روی دامنه HTTPS باز شد
- [ ] لاگین موفق بود

---

<div align="center">

### 🐺👑 موفق باشی داداش!

[⬅ بازگشت به README](../README.md)

</div>
