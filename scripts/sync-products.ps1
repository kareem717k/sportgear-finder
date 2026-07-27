<#
.SYNOPSIS
    Syncs volatile product fields from data/products.json into the static HTML pages.

.DESCRIPTION
    products.json is the source of truth for four fields only:
        priceDisplay  ->  pcard price, comparison-table price cell
        price         ->  JSON-LD offers.price
        score         ->  pcard score, comparison-table score cell, JSON-LD ratingValue
        image         ->  pcard <img src>, JSON-LD image
        affiliateLink ->  <a href> Amazon buttons (tag param)

    Page structure, prose, specs, FAQs and meta tags are NEVER touched.

    Products are joined to HTML by ASIN (parsed out of affiliateLink), which is the
    only stable identifier shared by both. All edits are scoped to the block that
    already contains that ASIN, so prose that merely mentions a dollar amount
    (e.g. "a horse-stall mat ~$40-60") can never be rewritten by accident.

.PARAMETER Apply
    Actually write the changes. Without this the script only reports.

.PARAMETER Filter
    Optional path substring to limit the run, e.g. -Filter tennis

.EXAMPLE
    .\scripts\sync-products.ps1
    .\scripts\sync-products.ps1 -Filter tennis
    .\scripts\sync-products.ps1 -Apply
#>
[CmdletBinding()]
param(
    [switch]$Apply,
    [string]$Filter = '',
    [string]$AffiliateTag = 'sportgearfind-20',
    # Sites reported but never written. JSON-LD prices are excluded by default:
    # the pages carry exact Amazon prices (79.99) while products.json carries
    # rounded display values (75), and rounding the structured data would be a
    # regression for rich results. Clear this once products.json holds exact
    # prices - see scripts/README.md.
    [string[]]$ExcludeSites = @('jsonld price')
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$DataFile = Join-Path $RepoRoot 'data\products.json'

if (-not (Test-Path $DataFile)) { throw "Cannot find $DataFile" }

# ---------------------------------------------------------------- load products
$json = [System.IO.File]::ReadAllText($DataFile)
$products = (ConvertFrom-Json $json).products

$byAsin = @{}
$noAsin = @()
$conflicts = @{}

foreach ($p in $products) {
    $m = [regex]::Match($p.affiliateLink, '/dp/([A-Z0-9]{10})')
    if (-not $m.Success) { $noAsin += $p.id; continue }
    $asin = $m.Groups[1].Value

    # An ASIN identifies exactly one Amazon product, so two different products
    # sharing one means the data is wrong and we cannot tell which card on the
    # page belongs to which. Refuse to touch anything scoped by that ASIN
    # rather than guessing - guessing corrupts the other product's card.
    if ($conflicts.ContainsKey($asin)) { $conflicts[$asin] += $p.id; continue }
    if ($byAsin.ContainsKey($asin)) {
        $conflicts[$asin] = @($byAsin[$asin].id, $p.id)
        $byAsin.Remove($asin)
        continue
    }
    $byAsin[$asin] = $p
}

Write-Host ""
Write-Host "products.json : $($products.Count) products, $($byAsin.Count) with a usable ASIN" -ForegroundColor Cyan
if ($noAsin.Count -gt 0) {
    Write-Host "  no ASIN in affiliateLink (not synced): $($noAsin -join ', ')" -ForegroundColor Yellow
}
if ($conflicts.Count -gt 0) {
    Write-Host ""
    Write-Host "  DATA CONFLICT - one ASIN claimed by several products. These are skipped" -ForegroundColor Red
    Write-Host "  entirely; at least one product links to the wrong Amazon item:" -ForegroundColor Red
    foreach ($asin in ($conflicts.Keys | Sort-Object)) {
        Write-Host "    $asin  <-  $($conflicts[$asin] -join ', ')" -ForegroundColor Red
    }
}

# ---------------------------------------------------------------- helpers
function Get-Slice {
    # Returns the substring of $text that starts at $start and runs to the next
    # occurrence of $stopPattern (or $maxLen chars, whichever comes first).
    param([string]$text, [int]$start, [string]$stopPattern, [int]$maxLen = 4000)

    $limit = [Math]::Min($start + $maxLen, $text.Length)
    $window = $text.Substring($start, $limit - $start)
    if ($stopPattern -ne '') {
        $stop = [regex]::Match($window.Substring(1), $stopPattern)
        if ($stop.Success) { $window = $window.Substring(0, $stop.Index + 1) }
    }
    return $window
}

$edits = New-Object System.Collections.ArrayList

function Add-Edit {
    param($File, $Product, $Site, $Old, $New, $AbsIndex, $Length)
    if ($Old -eq $New) { return }
    $null = $edits.Add([pscustomobject]@{
        File = $File; Product = $Product; Site = $Site
        Old = $Old; New = $New; Index = $AbsIndex; Length = $Length
        Excluded = ($ExcludeSites -contains $Site)
    })
}

function Add-NumericEdit {
    # For numeric fields (scores, prices). Two values that differ only in
    # formatting - "8" vs "8.00", "10" vs "10.0" - are NOT a disagreement.
    # When they genuinely differ, the replacement mirrors the decimal precision
    # already used in the page so existing conventions survive.
    param($File, $Product, $Site, $Old, $New, $AbsIndex, $Length)

    $oldNum = 0.0; $newNum = 0.0
    $oldOk = [double]::TryParse($Old, [ref]$oldNum)
    $newOk = [double]::TryParse($New, [ref]$newNum)

    if ($oldOk -and $newOk) {
        if ([Math]::Abs($oldNum - $newNum) -lt 0.0001) { return }   # same number
        $dot = $Old.IndexOf('.')
        $decimals = 0
        if ($dot -ge 0) { $decimals = $Old.Length - $dot - 1 }
        $New = $newNum.ToString("F$decimals", [cultureinfo]::InvariantCulture)
    }

    Add-Edit $File $Product $Site $Old $New $AbsIndex $Length
}

# ---------------------------------------------------------------- scan files
$htmlFiles = @(Get-ChildItem -Path $RepoRoot -Filter *.html -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\\.git\\' })

if ($Filter -ne '') {
    $htmlFiles = @($htmlFiles | Where-Object { $_.FullName -like "*$Filter*" })
}

Write-Host "scanning      : $($htmlFiles.Count) html files" -ForegroundColor Cyan

$filesTouched = @{}

foreach ($file in $htmlFiles) {
    $rel = $file.FullName.Substring($RepoRoot.Length + 1)
    $text = [System.IO.File]::ReadAllText($file.FullName)

    foreach ($asin in $byAsin.Keys) {
        if ($text.IndexOf($asin, [StringComparison]::Ordinal) -lt 0) { continue }
        $p = $byAsin[$asin]

        # ---- 1. affiliate hrefs -------------------------------------------------
        # Only href= occurrences; JSON-LD offers.url is deliberately left untagged.
        $linkRx = [regex]"href=`"(https://www\.amazon\.com/dp/$asin(?:\?[^`"]*)?)`""
        foreach ($m in $linkRx.Matches($text)) {
            $want = "https://www.amazon.com/dp/$asin`?tag=$AffiliateTag"
            Add-Edit $rel $p.name 'affiliate href' $m.Groups[1].Value $want `
                     $m.Groups[1].Index $m.Groups[1].Length
        }

        # ---- 2. product card ----------------------------------------------------
        # Find the pcard block that contains this ASIN, then scope edits to it.
        foreach ($cm in [regex]::Matches($text, '<div class="pcard" id="([^"]+)">')) {
            $block = Get-Slice $text $cm.Index '<div class="pcard"' 6000
            if ($block.IndexOf($asin, [StringComparison]::Ordinal) -lt 0) { continue }
            $slug = $cm.Groups[1].Value
            $base = $cm.Index

            $im = [regex]::Match($block, '(?s)<img[^>]*\ssrc="([^"]+)"')
            if ($im.Success) {
                Add-Edit $rel $p.name 'pcard img' $im.Groups[1].Value $p.image `
                         ($base + $im.Groups[1].Index) $im.Groups[1].Length
            }

            $pm = [regex]::Match($block, '<div class="pcard-price">([^<]*)</div>')
            if ($pm.Success) {
                Add-Edit $rel $p.name 'pcard price' $pm.Groups[1].Value $p.priceDisplay `
                         ($base + $pm.Groups[1].Index) $pm.Groups[1].Length
            }

            $sm = [regex]::Match($block, '<div class="pcard-score-num">([^<]*)<span>')
            if ($sm.Success) {
                Add-NumericEdit $rel $p.name 'pcard score' $sm.Groups[1].Value $p.score `
                         ($base + $sm.Groups[1].Index) $sm.Groups[1].Length
            }

            # ---- 3. comparison-table row (anchored on this card's slug) ---------
            foreach ($rm in [regex]::Matches($text, '(?s)<tr>(?:(?!</tr>).)*?</tr>')) {
                if ($rm.Value.IndexOf("href=`"#$slug`"", [StringComparison]::Ordinal) -lt 0) { continue }
                $row = $rm.Value

                $rp = [regex]::Match($row, '<td>(~?\$[0-9][^<]*)</td>')
                if ($rp.Success) {
                    Add-Edit $rel $p.name 'table price' $rp.Groups[1].Value $p.priceDisplay `
                             ($rm.Index + $rp.Groups[1].Index) $rp.Groups[1].Length
                }

                $rs = [regex]::Match($row, '<td class="cmp-score">([^<]*)</td>')
                if ($rs.Success) {
                    Add-NumericEdit $rel $p.name 'table score' $rs.Groups[1].Value $p.score `
                             ($rm.Index + $rs.Groups[1].Index) $rs.Groups[1].Length
                }
            }
        }

        # ---- 4. JSON-LD Product object -----------------------------------------
        # image/price/ratingValue all precede offers.url inside the object, so the
        # window from the enclosing ListItem to the url match bounds this product.
        $um = [regex]::Match($text, "`"url`":\s*`"https://www\.amazon\.com/dp/$asin`"")
        if ($um.Success) {
            $liStarts = [regex]::Matches($text.Substring(0, $um.Index), '"@type":\s*"ListItem"')
            if ($liStarts.Count -gt 0) {
                $base = $liStarts[$liStarts.Count - 1].Index
                $obj = $text.Substring($base, $um.Index - $base)

                $jm = [regex]::Match($obj, '"image":\s*"([^"]+)"')
                if ($jm.Success) {
                    Add-Edit $rel $p.name 'jsonld image' $jm.Groups[1].Value $p.image `
                             ($base + $jm.Groups[1].Index) $jm.Groups[1].Length
                }

                $jp = [regex]::Match($obj, '"price":\s*"([^"]*)"')
                if ($jp.Success) {
                    Add-NumericEdit $rel $p.name 'jsonld price' $jp.Groups[1].Value $p.price `
                             ($base + $jp.Groups[1].Index) $jp.Groups[1].Length
                }

                $jr = [regex]::Match($obj, '"ratingValue":\s*"([^"]*)"')
                if ($jr.Success) {
                    Add-NumericEdit $rel $p.name 'jsonld rating' $jr.Groups[1].Value $p.score `
                             ($base + $jr.Groups[1].Index) $jr.Groups[1].Length
                }
            }
        }
    }

    if (@($edits | Where-Object { $_.File -eq $rel -and -not $_.Excluded }).Count -gt 0) {
        $filesTouched[$rel] = $text
    }
}

# ---------------------------------------------------------------- report
function Write-Report {
    param($Rows, $Heading, $Colour)

    if (@($Rows).Count -eq 0) { return }
    Write-Host ""
    Write-Host $Heading -ForegroundColor $Colour
    Write-Host ""
    foreach ($group in ($Rows | Group-Object File | Sort-Object Name)) {
        Write-Host $group.Name -ForegroundColor White
        foreach ($sub in ($group.Group | Group-Object Product)) {
            Write-Host "  $($sub.Name)" -ForegroundColor Gray
            foreach ($e in $sub.Group) {
                $o = $e.Old; $n = $e.New
                if ($o.Length -gt 46) { $o = '...' + $o.Substring($o.Length - 43) }
                if ($n.Length -gt 46) { $n = '...' + $n.Substring($n.Length - 43) }
                Write-Host ("    {0,-15} {1,-47}" -f $e.Site, $o) -ForegroundColor DarkGray -NoNewline
                Write-Host "-> $n" -ForegroundColor Green
            }
        }
    }
}

Write-Host ""
if ($edits.Count -eq 0) {
    Write-Host "In sync - products.json and the HTML agree on every tracked field." -ForegroundColor Green
    return
}

$syncable = @($edits | Where-Object { -not $_.Excluded })
$excluded = @($edits | Where-Object { $_.Excluded })

Write-Report $syncable "$($syncable.Count) difference(s) to sync, across $($filesTouched.Count) file(s):" 'Yellow'
Write-Report $excluded "$($excluded.Count) difference(s) EXCLUDED from sync ($($ExcludeSites -join ', ')) - needs a decision, will not be written:" 'Magenta'

# ---------------------------------------------------------------- apply
Write-Host ""
if (-not $Apply) {
    Write-Host "Report only. Re-run with -Apply to write the $($syncable.Count) syncable change(s)." -ForegroundColor Cyan
    return
}
if ($syncable.Count -eq 0) {
    Write-Host "Nothing syncable - every difference is excluded." -ForegroundColor Cyan
    return
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$written = 0

foreach ($rel in $filesTouched.Keys) {
    $text = $filesTouched[$rel]
    # Apply back-to-front so earlier offsets stay valid.
    $fileEdits = @($edits | Where-Object { $_.File -eq $rel -and -not $_.Excluded } |
                   Sort-Object Index -Descending)
    foreach ($e in $fileEdits) {
        $found = $text.Substring($e.Index, $e.Length)
        if ($found -ne $e.Old) {
            throw "Offset drift in $rel at $($e.Index): expected '$($e.Old)' but found '$found'. Nothing written for this file."
        }
        $text = $text.Remove($e.Index, $e.Length).Insert($e.Index, $e.New)
    }
    [System.IO.File]::WriteAllText((Join-Path $RepoRoot $rel), $text, $utf8NoBom)
    $written++
}

Write-Host "Wrote $written file(s)." -ForegroundColor Green
Write-Host "Review with: git diff --stat" -ForegroundColor Cyan
