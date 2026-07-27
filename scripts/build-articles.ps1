<#
.SYNOPSIS
    Generates SEO articles for a section from a content definition.

.DESCRIPTION
    Companion to build-section.ps1. Article chrome (the page-scoped <style>
    block, nav and footer) is lifted from an existing article so generated
    articles are byte-identical in structure to the hand-written ones. Only the
    editorial content comes from scripts/sections/<name>-articles.json.

    Body blocks are typed: p, h2, h3, ul, pick, verdict. Product facts in a
    "pick" block are looked up from data/products.json by id, so names and
    affiliate links can never drift from the category pages.

.EXAMPLE
    .\scripts\build-articles.ps1 -Section pickleball
    .\scripts\build-articles.ps1 -Section pickleball -Apply
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Section,
    [switch]$Apply,
    [string]$TemplateArticle = 'articles\volleyball\best-volleyballs-beginners.html'
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$defPath  = Join-Path $PSScriptRoot "sections\$Section-articles.json"
if (-not (Test-Path $defPath)) { throw "No article definition at $defPath" }

$def      = ConvertFrom-Json ([System.IO.File]::ReadAllText($defPath))
$products = @{}
foreach ($p in (ConvertFrom-Json ([System.IO.File]::ReadAllText((Join-Path $RepoRoot 'data\products.json')))).products) {
    $products[$p.id] = $p
}

# Lift the shared <style> block rather than duplicating 40 lines of CSS here.
$tpl = [System.IO.File]::ReadAllText((Join-Path $RepoRoot $TemplateArticle))
$sm = [regex]::Match($tpl, '(?s)<style>.*?</style>')
if (-not $sm.Success) { throw "Could not lift <style> from $TemplateArticle" }
$Style = $sm.Value

function Esc { param([string]$s) if ($null -eq $s) { return '' } $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;') }
function JEsc { param([string]$s) if ($null -eq $s) { return '' } $s.Replace('\','\\').Replace('"','\"') }

$navItems = @(
    @('Home','index.html'), @('Tennis','tennis/index.html'), @('Gym','gym/index.html'),
    @('Boxing','boxing/index.html'), @('Swimming','swimming/index.html'),
    @('Football','football/index.html'), @('Volleyball','volleyball/index.html'),
    @('Pickleball','pickleball/index.html')
)
$navLi = foreach ($i in $navItems) {
    $cls = ''
    if ($i[0] -eq $def.sportLabel) { $cls = ' class="active"' }
    "<li><a$cls href=`"../../$($i[1])`">$($i[0])</a></li>"
}
$Nav = @"
<nav class="nav-v2">
<a class="nav-logo-v2" href="../../index.html"><div class="logo-mark"><svg fill="none" viewbox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 2L10.5 6.5H13.5L11 9.5L12 14L8 11.5L4 14L5 9.5L2.5 6.5H5.5L8 2Z" fill="#111" stroke="#111" stroke-linejoin="round" stroke-width="0.5"></path></svg></div><span class="logo-text"><em>SportGear</em> Finder</span></a>
<button aria-label="Menu" class="nav-hamburger" onclick="this.closest('nav').querySelector('.nav-links').classList.toggle('open')"><span></span><span></span><span></span></button>
<ul class="nav-links">
$($navLi -join "`n")
<li><a href="../../articles/index.html">Articles</a></li>
<li><a class="nav-tools" href="/tools/">Tools</a></li>
<li><a href="../../about.html">About</a></li>
</ul>
<button class="nav-search-btn" aria-label="Search"><svg width="17" height="17" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M14.5 14.5L19 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
</nav>
"@

$Ga = @'
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0C1DTCG2NX"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','G-0C1DTCG2NX');
</script>
'@

$written = @{}

foreach ($a in $def.articles) {
    $url = "https://sportgearfinder.com/articles/$Section/$($a.slug).html"

    $body = ''
    foreach ($b in $a.body) {
        switch ($b.type) {
            'p'  { $body += "<p>$($b.text)</p>`n" }
            'h2' { $body += "`n<h2>$(Esc $b.text)</h2>`n" }
            'h3' { $body += "<h3>$(Esc $b.text)</h3>`n" }
            'ul' {
                $lis = ($b.items | ForEach-Object { "<li>$_</li>" }) -join "`n"
                $body += "<ul>`n$lis`n</ul>`n"
            }
            'verdict' {
                $body += "`n<div class=`"verdict`">`n<strong>$(Esc $b.label)</strong>`n<p>$($b.text)</p>`n</div>`n"
            }
            'pick' {
                $p = $products[$b.id]
                if ($null -eq $p) { throw "Article '$($a.slug)' references unknown product id '$($b.id)'" }
                $more = ''
                if ($b.PSObject.Properties.Name -contains 'moreHref' -and $b.moreHref) {
                    $more = "`n<a class=`"btn-more`" href=`"$($b.moreHref)`">$(Esc $b.moreLabel)</a>"
                }
                $body += @"

<div class="pick">
<img alt="$(Esc $p.name)" src="$(Esc $p.image)" loading="lazy" decoding="async"/>
<div class="pick-info">
<span class="badge $($b.badgeClass)">$(Esc $b.badge)</span>
<h3>$(Esc $p.name)</h3>
<p>$($b.text)</p>
<a class="btn-az" href="$(Esc $p.affiliateLink)" rel="noopener sponsored" target="_blank">Check Price on Amazon</a>$more
</div>
</div>

"@
            }
            default { throw "Unknown block type '$($b.type)' in article '$($a.slug)'" }
        }
    }

    $faq = ($a.faq | ForEach-Object {
        "<details><summary>$(Esc $_.q)</summary><p>$(Esc $_.a)</p></details>"
    }) -join "`n"

    $faqLd = ($a.faq | ForEach-Object {
        '{"@type":"Question","name":"' + (JEsc $_.q) + '","acceptedAnswer":{"@type":"Answer","text":"' + (JEsc $_.a) + '"}}'
    }) -join ','

    $related = ($a.related | ForEach-Object { "<li><a href=`"$($_.href)`">$(Esc $_.label)</a></li>" }) -join "`n"

    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>$(Esc $a.title)</title>
<meta content="$(Esc $a.metaDescription)" name="description"/>
<link href="../../css/style.css" rel="stylesheet"/>
<link href="https://m.media-amazon.com" rel="preconnect"/>
<link crossorigin="" href="https://m.media-amazon.com" rel="preconnect"/>
<link href="https://www.googletagmanager.com" rel="dns-prefetch"/>
<link href="$url" rel="canonical"/>
$Style
<script type="application/ld+json">[{"@context":"https://schema.org","@type":"Article","headline":"$(JEsc $a.headline)","description":"$(JEsc $a.metaDescription)","author":{"@type":"Organization","name":"SportGear Finder","url":"https://sportgearfinder.com"},"publisher":{"@type":"Organization","name":"SportGear Finder","url":"https://sportgearfinder.com"},"mainEntityOfPage":"$url","datePublished":"$($def.datePublished)","dateModified":"$($def.dateModified)"},{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[$faqLd]}]</script>
$Ga
</head>
<body class="sport-$Section">
$Nav
<section class="art-hero">
<span class="art-eyebrow">$(Esc $def.sportLabel) Gear · $(Esc $a.kicker)</span>
<h1>$($a.h1)</h1>
<p class="meta">Updated $($def.updatedLabel) · $($a.readTime) min read · Affiliate links may earn us a commission</p>
</section>
<div class="art-body">
$body
<div class="faq">
<h2>Frequently Asked Questions</h2>
$faq
</div>

<div class="related">
<h3>Related Articles</h3>
<ul>
$related
</ul>
</div>
<div class="disclosure" id="disclosure"><strong>Affiliate Disclosure:</strong> As an Amazon Associate, SportGear Finder earns from qualifying purchases. SportGear Finder may earn a small commission on qualifying purchases through links on this page, at no extra cost to you.</div>
</div>
<footer><p>© 2026 SportGear Finder · <a href="../../about.html">About</a> · <a href="/tools/">Free Tools</a> · <a href="../../privacy.html">Privacy Policy</a> · <a href="#disclosure">Affiliate Disclosure</a></p></footer>
</body>
</html>
"@

    $written["articles\$Section\$($a.slug).html"] = $html
}

# ---------------------------------------------------------------- validate
$bad = 0
foreach ($rel in $written.Keys) {
    foreach ($blk in [regex]::Matches($written[$rel], '(?s)<script type="application/ld\+json">(.*?)</script>')) {
        try { $null = ConvertFrom-Json $blk.Groups[1].Value }
        catch { $bad++; Write-Host "INVALID JSON-LD in $rel" -ForegroundColor Red }
    }
}

Write-Host ""
Write-Host "articles generated : $($written.Count)" -ForegroundColor Cyan
Write-Host "JSON-LD errors     : $bad" -ForegroundColor $(if ($bad) { 'Red' } else { 'Green' })
foreach ($rel in ($written.Keys | Sort-Object)) {
    Write-Host ("  {0,-58} {1,6} bytes" -f $rel, $written[$rel].Length)
}
if ($bad -gt 0) { throw 'Refusing to write: invalid structured data.' }

Write-Host ""
if (-not $Apply) { Write-Host 'Report only. Re-run with -Apply to write.' -ForegroundColor Cyan; return }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$dir = Join-Path $RepoRoot "articles\$Section"
if (-not (Test-Path $dir)) { $null = New-Item -ItemType Directory -Path $dir }
foreach ($rel in $written.Keys) {
    [System.IO.File]::WriteAllText((Join-Path $RepoRoot $rel), $written[$rel], $utf8NoBom)
}
Write-Host "Wrote $($written.Count) file(s)." -ForegroundColor Green
