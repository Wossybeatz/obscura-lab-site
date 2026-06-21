# WOSSYBEATZ — website

Sound kits, sample packs and bundles storefront. Built with Next.js,
Tailwind CSS and Payhip (for checkout, payment, and file delivery).

## How payments work here

This site does NOT have its own checkout, cart, or payment processing.
Every "Buy now" button is a direct link to Payhip's checkout page for that
product (`payhip.com/buy?link=KEY`), opened in a new tab so customers never
lose their place on your site. Payhip handles the entire purchase: payment,
secure file delivery, taxes, coupons, and fraud protection.

**Customer accounts:** if a customer creates a password/account during
checkout (you may have noticed this option on Payhip's payment screen),
that's a Payhip account, not something this website manages. It lets
customers log into payhip.com later to re-download past purchases. There's
nothing to set up on the website side for this — it's automatic once
Payhip is handling checkout.

## What's already working

- Product catalog defined in `data/products.json` and `data/bundles.json` — currently has the two real products you've listed in Payhip: **DUNESCAPE** ($59.99) and **HYLOZOISM** ($20)
- Every product card and product detail page has a working "Buy now" button linking straight to that product's real Payhip checkout
- Real cover art and full descriptions for both products (pulled from your Payhip listings)
- A sticky preview player (see below) with real pitch-shifting
- `data/bundles.json` is currently empty — the Bundles page shows an empty state until you add real bundles

## Preview player

Every product has a play button (on its card and on its detail page) that
opens a sticky player at the bottom of the screen — like the one on
atrumlab.com. It's built on [Tone.js](https://tonejs.github.io/) and
supports:

- Play/pause and a seekable progress bar
- A **"P" (pitch) control** — opens a popup with a −12 to +12 semitone
  slider and a Reset button, same as atrumlab.com. This is a **real pitch
  shift**: the tempo/speed of the loop stays exactly the same, only the
  pitch changes (powered by Tone.js's `PitchShift` node, which does
  real-time time-stretching under the hood)
- Volume control
- Looping playback

Right now every product plays the same placeholder demo loop
(`public/audio/demo-preview.mp3`, a short programmatically-generated trap
beat — not a real clip from any kit). To wire up real previews:

1. Export a short preview clip for each product (15–30 seconds works well)
2. Add it to `public/audio/` (e.g. `public/audio/dunescape-preview.mp3`)
3. In `components/ProductCard.tsx` and `app/product/[slug]/ProductPlayButton.tsx`,
   change the `audioUrl` from the hardcoded `/audio/demo-preview.mp3` to use
   `product.previewUrl` instead (the field already exists in the data, it's
   just not connected to real files yet)
4. Set `previewUrl` in `data/products.json` for each product to the file path

**Note on the player implementation:** Tone.js is loaded dynamically
(`import("tone")`) inside `components/PreviewPlayer.tsx` rather than at the
top of the file. This is intentional — Tone.js needs a real browser audio
context, so loading it lazily keeps the rest of the site's pages fast and
avoids issues during server-side rendering.

## Color theme

The site uses a dark terminal/hacker aesthetic with an electric blue/cyan
accent color (previously neon green). All accent colors are defined as CSS
variables in `app/globals.css`:

```css
--accent: #2fd8ff;
--accent-dim: #1879a8;
--accent-glow: rgba(47, 216, 255, 0.45);
```

To change the accent color site-wide, just edit these three values — every
component references them instead of hardcoding a color.

## How to add a real product

1. Upload the product in your Payhip dashboard as usual
2. Copy the product key from the URL (e.g. `payhip.com/b/9YaVZ` → the key is `9YaVZ`)
3. Open `data/products.json`, find or add the product entry, and set `"payhipKey"` to that key
4. Add a cover image to `public/products/` and set `"coverImage"` to its path (e.g. `/products/mykit.jpg`) — or leave it `null` to use a generated color gradient placeholder instead

Example:

```json
{
  "id": "dunescape",
  "slug": "dunescape",
  "name": "DUNESCAPE",
  "type": "drum kit",
  "category": "kits",
  "description": "...",
  "price": 59.99,
  "salePrice": null,
  "badge": "NEW",
  "coverColor": "#1a0f02",
  "coverImage": "/products/dunescape.jpg",
  "fileCount": 600,
  "format": "WAV, 2.8GB+",
  "genres": ["trap", "cinematic", "neural"],
  "previewUrl": null,
  "payhipKey": "9YaVZ",
  "featured": true
}
```

- `slug` is used in the URL (`/product/dunescape`) — keep it unique and lowercase
- `salePrice` set to `null` means no discount; set it to a number to show a strike-through price
- `featured: true` makes it show up in the homepage "Bestsellers" section
- `description` supports line breaks — use `\n` for a line break, `\n\n` for a paragraph break in the JSON string

## How to add a real bundle

`data/bundles.json` is currently an empty array (`[]`) since there are no
real bundles in Payhip yet. To add one:

1. Set up the bundle as its own product in Payhip (Payhip supports
   multi-product bundles/pricing plans — check their docs for "bundles")
2. Copy its product key the same way as above
3. Add an entry to `data/bundles.json`:

```json
{
  "id": "all-kits-bundle",
  "slug": "all-kits-bundle",
  "name": "ALL KITS BUNDLE",
  "type": "bundle",
  "description": "...",
  "includesProductIds": ["dunescape", "hylozoism"],
  "regularPrice": 79.99,
  "bundlePrice": 49.99,
  "badge": "MOST POPULAR",
  "coverColor": "#0d1411",
  "coverImage": null,
  "payhipKey": "YOUR_REAL_BUNDLE_KEY"
}
```

`includesProductIds` should reference the `id` values of products already
in `data/products.json` — this is just used to display "what's included"
on the bundle's page, it doesn't affect what Payhip actually delivers.

## How to run this locally

You'll need [Node.js](https://nodejs.org) installed (version 18 or newer).

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## How to deploy this for real

The easiest path is [Vercel](https://vercel.com) (made by the creators of Next.js):

1. Push this project to a GitHub repository
2. Go to vercel.com, sign in, and import the repository
3. Deploy — no environment variables needed, since there's no payment
   processing happening on this site itself (Payhip handles that)
4. Vercel gives you a live URL automatically, and you can later connect
   your own domain

## Project structure

```
app/
  page.tsx                  → homepage
  kits/page.tsx              → kits & sample packs catalog
  bundles/page.tsx           → bundles catalog (empty state if no bundles yet)
  bundles/[slug]/page.tsx    → single bundle page
  plugins/page.tsx           → "coming soon" page
  product/[slug]/page.tsx    → single product page
  product/[slug]/ProductPlayButton.tsx → play button for the product page
  layout.tsx                  → wraps the whole site in the player provider
components/
  Header.tsx, Footer.tsx      → site chrome
  ProductCard.tsx, BundleCard.tsx → catalog cards
  PayhipButton.tsx            → the reusable "Buy now" button (Payhip direct checkout link)
  PreviewPlayer.tsx           → the sticky audio player (Tone.js, pitch-shift)
data/
  products.json, bundles.json  → your product catalog (edit these!)
lib/
  products.ts           → helpers for reading product/bundle data
  types.ts               → TypeScript types
  player-context.tsx      → React context that lets any "play" button control the global player
public/
  products/               → product cover images
  audio/                   → preview audio clips (currently one placeholder demo loop)
```
