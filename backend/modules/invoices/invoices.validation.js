import { z } from 'zod';

export const updateInvoiceStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Paid', 'Pending', 'Cancelled'])
  })
});
