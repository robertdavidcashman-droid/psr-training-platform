# PSR Training Academy - Automated Deployment Script (deploys `psr-training-academy/`)
Write-Host "🚀 Starting deployment to Vercel (psr-training-academy/)..." -ForegroundColor Cyan

$subdir = "psr-training-academy"
if (-not (Test-Path $subdir)) {
    Write-Host "❌ Subproject folder not found: $subdir" -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if logged in
Write-Host "`n📋 Checking Vercel login status..." -ForegroundColor Cyan
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Vercel. Please run: vercel login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green

# Build the project first
Write-Host "`n🔨 Building project..." -ForegroundColor Cyan
Push-Location $subdir
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Pop-Location

# Deploy
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "Note: You may need to answer prompts interactively." -ForegroundColor Yellow
Write-Host "`nRunning: vercel --prod" -ForegroundColor Cyan
Write-Host "`n---" -ForegroundColor Gray

Push-Location $subdir
vercel --prod --yes
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com/dashboard to add environment variables" -ForegroundColor White
    Write-Host "2. Update Supabase redirect URLs at:" -ForegroundColor White
    Write-Host "   https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/auth/url-configuration" -ForegroundColor White
    Write-Host "3. Add your Vercel URL to Supabase redirect URLs" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Deployment may need manual intervention." -ForegroundColor Yellow
    Write-Host "Try running: vercel --prod" -ForegroundColor White
}
