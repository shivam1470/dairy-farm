import { Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Post('seed')
  async seed() {
    try {
      console.log('🌱 Starting database seeding...');

      // Clear existing data
      await this.prisma.$executeRaw`TRUNCATE TABLE "vet_visits" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "delivery_logs" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "feeding_logs" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "tasks" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "workers" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "expenses" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "milk_records" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "animals" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "farms" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "farm_development_phases" CASCADE`;
      await this.prisma.$executeRaw`TRUNCATE TABLE "development_milestones" CASCADE`;

      // Create Farm
      const farm = await this.prisma.farm.create({
        data: {
          name: 'Green Valley Dairy Farm',
          location: 'Punjab, India',
          totalArea: 25.5,
          ownerName: 'Aniket Mishra',
          contactNumber: '+91-98765-43210',
        },
      });
      console.log('✅ Farm created:', farm.name);

      // Create Users
      const hashedPassword = await bcrypt.hash('password123', 10);

      const adminUser = await this.prisma.user.create({
        data: {
          email: 'admin@greenvaleyfarm.com',
          password: hashedPassword,
          name: 'Aniket Mishra',
          role: 'ADMIN',
          farmId: farm.id,
        },
      });

      const managerUser = await this.prisma.user.create({
        data: {
          email: 'manager@greenvaleyfarm.com',
          password: hashedPassword,
          name: 'Priya Sharma',
          role: 'MANAGER',
          farmId: farm.id,
        },
      });

      console.log('✅ Users created');
      console.log('🌱 Database seeding completed successfully!');

      return {
        success: true,
        message: 'Database seeded successfully',
        data: {
          farm: { id: farm.id, name: farm.name },
          users: [
            { email: adminUser.email, role: adminUser.role },
            { email: managerUser.email, role: managerUser.role },
          ],
        },
      };
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      return {
        success: false,
        message: 'Database seeding failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  root() {
    return {
      message: 'Dairy Farm Management API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/auth',
        animals: '/animals',
        milkRecords: '/milk-records',
        expenses: '/expenses',
        workers: '/workers',
        tasks: '/tasks',
        feeding: '/feeding',
        deliveries: '/deliveries',
        vet: '/vet',
      },
    };
  }
}
