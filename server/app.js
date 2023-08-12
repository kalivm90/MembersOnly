const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();
// session imports
const session = require("express-session");
const MongoStore = require("connect-mongo");
// if you wanted to store sessions on client side 
// const session = require("cookie-session");
const crypto = require("crypto")
// compress headers 
const compression = require("compression");
// protect aganist well known attacks
const helmet = require("helmet");
// rate limiter
const RateLimit = require("express-rate-limit");

// routers 
const indexRouter = require("./routes/indexRouter");
const messagesRouter = require("./routes/messagesRouter");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");

// auth
const {passport, currentUser} = require("./middleware/authMiddleware");
// DB
const mongoose = require('mongoose');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");

// session
const secretKey = crypto.randomBytes(32).toString('hex');

// if in production session is encrypted and stored in the database with an expiration of 14 days. 
if (app.get("env") === "production") {
  app.use(session({
    secret: secretKey, 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      // default time until expiration 
      // ttl: 14 * 24 * 60 * 60,
      crypto: {
        secret: secretKey
      }
    }),
  }))
} else {
  app.use(
    session({
      secret: secretKey,
      resave: true, 
      saveUninitialized: true, 
    })
  )
}

// rate limit NOT USING RATE LIMITER FOR THIS APP SINCE I AM NOT USING A BUNDLER
// TO USE RATE LIMIT FOR A SPECIFIC ROUTE
// app.get("/protected-route", limiter, (req, res, next) => {});

// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 100,
// });


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(currentUser);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(helmet()); // protect against attacks 
// app.use(limiter); // Apply rate limiter to all requests


// static build files
app.use(express.static(path.join(__dirname, '../public')));

// BOOTSTRAP STATIC

  // Serve Bootstrap CSS file
app.use('/css', express.static(path.join(__dirname, '../public/node_modules/bootstrap/dist/css')));
  // Serve PopperJS file
app.use("/popper", express.static(path.join(__dirname, "../public/node_modules/@popperjs/core/dist/umd")))
  // Serve Bootstrap JS file
app.use('/js', express.static(path.join(__dirname, '../public/node_modules/bootstrap/dist/js')));


// routes
app.use("/", indexRouter);
app.use("/messages", messagesRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = err 

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    mode: req.app.get("env") 
  });
});

// DB 
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = app;
