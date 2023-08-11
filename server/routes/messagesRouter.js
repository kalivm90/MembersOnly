const express = require("express")
const router = express.Router();

const {ensureAuthenticated} = require("../middleware/authMiddleware");
const messagesController = require("../controllers/messagesController")

router.get("/", messagesController.message_detail)

router.get("/createMessage", ensureAuthenticated, messagesController.message_create_get)
router.post("/createMessage", ensureAuthenticated, messagesController.message_create_post)

router.post("/deleteMessage", messagesController.message_delete_post);

router.get("/:id/update", ensureAuthenticated, messagesController.message_update_get);
router.post("/:id/update", ensureAuthenticated, messagesController.message_update_post);


module.exports = router