#requires -Version 5.1
<#
.SYNOPSIS
  Ensures every page carries the favicon/manifest link set and a complete
  Open Graph + Twitter card block.

.DESCRIPTION
  Idempotent. Existing hand-written og:/twitter: values are PRESERVED; only
  missing tags are filled in (og:title falls back to <title>, og:description to
  the meta description, og:url to the canonical). The block is rebuilt in a
  fixed order and re-inserted directly after the <link rel="canonical"> tag,
  so re-running produces no diff.

  Operates on TAGS, not lines. Several pages in this repo are partly minified
  and carry the canonical plus a run of og: tags concatenated on one line -
  a line-based strip destroys the canonical on those pages.

  Per-file BOM presence and UTF-8 encoding are detected and preserved.

.EXAMPLE
  .\add-head-meta.ps1            # report only
  .\add-head-meta.ps1 -Apply     # write changes
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

$IconBlock = @(
  '<link href="/favicon.ico" rel="icon" sizes="any"/>'
  '<link href="/favicon.svg" rel="icon" type="image/svg+xml"/>'
  '<link href="/apple-touch-icon.png" rel="apple-touch-icon"/>'
  '<link href="/site.webmanifest" rel="manifest"/>'
  '<meta content="#0D1117" name="theme-color"/>'
)

# Tags this script owns. Lookahead form so attribute order does not matter.
$RxOgTw    = '<meta(?=[^>]*\b(?:property|name)="(?:og|twitter):)[^>]*>'
$RxIcon    = '<link(?=[^>]*\brel="(?:icon|apple-touch-icon|manifest|shortcut icon)")[^>]*>'
$RxTheme   = '<meta(?=[^>]*\bname="theme-color")[^>]*>'
$RxCanon   = '<link(?=[^>]*\brel="canonical")[^>]*>'

function Remove-OwnedTags([string]$text) {
  foreach ($rx in $RxOgTw, $RxIcon, $RxTheme) {
    # whole-line occurrences first, so no blank line is left behind
    $text = [regex]::Replace($text, "(?m)^[ \t]*$rx[ \t]*\r?\n", '')
    # then any remaining inline occurrences
    $text = [regex]::Replace($text, $rx, '')
  }
  return $text
}

function ConvertTo-AttrText([string]$s) {
  # Values are lifted from existing attributes, so entities are already encoded.
  # Only a bare double quote would break the attribute.
  return $s -replace '"', '&quot;'
}

$files = Get-ChildItem -Path $Root -Filter *.html -Recurse -File |
         Where-Object { $_.FullName -notmatch '\\\.git\\' }

$changed = 0; $skipped = 0; $problems = @()

foreach ($file in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
  $text = [System.Text.Encoding]::UTF8.GetString($bytes)
  if ($hasBom) { $text = $text.TrimStart([char]0xFEFF) }
  $nl = if ($text -match "`r`n") { "`r`n" } else { "`n" }

  $rel = $file.FullName.Substring($Root.Length).TrimStart('\') -replace '\\', '/'

  $canonMatch = [regex]::Match($text, $RxCanon)
  if (-not $canonMatch.Success) { $problems += "no canonical: $rel"; continue }
  $canonUrl = if ($canonMatch.Value -match 'href="([^"]+)"') { $Matches[1] } else { $null }
  if (-not $canonUrl) { $problems += "unparsable canonical: $rel"; continue }

  # ---- harvest existing values before stripping ---------------------------
  $existing = @{}
  foreach ($m in [regex]::Matches($text, $RxOgTw)) {
    $tag = $m.Value
    $key = if ($tag -match '\b(?:property|name)="((?:og|twitter):[a-z:]+)"') { $Matches[1] } else { $null }
    $val = if ($tag -match '\bcontent="([^"]*)"') { $Matches[1] } else { $null }
    if ($key -and $null -ne $val -and -not $existing.ContainsKey($key)) { $existing[$key] = $val }
  }

  $pageTitle = ''
  if ($text -match '(?s)<title>(.*?)</title>') { $pageTitle = $Matches[1].Trim() }
  $pageDesc = ''
  $descTag = [regex]::Match($text, '<meta(?=[^>]*\bname="description")[^>]*>')
  if ($descTag.Success -and $descTag.Value -match '\bcontent="([^"]*)"') { $pageDesc = $Matches[1] }

  $resolve = {
    param($key, $fallback)
    if ($existing.ContainsKey($key) -and $existing[$key].Trim()) { return $existing[$key] }
    return $fallback
  }

  $isArticle = ($rel -like 'articles/*') -and ($rel -ne 'articles/index.html')
  $ogType  = & $resolve 'og:type'  $(if ($isArticle) { 'article' } else { 'website' })
  $ogUrl   = & $resolve 'og:url'   $canonUrl
  $ogTitle = & $resolve 'og:title' $pageTitle
  $ogDesc  = & $resolve 'og:description' $pageDesc
  $ogImage = 'https://sportgearfinder.com/og-image.png'
  $twCard  = & $resolve 'twitter:card' 'summary_large_image'

  if (-not $ogTitle) { $problems += "no title: $rel"; continue }

  $ogBlock = @(
    "<meta content=""$(ConvertTo-AttrText $ogType)"" property=""og:type""/>"
    "<meta content=""$(ConvertTo-AttrText $ogUrl)"" property=""og:url""/>"
    "<meta content=""$(ConvertTo-AttrText $ogTitle)"" property=""og:title""/>"
    "<meta content=""$(ConvertTo-AttrText $ogDesc)"" property=""og:description""/>"
    "<meta content=""$ogImage"" property=""og:image""/>"
    "<meta content=""1200"" property=""og:image:width""/>"
    "<meta content=""630"" property=""og:image:height""/>"
    "<meta content=""SportGear Finder &mdash; real gear picks across Budget, Best Value and Premium tiers"" property=""og:image:alt""/>"
    "<meta content=""SportGear Finder"" property=""og:site_name""/>"
    "<meta content=""$(ConvertTo-AttrText $twCard)"" name=""twitter:card""/>"
    "<meta content=""$(ConvertTo-AttrText $ogTitle)"" name=""twitter:title""/>"
    "<meta content=""$(ConvertTo-AttrText $ogDesc)"" name=""twitter:description""/>"
    "<meta content=""$ogImage"" name=""twitter:image""/>"
  )

  # ---- strip, then re-insert after the canonical tag ----------------------
  $stripped = Remove-OwnedTags $text

  $canonMatch2 = [regex]::Match($stripped, $RxCanon)
  if (-not $canonMatch2.Success) { $problems += "canonical lost while stripping: $rel"; continue }

  $insertAt = $canonMatch2.Index + $canonMatch2.Length
  $payload  = $nl + (($IconBlock + $ogBlock) -join $nl)
  $tail     = $stripped.Substring($insertAt)
  # On partly-minified pages the next tag sits flush against the canonical.
  # Force a break so the block lands identically whatever the source layout.
  if ($tail -notmatch '^\r?\n') { $payload += $nl }
  $newText  = $stripped.Substring(0, $insertAt) + $payload + $tail

  # ---- validate before writing -------------------------------------------
  $checks = @{
    'canonical'  = ([regex]::Matches($newText, $RxCanon)).Count
    'og:image'   = ([regex]::Matches($newText, '\bproperty="og:image"')).Count
    'og:title'   = ([regex]::Matches($newText, '\bproperty="og:title"')).Count
    'twitter:image' = ([regex]::Matches($newText, '\bname="twitter:image"')).Count
  }
  $bad = $checks.GetEnumerator() | Where-Object { $_.Value -ne 1 }
  if ($bad) {
    $problems += "validation failed ($rel): " + (($bad | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ', ')
    continue
  }
  if ($newText -notmatch '</head>') { $problems += "head not closed: $rel"; continue }

  if ($newText -eq $text) { $skipped++; continue }

  $changed++
  Write-Verbose "update  $rel"
  if ($Apply) {
    $enc = New-Object System.Text.UTF8Encoding($hasBom)
    $outBytes = [byte[]]@($enc.GetPreamble()) + [byte[]]@($enc.GetBytes($newText))
    [System.IO.File]::WriteAllBytes($file.FullName, [byte[]]$outBytes)
  }
}

Write-Host ""
Write-Host "files scanned : $($files.Count)"
Write-Host "changed       : $changed"
Write-Host "already ok    : $skipped"
if ($problems) {
  Write-Host ""
  Write-Host "PROBLEMS:" -ForegroundColor Yellow
  $problems | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
}
if (-not $Apply) { Write-Host "`n(report only - re-run with -Apply to write)" -ForegroundColor Cyan }
