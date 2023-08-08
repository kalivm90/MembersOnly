const express = require("express")
const router = express.Router();

const {ensureAuthenticated} = require("../middleware/authMiddleware");
const messagesController = require("../controllers/messagesController")

router.get("/", messagesController.message_detail)

router.get("/createMessage", ensureAuthenticated, messagesController.create_get)
router.post("/createMessage", ensureAuthenticated, messagesController.create_post)

router.post("/deleteMessage", messagesController.delete_post);


module.exports = router