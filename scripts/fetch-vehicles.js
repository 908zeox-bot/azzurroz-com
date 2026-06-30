#!/usr/bin/env node
// Build-time script: fetches vehicle metrics from VedaZ API and writes
// data/vehicles.json into the repo so the dashboard reads it statically.
// Runs during Netlify build via Cloudflare Tunnel (public HTTPS — no Tailscale needed).
// Triggered by: AzzurroZ metrics-push.sh → POST Netlify deploy hook → rebuild.

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// CF tunnel URL — ephemeral trycloudflare.com; update if VedaZ restarts and URL changes.
// Secret is set as VEDAZ_SECRET env var in Netlify build settings.
const TUNNEL_BASE = process.env.VEDAZ_TUNNEL_URL || "https://installed-bars-soma-determination.trycloudflare.com";
const VEDAZ_URL = TUNNEL_BASE.replace(/\/$/, "") + "/metrics/vehicles";
const VEDAZ_SECRET = process.env.VEDAZ_SECRET || "";
const OUT_PATH = path.join(__dirname, "..", "data", "vehicles.json");

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const headers = { "X-Agent-ID": "azzurroz-build" };
    if (VEDAZ_SECRET) headers["X-VedaZ-Secret"] = VEDAZ_SECRET;
    const req = lib.get(url, { headers }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        } else {
          resolve(body);
        }
      });
    });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Timeout")); });
    req.on("error", reject);
  });
}

(async () => {
  console.log("[fetch-vehicles] Fetching from VedaZ API:", VEDAZ_URL);
  try {
    const body = await fetch(VEDAZ_URL);
    const data = JSON.parse(body);

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2));

    const startCount = (data.start_log || []).length;
    const maintCount = (data.maintenance_items || []).length;
    console.log(`[fetch-vehicles] ✓ Written ${OUT_PATH}`);
    console.log(`[fetch-vehicles]   start_log: ${startCount} rows, maintenance_items: ${maintCount} rows`);
    console.log(`[fetch-vehicles]   last_updated: ${data.last_updated}`);
  } catch (err) {
    console.error("[fetch-vehicles] ERROR:", err.message);
    // Write a fallback so the dashboard doesn't hard-fail
    const fallback = {
      start_log: [],
      maintenance_items: [],
      last_updated: null,
      error: err.message,
      _build_fallback: true
    };
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(fallback, null, 2));
    console.warn("[fetch-vehicles] Fallback JSON written — dashboard will show empty state.");
    // Don't exit 1; let the build succeed with empty data rather than break the site
  }
})();
