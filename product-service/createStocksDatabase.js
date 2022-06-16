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

module.exports.createStocksDatabase = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    await client.query(`
      create table if not exists stocks(
      product_id uuid,
      count integer,
      foreign key ("product_id") references "products" ("id")
    )`);
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
    body: 'DONE',
  };
};
