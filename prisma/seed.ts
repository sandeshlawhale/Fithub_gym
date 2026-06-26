import { PrismaClient, MemberType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Settings
  const settingsCount = await prisma.settings.count();
  if (settingsCount === 0) {
    await prisma.settings.create({
      data: {
        gymName: 'The FitHub Gym',
        registrationFee: 200.00,
        whatsappEnabled: false,
        timezone: 'Asia/Kolkata',
      },
    });
    console.log('Default settings seeded.');
  } else {
    console.log('Settings already exist, skipping.');
  }

  // 2. Seed Default Admin
  const adminEmail = 'admin@thefithub.com';
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await prisma.admin.create({
      data: {
        name: 'FitHub Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('Default admin seeded (admin@thefithub.com / Admin@123).');
  } else {
    console.log('Admin already exists, skipping.');
  }

  // 3. Seed Default Plans
  const plansCount = await prisma.membershipPlan.count();
  if (plansCount === 0) {
    const defaultPlans = [
      { name: 'Monthly Single (Weight)', memberType: MemberType.SINGLE, durationMonths: 1, price: 599.00, description: 'Single member 1-month plan' },
      { name: 'Monthly Single (Weight + Cardio)', memberType: MemberType.SINGLE, durationMonths: 1, price: 999.00, description: 'Single member 1-month plan' },
      { name: 'Quarterly Single (Weight)', memberType: MemberType.SINGLE, durationMonths: 3, price: 1599.00, description: 'Single member 3-month plan' },
      { name: 'Quarterly Single (Weight + Cardio)', memberType: MemberType.SINGLE, durationMonths: 3, price: 2799.00, description: 'Single member 3-month plan' },
      { name: 'Half Yearly Single (Weight)', memberType: MemberType.SINGLE, durationMonths: 6, price: 3299.00, description: 'Single member 6-month plan' },
      { name: 'Half Yearly Single (Weight + Cardio)', memberType: MemberType.SINGLE, durationMonths: 6, price: 5699.00, description: 'Single member 6-month plan' },
      { name: 'Yearly Single (Weight)', memberType: MemberType.SINGLE, durationMonths: 12, price: 6799.00, description: 'Single member 1-year plan' },
      { name: 'Yearly Single (Weight + Cardio)', memberType: MemberType.SINGLE, durationMonths: 12, price: 11599.00, description: 'Single member 1-year plan' },
      { name: 'Monthly Couple (weight)', memberType: MemberType.COUPLE, durationMonths: 1, price: 1099.00, description: 'Couple 1-month plan' },
      { name: 'Monthly Couple (Weight + Cardio)', memberType: MemberType.COUPLE, durationMonths: 1, price: 1799.00, description: 'Couple 1-month plan' },
    ];

    for (const plan of defaultPlans) {
      await prisma.membershipPlan.create({ data: plan });
    }
    console.log('Default membership plans seeded.');
  } else {
    console.log('Membership plans already exist, skipping.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
