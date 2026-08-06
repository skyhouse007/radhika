const express = require('express');
const JournalPost = require('../models/JournalPost');
const { authRequired } = require('../middleware/auth');
const { makeSlug } = require('../utils/slug');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.admin !== '1') {
      filter.published = true;
    }
    const posts = await JournalPost.find(filter).sort({ publishedAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch journal posts' });
  }
});

router.get('/id/:id', authRequired, async (req, res) => {
  try {
    const post = await JournalPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const post = await JournalPost.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const {
      title,
      excerpt = '',
      content = '',
      coverImage = '',
      contentImages = {},
      fonts,
      publishedAt,
      published = true,
      slug,
    } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const post = await JournalPost.create({
      title,
      slug: slug || makeSlug(title),
      excerpt,
      content,
      coverImage,
      contentImages,
      fonts,
      publishedAt: publishedAt || Date.now(),
      published,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Post slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create post' });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.title && !updates.slug) {
      updates.slug = makeSlug(updates.title);
    }
    const post = await JournalPost.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const post = await JournalPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

module.exports = router;
