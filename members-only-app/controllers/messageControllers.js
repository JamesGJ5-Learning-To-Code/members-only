const Message = require("../models/message");

exports.messageCreateGet = (req, res, next) => {
    res.render("messageForm")
};

exports.messageCreatePost = (req, res, next) => {
    res.send("TODO: implement messageCreatePost");
};

exports.messageDeletePost = (req, res, next) => {
    res.send("TODO: implement messageDeletePost");
};
