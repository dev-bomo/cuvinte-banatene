# Deployment Guide

## Recommended: Deploy Both Frontend and Backend Together

**Best Practice**: Deploy both frontend and backend on the same platform. This simplifies configuration, reduces CORS issues, and makes everything easier to manage.

### Why deploy together?

✅ **Simpler configuration** - No need to configure CORS or API URLs  
✅ **Same domain** - Frontend and API on the same URL  
✅ **Easier management** - One deployment, one platform  
✅ **Better performance** - No cross-origin requests  
✅ **Cost effective** - One service instead of two

## Deployment Options

### Option 1: Railway (Recommended - Easy & Free tier available)

Railway can host both your frontend and backend together:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure the service:
   - **Root Directory**: `.` (project root)
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `cd backend && npm start`
6. Set environment variables:
   - `JWT_SECRET` - Generate a strong secret key
   - `PORT` - Railway will set this automatically
   - `NODE_ENV=production`
   - `FRONTEND_URL` - Your Railway URL (set after deployment)
   - Email configuration (if needed)
7. Railway will provide a URL like `https://your-app.railway.app`
8. **That's it!** Your frontend and backend are now on the same domain
   - Frontend: `https://your-app.railway.app`
   - API: `https://your-app.railway.app/api`

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Sign up and create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `.` (project root)
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `cd backend && npm start`
5. Set environment variables (same as Railway)
6. Render will provide a URL - both frontend and API will be on the same domain

### Option 3: Heroku

1. Go to [heroku.com](https://heroku.com)
2. Create a new app
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `.` (project root)
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `cd backend && npm start`
5. Set environment variables (same as Railway)

## Alternative: Separate Deployments (Not Recommended)

If you prefer to keep frontend on Vercel and backend elsewhere:

### Backend on Railway/Render/Heroku

Follow the same steps as above, but:
- Set **Root Directory**: `backend` (instead of `.`)
- After deployment, get your backend URL
- Configure Vercel environment variable: `VITE_API_URL=https://your-backend-url.com/api`

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

### Frontend (Only if using separate deployments):

```env
VITE_API_URL=https://your-backend-url.com/api
```

**Note**: If deploying both on the same platform, you don't need this - the API uses relative paths (`/api`) which work automatically.

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

1. ✅ Deploy both frontend and backend to Railway/Render/Heroku (recommended)
   - OR deploy backend separately and configure Vercel
2. ✅ Test the full application at your deployment URL
3. ✅ Change default admin passwords
4. ✅ Configure email service (if using email verification)

## How It Works

When deployed together:
- **Backend** serves the API at `/api/*` routes
- **Backend** serves static frontend files from `frontend/dist` for all other routes
- **SPA routing** - All non-API routes serve `index.html` (React Router handles routing)
- **Same domain** - No CORS issues, simpler configuration

