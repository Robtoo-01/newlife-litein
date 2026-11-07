# Launch & security checklist — New Life Church Litein

Status of every item against the site. Legend: ✅ done · ➕ added in this pass · ⚪ not applicable (and why).

**Important context:** this is a **static website** — one HTML page plus images, served by Cloudflare Pages. There is **no server, no database, no user accounts, no backend code and no package manager**. A large part of a generic app-security checklist therefore has nothing to act on here; those items are marked ⚪ with the reason, rather than pretended-done.

## Security & code hygiene

| Item | Status | Notes |
|---|---|---|
| Remove unused packages | ⚪ | No build or `node_modules` — the only external resources are Google Fonts (used) and two click-to-load embeds (used). |
| Check git for secrets | ✅ | Scanned the source — no API keys, tokens or passwords. The Google Map uses the **keyless** embed. `.gitignore` excludes `.env*`. |
| Add rate limiting | ⚪ | No server/API to rate-limit. The contact form hands off to WhatsApp; it never hits a backend. |
| Check user access | ⚪ | No logins, roles or protected areas exist. |
| Hide API keys | ✅ | There are none in the frontend to hide. |
| Hash passwords properly | ⚪ | No passwords / auth system. |
| Proper authentication | ⚪ | No authenticated functionality. |
| Update dependencies | ⚪ | No dependency tree; fonts load from Google's CDN. |
| Sanitize forms | ✅ | All dynamic strings are HTML-escaped before rendering; form values are URL-encoded into the WhatsApp link, never written to the DOM as HTML. |
| Protect against XSS | ✅ | Static content + escaping + a strict CSP (`_headers`) that disallows external/injected scripts. |
| Debug mode | ✅ | No `console`/debug statements left in the code. |
| Full security audit | ✅ | See this table + headers below. |
| Check for exposed files | ✅ | Repo ships only intended files (page, images, icons, config). `.gitignore` blocks env/OS files. |
| Protect admin routes | ⚪ | No admin area. |
| Secure API endpoints | ⚪ | No API endpoints. |
| Check CORS settings | ⚪ | No cross-origin API calls; CSP `connect-src 'self'`. |
| Add security headers | ➕ | `_headers` sets CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. |
| Secure DB access | ⚪ | No database. |

## Launch checklist

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Privacy policy page | ✅ | In-page privacy dialog (owner/pastor-only prayer requests, no publishing). |
| 2 | Terms & conditions page | ✅ | In-page terms dialog. |
| 3 | Secrets off the frontend | ✅ | None present. |
| 4 | Force HTTPS | ➕ | HSTS header (`max-age=1y; includeSubDomains; preload`); Cloudflare Pages also auto-redirects HTTP→HTTPS. |
| 5 | Cookie consent banner | ➕ | Handled by **privacy-by-default**: no cookies are set on load. The map and YouTube are **click-to-load**, and there's no analytics, so no banner is required. (If analytics is added later, add a banner — see item 19.) |
| 6 | Meta titles + descriptions | ✅ | Unique descriptive `<title>` + meta description. |
| 7 | Social preview image | ✅ | Open Graph + Twitter card using `images/congregation.jpg`. |
| 8 | Favicon | ➕ | `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, 192/512 PNGs + `site.webmanifest`. |
| 9 | Sitemap + robots.txt | ➕ | `sitemap.xml` and `robots.txt` added. |
| 10 | Alt text on images | ✅ | Every content image has alt text; decorative images use empty alt. |
| 11 | Compress images | ✅ | 542 KB total, each ≤160 KB, already at optimal JPEG compression; all below-the-fold images are `loading="lazy"`. |
| 12 | Check page load speed | ✅ | Single HTML page, inline CSS/JS, ~0.6 MB images, hero image `fetchpriority="high"`, fonts preconnected. |
| 13 | Fix colour contrast | ✅ | Link/icon tones darkened and hero kicker brightened to meet WCAG AA. |
| 14 | Make it mobile friendly | ✅ | Mobile-first responsive; hamburger menu, stacked layouts, sticky mobile CTA. |
| 15 | Custom 404 page | ➕ | Branded `404.html` (Cloudflare Pages serves it automatically). |
| 16 | Fix broken links | ✅ | All internal anchors resolve to real section IDs; external links verified. |
| 17 | Form validation | ✅ | Inline validation with accessible error messages and `aria-invalid`. |
| 18 | Spam protection | ➕ | Hidden honeypot field blocks bot submissions. |
| 19 | Set up analytics | ⚪→note | Not added (privacy). To enable cookieless analytics, turn on **Cloudflare Web Analytics** in the Pages dashboard — no code or banner needed. |
| 20 | One clear call to action | ✅ | "Plan your visit" is the single primary CTA (hero, nav, sticky mobile bar). |

## SEO / marketing checklist

| Item | Status | Notes |
|---|---|---|
| Unique page titles / meta descriptions | ✅ | Single-page site with a unique title + description. |
| CTA above the fold | ✅ | "Plan your visit" sits in the hero. |
| Internal links | ✅ | Nav + footer link to every section. |
| Breadcrumbs | ⚪ | Single-page site — no page hierarchy to show. |
| Thank-you page | ✅ (equivalent) | Submitting shows an inline success state and opens WhatsApp. |
| Case studies | ⚪ | Not relevant for a church; testimonies serve this role. |
| FAQs | ✅ | 7-question FAQ section. |
| Response-time promise | ➕ | "We usually reply within a day" added by the form. |
| Sticky mobile CTA | ➕ | Appears after the hero on phones. |
| robots.txt | ➕ | Added. |
| Social share image | ✅ | Open Graph image set. |
| Maps + directions | ✅ | Click-to-load map + "Get directions" link. |
| Real reviews | ✅ (consent-based) | Testimonies shown with consent; currently flagged as samples until approved ones replace them. |
| Alt text on images | ✅ | Done. |
| Local schema | ✅ | `Church` JSON-LD with address, hours and parent org. |
| Google Analytics | ⚪→note | See item 19 — Cloudflare Web Analytics recommended instead. |
| Team / leadership photo | ✅ | Pastor Rop section with photo and bio. |

## Security headers shipped (`_headers`)

- **Content-Security-Policy** — only the site's own files, Google Fonts, and the Google Maps / YouTube frames may load; blocks injected/external scripts.
- **Strict-Transport-Security** — forces HTTPS.
- **X-Content-Type-Options: nosniff**, **X-Frame-Options: SAMEORIGIN** (+ CSP `frame-ancestors 'self'`) — anti-sniffing & anti-clickjacking.
- **Referrer-Policy: strict-origin-when-cross-origin**, **Permissions-Policy** — locks down referrers and unused device APIs.

Test them after deploy at https://securityheaders.com and the CSP at https://csp-evaluator.withgoogle.com.
