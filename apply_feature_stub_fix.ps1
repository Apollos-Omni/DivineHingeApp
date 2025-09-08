param([Parameter(Mandatory=$true)][string]$ProjectRoot)

function Backup-And-WriteText { param([string]$TargetPath, [string]$Content)
  $dir = Split-Path $TargetPath
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (Test-Path $TargetPath) { Copy-Item $TargetPath "$TargetPath.bak" -Force }
  $Content | Out-File -FilePath $TargetPath -Encoding UTF8
  Write-Host "Wrote $TargetPath"
}
function Backup-And-WriteBinary { param([string]$TargetPath, [byte[]]$Bytes)
  $dir = Split-Path $TargetPath
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (Test-Path $TargetPath) { Copy-Item $TargetPath "$TargetPath.bak" -Force }
  [System.IO.File]::WriteAllBytes($TargetPath, $Bytes)
  Write-Host "Wrote $TargetPath"
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = @(
  "src/theme/tokens.ts",
  "src/ui/components/common/GradientButton.tsx",
  "src/ui/components/common/GlassCard.tsx",
  "src/ui/components/common/IconButton.tsx",
  "src/ui/components/common/SectionHeader.tsx",
  "src/ui/components/DoorCard.tsx",
  "src/ui/components/common/PulseRing.tsx",
  "src/ui/components/sheets/DoorStatusSheet.tsx",
  "src/ui/features/avatars/AvatarBuilder.tsx",
  "src/ui/features/home/Minimap.tsx",
  "src/ui/screens/HomeHallway.tsx",
  "src/types/home.ts"
)
foreach ($rel in $files) {
  $src = Join-Path $here $rel
  $dst = Join-Path $ProjectRoot $rel
  $content = Get-Content -LiteralPath $src -Raw -Encoding UTF8
  Backup-And-WriteText -TargetPath $dst -Content $content
}

# Assets
$door1 = [System.IO.File]::ReadAllBytes((Join-Path $here "src/ui/assets/doors/door1.jpg"))
$B0 = [System.IO.File]::ReadAllBytes((Join-Path $here "src/ui/assets/doors/B0.png"))
$avif = [System.IO.File]::ReadAllBytes((Join-Path $here "src/ui/assets/doors/door2.avif"))

Backup-And-WriteBinary -TargetPath (Join-Path $ProjectRoot "src/ui/assets/doors/door1.jpg") -Bytes $door1
Backup-And-WriteBinary -TargetPath (Join-Path $ProjectRoot "src/ui/assets/doors/B0.png") -Bytes $B0
Backup-And-WriteBinary -TargetPath (Join-Path $ProjectRoot "src/ui/assets/doors/door2.avif") -Bytes $avif

Write-Host "`n✅ Installed: theme, common components, safe stubs, and assets."
Write-Host "Next: npx expo start -c"
