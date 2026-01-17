# Auto-apply healthcheck migration
# This script will output the SQL and provide a direct link to run it

$migrationPath = Join-Path $PSScriptRoot "..\supabase\migrations\20250118000000_healthcheck.sql"
$sql = Get-Content $migrationPath -Raw

Write-Host "`n🔧 Healthcheck Migration SQL`n" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host $sql -ForegroundColor White
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host "`n📋 To apply this migration:`n" -ForegroundColor Yellow
Write-Host "1. Open: https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/sql/new" -ForegroundColor White
Write-Host "2. Copy the SQL above" -ForegroundColor White
Write-Host "3. Paste it into the SQL Editor" -ForegroundColor White
Write-Host "4. Click 'Run'`n" -ForegroundColor White

# Try to open the browser automatically
$url = "https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/sql/new"
try {
    Start-Process $url
    Write-Host "✅ Opened Supabase SQL Editor in your browser" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not open browser automatically" -ForegroundColor Yellow
    Write-Host "   Please open: $url" -ForegroundColor White
}

Write-Host "`n💡 After running the SQL, test with: npm run doctor`n" -ForegroundColor Cyan
