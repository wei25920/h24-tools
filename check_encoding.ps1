$path = "D:\gw\mygw\h24-tools\tools"
$files = @("qrcode.html", "password.html", "json.html", "base64.html", "urlcode.html", "timestamp.html", "wordcount.html", "color.html", "regex.html", "diff.html")

foreach ($f in $files) {
    $fp = Join-Path $path $f
    $bytes = [System.IO.File]::ReadAllBytes($fp)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    if ($text.Contains([char]0xFFFD)) {
        Write-Host "$f : CORRUPTED (contains replacement chars)"
    } else {
        Write-Host "$f : OK"
    }
}
