# 🐄 Dairy Farm Management Application

> **Complete full-stack dairy farm management system with animal tracking, milk records, expenses, workers, tasks, feeding logs, deliveries, and veterinary records.**

[![Deploy Backend](https://img.shields.io/badge/Deploy-Railway-blueviolet)](https://railway.app)
[![Deploy Frontend](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Quick Deploy (Free Hosting)

**Deploy in 20 minutes for FREE!**

📖 **[Quick Deploy Guide →](QUICK_DEPLOY.md)** | **[Visual Guide →](DEPLOY_VISUAL.md)** | **[Detailed Guide →](DEPLOYMENT.md)**

### Hosting Platforms (Free Tier)
- **Backend**: [Railway](https://railway.app) (PostgreSQL included)
- **Frontend**: [Vercel](https://vercel.com) (Unlimited deployments)

---

## 🏗️ Architecture

- **Backend**: NestJS + PostgreSQL + Prisma
- **Web**: Next.js 14 + Material UI + TypeScript
- **Mobile**: Expo (React Native) + Expo Router
- **Shared Packages**: TypeScript interfaces, UI components, configurations
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo

## ✨ Features

### 📊 Dashboard
- Real-time farm statistics
- Milk production trends
- Expense tracking charts
- Quick action buttons

### 🐮 Animal Management
- Complete animal profiles (tag number, breed, DOB, health status)
- Medical history tracking
- Vaccination records
- Card and table view modes

### 🥛 Milk Records
- Session-based recording (Morning/Evening)
- Quality tracking (Excellent/Good/Average)
- Fat content monitoring
- Animal-wise production reports

### 💰 Expense Management
- Category-based tracking (Feed, Medicine, Equipment, etc.)
- Payment method tracking
- Vendor management
- Monthly expense reports

### 👷 Worker Management
- Role-based assignments (Milker, Feeder, Cleaner, etc.)
- Shift scheduling (Morning/Evening/Night)
- Salary management
- Contact information

### ✅ Task Management
- Priority-based tasks (High/Medium/Low)
- Status tracking (Pending/In Progress/Completed)
- Worker assignments
- Due date management

### 🌾 Feeding Logs
- Feed type tracking (Hay, Silage, Concentrate, etc.)
- Quantity and cost monitoring
- Time-based feeding (Morning/Afternoon/Evening)
- Animal-wise feeding history

### 🚚 Delivery Tracking
- Buyer management
- Quantity and pricing
- Payment status (Paid/Pending/Partial)
- Delivery status tracking

### 🏥 Veterinary Records
- Visit scheduling
- Treatment tracking
- Diagnosis and prescriptions
- Cost management
- Follow-up scheduling

---

## 📁 Project Structure

```
dairy-farm/
├── apps/
│   ├── backend/        # NestJS API
│   ├── web/            # Next.js web application
│   └── mobile/         # Expo mobile app
├── packages/
│   ├── ui/             # Shared React components (MUI)
│   ├── types/          # Shared TypeScript types/interfaces
│   └── config/         # Shared eslint, tsconfig, prettier
├── infra/
│   ├── docker-compose.yml
│   └── migrations/     # Prisma migrations
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (for PostgreSQL)

### Installation

```bash
# Install dependencies
pnpm install

# Start PostgreSQL database
docker-compose -f infra/docker-compose.yml up -d

# Run Prisma migrations
cd apps/backend
pnpm prisma migrate dev

# Start all applications in development mode
pnpm dev
```

## 📦 Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all packages
- `pnpm test` - Run all tests
- `pnpm format` - Format code with Prettier

## 🔧 Individual Apps

### Backend (NestJS)
```bash
cd apps/backend
pnpm dev          # Start dev server on port 3001
pnpm build        # Build for production
pnpm prisma studio # Open Prisma Studio
```

### Web (Next.js)
```bash
cd apps/web
pnpm dev          # Start dev server on port 3000
pnpm build        # Build for production
```

### Mobile (Expo)
```bash
cd apps/mobile
pnpm dev          # Start Expo dev server
pnpm ios          # Run on iOS simulator
pnpm android      # Run on Android emulator
```

## 🗄️ Database Schema

Core entities:
- User (authentication & authorization)
- Farm (farm details)
- Animal (livestock tracking)
- MilkRecord (daily milk production)
- Expense (farm expenses)
- Worker (employee management)
- Task (daily tasks)
- FeedingLog (feeding schedules)
- DeliveryLog (milk deliveries)
- VetVisit (veterinary records)

## 🔐 Environment Variables

Create `.env` files in each app:

**apps/backend/.env**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dairy_farm"
JWT_SECRET="your-secret-key"
PORT=3001
```

**apps/web/.env.local**
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

**apps/mobile/.env**
```
EXPO_PUBLIC_API_URL="http://localhost:3001"
```

## 📱 Features

- ✅ User Authentication & Authorization
- ✅ Animal/Livestock Management
- ✅ Milk Production Tracking
- ✅ Expense Management
- ✅ Worker Management
- ✅ Task Scheduling
- ✅ Feeding Logs
- ✅ Delivery Tracking
- ✅ Veterinary Records
- ✅ Dashboard & Analytics
- ✅ Offline-first mobile app

## 🤝 Contributing

This is a monorepo managed with Turborepo and pnpm workspaces. Please follow the established patterns when adding new features.

## 📄 License

MIT
