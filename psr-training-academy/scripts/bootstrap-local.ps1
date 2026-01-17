param(
  [string]$SupabaseProjectRef = "",
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

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

$supabase = Resolve-SupabaseCli

Write-Host "PSR Training Academy - Local Bootstrap" -ForegroundColor Cyan
Write-Host "Repo: $root" -ForegroundColor DarkGray

if ([string]::IsNullOrWhiteSpace($SupabaseProjectRef)) {
  $SupabaseProjectRef = Read-Host "Enter NEW Supabase project ref (20 chars, from https://<ref>.supabase.co)"
}

if ($SupabaseProjectRef.Length -ne 20) {
  throw "Invalid Supabase project ref length ($($SupabaseProjectRef.Length)). Expected 20."
}

if ($NonInteractive) {
  if ([string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) { throw "Set SUPABASE_ACCESS_TOKEN for -NonInteractive." }
  if ([string]::IsNullOrWhiteSpace($env:SUPABASE_DB_PASSWORD)) { throw "Set SUPABASE_DB_PASSWORD for -NonInteractive." }
}

# Link the project (requires login/token)
& $supabase link --project-ref $SupabaseProjectRef

# Ensure deps
Write-Host "`nInstalling dependencies (npm ci)..." -ForegroundColor Cyan
npm ci

# Ensure local env file
$envFile = Join-Path $root ".env.local"
if (-not (Test-Path $envFile)) {
  Write-Host "`nCreating .env.local..." -ForegroundColor Cyan
  $url = "https://$SupabaseProjectRef.supabase.co"
  $anon = Read-Host "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY (anon public key from Supabase Settings → API)"
  @(
    "NEXT_PUBLIC_SUPABASE_URL=$url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon"
  ) | Out-File -FilePath $envFile -Encoding utf8 -Force
  Write-Host "Wrote .env.local" -ForegroundColor Green
} else {
  Write-Host ".env.local already exists (leaving as-is)." -ForegroundColor DarkGray
}

# Push migrations + seed
Write-Host "`nApplying DB migrations (supabase db push --include-seed)..." -ForegroundColor Cyan
if ($NonInteractive) {
  & $supabase db push --include-seed --include-all --password $env:SUPABASE_DB_PASSWORD --yes
} else {
  & $supabase db push --include-seed --include-all
}

# Run gates
Write-Host "`nRunning quality gates..." -ForegroundColor Cyan
npm run format:check
npm run lint
npm run typecheck
npm run test:coverage
npm run build

Write-Host "`nStarting dev server..." -ForegroundColor Cyan
npm run dev

