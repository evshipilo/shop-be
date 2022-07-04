'use strict';
const AWS = require('aws-sdk');
const csv = require('csv-parser');
const BUCKET = 'evshipilo-import';

module.exports.importFileParser = async (event) => {
  console.log('START!!!');
  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const sqs = new AWS.SQS({ region: 'eu-west-1' });

  let status = 200;

  let messageData = [];

  try {
    for (const record of event.Records) {
      console.log('RECORD!!!', record);
      const s3Stream = s3
        .getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key,
        })
        .createReadStream();
      await new Promise((resolve, reject) => {
        console.log('Promise!!!', s3Stream);

        s3Stream
          .pipe(csv())
          .on('data', (data) => {
            messageData= [...messageData, data]
            console.log('DATA!!!!!!!!!!!!:', data);
          })
          .on('error', (error) => {
            status = 500;
            console.log('error!!!!!!!!!!!', error);
            reject('ERROR!!!!!!!!!: ' + error);
          })
          .on('end', () => {
            console.log('parsed!!!!!!!!!!!');
            resolve('parsed!');
          });
      });
    }
  } catch (error) {
    console.log('CATCH!!', error);
    status = 500;
  }

  for(const message of messageData){
    let res = await sqs
    .sendMessage({
      QueueUrl:
        'https://sqs.eu-west-1.amazonaws.com/883121371508/catalogItemsQueue',
      MessageBody: JSON.stringify(message),
    })
    .promise();
  console.log('SENDED!!!', res);
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': '*',
    },
    statusCode: status,
  };
};
