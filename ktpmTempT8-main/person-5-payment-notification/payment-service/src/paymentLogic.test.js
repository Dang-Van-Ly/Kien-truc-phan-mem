const test = require('node:test');
const assert = require('node:assert/strict');
const { processPayment } = require('./paymentLogic');
const { EVENTS } = require('../../shared/events');

test('processPayment returns expected event type', () => {
  const result = processPayment({
    bookingId: 123,
    userId: 'u-1',
    userName: 'User A',
    movieId: 1,
    movieTitle: 'Inception',
    seatNumber: 'A1'
  });

  assert.ok([EVENTS.PAYMENT_COMPLETED, EVENTS.BOOKING_FAILED].includes(result.eventType));
  assert.equal(result.bookingId, 123);
});
