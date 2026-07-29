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

## Round 2 — full cinematic saturation (26 Jul 2026, same day)

Jakim's direction: don't exclude the 3 flagged images — use everything, and leave no
section on the site reading as empty/unfinished. He also supplied a reference build
(`casaflora-site__2_.zip`, a prior, more elaborate project of his — real video loops,
adaptive quality switching, viewport-aware playback, ambient particle canvas, full
section-level media backgrounds) as the bar to match or beat.

**Decision on the 3 previously-excluded images**: re-included per explicit
instruction, but used exclusively as low-opacity (0.14–0.28) ambient background
texture with a heavy dark gradient overlay baked into `.section-media-bg::after` —
never as sharp, captioned "this is our work" gallery items. At that opacity/overlay
level the competing signage text (Mukono Garage / Harrier Clan / Raptor Performance
Tuning) reads as atmospheric texture, not a legible claim. This was a design
compromise, not a reversal of the underlying judgment — it satisfies "no empty
space" without the specific gallery-caption risk flagged in Round 1.

**Built, borrowing structural patterns from the Casa Flora reference (not its visual
style — DK keeps its own carbon/copper-red identity):**
- `.section-media` / `.section-media-bg` reusable component — every previously-flat
  section on every page now carries a real image at low opacity behind a dark
  gradient, exactly matching Casa Flora's "nothing reads as unfinished" philosophy.
  Applied to: homepage (Services teaser, How It Works, Before/After, Testimonials,
  final CTA), Services (all 6 category sections + final CTA), About (Values,
  Location, final CTA), Contact (contact tiles, FAQ), Gallery (Before/After, final
  CTA), and the shared footer across all 7 pages.
- Ember/spark canvas (`#emberCanvas`, in `js/main.js`) on the homepage hero only —
  adapted from Casa Flora's ambient petal-canvas technique, reskinned as drifting
  copper/gold welding sparks (thematically correct for a mod shop vs. florist
  petals). Respects `prefers-reduced-motion`. Deliberately kept to one signature
  moment rather than repeated everywhere, to avoid diluting the effect.
- Adaptive video quality swap + viewport-aware IntersectionObserver play/pause added
  to `main.js`, same pattern as Casa Flora — dormant until real video lands, zero
  behavior change today, but the site is instantly ready the moment `hero-loop.mp4`
  etc. are dropped into `assets/video/`.
- Deliberate exception kept: Gallery's actual "Client Builds" placeholder grid
  (the still-empty upload slots) was NOT given a background wash — layering imagery
  behind genuinely-empty upload slots would blur the "these are still empty, add
  real photos" signal into decoration.

**All 8 source images now in active use** (up from 5): `dk-brand-hero-engine`,
`dk-brand-hero-gtr`, `dk-brand-hero-sti`, `dk-shopfront-burnout`,
`dk-atmosphere-kampala-road`, `dk-atmosphere-hilux`, `dk-atmosphere-harrier`,
`dk-atmosphere-raptor` — each reused 2–4 times across different sections with
different crops/directions/tints so nothing repeats back-to-back.

**Validated**: HTML tag-balance clean on all 7 pages (re-checked after every edit),
every `assets/img/*` reference resolves to a real file, Playwright full-page render
pass across all 5 main pages with zero JavaScript errors.

## Still outstanding (unchanged from Round 1)
1. Swap `REPLACE-WITH-YOUR-DEPLOYED-DOMAIN` for the real Cloudflare Pages URL at
   deploy time (OG/Twitter/schema image tags, all 7 pages).
2. Video files (hero-loop, workshop-loop, logo animation, burnout clips) still
   haven't uploaded successfully in any session — site is fully wired for them,
   drop into `assets/video/` when available.

## Stack (unchanged from prior session)
Plain HTML/CSS/JS, no build step. Design tokens in `css/style.css` `:root`. Contact
constants centralized in `js/main.js` (`DK` object). Deploy path: Cloudflare Pages via
Wrangler CLI, same as the Blush Café and portfolio projects.

## Round 3 — real photo set + full-screen nav (26 Jul 2026, same day)

Jakim supplied 14 new Gemini-generated images (all direct downloads, clean 16:9,
no letterboxing this time) — 12 matching the prompt pack exactly, plus a stock/
modified LC300 pair and a stock/modified Camry pair for genuine before/after use.
Every single one carries correct, consistent "DK CAR MODIFICATION" branding — the
prompt-pack fix from last round worked.

**Gallery grid**: all 12 "add photo" placeholder slots replaced with real photos,
each re-captioned to accurately describe the actual image (rather than forcing
real photos into placeholder captions that didn't quite match). Final category
mix: exterior ×3, wheels ×3, wraps ×1, performance ×1, interior ×2, detailing ×2.

**Before/after sliders (all 3 across the site)**: wired with the two genuine
stock→modified pairs — Camry (homepage teaser + gallery slider 1) and Land Cruiser
300 (gallery slider 2). Copy deliberately says "the kind of transformation we
deliver" rather than claiming a specific real completed job — these are strong
illustrative renders, not documentation of an actual client vehicle, and that
distinction matters.

**Mobile navigation rebuilt from scratch**: previously just a plain flat-color
slide-in panel with static text links. Now a full-screen cinematic menu: numbered
entries (01–05) with taglines, Ken Burns background image, staggered reveal
animation on open, correct per-page `active` state, and closes via link click,
backdrop click, or Escape key. Focus moves to the first link on open.

**Validated**: HTML tag-balance clean on all 7 pages (found and fixed one missing
closing `</div>` introduced mid-edit in the gallery grid). Playwright full-page
render pass across all 7 pages, zero console/JS errors, zero failed requests
(excluding the still-pending video files). Programmatic DOM checks: 16 total
gallery photo-cards, 0 broken images (all load at full 1376px resolution), filter
chips correctly show/hide by category, all 4 before/after images load correctly,
nav menu opens/closes correctly with correct active state confirmed on Home,
Services, and Gallery.

## Images now in use (28 total across 3 rounds)
Round 1 set (5): dk-brand-hero-engine, dk-brand-hero-gtr, dk-brand-hero-sti,
dk-shopfront-burnout, dk-atmosphere-kampala-road.
Round 2 re-add (3): dk-atmosphere-hilux, dk-atmosphere-harrier, dk-atmosphere-raptor.
Round 3 (14): dk-lc300-modified-lot, dk-lc300-modified-field, dk-lc300-stock,
dk-camry-modified, dk-camry-stock, dk-wheel-before-after-composite, dk-wrap-install,
dk-engine-bay, dk-wheel-fender-closeup, dk-supra-exterior, dk-ceramic-beading,
dk-detailing-polish, dk-interior-wheel-dash, dk-interior-cabin.

## Still outstanding (unchanged)
1. Swap `REPLACE-WITH-YOUR-DEPLOYED-DOMAIN` for the real Cloudflare Pages URL at
   deploy time (OG/Twitter/schema image tags, all 7 pages).
2. Video files still haven't uploaded successfully in any session — site is fully
   wired for them, drop into `assets/video/` when available.

## Hotfix — nav-menu-bg / nav-link taglines leaking onto desktop (29 Jul 2026)

Bug reported after live deploy: on desktop-width screens, a large Audi R8 image was
rendering statically at the top of the page (overlapping the header/hero), and the
nav links showed raw concatenated text like "01HOME START" instead of just "Home."

Root cause: `.nav-menu-bg` (the mobile full-screen menu's Ken Burns backdrop) and
`.nav-link-num` / `.nav-link-text em` (the mobile menu's numbered/tagline treatment)
were only ever styled *inside* the `@media (max-width: 900px)` block. On desktop
widths, those elements had zero CSS applied — so the background image rendered as a
plain oversized in-flow `<img>`, and the numbering/tagline spans rendered as plain
inline text next to the link label instead of being hidden.

Fix: added explicit desktop-default rules (`display: none`) for all three elements
above the media query, with the mobile query now explicitly re-enabling `display`
for each. Verified via Playwright: desktop nav text is clean ("Home / Services /
Gallery / About / Contact"), `.nav-menu-bg` computes to `display: none` on desktop
across all 7 pages, and the mobile full-screen menu still shows the full numbered/
tagline treatment correctly.
