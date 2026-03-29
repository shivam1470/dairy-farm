# 🐄 Dairy Farm Management Application

> **Complete full-stack dairy farm management system with animal tracking, milk records, expenses, workers, tasks, feeding logs, deliveries, veterinary records, and payment tracking.**

[![Deploy Backend](https://img.shields.io/badge/Deploy-Render-blueviolet)](https://render.com)
[![Deploy Frontend](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Features

- **🐄 Animal Management**: Track cattle, health records, breeding cycles
- **🥛 Milk Production**: Daily milk records, quality tracking, yield analytics
- **💰 Financial Management**: Income/expense tracking, payment methods, wallet summary
- **👥 Worker Management**: Staff scheduling, task assignments, performance tracking
- **📋 Task Management**: Daily farm operations, maintenance schedules
- **🍽️ Feeding Logs**: Feed inventory, ration planning, consumption tracking
- **🚚 Delivery Management**: Milk delivery routes, customer management
- **🏥 Veterinary Records**: Health checkups, treatments, medical history
- **📊 Farm Development**: Phase-based development tracking, milestone management

## 🚀 Quick Deploy (Free Hosting)

**Deploy in 20 minutes for FREE!**

### Hosting Platforms (Free Tier)
- **Backend**: [Render](https://render.com) (PostgreSQL included)
- **Frontend**: [Vercel](https://vercel.com) (Unlimited deployments)

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker Desktop (for local development)

### Local Development Setup

```bash
# Install dependencies
pnpm install

# Configure required backend env vars
cp apps/backend/.env.example apps/backend/.env

# Start PostgreSQL database
pnpm db:start

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed database with sample data
pnpm db:seed

# Start development servers
pnpm dev
```

## 📁 Project Structure

```
dairy-farm/
├── apps/
│   ├── backend/         # NestJS API server
│   ├── web/            # Next.js frontend
│   └── mobile/         # Expo React Native app
├── packages/
│   ├── types/          # Shared TypeScript types
│   ├── ui/             # Shared UI components
│   └── config/         # Shared configurations
├── infra/
│   └── docker-compose.yml  # Local PostgreSQL setup
└── deployment configs   # Vercel & Render configs
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Material-UI, Zustand, Formik
- **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL
- **Mobile**: Expo, React Native
- **Database**: PostgreSQL with Prisma migrations
- **Authentication**: JWT with bcrypt hashing
- **Deployment**: Vercel (frontend) + Render (backend)

## 📊 API Endpoints

### Core Resources
- `GET/POST /animals` - Animal management
- `GET/POST /milk-records` - Milk production tracking
- `GET/POST /payments` - Financial transactions
- `GET/POST /expenses` - Expense tracking
- `GET/POST /workers` - Staff management
- `GET/POST /tasks` - Task management
- `GET/POST /feeding` - Feeding logs
- `GET/POST /deliveries` - Delivery management
- `GET/POST /vet` - Veterinary records

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Start individual services
pnpm backend:dev
pnpm web:dev
pnpm mobile:dev

# Database operations
pnpm db:start      # Start PostgreSQL
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed database

# Code quality
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript checking
pnpm format       # Code formatting
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm run build`
4. Set start command: `npm run start:prod`
5. Add environment variables from `.env.example`

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Next.js settings
3. Add environment variables for API URL
4. Deploy automatically on git push

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="set-a-strong-secret-value"
PORT=3001
```

`JWT_SECRET` is required in every environment. The backend now fails fast at startup if it is missing.

The development-only `/seed` route is disabled unless `LOCAL_SEED_ENABLED="true"` and requests include the `x-seed-token` header matching `SEED_SECRET`.

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="https://your-render-backend-url"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/shivam1470/dairy-farm/issues) page
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

---

**Happy farming! 🌾🐄🥛**
