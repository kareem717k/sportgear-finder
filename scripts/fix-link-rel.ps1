#requires -Version 5.1
<#
.SYNOPSIS
  Normalises rel= on outbound commercial links.

.DESCRIPTION
  Two rules, both about being accurate rather than tidy:

    amazon.com   -> rel="sponsored noopener"
                    These carry the sportgearfind-20 tag, so they ARE paid
                    links. Google asks for "sponsored" and the FTC expects the
                    relationship to be disclosed.

    walmart.com  -> rel="nofollow noopener"
    decathlon.com   No affiliate programme is in place for either, so they are
                    not sponsored - they are simply links we do not want to
                    pass ranking signals to. "nofollow" is the honest label;
                    if a programme is ever signed these become "sponsored".

  Anchors with no rel at all get one inserted. Non-commercial outbound links
  (google policy pages, github docs) are deliberately left alone.

.EXAMPLE
  .\fix-link-rel.ps1            # report only
  .\fix-link-rel.ps1 -Apply     # write changes
#>
[CmdletBinding()]
param(
  [switch]$Apply,
  [string]$Root
)

$ErrorActionPreference = 'Stop'

if (-not $Root) {
  $here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path $MyInvocation.MyCommand.Path -Parent }
  $Root = Split-Path $here -Parent
}
$Root = [System.IO.Path]::GetFullPath($Root)

$rules = @(
  @{ Domain = 'amazon.com';    Rel = 'sponsored noopener' }
  @{ Domain = 'walmart.com';   Rel = 'nofollow noopener'  }
  @{ Domain = 'decathlon.com'; Rel = 'nofollow noopener'  }
)

$files = Get-ChildItem -Path $Root -Filter *.html -Recurse -File |
         Where-Object { $_.FullName -notmatch '\\\.git\\' }

$changedFiles = 0
$counts = @{}

foreach ($file in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
  $text = [System.Text.Encoding]::UTF8.GetString($bytes)
  if ($hasBom) { $text = $text.TrimStart([char]0xFEFF) }
  $orig = $text

  foreach ($rule in $rules) {
    $domain  = $rule.Domain
    $wantRel = $rule.Rel
    $rx = '<a\b[^>]*href="https?://(?:www\.)?' + [regex]::Escape($domain) + '[^"]*"[^>]*>'

    # rel is an unordered token set, so only add what is genuinely missing -
    # rewriting "noopener sponsored" to "sponsored noopener" is pure diff noise.
    $wantTokens = $wantRel -split '\s+'

    $evaluator = {
      param($m)
      $tag = $m.Value
      if ($tag -match '\brel="([^"]*)"') {
        $have = @($Matches[1] -split '\s+' | Where-Object { $_ })
        $missing = @($wantTokens | Where-Object { $have -notcontains $_ })
        if (-not $missing) { return $tag }
        $script:hits++
        $merged = (@($have) + $missing) -join ' '
        return [regex]::Replace($tag, '\brel="[^"]*"', "rel=""$merged""")
      }
      $script:hits++
      # no rel at all - insert one just before the tag closes
      return [regex]::Replace($tag, '\s*/?>$', " rel=""$wantRel"">")
    }

    $script:hits = 0
    $text = [regex]::Replace($text, $rx, $evaluator)
    if ($script:hits -gt 0) {
      if (-not $counts.ContainsKey($domain)) { $counts[$domain] = 0 }
      $counts[$domain] += $script:hits
    }
  }

  if ($text -ne $orig) {
    $changedFiles++
    if ($Apply) {
      $enc = New-Object System.Text.UTF8Encoding($hasBom)
      $outBytes = [byte[]]@($enc.GetPreamble()) + [byte[]]@($enc.GetBytes($text))
      [System.IO.File]::WriteAllBytes($file.FullName, [byte[]]$outBytes)
    }
  }
}

Write-Host "files changed : $changedFiles"
foreach ($k in ($counts.Keys | Sort-Object)) { Write-Host "  $k : $($counts[$k]) link(s) normalised" }
if (-not $counts.Count) { Write-Host "  nothing to do - all outbound rel values already correct" }
if (-not $Apply) { Write-Host "`n(report only - re-run with -Apply to write)" -ForegroundColor Cyan }
