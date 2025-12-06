import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the first user without a farm
  const user = await prisma.user.findFirst({
    where: {
      farmId: null,
    },
  });

  if (!user) {
    console.log('No users found without a farm');
    return;
  }

  console.log(`Found user: ${user.name} (${user.email})`);

  // Create a farm for this user
  const farm = await prisma.farm.create({
    data: {
      name: `${user.name}'s Farm`,
      location: 'To be updated',
      ownerName: user.name,
      contactNumber: 'To be updated',
    },
  });

  console.log(`Created farm: ${farm.name}`);

  // Update the user with the farm
  await prisma.user.update({
    where: { id: user.id },
    data: { farmId: farm.id },
  });

  console.log(`✅ Successfully associated farm with user ${user.email}`);
  console.log(`Farm ID: ${farm.id}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
