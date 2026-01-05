param(
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Host "GitHub Push Script" -ForegroundColor Cyan
Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote origin already exists. Removing..." -ForegroundColor Yellow
    git remote remove origin
}

# Add remote
Write-Host "Adding GitHub remote..." -ForegroundColor Cyan
git remote add origin "https://github.com/$Username/$RepoName.git"

# Check current branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "Renaming branch to main..." -ForegroundColor Cyan
    git branch -M main
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "You may be prompted for GitHub credentials." -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Connect to Vercel at https://vercel.com/dashboard" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Push failed. Check repository exists and credentials are correct." -ForegroundColor Red
}
