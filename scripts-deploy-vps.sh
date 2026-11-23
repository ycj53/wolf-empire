#!/usr/bin/env bash
# ============================================================================
# MASTER YOUSEF WOLF EMPIRE — Deploy Script (VPS)
# ============================================================================
# Usage:
#   sudo ./scripts/deploy-vps.sh [domain]
#
# Example:
#   sudo ./scripts/deploy-vps.sh panel.example.com
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN=${1:-}
INSTALL_DIR="/opt/wolf-empire"
SERVICE_NAME="wolf-empire"

echo -e "${YELLOW}🐺👑 MASTER YOUSEF WOLF EMPIRE — VPS Deploy Script${NC}"
echo -e "${YELLOW}⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓${NC}"
echo ""

# Check root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root (sudo)${NC}"
    exit 1
fi

# Check domain
if [ -z "$DOMAIN" ]; then
    read -p "Enter your domain (e.g., panel.example.com): " DOMAIN
fi

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domain required${NC}"
    exit 1
fi

echo -e "${BLUE}Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "${BLUE}Install dir: ${YELLOW}$INSTALL_DIR${NC}"
echo ""

# 1. Install Node.js
echo -e "${BLUE}[1/5]${NC} Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo ""

# 2. Create install directory
echo -e "${BLUE}[2/5]${NC} Setting up installation directory..."
mkdir -p $INSTALL_DIR
cp -r . $INSTALL_DIR/
cd $INSTALL_DIR
npm install --omit=dev --no-audit --no-fund
echo -e "${GREEN}✅ Files installed at $INSTALL_DIR${NC}"
echo ""

# 3. Create .env if not exists
echo -e "${BLUE}[3/5]${NC} Setting up environment..."
if [ ! -f ".env" ]; then
    ADMIN_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(12).toString('hex'))")
    PANEL_UUID=$(node -e "console.log(crypto.randomUUID())")
    
    cat > .env << EOF
PORT=8787
HOST=0.0.0.0
PANEL_HOST=$DOMAIN
ADMIN_PASSWORD=$ADMIN_PASSWORD
UUID=$PANEL_UUID
KV_DIR=/var/lib/wolf-empire
PUBLIC_TLS=1
PUBLIC_LINK_PORT=443
NODE_ENV=production
EOF
    mkdir -p /var/lib/wolf-empire
fi
echo -e "${GREEN}✅ Environment configured${NC}"
echo ""

# 4. Create systemd service
echo -e "${BLUE}[4/5]${NC} Creating systemd service..."
cat > /etc/systemd/system/${SERVICE_NAME}.service << EOF
[Unit]
Description=MASTER YOUSEF WOLF EMPIRE Panel
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${INSTALL_DIR}
ExecStart=$(which node) ${INSTALL_DIR}/deploy/katabump/index.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${SERVICE_NAME}
systemctl start ${SERVICE_NAME}
echo -e "${GREEN}✅ Service created and started${NC}"
echo ""

# 5. Install nginx + TLS
echo -e "${BLUE}[5/5]${NC} Setting up nginx + Let's Encrypt..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx certbot python3-certbot-nginx
fi

cat > /etc/nginx/sites-available/${SERVICE_NAME} << EOF
server {
    listen 80;
    server_name ${DOMAIN};
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
EOF

ln -sf /etc/nginx/sites-available/${SERVICE_NAME} /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Get TLS certificate
echo -e "${YELLOW}📡 Getting TLS certificate (you may need to provide email)...${NC}"
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m admin@${DOMAIN} || \
    certbot --nginx -d ${DOMAIN}

echo -e "${GREEN}✅ nginx + TLS configured${NC}"
echo ""

# Show summary
ADMIN_PASSWORD=$(grep "^ADMIN_PASSWORD=" .env | cut -d'=' -f2)
PANEL_UUID=$(grep "^UUID=" .env | cut -d'=' -f2)

echo -e "${GREEN}🎉 Installation complete!${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🐺👑 Your panel is now LIVE at:${NC}"
echo -e "${YELLOW}   https://${DOMAIN}${NC}"
echo ""
echo -e "${GREEN}🔐 Password: ${YELLOW}${ADMIN_PASSWORD}${NC}"
echo -e "${GREEN}🆔 UUID: ${YELLOW}${PANEL_UUID}${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Manage your panel:${NC}"
echo -e "  Status:   ${YELLOW}sudo systemctl status ${SERVICE_NAME}${NC}"
echo -e "  Start:    ${YELLOW}sudo systemctl start ${SERVICE_NAME}${NC}"
echo -e "  Stop:     ${YELLOW}sudo systemctl stop ${SERVICE_NAME}${NC}"
echo -e "  Restart:  ${YELLOW}sudo systemctl restart ${SERVICE_NAME}${NC}"
echo -e "  Logs:     ${YELLOW}sudo journalctl -u ${SERVICE_NAME} -f${NC}"
echo ""
echo -e "${BLUE}Config file:${NC}"
echo -e "  ${YELLOW}${INSTALL_DIR}/.env${NC}"
echo ""
echo -e "${YELLOW}🐺👑 MASTER YOUSEF WOLF EMPIRE${NC}"
echo -e "${YELLOW}⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓${NC}"
echo -e "${YELLOW}🐾 🐾 🐾${NC}"
