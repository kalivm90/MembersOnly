const express = require("express")
const router = express.Router();

const messagesController = require("../controllers/messagesController")

router.get("/", messagesController.index)
router.get("/createMessage", messagesController.createMessage)

module.exports = router