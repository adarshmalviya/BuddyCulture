const express = require('express')
const Post = require('../models/post')
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate('postedBy', '_id name dp')
        .populate('comments.postedBy', '_id name dp')
        .sort('-createdAt')
        .then((posts) => { res.json({ posts }) })
        .catch((err) => { res.status(500).json({ err }) })
})
router.get('/getsubpost', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate('postedBy', '_id name dp')
        .populate('comments.postedBy', '_id name dp')
        .sort('-createdAt')
        .then((posts) => { res.json({ posts }) })
        .catch((err) => { res.status(500).json({ err }) })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please fill all the details" })
    }

    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user._id
    })

    post.save()
        .then((result) => { res.json({ post: result }) })
        .catch((err) => { res.status(500).json({ error: err }) });

})

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate('postedBy', 'name email dp')
        .populate('comments.postedBy', '_id name dp')
        .sort('-createdAt')
        .then(myposts => { res.json({ mypost: myposts }) })
        .catch((err) => res.status(500).json({ err: err }))
})
router.get('/post/:id', (req, res) => {
    Post.findById(req.params.id)
        .populate('postedBy', 'name email dp')
        .populate('comments.postedBy', '_id name dp')
        .then(post => { res.json({ post }) })
        .catch((err) => res.status(500).json({ err: err }))
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
        .populate('postedBy', '_id name dp')
        .populate("comments.postedBy", "_id name dp")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
        .populate('postedBy', '_id name dp')
        .populate("comments.postedBy", "_id name dp")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put('/comment', requireLogin, (req, res) => {
    if (!req.body.text) { return res.status(422) }
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, { new: true })
        .populate('postedBy', '_id name dp')
        .populate("comments.postedBy", "_id name dp")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findByIdAndDelete(req.params.postId)
        .then(result => res.json(result))
        .catch((err) => { res.status(422).json({ error: err }) })
})

router.delete('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("comments.postedBy", "_id name dp")
        .exec((err, post) => {
            if (err || !post) { return res.status(422).json({ error: err }) }
            new_comments = post.comments.filter((comment) => comment._id.equals(req.params.commentId) ? null : comment)
            post.comments = new_comments
            post.save()
            res.json(new_comments)
        })
})

module.exports = router;
