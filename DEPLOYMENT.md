# 🚀 Deployment Guide - Dairy Farm Management System

## Overview
This guide will help you deploy:
- **Backend API** → Railway (Free tier with PostgreSQL)
- **Frontend Web App** → Vercel (Free tier)

---

## 🔧 Prerequisites

1. GitHub account
2. Railway account (https://railway.app) - Sign up with GitHub
3. Vercel account (https://vercel.com) - Sign up with GitHub

---

## 📦 Backend Deployment (Railway)

### Step 1: Push Code to GitHub

```bash
cd /Users/shivammishra/Desktop/cources/dairy-farm
git init
git add .
git commit -m "Initial commit - Dairy Farm Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dairy-farm.git
git push -u origin main
```

### Step 2: Deploy on Railway

1. **Go to Railway Dashboard**
   - Visit https://railway.app/dashboard
   - Click "New Project"

2. **Add PostgreSQL Database**
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create a database

3. **Add Backend Service**
   - Click "+ New" 
   - Select "GitHub Repo"
   - Choose your `dairy-farm` repository
   - Select "apps/backend" as the root directory

4. **Configure Environment Variables**
   
   In the Railway backend service settings, add:
   
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
   
   Note: `DATABASE_URL` will auto-populate from the PostgreSQL service

5. **Configure Build & Start Commands**
   
   - **Build Command**: 
     ```bash
     pnpm install && cd apps/backend && npx prisma generate && pnpm build
     ```
   
   - **Start Command**: 
     ```bash
     cd apps/backend && npx prisma migrate deploy && npx prisma db seed && node dist/main
     ```

6. **Configure Root Directory**
   - In Settings → Service → Root Directory: Leave as `/` or set to `apps/backend`

7. **Generate Domain**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the domain (e.g., `dairy-farm-backend.up.railway.app`)

8. **Deploy**
   - Railway will automatically deploy
   - Wait for build to complete (~3-5 minutes)
   - Check logs for any errors

### Verify Backend

Visit: `https://your-backend-domain.railway.app/health` (should return OK)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy on Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select your `dairy-farm` GitHub repository
   - Click "Import"

3. **Configure Project**
   
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd apps/web && pnpm build`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `pnpm install`

4. **Add Environment Variable**
   
   In the environment variables section, add:
   
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
   ```
   
   ⚠️ Replace `your-backend-domain.railway.app` with your actual Railway domain

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-4 minutes)

6. **Get Your URL**
   - Vercel will provide a URL like: `dairy-farm.vercel.app`
   - Visit your app!

---

## 🔐 Default Login Credentials

After deployment, you can login with:

```
Email:    admin@greenvaleyfarm.com
Password: password123

Email:    manager@greenvaleyfarm.com
Password: password123

Email:    worker@greenvaleyfarm.com
Password: password123
```

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

---

## 🎯 Alternative Free Hosting Options

### Backend Alternatives

#### Option 1: Render.com
1. Create account at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: dairy-farm-backend
   - **Root Directory**: apps/backend
   - **Environment**: Node
   - **Build Command**: `pnpm install && cd apps/backend && npx prisma generate && pnpm build`
   - **Start Command**: `cd apps/backend && npx prisma migrate deploy && node dist/main`
5. Add PostgreSQL database (Free tier)
6. Add environment variables (same as Railway)

#### Option 2: Fly.io
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
cd apps/backend
flyctl launch
flyctl postgres create
flyctl secrets set JWT_SECRET=your-secret DATABASE_URL=postgres://...
flyctl deploy
```

### Frontend Alternatives

#### Option 1: Netlify
1. Visit https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repo
4. Configure:
   - **Base directory**: apps/web
   - **Build command**: `cd apps/web && pnpm build`
   - **Publish directory**: apps/web/.next
5. Add environment variable: `NEXT_PUBLIC_API_URL`

---

## 🔄 Enable CORS on Backend

Update `apps/backend/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app',
  ],
  credentials: true,
});
```

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails on Railway:**
- Check build logs in Railway dashboard
- Ensure `package.json` has correct scripts
- Verify Prisma schema is valid

**Database connection errors:**
- Check `DATABASE_URL` environment variable
- Ensure PostgreSQL service is running
- Verify migrations ran successfully

**Seeding fails:**
- Comment out seed command temporarily: remove `&& npx prisma db seed` from start command
- Can seed manually later via Railway CLI

### Frontend Issues

**Build fails on Vercel:**
- Check build logs
- Ensure all dependencies are in package.json
- Verify TypeScript compilation passes locally

**API connection errors:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is accessible

**Environment variables not working:**
- Redeploy after adding environment variables
- Check variable names (must start with `NEXT_PUBLIC_`)

---

## 📊 Free Tier Limits

### Railway
- 500 hours/month execution time
- PostgreSQL: 1GB storage
- Shared CPU/RAM

### Vercel
- 100GB bandwidth/month
- Unlimited deployments
- Serverless functions

### Tips for Free Tier
- Railway sleeps after 30 min inactivity (first request takes ~10s)
- Use cron-job.org to ping your backend every 25 minutes to keep it alive
- Optimize images in frontend
- Enable caching where possible

---

## 🎉 You're Live!

Your Dairy Farm Management System is now deployed:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app
- **Database**: Managed by Railway

Share the frontend URL with your users! 🚀

---

## 📱 Next Steps

1. **Custom Domain** (Optional)
   - Vercel: Add custom domain in project settings
   - Railway: Add custom domain in service settings

2. **Security Hardening**
   - Change default passwords
   - Update JWT_SECRET to a strong random value
   - Enable 2FA on admin accounts

3. **Monitoring**
   - Set up Railway/Vercel alerts
   - Monitor error logs
   - Track usage metrics

4. **Backup Strategy**
   - Export database periodically
   - Railway PostgreSQL backups are automatic

---

Need help? Check:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
