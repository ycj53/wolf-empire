#!/usr/bin/env python3
"""
MASTER YOUSEF WOLF EMPIRE — One-Click Installer
================================================
Automatically detects platform and installs the panel.

Usage:
    python3 scripts/install.py

Features:
    - Detects platform (Cloudflare / VPS / Katabump / Docker)
    - Installs dependencies
    - Creates .env file with random UUID and password
    - Starts the panel
"""
import os
import sys
import platform
import subprocess
import secrets
import json
from pathlib import Path

# Colors
class C:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'
    BOLD = '\033[1m'

WOLF_BANNER = f"""
{C.YELLOW}🐺👑 MASTER YOUSEF WOLF EMPIRE — Installer
{C.YELLOW}⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓
{C.YELLOW}🐾 🐾 🐾{C.NC}
"""


def run(cmd, check=True, capture=False):
    """Run a shell command."""
    if capture:
        return subprocess.run(cmd, shell=True, check=check, capture_output=True, text=True)
    return subprocess.run(cmd, shell=True, check=check)


def detect_platform():
    """Detect which platform we're running on."""
    # Check if running in Cloudflare Workers
    if os.environ.get('CF_PAGES') or os.environ.get('CLOUDFLARE'):
        return 'cloudflare'
    
    # Check if running in Docker
    if os.path.exists('/.dockerenv'):
        return 'docker'
    
    # Check if running on Katabump (container@katabump hostname)
    try:
        hostname = run('hostname', capture=True).stdout.strip()
        if 'katabump' in hostname.lower():
            return 'katabump'
    except Exception:
        pass
    
    # Check env vars
    if os.environ.get('KATABUMP_ROOT'):
        return 'katabump'
    
    # Default to VPS
    return 'vps'


def check_node():
    """Check if Node.js is installed."""
    try:
        result = run('node --version', capture=True)
        version = result.stdout.strip().lstrip('v')
        major = int(version.split('.')[0])
        if major < 18:
            print(f"{C.RED}❌ Node.js {version} is too old. Need 18+.{C.NC}")
            return False
        print(f"{C.GREEN}✅ Node.js {version}{C.NC}")
        return True
    except Exception:
        print(f"{C.RED}❌ Node.js not installed{C.NC}")
        return False


def install_node():
    """Install Node.js 20."""
    system = platform.system().lower()
    if system == 'linux':
        print(f"{C.YELLOW}📦 Installing Node.js 20...{C.NC}")
        run('curl -fsSL https://deb.nodesource.com/setup_20.x | bash -', check=False)
        run('apt-get install -y nodejs', check=False) or \
        run('yum install -y nodejs', check=False)
    elif system == 'darwin':
        print(f"{C.YELLOW}📦 Installing Node.js via Homebrew...{C.NC}")
        run('brew install node', check=False)
    else:
        print(f"{C.RED}❌ Please install Node.js 18+ manually{C.NC}")
        sys.exit(1)


def generate_uuid():
    """Generate a random UUID."""
    import uuid
    return str(uuid.uuid4())


def generate_password(length=20):
    """Generate a strong random password."""
    alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def create_env(platform_name):
    """Create .env file."""
    env_path = Path('.env')
    if env_path.exists():
        print(f"{C.YELLOW}⚠️  .env already exists. Skipping.{C.NC}")
        return None
    
    panel_host = input(f"{C.BLUE}Enter panel domain/IP (e.g., panel.example.com): {C.NC}").strip()
    if not panel_host:
        panel_host = 'localhost'
    
    admin_password = generate_password()
    panel_uuid = generate_uuid()
    
    kv_dir = '/data' if platform_name == 'katabump' else './kv-data'
    
    env_content = f"""# MASTER YOUSEF WOLF EMPIRE — Auto-generated
PORT=8787
HOST=0.0.0.0
NODE_ENV=production

PANEL_HOST={panel_host}
PUBLIC_TLS=1
PUBLIC_LINK_PORT=443

ADMIN_PASSWORD={admin_password}
UUID={panel_uuid}

KV_DIR={kv_dir}

# Optional: Telegram Bot
TG_BOT_TOKEN=
TG_ADMIN_ID=

# Optional: WOLF AI (z.ai)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Branding
BRAND_NAME=MASTER YOUSEF
BRAND_FULL=MASTER YOUSEF WOLF EMPIRE
SUPPORT_URL=@Kmnbvczx0090
TELEGRAM_CHANNEL=https://t.me/vpnstan1

USER_TRAFFIC_GB=0
USER_EXPIRY_DAYS=30
"""
    env_path.write_text(env_content)
    print(f"{C.GREEN}✅ Created .env{C.NC}")
    return {'password': admin_password, 'uuid': panel_uuid, 'host': panel_host}


def install_deps():
    """Install npm dependencies."""
    print(f"{C.BLUE}📦 Installing dependencies...{C.NC}")
    if Path('deploy/katabump/package.json').exists():
        os.chdir('deploy/katabump')
        run('npm install --no-audit --no-fund', check=False)
        os.chdir('../..')
    elif Path('package.json').exists():
        run('npm install --no-audit --no-fund', check=False)
    print(f"{C.GREEN}✅ Dependencies installed{C.NC}")


def main():
    print(WOLF_BANNER)
    
    # Detect platform
    platform_name = detect_platform()
    print(f"{C.BLUE}🔍 Detected platform: {C.YELLOW}{platform_name}{C.NC}")
    print()
    
    # Check Node.js
    print(f"{C.BLUE}[1/4]${C.NC} Checking Node.js...")
    if not check_node():
        install = input(f"{C.YELLOW}Install Node.js now? (y/n): {C.NC}").strip().lower()
        if install == 'y':
            install_node()
            if not check_node():
                sys.exit(1)
        else:
            sys.exit(1)
    print()
    
    # Check worker.js
    print(f"{C.BLUE}[2/4]${C.NC} Checking files...")
    if not Path('worker.js').exists():
        print(f"{C.RED}❌ worker.js not found!{C.NC}")
        print(f"{C.YELLOW}   Make sure you're in the project root.{C.NC}")
        sys.exit(1)
    print(f"{C.GREEN}✅ worker.js found{C.NC}")
    print()
    
    # Create .env
    print(f"{C.BLUE}[3/4]${C.NC} Setting up environment...")
    env_info = create_env(platform_name)
    print()
    
    # Install deps
    print(f"{C.BLUE}[4/4]${C.NC} Installing dependencies...")
    install_deps()
    print()
    
    # Show summary
    if env_info:
        print(f"{C.GREEN}🎉 Setup complete!{C.NC}")
        print()
        print(f"{C.YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{C.NC}")
        print(f"{C.GREEN}🐺👑 Panel is ready to start!{C.NC}")
        print(f"{C.YELLOW}   URL:      https://{env_info['host']}{C.NC}")
        print(f"{C.YELLOW}   Password: {env_info['password']}{C.NC}")
        print(f"{C.YELLOW}   UUID:     {env_info['uuid']}{C.NC}")
        print(f"{C.YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{C.NC}")
        print()
    
    # Platform-specific next steps
    if platform_name == 'cloudflare':
        print(f"{C.BLUE}Next steps (Cloudflare Workers):{C.NC}")
        print(f"  npm install -g wrangler")
        print(f"  wrangler login")
        print(f"  wrangler kv:namespace create KV")
        print(f"  # Edit wrangler.toml with KV id")
        print(f"  wrangler deploy")
    elif platform_name == 'katabump':
        print(f"{C.BLUE}Next steps (Katabump):{C.NC}")
        print(f"  Upload files to Katabump dashboard")
        print(f"  Set Startup Command: npm install && node index.js")
        print(f"  Click Start")
    elif platform_name == 'vps':
        print(f"{C.BLUE}Next steps (VPS):{C.NC}")
        print(f"  npm start")
        print(f"  # Or use systemd:")
        print(f"  sudo ./scripts/deploy-vps.sh your-domain.com")
    elif platform_name == 'docker':
        print(f"{C.BLUE}Next steps (Docker):{C.NC}")
        print(f"  docker build -t wolf-empire .")
        print(f"  docker run -d -p 8787:8787 -v wolf-kv:/app/kv-data wolf-empire")
    
    print()
    print(f"{C.YELLOW}🐺👑 MASTER YOUSEF WOLF EMPIRE{C.NC}")
    print(f"{C.YELLOW}⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓{C.NC}")
    print(f"{C.YELLOW}🐾 🐾 🐾{C.NC}")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{C.YELLOW}Installation cancelled.{C.NC}")
        sys.exit(0)
