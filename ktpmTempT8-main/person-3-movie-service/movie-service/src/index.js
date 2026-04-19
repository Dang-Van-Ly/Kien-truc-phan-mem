require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { nextId } = require('../../shared/storage');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 8082);

const movies = [
  { id: 1, title: 'Avengers: Endgame', duration: 181, genre: 'Action', availableSeats: 50 },
  { id: 2, title: 'Inception', duration: 148, genre: 'Sci-Fi', availableSeats: 40 }
];

app.get('/movies', (_, res) => {
  res.json(movies);
});

app.post('/movies', (req, res) => {
  const { title, duration, genre, availableSeats } = req.body;
  if (!title) return res.status(400).json({ message: 'title là bắt buộc' });

  const movie = {
    id: nextId(movies),
    title,
    duration: Number(duration || 120),
    genre: genre || 'Unknown',
    availableSeats: Number(availableSeats || 30)
  };

  movies.push(movie);
  return res.status(201).json(movie);
});

app.put('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);
  if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim' });

  const { title, duration, genre, availableSeats } = req.body;
  if (title) movie.title = title;
  if (duration !== undefined) movie.duration = Number(duration);
  if (genre) movie.genre = genre;
  if (availableSeats !== undefined) movie.availableSeats = Number(availableSeats);

  return res.json(movie);
});

app.listen(PORT, () => {
  console.log(`Movie Service running at http://localhost:${PORT}`);
});
