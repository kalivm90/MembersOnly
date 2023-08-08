const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");

const Message = require("../models/message")
const User = require("../models/user");

exports.message_detail = asyncHandler(async (req, res, next) => {
    const messages = await Message.find().populate("author", "username admin timestamp").exec();

    res.render("pages/messages/message_detail", {
        title: "Messages",
        messages: messages,
    })
})


exports.create_get = asyncHandler(async (req, res, next) => {
    res.render("pages/messages/message_create", {
        title: "Create Message", 
    })
})
exports.create_post = [
    body("title")
        .trim()
        .bail()
        .notEmpty()
        .withMessage("Title must be specified")
        .bail()
        .isLength({max: 100})
        .withMessage("Character count limited to 100")
        .escape(),
    body("message")
        .trim()
        .bail()
        .notEmpty()
        .withMessage("Message must be specified")
        .bail()
        .isLength({max: 250})
        .withMessage("Character count limited to 250")
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req) 

        if (!errors.isEmpty()) {
            res.render("pages/messages/message_create", {
                title: "Create Message", 
                errors: errors.array(),
            })
            return 
        } else {

            const newmessage = new Message({
                title: req.body.title,
                message: req.body.message,
                author: req.body.author,
            })

            await newmessage.save();
            res.redirect("/"); 
        }
    })
]


exports.delete_post = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.body.messageid).exec();

    if (message === null) {
        const error = new Error("Failed to delete that message")
        error.status = 404 
        next(error)
    } else {
        await Message.findByIdAndDelete(req.body.messageid)
        res.redirect("/")
    }
    

})