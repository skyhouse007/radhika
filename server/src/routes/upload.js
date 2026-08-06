const express = require('express');
const { authRequired } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.post('/', authRequired, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
});

module.exports = router;
