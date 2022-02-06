const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlenght: 255,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }],
    dp: {
        type: String,
        default: "https://res.cloudinary.com/adarsh-cloud/image/upload/v1643650640/no_profile_dbo89l.png"
    },
    resetToken: String,
    expireToken: Date
})

module.exports = mongoose.model('User', userSchema)