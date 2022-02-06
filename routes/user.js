const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')
const Post = require('../models/post')
const User = require('../models/user')

router.get('/profile/:id', requireLogin, (req, res) => {
    User.findById(req.params.id)
        .select("-password")
        .then((user) => {
            Post.find({ postedBy: req.params.id })
                .exec((error, posts) => {
                    if (error) { return res.status(422).json({ error }) }
                    res.json({ user, posts })
                })
        })
        .catch(err => { res.status(404).json({ error: "User Does not exists!" }) })
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    },
        { new: true }, (error, result) => { if (error) { return res.status(422).json({ error }) } }
    )

    User.findByIdAndUpdate(req.user._id, {
        $push: { following: req.body.followId }
    },
        { new: true })
        .select("-password")
        .then(result => res.json(result))
        .catch(error => { res.status(422).json({ error }) })
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    },
        { new: true }, (error, result) => { if (error) { return res.status(422).json({ error }) } }
    )

    User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.body.unfollowId }
    },
        { new: true })
        .select("-password")
        .then(result => res.json(result))
        .catch(error => { res.status(422).json({ error }) })
})

router.post('/dpupdate', requireLogin, (req, res) => {
    const { dp } = req.body;
    if (!dp) {
        return res.status(422).json({ error: "Please upload a picture" })
    }

    User.findByIdAndUpdate(req.user._id, {
        $set: { dp }
    }, { new: true })
        .select("-password")
        .then(result => res.json(result))
        .catch(error => { res.status(500).json(error) })
})

router.post('/search-users', (req, res) => {
    let userPattern = new RegExp("^" + req.body.query, 'i')
    User.find({ name: { $regex: userPattern } })
        .select("_id email name")
        .then(user => { res.json({ user }) })
        .catch(err => { res.status(404) })
})

module.exports = router