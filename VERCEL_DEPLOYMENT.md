# 🚀 Vercel Deployment Guide - BloodPlus

## Frontend Deployment (Vite React App)

### Step 1: Prepare for Deployment

The app is already configured with:
- ✅ Vite build configuration
- ✅ vercel.json for routing
- ✅ All components converted to .jsx

### Step 2: Deploy to Vercel

#### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
```powershell
npm install -g vercel
```

2. **Login to Vercel:**
```powershell
vercel login
```

3. **Navigate to client folder:**
```powershell
cd "c:\Users\2446124\OneDrive - Cognizant\Desktop\BloodPlus\client"
```

4. **Deploy:**
```powershell
vercel
```

5. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? Choose your account
   - Link to existing project? **No**
   - Project name? **bloodplus-frontend** (or your choice)
   - In which directory is your code? **./** (current directory)
   - Want to override settings? **No**

6. **Production deployment:**
```powershell
vercel --prod
```

#### Option 2: Using Vercel Dashboard (Web Interface)

1. **Go to:** https://vercel.com
2. **Click:** "Add New Project"
3. **Import Git Repository:**
   - Connect your GitHub account
   - Select the `BloodPlus` repository
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables:**
   - Add if you have any frontend-specific variables
6. **Click:** "Deploy"

### Step 3: Update Backend URL in Frontend

Once frontend is deployed, you need to update API calls to use your backend URL.

#### Create Environment File

Create `.env` in the `client` folder:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

#### Update API Calls

In all your page components (Login.jsx, Register.jsx, etc.), replace:
```javascript
// OLD
fetch('/api/auth/login', ...)

// NEW
fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, ...)
```

Or create an API utility file:

**Create: `client/src/utils/api.js`**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
};
```

Then use it in components:
```javascript
import { apiCall } from '../utils/api';

// In your component
const response = await apiCall('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### Step 4: Configure Environment Variables in Vercel

In Vercel Dashboard:
1. Go to your project
2. Click "Settings"
3. Click "Environment Variables"
4. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com`
   - **Environment:** Production, Preview, Development
5. Redeploy your app

---

## Backend Deployment

### Option 1: Deploy to Render.com

1. **Go to:** https://render.com
2. **Sign up/Login**
3. **Create New Web Service**
4. **Connect Repository:**
   - Connect GitHub
   - Select `BloodPlus` repo
5. **Configure:**
   - **Name:** bloodplus-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** Leave empty (use root)
6. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=BloodPlus_Secret_Key_2025_Secure_Random_String_xyz789abc
   EMAIL_USER=bhargavvenkat515@gmail.com
   EMAIL_PASS=Bhavya2727
   ```
7. **Click:** "Create Web Service"

### Option 2: Deploy to Railway.app

1. **Go to:** https://railway.app
2. **Sign up/Login**
3. **New Project** → **Deploy from GitHub repo**
4. **Select:** BloodPlus repository
5. **Add Environment Variables** (same as above)
6. **Deploy**

### Option 3: Deploy to Vercel (Functions)

**Note:** Vercel has limitations for long-running processes, so Render/Railway is better for the backend.

---

## Complete Deployment Checklist

### Backend ✅
- [ ] Deploy backend to Render/Railway
- [ ] Add all environment variables
- [ ] Test API endpoints with Postman
- [ ] Note the backend URL

### Frontend ✅
- [ ] Update API URLs in frontend code
- [ ] Add VITE_API_URL environment variable
- [ ] Deploy to Vercel
- [ ] Test frontend deployment
- [ ] Verify API calls work

### Final Testing ✅
- [ ] Register a new user
- [ ] Login successfully
- [ ] Search for donors
- [ ] Create blood request
- [ ] Verify email notifications
- [ ] Test all features

---

## Troubleshooting

### Issue: 404 on page refresh
**Solution:** vercel.json already configured with rewrites

### Issue: API calls failing
**Solution:** 
1. Check CORS settings in backend
2. Verify backend URL is correct
3. Check environment variables

### Issue: Build failing on Vercel
**Solution:**
1. Check package.json has correct dependencies
2. Verify all imports use .jsx extension
3. Check build logs for specific errors

---

## Production Checklist

- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate
- [ ] Test all features in production
- [ ] Set up error tracking (Sentry, etc.)

---

## Useful Commands

### Local Development
```powershell
# Backend
cd "BloodPlus"
npm start

# Frontend
cd "BloodPlus\client"
npm run dev
```

### Build for Production
```powershell
# Frontend only
cd "BloodPlus\client"
npm run build
```

### Deploy to Vercel
```powershell
cd "BloodPlus\client"
vercel --prod
```

---

## URLs After Deployment

**Frontend:** https://bloodplus-frontend.vercel.app (example)  
**Backend:** https://bloodplus-backend.onrender.com (example)

Update these in your `.env` files accordingly!

---

🎉 **Your BloodPlus app is now live!** 🩸
