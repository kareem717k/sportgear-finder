# scripts/

Build and maintenance scripts.

Note: the site uses `.nojekyll`, so GitHub Pages serves this directory like any
other — `sportgearfinder.com/scripts/sync-products.ps1` is publicly fetchable.
That is harmless today (no secrets, no credentials), but **do not put API keys
or tokens here.** When the Phase 2 price tracker needs Amazon credentials, they
belong in GitHub Actions secrets, never in a file in this repo.

## sync-products.ps1

Makes `data/products.json` the source of truth for the **volatile** product
fields, and pushes them into the 107 static HTML pages. Page structure, prose,
specs, FAQs, meta tags and JSON-LD shape are never touched.

```bash
powershell -File scripts/sync-products.ps1
```

Report only by default. Add `-Apply` to write. `-Filter tennis` limits the run
to matching paths.

### What it syncs

| Site | Source field |
|---|---|
| `<div class="pcard-price">` | `priceDisplay` |
| `<div class="pcard-score-num">` | `score` |
| `<img src>` inside `.pcard` | `image` |
| comparison-table price cell | `priceDisplay` |
| comparison-table `.cmp-score` cell | `score` |
| JSON-LD `image` | `image` |
| JSON-LD `ratingValue` | `score` |
| `href` on Amazon buttons | `affiliateLink` (tag param) |

### How matching works

Products are joined to HTML by **ASIN**, parsed out of `affiliateLink`. That is
the only stable identifier both sides share.

Every edit is scoped to the block that already contains that ASIN — the `.pcard`
div, the `<tr>` whose anchor matches the card's slug, or the JSON-LD `ListItem`.
Nothing is matched by bare text. This matters: an article contains the sentence
*"a 3/4" horse-stall mat (~$40–60 at any farm store)"*, and a naive price
replacement would happily rewrite it.

Numeric fields are compared **numerically**, so `8` vs `8.00` and `10` vs `10.0`
are not treated as differences. When a value genuinely differs, the replacement
mirrors the decimal precision already used on the page.

### Safety properties

- Report-first; `-Apply` is opt-in.
- Writes UTF-8 **without BOM** and preserves LF endings, matching the existing files.
- Edits are applied back-to-front and re-verified against their recorded offset
  immediately before writing; any drift aborts that file rather than writing a
  partial result.
- An ASIN claimed by more than one product is **skipped entirely**, not guessed.

---

## remove-prices.ps1

One-off sweep (kept for re-runs) that removed hard-coded Amazon price claims
from the pages. It is idempotent — running it again reports zero changes.

```bash
powershell -File scripts/remove-prices.ps1
```

### Why

The Amazon Associates [Program Policies](https://affiliate-program.amazon.com/help/operating/policies)
only permit displaying prices that Amazon serves or that come from the Creators
API, and require a retrieval timestamp adjacent to the price unless it refreshes
hourly. Prices typed by hand into HTML meet neither condition — and went stale
within days anyway.

Note that PA-API was retired on **15 May 2026** and replaced by the **Creators
API**, whose eligibility bar is **10 qualifying sales in the last 30 days**.
Until that is reachable, the site cannot display live prices compliantly.

### What it removed

| Surface | Result |
|---|---|
| `.pcard-price` (257) | replaced by a `.pcard-tier` badge |
| `cmp-table` Price column (42 tables) | column dropped, header and cells |
| JSON-LD `offers.price` / `priceCurrency` | stripped; `availability` and `url` kept |
| "Prices checked June 2026" (43) | trimmed to "Last updated: June 2026" |
| "Prices shown are approximate…" (72) | removed |
| `pcard-price` in the Gear Finder (`js/recommender.js`) | removed; that card already showed a tier badge |

Tables are only touched when the header carries **Tier and Score and Price**.
That gate is what protects the editorial tables — budget guides
("Item | Pick | Cost"), the sizing calculators, and article tables with a
different shape all fail it and are left alone.

Every JSON-LD block is re-parsed after editing; a file whose structured data
would no longer parse is not written.

### Deliberately left alone

These are statements about the market, not claims about a listing's current
price, and several carry real keyword value:

- **42 `Under $X` tier headings** — target high-intent queries ("rackets under $100")
- **42 `From $X` category pills** — category-level ranges on hub pages
- **10 page titles** containing prices, e.g. "…11 Picks from $30 Beginner to $200 Pro"
- **9 article tables** with a Price column but no Tier/Score — non-uniform shapes, review by hand
- **Prose prices** — "expect to pay $20–40 for strings and labour"

If you want any of these gone too, they need deciding individually; removing the
`Under $X` headings in particular would cost keyword relevance.

---

## Resolved: JSON-LD prices

`jsonld price` remains in the default `-ExcludeSites` list, but the question is
now moot — `remove-prices.ps1` stripped every JSON-LD price from the site, so
there is nothing left for `sync-products.ps1` to disagree about.

Kept here because it explains why the price data cannot be trusted, which still
matters if prices ever come back:

- **Boxing / football / swimming** pages carried exact prices (`79.99`, `24.99`)
  while `products.json` carried rounded ones (`75`, `25`).
- **Gym** pages disagreed by a lot (`25` vs `40`, `329` vs `364`, `280` vs `315`)
  — price updates applied to `products.json` that never reached the pages.

So `price` in `products.json` is a *display* value, not an exact one. It is now
used only by the Gear Finder for "under $50"-style matching
(`js/recommender.js`), never for display.

**If prices ever return** (i.e. once Creators API access is reachable at 10
qualifying sales in 30 days), they must be fetched live and stamped with a
retrieval time — not stored in `products.json` and rendered statically. That is
the only compliant shape, and it is what a future price-history feature would
have to be built on.

## Open data issues found by the first full run

- **`B0G3YJLZR2` is claimed by both `trainers-001` (New Balance 608 V5, $65) and
  `trainers-004` (NOBULL Training Shoe, $129).** An ASIN identifies exactly one
  Amazon product, so at least one of these links sends buyers to the wrong item.
  Both cards on `gym/training-shoes.html` currently point at the same product.
  Needs a human to check Amazon and correct the loser.
- **No ASIN in `affiliateLink`:** `shirts-001`, `shorts-001`, `skirts-001`,
  `socks-001`. These use search URLs rather than product links, so they can
  never be synced and their cards drift silently.
