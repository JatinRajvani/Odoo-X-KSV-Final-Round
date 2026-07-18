import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().uuid('Invalid rental order ID'),
    amount: z.number().positive('Amount must be greater than 0'),
    paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'NET_BANKING']),
    transactionId: z.string().optional(),
    paymentGateway: z.string().optional()
  })
});

export const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'])
  })
});
