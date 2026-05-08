$bytes = [System.IO.File]::ReadAllBytes('D:\gw\mygw\h24-tools\tools\test_write_cn.html')
$hex = ($bytes | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
Write-Host "Bytes ($($bytes.Length)): $hex"
