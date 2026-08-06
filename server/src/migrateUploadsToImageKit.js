/**
 * Migrates /uploads/... URLs in MongoDB to ImageKit.
 * Downloads each file from RENDER_UPLOAD_BASE (or local disk), uploads to ImageKit, updates DB.
 *
 * Usage:
 *   RENDER_UPLOAD_BASE=https://radhika-6rzf.onrender.com node src/migrateUploadsToImageKit.js
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
const { isConfigured, uploadBuffer } = require('./lib/imagekit');

function isLocalPath(value) {
  return typeof value === 'string' && (value.startsWith('/uploads/') || value.startsWith('uploads/'));
}

async function fetchBytes(relPath) {
  const name = path.basename(relPath);
  const local = path.join(uploadsDir, name);
  if (fs.existsSync(local)) {
    return fs.readFileSync(local);
  }

  const base = (process.env.RENDER_UPLOAD_BASE || 'https://radhika-6rzf.onrender.com').replace(
    /\/$/,
    ''
  );
  const url = `${base}${relPath.startsWith('/') ? relPath : `/${relPath}`}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not download ${url} (${res.status})`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function migrateOne(relPath, cache) {
  if (cache.has(relPath)) return cache.get(relPath);
  const buf = await fetchBytes(relPath);
  const result = await uploadBuffer(buf, path.basename(relPath));
  cache.set(relPath, result.url);
  console.log(`  ${relPath} → ${result.url}`);
  return result.url;
}

async function migrateList(list, cache) {
  const next = [];
  let changed = false;
  for (const item of list || []) {
    if (isLocalPath(item)) {
      next.push(await migrateOne(item, cache));
      changed = true;
    } else {
      next.push(item);
    }
  }
  return { next, changed };
}

async function run() {
  if (!isConfigured()) {
    throw new Error('ImageKit env vars are not set');
  }

  await connectDB();
  const cache = new Map();
  let updated = 0;

  for (const p of await Product.find({})) {
    const { next, changed } = await migrateList(p.images, cache);
    if (changed) {
      p.images = next;
      await p.save();
      updated += 1;
    }
  }

  for (const w of await Workshop.find({})) {
    const { next, changed } = await migrateList(w.images, cache);
    if (changed) {
      w.images = next;
      await w.save();
      updated += 1;
    }
  }

  for (const post of await JournalPost.find({})) {
    let dirty = false;
    if (isLocalPath(post.coverImage)) {
      post.coverImage = await migrateOne(post.coverImage, cache);
      dirty = true;
    }
    const mapEntries =
      post.contentImages instanceof Map
        ? [...post.contentImages.entries()]
        : Object.entries(
            typeof post.contentImages?.toObject === 'function'
              ? post.contentImages.toObject()
              : post.contentImages || {}
          );
    const nextMap = new Map();
    for (const [key, value] of mapEntries) {
      if (isLocalPath(value)) {
        nextMap.set(key, await migrateOne(value, cache));
        dirty = true;
      } else if (value) {
        nextMap.set(key, value);
      }
    }
    if (dirty) {
      post.contentImages = nextMap;
      post.markModified('contentImages');
      await post.save();
      updated += 1;
    }
  }

  for (const cat of await Category.find({})) {
    if (isLocalPath(cat.image)) {
      cat.image = await migrateOne(cat.image, cache);
      await cat.save();
      updated += 1;
    }
  }

  const settings = await SiteSettings.findOne();
  if (settings && isLocalPath(settings.heroImage)) {
    settings.heroImage = await migrateOne(settings.heroImage, cache);
    await settings.save();
    updated += 1;
  }

  console.log(`Updated ${updated} document(s). Migrated ${cache.size} file(s) to ImageKit.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
