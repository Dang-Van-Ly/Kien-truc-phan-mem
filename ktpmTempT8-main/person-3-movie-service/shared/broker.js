const amqp = require('amqplib');

const EXCHANGE = 'movie.ticket.events';

async function connectRabbitMQ(url) {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  return { conn, channel };
}

async function publishEvent(channel, routingKey, payload) {
  channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
    contentType: 'application/json'
  });
}

async function setupConsumer(channel, queueName, routingKeys, handler, options = {}) {
  const { deadLetterExchange, deadLetterRoutingKey } = options;

  const queueOptions = { durable: true };
  if (deadLetterExchange) {
    queueOptions.arguments = {
      'x-dead-letter-exchange': deadLetterExchange,
      'x-dead-letter-routing-key': deadLetterRoutingKey || `${queueName}.dlq`
    };
  }

  await channel.assertQueue(queueName, queueOptions);
  for (const key of routingKeys) {
    await channel.bindQueue(queueName, EXCHANGE, key);
  }

  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      await handler(payload, msg);
      channel.ack(msg);
    } catch (error) {
      console.error(`[${queueName}] consumer error:`, error.message);
      channel.nack(msg, false, false);
    }
  });
}

module.exports = {
  EXCHANGE,
  connectRabbitMQ,
  publishEvent,
  setupConsumer
};
