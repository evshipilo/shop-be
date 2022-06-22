'use strict';
const AWS = require('aws-sdk');
const BUCKET = 'evshipilo-import';

module.exports.importProductsFile = async (event) => {
  const s3 = new AWS.S3({ region: 'eu-west-1' });

  const signedUrl = await s3.getSignedUrl('putObject', {
    Bucket: BUCKET,
    Key: `uploaded/${event.queryStringParameters.name}`,
    Expires: 60,
    ContentType: 'text/csv',
  });

  return {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': '*' },
    statusCode: 200,
    body: signedUrl
  };
};
