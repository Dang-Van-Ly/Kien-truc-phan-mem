const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const QUEUE = "demo.queue";

app.post("/send", async (req, res) => {
  const { message } = req.body;

  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });
  channel.sendToQueue(QUEUE, Buffer.from(message));

  res.send("Message sent!");
});

app.listen(3001, () => {
  console.log("Producer running on 3001");
});
