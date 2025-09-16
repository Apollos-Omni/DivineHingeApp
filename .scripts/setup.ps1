param(
  [string]$RepoPath = ".."
)

Write-Host "Setting up AI Orchestrator..." -ForegroundColor Cyan

Push-Location "$PSScriptRoot\..\ai"
if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Copied .env.example -> .env (fill your secrets)"
}
npm install
npm run build
Pop-Location

Write-Host "Done. To run:" -ForegroundColor Green
Write-Host "  node ai/dist/index.js --task 'Scan repo and suggest initial cleanup PR'"
