const test = require('node:test');
const assert = require('node:assert/strict');
const { createBooking, updateBookingStatus, getBookings } = require('./bookingStore');

test('create booking and update status', () => {
  const booking = createBooking({
    userId: 'u-1',
    userName: 'User A',
    movieId: 1,
    movieTitle: 'Inception',
    seatNumber: 'A1'
  });

  assert.equal(booking.status, 'PENDING_PAYMENT');

  const updated = updateBookingStatus(booking.id, 'CONFIRMED');
  assert.equal(updated.status, 'CONFIRMED');

  const all = getBookings();
  assert.ok(all.find((b) => b.id === booking.id));
});
