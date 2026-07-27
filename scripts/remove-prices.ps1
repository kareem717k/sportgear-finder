<#
.SYNOPSIS
    Removes hard-coded Amazon price claims from the static pages.

.DESCRIPTION
    The Amazon Associates policy only permits displaying prices sourced from the
    Creators API (or served by Amazon), and requires a retrieval timestamp
    adjacent to the price unless it refreshes hourly. Prices typed by hand into
    the HTML meet neither condition, and go stale within days regardless.

    This removes the three places where the site makes a specific price claim
    about a specific Amazon listing:

      1. .pcard-price        -> replaced by the product's tier badge
      2. cmp-table Price col -> column dropped (header + one cell per row)
      3. JSON-LD offers      -> price and priceCurrency stripped

    It deliberately does NOT touch editorial prices - budget-guide tables
    ("Item | Pick | Cost"), the sizing calculators, category "From $25" pills,
    or prose like "expect to pay $20-40 for strings". Those are statements about
    the market rather than claims about a listing's current price.

.PARAMETER Apply
    Actually write. Without it the script only reports.

.EXAMPLE
    .\scripts\remove-prices.ps1
    .\scripts\remove-prices.ps1 -Filter tennis\rackets -Apply
#>
[CmdletBinding()]
param(
    [switch]$Apply,
    [string]$Filter = ''
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$json = [System.IO.File]::ReadAllText((Join-Path $RepoRoot 'data\products.json'))
$products = (ConvertFrom-Json $json).products

$TierLabel = @{
    'budget'  = 'Budget'
    'value'   = 'Best Value'
    'premium' = 'Premium'
    'cool'    = 'Cool Pick'
}

# ASIN -> product, refusing ambiguous ASINs (see sync-products.ps1).
$byAsin = @{}; $conflicts = @{}
foreach ($p in $products) {
    $m = [regex]::Match($p.affiliateLink, '/dp/([A-Z0-9]{10})')
    if (-not $m.Success) { continue }
    $a = $m.Groups[1].Value
    if ($conflicts.ContainsKey($a)) { continue }
    if ($byAsin.ContainsKey($a)) { $conflicts[$a] = $true; $byAsin.Remove($a); continue }
    $byAsin[$a] = $p
}

$stats = [ordered]@{ pcard = 0; column = 0; jsonld = 0; copy = 0; unknownTier = 0; tablesSkipped = 0 }
$notes = New-Object System.Collections.ArrayList

function Convert-Page {
    param([string]$text, [string]$rel)

    # Kept for the tier fallback below: cards are processed before the Price
    # column is dropped, so the comparison table still carries its tier badges.
    $script:origText = $text

    # ---- 1. product cards --------------------------------------------------
    # Replace the big lime price with the tier badge, keeping the card's visual
    # balance against the score on the right and adding a signal the card
    # previously lacked.
    $cardRx = [regex]'(?s)<div class="pcard" id="[^"]+">.*?(?=<div class="pcard"|\z)'
    $text = $cardRx.Replace($text, {
        param($card)
        $block = $card.Value
        if ($block -notmatch '<div class="pcard-price">') { return $block }

        $tier = $null
        $am = [regex]::Match($block, '/dp/([A-Z0-9]{10})')
        if ($am.Success -and $byAsin.ContainsKey($am.Groups[1].Value)) {
            $tier = $byAsin[$am.Groups[1].Value].tier
        }

        # Fallback for products with a missing or ambiguous ASIN: the page's own
        # comparison table already labels the tier, so read it from the row that
        # links to this card's anchor.
        if ($null -eq $tier) {
            $idm = [regex]::Match($block, '<div class="pcard" id="([^"]+)">')
            if ($idm.Success) {
                $slug = [regex]::Escape($idm.Groups[1].Value)
                $rowm = [regex]::Match($script:origText,
                    "(?s)<tr>(?:(?!</tr>).)*?href=`"#$slug`"(?:(?!</tr>).)*?</tr>")
                if ($rowm.Success) {
                    $tm = [regex]::Match($rowm.Value, '<span class="cmp-tier ([a-z]+)">')
                    if ($tm.Success) { $tier = $tm.Groups[1].Value }
                }
            }
        }

        if ($null -eq $tier -or -not $TierLabel.ContainsKey($tier)) {
            # Cannot identify the tier, so drop the price without inventing a
            # badge rather than guessing at one.
            $script:stats.unknownTier++
            $null = $script:notes.Add("$rel : price removed but tier unknown (no usable ASIN) - card has no badge")
            $new = [regex]::Replace($block, '\s*<div class="pcard-price">[^<]*</div>', '')
        } else {
            $label = $TierLabel[$tier]
            $badge = "<div class=`"pcard-tier $tier`">$label</div>"
            $new = [regex]::Replace($block, '<div class="pcard-price">[^<]*</div>', $badge)
        }
        $script:stats.pcard++
        return $new
    })

    # ---- 2. comparison tables ---------------------------------------------
    # Only tables that are unambiguously product comparisons: they must carry a
    # Tier column AND a Score column AND a Price column. Budget-guide tables
    # ("Item | Pick | Cost") and the sizing calculators fail this gate and are
    # left completely alone.
    $tableRx = [regex]'(?s)<table class="cmp-table">.*?</table>'
    $text = $tableRx.Replace($text, {
        param($tbl)
        $t = $tbl.Value

        $headRow = [regex]::Match($t, '(?s)<tr>((?:(?!</tr>).)*?<th.*?)</tr>')
        if (-not $headRow.Success) { return $t }

        $ths = [regex]::Matches($headRow.Value, '(?s)<th[^>]*>(.*?)</th>')
        $labels = @($ths | ForEach-Object { $_.Groups[1].Value.Trim() })

        $priceIdx = -1
        for ($i = 0; $i -lt $labels.Count; $i++) {
            if ($labels[$i] -match '^Price') { $priceIdx = $i; break }
        }
        $hasTier  = @($labels | Where-Object { $_ -eq 'Tier' }).Count -gt 0
        $hasScore = @($labels | Where-Object { $_ -eq 'Score' }).Count -gt 0

        if ($priceIdx -lt 0) { return $t }
        if (-not ($hasTier -and $hasScore)) {
            $script:stats.tablesSkipped++
            $null = $script:notes.Add("$rel : table [$($labels -join ' | ')] has a Price column but no Tier/Score - left alone, review by hand")
            return $t
        }

        # Drop the header cell.
        $newHead = $headRow.Value
        $newHead = $newHead.Remove($ths[$priceIdx].Index, $ths[$priceIdx].Length)
        $t = $t.Remove($headRow.Index, $headRow.Length).Insert($headRow.Index, $newHead)

        # Drop the same-index cell from every body row.
        $rowRx = [regex]'(?s)<tr>((?:(?!</tr>).)*?<td.*?)</tr>'
        $t = $rowRx.Replace($t, {
            param($row)
            $r = $row.Value
            $tds = [regex]::Matches($r, '(?s)<td[^>]*>.*?</td>')
            if ($tds.Count -ne $labels.Count) {
                $null = $script:notes.Add("$rel : row has $($tds.Count) cells but header has $($labels.Count) - row left alone")
                return $r
            }
            return $r.Remove($tds[$priceIdx].Index, $tds[$priceIdx].Length)
        })

        $script:stats.column++
        return $t
    })

    # ---- 3. JSON-LD offers -------------------------------------------------
    # Strip price/priceCurrency but keep availability and url, so the Offer
    # still links the product without asserting a price.
    $offerRx = [regex]'(?s)"offers":\s*\{.*?\}'
    $text = $offerRx.Replace($text, {
        param($off)
        $o = $off.Value
        if ($o -notmatch '"price"') { return $o }
        # Handles both the pretty-printed and the minified JSON-LD on this site.
        # Trailing-comma form first, then leading-comma for a final field.
        foreach ($field in 'price', 'priceCurrency') {
            $o = [regex]::Replace($o, "\s*`"$field`":\s*`"[^`"]*`",", '')
            $o = [regex]::Replace($o, ",\s*`"$field`":\s*`"[^`"]*`"", '')
        }
        $script:stats.jsonld++
        return $o
    })

    # ---- 4. copy that only made sense while prices were shown --------------
    # "Last updated: June 2026 - Prices checked June 2026" and the "Prices shown
    # are approximate" disclaimer both describe prices the page no longer has.
    # The middle-dot separator is built with [char]0x00B7 rather than typed
    # literally, and this file is kept pure ASCII: PowerShell 5.1 reads a
    # BOM-less .ps1 as ANSI, so a literal non-ASCII character here is mangled
    # at parse time and the pattern silently never matches.
    $before = $text
    $mid = [char]0x00B7
    $text = [regex]::Replace($text, "(Last updated:[^<$mid]*?)\s*$mid\s*Prices[^<]*", '$1')
    $text = [regex]::Replace($text, '\s*Prices shown are approximate and subject to change\.', '')
    $text = [regex]::Replace($text, '\s*Prices checked \w+ \d{4}\.', '')
    if ($text -ne $before) { $script:stats.copy++ }

    return $text
}

# ---------------------------------------------------------------- run
$htmlFiles = @(Get-ChildItem -Path $RepoRoot -Filter *.html -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\\.git\\' })
if ($Filter -ne '') {
    $htmlFiles = @($htmlFiles | Where-Object { $_.FullName -like "*$Filter*" })
}

Write-Host ""
Write-Host "scanning : $($htmlFiles.Count) html files" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$pending = @{}

$broken = 0

foreach ($file in $htmlFiles) {
    $rel = $file.FullName.Substring($RepoRoot.Length + 1)
    $orig = [System.IO.File]::ReadAllText($file.FullName)
    $new = Convert-Page $orig $rel
    if ($new -eq $orig) { continue }

    # Structured data must still parse. A malformed ld+json block is invisible
    # on the page but silently kills rich results, so refuse to write the file
    # rather than let that through.
    $ok = $true
    foreach ($blk in [regex]::Matches($new, '(?s)<script type="application/ld\+json">(.*?)</script>')) {
        try { $null = ConvertFrom-Json $blk.Groups[1].Value }
        catch {
            $ok = $false
            $null = $notes.Add("$rel : JSON-LD no longer parses after edit - file NOT written")
        }
    }
    if (-not $ok) { $broken++; continue }

    $pending[$file.FullName] = $new
}

Write-Host ""
Write-Host "Product cards retiered  : $($stats.pcard)"      -ForegroundColor White
Write-Host "Table columns dropped   : $($stats.column)"     -ForegroundColor White
Write-Host "JSON-LD offers stripped : $($stats.jsonld)"     -ForegroundColor White
Write-Host "Pages with copy fixed   : $($stats.copy)"       -ForegroundColor White
Write-Host "Files affected          : $($pending.Count)"    -ForegroundColor White

if ($stats.unknownTier -gt 0 -or $stats.tablesSkipped -gt 0 -or $notes.Count -gt 0) {
    Write-Host ""
    Write-Host "Needs a look:" -ForegroundColor Yellow
    foreach ($n in ($notes | Sort-Object -Unique)) { Write-Host "  $n" -ForegroundColor DarkYellow }
}

Write-Host ""
if (-not $Apply) {
    Write-Host "Report only. Re-run with -Apply to write." -ForegroundColor Cyan
    return
}

foreach ($path in $pending.Keys) {
    [System.IO.File]::WriteAllText($path, $pending[$path], $utf8NoBom)
}
Write-Host "Wrote $($pending.Count) file(s). Review with: git diff --stat" -ForegroundColor Green
