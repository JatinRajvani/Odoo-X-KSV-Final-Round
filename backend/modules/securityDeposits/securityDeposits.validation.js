import { z } from 'zod';

export const createDepositSchema = z.object({
  body: z.object({
    orderId: z.string().uuid('Invalid order ID'),
    depositAmount: z.number().nonnegative('Amount must be >= 0'),
  })
});

export const updateDepositSchema = z.object({
  body: z.object({
    depositAmount: z.number().nonnegative().optional(),
    remarks: z.string().optional().nullable()
  })
});

export const refundDepositSchema = z.object({
  body: z.object({
    penaltyAmount: z.number().nonnegative().optional(),
    penaltyReason: z.string().optional().nullable(),
    refundMethod: z.enum(['Cash', 'UPI', 'Bank_Transfer']),
    remarks: z.string().optional().nullable()
  })
});
