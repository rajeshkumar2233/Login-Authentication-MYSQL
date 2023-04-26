const jwt = require('jsonwebtoken');

// Secret key used to sign the JWT
const secret = 'cito_cabs';


const generateToken = (user) => {
  // Generate the token with the user's ID as the payload
  const token = jwt.sign({ userId: user.id }, secret);
  return token;
};


const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    // Verify the token using the secret key
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        // Extract the user ID from the token payload
        const userId = decoded.userId;
        resolve(userId);
      }
    });
  });
};

module.exports = {
  generateToken,
  verifyToken
};
