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

module.exports.fillStocksDatabase = async () => {
  const client = new Client(dbOptions);
  await client.connect();
  let result;
  try {
    await client.query(`TRUNCATE TABLE stocks`);
    await client.query(`
      insert into stocks (product_id, count) values
      ('a7be1cf3-744b-4759-a1ad-e7cbc7b1b9aa', 25),
      ('fcddb5c2-88dd-45cb-a037-05b909876442', 15),
      ('c9eb5e2a-b865-4e51-93b6-782704b42adf', 2)`);
        result = await client.query(`select * from stocks`)
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