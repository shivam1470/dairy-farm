/* eslint-disable no-console */

// Deterministic OpenAPI download:
// - boots the backend on an ephemeral port
// - waits for /health
// - downloads /api-json
// - shuts down the backend
//
// This makes OpenAPI generation work in CI without relying on a manually-started server.

const { spawn } = require('child_process');
const path = require('path');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFetch() {
  // eslint-disable-next-line no-undef
  if (typeof globalThis.fetch === 'function') return globalThis.fetch;
  const { fetch } = await import('undici');
  return fetch;
}

async function waitForOk(url, { timeoutMs = 30_000, intervalMs = 500 } = {}) {
  const fetchFn = await getFetch();
  const start = Date.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetchFn(url);
      if (res.ok) return;
    } catch (_) {
      // ignore until timeout
    }

    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timed out waiting for ${url}`);
    }

    await sleep(intervalMs);
  }
}

function bootBackend({ port }) {
  const backendDir = path.join(__dirname, '..', '..', '..', 'apps', 'backend');

  // Use PNPM to run the normal dev/start. We prefer `start` (non-watch) for CI-like behavior.
  const child = spawn('pnpm', ['-C', backendDir, 'start'], {
    env: {
      ...process.env,
      PORT: String(port),
      NODE_ENV: process.env.NODE_ENV || 'development',
      SKIP_DB_CONNECT: 'true',
    },
    stdio: 'inherit',
  });

  return child;
}

async function main() {
  const port = Number(process.env.OPENAPI_BACKEND_PORT || 4010);

  console.log(`[openapi] starting backend on :${port}`);
  const child = bootBackend({ port });

  const healthUrl = `http://127.0.0.1:${port}/health`;
  const openapiUrl = process.env.OPENAPI_URL || `http://127.0.0.1:${port}/api-json`;

  try {
    await waitForOk(healthUrl);
    console.log(`[openapi] backend ready, downloading spec from ${openapiUrl}`);

    // Reuse existing downloader by setting OPENAPI_URL.
    const downloadScript = path.join(__dirname, 'download-openapi-spec.cjs');
    const dl = spawn(process.execPath, [downloadScript], {
      env: { ...process.env, OPENAPI_URL: openapiUrl },
      stdio: 'inherit',
    });

    const exitCode = await new Promise((resolve, reject) => {
      dl.on('error', reject);
      dl.on('exit', (code) => resolve(code ?? 1));
    });

    if (exitCode !== 0) {
      throw new Error(`OpenAPI download failed (exit ${exitCode})`);
    }
  } finally {
    console.log('[openapi] stopping backend');
    child.kill('SIGTERM');

    // Give it a moment and then force-kill if needed.
    await sleep(1500);
    if (!child.killed) child.kill('SIGKILL');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
