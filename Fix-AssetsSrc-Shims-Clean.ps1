param([Parameter(Mandatory=$true)][string]$ProjectRoot)

function Ensure-Dir { param([string]$p)
  if (!(Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
}
function Write-Text { param([string]$Path,[string]$Content)
  Ensure-Dir (Split-Path -LiteralPath $Path)
  if (Test-Path -LiteralPath $Path) { Copy-Item -LiteralPath $Path -Destination "$Path.bak" -Force }
  $Content | Out-File -FilePath $Path -Encoding UTF8
  Write-Host "Wrote $Path"
}
function Write-B64 { param([string]$Path,[string]$B64)
  Ensure-Dir (Split-Path -LiteralPath $Path)
  if (Test-Path -LiteralPath $Path) { Copy-Item -LiteralPath $Path -Destination "$Path.bak" -Force }
  [IO.File]::WriteAllBytes($Path, [Convert]::FromBase64String($B64))
  Write-Host "Wrote $Path"
}

# ---------- 1) SHIMS under assets/src/ui -> forward to src/ui ----------
Write-Text (Join-Path $ProjectRoot "assets/src/ui/theme/tokens.ts") 'export * from "../../../../src/ui/theme/tokens";'

$shims = @(
  @{ rel="assets/src/ui/components/common/GlassCard.tsx";        target="../../../../../src/ui/components/common/GlassCard" },
  @{ rel="assets/src/ui/components/common/GradientButton.tsx";   target="../../../../../src/ui/components/common/GradientButton" },
  @{ rel="assets/src/ui/components/common/IconButton.tsx";       target="../../../../../src/ui/components/common/IconButton" },
  @{ rel="assets/src/ui/components/common/SectionHeader.tsx";    target="../../../../../src/ui/components/common/SectionHeader" },
  @{ rel="assets/src/ui/components/sheets/DoorStatusSheet.tsx";  target="../../../../../src/ui/components/sheets/DoorStatusSheet" },
  @{ rel="assets/src/ui/components/DoorCard.tsx";                target="../../../../../src/ui/components/DoorCard" },
  @{ rel="assets/src/ui/features/avatars/AvatarBuilder.tsx";     target="../../../../../src/ui/features/avatars/AvatarBuilder" },
  @{ rel="assets/src/ui/features/home/Minimap.tsx";              target="../../../../../src/ui/features/home/Minimap" },
  @{ rel="assets/src/ui/screens/HomeHallway.tsx";                target="../../../../../src/ui/screens/HomeHallway" }
)
foreach ($s in $shims) {
  $content = 'export { default } from "' + $s.target + '";'
  Write-Text (Join-Path $ProjectRoot $s.rel) $content
}

# ---------- 2) Provide assets the legacy paths are expecting ----------
$png1x1  = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9Ck2p9QAAAAASUVORK5CYII="
$jpg1x1  = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEBAQEA8QDw8QDw8QDw8QDw8QFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAXAAEAAwAAAAAAAAAAAAAAAAAAAgME/8QAFhABAQEAAAAAAAAAAAAAAAAAAQAC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9k="
$wavTiny = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAAAA="  # short WAV silence

# default avatar (assets/src/ui/components/AvatarBadge.tsx → ../../../assets/icons/default-avatar.png)
Write-B64 (Join-Path $ProjectRoot "assets/assets/icons/default-avatar.png") $png1x1

# beep.wav (assets/src/ui/index.ts → ../../assets/sounds/beep.wav)
Write-B64 (Join-Path $ProjectRoot "assets/assets/sounds/beep.wav") $wavTiny

# door images required by assets/src/ui/screens/HomeHallway.tsx → ../assets/doors/*
Write-B64 (Join-Path $ProjectRoot "assets/src/ui/assets/doors/B0.png") $png1x1
Write-B64 (Join-Path $ProjectRoot "assets/src/ui/assets/doors/door1.jpg") $jpg1x1
Ensure-Dir (Split-Path (Join-Path $ProjectRoot "assets/src/ui/assets/doors/door2.avif"))
)
Write-Host "Wrote assets/src/ui/assets/doors/door2.avif"

# backgrounds fallback (normalize to lowercase folder)
Write-B64 (Join-Path $ProjectRoot "assets/backgrounds/fallback-1x1.png") $png1x1
if (!(Test-Path (Join-Path $ProjectRoot "assets/Backgrounds/fallback-1x1.png"))) {
  Write-B64 (Join-Path $ProjectRoot "assets/Backgrounds/fallback-1x1.png") $png1x1
}

# ---------- 3) Normalize background registry in src/ui + patch src/lib/Backgrounds.ts ----------
$bgUi = Join-Path $ProjectRoot "src/ui/assets/backgrounds.ts"
if (Test-Path -LiteralPath $bgUi) {
  $bgUiContent = @"
export const BACKGROUNDS = {
  fallback: require("../../../assets/backgrounds/fallback-1x1.png"),
};
export type BackgroundKey = keyof typeof BACKGROUNDS;
"@
  Write-Text $bgUi $bgUiContent
}

$bgLib = Join-Path $ProjectRoot "src/lib/Backgrounds.ts"
if (Test-Path -LiteralPath $bgLib) {
  $bgLibContent = @"
export const BACKGROUNDS = {
  fallback: require("../assets/backgrounds/fallback-1x1.png"),
};
export type BackgroundKey = keyof typeof BACKGROUNDS;
"@
  Write-Text $bgLib $bgLibContent
}

Write-Host "`n✅ Shims + assets installed."
