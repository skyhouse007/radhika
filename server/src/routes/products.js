const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authRequired } = require('../middleware/auth');
const { makeSlug } = require('../utils/slug');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    const { category, featured, admin } = req.query;

    if (admin !== '1') {
      filter.active = true;
    }
    if (featured === 'true' || featured === '1') {
      filter.featured = true;
    }
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
      else return res.json([]);
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/id/:id', authRequired, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true }).populate(
      'category',
      'name slug'
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const {
      name,
      description = '',
      details = '',
      dimensions = '',
      material = '',
      price,
      images = [],
      category,
      stock = 0,
      featured = false,
      active = true,
      slug,
    } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const product = await Product.create({
      name,
      slug: slug || makeSlug(name),
      description,
      details,
      dimensions,
      material,
      price,
      images,
      category,
      stock,
      featured,
      active,
    });

    const populated = await product.populate('category', 'name slug');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Product slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create product' });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.name && !updates.slug) {
      updates.slug = makeSlug(updates.name);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
