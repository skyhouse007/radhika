const path = require('path');
const fs = require('fs');
const express = require('express');
const { authRequired } = require('../middleware/auth');
const { upload, uploadsDir } = require('../middleware/upload');
const { isConfigured, uploadBuffer } = require('../lib/imagekit');

const router = express.Router();

router.post('/', authRequired, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    if (isConfigured()) {
      const result = await uploadBuffer(req.file.buffer, req.file.originalname);
      return res.status(201).json({
        url: result.url,
        fileId: result.fileId,
        filename: result.name,
        provider: 'imagekit',
      });
    }

    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        message:
          'ImageKit is not configured on the server. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.',
      });
    }

    // Local fallback for development only
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = `${unique}${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);
    return res.status(201).json({
      url: `/uploads/${filename}`,
      filename,
      provider: 'local',
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

module.exports = router;
