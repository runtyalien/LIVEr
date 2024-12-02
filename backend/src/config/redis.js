const Redis = require('redis');
const { promisify } = require('util');

const client = Redis.createClient(process.env.REDIS_URL);

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Error', err));

module.exports = {
  client,
  getAsync,
  setAsync
};