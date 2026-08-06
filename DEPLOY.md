# Deploy

Your domain (`www.radhikakhandelwal.com`) is on **Vercel**. The API is on **Render**.

## Frontend (Vercel)

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Output Directory | `dist` |

`client/vercel.json` rewrites all routes to `index.html` (fixes `/admin` 404).

### Environment variable (Production)

In Vercel → Project → Settings → Environment Variables:

```
VITE_API_URL=https://radhika-6rzf.onrender.com
```

No trailing slash. Redeploy after saving (Vite bakes this in at build time).

## API (Render Web Service)

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

### Environment variables

```
NODE_VERSION=20
MONGODB_URI=mongodb+srv://...
USE_MEMORY_DB=false
JWT_SECRET=long-random-secret
ADMIN_EMAIL=admin@radhikakhandelwal.com
ADMIN_PASSWORD=your-secure-password
WHATSAPP_NUMBER=918385966614
INSTAGRAM_URL=https://www.instagram.com/khandelwal_radhika_/
CLIENT_URL=https://www.radhikakhandelwal.com,https://radhikakhandelwal.com
```

`JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` must all be set or admin login returns 500.

## Console noise

Messages like `Advanced image optimization module` or `Receiving end does not exist` usually come from **browser extensions**, not this app.
