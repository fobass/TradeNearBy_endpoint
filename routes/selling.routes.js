let router = require('express').Router();
const selling = require("../controllers/selling.controller.js");

router.get("/", selling.get);
router.post("/", selling.insert);
// router.put("/:tripID", selling.update);
router.delete("/:id", selling.delete);

module.exports = router;