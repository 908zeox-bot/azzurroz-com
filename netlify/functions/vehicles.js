// Netlify Function: vehicles.js
// Fetches vehicle metrics from VedaZ KB API (Tailscale-internal)
// Browser clients never see the Tailscale IP — this runs server-side only.

exports.handler = async function (event, context) {
  const VEDAZ_API = "http://100.103.67.60:6400/metrics/vehicles";

  try {
    const res = await fetch(VEDAZ_API, {
      headers: { "X-Agent-ID": "azzurroz" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "VedaZ API returned " + res.status }),
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "https://www.azzurroz.com",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: "VedaZ API unreachable", detail: err.message }),
    };
  }
};
