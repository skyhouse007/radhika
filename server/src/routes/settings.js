const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

router.get('/', async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

router.put('/', authRequired, async (req, res) => {
  try {
    const { storyTitle, storyBody, heroImage } = req.body;
    const settings = await getOrCreateSettings();
    if (storyTitle != null) settings.storyTitle = storyTitle;
    if (storyBody != null) settings.storyBody = storyBody;
    if (heroImage != null) settings.heroImage = heroImage;
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;
