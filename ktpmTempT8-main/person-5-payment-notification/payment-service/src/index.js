require('dotenv').config();
const http = require('node:http');
const { connectRabbitMQ, publishEvent, setupConsumer } = require('../../shared/broker');
const { EVENTS } = require('../../shared/events');
const { processPayment } = require('./paymentLogic');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const PORT = Number(process.env.PORT || 8084);

async function start() {
  const { channel } = await connectRabbitMQ(RABBITMQ_URL);

  await setupConsumer(
    channel,
    'payment.booking.created',
    [EVENTS.BOOKING_CREATED],
    async (event) => {
      const paymentResult = processPayment(event);
      await publishEvent(channel, paymentResult.eventType, paymentResult);

      console.log(
        `[PAYMENT] booking #${event.bookingId} -> ${paymentResult.eventType}`
      );
    },
    {
      deadLetterExchange: 'movie.ticket.events.dlx',
      deadLetterRoutingKey: 'payment.booking.created.dlq'
    }
  );

  await channel.assertExchange('movie.ticket.events.dlx', 'direct', { durable: true });
  await channel.assertQueue('payment.booking.created.dlq', { durable: true });
  await channel.bindQueue('payment.booking.created.dlq', 'movie.ticket.events.dlx', 'payment.booking.created.dlq');

  console.log('Payment Service started and listening BOOKING_CREATED events');

  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'payment-service' }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  });

  server.listen(PORT, () => {
    console.log(`Payment Service health endpoint at http://localhost:${PORT}/health`);
  });
}

start().catch((error) => {
  console.error('Payment Service failed to start:', error);
  process.exit(1);
});
