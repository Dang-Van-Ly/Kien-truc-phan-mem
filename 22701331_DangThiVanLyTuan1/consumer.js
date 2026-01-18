const amqp = require("amqplib");

const QUEUE = "demo.queue";

(async () => {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log("Waiting for messages...");
  channel.consume(QUEUE, (msg) => {
    console.log("Received:", msg.content.toString());
    channel.ack(msg);
  });
})();
