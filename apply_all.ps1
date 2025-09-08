param([Parameter(Mandatory=$true)][string]$ProjectRoot)
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Applying navigation patch..."
& (Join-Path $here "pack_nav\apply_nav_patch.ps1") -ProjectRoot $ProjectRoot
if ($LASTEXITCODE -ne 0) { throw "Navigation patch failed" }
Write-Host "Applying feature stubs patch..."
& (Join-Path $here "pack_features\apply_feature_stub_fix.ps1") -ProjectRoot $ProjectRoot
if ($LASTEXITCODE -ne 0) { throw "Feature stubs patch failed" }
Write-Host "`n✅ All patches applied. Run: cd `"$ProjectRoot`"; npx expo start -c"
