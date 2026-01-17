param(
  [string]$ProjectRef = "",
  [switch]$NonInteractive
)

$ErrorActionPreference = "Stop"

function Resolve-SupabaseCli() {
  $cmd = Get-Command supabase -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $shim = "C:\Users\rober\scoop\shims\supabase.exe"
  if (Test-Path $shim) { return $shim }

  throw "Supabase CLI not found. Install via: scoop install supabase"
}

$supabase = Resolve-SupabaseCli

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
  $ProjectRef = Read-Host "Enter your Supabase project ref (20 chars, from https://<ref>.supabase.co)"
}

if ($ProjectRef.Length -ne 20) {
  throw "Invalid project ref length ($($ProjectRef.Length)). Supabase project refs are 20 characters."
}

Write-Host "Supabase project ref: $ProjectRef" -ForegroundColor Cyan

# Auth:
# - If SUPABASE_ACCESS_TOKEN is set, Supabase CLI can run non-interactively.
# - Otherwise, user will need to `supabase login` once.
if ($NonInteractive -and [string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
  throw "NonInteractive requested but SUPABASE_ACCESS_TOKEN is not set."
}

# Link project (safe to run multiple times)
if ($NonInteractive) {
  & $supabase link --project-ref $ProjectRef
} else {
  try {
    & $supabase link --project-ref $ProjectRef
  } catch {
    Write-Host "If prompted, run: supabase login" -ForegroundColor Yellow
    throw
  }
}

if ($NonInteractive -and [string]::IsNullOrWhiteSpace($env:SUPABASE_DB_PASSWORD)) {
  throw "NonInteractive requested but SUPABASE_DB_PASSWORD is not set."
}

Write-Host "Pushing migrations to remote via supabase db push (includes seed)..." -ForegroundColor Cyan
if ($NonInteractive) {
  & $supabase db push --include-seed --include-all --password $env:SUPABASE_DB_PASSWORD --yes
} else {
  & $supabase db push --include-seed --include-all
}

Write-Host "Done." -ForegroundColor Green

