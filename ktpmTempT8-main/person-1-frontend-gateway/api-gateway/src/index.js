require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 8080);

const targets = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:8081',
  movie: process.env.MOVIE_SERVICE_URL || 'http://localhost:8082',
  booking: process.env.BOOKING_SERVICE_URL || 'http://localhost:8083'
};

app.use('/api/users', createProxyMiddleware({
  target: targets.user,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/movies', createProxyMiddleware({
  target: targets.movie,
  changeOrigin: true,
  pathRewrite: { '^/api/movies': '/movies' }
}));

app.use('/api/bookings', createProxyMiddleware({
  target: targets.booking,
  changeOrigin: true,
  pathRewrite: { '^/api/bookings': '/bookings' }
}));

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
