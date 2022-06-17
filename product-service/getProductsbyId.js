'use strict';

module.exports.getProductsById = async (event) => {
    const productId = JSON.stringify(
      `hello ${event.queryStringParameters.productId}`
    );
    return {
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      statusCode: 200,
      body: {
        productId,
      },
    };
  };