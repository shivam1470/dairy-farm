# 🎯 Quick Deployment Guide

## Prerequisites
- GitHub account
- Railway account (free): https://railway.app
- Vercel account (free): https://vercel.com

---

## 📦 Step 1: Push to GitHub (5 minutes)

```bash
# Navigate to project
cd /Users/shivammishra/Desktop/cources/dairy-farm

# Run deployment helper
./deploy.sh
```

Or manually:
```bash
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dairy-farm.git
git push -u origin main
```

---

## 🚀 Step 2: Deploy Backend on Railway (10 minutes)

### 2.1 Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 2.2 Create New Project
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select **"dairy-farm"** repository
4. Wait for initial setup

### 2.3 Add PostgreSQL Database
1. Click **"+ New"** in your project
2. Select **"Database"** → **"PostgreSQL"**
3. Database will be auto-configured

### 2.4 Configure Backend Service
Click on your backend service, then go to **Settings**:

**Variables (Environment Variables):**
```
NODE_ENV=production
JWT_SECRET=please-change-this-to-random-32-char-string
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**Settings → Service:**
- **Root Directory**: `/` (or `apps/backend`)
- **Watch Paths**: `apps/backend/**`

**Build & Deploy:**
- **Build Command**:
  ```
  pnpm install && cd apps/backend && npx prisma generate && pnpm build
  ```
- **Start Command**:
  ```
  cd apps/backend && npx prisma migrate deploy && npx prisma db seed && node dist/main
  ```

### 2.5 Generate Public URL
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. **Copy the URL** (e.g., `dairy-farm-backend-production.up.railway.app`)

### 2.6 Deploy
- Railway automatically deploys
- Check **Deployments** tab for progress
- Should complete in 3-5 minutes

### 2.7 Verify Backend
Visit: `https://your-backend-url.railway.app/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T...",
  "uptime": 12.34,
  "environment": "production"
}
```

---

## 🌐 Step 3: Deploy Frontend on Vercel (5 minutes)

### 3.1 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. **Import** your `dairy-farm` repository
3. Click **"Import"**

### 3.3 Configure Project

**Framework Preset:** Next.js ✅

**Root Directory:** Click **"Edit"** → Select `apps/web`

**Build & Development Settings:**
- **Build Command**: `cd apps/web && pnpm build` (auto-detected)
- **Output Directory**: `apps/web/.next` (auto-detected)  
- **Install Command**: `pnpm install` (auto-detected)

### 3.4 Add Environment Variable
In the **"Environment Variables"** section:

```
Name:  NEXT_PUBLIC_API_URL
Value: https://your-railway-backend-url.railway.app
```

⚠️ **IMPORTANT**: Replace with your actual Railway backend URL from Step 2.5

### 3.5 Deploy
1. Click **"Deploy"**
2. Wait 2-4 minutes
3. Click the **generated URL** to visit your app!

---

## ✅ Step 4: Test Your Deployment

### Test Backend
```bash
curl https://your-backend-url.railway.app/health
```

### Test Frontend
1. Visit your Vercel URL: `https://dairy-farm-xxxx.vercel.app`
2. Click **"Sign In"**
3. Login with:
   ```
   Email: admin@greenvaleyfarm.com
   Password: password123
   ```

---

## 🎉 You're Live!

Your application is now deployed:

- ✅ **Frontend**: `https://dairy-farm-xxxx.vercel.app`
- ✅ **Backend**: `https://dairy-farm-backend-xxxx.railway.app`
- ✅ **Database**: Managed by Railway

---

## 🔧 Common Issues & Fixes

### Issue: Build fails on Railway
**Solution:**
- Check build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Try: Settings → Service → **Redeploy**

### Issue: Frontend can't connect to backend
**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Check CORS is enabled in backend (it is)
3. Ensure Railway backend is running (check /health endpoint)
4. **Redeploy** frontend after adding env variables

### Issue: Database connection fails
**Solution:**
- Verify `DATABASE_URL` is set: `${{Postgres.DATABASE_URL}}`
- Check PostgreSQL service is running in Railway
- Restart backend service

### Issue: Login doesn't work
**Solution:**
- Check browser console for errors
- Verify backend /auth endpoints work:
  ```bash
  curl -X POST https://your-backend.railway.app/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@greenvaleyfarm.com","password":"password123"}'
  ```

---

## 📊 Free Tier Limits

### Railway (Free Trial)
- $5 credit/month (good for ~500 hours)
- 1GB PostgreSQL storage
- **Note**: Railway may sleep after inactivity

### Vercel (Hobby - Free Forever)
- 100GB bandwidth/month
- Unlimited deployments
- ✅ Perfect for this application

### Keep Backend Alive (Optional)
Use https://cron-job.org to ping your backend every 25 minutes:
```
URL: https://your-backend-url.railway.app/health
Interval: Every 25 minutes
```

---

## 🔄 Updating Your Deployment

### Push Changes
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Both Railway and Vercel will **auto-deploy** new commits! 🚀

---

## 🔒 Security Checklist

After deployment:
- [ ] Change default passwords via the app
- [ ] Update JWT_SECRET to a strong random value
- [ ] Add your Vercel domain to CORS in backend
- [ ] Enable 2FA on Railway and Vercel accounts
- [ ] Set up database backups (Railway auto-backups)

---

## 📱 Mobile App

Mobile deployment guide will be added later. For now:
- Frontend works on mobile browsers
- PWA (Progressive Web App) support can be added

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs  
- **Prisma Docs**: https://www.prisma.io/docs

---

## 🎊 Congratulations!

You've successfully deployed a full-stack Dairy Farm Management System for **FREE**! 

**Total Time**: ~20 minutes
**Cost**: $0.00
**Cool Factor**: 💯

Share your app URL with your team and start managing that farm! 🐄🥛
