#!/bin/bash

# Dairy Farm Deployment Helper Script

echo "🚀 Dairy Farm Management System - Deployment Helper"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
  echo "📦 Initializing Git repository..."
  git init
  git branch -M main
else
  echo "✅ Git repository already initialized"
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Deploy: Dairy Farm Management System - $(date +%Y-%m-%d)"

# Ask for GitHub repository URL
echo ""
echo "📌 Please create a repository on GitHub:"
echo "   1. Go to https://github.com/new"
echo "   2. Name it: dairy-farm"
echo "   3. Don't initialize with README, .gitignore, or license"
echo ""
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/dairy-farm.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ No repository URL provided. Exiting..."
  exit 1
fi

# Check if remote already exists
if git remote | grep -q origin; then
  echo "🔄 Updating remote origin..."
  git remote set-url origin "$REPO_URL"
else
  echo "➕ Adding remote origin..."
  git remote add origin "$REPO_URL"
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "BACKEND DEPLOYMENT (Railway):"
echo "1. Go to https://railway.app/dashboard"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select your dairy-farm repository"
echo "4. Add PostgreSQL database: Click '+ New' → 'Database' → 'PostgreSQL'"
echo "5. In backend service, add these environment variables:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=$(openssl rand -base64 32)"
echo "   - DATABASE_URL=\${{Postgres.DATABASE_URL}}"
echo "6. Set Root Directory to: apps/backend"
echo "7. Build Command: pnpm install && cd apps/backend && npx prisma generate && pnpm build"
echo "8. Start Command: cd apps/backend && npx prisma migrate deploy && npx prisma db seed && node dist/main"
echo "9. Generate domain and copy it"
echo ""
echo "FRONTEND DEPLOYMENT (Vercel):"
echo "1. Go to https://vercel.com/new"
echo "2. Import your dairy-farm repository"
echo "3. Framework Preset: Next.js"
echo "4. Root Directory: apps/web"
echo "5. Add environment variable:"
echo "   - NEXT_PUBLIC_API_URL=https://your-railway-domain.railway.app"
echo "6. Click Deploy"
echo ""
echo "📖 Full deployment guide: See DEPLOYMENT.md"
echo ""
