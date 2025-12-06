import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AnimalsModule } from './animals/animals.module';
import { MilkRecordsModule } from './milk-records/milk-records.module';
import { ExpensesModule } from './expenses/expenses.module';
import { WorkersModule } from './workers/workers.module';
import { TasksModule } from './tasks/tasks.module';
import { FeedingModule } from './feeding/feeding.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { VetModule } from './vet/vet.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AnimalsModule,
    MilkRecordsModule,
    ExpensesModule,
    WorkersModule,
    TasksModule,
    FeedingModule,
    DeliveriesModule,
    VetModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
