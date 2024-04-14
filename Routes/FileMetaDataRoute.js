const express = require("express");

const controller = require("../Controllers/FileMetaDataController");
const router = express.Router();

router.get("/filemetadata/:uid", controller.getMetaData);
router.put("/updateMetaData/:uid", controller.updateMetaData);
router.delete("/deleteMetaData/:uid", controller.deleteMetaData);
router.post("/searchFile", controller.searchFileByMetadata);










module.exports = router;