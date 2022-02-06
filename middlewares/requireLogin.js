const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const User = require("../models/user");

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) { return res.status(400).json({ error: "Access Denied. No token Provided" }) }

    try {
        let payload = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(payload._id);
        req.user = user;
        next()
    }
    catch (err) {
        res.status(400).json({ error: "Invalid Token" })
    }
}