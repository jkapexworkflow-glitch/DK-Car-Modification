# DK Car Modifications — Cinematic Upgrade — Build Log
Delivered: 26 Jul 2026

## What this delivery is
The existing v6 static site (Astro-free, plain HTML/CSS/JS, carbon-dark + copper-red +
coolant-blue "Panel Gap Line" design system) upgraded with real photography, a Ken Burns
motion system, a signature full-bleed cinematic band, a lightbox, and Open Graph/social
preview tags. No structural rebuild — this extends the existing, already well-built
skeleton rather than replacing it.

## Source assets received
- `dk-car-modifications-website__2_.zip` — the site itself (6 pages, css, js, empty
  assets/video/ folder wired for hero-loop.mp4/webm + workshop-loop.mp4/webm).
- `DK.zip` — 8 phone-gallery screenshots (1080×2280, JPEG) of prior Gemini renders.

## Critical finding: only 5 of 8 images were usable
All 8 screenshots had letterboxing baked in (landscape/square source images shown
full-screen on a portrait phone, black bars top+bottom) — detected via row-brightness
scanning and auto-cropped.

Of the 8, **3 were excluded from the live site**: the Hilux, Harrier, and Raptor shots
all carry *different, competing* garage branding baked into the signage or the
vehicle's own vinyl — "Mukono Garage," "Harrier Clan / Murono Customs," "Raptor
Performance Tuning." Using these on DK's own site would visually contradict DK's brand
and could confuse a visitor about whose shop they're looking at. This mirrors the
Iron Ridge Combat Club precedent (fabricated/misleading content = launch blocker, not
cosmetic). The originals are still in `/mnt/user-data/uploads/…DK.zip` if Jakim wants
them for anything unrelated to DK's own site.

**5 assets used**, exported as optimized WebP+JPG pairs to `assets/img/`:
| File | Source | Content | Usage |
|---|---|---|---|
| `dk-brand-hero-engine` | screenshot 215120 | Gold "DK CAR MODIFICATION" engine-parts logo art, black bg | Homepage hero visual panel; Gallery page-hero wash; Gallery "Studio Craft" |
| `dk-brand-hero-gtr` | screenshot 215108 | Red GTR, "CUSTOM CAR MODIFICATION" gold text, black bg | Services page-hero wash; Gallery "Studio Craft"; video-showcase blurred backdrop |
| `dk-brand-hero-sti` | screenshot 215127 | Blue Subaru STI, "DK CAR MODIFICATION" text, black bg | Services mid-page cinematic divider; Contact page-hero wash; Gallery "Studio Craft" |
| `dk-shopfront-burnout` | screenshot 215124 | **Real "DK CAR MODIFICATION" storefront signage**, grey Subaru burnout | Homepage signature cinematic band; About page workshop photo; video poster frames; primary OG/social share image |
| `dk-atmosphere-kampala-road` | screenshot 215104 | Blue BMW M8, generic Kampala residential street, no signage either way | About page-hero wash only (neutral, low-stakes) |

## What was built
- **CSS** (`css/style.css`, appended ~180 lines): `.kb-media` Ken Burns zoom/pan
  system (`kenburns` / `kenburns-alt` keyframes, `.kb-slow`/`.kb-alt` variants),
  `.cine-band` full-bleed cinematic section component with `.scene-label` (pulsing
  "REC" dot, film-slate style), `.photo-card` + `.photo-card-caption` + `.zoom-hint`
  for real-photo grid items, `.badge-concept` to visually distinguish brand art from
  real photos, `.lightbox`, and a blurred `.video-backdrop` treatment for the
  still-empty video showcase. Everything respects the pre-existing global
  `prefers-reduced-motion` rule automatically.
- **JS** (`js/main.js`, appended ~40 lines): vanilla lightbox module bound to any
  `[data-lightbox]` element, click-outside/Escape/close-button to dismiss.
- **index.html**: hero visual panel now a real Ken Burns photo (was pure SVG
  line-art); new signature `.cine-band` section right after the hero using the real
  shopfront/burnout shot ("Not a showroom render. A working shop.") with CTAs into
  Gallery/About; hero `<video>` hook given a real poster frame.
- **about.html**: page-hero Ken Burns atmosphere wash (BMW/street image); the
  "workshop/team" photo-slot replaced with the real shopfront photo (lightbox-enabled,
  captioned).
- **services.html**: page-hero wash (GTR art); new mid-page `.cine-band` divider
  (Subaru STI art) between the Wheels and Performance categories.
- **gallery.html**: page-hero wash (engine-logo art); new "Studio Craft" section
  (4 real images, `.badge-concept` labeled "Concept Art" except the burnout shot
  labeled "Real Workshop") inserted *above* the original honest placeholder grid,
  which was retitled "Client Builds — Completed project photos" for clarity; video
  showcase given a blurred real-image backdrop instead of a bare box; poster frame
  added.
- **contact.html**: page-hero wash (Subaru STI art) for visual consistency across
  primary pages. Legal pages (privacy/terms) deliberately left plain — no cinematic
  treatment, correct restraint for boilerplate.
- **All 7 pages**: added Open Graph, Twitter Card, and filled the previously-empty
  `schema.org` `image` field, using the shopfront/burnout photo as the default share
  image. **This was completely missing before** and matters a lot given WhatsApp is
  the primary sales channel — a shared link previously showed no preview card at all.

## ⚠️ Action required before/at deploy
1. **Replace `REPLACE-WITH-YOUR-DEPLOYED-DOMAIN`** (appears in the `og:image`,
   `og:url`, `twitter:image`, and schema.org `image` fields across all 7 pages) with
   the real production URL once deployed to Cloudflare Pages. WhatsApp/social preview
   cards require an **absolute** image URL — a relative path will silently fail to
   render a preview. Quick fix: `grep -rl "REPLACE-WITH-YOUR-DEPLOYED-DOMAIN" *.html`
   then find/replace with the live domain.
2. **Video files never arrived.** 5 mp4s were referenced in an earlier turn
   (`hero-loop`, `workshop-loop`, a logo animation, burnout clips) but never
   successfully uploaded in this session. The site is fully wired for them — drop
   `hero-loop.mp4`/`.webm` and `workshop-loop.mp4`/`.webm` into `assets/video/` and
   they'll activate with zero code changes (existing graceful-fallback pattern).
3. **Excluded images**: if Jakim wants the Hilux/Harrier/Raptor renders usable, the
   fix is regenerating them with "DK CAR MODIFICATION" signage instead of the
   fictional competing shop names — not re-including them as-is.

## Validated
- Playwright headless-browser render pass across all 7 pages, desktop (1440×900) and
  mobile (390×844) viewports.
- Lightbox open/close interaction tested live.
- Console/network error sweep: zero real bugs. Only expected noise (sandbox blocks
  Google Fonts CDN; video 404s are by design pending real footage).
- HTML tag-balance validated on all 7 pages.
- Every `assets/img/*` reference in the HTML resolves to a real file on disk.

## Stack (unchanged from prior session)
Plain HTML/CSS/JS, no build step. Design tokens in `css/style.css` `:root`. Contact
constants centralized in `js/main.js` (`DK` object). Deploy path: Cloudflare Pages via
Wrangler CLI, same as the Blush Café and portfolio projects.
