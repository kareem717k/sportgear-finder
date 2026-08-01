<#
.SYNOPSIS
    Rewrites the sitewide footer link block so it is section-relevant.

.DESCRIPTION
    Every one of the 60 pages carrying a <div class="footer-links"> block shipped
    the SAME four columns - Tennis / Gym / Boxing / Guides - regardless of what
    the page was about. A swimming page linked six tennis articles and zero
    swimming ones.

    The practical effect was a 15x internal-link imbalance: the ~30 articles
    hardcoded into that footer collected 57-60 inbound internal links each, while
    everything published later (all six pickleball articles, most of the newer
    tennis and gym ones) sat on 3-7.

    This script rebuilds the block per page:

        col 1  the page's OWN sport      (root/tools/articles pages: Popular Guides)
        col 2  the adjacent sport        (tennis<->pickleball, boxing<->gym, ...)
        col 3  Guides
        col 4  Free Tools

    Column 1 is what fixes the imbalance - a swimming page now links swimming
    articles. Column 4 surfaces /tools/, which had almost no internal links at all
    despite being the site's most linkable asset.

    Only the inner HTML of <div class="footer-links"> is touched. The <footer>
    tag, the .footer-bottom line, and every other byte of the page are left alone.

    Article paths and anchor text come from scripts/sections/article-index.json,
    so this never invents a URL - a typo'd path there fails the existence check
    below rather than shipping a 404 into 60 footers.

.PARAMETER Apply
    Actually write the changes. Without this the script only reports.

.PARAMETER Filter
    Optional path substring to limit the run, e.g. -Filter swimming

.EXAMPLE
    .\scripts\rebalance-links.ps1
    .\scripts\rebalance-links.ps1 -Filter swimming
    .\scripts\rebalance-links.ps1 -Apply
#>
[CmdletBinding()]
param(
    [switch]$Apply,
    [string]$Filter = '',
    [int]$MaxPerColumn = 8
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'

$RepoRoot  = Split-Path -Parent $PSScriptRoot
$IndexFile = Join-Path $PSScriptRoot 'sections\article-index.json'
if (-not (Test-Path $IndexFile)) { throw "Cannot find $IndexFile" }

$idx      = ConvertFrom-Json ([System.IO.File]::ReadAllText($IndexFile))
$articles = @($idx.articles)

# ---------------------------------------------------------------- sanity: every
# path in the manifest must exist on disk, or we would ship dead links sitewide.
$missing = @($articles | Where-Object { -not (Test-Path (Join-Path $RepoRoot "articles\$($_.path -replace '/','\')")) })
if ($missing.Count -gt 0) {
    throw "article-index.json references $($missing.Count) file(s) that do not exist: $($missing.path -join ', ')"
}

# ---------------------------------------------------------------- sport model
# Adjacency drives column 2. Pairs are reciprocal where the audience overlaps
# (tennis/pickleball share players and gear vocabulary); the rest lean on gym,
# which is the closest thing the site has to a general-fitness hub.
$Adjacent = @{
    tennis       = 'pickleball'
    pickleball   = 'tennis'
    'ping-pong'  = 'badminton'
    badminton    = 'ping-pong'
    boxing       = 'gym'
    gym          = 'boxing'
    swimming     = 'gym'
    football     = 'gym'
    volleyball   = 'gym'
}

$SportLabel = @{}
foreach ($p in $idx.sportLabels.PSObject.Properties) { $SportLabel[$p.Name] = $p.Value }

$Tools = @(
    @{ label = 'All Free Tools';             href = '/tools/' },
    @{ label = 'Tennis Racket Finder';       href = '/tools/tennis-racket-finder.html' },
    @{ label = 'Boxing Glove Size Calculator'; href = '/tools/boxing-glove-size-calculator.html' },
    @{ label = 'Heavy Bag Weight Calculator'; href = '/tools/heavy-bag-weight-calculator.html' }
)

function Get-PageSport {
    param([string]$Rel)
    $top = ($Rel -replace '^\.\\', '' -split '\\')[0]
    if ($SportLabel.ContainsKey($top) -and $top -ne 'guides') { return $top }
    return ''   # root pages, tools/, articles/
}

function New-Column {
    param([string]$Heading, $Links)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("    <div class=`"footer-col`">`n")
    [void]$sb.Append("      <span class=`"footer-heading`">$Heading</span>`n")
    foreach ($l in $Links) {
        [void]$sb.Append("      <a href=`"$($l.href)`">$($l.label)</a>`n")
    }
    [void]$sb.Append("    </div>")
    return $sb.ToString()
}

function New-FooterLinks {
    param([string]$Sport)

    $cols = @()

    if ($Sport) {
        # The page's OWN sport column is deliberately uncapped. Capping it at 8
        # is what created the original problem in miniature: tennis has 15
        # articles, so a cap silently dropped 7 of them from every tennis footer
        # and they stayed near-orphaned. A complete section index here is also
        # the most useful thing for a reader already on a tennis page.
        $own = @($articles | Where-Object { $_.sport -eq $Sport })
        if ($own.Count -gt 0) {
            $cols += New-Column "$($SportLabel[$Sport]) Articles" @(
                $own | ForEach-Object { @{ label = $_.label; href = "/articles/$($_.path)" } })
        }
        $adj = $Adjacent[$Sport]
        if ($adj) {
            $near = @($articles | Where-Object { $_.sport -eq $adj } | Select-Object -First $MaxPerColumn)
            if ($near.Count -gt 0) {
                $cols += New-Column "$($SportLabel[$adj]) Articles" @(
                    $near | ForEach-Object { @{ label = $_.label; href = "/articles/$($_.path)" } })
            }
        }
    } else {
        # Root, /tools/ and /articles/ have no single sport. Give them a spread
        # across sports rather than four tennis links, so link equity from the
        # homepage - the strongest page on the site - reaches every section.
        $spread = foreach ($s in @('tennis','gym','boxing','swimming','volleyball','pickleball','ping-pong','badminton','football')) {
            $articles | Where-Object { $_.sport -eq $s } | Select-Object -First 1
        }
        $cols += New-Column 'Popular Guides' @(
            $spread | Where-Object { $_ } | ForEach-Object { @{ label = $_.label; href = "/articles/$($_.path)" } })
    }

    $guides = @($articles | Where-Object { $_.sport -eq 'guides' } | Select-Object -First $MaxPerColumn)
    if ($guides.Count -gt 0) {
        $cols += New-Column 'Guides' @(
            $guides | ForEach-Object { @{ label = $_.label; href = "/articles/$($_.path)" } })
    }

    $cols += New-Column 'Free Tools' $Tools

    return "`n" + ($cols -join "`n") + "`n  "
}

# ---------------------------------------------------------------- find the block
# Brace-free scan: walk <div ...> / </div> from the opening tag and stop at the
# one that closes it. Regex cannot match nested divs and the columns ARE nested.
function Get-FooterLinksSpan {
    param([string]$Text)

    $open = $Text.IndexOf('<div class="footer-links">')
    if ($open -lt 0) { return $null }

    $inner = $open + '<div class="footer-links">'.Length
    $depth = 1
    $pos   = $inner
    while ($depth -gt 0) {
        $nextOpen  = $Text.IndexOf('<div', $pos)
        $nextClose = $Text.IndexOf('</div>', $pos)
        if ($nextClose -lt 0) { return $null }
        if ($nextOpen -ge 0 -and $nextOpen -lt $nextClose) {
            $depth++; $pos = $nextOpen + 4
        } else {
            $depth--; $pos = $nextClose + 6
        }
    }
    return @{ Start = $inner; Length = ($pos - 6) - $inner }
}

# ---------------------------------------------------------------- scan
$pages = Get-ChildItem -Path $RepoRoot -Filter *.html -Recurse -File |
         Where-Object { $_.FullName -notmatch '\\\.git\\' }
if ($Filter) { $pages = $pages | Where-Object { $_.FullName -like "*$Filter*" } }

$plan = @()
foreach ($page in $pages) {
    $rel  = $page.FullName.Substring($RepoRoot.Length + 1)
    $text = [System.IO.File]::ReadAllText($page.FullName)

    $span = Get-FooterLinksSpan $text
    if (-not $span) { continue }

    $sport   = Get-PageSport $rel
    $current = $text.Substring($span.Start, $span.Length)
    $new     = New-FooterLinks $sport
    if ($current -eq $new) { continue }

    $countOld = ([regex]::Matches($current, '<a href=')).Count
    $countNew = ([regex]::Matches($new,     '<a href=')).Count

    $plan += [pscustomobject]@{
        File     = $rel
        Sport    = if ($sport) { $sport } else { '(site-wide)' }
        Index    = $span.Start
        Length   = $span.Length
        Old      = $current
        New      = $new
        OldLinks = $countOld
        NewLinks = $countNew
        FullPath = $page.FullName
    }
}

# ---------------------------------------------------------------- report
Write-Host ""
if ($plan.Count -eq 0) {
    Write-Host "Footers already section-relevant - nothing to do." -ForegroundColor Green
    return
}

Write-Host "$($plan.Count) footer block(s) to rewrite:" -ForegroundColor Yellow
Write-Host ""
foreach ($group in ($plan | Group-Object Sport | Sort-Object Name)) {
    $headings = ($group.Group[0].New | Select-String -Pattern 'footer-heading">([^<]*)' -AllMatches).Matches |
                ForEach-Object { $_.Groups[1].Value }
    Write-Host ("  {0,-14} {1,2} page(s)  ->  {2}" -f $group.Name, $group.Count, ($headings -join ' | ')) -ForegroundColor Gray
}
Write-Host ""
Write-Host ("Links per footer: {0} -> {1}" -f `
    (($plan.OldLinks | Measure-Object -Average).Average.ToString('0.0')),
    (($plan.NewLinks | Measure-Object -Average).Average.ToString('0.0'))) -ForegroundColor DarkGray

Write-Host ""
if (-not $Apply) {
    Write-Host "Report only. Re-run with -Apply to write." -ForegroundColor Cyan
    return
}

# ---------------------------------------------------------------- apply
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$written = 0
foreach ($p in $plan) {
    $text  = [System.IO.File]::ReadAllText($p.FullPath)
    $found = $text.Substring($p.Index, $p.Length)
    if ($found -ne $p.Old) {
        throw "Offset drift in $($p.File) at $($p.Index). Nothing written for this file."
    }
    $text = $text.Remove($p.Index, $p.Length).Insert($p.Index, $p.New)
    [System.IO.File]::WriteAllText($p.FullPath, $text, $utf8NoBom)
    $written++
}

Write-Host "Wrote $written file(s)." -ForegroundColor Green
Write-Host "Review with: git diff --stat" -ForegroundColor Cyan
