const express = require("express");
const multer = require("multer");
const reportController = require("../controllers/reportController");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/analyze",
    upload.single("file"),
    reportController.analyzeReport
);

router.get(
    "/history",
    reportController.getHistory
);

module.exports = router;