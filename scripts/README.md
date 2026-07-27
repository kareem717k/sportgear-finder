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

## Open decision: JSON-LD prices

`jsonld price` is in the default `-ExcludeSites` list. It is reported but never
written, because the two sides disagree in a way the script cannot arbitrate:

- **Boxing / football / swimming** pages carry exact prices (`79.99`, `24.99`)
  while `products.json` carries rounded ones (`75`, `25`). Here the **HTML is
  better** — those look like real Amazon prices, and rounding them into the
  structured data would degrade rich results.
- **Gym** pages disagree by a lot (`25` vs `40`, `329` vs `364`, `280` vs `315`).
  These look like genuine price updates applied to `products.json` and never
  propagated to the pages. Here **products.json is probably better**.

So `price` in `products.json` is currently a *display* value, not an exact one,
and cannot drive structured data as-is.

**Recommended fix:** give `products.json` an exact price per product and derive
the rounded `priceDisplay` from it, rather than storing only the rounded value.
The Phase 2 price tracker will be fetching exact prices anyway, so this lands on
the path we're already taking. Once that exists, run with
`-ExcludeSites @()` to bring the structured data back in sync.

Until then, `-Apply` deliberately leaves all 90 JSON-LD prices alone.

## Open data issues found by the first full run

- **`B0G3YJLZR2` is claimed by both `trainers-001` (New Balance 608 V5, $65) and
  `trainers-004` (NOBULL Training Shoe, $129).** An ASIN identifies exactly one
  Amazon product, so at least one of these links sends buyers to the wrong item.
  Both cards on `gym/training-shoes.html` currently point at the same product.
  Needs a human to check Amazon and correct the loser.
- **No ASIN in `affiliateLink`:** `shirts-001`, `shorts-001`, `skirts-001`,
  `socks-001`. These use search URLs rather than product links, so they can
  never be synced and their cards drift silently.
