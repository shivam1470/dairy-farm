import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.$executeRaw`TRUNCATE TABLE "vet_visits" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "delivery_logs" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "feeding_logs" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "tasks" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "workers" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "expenses" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "milk_records" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "animals" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "farms" CASCADE`;

  // Create Farm
  const farm = await prisma.farm.create({
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
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@greenvaleyfarm.com',
      password: hashedPassword,
      name: 'Aniket Mishra',
      role: 'ADMIN',
      farmId: farm.id,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@greenvaleyfarm.com',
      password: hashedPassword,
      name: 'Priya Sharma',
      role: 'MANAGER',
      farmId: farm.id,
    },
  });

  const workerUser = await prisma.user.create({
    data: {
      email: 'worker@greenvaleyfarm.com',
      password: hashedPassword,
      name: 'Ram Kumar',
      role: 'WORKER',
      farmId: farm.id,
    },
  });

  console.log('✅ Users created: Admin, Manager, Worker');

  // Create Animals
  const animals = await Promise.all([
    prisma.animal.create({
      data: {
        tagNumber: 'A001',
        name: 'Ganga',
        breed: 'Holstein',
        dateOfBirth: new Date('2020-03-15'),
        gender: 'FEMALE',
        category: 'COW',
        status: 'ACTIVE',
        farmId: farm.id,
        purchaseDate: new Date('2020-06-01'),
        purchasePrice: 75000,
        currentWeight: 550,
        notes: 'High milk producer, regular vaccination schedule maintained',
      },
    }),
    prisma.animal.create({
      data: {
        tagNumber: 'A002',
        name: 'Yamuna',
        breed: 'Jersey',
        dateOfBirth: new Date('2021-01-20'),
        gender: 'FEMALE',
        category: 'COW',
        status: 'PREGNANT',
        farmId: farm.id,
        purchaseDate: new Date('2021-04-15'),
        purchasePrice: 65000,
        currentWeight: 480,
        notes: 'Pregnant - Expected delivery in 2 months. Special diet required',
      },
    }),
    prisma.animal.create({
      data: {
        tagNumber: 'A003',
        name: 'Saraswati',
        breed: 'Gir',
        dateOfBirth: new Date('2019-11-10'),
        gender: 'FEMALE',
        category: 'COW',
        status: 'ACTIVE',
        farmId: farm.id,
        purchaseDate: new Date('2020-02-01'),
        purchasePrice: 80000,
        currentWeight: 600,
        notes: 'Indigenous breed, disease resistant, produces A2 milk',
      },
    }),
    prisma.animal.create({
      data: {
        tagNumber: 'A004',
        name: 'Lakshmi',
        breed: 'Sahiwal',
        dateOfBirth: new Date('2020-08-05'),
        gender: 'FEMALE',
        category: 'COW',
        status: 'ACTIVE',
        farmId: farm.id,
        purchaseDate: new Date('2020-11-20'),
        purchasePrice: 72000,
        currentWeight: 520,
        notes: 'Heat tolerant breed, good milk quality',
      },
    }),
    prisma.animal.create({
      data: {
        tagNumber: 'A005',
        name: 'Nandi',
        breed: 'Holstein',
        dateOfBirth: new Date('2022-02-14'),
        gender: 'MALE',
        category: 'BULL',
        status: 'ACTIVE',
        farmId: farm.id,
        purchaseDate: new Date('2022-06-01'),
        purchasePrice: 95000,
        currentWeight: 750,
        notes: 'Breeding bull, good genetic traits',
      },
    }),
    prisma.animal.create({
      data: {
        tagNumber: 'A006',
        name: 'Parvati',
        breed: 'Crossbreed',
        dateOfBirth: new Date('2023-05-20'),
        gender: 'FEMALE',
        category: 'HEIFER',
        status: 'ACTIVE',
        farmId: farm.id,
        purchaseDate: new Date('2023-08-15'),
        purchasePrice: 45000,
        currentWeight: 320,
        notes: 'Young heifer, will be ready for breeding in 6 months',
      },
    }),
  ]);
  console.log('✅ Animals created:', animals.length);

  // Create Milk Records (last 30 days)
  const milkRecords = [];
  const milkProducingAnimals = animals.filter(a => a.category === 'COW' && a.status !== 'SICK');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    for (const animal of milkProducingAnimals) {
      // Morning session
      milkRecords.push(
        prisma.milkRecord.create({
          data: {
            animalId: animal.id,
            farmId: farm.id,
            date: new Date(date.setHours(6, 0, 0, 0)),
            session: 'MORNING',
            quantity: 10 + Math.random() * 8,
            fatContent: 3.5 + Math.random() * 1.5,
            quality: ['EXCELLENT', 'GOOD', 'AVERAGE'][Math.floor(Math.random() * 3)] as any,
            notes: i === 0 ? 'Fresh morning milk' : null,
          },
        })
      );
      
      // Evening session
      milkRecords.push(
        prisma.milkRecord.create({
          data: {
            animalId: animal.id,
            farmId: farm.id,
            date: new Date(date.setHours(18, 0, 0, 0)),
            session: 'EVENING',
            quantity: 8 + Math.random() * 6,
            fatContent: 3.2 + Math.random() * 1.3,
            quality: ['EXCELLENT', 'GOOD', 'GOOD'][Math.floor(Math.random() * 3)] as any,
          },
        })
      );
    }
  }
  await Promise.all(milkRecords);
  console.log('✅ Milk records created:', milkRecords.length);

  // Create Expenses
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        farmId: farm.id,
        category: 'FEED',
        description: 'Premium cattle feed - 500kg',
        amount: 15000,
        date: new Date('2024-12-01'),
        paymentMethod: 'BANK_TRANSFER',
        receiptNumber: 'INV-2024-001',
        vendor: 'Amul Feed Suppliers',
        createdById: adminUser.id,
      },
    }),
    prisma.expense.create({
      data: {
        farmId: farm.id,
        category: 'VETERINARY',
        description: 'Routine vaccination for all animals',
        amount: 8500,
        date: new Date('2024-11-28'),
        paymentMethod: 'CASH',
        vendor: 'Dr. Sharma Veterinary Clinic',
        notes: 'Includes FMD and HS vaccines',
        createdById: managerUser.id,
      },
    }),
    prisma.expense.create({
      data: {
        farmId: farm.id,
        category: 'EQUIPMENT',
        description: 'Milking machine maintenance',
        amount: 5200,
        date: new Date('2024-11-25'),
        paymentMethod: 'UPI',
        receiptNumber: 'SER-2024-045',
        vendor: 'DeLaval Service Center',
        createdById: adminUser.id,
      },
    }),
    prisma.expense.create({
      data: {
        farmId: farm.id,
        category: 'UTILITIES',
        description: 'Electricity bill - November',
        amount: 12300,
        date: new Date('2024-11-20'),
        paymentMethod: 'BANK_TRANSFER',
        receiptNumber: 'ELEC-NOV-2024',
        vendor: 'Punjab State Power Corporation',
        createdById: managerUser.id,
      },
    }),
    prisma.expense.create({
      data: {
        farmId: farm.id,
        category: 'MEDICINE',
        description: 'Deworming tablets and antibiotics',
        amount: 3400,
        date: new Date('2024-11-18'),
        paymentMethod: 'CASH',
        vendor: 'Veterinary Pharmacy',
        notes: 'Emergency purchase',
        createdById: workerUser.id,
      },
    }),
    prisma.expense.create({
      data: {
        farmId: farm.id,
        category: 'MAINTENANCE',
        description: 'Barn roof repair',
        amount: 18500,
        date: new Date('2024-11-15'),
        paymentMethod: 'CHEQUE',
        vendor: 'Singh Construction',
        receiptNumber: 'WORK-2024-112',
        createdById: adminUser.id,
      },
    }),
  ]);
  console.log('✅ Expenses created:', expenses.length);

  // Create Workers
  const workers = await Promise.all([
    prisma.worker.create({
      data: {
        farmId: farm.id,
        name: 'Shyam Singh',
        contactNumber: '+91-98765-11111',
        email: 'shyam@greenvaleyfarm.com',
        role: 'MILKER',
        shift: 'MORNING',
        salary: 18000,
        joinDate: new Date('2022-01-10'),
        status: 'ACTIVE',
        address: 'Village Rampura, Punjab',
        notes: 'Experienced milker, 10+ years experience',
      },
    }),
    prisma.worker.create({
      data: {
        farmId: farm.id,
        name: 'Mohan Lal',
        contactNumber: '+91-98765-22222',
        email: 'mohan@greenvaleyfarm.com',
        role: 'FEEDER',
        shift: 'DAY',
        salary: 16000,
        joinDate: new Date('2021-06-15'),
        status: 'ACTIVE',
        address: 'Village Sultanpur, Punjab',
      },
    }),
    prisma.worker.create({
      data: {
        farmId: farm.id,
        name: 'Ravi Sharma',
        contactNumber: '+91-98765-33333',
        role: 'CLEANER',
        shift: 'EVENING',
        salary: 14000,
        joinDate: new Date('2023-03-20'),
        status: 'ACTIVE',
        address: 'Jalandhar City, Punjab',
      },
    }),
    prisma.worker.create({
      data: {
        farmId: farm.id,
        name: 'Sita Devi',
        contactNumber: '+91-98765-44444',
        email: 'sita@greenvaleyfarm.com',
        role: 'SUPERVISOR',
        shift: 'FULL_TIME',
        salary: 25000,
        joinDate: new Date('2020-08-01'),
        status: 'ACTIVE',
        address: 'Ludhiana, Punjab',
        notes: 'Manages daily operations, very reliable',
      },
    }),
  ]);
  console.log('✅ Workers created:', workers.length);

  // Create Tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        farmId: farm.id,
        title: 'Morning milking routine',
        description: 'Milk all lactating cows - target: complete by 8 AM',
        assignedToId: workerUser.id,
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        priority: 'HIGH',
        status: 'PENDING',
        notes: 'Ensure milk collection equipment is sterilized',
        createdById: managerUser.id,
      },
    }),
    prisma.task.create({
      data: {
        farmId: farm.id,
        title: 'Feed distribution',
        description: 'Distribute morning feed to all animals',
        assignedToId: workerUser.id,
        dueDate: new Date(Date.now() + 86400000),
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdById: managerUser.id,
      },
    }),
    prisma.task.create({
      data: {
        farmId: farm.id,
        title: 'Barn cleaning',
        description: 'Deep clean all animal sheds',
        dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
        priority: 'MEDIUM',
        status: 'PENDING',
        createdById: managerUser.id,
      },
    }),
    prisma.task.create({
      data: {
        farmId: farm.id,
        title: 'Veterinary checkup for A002',
        description: 'Pregnancy checkup for Yamuna (A002)',
        dueDate: new Date(Date.now() + 259200000), // 3 days
        priority: 'HIGH',
        status: 'PENDING',
        notes: 'Scheduled with Dr. Sharma at 2 PM',
        createdById: adminUser.id,
      },
    }),
    prisma.task.create({
      data: {
        farmId: farm.id,
        title: 'Equipment maintenance check',
        description: 'Monthly maintenance of milking machines',
        dueDate: new Date(Date.now() + 604800000), // 1 week
        priority: 'MEDIUM',
        status: 'PENDING',
        createdById: adminUser.id,
      },
    }),
  ]);
  console.log('✅ Tasks created:', tasks.length);

  // Create Feeding Logs
  const feedingLogs = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    for (const animal of animals) {
      // Morning feeding
      const isCalf = animal.category === 'CALF';
      const isBull = animal.category === 'BULL';
      feedingLogs.push(
        prisma.feedingLog.create({
          data: {
            farmId: farm.id,
            animalId: animal.id,
            date: new Date(date.setHours(7, 0, 0, 0)),
            feedingTime: 'MORNING',
            feedType: isCalf ? 'CONCENTRATE' : 'HAY',
            quantity: isBull ? 30 : isCalf ? 8 : 20,
            cost: isBull ? 450 : isCalf ? 120 : 300,
            recordedById: workerUser.id,
            notes: i === 0 ? 'Fresh quality feed' : null,
          },
        })
      );
      
      // Evening feeding
      feedingLogs.push(
        prisma.feedingLog.create({
          data: {
            farmId: farm.id,
            animalId: animal.id,
            date: new Date(date.setHours(17, 0, 0, 0)),
            feedingTime: 'EVENING',
            feedType: 'CONCENTRATE',
            quantity: isBull ? 15 : isCalf ? 6 : 12,
            cost: isBull ? 300 : isCalf ? 100 : 240,
            recordedById: workerUser.id,
          },
        })
      );
    }
  }
  await Promise.all(feedingLogs);
  console.log('✅ Feeding logs created:', feedingLogs.length);

  // Create Delivery Logs
  const deliveries = await Promise.all([
    prisma.deliveryLog.create({
      data: {
        farmId: farm.id,
        deliveryDate: new Date('2024-12-05'),
        buyerName: 'Amul Dairy Cooperative',
        buyerPhone: '+91-99999-11111',
        quantity: 450,
        pricePerLiter: 42,
        totalAmount: 18900,
        deliveryStatus: 'DELIVERED',
        paymentStatus: 'PAID',
        address: 'Amul Collection Center, Ludhiana',
        createdById: managerUser.id,
      },
    }),
    prisma.deliveryLog.create({
      data: {
        farmId: farm.id,
        deliveryDate: new Date('2024-12-04'),
        buyerName: 'Mother Dairy',
        buyerPhone: '+91-99999-22222',
        quantity: 380,
        pricePerLiter: 40,
        totalAmount: 15200,
        deliveryStatus: 'DELIVERED',
        paymentStatus: 'PAID',
        address: 'Mother Dairy Chilling Center',
        createdById: managerUser.id,
      },
    }),
    prisma.deliveryLog.create({
      data: {
        farmId: farm.id,
        deliveryDate: new Date('2024-12-03'),
        buyerName: 'Local Market - Sharma Sweets',
        buyerPhone: '+91-99999-33333',
        quantity: 120,
        pricePerLiter: 55,
        totalAmount: 6600,
        deliveryStatus: 'DELIVERED',
        paymentStatus: 'PENDING',
        address: 'Sharma Sweets, Main Market, Jalandhar',
        notes: 'Premium quality milk for sweets production',
        createdById: workerUser.id,
      },
    }),
    prisma.deliveryLog.create({
      data: {
        farmId: farm.id,
        deliveryDate: new Date('2024-12-02'),
        buyerName: 'Verka Milk Plant',
        buyerPhone: '+91-99999-44444',
        quantity: 500,
        pricePerLiter: 41,
        totalAmount: 20500,
        deliveryStatus: 'DELIVERED',
        paymentStatus: 'PAID',
        address: 'Verka Plant, Mohali',
        createdById: managerUser.id,
      },
    }),
    prisma.deliveryLog.create({
      data: {
        farmId: farm.id,
        deliveryDate: new Date(Date.now() + 86400000), // Tomorrow
        buyerName: 'Amul Dairy Cooperative',
        buyerPhone: '+91-99999-11111',
        quantity: 400,
        pricePerLiter: 42,
        totalAmount: 16800,
        deliveryStatus: 'PENDING',
        paymentStatus: 'PENDING',
        address: 'Amul Collection Center, Ludhiana',
        notes: 'Scheduled delivery',
        createdById: managerUser.id,
      },
    }),
  ]);
  console.log('✅ Delivery logs created:', deliveries.length);

  // Create Vet Visits
  const vetVisits = await Promise.all([
    prisma.vetVisit.create({
      data: {
        animalId: animals[0].id, // Ganga
        visitDate: new Date('2024-11-20'),
        visitType: 'ROUTINE',
        visitReason: 'Annual health checkup',
        treatmentType: 'CHECKUP',
        diagnosis: 'Excellent health condition',
        treatment: 'No treatment required',
        prescription: 'Continue regular diet',
        veterinarian: 'Dr. Sharma',
        cost: 1500,
        visitStatus: 'COMPLETED',
        nextVisitDate: new Date('2025-05-20'),
        notes: 'Animal in perfect health, milk production stable',
      },
    }),
    prisma.vetVisit.create({
      data: {
        animalId: animals[1].id, // Yamuna
        visitDate: new Date('2024-11-15'),
        visitType: 'CHECKUP',
        visitReason: 'Pregnancy confirmation',
        treatmentType: 'CHECKUP',
        diagnosis: 'Pregnant - 6 months',
        treatment: 'Prenatal vitamins prescribed',
        prescription: 'Calcium supplements, Vitamin A & D',
        veterinarian: 'Dr. Kumar',
        cost: 2500,
        visitStatus: 'COMPLETED',
        nextVisitDate: new Date('2025-01-15'),
        notes: 'Expected delivery in February 2025. Monitor diet closely',
      },
    }),
    prisma.vetVisit.create({
      data: {
        animalId: animals[2].id, // Saraswati
        visitDate: new Date('2024-10-25'),
        visitType: 'VACCINATION',
        visitReason: 'FMD vaccination',
        treatmentType: 'VACCINATION',
        diagnosis: 'Healthy',
        treatment: 'FMD vaccine administered',
        veterinarian: 'Dr. Sharma',
        cost: 800,
        visitStatus: 'COMPLETED',
        nextVisitDate: new Date('2025-04-25'),
      },
    }),
    prisma.vetVisit.create({
      data: {
        animalId: animals[3].id, // Lakshmi
        visitDate: new Date('2024-11-28'),
        visitType: 'ROUTINE',
        visitReason: 'Slight fever observed',
        treatmentType: 'MEDICATION',
        diagnosis: 'Minor viral infection',
        treatment: 'Antibiotics course - 5 days',
        prescription: 'Amoxicillin 500mg twice daily, plenty of water',
        veterinarian: 'Dr. Sharma',
        cost: 1800,
        visitStatus: 'COMPLETED',
        nextVisitDate: new Date('2024-12-08'),
        notes: 'Follow-up required to ensure full recovery',
      },
    }),
    prisma.vetVisit.create({
      data: {
        animalId: animals[1].id, // Yamuna - upcoming visit
        visitDate: new Date(Date.now() + 432000000), // 5 days from now
        visitType: 'FOLLOWUP',
        visitReason: 'Pregnancy checkup',
        visitStatus: 'SCHEDULED',
        veterinarian: 'Dr. Kumar',
        cost: 2000,
        notes: 'Scheduled prenatal checkup',
      },
    }),
    prisma.vetVisit.create({
      data: {
        animalId: animals[0].id, // Ganga - upcoming vaccination
        visitDate: new Date(Date.now() + 604800000), // 1 week from now
        visitType: 'VACCINATION',
        visitReason: 'Booster vaccination',
        treatmentType: 'VACCINATION',
        visitStatus: 'SCHEDULED',
        veterinarian: 'Dr. Sharma',
        cost: 900,
      },
    }),
  ]);
  console.log('✅ Vet visits created:', vetVisits.length);

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`  - Farms: 1`);
  console.log(`  - Users: 3 (Admin, Manager, Worker)`);
  console.log(`  - Animals: ${animals.length}`);
  console.log(`  - Milk Records: ${milkRecords.length}`);
  console.log(`  - Expenses: ${expenses.length}`);
  console.log(`  - Workers: ${workers.length}`);
  console.log(`  - Tasks: ${tasks.length}`);
  console.log(`  - Feeding Logs: ${feedingLogs.length}`);
  console.log(`  - Deliveries: ${deliveries.length}`);
  console.log(`  - Vet Visits: ${vetVisits.length}`);
  console.log('');
  console.log('🔐 Login Credentials:');
  console.log('  Admin:   admin@greenvaleyfarm.com / password123');
  console.log('  Manager: manager@greenvaleyfarm.com / password123');
  console.log('  Worker:  worker@greenvaleyfarm.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
