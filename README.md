# Azzurro Z — Website

Static HTML/CSS/JS site for [azzurroz.com](https://www.azzurroz.com).

Migrated from Sintra.ai. Hosted on GitHub + Netlify.

## Stack
- HTML5 + Tailwind CSS (CDN) + vanilla JS
- Netlify for hosting + forms
- No build step required

## Files
```
index.html          Main site
membership.html     Membership tiers detail page
css/styles.css      Custom brand styles
js/main.js          Mobile nav + FAQ accordion + form handling
netlify.toml        Netlify config (redirects, cache headers)
sitemap.xml         SEO sitemap
robots.txt          Search engine directives
```

## Deploy to Netlify

1. Push to GitHub: `git push origin main`
2. Connect repo to Netlify (netlify.com → Add new site → Import from Git)
3. Build settings: no build command, publish directory = `.`
4. Add custom domain `www.azzurroz.com` in Netlify site settings
5. Update DNS: add CNAME `www` → `[your-netlify-site].netlify.app`
6. Enable HTTPS in Netlify (automatic via Let's Encrypt)

## TODO — Before Launch
- [ ] Add real photos (see HTML comments marked `<!-- PHOTO: -->`)
  - Hero background: high-quality car storage or hero car image
  - About section: 1972 Dino 246 GTC in Azzurro blue
  - Add to `/images/` folder
- [ ] Add Azzurro Z logo SVG/PNG to `/images/azzurroz-logo.svg`
  - Update header and footer to use `<img>` tag (see HTML comments)
- [ ] Test Netlify Forms submission
- [ ] Set up form notification email in Netlify dashboard
- [ ] Verify canonical URL is correct in production
- [ ] Submit sitemap to Google Search Console

## DNS Cutover (from Sintra)
1. Log into domain registrar
2. Update `www` CNAME to point to Netlify
3. Remove old Sintra A/CNAME records
4. Wait for propagation (~5 min to 48h)
5. Verify HTTPS works on www.azzurroz.com

## Maintenance
Content updates: edit HTML files directly, commit, push — Netlify auto-deploys.
