param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectRoot
)

function Backup-And-WriteFile {
  param([string]$TargetPath, [string]$Content)
  $dir = Split-Path $TargetPath
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (Test-Path $TargetPath) { Copy-Item $TargetPath "$TargetPath.bak" -Force }
  $Content | Out-File -FilePath $TargetPath -Encoding UTF8
  Write-Host "Wrote $TargetPath"
}
function Backup-And-WriteBinary {
  param([string]$TargetPath, [byte[]]$Bytes)
  $dir = Split-Path $TargetPath
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (Test-Path $TargetPath) { Copy-Item $TargetPath "$TargetPath.bak" -Force }
  [System.IO.File]::WriteAllBytes($TargetPath, $Bytes)
  Write-Host "Wrote $TargetPath"
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path

$map = @{
  "App.tsx" = "App.tsx";
  "src\auth\AuthProvider.tsx" = "src/auth/AuthProvider.tsx";
  "src\navigation\AppNavigator.tsx" = "src/navigation/AppNavigator.tsx";
  "src\ui\components\ErrorBoundary.tsx" = "src/ui/components/ErrorBoundary.tsx";
  "src\ui\assets\backgrounds.ts" = "src/ui/assets/backgrounds.ts";
  "src\ui\screens\HomeScreen.tsx" = "src/ui/screens/HomeScreen.tsx";
  "src\ui\screens\LoginScreen.tsx" = "src/ui/screens/LoginScreen.tsx";
  "src\ui\screens\SelectBackground.tsx" = "src/ui/screens/SelectBackground.tsx";
}

foreach ($kv in $map.GetEnumerator()) {
  $src = Join-Path $here $kv.Value
  $dst = Join-Path $ProjectRoot $kv.Key
  $content = Get-Content -LiteralPath $src -Raw -Encoding UTF8
  Backup-And-WriteFile -TargetPath $dst -Content $content
}

# binary asset
$fallback = [System.IO.File]::ReadAllBytes((Join-Path $here "assets/Backgrounds/fallback-1x1.png"))
Backup-And-WriteBinary -TargetPath (Join-Path $ProjectRoot "assets/Backgrounds/fallback-1x1.png") -Bytes $fallback

Write-Host "`n✅ Navigation/ErrorBoundary/background patch applied."
Write-Host "Now: npx expo start -c"
