$ErrorActionPreference = 'Stop'
$SDK = "$env:LOCALAPPDATA\Android\Sdk"
$Emu = Join-Path $SDK 'emulator\emulator.exe'
$AVD = 'Pixel_6a_API_34'


if (-Not (Test-Path $Emu)) { Write-Error 'Emulator not found. Install Android SDK.' }


# Force ANGLE for stability on older GPUs
$cfgPath = Join-Path $HOME ".android\avd\$AVD.avd\config.ini"
if (Test-Path $cfgPath) {
(Get-Content $cfgPath) `
-replace '^(hw\.gpu\.enabled)=.*', '$1=yes' `
-replace '^(hw\.gpu\.mode)=.*', '$1=angle_indirect' |
Set-Content $cfgPath
}


& $Emu -avd $AVD -gpu angle_indirect -no-snapshot