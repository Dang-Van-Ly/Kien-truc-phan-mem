const { EVENTS } = require('../../shared/events');

function processPayment(bookingEvent) {
  const ok = Math.random() >= 0.3;
  return {
    eventType: ok ? EVENTS.PAYMENT_COMPLETED : EVENTS.BOOKING_FAILED,
    bookingId: bookingEvent.bookingId,
    userId: bookingEvent.userId,
    userName: bookingEvent.userName,
    movieId: bookingEvent.movieId,
    movieTitle: bookingEvent.movieTitle,
    seatNumber: bookingEvent.seatNumber,
    processedAt: new Date().toISOString(),
    reason: ok ? undefined : 'Payment gateway declined'
  };
}

module.exports = { processPayment };
