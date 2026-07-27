<#
.SYNOPSIS
    Generates a sport section's category pages from products.json plus a
    section content file.

.DESCRIPTION
    The 107 hand-written pages on this site all share one structure but were
    each typed by hand. This builds a new section's pages from data instead, so
    every page is structurally identical to the existing ones by construction.

    Product facts (name, tier, score, image, affiliate link) come from
    data/products.json - the same source the Gear Finder uses. Editorial content
    (intro prose, per-product descriptions, specs, guide, FAQ) comes from
    scripts/sections/<name>.json, because that cannot be derived from anything.

    Output paths are FILE-form (pickleball/paddles.html), matching the existing
    URLs. No prices are emitted anywhere - see scripts/README.md.

.EXAMPLE
    .\scripts\build-section.ps1 -Section pickleball
    .\scripts\build-section.ps1 -Section pickleball -Apply
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Section,
    [switch]$Apply
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$defPath  = Join-Path $PSScriptRoot "sections\$Section.json"
if (-not (Test-Path $defPath)) { throw "No section definition at $defPath" }

$def      = ConvertFrom-Json ([System.IO.File]::ReadAllText($defPath))
$products = (ConvertFrom-Json ([System.IO.File]::ReadAllText((Join-Path $RepoRoot 'data\products.json')))).products |
                Where-Object { $_.sport -eq $Section }

if (@($products).Count -eq 0) { throw "No products with sport='$Section' in products.json" }

$TierLabel = @{ budget = 'Budget'; value = 'Best Value'; premium = 'Premium'; cool = 'Cool Pick' }
$TierOrder = @{ budget = 0; value = 1; premium = 2; cool = 3 }

function Esc { param([string]$s) if ($null -eq $s) { return '' } $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;') }
function JEsc { param([string]$s) if ($null -eq $s) { return '' } $s.Replace('\','\\').Replace('"','\"') }

# The nav is identical on every page; only the active item changes.
function Nav {
    param([string]$active)
    $items = @(
        @('Home','../index.html'), @('Tennis','../tennis/index.html'), @('Gym','../gym/index.html'),
        @('Boxing','../boxing/index.html'), @('Swimming','../swimming/index.html'),
        @('Football','../football/index.html'), @('Volleyball','../volleyball/index.html'),
        @('Pickleball','../pickleball/index.html')
    )
    $li = foreach ($i in $items) {
        $cls = ''
        if ($i[0] -eq $active) { $cls = ' class="active"' }
        "<li><a$cls href=`"$($i[1])`">$($i[0])</a></li>"
    }
@"
<nav class="nav-v2">
<a class="nav-logo-v2" href="../index.html">
<div class="logo-mark"><svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 2L10.5 6.5H13.5L11 9.5L12 14L8 11.5L4 14L5 9.5L2.5 6.5H5.5L8 2Z" fill="#111" stroke="#111" stroke-linejoin="round" stroke-width="0.5"/></svg></div>
<span class="logo-text"><em>SportGear</em> Finder</span>
</a>
<button aria-label="Menu" class="nav-hamburger" onclick="this.closest('nav').querySelector('.nav-links').classList.toggle('open')"><span></span><span></span><span></span></button>
<ul class="nav-links">
$($li -join "`n")
<li><a class="nav-tools" href="/tools/">Tools</a></li>
<li><a href="../about.html">About</a></li>
</ul>
<button class="nav-search-btn" aria-label="Search" title="Search (press /)"><svg width="17" height="17" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M14.5 14.5L19 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
</nav>
"@
}

function SideNav {
    param([string]$activeSlug)
    $links = foreach ($c in $def.categories) {
        $cls = ''
        if ($c.slug -eq $activeSlug) { $cls = ' class="active"' }
        "<li><a href=`"$($c.slug).html`"$cls>$(Esc $c.navLabel)</a></li>"
    }
@"
<aside class="side-nav">
<a class="side-nav-back" href="index.html"><svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> $(Esc $def.hubShortName)</a>
<div class="side-nav-group"><span class="side-nav-label">Equipment</span><ul>
$($links -join "`n")
</ul></div>
</aside>
"@
}

$PageStyle = @'
<style>
.cmp-wrap{margin:8px 0 36px;overflow-x:auto;border:1px solid #2a2a2a;border-radius:12px}
.cmp-table{width:100%;border-collapse:collapse;font-size:.88rem;min-width:640px}
.cmp-table th{text-align:left;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:#707070;padding:12px 14px;border-bottom:1px solid #2a2a2a;background:#141414}
.cmp-table td{padding:12px 14px;border-bottom:1px solid #1e1e1e;vertical-align:middle;color:#b0b0b0}
.cmp-table tr:last-child td{border-bottom:none}
.cmp-table tr:hover td{background:#1a1a1a}
.cmp-name a{font-weight:600;color:#ffffff;text-decoration:none}
.cmp-name a:hover{color:#a3c900;text-decoration:underline}
.cmp-tier{display:inline-block;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:20px}
.cmp-tier.budget{background:#eef4e2;color:#5a7a1e}
.cmp-tier.value{background:#e4f0f6;color:#1e6a8a}
.cmp-tier.premium{background:#f6ece0;color:#9a6a1e}
.cmp-score{font-weight:700}
.guide-section{margin:48px 0 0;padding-top:32px;border-top:1px solid #e8e8e4}
.guide-section h2{font-size:1.4rem;margin-bottom:16px}
.guide-section h3{font-size:1.05rem;margin:22px 0 8px}
.guide-section p{line-height:1.7;color:#444;margin-bottom:12px}
.faq-section{margin:48px 0 0;padding-top:32px;border-top:1px solid #e8e8e4}
.faq-section h2{font-size:1.4rem;margin-bottom:16px}
.faq-item{border:1px solid #e8e8e4;border-radius:10px;margin-bottom:10px;overflow:hidden}
.faq-item summary{cursor:pointer;padding:14px 16px;font-weight:600;list-style:none;display:flex;justify-content:space-between;align-items:center}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";font-weight:400;color:#999;font-size:1.2rem}
.faq-item[open] summary::after{content:"\2013"}
.faq-item p{padding:0 16px 14px;line-height:1.65;color:#444;margin:0}
.last-updated{font-size:.8rem;color:#999;margin-bottom:18px}
</style>
'@

$Ga = @'
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0C1DTCG2NX"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','G-0C1DTCG2NX');
</script>
'@

$Footer = [System.IO.File]::ReadAllText((Join-Path $RepoRoot 'volleyball\volleyballs.html'))
$fm = [regex]::Match($Footer, '(?s)<footer class="site-footer">.*?</footer>')
if (-not $fm.Success) { throw 'Could not lift the footer from volleyball/volleyballs.html' }
$Footer = $fm.Value

$written = @{}

foreach ($cat in $def.categories) {
    $slug = $cat.slug
    $items = @($products | Where-Object { $_.category -eq $cat.productCategory } |
               Sort-Object @{ Expression = { $TierOrder[$_.tier] } }, @{ Expression = { $_.score } })
    if ($items.Count -eq 0) { Write-Warning "no products for category '$($cat.productCategory)'"; continue }

    $url = "https://sportgearfinder.com/$Section/$slug.html"

    # ---- JSON-LD ----------------------------------------------------------
    $li = @()
    for ($i = 0; $i -lt $items.Count; $i++) {
        $p = $items[$i]
        $li += '    {"@type":"ListItem","position":' + ($i + 1) + ',"item":{"@type":"Product","name":"' + (JEsc $p.name) +
               '","review":{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"' + ('{0:0.0}' -f $p.score) +
               '","bestRating":"10"},"author":{"@type":"Organization","name":"SportGear Finder"}},"url":"' + (JEsc $p.affiliateLink) + '"}}'
    }
    $faqLd = @()
    foreach ($q in $cat.faq) {
        $faqLd += '    {"@type":"Question","name":"' + (JEsc $q.q) + '","acceptedAnswer":{"@type":"Answer","text":"' + (JEsc $q.a) + '"}}'
    }

    $jsonld = @"
<script type="application/ld+json">{
 "@context": "https://schema.org",
 "@graph": [
  {
   "@type": "ItemList",
   "name": "$(JEsc $cat.listName)",
   "description": "$(JEsc $cat.ogDescription)",
   "url": "$url",
   "numberOfItems": $($items.Count),
   "itemListElement": [
$($li -join ",`n")
   ]
  },
  {
   "@type": "BreadcrumbList",
   "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Home","item":"https://sportgearfinder.com"},
    {"@type":"ListItem","position":2,"name":"$(JEsc $def.hubName)","item":"https://sportgearfinder.com/$Section/"},
    {"@type":"ListItem","position":3,"name":"$(JEsc $cat.navLabel)","item":"$url"}
   ]
  },
  {
   "@type": "FAQPage",
   "mainEntity": [
$($faqLd -join ",`n")
   ]
  }
 ]
}</script>
"@

    # ---- comparison table -------------------------------------------------
    $headCells = @("<th>$(Esc $cat.tableNoun)</th>", '<th>Tier</th>')
    foreach ($col in $cat.tableColumns) { $headCells += "<th>$(Esc $col.label)</th>" }
    $headCells += '<th>Score</th>'

    $rows = foreach ($p in $items) {
        $anchor = $cat.products.($p.id).anchor
        $cells = @("<td class=`"cmp-name`"><a href=`"#$anchor`">$(Esc $cat.products.($p.id).shortName)</a></td>",
                   "<td><span class=`"cmp-tier $($p.tier)`">$($TierLabel[$p.tier])</span></td>")
        foreach ($col in $cat.tableColumns) { $cells += "<td>$(Esc $cat.products.($p.id).($col.key))</td>" }
        $cells += "<td class=`"cmp-score`">$('{0:0.0}' -f $p.score)</td>"
        '<tr>' + ($cells -join '') + '</tr>'
    }

    # ---- tier blocks + cards ---------------------------------------------
    $blocks = ''
    foreach ($tier in 'budget','value','premium') {
        $tierItems = @($items | Where-Object { $_.tier -eq $tier })
        if ($tierItems.Count -eq 0) { continue }
        $band = $cat.tierBands.$tier

        $cards = foreach ($p in $tierItems) {
            $c = $cat.products.($p.id)
            $specs = ($c.specs | ForEach-Object { "<span class=`"pcard-spec`">$(Esc $_)</span>" }) -join ''
@"
<div class="pcard" id="$($c.anchor)">
<div class="pcard-img"><img alt="$(Esc $p.name)" src="$(Esc $p.image)" loading="lazy" decoding="async"/></div>
<div class="pcard-body">
<div class="pcard-name">$(Esc $p.name)</div>
<div class="pcard-meta">
<div class="pcard-price-block"><div class="pcard-tier $($p.tier)">$($TierLabel[$p.tier])</div><div class="pcard-price-note">$(Esc $c.note)</div></div>
<div class="pcard-score"><div class="pcard-score-num">$('{0:0.0}' -f $p.score)<span>/10</span></div><div class="pcard-score-label">Our Score</div></div>
</div>
<p class="pcard-desc">$(Esc $c.desc)</p>
<div class="pcard-specs">$specs</div>
<div class="pcard-footer">
<span class="pcard-best-for">$(Esc $p.bestFor)</span>
<div class="pcard-btns"><a class="btn btn-amazon btn-sm" href="$(Esc $p.affiliateLink)" rel="noopener sponsored" target="_blank">Amazon</a></div>
</div>
</div>
</div>
"@
        }

        $blocks += @"

<div class="tier-v2">
<div class="tier-v2-header">
<span class="tier-v2-badge $tier">$($TierLabel[$tier])</span>
<h2 class="tier-v2-title">$(Esc $band.title)</h2>
<span class="tier-v2-sub">$(Esc $band.sub)</span>
</div>
<div class="products-v2">
$($cards -join "`n")
</div>
</div>
"@
    }

    $guide = ($cat.guide | ForEach-Object {
        if ($_.h) { "<h3>$(Esc $_.h)</h3>`n<p>$(Esc $_.p)</p>" } else { "<p>$(Esc $_.p)</p>" }
    }) -join "`n"

    $faq = ($cat.faq | ForEach-Object {
        "<details class=`"faq-item`"><summary>$(Esc $_.q)</summary><p>$(Esc $_.a)</p></details>"
    }) -join "`n"

    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>$(Esc $cat.title)</title>
<meta content="$(Esc $cat.metaDescription)" name="description"/>
<link href="../css/style.css" rel="stylesheet"/>
<link href="https://m.media-amazon.com" rel="preconnect"/>
<link crossorigin="" href="https://m.media-amazon.com" rel="preconnect"/>
<link href="https://www.googletagmanager.com" rel="dns-prefetch"/>
<link href="$url" rel="canonical"/>
<meta content="website" property="og:type"/>
<meta content="$url" property="og:url"/>
<meta content="$(Esc $cat.ogTitle)" property="og:title"/>
<meta content="$(Esc $cat.ogDescription)" property="og:description"/>
<meta content="https://sportgearfinder.com/og-image.png" property="og:image"/>
<meta content="SportGear Finder" property="og:site_name"/>
<meta content="summary_large_image" name="twitter:card"/>
$jsonld$PageStyle
$Ga
</head>
<body class="sport-$Section">
$(Nav $def.hubName)
<section class="cat-page-hero">
<div class="cat-hero-content">
<span class="cat-hero-eyebrow">$(Esc $def.hubName) Equipment</span>
<h1>$($cat.h1)</h1>
<p>$(Esc $cat.heroSub)</p>
</div>
</section>

<div class="page-layout">
$(SideNav $slug)
<div class="sidebar-content">
<div class="breadcrumb"><a href="../index.html">Home</a> / <a href="index.html">$(Esc $def.hubName)</a> / $(Esc $cat.navLabel)</div>
<div class="container">
<div class="page-intro-v2">
<p>$($cat.intro)</p>
</div>
<p class="last-updated">Last updated: $(Esc $def.lastUpdated)</p>

<div class="cmp-wrap">
<table class="cmp-table">
<thead><tr>$($headCells -join '')</tr></thead>
<tbody>
$($rows -join "`n")
</tbody>
</table>
</div>
$blocks

<div class="guide-section">
<h2>$(Esc $cat.guideHeading)</h2>
$guide
</div>

<div class="faq-section">
<h2>Frequently Asked Questions</h2>
$faq
</div>

<div class="disclosure" id="disclosure" style="margin-top:48px;">
<strong>Affiliate Disclosure:</strong> As an Amazon Associate, SportGear Finder earns from qualifying purchases at no extra cost to you.
</div>
</div><!-- /container -->
</div><!-- /sidebar-content -->
</div><!-- /page-layout -->

$Footer

<script src="../js/search.js"></script>
<script src="../js/animations.js"></script>
</body>
</html>
"@

    $written["$Section\$slug.html"] = $html
}

# ---------------------------------------------------------------- validate
$bad = 0
foreach ($rel in $written.Keys) {
    foreach ($blk in [regex]::Matches($written[$rel], '(?s)<script type="application/ld\+json">(.*?)</script>')) {
        try { $null = ConvertFrom-Json $blk.Groups[1].Value }
        catch { $bad++; Write-Host "INVALID JSON-LD in $rel : $_" -ForegroundColor Red }
    }
}

Write-Host ""
Write-Host "pages generated : $($written.Count)" -ForegroundColor Cyan
Write-Host "JSON-LD errors  : $bad" -ForegroundColor $(if ($bad) { 'Red' } else { 'Green' })
foreach ($rel in ($written.Keys | Sort-Object)) {
    Write-Host ("  {0,-34} {1,6} bytes" -f $rel, $written[$rel].Length)
}

if ($bad -gt 0) { throw 'Refusing to write: invalid structured data.' }

Write-Host ""
if (-not $Apply) { Write-Host 'Report only. Re-run with -Apply to write.' -ForegroundColor Cyan; return }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$dir = Join-Path $RepoRoot $Section
if (-not (Test-Path $dir)) { $null = New-Item -ItemType Directory -Path $dir }
foreach ($rel in $written.Keys) {
    [System.IO.File]::WriteAllText((Join-Path $RepoRoot $rel), $written[$rel], $utf8NoBom)
}
Write-Host "Wrote $($written.Count) file(s)." -ForegroundColor Green
