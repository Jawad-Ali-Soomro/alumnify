const jwt = require("jsonwebtoken");
const signToken = (data) => {
  const { JWT_SECRET } = process.env;

  return new Promise((resolve, reject) => {
    jwt.sign({data}, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
};

module.exports = signToken;
