const express = require('express');
const Category = require('../models/Category');
const { authRequired } = require('../middleware/auth');
const { makeSlug } = require('../utils/slug');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const { name, description = '', image = '', sortOrder = 0, slug } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const category = await Category.create({
      name,
      slug: slug || makeSlug(name),
      description,
      image,
      sortOrder,
    });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create category' });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.name && !updates.slug) {
      updates.slug = makeSlug(updates.name);
    }
    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update category' });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

module.exports = router;
