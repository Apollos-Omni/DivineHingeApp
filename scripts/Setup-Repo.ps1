\
# PowerShell setup for DivineHingeApp repo (Windows)
param(
  [switch]$NoInstall
)

$ErrorActionPreference = "Stop"
Write-Host "== DivineHingeApp one-time setup ==" -ForegroundColor Cyan

# Ensure execution policy for this session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

if (-not $NoInstall) {
  if (Test-Path package.json) {
    Write-Host "Installing dev deps (vitest, husky, lint-staged)..." -ForegroundColor Yellow
    npm i -D vitest @vitest/coverage-v8 husky lint-staged
  } else {
    Write-Warning "No package.json found in current directory."
  }
}

# Initialize husky
Write-Host "Initializing Husky..." -ForegroundColor Yellow
npx husky init

# Overwrite pre-commit with our version (fixes wrong _/_ path issue)
$hook = ".husky/pre-commit"
$content = "#!/usr/bin/env sh`n. `"$(dirname -- `"$0`")/_/husky.sh`"`n`n npx --no-install lint-staged`n"
Set-Content -Path $hook -Value $content -NoNewline

# Enforce LF endings for husky scripts
git add .gitattributes 2>$null
git add .husky/pre-commit 2>$null

# Merge package additions
Write-Host "Merging package.json additions..." -ForegroundColor Yellow
node scripts/merge-package.mjs

Write-Host "Setup complete. Next steps:" -ForegroundColor Green
Write-Host "  git add -A && git commit -m \"chore(repo): setup husky + vitest + deno config\""
Write-Host "  npm run test:run"
