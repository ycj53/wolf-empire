/**
 * MASTER YOUSEF WOLF EMPIRE — Node.js Server (Katabump / VPS / Docker / Railway)
 * ============================================================================
 * Runs the Cloudflare Worker (worker.js) on a plain Node.js process using
 * Miniflare — the exact same runtime Cloudflare uses in production.
 *
 * This means the SAME worker.js file deployed to Cloudflare can also run on:
 *   - Katabump (free Node.js hosting)
 *   - Any VPS (Linux / Windows / Mac)
 *   - Docker containers
 *   - Railway / Render / Fly.io / Heroku
 *
 * It requires NO Cloudflare account to run — everything runs locally via Miniflare,
 * using an in-memory or on-disk KV store.
 *
 * Usage:
 *   npm install
 *   npm start
 *
 * Env vars (see .env.example):
 *   PORT              — HTTP port (default 8787; Katabump sets this automatically)
 *   PANEL_HOST        — public domain/IP for the panel links
 *   ADMIN_PASSWORD    — admin login password (default: SUKOT)
 *   KV_DIR            — directory for persistent KV storage (default: ./kv-data)
 *   ... (see .env.example for the full list)
 */

'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const { Miniflare, Request } = require('miniflare');

// ---------------------------------------------------------------------------
// Config — read from environment with sensible defaults
// ---------------------------------------------------------------------------
const PORT = parseInt(process.env.PORT || process.env.SERVER_PORT || '8787', 10);
const HOST = process.env.HOST || '0.0.0.0';

const WORKER_PATH = path.resolve(__dirname, 'worker.js');
const KV_DIR = path.resolve(__dirname, process.env.KV_DIR || './kv-data');

// Build env vars object from process.env (passed through to the worker)
const envVars = {};
const ENV_KEYS = [
  // Panel core
  'UUID', 'ADMIN_PASSWORD', 'PANEL_HOST', 'SERVER_IP', 'PUBLIC_URL',
  'PUBLIC_LINK_PORT', 'PUBLIC_TLS',
  // Telegram
  'TG_BOT_TOKEN', 'TG_ADMIN_ID',
  // WOLF AI
  'GEMINI_API_KEY', 'GEMINI_MODEL',
  // Branding
  'BRAND_NAME', 'BRAND_FULL', 'SUPPORT_URL', 'TELEGRAM_CHANNEL',
  // User defaults
  'USER_TRAFFIC_GB', 'USER_EXPIRY_DAYS',
  // Katabump / Railway
  'KATABUMP_ROOT', 'RAILWAY_PROJECT_ID',
];
for (const k of ENV_KEYS) {
  if (process.env[k] !== undefined) envVars[k] = process.env[k];
}
// Always set sensible defaults if missing
envVars.UUID = envVars.UUID || '06472f28-8568-4e61-9bd1-8ed64f25acc1';
envVars.ADMIN_PASSWORD = envVars.ADMIN_PASSWORD || 'SUKOT';
envVars.BRAND_NAME = envVars.BRAND_NAME || 'MASTER YOUSEF';
envVars.BRAND_FULL = envVars.BRAND_FULL || 'MASTER YOUSEF WOLF EMPIRE';
envVars.GEMINI_MODEL = envVars.GEMINI_MODEL || 'gemini-1.5-flash';

// Resolve the panel host — used for self-referencing URLs in the worker
let panelHost = process.env.PANEL_HOST || process.env.SERVER_IP || process.env.PUBLIC_URL || '';
if (panelHost && !panelHost.startsWith('http')) panelHost = 'https://' + panelHost;
if (!panelHost) {
  // fall back to localhost for dev
  panelHost = `http://localhost:${PORT}`;
}

// ---------------------------------------------------------------------------
// Ensure KV dir exists
// ---------------------------------------------------------------------------
try { fs.mkdirSync(KV_DIR, { recursive: true }); } catch (e) {}

// ---------------------------------------------------------------------------
// Read the worker source
// ---------------------------------------------------------------------------
if (!fs.existsSync(WORKER_PATH)) {
  console.error('❌ worker.js not found. Expected at:', WORKER_PATH);
  console.error('   Make sure worker.js is in the same directory as server.js');
  process.exit(1);
}
const workerScript = fs.readFileSync(WORKER_PATH, 'utf8');
console.log(`📦 Loaded worker.js (${(workerScript.length / 1024).toFixed(1)} KB)`);

// ---------------------------------------------------------------------------
// Boot Miniflare with the worker script
// Miniflare is the official local emulator for Cloudflare Workers.
// It runs the EXACT same V8 isolate + workerd runtime as production.
// ---------------------------------------------------------------------------
async function boot() {
  console.log('🐺 Starting MASTER YOUSEF WOLF EMPIRE panel...');
  console.log(`   Port: ${PORT}`);
  console.log(`   Panel host: ${panelHost}`);
  console.log(`   KV storage: ${KV_DIR}`);
  console.log('');

  const mf = new Miniflare({
    // The worker script — compiled with the same runtime as Cloudflare
    script: workerScript,
    scriptPath: WORKER_PATH,
    modules: true,
    compatibilityDate: '2024-11-06',
    compatibilityFlags: ['nodejs_compat'],

    // KV namespace bound as `KV` — Miniflare 3 persists it in the cacheDirectory.
    // The "id" here is just a label Miniflare uses internally; it doesn't need to
    // match a real Cloudflare KV id since we're running locally.
    kvNamespaces: ['KV'],

    // Durable Objects — bind the LiveCounter class.
    // Miniflare 3 will find the DO class in the worker script automatically.
    durableObjects: {
      LIVECOUNTER: 'LiveCounter',
    },

    // Cache directory for KV + DO persistence (defaults to .mf inside cwd)
    cacheDirectory: KV_DIR,

    // Globals available as `globalThis.X` inside the worker
    globals: {
      WOLF_NODE_MODE: true,
      WOLF_NODE_HOST: panelHost,
    },

    // Pass through env vars to the worker's `env` parameter
    bindings: envVars,

    // Upstream fetches (e.g. to Cloudflare's API) go through Node's fetch
    upstream: 'https://1.1.1.1',
  });

  // ---------------------------------------------------------------------------
  // HTTP server — accepts incoming requests, dispatches to the worker
  // ---------------------------------------------------------------------------
  const server = http.createServer(async (req, res) => {
    try {
      // Build a full URL (req.url is just path + query)
      const host = req.headers.host || `localhost:${PORT}`;
      const protocol = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
      const fullUrl = new URL(req.url, `${protocol}://${host}`);

      // Read request body
      let body = undefined;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        if (chunks.length) body = Buffer.concat(chunks);
      }

      // Build a fetch Request
      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers)) {
        if (Array.isArray(v)) v.forEach(x => headers.append(k, x));
        else headers.set(k, v);
      }
      const fetchReq = new Request(fullUrl.toString(), {
        method: req.method,
        headers,
        body,
        redirect: 'manual',
      });

      // Dispatch to the worker via Miniflare
      const fetchRes = await mf.dispatchFetch(fetchReq);

      // Send status + headers
      const status = fetchRes.status;
      const resHeaders = {};
      fetchRes.headers.forEach((v, k) => {
        // Don't set transfer-encoding — Node handles it
        if (k.toLowerCase() === 'transfer-encoding') return;
        if (k.toLowerCase() === 'content-length') return; // we recompute
        if (resHeaders[k] === undefined) resHeaders[k] = v;
        else resHeaders[k] += ', ' + v;
      });

      // Stream the body back
      res.writeHead(status, resHeaders);
      const reader = fetchRes.body?.getReader();
      if (reader) {
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        pump().catch(e => { console.error('Stream error:', e.message); res.end(); });
      } else {
        res.end();
      }
    } catch (err) {
      console.error('❌ Request error:', err.message);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ error: 'Internal server error', detail: err.message }));
    }
  });

  // Handle upgrade (WebSocket) requests — needed for VLESS over WS
  server.on('upgrade', async (req, socket) => {
    try {
      const host = req.headers.host || `localhost:${PORT}`;
      const protocol = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
      const fullUrl = new URL(req.url, `${protocol}://${host}`);

      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers)) {
        if (Array.isArray(v)) v.forEach(x => headers.append(k, x));
        else headers.set(k, v);
      }
      const fetchReq = new Request(fullUrl.toString(), {
        method: req.method,
        headers,
      });

      // Miniflare handles WebSocket upgrades internally
      const pair = new WebSocketPair();
      // We can't easily bridge raw TCP to a WebSocket here — for production VPN
      // traffic (VLESS/WS), you should run this behind a real proxy like nginx
      // or use the Cloudflare deployment. This Node.js adapter is best for the
      // panel UI + subscription + admin APIs.
      socket.write('HTTP/1.1 426 Upgrade Required\r\n\r\n');
      socket.end('WebSocket VPN traffic should go through Cloudflare. This Node server hosts the panel UI only.');
    } catch (err) {
      console.error('Upgrade error:', err.message);
      try { socket.destroy(); } catch (e) {}
    }
  });

  server.listen(PORT, HOST, () => {
    console.log('');
    console.log('🐺👑 MASTER YOUSEF WOLF EMPIRE — Panel is LIVE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ➜  Local:    http://localhost:${PORT}`);
    console.log(`  ➜  Public:   ${panelHost}`);
    console.log(`  ➜  Password: ${envVars.ADMIN_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⛓ chains ready  •  👑 crown shining  •  🐺 wolf watching');
    console.log('');
  });

  // Graceful shutdown
  const shutdown = async (sig) => {
    console.log(`\n${sig} received, shutting down...`);
    server.close();
    try { await mf.dispose(); } catch (e) {}
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

boot().catch(err => {
  console.error('💥 Failed to start:', err);
  process.exit(1);
});
