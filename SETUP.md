# 🐄 Dairy Farm Management System - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 (Install: `npm install -g pnpm`)
- **Docker & Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/downloads))

For mobile development:
- **Expo CLI** (Install: `npm install -g expo-cli`)
- **iOS Simulator** (macOS only) or **Android Studio** for Android emulator

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd dairy-farm

# Make setup script executable
chmod +x setup.sh

# Run automated setup
./setup.sh
```

This script will:
- Install all dependencies
- Start PostgreSQL database
- Generate Prisma client
- Run database migrations

### 2. Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker-compose -f infra/docker-compose.yml up -d

# Generate Prisma client
cd apps/backend
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Go back to root
cd ../..
```

## 🏃 Running the Applications

### Start All Applications (Recommended)

```bash
pnpm dev
```

This starts:
- Backend API on `http://localhost:3001`
- Web app on `http://localhost:3000`
- Mobile app (Expo dev server)

### Start Individual Applications

**Backend:**
```bash
cd apps/backend
pnpm dev
```

**Web:**
```bash
cd apps/web
pnpm dev
```

**Mobile:**
```bash
cd apps/mobile
pnpm dev

# Then choose platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app
```

## 🗄️ Database Management

### Prisma Studio (Visual Database Editor)

```bash
cd apps/backend
pnpm prisma studio
```

Access at: `http://localhost:5555`

### PgAdmin (Alternative)

Access at: `http://localhost:5050`
- Email: `admin@dairyfarm.com`
- Password: `admin`

### Create Database Migration

```bash
cd apps/backend
pnpm prisma migrate dev --name your_migration_name
```

## 📝 Environment Variables

### Backend (.env)

Located at: `apps/backend/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dairy_farm"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV=development
```

### Web (.env.local)

Located at: `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Mobile (.env)

Located at: `apps/mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

**Important:** For mobile, if running on physical device, replace `localhost` with your computer's IP address.

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
cd apps/backend && pnpm test
cd apps/web && pnpm test
```

## 🔍 Type Checking

```bash
# Check types across all packages
pnpm typecheck

# Check specific app
cd apps/backend && pnpm typecheck
```

## 🎨 Linting & Formatting

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format
```

## 📦 Building for Production

```bash
# Build all apps
pnpm build

# Build specific app
cd apps/backend && pnpm build
cd apps/web && pnpm build
cd apps/mobile && pnpm build
```

## 📱 Mobile App Development

### iOS (macOS only)

```bash
cd apps/mobile
pnpm ios
```

### Android

```bash
cd apps/mobile
pnpm android
```

### Expo Go App

1. Install Expo Go on your device
2. Run `pnpm dev` in mobile directory
3. Scan QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## 🔐 Default Test User

After running migrations, you can create a test user:

```bash
# Using Prisma Studio or API endpoint
POST http://localhost:3001/auth/register
{
  "email": "admin@dairyfarm.com",
  "password": "password123",
  "name": "Farm Admin",
  "farmName": "My Dairy Farm"
}
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose -f infra/docker-compose.yml restart

# View logs
docker-compose -f infra/docker-compose.yml logs
```

### Port Already in Use

```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

### Prisma Client Issues

```bash
cd apps/backend
pnpm prisma generate
pnpm prisma migrate reset  # Warning: This will delete all data
```

### Mobile App Not Loading

1. Ensure your device and computer are on the same network
2. Update API URL in `.env` to use computer's IP address
3. Clear Expo cache: `expo start -c`

## 📚 Project Structure

```
dairy-farm/
├── apps/
│   ├── backend/        # NestJS API
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── animals/
│   │   │   ├── milk-records/
│   │   │   ├── expenses/
│   │   │   ├── workers/
│   │   │   ├── tasks/
│   │   │   ├── feeding/
│   │   │   ├── deliveries/
│   │   │   └── vet/
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── web/            # Next.js App
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── lib/
│   │   │   ├── store/
│   │   │   └── theme/
│   │   └── package.json
│   └── mobile/         # Expo App
│       ├── app/
│       ├── src/
│       └── package.json
├── packages/
│   ├── types/          # Shared TypeScript types
│   ├── ui/             # Shared UI components
│   └── config/         # Shared configs
├── infra/
│   └── docker-compose.yml
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

## 🔄 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** in the appropriate app or package

3. **Test your changes**
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

## 📖 API Documentation

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Resource Endpoints

All resources follow RESTful conventions:
- `GET /{resource}` - List all
- `GET /{resource}/:id` - Get one
- `POST /{resource}` - Create
- `PATCH /{resource}/:id` - Update
- `DELETE /{resource}/:id` - Delete

Resources: `animals`, `milk-records`, `expenses`, `workers`, `tasks`, `feeding`, `deliveries`, `vet`

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass before submitting PR

## 📄 License

MIT

## 💡 Tips

- Use Turbo for faster builds: `pnpm build` with caching
- Keep shared types in `packages/types` for consistency
- Use Prisma Studio for easy database inspection
- Mobile hot reload works across all platforms
- Check backend logs for API errors

## 🆘 Getting Help

- Check existing issues in the repository
- Review NestJS, Next.js, and Expo documentation
- Ensure all services are running
- Check environment variables are set correctly

---

Happy farming! 🐄🥛
