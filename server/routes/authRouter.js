const express = require("express")
const router = express.Router();

const authController = require("../controllers/authController");


// index redirect 
router.get("/", authController.index);

// signup 
router.get("/signUp", authController.signup_get);
router.post("/signUp", authController.signup_post);

// signup
router.get("/login", authController.login_get)
router.post("/login", authController.login_post);

// check username endpoint
router.post("/checkUsername", authController.checkusername);

// logout
router.get("/logout", authController.logout)



module.exports = router 