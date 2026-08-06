# Render deploy

## Web Service (API)

In the Render dashboard:

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
INSTAGRAM_URL=https://www.instagram.com/yourhandle
CLIENT_URL=https://your-frontend.onrender.com
```

Use a real MongoDB Atlas URI. Do **not** use `USE_MEMORY_DB=true` in production.

After first deploy, seed once (Render Shell):

```bash
npm run seed
```

## Static Site (frontend)

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Add env var on the client (optional if same domain via proxy):

```
VITE_API_URL=https://your-api.onrender.com
```

Then set the API service `CLIENT_URL` to your static site URL.
