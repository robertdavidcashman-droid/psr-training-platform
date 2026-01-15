# GitHub Setup Script - OneDrive Compatible
# This script helps set up GitHub integration

Write-Host "🚀 GitHub Integration Setup" -ForegroundColor Cyan
Write-Host ""

# Check if we're in OneDrive
$currentPath = Get-Location
if ($currentPath.Path -like "*OneDrive*") {
    Write-Host "⚠️  Warning: Project is in OneDrive folder" -ForegroundColor Yellow
    Write-Host "This may cause issues with git. Consider copying to a local folder." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "`n💡 Tip: Copy project to C:\Projects\psr-training for better compatibility" -ForegroundColor Cyan
        exit 0
    }
}

# Check if git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "   https://git-scm.com/download/win" -ForegroundColor White
    exit 1
}

Write-Host "✅ Git is installed" -ForegroundColor Green

# Check if already a git repo
if (Test-Path .git) {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
} else {
    Write-Host "`n📦 Initializing git repository..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to initialize git repository" -ForegroundColor Red
        exit 1
    }
}

# Check if files are staged
$status = git status --porcelain
if ($status) {
    Write-Host "`n📝 Staging files..." -ForegroundColor Cyan
    git add .
    
    Write-Host "💾 Creating initial commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: PSR Training Platform"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Files committed" -ForegroundColor Green
    }
} else {
    Write-Host "✅ All files already committed" -ForegroundColor Green
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Name it: psr-training-platform" -ForegroundColor White
Write-Host "3. Do not initialize with README" -ForegroundColor White
Write-Host "4. Then run:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/psr-training-platform.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or use GitHub Desktop for easier setup!" -ForegroundColor Cyan
