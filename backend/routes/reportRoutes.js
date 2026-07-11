const express = require("express");
const multer = require("multer");

const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/analyze",
    authMiddleware,
    upload.single("file"),
    reportController.analyzeReport
);

router.get(
    "/history",
    authMiddleware,
    reportController.getHistory
);

module.exports = router;