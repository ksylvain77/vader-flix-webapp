const jwt = require("jsonwebtoken");
const authConfig = require("../config/services/auth");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers.authorization;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  // Remove Bearer from string if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, authConfig.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  const db = require("../models");
  const User = db.users;

  User.findByPk(req.userId).then(user => {
    if (user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Admin Role!"
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;