# SportGear Finder

Source for **[sportgearfinder.com](https://sportgearfinder.com)** — a static site
of sports-gear buying guides covering 9 sports, 60 categories and 363 products.

Every guide sorts its picks into **Budget / Best Value / Premium** tiers and
states the specific use case each pick suits, so a recommendation can be matched
to a stated need — budget, skill level, surface, position — rather than to a
brand name. Product links are Amazon affiliate links (tag `sportgearfind-20`),
disclosed on every page.

Sports covered: tennis, badminton, pickleball, ping-pong, boxing, football,
volleyball, swimming, gym.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Homepage — the Gear Finder profile flow |
| `<sport>/` | One directory per sport: hub page plus its category pages |
| `articles/` | 69 long-form guides, grouped by sport, plus `articles/guides/` |
| `tools/` | Free calculators — racket finder, glove and heavy-bag sizing |
| `data/products.json` | The product catalog: 363 entries, one source of truth |
| `scripts/sections/*.json` | Per-sport section data the build scripts read |
| `js/` | Gear Finder, filtering, search, affiliate link and GA4 helpers |
| `scripts/` | PowerShell build and maintenance scripts — see `scripts/README.md` |
| `llms.txt` | How AI crawlers and assistants should cite the site |

## The Gear Finder

`js/gear-finder.js` (with `js/gear-fit.js`) drives the homepage. It asks a short
profile — sport, level, budget, context, gear already owned — and returns one
item per slot of a complete kit inside that budget, with a reason each pick is
there for *this* person, rather than a page of search results.

It is rules-based and entirely client-side. Every item is an entry in
`data/products.json` with a verified affiliate link, so it cannot invent a
product or a link.

## Editorial rules

Read `llms.txt` before writing any copy. The short version:

SportGear Finder is a research and comparison site, **not a testing lab**. Picks
are assembled from manufacturer specifications, published third-party reviews
and aggregated buyer feedback. No page may claim hands-on testing or firsthand
durability results. Where a price cannot be confirmed against two independent
sources, the page shows "See price" instead of a number.

Specification data — weights, dimensions, materials, stud patterns, string
gauges, glove weights, cut types — is reliable. Tier placement and use-case
matching are editorial judgments.

## Working on the site

The build scripts are PowerShell and **report-first**: each one prints what it
would change and touches nothing until you add `-Apply`.

```bash
powershell -File scripts/serve.ps1              # local preview
powershell -File scripts/sync-products.ps1      # catalog -> pages
powershell -File scripts/build-section.ps1      # generate a sport section
powershell -File scripts/sync-site-stats.ps1    # refresh the site-wide counts
```

Do not hand-edit the `<head>` of pages one at a time — meta tags, favicons and
the site-wide stats are kept in sync across all 146 pages by the `sync-*`
scripts.

## Hosting

GitHub Pages from `main`, custom domain via `CNAME`. `.nojekyll` is set, so every
file in the repo is served as-is — including `scripts/`. Keep credentials out of
the repo entirely; secrets belong in GitHub Actions.
