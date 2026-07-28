# scripts/

Build and maintenance scripts.

Note: the site uses `.nojekyll`, so GitHub Pages serves this directory like any
other — `sportgearfinder.com/scripts/sync-products.ps1` is publicly fetchable.
That is harmless today (no secrets, no credentials), but **do not put API keys
or tokens here.** When the Phase 2 price tracker needs Amazon credentials, they
belong in GitHub Actions secrets, never in a file in this repo.

All of these are **report-first**: they print what they would do and change
nothing until you add `-Apply`.

---

## SEO scripts

Three scripts fix on-site SEO problems found in a July 2026 audit. Run them in
this order — `refresh-dates.ps1` keys off git status, so it must go last.

```bash
powershell -File scripts/rebalance-links.ps1 -Apply
powershell -File scripts/add-breadcrumbs.ps1 -Apply
powershell -File scripts/refresh-dates.ps1  -Apply
```

### rebalance-links.ps1

Rewrites the `<div class="footer-links">` block on the 60 pages that carry one so
it is **section-relevant**.

Every page used to ship the same four columns — Tennis / Gym / Boxing / Guides —
whatever the page was about. A swimming page linked six tennis articles and zero
swimming ones. The result was a 15x internal-link imbalance: the ~30 articles
hardcoded into that footer had 57–60 inbound internal links each, while
everything published later sat on 3–7. All six pickleball articles were in the
low group.

New columns: **own sport → adjacent sport → Guides → Free Tools.**

The own-sport column is deliberately **uncapped**. An early version capped every
column at 8, which recreated the bug in miniature — tennis has 15 articles, so 7
were silently dropped from every tennis footer and stayed orphaned.

Anchor text and paths come from `sections/article-index.json`. Every path there
is checked against disk before anything is written, so a typo fails the run
rather than shipping a 404 into 60 footers.

Result: inbound internal links per article went from **min 3 / max 60** to
**min 9 / median 21 / max 62**.

### add-breadcrumbs.ps1

Adds a visible `.breadcrumb` trail *and* `BreadcrumbList` JSON-LD to all 57
articles. Category pages already had both; articles had neither, so they showed a
bare URL in search results instead of `sportgearfinder.com > Tennis > …`.

Trail is `Home / <Sport> / <title>`, or `Home / Articles / <title>` for
`articles/guides/*`, which has no hub of its own.

Two JSON-LD shapes exist in the wild here — most articles use an array
`[{Article},{ItemList}]`, but 14 used a bare `{Article}` object. Bare objects are
promoted to arrays so every article ends up the same. Every block is re-parsed
after editing; a page whose structured data would stop parsing is not written.

Idempotent — pages that already have a `BreadcrumbList` are skipped, so it is
safe to re-run after `build-articles.ps1` generates new articles.

Pairs with one CSS rule in `css/style.css`:

```css
.art-hero + .breadcrumb { max-width: 800px; }
```

`.art-body` is border-box, so its 800px already includes the 24px side padding —
matching that number is what lines the trail up with the article text.

### refresh-dates.ps1

Brings `dateModified`, the visible "Updated \<Month\> \<Year\>" line, and sitemap
`<lastmod>` into agreement. They had drifted: 35 pages still declared
`2026-06-01` on all three surfaces.

**It only touches files git reports as modified.** That guard is the point.
Restamping a page nobody edited is a freshness claim that is not true, Google
discounts it when the main content is unchanged, and it destroys your own ability
to tell which pages are actually stale. `-All` overrides this; think before using
it.

Be honest about what it buys: a structural change (footer, breadcrumbs) is a
weaker freshness signal than a content revision. This makes the dates consistent;
it does not make thin pages competitive.

---

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
