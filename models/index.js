const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect("mongodb://localhost/voyage", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

module.exports = connect;