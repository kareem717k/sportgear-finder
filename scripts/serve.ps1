#requires -Version 5.1
<#
.SYNOPSIS
  Minimal static file server for local preview of the site.

.DESCRIPTION
  GitHub Pages serves this repo from its root, so root-absolute paths like
  /favicon.ico and /site.webmanifest only resolve over http - file:// will not
  do. This exists purely so the local preview matches production.
#>
[CmdletBinding()]
param(
  [int]$Port = 8899,
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

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  # HttpListener drops the "+json" structured suffix, leaving no Content-Type
  # at all. Production (GitHub Pages) sends application/manifest+json.
  '.webmanifest' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.ico'  = 'image/x-icon'
  '.xml'  = 'application/xml; charset=utf-8'
  '.txt'  = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "serving $Root on http://localhost:$Port/"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
    $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if (-not $rel) { $rel = 'index.html' }
    $path = Join-Path $Root ($rel -replace '/', '\')
    if (Test-Path $path -PathType Container) { $path = Join-Path $path 'index.html' }

    # keep requests inside the site root
    $full = [System.IO.Path]::GetFullPath($path)
    if (-not $full.StartsWith([System.IO.Path]::GetFullPath($Root), [StringComparison]::OrdinalIgnoreCase)) {
      $ctx.Response.StatusCode = 403; $ctx.Response.Close(); continue
    }

    if (Test-Path $full -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      $ctx.Response.StatusCode = 200
      Write-Host "200 /$rel"
    } else {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 /$rel")
      $ctx.Response.ContentType = 'text/plain; charset=utf-8'
      $ctx.Response.StatusCode = 404
      Write-Host "404 /$rel" -ForegroundColor Yellow
    }

    # Always declare the length before writing. Without it http.sys may fix
    # Content-Length at 0 and the write throws ProtocolViolationException.
    if ($ctx.Request.HttpMethod -eq 'HEAD') {
      $ctx.Response.ContentLength64 = $bytes.LongLength
    } else {
      $ctx.Response.ContentLength64 = $bytes.LongLength
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    } catch {
      # A single bad request must never take the server down.
      Write-Host "ERR /$rel : $($_.Exception.Message)" -ForegroundColor Red
    } finally {
      try { $ctx.Response.Close() } catch { }
    }
  }
} finally {
  $listener.Stop(); $listener.Close()
}
