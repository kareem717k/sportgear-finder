#requires -Version 5.1
<#
.SYNOPSIS
  Derives the site's headline counts from the category pages and syncs the
  homepage claims to match.

.DESCRIPTION
  The homepage states a product count, a category count and a sport count in
  two places (the hero trust line and the stat bar). These are hand-written and
  have gone stale twice - once at 253/42/6, again at 365/60.

  This script treats the category pages as the source of truth (they are, per
  the repo's convention), counts .pcard blocks, and rewrites the homepage
  numbers. It also reports any category page whose own hero count or JSON-LD
  numberOfItems disagrees with the number of cards it actually renders.

.EXAMPLE
  .\sync-site-stats.ps1            # report only
  .\sync-site-stats.ps1 -Apply     # write changes
#>
[CmdletBinding()]
param(
  [switch]$Apply,
  [string]$Root
)

$ErrorActionPreference = 'Stop'

# $PSScriptRoot is not populated during param binding under -File, so resolve
# the site root here rather than in a parameter default.
if (-not $Root) {
  $here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path $MyInvocation.MyCommand.Path -Parent }
  $Root = Split-Path $here -Parent
}
$Root = [System.IO.Path]::GetFullPath($Root)

$NotSports = @('articles', 'tools', 'css', 'js', 'img', 'data', 'scripts', '.claude', '.git')

$sportDirs = Get-ChildItem -Path $Root -Directory |
  Where-Object { $NotSports -notcontains $_.Name } |
  Where-Object { Test-Path (Join-Path $_.FullName 'index.html') } |
  Sort-Object Name

$products = 0
$categories = 0
$drift = @()

foreach ($dir in $sportDirs) {
  $pages = Get-ChildItem -Path $dir.FullName -Filter *.html -File |
           Where-Object { $_.Name -ne 'index.html' }
  foreach ($page in $pages) {
    $html = [System.IO.File]::ReadAllText($page.FullName)
    $cards = ([regex]::Matches($html, '<div class="pcard"')).Count
    if ($cards -eq 0) { continue }

    $categories++
    $products += $cards

    $rel = "$($dir.Name)/$($page.Name)"
    $hero = [regex]::Match($html, '<p>(\d+) real picks')
    if ($hero.Success -and [int]$hero.Groups[1].Value -ne $cards) {
      $drift += "$rel : hero says $($hero.Groups[1].Value), renders $cards cards"
    }
    $items = [regex]::Match($html, '"numberOfItems":\s*(\d+)')
    if ($items.Success -and [int]$items.Groups[1].Value -ne $cards) {
      $drift += "$rel : numberOfItems=$($items.Groups[1].Value), renders $cards cards"
    }
  }
}

$sports = $sportDirs.Count

Write-Host "derived from the category pages:"
Write-Host "  products   : $products"
Write-Host "  categories : $categories"
Write-Host "  sports     : $sports"
Write-Host ""

# ---- rewrite the homepage numbers ---------------------------------------
$indexPath = Join-Path $Root 'index.html'
$bytes  = [System.IO.File]::ReadAllBytes($indexPath)
$hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
$text   = [System.Text.Encoding]::UTF8.GetString($bytes)
if ($hasBom) { $text = $text.TrimStart([char]0xFEFF) }
$orig = $text

# hero trust line
$text = [regex]::Replace($text,
  '<strong>\d+</strong> products reviewed across <strong>\d+</strong> categories',
  "<strong>$products</strong> products reviewed across <strong>$categories</strong> categories")

# stat bar - keyed off the label so the items can be reordered safely
$statMap = @{
  'Products Reviewed' = $products
  'Categories'        = $categories
  'Live Sports'       = $sports
}
foreach ($label in $statMap.Keys) {
  $rx = '(<span class="stat-number">)\d+(</span>\s*<span class="stat-label">' + [regex]::Escape($label) + '</span>)'
  $text = [regex]::Replace($text, $rx, "`${1}$($statMap[$label])`${2}")
}

if ($text -ne $orig) {
  Write-Host "index.html : numbers updated" -ForegroundColor Green
  if ($Apply) {
    $enc = New-Object System.Text.UTF8Encoding($hasBom)
    $outBytes = [byte[]]@($enc.GetPreamble()) + [byte[]]@($enc.GetBytes($text))
    [System.IO.File]::WriteAllBytes($indexPath, [byte[]]$outBytes)
  }
} else {
  Write-Host "index.html : already in sync"
}

if ($drift) {
  Write-Host ""
  Write-Host "PAGES DISAGREEING WITH THEIR OWN CARD COUNT:" -ForegroundColor Yellow
  $drift | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
} else {
  Write-Host "every category page agrees with its own card count"
}

if (-not $Apply) { Write-Host "`n(report only - re-run with -Apply to write)" -ForegroundColor Cyan }
