# Deployment Guide

## Current Status

✅ **Frontend**: Deployed on Vercel at `https://cuvinte-banatene.vercel.app`  
❌ **Backend**: Not yet deployed (needs separate hosting)

## Important: Backend Deployment Required

**Vercel only hosts static frontend files.** Your backend (Express.js API) needs to be deployed separately on a platform that supports Node.js servers.

### Why the words are empty in production:

1. The frontend is deployed on Vercel ✅
2. The backend is **not deployed** ❌
3. API calls from the frontend fail because there's no backend server
4. The database (SQLite) only exists when the backend server runs

## Backend Deployment Options

### Option 1: Railway (Recommended - Easy & Free tier available)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Set environment variables:
   - `JWT_SECRET` - Generate a strong secret key
   - `PORT` - Railway will set this automatically
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://cuvinte-banatene.vercel.app`
   - Email configuration (if needed)
7. Railway will provide a URL like `https://your-app.railway.app`
8. Update Vercel environment variable:
   - Go to Vercel project settings → Environment Variables
   - Add: `VITE_API_URL=https://your-app.railway.app/api`

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Sign up and create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Set environment variables (same as Railway)
6. Render will provide a URL
7. Update `VITE_API_URL` in Vercel

### Option 3: Heroku

1. Go to [heroku.com](https://heroku.com)
2. Create a new app
3. Connect GitHub repository
4. Deploy from the `backend` directory
5. Set environment variables
6. Update `VITE_API_URL` in Vercel

## Frontend Configuration (Vercel)

After deploying the backend, you need to configure the frontend to point to it:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api` (your backend URL + `/api`)
4. Redeploy the frontend (or push a new commit)

## Database Initialization

The backend automatically initializes the database with sample words when it first starts:

- **Sample words**: Loaded from `backend/src/data/words.ts`
- **Default users**:
  - Admin: `admin` / `admin123`
  - Contributor: `contributor` / `contributor123`

⚠️ **Important**: Change these default passwords in production!

## Environment Variables Checklist

### Backend (Railway/Render/Heroku):

```env
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5002
NODE_ENV=production
FRONTEND_URL=https://cuvinte-banatene.vercel.app
DATABASE_URL=./data/dictionary.db
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### Frontend (Vercel):

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Testing the Deployment

1. **Check backend health**: Visit `https://your-backend-url.com/api/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Check frontend**: Visit `https://cuvinte-banatene.vercel.app`
   - Should load and show words (if backend is connected)
   - Should show "Nu există cuvinte disponibile" if backend is not connected

3. **Check browser console**: 
   - Open DevTools → Network tab
   - Look for API calls to `/api/words`
   - Should return 200 OK if backend is working

## Troubleshooting

### Words are empty in production:
- ✅ Check if backend is deployed and running
- ✅ Check if `VITE_API_URL` is set in Vercel
- ✅ Check backend logs for errors
- ✅ Verify CORS is configured correctly in backend

### API calls fail:
- Check `VITE_API_URL` environment variable in Vercel
- Verify backend URL is correct (should end with `/api`)
- Check backend CORS configuration allows your frontend URL

### Database issues:
- SQLite database is created automatically on first run
- Sample words are loaded automatically if database is empty
- Database file persists on Railway/Render (ephemeral on Heroku free tier)

## Next Steps

1. ✅ Deploy backend to Railway/Render/Heroku
2. ✅ Set `VITE_API_URL` in Vercel environment variables
3. ✅ Redeploy frontend (or wait for auto-deploy)
4. ✅ Test the full application
5. ✅ Change default admin passwords
6. ✅ Configure email service (if using email verification)

