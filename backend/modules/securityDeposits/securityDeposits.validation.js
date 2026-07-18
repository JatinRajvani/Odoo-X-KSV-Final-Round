import { z } from 'zod';

export const createDepositSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().uuid('Invalid rental order ID'),
    amountCollected: z.number().nonnegative('Amount must be >= 0'),
    reason: z.string().optional()
  })
});

export const updateDepositSchema = z.object({
  body: z.object({
    amountCollected: z.number().nonnegative().optional(),
    reason: z.string().optional()
  })
});

export const refundDepositSchema = z.object({
  body: z.object({
    amountToRefund: z.number().positive('Refund amount must be > 0'),
    damageCost: z.number().nonnegative('Damage cost must be >= 0').optional(),
    reason: z.string().optional()
  })
});
