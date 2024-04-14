const express = require("express");

const controller = require("../Controllers/FileController");
const router = express.Router();

router.post("/file", controller.UploadFile);

 router.get("/file/:uid", controller.getFile);
 router.put("/updateFile/:uid", controller.updateFile);
 router.put("/deleteFile/:uid", controller.deleteFile);

module.exports = router;
