# Person 2 - User Service

## API
- `POST /register`
- `POST /login`

## Cập nhật mạng
- Copy `user-service/.env.example` -> `user-service/.env`
- Set `RABBITMQ_URL` trỏ về broker LAN.

## Chạy
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-2-user-service
npm install
npm run install:all
npm run dev
```

Service chạy tại port `8081`.
