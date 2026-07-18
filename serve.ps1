$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8000
$prefix = "http://localhost:$port/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Serveur actif sur $prefix"
Write-Host "Racine : $root"
Write-Host "Arret : Ctrl + C"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $path = $context.Request.Url.AbsolutePath.TrimStart("/")

        if ([string]::IsNullOrWhiteSpace($path)) {
            $path = "index.html"
        }

        $relativePath = $path -replace "/", "\"
        $file = Join-Path $root $relativePath

        if (Test-Path $file -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $context.Response.StatusCode = 200

            switch ([System.IO.Path]::GetExtension($file).ToLowerInvariant()) {
                ".html" { $context.Response.ContentType = "text/html; charset=utf-8" }
                ".css" { $context.Response.ContentType = "text/css; charset=utf-8" }
                ".js" { $context.Response.ContentType = "application/javascript; charset=utf-8" }
                ".png" { $context.Response.ContentType = "image/png" }
                ".jpg" { $context.Response.ContentType = "image/jpeg" }
                ".jpeg" { $context.Response.ContentType = "image/jpeg" }
                ".svg" { $context.Response.ContentType = "image/svg+xml; charset=utf-8" }
                ".ico" { $context.Response.ContentType = "image/x-icon" }
                default { $context.Response.ContentType = "application/octet-stream" }
            }

            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $message = [System.Text.Encoding]::UTF8.GetBytes("404 - Fichier introuvable")
            $context.Response.StatusCode = 404
            $context.Response.ContentType = "text/plain; charset=utf-8"
            $context.Response.ContentLength64 = $message.Length
            $context.Response.OutputStream.Write($message, 0, $message.Length)
        }

        $context.Response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
