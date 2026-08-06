require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const { uploadsDir } = require('./middleware/upload');
const { seedDatabase } = require('./seedData');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const journalRoutes = require('./routes/journal');
const newsletterRoutes = require('./routes/newsletter');
const uploadRoutes = require('./routes/upload');
const configRoutes = require('./routes/config');
const settingsRoutes = require('./routes/settings');
const workshopRoutes = require('./routes/workshops');

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOne({ email });
  if (!user) {
    await User.create({ email, passwordHash, role: 'admin' });
    console.log(`Admin user created: ${email}`);
  } else {
    user.passwordHash = passwordHash;
    user.role = 'admin';
    await user.save();
    console.log(`Admin user synced: ${email}`);
  }
}

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set — required for admin login');
  }

  await connectDB();
  await ensureAdmin();

  if (process.env.USE_MEMORY_DB === 'true') {
    console.warn(
      'WARNING: USE_MEMORY_DB=true — all admin data is temporary and will be lost when the server restarts.'
    );
    const result = await seedDatabase({ clear: true });
    console.log(`Demo data seeded. Admin: ${result.email} / ${result.password}`);
  } else if (process.env.AUTO_SEED === 'true') {
    const result = await seedDatabase({ clear: false });
    console.log(
      result.seeded
        ? `Seeded missing demo data. Admin: ${result.email} / ${result.password}`
        : 'Database already has data — skipped seed.'
    );
  }

  const app = express();
  const port = process.env.PORT || 5000;

  const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || clientOrigins.includes(origin) || clientOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(null, clientOrigins[0] || true);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/journal', journalRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/workshops', workshopRoutes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
