import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid('Invalid order ID'),
    rentalAmount: z.number().positive(),
    paymentMethod: z.enum(['Cash', 'Card', 'UPI', 'Net_Banking']),
    transactionId: z.string().optional().nullable(),
  })
});

export const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Paid', 'Failed', 'Refunded'])
  })
});

export const paySchema = z.object({
  body: z.object({
    paymentMethod: z.enum(['Cash', 'Card', 'UPI', 'Net_Banking']),
    transactionId: z.string().min(1, 'Transaction ID is required')
  })
});
