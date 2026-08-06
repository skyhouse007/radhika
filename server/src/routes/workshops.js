const express = require('express');
const Workshop = require('../models/Workshop');
const { authRequired } = require('../middleware/auth');
const { makeSlug } = require('../utils/slug');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.admin !== '1') {
      filter.published = true;
    }
    if (req.query.featured === 'true' || req.query.featured === '1') {
      filter.featured = true;
    }
    const workshops = await Workshop.find(filter).sort({ createdAt: -1 });
    res.json(workshops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch workshops' });
  }
});

router.get('/id/:id', authRequired, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json(workshop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch workshop' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const workshop = await Workshop.findOne({ slug: req.params.slug, published: true });
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json(workshop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch workshop' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const {
      title,
      story = '',
      images = [],
      dateLabel = '',
      location = '',
      published = true,
      featured = false,
      slug,
    } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const workshop = await Workshop.create({
      title,
      slug: slug || makeSlug(title),
      story,
      images,
      dateLabel,
      location,
      published,
      featured,
    });
    res.status(201).json(workshop);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Workshop slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create workshop' });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.title && !updates.slug) {
      updates.slug = makeSlug(updates.title);
    }
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json(workshop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update workshop' });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json({ message: 'Workshop deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete workshop' });
  }
});

module.exports = router;
