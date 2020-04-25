const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets.js');

module.exports = (req, res, next) => {
  // client sends token in headers.authorization
  const token = req.headers.authorization;

  // const token = req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, secrets.jwt_secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Request wasn't authenticated"});
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  } else {
    res.status(401).json({ message: "Request wasn't authenticated"});
  };
};