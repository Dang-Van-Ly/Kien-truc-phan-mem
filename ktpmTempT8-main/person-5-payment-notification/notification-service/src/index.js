require('dotenv').config();
const { connectRabbitMQ, setupConsumer } = require('../../shared/broker');
const { EVENTS } = require('../../shared/events');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

const eventLogs = [];

async function start() {
  const { channel } = await connectRabbitMQ(RABBITMQ_URL);

  await setupConsumer(
    channel,
    'notification.payment.completed',
    [EVENTS.PAYMENT_COMPLETED],
    async (event) => {
      const message = `Booking #${event.bookingId} thành công! User ${event.userName || event.userId} đã đặt đơn #${event.bookingId} thành công`;
      eventLogs.push({ type: EVENTS.PAYMENT_COMPLETED, message, at: new Date().toISOString() });
      console.log(`[NOTIFICATION] ${message}`);
    }
  );

  await setupConsumer(
    channel,
    'notification.booking.failed',
    [EVENTS.BOOKING_FAILED],
    async (event) => {
      const message = `Booking #${event.bookingId} thất bại. Lý do: ${event.reason || 'Unknown'}`;
      eventLogs.push({ type: EVENTS.BOOKING_FAILED, message, at: new Date().toISOString() });
      console.log(`[NOTIFICATION] ${message}`);
    }
  );

  console.log('Notification Service started and listening payment events');
}

start().catch((error) => {
  console.error('Notification Service failed to start:', error);
  process.exit(1);
});
