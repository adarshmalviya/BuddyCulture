const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/user')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middlewares/requireLogin')
const { JWT_SECRET } = require('../config/keys')
const nodemailer = require('nodemailer')
const { GMAIL_U, GMAIL_P, EMAIL, API_KEY } = require('../config/keys')

// Forget Password Section
const sendgridTransport = require('nodemailer-sendgrid-transport')
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: API_KEY
    }
}));

router.post('/signin', async (req, res) => {
    const { error } = validateUserSignIn(req.body);
    if (error) { return res.status(400).json({ error: error.details[0].message }) };

    let { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: 'User does not exists.' });

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) { return res.status(422).json({ error: "Invalid Email or Password!" }) }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET)
    let { _id, name, followers, following, dp } = user

    res.json({ message: "Loged In Successfully", token: token, user: { _id, name, email, followers, following, dp } });

})

router.post('/signup', async (req, res) => {
    // Validation
    const { error } = validateUserSignUp(req.body);
    if (error) { return res.status(400).json({ error: error.details[0].message }) };

    // Find if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) { return res.status(403).json({ error: "User already exists!" }) };

    // Creating User
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dp: "https://res.cloudinary.com/adarsh-cloud/image/upload/v1643650640/no_profile_dbo89l.png"
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //Sending Mail
    transporter.sendMail({
        from: GMAIL_U,
        to: req.body.email,
        subject: "Registered Successfully!",
        html: "<h1>Welcome to BuddyCulture!</h1> <h3>We hope you enjoy our services! 😄</h3>"
    })

    user.save()
        .then(() => { mailUser(); res.json({ message: "User Registered Successfully" }) })
        .catch((err) => { res.status(400).json({ err: err }) });

})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) { console.log(err) }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) { return res.status(404).json({ error: "User does not exists!" }) }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000

                user.save()
                    .then((result) => {
                        transporter.sendMail({
                            to: user.email,
                            from: GMAIL_U,
                            subject: "Password Reset Link",
                            html: `<h2>On your request here is the password Reset Link</h2>
                            <h3>Link is valid for 1 hour</h3>
                            <h5>Click <a href="${EMAIL}/reset/${token}">here</a> to reset the password</h5>`

                        })
                        return res.json({ message: "Reset link send successfully" })
                    })
                    .catch((error) => { return res.status(500) })
            })

    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    // Validation
    const { error } = validatePassword(req.body);
    if (error) { return res.status(400).json({ error: error.details[0].message }) };

    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(async (user) => {
            if (!user) { return res.status(422).json({ error: "Session Expired! Please Try Again" }) }

            const salt = await bcrypt.genSalt(10);
            bcrypt.hash(newPassword, salt)
                .then(hashedPassword => {
                    user.password = hashedPassword
                    user.resetToken = undefined
                    user.expireToken = undefined

                    user.save()
                        .then(savedUser => { res.json({ message: "Password Changed Successfully!" }) })
                })
                .catch(error => { res.status(500).json({ error }) })
        })

})

function validatePassword(req) {
    const schema = {
        password: Joi.string().min(5).max(255).required(),
        token: Joi.required()
    }
    return Joi.validate(req, schema);
}

function validateUserSignUp(req) {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}

function validateUserSignIn(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;
