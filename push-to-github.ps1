# GitHub Push Script
# Run this after creating your GitHub repository

Write-Host "🚀 GitHub Push Script" -ForegroundColor Cyan
Write-Host ""

# Get GitHub username
$username = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter your repository name (e.g., psr-training-platform)"

if ([string]::IsNullOrWhiteSpace($username) -or [string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "❌ Username and repository name are required!" -ForegroundColor Red
    exit 1
}

# Check if remote already exists
$remoteExists = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Remote 'origin' already exists. Removing..." -ForegroundColor Yellow
    git remote remove origin
}

# Add remote
Write-Host "`n📡 Adding GitHub remote..." -ForegroundColor Cyan
git remote add origin "https://github.com/$username/$repoName.git"

# Check current branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "`n🔄 Renaming branch to 'main'..." -ForegroundColor Cyan
    git branch -M main
}

# Push to GitHub
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "You may be prompted for GitHub credentials." -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Click 'Add New...' → 'Project'" -ForegroundColor White
    Write-Host "3. Import your GitHub repository: $repoName" -ForegroundColor White
    Write-Host "4. Add environment variables" -ForegroundColor White
    Write-Host "5. Deploy!" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed. Please check:" -ForegroundColor Red
    Write-Host "- Repository exists on GitHub" -ForegroundColor White
    Write-Host "- You have access to the repository" -ForegroundColor White
    Write-Host "- GitHub credentials are correct" -ForegroundColor White
}
