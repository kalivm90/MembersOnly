const asyncHandler = require("express-async-handler")

const Message = require("../models/message")
const User = require("../models/user")

exports.index = asyncHandler(async (req, res, next) => {
    const messages = await Message.find().populate("author", "username admin timestamp").exec();


    res.render("index", {
        title: "Messages",
        messages: messages,
    })
})


exports.createMessage = asyncHandler(async (req, res, next) => {
    res.send("TODO CREATE MESSAGE GET");
})