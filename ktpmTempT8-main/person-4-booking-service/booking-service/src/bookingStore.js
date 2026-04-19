const bookings = [];

function createBooking(payload) {
  const booking = {
    id: bookings.length + 1,
    userId: payload.userId,
    userName: payload.userName || 'Unknown User',
    movieId: payload.movieId,
    movieTitle: payload.movieTitle,
    seatNumber: payload.seatNumber,
    status: 'PENDING_PAYMENT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  bookings.push(booking);
  return booking;
}

function updateBookingStatus(id, status) {
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  return booking;
}

function getBookings() {
  return bookings;
}

module.exports = {
  createBooking,
  updateBookingStatus,
  getBookings
};
