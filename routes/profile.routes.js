let router = require('express').Router();
const profile = require("../controllers/profile.controller.js");

router.get("/:uuID", profile.get);
router.post("/", profile.insert);
router.put("/:uuID", profile.update);
router.delete("/:uuID", profile.delete);
router.post("/media/:uuid", profile.uploadMedia);

module.exports = router;