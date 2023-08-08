const express = require("express")
const router = express.Router();

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");

router.use(ensureAuthenticated)

router.get("/", profileController.index); 

router.get("/:id", profileController.detail);

router.get("/:id/update", profileController.update_get);
router.post("/:id/update", profileController.update_post);

router.get("/:id/delete", profileController.delete_get);
router.post("/:id/delete", profileController.delete_post);

module.exports = router 