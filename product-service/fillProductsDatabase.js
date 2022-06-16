'use strict';

const { Client } = require('pg');

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
};

module.exports.fillProductsDatabase = async () => {
  const client = new Client(dbOptions);
  await client.connect();
  let result;
  try {
    await client.query(`TRUNCATE TABLE products`);
    await client.query(`
      insert into products (title, price, description) values
      ('Gladiator Light', 1000, 'Gladiator Light description'),
      ('Gladiator Pro', 1800, 'Gladiator Pro description'),
      ('Gladiator Classic', 1400, 'Gladiator Classic description')`);
        result = await client.query(`select * from products`)
        console.log('------------',result);
  } catch (err) {
    console.log('DB error: ', err);
  } finally {
    client.end();
  }

  return {
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    statusCode: 200,
    body: result,
  };
};