
param(
  [Parameter(Mandatory=$true)]
  [string]$DbUrl,
  [string]$SqlDir = "$PSScriptRoot\..\sql",
  [switch]$DryRun
)

# Resolve and validate SQL directory
$SqlDir = (Resolve-Path $SqlDir).Path
if (-not (Test-Path $SqlDir)) {
  Write-Error "SQL directory not found: $SqlDir"
  exit 1
}

# Ensure psql is available
$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
  Write-Warning "psql not found. Install PostgreSQL client first."
  Write-Host "Winget:    winget install -e --id PostgreSQL.PostgreSQL"
  Write-Host "Chocolatey: choco install postgresql"
  exit 127
}

Write-Host "Applying SQL from: $SqlDir" -ForegroundColor Cyan
Write-Host "Target DB: $DbUrl" -ForegroundColor Cyan

$files = Get-ChildItem -Path $SqlDir -Filter *.sql | Sort-Object Name
if ($files.Count -eq 0) {
  Write-Error "No .sql files found in $SqlDir"
  exit 1
}

foreach ($f in $files) {
  $cmd = "psql -v ON_ERROR_STOP=1 `"$DbUrl`" -f `"$($f.FullName)`""
  if ($DryRun) {
    Write-Host "[DRY RUN] $cmd" -ForegroundColor Yellow
  } else {
    Write-Host "Running: $($f.Name)" -ForegroundColor Green
    & psql -v ON_ERROR_STOP=1 "$DbUrl" -f "$($f.FullName)"
    if ($LASTEXITCODE -ne 0) {
      Write-Error "Failed while executing $($f.Name). Aborting."
      exit $LASTEXITCODE
    }
  }
}

Write-Host "All migrations applied successfully." -ForegroundColor Green
