const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/services/auth");

async function signup(username, email, password) {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({ username, email, password: hashedPassword });
    return { message: "User registered successfully!" };
}

async function signin(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error("User Not found.");

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) throw new Error("Invalid Password!");

    const token = jwt.sign({ id: user.id }, authConfig.jwtSecret, {
        expiresIn: authConfig.tokenExpiration
    });

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token
    };
}

module.exports = { signup, signin }; 