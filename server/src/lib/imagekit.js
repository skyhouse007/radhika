const path = require('path');
const { ImageKit, toFile } = require('@imagekit/nodejs');

function isConfigured() {
  return Boolean(
    process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
  );
}

function getClient() {
  if (!isConfigured()) {
    throw new Error(
      'ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.'
    );
  }

  return new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  });
}

async function uploadBuffer(buffer, originalName) {
  const client = getClient();
  const ext = path.extname(originalName || '').toLowerCase() || '.jpg';
  const base = path
    .basename(originalName || 'upload', ext)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 60);
  const fileName = `${base || 'upload'}-${Date.now()}${ext}`;
  const folder = (process.env.IMAGEKIT_FOLDER || '/radhika').replace(/\/$/, '') || '/radhika';

  const file = await toFile(buffer, fileName);

  const result = await client.files.upload({
    file,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: result.url,
    fileId: result.fileId,
    name: result.name || fileName,
  };
}

module.exports = { isConfigured, uploadBuffer };
