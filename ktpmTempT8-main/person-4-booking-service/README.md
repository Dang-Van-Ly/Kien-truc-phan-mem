# Person 4 - Booking Service (Core)

## API
- `POST /bookings`
- `GET /bookings`

## Event
- Publish: `BOOKING_CREATED`
- Consume: `PAYMENT_COMPLETED`, `BOOKING_FAILED`

## Cập nhật mạng
- Copy `booking-service/.env.example` -> `booking-service/.env`
- Set `RABBITMQ_URL` về broker LAN.

## Chạy
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-4-booking-service
npm install
npm run install:all
npm run dev
```

Service chạy tại port `8083`.
