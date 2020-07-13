let router = require('express').Router();
const location = require("../controllers/location.controller.js");

router.get("/", location.get);
// router.post("/", selling.insert);
// router.put("/:tripID", selling.update);
// router.delete("/:id", selling.delete);

module.exports = router;