# Quick GitHub Remote Setup Script
Write-Host "`n🚀 GitHub Remote Setup" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Gray
Write-Host ""

# Check current remotes
Write-Host "📋 Checking existing remotes..." -ForegroundColor Cyan
$remotes = git remote -v
if ($remotes) {
    Write-Host "Current remotes:" -ForegroundColor Yellow
    Write-Host $remotes
    Write-Host ""
    $replace = Read-Host "Remote already exists. Replace it? (y/n)"
    if ($replace -eq "y") {
        git remote remove origin 2>$null
        Write-Host "✅ Removed existing remote" -ForegroundColor Green
    } else {
        Write-Host "Keeping existing remote. Exiting." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "📝 Please provide your GitHub repository URL:" -ForegroundColor Cyan
Write-Host "   Examples:" -ForegroundColor Gray
Write-Host "   - HTTPS: https://github.com/username/repo-name.git" -ForegroundColor White
Write-Host "   - SSH:   git@github.com:username/repo-name.git" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "GitHub Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ No URL provided. Exiting." -ForegroundColor Red
    exit 1
}

# Add remote
Write-Host "`n🔗 Adding remote..." -ForegroundColor Cyan
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote added successfully!" -ForegroundColor Green
    
    # Verify
    Write-Host "`n📋 Verifying remote..." -ForegroundColor Cyan
    git remote -v
    
    Write-Host "`n✅ Setup complete!" -ForegroundColor Green
    Write-Host "`n📤 Next: Push your code with:" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host '❌ Failed to add remote. Check the URL and try again.' -ForegroundColor Red
    exit 1
}
