const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");
const {toTitleCase} = require("../util/util");

const Message = require("../models/message")
const User = require("../models/user");

// profile_
exports.profile_detail = asyncHandler(async (req, res, next) => {
    const messages = await Message.find({author: req.params.id}).populate("author").exec(); 
    const user = await User.findById(req.params.id).exec();


    res.render("pages/profile/profile_detail", {
        title: "User Profile",
        messages: messages,
        user: user,
    })
})

// update get
exports.profile_update_get = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).exec(); 

    console.log(user.id, res.locals.currentUser.id)

    if (user.id != res.locals.currentUser.id) {
        const error = new Error("You cannot edit a strangers profile but I commend you for trying.")
        error.status = 401 
        next(error);
    }


    if (user === null) {
        const error = new Error("Couldn't seem to find that profile at the moment.")
        error.status = 404 
        next(error);
    }

    res.render("pages/profile/profile_form", {
        title: "Update User",
        user: user
    }) 
})
// update post 
exports.profile_update_post = [
    body("firstName")
        .trim()
        .bail()
        .notEmpty()
        .withMessage("First name must be specified.")
        .bail()
        .isLength({min: 2})
        .withMessage("First Name must be more than 2 characters.")
        .customSanitizer(toTitleCase)
        .escape(),
    body("lastName") 
        .trim()
        .bail()
        .notEmpty()
        .withMessage("Last name must be specified.")
        .bail()
        .isLength({min: 2})
        .withMessage("Last Name must be more than 2 characters.")
        .customSanitizer(toTitleCase)
        .escape(),
    body("email", "Email must be valid.")
        .trim() 
        .isEmail()
        .escape(),
    body("username", "Username must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const newuser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            admin: req.body.admin,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            const user = await User.findById(req.params.id).exec(); 

            res.render("pages/profile/profile_form", {
                title: "Update User",
                user: user,
                errors: errors.array(), 
            }) 

            return; 
        } else {
            await User.findByIdAndUpdate(req.params.id, newuser, {})
            res.redirect("/profile");
        }
    })
]

// delete get 
exports.profile_delete_get = asyncHandler(async(req, res, next) => {
    const [user, messages] = await Promise.all([
        await User.findById(req.params.id).exec(),
        await Message.find({author: req.params.id}).exec(),
    ])

    if (user === null) {
        const error = new Error("That user could not be found");
        error.status = 500;
        next(error);
    } else if (req.params.id != res.locals.currentUser.id) {
        const error = new Error("You cannot delete other users profiles. You thought you were slick.")
        error.status = 404 
        next(error)
    }

    res.render("pages/profile/profile_delete", {
        title: "Delete User",
        user: user, 
        messages: messages
    })
}) 
// delete post
exports.profile_delete_post = asyncHandler(async (req, res, next) => {
    const [user, messages] = await Promise.all([
        User.findById(req.body.userid).exec(),
        Message.find({author: req.body.userid}).exec(),
    ])

    if (user === null) {
        const error = new Error("Was not able to delete that user");
        error.status = 500;
        next(error);
    } 

    // delete messages 
    for (const message of messages) {
        await Message.findByIdAndDelete(message._id).exec();
    }

    req.logout(async (err) => {
        if (err) {
            return next(err)
        }
        await User.findByIdAndDelete(req.body.userid);
        res.redirect("/");
    })
})




// SEARCH BAR IN NAV
// no implemented, will probably skip this
exports.search_get = asyncHandler(async (req, res, next) => {
    const user = await User.find({username: req.query.q})
        .select("username firstname url")
        .exec(); 

    console.log("USER:", user, "Q", req.query.q, "URL", user[0].url)
    res.redirect(user[0].url)
    // res.json({users: user}); 
})


