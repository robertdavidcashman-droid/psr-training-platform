param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [switch]$IncludeReset
)

$migrationsDir = Join-Path $ProjectRoot "db/migrations"
$files = New-Object System.Collections.Generic.List[string]
if ($IncludeReset) { $files.Add("000_reset_psr_schema.sql") }
$files.Add("001_initial_schema.sql")
$files.Add("002_rls_policies.sql")
$files.Add("003_seed_data.sql")
$files.Add("004_seed_scenarios.sql")

foreach ($f in $files) {
  $p = Join-Path $migrationsDir $f
  if (-not (Test-Path $p)) {
    throw "Missing migration file: $p"
  }
}

$parts = New-Object System.Collections.Generic.List[string]
foreach ($f in $files) {
  $parts.Add("-- ============================================================")
  $parts.Add("-- BEGIN $f")
  $parts.Add("-- ============================================================")
  $parts.Add("")
  $parts.Add((Get-Content (Join-Path $migrationsDir $f) -Raw))
  $parts.Add("")
  $parts.Add("-- ============================================================")
  $parts.Add("-- END $f")
  $parts.Add("-- ============================================================")
  $parts.Add("")
}

$all = ($parts -join "`r`n")

if (Get-Command Set-Clipboard -ErrorAction SilentlyContinue) {
  $all | Set-Clipboard
  Write-Host "Copied Supabase migrations to clipboard." -ForegroundColor Green
  Write-Host "Paste into Supabase SQL Editor and run once." -ForegroundColor Cyan
} else {
  Write-Host "Set-Clipboard not available. Printing migrations to stdout:" -ForegroundColor Yellow
  Write-Output $all
}

