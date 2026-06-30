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

  // 4. Seed Default Testimonials
  const testimonialsCount = await prisma.testimonial.count();
  if (testimonialsCount === 0) {
    const defaultTestimonials = [
      {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        rating: 5,
        review: "The FitHub Gym has completely transformed my fitness routine. The equipment is top-notch, and the trainers are incredibly knowledgeable and supportive. Highly recommended!",
        consent: true,
        isApproved: true,
      },
      {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        rating: 5,
        review: "Absolutely love the vibe here! Extremely clean, modern setup, and a very comfortable environment for women. The weight training section is spacious and well-equipped.",
        consent: true,
        isApproved: true,
      },
      {
        name: "Amit Verma",
        email: "amit.verma@example.com",
        rating: 4,
        review: "Excellent facilities and helpful staff. The membership plans are very reasonable for the quality of equipment they offer. Great location too!",
        consent: true,
        isApproved: true,
      },
      {
        name: "Sneha Reddy",
        email: "sneha.reddy@example.com",
        rating: 5,
        review: "I've been training here for 3 months now. The trainers helped me structure my program perfectly. I've already seen amazing results. Best gym in Narkhed!",
        consent: true,
        isApproved: true,
      },
      {
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        rating: 5,
        review: "A premium gym that actually delivers on its promises. Solid equipment, professional trainers, and an awesome community. The black and gold aesthetic is fire!",
        consent: true,
        isApproved: true,
      },
      {
        name: "Neha Gupta",
        email: "neha.gupta@example.com",
        rating: 4,
        review: "Great experience so far! The cardio machines are brand new, and the staff is very friendly. Submitting this review to support my favorite training spot.",
        consent: true,
        isApproved: false,
      },
      {
        name: "Rohan Das",
        email: "rohan.das@example.com",
        rating: 5,
        review: "Best training facility in town! The equipment range is unmatched. Highly recommended to anyone serious about their workouts.",
        consent: true,
        isApproved: false,
      }
    ];

    for (const t of defaultTestimonials) {
      await prisma.testimonial.create({ data: t });
    }
    console.log("Default testimonials seeded.");
  } else {
    console.log("Testimonials already exist, skipping.");
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
