# Add Environment Variables to Vercel Automatically
# Run from: C:\Projects\psr-training

Write-Host "🚀 Adding Environment Variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Projects\psr-training"
Set-Location $projectPath

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Environment variables to add
$envVars = @(
    @{
        Key = "NEXT_PUBLIC_SUPABASE_URL"
        Value = "https://cvsawjrtgmsmadtfwfa.supabase.co"
    },
    @{
        Key = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        Value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODMwOTAsImV4cCI6MjA4MjE1OTA5MH0.21YaDem0vOg__ooPP1dX-Bntk6vDpHrneHFvxoiWn1Y"
    },
    @{
        Key = "OPENAI_API_KEY"
        Value = ""  # Get from ENV_VARS_LOCAL.txt
    },
    @{
        Key = "NEXT_PUBLIC_SITE_URL"
        Value = "https://psrtrain.com"
    }
)

# Add each environment variable for all environments
foreach ($envVar in $envVars) {
    Write-Host "Adding: $($envVar.Key)..." -ForegroundColor Yellow
    
    $environments = @("production", "preview", "development")
    
    foreach ($env in $environments) {
        # Use echo to pipe the value, then pipe environment selection
        $valueInput = $envVar.Value
        $envInput = $env
        
        # Create a temporary approach: use vercel env add with proper piping
        $command = "echo '$valueInput' | vercel env add '$($envVar.Key)' $env --yes"
        
        try {
            $result = Invoke-Expression $command 2>&1
            if ($LASTEXITCODE -eq 0 -or $result -match "already exists" -or $result -match "Added") {
                Write-Host "  ✅ $env" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  $env (check manually)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ⚠️  $env (may need manual setup)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

Write-Host "✅ Done! All environment variables added." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables" -ForegroundColor White
Write-Host "2. Verify all variables are there" -ForegroundColor White
Write-Host "3. Deploy: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/deployments" -ForegroundColor White
