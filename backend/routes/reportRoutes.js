const express = require('express');
const multer = require('multer');
const reportController = require('../controllers/reportController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('file'), reportController.analyzeReport);
router.get('/history', async (req, res) => {
  const reports = await require('../models/Reports').find().sort({ createdAt: -1 });
  res.json({ success: true, data: reports });
});

module.exports = router;