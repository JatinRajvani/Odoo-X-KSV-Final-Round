import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Admin User
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@driveease.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@driveease.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Organization Settings
  const settings = await prisma.organizationSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: 'DriveEase Rentals',
      companyEmail: 'support@driveease.com',
      companyPhone: '+91 9876543210',
      companyAddress: 'Ahmedabad, Gujarat, India',
      gstNumber: '24ABCDE1234F1Z5',
      currency: 'INR',
      taxPercentage: 18,
      graceHours: 2,
      lateFeePerHour: 200,
      lateFeePerDay: 1000,
      maximumLateFee: 5000,
      invoicePrefix: 'INV-',
      quotationHeader: 'DriveEase Rentals',
      quotationFooter: 'Thank you for choosing DriveEase Rentals.',
    },
  });
  console.log('Organization Settings seeded');

  // 3. Categories
  const categoriesData = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Electric', 'Convertible'];
  const categories = {};
  for (const name of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = cat.id;
  }
  console.log('Categories seeded');

  // 4. Rental Periods
  const periodsData = [
    { name: '1 Day', days: 1 },
    { name: '2 Days', days: 2 },
    { name: '3 Days', days: 3 },
    { name: '1 Week', days: 7 },
    { name: '1 Month', days: 30 },
  ];
  for (const period of periodsData) {
    let p = await prisma.rentalPeriod.findFirst({ where: { name: period.name } });
    if (!p) {
      p = await prisma.rentalPeriod.create({ data: period });
    }
  }
  console.log('Rental Periods seeded');

  // 5. Vehicles
  const vehiclesData = [
    { brand: 'Toyota', model: 'Fortuner', cat: 'SUV', reg: 'GJ01AB1234', vin: 'VIN1234567890SUV1', year: 2023, fuel: 'Diesel', trans: 'Automatic', seats: 7, mileage: 12, price: 3000, dep: 10000, color: 'White' },
    { brand: 'Hyundai', model: 'Creta', cat: 'SUV', reg: 'GJ01CD5678', vin: 'VIN1234567890SUV2', year: 2022, fuel: 'Petrol', trans: 'Manual', seats: 5, mileage: 14, price: 2000, dep: 5000, color: 'Black' },
    { brand: 'Honda', model: 'City', cat: 'Sedan', reg: 'GJ01EF9012', vin: 'VIN1234567890SED1', year: 2023, fuel: 'Petrol', trans: 'Automatic', seats: 5, mileage: 16, price: 1800, dep: 5000, color: 'Silver' },
    { brand: 'Maruti', model: 'Baleno', cat: 'Hatchback', reg: 'GJ01GH3456', vin: 'VIN1234567890HAT1', year: 2021, fuel: 'Petrol', trans: 'Manual', seats: 5, mileage: 18, price: 1200, dep: 3000, color: 'Blue' },
    { brand: 'BMW', model: 'X5', cat: 'Luxury', reg: 'GJ01IJ7890', vin: 'VIN1234567890LUX1', year: 2023, fuel: 'Petrol', trans: 'Automatic', seats: 5, mileage: 10, price: 8000, dep: 20000, color: 'Black' },
    { brand: 'Mercedes', model: 'C-Class', cat: 'Luxury', reg: 'GJ01KL1234', vin: 'VIN1234567890LUX2', year: 2022, fuel: 'Diesel', trans: 'Automatic', seats: 5, mileage: 12, price: 7500, dep: 15000, color: 'White' },
    { brand: 'Tata', model: 'Nexon EV', cat: 'Electric', reg: 'GJ01MN5678', vin: 'VIN1234567890ELE1', year: 2023, fuel: 'Electric', trans: 'Automatic', seats: 5, mileage: 300, price: 2500, dep: 8000, color: 'Teal' },
    { brand: 'Mahindra', model: 'Scorpio N', cat: 'SUV', reg: 'GJ01OP9012', vin: 'VIN1234567890SUV3', year: 2023, fuel: 'Diesel', trans: 'Manual', seats: 7, mileage: 11, price: 2500, dep: 8000, color: 'Green' },
  ];

  for (const v of vehiclesData) {
    await prisma.vehicle.upsert({
      where: { registrationNumber: v.reg },
      update: {},
      create: {
        categoryId: categories[v.cat],
        brand: v.brand,
        model: v.model,
        registrationNumber: v.reg,
        vin: v.vin,
        year: v.year,
        fuelType: v.fuel,
        transmission: v.trans,
        seatCapacity: v.seats,
        mileage: v.mileage,
        basePrice: v.price,
        securityDeposit: v.dep,
        color: v.color,
        availabilityStatus: 'AVAILABLE',
      }
    });
  }
  console.log('Vehicles seeded');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
