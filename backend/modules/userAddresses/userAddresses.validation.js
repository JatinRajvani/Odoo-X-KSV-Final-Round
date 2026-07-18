import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    addressType: z.enum(['Home', 'Office', 'Other']),
    addressLine: z.string().min(1, 'Address line is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(1, 'Pincode is required'),
    country: z.string().min(1, 'Country is required'),
    isDefault: z.boolean().optional(),
  })
});

export const updateAddressSchema = z.object({
  body: z.object({
    addressType: z.enum(['Home', 'Office', 'Other']).optional(),
    addressLine: z.string().min(1, 'Address line is required').optional(),
    city: z.string().min(1, 'City is required').optional(),
    state: z.string().min(1, 'State is required').optional(),
    pincode: z.string().min(1, 'Pincode is required').optional(),
    country: z.string().min(1, 'Country is required').optional(),
    isDefault: z.boolean().optional(),
  })
});
