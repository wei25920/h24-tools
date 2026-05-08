$text = [System.IO.File]::ReadAllText('D:\gw\mygw\h24-tools\tools\test_write_cn.html', [System.Text.Encoding]::UTF8)
Write-Host "Content: $text"
Write-Host "---"
if ($text.Contains([char]0xFFFD)) {
    Write-Host 'CORRUPTED - contains replacement chars'
} else {
    Write-Host 'OK - no replacement chars'
}
