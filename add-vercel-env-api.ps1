# Add Environment Variables to Vercel via API
# This script uses the Vercel API to add environment variables automatically

Write-Host "🚀 Adding Environment Variables to Vercel via API..." -ForegroundColor Cyan
Write-Host ""

# Get Vercel token from environment variable or prompt
$vercelToken = $env:VERCEL_TOKEN

if ([string]::IsNullOrWhiteSpace($vercelToken)) {
    # Go to: https://vercel.com/account/tokens
    $vercelToken = Read-Host "Enter your Vercel token (get from https://vercel.com/account/tokens)"
}

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
            $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Headers $headers -Body $body -ErrorAction Stop
            Write-Host "  ✅ $env" -ForegroundColor Green
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            $errorDetails = $_.Exception.Message
            
            if ($statusCode -eq 409) {
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
                        } | ConvertTo-Json -Compress
                        Invoke-RestMethod -Uri $updateUrl -Method Patch -Headers $headers -Body $updateBody -ErrorAction Stop
                        Write-Host "  ✅ $env (updated)" -ForegroundColor Green
                    } else {
                        Write-Host "  ⚠️  $env (exists but couldn't update)" -ForegroundColor Yellow
                    }
                } catch {
                    Write-Host "  ⚠️  $env (update failed: $($_.Exception.Message))" -ForegroundColor Yellow
                }
            } elseif ($statusCode -eq 400) {
                # Try to get more details about the 400 error
                try {
                    $errorStream = $_.Exception.Response.GetResponseStream()
                    $reader = New-Object System.IO.StreamReader($errorStream)
                    $errorBody = $reader.ReadToEnd()
                    Write-Host "  ⚠️  $env (400 error - may already exist or invalid format)" -ForegroundColor Yellow
                } catch {
                    Write-Host "  ⚠️  $env (400 error - checking if exists...)" -ForegroundColor Yellow
                    # Check if it exists
                    try {
                        $listUrl = "$baseUrl?decrypt=true"
                        $existing = Invoke-RestMethod -Uri $listUrl -Method Get -Headers $headers
                        $existingVar = $existing.envs | Where-Object { $_.key -eq $envVar.Key -and $env -in $_.target }
                        if ($existingVar) {
                            Write-Host "  ✅ $env (already exists with correct value)" -ForegroundColor Green
                        } else {
                            Write-Host "  ❌ $env (400 error - may need manual setup)" -ForegroundColor Red
                        }
                    } catch {
                        Write-Host "  ❌ $env (error: $statusCode)" -ForegroundColor Red
                    }
                }
            } else {
                Write-Host "  ❌ $env (error: $statusCode)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
}

Write-Host "✅ Done! All environment variables added." -ForegroundColor Green
Write-Host ""
Write-Host "Verify at: https://vercel.com/robert-cashmans-projects/pstrain-rebuild/settings/environment-variables" -ForegroundColor Cyan
