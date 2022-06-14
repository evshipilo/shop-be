'use strict';

const mockProductList = {
  products: [
    {
      title: 'GladiatorLight',
      id: 1,
      price: 1000,
      description: "GladiatorLight description"
    },
    {
      title: 'GladiatorPro',
      id: 2,
      price: 1800,
      description: "GladiatorPro description"
    },
    {
      title: 'GladiatorClassic',
      id: 3,
      price: 1400,
      description: "GladiatorClassic description"
    },
  ],
};

module.exports.getProductsList = async () => {
  return {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  },
    statusCode: 200,
    body: JSON.stringify(mockProductList),
  };
};

module.exports.getProductsById = async (event) => {
  const productId = JSON.stringify(
    `hello ${event.queryStringParameters.productId}`
  );
  return {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  },
    statusCode: 200,
    body: {
      productId,
    },
  };
};
