param(
  [string]$LogFile = "doctor.log"
)

$ErrorActionPreference = "Continue"

function Run-Step($name, $cmd) {
  Write-Host "`n=== $name ===" -ForegroundColor Cyan
  $cmd | Out-String | Tee-Object -FilePath $LogFile -Append | Out-Host
}

Remove-Item $LogFile -ErrorAction SilentlyContinue

Run-Step "Node/NPM versions" (cmd /c "node -v && npm -v")
Run-Step "Format check" (cmd /c "npm run format:check")
Run-Step "Lint" (cmd /c "npm run lint")
Run-Step "Typecheck" (cmd /c "npm run typecheck")
Run-Step "Unit tests (coverage)" (cmd /c "npm run test:coverage")
Run-Step "Build" (cmd /c "npm run build")

Write-Host "`nWrote $LogFile" -ForegroundColor Green
Write-Host "If something failed, paste doctor.log into chat and I will fix everything in one pass." -ForegroundColor Yellow

