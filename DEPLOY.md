# Render deploy

## Why `/admin` returns 404

The site is a React SPA. The host must **rewrite all routes to `index.html`**.
Without that, `https://www.radhikakhandelwal.com/admin` looks for a real `/admin` folder and fails.

### Fix on Render Static Site (frontend)

**Redirects / Rewrites** (Dashboard → your static site → Redirects/Rewrites):

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | **Rewrite** |

Then redeploy / clear cache.

### Static site settings

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Client env (Build):

```
VITE_API_URL=https://YOUR-API.onrender.com
```

(Use your real API URL, no trailing slash.)

## Web Service (API)

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

API env:

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

## Console noise

Messages like `Advanced image optimization module` or `Receiving end does not exist` usually come from **browser extensions**, not this app.
