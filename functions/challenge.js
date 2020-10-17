const crypto = require('crypto');

exports.handler = async (event, context) => {
  const challenge = crypto.randomBytes(64).toString('base64');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: { challenge },
    }),
  };
};
