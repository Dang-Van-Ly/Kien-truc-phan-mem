# Team Run Guide (5 projects)

`team-projects` là **thư mục bọc (wrapper)** để chạy mô hình 5 máy/5 service.

## 0) Cập nhật đường dẫn mạng một chỗ (khuyên dùng)

1. Mở file `network.config.json`
2. Chỉnh IP/port theo LAN của nhóm
3. Chạy script để generate `.env` cho tất cả project:

```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects
.\apply-network-config.ps1
```

Sau bước này, mỗi người chỉ cần chạy project của mình.

## 1) Broker machine (chạy trước)
Tại thư mục `team-projects`:

```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects
docker compose up -d
```

RabbitMQ:
- AMQP: `amqp://<BROKER_IP>:5672`
- UI: `http://<BROKER_IP>:15672` (guest/guest)

## 2) Mapping 5 người

1. Người 1: `person-1-frontend-gateway`
2. Người 2: `person-2-user-service`
3. Người 3: `person-3-movie-service`
4. Người 4: `person-4-booking-service`
5. Người 5: `person-5-payment-notification`

> Mỗi người chạy trên **1 máy riêng** theo đúng IP đã khai báo trong `network.config.json`.

## 3) IP/Port chuẩn LAN

- Gateway: `192.168.x.x:8080`
- User: `192.168.x.x:8081`
- Movie: `192.168.x.x:8082`
- Booking: `192.168.x.x:8083`
- Payment: `192.168.x.x:8084`
- Frontend: `192.168.x.x:8085`
- RabbitMQ: `192.168.x.x:5672`

## 4) Kịch bản test demo

1. Register user qua frontend -> log `USER_REGISTERED` ở user-service
2. Tạo booking -> log `BOOKING_CREATED` ở booking-service
3. Payment xử lý random -> log `PAYMENT_COMPLETED` hoặc `BOOKING_FAILED`
4. Notification hiển thị kết quả booking thành công/thất bại

## 5) Ghi chú đồng bộ mã nguồn

Mỗi project là bản tách độc lập để demo nhanh. Nếu chỉnh business logic chung, team cần merge lại vào mono-repo chính `movie-ticket-system`.

## 6) Run command cho từng người

### Người 1
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-1-frontend-gateway
npm install
npm run install:all
npm run dev
```

### Người 2
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-2-user-service
npm install
npm run install:all
npm run dev
```

### Người 3
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-3-movie-service
npm install
npm run install:all
npm run dev
```

### Người 4
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-4-booking-service
npm install
npm run install:all
npm run dev
```

### Người 5
```powershell
cd d:\Code\kienTrucPhanMem\Tuan08\movie-ticket-system\team-projects\person-5-payment-notification
npm install
npm run install:all
npm run dev
```
