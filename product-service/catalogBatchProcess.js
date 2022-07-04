'use strict';

const { Client } = require('pg');
const AWS = require('aws-sdk');

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

module.exports.catalogBatchProcess = async (event) => {
  const client = new Client(dbOptions);
  const sns = new AWS.SNS({ region: 'eu-west-1' });
  await client.connect();
  let query = `insert into products (title, price, description) values`;

  //   for (const product of event.Records) {
  //     let result = product.body.replace('\ufeff', '');
  //     let { title, price, description } = JSON.parse(result);
  //     query += ` ('${title}', ${+price}, '${description}')`;
  //   }

  event.Records.forEach((product, index) => {
    let result = product.body.replace('\ufeff', '');
    let { title, price, description } = JSON.parse(result);
    query += ` ('${title}', ${+price}, '${description}')`;
    query += index === event.Records.length - 1 ? '' : ',';
  });
  console.log('wwwwwwwwwwwwwwwwwww', event.Records, query);
  try {
    await client.query(query);
    sns.publish(
      {
        Subject: 'Producta uploaded',
        Message: 'New products uploaded',
        TopicArn: process.env.SNS_ARN,
      },
      () => {
        console.log('Email send');
      }
    );
  } catch (err) {
    console.log('DB error!!!!: ', err);
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
    body: 'Catalog batch',
  };
};
