# 🚀 Quick Reference Guide

## Most Common Commands

### Development
```bash
# Start everything
pnpm dev

# Start individual apps
cd apps/backend && pnpm dev
cd apps/web && pnpm dev
cd apps/mobile && pnpm dev

# Install dependencies
pnpm install

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format code
pnpm format

# Clean build files
pnpm clean
```

### Database
```bash
# Prisma Studio (visual editor)
cd apps/backend && pnpm prisma studio

# Generate Prisma Client
cd apps/backend && pnpm prisma generate

# Create migration
cd apps/backend && pnpm prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
cd apps/backend && pnpm prisma migrate reset

# View database
cd apps/backend && pnpm prisma studio
```

### Docker
```bash
# Start database
docker-compose -f infra/docker-compose.yml up -d

# Stop database
docker-compose -f infra/docker-compose.yml down

# Restart database
docker-compose -f infra/docker-compose.yml restart

# View logs
docker-compose -f infra/docker-compose.yml logs

# Remove volumes (⚠️ deletes all data)
docker-compose -f infra/docker-compose.yml down -v
```

### Mobile (Expo)
```bash
cd apps/mobile

# Start dev server
pnpm dev

# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Clear cache
expo start -c

# Build for production
pnpm build
```

## Ports & URLs

| Service | Port | URL |
|---------|------|-----|
| Backend API | 3001 | http://localhost:3001 |
| Web App | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Prisma Studio | 5555 | http://localhost:5555 |
| PgAdmin | 5050 | http://localhost:5050 |

## Key File Locations

### Configuration
- Root package.json: `/package.json`
- Turborepo config: `/turbo.json`
- pnpm workspace: `/pnpm-workspace.yaml`
- Docker compose: `/infra/docker-compose.yml`

### Backend
- Main file: `/apps/backend/src/main.ts`
- App module: `/apps/backend/src/app.module.ts`
- Prisma schema: `/apps/backend/prisma/schema.prisma`
- Environment: `/apps/backend/.env`

### Web
- App directory: `/apps/web/src/app/`
- API client: `/apps/web/src/lib/api.ts`
- Auth store: `/apps/web/src/store/authStore.ts`
- Theme: `/apps/web/src/theme/index.ts`
- Environment: `/apps/web/.env.local`

### Mobile
- App directory: `/apps/mobile/app/`
- API client: `/apps/mobile/src/lib/api.ts`
- Auth store: `/apps/mobile/src/store/authStore.ts`
- Environment: `/apps/mobile/.env`

### Shared
- Types: `/packages/types/src/index.ts`
- UI components: `/packages/ui/src/`
- Config: `/packages/config/`

## API Endpoints Quick Reference

### Auth
```
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Resources
All follow REST pattern:
```
GET    /{resource}           # List all
GET    /{resource}/:id       # Get one
POST   /{resource}           # Create
PATCH  /{resource}/:id       # Update
DELETE /{resource}/:id       # Delete
```

Resources: animals, milk-records, expenses, workers, tasks, feeding, deliveries, vet

## Database Tables

1. users
2. farms
3. animals
4. milk_records
5. expenses
6. workers
7. tasks
8. feeding_logs
9. delivery_logs
10. vet_visits

## Common Issues & Fixes

### Port Already in Use
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed
```bash
# Check if Docker is running
docker ps

# Restart PostgreSQL
docker-compose -f infra/docker-compose.yml restart
```

### Prisma Client Not Generated
```bash
cd apps/backend
pnpm prisma generate
```

### Type Errors
```bash
# Install all dependencies
pnpm install

# Generate Prisma client
cd apps/backend && pnpm prisma generate
```

### Mobile App Not Connecting
```bash
# Update .env with your computer's IP
# Find IP: ifconfig (macOS/Linux) or ipconfig (Windows)
# Update apps/mobile/.env:
EXPO_PUBLIC_API_URL=http://192.168.1.X:3001
```

## Environment Variables Template

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dairy_farm"
JWT_SECRET="change-this-to-a-secure-secret"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV=development
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Mobile (.env)
```env
# For localhost
EXPO_PUBLIC_API_URL=http://localhost:3001

# For physical device (replace with your IP)
EXPO_PUBLIC_API_URL=http://192.168.1.X:3001
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of feature"

# Push branch
git push origin feature/your-feature-name

# After merge, update main
git checkout main
git pull origin main
```

## Useful Scripts

### Create new module (backend)
```bash
cd apps/backend
npx nest generate module module-name
npx nest generate controller module-name
npx nest generate service module-name
```

### Create new page (web)
```bash
# Just create file in apps/web/src/app/your-page/page.tsx
```

### Create new screen (mobile)
```bash
# Just create file in apps/mobile/app/your-screen.tsx
```

## Testing Commands

```bash
# Run all tests
pnpm test

# Run tests for specific app
cd apps/backend && pnpm test
cd apps/web && pnpm test

# Run tests in watch mode
cd apps/backend && pnpm test:watch

# Run with coverage
cd apps/backend && pnpm test:cov
```

## Production Build

```bash
# Build all apps
pnpm build

# Build specific app
cd apps/backend && pnpm build
cd apps/web && pnpm build
cd apps/mobile && pnpm build

# Run production backend
cd apps/backend && pnpm start:prod

# Run production web
cd apps/web && pnpm start
```

## Prisma Commands

```bash
cd apps/backend

# Generate client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name your_migration

# Apply migrations
pnpm prisma migrate deploy

# Studio (visual editor)
pnpm prisma studio

# Format schema
pnpm prisma format

# Validate schema
pnpm prisma validate

# Pull schema from database
pnpm prisma db pull

# Push schema to database (dev only)
pnpm prisma db push
```

---

**💡 Tip:** Bookmark this page for quick access to common commands!
