let router = require('express').Router();
const selling = require("../controllers/selling.controller.js");

router.get("/", selling.get);
router.post("/", selling.insert);
// router.put("/:tripID", selling.update);
router.delete("/:id", selling.delete);
router.get("/my/:uuID", selling.getMy);

router.get("/:id", selling.getById);


router.post("/media/:uuid", selling.uploadMedia);

module.exports = router;

module.exports = router;