import { z } from 'zod';

export const createVehicleSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    variant: z.string().optional(),
    registrationNumber: z.string().min(1, 'Registration Number is required'),
    vin: z.string().min(1, 'VIN is required'),
    year: z.number().int().min(1900),
    fuelType: z.string().min(1),
    transmission: z.string().min(1),
    color: z.string().min(1),
    seatCapacity: z.number().int().positive(),
    mileage: z.number().nonnegative(),
    description: z.string().optional(),
    basePrice: z.number().positive(),
    securityDeposit: z.number().nonnegative(),
    availabilityStatus: z.enum(['AVAILABLE', 'BOOKED', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE']).optional()
  })
});

export const updateVehicleSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    variant: z.string().optional(),
    registrationNumber: z.string().optional(),
    vin: z.string().optional(),
    year: z.number().int().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    color: z.string().optional(),
    seatCapacity: z.number().int().positive().optional(),
    mileage: z.number().nonnegative().optional(),
    description: z.string().optional(),
    basePrice: z.number().positive().optional(),
    securityDeposit: z.number().nonnegative().optional(),
    availabilityStatus: z.enum(['AVAILABLE', 'BOOKED', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
    currentStatus: z.string().optional()
  })
});
