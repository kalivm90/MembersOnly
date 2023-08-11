// Customize Error Page


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();
// session imports
const session = require("express-session");
const flash = require("connect-flash");
const crypto = require("crypto")

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
app.use(
  session(
    {
      secret: secretKey,
      resave: false, 
      saveUninitialized: true
    }
  )
);

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(currentUser);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// DB 
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = app;
