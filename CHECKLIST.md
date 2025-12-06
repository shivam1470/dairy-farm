# 📋 Installation Checklist

Follow this checklist to ensure proper setup:

## Prerequisites ✓

- [ ] Node.js >= 18.0.0 installed
- [ ] pnpm >= 8.0.0 installed (`npm install -g pnpm`)
- [ ] Docker Desktop installed and running
- [ ] Git installed

## Initial Setup ✓

- [ ] Navigate to project directory: `cd dairy-farm`
- [ ] Make setup script executable: `chmod +x setup.sh`
- [ ] Run setup script: `./setup.sh`

OR manually:

- [ ] Install dependencies: `pnpm install`
- [ ] Start PostgreSQL: `docker-compose -f infra/docker-compose.yml up -d`
- [ ] Generate Prisma client: `cd apps/backend && pnpm prisma generate`
- [ ] Run migrations: `pnpm prisma migrate dev`

## Verify Setup ✓

- [ ] PostgreSQL running: `docker ps` (should show dairy-farm-postgres)
- [ ] Database accessible: `cd apps/backend && pnpm prisma studio`
- [ ] No TypeScript errors: `pnpm typecheck`

## Start Development ✓

- [ ] Start all apps: `pnpm dev`

OR individually:

- [ ] Backend: `cd apps/backend && pnpm dev` → http://localhost:3001
- [ ] Web: `cd apps/web && pnpm dev` → http://localhost:3000
- [ ] Mobile: `cd apps/mobile && pnpm dev` → Expo dev server

## Test API ✓

- [ ] Create test user via POST http://localhost:3001/auth/register
- [ ] Login via POST http://localhost:3001/auth/login
- [ ] Access protected endpoint with token

## Access Services ✓

- [ ] Backend API: http://localhost:3001
- [ ] Web App: http://localhost:3000
- [ ] Prisma Studio: http://localhost:5555 (run `pnpm prisma studio` in backend)
- [ ] PgAdmin: http://localhost:5050 (user: admin@dairyfarm.com, pass: admin)

## Optional: Mobile Setup ✓

For iOS (macOS only):
- [ ] Install Xcode from App Store
- [ ] Install iOS Simulator
- [ ] Run: `cd apps/mobile && pnpm ios`

For Android:
- [ ] Install Android Studio
- [ ] Set up Android emulator
- [ ] Run: `cd apps/mobile && pnpm android`

For Physical Device:
- [ ] Install Expo Go app on device
- [ ] Ensure device and computer on same network
- [ ] Update `.env` with your IP address
- [ ] Scan QR code from Expo dev server

## Troubleshooting ✓

If you encounter issues:

- [ ] Port 3001 in use? `kill -9 $(lsof -ti:3001)`
- [ ] Port 3000 in use? `kill -9 $(lsof -ti:3000)`
- [ ] Database not connecting? Restart: `docker-compose -f infra/docker-compose.yml restart`
- [ ] Prisma errors? Regenerate: `cd apps/backend && pnpm prisma generate`
- [ ] Type errors? Install deps: `pnpm install`
- [ ] Clear caches: `pnpm clean && pnpm install`

## Next Steps ✓

- [ ] Read README.md for project overview
- [ ] Read SETUP.md for detailed instructions
- [ ] Read API.md for endpoint documentation
- [ ] Read PROJECT_SUMMARY.md for complete feature list

## Development Workflow ✓

- [ ] Create feature branch: `git checkout -b feature/your-feature`
- [ ] Make changes
- [ ] Test: `pnpm typecheck && pnpm lint && pnpm test`
- [ ] Commit: `git commit -m "feat: your feature"`
- [ ] Push: `git push origin feature/your-feature`

---

**✅ Once all checkboxes are complete, you're ready to develop!**
