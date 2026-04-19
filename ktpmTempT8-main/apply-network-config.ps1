param(
  [string]$ConfigPath = ".\network.config.json"
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$configFile = if ([System.IO.Path]::IsPathRooted($ConfigPath)) { $ConfigPath } else { Join-Path $root $ConfigPath }

if (-not (Test-Path $configFile)) {
  throw "Không tìm thấy config: $configFile"
}

$config = Get-Content -Raw -Path $configFile | ConvertFrom-Json

$rabbitUrl = "amqp://$($config.broker.username):$($config.broker.password)@$($config.ips.broker):$($config.ports.broker)"
$gatewayBase = "http://$($config.ips.gateway):$($config.ports.gateway)"

function Write-EnvFile {
  param(
    [string]$Path,
    [string[]]$Lines
  )

  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }

  $content = ($Lines -join "`r`n") + "`r`n"
  Set-Content -Path $Path -Value $content -Encoding UTF8
  Write-Host "Updated: $Path"
}

Write-EnvFile -Path (Join-Path $root "person-1-frontend-gateway\api-gateway\.env") -Lines @(
  "PORT=$($config.ports.gateway)",
  "USER_SERVICE_URL=http://$($config.ips.user):$($config.ports.user)",
  "MOVIE_SERVICE_URL=http://$($config.ips.movie):$($config.ports.movie)",
  "BOOKING_SERVICE_URL=http://$($config.ips.booking):$($config.ports.booking)"
)

Write-EnvFile -Path (Join-Path $root "person-1-frontend-gateway\frontend\.env") -Lines @(
  "VITE_GATEWAY_URL=$gatewayBase/api"
)

Write-EnvFile -Path (Join-Path $root "person-2-user-service\user-service\.env") -Lines @(
  "PORT=$($config.ports.user)",
  "RABBITMQ_URL=$rabbitUrl"
)

Write-EnvFile -Path (Join-Path $root "person-3-movie-service\movie-service\.env") -Lines @(
  "PORT=$($config.ports.movie)"
)

Write-EnvFile -Path (Join-Path $root "person-4-booking-service\booking-service\.env") -Lines @(
  "PORT=$($config.ports.booking)",
  "RABBITMQ_URL=$rabbitUrl"
)

Write-EnvFile -Path (Join-Path $root "person-5-payment-notification\payment-service\.env") -Lines @(
  "PORT=$($config.ports.payment)",
  "RABBITMQ_URL=$rabbitUrl"
)

Write-EnvFile -Path (Join-Path $root "person-5-payment-notification\notification-service\.env") -Lines @(
  "RABBITMQ_URL=$rabbitUrl"
)

Write-Host "Done. Tất cả .env cho 5 project đã được cập nhật từ network config." -ForegroundColor Green
