const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  const { JWT_SECRET } = process.env;
  
  if (!JWT_SECRET) {
    return Promise.reject(new Error("JWT_SECRET is not defined"));
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => { 
      if (err) {
        return reject(err);
      }
      resolve(decoded); 
    });
  });
};

module.exports = verifyToken;