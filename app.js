const express = require("express");
const postRouter = require('./routes/posts')
const commentRouter = require('./routes/comments')
const userRouter = require('./routes/user')
const likeRouter = require('./routes/like')
const connect = require('./models');
connect()

const app = express();
const port = 8080;

app.use(express.json())

app.use("/api", [postRouter], [commentRouter], [userRouter], [likeRouter]);

app.listen(port, () => {
    console.log("Server is open with port", port);
});