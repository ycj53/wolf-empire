#!/usr/bin/env python3
"""
MASTER YOUSEF WOLF EMPIRE — Backup Script
=========================================
Backs up KV data, user configs, and panel settings.

Usage:
    python3 scripts/backup.py
    python3 scripts/backup.py --output /tmp/backup.zip
    python3 scripts/backup.py --restore backup-2024-01-01.zip
"""
import os
import sys
import json
import shutil
import zipfile
import argparse
from pathlib import Path
from datetime import datetime


def get_env(key, default=None):
    """Get env variable."""
    return os.environ.get(key, default)


def find_kv_dir():
    """Find the KV data directory."""
    # Check env first
    kv_dir = get_env('KV_DIR')
    if kv_dir and Path(kv_dir).exists():
        return Path(kv_dir)
    
    # Check common locations
    candidates = [
        './kv-data',
        '/data',
        '/var/lib/wolf-empire',
        '/app/kv-data',
    ]
    for c in candidates:
        if Path(c).exists():
            return Path(c)
    
    return None


def create_backup(output_path=None):
    """Create a backup of all panel data."""
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    if not output_path:
        output_path = f'wolf-empire-backup-{timestamp}.zip'
    
    print(f"🐺👑 MASTER YOUSEF WOLF EMPIRE — Backup")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    
    # Find KV directory
    kv_dir = find_kv_dir()
    if not kv_dir:
        print(f"❌ Could not find KV data directory")
        print(f"   Set KV_DIR environment variable")
        sys.exit(1)
    
    print(f"📦 KV directory: {kv_dir}")
    
    # Collect files to backup
    backup_files = []
    
    # KV data
    if kv_dir.exists():
        for item in kv_dir.rglob('*'):
            if item.is_file():
                backup_files.append(item)
        print(f"📁 KV files: {len(backup_files)}")
    
    # .env file (config)
    env_path = Path('.env')
    if env_path.exists():
        backup_files.append(env_path)
        print(f"⚙️  Config: .env")
    
    # wrangler.toml if exists
    wrangler_path = Path('wrangler.toml')
    if wrangler_path.exists():
        backup_files.append(wrangler_path)
        print(f"☁️  Cloudflare: wrangler.toml")
    
    # Create backup metadata
    metadata = {
        'version': '2.7.0',
        'created_at': datetime.now().isoformat(),
        'panel': 'MASTER YOUSEF WOLF EMPIRE',
        'files_count': len(backup_files),
    }
    
    # Create zip
    print(f"\n📦 Creating backup: {output_path}")
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Add metadata
        zf.writestr('_backup_meta.json', json.dumps(metadata, indent=2))
        
        # Add files
        for f in backup_files:
            try:
                arcname = str(f)
                # Make paths relative
                if str(f).startswith(str(kv_dir)):
                    arcname = f'kv-data/{f.relative_to(kv_dir)}'
                zf.write(f, arcname)
            except Exception as e:
                print(f"⚠️  Skipping {f}: {e}")
    
    size_mb = Path(output_path).stat().st_size / (1024 * 1024)
    print(f"\n✅ Backup created: {output_path}")
    print(f"   Size: {size_mb:.2f} MB")
    print(f"   Files: {len(backup_files)}")
    print()
    print(f"🐺👑 Backup complete!")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


def restore_backup(backup_path):
    """Restore from a backup zip."""
    print(f"🐺👑 MASTER YOUSEF WOLF EMPIRE — Restore")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    
    if not Path(backup_path).exists():
        print(f"❌ Backup file not found: {backup_path}")
        sys.exit(1)
    
    # Confirm
    print(f"⚠️  This will OVERWRITE current data!")
    print(f"   Backup: {backup_path}")
    confirm = input(f"\nContinue? (type 'yes' to confirm): ").strip().lower()
    if confirm != 'yes':
        print("Restore cancelled.")
        sys.exit(0)
    
    # Find KV dir
    kv_dir = find_kv_dir()
    if not kv_dir:
        kv_dir = Path(get_env('KV_DIR', './kv-data'))
        kv_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n📦 Restoring to: {kv_dir}")
    
    # Extract
    with zipfile.ZipFile(backup_path, 'r') as zf:
        for info in zf.infolist():
            if info.filename.startswith('kv-data/'):
                # Extract KV file
                rel_path = info.filename[len('kv-data/'):]
                if not rel_path:
                    continue
                target = kv_dir / rel_path
                target.parent.mkdir(parents=True, exist_ok=True)
                with zf.open(info) as src, open(target, 'wb') as dst:
                    shutil.copyfileobj(src, dst)
            elif info.filename == '.env':
                # Restore env (don't overwrite existing)
                target = Path('.env.restored')
                with zf.open(info) as src, open(target, 'wb') as dst:
                    shutil.copyfileobj(src, dst)
                print(f"✅ .env restored to .env.restored (review before replacing)")
            elif info.filename == 'wrangler.toml':
                target = Path('wrangler.toml.restored')
                with zf.open(info) as src, open(target, 'wb') as dst:
                    shutil.copyfileobj(src, dst)
                print(f"✅ wrangler.toml restored to wrangler.toml.restored")
    
    print(f"\n🎉 Restore complete!")
    print(f"   KV data restored to: {kv_dir}")
    print(f"\n💡 Restart your panel to apply changes:")
    print(f"   sudo systemctl restart wolf-empire")
    print(f"   # or")
    print(f"   docker restart wolf-empire")
    print()
    print(f"🐺👑 Restore complete!")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


def main():
    parser = argparse.ArgumentParser(description='Wolf Empire Backup Tool')
    parser.add_argument('--output', '-o', help='Output backup file path')
    parser.add_argument('--restore', '-r', help='Restore from backup zip')
    args = parser.parse_args()
    
    if args.restore:
        restore_backup(args.restore)
    else:
        create_backup(args.output)


if __name__ == '__main__':
    main()
