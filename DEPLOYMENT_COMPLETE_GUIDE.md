# 🚀 Complete Deployment Guide - Dairy Farm Management System

## 📋 Table of Contents
1. [Git Workflow & Branch Strategy](#git-workflow--branch-strategy)
2. [Push to GitHub](#push-to-github)
3. [Development Deployment](#development-deployment)
4. [Production Deployment](#production-deployment)
5. [Environment Setup](#environment-setup)
6. [Testing Strategy](#testing-strategy)
7. [Rollback Strategy](#rollback-strategy)

---

## 🌳 Git Workflow & Branch Strategy

### Branch Structure
```
main (production)
  ↑
  └── staging (pre-production testing)
       ↑
       └── develop (development)
            ↑
            └── feature/* (new features)
```

### Setup Branches

```bash
# 1. Check current status
git status

# 2. Add all changes
git add .

# 3. Commit with descriptive message
git commit -m "feat: add phase view and milestone quick notes feature"

# 4. Push to main (initial setup)
git push -u origin main

# 5. Create develop branch
git checkout -b develop
git push -u origin develop

# 6. Create staging branch
git checkout -b staging
git push -u origin staging

# 7. Go back to develop for work
git checkout develop
```

---

## 📤 Push to GitHub

### Initial Push (if not done)
```bash
# 1. Check git status
git status

# 2. Stage all changes
git add .

# 3. Commit changes
git commit -m "feat: add farm development tracking with milestone notes"

# 4. Push to GitHub
git push origin main
```

### Regular Development Workflow
```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/milestone-quick-notes

# 2. Make your changes and commit
git add .
git commit -m "feat: implement milestone detail dialog with quick notes"

# 3. Push feature branch
git push origin feature/milestone-quick-notes

# 4. Create Pull Request on GitHub
# - Go to https://github.com/shivam1470/dairy-farm
# - Click "Pull requests" → "New pull request"
# - Base: develop ← Compare: feature/milestone-quick-notes
# - Add description and create PR
# - Merge after review

# 5. After merge, update develop locally
git checkout develop
git pull origin develop

# 6. Delete feature branch
git branch -d feature/milestone-quick-notes
git push origin --delete feature/milestone-quick-notes
```

---

## 🔧 Development Deployment

### Backend - Railway (Development)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Verify email

2. **Create New Project**
   ```
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: shivam1470/dairy-farm
   - Branch: develop
   ```

3. **Add PostgreSQL Database**
   ```
   - Click "+ New"
   - Select "Database"
   - Choose "PostgreSQL"
   - Wait for provisioning
   ```

4. **Configure Backend Service**
   ```
   - Click on your service
   - Go to "Settings"
   - Root Directory: apps/backend
   - Build Command: (leave default)
   - Start Command: npx prisma migrate deploy && node dist/main
   - Branch: develop
   ```

5. **Add Environment Variables**
   ```
   Go to "Variables" tab and add:
   
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-jwt-key-dev-123
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=https://your-dev-app.vercel.app
   ```

6. **Generate Domain**
   ```
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URL (e.g., https://dairy-farm-dev.railway.app)
   ```

### Frontend - Vercel (Development)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import project

2. **Import Project**
   ```
   - Click "Add New" → "Project"
   - Select: shivam1470/dairy-farm
   - Branch: develop
   ```

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://dairy-farm-dev.railway.app
   NODE_ENV=development
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy deployment URL

---

## 🏭 Production Deployment

### Step 1: Setup GitHub Actions for Testing

Create `.github/workflows/test.yml`:

```yaml
name: Test Pipeline

on:
  pull_request:
    branches: [staging, main]
  push:
    branches: [develop, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Type check
        run: pnpm typecheck
        
      - name: Lint
        run: pnpm lint
        
      - name: Build
        run: pnpm build
        
      - name: Test
        run: pnpm test

  notify:
    needs: test
    runs-on: ubuntu-latest
    if: success()
    steps:
      - name: Success notification
        run: echo "✅ All tests passed!"
```

### Step 2: Create Staging Environment

**Backend Staging (Railway)**
1. Create new service from GitHub
2. Branch: `staging`
3. Add same env variables with `_STAGING` suffix
4. Generate staging domain

**Frontend Staging (Vercel)**
1. Project Settings → Git
2. Add "staging" branch
3. Configure as Preview deployment
4. Set staging env variables

### Step 3: Production Setup

**Backend Production (Railway)**
```bash
# 1. Create new Railway service
# 2. Connect to GitHub repo
# 3. Branch: main
# 4. Configure environment:

DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<use-strong-random-secret>
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend Production (Vercel)**
```bash
# 1. Vercel Project Settings
# 2. Git → Production Branch: main
# 3. Environment Variables (Production):

NEXT_PUBLIC_API_URL=https://dairy-farm-prod.railway.app
NODE_ENV=production
```

### Step 4: Protected Branch Rules

**On GitHub:**
1. Go to Settings → Branches
2. Add rule for `main`:
   ```
   ✅ Require pull request before merging
   ✅ Require approvals (1)
   ✅ Require status checks to pass
   ✅ Require branches to be up to date
   ✅ Include administrators
   ```

3. Add rule for `staging`:
   ```
   ✅ Require pull request before merging
   ✅ Require status checks to pass
   ```

---

## 🚦 Complete Deployment Workflow

### Development → Staging → Production

```bash
# 1. DEVELOPMENT
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Make changes...
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create PR to develop → Review → Merge
# Auto-deploys to dev.yourdomain.com

# 2. STAGING (After testing in dev)
git checkout staging
git pull origin staging
git merge develop

# Run tests locally
pnpm typecheck
pnpm lint
pnpm test

git push origin staging

# Create PR to staging → Review → Merge
# Auto-deploys to staging.yourdomain.com
# Test thoroughly! ⚠️

# 3. PRODUCTION (After staging tests pass)
git checkout main
git pull origin main
git merge staging

git push origin main

# Create PR to main → Require approval → Merge
# Auto-deploys to yourdomain.com
```

---

## 🧪 Testing Strategy

### Before Deploying to Production

1. **Manual Testing Checklist** (on staging)
   ```
   ✅ User authentication (login/register)
   ✅ Dashboard loads correctly
   ✅ Add/Edit/Delete operations work
   ✅ Forms validation
   ✅ API responses are correct
   ✅ Mobile responsiveness
   ✅ Error handling
   ✅ Performance (load time < 3s)
   ```

2. **Automated Tests** (CI/CD)
   ```bash
   # Run locally before pushing
   pnpm typecheck  # Type safety
   pnpm lint       # Code quality
   pnpm build      # Build succeeds
   pnpm test       # Unit tests pass
   ```

3. **Database Migration Test**
   ```bash
   # On staging first!
   cd apps/backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## 🔄 Rollback Strategy

### If Production Breaks

**Quick Rollback (Railway)**
```bash
# 1. Go to Railway dashboard
# 2. Click on service → Deployments
# 3. Find last working deployment
# 4. Click "Redeploy"
```

**Quick Rollback (Vercel)**
```bash
# 1. Go to Vercel dashboard
# 2. Project → Deployments
# 3. Find last working deployment
# 4. Click "⋯" → "Promote to Production"
```

**Git Rollback**
```bash
# Find the commit to rollback to
git log --oneline

# Create revert commit
git revert <commit-hash>
git push origin main

# Or hard reset (use carefully!)
git reset --hard <commit-hash>
git push --force origin main
```

---

## 📊 Environment Variables Reference

### Development
```env
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/dairy_dev
JWT_SECRET=dev-secret-123
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### Staging
```env
# Backend
DATABASE_URL=<railway-postgres-staging>
JWT_SECRET=staging-secret-xyz
PORT=3001
NODE_ENV=staging
FRONTEND_URL=https://dairy-farm-staging.vercel.app

# Frontend
NEXT_PUBLIC_API_URL=https://dairy-farm-staging.railway.app
NODE_ENV=staging
```

### Production
```env
# Backend
DATABASE_URL=<railway-postgres-production>
JWT_SECRET=<strong-random-production-secret>
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://dairy-farm.vercel.app

# Frontend
NEXT_PUBLIC_API_URL=https://dairy-farm-production.railway.app
NODE_ENV=production
```

---

## 🎯 Quick Commands Reference

```bash
# Check current branch and status
git branch
git status

# Commit and push current work
git add .
git commit -m "feat: your feature description"
git push origin <branch-name>

# Switch branches
git checkout develop
git checkout staging
git checkout main

# Merge develop into staging
git checkout staging
git merge develop

# Merge staging into main
git checkout main
git merge staging

# Pull latest changes
git pull origin <branch-name>

# View commit history
git log --oneline --graph --all

# Stash changes temporarily
git stash
git stash pop
```

---

## 🚨 Important Notes

1. **Never push directly to main** - Always use PRs
2. **Test on staging first** - Production should only receive tested code
3. **Environment variables** - Never commit secrets to git
4. **Database backups** - Railway auto-backups daily
5. **Monitor deployments** - Check Railway/Vercel dashboards after deploy
6. **Version tagging** - Tag production releases
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All tests pass in CI/CD
- [ ] Code reviewed and approved
- [ ] Tested on staging environment
- [ ] Database migrations work correctly
- [ ] Environment variables configured
- [ ] No console errors in browser
- [ ] API endpoints respond correctly
- [ ] Mobile view tested
- [ ] Performance acceptable
- [ ] Error handling works
- [ ] Documentation updated
- [ ] Team notified about deployment

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

### Database Connection Error
```bash
# Check DATABASE_URL format
postgresql://user:password@host:port/database

# Test connection
npx prisma db push
```

### Frontend Can't Connect to Backend
```bash
# Check NEXT_PUBLIC_API_URL in Vercel
# Check CORS settings in backend
# Verify Railway service is running
```

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**Ready to Deploy? Start with the development environment first! 🚀**
