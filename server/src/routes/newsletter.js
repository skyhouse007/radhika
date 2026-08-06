const express = require('express');
const Subscriber = require('../models/Subscriber');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email is required' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({ message: 'You are already subscribed', subscriber: existing });
    }

    const subscriber = await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to subscribe' });
  }
});

router.get('/', authRequired, async (_req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

module.exports = router;
