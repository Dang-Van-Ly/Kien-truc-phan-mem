require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { connectRabbitMQ, publishEvent } = require('../../shared/broker');
const { EVENTS } = require('../../shared/events');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 8081);
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

const users = [];
let channel;

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password là bắt buộc' });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: 'Email đã tồn tại' });
  }

  const user = { id: uuidv4(), name, email, password };
  users.push(user);

  await publishEvent(channel, EVENTS.USER_REGISTERED, {
    eventType: EVENTS.USER_REGISTERED,
    userId: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date().toISOString()
  });

  console.log(`[USER_REGISTERED] ${user.email}`);
  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  }

  return res.json({ id: user.id, name: user.name, email: user.email });
});

app.get('/users', (_, res) => {
  res.json(users.map(({ password, ...rest }) => rest));
});

async function start() {
  const rabbit = await connectRabbitMQ(RABBITMQ_URL);
  channel = rabbit.channel;

  app.listen(PORT, () => {
    console.log(`User Service running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('User Service failed to start:', error);
  process.exit(1);
});
