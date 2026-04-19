import { useEffect, useState } from 'react';
import { createBooking, createMovie, getBookings, getMovies, loginUser, registerUser } from './api';

export default function App() {
  const [auth, setAuth] = useState({ name: '', email: '', password: '' });
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingInput, setBookingInput] = useState({ movieId: '', seatNumber: '' });
  const [movieInput, setMovieInput] = useState({ title: '', genre: '', duration: 120, availableSeats: 30 });
  const [message, setMessage] = useState('');

  const refreshData = async () => {
    const [movieData, bookingData] = await Promise.all([getMovies(), getBookings()]);
    setMovies(movieData);
    setBookings(bookingData);
  };

  useEffect(() => {
    refreshData().catch((e) => setMessage(e.message));
  }, []);

  const onRegister = async () => {
    const data = await registerUser(auth);
    setUser(data);
    setMessage(`Đăng ký thành công: ${data.email}`);
  };

  const onLogin = async () => {
    const data = await loginUser({ email: auth.email, password: auth.password });
    setUser(data);
    setMessage(`Xin chào ${data.name}`);
  };

  const onCreateMovie = async () => {
    await createMovie(movieInput);
    setMessage('Thêm phim thành công');
    await refreshData();
  };

  const onCreateBooking = async () => {
    if (!user) return setMessage('Vui lòng login trước');
    const movie = movies.find((m) => m.id === Number(bookingInput.movieId));
    const booking = await createBooking({
      userId: user.id,
      userName: user.name,
      movieId: Number(bookingInput.movieId),
      movieTitle: movie?.title,
      seatNumber: bookingInput.seatNumber
    });
    setMessage(`Tạo booking #${booking.id}, chờ thanh toán...`);

    setTimeout(() => {
      refreshData().catch(() => null);
    }, 1200);
  };

  return (
    <main className="container">
      <h1>Movie Ticket System</h1>
      <p className="subtitle">Frontend chỉ gọi API Gateway</p>

      <section className="card">
        <h2>Login / Register</h2>
        <div className="row">
          <input placeholder="Name" value={auth.name} onChange={(e) => setAuth({ ...auth, name: e.target.value })} />
          <input placeholder="Email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} />
          <input placeholder="Password" type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} />
        </div>
        <div className="row">
          <button onClick={onRegister}>Register</button>
          <button onClick={onLogin}>Login</button>
        </div>
        {user && <p>Current user: {user.name} ({user.email})</p>}
      </section>

      <section className="card">
        <h2>Danh sách phim</h2>
        <ul>
          {movies.map((m) => (
            <li key={m.id}>#{m.id} - {m.title} | {m.genre} | {m.duration}m | seats: {m.availableSeats}</li>
          ))}
        </ul>
        <h3>Thêm phim</h3>
        <div className="row">
          <input placeholder="Title" value={movieInput.title} onChange={(e) => setMovieInput({ ...movieInput, title: e.target.value })} />
          <input placeholder="Genre" value={movieInput.genre} onChange={(e) => setMovieInput({ ...movieInput, genre: e.target.value })} />
          <input placeholder="Duration" type="number" value={movieInput.duration} onChange={(e) => setMovieInput({ ...movieInput, duration: Number(e.target.value) })} />
          <button onClick={onCreateMovie}>Add Movie</button>
        </div>
      </section>

      <section className="card">
        <h2>Đặt vé</h2>
        <div className="row">
          <input placeholder="Movie ID" type="number" value={bookingInput.movieId} onChange={(e) => setBookingInput({ ...bookingInput, movieId: e.target.value })} />
          <input placeholder="Seat Number" value={bookingInput.seatNumber} onChange={(e) => setBookingInput({ ...bookingInput, seatNumber: e.target.value })} />
          <button onClick={onCreateBooking}>Đặt vé</button>
        </div>
      </section>

      <section className="card">
        <h2>Bookings</h2>
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>#{b.id} - user {b.userName} - movie {b.movieTitle || b.movieId} - seat {b.seatNumber} - status: <b>{b.status}</b></li>
          ))}
        </ul>
      </section>

      {message && <p className="message">{message}</p>}
    </main>
  );
}
