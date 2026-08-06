const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    heroImage: { type: String, default: '' },
    storyTitle: {
      type: String,
      default: 'Art inspired by the ordinary moments.',
    },
    storyBody: {
      type: String,
      default:
        "Hi, I'm Radhika — an artist based in India, creating original paintings and stationery that add beauty to your daily life. My work strips away the noise to focus on what truly matters, inspired by the ordinary moments. I believe art should be accessible and a part of everyday life.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
