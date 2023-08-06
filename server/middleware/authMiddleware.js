const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            // Use bcrypt.compare() to validate the password
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    return done(err);
                }

                if (res) {
                    // Passwords match! Log the user in
                    return done(null, user);
                } else {
                    // Passwords do not match
                    return done(null, false, { message: "Incorrect password" });
                }
            });
            
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    };
});

// gives you access to currentUser in all views 
function currentUser(req, res, next) {
    res.locals.currentUser = req.user;
    next();
};


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // User is authenticated, proceed to the next middleware or route handler
        return next(); 
    } else {
        /* 
            look at how the error is handled in the error handling middleware, this is how its supposed to be done in production
        */
        //   res.redirect("/"); // REDIRECT
        const error = new Error("Unathorized: You are not logged in!")
        error.status = 401;
        return next(error)
    }
  }
  
  module.exports = {passport, ensureAuthenticated, currentUser};