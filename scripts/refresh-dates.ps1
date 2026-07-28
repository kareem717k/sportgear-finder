<#
.SYNOPSIS
    Brings dateModified, the visible "Updated <Month> <Year>" line, and sitemap
    <lastmod> into agreement for pages that have actually changed.

.DESCRIPTION
    Three surfaces on this site state when a page was last updated, and they had
    drifted apart:

        JSON-LD  "dateModified"            35 pages still said 2026-06-01
        visible  "Updated June 2026"       35 pages
        visible  "Last updated: June 2026"  34 pages
        sitemap  <lastmod>                 35 URLs still said 2026-06-01

    For "best X 2026" queries freshness is a live ranking input, so a page that
    has genuinely been revised should say so - on all four surfaces, with the
    same date. A mismatch between the visible line and the structured data is
    itself a quality signal Google can see.

    IMPORTANT - what this script will and will not do:

    By default it only touches files git reports as MODIFIED in the working tree.
    That is the guard against blanket date-bumping. Rewriting dateModified on a
    page nobody edited is a freshness claim that is not true; Google discounts it
    when the main content is unchanged, and it destroys your own ability to tell
    which pages are actually stale. Use -All only if you know why you want it.

    Note that a structural change (footer links, breadcrumbs) is a weaker
    freshness signal than a content revision. This script makes the dates honest
    and consistent; it does not make thin pages competitive.

.PARAMETER Apply
    Actually write the changes. Without this the script only reports.

.PARAMETER Date
    ISO date to stamp. Defaults to today.

.PARAMETER All
    Ignore git status and restamp every page. Off by default on purpose.

.EXAMPLE
    .\scripts\refresh-dates.ps1
    .\scripts\refresh-dates.ps1 -Apply
#>
[CmdletBinding()]
param(
    [switch]$Apply,
    [string]$Date = (Get-Date -Format 'yyyy-MM-dd'),
    [switch]$All
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot

if ($Date -notmatch '^\d{4}-\d{2}-\d{2}$') { throw "-Date must be yyyy-MM-dd, got '$Date'" }
$dt        = [datetime]::ParseExact($Date, 'yyyy-MM-dd', $null)
$monthYear = '{0} {1}' -f $dt.ToString('MMMM'), $dt.Year

# ---------------------------------------------------------------- which pages
if ($All) {
    $targets = Get-ChildItem $RepoRoot -Recurse -Filter *.html |
               Where-Object { $_.FullName -notmatch '\\\.git\\' } |
               ForEach-Object { $_.FullName.Substring($RepoRoot.Length + 1) }
} else {
    Push-Location $RepoRoot
    try { $status = @(git status --porcelain -- '*.html') } finally { Pop-Location }
    $targets = $status |
        ForEach-Object { ($_ -replace '^.{3}', '').Trim().Trim('"') } |
        Where-Object { $_ -like '*.html' } |
        ForEach-Object { $_ -replace '/', '\' }
}
$targets = @($targets | Sort-Object -Unique)

if ($targets.Count -eq 0) {
    Write-Host ""
    Write-Host "No modified .html files - nothing to restamp." -ForegroundColor Green
    Write-Host "(Use -All to restamp every page regardless of git status.)" -ForegroundColor DarkGray
    return
}

# ---------------------------------------------------------------- plan
$plan = @()
foreach ($rel in $targets) {
    $full = Join-Path $RepoRoot $rel
    if (-not (Test-Path $full)) { continue }
    $text = [System.IO.File]::ReadAllText($full)
    $orig = $text
    $hits = @()

    $new = [regex]::Replace($text, '("dateModified":\s*")\d{4}-\d{2}-\d{2}(")', "`${1}$Date`${2}")
    if ($new -ne $text) { $hits += 'dateModified'; $text = $new }

    # Two visible phrasings exist and they are cased differently:
    #   articles use   <p class="meta">Updated June 2026 - 6 min read ...
    #   category pages use  <p class="last-updated">Last updated: June 2026
    # Match the lowercase "last updated:" form first so the capital-U pattern
    # below cannot half-rewrite it.
    $new = [regex]::Replace($text, '(?i)(Last updated:\s*)[A-Z][a-z]+ \d{4}', "`${1}$monthYear")
    if ($new -ne $text) { $hits += 'visible(last-updated)'; $text = $new }

    $new = [regex]::Replace($text, '(?<!Last )Updated [A-Z][a-z]+ \d{4}', "Updated $monthYear")
    if ($new -ne $text) { $hits += 'visible(meta)'; $text = $new }

    if ($hits.Count -gt 0) {
        $plan += [pscustomobject]@{ File = $rel; FullPath = $full; Hits = ($hits -join '+'); Text = $text; Was = $orig }
    }
}

# ---------------------------------------------------------------- sitemap
$sitemapPath = Join-Path $RepoRoot 'sitemap.xml'
$sitemapNew  = $null
$sitemapHits = 0
if (Test-Path $sitemapPath) {
    $sm = [System.IO.File]::ReadAllText($sitemapPath)
    # Stamp every page that changed, not just the ones carrying a visible date
    # string. Pages like /tools/ and index.html have no "Updated <Month>" line
    # but their <lastmod> should still reflect that they were revised.
    $urlsToStamp = @($targets | ForEach-Object { ($_ -replace '\\', '/') })

    $sitemapNew = [regex]::Replace($sm, '(?s)<url>\s*<loc>(.*?)</loc>(.*?)<lastmod>(\d{4}-\d{2}-\d{2})</lastmod>', {
        param($m)
        $loc  = $m.Groups[1].Value
        $path = ($loc -replace '^https?://[^/]+/', '')
        if ($path -eq '') { $path = 'index.html' }
        elseif ($path.EndsWith('/')) { $path = $path + 'index.html' }
        if ($urlsToStamp -contains $path) {
            $script:sitemapHits++
            return "<url>`n    <loc>$loc</loc>$($m.Groups[2].Value)<lastmod>$Date</lastmod>"
        }
        return $m.Value
    })
}

# ---------------------------------------------------------------- report
Write-Host ""
Write-Host "Restamping to $Date / `"$monthYear`"" -ForegroundColor Cyan
Write-Host ""
if ($plan.Count -eq 0) {
    Write-Host "No date strings found in the $($targets.Count) modified file(s)." -ForegroundColor Yellow
} else {
    foreach ($g in ($plan | Group-Object Hits | Sort-Object Name)) {
        Write-Host ("  {0,-22} {1,3} page(s)" -f $g.Name, $g.Count) -ForegroundColor Gray
    }
}
Write-Host ("  {0,-22} {1,3} URL(s)" -f 'sitemap lastmod', $sitemapHits) -ForegroundColor Gray

Write-Host ""
if (-not $Apply) {
    Write-Host "Report only. Re-run with -Apply to write." -ForegroundColor Cyan
    return
}

# ---------------------------------------------------------------- apply
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
foreach ($p in $plan) {
    $current = [System.IO.File]::ReadAllText($p.FullPath)
    if ($current -ne $p.Was) { throw "$($p.File) changed on disk since the plan was built. Nothing written for this file." }
    [System.IO.File]::WriteAllText($p.FullPath, $p.Text, $utf8NoBom)
}
if ($sitemapNew -and $sitemapHits -gt 0) {
    [System.IO.File]::WriteAllText($sitemapPath, $sitemapNew, $utf8NoBom)
}

Write-Host "Wrote $($plan.Count) page(s) + sitemap.xml ($sitemapHits URL(s))." -ForegroundColor Green
Write-Host "Review with: git diff --stat" -ForegroundColor Cyan
