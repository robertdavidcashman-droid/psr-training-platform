# Add Environment Variables to Vercel via API
# This script uses the Vercel API to add environment variables automatically

Write-Host "🚀 Adding Environment Variables to Vercel via API..." -ForegroundColor Cyan
Write-Host ""

# Get Vercel token (you may need to get this from Vercel dashboard)
# Go to: https://vercel.com/account/tokens
$vercelToken = Read-Host "Enter your Vercel token (get from https://vercel.com/account/tokens)"

if ([string]::IsNullOrWhiteSpace($vercelToken)) {
    Write-Host "❌ Vercel token is required!" -ForegroundColor Red
    exit 1
}

$projectId = "prj_uJSNdPK7XUfrt5qzVvZxkQgAlA6I"  # pstrain-rebuild project ID
$teamId = "team_wbvkpoLfvbg9qFwg5LqJLAjN"  # robert-cashmans-projects

# Try to read OpenAI key from local file
$openaiKey = ""
$localEnvFile = Join-Path $PSScriptRoot "ENV_VARS_LOCAL.txt"
if (Test-Path $localEnvFile) {
    $content = Get-Content $localEnvFile -Raw
    if ($content -match "OPENAI_API_KEY\s+([^\r\n]+)") {
        $openaiKey = $matches[1].Trim()
    }
}

if ([string]::IsNullOrWhiteSpace($openaiKey)) {
    $openaiKey = Read-Host "Enter your OpenAI API key (or get from ENV_VARS_LOCAL.txt)"
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
        Value = $openaiKey
    },
    @{
        Key = "NEXT_PUBLIC_SITE_URL"
        Value = "https://psrtrain.com"
    }
)

$environments = @("production", "preview", "development")
$baseUrl = "https://api.vercel.com/v10/projects/$projectId/env"

$headers = @{
    "Authorization" = "Bearer $vercelToken"
    "Content-Type" = "application/json"
}

foreach ($envVar in $envVars) {
    Write-Host "Adding: $($envVar.Key)..." -ForegroundColor Yellow
    
    foreach ($env in $environments) {
        $body = @{
            key = $envVar.Key
            value = $envVar.Value
            type = "encrypted"
            target = @($env)
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Headers $headers -Body $body
            Write-Host "  ✅ $env" -ForegroundColor Green
        } catch {
            $errorMessage = $_.Exception.Response.StatusCode.value__
            if ($errorMessage -eq 409) {
                Write-Host "  ⚠️  $env (already exists - updating...)" -ForegroundColor Yellow
                # Try to update instead
                try {
                    # Get existing env var ID first
                    $listUrl = "$baseUrl?decrypt=true"
                    $existing = Invoke-RestMethod -Uri $listUrl -Method Get -Headers $headers
                    $existingVar = $existing.envs | Where-Object { $_.key -eq $envVar.Key -and $env -in $_.target }
                    if ($existingVar) {
                        $updateUrl = "$baseUrl/$($existingVar.id)"
                        $updateBody = @{
                            value = $envVar.Value
                            target = @($env)
                        } | ConvertTo-Json
                        Invoke-RestMethod -Uri $updateUrl -Method Patch -Headers $headers -Body $updateBody
                        Write-Host "  ✅ $env (updated)" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "  ⚠️  $env (update failed - may need manual setup)" -ForegroundColor Yellow
                }
            } else {
                Write-Host "  ❌ $env (error: $errorMessage)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
}

Write-Host "✅ Done! All environment variables added." -ForegroundColor Green
Write-Host ""
Write-Host "Verify at: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables" -ForegroundColor Cyan
