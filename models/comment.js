const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  commentId: String,
  userId: String,
  postId: String,
  nickname: String,
  comment: String,
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)