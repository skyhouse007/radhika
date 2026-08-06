const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    story: { type: String, default: '' },
    images: [{ type: String }],
    dateLabel: { type: String, default: '' },
    location: { type: String, default: '' },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', workshopSchema);
