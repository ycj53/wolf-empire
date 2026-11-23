#!/usr/bin/env python3
"""
MASTER YOUSEF WOLF EMPIRE — Katabump Auto-Renewal Script

Katabump's free plan requires renewal every 4 days. This script logs in
to katabump.com, finds your server, and clicks the "renew" button so it
stays alive. Run it via GitHub Actions (cron) so it happens automatically.

Required environment variables (set in GitHub Secrets):
  KATABUMP_EMAIL    — your katabump.com login email
  KATABUMP_PASSWORD — your katabump.com login password
  SERVER_ID         — the katabump server ID hosting the panel
                      (find it in the katabump dashboard URL:
                       https://katabump.com/server/<ID>)

Usage:
  python3 renew.py
"""
import os
import sys
import time
import json

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: playwright not installed.")
    print("Run: pip install playwright && playwright install chromium")
    sys.exit(1)


KATABUMP_EMAIL = os.environ.get("KATABUMP_EMAIL", "").strip()
KATABUMP_PASSWORD = os.environ.get("KATABUMP_PASSWORD", "").strip()
SERVER_ID = os.environ.get("SERVER_ID", "").strip()
KATABUMP_URL = "https://katabump.com"


def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def main():
    if not (KATABUMP_EMAIL and KATABUMP_PASSWORD and SERVER_ID):
        log("ERROR: Missing KATABUMP_EMAIL, KATABUMP_PASSWORD, or SERVER_ID.")
        log("Set them in your GitHub repo: Settings → Secrets and variables → Actions")
        return 1

    log(f"Renewing Katabump server {SERVER_ID}...")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        )
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        )
        page = ctx.new_page()

        try:
            # Step 1: Open login page
            log("Opening katabump.com/login ...")
            page.goto(f"{KATABUMP_URL}/login", wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(2500)

            # Step 2: Fill email + password
            log("Filling login form ...")
            # Try common selectors
            email_selectors = [
                'input[type="email"]', 'input[name="email"]',
                'input[name="username"]', 'input[placeholder*="mail" i]',
                'input[placeholder*="ایمیل"]',
            ]
            pass_selectors = [
                'input[type="password"]', 'input[name="password"]',
                'input[placeholder*="password" i]',
                'input[placeholder*="رمز"]',
            ]
            email_input = None
            for sel in email_selectors:
                el = page.query_selector(sel)
                if el:
                    email_input = el
                    break
            pass_input = None
            for sel in pass_selectors:
                el = page.query_selector(sel)
                if el:
                    pass_input = el
                    break

            if not email_input or not pass_input:
                log("ERROR: Could not find login form fields.")
                page.screenshot(path="/tmp/kb-login-fail.png")
                return 2

            email_input.fill(KATABUMP_EMAIL)
            pass_input.fill(KATABUMP_PASSWORD)
            page.wait_for_timeout(500)

            # Step 3: Submit (click login button or press Enter)
            login_btn = None
            for sel in ['button[type="submit"]', 'button:has-text("Login")', 'button:has-text("ورود")',
                        'button:has-text("Sign in")', 'input[type="submit"]']:
                el = page.query_selector(sel)
                if el:
                    login_btn = el
                    break
            if login_btn:
                login_btn.click()
            else:
                pass_input.press("Enter")

            page.wait_for_timeout(4000)
            log("Login submitted. Checking result ...")

            # Step 4: Go to the server page
            server_url = f"{KATABUMP_URL}/server/{SERVER_ID}"
            log(f"Navigating to {server_url} ...")
            page.goto(server_url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)

            # Step 5: Click "Renew" / "تمدید" button
            log("Looking for renew button ...")
            renew_clicked = False
            for sel in [
                'button:has-text("Renew")', 'button:has-text("تمدید")',
                'button:has-text("Extend")', 'a:has-text("Renew")',
                'a:has-text("تمدید")', 'button[aria-label*="renew" i]',
                '.btn-renew', '#renew-btn',
            ]:
                el = page.query_selector(sel)
                if el:
                    log(f"Found renew button via selector: {sel}")
                    el.click()
                    renew_clicked = True
                    break

            page.wait_for_timeout(3000)
            page.screenshot(path="/tmp/kb-renew-result.png")

            if renew_clicked:
                log("✅ Renew button clicked successfully.")
                # Look for any confirmation
                body = page.inner_text("body")
                if "success" in body.lower() or "موفق" in body or "تمدید" in body:
                    log("✅ Renewal appears to have succeeded.")
                    return 0
                log("⚠ Renewal clicked but couldn't confirm success. Check screenshot.")
                return 0
            else:
                log("⚠ No renew button found — server may already be renewed,")
                log("  or the page structure has changed. Check screenshot.")
                return 3

        except Exception as e:
            log(f"ERROR: {e}")
            try:
                page.screenshot(path="/tmp/kb-error.png")
            except Exception:
                pass
            return 4
        finally:
            browser.close()


if __name__ == "__main__":
    sys.exit(main())
