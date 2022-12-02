const express = require('express')
const Posts = require('../models/post')
const Users = require('../models/user')
const router = express.Router()

router.post('/posts', async (req, res) => {
    const { title, content } = req.body
    const user = await Users.find({});
    if (user[0].isLogin === false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    const maxPostId = await Posts.findOne().sort("-postId").exec();
    const postId = maxPostId ? maxPostId.postId + 1 : 1;
    
    await Posts.create({
        userId: user[0].userId,
        nickname: user[0].nickname,
        postId,
        title,
        content,
        likes: 0,
    })
    return res.json({
        message: 'The post has been created',
    })
})
router.get('/posts', async (req, res) => {
    const posts = await Posts.find({}).sort({ createdAt: -1 })
    const data = []
    for (let i = 0; i < posts.length; i++) {
        data.push({
            postId: posts[i].postId,
            userId: posts[i].userId,
            nickname: posts[i].nickname,
            title: posts[i].title,
            createdAt: posts[i].createdAt,
            updatedAt: posts[i].updatedAt,
        })
    }
    res.json({
        data: data,
    })
})
router.get('/posts/:postsId', async (req, res) => {
    const { postsId } = req.params
    const post = await Posts.findById(postsId)
    const data = {
        postId: post.postId,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes,
    }
    res.json({
        data: data
    })
})
router.put('/posts/:postsId', async (req, res) => {
    const { postsId } = req.params
    const { title, content } = req.body
    const user = await Users.find({});
    if (user[0].isLogin===false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    await Posts.updateOne(
        { postId: postsId },
        { $set: { title, content } },
    )
    return res.json({
        message: 'The post has been edited',
    })
})
router.delete('/posts/:postsId', async (req, res) => {
    const { postsId } = req.params
    const user = await Users.find({});
    if (user[0].isLogin===false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    await Posts.deleteOne({ _id: postsId })
    return res.json({
        message: 'The post has been deleted',
    })
})
module.exports = router