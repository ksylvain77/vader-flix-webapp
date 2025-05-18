const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/services/auth");
const authService = require("../services/auth.service");

exports.signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body.username, req.body.email, req.body.password);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const result = await authService.signin(req.body.username, req.body.password);
    res.status(200).send(result);
  } catch (err) {
    if (err.message === "User Not found.") {
      res.status(404).send({ message: err.message });
    } else if (err.message === "Invalid Password!") {
      res.status(401).send({ accessToken: null, message: err.message });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};