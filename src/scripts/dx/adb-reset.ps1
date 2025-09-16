$ADB = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
If (-Not (Test-Path $ADB)) { Write-Error 'adb not found' }
Remove-Item -Force "$HOME\.android\adbkey","$HOME\.android\adbkey.pub" -ErrorAction SilentlyContinue
& $ADB kill-server; & $ADB start-server; & $ADB devices -l