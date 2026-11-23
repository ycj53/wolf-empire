# 📋 Examples

This folder contains example configurations and usage patterns.

## 📁 Files

| File | Description |
|------|-------------|
| `docker-compose.yml` | Complete Docker Compose setup |
| `nginx.conf` | nginx reverse proxy config |
| `wrangler.toml` | Cloudflare Workers config example |
| `.env.production` | Production environment example |
| `systemd.service` | systemd service file |

---

## 🐳 Docker Compose

```bash
# Copy and edit
cp docker-compose.yml ../docker-compose.yml
nano ../docker-compose.yml

# Run
docker-compose up -d
```

See [`docker-compose.yml`](docker-compose.yml) for full config.

---

## 🌐 nginx Config

For HTTPS with Let's Encrypt:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/wolf-empire
sudo ln -s /etc/nginx/sites-available/wolf-empire /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d panel.yourdomain.com
```

See [`nginx.conf`](nginx.conf) for full config.

---

## ⚙️ Production Environment

```bash
cp .env.production ../.env
nano ../.env  # Fill in your values
```

See [`.env.production`](.env.production) for template.

---

## 🔧 Systemd Service

```bash
sudo cp systemd.service /etc/systemd/system/wolf-empire.service
sudo systemctl daemon-reload
sudo systemctl enable --now wolf-empire
```

See [`systemd.service`](systemd.service) for template.

---

## ☁️ Cloudflare Workers

```bash
cp wrangler.toml ../wrangler.toml
nano ../wrangler.toml  # Fill in your KV id, UUID, etc.
wrangler deploy
```

See [`wrangler.toml`](wrangler.toml) for full config.

---

<div align="center">

### 🐺👑 Happy deploying!

[⬅ Back to README](../README.md)

</div>
