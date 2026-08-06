const mongoose = require('mongoose');

const journalPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    contentImages: {
      type: Map,
      of: String,
      default: {},
    },
    fonts: {
      h1: { type: String, default: 'Libre Baskerville' },
      h2: { type: String, default: 'Libre Baskerville' },
      h3: { type: String, default: 'Assistant' },
      p: { type: String, default: 'Assistant' },
    },
    publishedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JournalPost', journalPostSchema);
