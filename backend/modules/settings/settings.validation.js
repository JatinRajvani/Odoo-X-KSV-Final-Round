import { z } from 'zod';
export const updateSettingsSchema = z.object({
  body: z.object({
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    companyEmail: z.string().email().optional(),
    companyPhone: z.string().optional(),
    gstNumber: z.string().optional(),
    currency: z.string().optional(),
    taxPercentage: z.number().min(0).max(100).optional(),
    depositRule: z.string().optional(),
    graceHours: z.number().min(0).optional(),
    lateFeePerHour: z.number().min(0).optional(),
    lateFeePerDay: z.number().min(0).optional(),
    maximumLateFee: z.number().min(0).optional(),
    quotationHeader: z.string().optional(),
    quotationFooter: z.string().optional(),
    invoicePrefix: z.string().optional()
  })
});
