# PowerShell script to open migration files for easy copy-paste

Write-Host "Opening migration files for copy-paste..." -ForegroundColor Green

$migration1 = "supabase\migrations\001_initial_schema.sql"
$migration2 = "supabase\migrations\002_new_features.sql"

if (Test-Path $migration1) {
    Write-Host "Opening: $migration1" -ForegroundColor Cyan
    Start-Process notepad.exe -ArgumentList $migration1
    Start-Sleep -Seconds 1
}

if (Test-Path $migration2) {
    Write-Host "Opening: $migration2" -ForegroundColor Cyan
    Start-Process notepad.exe -ArgumentList $migration2
}

Write-Host "`nFiles opened in Notepad. Copy the contents and paste into Supabase SQL Editor." -ForegroundColor Yellow
Write-Host "Supabase Dashboard: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa" -ForegroundColor Cyan
Write-Host "SQL Editor: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new" -ForegroundColor Cyan

