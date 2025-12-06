# 🚀 Deploy in 3 Steps (20 Minutes)

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: PUSH TO GITHUB (5 min)                            │
└─────────────────────────────────────────────────────────────┘

1. Create repo at: https://github.com/new
   Name: dairy-farm

2. Run in terminal:
   cd /Users/shivammishra/Desktop/cources/dairy-farm
   git init
   git add .
   git commit -m "Initial deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dairy-farm.git
   git push -u origin main

✅ Code is on GitHub!


┌─────────────────────────────────────────────────────────────┐
│  STEP 2: DEPLOY BACKEND ON RAILWAY (10 min)                │
└─────────────────────────────────────────────────────────────┘

Website: https://railway.app

1. Sign up with GitHub

2. Click "New Project" → "Deploy from GitHub repo"
   → Select "dairy-farm"

3. Add PostgreSQL:
   Click "+ New" → "Database" → "PostgreSQL"

4. Configure backend service:
   
   Environment Variables:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NODE_ENV=production
   JWT_SECRET=your-secret-key-change-this
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Build Command:
   pnpm install && cd apps/backend && npx prisma generate && pnpm build

   Start Command:
   cd apps/backend && npx prisma migrate deploy && npx prisma db seed && node dist/main

5. Settings → Networking → "Generate Domain"
   📋 COPY THIS URL! You'll need it for frontend.

✅ Backend deployed! Visit: https://your-url.railway.app/health


┌─────────────────────────────────────────────────────────────┐
│  STEP 3: DEPLOY FRONTEND ON VERCEL (5 min)                 │
└─────────────────────────────────────────────────────────────┘

Website: https://vercel.com

1. Sign up with GitHub

2. Click "Add New..." → "Project"
   → Import "dairy-farm" repo

3. Configure:
   Framework Preset: Next.js
   Root Directory: apps/web

4. Add Environment Variable:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   (Paste your Railway URL from Step 2.5)

5. Click "Deploy"

✅ Frontend deployed! Visit your Vercel URL!


┌─────────────────────────────────────────────────────────────┐
│  🎉 YOU'RE LIVE!                                           │
└─────────────────────────────────────────────────────────────┘

Frontend: https://dairy-farm.vercel.app
Backend:  https://dairy-farm-backend.railway.app
Database: Managed by Railway

Login:
  Email: admin@greenvaleyfarm.com
  Password: password123


┌─────────────────────────────────────────────────────────────┐
│  🔧 TROUBLESHOOTING                                        │
└─────────────────────────────────────────────────────────────┘

❌ Frontend can't connect to backend?
  → Check NEXT_PUBLIC_API_URL is correct in Vercel
  → Redeploy frontend after adding environment variable

❌ Backend build fails?
  → Check build logs in Railway dashboard
  → Try clicking "Redeploy"

❌ Database connection error?
  → Verify DATABASE_URL uses: ${{Postgres.DATABASE_URL}}
  → Restart backend service

❌ Login doesn't work?
  → Wait 1-2 min for seeding to complete
  → Check backend /health endpoint is accessible


┌─────────────────────────────────────────────────────────────┐
│  💰 COSTS                                                  │
└─────────────────────────────────────────────────────────────┘

Railway:  $5 credit (free trial) → ~500 hours/month
Vercel:   FREE FOREVER (Hobby plan)

Total: $0 for first month, then $5/month for Railway
       (or switch to Render.com for free tier)


┌─────────────────────────────────────────────────────────────┐
│  📱 BONUS: PWA MOBILE SUPPORT                              │
└─────────────────────────────────────────────────────────────┘

Your app already works on mobile browsers!
Users can "Add to Home Screen" for app-like experience.


┌─────────────────────────────────────────────────────────────┐
│  🔄 UPDATING YOUR APP                                      │
└─────────────────────────────────────────────────────────────┘

Just push to GitHub:
  git add .
  git commit -m "Update: description"
  git push

Both Railway and Vercel auto-deploy! 🚀


Need detailed help? See: DEPLOYMENT.md
```
