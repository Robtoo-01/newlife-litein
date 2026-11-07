# New Life Church Litein — website

Marketing site for **New Life Prayer Center and Church, Litein** (Kericho County, Kenya),
part of the Newlife Prayer Center & Church family.

Live: https://newlife-litein.pages.dev/

## What's here

```
newlife-litein/
├── index.html          # the whole site — markup, styles and scripts in one file
├── 404.html            # branded "page not found" (Cloudflare Pages serves it automatically)
├── images/             # photography (7 files, ~0.5 MB, optimised)
├── favicon.svg         # brand mark (modern browsers)
├── favicon.ico         # fallback icon
├── apple-touch-icon.png
├── icon-192.png / icon-512.png
├── site.webmanifest    # PWA / home-screen metadata
├── robots.txt          # crawler rules + sitemap pointer
├── sitemap.xml         # single-page sitemap
├── _headers            # Cloudflare Pages security headers (CSP, HSTS, etc.)
├── CHECKLIST.md        # launch & security checklist, item by item
└── README.md
```

The page is a single self-contained `index.html`: CSS in a `<style>` block, behaviour (navigation,
scroll effects, dynamic service/event/testimony cards, the WhatsApp contact form, click-to-load map,
sticky mobile CTA) in `<script>` blocks at the end. Images are plain files referenced by relative path.

There is **no build step** — it's static files. Open `index.html` in a browser to preview.

## Design

Aligned to the **Newlife Prayer Center & Church** parent brand (newlifeprayercenterandchurch.org):
royal-blue / gold / red palette on white, **Cinzel** classical serif headings with **Lato** body
text (Google Fonts), vibrant full-colour bands (royal-blue Services, red event card, deep-blue
footer) with translucent glass cards, and gold pill badges. The copy, photography and logo mark are
original to this site — only the visual language matches the family brand. Tasteful motion — a slow
hero Ken-Burns drift, staggered entrance, floating elements and micro-interactions — is disabled
automatically for visitors who prefer reduced motion.

## Editing content

Most wording you'll want to change is in the two data blocks near the top of the `<script>`:

- `EVENTS` — upcoming programmes (title, dates, time, description). The soonest unfinished one shows
  automatically in the "at a glance" section; with none upcoming it falls back to the weekly service.
- `SERVICES` — the service cards.
- `TESTIMONIES` — testimony cards (currently marked as samples — replace with approved ones).

Other details (phone `0741 277 938`, M-PESA till `6887385`, service times, address, map, socials)
sit in the markup and can be edited directly.

## Privacy & security (summary)

- No cookies are set on load; the map and YouTube are **click-to-load**, and there's no analytics —
  so no cookie banner is required.
- Prayer requests open in WhatsApp and are never stored on a server.
- Security headers (CSP, HSTS, anti-clickjacking, etc.) ship in `_headers`.
- See **CHECKLIST.md** for the full item-by-item status.

To enable privacy-friendly, cookieless traffic stats, switch on **Cloudflare Web Analytics** in the
Pages dashboard (no code change, no banner needed).

## Deploy

### Cloudflare Pages (current host)
1. Push this repo to GitHub.
2. In Cloudflare Pages, create a project from the repo.
3. Framework preset: **None**. Build command: *(empty)*. Build output directory: `/`.

`_headers`, `robots.txt`, `sitemap.xml` and `404.html` are picked up automatically by Pages.

### GitHub Pages
Serves from `index.html` at the root. Note: GitHub Pages ignores `_headers` — security headers there
would need a different mechanism (e.g. a `<meta http-equiv>` CSP or a proxy).

## Licence / credits

Content and photography © New Life Prayer Center and Church – Litein.
