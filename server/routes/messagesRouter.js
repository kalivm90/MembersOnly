const express = require("express")
const router = express.Router();

const {ensureAuthenticated} = require("../middleware/authMiddleware");
const messagesController = require("../controllers/messagesController")

router.get("/", messagesController.index)

router.get("/createMessage", ensureAuthenticated, messagesController.createMessage_get)
router.post("/createMessage", ensureAuthenticated, messagesController.createMessage_post)

router.post("/deleteMessage", messagesController.deleteMessage_post);


module.exports = router