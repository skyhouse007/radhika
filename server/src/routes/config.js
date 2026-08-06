const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    brand: 'Radhika Khandelwal',
    tagline: 'Art for everyday living',
    whatsapp: process.env.WHATSAPP_NUMBER || '',
    instagram: process.env.INSTAGRAM_URL || '',
    about:
      "Hi, I'm Radhika — an artist based in India, creating original paintings and stationery that bring quiet beauty into daily life. My work is inspired by small, ordinary moments: morning light, handwritten notes, and the objects we keep close.",
  });
});

module.exports = router;
