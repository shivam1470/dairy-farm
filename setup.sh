#!/bin/bash

echo "🐄 Setting up Dairy Farm Management Monorepo..."
echo ""

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Please install Docker to run PostgreSQL."
    echo "   Visit: https://docs.docker.com/get-docker/"
fi

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🐘 Starting PostgreSQL database..."
docker-compose -f infra/docker-compose.yml up -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "🔧 Generating Prisma Client..."
cd apps/backend
pnpm prisma generate

echo ""
echo "📊 Running database migrations..."
pnpm prisma migrate dev --name init

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Start all apps: pnpm dev"
echo "   2. Or start individually:"
echo "      - Backend: cd apps/backend && pnpm dev"
echo "      - Web: cd apps/web && pnpm dev"
echo "      - Mobile: cd apps/mobile && pnpm dev"
echo ""
echo "🌐 Access points:"
echo "   - Backend API: http://localhost:3001"
echo "   - Web App: http://localhost:3000"
echo "   - Prisma Studio: cd apps/backend && pnpm prisma studio"
echo "   - PgAdmin: http://localhost:5050 (admin@dairyfarm.com / admin)"
echo ""
