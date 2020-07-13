let router = require('express').Router();
const sellingdetail = require("../controllers/selling.detail.controller.js");

router.get("/:id", sellingdetail.get);

module.exports = router;