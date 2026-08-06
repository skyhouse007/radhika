const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const JournalPost = require('./models/JournalPost');
const Workshop = require('./models/Workshop');

async function seedDatabase({ clear = true } = {}) {
  const email = (process.env.ADMIN_EMAIL || 'admin@radhikakhandelwal.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  if (clear) {
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      JournalPost.deleteMany({}),
      Workshop.deleteMany({}),
    ]);
  }

  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'admin',
    });
  }

  const existingCategories = await Category.countDocuments();
  if (existingCategories === 0 || clear) {
    if (!clear && existingCategories > 0) {
      return { email, password, seeded: false };
    }

    const categories = await Category.insertMany([
      {
        name: 'Postcards',
        slug: 'postcards',
        description: 'Small prints for notes, desks, and quiet corners.',
        sortOrder: 1,
      },
      {
        name: 'Greeting Cards',
        slug: 'greeting-cards',
        description: 'Cards for love, friendship, and everyday kindness.',
        sortOrder: 2,
      },
      {
        name: 'Stationery',
        slug: 'stationery',
        description: 'Notebooks, bookmarks, and functional art.',
        sortOrder: 3,
      },
    ]);

    const [postcards, greeting, stationery] = categories;

    await Product.insertMany([
      {
        name: 'Morning Light | Postcard',
        slug: 'morning-light-postcard',
        description: 'A soft study of early light across a quiet room.',
        details: 'Printed postcard from an original painting. Blank on the reverse for notes or mailing.',
        dimensions: '10.5 × 14.8 cm (A6)',
        material: 'Premium matte cardstock',
        price: 199,
        images: [],
        category: postcards._id,
        stock: 50,
        featured: true,
        active: true,
      },
      {
        name: 'Clay Pot | Postcard',
        slug: 'clay-pot-postcard',
        description: 'Inspired by handmade pottery and everyday objects.',
        price: 199,
        images: [],
        category: postcards._id,
        stock: 40,
        featured: true,
        active: true,
      },
      {
        name: 'I am enough | Greeting Card',
        slug: 'i-am-enough-greeting-card',
        description: 'A gentle reminder to keep close or send to someone you love.',
        price: 299,
        images: [],
        category: greeting._id,
        stock: 30,
        featured: true,
        active: true,
      },
      {
        name: 'You & Me | Greeting Card',
        slug: 'you-and-me-greeting-card',
        description: 'For the quiet kind of love that lives in ordinary days.',
        price: 299,
        images: [],
        category: greeting._id,
        stock: 30,
        featured: false,
        active: true,
      },
      {
        name: 'Sketchbook Notebook',
        slug: 'sketchbook-notebook',
        description: 'Blank pages for lists, sketches, and slow thoughts.',
        price: 499,
        images: [],
        category: stationery._id,
        stock: 25,
        featured: true,
        active: true,
      },
      {
        name: 'Leaf Bookmark Set',
        slug: 'leaf-bookmark-set',
        description: 'A set of three botanical bookmarks.',
        details: 'Set of 3 illustrated bookmarks with rounded edges. Ideal for novels and sketchbooks.',
        dimensions: '15 × 5 cm each',
        material: '300gsm textured paper',
        price: 249,
        images: [],
        category: stationery._id,
        stock: 35,
        featured: false,
        active: true,
      },
    ]);

    await JournalPost.insertMany([
      {
        title: 'On painting ordinary mornings',
        slug: 'on-painting-ordinary-mornings',
        excerpt:
          'The work begins with noticing — steam from a cup, the edge of a curtain, light that does not ask to be special.',
        content: `<p>The work begins with noticing — steam from a cup, the edge of a curtain, light that does not ask to be special.</p>
<p>This collection is about those moments: not events, but textures. I paint so that stationery and small prints can live beside your day, not above it.</p>
<p>Thank you for being here.</p>`,
        coverImage: '',
        publishedAt: new Date('2025-12-01'),
        published: true,
      },
      {
        title: 'Inspiration behind Clay Pot',
        slug: 'inspiration-behind-clay-pot',
        excerpt: 'A postcard born from handmade pottery and the objects we keep within reach.',
        content: `<p>Clay Pot started as a sketch of a vessel on my studio shelf — imperfect, useful, quietly beautiful.</p>
<p>I wanted a postcard that felt like something you might leave on a desk or send with a short note. Functional art, for ordinary days.</p>`,
        coverImage: '',
        publishedAt: new Date('2025-10-15'),
        published: true,
      },
    ]);

    await Workshop.insertMany([
      {
        title: 'Morning watercolour session',
        slug: 'morning-watercolour-session',
        story:
          'A slow morning in the studio — we painted light, leaves, and quiet objects together. Cups of tea, shared brushes, and colour charts pinned to the wall.',
        images: [],
        dateLabel: 'January 2026',
        location: 'Studio',
        published: true,
        featured: true,
      },
    ]);
  }

  return { email, password, seeded: true };
}

module.exports = { seedDatabase };
