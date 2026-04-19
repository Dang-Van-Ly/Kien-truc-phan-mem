require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectRabbitMQ, publishEvent, setupConsumer } = require('../../shared/broker');
const { EVENTS } = require('../../shared/events');
const { createBooking, getBookings, updateBookingStatus } = require('./bookingStore');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 8083);
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

let channel;

app.post('/bookings', async (req, res) => {
  const { userId, userName, movieId, movieTitle, seatNumber } = req.body;
  if (!userId || !movieId || !seatNumber) {
    return res.status(400).json({ message: 'userId, movieId, seatNumber là bắt buộc' });
  }

  const booking = createBooking({ userId, userName, movieId, movieTitle, seatNumber });

  await publishEvent(channel, EVENTS.BOOKING_CREATED, {
    eventType: EVENTS.BOOKING_CREATED,
    bookingId: booking.id,
    userId: booking.userId,
    userName: booking.userName,
    movieId: booking.movieId,
    movieTitle: booking.movieTitle,
    seatNumber: booking.seatNumber,
    createdAt: booking.createdAt
  });

  console.log(`[BOOKING_CREATED] #${booking.id}`);
  return res.status(201).json(booking);
});

app.get('/bookings', (_, res) => {
  return res.json(getBookings());
});

async function start() {
  const rabbit = await connectRabbitMQ(RABBITMQ_URL);
  channel = rabbit.channel;

  await setupConsumer(
    channel,
    'booking.payment.results',
    [EVENTS.PAYMENT_COMPLETED, EVENTS.BOOKING_FAILED],
    async (event) => {
      if (event.eventType === EVENTS.PAYMENT_COMPLETED) {
        const updated = updateBookingStatus(event.bookingId, 'CONFIRMED');
        if (updated) console.log(`[BOOKING_UPDATED] #${event.bookingId} -> CONFIRMED`);
      }

      if (event.eventType === EVENTS.BOOKING_FAILED) {
        const updated = updateBookingStatus(event.bookingId, 'FAILED');
        if (updated) console.log(`[BOOKING_UPDATED] #${event.bookingId} -> FAILED`);
      }
    }
  );

  app.listen(PORT, () => {
    console.log(`Booking Service running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Booking Service failed to start:', error);
  process.exit(1);
});
