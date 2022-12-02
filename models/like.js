const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    userId: String,
    postId: String,
    isLiked: Boolean,
})

module.exports = mongoose.model('Like', likeSchema)