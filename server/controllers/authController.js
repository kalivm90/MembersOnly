const asyncHandler = require("express-async-handler")
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const util = require("util")
const {toTitleCase} = require("../util/util");

require("dotenv").config();

const User = require("../models/user");
const passport = require("passport");
const hashAsync = util.promisify(bcrypt.hash)

// index (if user goes to /auth they get redirected to /)
exports.index = (req, res) => {
    res.redirect("/");
}

// signup
exports.signup_get = asyncHandler(async (req, res, next) => {
    const adminPassword = process.env.ADMIN_SECRET_WORD
    
    res.render("pages/auth/signUp", {
        title: "Sign Up",
        adminPassword: adminPassword,
    })
});

exports.signup_post = [
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
    body("password", "Password must be at least 6 characters")
        .trim()
        .isLength({min: 6})
        .escape(),
    body("confirmPassword").custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match")
        }
        return true 
    }).trim().escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        
        const hashedPassword = await hashAsync(req.body.password, 10);

        const newuser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            admin: req.body.admin,
        })

        if (!errors.isEmpty()) {
            const adminPassword = process.env.ADMIN_SECRET_WORD

            res.render("pages/auth/signUp", {
                title: "Sign Up",
                user: newuser,
                adminPassword: adminPassword,
                errors: errors.array(),
            })
            return 
        } else {
            await newuser.save();

            // automatically login user after signup
            req.login(newuser, (err) => {
                if (err) {
                    // if error send error=autologin to alert user to manually login 
                    res.redirect("/login?error=autologin")
                }
                res.redirect("/")
            })
        }
    })
]


// check username util endpoint for live username checking
exports.checkusername = asyncHandler(async (req, res, next) => {
    const bodyUsername = req.body;

    try {
        const existingUser = await User.findOne({username: bodyUsername.value}).exec();
        res.json({available: !existingUser})
    } catch (err) {
        console.log(err)
        res.status(500).json({usernameError: "Cant seem to search for this one"})
    }
})

// login
exports.login_get = asyncHandler(async (req, res, next) => {
    res.render("pages/auth/login", {
        title: "Login"
    })
})
exports.login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login?error=login",
    successFlash: "Welcome!",
    failureFlash: "Login failed."
})


exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        console.log("called");
        res.redirect("/");
    })
}
