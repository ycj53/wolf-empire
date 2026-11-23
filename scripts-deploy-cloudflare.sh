#!/usr/bin/env bash
# ============================================================================
# MASTER YOUSEF WOLF EMPIRE — Deploy Script (Cloudflare Workers)
# ============================================================================
# Usage:
#   ./scripts/deploy-cloudflare.sh
#
# Requires:
#   - Node.js 18+
#   - wrangler (npm install -g wrangler)
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Wolf Empire branding
echo -e "${YELLOW}🐺👑 MASTER YOUSEF WOLF EMPIRE — Deploy Script${NC}"
echo -e "${YELLOW}⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓${NC}"
echo ""

# Check we're in the right directory
if [ ! -f "worker.js" ]; then
    echo -e "${RED}❌ worker.js not found!${NC}"
    echo -e "Make sure you're in the project root directory."
    exit 1
fi

# Check wrangler
echo -e "${BLUE}[1/6]${NC} Checking Wrangler..."
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler not found. Installing...${NC}"
    npm install -g wrangler
fi
echo -e "${GREEN}✅ Wrangler $(wrangler --version)${NC}"
echo ""

# Check login
echo -e "${BLUE}[2/6]${NC} Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in. Opening browser...${NC}"
    wrangler login
fi
echo -e "${GREEN}✅ Authenticated${NC}"
echo ""

# Setup wrangler.toml
echo -e "${BLUE}[3/6]${NC} Setting up wrangler.toml..."
if [ ! -f "wrangler.toml" ]; then
    if [ -f "wrangler.toml.example" ]; then
        cp wrangler.toml.example wrangler.toml
        echo -e "${YELLOW}📝 Created wrangler.toml from example${NC}"
        echo -e "${YELLOW}   Please edit it with your settings (KV id, UUID, etc.)${NC}"
        echo -e "${YELLOW}   Then re-run this script.${NC}"
        exit 0
    else
        echo -e "${RED}❌ wrangler.toml.example not found!${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ wrangler.toml exists${NC}"
echo ""

# Create KV namespace if not exists
echo -e "${BLUE}[4/6]${NC} Checking KV namespace..."
KV_ID=$(grep -E "^id\s*=" wrangler.toml | head -1 | awk -F'"' '{print $2}')
if [ -z "$KV_ID" ] || [ "$KV_ID" = "YOUR_KV_ID_HERE" ]; then
    echo -e "${YELLOW}⚠️  KV id not set. Creating new KV namespace...${NC}"
    KV_OUTPUT=$(wrangler kv:namespace create KV 2>&1)
    KV_ID=$(echo "$KV_OUTPUT" | grep -oE '"id":\s*"[^"]+"' | head -1 | awk -F'"' '{print $4}')
    if [ -n "$KV_ID" ]; then
        # Replace in wrangler.toml
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/id = \"YOUR_KV_ID_HERE\"/id = \"$KV_ID\"/" wrangler.toml 2>/dev/null || true
            sed -i '' "s/id = \"[^\"]*\"/id = \"$KV_ID\"/" wrangler.toml 2>/dev/null || true
        else
            # Linux
            sed -i "s/id = \"YOUR_KV_ID_HERE\"/id = \"$KV_ID\"/" wrangler.toml 2>/dev/null || true
            sed -i "s/id = \"[^\"]*\"/id = \"$KV_ID\"/" wrangler.toml 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ Created KV: $KV_ID${NC}"
    else
        echo -e "${RED}❌ Failed to create KV namespace${NC}"
        echo "$KV_OUTPUT"
        exit 1
    fi
else
    echo -e "${GREEN}✅ KV id: $KV_ID${NC}"
fi
echo ""

# Generate UUID if not set
echo -e "${BLUE}[5/6]${NC} Checking UUID..."
UUID_VAL=$(grep -E "^UUID\s*=" wrangler.toml | head -1 | awk -F'"' '{print $2}')
if [ -z "$UUID_VAL" ] || [ "$UUID_VAL" = "YOUR_UUID_HERE" ]; then
    echo -e "${YELLOW}⚠️  UUID not set. Generating new one...${NC}"
    NEW_UUID=$(node -e "console.log(crypto.randomUUID())")
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|UUID = \"YOUR_UUID_HERE\"|UUID = \"$NEW_UUID\"|" wrangler.toml 2>/dev/null || true
    else
        sed -i "s|UUID = \"YOUR_UUID_HERE\"|UUID = \"$NEW_UUID\"|" wrangler.toml 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ New UUID: $NEW_UUID${NC}"
else
    echo -e "${GREEN}✅ UUID: $UUID_VAL${NC}"
fi
echo ""

# Deploy
echo -e "${BLUE}[6/6]${NC} Deploying to Cloudflare Workers..."
wrangler deploy
echo ""

# Get the URL
WORKER_NAME=$(grep -E "^name\s*=" wrangler.toml | head -1 | awk -F'"' '{print $2}')
echo -e "${GREEN}🎉 Deployment successful!${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🐺👑 Your panel is now LIVE at:${NC}"
echo -e "${YELLOW}   https://${WORKER_NAME}.<your-subdomain>.workers.dev${NC}"
echo -e "${YELLOW}🔐 Password: SUKOT (change it!)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Open the URL above in your browser"
echo -e "  2. Login with password: SUKOT"
echo -e "  3. Change the password in Settings"
echo -e "  4. Create your first user"
echo ""
echo -e "${YELLOW}🐺👑 MASTER YOUSEF WOLF EMPIRE${NC}"
echo -e "${YELLOW}⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓${NC}"
echo -e "${YELLOW}🐾 🐾 🐾${NC}"
