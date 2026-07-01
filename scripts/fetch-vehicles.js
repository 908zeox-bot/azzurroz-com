#!/usr/bin/env node
// Build-time script: validates that data/vehicles.json is present in the repo.
// Data is written by metrics-push.sh on ZeoX/ZFleet (Tailscale-reachable),
// committed to the repo, and pushed — Netlify auto-deploys on git push.
// No network fetch happens here. If the file is missing, writes empty fallback.

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "vehicles.json");

if (fs.existsSync(DATA_PATH)) {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    const startCount = (data.start_log || []).length;
    const maintCount = (data.maintenance_items || []).length;
    console.log(`[fetch-vehicles] ✓ data/vehicles.json present`);
    console.log(`[fetch-vehicles]   start_log: ${startCount} rows, maintenance_items: ${maintCount} rows`);
    console.log(`[fetch-vehicles]   last_updated: ${data.last_updated}`);
    console.log(`[fetch-vehicles]   _build_fallback: ${data._build_fallback || false}`);
  } catch (err) {
    console.error("[fetch-vehicles] ERROR: data/vehicles.json is malformed —", err.message);
    process.exit(1);
  }
} else {
  console.warn("[fetch-vehicles] WARNING: data/vehicles.json not found — writing empty fallback");
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify({
    start_log: [],
    maintenance_items: [],
    last_updated: null,
    _build_fallback: true
  }, null, 2));
}
