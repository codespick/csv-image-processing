const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const validateCSV = require("../middleware/validateCSV");
const { uploadFile } = require("../controllers/uploadController");
const { getStatus } = require("../controllers/statusController");

router.post("/upload", upload.single("file"), validateCSV, uploadFile);
router.get("/status/:requestId", getStatus);

module.exports = router;
