# PowerShell script to run autotest and autofix
# Usage: .\scripts\run-autotest.ps1

Write-Host "Running Comprehensive Autotest and Autofix..." -ForegroundColor Cyan
Write-Host ""

node scripts/autotest-and-autofix.js

Write-Host ""
Write-Host "Test complete! Check AUTOTEST_REPORT.md for details." -ForegroundColor Green
