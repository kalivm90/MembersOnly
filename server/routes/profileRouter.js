const express = require("express")
const router = express.Router();

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");


router.get("/search", profileController.search_get);
router.get("/:id", profileController.profile_detail); 

// use ensure authenticated for all these
router.use(ensureAuthenticated)

router.get("/:id/update", profileController.profile_update_get);
router.post("/:id/update", profileController.profile_update_post);

router.get("/:id/delete", profileController.profile_delete_get);
router.post("/:id/delete", profileController.profile_delete_post);

module.exports = router 