const express = require('express')
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/keys')
const User = require('./models/user')
const Post = require('./models/post')
const auth = require('./routes/auth')
const post = require('./routes/post')
const user = require('./routes/user')
const PORT = process.env.PORT || 5000

const app = express()

mongoose.connect(MONGOURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect MongoDB", err))

app.use(express.json())
app.use(auth)
app.use(post)
app.use(user)

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => { console.log(`Running on port ${PORT}`) })
