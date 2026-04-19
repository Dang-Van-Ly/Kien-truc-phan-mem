# Person 5 - Payment + Notification

## Payment
- Consume: `BOOKING_CREATED`
- Publish: `PAYMENT_COMPLETED` hoặc `BOOKING_FAILED`
- Health: `http://<PAYMENT_IP>:8084/health`

## Notification
- Consume `PAYMENT_COMPLETED`, `BOOKING_FAILED`
- Log kết quả booking

## Cập nhật mạng
- Copy các file `.env.example` của 2 service thành `.env`
- Set cùng `RABBITMQ_URL` trỏ về broker LAN.

## Chạy
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-5-payment-notification
npm install
npm run install:all
npm run dev
```
