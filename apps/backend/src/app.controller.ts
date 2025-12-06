import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
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
