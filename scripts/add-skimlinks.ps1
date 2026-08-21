#requires -Version 5.1
<#
.SYNOPSIS
  Inserts (or removes) the Skimlinks publisher script on every page.

.DESCRIPTION
  One <script> tag, immediately before </body>, on all site pages.

  Why this is safe alongside the Amazon Associates links:

    - Skimlinks dropped Amazon as a merchant on 2020-03-31, so it does not
      rewrite amazon.com links at all.
    - It also states it "does not overwrite any links that already have
      affiliate network tracking" - every amazon.com href here carries
      tag=sportgearfind-20, so they are doubly out of scope.

  What it actually monetises is the 17 walmart.com and 5 decathlon.com links,
  which earn nothing today (see fix-link-rel.ps1 for why they are nofollow).

  Insertion is done on the </body> tag rather than line-by-line, so the
  part-minified tennis/* and tools/* pages are handled the same as the rest.

.EXAMPLE
  .\add-skimlinks.ps1            # report only
  .\add-skimlinks.ps1 -Apply     # write changes
  .\add-skimlinks.ps1 -Remove -Apply   # back the tag out again
#>
[CmdletBinding()]
param(
  [switch]$Apply,
  [switch]$Remove,
  [string]$PublisherId = '307953X1796249',
  [string]$Root
)

$ErrorActionPreference = 'Stop'

if (-not $Root) {
  $here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path $MyInvocation.MyCommand.Path -Parent }
  $Root = Split-Path $here -Parent
}
$Root = [System.IO.Path]::GetFullPath($Root)

$src = "https://s.skimresources.com/js/$PublisherId.skimlinks.js"
$tag = "<script type=""text/javascript"" src=""$src""></script>"

# Matches any skimlinks script tag, not just ours, so a stale publisher id
# from an earlier run is replaced rather than duplicated.
$existingRx = '(?is)\s*<script\b[^>]*\bsrc="https?://[^"]*skimresources\.com/[^"]*"[^>]*>\s*</script>'
$bodyRx     = '(?i)</body>'

$files = Get-ChildItem -Path $Root -Filter *.html -Recurse -File |
         Where-Object { $_.FullName -notmatch '\\\.git\\' }

$added = 0; $updated = 0; $removed = 0; $already = 0; $noBody = 0

foreach ($file in $files) {
  $bytes  = [System.IO.File]::ReadAllBytes($file.FullName)
  $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
  $text   = [System.Text.Encoding]::UTF8.GetString($bytes)
  if ($hasBom) { $text = $text.TrimStart([char]0xFEFF) }
  $orig = $text

  $hasSkim = [regex]::IsMatch($text, $existingRx)

  if ($Remove) {
    if ($hasSkim) { $text = [regex]::Replace($text, $existingRx, ''); $removed++ }
  }
  elseif ($hasSkim) {
    if ($text -like "*$src*") { $already++ }
    else { $text = [regex]::Replace($text, $existingRx, "`n$tag"); $updated++ }
  }
  elseif ([regex]::IsMatch($text, $bodyRx)) {
    # Replace only the first </body>; every page here has exactly one.
    $rx = New-Object System.Text.RegularExpressions.Regex($bodyRx)
    $text = $rx.Replace($text, "$tag`n</body>", 1)
    $added++
  }
  else {
    $noBody++
    Write-Warning "no </body> in $($file.FullName.Substring($Root.Length + 1)) - skipped"
  }

  if ($text -ne $orig -and $Apply) {
    $enc = New-Object System.Text.UTF8Encoding($hasBom)
    $outBytes = [byte[]]@($enc.GetPreamble()) + [byte[]]@($enc.GetBytes($text))
    [System.IO.File]::WriteAllBytes($file.FullName, [byte[]]$outBytes)
  }
}

Write-Host "publisher id  : $PublisherId"
Write-Host "pages scanned : $($files.Count)"
if ($Remove) {
  Write-Host "  removed     : $removed"
} else {
  Write-Host "  added       : $added"
  Write-Host "  id updated  : $updated"
  Write-Host "  already ok  : $already"
}
if ($noBody) { Write-Host "  skipped     : $noBody (no </body>)" }
if (-not $Apply) { Write-Host "`n(report only - re-run with -Apply to write)" -ForegroundColor Cyan }
