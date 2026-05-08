Write-Host '测试中文测试'
$path = 'D:\gw\mygw\h24-tools\tools\test_write_cn.html'
$content = '<p>你好世界，中文测试</p>'
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host 'done'
