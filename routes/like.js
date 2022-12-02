const express = require('express')
const Posts = require('../models/post')
const Likes = require('../models/like')
const Users = require('../models/user')
const router = express.Router()

router.put('/posts/:postId/like', async (req, res) => {
    const user = await Users.find({});
    if (user[0].isLogin === false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    const { postId } = req.params
    const like = await Likes.find({ postId, userId: user[0].userId })
    const post = await Posts.find({ postId })
    if (!post.length) {
        res.status(400).send({
            errorMessage: "There is no post.",
        });
        return;
    }
    if (like.isLiked === true) {
        const likes = post.likes - 1
        await Posts.updateOne(
            { postId: postId },
            { $set: { likes } },
        )
        await Likes.updateOne(
            { postId: postId, userId: user[0].id },
            { $set: { isLiked: false } },
        )
        return res.json({
            message: 'The like has been added',
        })
    }
    if (like.isLiked === false || like) {
        const likes = post.likes + 1
        await Posts.updateOne(
            { postId: postId },
            { $set: { likes } },
        )
        await Likes.updateOne(
            { postId: postId, userId: user[0].id },
            { $set: { isLiked: true } },
        )
        return res.json({
            message: 'The like has been added',
        })
    }
})

router.get('/posts/like', async (req, res) => {
    const user = await Users.find({});
    if (user[0].isLogin === false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    const likes = await Likes.find({ userId: user[0].userId })
    const posts = await Posts.find({}).sort({ likes: -1 })
    const data = []
    for (let i = 0; i < likes.length; i++) {
        for (let j = 0; j < posts.length; j++) {
            if (posts[j].postId === likes[i].postId) {
                data.push({
                    postId: posts[j].postId,
                    userId: posts[j].userId,
                    nickname: posts[j].nickname,
                    title: posts[j].title,
                    content: posts[j].content,
                    createdAt: posts[j].createdAt,
                    updatedAt: posts[j].updatedAt,
                    likes: posts[j].likes,
                })
            }
        }
    }
    return res.json({data})
})

module.exports = router