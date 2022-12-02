const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  userId: String,
  nickname: String,
  postId: String,
  title: String,
  content: String,
  likes: Number,
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)