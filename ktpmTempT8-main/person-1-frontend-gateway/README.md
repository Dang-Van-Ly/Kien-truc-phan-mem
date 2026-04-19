# Person 1 - Frontend + API Gateway

## Bạn chịu trách nhiệm
- `frontend` (React)
- `api-gateway` (route tất cả request từ frontend)

## Cập nhật mạng
- Copy `api-gateway/.env.example` -> `api-gateway/.env`
- Copy `frontend/.env.example` -> `frontend/.env`
- Điền IP thật của user/movie/booking/gateway.

## Chạy project của bạn
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-1-frontend-gateway
npm install
npm run install:all
npm run dev
```

- Gateway: `http://<GATEWAY_IP>:8080`
- Frontend: `http://<FRONTEND_IP>:8085`
