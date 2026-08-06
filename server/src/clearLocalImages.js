/**
 * Clears local /uploads file references from MongoDB so admin can re-upload to ImageKit.
 * Run: node src/clearLocalImages.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Workshop = require('./models/Workshop');
const JournalPost = require('./models/JournalPost');
const Category = require('./models/Category');
const SiteSettings = require('./models/SiteSettings');
const { uploadsDir } = require('./middleware/upload');

function isLocalPath(value) {
  if (!value || typeof value !== 'string') return false;
  return value.startsWith('/uploads/') || value.startsWith('uploads/');
}

function stripLocalFromMap(mapLike) {
  if (!mapLike) return { changed: false, next: mapLike };
  const obj =
    typeof mapLike.toObject === 'function' ? mapLike.toObject() : { ...mapLike };
  let changed = false;
  const next = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isLocalPath(value)) {
      changed = true;
      continue;
    }
    next[key] = value;
  }
  return { changed, next };
}

async function run() {
  await connectDB();

  let cleared = 0;

  const products = await Product.find({});
  for (const p of products) {
    const before = (p.images || []).length;
    p.images = (p.images || []).filter((img) => !isLocalPath(img));
    if (p.images.length !== before) {
      await p.save();
      cleared += before - p.images.length;
    }
  }

  const workshops = await Workshop.find({});
  for (const w of workshops) {
    const before = (w.images || []).length;
    w.images = (w.images || []).filter((img) => !isLocalPath(img));
    if (w.images.length !== before) {
      await w.save();
      cleared += before - w.images.length;
    }
  }

  const posts = await JournalPost.find({});
  for (const post of posts) {
    let dirty = false;
    if (isLocalPath(post.coverImage)) {
      post.coverImage = '';
      dirty = true;
      cleared += 1;
    }
    const { changed, next } = stripLocalFromMap(post.contentImages);
    if (changed) {
      post.contentImages = next;
      dirty = true;
      cleared += 1;
    }
    if (dirty) await post.save();
  }

  const categories = await Category.find({});
  for (const cat of categories) {
    if (isLocalPath(cat.image)) {
      cat.image = '';
      await cat.save();
      cleared += 1;
    }
  }

  const settings = await SiteSettings.findOne();
  if (settings && isLocalPath(settings.heroImage)) {
    settings.heroImage = '';
    await settings.save();
    cleared += 1;
  }

  let filesRemoved = 0;
  if (fs.existsSync(uploadsDir)) {
    for (const name of fs.readdirSync(uploadsDir)) {
      if (name === '.gitkeep') continue;
      fs.unlinkSync(path.join(uploadsDir, name));
      filesRemoved += 1;
    }
  }

  console.log(`Cleared ${cleared} local image reference(s) from the database.`);
  console.log(`Deleted ${filesRemoved} file(s) from server/uploads.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
