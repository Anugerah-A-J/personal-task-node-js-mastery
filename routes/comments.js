const express = require('express')
const Comments = require('../models/comment')
const Users = require('../models/user')
const router = express.Router()

router.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params
    const comments = await Comments.find({}).sort({ createdAt: -1 })
    const data = []
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].postId === postId) {
            data.push({
                commentId: comments[i].commentId,
                userId: comments[i].userId,
                nickname: comments[i].nickname,
                comment: comments[i].comment,
                createdAt: comments[i].createdAt,
                updatedAt: comments[i].updatedAt,
            })
        }
    }
    res.json({
        data: data,
    })
})
router.post('/comments/:postId/', async (req, res) => {
    const { postId } = req.params
    const { comment } = req.body
    const user = await Users.find({});
    if (user[0].isLogin === false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    const maxCommentId = await Comments.findOne().sort("-commentId").exec();
    const commentId = maxCommentId ? maxCommentId.commentId + 1 : 1;
    await Comments.create({
        commentId,
        postId,
        userId: user[0].userId,
        comment,
        nickname: user[0].nickname
    })
    return res.json({
        message: 'The comment has been created',
    })
})
router.delete('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params
    const user = await Users.find({});
    if (user[0].isLogin === false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    await Comments.deleteOne({ _id: commentId })
    return res.json({
        message: 'The comment has been deleted',
    })
})
router.put('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params
    const { comment } = req.body
    const user = await Users.find({});
    if (user[0].isLogin === false) {
        res.status(400).send({
            errorMessage: "Login is required.",
        });
        return;
    }
    await Comments.updateOne(
        { _id: commentId },
        { $set: { comment } },
    )
    return res.json({
        message: 'The comment has been edited',
    })
})
module.exports = router