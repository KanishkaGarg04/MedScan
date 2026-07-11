const express = require("express");
const multer = require("multer");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  uploadProfilePicture,
} = require("../controllers/authController");

const upload = multer({
  dest: "uploads/",
});

router.post("/register", register);
router.post("/login", login);

router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("profile"),
  uploadProfilePicture
);

module.exports = router;