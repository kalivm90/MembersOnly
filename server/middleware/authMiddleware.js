const passport = require("passport");
const bcrypt = require("bcryptjs");

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

// local 
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

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails } = profile;
                const email = emails && emails.length > 0 ? emails[0].value : null;

                let user = await User.findOne({googleId: id});

                if (!user) {
                    const fullname = displayName.split(" ")
                    const hashedPassword = await bcrypt.hash(displayName, 10);

                    user = new User({
                        firstName: fullname[0],
                        lastName: fullname[1],
                        username: displayName, 
                        password: hashedPassword,
                        googleId: id,
                        email: email, 
                    })
    
                    await user.save();
                }

                done(null, user);
            } catch (err) {
                done(err);
            }
        }
    )
)

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