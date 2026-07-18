import { z } from 'zod';

export const createPenaltySchema = z.object({
  body: z.object({
    rentalOrderId: z.string().uuid('Invalid rental order ID'),
    type: z.enum(['LATE_RETURN', 'DAMAGE', 'CLEANING', 'TRAFFIC_FINE', 'OTHER']),
    reason: z.string().min(1, 'Reason description is required'),
    amount: z.number().positive('Amount must be > 0'),
    status: z.enum(['UNPAID', 'PAID']).optional()
  })
});

export const updatePenaltySchema = z.object({
  body: z.object({
    type: z.enum(['LATE_RETURN', 'DAMAGE', 'CLEANING', 'TRAFFIC_FINE', 'OTHER']).optional(),
    reason: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    status: z.enum(['UNPAID', 'PAID']).optional()
  })
});

export const calculatePenaltiesSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().uuid()
  })
});
