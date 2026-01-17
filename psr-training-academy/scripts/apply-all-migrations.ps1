# Apply all migrations to Supabase
# This script will output all SQL needed and open the SQL Editor

$migrationsDir = Join-Path $PSScriptRoot "..\supabase\migrations"
$allSql = @()

Write-Host ""
Write-Host "Gathering all migrations..." -ForegroundColor Cyan
Write-Host ""

# Get all migration files sorted by name
$migrationFiles = Get-ChildItem -Path $migrationsDir -Filter "*.sql" | Sort-Object Name

if ($migrationFiles.Count -eq 0) {
    Write-Host "ERROR: No migration files found" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($migrationFiles.Count) migration file(s):" -ForegroundColor Green
Write-Host ""
foreach ($file in $migrationFiles) {
    Write-Host "  - $($file.Name)" -ForegroundColor White
    $allSql += "`n-- ========================================"
    $allSql += "-- Migration: $($file.Name)"
    $allSql += "-- ========================================`n"
    $allSql += Get-Content $file.FullName -Raw
    $allSql += "`n"
}

$combinedSql = $allSql -join "`n"

Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Gray
Write-Host "Complete Migration SQL" -ForegroundColor Cyan
Write-Host ""
Write-Host $combinedSql -ForegroundColor White
Write-Host ("=" * 70) -ForegroundColor Gray

Write-Host ""
Write-Host "To apply these migrations:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/sql/new" -ForegroundColor White
Write-Host "2. Copy ALL the SQL above" -ForegroundColor White
Write-Host "3. Paste it into the SQL Editor" -ForegroundColor White
Write-Host "4. Click 'Run'" -ForegroundColor White
Write-Host ""

# Try to open the browser automatically
$url = "https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/sql/new"
try {
    Start-Process $url
    Write-Host "Opened Supabase SQL Editor in your browser" -ForegroundColor Green
} catch {
    Write-Host "Could not open browser automatically" -ForegroundColor Yellow
    Write-Host "Please open: $url" -ForegroundColor White
}

Write-Host ""
Write-Host "After running the SQL, test with: npm run doctor" -ForegroundColor Cyan
Write-Host ""

# Also save to a file for easy copying
$outputFile = Join-Path $PSScriptRoot "..\ALL_MIGRATIONS.sql"
$combinedSql | Out-File -FilePath $outputFile -Encoding UTF8 -NoNewline
Write-Host "Also saved to: $outputFile" -ForegroundColor Cyan
Write-Host "You can copy from this file if needed" -ForegroundColor Gray
Write-Host ""
