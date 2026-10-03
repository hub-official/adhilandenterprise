# Import semua database MySQL dari folder ini
$mysql = (Get-Command mysql -ErrorAction SilentlyContinue)
if (-not $mysql) { Write-Error "mysql CLI tidak ditemukan di PATH"; exit 1 }
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Get-ChildItem (Join-Path $root "mysql") -Filter *.sql | Sort-Object Name | ForEach-Object {
  Write-Host "Import $($_.Name) ..." -ForegroundColor Cyan
  & mysql --default-character-set=utf8mb4 -u root -p < $_.FullName
  if ($LASTEXITCODE -ne 0) { Write-Error "Gagal import $($_.Name)"; exit 1 }
}
Write-Host "Selesai." -ForegroundColor Green