const express = require('express')
const User = require('../models/user')
const router = express.Router()

function check(x, y) {
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < y.length; j++) {
            if (y[j] === x[i]) {
                return true
            }
        }
    }
    return false
}

router.post("/signup", async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;

    if (!/[0-9]/g.test(nickname) || !/[a-z]/g.test(nickname) || !/[A-Z]/g.test(nickname)) {
        res.status(400).send({
            errorMessage: "Nickname must consist of at least 3 letters, uppercase and lowercase letters (a~z, A~Z), and numbers (0~9)",
        });
        return;
    }

    if (password.length < 4 || check(nickname, password)) {
        res.status(400).send({
            errorMessage: "The password must be at least 4 characters long, and does not contain the same value as the nickname",
        });
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "Confirm password does not match the password",
        });
        return;
    }

    const existNickname = await User.find({ nickname });

    if (existNickname.length && existNickname[0].isLogin===false) {
        res.status(400).send({
            errorMessage: "This is a duplicate nickname.",
        });
        return;
    }

    if (existNickname.length && existNickname[0].isLogin===true) {
        res.status(400).send({
            errorMessage: "You are already logged in",
        });
        return;
    }

    const maxUserId = await User.findOne().sort("-userId").exec();
  
    const userId = maxUserId ? maxUserId.userId + 1 : 1;
    const isLogin = true
    const user = new User({ userId, nickname, password, isLogin });
    await user.save();

    res.status(201).send({
        message: "Account is registered successfully",
    });
});

router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname, password }).exec();

    if (!user) {
        res.status(400).send({
            errorMessage: "There is no account with that nickname or password.",
        });
        return;
    }
    if (user.isLogin===true) {
        res.status(400).send({
            errorMessage: "You are already logged in",
        });
        return;
    }
    const isLogin = true
    await User.updateOne(
        { userId: user.userId },
        { $set: { isLogin } },
    )
    res.status(201).send({
        message: "Login is success",
    });
});

module.exports = router