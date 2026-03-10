/* eslint-disable no-console */

// Downloads the backend OpenAPI spec to a local file so we can generate types
// without depending on the backend being available during typecheck/build.
//
// Usage:
//   OPENAPI_URL=http://127.0.0.1:3001/api-json pnpm --filter @dairy-farm/api-client generate:spec

const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'openapi', 'openapi.json');
const url = process.env.OPENAPI_URL || 'http://127.0.0.1:3001/api-json';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(fetchUrl, { retries = 20, delayMs = 500 } = {}) {
  let lastErr;
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(fetchUrl);
      return res;
    } catch (err) {
      lastErr = err;
      await sleep(delayMs);
    }
  }
  throw lastErr;
}

async function main() {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const res = await fetchWithRetry(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI spec from ${url}: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
  console.log(`Wrote OpenAPI spec to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
