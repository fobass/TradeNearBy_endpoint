let router = require('express').Router();
const item = require("../controllers/item.controller.js");

router.get("/", item.getItemsNearBy);
router.get("/:id", item.getItemById);
// router.post("/media/:uuid", item.uploadMedia);
router.post("/", item.insert);
router.put("/:id", item.update);
router.delete("/:id", item.delete);

module.exports = router;